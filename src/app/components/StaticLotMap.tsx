import { type LotStatus } from "../data/lots";
import { type ProjectLotPlan } from "../data/projectLotPlans";

const API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;

interface StaticLotMapProps {
  geoJson: ProjectLotPlan["geoJson"];
  focusLotId: string;
  center: { lat: number; lng: number };
  zoom: number;
}

const STATUS_FILL: Record<LotStatus, string> = {
  available: "0x3a6b4a",
  reserved: "0xfbbf24",
  sold: "0x7a1a1a",
};

const STATUS_FILL_FOCUS: Record<LotStatus, string> = {
  available: "0x3a6b4aCC",
  reserved: "0xfbbf24CC",
  sold: "0x7a1a1aCC",
};

const STATUS_FILL_DIM: Record<LotStatus, string> = {
  available: "0xffffff00",
  reserved: "0xffffff00",
  sold: "0xffffff00",
};

function encodePolyline(coords: [number, number][]): string {
  // Google Static Maps uses encoded polyline format
  // coords are [lng, lat] from GeoJSON, need to pass as lat,lng
  let encoded = "";
  let prevLat = 0;
  let prevLng = 0;

  for (const [lng, lat] of coords) {
    const latE5 = Math.round(lat * 1e5);
    const lngE5 = Math.round(lng * 1e5);

    encoded += encodeSignedNumber(latE5 - prevLat);
    encoded += encodeSignedNumber(lngE5 - prevLng);

    prevLat = latE5;
    prevLng = lngE5;
  }

  return encoded;
}

function encodeSignedNumber(num: number): string {
  let sgn = num << 1;
  if (num < 0) sgn = ~sgn;
  return encodeUnsignedNumber(sgn);
}

function encodeUnsignedNumber(num: number): string {
  let encoded = "";
  while (num >= 0x20) {
    encoded += String.fromCharCode((0x20 | (num & 0x1f)) + 63);
    num >>= 5;
  }
  encoded += String.fromCharCode(num + 63);
  return encoded;
}

export function StaticLotMap({ geoJson, focusLotId, center, zoom }: StaticLotMapProps) {
  // Build path params — render non-focused lots first, focused lot last
  // so the selected lot's white stroke sits on top of neighboring black strokes
  const paths: string[] = [];
  let focusPath: string | null = null;

  for (const feature of geoJson.features) {
    const lotId = feature.properties.lotId;
    const status = feature.properties.status;
    const isFocus = lotId === focusLotId;
    const coords = feature.geometry.coordinates[0] ?? [];

    if (coords.length === 0) continue;

    const fillColor = isFocus ? STATUS_FILL_FOCUS[status] : STATUS_FILL_DIM[status];
    const strokeColor = isFocus ? "0xffffffEE" : "0x000000FF";
    const strokeWeight = isFocus ? 3 : 2;

    const encoded = encodePolyline(coords as [number, number][]);
    const pathStr = `path=fillcolor:${fillColor}|color:${strokeColor}|weight:${strokeWeight}|enc:${encoded}`;

    if (isFocus) {
      focusPath = pathStr;
    } else {
      paths.push(pathStr);
    }
  }
  // Append focused lot last so it renders on top
  if (focusPath) paths.push(focusPath);

  const url = `https://maps.googleapis.com/maps/api/staticmap?`
    + `center=${center.lat},${center.lng}`
    + `&zoom=${zoom}`
    + `&size=640x480`
    + `&scale=2`
    + `&maptype=satellite`
    + `&${paths.join("&")}`
    + `&key=${API_KEY}`;

  return (
    <img
      src={url}
      alt="Lot map"
      style={{
        width: "100%",
        height: "100%",
        objectFit: "cover",
        display: "block",
      }}
    />
  );
}
