import { LANDING } from "@/config/landing";
import { BRAND, SEO, SITE_URL } from "@/config/site";

const ctx = "https://schema.org";

export const organizationSchema = () => ({
  "@context": ctx,
  "@type": "Organization",
  name: BRAND.name,
  url: SITE_URL,
  logo: `${SITE_URL}/icon.svg`,
  description: SEO.description,
  areaServed: "IN",
  ...(SEO.supportEmail ? { contactPoint: [{ "@type": "ContactPoint", contactType: "customer support", email: SEO.supportEmail, areaServed: "IN", availableLanguage: ["English", "Hindi"] }] } : {}),
});

export const websiteSchema = () => ({
  "@context": ctx,
  "@type": "WebSite",
  name: BRAND.name,
  url: SITE_URL,
  inLanguage: "en-IN",
});

const priceOf = (price: string) => price.replace(/[^\d]/g, "");

export const softwareSchema = () => ({
  "@context": ctx,
  "@type": "SoftwareApplication",
  name: BRAND.name,
  applicationCategory: "BusinessApplication",
  operatingSystem: "Web",
  description: SEO.description,
  url: SITE_URL,
  inLanguage: ["en-IN", "hi-IN"],
  offers: LANDING.pricing.plans.map((p) => ({
    "@type": "Offer",
    name: p.name,
    price: priceOf(p.price),
    priceCurrency: "INR",
    description: p.tagline,
    availability: "https://schema.org/InStock",
    url: `${SITE_URL}/#pricing`,
  })),
});

export const faqSchema = (faq: { q: string; a: string }[]) => ({
  "@context": ctx,
  "@type": "FAQPage",
  mainEntity: faq.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })),
});

export const breadcrumbSchema = (items: { name: string; path: string }[]) => ({
  "@context": ctx,
  "@type": "BreadcrumbList",
  itemListElement: items.map((it, i) => ({ "@type": "ListItem", position: i + 1, name: it.name, item: `${SITE_URL}${it.path}` })),
});
