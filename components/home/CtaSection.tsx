import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Download, CheckCircle2 } from "lucide-react";
import { CTA_BANNER } from "@/content/home";
import { ESTIMATE_URL } from "@/content/common";

const CtaSection = () => {
  return (
    <section className="py-16 md:py-24 bg-pebble relative">
      <div className="container mx-auto px-6 relative z-10">
        <div className="bg-white rounded-[32px] overflow-hidden shadow-xl grid md:grid-cols-2">

          {/* Left Column: Content */}
          <div className="p-8 md:p-16 space-y-8 v-stack justify-center">
            <div>
              <h2 className="text-[clamp(1.5rem,5vw,2rem)] font-serif font-bold text-forest leading-tight mb-4">
                {CTA_BANNER.titleLines[0]}
                <br />
                {CTA_BANNER.titleLines[1]}
              </h2>

              {/* Mobile Resource Card */}
              <div className="block md:hidden mb-6">
                <div className="bg-gray-50 rounded-xl p-5 border border-gray-100 flex items-start gap-4">
                  <div className="flex-shrink-0">
                    <Image
                      src="/images/manual.png"
                      alt={CTA_BANNER.downloadTitle}
                      width={60}
                      height={84}
                      className="w-16 h-auto shadow-md rounded-sm"
                    />
                  </div>
                  <div>
                    <h4 className="font-bold text-forest text-sm mb-1">{CTA_BANNER.downloadTitle}</h4>
                    <p className="text-xs text-gray-500 font-medium">{CTA_BANNER.downloadMeta}</p>
                  </div>
                </div>
              </div>

              <div className="space-y-6">
                <p className="text-gray-600 leading-relaxed text-lg">
                  {CTA_BANNER.description}
                </p>

                {/* Appeal Points List */}
                {CTA_BANNER.appealPoints && (
                  <ul className="space-y-3">
                    {CTA_BANNER.appealPoints.map((point, index) => (
                      <li key={index} className="flex items-start gap-3 text-forest font-medium">
                        <CheckCircle2 className="w-6 h-6 text-sage flex-shrink-0" />
                        <span>{point}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="v-stack sm:h-stack gap-4 pt-2">
              <a href={ESTIMATE_URL} target="_blank" rel="noopener noreferrer" className="btn-puffy btn-puffy-accent px-8 py-4 rounded-full font-bold center gap-3 shadow-lg shadow-sunset/20 hover:shadow-sunset/40 transition-all">
                {CTA_BANNER.primaryCta}
                <ArrowRight className="w-5 h-5" />
              </a>
              <Link href="/downloads/ai-agent-guide-2026.pdf" className="px-8 py-4 bg-forest text-white rounded-full font-bold hover:bg-earth transition-colors shadow-lg center gap-2">
                <Download className="w-4 h-4" />
                {CTA_BANNER.secondaryCta}
              </Link>
            </div>
          </div>

          {/* Right Column: Manual Image & Highlights */}
          <div className="hidden md:flex bg-gradient-to-br from-forest to-earth p-10 lg:p-12 items-center justify-center border-t md:border-t-0 relative overflow-hidden group">
            {/* Decorative blurs */}
            <div className="absolute top-10 right-10 w-32 h-32 bg-sage/20 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute bottom-10 left-10 w-24 h-24 bg-sunset/15 rounded-full blur-3xl pointer-events-none" />

            <div className="relative z-10 flex flex-col lg:flex-row items-center gap-8 max-w-lg mx-auto">
              {/* Image */}
              <div className="transform group-hover:scale-105 transition-transform duration-500 ease-out flex-shrink-0">
                <Image
                  src="/images/manual.png"
                  alt={CTA_BANNER.downloadTitle}
                  width={200}
                  height={280}
                  className="w-[150px] lg:w-[200px] h-auto object-contain drop-shadow-2xl rounded-sm"
                />
              </div>

              {/* Highlights Text */}
              {CTA_BANNER.bookHighlights && (
                <div className="text-white space-y-4">
                  <h4 className="font-serif font-bold text-lg text-sage/90 border-b border-sage/30 pb-2 mb-3">
                    本書の内容
                  </h4>
                  <ul className="space-y-3">
                    {CTA_BANNER.bookHighlights.map((highlight, index) => (
                      <li key={index} className="flex items-start gap-2 text-sm text-gray-200">
                        <CheckCircle2 className="w-4 h-4 text-sage flex-shrink-0 mt-0.5" />
                        <span>{highlight}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};

export default CtaSection;
