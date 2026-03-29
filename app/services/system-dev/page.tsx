import type { Metadata } from "next";
import { PAGE_META } from "@/content/common";
import { SERVICE_DETAILS, SYSTEM_DEV_FAQ, SERVICES_BOTTOM_CTA } from "@/content/services";
import PageHero from "@/components/shared/PageHero";
import ServiceDetailCard from "@/components/services/ServiceDetailCard";
import ServicesFaq from "@/components/services/ServicesFaq";
import CtaBanner from "@/components/shared/CtaBanner";
import { ScrollReveal } from "@/components/shared/ScrollReveal";
import { breadcrumbJsonLd, faqPageJsonLd, serviceJsonLd } from "@/lib/structured-data";

const service = SERVICE_DETAILS.find((s) => s.id === "dev")!;

export const metadata: Metadata = {
  title: PAGE_META.servicesSystemDev.title,
  description: PAGE_META.servicesSystemDev.description,
  openGraph: {
    title: PAGE_META.servicesSystemDev.title,
    description: PAGE_META.servicesSystemDev.description,
    type: "website",
    locale: "ja_JP",
    url: "https://cloudnature.jp/services/system-dev",
    images: [{ url: "/images/og-img.jpg", width: 1200, height: 630, alt: service.title }],
  },
  twitter: {
    card: "summary_large_image",
    title: PAGE_META.servicesSystemDev.title,
    description: PAGE_META.servicesSystemDev.description,
  },
  alternates: { canonical: "https://cloudnature.jp/services/system-dev" },
};

export default function SystemDevPage() {
  const breadcrumb = breadcrumbJsonLd([
    { name: "サービス", path: "/services" },
    { name: service.title, path: "/services/system-dev" },
  ]);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify([breadcrumb, serviceJsonLd(service), faqPageJsonLd(SYSTEM_DEV_FAQ)]) }}
      />
      <PageHero
        eyebrow="SYSTEM DEVELOPMENT"
        title={service.title}
        description={service.description}
      />

      <section className="py-16 md:py-24 bg-linen">
        <div className="container mx-auto px-6">
          <ScrollReveal variant="fade-up">
            <ServiceDetailCard service={service} index={0} />
          </ScrollReveal>
        </div>
      </section>

      <ServicesFaq items={SYSTEM_DEV_FAQ} />

      <CtaBanner
        title={SERVICES_BOTTOM_CTA.title}
        description={SERVICES_BOTTOM_CTA.description}
        primaryCta={SERVICES_BOTTOM_CTA.primaryCta}
        secondaryCta={SERVICES_BOTTOM_CTA.secondaryCta}
      />
    </>
  );
}
