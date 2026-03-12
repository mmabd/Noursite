import { useState, useRef, useCallback, useEffect } from "react";
import { Reveal } from "./Reveal";
import { useLanguage } from "../i18n";
import quoteMarkSvg from "../../assets/quate mark.svg";

const TRANSITION_MS = 500;

export function ReviewsSection() {
  const { copy, isArabic } = useLanguage();
  const items = copy.reviews.items;
  const total = items.length;

  const [current, setCurrent] = useState(0);
  const autoplayRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const isTransitioning = useRef(false);

  const goTo = useCallback(
    (index: number) => {
      if (isTransitioning.current) return;
      isTransitioning.current = true;
      setCurrent(index);
      setTimeout(() => {
        isTransitioning.current = false;
      }, TRANSITION_MS + 20);
    },
    [],
  );

  const goNext = useCallback(() => {
    setCurrent(prev => {
      if (isTransitioning.current) return prev;
      isTransitioning.current = true;
      setTimeout(() => { isTransitioning.current = false; }, TRANSITION_MS + 20);
      return (prev + 1) % total;
    });
  }, [total]);

  const goPrev = useCallback(() => {
    setCurrent(prev => {
      if (isTransitioning.current) return prev;
      isTransitioning.current = true;
      setTimeout(() => { isTransitioning.current = false; }, TRANSITION_MS + 20);
      return (prev - 1 + total) % total;
    });
  }, [total]);

  /* ── Autoplay ───────────────────────────────────────────── */
  const startAutoplay = useCallback(() => {
    if (autoplayRef.current) clearInterval(autoplayRef.current);
    autoplayRef.current = setInterval(() => {
      if (!isTransitioning.current) {
        setCurrent((prev) => {
          const next = (prev + 1) % total;
          isTransitioning.current = true;
          setTimeout(() => {
            isTransitioning.current = false;
          }, TRANSITION_MS + 20);
          return next;
        });
      }
    }, 6000);
  }, [total]);

  const stopAutoplay = useCallback(() => {
    if (autoplayRef.current) {
      clearInterval(autoplayRef.current);
      autoplayRef.current = null;
    }
  }, []);

  useEffect(() => {
    startAutoplay();
    return stopAutoplay;
  }, [startAutoplay, stopAutoplay]);

  /* ── Keyboard navigation ────────────────────────────────── */
  const handleKey = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "ArrowLeft") {
        isArabic ? goNext() : goPrev();
        startAutoplay();
      } else if (e.key === "ArrowRight") {
        isArabic ? goPrev() : goNext();
        startAutoplay();
      }
    },
    [isArabic, goPrev, goNext, startAutoplay],
  );

  /* ── Touch swipe support ────────────────────────────────── */
  const touchStartX = useRef(0);
  const touchEndX = useRef(0);
  const SWIPE_THRESHOLD = 50;

  const handleTouchStart = useCallback(
    (e: React.TouchEvent) => {
      touchStartX.current = e.touches[0].clientX;
      touchEndX.current = e.touches[0].clientX;
      stopAutoplay();
    },
    [stopAutoplay],
  );

  const handleTouchMove = useCallback((e: React.TouchEvent) => {
    touchEndX.current = e.touches[0].clientX;
  }, []);

  const handleTouchEnd = useCallback(() => {
    const diff = touchStartX.current - touchEndX.current;
    if (Math.abs(diff) > SWIPE_THRESHOLD) {
      if (diff > 0) {
        isArabic ? goPrev() : goNext();
      } else {
        isArabic ? goNext() : goPrev();
      }
    }
    startAutoplay();
  }, [isArabic, goNext, goPrev, startAutoplay]);

  const item = items[current];

  return (
    <section className="land-section">
      <Reveal delay={0}>
        <div className="land-label">{copy.reviews.label}</div>
      </Reveal>
      <Reveal delay={80} blur>
        <h2 className="land-heading">{copy.reviews.heading}</h2>
      </Reveal>

      <Reveal delay={160}>
        <div
          className="land-testimonial"
          onMouseEnter={stopAutoplay}
          onMouseLeave={startAutoplay}
          onKeyDown={handleKey}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
          tabIndex={0}
          role="region"
          aria-label="Testimonials"
          aria-roledescription="carousel"
        >
          {/* Quote text with inline quote marks */}
          <div className="land-testimonial__body" key={`body-${current}`}>
            <div
              className="land-testimonial__marks land-testimonial__marks--top land-testimonial__anim land-testimonial__anim--d0"
              aria-hidden="true"
            >
              <img src={quoteMarkSvg} alt="" className="land-testimonial__mark-icon land-testimonial__mark-icon--flip" />
              <img src={quoteMarkSvg} alt="" className="land-testimonial__mark-icon land-testimonial__mark-icon--flip" />
            </div>
            <blockquote
              className="land-testimonial__quote land-testimonial__anim land-testimonial__anim--d1"
            >
              {item.quote}
            </blockquote>
            <div
              className="land-testimonial__marks land-testimonial__marks--bottom land-testimonial__anim land-testimonial__anim--d2"
              aria-hidden="true"
            >
              <img src={quoteMarkSvg} alt="" className="land-testimonial__mark-icon" />
              <img src={quoteMarkSvg} alt="" className="land-testimonial__mark-icon" />
            </div>
          </div>

          {/* Thin divider line */}
          <div
            key={`divider-${current}`}
            className="land-testimonial__divider land-testimonial__anim land-testimonial__anim--d3"
          />

          {/* Author attribution */}
          <div
            key={`author-${current}`}
            className="land-testimonial__attribution land-testimonial__anim land-testimonial__anim--d4"
          >
            <span className="land-testimonial__author">{item.author}</span>
            <span className="land-testimonial__role">{item.role}</span>
          </div>

          {/* Navigation */}
          <div className="land-testimonial__nav">
            <button
              className="land-testimonial__arrow"
              onClick={() => {
                goPrev();
                startAutoplay();
              }}
              aria-label="Previous testimonial"
            >
              <svg
                width="18"
                height="18"
                viewBox="0 0 20 20"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M13 4L7 10l6 6" />
              </svg>
            </button>

            <div className="land-testimonial__dots">
              {items.map((_, i) => (
                <button
                  key={i}
                  className={`land-testimonial__dot${i === current ? " land-testimonial__dot--active" : ""}`}
                  onClick={() => {
                    goTo(i);
                    startAutoplay();
                  }}
                  aria-label={`Go to testimonial ${i + 1}`}
                />
              ))}
            </div>

            <button
              className="land-testimonial__arrow"
              onClick={() => {
                goNext();
                startAutoplay();
              }}
              aria-label="Next testimonial"
            >
              <svg
                width="18"
                height="18"
                viewBox="0 0 20 20"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M7 4l6 6-6 6" />
              </svg>
            </button>
          </div>
        </div>
      </Reveal>
    </section>
  );
}
