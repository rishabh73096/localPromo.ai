"use client";

import Image from "next/image";
import { CalendarHeart } from "lucide-react";
import * as m from "motion/react-m";
import { SectionHead, wrap } from "@/components/landing/heading";
import { useMounted } from "@/hooks/use-mounted";
import { useNow } from "@/hooks/use-now";
import { upcomingFestivals } from "@/lib/templates";

export function Festivals() {
  const mounted = useMounted();
  const now = useNow();
  const list = mounted ? upcomingFestivals(now, 7) : [];
  return (
    <section className="relative overflow-hidden bg-[#fffaf3] py-16 sm:py-24">
      <div className={wrap}>
        <SectionHead eyebrow="Never miss a festival" title="The next sale is already on your calendar.">
          Festival days bring the most walk-ins. LocalPromo shows what is coming up, so you can plan the offer weeks ahead instead of the night before.
        </SectionHead>
      </div>
      <div className="mt-8 flex sm:mt-12 snap-x gap-5 overflow-x-auto px-5 pb-8 sm:px-[max(2rem,calc((100vw-1180px)/2+2rem))]" style={{ scrollbarWidth: "none" }}>
        {list.length === 0 ? <div className="h-[360px] w-full" /> : null}
        {list.map((f, i) => {
          const days = Math.max(0, Math.round((f.at.getTime() - now) / 86_400_000));
          return (
            <m.article key={f.name + f.at.getTime()} initial={{ opacity: 0, y: 30, scale: 0.96 }} whileInView={{ opacity: 1, y: 0, scale: 1 }} viewport={{ once: true }} transition={{ delay: i * 0.08, duration: 0.5 }} whileHover={{ y: -8 }} className="group relative h-[300px] w-[230px] sm:h-[360px] sm:w-[280px] shrink-0 snap-start overflow-hidden rounded-[1.75rem] bg-black shadow-xl">
              <Image src={f.image} alt={`${f.name} celebration`} fill sizes="(max-width: 640px) 70vw, 300px" quality={85} className="object-cover transition-transform duration-700 ease-out group-hover:scale-110" />
              <div aria-hidden className="absolute inset-0 bg-linear-to-t from-black/85 via-black/20 to-transparent" />
              <CalendarHeart className="absolute top-5 left-5 size-6 text-white/90 drop-shadow" />
              <span className="absolute top-5 right-5 rounded-full bg-black/45 px-3 py-1 text-xs font-bold text-white backdrop-blur-md">{days === 0 ? "Today" : `in ${days} days`}</span>
              <div className="absolute inset-x-0 bottom-0 p-5 text-white">
                <p className="text-xs font-semibold text-white/80">{f.at.toLocaleDateString("en-IN", { day: "numeric", month: "long" })}{f.approx ? " (approx.)" : ""}</p>
                <p className="font-inter mt-1 text-2xl leading-tight sm:text-3xl font-extrabold tracking-[-0.03em]">{f.name}</p>
                <p className="text-sm text-white/85">{f.hi}</p>
              </div>
            </m.article>
          );
        })}
      </div>
      <p className="mt-2 text-center text-xs text-slate-400">Photos: <a href="https://www.pexels.com" target="_blank" rel="noreferrer" className="underline hover:text-ink">Pexels</a> (free licence). Lunar festival dates can shift by a day.</p>
    </section>
  );
}
