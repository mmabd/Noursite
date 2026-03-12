import { useEffect, useRef, useState } from "react";
import { Outlet, useLocation, useNavigate } from "react-router";
import nourLogo from "../assets/nour.svg";
import nourSideLogo from "../assets/sidelogo.svg";
import { useLanguage } from "./i18n";
import "./unlicensed.css";
import "./landing.css";

const NAV = [
  { label: "Homepage",      id: "home",      scrollId: "home",    route: null },
  { label: "Project One",   id: "project-1", scrollId: null,      route: "/project/1" },
  { label: "Project Two",   id: "project-2", scrollId: null,      route: "/project/2" },
  { label: "Project Three", id: "project-3", scrollId: null,      route: "/project/3" },
  { label: "Project Four",  id: "project-4", scrollId: null,      route: "/project/4" },
  { label: "About",         id: "about",     scrollId: "about",   route: null },
  { label: "Gallery",       id: "gallery",   scrollId: "gallery", route: null },
  { label: "Contact Us",    id: "contact",   scrollId: "contact", route: null },
] as const;

const FacebookIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
    <path d="M24 12.073C24 5.404 18.627 0 12 0S0 5.404 0 12.073C0 18.1 4.388 23.094 10.125 24v-8.437H7.078v-3.49h3.047V9.41c0-3.025 1.792-4.697 4.533-4.697 1.312 0 2.686.235 2.686.235v2.97h-1.513c-1.491 0-1.956.93-1.956 1.886v2.269h3.328l-.532 3.49h-2.796V24C19.612 23.094 24 18.1 24 12.073z"/>
  </svg>
);

const XIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.744l7.737-8.835L1.254 2.25H8.08l4.253 5.622 5.911-5.622zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
  </svg>
);

const InstagramIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.406-11.845a1.44 1.44 0 1 0 0 2.881 1.44 1.44 0 0 0 0-2.881z"/>
  </svg>
);

