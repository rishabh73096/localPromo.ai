"use client";

import Link from "next/link";
import { IconArrowRight as ArrowRight, IconCalendarTime as CalendarClock, IconCalendarHeart as CalendarHeart, IconCircleCheck as CheckCircle2, IconFileText as FileText, IconSpeakerphone as Megaphone, IconWand as Wand2 } from "@tabler/icons-react";
import { AreaTrend, BarsH } from "@/components/charts/charts";
import { ChartCard, Grid } from "@/components/charts/chart-card";
import { StatCard } from "@/components/charts/stat-card";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { PageHeader } from "@/components/ui/page-header";
import { Panel, PanelHeader } from "@/components/ui/panel";
import { useAuth } from "@/context/AuthContext";
import { useMounted } from "@/hooks/use-mounted";
import { useNow } from "@/hooks/use-now";
import { usePlan } from "@/lib/plan-store";
import { PLAN_GENERATION_CAP } from "@/lib/plans";
import { perDay, statusCounts, statusMeta, thisMonth } from "@/lib/stats";
import { upcomingFestivals } from "@/lib/templates";
import { cn } from "@/lib/utils";
import { useBrand, useCampaigns, useDrafts } from "@/services/promo";

export function Overview() {
  const mounted = useMounted();
  const now = useNow();
  const user = useAuth();
  const { plan } = usePlan();
  const { brand, loaded: brandLoaded } = useBrand();
  const { campaigns } = useCampaigns();
  const { drafts } = useDrafts();
  if (!mounted) return null;

  const first = user?.fullName?.split(" ")[0];
  const scheduled = drafts.filter((d) => d.status === "scheduled" && d.scheduledFor && new Date(d.scheduledFor).getTime() >= now - 86_400_000).sort((a, b) => a.scheduledFor!.localeCompare(b.scheduledFor!));
  const published = drafts.filter((d) => d.status === "published").length;
  const made = thisMonth(drafts, (d) => d.createdAt, now);
  const cap = plan ? PLAN_GENERATION_CAP[plan] : 0;
  const trend = perDay(drafts, (d) => d.createdAt, 14, now);
  const statuses = statusCounts(drafts);
  const festivals = upcomingFestivals(now, 3);
  const needsBrand = brandLoaded && !brand.businessName;

  return (
    <div className="space-y-6">
      <PageHeader
        title={first ? `Hi ${first}, what are we promoting?` : "Today"}
        description="Your campaigns, what is scheduled, and the festivals coming up."
        actions={<Link href="/create" className={cn(buttonVariants({ variant: "brand", size: "xl" }), "rounded-full px-6")}><Wand2 />Create content</Link>}
      />

      {needsBrand ? (
        <Link href="/brand" className="group flex items-center justify-between gap-4 rounded-2xl bg-brand-soft p-5 transition-transform hover:-translate-y-0.5">
          <div>
            <p className="font-inter text-base font-semibold text-ink">Save your brand first</p>
            <p className="mt-0.5 text-sm text-slate-600">Add your business name, services and tone once. Every caption and poster starts from them.</p>
          </div>
          <span className="text-brand flex shrink-0 items-center gap-1 text-sm font-semibold">Set up <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" /></span>
        </Link>
      ) : null}

      <Grid cols={4}>
        <StatCard icon={Megaphone} label="Campaigns" value={String(campaigns.length)} sub="All time" href="/campaigns" />
        <StatCard icon={FileText} label="Drafts made" value={cap ? `${made} / ${cap}` : String(made)} sub="This month" spark={trend.map((p) => p.value)} href="/drafts" />
        <StatCard icon={CalendarClock} label="Scheduled" value={String(scheduled.length)} sub="Upcoming posts" href="/calendar" />
        <StatCard icon={CheckCircle2} label="Published" value={String(published)} sub="Marked as posted" href="/drafts" />
      </Grid>

      <Grid cols={2}>
        <ChartCard title="Drafts created" description="Last 14 days" table={{ head: ["Day", "Drafts"], rows: trend.map((p) => [p.label, p.value]) }}>
          <AreaTrend data={trend} name="Drafts" />
        </ChartCard>
        <ChartCard title="Drafts by status" description="Where every post stands" table={{ head: ["Status", "Drafts"], rows: statuses.map((s) => [s.label, s.value]) }}>
          <BarsH data={statuses.map(({ label, value, color }) => ({ label, value, color }))} name="Drafts" height={220} />
        </ChartCard>
      </Grid>

      <Grid cols={2}>
        <Panel className="p-5 sm:p-6">
          <PanelHeader title="Coming up" description="Scheduled posts, soonest first." icon={CalendarClock} aside={<Link href="/calendar" className="text-brand inline-flex items-center gap-1 text-sm font-semibold hover:underline">Calendar<ArrowRight className="size-3.5" /></Link>} />
          {scheduled.length === 0 ? (
            <p className="mt-6 rounded-xl border border-dashed border-slate-200 px-4 py-8 text-center text-sm text-slate-400">Nothing scheduled. Pick a draft and set a date.</p>
          ) : (
            <ul className="mt-4 divide-y divide-slate-100">
              {scheduled.slice(0, 5).map((d) => (
                <li key={d.id}>
                  <Link href={`/drafts/${d.id}`} className="flex items-center justify-between gap-3 py-3 transition-transform duration-200 hover:translate-x-1">
                    <p className="truncate text-sm font-semibold text-ink">{d.title}</p>
                    <Badge tone={statusMeta(d.status).tone} size="sm">{new Date(d.scheduledFor!).toLocaleDateString("en-IN", { weekday: "short", day: "numeric", month: "short" })}</Badge>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </Panel>
        <Panel className="p-5 sm:p-6">
          <PanelHeader title="Festivals ahead" description="Plan the offer before the rush." icon={CalendarHeart} />
          <ul className="mt-4 divide-y divide-slate-100">
            {festivals.map((f) => (
              <li key={f.name} className="flex items-center justify-between gap-3 py-3">
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-ink">{f.name} <span className="font-normal text-slate-400">· {f.hi}</span></p>
                  <p className="text-xs text-slate-500">{f.at.toLocaleDateString("en-IN", { day: "numeric", month: "long" })}{f.approx ? " (approx.)" : ""}</p>
                </div>
                <Link href={`/create?festival=${encodeURIComponent(f.name)}`} className="text-brand shrink-0 text-sm font-semibold hover:underline">Plan an offer</Link>
              </li>
            ))}
          </ul>
        </Panel>
      </Grid>
    </div>
  );
}
