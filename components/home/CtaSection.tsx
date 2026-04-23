import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { CTA_BANNER } from "@/content/home";

const CtaSection = () => {
  return (
    <section id="cta" aria-labelledby="cta-heading" className="py-16 md:py-24 bg-white relative overflow-hidden border-t border-gray-100">
      {/* 左側の円形装飾 */}
      <div className="absolute top-1/2 left-0 -translate-y-1/2 -translate-x-[30%] w-[400px] h-[400px] md:w-[600px] md:h-[600px] rounded-full bg-gradient-to-br from-lime-100/80 to-emerald-100/80 pointer-events-none" />
      <div className="absolute -bottom-[10%] left-[5%] md:left-[10%] w-[200px] h-[200px] md:w-[300px] md:h-[300px] rounded-full bg-gradient-to-tr from-emerald-100/60 to-teal-100/60 pointer-events-none backdrop-blur-[2px]" />

      {/* 右側の円形装飾 */}
      <div className="absolute -top-[10%] right-0 translate-x-[20%] w-[350px] h-[350px] md:w-[500px] md:h-[500px] rounded-full bg-gradient-to-bl from-teal-100/80 to-emerald-100/80 pointer-events-none" />
      <div className="absolute -bottom-[5%] right-[10%] w-[200px] h-[200px] md:w-[250px] md:h-[250px] rounded-full bg-gradient-to-tl from-emerald-100/60 to-lime-100/60 pointer-events-none backdrop-blur-[2px]" />

      <div className="mx-auto max-w-5xl px-6 md:px-8 relative z-10">
        <div className="flex flex-col md:flex-row items-center justify-center gap-10 md:gap-16">
          {/* Mail icon */}
          <div className="shrink-0 relative">
            <div className="w-32 h-32 md:w-40 md:h-40 rounded-full border border-gray-200 bg-white flex items-center justify-center shadow-sm">
              <Image src="/images/renewal/icon_cta_mail_tr.png" alt="Contact Us" width={80} height={80} className="object-contain w-16 h-16 md:w-20 md:h-20" />
            </div>
          </div>

          <div className="text-center max-w-xl">
            <h2 id="cta-heading" className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
              {CTA_BANNER.title}
            </h2>
            <p className="text-sm md:text-base text-gray-600 leading-relaxed mb-8">
              {CTA_BANNER.description}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/contact" className="btn-primary">
                {CTA_BANNER.primaryCta}
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CtaSection;
