-- LocalPromo AI: full Supabase setup in one file. Paste into Supabase > SQL Editor and run ONCE.
-- (0001 subscriptions/payments, 0002 admin/profiles, 0003 brand/campaigns/drafts, 0004 test payments, 0005 roles, 0006 plan gating)

-- ===== migrations/0001_subscriptions.sql =====
-- Subscriptions + manual UPI payments. Run in Supabase SQL editor.
-- Flow: user pays via UPI QR -> submits UTR (payments row, 'pending') ->
-- you verify it in your bank/UPI app -> set status = 'verified' -> trigger activates the plan for 30 days.

create table if not exists public.subscriptions (
  user_id uuid primary key references auth.users (id) on delete cascade,
  plan text not null check (plan in ('Starter', 'Pro')),
  status text not null default 'active' check (status in ('active', 'expired')),
  current_period_end timestamptz not null,
  updated_at timestamptz not null default now()
);

create table if not exists public.payments (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null default auth.uid() references auth.users (id) on delete cascade,
  plan text not null check (plan in ('Starter', 'Pro')),
  amount_inr integer not null,
  upi_ref text not null check (upi_ref ~ '^[A-Za-z0-9]{8,24}$'),
  status text not null default 'pending' check (status in ('pending', 'verified', 'rejected')),
  created_at timestamptz not null default now(),
  -- keep prices in sync with config/landing.ts and lib/plans.ts
  constraint payments_amount_matches_plan check ((plan = 'Starter' and amount_inr = 299) or (plan = 'Pro' and amount_inr = 499)),
  constraint payments_upi_ref_unique unique (upi_ref)
);

create index if not exists payments_user_idx on public.payments (user_id, created_at desc);

alter table public.subscriptions enable row level security;
alter table public.payments enable row level security;

create policy "read own subscription" on public.subscriptions for select using (auth.uid() = user_id);

create policy "read own payments" on public.payments for select using (auth.uid() = user_id);
create policy "submit own pending payment" on public.payments for insert
  with check (auth.uid() = user_id and status = 'pending');

-- Activate (or extend) the plan when a payment is marked verified.
create or replace function public.activate_subscription() returns trigger
language plpgsql security definer set search_path = public as $$
begin
  if new.status = 'verified' and old.status is distinct from 'verified' then
    insert into public.subscriptions (user_id, plan, status, current_period_end, updated_at)
    values (new.user_id, new.plan, 'active', now() + interval '30 days', now())
    on conflict (user_id) do update set
      plan = excluded.plan,
      status = 'active',
      current_period_end = greatest(public.subscriptions.current_period_end, now()) + interval '30 days',
      updated_at = now();
  end if;
  return new;
end $$;

create trigger payments_activate after update of status on public.payments
  for each row execute function public.activate_subscription();

-- To verify a payment (SQL editor / service role only; clients cannot update):
--   update public.payments set status = 'verified' where upi_ref = '<UTR>';

-- ===== migrations/0002_admin.sql =====
-- Platform admin (you, the SaaS owner): verify UPI payments, see customers and subscriptions.
-- Run after 0001_subscriptions.sql.

create table if not exists public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  email text,
  name text,
  phone text,
  created_at timestamptz not null default now()
);

create table if not exists public.platform_admins (
  user_id uuid primary key references auth.users (id) on delete cascade
);

alter table public.profiles enable row level security;
alter table public.platform_admins enable row level security;

-- Copy basic details from auth.users so admins can see who a payment belongs to.
create or replace function public.handle_new_user() returns trigger
language plpgsql security definer set search_path = public as $$
begin
  insert into public.profiles (id, email, name, phone)
  values (new.id, new.email, new.raw_user_meta_data ->> 'name', new.raw_user_meta_data ->> 'phone')
  on conflict (id) do nothing;
  return new;
end $$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created after insert on auth.users
  for each row execute function public.handle_new_user();

-- backfill existing users
insert into public.profiles (id, email, name, phone)
select id, email, raw_user_meta_data ->> 'name', raw_user_meta_data ->> 'phone' from auth.users
on conflict (id) do nothing;

create or replace function public.is_platform_admin() returns boolean
language sql security definer stable set search_path = public as $$
  select exists (select 1 from public.platform_admins where user_id = auth.uid());
$$;

create policy "read own profile" on public.profiles for select using (auth.uid() = id);
create policy "admin reads profiles" on public.profiles for select using (public.is_platform_admin());
create policy "read own admin row" on public.platform_admins for select using (auth.uid() = user_id);

create policy "admin reads payments" on public.payments for select using (public.is_platform_admin());
create policy "admin updates payments" on public.payments for update
  using (public.is_platform_admin()) with check (public.is_platform_admin());

