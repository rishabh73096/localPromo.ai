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
