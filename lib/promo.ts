import { templateById } from "@/lib/templates";
import type { BrandProfile, Campaign, PosterConfig, Tone } from "@/types/promo";

// Template-based copy: no AI call yet. Each tone has its own opening/closing lines in English and Hindi,
// and the owner's offer, business details and dates are filled in. Swap `generateCopy` for an LLM call later.

const OPEN_EN: Record<Tone, string> = {
  friendly: "Hello from {biz}! 👋",
  premium: "Introducing an exclusive offer at {biz}.",
  festive: "Celebrate with {biz}! ✨",
  urgent: "Limited time only at {biz}! ⏰",
};
const OPEN_HI: Record<Tone, string> = {
  friendly: "{biz} की तरफ से नमस्ते! 👋",
  premium: "{biz} में एक खास ऑफर।",
  festive: "{biz} के साथ त्योहार मनाइए! ✨",
  urgent: "{biz} में सीमित समय का ऑफर! ⏰",
};

const dateText = (iso: string | null) => (iso ? new Date(iso).toLocaleDateString("en-IN", { day: "numeric", month: "short" }) : "");
const dateTextHi = (iso: string | null) => (iso ? new Date(iso).toLocaleDateString("hi-IN", { day: "numeric", month: "long" }) : "");

const fill = (s: string, v: Record<string, string>) => s.replace(/\{(\w+)\}/g, (_, k) => v[k] ?? "").replace(/[ \t]+\n/g, "\n").replace(/\n{3,}/g, "\n\n").trim();

export interface Copy {
  en: string;
  hi: string;
  whatsapp: string;
}

type Input = Pick<Campaign, "offer" | "audience" | "endsAt" | "offerCode" | "templateId">;

export function generateCopy(brand: BrandProfile, c: Input, variant = 0): Copy {
  const biz = brand.businessName || "our shop";
  const t = templateById(c.templateId);
  const tone = brand.tone;
  const until = c.endsAt ? `Valid till ${dateText(c.endsAt)}.` : "";
  const untilHi = c.endsAt ? `${dateTextHi(c.endsAt)} तक मान्य।` : "";
  const code = c.offerCode ? `Use code ${c.offerCode}.` : "";
  const codeHi = c.offerCode ? `कोड ${c.offerCode} बताइए।` : "";
  const where = [brand.address, brand.city].filter(Boolean).join(", ");
  const call = brand.phone ? `Call or WhatsApp ${brand.phone}` : "Message us to book";
  const callHi = brand.phone ? `${brand.phone} पर कॉल या WhatsApp करें` : "बुक करने के लिए हमें मैसेज करें";
  const aud = c.audience ? ` for ${c.audience}` : "";
  const audHi = c.audience ? ` (${c.audience} के लिए)` : "";
  const cta = t?.cta ?? "Book now";
  const v = { biz, offer: c.offer, until, untilHi, code, codeHi, where, call, callHi, aud, audHi, cta, tag: brand.tagline };

  const bodiesEn = [
    "{offer}{aud}.\n{until} {code}".trim(),
    "Good news: {offer}{aud}!\nDon't wait. {until} {code}",
    "{offer}. {tag}\n{until} {code}",
  ];
  const bodiesHi = ["{offer}{audHi}।\n{untilHi} {codeHi}", "खुशखबरी: {offer}{audHi}!\nदेर न करें। {untilHi} {codeHi}", "{offer}। {tag}\n{untilHi} {codeHi}"];
  const i = ((variant % 3) + 3) % 3;

  const en = fill(`${OPEN_EN[tone]}\n\n${bodiesEn[i]}\n\n📍 {where}\n📞 {call}\n\n{cta} 👉`, v);
  const hi = fill(`${OPEN_HI[tone]}\n\n${bodiesHi[i]}\n\n📍 {where}\n📞 {callHi}\n\nअभी बुक करें 👉`, v);
  const whatsapp = fill(`*${biz}*\n{offer}{aud}\n{until} {code}\n${brand.phone ? `Reply YES or call ${brand.phone} to book.` : "Reply YES to book."}`, v);
  return { en, hi, whatsapp };
}

export function defaultPoster(brand: BrandProfile, c: Pick<Campaign, "offer" | "templateId">): PosterConfig {
  const t = templateById(c.templateId);
  return { layout: "bold", headline: t?.headline ?? "Special Offer", subline: c.offer, cta: t?.cta ?? "Book now", color: brand.color };
}

export const OFFER_CODE = /^[A-Z0-9]{3,12}$/;
export const makeOfferCode = (title: string) => (title.replace(/[^A-Za-z0-9]/g, "").toUpperCase().slice(0, 6) || "PROMO") + String(Math.floor(10 + Math.random() * 89));
