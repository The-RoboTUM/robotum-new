-- Record WHEN a member became graduated, like inactive_since / suspended_at /
-- deleted_at do for the other statuses. Shown in /admin/members.
-- Existing graduated members stay NULL (date unknown).
-- BEFORE trigger, so it only touches NEW.graduated_at and fires no other
-- automation. Safe to re-run.

alter table public.members_personal
  add column if not exists graduated_at timestamptz;

create or replace function public.set_graduated_at()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  if new.status = 'graduated'
     and (tg_op = 'INSERT' or old.status is distinct from 'graduated') then
    new.graduated_at := coalesce(new.graduated_at, now());
  end if;
  return new;
end;
$$;

revoke all on function public.set_graduated_at() from public, anon, authenticated;

drop trigger if exists member_set_graduated_at on public.members_personal;
create trigger member_set_graduated_at
  before insert or update of status on public.members_personal
  for each row execute function public.set_graduated_at();

notify pgrst, 'reload schema';
