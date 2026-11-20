-- Admin write access for /admin/members.
--
-- member_status (enum + members_personal.status) already exists in the live DB,
-- so this only adds what the admin page is missing:
-- - member_memberships: public read existed, but no write policy (deletes were
--   silently no-ops under RLS)
-- - member_projects: no policy at all (not even admins could read it)
--
-- Existing triggers (on_access_row_changed -> member-access Edge Function)
-- are SECURITY DEFINER, so they keep firing for admin edits.
-- Temporary: replaced by can_access('members', ...) once per-area permissions land.
-- Safe to re-run.

do $$
begin
  if not exists (select 1 from pg_policies where schemaname = 'public'
                 and tablename = 'member_memberships' and policyname = 'Admins manage member memberships') then
    create policy "Admins manage member memberships" on public.member_memberships
      for all to authenticated
      using (public.is_current_user_admin()) with check (public.is_current_user_admin());
  end if;

  if not exists (select 1 from pg_policies where schemaname = 'public'
                 and tablename = 'member_projects' and policyname = 'Admins manage member projects') then
    create policy "Admins manage member projects" on public.member_projects
      for all to authenticated
      using (public.is_current_user_admin()) with check (public.is_current_user_admin());
  end if;
end
$$;

notify pgrst, 'reload schema';
