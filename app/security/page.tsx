import type { Metadata } from "next";
import { PAGE_META } from "@/content/common";
import { SECURITY_HERO, SECURITY_SECTIONS } from "@/content/legal";
import PageHero from "@/components/shared/PageHero";
import LegalDocument from "@/components/legal/LegalDocument";
import { breadcrumbJsonLd } from "@/lib/structured-data";

export const metadata: Metadata = {
  title: PAGE_META.security.title,
  description: PAGE_META.security.description,
  openGraph: {
    title: PAGE_META.security.title,
    description: PAGE_META.security.description,
    type: "website",
    locale: "ja_JP",
  },
  twitter: {
    card: "summary",
    title: PAGE_META.security.title,
    description: PAGE_META.security.description,
  },
  alternates: { canonical: "https://cloudnature.jp/security" },
};

export default function SecurityPage() {
  const breadcrumb = breadcrumbJsonLd([{ name: "情報セキュリティ方針", path: "/security" }]);

  return (
    <div>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumb) }}
      />
      <PageHero
        eyebrow={SECURITY_HERO.eyebrow}
        title={SECURITY_HERO.title}
        description={SECURITY_HERO.description}
      />
      <LegalDocument
        sections={SECURITY_SECTIONS}
        relatedLink={{ label: "プライバシーポリシーもご覧ください", href: "/privacy" }}
      />
    </div>
  );
}
