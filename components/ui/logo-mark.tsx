import { cn } from "@/lib/utils";

// Same artwork as app/icon.svg so the favicon, nav and PWA icon always match.
export function LogoMark({ className }: { className?: string }) {
  return (
    <svg
      aria-hidden
      viewBox="0 0 64 64"
      className={cn("size-10 shrink-0 drop-shadow-[0_6px_10px_color-mix(in_srgb,var(--brand)_45%,transparent)] transition-transform duration-300 group-hover:-rotate-6 group-hover:scale-105", className)}
    >
      <defs>
        <linearGradient id="lp-logo-g" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#d6455f" />
          <stop offset="1" stopColor="#8a1230" />
        </linearGradient>
      </defs>
      <rect width="64" height="64" rx="18" fill="url(#lp-logo-g)" />
      <path d="M17 18h26a6 6 0 0 1 6 6v13a6 6 0 0 1-6 6H31l-9 8v-8h-5a6 6 0 0 1-6-6V24a6 6 0 0 1 6-6Z" fill="#fff" />
      <path className="origin-center [transform-box:fill-box] group-hover:animate-spin" d="M45 8l2.4 6.1L53.5 16.5l-6.1 2.4L45 25l-2.4-6.1L36.5 16.5l6.1-2.4Z" fill="#ffd43b" />
      <rect x="19" y="27" width="22" height="3.6" rx="1.8" fill="#b91c3c" />
      <rect x="19" y="33.5" width="14" height="3.6" rx="1.8" fill="#e8667f" />
    </svg>
  );
}
