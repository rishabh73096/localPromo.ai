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
