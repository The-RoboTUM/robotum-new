-- Membership applications from the on-site form at /join/apply.
--
-- Run once in the Supabase SQL editor (like the other migrations). Safe to
-- re-run: everything is "if not exists" / "create or replace" / drop+create.
--
-- What it sets up:
--   1. public.applications      - one row per application (answers as jsonb +
--                                  a few columns for sorting/filtering)
--   2. submit_application()     - the ONLY way the public site writes here.
--                                  Anonymous visitors cannot read, update or
--                                  delete anything, not even their own row.
--   3. storage bucket applications-cv - PRIVATE bucket for CV PDFs.
--                                  Anonymous visitors may upload (insert) only.
--   4. Admins (profiles.is_admin) can read + update applications and read CVs.
--
-- Kept in mind for later (not built yet): per-area access via
-- access_grants (0006), a personal status/edit link (access_token is already
-- generated for it), retention/deletion rules.

-- ── 1. Table ────────────────────────────────────────────────────────────
create table if not exists public.applications (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),

  -- Which application round (e.g. "Winter Semester 2026/27").
  round text,

  status text not null default 'received'
    check (status in (
      'received', 'in_review', 'interview', 'accepted', 'rejected', 'withdrawn'
    )),

  -- Copied out of `answers` so the table is easy to sort and filter.
  first_name text not null,
  last_name text not null,
  email text not null,
  university text,
  degree text,
  field_of_study text,
  semester_of_study text,
  main_skill_area text,

  -- Everything the applicant entered, exactly as the form sent it.
  answers jsonb not null,

  -- Path of the CV inside the applications-cv bucket (null = no CV).
  cv_path text,

  -- Secret for a future "check your application" link. Never exposed yet.
  access_token uuid not null default gen_random_uuid() unique,

  -- Free-form notes / scores from reviewers.
  reviewer_notes text
);

create index if not exists applications_created_at_idx
  on public.applications (created_at desc);
create index if not exists applications_status_idx
  on public.applications (status);
create index if not exists applications_email_idx
  on public.applications (lower(email));

create or replace function public.set_applications_updated_at()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  new.updated_at := now();
  return new;
end;
$$;

drop trigger if exists applications_set_updated_at on public.applications;
create trigger applications_set_updated_at
  before update on public.applications
  for each row execute function public.set_applications_updated_at();

-- ── 2. Row level security ───────────────────────────────────────────────
alter table public.applications enable row level security;

-- No insert/select policy for anon: the public site goes through
-- submit_application() below, which runs with the owner's rights.
drop policy if exists "applications admin read" on public.applications;
create policy "applications admin read"
  on public.applications for select
  to authenticated
  using (public.is_current_user_admin());

drop policy if exists "applications admin update" on public.applications;
create policy "applications admin update"
  on public.applications for update
  to authenticated
  using (public.is_current_user_admin())
  with check (public.is_current_user_admin());

drop policy if exists "applications admin delete" on public.applications;
create policy "applications admin delete"
  on public.applications for delete
  to authenticated
  using (public.is_current_user_admin());

-- ── 3. Submit function (called by the form) ─────────────────────────────
create or replace function public.submit_application(
  p_answers jsonb,
  p_round text default null,
  p_cv_path text default null
)
returns uuid
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_id uuid;
  v_first text := nullif(trim(p_answers->>'firstName'), '');
  v_last  text := nullif(trim(p_answers->>'lastName'), '');
  v_email text := nullif(trim(p_answers->>'email'), '');
begin
  if p_answers is null or jsonb_typeof(p_answers) <> 'object' then
    raise exception 'Invalid application data';
  end if;
  if length(p_answers::text) > 100000 then
    raise exception 'Application is too large';
  end if;
  if v_first is null or v_last is null or v_email is null then
    raise exception 'Name and email are required';
  end if;
  if v_email !~ '^[^\s@]+@[^\s@]+\.[^\s@]+$' then
    raise exception 'Invalid email address';
  end if;
  -- Only accept CV paths the form itself creates: "<uuid>.pdf".
  if p_cv_path is not null
     and p_cv_path !~ '^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}\.pdf$' then
    raise exception 'Invalid CV reference';
  end if;

  insert into public.applications (
    round, first_name, last_name, email,
    university, degree, field_of_study, semester_of_study, main_skill_area,
    answers, cv_path
  ) values (
    left(p_round, 100), left(v_first, 200), left(v_last, 200), left(v_email, 320),
    left(coalesce(nullif(p_answers->>'universityOther', ''), p_answers->>'university'), 300),
    left(p_answers->>'degree', 100),
    left(p_answers->>'fieldOfStudy', 300),
    left(p_answers->>'semester', 20),
    left(p_answers->>'mainSkillArea', 100),
    p_answers,
    p_cv_path
  )
  returning id into v_id;

  return v_id;
end;
$$;

revoke all on function public.submit_application(jsonb, text, text) from public;
grant execute on function public.submit_application(jsonb, text, text) to anon, authenticated;

-- ── 4. CV storage (private bucket) ──────────────────────────────────────
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('applications-cv', 'applications-cv', false, 5242880, array['application/pdf'])
on conflict (id) do update
  set public = false,
      file_size_limit = excluded.file_size_limit,
      allowed_mime_types = excluded.allowed_mime_types;

-- Anyone may upload a CV (insert only - no reading, overwriting or listing).
drop policy if exists "applications cv upload" on storage.objects;
create policy "applications cv upload"
  on storage.objects for insert
  to anon, authenticated
  with check (bucket_id = 'applications-cv');

-- Only admins can open CVs.
drop policy if exists "applications cv admin read" on storage.objects;
create policy "applications cv admin read"
  on storage.objects for select
  to authenticated
  using (bucket_id = 'applications-cv' and public.is_current_user_admin());
