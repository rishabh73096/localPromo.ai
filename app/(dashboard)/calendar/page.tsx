import type { Metadata } from "next";
import { FeatureGate } from "@/components/billing/feature-gate";
import { CalendarView } from "@/components/promo/calendar-view";

export const metadata: Metadata = { title: "Content calendar" };

export default function Page() {
  return (
    <FeatureGate feature="calendar">
      <CalendarView />
    </FeatureGate>
  );
}
