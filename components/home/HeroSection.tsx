import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Mail } from "lucide-react";
import { HERO_COPY } from "@/content/home";
import { ESTIMATE_URL } from "@/content/common";

const HeroSection = () => {
  return (
    <section id="hero" className="relative overflow-hidden bg-white">
      {/* ヘッダー分のスペーサー */}
      <div className="pt-[52px] md:pt-[56px]" />

      {/* ===== モバイル: 旧デザイン（フルスクリーン画像 + テキストオーバーレイ） ===== */}
      <div className="md:hidden">
        <div className="relative overflow-hidden min-h-[calc(85svh-52px)]">
          <Image
            src={HERO_COPY.imageSrc}
            alt={HERO_COPY.heroImageAlt}
            fill
            priority
            sizes="100vw"
            className="object-cover"
          />
          <div
            className="absolute inset-0 flex flex-col justify-center px-5"
            style={{ textShadow: "0 1px 3px rgba(0,0,0,0.4), 0 4px 12px rgba(0,0,0,0.2)" }}
          >
            <div className="max-w-2xl">
              <p className="text-xs font-bold tracking-widest text-white/70 mb-3">
                {HERO_COPY.badge}
              </p>

              <h1 className="text-[clamp(1.6rem,5vw,3rem)] font-bold leading-[1.1] text-white tracking-tight text-balance mb-3">
                {HERO_COPY.headingLine1}
                <br />
                {HERO_COPY.headingLine2}
              </h1>

              <p className="text-sm text-white leading-relaxed max-w-[600px] mb-6 font-medium rounded-md bg-black/10 backdrop-blur-[1px] px-3 py-2">
                {HERO_COPY.description.replace(/\n/g, '')}
              </p>

              <div className="flex flex-col gap-3" style={{ textShadow: "none" }}>
                <a
                  href={ESTIMATE_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full px-8 py-3 rounded-full font-bold center gap-3 text-white group bg-teal-700 shadow-lg shadow-teal-800/30 hover:shadow-teal-800/50 transition-all"
                >
                  {HERO_COPY.primaryCta}
                  <div className="bg-white/20 p-1 rounded-full group-hover:translate-x-1 transition-transform">
                    <ArrowRight className="w-4 h-4" />
                  </div>
                </a>
                <Link
                  href="/contact"
                  className="w-full px-8 py-3 bg-white/90 text-gray-800 rounded-full font-bold hover:bg-white transition-colors center gap-2 group"
                >
                  <Mail className="w-5 h-5 text-gray-600 group-hover:scale-110 transition-transform" />
                  <span>{HERO_COPY.secondaryCta}</span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ===== PC: 新デザイン ===== */}
      <div className="relative min-h-[600px] lg:min-h-[660px] hidden md:flex items-center">
        <div className="absolute inset-0 z-0">
          <Image
            src={HERO_COPY.imageSrc}
            alt={HERO_COPY.heroImageAlt}
            fill
            priority
            sizes="100vw"
            className="object-cover object-center"
          />
        </div>

        <div className="absolute inset-0 z-[1] bg-gradient-to-r from-white from-20% via-white/50 via-50% to-transparent to-90%" />

        <div
          className="absolute inset-0 z-[2] opacity-[0.06] pointer-events-none"
          style={{
            backgroundImage: 'radial-gradient(#00684B 1.5px, transparent 1.5px)',
            backgroundSize: '24px 24px',
            WebkitMaskImage: 'linear-gradient(to right, black 30%, transparent 80%)',
            maskImage: 'linear-gradient(to right, black 30%, transparent 80%)'
          }}
        />

        <div className="absolute z-[2] top-0 right-0 w-[400px] h-[400px] pointer-events-none -translate-y-1/2 translate-x-1/4">
          <div className="absolute inset-0 bg-teal-400/20 rounded-full" />
        </div>
        <div className="absolute z-[2] bottom-0 left-0 w-[400px] h-[400px] lg:w-[500px] lg:h-[500px] pointer-events-none translate-y-[70%] -translate-x-[15%]">
          <div className="absolute inset-0 bg-teal-400/10 rounded-full" />
        </div>

        <div
          className="relative z-10 w-full px-10 lg:px-14 py-24 animate-hero-fade-in"
        >
          <div className="max-w-xl lg:max-w-3xl">
            <span className="inline-block px-4 py-1.5 mb-6 text-sm font-bold tracking-widest text-teal-800 bg-white/90 border border-teal-200/60 rounded-full shadow-sm uppercase">
              {HERO_COPY.badge}
            </span>

            <h1 className="text-5xl lg:text-[3.2rem] font-extrabold leading-[1.25] text-gray-900 tracking-tight mb-6">
              {HERO_COPY.headingLine1}
              <br />
              {HERO_COPY.headingLine2.split("仕組み").map((part, i, arr) =>
                i < arr.length - 1 ? (
                  <span key={i}>{part}<span className="text-teal-800">仕組み</span></span>
                ) : (
                  <span key={i}>{part}</span>
                )
              )}
            </h1>

            <p className="text-base text-gray-800 leading-relaxed mb-10 max-w-lg font-medium [text-shadow:0_1px_3px_rgba(0,0,0,0.15),0_0_12px_rgba(255,255,255,0.7)]">
              {HERO_COPY.description.split('\n').map((line, i, arr) => (
                <span key={i}>
                  {line}
                  {i < arr.length - 1 && <br />}
                </span>
              ))}
            </p>

            <div className="flex flex-row gap-4">
              <Link href="/services" className="btn-primary text-base py-3.5">
                サービスを見る
                <ArrowRight className="w-5 h-5" />
              </Link>
              <Link href="/contact" className="btn-outline text-base py-3.5">
                {HERO_COPY.secondaryCta}
                <ArrowRight className="w-5 h-5" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
