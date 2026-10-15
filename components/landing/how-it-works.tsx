"use client";

import { useEffect, useRef, useState } from "react";
import { useInView, useScroll, useSpring } from "motion/react";
import * as m from "motion/react-m";
import { IconCalendarEvent as CalendarDays, IconCheck as Check, IconPalette as Palette, IconTag as Tag, IconWand as Wand2 } from "@tabler/icons-react";
import { SectionHead, wrap } from "@/components/landing/heading";
import { cn } from "@/lib/utils";

const STEPS = [
  { icon: Palette, title: "Save your brand once", body: "Business name, what you sell, your phone and address, your tone of voice and your colour. This is the only form you fill in. Every caption and poster after this starts from it, so your posts always sound and look like you." },
  { icon: Tag, title: "Pick an offer template", body: "Choose from ready-made offers for your kind of shop: weekday discounts, membership drives, daily specials, festival sales. Change the offer, the dates and the offer code. Festivals are suggested a few weeks ahead." },
  { icon: Wand2, title: "Get captions and a poster", body: "In one click you get an English caption, a Hindi caption, a WhatsApp message and an editable poster in post and story sizes. Reword anything. Download the poster as a PNG and copy the text." },
  { icon: CalendarDays, title: "Plan the month", body: "Drop each draft on a day in the calendar. Mark it ready, scheduled or published, so you always know what is going out this week. LocalPromo never posts for you: you stay in control of what goes live." },
];

function BrandVisual() {
  const chips = ["Haircut", "Facial", "Hair spa", "Bridal"];
  return (
    <div className="space-y-3">
      <div className="rounded-xl bg-[#f7efe6] p-3"><p className="text-[10px] font-bold tracking-wide text-slate-400 uppercase">Business</p><p className="mt-0.5 text-sm font-semibold text-ink">Glow Unisex Salon · Jaipur</p></div>
      <div className="flex flex-wrap gap-2">
        {chips.map((c, i) => <m.span key={c} initial={{ opacity: 0, scale: 0.6 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.15 + i * 0.12, type: "spring", stiffness: 300, damping: 18 }} className="bg-brand-soft text-brand inline-flex items-center gap-1 rounded-lg px-3 py-1.5 text-xs font-semibold"><Check className="size-3" />{c}</m.span>)}
      </div>
      <div className="flex items-center gap-2">
        {["#b91c3c", "#d6336c", "#e8590c", "#0f9d75"].map((c, i) => <m.span key={c} initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.5 + i * 0.1, type: "spring" }} style={{ background: c }} className={cn("size-8 rounded-full", i === 0 && "ring-2 ring-ink ring-offset-2")} />)}
        <span className="ml-2 text-xs text-slate-400">Brand colour</span>
      </div>
      <div className="rounded-xl bg-[#f7efe6] p-3"><p className="text-[10px] font-bold tracking-wide text-slate-400 uppercase">Tone</p><p className="mt-0.5 text-sm font-semibold text-ink">Friendly · Hindi + English</p></div>
    </div>
  );
}

function OfferVisual() {
  const items = ["Weekday glow offer", "Bridal package", "Festival makeover"];
  return (
    <div className="space-y-2.5">
      {items.map((t, i) => (
        <m.div key={t} initial={{ opacity: 0, x: -24 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.12, duration: 0.45 }} className={cn("flex items-center justify-between rounded-xl border p-3.5", i === 0 ? "border-brand bg-brand-soft/60" : "border-black/[0.08]")}>
          <div><p className="text-sm font-semibold text-ink">{t}</p><p className="text-xs text-slate-500">{i === 0 ? "20% off all services Mon–Thu" : i === 1 ? "Bridal package with free trial" : "Facial + hair spa combo"}</p></div>
          {i === 0 ? <m.span initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.5, type: "spring" }} className="bg-brand flex size-6 items-center justify-center rounded-full text-white"><Check className="size-3.5" /></m.span> : null}
        </m.div>
      ))}
      <m.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }} className="flex gap-2 pt-1">
        <span className="rounded-lg bg-[#f7efe6] px-3 py-2 text-xs font-semibold text-ink">Code: DIWALI20</span>
        <span className="rounded-lg bg-[#f7efe6] px-3 py-2 text-xs font-semibold text-ink">1 – 8 Nov</span>
      </m.div>
    </div>
  );
}

function CreateVisual() {
  const text = "इस दिवाली निखार लाइए। 20% छूट ✨";
  return (
    <div className="grid grid-cols-[1fr_120px] gap-3">
      <div className="space-y-2">
        <div className="rounded-xl bg-[#f7efe6] p-3"><p className="text-[10px] font-bold text-slate-400 uppercase">English</p><p className="mt-1 text-xs leading-5 text-ink">Celebrate with Glow Salon! 20% off weekday services. Book now 👉</p></div>
        <div className="rounded-xl bg-[#f7efe6] p-3"><p className="text-[10px] font-bold text-slate-400 uppercase">हिन्दी</p>
          <p className="mt-1 text-xs leading-5 text-ink">{text.split("").map((ch, i) => <m.span key={i} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 + i * 0.04 }}>{ch}</m.span>)}</p>
        </div>
        <div className="rounded-xl bg-[#dcf8c6] p-3 text-xs text-[#1b2b1b]">Reply YES to book!</div>
      </div>
      <m.div initial={{ rotate: -8, scale: 0.7, opacity: 0 }} animate={{ rotate: -3, scale: 1, opacity: 1 }} transition={{ delay: 0.4, type: "spring", stiffness: 200, damping: 16 }} className="flex flex-col justify-between rounded-2xl bg-linear-to-br from-[#d6455f] to-[#8a1230] p-3 text-white">
        <p className="text-[9px] font-bold uppercase opacity-80">Diwali</p>
        <p className="font-inter text-lg leading-tight font-extrabold">Festive Makeover</p>
        <span className="rounded-full bg-white px-2 py-1 text-center text-[9px] font-bold text-[#8a1230]">Book now</span>
      </m.div>
    </div>
  );
}

