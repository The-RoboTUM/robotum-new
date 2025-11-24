import { useState, useEffect, useRef, useCallback } from "react";
import { Link, NavLink, useLocation, useNavigate } from "react-router-dom";

import Button from "@components/ui/Button";
import * as assets from "@assets";

const NAV_LINKS = [
  { label: "Home", href: "/" },
  { label: "About us", href: "/about" },
  {
    label: "Projects",
    href: "/projects",
    dropdown: true,
    subLinks: ["Technical", "Operations", "Innovation & Entrepreneurship"],
  },
  { label: "Events", href: "/events" },
  { label: "Partners", href: "/partners" },
  { label: "Q&A", href: "/faqs" },
  { label: "Join us", href: "/join" },
];

const PROJECT_TABS = [
  { label: "Technical", key: "technical" },
  { label: "Operations", key: "operations" },
  { label: "Innovation & Entrepreneurship", key: "innovation" },
];

function ProjectDropdown({ open, onEnter, onLeave, onItemClick, onSelectType }) {
  if (!open) return null;

  return (
    <div
      role="menu"
      className="absolute left-0 top-full mt-2 min-w-52 rounded-xl bg-[#0E1C3D]/80 px-2.5 py-2.5 shadow-[0_10px_35px_rgba(0,0,0,0.45)] ring-1 ring-white/10 z-50 backdrop-blur-md"
      onMouseEnter={onEnter}
      onMouseLeave={onLeave}
    >
      {PROJECT_TABS.map((tab) => (
        <button
          key={tab.key}
          type="button"
          role="menuitem"
          tabIndex={0}
          className="block w-full rounded-lg px-3 py-2.5 text-left text-[14px] tracking-[0.8px] text-white/90 transition-colors duration-300 hover:bg-white/10 hover:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-accent/60"
          onClick={() => {
            onItemClick();
            onSelectType?.(tab.key);
          }}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
}

export default function Navbar() {
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [isProjectsOpen, setIsProjectsOpen] = useState(false);
  const [isProjectsMobileOpen, setIsProjectsMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const hoverTimeoutRef = useRef(null);
  const navRef = useRef(null);
  const mobileMenuRef = useRef(null);

  const { hash: currentHash, pathname } = useLocation();
  const navigate = useNavigate();

  /* -----------------------------------------------------------------------
   * Handlers
   * --------------------------------------------------------------------- */

  const openProjectsDropdown = useCallback(() => {
    if (hoverTimeoutRef.current) clearTimeout(hoverTimeoutRef.current);
    setIsProjectsOpen(true);
  }, []);

  const closeProjectsDropdown = useCallback(() => {
    if (hoverTimeoutRef.current) clearTimeout(hoverTimeoutRef.current);
    hoverTimeoutRef.current = setTimeout(() => setIsProjectsOpen(false), 150);
  }, []);

  const closeAllMenus = useCallback(() => {
    setIsMobileOpen(false);
    setIsProjectsOpen(false);
    setIsProjectsMobileOpen(false);
  }, []);

  const handleSelectProjectsType = useCallback(
    (key) => {
      navigate(`/projects?type=${key}`);
      closeAllMenus();
    },
    [navigate, closeAllMenus],
  );

  const toggleMobileMenu = () => {
    setIsMobileOpen((prev) => !prev);
    // When toggling main mobile menu, always close project submenu
    setIsProjectsMobileOpen(false);
  };

  /* -----------------------------------------------------------------------
   * Effects
   * --------------------------------------------------------------------- */

  // Scroll + Escape key
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);

    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        closeAllMenus();
      }
    };

    window.addEventListener("scroll", handleScroll);
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [closeAllMenus]);

  // Body scroll lock + blur class for background when mobile menu open
  useEffect(() => {
    const body = document.body;

    if (isMobileOpen) {
      body.style.overflow = "hidden";
      body.classList.add("blurred-overlay", "menu-open");
    } else {
      body.style.overflow = "auto";
      body.classList.remove("blurred-overlay", "menu-open");
    }

    return () => {
      body.style.overflow = "auto";
      body.classList.remove("blurred-overlay", "menu-open");
    };
  }, [isMobileOpen]);

  // Click-outside to close menus on mobile
  useEffect(() => {
    function handleClickOutside(e) {
      if (!isMobileOpen) return;
      if (navRef.current && !navRef.current.contains(e.target)) {
        closeAllMenus();
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("touchstart", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("touchstart", handleClickOutside);
    };
  }, [isMobileOpen, closeAllMenus]);

  // Focus trap inside mobile menu
  useEffect(() => {
    if (!isMobileOpen || !mobileMenuRef.current) return;

    const root = mobileMenuRef.current;
    const focusable = root.querySelectorAll(
      'a[href], button:not([disabled]), textarea, input, select, [tabindex]:not([tabindex="-1"])',
    );
    const first = focusable[0];
    const last = focusable[focusable.length - 1];

    if (first) first.focus();

    function handleKey(e) {
      if (e.key !== "Tab") return;

      if (e.shiftKey) {
        if (document.activeElement === first) {
          e.preventDefault();
          last && last.focus();
        }
      } else {
        if (document.activeElement === last) {
          e.preventDefault();
          first && first.focus();
        }
      }
    }

    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [isMobileOpen]);

  /* -----------------------------------------------------------------------
   * Shared styles
   * --------------------------------------------------------------------- */

  const desktopItemBase =
    "relative group inline-flex items-center justify-center px-4 py-3 text-[14px] tracking-[0.8px] font-medium text-white/90 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-accent/60 hover:text-white";

  /* -----------------------------------------------------------------------
   * Render
   * --------------------------------------------------------------------- */

  return (
    <nav
      ref={navRef}
      role="navigation"
      aria-label="Main"
      style={{ paddingTop: "env(safe-area-inset-top, 0px)" }}
      className={`fixed inset-x-0 top-0 z-60 flex h-14 items-center font-sans md:h-16 border-b border-white/10 shadow-[0_4px_16px_rgba(0,0,0,0.2)] transition-colors duration-500 ${
        scrolled
          ? "bg-[#0B1530]/80 backdrop-blur-2xl"
          : "bg-[#0B1530]/60 backdrop-blur-xl"
      }`}
    >
      <div className="w-full px-4 sm:px-6 lg:px-8">
        <div className="relative z-60 flex w-full items-center justify-between">
          {/* Logo */}
          <Link
            to="/"
            className="flex items-center"
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          >
            <img
              src={assets.navLogo}
              alt="RoboTUM logo"
              className="h-9 w-[110px] opacity-90 transition-opacity hover:opacity-100 md:h-12 md:w-[135px]"
            />
          </Link>

          {/* Desktop navigation */}
          <ul className="ml-auto hidden items-center gap-4 md:flex">
            {NAV_LINKS.map((link) => {
              // Projects dropdown
              if (link.dropdown) {
                const isActive = pathname.startsWith("/projects");

                return (
                  <li
                    key={link.label}
                    className="relative"
                    onMouseEnter={openProjectsDropdown}
                    onMouseLeave={closeProjectsDropdown}
                  >
                    <button
                      type="button"
                      onClick={() => setIsProjectsOpen((prev) => !prev)}
                      aria-haspopup="true"
                      aria-expanded={isProjectsOpen}
                      className={`${desktopItemBase} rounded-md ${
                        isActive ? "text-accent" : ""
                      }`}
                    >
                      {link.label.toUpperCase()}
                      <svg
                        className={`ml-2 h-3 w-3 transition-transform ${
                          isProjectsOpen ? "rotate-180" : ""
                        }`}
                        viewBox="0 0 12 8"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M1.5 1.5L6 6L10.5 1.5"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                      <span
                        aria-hidden
                        className={`pointer-events-none absolute -bottom-0.5 left-3 right-3 h-0.5 origin-left rounded-full bg-accent transition-transform duration-300 ease-out ${
                          isActive
                            ? "scale-x-100"
                            : "scale-x-0 group-hover:scale-x-100"
                        }`}
                      />
                    </button>

                    <ProjectDropdown
                      open={isProjectsOpen}
                      onEnter={openProjectsDropdown}
                      onLeave={closeProjectsDropdown}
                      onItemClick={() => setIsProjectsOpen(false)}
                      onSelectType={handleSelectProjectsType}
                    />
                  </li>
                );
              }

              // Desktop JOIN US button
              if (link.label === "Join us") {
                return (
                  <li key={link.label}>
                    <Button
                      variant="primary"
                      as="link"
                      to="/join"
                      className="ml-2 px-4 py-2 text-sm"
                    >
                      {link.label.toUpperCase()}
                    </Button>
                  </li>
                );
              }

              // Regular desktop links
              return (
                <li key={link.label} className="px-0.5">
                  <NavLink
                    to={link.href}
                    className={({ isActive }) =>
                      `${desktopItemBase} rounded-md ${
                        isActive ||
                        currentHash === link.href ||
                        (link.href !== "/" && pathname.startsWith(link.href))
                          ? "text-accent"
                          : ""
                      }`
                    }
                  >
                    {link.label.toUpperCase()}
                    <span
                      aria-hidden
                      className={`pointer-events-none absolute -bottom-0.5 left-3 right-3 h-0.5 origin-left rounded-full bg-accent transition-transform duration-300 ease-out ${
                        pathname === link.href ||
                        (link.href !== "/" && pathname.startsWith(link.href)) ||
                        currentHash === link.href
                          ? "scale-x-100"
                          : "scale-x-0 group-hover:scale-x-100"
                      }`}
                    />
                  </NavLink>
                </li>
              );
            })}
          </ul>

          {/* Mobile burger button */}
          <button
            type="button"
            className="ml-2 inline-flex h-9 w-9 items-center justify-center rounded-md cursor-pointer transition-transform duration-200 active:scale-95 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400 md:hidden"
            aria-expanded={isMobileOpen}
            aria-controls="mobile-menu"
            aria-label={isMobileOpen ? "Close navigation menu" : "Open navigation menu"}
            onClick={toggleMobileMenu}
          >
            <span className="sr-only">Toggle navigation</span>
            <div className="relative h-6 w-6 transform-gpu transition-transform duration-300 ease-out">
              {/* Close icon */}
              <svg
                className={`absolute inset-0 h-6 w-6 text-white transform-gpu transition-all duration-300 ease-out ${
                  isMobileOpen ? "opacity-100 rotate-0" : "opacity-0 -rotate-90"
                }`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>

              {/* Burger icon */}
              <div
                className={`absolute inset-0 flex flex-col justify-center space-y-1 transform-gpu transition-all duration-300 ease-out ${
                  isMobileOpen ? "opacity-0 rotate-90" : "opacity-100 rotate-0"
                }`}
              >
                <span className="block h-0.5 w-6 rounded bg-white" />
                <span className="block h-0.5 w-6 rounded bg-white" />
                <span className="block h-0.5 w-6 rounded bg-white" />
              </div>
            </div>
          </button>
        </div>
      </div>

      {/* Mobile overlay (blur + no click-through) */}
      {isMobileOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/60 backdrop-blur-sm supports-backdrop-filter:backdrop-blur-md transition-opacity duration-300 ease-out md:hidden"
          onClick={closeAllMenus}
          aria-hidden="true"
        />
      )}

      {/* Mobile menu */}
      <div
        id="mobile-menu"
        ref={mobileMenuRef}
        role="dialog"
        aria-modal="true"
        aria-label="Main navigation"
        className={`fixed left-0 right-0 top-14 z-40 px-4 transform-gpu bg-[#0E1C3D]/95 border-t border-white/10 backdrop-blur-md transition-all duration-350 ease-out md:hidden ${
          isMobileOpen
            ? "pointer-events-auto max-h-[calc(100vh-56px)] translate-y-0 overflow-y-auto pb-4 opacity-100"
            : "pointer-events-none max-h-0 -translate-y-3 overflow-hidden opacity-0"
        }`}
      >
        <ul className="flex flex-col gap-1.5">
          {NAV_LINKS.map((link) => {
            // MOBILE: Projects dropdown
            if (link.subLinks) {
              return (
                <li key={link.label}>
                  <button
                    type="button"
                    onClick={() =>
                      setIsProjectsMobileOpen((prev) => !prev)
                    }
                    className="flex w-full items-center justify-between rounded-lg bg-[#112238] px-4 py-3.5 text-white transition-colors hover:bg-[#1A2E49] focus:outline-none"
                    aria-expanded={isProjectsMobileOpen}
                  >
                    <span className="text-[14px] font-medium tracking-[0.8px]">
                      {link.label.toUpperCase()}
                    </span>
                    <svg
                      className={`ml-2 h-4 w-4 transition-transform ${
                        isProjectsMobileOpen ? "rotate-180" : ""
                      }`}
                      viewBox="0 0 12 8"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M1.5 1.5L6 6L10.5 1.5"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </button>

                  <div
                    className={`overflow-hidden transition-all duration-300 ease-in-out ${
                      isProjectsMobileOpen
                        ? "max-h-96 opacity-100"
                        : "max-h-0 opacity-0"
                    }`}
                  >
                    <ul className="mt-2 rounded-lg bg-secondary/95 px-2.5 py-2">
                      {link.subLinks.map((sub) => (
                        <li key={sub}>
                          <button
                            type="button"
                            className="block w-full cursor-pointer rounded px-4 py-2 text-left text-[13px] text-white transition-colors hover:bg-white/10 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400"
                            onClick={() =>
                              handleSelectProjectsType(
                                PROJECT_TABS.find((t) => t.label === sub)?.key ||
                                  "technical",
                              )
                            }
                          >
                            {sub}
                          </button>
                        </li>
                      ))}
                    </ul>
                  </div>
                </li>
              );
            }

            // MOBILE: Join us CTA
            if (link.label === "Join us") {
              return (
                <li key={link.label}>
                  <Button
                    variant="primary"
                    as="link"
                    to={link.href}
                    className="block w-full text-center text-[14px] font-semibold tracking-[0.8px]"
                    onClick={closeAllMenus}
                  >
                    {link.label.toUpperCase()}
                  </Button>
                </li>
              );
            }

            // MOBILE: regular link
            return (
              <li key={link.label}>
                <NavLink
                  to={link.href}
                  onClick={closeAllMenus}
                  className={({ isActive }) =>
                    `block w-full rounded-lg bg-[#112238] px-4 py-3.5 text-[14px] tracking-[0.8px] text-white transition-colors hover:bg-[#1A2E49] focus:outline-none ${
                      isActive || currentHash === link.href ? "text-accent" : ""
                    }`
                  }
                >
                  {link.label.toUpperCase()}
                </NavLink>
              </li>
            );
          })}
        </ul>
      </div>
    </nav>
  );
}