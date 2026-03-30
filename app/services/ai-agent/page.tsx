import type { Metadata } from "next";
import { PAGE_META } from "@/content/common";
import { SERVICE_DETAILS, AI_AGENT_FAQ, SERVICES_BOTTOM_CTA, SERVICE_PAGE_MAP } from "@/content/services";
import PageHero from "@/components/shared/PageHero";
import ServiceDetailCard from "@/components/services/ServiceDetailCard";
import ServicesFaq from "@/components/services/ServicesFaq";
import CtaBanner from "@/components/shared/CtaBanner";
import { ScrollReveal } from "@/components/shared/ScrollReveal";
import { breadcrumbJsonLd, faqPageJsonLd, serviceJsonLd } from "@/lib/structured-data";
import RelatedLinks from "@/components/shared/RelatedLinks";
import { getRelatedLinksForService } from "@/lib/related-content";

const service = SERVICE_DETAILS.find((s) => s.id === "ai")!;
const relatedLinks = getRelatedLinksForService("ai");

export const metadata: Metadata = {
  title: PAGE_META.servicesAiAgent.title,
  description: PAGE_META.servicesAiAgent.description,
  openGraph: {
    title: PAGE_META.servicesAiAgent.title,
    description: PAGE_META.servicesAiAgent.description,
    type: "website",
    locale: "ja_JP",
    url: "https://cloudnature.jp/services/ai-agent",
    images: [{ url: "/images/og-img.jpg", width: 1200, height: 630, alt: service.title }],
  },
  twitter: {
    card: "summary_large_image",
    title: PAGE_META.servicesAiAgent.title,
    description: PAGE_META.servicesAiAgent.description,
  },
  alternates: { canonical: "https://cloudnature.jp/services/ai-agent" },
};

export default function AiAgentPage() {
  const breadcrumb = breadcrumbJsonLd([
    { name: "サービス", path: "/services" },
    { name: service.title, path: "/services/ai-agent" },
  ]);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify([breadcrumb, serviceJsonLd({ ...service, path: SERVICE_PAGE_MAP[service.id].path }), faqPageJsonLd(AI_AGENT_FAQ)]) }}
      />
      <PageHero
        eyebrow="AI AGENT DEVELOPMENT"
        title={service.title}
        description={service.description}
      />

      <section id="service-detail" className="py-16 md:py-24 bg-linen">
        <div className="container mx-auto px-6">
          <ScrollReveal variant="fade-up">
            <ServiceDetailCard service={service} index={0} />
          </ScrollReveal>
        </div>
      </section>

      <ServicesFaq items={AI_AGENT_FAQ} />

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
