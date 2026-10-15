import { SUPABASE_CONFIGURED } from "@/utils/supabase/config";

// Guards need a Supabase project. Without NEXT_PUBLIC_SUPABASE_URL / _PUBLISHABLE_KEY the app opens in local demo mode
// (no sign-in, everything unlocked, data kept in this browser).
export const GUARDS_ENABLED = SUPABASE_CONFIGURED;

export const SUPPORT_HREF = "/contact";
export const OTP_LENGTH = 6;
export const OTP_EXPIRY_SECONDS = 60 * 60;

export type Role = "owner" | "admin" | "staff" | "user";

export const DEFAULT_SIGNUP_ROLE: Role = "owner";

export const DEMO_LOGIN_ENABLED = process.env.NODE_ENV !== "production" || process.env.NEXT_PUBLIC_ENABLE_DEMO_LOGIN === "true";
// Add local demo accounts here while developing against a test backend.
export const DEMO_ACCOUNTS: { label: string; email: string; password: string; role: Role }[] = [];
