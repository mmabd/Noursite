import { useRef, useEffect, useState, useCallback } from "react";

type Direction = "up" | "down" | "left" | "right";

interface RevealProps {
  children: React.ReactNode;
  /** Stagger delay in ms before this element starts animating */
  delay?: number;
  from?: Direction;
  distance?: number;
  /** Animation duration in ms (default 900) */
  duration?: number;
  className?: string;
  style?: React.CSSProperties;
  id?: string;
  /** Add a subtle scale-up effect (default true) */
  scale?: boolean;
  /** Add a soft blur-in effect */
  blur?: boolean;
  /** If true, element only animates once (default false — re-animates on scroll) */
  once?: boolean;
}

const getInitialTransform = (from: Direction, distance: number, scale: boolean) => {
  const s = scale ? " scale(0.97)" : "";
  switch (from) {
    case "up":    return `translateY(-${distance}px)${s}`;
    case "down":  return `translateY(${distance}px)${s}`;
    case "left":  return `translateX(-${distance}px)${s}`;
    case "right": return `translateX(${distance}px)${s}`;
  }
};

// Computed once at module level — avoids recalculating on every render
const prefersReducedMotion =
  typeof window !== "undefined" &&
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

export function Reveal({
  children,
  delay = 0,
  from = "down",
  distance = 40,
  duration = 900,
  className = "",
  style = {},
  id,
  scale = true,
  blur = false,
  once = false,
}: RevealProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  const hasAnimated = useRef(false);

  const handleIntersect = useCallback(
    ([entry]: IntersectionObserverEntry[], observer: IntersectionObserver) => {
      if (entry.isIntersecting) {
        setVisible(true);
        hasAnimated.current = true;
        if (once) observer.disconnect();
      } else if (hasAnimated.current && !once) {
        // Element left the viewport — softly reset so it can re-animate
        setVisible(false);
      }
    },
    [once],
  );

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(handleIntersect, {
      threshold: 0.08,
    });

    observer.observe(el);
    return () => observer.disconnect();
  }, [handleIntersect]);

  // Cubic bezier for a premium feel — fast start, very gentle landing
  const easing = "cubic-bezier(0.16, 1, 0.3, 1)";

  // Exit animation is shorter & softer — 40% of enter duration, less distance
  const exitDuration = Math.round(duration * 0.4);
  const exitDistance = Math.round(distance * 0.35);

  const getExitTransform = () => {
    const s = scale ? " scale(0.99)" : "";
    switch (from) {
      case "up":    return `translateY(-${exitDistance}px)${s}`;
      case "down":  return `translateY(${exitDistance}px)${s}`;
      case "left":  return `translateX(-${exitDistance}px)${s}`;
      case "right": return `translateX(${exitDistance}px)${s}`;
    }
  };

  const hiddenStyle: React.CSSProperties = {
    opacity: 0,
    transform: hasAnimated.current
      ? getExitTransform()                              // softer reset after first show
      : getInitialTransform(from, distance, scale),     // full offset for first appearance
    filter: blur ? "blur(4px)" : "none",
    transition: hasAnimated.current
      ? [
          `opacity ${exitDuration}ms ${easing}`,
          `transform ${exitDuration}ms ${easing}`,
          blur ? `filter ${exitDuration}ms ${easing}` : "",
        ]
          .filter(Boolean)
          .join(", ")
      : "none",                                          // no transition on initial mount
    willChange: "opacity, transform, filter",
  };

  const visibleStyle: React.CSSProperties = {
    opacity: 1,
    transform: `translate(0, 0)${scale ? " scale(1)" : ""}`,
    filter: "none",
    transition: [
      `opacity ${duration}ms ${easing} ${delay}ms`,
      `transform ${duration}ms ${easing} ${delay}ms`,
      blur ? `filter ${duration * 0.8}ms ${easing} ${delay}ms` : "",
    ]
      .filter(Boolean)
      .join(", "),
    willChange: "auto",
  };

  // Skip animations entirely when user prefers reduced motion
  if (prefersReducedMotion) {
    return (
      <div id={id} className={className} style={style}>
        {children}
      </div>
    );
  }

  return (
    <div
      id={id}
      ref={ref}
      className={className}
      style={{
        ...(visible ? visibleStyle : hiddenStyle),
        ...style,
      }}
    >
      {children}
    </div>
  );
}
