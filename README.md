# localpromo-ai

Promotion assistant for local shops (salons, gyms, cafes, retail): saved brand, niche templates, Hindi/English captions, editable SVG posters, content calendar.
Product docs: [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md) · overview: [../MAIN-DOCUMENT.md](../MAIN-DOCUMENT.md)

```bash
cp .env.example .env.local     # fill in your NEW Supabase project URL + publishable key
# Supabase dashboard > SQL Editor: paste and run supabase/setup.sql once
npm install
npm run dev -- -p 3012
```

- Auth, plans, UPI payments, admin console: same Supabase setup as quotepilot-ai (own project, own tables).
- Make yourself platform admin: `insert into platform_admins (user_id) select id from auth.users where email = 'you@example.com';`
- Offline/slow network: `public/sw.js` (pages + static files cached), `offline.html`, snapshot of your data in localStorage.
- Before launch: set `NEXT_PUBLIC_PAYMENT_TEST_MODE=false` and `update app_flags set value = false where key = 'test_payments';`
