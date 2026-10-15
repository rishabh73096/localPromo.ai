import type { BrandProfile, PosterConfig, PosterSize } from "@/types/promo";

// Canvas renderer for posters. Everything is drawn from the saved brand and one photo: no per-request image generation.
// Using canvas (instead of SVG) gives real text measuring, proper photo cropping, soft shadows and film grain,
// and the PNG download is simply the canvas itself.

export const POSTER_SIZES: Record<PosterSize, { w: number; h: number; label: string }> = {
  square: { w: 1080, h: 1080, label: "Post (1:1)" },
  story: { w: 1080, h: 1920, label: "Story (9:16)" },
  wide: { w: 1620, h: 1080, label: "Wide (3:2)" },
};

const imageCache = new Map<string, Promise<HTMLImageElement>>();
export function loadImage(src: string): Promise<HTMLImageElement> {
  let p = imageCache.get(src);
  if (!p) {
    p = new Promise((res, rej) => {
      const img = new Image();
      img.onload = () => res(img);
      img.onerror = () => rej(new Error("Couldn't load the poster photo."));
      img.src = src;
    });
    imageCache.set(src, p);
  }
  return p;
}

// next/font hides the real family name behind a CSS variable; read it so canvas uses the same typeface as the page.
function family() {
  let inter = "";
  try {
    inter = getComputedStyle(document.documentElement).getPropertyValue("--font-inter-src").trim();
  } catch {}
  return `${inter ? inter + ", " : ""}'Noto Sans Devanagari', system-ui, -apple-system, 'Segoe UI', sans-serif`;
}

function shade(hex: string, amt: number) {
  const n = parseInt(hex.replace("#", ""), 16);
  if (Number.isNaN(n)) return hex;
  const f = (c: number) => Math.max(0, Math.min(255, Math.round(c + amt * 255)));
  return `#${[(n >> 16) & 255, (n >> 8) & 255, n & 255].map((c) => f(c).toString(16).padStart(2, "0")).join("")}`;
}

let grain: HTMLCanvasElement | null = null;
function grainPattern(ctx: CanvasRenderingContext2D) {
  if (!grain) {
    grain = document.createElement("canvas");
    grain.width = grain.height = 220;
    const g = grain.getContext("2d")!;
    const d = g.createImageData(220, 220);
    let seed = 7;
    for (let i = 0; i < d.data.length; i += 4) {
      seed = (seed * 16807) % 2147483647;
      const v = (seed % 255) | 0;
      d.data[i] = d.data[i + 1] = d.data[i + 2] = v;
      d.data[i + 3] = 255;
    }
    g.putImageData(d, 0, 0);
  }
  return ctx.createPattern(grain, "repeat")!;
}

const setSpacing = (ctx: CanvasRenderingContext2D, px: number) => {
  (ctx as unknown as { letterSpacing: string }).letterSpacing = `${px}px`;
};

function wrap(ctx: CanvasRenderingContext2D, text: string, maxW: number, maxLines: number): string[] {
  const words = text.trim().split(/\s+/).filter(Boolean);
  const lines: string[] = [];
  let cur = "";
  for (const w of words) {
    const test = cur ? `${cur} ${w}` : w;
    if (cur && ctx.measureText(test).width > maxW) {
      lines.push(cur);
      cur = w;
    } else cur = test;
  }
  if (cur) lines.push(cur);
  if (lines.length > maxLines) {
    const kept = lines.slice(0, maxLines);
    let last = kept[maxLines - 1];
    while (last.length > 1 && ctx.measureText(last + "…").width > maxW) last = last.slice(0, -1);
    kept[maxLines - 1] = last + "…";
    return kept;
  }
  return lines;
}

// Shrinks a font until the longest line fits (so one long word never runs off the poster).
function fit(ctx: CanvasRenderingContext2D, text: string, weight: number, size: number, maxW: number, maxLines: number, fam: string, spacing = 0) {
  let s = size;
  for (let i = 0; i < 12; i++) {
    ctx.font = `${weight} ${s}px ${fam}`;
    setSpacing(ctx, spacing * (s / size));
    const lines = wrap(ctx, text, maxW, maxLines);
    if (lines.every((l) => ctx.measureText(l).width <= maxW + 1)) return { lines, size: s };
    s *= 0.92;
  }
  ctx.font = `${weight} ${s}px ${fam}`;
  return { lines: wrap(ctx, text, maxW, maxLines), size: s };
}

