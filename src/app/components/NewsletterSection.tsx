import { useState } from "react";
import { Reveal } from "./Reveal";
import { useLanguage } from "../i18n";

export function NewsletterSection() {
  const { copy } = useLanguage();
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) setSubmitted(true);
  };

  return (
    <section className="land-newsletter">
      <Reveal delay={0} from="right" distance={40}>
        <div className="land-newsletter__left">
          <div className="land-label" style={{ marginBottom: 20 }}>{copy.newsletter.label}</div>
          <div className="land-newsletter__heading">
            {copy.newsletter.heading[0]}<br />{copy.newsletter.heading[1]}
          </div>
          <p className="land-newsletter__sub" style={{ marginTop: 14 }}>
            {copy.newsletter.sub}
          </p>
        </div>
      </Reveal>

      <Reveal delay={160} from="left" distance={40}>
        <div className="land-newsletter__form">
          {submitted ? (
            <div className="land-newsletter__success">
              <div className="land-newsletter__confirmed">
                {copy.newsletter.confirmed}
              </div>
              {copy.newsletter.success}
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="land-newsletter__form-inner">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="land-newsletter__input"
                placeholder={copy.newsletter.placeholder}
                required
              />
              <button type="submit" className="land-newsletter__btn">
                <span>{copy.newsletter.subscribe}</span>
              </button>
            </form>
          )}
          <p className="land-newsletter__fine-print">
            {copy.newsletter.finePrint}
          </p>
        </div>
      </Reveal>
    </section>
  );
}
