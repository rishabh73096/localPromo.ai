"use client";

import Link from "next/link";
import { IconCheck as Check, IconCreditCard as CreditCard, IconFileText as FileText, IconLock as Lock, IconSpeakerphone as Megaphone, IconUserCircle as UserRound } from "@tabler/icons-react";
import { Grid } from "@/components/charts/chart-card";
import { StatCard } from "@/components/charts/stat-card";
import { buttonVariants } from "@/components/ui/button";
import { PageHeader } from "@/components/ui/page-header";
import { Panel, PanelHeader } from "@/components/ui/panel";
import { useAuthState } from "@/context/AuthContext";
import { useMounted } from "@/hooks/use-mounted";
import { useRole } from "@/hooks/use-role";
import { ALL_FEATURES, FEATURE_LABELS, PLAN_GENERATION_CAP } from "@/lib/plans";
import { usePlan } from "@/lib/plan-store";
import { ROLE_LABELS } from "@/lib/roles";
import { thisMonth } from "@/lib/stats";
import { cn } from "@/lib/utils";
import { useCampaigns, useDrafts } from "@/services/promo";

export function SettingsView() {
  const mounted = useMounted();
  const { user } = useAuthState();
  const { role } = useRole();
  const planInfo = usePlan();
  const { drafts } = useDrafts();
  const { campaigns } = useCampaigns();
  if (!mounted) return null;
  const used = thisMonth(drafts, (d) => d.createdAt);
  const cap = planInfo.plan ? PLAN_GENERATION_CAP[planInfo.plan] : 0;

  return (
    <div className="space-y-6">
      <PageHeader title="Settings" description="Your plan, monthly usage and account." />
      <Grid cols={3}>
        <StatCard icon={FileText} label="Drafts this month" value={cap ? `${used} / ${cap}` : String(used)} sub={cap ? `${Math.round((used / cap) * 100)}% of your limit` : undefined} />
        <StatCard icon={CreditCard} label="Plan" value={planInfo.isAdmin ? "Admin" : planInfo.plan ?? "None"} />
        <StatCard icon={Megaphone} label="Campaigns in total" value={String(campaigns.length)} />
      </Grid>
      <div className="grid gap-6 lg:grid-cols-2">
        <Panel className="p-5 sm:p-6">
          <PanelHeader title="Plan and usage" icon={CreditCard} />
          <ul className="mt-5 space-y-2 text-sm">
            {ALL_FEATURES.map((f) => {
              const on = planInfo.can(f);
              return (
                <li key={f} className={cn("flex items-center gap-2", on ? "text-slate-700" : "text-slate-400")}>
                  {on ? <Check className="text-brand size-4" /> : <Lock className="size-4" />}
                  {FEATURE_LABELS[f]}
                  {!on ? <span className="rounded-full bg-amber-100 px-2 py-0.5 text-[10px] font-bold text-amber-700">Pro</span> : null}
                </li>
              );
            })}
          </ul>
          <div className="mt-5 flex flex-wrap gap-2">
            {planInfo.plan === "Starter" && !planInfo.isAdmin ? <Link href="/choose-plan?plan=Pro" className={cn(buttonVariants({ variant: "brand", size: "lg" }), "h-10 rounded-full px-5")}>Upgrade to Pro</Link> : null}
            <Link href="/choose-plan" className={cn(buttonVariants({ variant: "neutral", size: "lg" }), "h-10 rounded-full px-5")}>Change or renew plan</Link>
          </div>
        </Panel>
        <Panel className="p-5 sm:p-6">
          <PanelHeader title="Account" icon={UserRound} />
          <dl className="mt-5 space-y-3 text-sm">
            <div className="flex justify-between gap-4"><dt className="text-slate-500">Name</dt><dd className="truncate font-semibold text-ink">{user?.fullName || "—"}</dd></div>
            <div className="flex justify-between gap-4"><dt className="text-slate-500">Email</dt><dd className="truncate font-semibold text-ink">{user?.email || "—"}</dd></div>
            <div className="flex justify-between gap-4"><dt className="text-slate-500">Role</dt><dd className="font-semibold text-ink">{ROLE_LABELS[role]}</dd></div>
          </dl>
          <Link href="/brand" className="text-brand mt-5 inline-block text-sm font-semibold hover:underline">Edit brand profile</Link>
        </Panel>
      </div>
    </div>
  );
}
