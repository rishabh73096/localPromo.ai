import type { AuthHeroData } from "@/types/content";

export const authHeroData: AuthHeroData = {
  headline: "Promotions that",
  headlineAccent: "bring customers through the door",
  description: "Save your brand once, generate Hindi and English offers, and keep a repeatable campaign calendar going.",
  categories: [
    { key: "templates", label: "Niche templates", caption: "Salon, gym, cafe", icon: "layout-grid", tone: "blue", image: "/images/auth/templates.svg", fallback: "linear-gradient(160deg,#9fb4c9,#4b5d70)" },
    { key: "captions", label: "AI Captions", caption: "Hindi and English", icon: "sparkles", tone: "purple", image: "/images/auth/captions.svg", fallback: "linear-gradient(160deg,#5b4bb7,#2b2060)" },
    { key: "posters", label: "Poster layouts", caption: "Editable, downloadable", icon: "file-text", tone: "orange", image: "/images/auth/posters.svg", fallback: "linear-gradient(160deg,#c9893a,#6b4a2f)" },
    { key: "calendar", label: "Calendar", caption: "Plan the month", icon: "clock", tone: "teal", image: "/images/auth/calendar.svg", fallback: "linear-gradient(160deg,#6f8a4a,#2c4a3a)" },
    { key: "whatsapp", label: "WhatsApp-ready", caption: "Copy in one click", icon: "message-circle", tone: "green", image: "/images/auth/whatsapp.svg", fallback: "linear-gradient(160deg,#274a78,#1f2733)" },
  ],
  trust: [
    { title: "Brand saved once", caption: "Consistent offers", icon: "shield-check" },
    { title: "Fast to start", caption: "Templates included", icon: "zap" },
    { title: "Made for local shops", caption: "No agency needed", icon: "shield-half" },
  ],
};
