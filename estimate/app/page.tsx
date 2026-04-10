import dynamic from "next/dynamic";
import Script from "next/script";
import HeroSection from "@/components/landing/HeroSection";
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
    address: {
      "@type": "PostalAddress",
      postalCode: "951-8068",
      addressLocality: "新潟市中央区",
      streetAddress: "上大川前通七番町1230番地7 ストークビル鏡橋 7F",
      addressRegion: "新潟県",
      addressCountry: "JP",
    },
  };
  const webApplication = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: "CloudNature AI見積もりシミュレーター",
    url: "https://ai.cloudnature.jp",
    description:
      "AIエージェントがシステム開発の概算見積もりを自動生成。質問に答えるだけで、WBS・機能一覧・費用比較を最短1分でお届け。",
    applicationCategory: "BusinessApplication",
    operatingSystem: "Web",
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "JPY",
      description: "無料でご利用いただけます",
    },
    creator: {
      "@id": organizationId,
    },
  };
  const howTo = {
    "@context": "https://schema.org",
    "@type": "HowTo",
    name: "CloudNatureでシステム開発の概算見積もりを進める方法",
    description:
      "AI見積もりから詳細ヒアリング、開発、納品までの流れを4ステップで案内します。",
    totalTime: "PT1M",
    step: LP_COPY.flow.steps.map((step, index) => ({
      "@type": "HowToStep",
      position: index + 1,
      name: step.title,
      text: step.description,
      url: `https://ai.cloudnature.jp/#flow`,
    })),
  };

  return (
    <main className="relative">
      <Script
        id="json-ld-organization"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(organization),
        }}
      />
      <Script
        id="json-ld"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(webApplication),
        }}
      />
      <Script
        id="json-ld-howto"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(howTo),
        }}
      />
      <Script
        id="json-ld-faq"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
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
          }),
        }}
      />
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
