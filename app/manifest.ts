import type { MetadataRoute } from "next";
import { BRAND, SEO } from "@/config/site";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: BRAND.name,
    short_name: BRAND.prefix,
    description: SEO.description,
    start_url: "/dashboard",
    display: "standalone",
    background_color: "#fffaf3",
    theme_color: "#b91c3c",
    lang: "en-IN",
    categories: ["business", "productivity", "marketing"],
    icons: [{ src: "/icon.svg", sizes: "any", type: "image/svg+xml", purpose: "any" }, { src: "/icon.svg", sizes: "any", type: "image/svg+xml", purpose: "maskable" }],
    shortcuts: [{ name: "Create content", url: "/create" }, { name: "Saved drafts", url: "/drafts" }],
  };
}
