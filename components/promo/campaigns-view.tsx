"use client";

import Link from "next/link";
import { IconSpeakerphone as Megaphone, IconTag as Tag, IconTrash as Trash2, IconWand as Wand2 } from "@tabler/icons-react";
import { Badge } from "@/components/ui/badge";
import { Button, buttonVariants } from "@/components/ui/button";
import { DataTable, type Column } from "@/components/ui/data-table";
import { PageHeader } from "@/components/ui/page-header";
import { useMounted } from "@/hooks/use-mounted";
import { useNow } from "@/hooks/use-now";
import { useFlashing } from "@/lib/flash";
import { nicheLabel, templateById } from "@/lib/templates";
import { notify } from "@/lib/toast";
import { cn } from "@/lib/utils";
import { deleteCampaign, useCampaigns, useDrafts } from "@/services/promo";
import type { Campaign } from "@/types/promo";

const short = (iso: string | null) => (iso ? new Date(iso).toLocaleDateString("en-IN", { day: "numeric", month: "short" }) : "—");

export function CampaignsView() {
  const mounted = useMounted();
  const now = useNow();
  const flashing = useFlashing();
  const { campaigns, loaded } = useCampaigns();
  const { drafts } = useDrafts();

  const state = (c: Campaign) => {
    if (c.endsAt && new Date(c.endsAt).getTime() < now) return <Badge tone="slate">Ended</Badge>;
    if (c.startsAt && new Date(c.startsAt).getTime() > now) return <Badge tone="amber">Upcoming</Badge>;
    return <Badge tone="green" dot>Running</Badge>;
  };

  const columns: Column<Campaign>[] = [
    { id: "title", header: "Campaign", cell: (c) => <div className="min-w-0"><p className="truncate font-semibold text-ink">{c.title}</p><p className="truncate text-xs text-slate-500">{templateById(c.templateId)?.name ?? nicheLabel(c.niche)}</p></div> },
    { id: "offer", header: "Offer", cell: (c) => <span className="line-clamp-2 max-w-[260px] text-sm text-ink">{c.offer}</span> },
    { id: "code", header: "Code", cell: (c) => (c.offerCode ? <span className="inline-flex items-center gap-1 rounded-md bg-slate-100 px-2 py-0.5 font-mono text-xs"><Tag className="size-3" />{c.offerCode}</span> : <span className="text-slate-400">—</span>) },
    { id: "dates", header: "Dates", cell: (c) => <span className="text-xs text-slate-500">{short(c.startsAt)} – {short(c.endsAt)}</span> },
    { id: "state", header: "State", cell: state },
    { id: "drafts", header: "Drafts", cell: (c) => { const mine = drafts.filter((d) => d.campaignId === c.id); return mine[0] ? <Link href={`/drafts/${mine[0].id}`} className="text-brand text-sm font-semibold hover:underline">{mine.length} open</Link> : <span className="text-slate-400">0</span>; } },
    { id: "actions", header: <span className="sr-only">Actions</span>, className: "text-right", cell: (c) => <div className="flex justify-end"><Button type="button" variant="ghost" size="icon" aria-label={`Delete ${c.title}`} onClick={() => { if (window.confirm(`Delete "${c.title}"? Its drafts are kept.`)) { deleteCampaign(c.id); notify.success("Campaign deleted"); } }}><Trash2 /></Button></div> },
  ];

  if (!mounted) return null;
  return (
    <div className="space-y-6">
      <PageHeader title="Campaigns" description="Every offer you have run, with its dates and code." actions={<Link href="/create" className={cn(buttonVariants({ variant: "brand", size: "xl" }), "rounded-full px-6")}><Wand2 />New campaign</Link>} />
      <DataTable
        columns={columns}
        rows={campaigns}
        rowId={(c) => c.id}
        selectable={false}
        pageSize={8}
        rowClassName={(c) => (flashing.has(c.id) ? "row-flash" : undefined)}
        emptyMessage={!loaded ? "Loading campaigns…" : "No campaigns yet. Create your first one."}
        footerLabel={({ from, to, total }) => <>Showing <b className="text-ink">{from}–{to}</b> of <b className="text-ink">{total}</b> campaigns</>}
      />
      {campaigns.length === 0 && loaded ? <p className="flex items-center justify-center gap-2 text-sm text-slate-400"><Megaphone className="size-4" />Pick a template on the Create page to start.</p> : null}
    </div>
  );
}
