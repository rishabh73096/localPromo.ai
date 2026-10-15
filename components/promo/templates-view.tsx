"use client";

import Link from "next/link";
import { useState } from "react";
import { CalendarHeart } from "lucide-react";
import { UpgradeCard } from "@/components/billing/feature-gate";
import { Badge } from "@/components/ui/badge";
import { PageHeader } from "@/components/ui/page-header";
import { Panel, PanelHeader } from "@/components/ui/panel";
import { Segmented } from "@/components/ui/segmented";
import { useMounted } from "@/hooks/use-mounted";
import { useNow } from "@/hooks/use-now";
import { usePlan } from "@/lib/plan-store";
import { NICHES, templatesFor, upcomingFestivals } from "@/lib/templates";
import { useBrand } from "@/services/promo";
import type { Niche } from "@/types/promo";

export function TemplatesView() {
  const mounted = useMounted();
  const now = useNow();
  const { brand } = useBrand();
  const { can } = usePlan();
  const [niche, setNiche] = useState<Niche | null>(null);
  if (!mounted) return null;
  const active = niche ?? brand.niche;

  return (
    <div className="space-y-6">
      <PageHeader title="Templates" description="Ready-made offers for the businesses we start with. Pick one, change the details." />
      <Segmented<Niche> label="Business type" value={active} onChange={setNiche} options={NICHES.map((n) => ({ value: n.value, label: n.label }))} />
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {templatesFor(active).map((t, i) => (
          <Link key={t.id} href={`/create?template=${t.id}`} className="group animate-in fade-in slide-in-from-bottom-2 rounded-[22px] border border-black/[0.06] bg-white p-5 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg" style={{ animationDelay: `${i * 60}ms`, animationFillMode: "both" }}>
            <div className="bg-brand-gradient flex h-28 items-end rounded-2xl p-4 text-white">
              <p className="font-inter text-xl leading-tight font-extrabold">{t.headline}</p>
            </div>
            <div className="mt-4 flex items-center justify-between gap-2">
              <p className="text-sm font-semibold text-ink">{t.name}</p>
              <Badge tone="purple" size="sm">{t.kind}</Badge>
            </div>
            <p className="mt-1 text-xs text-slate-500">{t.blurb}</p>
            <p className="text-brand mt-3 text-sm font-semibold transition-transform group-hover:translate-x-1">Use this template →</p>
          </Link>
        ))}
      </div>

      <Panel className="p-5 sm:p-6">
        <PanelHeader title="Festival ideas" description="Plan the offer a couple of weeks ahead." icon={CalendarHeart} />
        {can("festivalPack") ? (
          <ul className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {upcomingFestivals(now, 6).map((f) => (
              <li key={f.name + f.at.getTime()}>
                <Link href={`/create?festival=${encodeURIComponent(f.name)}`} className="block rounded-xl bg-[#f7efe6] p-4 transition-transform hover:-translate-y-0.5">
                  <p className="text-sm font-semibold text-ink">{f.name} <span className="font-normal text-slate-500">· {f.hi}</span></p>
                  <p className="mt-0.5 text-xs text-slate-500">{f.at.toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" })}{f.approx ? " (approx.)" : ""}</p>
                </Link>
              </li>
            ))}
          </ul>
        ) : (
          <UpgradeCard feature="festivalPack" compact className="mt-4" />
        )}
      </Panel>
    </div>
  );
}