create policy "admin reads subscriptions" on public.subscriptions for select using (public.is_platform_admin());
create policy "admin updates subscriptions" on public.subscriptions for update
  using (public.is_platform_admin()) with check (public.is_platform_admin());

-- Make yourself an admin (SQL editor, once):
--   insert into public.platform_admins (user_id) select id from auth.users where email = 'you@example.com';

-- ===== migrations/0003_workspace_data.sql =====
-- LocalPromo workspace data: brand profile, campaigns, drafts. Run after 0001 and 0002.
-- Every row belongs to one user (the workspace owner); plan checks are added in 0006.

-- One JSON row per user: business name, niche, services, tone, language, colour.
create table if not exists public.brand_profiles (
  user_id uuid primary key default auth.uid() references auth.users (id) on delete cascade,
  data jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);

create table if not exists public.campaigns (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null default auth.uid() references auth.users (id) on delete cascade,
  title text not null check (char_length(title) between 1 and 60),
  niche text not null check (niche in ('salon', 'gym', 'cafe', 'retail')),
  template_id text not null default '',
  offer text not null default '' check (char_length(offer) <= 120),
  audience text not null default '' check (char_length(audience) <= 40),
  starts_at timestamptz,
  ends_at timestamptz,
  offer_code text not null default '' check (offer_code = '' or offer_code ~ '^[A-Z0-9]{3,12}$'),
  created_at timestamptz not null default now()
);
create index if not exists campaigns_user_idx on public.campaigns (user_id, created_at desc);

create table if not exists public.drafts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null default auth.uid() references auth.users (id) on delete cascade,
  campaign_id uuid references public.campaigns (id) on delete set null,
  title text not null check (char_length(title) between 1 and 60),
  caption_en text not null default '' check (char_length(caption_en) <= 2200),
  caption_hi text not null default '' check (char_length(caption_hi) <= 2200),
  whatsapp text not null default '' check (char_length(whatsapp) <= 2200),
  poster jsonb not null default '{}'::jsonb,       -- { layout, headline, subline, cta, color }
  status text not null default 'draft' check (status in ('draft', 'ready', 'scheduled', 'published')),
  scheduled_for timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index if not exists drafts_user_idx on public.drafts (user_id, updated_at desc);
create index if not exists drafts_schedule_idx on public.drafts (user_id, scheduled_for) where scheduled_for is not null;

alter table public.brand_profiles enable row level security;
alter table public.campaigns enable row level security;
alter table public.drafts enable row level security;

drop policy if exists "own brand" on public.brand_profiles;
drop policy if exists "own campaigns" on public.campaigns;
drop policy if exists "own drafts" on public.drafts;
create policy "own brand" on public.brand_profiles for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "own campaigns" on public.campaigns for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "own drafts" on public.drafts for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- ===== migrations/0004_test_payments.sql =====
-- Testing mode for plans: lets a signed-in user activate a plan without paying,
-- but ONLY while the 'test_payments' flag below is true. Set it to false before launch.

create table if not exists public.app_flags (
  key text primary key,
  value boolean not null default false
);

alter table public.app_flags enable row level security;
drop policy if exists "anyone can read flags" on public.app_flags;
create policy "anyone can read flags" on public.app_flags for select using (true);

insert into public.app_flags (key, value) values ('test_payments', true)
on conflict (key) do nothing;

create or replace function public.activate_test_plan(p_plan text) returns void
language plpgsql security definer set search_path = public as $$
begin
  if auth.uid() is null then raise exception 'not signed in'; end if;
  if p_plan not in ('Starter', 'Pro') then raise exception 'unknown plan'; end if;
  if not coalesce((select value from public.app_flags where key = 'test_payments'), false) then
    raise exception 'test payments are switched off';
  end if;

  insert into public.subscriptions (user_id, plan, status, current_period_end, updated_at)
  values (auth.uid(), p_plan, 'active', now() + interval '30 days', now())
  on conflict (user_id) do update set
    plan = excluded.plan,
    status = 'active',
    current_period_end = now() + interval '30 days',
    updated_at = now();
end $$;

revoke execute on function public.activate_test_plan(text) from public, anon;
grant execute on function public.activate_test_plan(text) to authenticated;

-- BEFORE LAUNCH run:  update public.app_flags set value = false where key = 'test_payments';

-- ===== migrations/0005_roles_and_checks.sql =====
-- Roles must never come from anything a user can edit (like user_metadata).
-- This adds a server-side role and tightens the admin check.

-- 1) Workspace role lives in profiles. Users can read it but cannot change it
--    (no update policy and no UPDATE grant on profiles).
alter table public.profiles
  add column if not exists role text not null default 'owner' check (role in ('owner', 'admin', 'staff'));

