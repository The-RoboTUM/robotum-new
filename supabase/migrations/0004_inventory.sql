create or replace function public.is_current_user_admin()
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select coalesce(
    (
      select p.is_admin
      from public.profiles p
      where p.id = (select auth.uid())
    ),
    false
  );
$$;

revoke all on function public.is_current_user_admin() from public;
revoke all on function public.is_current_user_admin() from anon;
grant execute on function public.is_current_user_admin() to authenticated;



create table if not exists public.inventory_items (
  id uuid primary key default gen_random_uuid(),

  inventory_number text not null unique,
  name text not null,
  category text not null,
  location text,
  condition text not null default 'good',
  description text,

  
  lifecycle_status text not null default 'active'
    check (
      lifecycle_status in ('active', 'maintenance', 'lost', 'retired')
    ),

  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);


-- 3. Ausleihen
create table if not exists public.inventory_loans (
  id uuid primary key default gen_random_uuid(),

  item_id uuid not null
    references public.inventory_items(id)
    on delete restrict,

  borrower_name text not null,
  borrower_email text not null,

  borrowed_at timestamptz not null default now(),
  due_at timestamptz not null,
  returned_at timestamptz,

  created_at timestamptz not null default now(),

  constraint inventory_loan_due_after_borrow
    check (due_at > borrowed_at),

  constraint inventory_loan_return_after_borrow
    check (returned_at is null or returned_at >= borrowed_at)
);



create unique index if not exists
  inventory_one_active_loan_per_item
on public.inventory_loans (item_id)
where returned_at is null;



create table if not exists public.inventory_loan_requests (
  id uuid primary key default gen_random_uuid(),

  item_id uuid not null
    references public.inventory_items(id)
    on delete restrict,

  requester_user_id uuid not null
    references auth.users(id)
    on delete cascade,

  requested_at timestamptz not null default now(),
  desired_due_at timestamptz not null,
  message text,

  status text not null default 'pending'
    check (
      status in ('pending', 'approved', 'rejected', 'cancelled')
    ),

  created_at timestamptz not null default now(),

  constraint inventory_request_due_after_request
    check (desired_due_at > requested_at)
);


create unique index if not exists
  inventory_one_pending_request_per_member_item
on public.inventory_loan_requests (item_id, requester_user_id)
where status = 'pending';


create or replace function public.set_inventory_updated_at()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists inventory_items_updated_at
on public.inventory_items;

create trigger inventory_items_updated_at
before update on public.inventory_items
for each row
execute function public.set_inventory_updated_at();


alter table public.inventory_items enable row level security;
alter table public.inventory_loans enable row level security;
alter table public.inventory_loan_requests enable row level security;


create policy "Admins manage inventory items"
on public.inventory_items
for all
to authenticated
using (public.is_current_user_admin())
with check (public.is_current_user_admin());


create policy "Admins manage inventory loans"
on public.inventory_loans
for all
to authenticated
using (public.is_current_user_admin())
with check (public.is_current_user_admin());


create policy "Admins manage inventory requests"
on public.inventory_loan_requests
for all
to authenticated
using (public.is_current_user_admin())
with check (public.is_current_user_admin());

create policy "Members read own inventory requests"
on public.inventory_loan_requests
for select
to authenticated
using (requester_user_id = (select auth.uid()));

create policy "Members create own inventory requests"
on public.inventory_loan_requests
for insert
to authenticated
with check (requester_user_id = (select auth.uid()));


revoke all on public.inventory_items from anon, authenticated;
revoke all on public.inventory_loans from anon, authenticated;
revoke all on public.inventory_loan_requests from anon, authenticated;

grant select, insert, update, delete
on public.inventory_items to authenticated;

grant select, insert, update, delete
on public.inventory_loans to authenticated;

grant select, insert, update, delete
on public.inventory_loan_requests to authenticated;



create or replace view public.inventory_catalog
with (security_barrier = true)
as
select
  i.id,
  i.inventory_number,
  i.name,
  i.category,
  i.location,
  i.condition,
  i.description,
  i.lifecycle_status,
  i.created_at,

  exists (
    select 1
    from public.inventory_loans l
    where l.item_id = i.id
      and l.returned_at is null
  ) as is_borrowed

from public.inventory_items i
where i.lifecycle_status <> 'retired';


grant select on public.inventory_catalog to anon, authenticated;
