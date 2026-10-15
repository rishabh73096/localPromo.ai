import type { Niche } from "@/types/promo";

export interface PromoTemplate {
  id: string;
  niche: Niche;
  kind: "offer" | "festival" | "membership" | "launch";
  name: string;
  blurb: string;
  offer: string; // default offer text the owner can change
  headline: string;
  cta: string;
}

export const NICHES: { value: Niche; label: string; services: string[] }[] = [
  { value: "salon", label: "Salon & beauty", services: ["Haircut", "Facial", "Hair colour", "Bridal makeup", "Manicure", "Hair spa"] },
  { value: "gym", label: "Gym & fitness", services: ["Monthly membership", "Personal training", "Yoga", "Zumba", "Diet plan"] },
  { value: "cafe", label: "Cafe & food", services: ["Coffee", "Breakfast combo", "Desserts", "Pizza", "Lunch thali"] },
  { value: "retail", label: "Local retail", services: ["Clothing", "Gifts", "Electronics", "Home decor", "Footwear"] },
];

export const nicheLabel = (n: Niche) => NICHES.find((x) => x.value === n)?.label ?? n;

export const TEMPLATES: PromoTemplate[] = [
  { id: "salon-weekday", niche: "salon", kind: "offer", name: "Weekday glow offer", blurb: "Fill quiet Monday to Thursday slots.", offer: "20% off all services Mon-Thu", headline: "Weekday Glow", cta: "Book your slot" },
  { id: "salon-bridal", niche: "salon", kind: "offer", name: "Bridal package", blurb: "Pre-wedding and makeup bundle.", offer: "Bridal package with free trial", headline: "Your Big Day Look", cta: "Reserve a date" },
  { id: "salon-festival", niche: "salon", kind: "festival", name: "Festival makeover", blurb: "Diwali, Karwa Chauth, Raksha Bandhan.", offer: "Festival combo: facial + hair spa", headline: "Festive Makeover", cta: "Book now" },
  { id: "gym-newyear", niche: "gym", kind: "membership", name: "New year membership", blurb: "Seasonal joining drive.", offer: "3 months + 1 month free", headline: "Start Strong", cta: "Join today" },
  { id: "gym-trial", niche: "gym", kind: "launch", name: "Free trial week", blurb: "Let people try before they pay.", offer: "7-day free trial", headline: "Try Us Free", cta: "Claim free week" },
  { id: "gym-referral", niche: "gym", kind: "offer", name: "Bring a friend", blurb: "Referral month.", offer: "Bring a friend, both get 10% off", headline: "Train Together", cta: "Bring a friend" },
  { id: "cafe-special", niche: "cafe", kind: "offer", name: "Daily special", blurb: "Todays dish or combo.", offer: "Coffee + sandwich combo", headline: "Today's Special", cta: "Visit us today" },
  { id: "cafe-happy", niche: "cafe", kind: "offer", name: "Happy hours", blurb: "Slow afternoon fix.", offer: "Buy 1 get 1 coffee, 3 to 6 pm", headline: "Happy Hours", cta: "Come by" },
  { id: "cafe-festival", niche: "cafe", kind: "festival", name: "Festival menu", blurb: "Limited-time festive menu.", offer: "Festive dessert box", headline: "Festive Menu", cta: "Order now" },
  { id: "retail-sale", niche: "retail", kind: "offer", name: "End of season sale", blurb: "Clear old stock.", offer: "Flat 30% off on selected items", headline: "Season Sale", cta: "Shop in store" },
  { id: "retail-festival", niche: "retail", kind: "festival", name: "Festival shopping", blurb: "Gift and festive buying.", offer: "Festive offers, free gift wrapping", headline: "Festive Shopping", cta: "Visit the store" },
  { id: "retail-launch", niche: "retail", kind: "launch", name: "New arrivals", blurb: "Announce a new collection.", offer: "New collection just landed", headline: "New Arrivals", cta: "See what's new" },
];

export const templatesFor = (niche: Niche) => TEMPLATES.filter((t) => t.niche === niche);
export const templateById = (id: string) => TEMPLATES.find((t) => t.id === id);

export interface Festival {
  name: string;
  hi: string;
  date: string; // YYYY-MM-DD, approximate for lunar festivals
  approx?: boolean;
  /** Real photo (Pexels) shown on the landing page. */
  image: string;
}

// Fixed-date festivals repeat every year; lunar ones are listed for the next two years and may shift by a day.
export const FESTIVALS: Festival[] = [
  { name: "New Year", hi: "नया साल", date: "01-01", image: "/images/festivals/newyear.jpg" },
  { name: "Republic Day", hi: "गणतंत्र दिवस", date: "01-26", image: "/images/festivals/flag.jpg" },
  { name: "Valentine's Day", hi: "वैलेंटाइन डे", date: "02-14", image: "/images/festivals/valentine.jpg" },
  { name: "Women's Day", hi: "महिला दिवस", date: "03-08", image: "/images/festivals/womens.jpg" },
  { name: "Independence Day", hi: "स्वतंत्रता दिवस", date: "08-15", image: "/images/festivals/flag.jpg" },
  { name: "Christmas", hi: "क्रिसमस", date: "12-25", image: "/images/festivals/christmas.jpg" },
  { name: "Raksha Bandhan", hi: "रक्षाबंधन", date: "2026-08-28", approx: true, image: "/images/festivals/rakhi.jpg" },
  { name: "Dussehra", hi: "दशहरा", date: "2026-10-20", approx: true, image: "/images/festivals/dussehra.jpg" },
  { name: "Karwa Chauth", hi: "करवा चौथ", date: "2026-10-29", approx: true, image: "/images/festivals/karwa.jpg" },
  { name: "Diwali", hi: "दिवाली", date: "2026-11-08", approx: true, image: "/images/festivals/diwali.jpg" },
  { name: "Holi", hi: "होली", date: "2027-03-22", approx: true, image: "/images/festivals/holi.jpg" },
];

// Upcoming festivals from `from`, soonest first.
export function upcomingFestivals(from = Date.now(), limit = 6) {
  const now = new Date(from);
  const out: (Festival & { at: Date })[] = [];
  for (const f of FESTIVALS) {
    if (f.date.length === 5) {
      for (const y of [now.getFullYear(), now.getFullYear() + 1]) {
        const [m, d] = f.date.split("-").map(Number);
        out.push({ ...f, at: new Date(y, m - 1, d) });
      }
    } else {
      const [y, m, d] = f.date.split("-").map(Number);
      out.push({ ...f, at: new Date(y, m - 1, d) });
    }
  }
  const start = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
  return out.filter((f) => f.at.getTime() >= start).sort((a, b) => a.at.getTime() - b.at.getTime()).slice(0, limit);
}
