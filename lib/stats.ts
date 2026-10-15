import { DAY_MS, addDays, startOfDay } from "@/lib/date";
import type { Draft, DraftStatus } from "@/types/promo";

const dayLabel = (d: number) => new Date(d).toLocaleDateString("en-IN", { day: "numeric", month: "short" });

export type DayPoint = { label: string; value: number };

export function perDay<T>(items: T[], at: (i: T) => string | null, days: number, now: number): DayPoint[] {
  const start = startOfDay(addDays(now, -(days - 1))).getTime();
  const out: DayPoint[] = Array.from({ length: days }, (_, i) => ({ label: dayLabel(start + i * DAY_MS), value: 0 }));
  for (const it of items) {
    const t = at(it);
    if (!t) continue;
    const idx = Math.floor((startOfDay(new Date(t)).getTime() - start) / DAY_MS);
    if (idx >= 0 && idx < days) out[idx].value++;
  }
  return out;
}

export const STATUSES: { value: DraftStatus; label: string; tone: "slate" | "purple" | "amber" | "green"; color: string }[] = [
  { value: "draft", label: "Draft", tone: "slate", color: "#c3c2b7" },
  { value: "ready", label: "Ready", tone: "purple", color: "#b91c3c" },
  { value: "scheduled", label: "Scheduled", tone: "amber", color: "#f59f00" },
  { value: "published", label: "Published", tone: "green", color: "#2f9e44" },
];
export const statusMeta = (s: DraftStatus) => STATUSES.find((x) => x.value === s) ?? STATUSES[0];
export const statusCounts = (drafts: Draft[]) => STATUSES.map((s) => ({ key: s.value, label: s.label, value: drafts.filter((d) => d.status === s.value).length, color: s.color }));

export const sum = (nums: number[]) => nums.reduce((a, b) => a + b, 0);

export const thisMonth = <T,>(items: T[], at: (i: T) => string, now = Date.now()) => {
  const d = new Date(now);
  const start = new Date(d.getFullYear(), d.getMonth(), 1).getTime();
  return items.filter((i) => new Date(at(i)).getTime() >= start).length;
};
