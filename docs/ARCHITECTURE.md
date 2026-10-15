# LocalPromo AI: Architecture, Flow and Status

Promotion assistant for one local niche (start with salons). Repeatable workflow: saved brand → niche template → AI caption (Hindi/English) → editable poster → calendar. See [../../MAIN-DOCUMENT.md](../../MAIN-DOCUMENT.md).

## 1. Architecture

```
Browser (Next.js 16, React 19, Tailwind 4)
  app/(auth)/*        login · signup · forgot-password
  app/(dashboard)/*   dashboard · create · campaigns · drafts · templates · calendar · brand · settings
  app/admin/*         platform-admin console (payments, customers, subscriptions, plans)
  poster renderer     SVG layouts -> PNG download (client-side)
  public/sw.js        offline pages + static cache; data snapshot in localStorage
        │  Supabase JS (@supabase/ssr), proxy.ts refreshes the session and guards routes
        ▼
Supabase: Auth + Postgres (RLS on every table; plan checks in the database)
```

Rule: **no per-request AI image generation.** Posters come from reusable SVG layouts filled with saved brand data. Captions are template-based today (`lib/promo.ts`); an LLM can replace `generateCopy` later.

## 2. Data model (Supabase)

| Table | Key fields |
|---|---|
| profiles, platform_admins | role lives in the database, never in user_metadata |
| subscriptions, payments | Starter ₹299, Pro ₹499; UPI UTR verified by the admin |
| brand_profiles | one JSON row per user: business, niche, services, tone, language, colour |
| campaigns | title, niche, template_id, offer, audience, dates, offer_code |
| drafts | campaign_id, captions (en/hi), whatsapp, poster JSON, status, scheduled_for |
| app_flags | `test_payments` switch |

Plan limits (calendar = Pro, 60/400 drafts per month) are enforced by the `drafts_enforce_plan` trigger, not only the UI.

## 3. Core flows

**Campaign**
1. First run: owner fills brand profile once (services, prices, address, phone, tone).
2. Create content: choose niche template or festival idea, enter offer and audience, pick language.
3. LLM returns caption variants + WhatsApp-ready copy using saved brand data.
4. Owner edits, picks poster layout, downloads PNG, copies text.
5. Draft placed on calendar; owner marks it published; optional enquiry link/offer code logs enquiries.
6. Repeat usage metric: second and third campaign within 30 days (the retention risk to validate).

No auto-publishing to Instagram until platform permissions are verified.

## 4. Routes

| Route | Purpose | Status |
|---|---|---|
| /login /signup /forgot-password | Auth | Done |
| / | Public landing page | Done |
| /choose-plan | Plan selection after signup | Done |
| /dashboard | Overview (stats, upcoming posts, festivals) | Done |
| /brand | Brand profile | Done |
| /templates | Niche and festival templates | Done |
| /create | Offer form → AI copy → poster editor | Done |
| /campaigns | Campaign list and results | Done |
| /calendar | Month view with drafts | Done |
| /drafts | Saved drafts | Done |
| /settings | Plan and usage | Done |
| /drafts/[id] | Caption and poster editor | Done |
| /admin/* | Platform-admin console | Done |

## 5. API (superseded by Supabase tables above; kept for the MCP design)

`/auth/*` (existing contract) · `GET/PUT /brand` · `GET /templates?niche=` · `POST /campaigns` · `POST /drafts/generate {campaignId, language}` · `PATCH /drafts/:id` · `GET /calendar?month=` · `POST /events` · `GET /usage`.

## 6. MCP build (prototype)

| Tool | Input | Output |
|---|---|---|
| get_brand_profile | none | brand |
| list_templates | niche | templates |
| generate_caption | offer, audience, language, templateId | caption variants + WhatsApp copy |
| create_campaign | title, offer, dates | campaign |
| save_draft | campaignId, caption, posterConfig | draft |
| schedule_draft | draftId, date | draft |
| list_calendar | month | drafts by day |

Resources: `brand://profile`, `template://{id}`. Guardrail: monthly generation cap enforced in `generate_caption`; no publish tool.

## 7. Prototype scope (build order)

1. Backend skeleton + auth + brand profile
2. 10 salon campaign templates (SVG/HTML) + festival list
3. Caption generation (EN/HI) with saved brand context
4. Poster editor + PNG download
5. Calendar and drafts
6. Usage cap, then MCP server

## 8. Feature status

| Feature | Status | Where |
|---|---|---|
| Auth UI: login, signup, forgot password (OTP, 4-digit, 5 min expiry) | Done | `components/auth/`, `app/(auth)/` |
| Session: token store, `AuthProvider`, `useAuthState`, 401 handling | Done | `context/AuthContext.tsx`, `lib/api.ts` |
| Role hook + role-filtered navigation (owner / admin / staff) | Done | `hooks/use-role.ts`, `config/navigation.ts` |
| Dashboard shell: topbar, sidebar, page search (Ctrl/Cmd+K), access-denied | Done | `components/dashboard/` |
| UI kit (forms, tables, modals, tabs, toasts, skeletons, pagination, etc.) | Done | `components/ui/` |
| Zod form schemas + `useForm` hook | Done | `lib/schemas.ts`, `hooks/use-form.ts` |
| Security headers / CSP, open-redirect-safe `next` param | Done | `next.config.ts`, `lib/safe-next.ts` |
| Type-check and production build pass | Done | verified |
| Landing page: hero, flow demo, feature grid, scenarios, pricing, FAQ, CTA | Done | `app/page.tsx`, `components/landing/`, `config/landing.ts` |
| Purchase flow: pricing → signup → choose plan → dashboard (plan gate) | Prototype | `app/choose-plan/`, `lib/subscription.ts`; plan stored in browser, no real payment |
| Per-product auth text, SVG art, accent color, logo mark | Done | `data/auth.ts`, `public/images/auth/`, `app/globals.css` |
| Backend API (auth + data), MongoDB, tenant scoping | Pending | none in repo |
| Replace auth hero text/imagery and logo mark with real brand | Pending | `data/auth.ts`, `public/images/` |
| Billing (Razorpay/Stripe), plan limits, usage caps | Pending | |
| Real billing webhook to activate plan (replaces browser-stored plan) | Pending | |
| MVP 1: Business profile and brand settings | Pending | |
| MVP 2: Industry-specific offer templates | Pending | |
| MVP 3: AI captions in Hindi and English | Pending | |
| MVP 4: Simple editable poster layouts | Pending | |
| MVP 5: Content calendar and saved drafts | Pending | |
| MVP 6: Download and copy for WhatsApp/social | Pending | |
| MCP server | Pending | |
| Campaign tracking (enquiry links/offer codes) | Pending | post-MVP |
| Auto-publish to Instagram | Out of scope | needs platform permission check |
