Plan: Mobile Navbar Professional Polish
Improve the mobile navbar in Navbar.jsx so it looks more professional and visually consistent with your current design system, while keeping existing behavior intact (projects query tabs, separate robocast route, accessibility, and menu logic). The safest approach is a focused polish of mobile-only styles and interaction states, plus a strict overlay/pointer-events validation to ensure background content is not interactable when the menu is open.

Steps

Baseline current behavior in Navbar.jsx: confirm open/close flow, z-index layering, body scroll lock, click-outside handling, and current mobile dropdown behavior before any styling changes.
Refine mobile surface styling in Navbar.jsx: replace hardcoded mobile color treatment with classes that better match the established dark-surface/accent system.
Standardize interaction polish in Navbar.jsx: align focus, hover, and active states for burger button, mobile links, and sub-items so the mobile nav feels cohesive with desktop quality.
Harden non-clickable background behavior in Navbar.jsx: verify and adjust overlay/pointer-events layering so content behind the menu cannot be clicked while preserving backdrop click-to-close.
Tune mobile spacing and hierarchy in Navbar.jsx: improve item rhythm, panel spacing, and readability across 320-768 widths without changing desktop presentation.
Validate shared button sizing consistency between Button.jsx and globals.css: if needed, add missing size utility classes to support consistent Join us button behavior.
Run regression checks for routing and accessibility in Navbar.jsx: ensure projects tabs still route via query params, robocast remains separate, Esc/focus trap remain correct, and transitions are smooth.
Relevant files

Navbar.jsx: primary mobile navbar style and interaction updates.
globals.css: shared style utilities and consistency alignment.
Button.jsx: confirm size contract and avoid style drift.

Verification

Run npm run build to confirm no compile/style regressions.
Run npm run dev and test mobile widths (320, 375, 430, 768): open menu and verify background is not clickable while open.
Confirm interaction behavior: backdrop closes menu, Esc closes menu, focus remains trapped inside mobile menu.
Confirm navigation behavior: projects entries still go to /projects?type=..., robocast still goes to /robocast.
Confirm desktop navbar remains unchanged.
Decisions

Included: mobile navbar styling polish and background non-clickability when open.
Excluded: desktop navbar redesign, route architecture changes, or new navigation patterns.
Preserve existing query-param tab behavior and separate robocast route behavior.