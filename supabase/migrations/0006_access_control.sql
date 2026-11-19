-- Access control for the /admin area + self sign-up.
--
-- Who may do what is DATA, not code: rows in public.access_grants.
-- A grant gives `read` or `write` (write implies read) on one admin area, or on
-- all areas when `area` is null, to everyone matching ALL of its non-null
-- subject columns:
--   membership_type  e.g. Seniors            (member_memberships)
--   department_slug  e.g. the Ops department (member_projects.department_slug)
--   member_id        one specific person
-- Only members with status active/inactive get anything from grants.
-- profiles.is_admin stays a full override (all areas, write, and later: managing grants).
--
-- People are identified by their CONFIRMED login email = members_personal.robotum_email.
--
-- Run order: after 0003 and 0004. Then, in the dashboard:
--   Authentication -> Hooks -> "Before User Created" -> Postgres -> public.hook_before_user_created
-- and only after that enable email sign-ups (see the PR / chat instructions).
-- Safe to re-run.

-- ---------------------------------------------------------------------------
-- 1) Areas + levels (enums, so the website lists them via get_enum_values)
--    Add a new admin page later with: alter type public.access_area add value 'robocast';
-- ---------------------------------------------------------------------------
do $$
begin
  create type public.access_area as enum (
    'events', 'faqs', 'partners', 'projects', 'inventory', 'members'
  );
exception when duplicate_object then null;
end $$;

do $$
begin
  create type public.access_level as enum ('read', 'write');
exception when duplicate_object then null;
end $$;

-- ---------------------------------------------------------------------------
-- 2) Grants table
-- ---------------------------------------------------------------------------
create table if not exists public.access_grants (
  id              uuid primary key default gen_random_uuid(),
  area            public.access_area,                  -- null = every area
  level           public.access_level not null,
  membership_type public.membership_type,
  department_slug text references public.departments (slug) on delete cascade,
  member_id       uuid references public.members_personal (id) on delete cascade,
  note            text,
  created_at      timestamptz not null default now(),
  constraint access_grants_has_subject
    check (num_nonnulls(membership_type, department_slug, member_id) >= 1)
);

alter table public.access_grants enable row level security;

-- Only full admins see/edit grants directly. Everyone else learns their own
-- permissions through my_access() (security definer, below).
do $$
begin
  if not exists (select 1 from pg_policies where schemaname = 'public'
                 and tablename = 'access_grants' and policyname = 'Admins manage access grants') then
    create policy "Admins manage access grants" on public.access_grants
      for all to authenticated
      using (public.is_current_user_admin()) with check (public.is_current_user_admin());
  end if;
end $$;

-- Starting rules (only if the table is still empty):
--   Seniors                                   -> read everything
--   Board / Department Heads / Project Leads  -> write everything
-- Juniors get nothing until someone adds a grant for them (or sets is_admin).
insert into public.access_grants (area, level, membership_type, note)
select null, v.level::public.access_level, v.mt::public.membership_type, 'default'
from (values ('read', 'Seniors'),
             ('write', 'Board'),
             ('write', 'Department Heads'),
             ('write', 'Project Leads')) as v(level, mt)
where not exists (select 1 from public.access_grants);

-- ---------------------------------------------------------------------------
-- 3) Permission checks
-- ---------------------------------------------------------------------------

-- Does this member get `p_level` on `p_area` (null = on any area) from the grants?
create or replace function public.member_has_access(
  p_member_id uuid,
  p_area      public.access_area default null,
  p_level     public.access_level default 'read'
)
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1
    from public.members_personal m
    join public.access_grants g on true
    where m.id = p_member_id
      and m.status in ('active', 'inactive')
      and (p_area is null or g.area is null or g.area = p_area)
      and (p_level = 'read' or g.level = 'write')
      and (g.member_id is null or g.member_id = m.id)
      and (g.membership_type is null or exists (
            select 1 from public.member_memberships mm
            where mm.member_id = m.id and mm.membership_type = g.membership_type))
      and (g.department_slug is null or exists (
            select 1 from public.member_projects mp
            where mp.member_id = m.id and mp.department_slug = g.department_slug))
  );
$$;

-- The members_personal row of the signed-in user (by confirmed login email).
create or replace function public.current_member_id()
returns uuid
language sql
stable
security definer
set search_path = ''
as $$
  select m.id
  from public.members_personal m
  where m.robotum_email is not null
    and lower(m.robotum_email) = lower((select auth.jwt()) ->> 'email')
  limit 1;
$$;

-- The one check RLS policies and the website use: is_admin, or a matching grant.
create or replace function public.can_access(
  p_area  public.access_area default null,
  p_level public.access_level default 'read'
)
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select public.is_current_user_admin()
      or coalesce(public.member_has_access(public.current_member_id(), p_area, p_level), false);
