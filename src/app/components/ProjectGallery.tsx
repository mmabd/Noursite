import { useState, useCallback } from "react";
import { useLanguage } from "../i18n";
import { useFonts } from "../lib/fonts";
import { Reveal } from "./Reveal";

interface ProjectGalleryProps {
  images: string[];
  projectName: string;
}

export function ProjectGallery({ images, projectName }: ProjectGalleryProps) {
  const { copy } = useLanguage();
  const { fontBody } = useFonts();
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  const openLightbox = useCallback((i: number) => setLightboxIndex(i), []);
  const closeLightbox = useCallback(() => setLightboxIndex(null), []);

  const goNext = useCallback(() => {
    setLightboxIndex((prev) => (prev !== null ? (prev + 1) % images.length : null));
  }, [images.length]);

  const goPrev = useCallback(() => {
    setLightboxIndex((prev) =>
      prev !== null ? (prev - 1 + images.length) % images.length : null,
    );
  }, [images.length]);

  if (images.length === 0) return null;

  return (
    <>
      <section className="land-section" style={{ paddingTop: 40, paddingBottom: 60 }}>
        <Reveal delay={0}>
          <div className="land-label" style={{ marginBottom: 24 }}>
            {copy.projectPage.gallery ?? "Gallery"}
          </div>
        </Reveal>

        {/* Pinterest-style masonry via CSS columns */}
        <div
          style={{
            columns: images.length <= 2 ? "2 280px" : "3 280px",
            columnGap: 10,
          }}
        >
          {images.map((src, i) => (
            <button
              key={src}
              onClick={() => openLightbox(i)}
              style={{
                display: "block",
                width: "100%",
                padding: 0,
                marginBottom: 10,
                border: "none",
                background: "none",
                cursor: "pointer",
                breakInside: "avoid",
                overflow: "hidden",
                borderRadius: 6,
              }}
            >
              <img
                src={src}
                alt={`${projectName} — ${i + 1}`}
                loading="lazy"
                style={{
                  width: "100%",
                  display: "block",
                  borderRadius: 6,
                  transition: "transform 0.4s ease",
                }}
                onMouseEnter={(e) => { e.currentTarget.style.transform = "scale(1.03)"; }}
                onMouseLeave={(e) => { e.currentTarget.style.transform = "scale(1)"; }}
              />
            </button>
          ))}
        </div>
      </section>

      {/* Lightbox */}
      {lightboxIndex !== null && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 9999,
            background: "rgba(0,0,0,0.92)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: "pointer",
          }}
          onClick={closeLightbox}
          onKeyDown={(e) => {
            if (e.key === "Escape") closeLightbox();
            if (e.key === "ArrowRight") goNext();
            if (e.key === "ArrowLeft") goPrev();
          }}
          tabIndex={0}
          ref={(el) => el?.focus()}
        >
          {/* Close button */}
          <button
            onClick={closeLightbox}
            style={{
              position: "absolute",
              top: 20,
              right: 24,
              background: "none",
              border: "none",
              color: "#fff",
              fontSize: 32,
              cursor: "pointer",
              fontFamily: fontBody,
              zIndex: 10,
            }}
          >
            &times;
          </button>

          {/* Prev */}
          <button
            onClick={(e) => { e.stopPropagation(); goPrev(); }}
            style={{
              position: "absolute",
              left: 16,
              top: "50%",
              transform: "translateY(-50%)",
              background: "rgba(255,255,255,0.1)",
              border: "none",
              color: "#fff",
              fontSize: 28,
              width: 48,
              height: 48,
              borderRadius: "50%",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              zIndex: 10,
            }}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="15 18 9 12 15 6" />
            </svg>
          </button>

          {/* Image */}
          <img
            src={images[lightboxIndex]}
            alt={`${projectName} — ${lightboxIndex + 1}`}
            onClick={(e) => e.stopPropagation()}
            style={{
              maxWidth: "90vw",
              maxHeight: "90vh",
              objectFit: "contain",
              borderRadius: 8,
              cursor: "default",
            }}
          />

          {/* Next */}
          <button
            onClick={(e) => { e.stopPropagation(); goNext(); }}
            style={{
              position: "absolute",
              right: 16,
              top: "50%",
              transform: "translateY(-50%)",
              background: "rgba(255,255,255,0.1)",
              border: "none",
              color: "#fff",
              fontSize: 28,
              width: 48,
              height: 48,
              borderRadius: "50%",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              zIndex: 10,
            }}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="9 18 15 12 9 6" />
            </svg>
          </button>

          {/* Counter */}
          <div
            style={{
              position: "absolute",
              bottom: 24,
              left: "50%",
              transform: "translateX(-50%)",
              color: "rgba(255,255,255,0.6)",
              fontFamily: fontBody,
              fontSize: 13,
              letterSpacing: "0.1em",
            }}
          >
            {lightboxIndex + 1} / {images.length}
          </div>
        </div>
      )}
    </>
  );
}
