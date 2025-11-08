import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom';

import Button from '@components/ui/Button';
import * as assets from '@assets';

const links = [
  { label: 'Home', href: '/' },
  { label: 'About us', href: '/about' },
  {
    label: 'Projects',
    href: '/projects',
    dropdown: true,
    subLinks: ['Technical', 'Operations', 'Innovation & Entrepreneurship'],
  },
  { label: 'Events', href: '/events' },
  { label: 'Partners', href: '/partners' },
  { label: 'Join us', href: '/join' },
];

const PROJECT_TABS = [
  { label: 'Technical', key: 'technical' },
  { label: 'Operations', key: 'operations' },
  { label: 'Innovation & Entrepreneurship', key: 'innovation' },
];

function ProjectDropdown({ open, onEnter, onLeave, onItemClick, onSelectType }) {
  if (!open) return null;

  return (
    <div
      className="absolute left-0 top-full min-w-44 rounded-md bg-[#0E1C3D]/90 px-2 py-2 shadow-[0_0_25px_rgba(0,0,0,0.5)] ring-1 ring-white/10 z-50 backdrop-blur-sm"
      onMouseEnter={onEnter}
      onMouseLeave={onLeave}
    >
      {PROJECT_TABS.map(tab => (
        <button
          key={tab.key}
          type="button"
          role="menuitem"
          tabIndex={0}
          className="w-full text-left block px-3 py-2 text-[14px] tracking-[0.8px] rounded text-white/90 hover:bg-white/10 hover:text-white transition-colors duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400 cursor-pointer"
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
  const [open, setOpen] = useState(false);
  const [projectsOpen, setProjectsOpen] = useState(false);
  const [projectsMobileOpen, setProjectsMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const hoverTimer = useRef(null);
  const { hash: currentHash, pathname } = useLocation();
  const navRef = useRef(null);
  const navigate = useNavigate();

  const handleProjectsEnter = useCallback(() => {
    if (hoverTimer.current) clearTimeout(hoverTimer.current);
    setProjectsOpen(true);
  }, []);

  const handleProjectsLeave = useCallback(() => {
    if (hoverTimer.current) clearTimeout(hoverTimer.current);
    hoverTimer.current = setTimeout(() => setProjectsOpen(false), 150);
  }, []);

  const handleSelectProjectsType = useCallback(
    key => {
      navigate(`/projects?type=${key}`);
      setProjectsOpen(false);
      setOpen(false);
      setProjectsMobileOpen(false);
    },
    [navigate]
  );

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', onScroll);

    const handleKeyDown = e => {
      if (e.key === 'Escape') {
        setOpen(false);
        setProjectsOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  useEffect(() => {
    const body = document.body;
    if (open) {
      body.style.overflow = 'hidden';
      body.classList.add('blurred-overlay');
    } else {
      body.style.overflow = 'auto';
      body.classList.remove('blurred-overlay');
    }
    return () => {
      body.style.overflow = 'auto';
      body.classList.remove('blurred-overlay');
    };
  }, [open]);

  // Click-outside handler for closing mobile menu
  useEffect(() => {
    function handleClickOutside(e) {
      if (!open) return
      if (navRef.current && !navRef.current.contains(e.target)) {
        setOpen(false)
        setProjectsOpen(false)
        setProjectsMobileOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    document.addEventListener('touchstart', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
      document.removeEventListener('touchstart', handleClickOutside)
    }
  }, [open])

  const itemBase =
    'inline-flex items-center justify-center px-4 py-3 text-[14px] tracking-[0.8px] font-normal text-white transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400 hover:text-indigo-300 cursor-pointer';

  return (
    <nav
      ref={navRef}
      role="navigation"
      aria-label="Main"
      className={`fixed top-0 left-0 right-0 z-50 font-sans transition-all duration-500 backdrop-blur-xl bg-primary/40 border-b border-white/10 shadow-[0_0_20px_rgba(0,0,0,0.3)] ${
        scrolled ? 'backdrop-blur-2xl bg-primary/60' : 'backdrop-blur-xl bg-primary/40'
      }`}
    >
      <div className="mx-auto max-w-7xl w-full px-2 sm:px-4 pt-3 pb-1.5">
        <div className="flex w-full justify-between items-center">
          <Link
            to="/"
            className="pl-3 pr-3 flex items-center"
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          >
            <img
              src={assets.navLogo}
              alt="RoboTUM logo"
              className="w-[120px] h-11 object-contain opacity-90 hover:opacity-100 transition-opacity"
            />
          </Link>

          <ul className="hidden md:flex items-center gap-0">
            {links.map(l => {
              if (l.dropdown) {
                return (
                  <li
                    key={l.label}
                    className="relative"
                    onMouseEnter={handleProjectsEnter}
                    onMouseLeave={handleProjectsLeave}
                  >
                    <button
                      type="button"
                      onClick={() => setProjectsOpen(o => !o)}
                      aria-haspopup="true"
                      aria-expanded={projectsOpen}
                      className={`${itemBase} rounded-md ${pathname.startsWith('/projects') ? 'text-indigo-300' : ''}`}
                    >
                      {l.label.toUpperCase()}
                      <svg
                        className={`ml-2 h-3 w-3 transition-transform ${projectsOpen ? 'rotate-180' : ''}`}
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
                    <ProjectDropdown
                      open={projectsOpen}
                      onEnter={handleProjectsEnter}
                      onLeave={handleProjectsLeave}
                      onItemClick={() => setProjectsOpen(false)}
                      onSelectType={handleSelectProjectsType}
                    />
                  </li>
                );
              }
              if (l.label === 'Join us') {
                return (
                  <li key={l.label}>
                    <Button variant="primary" as="link" to="/join" className="ml-2 text-sm px-4 py-2">
                      {l.label.toUpperCase()}
                    </Button>
                  </li>
                );
              }
              return (
                <li key={l.label}>
                  <NavLink
                    to={l.href}
                    className={({ isActive }) =>
                      `${itemBase} rounded-md ${
                        isActive || currentHash === l.href ? 'text-indigo-300' : ''
                      }`
                    }
                  >
                    {l.label.toUpperCase()}
                  </NavLink>
                </li>
              );
            })}
          </ul>

          <button
            className="md:hidden inline-flex items-center justify-center w-10 h-10 mr-2 rounded-md cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400"
            aria-expanded={open}
            aria-label="Toggle navigation menu"
            onClick={() => setOpen(o => !o)}
          >
            <span className="sr-only">Menu</span>
            {open ? (
              <svg
                className="h-6 w-6 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <div className="space-y-1">
                <span className="block h-0.5 w-6 bg-white" />
                <span className="block h-0.5 w-6 bg-white" />
                <span className="block h-0.5 w-6 bg-white" />
              </div>
            )}
          </button>
        </div>
      </div>

      {/* Blurred clickable overlay for mobile menu */}
      {open && (
        <div
          className="fixed inset-0 z-40 md:hidden bg-black/40 backdrop-blur-md transition-opacity duration-300"
          onClick={() => {
            setOpen(false)
            setProjectsOpen(false)
            setProjectsMobileOpen(false)
          }}
          aria-hidden="true"
        />
      )}
      <div
        className={`md:hidden relative z-50 px-4 navbar-gradient transition-all duration-400 ${
          open ? 'opacity-100 max-h-screen pb-3 overflow-y-auto' : 'opacity-0 max-h-0 overflow-hidden'
        }`}
      >
        <ul className="flex flex-col gap-1">
          {links.map(l => {
            if (l.subLinks) {
              return (
                <li key={l.label}>
                  <button
                    onClick={() => setProjectsMobileOpen(v => !v)}
                    className="w-full flex items-center justify-between px-4 py-3 rounded-md bg-[#112238] text-white hover:bg-[#1A2E49] transition-colors focus:outline-none"
                    aria-expanded={projectsMobileOpen}
                  >
                    <span className="text-[14px] tracking-[0.8px] font-medium">{l.label.toUpperCase()}</span>
                    <svg
                      className={`h-4 w-4 ml-2 transition-transform ${projectsMobileOpen ? 'rotate-180' : ''}`}
                      viewBox="0 0 12 8"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path d="M1.5 1.5L6 6L10.5 1.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </button>

                  <div
                    className={`transition-all duration-300 ease-in-out overflow-hidden ${
                      projectsMobileOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
                    }`}
                  >
                    <ul className="ml-4 mt-2 bg-[#06142B]/95 rounded-md p-2">
                      {l.subLinks.map(sub => (
                        <li key={sub}>
                          <button
                            type="button"
                            className="w-full text-left block px-4 py-2 text-[13px] text-white hover:bg-white/10 rounded cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400"
                            onClick={() =>
                              handleSelectProjectsType(PROJECT_TABS.find(t => t.label === sub)?.key || 'technical')
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

            if (l.label === 'Join us') {
              return (
                <li key={l.label}>
                  <Button
                    variant="primary"
                    as="link"
                    to={l.href}
                    className="block w-full text-center text-[14px] tracking-[0.8px] font-semibold"
                    onClick={() => {
                      setOpen(false);
                      setProjectsOpen(false);
                    }}
                  >
                    {l.label.toUpperCase()}
                  </Button>
                </li>
              );
            }

            return (
              <li key={l.label}>
                <NavLink
                  to={l.href}
                  onClick={() => {
                    setOpen(false);
                    setProjectsOpen(false);
                  }}
                  className={({ isActive }) =>
                    `block w-full px-4 py-3 text-[14px] tracking-[0.8px] rounded-md bg-[#112238] hover:bg-[#1A2E49] transition-colors focus:outline-none text-white ${
                      isActive || currentHash === l.href ? 'text-indigo-300' : ''
                    }`
                  }
                >
                  {l.label.toUpperCase()}
                </NavLink>
              </li>
            );
          })}
        </ul>
      </div>
    </nav>
  );
}