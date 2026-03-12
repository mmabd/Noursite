import { useState } from "react";
import { Reveal } from "./Reveal";
import { useLanguage } from "../i18n";

export function ContactSection() {
  const { copy } = useLanguage();
  const [form, setForm] = useState({
    firstName: "", lastName: "", email: "", phone: "", interest: "", message: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => { e.preventDefault(); };

  return (
    <section className="land-section land-section--off" id="contact">
      <Reveal delay={0}>
        <div className="land-label land-label--light">{copy.contact.label}</div>
      </Reveal>
      <Reveal delay={80} blur>
        <h2 className="land-heading">{copy.contact.heading}</h2>
      </Reveal>

      <div className="land-contact__grid">
        {/* Left — info */}
        <div>
          {copy.contact.info.map((item, i) => (
            <Reveal key={item.label} delay={180 + i * 80}>
              <div className="land-contact__info-item">
                <div className="land-contact__info-label">{item.label}</div>
                <div className="land-contact__info-value">
                  {item.value.map((line) => <div key={line}>{line}</div>)}
                </div>
              </div>
            </Reveal>
          ))}

          <Reveal delay={520}>
            <div style={{ marginTop: 48, paddingTop: 32, borderTop: "1px solid var(--land-border-soft)" }}>
              <div className="land-contact__info-label" style={{ marginBottom: 12 }}>{copy.contact.officeHoursLabel}</div>
              <div className="land-contact__office-hours">
                {copy.contact.officeHours.map((line) => <div key={line}>{line}</div>)}
              </div>
            </div>
          </Reveal>
        </div>

        {/* Right — form */}
        <Reveal delay={200} from="left" distance={40}>
          <form onSubmit={handleSubmit}>
            <div className="land-form__row">
              <div className="land-form__field">
                <label htmlFor="contact-firstName" className="land-form__label">{copy.contact.form.firstName}</label>
                <input id="contact-firstName" name="firstName" value={form.firstName} onChange={handleChange} className="land-form__input" placeholder={copy.contact.form.placeholders.firstName} />
              </div>
              <div className="land-form__field">
                <label htmlFor="contact-lastName" className="land-form__label">{copy.contact.form.lastName}</label>
                <input id="contact-lastName" name="lastName" value={form.lastName} onChange={handleChange} className="land-form__input" placeholder={copy.contact.form.placeholders.lastName} />
              </div>
            </div>
            <div className="land-form__row">
              <div className="land-form__field">
                <label htmlFor="contact-email" className="land-form__label">{copy.contact.form.email}</label>
                <input id="contact-email" name="email" type="email" value={form.email} onChange={handleChange} className="land-form__input" placeholder={copy.contact.form.placeholders.email} />
              </div>
              <div className="land-form__field">
                <label htmlFor="contact-phone" className="land-form__label">{copy.contact.form.phone}</label>
                <input id="contact-phone" name="phone" value={form.phone} onChange={handleChange} className="land-form__input" placeholder={copy.contact.form.placeholders.phone} />
              </div>
            </div>
            <div className="land-form__field">
              <label htmlFor="contact-interest" className="land-form__label">{copy.contact.form.interest}</label>
              <select id="contact-interest" name="interest" value={form.interest} onChange={handleChange} className="land-form__select">
                <option value="" disabled>{copy.contact.form.options[0]}</option>
                {copy.contact.form.options.slice(1).map((option) => (
                  <option key={option}>{option}</option>
                ))}
              </select>
            </div>
            <div className="land-form__field">
              <label htmlFor="contact-message" className="land-form__label">{copy.contact.form.message}</label>
              <textarea id="contact-message" name="message" value={form.message} onChange={handleChange} className="land-form__textarea" placeholder={copy.contact.form.placeholders.message} />
            </div>
            <button type="submit" className="land-form__submit">
              {copy.contact.form.submit}
              <span className="land-form__submit-arrow">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="5" y1="12" x2="19" y2="12" />
                  <polyline points="12 5 19 12 12 19" />
                </svg>
              </span>
            </button>
          </form>
        </Reveal>
      </div>
    </section>
  );
}