function cover(ctx: CanvasRenderingContext2D, img: HTMLImageElement, x: number, y: number, w: number, h: number, fx = 0.5, fy = 0.4) {
  const r = Math.max(w / img.width, h / img.height);
  const dw = img.width * r;
  const dh = img.height * r;
  ctx.drawImage(img, x - (dw - w) * fx, y - (dh - h) * fy, dw, dh);
}

function sparkle(ctx: CanvasRenderingContext2D, x: number, y: number, r: number, fill: string) {
  ctx.save();
  ctx.fillStyle = fill;
  ctx.beginPath();
  ctx.moveTo(x, y - r);
  ctx.quadraticCurveTo(x + r * 0.12, y - r * 0.12, x + r, y);
  ctx.quadraticCurveTo(x + r * 0.12, y + r * 0.12, x, y + r);
  ctx.quadraticCurveTo(x - r * 0.12, y + r * 0.12, x - r, y);
  ctx.quadraticCurveTo(x - r * 0.12, y - r * 0.12, x, y - r);
  ctx.fill();
  ctx.restore();
}

function lines(ctx: CanvasRenderingContext2D, ls: string[], x: number, y: number, lh: number, align: CanvasTextAlign = "left") {
  ctx.textAlign = align;
  ls.forEach((l, i) => ctx.fillText(l, x, y + i * lh));
}

function button(ctx: CanvasRenderingContext2D, label: string, x: number, y: number, fg: string, bg: string, fam: string, centered = false) {
  ctx.save();
  ctx.font = `700 38px ${fam}`;
  setSpacing(ctx, 0);
  const tw = ctx.measureText(label).width;
  const bw = Math.max(300, tw + 96);
  const bx = centered ? x - bw / 2 : x;
  ctx.shadowColor = "rgba(0,0,0,0.28)";
  ctx.shadowBlur = 28;
  ctx.shadowOffsetY = 10;
  ctx.fillStyle = bg;
  ctx.beginPath();
  ctx.roundRect(bx, y, bw, 92, 46);
  ctx.fill();
  ctx.shadowColor = "transparent";
  ctx.fillStyle = fg;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText(label, bx + bw / 2, y + 47);
  ctx.restore();
}

function textShadow(ctx: CanvasRenderingContext2D, on: boolean) {
  ctx.shadowColor = on ? "rgba(0,0,0,0.38)" : "transparent";
  ctx.shadowBlur = on ? 22 : 0;
  ctx.shadowOffsetY = on ? 4 : 0;
}

