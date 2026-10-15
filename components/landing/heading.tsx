"use client";

import type { ReactNode } from "react";
import { Reveal } from "@/components/ui/motion";
import { cn } from "@/lib/utils";

// Every landing section opens the same way: a small label, a big title, one plain sentence saying what it is.
export function SectionHead({ eyebrow, title, children, dark, align = "center" }: { eyebrow: string; title: ReactNode; children?: ReactNode; dark?: boolean; align?: "center" | "left" }) {
  return (
    <div className={cn("max-w-[680px]", align === "center" ? "mx-auto text-center" : "")}>
      <Reveal><p className={cn("text-xs font-bold tracking-[0.14em] uppercase", dark ? "text-[#ffd43b]" : "text-brand")}>{eyebrow}</p></Reveal>
      <Reveal delay={0.06}><h2 className={cn("font-inter mt-3 text-[clamp(1.65rem,5.6vw,3.2rem)] leading-[1.04] font-extrabold tracking-[-0.045em]", dark ? "text-white" : "text-ink")}>{title}</h2></Reveal>
      {children ? <Reveal delay={0.12}><p className={cn("mt-4 text-[15px] leading-7 sm:text-lg sm:leading-8", dark ? "text-white/65" : "text-slate-500")}>{children}</p></Reveal> : null}
    </div>
  );
}

export const wrap = "mx-auto w-full max-w-[1180px] px-5 sm:px-8";
