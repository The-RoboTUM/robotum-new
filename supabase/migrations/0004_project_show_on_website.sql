-- Lets admins hide a project from the public site entirely (list, homepage,
-- detail page) without deleting it. Paused/completed projects stay visible in
-- the "Project history" section unless this is false.
alter table public.projects
add column if not exists show_on_website boolean not null default true;

notify pgrst, 'reload schema';
