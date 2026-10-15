import type { Metadata } from "next";
import { Overview } from "@/components/promo/overview";

export const metadata: Metadata = { title: "Dashboard" };

export default function Page() {
  return <Overview />;
}
