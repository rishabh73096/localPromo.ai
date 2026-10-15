"use client";

import { useState } from "react";
import { IconCopy as Copy } from "@tabler/icons-react";
import * as m from "motion/react-m";
import { SectionHead, wrap } from "@/components/landing/heading";
import { Poster } from "@/components/promo/poster";
import { generateCopy } from "@/lib/promo";
import { NICHES, templatesFor } from "@/lib/templates";
import { notify } from "@/lib/toast";
import { cn } from "@/lib/utils";
import type { BrandProfile, Niche, PosterLayout, Tone } from "@/types/promo";

const COLOR: Record<Niche, string> = { salon: "#d6336c", gym: "#1c7ed6", cafe: "#e8590c", retail: "#b91c3c" };
const PHOTO: Record<Niche, string> = { salon: "/images/biz/salon.jpg", gym: "/images/biz/gym.jpg", cafe: "/images/biz/cafe.jpg", retail: "/images/biz/retail.jpg" };
const NAME: Record<Niche, string> = { salon: "Glow Salon", gym: "Iron Pulse Gym", cafe: "Chai & Co Cafe", retail: "Style Hub" };
const TONES: [Tone, string][] = [["friendly", "Friendly"], ["premium", "Premium"], ["festive", "Festive"], ["urgent", "Urgent"]];
type Tab = "en" | "hi" | "wa";

