import type { Metadata } from "next";
import { Audience } from "@/components/landing/audience";
import { Features } from "@/components/landing/features";
import { Festivals } from "@/components/landing/festivals";
import { Hero } from "@/components/landing/hero";
import { HowItWorks } from "@/components/landing/how-it-works";
import { LandingNav } from "@/components/landing/landing-nav";
import { LiveDemo } from "@/components/landing/live-demo";
import { Marquee } from "@/components/landing/marquee";
import { Faq, FinalCta, LandingFooter, Pricing } from "@/components/landing/sections";
import { Stats } from "@/components/landing/stats";
import { JsonLd } from "@/components/seo/json-ld";
import { LANDING } from "@/config/landing";
import { BRAND, SEO, SITE_URL } from "@/config/site";
import { faqSchema, organizationSchema, softwareSchema, websiteSchema } from "@/lib/seo";

export const metadata: Metadata = {
  title: { absolute: SEO.title },
  description: SEO.description,
  keywords: SEO.keywords,
  alternates: { canonical: "/" },
  robots: { index: true, follow: true, googleBot: { index: true, follow: true, "max-image-preview": "large", "max-snippet": -1 } },
  openGraph: { type: "website", url: SITE_URL, siteName: BRAND.name, locale: SEO.locale, title: SEO.title, description: SEO.description },
  twitter: { card: "summary_large_image", title: SEO.title, description: SEO.description },
};

export default function LandingPage() {
  return (
    <>
      <JsonLd data={[organizationSchema(), websiteSchema(), softwareSchema(), faqSchema(LANDING.faq)]} />
      <LandingNav />
      <main>
        <Hero />
        <Marquee />
        <HowItWorks />
        <LiveDemo />
        <Features />
        <Festivals />
        <Audience />
        <Stats />
        <Pricing c={{ pricing: LANDING.pricing }} />
        <Faq c={{ faq: LANDING.faq }} />
        <FinalCta c={{ cta: LANDING.cta }} />
      </main>
      <LandingFooter />
    </>
  );
}
