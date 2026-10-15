"use client";

import Image from "next/image";
import * as m from "motion/react-m";
import { IconCalendarEvent as CalendarDays, IconFileDownload as FileDown, IconLanguage as Languages, IconMessageCircle as MessageCircle, IconPalette as Palette, IconConfetti as PartyPopper, IconWifiOff as WifiOff } from "@tabler/icons-react";
import { SectionHead, wrap } from "@/components/landing/heading";
import { cardIn, gridStagger } from "@/components/ui/motion";
import { cn } from "@/lib/utils";

const CARD = "group relative overflow-hidden rounded-3xl border border-black/[0.06] bg-white p-5 sm:p-6 transition-shadow duration-300 hover:shadow-2xl hover:shadow-[#b91c3c]/10";

export function Features() {
  return (
    <section id="features" className="scroll-mt-16 bg-white py-16 sm:py-24">
      <div className={wrap}>
        <SectionHead eyebrow="What you get" title="A promotion workflow, not a caption box.">
          Everything an owner needs to run an offer every week without hiring an agency: your brand, ready templates, two languages, posters, and a calendar.
        </SectionHead>

        <m.div variants={gridStagger} initial="hidden" whileInView="show" viewport={{ once: true, margin: "0px 0px -10% 0px" }} className="mt-10 grid gap-3 sm:mt-14 sm:gap-4 md:grid-cols-6">
          <m.div variants={cardIn} whileHover={{ y: -4 }} className={cn(CARD, "md:col-span-4 md:row-span-2 bg-linear-to-br from-[#fdecee] to-white")}>
            <Palette className="text-brand size-8" />
            <h3 className="font-inter mt-4 text-2xl font-extrabold tracking-[-0.03em] text-ink">One brand. Every offer.</h3>
            <p className="mt-2 max-w-[440px] text-slate-600">Save your name, services, address, phone, tone and colour once. Every caption and poster is built from it, so you never retype the same details again.</p>
            <div className="mt-8 grid grid-cols-3 gap-2.5 sm:gap-3">
              {[["salon", "Salon", "Weekday Glow"], ["gym", "Gym", "Start Strong"], ["cafe", "Cafe", "Happy Hours"]].map(([k, label, line], i) => (
                <m.div key={k} whileHover={{ y: -6, rotate: i === 1 ? 0 : i === 0 ? -2 : 2 }} className="group relative aspect-[3/4] overflow-hidden rounded-2xl shadow-lg">
                  <Image src={`/images/biz/${k}.jpg`} alt={`${label} promotion`} fill sizes="(max-width: 768px) 30vw, 220px" quality={80} className="object-cover transition-transform duration-700 group-hover:scale-110" />
                  <div aria-hidden className="absolute inset-0 bg-linear-to-t from-black/80 via-black/10 to-transparent" />
                  <div className="absolute inset-x-0 bottom-0 p-2.5 text-white sm:p-3.5">
                    <p className="text-[8px] font-bold tracking-widest uppercase opacity-80 sm:text-[9px]">{label}</p>
                    <p className="font-inter text-[13px] leading-tight font-extrabold sm:text-lg">{line}</p>
                  </div>
                </m.div>
              ))}
            </div>
          </m.div>

          <m.div variants={cardIn} whileHover={{ y: -4 }} className={cn(CARD, "md:col-span-2")}>
            <Languages className="text-brand size-7" />
            <h3 className="font-inter mt-3 text-lg font-bold text-ink">Hindi and English</h3>
            <p className="mt-1.5 text-sm text-slate-600">Every offer comes as an English caption and a Hindi caption, in your tone.</p>
            <p className="mt-4 rounded-xl bg-[#f7efe6] p-3 text-sm font-medium text-ink">इस दिवाली निखार लाइए ✨</p>
          </m.div>

          <m.div variants={cardIn} whileHover={{ y: -4 }} className={cn(CARD, "md:col-span-2 bg-[#dcf8c6]/50")}>
            <MessageCircle className="size-7 text-[#1f7a4a]" />
            <h3 className="font-inter mt-3 text-lg font-bold text-ink">WhatsApp-ready</h3>
            <p className="mt-1.5 text-sm text-slate-600">A short message you can paste into a broadcast or status in one tap.</p>
          </m.div>

          <m.div variants={cardIn} whileHover={{ y: -4 }} className={cn(CARD, "md:col-span-2")}>
            <FileDown className="text-brand size-7" />
            <h3 className="font-inter mt-3 text-lg font-bold text-ink">Posters you can edit</h3>
            <p className="mt-1.5 text-sm text-slate-600">Three layouts, post and story sizes, your colour. Download as PNG. No image-AI, so it is instant and consistent.</p>
          </m.div>

          <m.div variants={cardIn} whileHover={{ y: -4 }} className={cn(CARD, "md:col-span-2")}>
            <CalendarDays className="text-brand size-7" />
            <h3 className="font-inter mt-3 text-lg font-bold text-ink">Content calendar</h3>
            <p className="mt-1.5 text-sm text-slate-600">See the month at a glance with draft, ready, scheduled and published posts.</p>
          </m.div>

          <m.div variants={cardIn} whileHover={{ y: -4 }} className={cn(CARD, "md:col-span-2 bg-[#fff4d6]/60")}>
            <PartyPopper className="size-7 text-[#c2780a]" />
            <h3 className="font-inter mt-3 text-lg font-bold text-ink">Festival ideas</h3>
            <p className="mt-1.5 text-sm text-slate-600">Diwali, Holi, Raksha Bandhan and more, suggested weeks ahead with an offer to start from.</p>
          </m.div>

          <m.div variants={cardIn} whileHover={{ y: -4 }} className={cn(CARD, "md:col-span-6 bg-ink text-white")}>
            <WifiOff className="size-7 text-[#ffd43b]" />
            <h3 className="font-inter mt-3 text-lg font-bold">Works on weak internet</h3>
            <p className="mt-1.5 text-sm text-white/65">Pages you opened and your latest drafts stay on your phone, so you can keep editing when the network drops.</p>
          </m.div>
        </m.div>
      </div>
    </section>
  );
}
