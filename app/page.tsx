import type { Metadata } from "next";
import { PAGE_META } from "@/content/common";
import { HERO_COPY, NEWS_ITEMS } from "@/content/home";
import { getNewsList } from "@/lib/microcms";
import { toNewsItem } from "@/types/microcms";
import type { NewsItem } from "@/types";
import WaveSeparator from "@/components/shared/WaveSeparator";
import HeroSection from "@/components/home/HeroSection";
import MissionSection from "@/components/home/MissionSection";
import ServicesSection from "@/components/home/ServicesSection";
import CasesSection from "@/components/home/CasesSection";
import CasesCarouselSection from "@/components/home/CasesCarouselSection";
import CtaSection from "@/components/home/CtaSection";
import NewsSection from "@/components/home/NewsSection";

export const metadata: Metadata = {
  title: PAGE_META.home.title,
  description: PAGE_META.home.description,
  openGraph: {
    title: PAGE_META.home.title,
    description: PAGE_META.home.description,
    type: "website",
    locale: "ja_JP",
    url: "https://cloudnature.jp/",
    images: [{ url: "/images/og-img.jpg", width: 1200, height: 630, alt: HERO_COPY.heroImageAlt }]
  },
  twitter: {
    card: "summary_large_image",
    title: PAGE_META.home.title,
    description: PAGE_META.home.description,
    images: ["/images/og-img.jpg"]
  },
  alternates: { canonical: "https://cloudnature.jp/" }
};

const FALLBACK_NEWS = NEWS_ITEMS;

const Home = async () => {
  let newsItems: NewsItem[];
  try {
    const res = await getNewsList({ limit: 6 });
    if (res.contents.length > 0) {
      newsItems = res.contents.map(toNewsItem);
    } else {
      newsItems = FALLBACK_NEWS;
    }
  } catch {
    newsItems = FALLBACK_NEWS;
  }

  return (
    <div className="w-full bg-cream">
      <HeroSection />
      <NewsSection items={newsItems} />
      <WaveSeparator position="top" color="#ffffff" bgColor="#f8f9fa" withTexture={false} />
      <MissionSection />
      <WaveSeparator position="top" color="#F8F9FA" bgColor="#ffffff" />
      <ServicesSection />
      <WaveSeparator position="bottom" color="#F8F9FA" bgColor="#19231b" withTexture={false} />
      <CasesSection />
      <WaveSeparator position="top" color="#f8f9fa" bgColor="#19231b" withTexture={false} />
      <CasesCarouselSection />
      <WaveSeparator position="bottom" color="#F8F9FA" bgColor="#f0f0f0" withTexture={false} />
      <CtaSection />
    </div>
  );
};

export default Home;
