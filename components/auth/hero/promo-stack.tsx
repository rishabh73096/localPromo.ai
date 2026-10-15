"use client";

import * as m from "motion/react-m";
import { CalendarDays, MessageCircle } from "lucide-react";
import { useReducedMotion } from "@/hooks/use-reduced-motion";

// A small, looping preview of one campaign: poster, two captions, a WhatsApp bubble and a scheduled post.
export function PromoStack() {
  const reduced = useReducedMotion();
  const rise = (delay: number) => (reduced ? {} : { initial: { opacity: 0, y: 24, scale: 0.96 }, animate: { opacity: 1, y: 0, scale: 1 }, transition: { delay, type: "spring" as const, stiffness: 160, damping: 20 } });

  return (
    <div className="relative mx-auto h-[330px] w-full max-w-[470px]" aria-hidden>
      <m.div {...rise(0.1)} className="tile-float absolute top-0 left-0 w-[210px] rotate-[-4deg] overflow-hidden rounded-3xl bg-linear-to-br from-[#d6455f] to-[#8a1230] p-5 text-white shadow-2xl shadow-[#8a1230]/30">
        <p className="text-[10px] font-bold tracking-widest uppercase opacity-80">Diwali · Salon</p>
        <p className="font-inter mt-6 text-[28px] leading-[1.05] font-extrabold">Festive<br />Makeover</p>
        <p className="mt-3 text-xs opacity-90">Facial + hair spa, 20% off</p>
        <span className="mt-5 inline-block rounded-full bg-white px-3 py-1.5 text-[11px] font-bold text-[#8a1230]">Book now →</span>
        <span className="absolute top-3 right-4 text-2xl text-[#ffd43b]">✦</span>
      </m.div>

      <m.div {...rise(0.3)} className="absolute top-3 right-0 w-[230px] rotate-[3deg] rounded-2xl bg-white p-4 shadow-xl ring-1 ring-black/5">
        <p className="text-[10px] font-bold tracking-wide text-slate-400 uppercase">Caption · हिन्दी</p>
        <p className="mt-1.5 text-[13px] leading-5 text-ink">इस दिवाली निखार लाइए। फेशियल + हेयर स्पा पर 20% छूट ✨</p>
      </m.div>

      <m.div {...rise(0.5)} className="absolute top-[130px] right-6 w-[220px] rounded-2xl bg-[#dcf8c6] p-3.5 shadow-lg">
        <p className="flex items-center gap-1.5 text-[10px] font-bold text-[#1f7a4a]"><MessageCircle className="size-3" />WhatsApp</p>
        <p className="mt-1 text-[13px] leading-5 text-[#1b2b1b]">Glow Salon: 20% off this Diwali. Reply YES to book!</p>
      </m.div>

      <m.div {...rise(0.7)} className="absolute bottom-0 left-8 flex w-[250px] items-center gap-3 rounded-2xl bg-ink p-3.5 text-white shadow-xl">
        <span className="bg-brand flex size-10 items-center justify-center rounded-xl"><CalendarDays className="size-5" /></span>
        <div>
          <p className="text-[10px] font-semibold tracking-wide text-white/60 uppercase">Scheduled</p>
          <p className="text-[13px] font-semibold">Friday, 6:00 pm</p>
        </div>
      </m.div>
    </div>
  );
}
