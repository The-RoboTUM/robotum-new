alter table public.projects
add column if not exists show_cover_image boolean not null default true;

alter table public.projects
add column if not exists viewer_id text;

notify pgrst, 'reload schema';