import type { Metadata } from "next";
import PlaceholderPage from "@/components/PlaceholderPage";
import { PAGE_META } from "@/content/strings";

export const metadata: Metadata = {
  title: PAGE_META.services.title,
  description: PAGE_META.services.description
};

export default function ServicesPage() {
  return <PlaceholderPage title="サービス紹介" />;
}
