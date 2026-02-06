import { ArrowRight, CheckCircle2, Download, Zap, Database, PlayCircle } from "lucide-react";
import {
  HERO_COPY,
  HERO_BENTO,
  MISSION_COPY,
  VALUES,
  SERVICES_SECTION,
  SERVICES,
  CASES_SECTION,
  CASE_STUDIES,
  CTA_BANNER,
  PAGE_META
} from "@/content/strings";
import Image from "next/image";
import type { Metadata } from "next";
import MobileCarousel from "@/components/MobileCarousel";
import HeroCardMain from "@/components/hero/HeroCardMain";
import HeroCardAi from "@/components/hero/HeroCardAi";
import HeroCardMetrics from "@/components/hero/HeroCardMetrics";

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
import WaveSeparator from "@/components/WaveSeparator";

const Home = () => {

  return (
    <div className="w-full bg-[#F0EEE9]">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center pt-16 pb-16 md:pt-32 md:pb-24 overflow-hidden">
        {/* Dynamic Organic Background (Living Breath) */}
        <div className="absolute inset-0 w-full h-full overflow-hidden z-0 bg-[url('/images/hero-mobile-blob.svg'),linear-gradient(180deg,_#F0EEE9_0%,_#f5f2ec_50%,_#eef1ea_100%)] bg-cover bg-center md:bg-none">
          {/* Aurora Blobs (desktop onlyで動きを維持) */}
          <div className="hidden md:block absolute top-[-10%] left-[-10%] w-[700px] h-[700px] bg-[#C8E8FF] rounded-full mix-blend-multiply filter blur-[120px] opacity-40 animate-blob"></div>
          <div className="hidden md:block absolute top-[-10%] right-[-10%] w-[600px] h-[600px] bg-[#8A9668] rounded-full mix-blend-multiply filter blur-[120px] opacity-30 animate-blob animation-delay-2000"></div>
          <div className="hidden md:block absolute bottom-[-20%] left-[20%] w-[600px] h-[600px] bg-[#DD9348] rounded-full mix-blend-multiply filter blur-[120px] opacity-30 animate-blob animation-delay-4000"></div>

          {/* Bottom Fade to Solid Color (Seamless Transition to Wave) */}
          <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-[#F0EEE9] to-transparent z-10"></div>

          {/* Noise Texture Overlay for entire section */}
          <div className="absolute inset-0 texture-grain opacity-20 md:opacity-40 mix-blend-overlay"></div>
        </div>

        <div className="container mx-auto px-6 relative z-10 flex flex-col lg:grid lg:grid-cols-12 gap-10 lg:gap-16 lg:items-center">
          {/* LEFT COLUMN: Text Content */}
          <div className="lg:col-span-5 space-y-6 md:space-y-10 animate-in slide-in-from-bottom-10 duration-700">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/40 backdrop-blur-md rounded-full text-xs font-bold tracking-wider text-[#19231B] border border-white/50 shadow-sm hover:shadow-md transition-shadow cursor-default">
              <span className="w-2 h-2 bg-[#DD9348] rounded-full animate-pulse"></span>
              {HERO_COPY.badge}
            </div>

            <h1 className="text-[clamp(2.5rem,5vw,4.5rem)] font-serif font-bold leading-[1.1] text-[#19231B] tracking-tight">
              {HERO_COPY.headingLine1}
              <br />
              <span className="relative inline-block text-[#19231B] hover:tracking-wide transition-all duration-500">
                {HERO_COPY.headingLine2}
                {/* Organic underline */}
                <svg className="absolute -bottom-2 md:-bottom-3 left-0 w-full h-3 md:h-4 text-[#8A9668] opacity-60" viewBox="0 0 100 10" preserveAspectRatio="none">
                  <path d="M0 5 Q 50 12 100 5" stroke="currentColor" strokeWidth="3" fill="none" strokeLinecap="round" />
                </svg>
              </span>
            </h1>

            <p className="text-sm lg:text-lg text-gray-700 leading-loose max-w-lg font-medium">
              {HERO_COPY.description}
            </p>

            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <button className="w-full sm:w-auto btn-puffy px-8 py-3 md:py-4 rounded-full font-bold flex items-center justify-center gap-3 group">
                {HERO_COPY.primaryCta}
                <div className="bg-white/20 p-1 rounded-full group-hover:translate-x-1 transition-transform">
                  <ArrowRight className="w-4 h-4" />
                </div>
              </button>

              <button className="w-full sm:w-auto px-8 py-3 md:py-4 bg-white/40 backdrop-blur-sm text-[#19231B] border border-white/60 rounded-full font-bold hover:bg-white/80 transition-colors shadow-sm flex items-center justify-center gap-2 group">
                <PlayCircle className="w-5 h-5 text-[#8A9668] group-hover:scale-110 transition-transform" />
                <span>{HERO_COPY.secondaryCta}</span>
              </button>
            </div>
          </div>

          {/* RIGHT COLUMN: Bento Grid Visuals */}
          <div className="lg:col-span-7 h-auto lg:h-[650px] relative animate-in fade-in duration-1000 delay-300">
            {/* Mobile Carousel (Visible only on mobile) */}
            <div className="md:hidden block w-[calc(100%+3rem)] -ml-6 relative z-30">
              <MobileCarousel>
                <HeroCardMain />
                <HeroCardAi />
                <HeroCardMetrics />
              </MobileCarousel>
            </div>

            {/* Desktop Grid (Hidden on mobile) */}
            <div className="hidden md:grid grid-cols-2 lg:grid-cols-6 lg:grid-rows-6 gap-4 md:gap-5 h-full min-h-0 lg:min-h-[500px]">
              {/* 1. Main Visual: Human & Tech Symbiosis (Largest) */}
              <div className="col-span-2 lg:col-span-4 lg:row-span-6">
                <HeroCardMain />
              </div>

              {/* 2. AI Agent Visualization (Top Right - Floating/Bleeding) */}
              <div className="col-span-1 lg:col-span-2 lg:row-span-3">
                <HeroCardAi />
              </div>

              {/* 3. Productivity Metrics (Bottom Right - Dark Accent) */}
              <div className="col-span-1 lg:col-span-2 lg:row-span-3">
                <HeroCardMetrics />
              </div>
            </div>
          </div>
        </div>

      </section>

      <WaveSeparator
        position="bottom"
        color="#F0EEE9"
        bgColor="#ffffff"
      />

      {/* Mission / Values Section */}
      <section className="py-16 md:py-24 bg-white relative texture-grain overflow-hidden">
        <div className="container mx-auto px-6">
          <div className="grid md:grid-cols-2 gap-12 lg:gap-20 items-center">
            {/* Left Column: Text */}
            <div className="text-center md:text-left z-10 relative">
              <p className="text-sm font-bold tracking-widest text-[#8A9668] mb-4">{MISSION_COPY.eyebrow}</p>
              <h2 className="text-[clamp(1.75rem,4vw,2.5rem)] font-serif font-bold text-[#19231B] mb-8 text-balance md:text-wrap">
                {MISSION_COPY.title}
              </h2>
              <p className="text-sm leading-loose text-gray-600 md:text-base mb-8 md:mb-0">
                {MISSION_COPY.paragraphs[0]}
                <br className="hidden md:block" />
                {MISSION_COPY.paragraphs[1]}
                <br className="hidden md:block" />
                {MISSION_COPY.paragraphs[2]}
              </p>
            </div>

            {/* Right Column: Glassmorphism Cards */}
            <div className="relative">
              {/* Abstract Background Blob for Glass Effect */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-gradient-to-tr from-[#C8E8FF]/30 via-[#8A9668]/20 to-[#DD9348]/20 rounded-full blur-3xl opacity-60"></div>

              <div className="relative space-y-4 md:space-y-6">
                {VALUES.map((value, index) => {
                  const colors = ["#8A9668", "#DD9348", "#79C0BC"];
                  const icons = ["/images/logo_green.png", "/images/logo_orange.png", "/images/logo_blue.png"];
                  const color = colors[index];
                  const iconSrc = icons[index];

                  return (
                    <div
                      key={index}
                      className="group flex items-start gap-5 p-5 md:p-6 bg-white/40 backdrop-blur-md border border-white/60 rounded-2xl shadow-sm hover:shadow-lg hover:bg-white/60 transition-all duration-300 relative overflow-hidden"
                    >
                      {/* Number */}
                      <div
                        className="text-4xl md:text-5xl font-bold absolute -right-2 -top-4 font-serif pointer-events-none select-none group-hover:scale-110 transition-transform opacity-20"
                        style={{ color: color }}
                      >
                        0{index + 1}
                      </div>

                      <div className="flex-shrink-0 w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-sm transition-colors relative z-10">
                        <Image
                          src={iconSrc}
                          alt=""
                          width={28}
                          height={28}
                          className="object-contain"
                        />
                      </div>

                      <div className="relative z-10">
                        <h4 className="text-lg font-bold text-[#19231B] mb-1">{value.title.split(": ")[1]}</h4>
                        <p className="text-xs font-bold mb-2 tracking-wider" style={{ color: color }}>{value.subtitle}</p>
                        <p className="text-xs md:text-sm text-gray-600 leading-relaxed">
                          {value.description}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* SEO Content (Screen Reader Only) - Values List */}
          <div className="sr-only">
            <ul>
              {VALUES.map((value, index) => (
                <li key={index}>
                  <h3>{value.title}</h3>
                  <p>{value.description}</p>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <WaveSeparator position="top" color="#F8F9FA" bgColor="#ffffff" />

      {/* Services Section */}
      <section className="py-16 md:py-24 bg-[#F8F9FA] texture-grain overflow-hidden">
        <div className="container mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6">
            <div>
              <p className="text-sm font-bold tracking-widest text-[#8A9668] mb-3">{SERVICES_SECTION.eyebrow}</p>
              <h2 className="text-[clamp(1.75rem,5vw,2.5rem)] font-serif font-bold text-[#19231B]">{SERVICES_SECTION.title}</h2>
            </div>
            <button className="text-[#DD9348] font-bold flex items-center gap-2 hover:gap-3 transition-all">
              {SERVICES_SECTION.cta} <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {SERVICES.map((service) => (
              <div
                key={service.id}
                className="bg-white rounded-[32px] overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-300 flex flex-col h-full border border-gray-100 group"
              >
                <div className="p-6 md:p-8 flex-1">
                  <div className="w-14 h-14 bg-[#EDE8E5] rounded-full flex items-center justify-center mb-6 text-[#19231B] group-hover:bg-[#19231B] group-hover:text-white transition-colors duration-300">
                    <service.icon className="w-7 h-7" />
                  </div>
                  <h4 className="text-2xl font-bold text-[#19231B] mb-4">{service.title}</h4>
                  <p className="text-gray-600 mb-6 text-sm leading-relaxed">{service.description}</p>
                  <ul className="space-y-3">
                    {service.features.map((feature, idx) => (
                      <li key={idx} className="flex items-center gap-2 text-sm text-[#19231B] font-medium">
                        <CheckCircle2 className="w-4 h-4 text-[#8A9668]" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>
                {/* Refined Tech Tags: Better Visibility */}
                <div className="px-8 py-6 bg-[#19231B] text-white/80 text-xs border-t border-white/10 group-hover:bg-[#DD9348] transition-colors duration-300">
                  <div className="flex flex-wrap gap-2">
                    {service.techStack.map((tech) => (
                      <span key={tech} className="px-2 py-1 bg-white/15 border border-white/20 rounded-md backdrop-blur-sm">
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>


      {/* Case Studies Section */}
      <section className="py-16 md:py-24 bg-[#19231B] text-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_20%_20%,#8A9668,transparent_25%),radial-gradient(circle_at_80%_30%,#C8E8FF,transparent_20%),radial-gradient(circle_at_50%_80%,#DD9348,transparent_25%)]"></div>
        <div className="container mx-auto px-6 relative z-10">
          <div className="text-center mb-16">
            <p className="text-sm font-bold tracking-widest text-[#8A9668] mb-3 uppercase">{CASES_SECTION.eyebrow}</p>
            <h2 className="text-[clamp(1.75rem,5vw,2.5rem)] font-serif font-bold text-white">{CASES_SECTION.title}</h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {CASE_STUDIES.map((study) => (
              <div key={study.id} className="group">
                {/* Image Area */}
                <div className="relative h-48 md:h-60 rounded-[20px] overflow-hidden mb-6">
                  <Image
                    src={study.image}
                    alt={study.title}
                    fill
                    sizes="(min-width: 1024px) 33vw, 100vw"
                    className="object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  {/* Badge on Image */}
                  <div className="absolute top-4 left-4">
                    <span className="px-3 py-1 bg-[#DD9348] text-white text-[10px] font-bold rounded-full shadow-md">
                      {study.category}
                    </span>
                  </div>
                </div>

                {/* Content Area */}
                <div className="space-y-4">
                  <h4 className="text-lg font-bold text-white leading-tight">{study.title}</h4>

                  <div className="space-y-3">
                    {/* Before Block */}
                    <div className="pl-3 border-l-2 border-white/20">
                      <p className="text-[10px] text-gray-500 font-bold uppercase mb-1 tracking-wider">BEFORE</p>
                      <p className="text-xs text-gray-400 leading-relaxed">
                        {study.before}
                      </p>
                    </div>

                    {/* After Block */}
                    <div className="pl-3 border-l-2 border-[#DD9348]">
                      <p className="text-[10px] text-[#DD9348] font-bold uppercase mb-1 tracking-wider">AFTER</p>
                      <p className="text-xs text-white font-bold leading-relaxed">
                        {study.after}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-12 text-center">
            <button className="text-[#DD9348] font-bold inline-flex items-center gap-2 hover:gap-3 transition-all">
              {CASES_SECTION.cta} <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </section>

      <WaveSeparator position="top" color="#EDE8E5" bgColor="#19231B" />

      {/* CTA Section */}
      <section className="py-16 md:py-24 bg-[#EDE8E5] relative">
        <div className="container mx-auto px-6 relative z-10">
          <div className="bg-white rounded-[32px] overflow-hidden shadow-xl grid md:grid-cols-2">

            {/* Left Column: Content */}
            <div className="p-8 md:p-16 space-y-8 flex flex-col justify-center">
              <div>
                <h2 className="text-[clamp(1.75rem,5vw,2.5rem)] font-serif font-bold text-[#19231B] leading-tight mb-4">
                  {CTA_BANNER.titleLines[0]}
                  <br />
                  {CTA_BANNER.titleLines[1]}
                </h2>

                {/* Mobile Image Placeholder (Visible only on mobile) */}
                <div className="block md:hidden mb-6">
                  <div className="bg-gray-50 p-8 flex items-center justify-center border border-gray-100 rounded-2xl relative overflow-hidden">
                    {/* Decorative background blur */}
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 bg-blue-100 rounded-full blur-3xl opacity-50 pointer-events-none"></div>
                    {/* Placeholder Box */}
                    <div className="w-full h-48 border-2 border-dashed border-gray-300 rounded-xl flex flex-col items-center justify-center text-gray-400 relative z-10 bg-white/50 backdrop-blur-sm">
                      <p className="font-bold tracking-widest text-[10px] uppercase">Book Cover Image</p>
                    </div>
                  </div>
                </div>

                <p className="text-gray-600 leading-relaxed">
                  {CTA_BANNER.description}
                </p>
              </div>

              {/* Resource Box */}
              <div className="hidden md:flex bg-gray-50 rounded-xl p-5 border border-gray-100 items-start gap-4">
                <div className="p-3 bg-white rounded-lg border border-gray-100 shadow-sm text-[#8A9668]">
                  <Database className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="font-bold text-[#19231B] text-sm mb-1">{CTA_BANNER.downloadTitle}</h4>
                  <p className="text-xs text-gray-500 font-medium">{CTA_BANNER.downloadMeta}</p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 pt-2">
                <button className="btn-puffy btn-puffy-accent px-8 py-4 rounded-full font-bold flex items-center justify-center gap-3 shadow-lg shadow-[#DD9348]/20 hover:shadow-[#DD9348]/40 transition-all">
                  <Download className="w-5 h-5" />
                  {CTA_BANNER.primaryCta}
                </button>
                <button className="px-8 py-4 bg-[#19231B] text-white rounded-full font-bold hover:bg-[#261D14] transition-colors shadow-lg flex items-center justify-center gap-2">
                  <Zap className="w-4 h-4 text-[#DD9348]" />
                  {CTA_BANNER.secondaryCta}
                </button>
              </div>
            </div>

            {/* Right Column: Image Placeholder */}
            <div className="hidden md:flex bg-gray-50 p-10 md:p-16 items-center justify-center border-t md:border-t-0 md:border-l border-gray-100 relative overflow-hidden">
              {/* Decorative background blur */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-blue-100 rounded-full blur-3xl opacity-50 pointer-events-none"></div>

              {/* Placeholder Box */}
              <div className="w-full h-full min-h-[300px] border-2 border-dashed border-gray-300 rounded-2xl flex flex-col items-center justify-center text-gray-400 relative z-10 bg-white/50 backdrop-blur-sm">
                <p className="font-bold tracking-widest text-xs uppercase">Book Cover Image</p>
              </div>
            </div>

          </div>
        </div>
      </section>
    </div >
  );
};

export default Home;
