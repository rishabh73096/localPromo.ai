import { Coffee, Dumbbell, Gift, PartyPopper, Scissors, ShoppingBag, Sparkles, Store } from "lucide-react";

const ITEMS = [
  { label: "Salon offers", icon: Scissors },
  { label: "Gym memberships", icon: Dumbbell },
  { label: "Cafe specials", icon: Coffee },
  { label: "Diwali sale", icon: PartyPopper },
  { label: "Retail discounts", icon: ShoppingBag },
  { label: "Raksha Bandhan gifts", icon: Gift },
  { label: "New arrivals", icon: Store },
  { label: "Weekday glow", icon: Sparkles },
];

export function Marquee() {
  return (
    <div className="relative overflow-hidden border-y border-white/10 bg-black py-5" aria-label="Offers you can promote">
      <div className="marquee-scroll flex w-max gap-10" style={{ animationDuration: "38s" }}>
        {[...ITEMS, ...ITEMS].map(({ label, icon: Icon }, i) => (
          <span key={i} aria-hidden={i >= ITEMS.length} className="flex items-center gap-3 text-sm font-semibold whitespace-nowrap text-white/70">
            <Icon className="size-4 text-[#ffd43b]" />
            {label}
            <span className="ml-7 text-white/20">✦</span>
          </span>
        ))}
      </div>
      <div aria-hidden className="pointer-events-none absolute inset-y-0 left-0 w-24 bg-linear-to-r from-black to-transparent" />
      <div aria-hidden className="pointer-events-none absolute inset-y-0 right-0 w-24 bg-linear-to-l from-black to-transparent" />
    </div>
  );
}
