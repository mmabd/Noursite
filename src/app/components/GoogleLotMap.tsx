import { useEffect, useRef, useState } from "react";
import { type Lot, type LotStatus } from "../data/lots";
import { type ProjectLotPlan } from "../data/projectLotPlans";
import { loadGoogleMaps } from "../lib/loadGoogleMaps";
import { useLanguage } from "../i18n";
import { useFonts } from "../lib/fonts";

interface GoogleLotMapProps {
  lots: Lot[];
  geoJson: ProjectLotPlan["geoJson"];
  mapLots: ProjectLotPlan["mapLots"];
  selectedLotId: string | null;
  hoveredLotId: string | null;
  onLotClick: (id: string) => void;
  onLotHover: (id: string | null) => void;
  projectName?: string;
  initialCenter: {
    lat: number;
    lng: number;
  };
  initialZoom: number;
}

const MAP_STATUS_COLOR: Record<LotStatus, string> = {
  available: "#ffffff",
  reserved: "#fbbf24",
  sold: "#7a1a1a",
};

const MAP_STATUS_STROKE: Record<LotStatus, string> = {
  available: "#2d2d2d",
  reserved: "#2d2d2d",
  sold: "#2d2d2d",
};

const MAP_PANEL = "#fffef9";
const MAP_INVERSE = "#f8faf3";
const MAP_INVERSE_MUTED = "rgba(248, 250, 243, 0.78)";
const MAP_BORDER = "#2d2d2d";
const MAP_INK = "#122019";
const MAP_INK_SOFT = "#2d473b";
const MAP_INK_MUTED = "#5f786d";

