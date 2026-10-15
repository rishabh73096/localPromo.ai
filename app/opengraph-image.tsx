import { ImageResponse } from "next/og";
import { BRAND } from "@/config/site";

export const alt = `${BRAND.name}: offers, captions and posters`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", justifyContent: "space-between", padding: 72, background: "#1c1210", color: "white", fontFamily: "sans-serif" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
          <div style={{ width: 72, height: 72, borderRadius: 20, background: "#1c1210", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 40 }}><div style={{ width: 30, height: 30, background: "#ffd43b", transform: "rotate(45deg)", borderRadius: 6 }} /></div>
          <div style={{ fontSize: 40, fontWeight: 700, display: "flex" }}>
            {BRAND.prefix}
            <span style={{ color: "#ffd43b", marginLeft: 10 }}>{BRAND.accent.trim()}</span>
          </div>
        </div>
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ fontSize: 88, fontWeight: 800, lineHeight: 1.02, letterSpacing: -3 }}>Offers that fill your shop.</div>
          <div style={{ marginTop: 28, fontSize: 32, color: "#9aa3c0" }}>Hindi and English captions, posters and a posting calendar. From ₹299/month.</div>
        </div>
      </div>
    ),
    size,
  );
}
