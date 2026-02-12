import type { Metadata } from "next";
import { PAGE_META } from "@/content/common";
import { HERO_COPY } from "@/content/home";
import WaveSeparator from "@/components/shared/WaveSeparator";
import HeroSection from "@/components/home/HeroSection";
import MissionSection from "@/components/home/MissionSection";
import ServicesSection from "@/components/home/ServicesSection";
import CasesSection from "@/components/home/CasesSection";
import CtaSection from "@/components/home/CtaSection";

export const metadata: Metadata = {
  title: PAGE_META.home.title,
  description: PAGE_META.home.description,
  openGraph: {
    title: PAGE_META.home.title,
    description: PAGE_META.home.description,
    type: "website",
    locale: "ja_JP",
    url: "https://cloudnature.example.com/",
    images: [{ url: "/images/hero-office.svg", width: 1200, height: 800, alt: HERO_COPY.heroImageAlt }]
  },
  twitter: {
    card: "summary_large_image",
    title: PAGE_META.home.title,
    description: PAGE_META.home.description,
    images: ["/images/hero-office.svg"]
  }
};

const Home = () => (
  <div className="w-full bg-cream">
    <HeroSection />
    <WaveSeparator position="bottom" color="#F0EEE9" bgColor="#ffffff" />
    <MissionSection />
    <WaveSeparator position="top" color="#F8F9FA" bgColor="#ffffff" />
    <ServicesSection />
    <CasesSection />
    <WaveSeparator position="top" color="#EDE8E5" bgColor="#19231B" />
    <CtaSection />
  </div>
);

export default Home;
