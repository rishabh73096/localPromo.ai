"use client";

import * as m from "motion/react-m";
import { CountUp } from "@/components/ui/count-up";
import { wrap } from "@/components/landing/heading";

const STATS: { value: number; suffix?: string; label: string; text: string }[] = [
  { value: 4, label: "kinds of shops", text: "Salon, gym, cafe and retail templates to start from." },
  { value: 2, label: "languages", text: "Every caption in English and Hindi." },
  { value: 12, label: "ready offers", text: "Weekday, membership, festival and launch templates." },
  { value: 3, label: "poster layouts", text: "Bold, Split and Frame, in post and story sizes." },
];

export function Stats() {
  return (
    <section className="relative overflow-hidden bg-[#1c1210] py-14 sm:py-20 text-white">
      <div className={`${wrap} relative grid gap-8 sm:grid-cols-2 lg:grid-cols-4`}>
        {STATS.map((s, i) => (
          <m.div key={s.label} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1, duration: 0.6 }}>
            <p className="font-inter text-5xl sm:text-6xl font-extrabold tracking-[-0.05em]"><CountUp value={s.value} />{s.suffix}</p>
            <p className="mt-1 text-sm font-bold tracking-wide uppercase text-[#ffd43b]">{s.label}</p>
            <p className="mt-2 text-sm leading-6 text-white/70">{s.text}</p>
          </m.div>
        ))}
      </div>
    </section>
  );
}
