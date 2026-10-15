export type Language = "en" | "hi";
export type Niche = "salon" | "gym" | "cafe" | "retail";
export type Tone = "friendly" | "premium" | "festive" | "urgent";
export type DraftStatus = "draft" | "ready" | "scheduled" | "published";
export type PosterLayout = "bold" | "split" | "frame";
export type PosterSize = "square" | "story";

export interface BrandProfile {
  businessName: string;
  niche: Niche;
  services: string[];
  city: string;
  address: string;
  phone: string;
  tone: Tone;
  language: Language;
  color: string;
  tagline: string;
}

export interface Campaign {
  id: string;
  title: string;
  niche: Niche;
  templateId: string;
  offer: string;
  audience: string;
  startsAt: string | null;
  endsAt: string | null;
  offerCode: string;
  createdAt: string;
}

export interface PosterConfig {
  layout: PosterLayout;
  headline: string;
  subline: string;
  cta: string;
  color: string;
  /** Optional photo behind the poster (a path under /images/biz). */
  image?: string;
}

export interface Draft {
  id: string;
  campaignId: string | null;
  title: string;
  captionEn: string;
  captionHi: string;
  whatsapp: string;
  poster: PosterConfig;
  status: DraftStatus;
  scheduledFor: string | null;
  createdAt: string;
  updatedAt: string;
}
