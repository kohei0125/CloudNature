import Link from "next/link";
import { Download, Zap, Database } from "lucide-react";
import { CTA_BANNER } from "@/content/home";

const CtaSection = () => {
  return (
    <section className="py-16 md:py-24 bg-pebble relative">
      <div className="container mx-auto px-6 relative z-10">
        <div className="bg-white rounded-[32px] overflow-hidden shadow-xl grid md:grid-cols-2">

          {/* Left Column: Content */}
          <div className="p-8 md:p-16 space-y-8 flex flex-col justify-center">
            <div>
              <h2 className="text-[clamp(1.5rem,5vw,2rem)] font-serif font-bold text-forest leading-tight mb-4">
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
              <div className="p-3 bg-white rounded-lg border border-gray-100 shadow-sm text-sage">
                <Database className="w-6 h-6" />
              </div>
              <div>
                <h4 className="font-bold text-forest text-sm mb-1">{CTA_BANNER.downloadTitle}</h4>
                <p className="text-xs text-gray-500 font-medium">{CTA_BANNER.downloadMeta}</p>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 pt-2">
              <Link href="/contact" className="btn-puffy btn-puffy-accent px-8 py-4 rounded-full font-bold flex items-center justify-center gap-3 shadow-lg shadow-sunset/20 hover:shadow-sunset/40 transition-all">
                <Download className="w-5 h-5" />
                {CTA_BANNER.primaryCta}
              </Link>
              <Link href="/contact" className="px-8 py-4 bg-forest text-white rounded-full font-bold hover:bg-earth transition-colors shadow-lg flex items-center justify-center gap-2">
                <Zap className="w-4 h-4 text-sunset" />
                {CTA_BANNER.secondaryCta}
              </Link>
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
  );
};

export default CtaSection;
