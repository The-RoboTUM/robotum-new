RoboTUM Website

This repository contains the RoboTUM website.

## Tech stack
	-	React + Vite
	-	Tailwind CSS
	-	React Router
	-	Supabase
	-	Vercel hosting
	-	Domain/DNS managed in Wix


## Project rules
	-	Follow the existing design system and class naming patterns.
	-	Reuse existing components before creating new ones.
	-	Keep visual style consistent with current gradients, buttons, spacing, and dark surfaces.
	-	Prefer mobile-first responsive changes.
	-	Do not introduce new UI patterns unless clearly justified.
	-	Keep code readable and production-ready.
	-	Avoid breaking existing routes and query-param navigation.


## File-specific guidance
	-	Navbar project dropdown must preserve tabbed /projects?type=... behavior.
	-	/robocast is a separate page and must not be implemented as a projects tab.
	-	Button styles must follow globals.css and Button.jsx.
	-	SEO changes should align with index.html, robots.txt, sitemap.xml, and .docs/seo.md.


## Data guidance
	-	Supabase tables are the source of truth for events, partners, projects, and robocast episodes.
	-	If a feature depends on joined records, verify RLS and nested selects.
	-	Never assume missing data is a UI bug until the query and policies are checked.



## Data & API rules (VERY IMPORTANT)
	-	All data fetching must go through centralized API files (@data/*Api.js).
	-	UI components must never directly call Supabase.
	-	Always normalize and shape data inside API layer before returning to UI.
	-	When database schema changes, update API layer first, not components.
	-	Always handle null, undefined, and empty states defensively.


## Supabase & RLS rules
	-	Always verify RLS policies before debugging frontend issues.
	-	Public read access must be explicitly allowed for required tables.
	-	Avoid over-fetching: select only required fields.
	-	Use nested selects instead of multiple queries when possible.
	-	Never expose sensitive data in public queries.


## Caching & media rules (CRITICAL)
	-	Supabase Storage uses CDN caching — files may not update immediately.
	-	Never rely on overwriting files with the same URL.
	-	Always use one of:
	-	unique filenames, or
	-	cache-busting query params (?v=timestamp)
	-	Cache-busting must be handled in API layer, not UI components.
	-	Avoid unnecessary cache-busting to reduce bandwidth usage.


## Performance rules
	-	Lazy-load all below-the-fold sections.
	-	Avoid unnecessary re-renders (useMemo/useCallback where needed).
	-	Keep bundle size minimal (no heavy libraries without justification).
	-	Images must be optimized (no oversized assets).
	-	Avoid redundant API calls — reuse fetched data when possible.


## UI/UX consistency rules
	-	All sections must visually align with:
	-	dark surfaces
	-	gradient accents
	-	rounded cards
	-	Maintain consistent spacing scale (section-container, paddings).
	-	Avoid mixing different animation styles.
	-	Hover, focus, and active states must always be defined.


## Routing & navigation rules
	-	Do not break existing routes or deep links.
	-	Preserve query param behavior (/projects?type=..., filters, etc.).
	-	All links must work with both direct navigation and reload.
	-	Use Link instead of <a> for internal navigation.


## Error handling
	-	Always handle loading and error states for async data.
	-	Never leave blank UI if data fails.
	-	Log errors in console with clear context.
	-	User-facing errors must be short and clean.


## Deployment & environment
	-	Environment variables must be used for all keys (Supabase, etc.).
	-	Never hardcode secrets or URLs that may change.
	-	Verify behavior on production (robotum.info), not only localhost.
	-	Be aware of CDN caching differences between local and production.


## Code quality
	-	Prefer clear, explicit code over clever shortcuts.
	-	Keep components small and focused.
	-	Avoid duplicated logic — extract helpers when needed.
	-	Naming must be consistent with existing patterns.


## Planning rule
	-	For any feature that spans multiple files or affects architecture, start with /plan.
	-	Save the approved plan to PLAN.md.
	-	Implement in small steps and update the plan when scope changes.


## Validation
	-	After changes, run build and relevant checks.
	-	Verify mobile layout, navbar behavior, and route navigation.
	-	If a visual component changes, check both desktop and mobile states.

## Working style
- For small edits: inspect, edit, validate.
- For medium features: inspect files, write a short plan in chat, then implement.
- For large features: use `/plan`, save to `PLAN.md`, then implement step by step.
- Before touching data-dependent UI, verify query shape and RLS assumptions.
- Before changing layout, inspect current desktop and mobile class patterns.
- Prefer updating existing components over duplicating them.