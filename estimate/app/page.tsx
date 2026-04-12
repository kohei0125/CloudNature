import dynamic from "next/dynamic";
import HeroSection from "@/components/landing/HeroSection";
import JsonLd from "@/components/shared/JsonLd";
import { SITE_URL, POSTAL_ADDRESS } from "@/lib/metadata";
import { LP_COPY } from "@/content/estimate";

const BenefitsSection = dynamic(
  () => import("@/components/landing/BenefitsSection")
);
const FlowSection = dynamic(
  () => import("@/components/landing/FlowSection")
);
const EstimateDetailsSection = dynamic(
  () => import("@/components/landing/EstimateDetailsSection")
);
const FaqSection = dynamic(
  () => import("@/components/landing/FaqSection")
);
const TrustBar = dynamic(
  () => import("@/components/landing/TrustBar")
);
const FooterSection = dynamic(
  () => import("@/components/landing/FooterSection")
);

export default function EstimatePage() {
  const organizationId = "https://cloudnature.jp/#organization";
  const organization = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": organizationId,
    name: "株式会社クラウドネイチャー",
    alternateName: "CloudNature Co., Ltd.",
    url: "https://cloudnature.jp",
    logo: "https://cloudnature.jp/images/logo.png",
    description:
      "新潟の中小企業向けにAI導入支援、AIエージェント開発、システム開発を提供する伴走型パートナー。",
    address: POSTAL_ADDRESS,
    areaServed: {
      "@type": "State",
      name: "新潟県",
    },
    sameAs: ["https://niigata-ai-academy.com"],
  };
  const webApplication = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: "CloudNature AI見積もりシミュレーター",
    url: SITE_URL,
    description:
      "AIエージェントがシステム開発の要件をヒアリングし、概算見積もりと開発計画書を最短1分で自動生成する無料ツール。新潟県の中小企業のAI導入・業務自動化を支援。",
    applicationCategory: "BusinessApplication",
    operatingSystem: "Web",
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "JPY",
      description: "無料でご利用いただけます",
    },
    featureList: [
      "AIによる自動見積もり生成",
      "開発計画書の自動作成",
      "Webアプリ・AIエージェント・業務自動化に対応",
      "概算費用の即時算出",
    ],
    creator: {
      "@id": organizationId,
    },
  };
  const howTo = {
    "@context": "https://schema.org",
    "@type": "HowTo",
    name: "AI見積もりシミュレーターの使い方",
    description:
      "AIチャットに質問形式で答えるだけで、システム開発の概算見積もりを自動生成できます。",
    totalTime: "PT1M",
    step: LP_COPY.flow.steps.map((step, index) => ({
      "@type": "HowToStep",
      position: index + 1,
      name: step.title,
      text: step.description,
      url: `${SITE_URL}/#flow`,
    })),
  };
  const localBusiness = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    name: "CloudNature - AI導入支援・システム開発",
    url: SITE_URL,
    image: `${SITE_URL}/images/og-img.jpg`,
    address: POSTAL_ADDRESS,
    geo: {
      "@type": "GeoCoordinates",
      latitude: 37.9161,
      longitude: 139.0364,
    },
    areaServed: [
      { "@type": "State", name: "新潟県" },
      { "@type": "City", name: "新潟市" },
      { "@type": "City", name: "長岡市" },
      { "@type": "City", name: "上越市" },
      { "@type": "City", name: "三条市" },
      { "@type": "City", name: "燕市" },
    ],
    priceRange: "$$",
    knowsAbout: [
      "AI導入支援",
      "AIエージェント開発",
      "システム開発",
      "業務自動化",
      "Webアプリケーション開発",
      "n8n",
      "生成AI活用支援",
    ],
    hasOfferCatalog: {
      "@type": "OfferCatalog",
      name: "システム開発サービス",
      itemListElement: [
        {
          "@type": "Offer",
          itemOffered: {
            "@type": "Service",
            name: "AIエージェント開発",
            description:
              "業務課題に合わせたAIエージェントの企画・開発・導入支援",
          },
        },
        {
          "@type": "Offer",
          itemOffered: {
            "@type": "Service",
            name: "Webアプリケーション開発",
            description:
              "業務効率化のためのWebアプリ・社内ツールの設計・開発",
          },
        },
        {
          "@type": "Offer",
          itemOffered: {
            "@type": "Service",
            name: "業務自動化",
            description: "n8n・AI活用による業務プロセスの自動化設計・構築",
          },
        },
        {
          "@type": "Offer",
          itemOffered: {
            "@type": "Service",
            name: "AI導入コンサルティング",
            description:
              "経営課題のヒアリングからAI活用方針の策定、実装支援まで",
          },
        },
      ],
    },
  };
  const faqPage = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: LP_COPY.faq.items.map((item) => ({
      "@type": "Question",
      name: item.q,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.a,
      },
    })),
  };

  return (
    <main className="relative">
      <JsonLd data={organization} />
      <JsonLd data={webApplication} />
      <JsonLd data={howTo} />
      <JsonLd data={faqPage} />
      <JsonLd data={localBusiness} />
      <div
        className="fixed inset-0 z-[9999] pointer-events-none mix-blend-multiply"
        style={{
          backgroundImage: `
            repeating-linear-gradient(-45deg, rgba(0, 0, 0, 0.03) 0px, rgba(0, 0, 0, 0.03) 1px, transparent 1px, transparent 293px),
            repeating-linear-gradient(-45deg, rgba(0, 0, 0, 0.02) 0px, rgba(0, 0, 0, 0.02) 1px, transparent 1px, transparent 97px),
            repeating-linear-gradient(-45deg, rgba(0, 0, 0, 0.01) 0px, rgba(0, 0, 0, 0.01) 1px, transparent 1px, transparent 41px)
          `,
          backgroundSize: "auto",
        }}
      />
      <HeroSection />
      <BenefitsSection />
      <FlowSection />
      <EstimateDetailsSection />
      <FaqSection />
      <TrustBar />
      <FooterSection />
    </main>
  );
}
