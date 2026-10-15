"use client";

import { forwardRef } from "react";
import type { BrandProfile, PosterConfig, PosterSize } from "@/types/promo";

// Posters are reusable SVG layouts filled with brand data: no per-request image generation.
export const POSTER_SIZES: Record<PosterSize, { w: number; h: number; label: string }> = {
  square: { w: 1080, h: 1080, label: "Post (1:1)" },
  story: { w: 1080, h: 1920, label: "Story (9:16)" },
};

const FONT = "'Noto Sans Devanagari','Segoe UI',system-ui,-apple-system,Roboto,sans-serif";

// Greedy word wrap by estimated glyph width (SVG has no auto-wrap).
export function wrap(text: string, maxChars: number, maxLines: number): string[] {
  const words = text.trim().split(/\s+/).filter(Boolean);
  const lines: string[] = [];
  let cur = "";
  for (const w of words) {
    if ((cur + " " + w).trim().length > maxChars && cur) {
      lines.push(cur);
      cur = w;
    } else cur = (cur + " " + w).trim();
  }
  if (cur) lines.push(cur);
  if (lines.length > maxLines) {
    const kept = lines.slice(0, maxLines);
    kept[maxLines - 1] = kept[maxLines - 1].replace(/.{0,2}$/, "") + "…";
    return kept;
  }
  return lines;
}

function shade(hex: string, amt: number) {
  const n = parseInt(hex.replace("#", ""), 16);
  if (Number.isNaN(n)) return hex;
  const f = (c: number) => Math.max(0, Math.min(255, Math.round(c + amt * 255)));
  return `#${[(n >> 16) & 255, (n >> 8) & 255, n & 255].map((c) => f(c).toString(16).padStart(2, "0")).join("")}`;
}

interface Props {
  config: PosterConfig;
  brand: BrandProfile;
  size?: PosterSize;
  className?: string;
}

