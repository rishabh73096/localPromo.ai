"use client";

import Link from "next/link";
import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, CalendarClock, Copy, Download, RefreshCw, Trash2 } from "lucide-react";
import { Poster, POSTER_SIZES, downloadPoster } from "@/components/promo/poster";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { FormField, TextAreaField, TextField } from "@/components/ui/form-field";
import { NativeSelect } from "@/components/ui/native-select";
import { PageHeader } from "@/components/ui/page-header";
import { Panel, PanelHeader } from "@/components/ui/panel";
import { Segmented } from "@/components/ui/segmented";
import { useMounted } from "@/hooks/use-mounted";
import { usePlan } from "@/lib/plan-store";
import { generateCopy } from "@/lib/promo";
import { STATUSES, statusMeta } from "@/lib/stats";
import { notify } from "@/lib/toast";
import { deleteDraft, getCampaign, updateDraft, useBrand, useDrafts } from "@/services/promo";
import type { Draft, DraftStatus, PosterLayout, PosterSize } from "@/types/promo";

const COLORS = ["#b91c3c", "#d6336c", "#e8590c", "#0f9d75", "#1c7ed6", "#c2255c", "#2b2d42", "#f59f00"];
type Tab = "en" | "hi" | "wa";
const PHOTOS = [["", "None"], ["/images/biz/salon.jpg", "Salon"], ["/images/biz/gym.jpg", "Gym"], ["/images/biz/cafe.jpg", "Cafe"], ["/images/biz/retail.jpg", "Retail"]] as const;

export function DraftEditor({ id }: { id: string }) {
  const mounted = useMounted();
  const { drafts, loaded } = useDrafts();
  const { brand, loaded: brandLoaded } = useBrand();
  const draft = drafts.find((d) => d.id === id);
  if (!mounted || !loaded || !brandLoaded) return null;
  if (!draft) {
    return (
      <div className="mx-auto max-w-md py-16 text-center">
        <p className="font-inter text-xl font-semibold text-ink">Draft not found</p>
        <p className="mt-2 text-sm text-slate-500">It may have been deleted.</p>
        <Link href="/drafts" className="text-brand mt-4 inline-block text-sm font-semibold hover:underline">Back to drafts</Link>
      </div>
    );
  }
  return <Editor key={draft.id} draft={draft} brand={brand} />;
}

