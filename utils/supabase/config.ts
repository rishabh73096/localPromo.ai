// MASTER SWITCH for the Supabase backend (auth, database, plans, admin console).
// false = the backend is commented out: no Supabase request is ever made, the app runs in local demo mode
//         (no sign-in, everything unlocked, data kept in this browser).
// true  = use Supabase, provided NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY are set.
export const BACKEND_ENABLED = false;

export const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
export const SUPABASE_KEY = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY || "";
export const SUPABASE_CONFIGURED = BACKEND_ENABLED && Boolean(SUPABASE_URL && SUPABASE_KEY);

// Harmless placeholders so the client can be constructed (every request then simply fails and the app falls back to local data).
export const SAFE_URL = SUPABASE_URL || "http://127.0.0.1:54321";
export const SAFE_KEY = SUPABASE_KEY || "demo-mode-no-key";
