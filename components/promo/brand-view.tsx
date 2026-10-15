"use client";

import { useState } from "react";
import { IconPalette as Palette, IconBuildingStore as Store } from "@tabler/icons-react";
import { Poster } from "@/components/promo/poster";
import { Button } from "@/components/ui/button";
import { ChipSelect } from "@/components/ui/chip-select";
import { FormField, TextAreaField, TextField } from "@/components/ui/form-field";
import { NativeSelect } from "@/components/ui/native-select";
import { PageHeader } from "@/components/ui/page-header";
import { Panel, PanelHeader } from "@/components/ui/panel";
import { PhoneInput } from "@/components/ui/phone-input";
import { useMounted } from "@/hooks/use-mounted";
import { isIndianMobile } from "@/lib/phone";
import { NICHES } from "@/lib/templates";
import { notify } from "@/lib/toast";
import { saveBrand, useBrand } from "@/services/promo";
import type { BrandProfile, Language, Niche, Tone } from "@/types/promo";

const COLORS = ["#b91c3c", "#d6336c", "#e8590c", "#0f9d75", "#1c7ed6", "#c2255c", "#2b2d42", "#f59f00"];
const TONES: { value: Tone; label: string }[] = [
  { value: "friendly", label: "Friendly" },
  { value: "premium", label: "Premium" },
  { value: "festive", label: "Festive" },
  { value: "urgent", label: "Urgent / limited time" },
];

export function BrandView() {
  const mounted = useMounted();
  const { brand, loaded } = useBrand();
  if (!mounted || !loaded) return null;
  return <BrandForm key={JSON.stringify(brand)} saved={brand} />;
}

function BrandForm({ saved }: { saved: BrandProfile }) {
  const [b, setB] = useState<BrandProfile>(saved);
  const [extra, setExtra] = useState("");
  const dirty = JSON.stringify(b) !== JSON.stringify(saved);
  const niche = NICHES.find((n) => n.value === b.niche)!;
  const set = <K extends keyof BrandProfile>(k: K, v: BrandProfile[K]) => setB((x) => ({ ...x, [k]: v }));

  const save = async () => {
    if (b.businessName.trim().length < 2) return notify.error("Enter your business name");
    if (b.phone && !isIndianMobile(b.phone)) return notify.error("Enter a valid 10-digit Indian mobile number");
    try {
      await saveBrand({ ...b, businessName: b.businessName.trim(), tagline: b.tagline.trim() });
      notify.success("Brand profile saved");
    } catch (error) {
      notify.error(error);
    }
  };

  const addService = () => {
    const v = extra.trim().slice(0, 40);
    if (v && !b.services.includes(v)) set("services", [...b.services, v]);
    setExtra("");
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Brand profile"
        description="Saved once. Every caption and poster starts from these details."
        actions={<>{dirty ? <span className="animate-in fade-in flex items-center gap-2 text-xs font-medium text-slate-500"><span className="dot-ping size-2 rounded-full bg-amber-400" />Unsaved changes</span> : null}<Button type="button" variant="brand" size="xl" className="rounded-full px-6" disabled={!dirty} onClick={save}>Save profile</Button></>}
      />
      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_340px]">
        <div className="space-y-6">
          <Panel className="p-5 sm:p-6">
            <PanelHeader title="Business" icon={Store} />
            <div className="mt-5 grid gap-4 sm:grid-cols-2">
              <FormField label="Business name" htmlFor="businessName"><TextField id="businessName" value={b.businessName} onChange={(e) => set("businessName", e.target.value.slice(0, 60))} placeholder="Glow Unisex Salon" /></FormField>
              <FormField label="Business type" htmlFor="niche">
                <NativeSelect id="niche" value={b.niche} onChange={(e) => setB({ ...b, niche: e.target.value as Niche, services: [] })}>
                  {NICHES.map((n) => <option key={n.value} value={n.value}>{n.label}</option>)}
                </NativeSelect>
              </FormField>
              <FormField label="City" htmlFor="city"><TextField id="city" value={b.city} onChange={(e) => set("city", e.target.value.slice(0, 40))} placeholder="Jaipur" /></FormField>
              <FormField label="Phone / WhatsApp" htmlFor="phone"><PhoneInput id="phone" value={b.phone} onChange={(v: string) => set("phone", v)} /></FormField>
              <FormField label="Address" htmlFor="address" className="sm:col-span-2"><TextField id="address" value={b.address} onChange={(e) => set("address", e.target.value.slice(0, 120))} placeholder="Shop 4, MI Road" /></FormField>
              <FormField label="Tagline (optional)" htmlFor="tagline" className="sm:col-span-2"><TextAreaField id="tagline" rows={2} value={b.tagline} onChange={(e) => set("tagline", e.target.value.slice(0, 100))} placeholder="Where every visit feels special." /></FormField>
            </div>
          </Panel>

          <Panel className="p-5 sm:p-6">
            <PanelHeader title="Services you promote" description="Pick the ones you offer, or add your own." icon={Store} />
            <div className="mt-4"><ChipSelect label="Services" options={niche.services} value={b.services} onChange={(v) => set("services", v)} /></div>
            <div className="mt-4 flex max-w-sm gap-2">
              <TextField value={extra} onChange={(e) => setExtra(e.target.value)} onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); addService(); } }} placeholder="Add a service" aria-label="Add a service" />
              <Button type="button" variant="neutral" size="lg" onClick={addService}>Add</Button>
            </div>
          </Panel>

          <Panel className="p-5 sm:p-6">
            <PanelHeader title="Voice and look" icon={Palette} />
            <div className="mt-5 grid gap-4 sm:grid-cols-2">
              <FormField label="Tone of voice" htmlFor="tone">
                <NativeSelect id="tone" value={b.tone} onChange={(e) => set("tone", e.target.value as Tone)}>
                  {TONES.map((t) => <option key={t.value} value={t.value}>{t.label}</option>)}
                </NativeSelect>
              </FormField>
              <FormField label="Main language" htmlFor="language">
                <NativeSelect id="language" value={b.language} onChange={(e) => set("language", e.target.value as Language)}>
                  <option value="en">English</option>
                  <option value="hi">हिन्दी (Hindi)</option>
                </NativeSelect>
              </FormField>
              <div className="sm:col-span-2">
                <p className="text-[13px] font-semibold text-ink">Brand colour</p>
                <div className="mt-2 flex flex-wrap items-center gap-2" role="group" aria-label="Brand colour">
                  {COLORS.map((c) => (
                    <button key={c} type="button" aria-label={c} aria-pressed={b.color === c} onClick={() => set("color", c)} style={{ background: c }} className="size-9 rounded-full ring-offset-2 transition-transform hover:scale-110 aria-pressed:ring-2 aria-pressed:ring-ink" />
                  ))}
                </div>
              </div>
            </div>
          </Panel>
        </div>

        <aside className="lg:sticky lg:top-[90px] lg:self-start">
          <Panel className="p-4">
            <p className="mb-3 text-xs font-semibold tracking-wide text-slate-500 uppercase">Live preview</p>
            <Poster brand={b} size="square" config={{ layout: "bold", headline: b.businessName || "Your Business", subline: b.tagline || "Your next offer shows up here.", cta: "Book now", color: b.color }} className="h-auto w-full rounded-xl" />
          </Panel>
        </aside>
      </div>
    </div>
  );
}
