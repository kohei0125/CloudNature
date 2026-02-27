import type { Metadata } from "next";
import { PAGE_META } from "@/content/common";
import { TERMS_HERO, TERMS_SECTIONS } from "@/content/legal";
import PageHero from "@/components/shared/PageHero";
import LegalDocument from "@/components/legal/LegalDocument";
import { breadcrumbJsonLd } from "@/lib/structured-data";

export const metadata: Metadata = {
  title: PAGE_META.terms.title,
  description: PAGE_META.terms.description,
  openGraph: {
    title: PAGE_META.terms.title,
    description: PAGE_META.terms.description,
    type: "website",
    locale: "ja_JP",
  },
  twitter: {
    card: "summary",
    title: PAGE_META.terms.title,
    description: PAGE_META.terms.description,
  },
  alternates: { canonical: "https://cloudnature.jp/terms" },
};

export default function TermsPage() {
  const breadcrumb = breadcrumbJsonLd([{ name: "利用規約", path: "/terms" }]);

  return (
    <div>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumb) }}
      />
      <PageHero
        eyebrow={TERMS_HERO.eyebrow}
        title={TERMS_HERO.title}
        description={TERMS_HERO.description}
      />
      <LegalDocument
        sections={TERMS_SECTIONS}
        relatedLink={{ label: "プライバシーポリシーもご覧ください", href: "/privacy" }}
      />
    </div>
  );
}
