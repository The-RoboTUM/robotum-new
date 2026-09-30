alter type public.membership_type
add value if not exists 'Board' before 'Founders';

alter table public.member_memberships
add column if not exists title text;

notify pgrst, 'reload schema';
