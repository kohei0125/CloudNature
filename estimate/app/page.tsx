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
  return (
    <main className="relative">
      <Script
        id="json-ld"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
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
              "@type": "Organization",
              name: "CloudNature",
              url: "https://cloudnature.jp",
            },
          }),
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
      <FaqSection />
      <TrustBar />
      <FooterSection />
    </main>
  );
}
