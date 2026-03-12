import { useState } from "react";
import { Lot, LotStatus } from "../data/lots";
import { Project } from "../data/projects";
import { useLanguage } from "../i18n";

interface LotPanelProps {
  project: Project;
  lots: Lot[];
  selectedLot: Lot | null;
  featuredLots: Lot[];
  onLotSelect: (id: string) => void;
  onDeselect: () => void;
  className?: string;
}

const STATUS_COLOR: Record<LotStatus, string> = {
  available: "var(--land-status-available)",
  reserved:  "var(--land-status-reserved)",
  sold:      "var(--land-status-sold)",
};

function getStatusLabel(status: LotStatus, copy: ReturnType<typeof useLanguage>["copy"]) {
  return copy.statuses[status];
}

function getLotLabel(lot: Lot, copy: ReturnType<typeof useLanguage>["copy"], isArabic: boolean) {
  return isArabic ? `${copy.lotPanel.lotPrefix} ${String(lot.num).padStart(2, "0")}` : lot.label;
}

/* ── Lot photo gallery ─────────────────────────────────────── */
function LotGallery({ photos }: { photos: string[] }) {
  const { copy, isArabic } = useLanguage();
  const fontMono = isArabic ? "'Baloo Bhaijaan 2', 'Hacen Algeria', sans-serif" : "'Space Mono', monospace";
  const [idx, setIdx] = useState(0);
  if (!photos.length) return null;

  return (
    <div style={{ marginBottom: 32 }}>
      <div className="land-label" style={{ marginBottom: 16 }}>
        {copy.lotPanel.sitePhotos}
      </div>
      <div style={{ position: "relative", overflow: "hidden", background: "var(--land-card-alt)" }}>
        <img
          src={photos[idx]}
          alt="Lot"
          style={{ width: "100%", aspectRatio: "4/3", objectFit: "cover", display: "block" }}
        />
        {/* Arrow controls */}
        <div style={{
          position: "absolute",
          bottom: 0, left: 0, right: 0,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "12px 16px",
          background: "linear-gradient(to top, rgba(10,29,23,0.76) 0%, transparent 100%)",
        }}>
          <button
            onClick={() => setIdx(i => Math.max(0, i - 1))}
            disabled={idx === 0}
            className="land-btn--ghost"
            style={{
              padding: 0,
              cursor: idx === 0 ? "default" : "pointer",
              color: idx === 0 ? "var(--land-inverse-faint)" : "var(--land-inverse)",
            }}
          >
            <svg className="land-btn__arrow-icon" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="19" y1="12" x2="5" y2="12" />
              <polyline points="12 19 5 12 12 5" />
            </svg>
            PREV
          </button>
          <span style={{
            fontFamily: fontMono,
            fontSize: 9,
            letterSpacing: "0.12em",
            color: "var(--land-inverse-muted)",
          }}>
            {idx + 1} / {photos.length}
          </span>
          <button
            onClick={() => setIdx(i => Math.min(photos.length - 1, i + 1))}
            disabled={idx === photos.length - 1}
            className="land-btn--ghost"
            style={{
              padding: 0,
              cursor: idx === photos.length - 1 ? "default" : "pointer",
              color: idx === photos.length - 1 ? "var(--land-inverse-faint)" : "var(--land-inverse)",
            }}
          >
            NEXT
            <svg className="land-btn__arrow-icon" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="5" y1="12" x2="19" y2="12" />
              <polyline points="12 5 19 12 12 19" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}

/* ── Default overview (no lot selected) ───────────────────── */
function PanelOverview({ project, lots }: { project: Project; lots: Lot[] }) {
  const { copy, isArabic } = useLanguage();
  const fontBody = isArabic ? "'Baloo Bhaijaan 2', 'Hacen Algeria', sans-serif" : "'Space Grotesk', sans-serif";
  const fontMono = isArabic ? "'Baloo Bhaijaan 2', 'Hacen Algeria', sans-serif" : "'Space Mono', monospace";
  const available = lots.filter(l => l.status === "available").length;
  const reserved  = lots.filter(l => l.status === "reserved").length;
  const sold      = lots.filter(l => l.status === "sold").length;

  return (
    <div style={{ padding: "40px 32px" }}>
      {/* Label */}
      <div className="land-label" style={{ marginBottom: 24 }}>
        {copy.lotPanel.developmentOverview}
      </div>

      {/* Project name */}
      <div style={{
        fontFamily: fontBody,
        fontSize: 32,
        fontWeight: 700,
        color: "var(--land-ink)",
        letterSpacing: "-0.02em",
        lineHeight: 1.1,
        marginBottom: 12,
      }}>
        {project.name}
      </div>
      <div style={{
        fontFamily: fontMono,
        fontSize: 9,
        letterSpacing: "0.22em",
        textTransform: "uppercase",
        color: "var(--land-ink-muted)",
        marginBottom: 40,
      }}>
        {project.location}
      </div>

      {/* Divider */}
      <div className="land-divider" style={{ marginBottom: 32 }} />

      {/* Lot tally */}
      <div className="land-label" style={{ marginBottom: 20 }}>
        {copy.lotPanel.lotAvailability}
      </div>

      {(["available", "reserved", "sold"] as LotStatus[]).map(s => (
        <div key={s} style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "16px 0",
          borderBottom: "1px solid var(--land-border-soft)",
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <div style={{
              width: 8, height: 8,
              background: STATUS_COLOR[s],
              flexShrink: 0,
              opacity: 0.9,
            }} />
            <span style={{
              fontFamily: fontBody,
              fontSize: 14,
              color: "var(--land-ink-soft)",
            }}>
              {getStatusLabel(s, copy)}
            </span>
          </div>
          <span style={{
            fontFamily: fontBody,
            fontSize: 20,
            fontWeight: 700,
            color: "var(--land-ink)",
            letterSpacing: "-0.01em",
          }}>
            {s === "available" ? available : s === "reserved" ? reserved : sold}
          </span>
        </div>
      ))}

      <div style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "16px 0 0",
      }}>
        <span style={{ fontFamily: fontBody, fontSize: 14, color: "var(--land-ink-muted)" }}>
          {copy.lotPanel.totalLots}
        </span>
        <span style={{
          fontFamily: fontBody,
          fontSize: 20, fontWeight: 700,
          color: "var(--land-ink-muted)", letterSpacing: "-0.01em",
        }}>
          {lots.length}
        </span>
      </div>

      {/* Hint */}
      <div style={{
        marginTop: 40,
        padding: "24px",
        background: "var(--land-clay-soft)",
        border: "1px solid var(--land-border-soft)",
      }}>
        <p style={{
          fontFamily: fontBody,
          fontSize: 13,
          color: "var(--land-ink-soft)",
          lineHeight: 1.6,
          margin: 0,
        }}>
          {copy.lotPanel.overviewHint}
        </p>
      </div>
    </div>
  );
}