// The real generator and the real poster renderer, running in the page: nothing here is a mock-up.
export function LiveDemo() {
  const [niche, setNiche] = useState<Niche>("salon");
  const [tpl, setTpl] = useState(0);
  const [offer, setOffer] = useState("");
  const [tone, setTone] = useState<Tone>("friendly");
  const [tab, setTab] = useState<Tab>("en");
  const [layout, setLayout] = useState<PosterLayout>("bold");
  const [variant, setVariant] = useState(0);
  const [photo, setPhoto] = useState(true);
  const [wide, setWide] = useState(false);

  const options = templatesFor(niche);
  const t = options[Math.min(tpl, options.length - 1)];
  const offerText = offer || t.offer;
  const brand: BrandProfile = ({ businessName: NAME[niche], niche, services: [], city: "Jaipur", address: "MI Road", phone: "+919876543210", tone, language: "en", color: COLOR[niche], tagline: "" });
  const copy = generateCopy(brand, { offer: offerText, audience: "", endsAt: null, offerCode: "", templateId: t.id }, variant);
  const body = tab === "en" ? copy.en : tab === "hi" ? copy.hi : copy.whatsapp;

  const pickNiche = (n: Niche) => { setNiche(n); setTpl(0); setOffer(""); };
  const copyText = async () => { try { await navigator.clipboard.writeText(body); notify.success("Copied"); } catch { notify.error("Couldn't copy"); } };

  return (
    <section id="demo" className="relative scroll-mt-16 overflow-hidden bg-linear-to-b from-[#140b08] via-[#2a1410] to-[#3a1018] py-16 sm:py-24 text-white">
      <div aria-hidden className="absolute -top-40 left-1/2 size-[700px] -translate-x-1/2 rounded-full bg-[radial-gradient(closest-side,rgba(185,28,60,0.45),transparent)]" />
      <div className={cn(wrap, "relative")}>
        <SectionHead dark eyebrow="Try it right here" title="Change the offer. Watch the post rewrite itself.">
          This is the same generator you get after signing up. Pick a business type, tweak the offer and tone, and see the captions and poster update instantly.
        </SectionHead>

        <div className="mt-10 grid sm:mt-14 gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,420px)]">
          <div className="rounded-[2rem] border border-white/10 bg-white/[0.06] p-4 backdrop-blur-md sm:p-7">
            <p className="text-xs font-bold tracking-wide text-white/50 uppercase">1 · Your business</p>
            <div role="tablist" aria-label="Business type" className="mt-3 flex flex-wrap gap-2">
              {NICHES.map((n) => <button key={n.value} role="tab" aria-selected={niche === n.value} type="button" onClick={() => pickNiche(n.value)} className={cn("h-9 rounded-full px-4 text-sm font-semibold transition-all", niche === n.value ? "bg-white text-[#1c1210]" : "bg-white/10 text-white/80 hover:bg-white/20")}>{n.label}</button>)}
            </div>

            <p className="mt-6 text-xs font-bold tracking-wide text-white/50 uppercase">2 · Offer template</p>
            <div className="mt-3 flex flex-wrap gap-2">
              {options.map((o, i) => <button key={o.id} type="button" onClick={() => { setTpl(i); setOffer(""); }} aria-pressed={i === tpl} className={cn("rounded-xl border px-3.5 py-2 text-left text-sm transition-all", i === tpl ? "border-[#ffd43b] bg-[#ffd43b]/15 text-white" : "border-white/15 text-white/70 hover:border-white/40")}>{o.name}</button>)}
            </div>

            <label htmlFor="demo-offer" className="mt-6 block text-xs font-bold tracking-wide text-white/50 uppercase">3 · Your offer (edit me)</label>
            <input id="demo-offer" value={offer || t.offer} onChange={(e) => setOffer(e.target.value.slice(0, 80))} className="mt-2 h-12 w-full rounded-xl border border-white/15 bg-white/10 px-4 text-[15px] text-white outline-none placeholder:text-white/40 focus:border-[#ffd43b]" />

            <p className="mt-6 text-xs font-bold tracking-wide text-white/50 uppercase">4 · Tone of voice</p>
            <div className="mt-3 flex flex-wrap gap-2">
              {TONES.map(([v, l]) => <button key={v} type="button" onClick={() => setTone(v)} aria-pressed={tone === v} className={cn("h-9 rounded-full px-4 text-sm font-semibold transition-all", tone === v ? "bg-[#ffd43b] text-[#1c1210]" : "bg-white/10 text-white/80 hover:bg-white/20")}>{l}</button>)}
            </div>

            <div className="mt-7 rounded-2xl bg-white p-5 text-ink">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div role="tablist" aria-label="Caption language" className="inline-flex rounded-xl bg-[#f7efe6] p-1">
                  {([["en", "English"], ["hi", "हिन्दी"], ["wa", "WhatsApp"]] as [Tab, string][]).map(([v, l]) => <button key={v} role="tab" aria-selected={tab === v} type="button" onClick={() => setTab(v)} className={cn("h-8 rounded-lg px-3.5 text-sm font-medium transition-colors", tab === v ? "bg-white font-semibold shadow-sm" : "text-slate-500")}>{l === "frame" ? "arch" : l}</button>)}
                </div>
                <div className="flex gap-2">
                  <button type="button" onClick={() => setVariant((v) => v + 1)} className="h-8 rounded-lg bg-[#f7efe6] px-3 text-xs font-semibold hover:bg-[#f5d9d6]">Another wording</button>
                  <button type="button" onClick={copyText} className="flex h-8 items-center gap-1.5 rounded-lg bg-ink px-3 text-xs font-semibold text-white"><Copy className="size-3.5" />Copy</button>
                </div>
              </div>
              <m.pre key={`${tab}-${variant}-${niche}-${tone}`} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }} className="mt-4 min-h-[190px] font-sans text-[14px] leading-6 whitespace-pre-wrap">{body}</m.pre>
            </div>
          </div>

          <div className="lg:sticky lg:top-24 lg:self-start">
            <div className="rounded-[2rem] border border-white/10 bg-white/[0.06] p-4 backdrop-blur-md">
              <m.div key={`${niche}-${layout}-${photo}-${wide}`} initial={{ opacity: 0, scale: 0.94, rotate: -1.5 }} animate={{ opacity: 1, scale: 1, rotate: 0 }} transition={{ type: "spring", stiffness: 180, damping: 18 }}>
                <Poster brand={brand} size={wide ? "wide" : "square"} config={{ layout, headline: t.headline, subline: offerText, cta: t.cta, color: COLOR[niche], image: photo ? PHOTO[niche] : undefined }} className="h-auto w-full rounded-2xl shadow-2xl" />
              </m.div>
              <div className="mt-4 flex items-center justify-between gap-2">
                <div role="group" aria-label="Poster layout" className="flex gap-1.5">
                  {(["bold", "split", "frame"] as PosterLayout[]).map((l) => <button key={l} type="button" onClick={() => setLayout(l)} aria-pressed={layout === l} className={cn("h-8 rounded-lg px-3 text-xs font-semibold capitalize transition-colors", layout === l ? "bg-white text-[#1c1210]" : "bg-white/10 text-white/80 hover:bg-white/20")}>{l === "frame" ? "arch" : l}</button>)}
                </div>
                <div className="flex gap-1.5">
                <button type="button" onClick={() => setWide((v) => !v)} aria-pressed={wide} className={cn("h-8 rounded-lg px-3 text-xs font-semibold transition-colors", wide ? "bg-white text-[#1c1210]" : "bg-white/10 text-white/80 hover:bg-white/20")}>{wide ? "3:2" : "1:1"}</button>
                <button type="button" onClick={() => setPhoto((v) => !v)} aria-pressed={photo} className={cn("h-8 rounded-lg px-3 text-xs font-semibold transition-colors", photo ? "bg-[#ffd43b] text-[#1c1210]" : "bg-white/10 text-white/80 hover:bg-white/20")}>Photo {photo ? "on" : "off"}</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