export function GoogleLotMap({
  lots,
  geoJson,
  mapLots,
  selectedLotId,
  hoveredLotId,
  onLotClick,
  onLotHover,
  projectName = "SITE PLAN",
  initialCenter,
  initialZoom,
}: GoogleLotMapProps) {
  const { copy, isArabic } = useLanguage();
  const { fontBody, fontMono } = useFonts();
  const containerRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<any>(null);
  const googleMapsRef = useRef<any>(null);
  const markerRef = useRef(new Map<string, any>());
  const selectedLotIdRef = useRef<string | null>(selectedLotId);
  const hoveredLotIdRef = useRef<string | null>(hoveredLotId);
  const onLotClickRef = useRef(onLotClick);
  const onLotHoverRef = useRef(onLotHover);
  const geoJsonRef = useRef(geoJson);
  const mapLotsRef = useRef(mapLots);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [mapReady, setMapReady] = useState(false);
  const [mapActive, setMapActive] = useState(false);

  // Keep refs up to date
  geoJsonRef.current = geoJson;
  mapLotsRef.current = mapLots;

  function updateMarkerStyles() {
    for (const lot of mapLotsRef.current) {
      const marker = markerRef.current.get(lot.lotId);
      if (!marker) {
        continue;
      }

      const statusColor = MAP_STATUS_COLOR[lot.status];
      const isSelected = lot.lotId === selectedLotIdRef.current;
      const isHovered = lot.lotId === hoveredLotIdRef.current;

      marker.setOptions({
        icon: {
          path: googleMapsRef.current.SymbolPath.CIRCLE,
          scale: isSelected ? 12 : isHovered ? 11 : 10,
          fillColor: MAP_PANEL,
          fillOpacity: 1,
          strokeColor: isSelected ? "#4a7c59" : MAP_BORDER,
          strokeOpacity: 1,
          strokeWeight: isSelected ? 2 : 1,
        },
        label: {
          text: String(lot.lotNumber).padStart(2, "0"),
          color: isSelected ? "#4a7c59" : MAP_INK,
          fontSize: isSelected ? "10px" : "8px",
          fontFamily: isArabic ? "Baloo Bhaijaan 2" : "Space Mono",
          fontWeight: isSelected ? "700" : "600",
        },
        zIndex: isSelected ? 400 : isHovered ? 300 : 200,
      });
    }
  }

  function updateFeatureStyles() {
    if (!mapRef.current) {
      return;
    }

    mapRef.current.data.setStyle((feature: any) => {
      const lotId = feature.getProperty("lotId");
      const status = feature.getProperty("status") as LotStatus;
      const fillColor = MAP_STATUS_COLOR[status] ?? MAP_STATUS_COLOR.available;
      const strokeColor = MAP_STATUS_STROKE[status] ?? MAP_STATUS_STROKE.available;
      const isSelected = lotId === selectedLotIdRef.current;
      const isHovered = lotId === hoveredLotIdRef.current;

      return {
        clickable: status !== "sold",
        fillColor: isSelected ? "#4a7c59" : fillColor,
        fillOpacity: isSelected ? 0.9 : isHovered ? 0.85 : 0.8,
        strokeColor: isSelected ? "#4a7c59" : isHovered ? strokeColor : strokeColor,
        strokeOpacity: isSelected ? 1 : isHovered ? 0.9 : 0.7,
        strokeWeight: isSelected ? 3 : isHovered ? 2.5 : 1.8,
        zIndex: isSelected ? 3 : isHovered ? 2 : 1,
      };
    });
  }

  useEffect(() => {
    selectedLotIdRef.current = selectedLotId;
    hoveredLotIdRef.current = hoveredLotId;
    onLotClickRef.current = onLotClick;
    onLotHoverRef.current = onLotHover;
    updateFeatureStyles();
    updateMarkerStyles();
  }, [hoveredLotId, onLotClick, onLotHover, selectedLotId]);

  useEffect(() => {
    let disposed = false;
    let listeners: any[] = [];

    async function initializeMap() {
      try {
        const googleMaps = await loadGoogleMaps();

        if (disposed || !containerRef.current) {
          return;
        }

        googleMapsRef.current = googleMaps;

        const map = new googleMaps.Map(containerRef.current, {
          center: initialCenter,
          zoom: initialZoom,
          mapTypeId: "satellite",
          disableDefaultUI: true,
          zoomControl: true,
          mapTypeControl: true,
          streetViewControl: false,
          fullscreenControl: false,
          clickableIcons: false,
          gestureHandling: "none",
          keyboardShortcuts: false,
        });

        mapRef.current = map;
        map.data.addGeoJson(geoJsonRef.current as any);

        const bounds = new googleMaps.LatLngBounds();

        map.data.forEach((feature: any) => {
          feature.getGeometry()?.forEachLatLng((latLng: any) => bounds.extend(latLng));
        });

        if (!bounds.isEmpty()) {
          map.fitBounds(bounds, 56);
          googleMaps.event.addListenerOnce(map, "idle", () => {
            const currentZoom = map.getZoom();
            if (typeof currentZoom === "number" && currentZoom < initialZoom) {
              map.setZoom(initialZoom);
            }
          });
        }

        for (const lot of mapLotsRef.current) {
          const marker = new googleMaps.Marker({
            map,
            position: lot.centroid,
            clickable: false,
            optimized: false,
          });

          markerRef.current.set(lot.lotId, marker);
        }

        updateFeatureStyles();
        updateMarkerStyles();

        listeners = [
          map.data.addListener("click", (event: any) => {
            const lotId = event.feature.getProperty("lotId");
            const status = event.feature.getProperty("status");
            if (status !== "sold" && typeof lotId === "string") {
              onLotClickRef.current(lotId);
            }
          }),
          map.data.addListener("mouseover", (event: any) => {
            const lotId = event.feature.getProperty("lotId");
            if (typeof lotId === "string") {
              onLotHoverRef.current(lotId);
            }
          }),
          map.data.addListener("mouseout", () => {
            onLotHoverRef.current(null);
          }),
          map.addListener("click", () => {
            onLotHoverRef.current(null);
          }),
        ];

        setMapReady(true);
      } catch (error) {
        if (!disposed) {
          setLoadError(error instanceof Error ? error.message : "Google Maps failed to initialize.");
        }
      }
    }

    initializeMap();

    return () => {
      disposed = true;
      listeners.forEach((listener) => listener?.remove?.());
      listeners = [];
      markerRef.current.forEach((marker) => marker.setMap(null));
      markerRef.current.clear();
      mapRef.current = null;
      googleMapsRef.current = null;
      setMapReady(false);
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialCenter.lat, initialCenter.lng, initialZoom]);

  // Toggle gesture handling when map is activated/deactivated
  useEffect(() => {
    if (!mapRef.current || !mapReady) return;
    mapRef.current.setOptions({
      gestureHandling: mapActive ? "greedy" : "none",
      zoomControl: mapActive,
    });
  }, [mapActive, mapReady]);

  // Update feature statuses in-place when lot data changes (no map rebuild)
  useEffect(() => {
    if (!mapRef.current || !mapReady) return;

    // Update GeoJSON feature properties with latest statuses
    mapRef.current.data.forEach((feature: any) => {
      const lotId = feature.getProperty("lotId");
      const updatedLot = mapLotsRef.current.find((l: any) => l.lotId === lotId);
      if (updatedLot) {
        feature.setProperty("status", updatedLot.status);
      }
    });

    updateFeatureStyles();
    updateMarkerStyles();
  }, [mapLots, mapReady]);

  return (
    <div style={{ width: "100%", height: "100%", position: "relative", background: "var(--land-card-alt)" }}>
      <div ref={containerRef} style={{ width: "100%", height: "100%" }} />

      {!mapReady && !loadError && (
        <div
          style={{
            position: "absolute",
            inset: 0,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            gap: 10,
            background: "linear-gradient(180deg, rgba(255,253,248,0.78) 0%, rgba(238,245,231,0.88) 100%)",
            color: "var(--land-ink-soft)",
            fontFamily: fontBody,
            letterSpacing: "0.04em",
          }}
        >
          <div style={{ fontSize: 12, fontFamily: fontMono, color: "var(--land-label)" }}>
            {copy.googleMap.loadingLabel}
          </div>
          <div style={{ fontSize: 16, fontWeight: 700 }}>{projectName}</div>
          <div style={{ fontSize: 13 }}>{copy.googleMap.loadingTitle}</div>
        </div>
      )}

      {loadError && (
        <div
          style={{
            position: "absolute",
            inset: 0,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            gap: 12,
            padding: 32,
            textAlign: "center",
            background: "linear-gradient(180deg, rgba(255,253,248,0.94) 0%, rgba(238,245,231,0.96) 100%)",
            color: MAP_INK_SOFT,
          }}
        >
          <div style={{ fontFamily: fontMono, fontSize: 10, letterSpacing: "0.22em", color: MAP_INK_MUTED }}>
            {copy.googleMap.unavailableLabel}
          </div>
          <div style={{ fontFamily: fontBody, fontSize: 16, fontWeight: 700 }}>
            {copy.googleMap.unavailableTitle}
          </div>
          <div style={{ fontFamily: fontBody, fontSize: 13, lineHeight: 1.6, maxWidth: 320 }}>
            {loadError}
          </div>
        </div>
      )}

      {/* Click-to-activate overlay */}
      {mapReady && !mapActive && (
        <div
          onClick={() => setMapActive(true)}
          style={{
            position: "absolute",
            inset: 0,
            cursor: "pointer",
            display: "flex",
            alignItems: "flex-end",
            justifyContent: "center",
            paddingBottom: 24,
            background: "transparent",
            zIndex: 5,
          }}
        >
          <div style={{
            background: "rgba(18, 32, 25, 0.75)",
            backdropFilter: "blur(6px)",
            color: "#fff",
            fontFamily: fontBody,
            fontSize: 12,
            fontWeight: 600,
            letterSpacing: "0.06em",
            padding: "10px 20px",
            borderRadius: 20,
            display: "flex",
            alignItems: "center",
            gap: 8,
            transition: "background 0.2s ease",
          }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M15 3h6v6M9 21H3v-6M21 3l-7 7M3 21l7-7" />
            </svg>
            {isArabic ? "اضغط لتفعيل الخريطة" : "Click to interact with map"}
          </div>
        </div>
      )}

      {/* Deactivate button */}
      {mapActive && (
        <button
          onClick={() => setMapActive(false)}
          style={{
            position: "absolute",
            top: 12,
            right: 12,
            zIndex: 5,
            background: "rgba(18, 32, 25, 0.75)",
            backdropFilter: "blur(6px)",
            color: "#fff",
            fontFamily: fontBody,
            fontSize: 11,
            fontWeight: 600,
            letterSpacing: "0.04em",
            padding: "8px 14px",
            borderRadius: 16,
            border: "none",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            gap: 6,
          }}
        >
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
          {isArabic ? "قفل الخريطة" : "Lock map"}
        </button>
      )}
    </div>
  );
}
