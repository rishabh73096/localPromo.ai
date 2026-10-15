"use client";

import Link from "next/link";
import { Check, ChevronDown } from "lucide-react";
import * as m from "motion/react-m";
import { SectionHead, wrap } from "@/components/landing/heading";
import Image from "next/image";
import { Reveal } from "@/components/ui/motion";
import { LogoMark } from "@/components/ui/logo-mark";
import { BRAND } from "@/config/site";
import { cn } from "@/lib/utils";
import type { LandingContent } from "@/types/landing";

// Only plain data crosses from the server page to these client sections (no icon components).
type Content<K extends keyof LandingContent> = { c: Pick<LandingContent, K> };

export function Pricing({ c }: Content<"pricing">) {
  const p = c.pricing;
  return (
    <section id="pricing" className="scroll-mt-16 bg-[#fffaf3] py-24">
      <div className={wrap}>
        <SectionHead eyebrow="Pricing" title={p.title}>{p.sub}</SectionHead>
        <div className="mx-auto mt-10 grid max-w-[820px] sm:mt-14 gap-5 md:grid-cols-2">
          {p.plans.map((plan, i) => (
            <m.div key={plan.name} initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.12, duration: 0.6 }} whileHover={{ y: -6 }} className={cn("relative flex flex-col overflow-hidden rounded-[2rem] p-6 sm:p-7", plan.featured ? "bg-linear-to-br from-[#1c1210] to-[#3a1018] text-white shadow-2xl shadow-[#b91c3c]/30" : "bg-white text-ink shadow-lg ring-1 ring-black/[0.05]")}>
              {plan.featured ? <span className="absolute top-5 right-5 rounded-full bg-[#ffd43b] px-3 py-1 text-[10px] font-extrabold tracking-wider text-[#1c1210] uppercase">Most picked</span> : null}
              <p className="text-sm font-bold">{plan.name}</p>
              <p className={cn("mt-1 text-xs", plan.featured ? "text-white/60" : "text-slate-500")}>{plan.tagline}</p>
              <p className="font-inter mt-6 text-5xl font-extrabold sm:text-6xl tracking-[-0.05em]">{plan.price}<span className={cn("ml-1.5 text-xs font-normal tracking-normal", plan.featured ? "text-white/60" : "text-slate-500")}>a month</span></p>
              <Link href={`/signup?next=${encodeURIComponent(`/choose-plan?plan=${plan.name}`)}`} className={cn("mt-6 inline-flex h-12 items-center justify-center rounded-full text-sm font-bold transition-transform hover:scale-[1.03] active:scale-95", plan.featured ? "bg-white text-[#1c1210]" : "bg-ink text-white")}>Get {plan.name}</Link>
              <ul className="mt-7 space-y-3 text-sm">
                {plan.features.map((f) => <li key={f} className="flex items-start gap-2.5"><Check className={cn("mt-0.5 size-4 shrink-0", plan.featured ? "text-[#ffd43b]" : "text-brand")} />{f}</li>)}
              </ul>
            </m.div>
          ))}
        </div>
        <p className="mt-8 text-center text-xs text-slate-400">Prices in INR, per 30 days. Pay by UPI; your plan switches on once the payment is verified.</p>
      </div>
    </section>
  );
}

export function Faq({ c }: Content<"faq">) {
  return (
    <section id="faq" className="scroll-mt-16 bg-white py-16 sm:py-24">
      <div className={cn(wrap, "max-w-[820px]")}>
        <SectionHead eyebrow="Questions" title="Things owners ask first." />
        <div className="mt-12 space-y-3">
          {c.faq.map((f, i) => (
            <Reveal key={f.q} delay={i * 0.04}>
              <details className="group rounded-2xl bg-[#f7efe6] px-6 py-5 transition-colors open:bg-[#fadfe2]">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-[15px] font-semibold text-ink">
                  {f.q}<ChevronDown className="size-4 shrink-0 text-slate-500 transition-transform duration-300 group-open:rotate-180" />
                </summary>
                <p className="mt-3 text-sm leading-7 text-slate-600">{f.a}</p>
              </details>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

export function FinalCta({ c }: Content<"cta">) {
  return (
    <section className="relative isolate overflow-hidden bg-[#140b08] py-20 sm:py-28 text-center text-white">
      <Image src="/images/hero-bazaar.jpg" alt="" fill sizes="100vw" className="-z-10 object-cover object-center" />
      <div aria-hidden className="absolute inset-0 -z-10 bg-black/75" />
      <div className={wrap}>
        <m.div initial={{ opacity: 0, scale: 0.6, rotate: -20 }} whileInView={{ opacity: 1, scale: 1, rotate: 0 }} viewport={{ once: true }} transition={{ type: "spring", stiffness: 160, damping: 14 }}><LogoMark className="mx-auto size-14 sm:size-16" /></m.div>
        <Reveal delay={0.1}><h2 className="font-inter mx-auto mt-7 max-w-[760px] text-[clamp(1.9rem,7vw,4.2rem)] leading-[1.02] font-extrabold tracking-[-0.045em]">{c.cta.title}</h2></Reveal>
        <Reveal delay={0.2}><p className="mx-auto mt-5 max-w-[520px] text-lg text-white/65">{c.cta.sub}</p></Reveal>
        <Reveal delay={0.3}><Link href="/signup" className="mt-9 inline-flex h-12 items-center rounded-full bg-white px-8 text-[15px] sm:h-14 sm:px-10 sm:text-base font-bold text-[#1c1210] shadow-[0_10px_50px_-8px_rgba(255,255,255,0.5)] transition-transform hover:scale-[1.05] active:scale-95">Start promoting</Link></Reveal>
      </div>
    </section>
  );
}

export function LandingFooter() {
  return (
    <footer className="bg-[#140b08] py-10 text-white/60">
      <div className={cn(wrap, "flex flex-col items-center justify-between gap-4 text-sm sm:flex-row")}>
        <span>© {new Date().getFullYear()} {BRAND.name}. {BRAND.tagline}. Photo: <a href="https://www.pexels.com/photo/busy-street-in-an-indian-city-14994013/" className="underline hover:text-white" target="_blank" rel="noreferrer">Deepak Ghoran / Pexels</a>.</span>
        <div className="flex flex-wrap justify-center gap-5">
          <Link href="/login" className="hover:text-white">Sign in</Link>
          <Link href="/signup" className="hover:text-white">Create account</Link>
          <a href="#pricing" className="hover:text-white">Pricing</a>
          <Link href="/privacy-policy" className="hover:text-white">Privacy</Link>
          <Link href="/terms-of-service" className="hover:text-white">Terms</Link>
        </div>
      </div>
    </footer>
  );
}