/* ── Selected lot detail ──────────────────────────────────── */
function PanelLotDetail({ lot, onDeselect }: { lot: Lot; onDeselect: () => void }) {
  const { copy, isArabic } = useLanguage();
  const fontBody = isArabic ? "'Baloo Bhaijaan 2', 'Hacen Algeria', sans-serif" : "'Space Grotesk', sans-serif";
  const fontMono = isArabic ? "'Baloo Bhaijaan 2', 'Hacen Algeria', sans-serif" : "'Space Mono', monospace";
  return (
    <div>
      {/* Back link */}
      <div style={{
        padding: "24px 32px",
        borderBottom: "1px solid var(--land-border-soft)",
        display: "flex",
        alignItems: "center",
        gap: 16,
      }}>
        <button
          onClick={onDeselect}
          className="land-btn--ghost"
          style={{ padding: 0, color: "var(--land-ink-muted)" }}
        >
          <svg width="12" height="12" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path d="M13 8H3M7 4L3 8l4 4" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          {copy.lotPanel.overview}
        </button>
        <div style={{ width: 1, height: 16, background: "var(--land-border)" }} />
        <span style={{
          fontFamily: fontBody,
          fontSize: 16,
          fontWeight: 700,
          color: "var(--land-ink)",
          letterSpacing: "0.04em",
        }}>
          {getLotLabel(lot, copy, isArabic)}
        </span>
      </div>

      <div style={{ padding: "32px" }}>
        {/* Status */}
        <div style={{
          display: "inline-flex",
          alignItems: "center",
          gap: 10,
          marginBottom: 32,
        }}>
          <div style={{
            width: 8, height: 8,
            background: STATUS_COLOR[lot.status],
            flexShrink: 0,
          }} />
          <span style={{
            fontFamily: fontMono,
            fontSize: 20,
            letterSpacing: isArabic ? "0" : "0.24em",
            textTransform: isArabic ? "none" as const : "uppercase" as const,
            color: STATUS_COLOR[lot.status],
            whiteSpace: "nowrap",
          }}>
            {getStatusLabel(lot.status, copy)}
          </span>
        </div>

        {/* Size & Price */}
        <div style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          borderTop: "1px solid var(--land-border-soft)",
          borderInlineStart: "1px solid var(--land-border-soft)",
          marginBottom: 32,
        }}>
          {[
            { label: copy.lotPanel.size, value: `${lot.size.toLocaleString()} m²` },
            { label: copy.lotPanel.price, value: lot.price === "Price on request" ? copy.lotPanel.priceOnRequest : lot.price },
          ].map((m, i) => (
            <div key={m.label} style={{
              padding: "20px 24px",
              borderInlineEnd: "1px solid var(--land-border-soft)",
              borderBottom: "1px solid var(--land-border-soft)",
              background: "var(--land-card-alt)",
            }}>
              <div style={{
                fontFamily: fontMono,
                fontSize: 8,
                letterSpacing: "0.22em",
                textTransform: "uppercase",
                color: "var(--land-ink-muted)",
                marginBottom: 8,
              }}>
                {m.label}
              </div>
              <div style={{
                fontFamily: fontBody,
                fontSize: 24,
                fontWeight: 700,
                color: "var(--land-ink)",
                letterSpacing: "-0.01em",
                lineHeight: 1,
              }}>
                {m.value}
              </div>
            </div>
          ))}
        </div>

        {/* Description */}
        <p style={{
          fontFamily: fontBody,
          fontSize: 16,
          lineHeight: 1.7,
          color: "var(--land-ink-soft)",
          margin: "0 0 32px",
        }}>
          {lot.description}
        </p>

        {/* Photos */}
        <LotGallery key={lot.id} photos={lot.photos} />

        {/* CTA */}
        {lot.status !== "sold" && (
          <button className="land-btn--primary" style={{ width: "100%", marginTop: 24 }}>
            {copy.lotPanel.enquire}
          </button>
        )}
      </div>
    </div>
  );
}

