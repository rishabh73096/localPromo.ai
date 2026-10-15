// What each plan includes. Keep in sync with config/landing.ts (pricing cards) and supabase/migrations/0006_plan_features.sql.
export type PlanName = "Starter" | "Pro";

export type Feature = "create" | "templates" | "brand" | "posterDownload" | "drafts" | "calendar" | "festivalPack";

export const FEATURE_LABELS: Record<Feature, string> = {
  create: "Hindi and English captions",
  templates: "Niche offer templates",
  brand: "Saved brand profile",
  posterDownload: "Poster PNG download",
  drafts: "Saved drafts",
  calendar: "Content calendar",
  festivalPack: "Festival idea pack",
};

const STARTER: Feature[] = ["create", "templates", "brand", "posterDownload", "drafts"];

export const PLAN_FEATURES: Record<PlanName, Feature[]> = {
  Starter: STARTER,
  Pro: [...STARTER, "calendar", "festivalPack"],
};

export const ALL_FEATURES = Object.keys(FEATURE_LABELS) as Feature[];

// Captions generated per month (enforced in the app; the plan itself is enforced in the database)
export const PLAN_GENERATION_CAP: Record<PlanName, number> = { Starter: 60, Pro: 400 };

export const isPlanName = (v: unknown): v is PlanName => v === "Starter" || v === "Pro";
export const planHas = (plan: string | null | undefined, f: Feature) => (isPlanName(plan) ? PLAN_FEATURES[plan].includes(f) : false);
export const lowestPlanWith = (f: Feature): PlanName => (PLAN_FEATURES.Starter.includes(f) ? "Starter" : "Pro");
