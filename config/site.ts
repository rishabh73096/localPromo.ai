import { Megaphone } from "lucide-react";

export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3012").replace(/\/$/, "");

export const BRAND = {
  icon: Megaphone,
  name: "LocalPromo AI",
  prefix: "LocalPromo",
  accent: " AI",
  tagline: "Marketing content that leads to enquiries",
  loginTagline: "Pick up where your last campaign left off.",
  signupTagline: "Plan and publish local offers in Hindi and English.",
  appTitle: "LocalPromo AI",
};

export const SEO = {
  title: `${BRAND.name}: Offers, captions and posters for local shops`,
  description:
    "Promotion assistant for salons, gyms, cafes and local retail in India. Save your brand once, then get Hindi and English captions, WhatsApp-ready copy, editable posters and a posting calendar. From ₹299/month.",
  keywords: [
    "salon marketing India",
    "Hindi caption generator",
    "offer poster maker",
    "festival offer ideas",
    "WhatsApp promotion copy",
    "gym membership poster",
    "cafe daily special poster",
    "local business social media planner",
    "Diwali offer poster",
  ],
  locale: "en_IN",
  // Set NEXT_PUBLIC_SUPPORT_EMAIL to your real support address; it is used in structured data and the legal pages.
  supportEmail: process.env.NEXT_PUBLIC_SUPPORT_EMAIL || "",
};
