import { useLanguage } from "../i18n";
import heroBg from "../../assets/homepage_1.jpg";

export function HeroSection() {
  const { copy } = useLanguage();

  return (
    <section className="land-hero" id="home">
      <img
        className="land-hero__bg"
        src={heroBg}
        alt="Al Nour Suburbs"
      />
      <div className="land-hero__overlay" />


      <div className="land-hero__content">
        <div className="land-hero__eyebrow">{copy.hero.eyebrow}</div>
        <h1 className="land-hero__title">
          {copy.hero.title[0]}<br />
          {copy.hero.title[1]}<br />
          {copy.hero.title[2]}
        </h1>
        <div className="land-hero__actions">
          <button className="land-btn--primary" onClick={() => document.getElementById("projects")?.scrollIntoView({ behavior: "smooth" })}>{copy.hero.explore}</button>
          <button className="land-btn--ghost land-btn--arrow-down" onClick={() => document.getElementById("about")?.scrollIntoView({ behavior: "smooth" })}>
            <svg className="land-btn__arrow-icon land-btn__arrow-icon--down" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="12" y1="5" x2="12" y2="19" />
              <polyline points="19 12 12 19 5 12" />
            </svg>
            {copy.hero.story}
          </button>
        </div>
      </div>

      <div className="land-hero__stats">
        {copy.hero.stats.map((s) => (
          <div key={s.label} className="land-hero__stat">
            <div className="land-hero__stat-num">{s.num}</div>
            <div className="land-hero__stat-label">{s.label}</div>
          </div>
        ))}
      </div>
    </section>
  );
}
