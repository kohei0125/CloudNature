import type { Metadata } from "next";
import { PAGE_META } from "@/content/common";
import { CASES_HERO, CASES_INTERNAL_SECTION, CASE_STUDY_DETAILS, CASES_CTA, CASES_INLINE_CTA } from "@/content/cases";
import PageHero from "@/components/shared/PageHero";
import CaseStudyDetailCard from "@/components/cases/CaseStudyDetailCard";
import SectionHeader from "@/components/shared/SectionHeader";
import CtaBanner from "@/components/shared/CtaBanner";
import InlineCta from "@/components/shared/InlineCta";
import { ScrollReveal } from "@/components/shared/ScrollReveal";
import { breadcrumbJsonLd } from "@/lib/structured-data";
import RelatedLinks from "@/components/shared/RelatedLinks";
import { SERVICE_PAGE_MAP } from "@/content/services";

export const metadata: Metadata = {
  title: PAGE_META.cases.title,
  description: PAGE_META.cases.description,
  openGraph: {
    title: PAGE_META.cases.title,
    description: PAGE_META.cases.description,
    type: "website",
    locale: "ja_JP",
    url: "https://cloudnature.jp/cases",
    images: [
      {
        url: "/images/og-img.jpg",
        width: 1200,
        height: 630,
        alt: PAGE_META.cases.title,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: PAGE_META.cases.title,
    description: PAGE_META.cases.description,
  },
  alternates: { canonical: "https://cloudnature.jp/cases" },
};

export default function CasesPage() {
  const breadcrumb = breadcrumbJsonLd([{ name: CASES_HERO.title, path: "/cases" }]);

  return (
    <div className="w-full bg-cream">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumb) }}
      />
      <PageHero
        eyebrow={CASES_HERO.eyebrow}
        title={CASES_HERO.title}
        description={CASES_HERO.description}
      />
      <section id="cases-list" aria-labelledby="cases-list-heading" className="py-16 md:py-24 bg-mist scroll-mt-24">
        <div className="container mx-auto px-6">
          <SectionHeader
            eyebrow={CASES_INTERNAL_SECTION.eyebrow}
            title={CASES_INTERNAL_SECTION.title}
            headingId="cases-list-heading"
            centered
          />
        </div>
        <div className="container mx-auto px-6 space-y-16 md:space-y-20">
          {CASE_STUDY_DETAILS.map((study, index) => (
            <div key={study.id}>
              <ScrollReveal variant={index % 2 === 0 ? "fade-left" : "fade-right"}>
                <CaseStudyDetailCard study={study} index={index} />
              </ScrollReveal>
              {/* 中間位置のインラインCTA。末尾カードの直後（=CTAバナー直前）には出さない */}
              {index === 1 && index < CASE_STUDY_DETAILS.length - 1 && (
                <div className="mt-16 max-w-2xl mx-auto">
                  <InlineCta
                    title={CASES_INLINE_CTA.title}
                    primaryLabel={CASES_INLINE_CTA.primaryLabel}
                    secondaryLabel={CASES_INLINE_CTA.secondaryLabel}
                  />
                </div>
              )}
            </div>
          ))}
        </div>
        <p className="container mx-auto px-6 mt-12 text-xs leading-relaxed text-gray-500">
          ※記載の数値は、当社自身の業務で計測した実績値です。効果は業務内容・運用状況により異なります。
        </p>
      </section>
      <RelatedLinks
        eyebrow="SERVICES"
        title="関連するサービス"
        items={Object.values(SERVICE_PAGE_MAP).map((s) => ({
          label: s.title,
          href: s.path,
          description: "サービス詳細",
        }))}
      />
      <CtaBanner
        eyebrow={CASES_CTA.eyebrow}
        title={CASES_CTA.title}
        description={CASES_CTA.description}
        primaryCta={CASES_CTA.primaryCta}
        secondaryCta={CASES_CTA.secondaryCta}
      />
    </div>
  );
}
