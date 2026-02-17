import dynamic from "next/dynamic";
import HeroSection from "@/components/landing/HeroSection";

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
