"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { CalendarDays } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { NativeSelect } from "@/components/ui/native-select";
import { MonthCalendar } from "@/components/ui/month-calendar";
import { PageHeader } from "@/components/ui/page-header";
import { Panel, PanelHeader } from "@/components/ui/panel";
import { useMounted } from "@/hooks/use-mounted";
import { useNow } from "@/hooks/use-now";
import { dateKey, sameDay } from "@/lib/date";
import { statusMeta } from "@/lib/stats";
import { FESTIVALS } from "@/lib/templates";
import { notify } from "@/lib/toast";
import { updateDraft, useDrafts } from "@/services/promo";

const festivalKey = (f: (typeof FESTIVALS)[number], year: number) => (f.date.length === 5 ? `${year}-${f.date}` : f.date);

export function CalendarView() {
  const mounted = useMounted();
  const now = useNow();
  const { drafts } = useDrafts();
  const [selected, setSelected] = useState(() => new Date());
  const [pick, setPick] = useState("");

  const scheduled = useMemo(() => drafts.filter((d) => d.scheduledFor), [drafts]);
  const marked = useMemo(() => {
    const s = new Set<string>(scheduled.map((d) => dateKey(new Date(d.scheduledFor!))));
    return s;
  }, [scheduled]);
  if (!mounted) return null;

  const today = now;
  const onDay = scheduled.filter((d) => sameDay(new Date(d.scheduledFor!), selected));
  const festivals = FESTIVALS.filter((f) => festivalKey(f, selected.getFullYear()) === dateKey(selected));
  const unscheduled = drafts.filter((d) => !d.scheduledFor && d.status !== "published");

  const add = () => {
    if (!pick) return;
    const at = new Date(selected);
    at.setHours(18, 0, 0, 0);
    updateDraft(pick, { scheduledFor: at.toISOString(), status: "scheduled" });
    setPick("");
    notify.success("Scheduled", at.toLocaleDateString("en-IN", { weekday: "long", day: "numeric", month: "long" }));
  };

  return (
    <div className="space-y-6">
      <PageHeader title="Content calendar" description="See what is going out and when. Pick a day, then add a draft to it." />
      <div className="grid gap-6 lg:grid-cols-[380px_minmax(0,1fr)]">
        <MonthCalendar selected={selected} onSelect={setSelected} marked={marked} today={today} />
        <Panel className="p-5 sm:p-6">
          <PanelHeader title={selected.toLocaleDateString("en-IN", { weekday: "long", day: "numeric", month: "long" })} icon={CalendarDays} />
          {festivals.map((f) => <p key={f.name} className="mt-3 rounded-xl bg-[#fff4d6] px-4 py-2.5 text-sm font-medium text-[#8a5a00]">🎉 {f.name} · {f.hi}</p>)}
          {onDay.length === 0 ? (
            <p className="mt-4 rounded-xl border border-dashed border-slate-200 px-4 py-8 text-center text-sm text-slate-400">Nothing scheduled for this day.</p>
          ) : (
            <ul className="mt-4 divide-y divide-slate-100">
              {onDay.map((d) => (
                <li key={d.id} className="flex items-center justify-between gap-3 py-3">
                  <Link href={`/drafts/${d.id}`} className="min-w-0 truncate text-sm font-semibold text-ink hover:text-brand hover:underline">{d.title}</Link>
                  <Badge tone={statusMeta(d.status).tone} size="sm">{statusMeta(d.status).label}</Badge>
                </li>
              ))}
            </ul>
          )}
          <div className="mt-5 flex flex-wrap gap-2 border-t border-slate-100 pt-5">
            <NativeSelect aria-label="Draft to schedule" value={pick} onChange={(e) => setPick(e.target.value)} className="max-w-xs flex-1">
              <option value="">{unscheduled.length ? "Choose a draft to add…" : "No unscheduled drafts"}</option>
              {unscheduled.map((d) => <option key={d.id} value={d.id}>{d.title}</option>)}
            </NativeSelect>
            <button type="button" onClick={add} disabled={!pick} className="bg-ink h-11 rounded-full px-6 text-sm font-semibold text-white transition-all hover:bg-black active:scale-95 disabled:opacity-40">Add to this day</button>
          </div>
        </Panel>
      </div>
    </div>
  );
}
