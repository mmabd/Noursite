import { Reveal } from "./Reveal";
import { useLanguage } from "../i18n";

export function PaymentSection() {
  const { copy } = useLanguage();

  return (
    <section className="land-section land-section--mid">
      <Reveal delay={0}>
        <div className="land-label">{copy.pricing.label}</div>
      </Reveal>
      <div className="land-payment__header">
        <Reveal delay={80} blur>
          <h2 className="land-heading">{copy.pricing.heading}</h2>
        </Reveal>
        <Reveal delay={160} from="left">
          <span className="land-payment__blurb">
            {copy.pricing.blurb}
          </span>
        </Reveal>
      </div>

      <Reveal delay={0}>
        <div className="land-payment__grid">
          {copy.pricing.plans.map((p, i) => (
            <div
              key={p.name}
              className={`land-plan-card land-plan-card--animate ${p.featured ? "land-plan-card--featured" : ""}`}
              style={{ "--card-delay": `${220 + i * 120}ms` } as React.CSSProperties}
            >
              {/* Top area: badge or spacer */}
              <div className="land-plan-card__top">
                {p.badge
                  ? <div className="land-plan-card__badge">{p.badge}</div>
                  : null
                }
              </div>

              {/* Plan name */}
              <div className="land-plan-card__name">{p.name}</div>

              {/* Price block */}
              <div className="land-plan-card__price-block">
                <div className="land-plan-card__price">{p.price}</div>
                <div className="land-plan-card__sub">{p.sub}</div>
              </div>

              {/* Divider */}
              <div className="land-plan-card__divider" />

              {/* Features */}
              <ul className="land-plan-card__features">
                {p.features.map((f) => (
                  <li key={f} className="land-plan-card__feature">
                    <span className="land-plan-card__feature-check">&#10003;</span>
                    {f}
                  </li>
                ))}
              </ul>

              {/* CTA */}
              <button className="land-plan-card__cta">{p.cta}</button>
            </div>
          ))}
        </div>
      </Reveal>
    </section>
  );
}
