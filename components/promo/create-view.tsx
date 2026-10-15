"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Sparkles, Wand2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { FormField, TextField } from "@/components/ui/form-field";
import { PageHeader } from "@/components/ui/page-header";
import { Panel, PanelHeader } from "@/components/ui/panel";
import { useMounted } from "@/hooks/use-mounted";
import { OFFER_CODE, makeOfferCode } from "@/lib/promo";
import { FESTIVALS, TEMPLATES, nicheLabel, templateById, templatesFor } from "@/lib/templates";
import { notify } from "@/lib/toast";
import { cn } from "@/lib/utils";
import { createCampaign, useBrand } from "@/services/promo";

const day = (offset: number) => new Date(Date.now() + offset * 86_400_000).toISOString().slice(0, 10);

export function CreateView({ template, festival }: { template?: string; festival?: string }) {
  const mounted = useMounted();
  const router = useRouter();
  const { brand, loaded } = useBrand();
  const options = useMemo(() => templatesFor(brand.niche), [brand.niche]);
  const first = (template && templateById(template)) || options[0] || TEMPLATES[0];
  const fest = FESTIVALS.find((f) => f.name === festival);

  const [templateId, setTemplateId] = useState(first.id);
  const [title, setTitle] = useState(fest ? `${fest.name} offer` : "");
  const [offer, setOffer] = useState(first.offer);
  const [audience, setAudience] = useState("");
  const [startsAt, setStartsAt] = useState(day(0));
  const [endsAt, setEndsAt] = useState(day(7));
  const [code, setCode] = useState("");
  const [busy, setBusy] = useState(false);

  if (!mounted || !loaded) return null;
  const pick = (id: string) => {
    const t = templateById(id)!;
    setTemplateId(id);
    setOffer(t.offer);
  };

  const submit = () => {
    if (!brand.businessName) return notify.error("Save your brand profile first");
    if (title.trim().length < 3) return notify.error("Give the campaign a name");
    if (offer.trim().length < 5) return notify.error("Describe the offer");
    const offerCode = code.trim().toUpperCase();
    if (offerCode && !OFFER_CODE.test(offerCode)) return notify.error("Offer code: 3 to 12 letters or numbers");
    if (endsAt && startsAt && endsAt < startsAt) return notify.error("The end date is before the start date");
    setBusy(true);
    const { draftId } = createCampaign(brand, {
      title: title.trim(),
      niche: brand.niche,
      templateId,
      offer: offer.trim(),
      audience: audience.trim(),
      startsAt: startsAt ? new Date(`${startsAt}T00:00:00`).toISOString() : null,
      endsAt: endsAt ? new Date(`${endsAt}T23:59:00`).toISOString() : null,
      offerCode,
    });
    notify.success("Draft created", "Edit the captions and poster, then download.");
    router.push(`/drafts/${draftId}`);
  };

  return (
    <div className="space-y-6">
      <PageHeader title="Create content" description={`Captions in Hindi and English, WhatsApp copy and a poster for ${brand.businessName || nicheLabel(brand.niche).toLowerCase()}.`} />

      {!brand.businessName ? (
        <Link href="/brand" className="bg-brand-soft block rounded-2xl p-4 text-sm text-ink">
          <b>Save your brand first</b>. Captions use your business name, phone, address and tone. <span className="text-brand font-semibold underline">Open brand profile</span>
        </Link>
      ) : null}

      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_320px]">
        <div className="space-y-6">
          <Panel className="p-5 sm:p-6">
            <PanelHeader title="1. Pick a starting point" description={`Templates for ${nicheLabel(brand.niche).toLowerCase()}.`} icon={Wand2} />
            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              {options.map((t) => (
                <button key={t.id} type="button" aria-pressed={templateId === t.id} onClick={() => pick(t.id)} className={cn("rounded-2xl border p-4 text-left transition-all", templateId === t.id ? "border-brand bg-brand-soft/60 shadow-sm" : "border-black/[0.08] bg-white hover:-translate-y-0.5 hover:shadow-md")}>
                  <span className="text-brand text-[10px] font-bold tracking-wider uppercase">{t.kind}</span>
                  <p className="mt-1 text-sm font-semibold text-ink">{t.name}</p>
                  <p className="mt-0.5 text-xs text-slate-500">{t.blurb}</p>
                </button>
              ))}
            </div>
          </Panel>

          <Panel className="p-5 sm:p-6">
            <PanelHeader title="2. Your offer" icon={Sparkles} description="Type the offer in English or Hindi. We keep your words as they are." />
            <div className="mt-5 grid gap-4 sm:grid-cols-2">
              <FormField label="Campaign name" htmlFor="title" className="sm:col-span-2"><TextField id="title" value={title} onChange={(e) => setTitle(e.target.value.slice(0, 60))} placeholder="Diwali glow-up" /></FormField>
              <FormField label="Offer" htmlFor="offer" className="sm:col-span-2" hint="Short and specific works best. Include the price or discount."><TextField id="offer" value={offer} onChange={(e) => setOffer(e.target.value.slice(0, 120))} /></FormField>
              <FormField label="Who is it for? (optional)" htmlFor="audience"><TextField id="audience" value={audience} onChange={(e) => setAudience(e.target.value.slice(0, 40))} placeholder="college students" /></FormField>
              <FormField label="Offer code (optional)" htmlFor="code" aside={<button type="button" className="text-brand font-semibold" onClick={() => setCode(makeOfferCode(title))}>Suggest</button>} hint="Customers mention it so you can see what worked."><TextField id="code" value={code} onChange={(e) => setCode(e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, "").slice(0, 12))} placeholder="DIWALI20" /></FormField>
              <FormField label="Starts" htmlFor="startsAt"><TextField id="startsAt" type="date" value={startsAt} onChange={(e) => setStartsAt(e.target.value)} /></FormField>
              <FormField label="Ends" htmlFor="endsAt"><TextField id="endsAt" type="date" value={endsAt} onChange={(e) => setEndsAt(e.target.value)} /></FormField>
            </div>
          </Panel>
        </div>

        <aside className="lg:sticky lg:top-[90px] lg:self-start">
          <Panel className="p-5">
            <p className="font-inter text-lg font-semibold tracking-[-0.02em] text-ink">You get</p>
            <ul className="mt-3 space-y-2 text-sm text-slate-600">
              <li>• English and Hindi captions</li>
              <li>• WhatsApp-ready message</li>
              <li>• An editable poster (post and story)</li>
              <li>• A saved draft you can schedule</li>
            </ul>
            <p className="mt-4 text-xs text-slate-400">Copy is built from your templates and brand details, so you can edit every word.</p>
            <Button type="button" variant="brand" size="xl" className="mt-5 w-full rounded-full" loading={busy} onClick={submit}><Wand2 />Generate draft</Button>
          </Panel>
        </aside>
      </div>
    </div>
  );
}
