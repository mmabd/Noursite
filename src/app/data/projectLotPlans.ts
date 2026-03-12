import { type Lot, type LotStatus } from "./lots";
import type { SheetLot } from "../lib/useLotData";
import projectOneLotsSource from "./project-one-lots.json";

type GeoJsonPosition = [number, number];

type RawGeoJsonFeature = {
  id?: string;
  type?: string;
  geometry?: {
    type?: string;
    coordinates?: GeoJsonPosition[][] | GeoJsonPosition[][][];
  };
  properties?: Record<string, unknown>;
};

type RawGeoJsonFeatureCollection = {
  type?: string;
  features?: RawGeoJsonFeature[];
};

type ProjectLotGeoJsonFeature = {
  id: string;
  type: "Feature";
  geometry: {
    type: "Polygon";
    coordinates: GeoJsonPosition[][];
  };
  properties: {
    lotId: string;
    lotNumber: number;
    label: string;
    status: LotStatus;
  };
};

export interface ProjectMapLot {
  lotId: string;
  lotNumber: number;
  label: string;
  status: LotStatus;
  centroid: {
    lat: number;
    lng: number;
  };
}

export interface ProjectLotPlan {
  lots: Lot[];
  geoJson: {
    type: "FeatureCollection";
    features: ProjectLotGeoJsonFeature[];
  };
  mapLots: ProjectMapLot[];
  initialCenter: {
    lat: number;
    lng: number;
  };
  initialZoom: number;
}

const DEFAULT_INITIAL_ZOOM = 23;

/**
 * Registry of GeoJSON sources per project number.
 * To add a new project: import its JSON and add an entry here.
 */
const projectGeoJsonSources: Record<number, RawGeoJsonFeatureCollection> = {
  1: projectOneLotsSource as RawGeoJsonFeatureCollection,
  // 2: projectTwoLotsSource as RawGeoJsonFeatureCollection,
  // 3: projectThreeLotsSource as RawGeoJsonFeatureCollection,
};

function isLotStatus(value: unknown): value is LotStatus {
  return value === "available" || value === "reserved" || value === "sold";
}

function toLotStatus(value: unknown, fallback: LotStatus): LotStatus {
  return isLotStatus(value) ? value : fallback;
}

function parseLotNumber(value: unknown, fallback: number) {
  const parsed = typeof value === "number" ? value : Number.parseInt(String(value ?? fallback), 10);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : fallback;
}

function parseLotSize(value: unknown, fallback: number) {
  if (typeof value === "number" && Number.isFinite(value)) {
    return value;
  }

  if (typeof value === "string") {
    const match = value.match(/[\d,.]+/);
    if (match) {
      const parsed = Number.parseFloat(match[0].replace(/,/g, ""));
      if (Number.isFinite(parsed)) {
        return parsed;
      }
    }
  }

  return fallback;
}

function parseDisplayPrice(value: unknown, fallback: string) {
  return typeof value === "string" && value.trim() ? value.trim() : fallback;
}

function labelForLotNumber(lotNumber: number) {
  return `LOT ${String(lotNumber).padStart(2, "0")}`;
}

function fallbackDescription(lotNumber: number, size: number) {
  return `Mapped serviced lot ${lotNumber} within the current release area, with approximately ${size.toLocaleString()} m² ready for enquiry.`;
}

function formatSheetPrice(raw: number): string {
  if (!raw || raw <= 0) return "Price on request";
  if (raw >= 1_000_000) return `JD ${(raw / 1_000_000).toFixed(2)}M`;
  if (raw >= 1_000) return `JD ${Math.round(raw / 1_000)}K`;
  return `JD ${raw}`;
}

function isPolygonFeature(feature: RawGeoJsonFeature): feature is RawGeoJsonFeature & {
  geometry: { type: "Polygon"; coordinates: GeoJsonPosition[][] };
} {
  return feature.geometry?.type === "Polygon" && Array.isArray(feature.geometry.coordinates);
}

function centroidForPolygon(coordinates: GeoJsonPosition[][]) {
  const ring = coordinates[0] ?? [];
  const points = ring.length > 1 ? ring.slice(0, -1) : ring;

  if (!points.length) {
    return { lat: 0, lng: 0 };
  }

  const totals = points.reduce(
    (acc, [lng, lat]) => {
      acc.lat += lat;
      acc.lng += lng;
      return acc;
    },
    { lat: 0, lng: 0 },
  );

  return {
    lat: totals.lat / points.length,
    lng: totals.lng / points.length,
  };
}

