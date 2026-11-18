-- Member lifecycle status + admin write access for the /admin/members page.
--
-- Run this in the Supabase SQL editor BEFORE deploying the code that uses it:
-- the public About/Join-us member queries select `members_personal.status`
-- and would fail without the column.
--
-- Safe to re-run: every statement is idempotent.

-- 1) Status enum. Declared order = order shown in admin dropdowns, and the
--    first value is the admin form default for new members.
--    "deleted" is a soft delete: the row (and its history) stays, the member
--    is hidden from the public site and can be restored from /admin/members.
do $$
begin
  create type public.member_status as enum (
    'active',
    'inactive',
    'paused',
    'graduated',
    'deleted'
  );
exception
  when duplicate_object then null;
end
$$;

-- 2) Status column. Existing members become 'active'.
alter table public.members_personal
  add column if not exists status public.member_status not null default 'active';

create index if not exists members_personal_status_idx
  on public.members_personal (status);

-- 3) Admin write access. Public read policies are left untouched.
--    Reuses public.is_current_user_admin() from 0004_inventory.sql (run that
--    first). Policies are only created if one with the same name does not
--    exist yet; existing admin policies keep working (policies are OR-ed).
do $$
declare
  t text;
begin
  foreach t in array array['members_personal', 'member_memberships', 'member_projects']
  loop
    if not exists (
      select 1 from pg_policies
      where schemaname = 'public' and tablename = t and policyname = t || '_admin_insert'
    ) then
      execute format(
        'create policy %I on public.%I for insert to authenticated with check (public.is_current_user_admin())',
        t || '_admin_insert', t
      );
    end if;

    if not exists (
      select 1 from pg_policies
      where schemaname = 'public' and tablename = t and policyname = t || '_admin_update'
    ) then
      execute format(
        'create policy %I on public.%I for update to authenticated using (public.is_current_user_admin()) with check (public.is_current_user_admin())',
        t || '_admin_update', t
      );
    end if;

    if not exists (
      select 1 from pg_policies
      where schemaname = 'public' and tablename = t and policyname = t || '_admin_delete'
    ) then
      execute format(
        'create policy %I on public.%I for delete to authenticated using (public.is_current_user_admin())',
        t || '_admin_delete', t
      );
    end if;
  end loop;
end
$$;

notify pgrst, 'reload schema';
