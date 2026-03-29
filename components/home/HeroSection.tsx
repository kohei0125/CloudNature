import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Mail } from "lucide-react";
import { HERO_COPY } from "@/content/home";
import { ESTIMATE_URL } from "@/content/common";

const HeroSection = () => {
  return (
    <section>
      {/* ヘッダー分のスペーサー */}
      <div className="pt-[52px] md:pt-16" />

      {/* 画像エリア */}
      <div
        style={{ animation: "hero-image-reveal 800ms ease-out both", animationDelay: "200ms" }}
      >
        <div className="relative overflow-hidden min-h-[calc(85svh-52px)] md:min-h-0 md:aspect-[24/9]">
          <Image
            src={HERO_COPY.imageSrc}
            alt={HERO_COPY.heroImageAlt}
            fill
            priority
            sizes="100vw"
            className="object-cover"
          />

          {/* テキストオーバーレイ */}
          <div
            className="absolute inset-0 flex flex-col justify-center px-5 md:px-12 lg:px-16"
            style={{ textShadow: "0 1px 3px rgba(0,0,0,0.4), 0 4px 12px rgba(0,0,0,0.2)" }}
          >
            <div className="max-w-2xl">
              <p
                className="text-xs md:text-sm font-bold tracking-widest text-white/70 mb-3 md:mb-6"
                style={{ animation: "hero-text-up 600ms ease-out both", animationDelay: "0ms" }}
              >
                {HERO_COPY.badge}
              </p>

              <h1
                className="text-[clamp(1.6rem,5vw,3rem)] font-sans font-bold leading-[1.1] text-white tracking-tight text-balance mb-3 md:mb-6"
                style={{ animation: "hero-text-up 600ms ease-out both", animationDelay: "100ms" }}
              >
                {HERO_COPY.headingLine1}
                <br />
                <span className="relative inline-block">
                  {HERO_COPY.headingLine2}
                  <svg
                    className="absolute -bottom-1 md:-bottom-3 left-0 w-full h-2 md:h-4 text-sunset opacity-70"
                    viewBox="0 0 100 10"
                    preserveAspectRatio="none"
                  >
                    <path d="M0 5 Q 50 12 100 5" stroke="currentColor" strokeWidth="3" fill="none" strokeLinecap="round" />
                  </svg>
                </span>
              </h1>

              <p
                className="text-sm md:text-base text-white leading-relaxed max-w-[600px] mb-6 md:mb-8 font-medium rounded-lg bg-black/10 backdrop-blur-[1px] px-3 py-2 rounded-md"
                style={{ animation: "hero-text-up 600ms ease-out both", animationDelay: "200ms" }}
              >
                {HERO_COPY.description.split('\n').map((line, i, arr) => (
                  <span key={i}>
                    {line}
                    {i < arr.length - 1 && <br className="hidden md:block" />}
                  </span>
                ))}
              </p>

              {/* CTA */}
              <div
                className="flex flex-col sm:flex-row gap-3 md:gap-4"
                style={{ animation: "hero-text-up 600ms ease-out both", animationDelay: "300ms", textShadow: "none" }}
              >
                <CTAButtons />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

const CTAButtons = () => (
  <>
    <a
      href={ESTIMATE_URL}
      target="_blank"
      rel="noopener noreferrer"
      className="w-full sm:w-auto px-8 py-3 rounded-full font-bold center gap-3 text-white group bg-sunset shadow-lg shadow-sunset/30 hover:shadow-sunset/50 transition-all hover:-translate-y-0.5 focus-visible:ring-2 focus-visible:ring-sunset focus-visible:ring-offset-2"
    >
      {HERO_COPY.primaryCta}
      <div className="bg-white/20 p-1 rounded-full group-hover:translate-x-1 transition-transform">
        <ArrowRight className="w-4 h-4" />
      </div>
    </a>

    <Link
      href="/contact"
      className="w-full sm:w-auto px-8 py-3 bg-white/90 text-forest rounded-full font-bold hover:bg-white transition-colors center gap-2 group focus-visible:ring-2 focus-visible:ring-sunset focus-visible:ring-offset-2"
    >
      <Mail className="w-5 h-5 text-forest/70 group-hover:scale-110 transition-transform" />
      <span>{HERO_COPY.secondaryCta}</span>
    </Link>
  </>
);

export default HeroSection;
