import type { Metadata } from "next";
import { PAGE_META } from "@/content/common";
import {
  SERVICE_DETAILS,
  SYSTEM_DEV_FAQ,
  SYSTEM_DEV_HERO,
  SYSTEM_DEV_SCOPE,
  SYSTEM_DEV_ENTRY_POINTS,
  SERVICES_BOTTOM_CTA,
  SERVICE_PAGE_MAP,
} from "@/content/services";
import PageHero from "@/components/shared/PageHero";
import ServiceDetailCard from "@/components/services/ServiceDetailCard";
import ServiceCardGrid from "@/components/services/ServiceCardGrid";
import ImplementationFlow from "@/components/services/ImplementationFlow";
import ServicesFaq from "@/components/services/ServicesFaq";
import CtaBanner from "@/components/shared/CtaBanner";
import { ScrollReveal } from "@/components/shared/ScrollReveal";
import { breadcrumbJsonLd, faqPageJsonLd, serviceJsonLd } from "@/lib/structured-data";
import RelatedLinks from "@/components/shared/RelatedLinks";
import { getRelatedLinksForService } from "@/lib/related-content";

const service = SERVICE_DETAILS.find((s) => s.id === "dev")!;
const relatedLinks = getRelatedLinksForService("dev");

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

  // description はヒーローのものに差し替える。SERVICE_DETAILS の description は
  // このページのどこにも描画されず（ServiceDetailCard が使うのは subtitle/heading/pillars/techStack）、
  // そのまま出すと構造化データが可視コンテンツを表していない状態になるため
  const serviceSchema = serviceJsonLd({
    ...service,
    description: SYSTEM_DEV_HERO.description,
    path: SERVICE_PAGE_MAP[service.id].path,
  });

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify([breadcrumb, serviceSchema, faqPageJsonLd(SYSTEM_DEV_FAQ)]) }}
      />
      <PageHero
        eyebrow={SYSTEM_DEV_HERO.eyebrow}
        title={SYSTEM_DEV_HERO.title}
        description={SYSTEM_DEV_HERO.description}
        cta={SYSTEM_DEV_HERO.cta}
      />

      <section id="service-detail" className="py-16 md:py-24 bg-linen">
        <div className="container mx-auto px-6">
          <ScrollReveal variant="fade-up">
            <ServiceDetailCard service={service} />
          </ScrollReveal>
        </div>
      </section>

      <ServiceCardGrid
        id="scope"
        eyebrow="SCOPE"
        title="対応する開発領域"
        items={SYSTEM_DEV_SCOPE}
      />

      <ImplementationFlow />

      <ServiceCardGrid
        id="entry"
        eyebrow="START"
        title="ご相談の入口"
        items={SYSTEM_DEV_ENTRY_POINTS}
      />

      <ServicesFaq items={SYSTEM_DEV_FAQ} />

      <RelatedLinks eyebrow="RELATED" title="関連する事例・コンテンツ" items={relatedLinks} />

      <CtaBanner
        title={SERVICES_BOTTOM_CTA.title}
        description={SERVICES_BOTTOM_CTA.description}
        primaryCta={SERVICES_BOTTOM_CTA.primaryCta}
        secondaryCta={SERVICES_BOTTOM_CTA.secondaryCta}
      />
    </>
  );
}
