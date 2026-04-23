import type { Metadata } from "next";
import { PAGE_META } from "@/content/common";
import { HERO_COPY, NEWS_ITEMS } from "@/content/home";
import { getNewsList } from "@/lib/microcms";
import { toNewsItem } from "@/types/microcms";
import type { NewsItem } from "@/types";
import HeroSection from "@/components/home/HeroSection";
import NewsSection from "@/components/home/NewsSection";
import ServicesSection from "@/components/home/ServicesSection";
import WaveSeparator from "@/components/shared/WaveSeparator";
import CasesSection from "@/components/home/CasesSection";
import CasesCarouselSection from "@/components/home/CasesCarouselSection";
import CtaSection from "@/components/home/CtaSection";

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
    <div className="w-full bg-white">
      <HeroSection />
      <NewsSection items={newsItems} />
      <ServicesSection />
      <WaveSeparator position="bottom" color="#F6FAFA" bgColor="#0e483e" withTexture={false} />
      <CasesSection />
      <WaveSeparator position="top" color="#ffffff" bgColor="#0e483e" withTexture={false} />
      <CasesCarouselSection />
      <CtaSection />
    </div>
  );
};

export default Home;
