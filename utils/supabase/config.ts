// Without Supabase keys the app runs in local demo mode: no sign-in, data kept in this browser.
export const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
export const SUPABASE_KEY = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY || "";
export const SUPABASE_CONFIGURED = Boolean(SUPABASE_URL && SUPABASE_KEY);

// Harmless placeholders so the client can be constructed (every request then simply fails and the app falls back to local data).
export const SAFE_URL = SUPABASE_URL || "http://127.0.0.1:54321";
export const SAFE_KEY = SUPABASE_KEY || "demo-mode-no-key";
