import { Lot, LotStatus } from "../data/lots";
import siteplanImage from "../../assets/704f038041874bec2c7db0944b0e0058114106ec.png";
import { useLanguage } from "../i18n";

interface LotMapProps {
  lots: Lot[];
  selectedLotId: string | null;
  hoveredLotId: string | null;
  onLotClick: (id: string) => void;
  onLotHover: (id: string | null) => void;
  projectName?: string;
}

const STATUS_COLOR: Record<LotStatus, string> = {
  available: "var(--land-status-available)",
  reserved:  "var(--land-status-reserved)",
  sold:      "var(--land-status-sold)",
};

export function LotMap({
  lots,
  selectedLotId,
  hoveredLotId,
  onLotClick,
  onLotHover,
  projectName = "SITE PLAN",
}: LotMapProps) {
  const { copy, isArabic } = useLanguage();
  const fontBody = isArabic ? "'Baloo Bhaijaan 2', 'Hacen Algeria', sans-serif" : "'Space Grotesk', sans-serif";
  const fontMono = isArabic ? "'Baloo Bhaijaan 2', 'Hacen Algeria', sans-serif" : "'Space Mono', monospace";

  return (
    <div style={{ width: "100%", height: "100%", position: "relative", overflow: "hidden", background: "var(--land-card-alt)" }}>
      {/* Aerial site plan image background */}
      <img 
        src={siteplanImage} 
        alt="Site plan" 
        style={{
          position: "absolute",
          inset: 0,
          width: "100%",
          height: "100%",
          objectFit: "cover",
          opacity: 0.85,
        }}
      />
      
      <svg
        viewBox="0 0 880 580"
        width="100%"
        height="100%"
        preserveAspectRatio="xMidYMid meet"
        style={{ display: "block", position: "relative", zIndex: 1 }}
      >
        <defs>
          {/* Diagonal sold hatch */}
          <pattern id="sold-hatch" width="6" height="6" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
            <line x1="0" y1="0" x2="0" y2="6" stroke="rgba(0,0,0,0.15)" strokeWidth="1.5" />
          </pattern>
        </defs>

        {/* ── Lot polygons ─────────────────────────────────── */}
        {lots.map(lot => {
          const isSelected = lot.id === selectedLotId;
          const isHovered  = lot.id === hoveredLotId;
          const isSold     = lot.status === "sold";
          const color      = STATUS_COLOR[lot.status];

          let fillOpacity = 0.25;
          if (isSelected)     fillOpacity = 0.7;
          else if (isHovered) fillOpacity = 0.45;

          return (
            <g
              key={lot.id}
              style={{ cursor: isSold ? "not-allowed" : "pointer" }}
              onClick={() => !isSold && onLotClick(lot.id)}
              onMouseEnter={() => onLotHover(lot.id)}
              onMouseLeave={() => onLotHover(null)}
            >
              {/* Fill */}
              <polygon
                points={lot.points}
                fill={color}
                fillOpacity={fillOpacity}
                stroke="none"
              />
              {/* Sold hatch */}
              {isSold && (
                <polygon
                  points={lot.points}
                  fill="url(#sold-hatch)"
                  fillOpacity={0.6}
                  stroke="none"
                />
              )}
              {/* Border — architectural line weight */}
              <polygon
                points={lot.points}
                fill="none"
                stroke={isSelected ? color : "var(--land-inverse-muted)"}
                strokeWidth={isSelected ? 2.2 : 1}
              />
              {/* Lot number with background */}
              <g>
                {/* White circle background for better readability */}
                <circle
                  cx={lot.cx}
                  cy={lot.cy - 5}
                  r={isSelected ? 12 : 10}
                  fill="var(--land-inverse)"
                  stroke={isSelected ? color : "var(--land-border)"}
                  strokeWidth={isSelected ? 1.5 : 0.8}
                />
                <text
                  x={lot.cx}
                  y={lot.cy - 5}
                  textAnchor="middle"
                  dominantBaseline="middle"
                  fontFamily={fontMono}
                  fontSize={isSelected ? "10" : "8"}
                  fontWeight={isSelected ? "700" : "600"}
                  fill={isSelected ? color : "var(--land-ink)"}
                  style={{ pointerEvents: "none", userSelect: "none" }}
                >
                  {String(lot.num).padStart(2, "0")}
                </text>
              </g>
              {/* Status dot */}
              <circle
                cx={lot.cx}
                cy={lot.cy + 10}
                r={isSelected ? 3.5 : 2.8}
                fill={color}
                fillOpacity={1}
                stroke="var(--land-inverse-muted)"
                strokeWidth={isSelected ? 1.2 : 0.8}
                style={{ pointerEvents: "none" }}
              />
            </g>
          );
        })}

        {/* ── Compass rose ─────────────────────────────────── */}
        <g transform="translate(840, 52)">
          <circle r="20" fill="var(--land-inverse)" stroke="var(--land-border)" strokeWidth="1" />
          <polygon points="0,-14 2.8,2 0,0 -2.8,2" fill="var(--land-ink)" />
          <polygon points="0,14 2.2,2 0,4 -2.2,2" fill="var(--land-ink-faint)" />
          <line x1="-14" y1="0" x2="-7" y2="0" stroke="var(--land-ink-faint)" strokeWidth="0.8" />
          <line x1="14"  y1="0" x2="7"  y2="0" stroke="var(--land-ink-faint)" strokeWidth="0.8" />
          <text y="-18" textAnchor="middle" fontFamily={fontMono} fontSize="7" fontWeight="bold" fill="var(--land-ink)">N</text>
        </g>

        {/* ── Scale bar ──────────────────────────────────────── */}
        <g transform="translate(36, 560)">
          <rect x="-8" y="-10" width="96" height="20" fill="var(--land-inverse)" stroke="var(--land-border)" strokeWidth="0.8" />
          <line x1="0" y1="0" x2="80" y2="0" stroke="var(--land-ink-muted)" strokeWidth="1.2" />
          <line x1="0"  y1="-3" x2="0"  y2="3" stroke="var(--land-ink-muted)" strokeWidth="1.2" />
          <line x1="40" y1="-2" x2="40" y2="2" stroke="var(--land-ink-faint)" strokeWidth="0.8" />
          <line x1="80" y1="-3" x2="80" y2="3" stroke="var(--land-ink-muted)" strokeWidth="1.2" />
          <text x="0"  y="-6" textAnchor="middle" fontFamily={fontMono} fontSize="6" fontWeight="600" fill="var(--land-ink-soft)">0</text>
          <text x="40" y="-6" textAnchor="middle" fontFamily={fontMono} fontSize="6" fontWeight="600" fill="var(--land-ink-soft)">25m</text>
          <text x="80" y="-6" textAnchor="middle" fontFamily={fontMono} fontSize="6" fontWeight="600" fill="var(--land-ink-soft)">50m</text>
        </g>

        {/* ── Legend — linear horizontal ──────────────────────── */}
        <g transform="translate(160, 560)">
          <rect x="-8" y="-10" width="280" height="20" fill="var(--land-inverse)" stroke="var(--land-border)" strokeWidth="0.8" />
          <text x="0" y="0" textAnchor="start" fontFamily={fontMono} fontSize="5.5" fontWeight="600" letterSpacing="1.5" fill="var(--land-ink-muted)">{copy.googleMap.lotStatus}:</text>
          
          {/* Available */}
          <rect x="50" y="-4" width="7" height="7" fill="var(--land-status-available)" opacity="1" stroke="var(--land-border)" strokeWidth="0.5" />
          <text x="61" y="0" textAnchor="start" fontFamily={fontBody} fontSize="7" fontWeight="600" fill="var(--land-ink-soft)">{copy.statuses.available} ({lots.filter(l => l.status === "available").length})</text>
          
          {/* Reserved */}
          <rect x="125" y="-4" width="7" height="7" fill="var(--land-status-reserved)" opacity="1" stroke="var(--land-border)" strokeWidth="0.5" />
          <text x="136" y="0" textAnchor="start" fontFamily={fontBody} fontSize="7" fontWeight="600" fill="var(--land-ink-soft)">{copy.statuses.reserved} ({lots.filter(l => l.status === "reserved").length})</text>
          
          {/* Sold */}
          <rect x="195" y="-4" width="7" height="7" fill="var(--land-status-sold)" opacity="1" stroke="var(--land-border)" strokeWidth="0.5" />
          <text x="206" y="0" textAnchor="start" fontFamily={fontBody} fontSize="7" fontWeight="600" fill="var(--land-ink-soft)">{copy.statuses.sold} ({lots.filter(l => l.status === "sold").length})</text>
        </g>

        {/* ── Title block (bottom right) ──────────────────── */}
        <rect x="660" y="547" width="192" height="26" fill="var(--land-inverse)" stroke="var(--land-border)" strokeWidth="0.8" />
        <line x1="660" y1="555" x2="852" y2="555" stroke="var(--land-border-soft)" strokeWidth="0.6" />
        <text x="756" y="553" textAnchor="middle" fontFamily={fontMono} fontSize="6" fontWeight="600" letterSpacing="2" fill="var(--land-ink-muted)">{copy.googleMap.sitePlan} — {copy.googleMap.draft}</text>
        <text x="756" y="567" textAnchor="middle" fontFamily={fontBody} fontSize="7.5" fontWeight="700" letterSpacing="2.5" fill="var(--land-ink-soft)">{projectName.toUpperCase()}</text>
      </svg>
    </div>
  );
}
