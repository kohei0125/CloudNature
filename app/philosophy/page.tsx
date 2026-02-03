import type { Metadata } from "next";
import PlaceholderPage from "@/components/PlaceholderPage";
import { PAGE_META } from "@/content/strings";

export const metadata: Metadata = {
  title: PAGE_META.philosophy.title,
  description: PAGE_META.philosophy.description
};

export default function PhilosophyPage() {
  return <PlaceholderPage title="私たちの想い" />;
}
