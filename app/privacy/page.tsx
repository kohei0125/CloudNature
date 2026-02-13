import type { Metadata } from "next";
import { PAGE_META } from "@/content/common";
import { PRIVACY_HERO, PRIVACY_SECTIONS } from "@/content/legal";
import PageHero from "@/components/shared/PageHero";
import LegalDocument from "@/components/legal/LegalDocument";

export const metadata: Metadata = {
  title: PAGE_META.privacy.title,
  description: PAGE_META.privacy.description,
  openGraph: {
    title: PAGE_META.privacy.title,
    description: PAGE_META.privacy.description,
    type: "website",
    locale: "ja_JP",
  },
  twitter: {
    card: "summary",
    title: PAGE_META.privacy.title,
    description: PAGE_META.privacy.description,
  }
};

export default function PrivacyPage() {
  return (
    <div>
      <PageHero
        eyebrow={PRIVACY_HERO.eyebrow}
        title={PRIVACY_HERO.title}
        description={PRIVACY_HERO.description}
      />
      <LegalDocument
        sections={PRIVACY_SECTIONS}
        relatedLink={{ label: "情報セキュリティ方針もご覧ください", href: "/security" }}
      />
    </div>
  );
}
