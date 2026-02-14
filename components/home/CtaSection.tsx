import Link from "next/link";
import { Download, Zap, Database, FileText } from "lucide-react";
import { CTA_BANNER } from "@/content/home";

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
                  <div className="p-3 bg-white rounded-lg border border-gray-100 shadow-sm text-sage flex-shrink-0">
                    <Database className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="font-bold text-forest text-sm mb-1">{CTA_BANNER.downloadTitle}</h4>
                    <p className="text-xs text-gray-500 font-medium">{CTA_BANNER.downloadMeta}</p>
                  </div>
                </div>
              </div>

              <p className="text-gray-600 leading-relaxed">
                {CTA_BANNER.description}
              </p>
            </div>

            {/* Resource Box (Desktop) */}
            <div className="hidden md:flex bg-gray-50 rounded-xl p-5 border border-gray-100 items-start gap-4">
              <div className="p-3 bg-white rounded-lg border border-gray-100 shadow-sm text-sage">
                <Database className="w-6 h-6" />
              </div>
              <div>
                <h4 className="font-bold text-forest text-sm mb-1">{CTA_BANNER.downloadTitle}</h4>
                <p className="text-xs text-gray-500 font-medium">{CTA_BANNER.downloadMeta}</p>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="v-stack sm:h-stack gap-4 pt-2">
              <Link href="/contact" className="btn-puffy btn-puffy-accent px-8 py-4 rounded-full font-bold center gap-3 shadow-lg shadow-sunset/20 hover:shadow-sunset/40 transition-all">
                <Download className="w-5 h-5" />
                {CTA_BANNER.primaryCta}
              </Link>
              <Link href="/contact" className="px-8 py-4 bg-forest text-white rounded-full font-bold hover:bg-earth transition-colors shadow-lg center gap-2">
                <Zap className="w-4 h-4 text-sunset" />
                {CTA_BANNER.secondaryCta}
              </Link>
            </div>
          </div>

          {/* Right Column: Styled PDF Resource Preview */}
          <div className="hidden md:flex bg-gradient-to-br from-forest to-earth p-10 md:p-16 items-center justify-center border-t md:border-t-0 relative overflow-hidden">
            {/* Decorative blurs */}
            <div className="absolute top-10 right-10 w-32 h-32 bg-sage/20 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute bottom-10 left-10 w-24 h-24 bg-sunset/15 rounded-full blur-3xl pointer-events-none" />

            {/* Document mock */}
            <div className="relative bg-white rounded-xl shadow-2xl p-8 max-w-[260px] transform rotate-2 hover:rotate-0 transition-transform duration-300">
              <div className="flex items-center gap-2 mb-4">
                <FileText className="w-5 h-5 text-sage" />
                <div className="h-1 bg-sage rounded-full flex-1" />
              </div>
              <p className="text-forest font-serif font-bold text-sm leading-snug mb-4">
                {CTA_BANNER.downloadTitle}
              </p>
              <div className="space-y-2.5 mb-5">
                <div className="h-2 bg-gray-100 rounded w-full" />
                <div className="h-2 bg-gray-100 rounded w-4/5" />
                <div className="h-2 bg-gray-100 rounded w-3/5" />
                <div className="h-2 bg-gray-100 rounded w-full" />
                <div className="h-2 bg-gray-100 rounded w-2/3" />
              </div>
              <div className="flex items-center justify-between">
                <p className="text-[10px] text-gray-400 font-medium">{CTA_BANNER.downloadMeta}</p>
                <span className="px-2 py-0.5 bg-sage/10 text-sage text-[10px] font-bold rounded">PDF</span>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};

export default CtaSection;