export const Poster = forwardRef<SVGSVGElement, Props>(function Poster({ config, brand, size = "square", className }, ref) {
  const { w, h } = POSTER_SIZES[size];
  const story = size === "story";
  const c = config.color || brand.color;
  const dark = shade(c, -0.18);
  const light = shade(c, 0.28);
  const headline = wrap(config.headline || "Special Offer", story ? 12 : 14, 3);
  const sub = wrap(config.subline, story ? 28 : 32, 4);
  const hSize = story ? 150 : 128;
  const sSize = story ? 54 : 48;
  const cy = story ? 560 : 330;
  const subY = cy + headline.length * hSize * 1.05 + 40;
  const ctaY = h - (story ? 420 : 240);
  const footer = [brand.businessName, brand.phone].filter(Boolean).join("  ·  ");
  const place = [brand.address, brand.city].filter(Boolean).join(", ");

  const text = (fill: string, lines: string[], y: number, fs: number, weight: number, x = 90) =>
    lines.map((l, i) => (
      <text key={i} x={x} y={y + i * fs * 1.12} fill={fill} fontSize={fs} fontWeight={weight} fontFamily={FONT}>{l}</text>
    ));

  const cta = (fg: string, bg: string) => (
    <g>
      <rect x={90} y={ctaY} rx={48} width={Math.max(300, (config.cta || "").length * 30 + 100)} height={96} fill={bg} />
      <text x={90 + 50} y={ctaY + 63} fill={fg} fontSize={42} fontWeight={700} fontFamily={FONT}>{config.cta || "Book now"} →</text>
    </g>
  );

  return (
    <svg ref={ref} xmlns="http://www.w3.org/2000/svg" viewBox={`0 0 ${w} ${h}`} width={w} height={h} className={className} role="img" aria-label={`Poster: ${config.headline}`}>
      <defs>
        <linearGradient id="pg" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor={light} /><stop offset="1" stopColor={dark} /></linearGradient>
        <linearGradient id="po" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#000" stopOpacity="0.3" /><stop offset="0.45" stopColor={dark} stopOpacity="0.28" /><stop offset="1" stopColor="#000" stopOpacity="0.85" /></linearGradient>
        <clipPath id="pc"><rect width={w} height={h * 0.55} /></clipPath>
      </defs>

      {config.layout === "bold" ? (
        <>
          {config.image ? (
            <>
              <image href={config.image} x={0} y={0} width={w} height={h} preserveAspectRatio="xMidYMid slice" />
              <rect width={w} height={h} fill="url(#po)" />
            </>
          ) : (
            <rect width={w} height={h} fill="url(#pg)" />
          )}
          <circle cx={w - 60} cy={160} r={330} fill="#fff" opacity={config.image ? 0.04 : 0.1} />
          <circle cx={120} cy={h - 120} r={260} fill="#fff" opacity={0.08} />
          <path d={`M${w - 210} 90l22 56 56 22-56 22-22 56-22-56-56-22 56-22z`} fill="#ffd43b" />
          {text("#fff", headline, cy, hSize, 800)}
          {text("#fff", sub, subY, sSize, 500)}
          {cta(dark, "#fff")}
          <text x={90} y={h - 100} fill="#fff" fontSize={36} fontWeight={700} fontFamily={FONT}>{footer}</text>
          {place ? <text x={90} y={h - 50} fill="#fff" opacity={0.85} fontSize={30} fontFamily={FONT}>{place}</text> : null}
        </>
      ) : null}

      {config.layout === "split" ? (
        <>
          <rect width={w} height={h} fill="#fff" />
          <rect width={w} height={h * 0.55} fill="url(#pg)" />
          {config.image ? (
            <g clipPath="url(#pc)">
              <image href={config.image} width={w} height={h * 0.55} preserveAspectRatio="xMidYMid slice" />
              <rect width={w} height={h * 0.55} fill="url(#po)" />
            </g>
          ) : null}
          <path d={`M0 ${h * 0.55} Q ${w / 2} ${h * 0.55 + 110} ${w} ${h * 0.55} L ${w} ${h * 0.55 - 1} L 0 ${h * 0.55 - 1} Z`} fill="url(#pg)" />
          <circle cx={w - 140} cy={140} r={180} fill="#fff" opacity={0.12} />
          {text("#fff", headline, story ? 360 : 250, hSize, 800)}
          {text("#2a1a14", sub, h * 0.55 + (story ? 170 : 150), sSize, 600)}
          {cta("#fff", c)}
          <text x={90} y={h - 100} fill="#2a1a14" fontSize={36} fontWeight={700} fontFamily={FONT}>{footer}</text>
          {place ? <text x={90} y={h - 50} fill="#7a6a62" fontSize={30} fontFamily={FONT}>{place}</text> : null}
        </>
      ) : null}

      {config.layout === "frame" ? (
        <>
          <rect width={w} height={h} fill="#fffaf0" />
          {config.image ? (
            <>
              <image href={config.image} x={40} y={40} width={w - 80} height={h * 0.42} preserveAspectRatio="xMidYMid slice" />
              <rect x={40} y={40} width={w - 80} height={h * 0.42} fill={c} opacity={0.18} />
            </>
          ) : null}
          <rect x={40} y={40} width={w - 80} height={h - 80} rx={36} fill="none" stroke={c} strokeWidth={14} />
          <rect x={70} y={70} width={w - 140} height={h - 140} rx={20} fill="none" stroke="#ffd43b" strokeWidth={4} strokeDasharray="4 14" strokeLinecap="round" />
          <path d={`M${w / 2} ${config.image ? h * 0.42 - 20 : 150}l18 46 46 18-46 18-18 46-18-46-46-18 46-18z`} fill={c} />
          {text(dark, headline, config.image ? h * 0.42 + 150 : cy, hSize * (config.image ? 0.8 : 1), 800)}
          {text("#3b3556", sub, config.image ? h * 0.42 + 150 + headline.length * hSize * 0.85 + 30 : subY, sSize, 500)}
          {cta("#fff", c)}
          <text x={90} y={h - 120} fill={dark} fontSize={36} fontWeight={700} fontFamily={FONT}>{footer}</text>
          {place ? <text x={90} y={h - 72} fill="#7a6a62" fontSize={30} fontFamily={FONT}>{place}</text> : null}
        </>
      ) : null}
    </svg>
  );
});

// SVG -> PNG in the browser (no server round trip).
export async function downloadPoster(svg: SVGSVGElement, size: PosterSize, name: string) {
  const { w, h } = POSTER_SIZES[size];
  // an SVG drawn through <img> cannot load outside files, so embed the photo as a data URL first
  const clone = svg.cloneNode(true) as SVGSVGElement;
  for (const el of Array.from(clone.querySelectorAll("image"))) {
    const href = el.getAttribute("href");
    if (href && !href.startsWith("data:")) {
      const blob = await (await fetch(href)).blob();
      const data = await new Promise<string>((res) => {
        const r = new FileReader();
        r.onload = () => res(String(r.result));
        r.readAsDataURL(blob);
      });
      el.setAttribute("href", data);
    }
  }
  const xml = new XMLSerializer().serializeToString(clone);
  const url = URL.createObjectURL(new Blob([xml], { type: "image/svg+xml;charset=utf-8" }));
  try {
    const img = new Image();
    await new Promise<void>((res, rej) => {
      img.onload = () => res();
      img.onerror = () => rej(new Error("Couldn't draw the poster."));
      img.src = url;
    });
    const canvas = document.createElement("canvas");
    canvas.width = w;
    canvas.height = h;
    canvas.getContext("2d")!.drawImage(img, 0, 0, w, h);
    const blob = await new Promise<Blob | null>((r) => canvas.toBlob(r, "image/png"));
    if (!blob) throw new Error("Couldn't create the image.");
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = `${name.replace(/[^\w-]+/g, "-").toLowerCase() || "poster"}-${size}.png`;
    a.click();
    setTimeout(() => URL.revokeObjectURL(a.href), 2000);
  } finally {
    URL.revokeObjectURL(url);
  }
}