$$;

-- Everything the website needs to know about the signed-in user, in one call.
create or replace function public.my_access()
returns table (area text, can_read boolean, can_write boolean)
language sql
stable
security definer
set search_path = ''
as $$
  select a::text,
         public.can_access(a, 'read'),
         public.can_access(a, 'write')
  from unnest(enum_range(null::public.access_area)) as a;
$$;

revoke all on function public.member_has_access(uuid, public.access_area, public.access_level) from public, anon, authenticated;
revoke all on function public.current_member_id() from public, anon;
revoke all on function public.can_access(public.access_area, public.access_level) from public, anon;
revoke all on function public.my_access() from public, anon;
grant execute on function public.current_member_id() to authenticated;
grant execute on function public.can_access(public.access_area, public.access_level) to authenticated;
grant execute on function public.my_access() to authenticated;

-- ---------------------------------------------------------------------------
-- 4) Sign-up gate: Auth hook "Before User Created"
--    Only robotum_email addresses of members who get access from a grant may
--    create an account. Runs server-side, so it can't be skipped by calling the
--    Supabase API directly with the public key.
-- ---------------------------------------------------------------------------
create or replace function public.hook_before_user_created(event jsonb)
returns jsonb
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_email  text := lower(event -> 'user' ->> 'email');
  v_member uuid;
begin
  select m.id into v_member
  from public.members_personal m
  where m.robotum_email is not null and lower(m.robotum_email) = v_email
  limit 1;

  if v_member is not null and public.member_has_access(v_member, null, 'read') then
    return '{}'::jsonb;  -- allowed
  end if;

  return jsonb_build_object('error', jsonb_build_object(
    'http_code', 403,
    'message', 'Sign-up is only open to roboTUM members with admin access. Use your @robotum.info address, or ask an admin to give you access.'
  ));
end;
$$;

revoke all on function public.hook_before_user_created(jsonb) from public, anon, authenticated;
grant execute on function public.hook_before_user_created(jsonb) to supabase_auth_admin;
grant usage on schema public to supabase_auth_admin;

-- ---------------------------------------------------------------------------
-- 5) New account -> profiles row, and link members_personal.profile_id once
--    the email is confirmed. Updating profile_id does not fire any member
--    automation (those triggers only watch status / robotum_email).
-- ---------------------------------------------------------------------------
alter table public.profiles alter column department_slug drop not null;

create or replace function public.handle_auth_user()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_member uuid;
  v_name   text;
  v_dept   text;
begin
  -- Never block sign-up / confirmation because of this bookkeeping:
  -- any problem is logged as a warning and the auth action goes through.
  begin
    select m.id, m.full_name into v_member, v_name
    from public.members_personal m
    where m.robotum_email is not null and lower(m.robotum_email) = lower(new.email)
    limit 1;

    if tg_op = 'INSERT' then
      select mp.department_slug into v_dept
      from public.member_projects mp
      where mp.member_id = v_member
      order by mp.access_requested_at
      limit 1;

      insert into public.profiles (id, full_name, department_slug)
      values (new.id, coalesce(v_name, new.email), v_dept)
      on conflict (id) do nothing;
    end if;

    -- Link only confirmed accounts (someone may type an address they don't own).
    if new.email_confirmed_at is not null and v_member is not null
       and exists (select 1 from public.profiles p where p.id = new.id) then
      update public.members_personal
      set profile_id = new.id
      where id = v_member and profile_id is distinct from new.id;
    end if;
  exception when others then
    raise warning 'handle_auth_user(%): %', new.id, sqlerrm;
  end;

  return new;
end;
$$;

revoke all on function public.handle_auth_user() from public, anon, authenticated;

-- Replaces the earlier two-trigger draft, if it was ever applied.
drop trigger if exists on_auth_user_created on auth.users;
drop trigger if exists on_auth_user_confirmed on auth.users;
drop function if exists public.handle_new_auth_user();
drop function if exists public.handle_auth_user_confirmed();

drop trigger if exists on_auth_user_changed on auth.users;
create trigger on_auth_user_changed
  after insert or update of email_confirmed_at on auth.users
  for each row execute function public.handle_auth_user();

-- Backfill: link accounts that already exist (e.g. today's admins).
update public.members_personal m
set profile_id = u.id
from auth.users u
where m.profile_id is null
  and m.robotum_email is not null
  and lower(m.robotum_email) = lower(u.email)
  and u.email_confirmed_at is not null
  and exists (select 1 from public.profiles p where p.id = u.id);

notify pgrst, 'reload schema';