function CalendarVisual() {
  const posts: Record<number, string> = { 3: "#b91c3c", 8: "#f59f00", 12: "#2f9e44", 17: "#b91c3c", 22: "#f59f00", 26: "#2f9e44" };
  return (
    <div>
      <p className="text-sm font-bold tracking-wide text-ink uppercase">November</p>
      <div className="mt-3 grid grid-cols-7 gap-1.5 text-center">
        {Array.from({ length: 30 }, (_, i) => i + 1).map((d) => (
          <div key={d} className="relative flex aspect-square items-center justify-center rounded-lg bg-[#f7efe6] text-[11px] text-slate-500">
            {d}
            {posts[d] ? <m.span initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.2 + d * 0.025, type: "spring", stiffness: 400, damping: 14 }} style={{ background: posts[d] }} className="absolute -top-1 -right-1 size-3 rounded-full ring-2 ring-white" /> : null}
          </div>
        ))}
      </div>
      <div className="mt-3 flex gap-3 text-[10px] text-slate-500"><span>● Ready</span><span className="text-[#f59f00]">● Scheduled</span><span className="text-[#2f9e44]">● Published</span></div>
    </div>
  );
}

const VISUALS = [BrandVisual, OfferVisual, CreateVisual, CalendarVisual];

function Step({ i, active, onActive }: { i: number; active: number; onActive: (i: number) => void }) {
  const ref = useRef<HTMLDivElement>(null);
  const s = STEPS[i];
  const Visual = VISUALS[i];
  // the step crossing the middle of the screen drives the sticky preview
  const inView = useInView(ref, { margin: "-45% 0px -45% 0px" });
  useEffect(() => {
    if (inView) onActive(i);
  }, [inView, i, onActive]);
  return (
    <div ref={ref} className="relative flex min-h-0 flex-col justify-center py-6 pl-9 sm:pl-12 lg:min-h-[78vh]">
      <span aria-hidden className={cn("absolute top-1/2 left-0 z-10 flex size-5 -translate-x-[9px] -translate-y-1/2 items-center justify-center rounded-full border-2 bg-white transition-all duration-500 sm:size-6 sm:-translate-x-[11px]", i <= active ? "border-brand scale-110" : "border-slate-300")}>
        <span className={cn("size-2 rounded-full transition-colors duration-500", i <= active ? "bg-brand" : "bg-transparent")} />
      </span>
      <span className="bg-brand-soft text-brand flex size-12 items-center justify-center rounded-2xl"><s.icon className="size-6" /></span>
      <p className="mt-5 text-xs font-bold tracking-[0.14em] text-slate-400 uppercase">Step {i + 1}</p>
      <h3 className="font-inter mt-1 text-2xl font-extrabold tracking-[-0.04em] text-ink sm:text-4xl">{s.title}</h3>
      <p className="mt-4 max-w-[520px] text-base leading-7 text-slate-600">{s.body}</p>
      <div className="mt-6 rounded-3xl border border-black/[0.06] bg-white p-5 shadow-xl shadow-[#b91c3c]/10 lg:hidden"><Visual /></div>
    </div>
  );
}

export function HowItWorks() {
  const [active, setActive] = useState(0);
  const track = useRef<HTMLDivElement>(null);
  // the red line grows as you scroll through the steps
  const { scrollYProgress } = useScroll({ target: track, offset: ["start 65%", "end 55%"] });
  const progress = useSpring(scrollYProgress, { stiffness: 140, damping: 30, mass: 0.4 });
  const Visual = VISUALS[active];
  return (
    <section id="how" className="scroll-mt-16 bg-[#fffaf3] py-24">
      <div className={wrap}>
        <SectionHead eyebrow="How it works" title="From one offer to a month of posts.">
          Four steps. The first one you only do once. After that, each new campaign starts from what you already saved.
        </SectionHead>
        <div className="mt-10 grid sm:mt-16 gap-12 lg:grid-cols-[1fr_440px] lg:gap-20">
          <div ref={track} className="relative ml-2.5 sm:ml-3">
            <div aria-hidden className="absolute top-8 bottom-8 left-0 w-0.5 -translate-x-1/2 rounded-full bg-slate-200" />
            <m.div aria-hidden style={{ scaleY: progress }} className="bg-brand absolute top-8 bottom-8 left-0 w-0.5 origin-top -translate-x-1/2 rounded-full" />
            {STEPS.map((_, i) => <Step key={i} i={i} active={active} onActive={setActive} />)}
          </div>
          <div className="relative hidden lg:block">
            <div className="sticky top-[18vh]">
              <div className="rounded-[2rem] border border-black/[0.06] bg-white p-6 shadow-2xl shadow-[#b91c3c]/15">
                <div className="mb-5 flex items-center gap-2">
                  {STEPS.map((s, i) => <span key={i} className={cn("h-1.5 flex-1 rounded-full transition-colors duration-500", i <= active ? "bg-brand" : "bg-slate-200")} />)}
                </div>
                <m.div key={active} initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }} className="min-h-[300px]"><Visual /></m.div>
              </div>
              <div aria-hidden className="bg-brand/20 absolute -inset-6 -z-10 rounded-[3rem] blur-3xl" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
