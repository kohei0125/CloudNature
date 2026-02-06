import type { Metadata } from "next";
import PlaceholderPage from "@/components/shared/PlaceholderPage";
import { PAGE_META } from "@/content/common";

export const metadata: Metadata = {
  title: PAGE_META.contact.title,
  description: PAGE_META.contact.description
};

export default function ContactPage() {
  return <PlaceholderPage title="お問い合わせ" />;
}
