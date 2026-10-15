"use client";

import { forwardRef, useEffect, useImperativeHandle, useRef } from "react";
import { POSTER_SIZES, drawPoster, posterBlob } from "@/lib/poster-canvas";
import type { BrandProfile, PosterConfig, PosterSize } from "@/types/promo";

export { POSTER_SIZES };

interface Props {
  config: PosterConfig;
  brand: BrandProfile;
  size?: PosterSize;
  className?: string;
}

// Posters are drawn on a <canvas> from reusable layouts, the saved brand and one photo.
export const Poster = forwardRef<HTMLCanvasElement, Props>(function Poster({ config, brand, size = "square", className }, ref) {
  const local = useRef<HTMLCanvasElement>(null);
  useImperativeHandle(ref, () => local.current as HTMLCanvasElement);
  const { w, h } = POSTER_SIZES[size];
  const key = JSON.stringify([config, brand.businessName, brand.phone, brand.address, brand.city, brand.color, size]);

  useEffect(() => {
    const canvas = local.current;
    if (!canvas) return;
    let live = true;
    drawPoster(canvas, config, brand, size).catch(() => {
      if (live) drawPoster(canvas, { ...config, image: undefined }, brand, size).catch(() => {});
    });
    return () => {
      live = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps -- `key` captures every input the drawing reads
  }, [key]);

  return <canvas ref={local} width={w} height={h} className={className} role="img" aria-label={`Poster: ${config.headline}`} />;
});

// The canvas already holds the finished picture, so downloading is just saving it.
export async function downloadPoster(canvas: HTMLCanvasElement, size: PosterSize, name: string) {
  const blob = await posterBlob(canvas);
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = `${name.replace(/[^\w-]+/g, "-").toLowerCase() || "poster"}-${size}.png`;
  a.click();
  setTimeout(() => URL.revokeObjectURL(a.href), 2000);
}
