import type { Metadata } from "next";
import { DraftsView } from "@/components/promo/drafts-view";

export const metadata: Metadata = { title: "Saved drafts" };

export default function Page() {
  return <DraftsView />;
}
