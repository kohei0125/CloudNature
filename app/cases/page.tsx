import type { Metadata } from "next";
import PlaceholderPage from "@/components/PlaceholderPage";
import { PAGE_META } from "@/content/strings";

export const metadata: Metadata = {
  title: PAGE_META.cases.title,
  description: PAGE_META.cases.description
};

export default function CasesPage() {
  return <PlaceholderPage title="導入事例" />;
}
