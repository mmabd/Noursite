import { useState, useMemo } from "react";
import { useParams, useNavigate } from "react-router";
import { projects } from "../data/projects";
import type { Lot } from "../data/lots";
import { getProjectLotPlan } from "../data/projectLotPlans";
import { useLotData } from "../lib/useLotData";
import { useLanguage } from "../i18n";
import { GoogleLotMap } from "./GoogleLotMap";
import { LotMap } from "./LotMap";
import { LotPanel } from "./LotPanel";
import { Reveal } from "./Reveal";
import { StaticLotMap } from "./StaticLotMap";

export function ProjectPage() {
  const { copy, isArabic } = useLanguage();
  const fontBody = isArabic ? "'Baloo Bhaijaan 2', 'Hacen Algeria', sans-serif" : "'Space Grotesk', sans-serif";
  const fontMono = isArabic ? "'Baloo Bhaijaan 2', 'Hacen Algeria', sans-serif" : "'Space Mono', monospace";
  const { num } = useParams<{ num: string }>();
  const navigate = useNavigate();

  const [selectedLotId, setSelectedLotId] = useState<string | null>(null);
  const [hoveredLotId,  setHoveredLotId]  = useState<string | null>(null);

  const projectNum = Number(num);
  const { lots: sheetLots, loading: sheetLoading, error: sheetError } = useLotData(projectNum);

  const project = projects.find(p => p.num === projectNum);
  if (!project) {
    return (
      <div style={{ padding: 80, fontFamily: fontMono, color: "var(--land-ink-muted)" }}>
        {copy.projectPage.notFound}
      </div>
    );
  }

  if (sheetError) {
    console.warn("[ProjectPage] Sheet fetch failed, using static data:", sheetError);
  }

  // Build a stable key from sheet data so lotPlan only recomputes when data actually changes
  const sheetKey = useMemo(
    () => sheetLots.length > 0
      ? sheetLots.map(l => `${l.lot_id}:${l.status}:${l.price}:${l.size_m2}`).join("|")
      : "",
    [sheetLots],
  );

  const lotPlan = useMemo(
    () => getProjectLotPlan(project.num, sheetLots.length > 0 ? sheetLots : undefined),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [project.num, sheetKey],
  );
  const projectLots: Lot[] = lotPlan?.lots ?? [];
  const featuredLots = projectLots.filter(l => l.featured);
  const selectedLot  = selectedLotId ? projectLots.find(l => l.id === selectedLotId) ?? null : null;
  const nextProject  = projects.find(p => p.num === project.num + 1);
  const prevProject  = projects.find(p => p.num === project.num - 1);
  const getLotLabel = (lotNumber: number, fallback: string) =>
    isArabic ? `${copy.lotPanel.lotPrefix} ${String(lotNumber).padStart(2, "0")}` : fallback;
  const projectLabel = project.num === 1
    ? copy.projectPage.labels.project1
    : project.num === 2
      ? copy.projectPage.labels.project2
      : project.num === 3
        ? copy.projectPage.labels.project3
        : copy.projectPage.labels.project4;

  const availableCount = projectLots.filter(l => l.status === "available").length;
  const unitMetric = lotPlan
    ? { label: copy.projectPage.lotsInPhase, value: String(projectLots.length) }
    : { label: project.type === "COMMERCIAL" ? copy.projectPage.gla : copy.projectPage.lots, value: project.units };

  return (
    <div style={{ background: "var(--land-surface)", minHeight: "100vh" }}>
      
      {/* ── Header ───────────────────────────────────────────── */}
      <div className="proj-header">
        <div>
          <button
            onClick={() => navigate("/")}
            className="land-btn--ghost"
            style={{ marginBottom: 24, color: "var(--land-label)", padding: 0 }}
          >
            <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M13 8H3M7 4L3 8l4 4" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            {copy.projectPage.back}
          </button>

          <div className="land-label" style={{ marginBottom: 12 }}>
            {projectLabel}
          </div>
          <h1 className="land-heading" style={{ fontSize: "clamp(28px, 4vw, 56px)", marginBottom: 0 }}>
            {project.name}
          </h1>
        </div>

        <div className="proj-header__right" style={{ paddingBottom: 8 }}>
          <div className="land-label" style={{ marginBottom: 8, justifyContent: "flex-end" }}>
            {copy.projectPage.availability}
          </div>
          <div style={{
            fontFamily: fontBody,
            fontSize: 16,
            fontWeight: 700,
            color: "var(--land-status-available)",
            letterSpacing: "0.02em",
          }}>
            ● {availableCount} {copy.projectPage.lots}
          </div>
        </div>
      </div>

      {/* ── Map hero ─────────────────────────────────────────── */}
      <div className="proj-map-body-stack proj-map-container">
        {/* Map canvas */}
        <div className="proj-map-canvas" style={{ flex: 1, minWidth: 0, overflow: "hidden" }}>
          {lotPlan ? (
            <GoogleLotMap
              lots={projectLots}
              geoJson={lotPlan.geoJson}
              mapLots={lotPlan.mapLots}
              selectedLotId={selectedLotId}
              hoveredLotId={hoveredLotId}
              onLotClick={(id) => setSelectedLotId(id === selectedLotId ? null : id)}
              onLotHover={setHoveredLotId}
              projectName={project.name}
              initialCenter={lotPlan.initialCenter}
              initialZoom={lotPlan.initialZoom}
            />
          ) : (
            <LotMap
              lots={projectLots}
              selectedLotId={selectedLotId}
              hoveredLotId={hoveredLotId}
              onLotClick={id => setSelectedLotId(id === selectedLotId ? null : id)}
              onLotHover={setHoveredLotId}
              projectName={project.name}
            />
          )}
        </div>

        {/* Side panel */}
        <LotPanel
          className="proj-map-panel-mobile"
          project={project}
          lots={projectLots}
          selectedLot={selectedLot}
          featuredLots={featuredLots}
          onLotSelect={id => setSelectedLotId(id)}
          onDeselect={() => setSelectedLotId(null)}
        />
      </div>

      {/* ── Stats strip ────────────────────────────────────────── */}
      <div className="land-about__stats proj-stats-strip" style={{ borderBottom: "1px solid var(--land-border-soft)" }}>
        {[
          { label: copy.projectPage.siteArea, value: project.area },
          unitMetric,
          { label: copy.projectPage.projectValue, value: project.value },
          { label: copy.projectPage.completion, value: project.completion },
        ].map((s) => (
          <div key={s.label} className="land-about__stat" style={{ padding: "32px 40px" }}>
            <div className="land-about__stat-desc" style={{ marginBottom: 12, marginTop: 0 }}>
              {s.label}
            </div>
            <div className="land-about__stat-num">
              {s.value}
            </div>
          </div>
        ))}
      </div>

      {/* ── Overview ───────────────────────────────────────────── */}
      <section className="land-section land-section--off" id="overview">
        <div className="proj-overview">
          {/* Left — text */}
          <div>
            <Reveal delay={0}>
              <div className="land-label">{copy.projectPage.overview}</div>
            </Reveal>
            <Reveal delay={80}>
              <h2 className="land-heading" style={{ fontSize: "clamp(28px, 3.5vw, 48px)" }}>
                {copy.projectPage.aboutTheProject}
              </h2>
            </Reveal>
            <Reveal delay={160}>
              {project.description.split("\n\n").map((para, i) => (
                <p key={i} className="land-about__body" style={i > 0 ? { marginTop: 0 } : undefined}>
                  {para}
                </p>
              ))}
            </Reveal>
          </div>

          {/* Right — highlights */}
          <Reveal delay={120}>
            <div className="land-label" style={{ marginBottom: 24 }}>{copy.projectPage.keyHighlights}</div>
            <ul style={{ listStyle: "none", padding: 0, margin: 0, borderTop: "1px solid var(--land-border-soft)" }}>
              {project.highlights.map((h, i) => (
                <li key={i} style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 16,
                  padding: "16px 0",
                  borderBottom: "1px solid var(--land-border-soft)",
                  fontFamily: fontBody,
                  fontSize: 14,
                  color: "var(--land-ink-soft)",
                  lineHeight: 1.5,
                }}>
                  <span style={{
                    width: 6, height: 6,
                    background: "var(--land-clay)",
                    flexShrink: 0,
                  }} />
                  {h}
                </li>
              ))}
            </ul>
          </Reveal>
        </div>
      </section>

      {/* ── Featured lots ──────────────────────────────────────── */}
      <section className="land-section">
        {/* Header */}
        <div className="land-projects__header">
          <div>
            <Reveal delay={0}>
              <div className="land-label">{copy.projectPage.opportunities}</div>
            </Reveal>
            <Reveal delay={80}>
              <h2 className="land-heading">{copy.projectPage.featuredLots}</h2>
            </Reveal>
          </div>
          <Reveal delay={160} from="left">
            <p style={{
              fontFamily: fontBody,
              fontSize: 15,
              color: "var(--land-ink-soft)",
              lineHeight: 1.7,
              maxWidth: 280,
              textAlign: "right",
              margin: 0,
            }}>
              {copy.projectPage.featuredBlurb}
            </p>
          </Reveal>
        </div>

        {/* Cards — same grid as land-projects__grid */}
        <div className="land-projects__grid">
          {featuredLots.map((lot, i) => {
            // Compute centroid of this lot for map center
            const geoFeature = lotPlan?.geoJson.features.find(f => f.id === lot.id);
            const coords = geoFeature?.geometry.coordinates[0] ?? [];
            let lotCenter = lotPlan?.initialCenter ?? { lat: 0, lng: 0 };
            if (coords.length > 0) {
              const lats = coords.map(c => c[1]);
              const lngs = coords.map(c => c[0]);
              lotCenter = {
                lat: (Math.min(...lats) + Math.max(...lats)) / 2,
                lng: (Math.min(...lngs) + Math.max(...lngs)) / 2,
              };
            }

            const statusColor =
              lot.status === "available" ? "var(--land-status-available-strong)"
              : lot.status === "reserved" ? "var(--land-status-reserved-strong)"
              : "var(--land-status-sold)";
            const statusBg =
              lot.status === "available" ? "var(--land-status-available-soft)"
              : lot.status === "reserved" ? "var(--land-status-reserved-soft)"
              : "var(--land-status-sold-soft)";
            const statusText =
              lot.status === "available" ? copy.statuses.available
              : lot.status === "reserved" ? copy.statuses.reserved
              : copy.statuses.sold;

            return (
              <div key={lot.id}>
                <div
                  className="land-project-card land-project-card--static"
                  style={{ height: "100%", background: "var(--land-card-alt)" }}
                >
                  {/* Static Google Map zoomed on this lot */}
                  <div style={{
                    width: "100%",
                    height: "100%",
                    overflow: "hidden",
                  }}>
                    {lotPlan ? (
                      <StaticLotMap
                        geoJson={lotPlan.geoJson}
                        focusLotId={lot.id}
                        center={lotCenter}
                        zoom={18}
                      />
                    ) : (
                      <div style={{
                        width: "100%",
                        height: "100%",
                        background: "linear-gradient(135deg, var(--land-card-alt) 0%, var(--land-surface-strong) 100%)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}>
                        <span style={{
                          fontFamily: fontBody,
                          fontSize: 80,
                          fontWeight: 800,
                          color: "rgba(18, 32, 25, 0.08)",
                          letterSpacing: "-0.04em",
                        }}>
                          {String(lot.num).padStart(2, "0")}
                        </span>
                      </div>
                    )}
                  </div>

                  <div
                    className="land-project-card__overlay"
                    style={{ background: "linear-gradient(to top, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.4) 42%, transparent 65%)" }}
                  />

                  <div className="land-project-card__info">
                    <div className="land-project-card__tag">
                      {getLotLabel(lot.num, lot.label)} — {lot.size.toLocaleString()} m²
                    </div>
                    <div className="land-project-card__name">
                      {lot.price === "Price on request" ? copy.lotPanel.priceOnRequest : lot.price}
                    </div>
                    <p style={{
                      fontFamily: fontBody,
                      fontSize: 12,
                      lineHeight: 1.6,
                      color: "var(--land-inverse-muted)",
                      margin: "6px 0 0",
                      display: "-webkit-box",
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: "vertical",
                      overflow: "hidden",
                    }}>
                      {lot.description}
                    </p>
                    <div className="land-project-card__meta" style={{ marginTop: 8 }}>
                      <span
                        className="land-project-card__status"
                        style={{
                          color: statusColor,
                          background: statusBg,
                        }}
                      >
                        {lot.status === "available" ? `● ${statusText}` : statusText}
                      </span>
                      <a
                        href="/#contact"
                        className="land-btn--primary"
                        style={{ fontSize: 13, padding: "10px 24px", textDecoration: "none" }}
                      >
                        {copy.projectPage.contactBtn}
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* ── How It Works ───────────────────────────────────────── */}
      <section className="land-section land-section--mid">
        <Reveal delay={0}>
          <div className="land-label">{copy.projectPage.process}</div>
        </Reveal>
        <Reveal delay={80}>
          <h2 className="land-heading">{copy.projectPage.howItWorks}</h2>
        </Reveal>

        {/* Steps — same card language as land-review-card */}
        <div className="proj-how-grid">
          {copy.projectPage.processSteps.map((step, i) => (
            <Reveal key={step.num} delay={160 + i * 100} duration={900}>
              <div className="land-review-card" style={{ height: "100%" }}>
                {/* Step number */}
                <div style={{
                  fontFamily: fontMono,
                  fontSize: 8.5,
                  letterSpacing: "0.22em",
                  color: "var(--land-clay)",
                  marginBottom: 24,
                }}>
                  {step.num}
                </div>
                {/* Title — bold like review author */}
                <div style={{
                  fontFamily: fontBody,
                  fontSize: 13,
                  fontWeight: 700,
                  letterSpacing: "0.14em",
                  textTransform: "uppercase",
                  color: "var(--land-ink)",
                  marginBottom: 16,
                }}>
                  {step.title}
                </div>
                {/* Divider — same as review card */}
                <div className="land-review-card__divider" />
                {/* Description */}
                <p className="land-review-card__quote" style={{ fontStyle: "normal" }}>
                  {step.desc}
                </p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ── Prev / Next ────────────────────────────────────────── */}
      <div
        className="proj-nav-grid"
        style={{ background: "var(--land-panel-muted)", borderTop: "1px solid var(--land-border-soft)", direction: isArabic ? "rtl" : "ltr" }}
      >
        <div
          className="land-proj-nav land-proj-nav--prev proj-nav-item"
          onClick={() => prevProject && navigate(`/project/${prevProject.num}`)}
          style={{
            borderInlineEnd: "1px solid var(--land-border-soft)",
            cursor: prevProject ? "pointer" : "default",
            opacity: prevProject ? 1 : 0.3,
          }}
          onMouseEnter={e => prevProject && (e.currentTarget.style.background = "var(--land-status-available-soft)")}
          onMouseLeave={e => (e.currentTarget.style.background = "transparent")}
        >
          <div className="land-label" style={{ marginBottom: 16, display: "flex", alignItems: "center", gap: 8 }}>
            <svg className="land-nav-arrow land-nav-arrow--prev" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="19" y1="12" x2="5" y2="12" />
              <polyline points="12 19 5 12 12 5" />
            </svg>
            {copy.projectPage.previous}
          </div>
          <div className="proj-nav-item__name">
            {prevProject?.name ?? "—"}
          </div>
        </div>

        <div
          className="land-proj-nav land-proj-nav--next proj-nav-item"
          onClick={() => nextProject && navigate(`/project/${nextProject.num}`)}
          style={{
            textAlign: "end",
            cursor: nextProject ? "pointer" : "default",
            opacity: nextProject ? 1 : 0.3,
            display: "flex",
            flexDirection: "column",
            alignItems: "flex-end",
          }}
          onMouseEnter={e => nextProject && (e.currentTarget.style.background = "var(--land-clay-soft)")}
          onMouseLeave={e => (e.currentTarget.style.background = "transparent")}
        >
          <div className="land-label" style={{ marginBottom: 16, display: "flex", alignItems: "center", gap: 8, justifyContent: "flex-end" }}>
            {copy.projectPage.next}
            <svg className="land-nav-arrow land-nav-arrow--next" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="5" y1="12" x2="19" y2="12" />
              <polyline points="12 5 19 12 12 19" />
            </svg>
          </div>
          <div className="proj-nav-item__name">
            {nextProject?.name ?? "—"}
          </div>
        </div>
      </div>
    </div>
  );
}
