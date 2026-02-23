import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Mail } from "lucide-react";
import { HERO_COPY, HERO_BENTO } from "@/content/home";
import { ESTIMATE_URL } from "@/content/common";

const HeroSection = () => {
  return (
    <section className="relative min-h-screen v-stack justify-end overflow-hidden">
      {/* Full-bleed background image */}
      <Image
        src={HERO_COPY.imageSrc}
        alt={HERO_COPY.heroImageAlt}
        fill
        priority
        sizes="100vw"
        className="object-cover"
      />

      {/* Soft gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-forest/70 via-forest/30 to-transparent" />

      {/* Warm fade at bottom for transition to next section */}
      <div className="absolute bottom-0 left-0 w-full h-48 bg-gradient-to-t from-cream to-transparent" />

      {/* Decorative metric (desktop only) */}
      <div className="hidden lg:block absolute right-12 bottom-48 select-none pointer-events-none">
        <span className="text-[12rem] font-bold text-white/[0.07] leading-none tracking-tighter font-serif">
          {HERO_BENTO.metricCard.value}{HERO_BENTO.metricCard.unit}
        </span>
      </div>

      {/* Content */}
      <div className="relative z-10 container mx-auto px-6 pb-64 pt-48 md:pt-56">
        <div className="max-w-3xl">
          <p className="text-sm font-bold tracking-widest text-white/60 mb-6">
            {HERO_COPY.badge}
          </p>

          <h1 className="text-[clamp(2rem,6vw,4rem)] font-serif font-bold leading-[1.05] text-white tracking-tight mb-8">
            {HERO_COPY.headingLine1}
            <br />
            <span className="relative inline-block">
              {HERO_COPY.headingLine2}
              <svg
                className="absolute -bottom-2 md:-bottom-4 left-0 w-full h-3 md:h-5 text-sunset opacity-70"
                viewBox="0 0 100 10"
                preserveAspectRatio="none"
              >
                <path d="M0 5 Q 50 12 100 5" stroke="currentColor" strokeWidth="3" fill="none" strokeLinecap="round" />
              </svg>
            </span>
          </h1>

          <p className="text-base md:text-lg text-white/80 leading-relaxed max-w-xl mb-10">
            {HERO_COPY.description}
          </p>

          <div className="v-stack sm:h-stack gap-4">
            <a href={ESTIMATE_URL} target="_blank" rel="noopener noreferrer" className="w-full sm:w-auto btn-puffy-accent px-8 py-4 rounded-full font-bold center gap-3 text-white group bg-sunset shadow-lg shadow-sunset/30 hover:shadow-sunset/50 transition-all hover:-translate-y-0.5">
              {HERO_COPY.primaryCta}
              <div className="bg-white/20 p-1 rounded-full group-hover:translate-x-1 transition-transform">
                <ArrowRight className="w-4 h-4" />
              </div>
            </a>

            <Link href="/contact" className="w-full sm:w-auto px-8 py-4 bg-white/10 backdrop-blur-sm text-white border border-white/20 rounded-full font-bold hover:bg-white/20 transition-colors center gap-2 group">
              <Mail className="w-5 h-5 text-white/70 group-hover:scale-110 transition-transform" />
              <span>{HERO_COPY.secondaryCta}</span>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