export async function drawPoster(canvas: HTMLCanvasElement, config: PosterConfig, brand: BrandProfile, size: PosterSize) {
  const { w, h } = POSTER_SIZES[size];
  const fam = family();
  try {
    await Promise.all([document.fonts.load(`800 40px ${fam}`), document.fonts.load(`500 40px ${fam}`), document.fonts.load(`700 40px ${fam}`)]);
  } catch {}
  const img = config.image ? await loadImage(config.image).catch(() => null) : null;

  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext("2d")!;
  ctx.clearRect(0, 0, w, h);
  ctx.textBaseline = "alphabetic";

  const story = size === "story";
  const wide = size === "wide";
  const c = config.color || brand.color;
  const dark = shade(c, -0.2);
  const light = shade(c, 0.28);
  const pad = 84;
  const hBase = story ? 140 : wide ? 104 : 120;
  const sBase = story ? 52 : wide ? 40 : 46;
  const footer = [brand.businessName, brand.phone].filter(Boolean).join("  ·  ");
  const place = [brand.address, brand.city].filter(Boolean).join(", ");
  const label = `${config.cta || "Book now"} →`;
  const headText = config.headline || "Special Offer";

  const diag = () => {
    const g = ctx.createLinearGradient(0, 0, w, h);
    g.addColorStop(0, light);
    g.addColorStop(1, dark);
    return g;
  };

  if (config.layout === "bold") {
    // full-bleed photo (or colour), copy anchored bottom-left
    if (img) {
      cover(ctx, img, 0, 0, w, h, 0.5, 0.35);
      const g = wide ? ctx.createLinearGradient(0, 0, w, 0) : ctx.createLinearGradient(0, 0, 0, h);
      if (wide) {
        g.addColorStop(0, "rgba(0,0,0,0.82)");
        g.addColorStop(0.6, "rgba(0,0,0,0.38)");
        g.addColorStop(1, "rgba(0,0,0,0.05)");
      } else {
        g.addColorStop(0, "rgba(0,0,0,0.30)");
        g.addColorStop(0.42, "rgba(0,0,0,0.12)");
        g.addColorStop(1, "rgba(0,0,0,0.86)");
      }
      ctx.fillStyle = g;
      ctx.fillRect(0, 0, w, h);
      const tint = ctx.createLinearGradient(0, 0, 0, h);
      tint.addColorStop(0, "rgba(0,0,0,0)");
      tint.addColorStop(1, dark);
      ctx.globalAlpha = 0.22;
      ctx.fillStyle = tint;
      ctx.fillRect(0, 0, w, h);
      ctx.globalAlpha = 1;
    } else {
      ctx.fillStyle = diag();
      ctx.fillRect(0, 0, w, h);
      ctx.fillStyle = "rgba(255,255,255,0.10)";
      ctx.beginPath();
      ctx.arc(w - 80, 150, h * 0.3, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.fillStyle = "#ffd43b";
    ctx.beginPath();
    ctx.roundRect(pad, pad, 150, 10, 5);
    ctx.fill();

    const maxW = wide ? w * 0.56 : w - pad * 2;
    const ctaY = h - (wide ? 250 : 270);
    const head = fit(ctx, headText, 800, hBase, maxW, wide ? 2 : 3, fam, -2);
    const sub = fit(ctx, config.subline, 500, sBase, maxW * (wide ? 0.9 : 0.92), wide ? 3 : 4, fam);
    const subLH = sub.size * 1.2;
    const headLH = head.size * 1.06;
    const subFirst = ctaY - 56 - (sub.lines.length - 1) * subLH;
    const headFirst = subFirst - sub.size - 24 - (head.lines.length - 1) * headLH;
    ctx.save();
    textShadow(ctx, !!img);
    ctx.fillStyle = "#fff";
    ctx.font = `800 ${head.size}px ${fam}`;
    setSpacing(ctx, -2 * (head.size / hBase));
    lines(ctx, head.lines, pad, headFirst, headLH);
    ctx.font = `500 ${sub.size}px ${fam}`;
    setSpacing(ctx, 0);
    lines(ctx, sub.lines, pad, subFirst, subLH);
    ctx.restore();
    button(ctx, label, pad, ctaY, dark, "#fff", fam);
    ctx.fillStyle = "#fff";
    ctx.font = `700 34px ${fam}`;
    setSpacing(ctx, 0);
    ctx.textAlign = "left";
    ctx.fillText(footer, pad, h - 96);
    if (place) {
      ctx.globalAlpha = 0.8;
      ctx.font = `500 28px ${fam}`;
      ctx.fillText(place, pad, h - 50);
      ctx.globalAlpha = 1;
    }
    sparkle(ctx, w - 150, pad + 60, 62, "#ffd43b");
  }

  if (config.layout === "split") {
    ctx.fillStyle = "#fffaf3";
    ctx.fillRect(0, 0, w, h);
    if (wide) {
      // copy on a clean left panel, photo on the right behind a diagonal edge
      const cut = w * 0.5;
      ctx.save();
      ctx.beginPath();
      ctx.moveTo(cut + 120, 0);
      ctx.lineTo(w, 0);
      ctx.lineTo(w, h);
      ctx.lineTo(cut - 60, h);
      ctx.closePath();
      ctx.clip();
      if (img) cover(ctx, img, cut - 60, 0, w - cut + 60, h, 0.5, 0.35);
      else {
        ctx.fillStyle = diag();
        ctx.fillRect(cut - 60, 0, w - cut + 60, h);
      }
      ctx.restore();
      ctx.fillStyle = "#ffd43b";
      ctx.beginPath();
      ctx.moveTo(cut + 120, 0);
      ctx.lineTo(cut + 164, 0);
      ctx.lineTo(cut - 16, h);
      ctx.lineTo(cut - 60, h);
      ctx.closePath();
      ctx.fill();

      const maxW = cut - pad - 70;
      ctx.fillStyle = c;
      ctx.beginPath();
      ctx.roundRect(pad, pad, 120, 10, 5);
      ctx.fill();
      const head = fit(ctx, headText, 800, hBase, maxW, 2, fam, -2);
      const sub = fit(ctx, config.subline, 500, sBase, maxW, 3, fam);
      const headY = 250;
      ctx.fillStyle = dark;
      ctx.font = `800 ${head.size}px ${fam}`;
      setSpacing(ctx, -2 * (head.size / hBase));
      lines(ctx, head.lines, pad, headY, head.size * 1.06);
      ctx.fillStyle = "#2a1a14";
      ctx.font = `500 ${sub.size}px ${fam}`;
      setSpacing(ctx, 0);
      lines(ctx, sub.lines, pad, headY + (head.lines.length - 1) * head.size * 1.06 + head.size * 0.5 + 30, sub.size * 1.2);
      button(ctx, label, pad, h - 260, "#fff", c, fam);
      ctx.fillStyle = "#2a1a14";
      ctx.font = `700 32px ${fam}`;
      ctx.textAlign = "left";
      ctx.fillText(footer, pad, h - 96);
      if (place) {
        ctx.fillStyle = "#7a6a62";
        ctx.font = `500 27px ${fam}`;
        ctx.fillText(place, pad, h - 50);
      }
    } else {
      const ph = h * (story ? 0.5 : 0.52);
      const edge = () => {
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.lineTo(w, 0);
        ctx.lineTo(w, ph - 70);
        ctx.quadraticCurveTo(w / 2, ph + 190, 0, ph - 70);
        ctx.closePath();
      };
      ctx.save();
      edge();
      ctx.clip();
      if (img) {
        cover(ctx, img, 0, 0, w, ph + 90, 0.5, 0.3);
        ctx.fillStyle = "rgba(0,0,0,0.10)";
        ctx.fillRect(0, 0, w, ph + 90);
      } else {
        ctx.fillStyle = diag();
        ctx.fillRect(0, 0, w, ph + 90);
        ctx.fillStyle = "rgba(255,255,255,0.12)";
        ctx.beginPath();
        ctx.arc(w - 140, 140, 190, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.restore();
      ctx.strokeStyle = "#ffd43b";
      ctx.lineWidth = 8;
      ctx.beginPath();
      ctx.moveTo(0, ph - 70);
      ctx.quadraticCurveTo(w / 2, ph + 190, w, ph - 70);
      ctx.stroke();

      const maxW = w - pad * 2;
      const head = fit(ctx, headText, 800, hBase * 0.92, maxW, 2, fam, -2);
      const sub = fit(ctx, config.subline, 500, sBase, maxW, 2, fam);
      const headY = ph + 150;
      ctx.fillStyle = dark;
      ctx.font = `800 ${head.size}px ${fam}`;
      setSpacing(ctx, -2 * (head.size / hBase));
      lines(ctx, head.lines, w / 2, headY, head.size * 1.06, "center");
      ctx.fillStyle = "#2a1a14";
      ctx.font = `500 ${sub.size}px ${fam}`;
      setSpacing(ctx, 0);
      lines(ctx, sub.lines, w / 2, headY + (head.lines.length - 1) * head.size * 1.06 + sub.size * 1.5, sub.size * 1.2, "center");
      button(ctx, label, w / 2, h - 228, "#fff", c, fam, true);
      ctx.fillStyle = "#2a1a14";
      ctx.font = `700 32px ${fam}`;
      ctx.fillText(footer, w / 2, h - 82);
      if (place) {
        ctx.fillStyle = "#7a6a62";
        ctx.font = `500 26px ${fam}`;
        ctx.fillText(place, w / 2, h - 42);
      }
    }
  }

  if (config.layout === "frame") {
    // "Arch": a doorway-shaped photo window on a solid colour, with a dotted outline that follows it
    ctx.fillStyle = dark;
    ctx.fillRect(0, 0, w, h);
    const rad = ctx.createRadialGradient(w * 0.5, h * 0.3, 40, w * 0.5, h * 0.3, Math.max(w, h) * 0.8);
    rad.addColorStop(0, "rgba(255,255,255,0.10)");
    rad.addColorStop(1, "rgba(0,0,0,0.22)");
    ctx.fillStyle = rad;
    ctx.fillRect(0, 0, w, h);

    const aw = wide ? 500 : story ? 700 : 520;
    const ah = wide ? h - 2 * pad : story ? 880 : 450;
    const ax = wide ? w - pad - aw : (w - aw) / 2;
    const ay = wide ? pad : pad + 10;
    const archPath = (g: number) => {
      const r = aw / 2 + g;
      const cx = ax + aw / 2;
      const cy = ay + aw / 2;
      ctx.beginPath();
      ctx.moveTo(cx - r, ay + ah);
      ctx.lineTo(cx - r, cy);
      ctx.arc(cx, cy, r, Math.PI, 0);
      ctx.lineTo(cx + r, ay + ah);
    };
    // soft shadow under the arch
    ctx.save();
    ctx.shadowColor = "rgba(0,0,0,0.35)";
    ctx.shadowBlur = 50;
    ctx.shadowOffsetY = 20;
    ctx.fillStyle = dark;
    archPath(0);
    ctx.closePath();
    ctx.fill();
    ctx.restore();
    ctx.save();
    archPath(0);
    ctx.closePath();
    ctx.clip();
    if (img) cover(ctx, img, ax, ay, aw, ah, 0.5, 0.3);
    else {
      ctx.fillStyle = diag();
      ctx.fillRect(ax, ay, aw, ah);
      ctx.fillStyle = "rgba(255,255,255,0.14)";
      ctx.beginPath();
      ctx.arc(ax + aw / 2, ay + ah * 0.45, aw * 0.28, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.restore();
    const gap = 28;
    ctx.save();
    ctx.strokeStyle = "#ffd43b";
    ctx.lineWidth = 5;
    ctx.lineCap = "round";
    ctx.setLineDash([1, 15]);
    archPath(gap);
    ctx.stroke();
    ctx.restore();
    const rr = aw / 2 + gap;
    sparkle(ctx, ax + aw / 2 + (wide ? -1 : 1) * rr * 0.7071, ay + aw / 2 - rr * 0.7071, 54, "#ffd43b");

    const maxW = wide ? ax - pad * 2 : w - pad * 2;
    const head = fit(ctx, headText, 800, hBase * 0.86, maxW, 2, fam, -2);
    const sub = fit(ctx, config.subline, 400, sBase * 0.95, maxW, 3, fam);
    const align: CanvasTextAlign = wide ? "left" : "center";
    const tx = wide ? pad : w / 2;
    const headY = wide ? 250 : ay + ah + 150;
    ctx.fillStyle = "#fffaf3";
    ctx.font = `800 ${head.size}px ${fam}`;
    setSpacing(ctx, -2 * (head.size / hBase));
    lines(ctx, head.lines, tx, headY, head.size * 1.06, align);
    ctx.font = `400 ${sub.size}px ${fam}`;
    setSpacing(ctx, 0);
    lines(ctx, sub.lines, tx, headY + (head.lines.length - 1) * head.size * 1.06 + sub.size * 1.5, sub.size * 1.2, align);
    if (wide) button(ctx, label, pad, h - 250, dark, "#ffd43b", fam);
    else button(ctx, label, w / 2, h - 230, dark, "#ffd43b", fam, true);
    ctx.fillStyle = "#fffaf3";
    ctx.font = `700 ${wide ? 32 : 28}px ${fam}`;
    ctx.textAlign = align;
    ctx.fillText(footer, tx, wide ? h - 96 : h - 76);
  }

  // subtle film grain over everything so flat colour looks printed, not digital
  ctx.save();
  ctx.globalAlpha = 0.045;
  ctx.globalCompositeOperation = "overlay";
  ctx.fillStyle = grainPattern(ctx);
  ctx.fillRect(0, 0, w, h);
  ctx.restore();
}

export async function posterBlob(canvas: HTMLCanvasElement): Promise<Blob> {
  const blob = await new Promise<Blob | null>((r) => canvas.toBlob(r, "image/png"));
  if (!blob) throw new Error("Couldn't create the image.");
  return blob;
}
