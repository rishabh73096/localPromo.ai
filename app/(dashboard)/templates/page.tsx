import type { Metadata } from "next";
import { TemplatesView } from "@/components/promo/templates-view";

export const metadata: Metadata = { title: "Templates" };

export default function Page() {
  return <TemplatesView />;
}
