"use client";

import { useEffect, useSyncExternalStore } from "react";
import { createCollection, currentUserId, registerReset } from "@/lib/collection";
import { registerLocalKey } from "@/lib/local-store";
import { generateCopy, defaultPoster } from "@/lib/promo";
import { flash } from "@/lib/flash";
import { createClient } from "@/utils/supabase/client";
import type { BrandProfile, Campaign, Draft, DraftStatus, PosterConfig } from "@/types/promo";

// Supabase tables: campaigns, drafts, brand_profiles (supabase/migrations/0003 + 0006).
// Falls back to localStorage when signed out or the tables do not exist yet.

const campaigns = createCollection<Campaign>({
  table: "campaigns",
  localKey: "campaigns",
  toRow: (c) => ({ id: c.id, title: c.title, niche: c.niche, template_id: c.templateId, offer: c.offer, audience: c.audience, starts_at: c.startsAt, ends_at: c.endsAt, offer_code: c.offerCode, created_at: c.createdAt }),
  fromRow: (r) => ({ id: String(r.id), title: String(r.title), niche: r.niche as Campaign["niche"], templateId: String(r.template_id ?? ""), offer: String(r.offer ?? ""), audience: String(r.audience ?? ""), startsAt: r.starts_at ? String(r.starts_at) : null, endsAt: r.ends_at ? String(r.ends_at) : null, offerCode: String(r.offer_code ?? ""), createdAt: String(r.created_at) }),
});

const drafts = createCollection<Draft>({
  table: "drafts",
  localKey: "drafts",
  toRow: (d) => ({ id: d.id, campaign_id: d.campaignId, title: d.title, caption_en: d.captionEn, caption_hi: d.captionHi, whatsapp: d.whatsapp, poster: d.poster, status: d.status, scheduled_for: d.scheduledFor, created_at: d.createdAt, updated_at: d.updatedAt }),
  fromRow: (r) => ({ id: String(r.id), campaignId: r.campaign_id ? String(r.campaign_id) : null, title: String(r.title), captionEn: String(r.caption_en ?? ""), captionHi: String(r.caption_hi ?? ""), whatsapp: String(r.whatsapp ?? ""), poster: r.poster as PosterConfig, status: r.status as DraftStatus, scheduledFor: r.scheduled_for ? String(r.scheduled_for) : null, createdAt: String(r.created_at), updatedAt: String(r.updated_at) }),
});

const stamp = () => new Date().toISOString();

export function useCampaigns() {
  const { items, loaded } = campaigns.use();
  return { campaigns: [...items].sort((a, b) => b.createdAt.localeCompare(a.createdAt)), loaded };
}
export function useDrafts() {
  const { items, loaded } = drafts.use();
  return { drafts: [...items].sort((a, b) => b.updatedAt.localeCompare(a.updatedAt)), loaded };
}

export type CampaignInput = Omit<Campaign, "id" | "createdAt">;

// One campaign plus a first draft built from the saved brand. Returns both ids.
export function createCampaign(brand: BrandProfile, input: CampaignInput, variant = 0): { campaignId: string; draftId: string } {
  const now = stamp();
  const campaign: Campaign = { ...input, id: crypto.randomUUID(), createdAt: now };
  campaigns.insert([campaign]);
  const copy = generateCopy(brand, campaign, variant);
  const draft: Draft = {
    id: crypto.randomUUID(),
    campaignId: campaign.id,
    title: campaign.title,
    captionEn: copy.en,
    captionHi: copy.hi,
    whatsapp: copy.whatsapp,
    poster: defaultPoster(brand, campaign),
    status: "draft",
    scheduledFor: null,
    createdAt: now,
    updatedAt: now,
  };
  drafts.insert([draft]);
  flash([draft.id]);
  return { campaignId: campaign.id, draftId: draft.id };
}

