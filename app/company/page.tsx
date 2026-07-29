import type { Metadata } from "next";
import { PAGE_META } from "@/content/common";
import { COMPANY_CTA } from "@/content/company";
import CompanyHero from "@/components/company/CompanyHero";
import CompanyPurpose from "@/components/company/CompanyPurpose";
import CompanyWorkspace from "@/components/company/CompanyWorkspace";
import CompanyMessage from "@/components/company/CompanyMessage";
import CompanyOverview from "@/components/company/CompanyOverview";
import SkylineArt from "@/components/company/SkylineArt";
import CtaBanner from "@/components/shared/CtaBanner";
import { ScrollReveal } from "@/components/shared/ScrollReveal";
import { breadcrumbJsonLd } from "@/lib/structured-data";

export const metadata: Metadata = {
  title: PAGE_META.company.title,
  description: PAGE_META.company.description,
  openGraph: {
    title: PAGE_META.company.title,
    description: PAGE_META.company.description,
    type: "website",
    locale: "ja_JP",
    url: "https://cloudnature.jp/company",
    images: [
      {
        url: "/images/og-img.jpg",
        width: 1200,
        height: 630,
        alt: PAGE_META.company.title,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: PAGE_META.company.title,
    description: PAGE_META.company.description,
  },
  alternates: { canonical: "https://cloudnature.jp/company" },
};

export default function CompanyPage() {
  const breadcrumb = breadcrumbJsonLd([{ name: "企業情報", path: "/company" }]);

  return (
    <div className="w-full bg-white">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumb) }}
      />

      <CompanyHero />

      <ScrollReveal>
        <CompanyPurpose />
      </ScrollReveal>
      <ScrollReveal>
        <CompanyWorkspace />
      </ScrollReveal>
      <ScrollReveal>
        <CompanyMessage />
      </ScrollReveal>
      <ScrollReveal>
        <CompanyOverview />
      </ScrollReveal>

      <CtaBanner
        eyebrow={COMPANY_CTA.eyebrow}
        title={COMPANY_CTA.title}
        description={COMPANY_CTA.description}
        primaryCta={COMPANY_CTA.primaryCta}
        secondaryCta={COMPANY_CTA.secondaryCta}
        bottomDecoration={
          <SkylineArt className="absolute bottom-0 right-0 h-auto w-[440px] max-w-full text-white/[0.12] sm:w-[560px]" />
        }
      />
    </div>
  );
}
