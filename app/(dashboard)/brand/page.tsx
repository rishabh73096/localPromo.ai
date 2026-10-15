import type { Metadata } from "next";
import { BrandView } from "@/components/promo/brand-view";

export const metadata: Metadata = { title: "Brand profile" };

export default function Page() {
  return <BrandView />;
}
