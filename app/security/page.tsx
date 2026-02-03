import type { Metadata } from "next";
import PlaceholderPage from "@/components/PlaceholderPage";
import { PAGE_META } from "@/content/strings";

export const metadata: Metadata = {
  title: PAGE_META.security.title,
  description: PAGE_META.security.description
};

export default function SecurityPage() {
  return <PlaceholderPage title="情報セキュリティ方針" />;
}
