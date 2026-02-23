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
    images: [{ url: "/images/niigata_city.jpg", width: 1200, height: 800, alt: HERO_COPY.heroImageAlt }]
  },
  twitter: {
    card: "summary_large_image",
    title: PAGE_META.home.title,
    description: PAGE_META.home.description,
    images: ["/images/niigata_city.jpg"]
  },
  alternates: { canonical: "https://cloudnature.jp/" }
};

const FALLBACK_NEWS = NEWS_ITEMS;

const Home = async () => {
  let newsItems: NewsItem[];
  let isFallback = false;
  try {
    const res = await getNewsList({ limit: 6 });
    if (res.contents.length > 0) {
      newsItems = res.contents.map(toNewsItem);
    } else {
      newsItems = FALLBACK_NEWS;
      isFallback = true;
    }
  } catch {
    newsItems = FALLBACK_NEWS;
    isFallback = true;
  }

  return (
    <div className="w-full bg-cream">
      <HeroSection />
      <MissionSection />
      <WaveSeparator position="top" color="#F8F9FA" bgColor="#ffffff" />
      <ServicesSection />
      <CasesSection />
      <WaveSeparator position="top" color="#ffffff" bgColor="#19231b" />
      <NewsSection items={newsItems} disableLink={isFallback} />
      <WaveSeparator position="top" color="#EDE8E5" bgColor="#ffffff" />
      <CtaSection />
    </div>
  );
};

export default Home;
