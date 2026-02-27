import type { Metadata } from "next";
import { PAGE_META } from "@/content/common";
import { SERVICES_HERO, SERVICE_DETAILS, SERVICES_MID_CTA, SERVICES_BOTTOM_CTA, SERVICES_FAQ } from "@/content/services";
import PageHero from "@/components/shared/PageHero";
import ServiceDetailCard from "@/components/services/ServiceDetailCard";
import ImplementationFlow from "@/components/services/ImplementationFlow";
import PricingApproach from "@/components/services/PricingApproach";
import ServicesFaq from "@/components/services/ServicesFaq";
import CtaBanner from "@/components/shared/CtaBanner";
import InlineCta from "@/components/shared/InlineCta";
import { ScrollReveal } from "@/components/shared/ScrollReveal";
import { breadcrumbJsonLd } from "@/lib/structured-data";

export const metadata: Metadata = {
  title: PAGE_META.services.title,
  description: PAGE_META.services.description,
  openGraph: {
    title: PAGE_META.services.title,
    description: PAGE_META.services.description,
    type: "website",
    locale: "ja_JP",
    url: "https://cloudnature.jp/services",
    images: [{ url: "/images/og-image.png", width: 1200, height: 630, alt: "クラウドネイチャーのサービス" }],
  },
  twitter: {
    card: "summary_large_image",
    title: PAGE_META.services.title,
    description: PAGE_META.services.description,
  },
  alternates: { canonical: "https://cloudnature.jp/services" },
};

export default function ServicesPage() {
  const breadcrumb = breadcrumbJsonLd([{ name: "サービス", path: "/services" }]);

  const serviceSchema = SERVICE_DETAILS.map((s) => ({
    "@context": "https://schema.org",
    "@type": "Service",
    name: s.title,
    description: s.description,
    provider: { "@id": "https://cloudnature.jp/#organization" },
  }));

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: SERVICES_FAQ.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: { "@type": "Answer", text: faq.answer },
    })),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify([breadcrumb, ...serviceSchema, faqSchema]) }}
      />
      <PageHero
        eyebrow={SERVICES_HERO.eyebrow}
        title={SERVICES_HERO.title}
        description={SERVICES_HERO.description}
      />

      <section className="py-16 md:py-24 bg-linen">
        <div className="container mx-auto px-6 space-y-16 md:space-y-20">
          {SERVICE_DETAILS.map((service, index) => (
            <ScrollReveal key={service.id} variant="fade-up" delay={index * 0.1}>
              <ServiceDetailCard service={service} index={index} />
            </ScrollReveal>
          ))}
        </div>
      </section>

      {/* Mid-page CTA after services */}
      <section className="py-8 bg-white">
        <div className="container mx-auto px-6 max-w-2xl">
          <InlineCta
            title={SERVICES_MID_CTA.title}
            primaryLabel={SERVICES_MID_CTA.primaryCta.label}
            secondaryLabel={SERVICES_MID_CTA.secondaryCta.label}
          />
        </div>
      </section>

      <ImplementationFlow />
      <PricingApproach />
      <ServicesFaq />

      <CtaBanner
        title={SERVICES_BOTTOM_CTA.title}
        description={SERVICES_BOTTOM_CTA.description}
        primaryCta={SERVICES_BOTTOM_CTA.primaryCta}
        secondaryCta={SERVICES_BOTTOM_CTA.secondaryCta}
      />
    </>
  );
}
