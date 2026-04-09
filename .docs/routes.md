# Routes

## Public site

- `/`
  - Home page

- `/about`
  - About RoboTUM page

- `/join`
  - Join us page

- `/events`
  - Events overview page

- `/events/:slug`
  - Event detail page for a single event

- `/partners`
  - Partners and sponsors page

- `/impressum`
  - Legal notice / impressum page

- `/privacy-policy`
  - Privacy policy page

- `/gender-and-diversity`
  - Gender and diversity page

- `/projects`
  - Projects overview page
  - Uses query params for tabbed project views:
    - `/projects?type=technical`
    - `/projects?type=operations`
    - `/projects?type=innovation-and-entrepreneurship`

- `/projects/:slug`
  - Project detail page for a single project

- `/robocast`
  - Dedicated Robocast page
  - This is **not** a tab inside `/projects`
  - In the navbar, it appears under the Projects dropdown, but routes to its own page

- `/faqs`
  - Frequently asked questions page

---

## Admin auth

- `/admin/login`
  - Public admin login page

---

## Protected admin area

These routes are wrapped by `AdminRoute` and require admin access.

- `/admin`
  - Admin dashboard

- `/admin/faqs`
  - FAQ management

- `/admin/partners`
  - Partners management

- `/admin/projects`
  - Projects management

- `/admin/events`
  - Events management

### Planned admin routes
- `/admin/applications`
- `/admin/members`

---

## Navigation notes

### Projects dropdown behavior
The top-level **Projects** navbar item contains four dropdown entries:

- Technical → `/projects?type=technical`
- Operations → `/projects?type=operations`
- Innovation & Entrepreneurship → `/projects?type=innovation-and-entrepreneurship`
- Robocast → `/robocast`

Important:
- The first three are tab-like filtered views inside the shared `/projects` page.
- **Robocast is a separate route and separate page.**
- The navbar should treat both `/projects*` and `/robocast` as belonging to the same top-level navigation area.

### Detail page conventions
- Event detail pages use `:slug`
- Project detail pages use `:slug`

---

## SEO notes

Important public routes that should have dedicated metadata:
- `/`
- `/about`
- `/join`
- `/events`
- `/partners`
- `/projects`
- `/robocast`
- `/faqs`

Dynamic detail pages should also generate route-specific metadata where possible:
- `/events/:slug`
- `/projects/:slug`