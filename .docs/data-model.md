# Data Model

This document reflects the **exact Supabase database schema** used in the RoboTUM website.

Supabase is the **single source of truth** for all data.

---

## Core principle

- This file must always mirror the real Supabase schema
- Schemas are **never manually rewritten**
- All table definitions are **copied directly from Supabase (SQL format)**

---

## How to update this file

When a table changes:

1. Open Supabase → Table Editor / SQL Editor
2. Copy the table schema (SQL format)
3. Replace the corresponding section in this file
4. Do NOT rewrite or manually edit fields

---

## Schema format (REQUIRED)

All tables must be documented in this format:

```sql
create table public.table_name (
  ...
);

	-	Do not change formatting
	-	Do not simplify fields
	-	Do not convert into descriptions

⸻

Tables

⸻

departments

create table public.departments (
  slug text not null,
  name text not null,
  department_head_id uuid null,
  department_head_name text null,
  constraint departments_pkey primary key (slug),
  constraint departments_head_fkey foreign KEY (department_head_id) references members_personal (id) on delete set null
) TABLESPACE pg_default;


⸻

events

create table public.events (
  created_at timestamp with time zone not null default now(),
  title text not null,
  slug text not null,
  location_name text not null,
  category public.event_category not null,
  is_featured boolean not null default false,
  cover_url text not null,
  description text not null,
  summary text not null,
  registration_url text not null,
  id uuid not null default gen_random_uuid (),
  start_at timestamp with time zone not null,
  end_at timestamp with time zone not null,
  location_url text not null,
  format public.event_format not null default 'Offline'::event_format,
  constraint events_pkey primary key (id),
  constraint Events_slug_key unique (slug)
) TABLESPACE pg_default;


⸻

faqs

create table public.faqs (
  created_at timestamp with time zone not null default now(),
  question text not null,
  answer text not null,
  id uuid not null default gen_random_uuid (),
  category public.faq_category not null,
  constraint faqs_pkey primary key (id),
  constraint FAQs_question_key unique (question)
) TABLESPACE pg_default;


⸻

member_memberships

create table public.member_memberships (
  member_id uuid not null,
  membership_type public.membership_type not null,
  constraint member_memberships_pkey primary key (member_id, membership_type),
  constraint member_memberships_member_id_fkey foreign KEY (member_id) references members_personal (id) on delete CASCADE
) TABLESPACE pg_default;


⸻

member_memberships_with_names

no schema, it is view 


⸻

member_projects

create table public.member_projects (
  project_id uuid not null,
  member_id uuid not null,
  role text not null,
  department_slug text not null,
  constraint project_members_pkey primary key (project_id, member_id),
  constraint project_members_department_slug_fkey foreign KEY (department_slug) references departments (slug),
  constraint project_members_member_id_fkey foreign KEY (member_id) references members_personal (id) on delete CASCADE,
  constraint project_members_project_id_fkey foreign KEY (project_id) references projects (id) on delete CASCADE
) TABLESPACE pg_default;


⸻

member_projects_with_names
no schema, view table


⸻

members_personal

create table public.members_personal (
  created_at timestamp with time zone not null default now(),
  full_name text not null,
  avatar_url text null,
  robotum_email text null,
  phone text null,
  id uuid not null default gen_random_uuid (),
  personal_email text not null,
  profile_id uuid null,
  birthday date not null default '2023-01-01'::date,
  story text null,
  linkedin_url text null,
  university text null,
  study_program text null,
  constraint members_pkey primary key (id),
  constraint members_profile_id_fkey foreign KEY (profile_id) references profiles (id)
) TABLESPACE pg_default;


⸻
partners

create table public.partners (
  created_at timestamp with time zone not null default now(),
  name text not null,
  category public.partner_category not null,
  logo_url text not null,
  website_url text null,
  id uuid not null default gen_random_uuid (),
  priority bigint null default '1'::bigint,
  slug text not null,
  is_active boolean not null default false,
  constraint partners_pkey primary key (id),
  constraint Partners_logo_url_key unique (logo_url),
  constraint partners_slug_key unique (slug)
) TABLESPACE pg_default;


⸻

profiles

create table public.profiles (
  id uuid not null,
  full_name text null,
  created_at timestamp with time zone null default now(),
  is_admin boolean not null default false,
  department_slug text not null,
  constraint profiles_pkey1 primary key (id),
  constraint profiles_department_fkey foreign KEY (department_slug) references departments (slug),
  constraint profiles_id_fkey1 foreign KEY (id) references auth.users (id) on delete CASCADE
) TABLESPACE pg_default;

⸻

projects

create table public.projects (
  id uuid not null default gen_random_uuid (),
  created_at timestamp with time zone not null default now(),
  slug text not null default ''::text,
  name text not null,
  category public.project_category not null,
  summary text not null,
  description text not null,
  status public.project_status null,
  used_tools text null,
  future_plans text null,
  cover_url text not null,
  tags text[] not null,
  is_featured boolean not null,
  project_lead_id uuid null,
  constraint Projects_pkey primary key (id),
  constraint Projects_slug_key unique (slug),
  constraint Projects_title_key unique (name),
  constraint projects_project_lead_id_fkey foreign KEY (project_lead_id) references members_personal (id)
) TABLESPACE pg_default;

⸻

robocast_episode_partners

create table public.robocast_episode_partners (
  episode_id uuid not null,
  partner_id uuid not null,
  role text null,
  priority bigint null default 1,
  constraint robocast_episode_partners_pkey primary key (episode_id, partner_id),
  constraint robocast_episode_partners_episode_id_fkey foreign KEY (episode_id) references robocast_episodes (id) on delete CASCADE,
  constraint robocast_episode_partners_partner_id_fkey foreign KEY (partner_id) references partners (id) on delete RESTRICT
) TABLESPACE pg_default;

⸻

robocast_episodes

create table public.robocast_episodes (
  id uuid not null default gen_random_uuid (),
  created_at timestamp with time zone not null default now(),
  updated_at timestamp with time zone not null default now(),
  title text not null,
  slug text not null,
  summary text null,
  description text null,
  cover_url text null,
  hero_image_url text null,
  spotify_url text null,
  apple_podcasts_url text null,
  youtube_url text null,
  other_links jsonb null,
  published_at timestamp with time zone null,
  duration_seconds integer null,
  is_published boolean not null default false,
  is_featured boolean not null default false,
  season integer null,
  episode_number integer null,
  priority bigint null default 1,
  constraint robocast_episodes_pkey primary key (id),
  constraint robocast_episodes_slug_key unique (slug)
) TABLESPACE pg_default;

create trigger trg_robocast_updated_at BEFORE
update on robocast_episodes for EACH row
execute FUNCTION set_updated_at ();

⸻

Enumerated Types:

public.project_category	
    technical, operations, innovation-and-entrepreneurship	

public.teams	
    Podcast, Creative Robotics, Website Design, Workshop Wednesdays, ITQ Plastix Project, Community Engagement, Robo Republic: European Federation of Robotics Organizations, RoboLabs: Precelerrator for Robotics, RoboWeek, Bookclub & DnD Project, The Humanoid Team	

public.event_category	
    Workshop, Tech & Robotics, Social & Community, Hackathon, Info & Orientation	

public.partner_category
	Lead Sponsors, Sponsors, Industry Collaborators, Academic Collaborators	

public.project_status
	active, paused, completed	

public.faq_category
	About RoboTUM, Membership & Recruitment, Collaboration & Partnerships, Contact	

public.event_format	
    Online, Offline	

public.project_name	
    Website Development, Community Engagement, Generation Robotics, Recruitment, Creative Robotics, Humanoid, Reply Puma Collab, ITQ Plastix, Workshop Wednesdays, GenR Podcast	

public.membership_type	
    Founders, Juniors, Seniors, Department Heads, Project Leads

⸻

Relationships (quick reference)
	•	projects.project_lead_id → members_personal.id
	•	member_memberships.member_id → members_personal.id
	•	member_projects.member_id → members_personal.id
	•	member_projects.project_id → projects.id
	•	member_projects.department_slug → departments.slug

⸻

Data flow (important)

Frontend NEVER queries tables directly.

Correct flow:

Component → API layer (src/data) → Supabase → normalized data → UI

⸻

Media (Supabase Storage)
	•	Images are stored in Supabase Storage
	•	URLs are stored in tables (cover_url, avatar_url, logo_url)

Important:
	•	CDN caching may delay updates
	•	Do NOT rely on overwriting files with same name
	•	Prefer:
	•	unique filenames OR
	•	cache-busting (?v=timestamp)

⸻

RLS (Row Level Security)
	•	Public read access must be enabled for:
	•	projects
	•	events
	•	partners
	•	members_personal (safe fields only)
	•	member_memberships
	•	member_projects
	•	Admin operations must be restricted

⸻
