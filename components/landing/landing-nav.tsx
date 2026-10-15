"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";
import { Logo } from "@/components/ui/logo";
import { cn } from "@/lib/utils";

const LINKS = [
  ["How it works", "#how"],
  ["Try it", "#demo"],
  ["Features", "#features"],
  ["Pricing", "#pricing"],
  ["FAQ", "#faq"],
];

// Transparent over the hero, turns into a frosted bar once you scroll.
export function LandingNav() {
  const [solid, setSolid] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const on = () => setSolid(window.scrollY > 40);
    on();
    window.addEventListener("scroll", on, { passive: true });
    return () => window.removeEventListener("scroll", on);
  }, []);

  const light = !solid && !open;
  return (
    <header className={cn("fixed inset-x-0 top-0 z-50 transition-all duration-300", solid || open ? "border-b border-black/[0.06] bg-white/95 shadow-sm backdrop-blur-xl" : "border-b border-transparent bg-transparent")}>
      <div className="mx-auto flex h-16 max-w-[1280px] items-center gap-8 px-5 sm:px-8">
        <Logo tone={light ? "light" : "dark"} />
        <nav className="hidden gap-7 md:flex" aria-label="Sections">
          {LINKS.map(([label, href]) => (
            <a key={href} href={href} className={cn("text-sm font-medium transition-colors", light ? "text-white/75 hover:text-white" : "text-slate-600 hover:text-ink")}>{label}</a>
          ))}
        </nav>
        <div className="ml-auto flex items-center gap-2">
          <Link href="/login" className={cn("hidden h-10 items-center rounded-full px-4 text-sm font-semibold transition-colors sm:inline-flex", light ? "text-white/85 hover:text-white" : "text-slate-700 hover:text-ink")}>Sign in</Link>
          <Link href="/signup" className={cn("inline-flex h-10 items-center whitespace-nowrap rounded-full px-4 text-sm font-semibold transition-all sm:px-5 hover:scale-[1.04] active:scale-95", light ? "bg-white text-ink" : "bg-ink text-white")}>Get started</Link>
          <button type="button" aria-label={open ? "Close menu" : "Open menu"} aria-expanded={open} onClick={() => setOpen((v) => !v)} className={cn("flex size-10 items-center justify-center rounded-full md:hidden", light ? "text-white" : "text-ink")}>
            {open ? <X className="size-5" /> : <Menu className="size-5" />}
          </button>
        </div>
      </div>
      {open ? (
        <nav className="animate-in fade-in slide-in-from-top-2 border-t border-black/[0.06] bg-white px-5 py-3 md:hidden" aria-label="Sections">
          {LINKS.map(([label, href]) => (
            <a key={href} href={href} onClick={() => setOpen(false)} className="block py-3 text-[15px] font-medium text-ink">{label}</a>
          ))}
          <Link href="/login" className="block py-3 text-[15px] font-medium text-slate-500">Sign in</Link>
        </nav>
      ) : null}
    </header>
  );
}
