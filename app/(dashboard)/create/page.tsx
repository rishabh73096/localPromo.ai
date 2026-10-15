import type { Metadata } from "next";
import { CreateView } from "@/components/promo/create-view";

export const metadata: Metadata = { title: "Create content" };

export default async function Page({ searchParams }: { searchParams: Promise<{ template?: string; festival?: string }> }) {
  const { template, festival } = await searchParams;
  return <CreateView key={`${template ?? ""}${festival ?? ""}`} template={template} festival={festival} />;
}
