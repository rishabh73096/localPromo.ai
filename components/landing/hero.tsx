import Link from "next/link";
import { IconArrowDown as ArrowDown, IconArrowRight as ArrowRight, IconSparkles as Sparkles } from "@tabler/icons-react";
import Image from "next/image";

const WORDS = ["Fill", "your", "shop", "with", "offers", "that", "sell."];

// Full-screen scene on top, the message sits at the bottom centre.
export function Hero() {
  return (
    <section className="relative isolate flex h-svh max-h-[1100px] min-h-[680px] flex-col justify-end overflow-hidden bg-black text-white">
      {/* Real photo: Indian bazaar by Deepak Ghoran, Pexels (free licence). Colours are left as shot. */}
      <Image src="/images/hero-bazaar.jpg" alt="A crowded Indian bazaar with colourful shops and shoppers" fill priority sizes="100vw" className="lp-kenburns object-cover object-[50%_35%]" />
      {/* legibility: the photo fades to black where the text sits */}
      <div aria-hidden className="absolute inset-x-0 bottom-0 z-10 h-[78%] bg-linear-to-t from-black/90 from-25% via-black/60 via-60% to-transparent" />
      <div aria-hidden className="absolute inset-x-0 top-0 z-10 h-32 bg-linear-to-b from-black/55 to-transparent" />

      <div className="relative z-20 mx-auto flex w-full max-w-[1100px] flex-col items-center px-5 pb-16 text-center sm:pb-20">
        <p style={{ "--delay": "0.1s" } as React.CSSProperties} className="lp-rise inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-1.5 text-xs font-semibold tracking-wide text-white/90 backdrop-blur-md">
          <Sparkles className="size-3.5 text-[#ffd43b]" /> Hindi + English promotions for salons, gyms, cafes and shops
        </p>

        <h1 className="font-inter mt-5 text-[clamp(2rem,5.4vw,4.4rem)] leading-[0.98] font-extrabold tracking-[-0.05em]">
          {WORDS.map((w, i) => (
            <span key={i} style={{ "--delay": `${0.25 + i * 0.07}s` } as React.CSSProperties} className={`lp-rise ${i >= 4 ? "mr-[0.22em] inline-block text-[#ffd43b]" : "mr-[0.22em] inline-block"}`}>
              {w}
            </span>
          ))}
        </h1>

        <p style={{ "--delay": "0.85s" } as React.CSSProperties} className="lp-rise mt-5 max-w-[640px] text-base leading-7 text-white/75 sm:text-lg sm:leading-8">
          Save your brand once. Get captions in Hindi and English, WhatsApp-ready copy, a poster in your colours and a posting calendar.
        </p>

        <div style={{ "--delay": "1s" } as React.CSSProperties} className="lp-rise mt-8 flex flex-wrap items-center justify-center gap-3">
          <Link href="/signup" className="group inline-flex h-13 items-center gap-2 rounded-full bg-white px-8 text-[15px] font-bold text-[#1c1210] shadow-[0_10px_40px_-8px_rgba(255,255,255,0.45)] transition-transform hover:scale-[1.04] active:scale-95">
            Start promoting <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
          </Link>
          <a href="#demo" className="inline-flex h-13 items-center gap-2 rounded-full border border-white/25 bg-white/10 px-7 text-[15px] font-semibold text-white backdrop-blur-md transition-colors hover:bg-white/20">
            Try it live
          </a>
        </div>
        <p className="mt-4 text-xs text-white/45">Starter from ₹299 a month. Reusable templates, not a blank AI text box.</p>
      </div>

      <a href="#how" aria-label="Scroll to how it works" style={{ "--delay": "1.6s" } as React.CSSProperties} className="lp-rise absolute bottom-5 left-1/2 z-20 hidden -translate-x-1/2 text-white/50 hover:text-white sm:block">
        <ArrowDown className="size-5 animate-bounce" />
      </a>
    </section>
  );
}
