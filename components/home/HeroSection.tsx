import { ArrowRight, PlayCircle } from "lucide-react";
import { HERO_COPY } from "@/content/home";
import MobileCarousel from "@/components/shared/MobileCarousel";
import HeroCardMain from "./hero/HeroCardMain";
import HeroCardAi from "./hero/HeroCardAi";
import HeroCardMetrics from "./hero/HeroCardMetrics";

const HeroSection = () => {
  return (
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

          <h1 className="text-[clamp(2rem,4.5vw,3rem)] font-serif font-bold leading-[1.1] text-[#19231B] tracking-tight">
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
  );
};

export default HeroSection;
