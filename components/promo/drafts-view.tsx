"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { IconCopy as Copy, IconFileText as FileText, IconTrash as Trash2, IconWand as Wand2 } from "@tabler/icons-react";
import { Badge } from "@/components/ui/badge";
import { Button, buttonVariants } from "@/components/ui/button";
import { CountTabs } from "@/components/ui/count-tabs";
import { DataTable, type Column } from "@/components/ui/data-table";
import { PageHeader } from "@/components/ui/page-header";
import { SearchInput } from "@/components/ui/search-input";
import { useMounted } from "@/hooks/use-mounted";
import { useFlashing } from "@/lib/flash";
import { STATUSES, statusMeta } from "@/lib/stats";
import { notify } from "@/lib/toast";
import { cn } from "@/lib/utils";
import { deleteDraft, duplicateDraft, useDrafts } from "@/services/promo";
import type { Draft, DraftStatus } from "@/types/promo";

type Filter = "all" | DraftStatus;

export function DraftsView() {
  const mounted = useMounted();
  const flashing = useFlashing();
  const { drafts, loaded } = useDrafts();
  const [filter, setFilter] = useState<Filter>("all");
  const [query, setQuery] = useState("");

  const tabs = useMemo(() => [{ value: "all" as Filter, label: "All", count: drafts.length }, ...STATUSES.map((s) => ({ value: s.value as Filter, label: s.label, count: drafts.filter((d) => d.status === s.value).length }))], [drafts]);
  const rows = useMemo(() => {
    const q = query.trim().toLowerCase();
    return drafts.filter((d) => (filter === "all" || d.status === filter) && (!q || `${d.title} ${d.captionEn}`.toLowerCase().includes(q)));
  }, [drafts, filter, query]);

  const columns: Column<Draft>[] = [
    { id: "title", header: "Draft", cell: (d) => <div className="min-w-0"><Link href={`/drafts/${d.id}`} className="block truncate font-semibold text-ink hover:text-brand hover:underline">{d.title}</Link><p className="truncate text-xs text-slate-500">{d.poster.subline}</p></div> },
    { id: "status", header: "Status", cell: (d) => <Badge tone={statusMeta(d.status).tone} dot>{statusMeta(d.status).label}</Badge> },
    { id: "when", header: "Post on", cell: (d) => <span className="text-xs text-slate-500">{d.scheduledFor ? new Date(d.scheduledFor).toLocaleDateString("en-IN", { day: "numeric", month: "short" }) : "—"}</span> },
    { id: "updated", header: "Edited", cell: (d) => <span className="text-xs text-slate-500">{new Date(d.updatedAt).toLocaleDateString("en-IN", { day: "numeric", month: "short" })}</span> },
    {
      id: "actions",
      header: <span className="sr-only">Actions</span>,
      className: "text-right",
      cell: (d) => (
        <div className="flex justify-end gap-1">
          <Button type="button" variant="ghost" size="icon" aria-label={`Duplicate ${d.title}`} onClick={() => { duplicateDraft(d.id); notify.success("Draft duplicated"); }}><Copy /></Button>
          <Button type="button" variant="ghost" size="icon" aria-label={`Delete ${d.title}`} onClick={() => { if (window.confirm(`Delete "${d.title}"?`)) { deleteDraft(d.id); notify.success("Draft deleted"); } }}><Trash2 /></Button>
        </div>
      ),
    },
  ];

  if (!mounted) return null;
  return (
    <div className="space-y-6">
      <PageHeader title="Saved drafts" description="Every caption and poster you have made, with its status." actions={<Link href="/create" className={cn(buttonVariants({ variant: "brand", size: "xl" }), "rounded-full px-6")}><Wand2 />Create content</Link>} />
      <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <CountTabs label="Filter by status" tabs={tabs} value={filter} onChange={setFilter} />
        <SearchInput value={query} onValueChange={setQuery} placeholder="Search drafts" clearable tone="white" className="w-full lg:w-72" />
      </div>
      <DataTable
        columns={columns}
        rows={rows}
        rowId={(d) => d.id}
        selectable={false}
        pageSize={8}
        rowClassName={(d) => (flashing.has(d.id) ? "row-flash" : undefined)}
        emptyMessage={!loaded ? "Loading drafts…" : drafts.length ? "No drafts match these filters." : "No drafts yet. Create your first campaign."}
        footerLabel={({ from, to, total }) => <>Showing <b className="text-ink">{from}–{to}</b> of <b className="text-ink">{total}</b> drafts</>}
      />
      {drafts.length === 0 && loaded ? <p className="flex items-center justify-center gap-2 text-sm text-slate-400"><FileText className="size-4" />Drafts you create are saved here automatically.</p> : null}
    </div>
  );
}
