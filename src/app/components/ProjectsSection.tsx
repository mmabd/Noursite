import { Reveal } from "./Reveal";
import { useLanguage } from "../i18n";

const projects = [
  {
    id: "P-001",
    name: "مشروع الغروب",
    type: "RESIDENTIAL",
    location: "CAPE TOWN, WC",
    status: "active" as const,
    img: "https://images.unsplash.com/photo-1759670509449-23a374206521?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=900",
  },
  {
    id: "P-002",
    name: "NORTHGATE COMMONS",
    type: "MIXED-USE",
    location: "JOHANNESBURG, GP",
    status: "completed" as const,
    img: "https://images.unsplash.com/photo-1521208298387-0f7532927fed?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=900",
  },
  {
    id: "P-003",
    name: "VANTAGE ESTATE",
    type: "LUXURY RESIDENTIAL",
    location: "STELLENBOSCH, WC",
    status: "active" as const,
    img: "https://images.unsplash.com/photo-1769207926973-f228026b996b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=900",
  },
  {
    id: "P-004",
    name: "PLAZA CORE",
    type: "COMMERCIAL",
    location: "DURBAN, KZN",
    status: "completed" as const,
    img: "https://images.unsplash.com/photo-1707301454103-1384f7c535d8?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=900",
  },
];

export function ProjectsSection() {
  const { copy } = useLanguage();

  const getTypeLabel = (type: string) => {
    if (type === "RESIDENTIAL") return copy.projects.types.residential;
    if (type === "MIXED-USE") return copy.projects.types.mixedUse;
    if (type === "LUXURY RESIDENTIAL") return copy.projects.types.luxuryResidential;
    return copy.projects.types.commercial;
  };

  return (
    <section className="land-section">
      {/* Header */}
      <div className="land-projects__header">
        <div>
          <Reveal delay={0}>
            <div className="land-label">{copy.projects.label}</div>
          </Reveal>
          <Reveal delay={80} blur>
            <h2 className="land-heading">{copy.projects.heading}</h2>
          </Reveal>
        </div>
        <Reveal delay={160} from="left">
          <button className="land-view-all">
            <span>{copy.projects.viewAll}</span>
            <svg className="land-view-all__arrow" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M3 8h10M9 4l4 4-4 4" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
        </Reveal>
      </div>

      {/* Grid */}
      <div className="land-projects__grid">
        {projects.map((p, i) => (
          <Reveal key={p.id} id={`project-${i + 1}`} delay={i * 100} duration={900}>
            <div className="land-project-card" style={{ height: "100%" }}>
              <img src={p.img} alt={p.name} />
              <div className="land-project-card__overlay" />
              <div className="land-project-card__info">
                <div className="land-project-card__tag">{getTypeLabel(p.type)} — {p.id}</div>
                <div className="land-project-card__name">{p.name}</div>
                <div className="land-project-card__meta">
                  <span className="land-project-card__location">{p.location}</span>
                  <span className={`land-project-card__status land-project-card__status--${p.status}`}>
                    {p.status === "active"
                      ? `● ${copy.projects.statuses.active}`
                      : copy.projects.statuses.completed}
                  </span>
                </div>
              </div>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
