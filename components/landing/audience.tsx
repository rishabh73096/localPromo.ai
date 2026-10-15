"use client";

import { useState } from "react";
import Image from "next/image";
import { IconCoffee as Coffee, IconBarbell as Dumbbell, IconScissors as Scissors, IconBuildingStore as Store, type Icon as TablerIcon } from "@tabler/icons-react";
import * as m from "motion/react-m";
import { SectionHead, wrap } from "@/components/landing/heading";
import { cn } from "@/lib/utils";

const CASES: { key: string; photo: string; label: string; icon: TablerIcon; who: string; scenario: string; offers: string[]; color: string }[] = [
  { key: "salon", photo: "/images/biz/salon.jpg", label: "Salon", icon: Scissors, who: "Salon owner", scenario: "Enter a Diwali offer once. Get an English caption, a Hindi caption and a poster in your colours. Reuse the same template for Raksha Bandhan and Karwa Chauth.", offers: ["Weekday glow: 20% off Mon–Thu", "Bridal package with free trial", "Festival facial + hair spa combo"], color: "#d6336c" },
  { key: "gym", photo: "/images/biz/gym.jpg", label: "Gym", icon: Dumbbell, who: "Gym owner", scenario: "Run a New Year membership drive, a free-trial week and a bring-a-friend month from the same brand profile, changing only the price and the dates.", offers: ["3 months + 1 month free", "7-day free trial", "Bring a friend, both get 10% off"], color: "#1c7ed6" },
  { key: "cafe", photo: "/images/biz/cafe.jpg", label: "Cafe", icon: Coffee, who: "Cafe owner", scenario: "Plan a week of daily specials in one sitting. Copy the WhatsApp message for each day, and download a story-size poster for your status.", offers: ["Coffee + sandwich combo", "Buy 1 get 1, 3 to 6 pm", "Festive dessert box"], color: "#e8590c" },
  { key: "retail", photo: "/images/biz/retail.jpg", label: "Retail", icon: Store, who: "Shop owner", scenario: "Announce a season sale, a festival gift range or a new collection. One offer line becomes a caption, a message and a poster for the shop window.", offers: ["Flat 30% off selected items", "Free gift wrapping", "New collection just landed"], color: "#b91c3c" },
];

export function Audience() {
  const [i, setI] = useState(0);
  const c = CASES[i];
  return (
    <section className="bg-white py-16 sm:py-24">
      <div className={wrap}>
        <SectionHead eyebrow="Made for owners who run the shop themselves" title="Pick your shop. See your month.">
          Each business gets templates written for how it actually sells. Illustrative scenarios, not customer reviews.
        </SectionHead>
        <div role="tablist" aria-label="Business type" className="mt-10 flex flex-wrap justify-center gap-2">
          {CASES.map((x, idx) => (
            <button key={x.key} role="tab" aria-selected={idx === i} type="button" onClick={() => setI(idx)} className={cn("flex h-11 items-center gap-2 rounded-full px-5 text-sm font-semibold transition-all", idx === i ? "bg-ink text-white shadow-lg" : "bg-[#f7efe6] text-slate-600 hover:bg-[#f5d9d6]")}>
              <x.icon className="size-4" />{x.label}
            </button>
          ))}
        </div>
        <m.div key={c.key} initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }} className="mx-auto mt-10 grid max-w-[980px] items-center gap-8 overflow-hidden rounded-[2.5rem] border border-black/[0.06] bg-[#fffaf3] p-6 sm:p-10 md:grid-cols-2">
          <div className="relative aspect-[4/3] overflow-hidden rounded-3xl md:aspect-[4/5]">
            <Image src={c.photo} alt={`${c.who} at work`} fill sizes="(max-width: 768px) 90vw, 320px" quality={85} className="object-cover" />
            <div aria-hidden className="absolute inset-0 bg-linear-to-t from-black/75 via-transparent to-transparent" />
            <div className="absolute inset-x-0 bottom-0 p-4 text-white">
              <span className="flex size-9 items-center justify-center rounded-xl" style={{ background: c.color }}><c.icon className="size-[18px]" /></span>
              <h3 className="font-inter mt-2 text-xl font-extrabold tracking-[-0.03em] sm:text-2xl">{c.who}</h3>
            </div>
          </div>
          <div>
            <p className="text-[15px] leading-7 text-slate-600">{c.scenario}</p>
            <p className="mt-5 text-xs font-bold tracking-wide text-slate-400 uppercase">Offers you can start from</p>
          <ul className="mt-3 space-y-2.5">
            {c.offers.map((o, k) => (
              <m.li key={o} initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.15 + k * 0.1, duration: 0.45 }} className="flex items-center gap-3 rounded-2xl bg-white p-4 shadow-sm ring-1 ring-black/[0.05]">
                <span className="size-2.5 shrink-0 rounded-full" style={{ background: c.color }} />
                <span className="text-sm font-semibold text-ink">{o}</span>
              </m.li>
            ))}
          </ul>
          </div>
        </m.div>
      </div>
    </section>
  );
}