/* ── Panel root ───────────────────────────────────────────── */
export function LotPanel({
  project,
  lots,
  selectedLot,
  featuredLots,
  onLotSelect,
  onDeselect,
  className,
}: LotPanelProps) {
  const { copy, isArabic } = useLanguage();
  const fontBody = isArabic ? "'Baloo Bhaijaan 2', 'Hacen Algeria', sans-serif" : "'Space Grotesk', sans-serif";
  const fontMono = isArabic ? "'Baloo Bhaijaan 2', 'Hacen Algeria', sans-serif" : "'Space Mono', monospace";
  return (
    <div className={`proj-lot-panel ${className ?? ""}`} style={{
      display: "flex",
      flexDirection: "column",
      overflow: "hidden",
      borderLeft: "1px solid var(--land-border-soft)",
      background: "var(--land-panel)",
    }}>
      {/* Scrollable top */}
      <div style={{
        flex: 1,
        overflowY: "auto",
        minHeight: 0,
        scrollbarWidth: "thin",
        scrollbarColor: "var(--land-border) transparent",
      }}>
        {selectedLot
          ? <PanelLotDetail lot={selectedLot} onDeselect={onDeselect} />
          : <PanelOverview project={project} lots={lots} />
        }
      </div>

      {/* ── Featured lots — pinned to bottom ───────────────── */}
      <div style={{
        flexShrink: 0,
        borderTop: "1px solid var(--land-border-soft)",
        padding: "24px 32px 32px",
        background: "var(--land-panel-muted)",
      }}>
        <div className="land-label" style={{ marginBottom: 16 }}>
          {copy.lotPanel.featuredLots}
        </div>

        <div style={{
          display: "flex",
          gap: 12,
          overflowX: "auto",
          paddingBottom: 4,
          scrollbarWidth: "none",
        }}>
          {featuredLots.map(lot => {
            const isActive = selectedLot?.id === lot.id;
            return (
              <div
                key={lot.id}
                onClick={() => onLotSelect(lot.id)}
                style={{
                  flexShrink: 0,
                  width: 140,
                  background: isActive ? "var(--land-card-alt)" : "var(--land-panel)",
                  border: isActive ? "1px solid var(--land-border-strong)" : "1px solid var(--land-border-soft)",
                  padding: "16px",
                  cursor: "pointer",
                  transition: "all 0.2s",
                }}
              >
                {/* Lot label + status dot */}
                <div style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  marginBottom: 12,
                }}>
                  <span style={{
                    fontFamily: fontMono,
                    fontSize: 9,
                    letterSpacing: "0.14em",
                    color: isActive ? "var(--land-ink-soft)" : "var(--land-ink-muted)",
                  }}>
                    {getLotLabel(lot, copy, isArabic)}
                  </span>
                  <div style={{
                    width: 6, height: 6,
                    background: STATUS_COLOR[lot.status],
                    opacity: 0.9,
                    flexShrink: 0,
                  }} />
                </div>
                {/* Price */}
                <div style={{
                  fontFamily: fontBody,
                  fontSize: 18,
                  fontWeight: 700,
                  letterSpacing: "-0.01em",
                  color: "var(--land-ink)",
                  lineHeight: 1,
                  marginBottom: 6,
                }}>
                  {lot.price === "Price on request" ? copy.lotPanel.priceOnRequest : lot.price}
                </div>
                {/* Size */}
                <div style={{
                  fontFamily: fontMono,
                  fontSize: 8,
                  letterSpacing: "0.1em",
                  color: isActive ? "var(--land-ink-soft)" : "var(--land-ink-muted)",
                }}>
                  {lot.size.toLocaleString()} M²
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
