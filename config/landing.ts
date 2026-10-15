import { IconCalendarEvent as CalendarDays, IconCoffee as Coffee, IconBarbell as Dumbbell, IconHeart as Heart, IconLanguage as Languages, IconSpeakerphone as Megaphone, IconMessageCircle as MessageCircle, IconPalette as Palette, IconConfetti as PartyPopper, IconScissors as Scissors, IconShoppingBag as ShoppingBag, IconSparkles as Sparkles, IconBuildingStore as Store, IconTag as Tag, IconWand as Wand2 } from "@tabler/icons-react";
import type { LandingContent } from "@/types/landing";

export const LANDING: LandingContent = {
  headline: [
    { text: "Fill your shop", tiles: [{ icon: Store, bg: "#b91c3c" }, { icon: Megaphone, bg: "#0e1116" }] },
    { text: "with offers", tiles: [{ icon: Sparkles, bg: "#b91c3c" }, { icon: Heart, bg: "#f08c00" }] },
    { text: "that sell.", muted: true },
  ],
  subhead: "Save your brand once. Get Hindi and English captions, ready-made posters and a posting calendar for salons, gyms, cafes and local shops.",
  heroNote: "Reusable templates, not a blank AI text box.",
  flow: {
    title: "From one offer to a month of posts.",
    sub: "Tell us the offer. Get captions, WhatsApp copy and a poster that already match your brand.",
    sources: [
      { name: "Brand profile", meta: "Services, prices, tone", icon: Palette, color: "#b91c3c" },
      { name: "Your offer", meta: "20% off weekday cuts", icon: Tag, color: "#0e1116" },
      { name: "Festival idea", meta: "Diwali · Raksha Bandhan", icon: PartyPopper, color: "#f08c00" },
      { name: "Language", meta: "Hindi and English", icon: Languages, color: "#b91c3c" },
    ],
    panel: {
      title: "Diwali offer",
      scope: "Salon campaign",
      badge: "READY",
      pinned: "Scheduled for Friday, 6 pm",
      rows: [
        { name: "Caption EN", text: "Glow up this Diwali. 20% off weekday cuts", source: 1 },
        { name: "Caption HI", text: "इस दिवाली निखार लाइए, सप्ताह के दिनों में 20% छूट", source: 3 },
        { name: "WhatsApp copy", text: "Book now and get 20% off. Reply YES", source: 0 },
        { name: "Poster", text: "Square and story sizes, your colors", source: 2 },
      ],
      placeholder: "Change the offer or tone…",
    },
  },
  bento: {
    title: "A promotion workflow, not a caption box.",
    sub: "Repeatable campaigns for businesses without an agency.",
    items: [
      { type: "hero", title: "One brand. Every offer.", desc: "Save services, prices, address and tone once. Every caption and poster starts from them.", chips: [Scissors, Dumbbell, Coffee, ShoppingBag], stat: { value: "2", label: "languages in every caption" } },
      { type: "mock", title: "Post and story shapes.", desc: "Edit the layout, then download it.", blocks: [{ label: "Square", grow: 3 }, { label: "Story", grow: 1 }] },
      { type: "stat", value: "1-click", title: "WhatsApp-ready copy", desc: "Copy it straight into a broadcast or status." },
      { type: "stat", value: "₹299", title: "A month to start", desc: "Starter covers captions, templates and poster downloads.", dark: true },
      { type: "chips", title: "Made for local shops.", desc: "Templates for the offers you run all year.", chips: [{ icon: Scissors, label: "Salons" }, { icon: Dumbbell, label: "Gyms" }, { icon: Coffee, label: "Cafes" }, { icon: Store, label: "Retail" }, { icon: PartyPopper, label: "Festivals" }, { icon: Tag, label: "Offers" }] },
      { type: "wave", icon: Wand2, title: "Captions that sound local.", desc: "Hindi and English, in your shop's tone." },
      { type: "icon", icon: MessageCircle, title: "No agency needed.", desc: "Reusable templates you can run every week." },
      { type: "mock", title: "Plan the month.", desc: "Festivals and weekends, already on the calendar.", blocks: [{ label: "Diwali", grow: 2 }, { label: "Weekend", grow: 1 }, { label: "Sale", grow: 2 }] },
      { type: "pills", title: "Know what's ready. At a glance.", desc: "Every post has a status.", pills: [{ label: "Draft", color: "#8b8f98" }, { label: "Ready", color: "#b91c3c" }, { label: "Scheduled", color: "#f59f00" }, { label: "Published", color: "#2f9e44" }] },
      { type: "footer", icon: CalendarDays, title: "See what brings people in.", desc: "Enquiry links and offer codes show which promotion worked." },
    ],
  },
  audience: {
    eyebrow: "Salons, gyms, cafes and local retailers",
    title: "Made for owners",
    titleMuted: "who run the shop themselves.",
    cards: [
      { who: "Salon owner", role: "Weekday offers and festivals", scenario: "Enter a Diwali offer once. Get an English caption, a Hindi caption and a poster in your colors.", icon: Scissors },
      { who: "Gym owner", role: "Membership campaigns", scenario: "Reuse a New Year membership template each season, changing only the price and dates.", icon: Dumbbell },
      { who: "Cafe owner", role: "Daily specials", scenario: "Plan a week of specials in one sitting and copy the WhatsApp text for each one.", icon: Coffee },
    ],
  },
  pricing: {
    title: "Pick a plan.",
    sub: "Prices are per month, in INR. Pay by UPI and your plan switches on once the payment is verified.",
    plans: [
      { name: "Starter", tagline: "For regular posting.", price: "₹299", features: ["Hindi and English captions", "Niche offer templates", "Saved brand profile", "Poster PNG downloads and saved drafts"] },
      { name: "Pro", tagline: "For several campaigns a month.", price: "₹499", featured: true, features: ["Everything in Starter", "Content calendar", "Festival idea pack", "More captions each month (400 instead of 60)"] },
    ],
  },
  faq: [
    { q: "Does it post to Instagram for me?", a: "Not yet. You download the poster and copy the caption. Publishing needs platform permissions we have not enabled." },
    { q: "Why not just use an AI chatbot?", a: "LocalPromo saves your brand details and templates, so every offer is consistent and reusable." },
    { q: "Which businesses is it for?", a: "We start with salons and gyms, then cafes and local retail." },
    { q: "Do you generate images with AI?", a: "No. Posters use reusable layouts filled with your brand details, which keeps it fast and affordable." },
    { q: "Are the captions written by AI?", a: "Right now they are built from templates and your saved brand details, and you can edit every word. AI rewriting can be added later." },
    { q: "How do I pay?", a: "By UPI. Scan the QR, enter the transaction ID, and your plan is activated once we verify the payment." },
    { q: "Does it work with a weak connection?", a: "Yes. Pages you have opened and your latest campaigns are kept on your device, so you can keep editing and download posters offline." },
  ],
  cta: { title: "Your next promotion starts here.", sub: "Pick a plan and create your first campaign." },
};