-- 2) New profiles always start as 'owner'. The role sent from the signup form is ignored.
create or replace function public.handle_new_user() returns trigger
language plpgsql security definer set search_path = public as $$
begin
  insert into public.profiles (id, email, name, phone, role)
  values (new.id, new.email, new.raw_user_meta_data ->> 'name', new.raw_user_meta_data ->> 'phone', 'owner')
  on conflict (id) do nothing;
  return new;
end $$;

-- 3) Platform admin = listed in platform_admins AND has a confirmed email.
create or replace function public.is_platform_admin() returns boolean
language sql security definer stable set search_path = public, auth as $$
  select exists (
    select 1
    from public.platform_admins pa
    join auth.users u on u.id = pa.user_id
    where pa.user_id = auth.uid() and u.email_confirmed_at is not null
  );
$$;

-- 4) Make sure signed-in users can never write to the role tables directly.
revoke insert, update, delete on public.profiles from authenticated, anon;
revoke insert, update, delete on public.platform_admins from authenticated, anon;

-- ===== migrations/0006_plan_features.sql =====
-- Plan features enforced in the database (the UI also hides them, but this is the real lock).

-- True when the signed-in user has an active, unexpired plan that includes the feature tier.
-- p_min = 'Starter' (any paid plan) or 'Pro'. Platform admins always pass.
create or replace function public.has_active_plan(p_min text) returns boolean
language sql security definer stable set search_path = public as $$
  select public.is_platform_admin() or exists (
    select 1 from public.subscriptions s
    where s.user_id = auth.uid()
      and s.status = 'active'
      and s.current_period_end > now()
      and (p_min = 'Starter' or s.plan = 'Pro')
  );
$$;

-- Everything in the workspace needs a paid plan (Starter or Pro).
drop policy if exists "own brand" on public.brand_profiles;
drop policy if exists "own campaigns" on public.campaigns;
drop policy if exists "own drafts" on public.drafts;

create policy "own brand" on public.brand_profiles for all
  using (auth.uid() = user_id and public.has_active_plan('Starter')) with check (auth.uid() = user_id and public.has_active_plan('Starter'));
create policy "own campaigns" on public.campaigns for all
  using (auth.uid() = user_id and public.has_active_plan('Starter')) with check (auth.uid() = user_id and public.has_active_plan('Starter'));
create policy "own drafts" on public.drafts for all
  using (auth.uid() = user_id and public.has_active_plan('Starter')) with check (auth.uid() = user_id and public.has_active_plan('Starter'));

-- Pro-only: scheduling on the calendar. Monthly caps on new drafts: Starter 60, Pro 400 (keep in sync with lib/plans.ts).
create or replace function public.enforce_draft_plan() returns trigger
language plpgsql security definer set search_path = public as $$
declare cap integer; used integer; plan_name text;
begin
  if auth.uid() is null then return new; end if; -- service role / SQL editor
  if (new.scheduled_for is not null or new.status = 'scheduled') and not public.has_active_plan('Pro') then
    raise exception 'the content calendar needs the Pro plan';
  end if;

  if tg_op = 'INSERT' and not public.is_platform_admin() then
    select plan into plan_name from public.subscriptions where user_id = auth.uid();
    cap := case when plan_name = 'Pro' then 400 else 60 end;
    select count(*) into used from public.drafts
      where user_id = auth.uid() and created_at >= date_trunc('month', now());
    if used >= cap then raise exception 'monthly draft limit reached'; end if;
  end if;
  return new;
end $$;

drop trigger if exists drafts_enforce_plan on public.drafts;
create trigger drafts_enforce_plan before insert or update on public.drafts
  for each row execute function public.enforce_draft_plan();

-- Platform admin can change a customer's plan (create one if they have none) and their workspace role.
drop policy if exists "admin inserts subscriptions" on public.subscriptions;
create policy "admin inserts subscriptions" on public.subscriptions
  for insert with check (public.is_platform_admin());
grant insert on public.subscriptions to authenticated;

drop policy if exists "admin updates profiles" on public.profiles;
create policy "admin updates profiles" on public.profiles
  for update using (public.is_platform_admin()) with check (public.is_platform_admin());
-- only the role column can ever be written, and only through the admin policy above
grant update (role) on public.profiles to authenticated;

-- ===== grants.sql =====
-- Table privileges for the `authenticated` role (RLS policies still decide which rows). Safe to run more than once.
grant usage on schema public to anon, authenticated;

-- workspace data
grant select, insert, update, delete on public.brand_profiles, public.campaigns, public.drafts to authenticated;

-- billing: customers submit and read payments; admins update them (RLS limits who)
grant select, insert, update on public.payments to authenticated;
grant select, insert, update on public.subscriptions to authenticated;

-- roles and flags
grant select on public.profiles, public.platform_admins to authenticated;
grant update (role) on public.profiles to authenticated;
grant select on public.app_flags to anon, authenticated;