export function RootLayout() {
  const { language, setLanguage, copy } = useLanguage();
  const location = useLocation();
  const navigate = useNavigate();
  const mainRef = useRef<HTMLElement>(null);
  const isScrollingRef = useRef(false);
  const observerRef = useRef<IntersectionObserver | null>(null);
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [mobileNavClosing, setMobileNavClosing] = useState(false);
  const closeTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const closeMobileNav = () => {
    setMobileNavClosing(true);
    closeTimerRef.current = setTimeout(() => {
      setMobileNavOpen(false);
      setMobileNavClosing(false);
    }, 350); // match animation duration
  };

  // Clean up timer on unmount
  useEffect(() => () => { if (closeTimerRef.current) clearTimeout(closeTimerRef.current); }, []);

  // Derive active item from URL
  const getActiveFromPath = (pathname: string) => {
    const m = pathname.match(/^\/project\/(\d+)$/);
    if (m) return `project-${m[1]}`;
    return "home";
  };

  const [activeNav, setActiveNav] = useState(() => getActiveFromPath(location.pathname));

  // Sync active nav when route changes
  useEffect(() => {
    const fromPath = getActiveFromPath(location.pathname);
    if (fromPath !== "home") {
      // On a project page — set immediately, tear down observer
      setActiveNav(fromPath);
      mainRef.current?.scrollTo({ top: 0 });
      if (observerRef.current) {
        observerRef.current.disconnect();
        observerRef.current = null;
      }
    } else {
      // On home page — let IntersectionObserver handle it
      // Scroll to top when navigating to home without a target
      if (!sessionStorage.getItem("scrollTarget")) {
        mainRef.current?.scrollTo({ top: 0 });
      }
    }
  }, [location.pathname]);

  // Set up IntersectionObserver whenever we're on the home page
  useEffect(() => {
    if (location.pathname !== "/") return;

    // Small delay to let the home page render its sections
    const timer = setTimeout(() => {
      if (observerRef.current) observerRef.current.disconnect();

      const scrollIds = NAV.map((n) => n.scrollId).filter(Boolean) as string[];
      const targets = scrollIds
        .map((id) => document.getElementById(id))
        .filter(Boolean) as HTMLElement[];

      if (targets.length === 0) return;

      observerRef.current = new IntersectionObserver(
        (entries) => {
          if (isScrollingRef.current) return;
          const visible = entries
            .filter((e) => e.isIntersecting)
            .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
          if (visible.length > 0) {
            setActiveNav(visible[0].target.id);
          }
        },
        { root: mainRef.current, threshold: 0.25 }
      );

      targets.forEach((el) => observerRef.current!.observe(el));
    }, 150);

    return () => {
      clearTimeout(timer);
      observerRef.current?.disconnect();
      observerRef.current = null;
    };
  }, [location.pathname]);

  const scrollToSection = (scrollId: string, label: string) => {
    const el = document.getElementById(scrollId);
    const main = mainRef.current;
    if (!el || !main) return;
    isScrollingRef.current = true;
    setActiveNav(scrollId);
    el.scrollIntoView({ behavior: "smooth", block: "start" });
    setTimeout(() => { isScrollingRef.current = false; }, 900);
  };

  const handleNavClick = (item: (typeof NAV)[number]) => {
    if (item.route) {
      // Project page
      navigate(item.route);
    } else if (item.scrollId) {
      if (location.pathname !== "/") {
        // Navigate home first, then scroll
        setActiveNav(item.id);
        navigate("/");
        setTimeout(() => scrollToSection(item.scrollId!, item.label), 300);
      } else {
        scrollToSection(item.scrollId, item.label);
      }
    }
  };

  return (
    <div className="unlicensed-root" dir="ltr">
      {/* ── Desktop Sidebar ──────────────────────────────────── */}
      <aside className="unlicensed-sidebar">
        <div className="unlicensed-logo" onClick={() => navigate("/")} style={{ cursor: "pointer" }}>
          <img src={nourLogo} alt="Nour" className="unlicensed-logo-image" />
        </div>

        <nav className="unlicensed-nav">
          {NAV.map((item) => (
            <button
              key={item.id}
              className={`unlicensed-nav-item ${activeNav === item.id ? "active" : ""}`}
              onClick={() => handleNavClick(item)}
            >
              {copy.shell.nav[item.id === "home"
                ? "home"
                : item.id === "project-1"
                  ? "project1"
                  : item.id === "project-2"
                    ? "project2"
                    : item.id === "project-3"
                      ? "project3"
                      : item.id === "project-4"
                        ? "project4"
                        : item.id === "about"
                          ? "about"
                          : item.id === "gallery"
                            ? "gallery"
                            : "contact"]}
            </button>
          ))}
        </nav>

        <div className="unlicensed-sidebar-footer">
          <div className="unlicensed-language-switch">
            <div className="unlicensed-language-switch__label">{copy.shell.language}</div>
            <div className="unlicensed-language-switch__controls" role="group" aria-label={copy.shell.language}>
              <button
                type="button"
                className={`unlicensed-language-switch__button ${language === "en" ? "active" : ""}`}
                onClick={() => setLanguage("en")}
              >
                EN
              </button>
              <button
                type="button"
                className={`unlicensed-language-switch__button ${language === "ar" ? "active" : ""}`}
                onClick={() => setLanguage("ar")}
              >
                AR
              </button>
            </div>
          </div>

          <div className="unlicensed-socials">
            <a href="#" className="social-icon" aria-label="Facebook"><FacebookIcon /></a>
            <a href="#" className="social-icon" aria-label="X"><XIcon /></a>
            <a href="#" className="social-icon" aria-label="Instagram"><InstagramIcon /></a>
          </div>
        </div>
      </aside>

      {/* ── Mobile Top Bar ───────────────────────────────────── */}
      <div className="unlicensed-topbar">
        <div className="unlicensed-logo" style={{ marginBottom: 0, cursor: "pointer" }} onClick={() => navigate("/")}>
          <img src={nourSideLogo} alt="Nour" className="unlicensed-logo-image unlicensed-logo-image--side" />
        </div>
        <button
          className={`unlicensed-hamburger${mobileNavOpen ? " is-open" : ""}`}
          aria-label={mobileNavOpen ? "Close menu" : "Open menu"}
          onClick={() => mobileNavOpen ? closeMobileNav() : setMobileNavOpen(true)}
        >
          <span /><span /><span />
        </button>
      </div>

      {/* ── Mobile Nav Overlay (full screen) ─────────────────── */}
      {(mobileNavOpen) && (
        <div className={`unlicensed-mobile-nav${mobileNavClosing ? " is-closing" : ""}`}>
          <nav className="unlicensed-mobile-nav__nav">
            {NAV.map((item, i) => (
              <button
                key={item.id}
                className={`unlicensed-mobile-nav__item${activeNav === item.id ? " active" : ""}`}
                style={{ animationDelay: `${60 + i * 45}ms` }}
                onClick={() => {
                  closeMobileNav();
                  handleNavClick(item);
                }}
              >
                {copy.shell.nav[item.id === "home"
                  ? "home"
                  : item.id === "project-1"
                    ? "project1"
                    : item.id === "project-2"
                      ? "project2"
                      : item.id === "project-3"
                        ? "project3"
                        : item.id === "project-4"
                          ? "project4"
                          : item.id === "about"
                            ? "about"
                            : item.id === "gallery"
                              ? "gallery"
                              : "contact"]}
              </button>
            ))}
          </nav>

          <div className="unlicensed-mobile-nav__footer">
            <div className="unlicensed-language-switch">
              <div className="unlicensed-language-switch__label">{copy.shell.language}</div>
              <div className="unlicensed-language-switch__controls" role="group" aria-label={copy.shell.language}>
                <button
                  type="button"
                  className={`unlicensed-language-switch__button ${language === "en" ? "active" : ""}`}
                  onClick={() => setLanguage("en")}
                >
                  EN
                </button>
                <button
                  type="button"
                  className={`unlicensed-language-switch__button ${language === "ar" ? "active" : ""}`}
                  onClick={() => setLanguage("ar")}
                >
                  AR
                </button>
              </div>
            </div>
            <div className="unlicensed-socials">
              <a href="#" className="social-icon" aria-label="Facebook"><FacebookIcon /></a>
              <a href="#" className="social-icon" aria-label="X"><XIcon /></a>
              <a href="#" className="social-icon" aria-label="Instagram"><InstagramIcon /></a>
            </div>
          </div>
        </div>
      )}

      {/* ── Main scrollable area ─────────────────────────────── */}
      <main className="unlicensed-main" ref={mainRef}>
        <Outlet />
      </main>
    </div>
  );
}
