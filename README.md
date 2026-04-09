# RoboTUM Website

Official RoboTUM web application.

## Overview

This repository contains the public website and admin pages for RoboTUM.
It is a React single-page application with route-based pages and Supabase-backed data.

## Tech Stack

- React + Vite
- Tailwind CSS
- React Router
- Supabase

## Project Structure

```text
src/
  assets/        Static images, icons, videos
  components/    Reusable UI and section components
  data/          Centralized API layer (all Supabase reads/writes)
  lib/           Shared clients (Supabase client)
  pages/         Route-level pages
  styles/        Global styles
  utils/         Shared helpers
```

## Routes (Public)

- /
- /about
- /join
- /events
- /events/:slug
- /partners
- /projects
- /projects/:slug
- /robocast
- /faqs
- /impressum
- /privacy-policy
- /gender-and-diversity

Admin routes:

- /admin/login
- /admin (protected)
- /admin/faqs
- /admin/partners
- /admin/projects
- /admin/events

Note: Robocast is a standalone route, not a projects tab.

## Getting Started

1. Install dependencies:

```bash
npm install
```

2. Start development server:

```bash
npm run dev
```

3. Build for production:

```bash
npm run build
```

4. Preview production build:

```bash
npm run preview
```

## Scripts

- npm run dev
- npm run build
- npm run preview
- npm run lint
- npm run lint:fix

## Environment Variables

Create a local `.env` file with required Vite variables.

Typical variables used in this project:

```env
VITE_SUPABASE_URL=
VITE_SUPABASE_ANON_KEY=
VITE_EMAILJS_SERVICE_ID=
VITE_EMAILJS_TEMPLATE_ID=
VITE_EMAILJS_PUBLIC_KEY=
```

Never commit real secrets.

## Conventions

- Keep data fetching in `src/data/*Api.js`.
- Do not call Supabase directly from UI components.
- Reuse existing components and styles before adding new ones.
- Preserve existing route/query behavior, especially `/projects?type=...`.
- Follow the internal rules documented in AGENTS.md and .docs/.