function Editor({ draft, brand }: { draft: Draft; brand: ReturnType<typeof useBrand>["brand"] }) {
  const router = useRouter();
  const { can } = usePlan();
  const svg = useRef<SVGSVGElement>(null);
  const [d, setD] = useState<Draft>(draft);
  const [tab, setTab] = useState<Tab>(brand.language === "hi" ? "hi" : "en");
  const [size, setSize] = useState<PosterSize>("square");
  const [variant, setVariant] = useState(0);
  const dirty = JSON.stringify(d) !== JSON.stringify(draft);
  const canSchedule = can("calendar");
  const canDownload = can("posterDownload");
  const when = d.scheduledFor ? d.scheduledFor.slice(0, 10) : "";
  const set = (patch: Partial<Draft>) => setD((x) => ({ ...x, ...patch }));
  const setPoster = (patch: Partial<Draft["poster"]>) => setD((x) => ({ ...x, poster: { ...x.poster, ...patch } }));

  const body = tab === "en" ? d.captionEn : tab === "hi" ? d.captionHi : d.whatsapp;
  const setBody = (v: string) => set(tab === "en" ? { captionEn: v } : tab === "hi" ? { captionHi: v } : { whatsapp: v });

  const regenerate = () => {
    const c = getCampaign(d.campaignId ?? "");
    if (!c) return notify.error("The campaign for this draft was deleted, so there is nothing to rebuild from.");
    const next = variant + 1;
    const copy = generateCopy(brand, c, next);
    setVariant(next);
    set({ captionEn: copy.en, captionHi: copy.hi, whatsapp: copy.whatsapp });
    notify.info("New wording", "Your earlier text was replaced. Save to keep it.");
  };

  const copyText = async () => {
    try {
      await navigator.clipboard.writeText(body);
      notify.success("Copied");
    } catch {
      notify.error("Couldn't copy. Select the text and copy it by hand.");
    }
  };

  const save = (status?: DraftStatus) => {
    const next = { ...d, ...(status ? { status } : {}) };
    updateDraft(d.id, { title: next.title, captionEn: next.captionEn, captionHi: next.captionHi, whatsapp: next.whatsapp, poster: next.poster, status: next.status, scheduledFor: next.scheduledFor });
    notify.success(status ? `Marked ${statusMeta(status).label.toLowerCase()}` : "Draft saved");
  };

  const download = async () => {
    if (!svg.current) return;
    try {
      await downloadPoster(svg.current, size, d.title);
    } catch (e) {
      notify.error(e);
    }
  };

  const schedule = (date: string) => set(date ? { scheduledFor: new Date(`${date}T18:00:00`).toISOString(), status: d.status === "published" ? "published" : "scheduled" } : { scheduledFor: null, status: d.status === "scheduled" ? "ready" : d.status });

  return (
    <div className="space-y-6">
      <PageHeader
        title={d.title}
        badge={<Badge tone={statusMeta(d.status).tone} dot>{statusMeta(d.status).label}</Badge>}
        description="Edit the words and the poster, then download and post."
        actions={
          <>
            <Link href="/drafts" className="inline-flex items-center gap-1.5 text-sm font-semibold text-slate-500 hover:text-ink"><ArrowLeft className="size-4" />All drafts</Link>
            <Button type="button" variant="neutral" size="xl" className="rounded-full px-5" onClick={() => save("ready")}>Mark ready</Button>
            <Button type="button" variant="brand" size="xl" className="rounded-full px-6" disabled={!dirty} onClick={() => save()}>Save</Button>
          </>
        }
      />

      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,420px)]">
        <div className="space-y-6">
          <Panel className="p-5 sm:p-6">
            <PanelHeader title="Captions" icon={Copy} aside={<Button type="button" variant="ghost" size="sm" onClick={regenerate}><RefreshCw />Another wording</Button>} />
            <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
              <Segmented<Tab> label="Caption language" value={tab} onChange={setTab} options={[{ value: "en", label: "English" }, { value: "hi", label: "हिन्दी" }, { value: "wa", label: "WhatsApp" }]} />
              <Button type="button" variant="neutral" size="lg" onClick={copyText}><Copy />Copy</Button>
            </div>
            <TextAreaField aria-label="Caption text" rows={11} className="mt-4 leading-6" value={body} onChange={(e) => setBody(e.target.value.slice(0, 2200))} />
            <p className="mt-1.5 text-right text-xs text-slate-400">{body.length} / 2200</p>
          </Panel>

          <Panel className="p-5 sm:p-6">
            <PanelHeader title="Plan" icon={CalendarClock} />
            <div className="mt-4 grid gap-4 sm:grid-cols-3">
              <FormField label="Name" htmlFor="title"><TextField id="title" value={d.title} onChange={(e) => set({ title: e.target.value.slice(0, 60) })} /></FormField>
              <FormField label="Status" htmlFor="status">
                <NativeSelect id="status" value={d.status} onChange={(e) => set({ status: e.target.value as DraftStatus })}>
                  {STATUSES.map((s) => <option key={s.value} value={s.value}>{s.label}</option>)}
                </NativeSelect>
              </FormField>
              <FormField label="Post on" htmlFor="when" hint={canSchedule ? undefined : "Calendar is on the Pro plan."}>
                <TextField id="when" type="date" value={when} disabled={!canSchedule} onChange={(e) => schedule(e.target.value)} />
              </FormField>
            </div>
            <div className="mt-5 flex justify-between">
              <Button type="button" variant="ghost" size="lg" className="text-red-600" onClick={() => { if (window.confirm("Delete this draft?")) { deleteDraft(d.id); notify.success("Draft deleted"); router.push("/drafts"); } }}><Trash2 />Delete</Button>
              <Button type="button" variant="neutral" size="lg" onClick={() => save("published")}>I posted this</Button>
            </div>
          </Panel>
        </div>

        <Panel className="h-fit p-5 sm:p-6 lg:sticky lg:top-[90px]">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <p className="font-inter text-lg font-semibold tracking-[-0.02em] text-ink">Poster</p>
            <Segmented<PosterSize> label="Poster size" value={size} onChange={setSize} options={(Object.keys(POSTER_SIZES) as PosterSize[]).map((k) => ({ value: k, label: POSTER_SIZES[k].label }))} />
          </div>
          <div className="mt-4 flex justify-center rounded-2xl bg-[#f7efe6] p-3">
            <Poster ref={svg} brand={brand} config={d.poster} size={size} className={size === "story" ? "max-h-[520px] w-auto rounded-lg" : "h-auto w-full rounded-lg"} />
          </div>
          <div className="mt-5 space-y-4">
            <Segmented<PosterLayout> label="Layout" value={d.poster.layout} onChange={(layout) => setPoster({ layout })} options={[{ value: "bold", label: "Bold" }, { value: "split", label: "Split" }, { value: "frame", label: "Frame" }]} />
            <FormField label="Headline" htmlFor="headline"><TextField id="headline" value={d.poster.headline} onChange={(e) => setPoster({ headline: e.target.value.slice(0, 40) })} /></FormField>
            <FormField label="Offer line" htmlFor="subline"><TextField id="subline" value={d.poster.subline} onChange={(e) => setPoster({ subline: e.target.value.slice(0, 110) })} /></FormField>
            <FormField label="Button text" htmlFor="cta"><TextField id="cta" value={d.poster.cta} onChange={(e) => setPoster({ cta: e.target.value.slice(0, 24) })} /></FormField>
            <div role="group" aria-label="Poster photo" className="flex flex-wrap gap-2">
              {PHOTOS.map(([src, label]) => (
                <button key={label} type="button" aria-pressed={(d.poster.image ?? "") === src} onClick={() => setPoster({ image: src || undefined })} className={"h-9 rounded-lg px-3 text-xs font-semibold transition-colors " + ((d.poster.image ?? "") === src ? "bg-ink text-white" : "bg-[#f7efe6] text-slate-600 hover:bg-[#f5d9d6]")}>{src ? `Photo: ${label}` : "No photo"}</button>
              ))}
            </div>
            <div role="group" aria-label="Poster colour" className="flex flex-wrap gap-2">
              {COLORS.map((c) => <button key={c} type="button" aria-label={c} aria-pressed={d.poster.color === c} onClick={() => setPoster({ color: c })} style={{ background: c }} className="size-8 rounded-full ring-offset-2 transition-transform hover:scale-110 aria-pressed:ring-2 aria-pressed:ring-ink" />)}
            </div>
            <Button type="button" variant="brand" size="xl" className="w-full rounded-full" disabled={!canDownload} onClick={download}><Download />Download PNG</Button>
          </div>
        </Panel>
      </div>
    </div>
  );
}
