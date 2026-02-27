import type { Metadata } from "next";
import { PAGE_META } from "@/content/common";
import { PHILOSOPHY_HERO, PHILOSOPHY_CTA, PHILOSOPHY_MID_CTA } from "@/content/philosophy";
import PageHero from "@/components/shared/PageHero";
import FoundingStory from "@/components/philosophy/FoundingStory";
import MissionDeepDive from "@/components/philosophy/MissionDeepDive";
import ValuesExpanded from "@/components/philosophy/ValuesExpanded";
import DevApproach from "@/components/philosophy/DevApproach";
import CtaBanner from "@/components/shared/CtaBanner";
import InlineCta from "@/components/shared/InlineCta";
import { ScrollReveal } from "@/components/shared/ScrollReveal";
import { breadcrumbJsonLd } from "@/lib/structured-data";

export const metadata: Metadata = {
  title: PAGE_META.philosophy.title,
  description: PAGE_META.philosophy.description,
  openGraph: {
    title: PAGE_META.philosophy.title,
    description: PAGE_META.philosophy.description,
    type: "website",
    locale: "ja_JP",
    url: "https://cloudnature.jp/philosophy",
    images: [{ url: "/images/og-image.png", width: 1200, height: 630, alt: "クラウドネイチャーの想い" }],
  },
  twitter: {
    card: "summary_large_image",
    title: PAGE_META.philosophy.title,
    description: PAGE_META.philosophy.description,
  },
  alternates: { canonical: "https://cloudnature.jp/philosophy" },
};

export default function PhilosophyPage() {
  const breadcrumb = breadcrumbJsonLd([{ name: "想い", path: "/philosophy" }]);

  return (
    <div className="w-full bg-cream">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumb) }}
      />
      <PageHero
        eyebrow={PHILOSOPHY_HERO.eyebrow}
        title={PHILOSOPHY_HERO.title}
        description={PHILOSOPHY_HERO.description}
      />
      <ScrollReveal>
        <FoundingStory />
      </ScrollReveal>

      {/* Mid-page CTA after founding story */}
      <section className="pb-8 bg-white">
        <div className="container mx-auto px-6 max-w-2xl">
          <InlineCta
            title={PHILOSOPHY_MID_CTA.text}
            primaryLabel={PHILOSOPHY_MID_CTA.primaryLabel}
            secondaryLabel={PHILOSOPHY_MID_CTA.secondaryLabel}
          />
        </div>
      </section>

      <ScrollReveal>
        <MissionDeepDive />
      </ScrollReveal>
      <ScrollReveal>
        <ValuesExpanded />
      </ScrollReveal>
      <DevApproach />
      <CtaBanner
        eyebrow={PHILOSOPHY_CTA.eyebrow}
        title={PHILOSOPHY_CTA.title}
        description={PHILOSOPHY_CTA.description}
        primaryCta={PHILOSOPHY_CTA.primaryCta}
        secondaryCta={PHILOSOPHY_CTA.secondaryCta}
      />
    </div>
  );
}