export const getDraft = (id: string) => drafts.get().find((d) => d.id === id);
export const getCampaign = (id: string) => campaigns.get().find((c) => c.id === id);
export const updateDraft = (id: string, patch: Partial<Omit<Draft, "id" | "createdAt">>) => drafts.replace(id, (d) => ({ ...d, ...patch, updatedAt: stamp() }));
export const deleteDraft = (id: string) => drafts.remove([id]);
export const deleteCampaign = (id: string) => {
  // drafts keep existing (campaign_id becomes null in the database via on delete set null)
  drafts.get().filter((d) => d.campaignId === id).forEach((d) => drafts.replace(d.id, (x) => ({ ...x, campaignId: null })));
  campaigns.remove([id]);
};
export const duplicateDraft = (id: string) => {
  const d = getDraft(id);
  if (!d) return;
  const now = stamp();
  const copy: Draft = { ...d, id: crypto.randomUUID(), title: `${d.title} (copy)`, status: "draft", scheduledFor: null, createdAt: now, updatedAt: now };
  drafts.insert([copy]);
  flash([copy.id]);
};

// ---- brand profile: one row per user ----
export const DEFAULT_BRAND: BrandProfile = {
  businessName: "",
  niche: "salon",
  services: [],
  city: "",
  address: "",
  phone: "",
  tone: "friendly",
  language: "en",
  color: "#b91c3c",
  tagline: "",
};

const merge = (raw: Partial<BrandProfile> | null | undefined): BrandProfile => ({ ...DEFAULT_BRAND, ...raw, services: Array.isArray(raw?.services) ? raw.services : [] });

const KEY = "brand";
registerLocalKey(KEY);
let value: BrandProfile = DEFAULT_BRAND;
let loadedOnce = false;
let remote = false;
let loading: Promise<void> | null = null;
const listeners = new Set<() => void>();
const emit = () => listeners.forEach((l) => l());

async function load() {
  const userId = await currentUserId();
  if (userId) {
    const { data, error } = await createClient().from("brand_profiles").select("data").maybeSingle();
    if (!error) {
      remote = true;
      value = merge(data?.data as Partial<BrandProfile>);
      loadedOnce = true;
      try {
        registerLocalKey(`${KEY}:snapshot:${userId}`);
        window.localStorage.setItem(`${KEY}:snapshot:${userId}`, JSON.stringify(value));
      } catch {}
      return emit();
    }
    console.warn("[brand_profiles] Supabase unavailable:", error.message);
    try {
      const raw = window.localStorage.getItem(`${KEY}:snapshot:${userId}`);
      if (raw || !navigator.onLine) {
        remote = false;
        value = raw ? merge(JSON.parse(raw)) : DEFAULT_BRAND;
        loadedOnce = true;
        return emit();
      }
    } catch {}
  }
  remote = false;
  try {
    const raw = window.localStorage.getItem(KEY);
    value = raw ? merge(JSON.parse(raw)) : DEFAULT_BRAND;
  } catch {
    value = DEFAULT_BRAND;
  }
  loadedOnce = true;
  emit();
}

registerReset(() => {
  loading = null;
  loadedOnce = false;
  value = DEFAULT_BRAND;
  emit();
  if (listeners.size) loading = load();
});

export function useBrand(): { brand: BrandProfile; loaded: boolean } {
  const brand = useSyncExternalStore(
    (cb) => {
      listeners.add(cb);
      return () => listeners.delete(cb);
    },
    () => value,
    () => DEFAULT_BRAND,
  );
  const loaded = useSyncExternalStore(
    (cb) => {
      listeners.add(cb);
      return () => listeners.delete(cb);
    },
    () => loadedOnce,
    () => false,
  );
  useEffect(() => {
    loading ??= load();
  }, []);
  return { brand, loaded };
}

export async function saveBrand(next: BrandProfile) {
  value = next;
  emit();
  if (!remote) {
    try {
      window.localStorage.setItem(KEY, JSON.stringify(next));
    } catch {}
    return;
  }
  const { error } = await createClient().from("brand_profiles").upsert({ data: next, updated_at: stamp() });
  if (error) throw new Error("Couldn't save your brand profile. Please try again.");
}
