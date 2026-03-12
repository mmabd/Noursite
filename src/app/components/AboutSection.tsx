import { Reveal } from "./Reveal";
import { useLanguage } from "../i18n";

export function AboutSection() {
  const { copy } = useLanguage();

  return (
    <section className="land-section land-section--off" id="about">
      <div className="land-about__grid">
        {/* Left — text */}
        <div>
          <Reveal delay={0}>
            <div className="land-label land-label--light">{copy.about.label}</div>
          </Reveal>
          <Reveal delay={80} blur>
            <h2 className="land-heading">{copy.about.heading}</h2>
          </Reveal>

          <Reveal delay={180}>
            <p className="land-about__body">{copy.about.body1}</p>
            <p className="land-about__body" style={{ marginTop: -16 }}>
              {copy.about.body2}
            </p>
          </Reveal>

          <div className="land-about__stats">
            {copy.about.stats.map((s, i) => (
              <Reveal key={s.desc} delay={260 + i * 80}>
                <div className="land-about__stat">
                  <div className="land-about__stat-num">{s.num}</div>
                  <div className="land-about__stat-desc">{s.desc}</div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>

        {/* Right — image */}
        <Reveal delay={120} from="left" distance={48}>
          <img
            className="land-about__image"
            src="https://images.unsplash.com/photo-1721244653652-268631ec049a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=900"
            alt="Land survey blueprints"
          />
        </Reveal>
      </div>
    </section>
  );
}
