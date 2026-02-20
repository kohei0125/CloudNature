import type { Metadata } from "next";
import { PAGE_META } from "@/content/common";
import { COMPANY_HERO, COMPANY_CTA, COMPANY_MID_CTA } from "@/content/company";
import PageHero from "@/components/shared/PageHero";
import CompanyOverview from "@/components/company/CompanyOverview";
import RepresentativeMessage from "@/components/company/RepresentativeMessage";
import AccessSection from "@/components/company/AccessSection";
import CtaBanner from "@/components/shared/CtaBanner";
import InlineCta from "@/components/shared/InlineCta";
import { ScrollReveal } from "@/components/shared/ScrollReveal";

export const metadata: Metadata = {
  title: PAGE_META.company.title,
  description: PAGE_META.company.description,
  openGraph: {
    title: PAGE_META.company.title,
    description: PAGE_META.company.description,
    type: "website",
    locale: "ja_JP",
    url: "https://cloudnature.jp/company",
  },
  twitter: {
    card: "summary_large_image",
    title: PAGE_META.company.title,
    description: PAGE_META.company.description,
  },
  alternates: { canonical: "https://cloudnature.jp/company" },
};

export default function CompanyPage() {
  return (
    <div className="w-full bg-cream">
      <PageHero
        eyebrow={COMPANY_HERO.eyebrow}
        title={COMPANY_HERO.title}
        description={COMPANY_HERO.description}
      />
      <ScrollReveal>
        <CompanyOverview />
      </ScrollReveal>
      <ScrollReveal>
        <RepresentativeMessage />
      </ScrollReveal>

      <section className="pb-8 bg-white">
        <div className="container mx-auto px-6 max-w-2xl">
          <InlineCta
            title={COMPANY_MID_CTA.text}
            primaryLabel={COMPANY_MID_CTA.primaryLabel}
            secondaryLabel={COMPANY_MID_CTA.secondaryLabel}
          />
        </div>
      </section>

      <ScrollReveal>
        <AccessSection />
      </ScrollReveal>
      <CtaBanner
        eyebrow={COMPANY_CTA.eyebrow}
        title={COMPANY_CTA.title}
        description={COMPANY_CTA.description}
        primaryCta={COMPANY_CTA.primaryCta}
        secondaryCta={COMPANY_CTA.secondaryCta}
      />
    </div>
  );
}
