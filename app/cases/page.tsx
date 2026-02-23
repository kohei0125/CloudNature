import type { Metadata } from "next";
import { PAGE_META } from "@/content/common";
import { CASES_HERO, CASE_STUDY_DETAILS, CASES_CTA, CASES_INLINE_CTA } from "@/content/cases";
import PageHero from "@/components/shared/PageHero";
import CaseStudyDetailCard from "@/components/cases/CaseStudyDetailCard";
import CtaBanner from "@/components/shared/CtaBanner";
import InlineCta from "@/components/shared/InlineCta";
import { ScrollReveal } from "@/components/shared/ScrollReveal";

export const metadata: Metadata = {
  title: PAGE_META.cases.title,
  description: PAGE_META.cases.description,
  openGraph: {
    title: PAGE_META.cases.title,
    description: PAGE_META.cases.description,
    type: "website",
    locale: "ja_JP",
    url: "https://cloudnature.jp/cases",
  },
  twitter: {
    card: "summary_large_image",
    title: PAGE_META.cases.title,
    description: PAGE_META.cases.description,
  },
  alternates: { canonical: "https://cloudnature.jp/cases" },
};

export default function CasesPage() {
  return (
    <div className="w-full bg-cream">
      <PageHero
        eyebrow={CASES_HERO.eyebrow}
        title={CASES_HERO.title}
        description={CASES_HERO.description}
      />
      <section className="py-16 md:py-24 bg-mist">
        <div className="container mx-auto px-6 space-y-16 md:space-y-20">
          {CASE_STUDY_DETAILS.map((study, index) => (
            <div key={study.id}>
              <ScrollReveal variant={index % 2 === 0 ? "fade-left" : "fade-right"}>
                <CaseStudyDetailCard study={study} index={index} />
              </ScrollReveal>
              {/* Inline CTA after 2nd case study */}
              {index === 1 && (
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
      </section>
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