function centerForLots(mapLots: ProjectMapLot[]) {
  if (!mapLots.length) {
    return { lat: 0, lng: 0 };
  }

  const totals = mapLots.reduce(
    (acc, lot) => {
      acc.lat += lot.centroid.lat;
      acc.lng += lot.centroid.lng;
      return acc;
    },
    { lat: 0, lng: 0 },
  );

  return {
    lat: totals.lat / mapLots.length,
    lng: totals.lng / mapLots.length,
  };
}

function buildProjectPlan(
  rawGeoJson: RawGeoJsonFeatureCollection,
  projectNumber: number,
  sheetLotsByLotId?: Map<string, SheetLot>,
): ProjectLotPlan {
  const polygonFeatures = (rawGeoJson.features ?? []).filter(isPolygonFeature);

  const normalized = polygonFeatures
    .map((feature, index) => {
      const lotNumber = parseLotNumber(feature.properties?.lot_id, index + 1);
      const lotId = `project-${projectNumber}-lot-${lotNumber}`;
      const label = labelForLotNumber(lotNumber);

      // Sheet is the single source of truth for all lot data
      const sheetLot = sheetLotsByLotId?.get(String(lotNumber));

      const status = sheetLot
        ? toLotStatus(sheetLot.status, "available")
        : toLotStatus(feature.properties?.status, "available");
      const size = sheetLot?.size_m2 && sheetLot.size_m2 > 0
        ? sheetLot.size_m2
        : parseLotSize(feature.properties?.size, 0);
      const price = sheetLot?.price && sheetLot.price > 0
        ? formatSheetPrice(sheetLot.price)
        : "Price on request";
      const priceRaw = sheetLot?.price && sheetLot.price > 0
        ? sheetLot.price
        : 0;

      const sheetPhotos = sheetLot
        ? [sheetLot.photo_1, sheetLot.photo_2, sheetLot.photo_3].filter(
            (url): url is string => typeof url === "string" && url.trim().length > 0,
          )
        : [];
      const photos = sheetPhotos;

      const description = sheetLot?.description && sheetLot.description.trim()
        ? sheetLot.description.trim()
        : fallbackDescription(lotNumber, size);

      const sheetFeatured = sheetLot?.featured;
      const featured = sheetFeatured === true || sheetFeatured === "TRUE" || sheetFeatured === "true"
        ? true
        : false;

      const lot: Lot = {
        id: lotId,
        num: lotNumber,
        label,
        status,
        size,
        price,
        priceRaw,
        description,
        photos,
        featured,
        points: "",
        cx: 0,
        cy: 0,
      };

      const centroid = centroidForPolygon(feature.geometry.coordinates);

      const geoFeature: ProjectLotGeoJsonFeature = {
        id: lotId,
        type: "Feature",
        geometry: {
          type: "Polygon",
          coordinates: feature.geometry.coordinates,
        },
        properties: {
          lotId,
          lotNumber,
          label,
          status,
        },
      };

      const mapLot: ProjectMapLot = {
        lotId,
        lotNumber,
        label,
        status,
        centroid,
      };

      return { lot, geoFeature, mapLot };
    })
    .sort((a, b) => a.lot.num - b.lot.num);

  const mapLots = normalized.map(({ mapLot }) => mapLot);

  return {
    lots: normalized.map(({ lot }) => lot),
    geoJson: {
      type: "FeatureCollection",
      features: normalized.map(({ geoFeature }) => geoFeature),
    },
    mapLots,
    initialCenter: centerForLots(mapLots),
    initialZoom: DEFAULT_INITIAL_ZOOM,
  };
}

// Static fallback cache (built once per project, used when no sheet data)
const staticPlanCache = new Map<number, ProjectLotPlan>();

export function getProjectLotPlan(
  projectNumber: number,
  sheetLots?: SheetLot[],
): ProjectLotPlan | null {
  const rawGeoJson = projectGeoJsonSources[projectNumber];
  if (!rawGeoJson) return null;

  // If sheet data is available, rebuild with live overrides
  if (sheetLots && sheetLots.length > 0) {
    const byLotId = new Map(sheetLots.map((s) => [String(s.lot_id), s]));
    return buildProjectPlan(rawGeoJson, projectNumber, byLotId);
  }

  // Use cached static plan
  if (!staticPlanCache.has(projectNumber)) {
    staticPlanCache.set(projectNumber, buildProjectPlan(rawGeoJson, projectNumber));
  }
  return staticPlanCache.get(projectNumber)!;
}
