# Architecture

## Overview

The RoboTUM website is a React + Vite frontend deployed on Vercel.
It uses Supabase for structured content, authentication, and media storage.
The codebase is organized around route pages, reusable sections/components, a centralized data layer, and a protected admin area.

## Core principles

- UI components should stay presentation-focused.
- Data fetching must go through centralized API files in `src/data`.
- Supabase is the source of truth for dynamic website content.
- Pages compose sections; sections compose shared UI components.
- Reuse existing patterns before introducing new abstractions.
- Prefer explicit, readable code over overly clever solutions.

## Folder structure

- `src/pages`  
  Route-level pages such as Home, About, Events, Projects, Partners, FAQs, and admin pages.

- `src/components`  
  Reusable UI and section components.
  - `sections/` contains section-level components grouped by page or context
  - `ui/` contains low-level reusable UI building blocks
  - `admin/` contains admin layouts and admin-specific UI helpers

- `src/data`  
  Centralized data layer. All Supabase queries should live here.

- `src/lib`  
  Shared library setup such as the Supabase client.

- `src/utils`  
  Formatting and helper utilities.

- `src/styles`  
  Shared styles, global tokens, and utility classes.

- `public`  
  Static public files such as `robots.txt`, `sitemap.xml`, and other non-bundled assets.

## Routing

Routing is handled with React Router.

- Public pages use standard routes such as `/`, `/about`, `/events`, `/projects`, `/partners`, etc.
- Dynamic detail pages are slug-based:
  - `/projects/:slug`
  - `/events/:slug`
- Admin pages live under `/admin/*`
- Protected admin pages are wrapped with `AdminRoute`

## Data flow

The standard data flow is:

1. A page or section calls a function from `src/data/*Api.js`
2. That API function queries Supabase and normalizes the result
3. The component renders loading, error, and success states

UI components should not directly call Supabase.

## Supabase usage

Supabase is used for:

- structured data (events, partners, projects, FAQs, members, applications)
- admin authentication
- storage for media assets

Guidelines:
- verify RLS before assuming a frontend issue
- use nested selects when relationships are needed
- select only required columns
- keep schema changes reflected in API files

## Media and storage

Media files are stored in Supabase Storage.

Important:
- public file URLs may be cached by the CDN
- do not rely on overwriting the same file URL and expecting immediate refresh
- use cache-busting or unique filenames when replacing files
- media URLs should be normalized in the API layer before being passed to components

## Admin area

The admin area manages dynamic website content.

Structure:
- `/admin/login` handles authentication
- `/admin/*` pages are protected with `AdminRoute`
- shared admin UI components should be reused across admin pages
- admin pages should follow the same API-layer pattern as public pages

## Performance approach

- Above-the-fold homepage content is loaded eagerly
- Below-the-fold homepage sections are lazy-loaded with `React.lazy` and `Suspense`
- Avoid redundant refetching
- Keep components lightweight and reusable

## UI conventions

- Use shared UI components such as `Button`, `ImageFrame`, and admin helpers
- Use `section-container` for consistent page width and spacing
- Preserve the current visual language: gradients, dark surfaces, rounded cards, and existing spacing scale
- Preserve existing navigation behavior, including query-parameter-based flows where already used

## Maintenance notes

- When schema changes, update API files first
- When a feature spans multiple files or affects architecture, start with a plan
- When debugging missing content, check query shape and RLS before changing UI