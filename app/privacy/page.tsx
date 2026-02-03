import type { Metadata } from "next";
import PlaceholderPage from "@/components/PlaceholderPage";
import { PAGE_META } from "@/content/strings";

export const metadata: Metadata = {
  title: PAGE_META.privacy.title,
  description: PAGE_META.privacy.description
};

export default function PrivacyPage() {
  return <PlaceholderPage title="プライバシーポリシー" />;
}
