import { Download } from "lucide-react";
import SectionHeader from "@/components/shared/SectionHeader";
import { COMPANY_OVERVIEW, COMPANY_PROFILE_DOC } from "@/content/company";

const CompanyOverview = () => {
  return (
    <section id="overview" aria-labelledby="overview-heading" className="py-16 md:py-24 bg-mist texture-grain relative overflow-hidden">
      {/* Decorative blobs */}
      <div className="absolute top-20 -left-32 w-80 h-80 bg-cloud rounded-full mix-blend-multiply filter blur-3xl opacity-20 pointer-events-none" />
      <div className="absolute bottom-20 -right-32 w-80 h-80 bg-sage rounded-full mix-blend-multiply filter blur-3xl opacity-15 pointer-events-none" />

      <div className="container mx-auto px-6 max-w-3xl relative z-10">
        <SectionHeader
          eyebrow="OVERVIEW"
          title="会社概要"
          centered
          headingId="overview-heading"
        />

        <div className="glass-card rounded-2xl overflow-hidden">
          {/* Top accent gradient */}
          <div className="h-[2px] bg-gradient-to-r from-sage/10 via-sage/50 to-sage/10" />

          <dl className="divide-y divide-forest/[0.06]">
            {COMPANY_OVERVIEW.map((item) => (
              <div
                key={item.label}
                className="group relative grid grid-cols-1 md:grid-cols-[11rem_1fr] transition-colors duration-300 hover:bg-white/50"
              >
                {/* Animated left accent */}
                <div className="absolute left-0 top-3 bottom-3 w-[2px] rounded-full bg-sage scale-y-0 group-hover:scale-y-100 transition-transform duration-300 origin-top" />

                <dt className="px-7 pt-5 pb-1 md:py-6 text-[13px] font-bold text-sage">
                  {item.label}
                </dt>
                <dd className="px-7 pb-5 md:py-6 md:pl-0 text-[15px] text-forest/75 leading-relaxed">
                  {item.value}
                </dd>
              </div>
            ))}
          </dl>
        </div>

        {/* 会社紹介資料ダウンロード */}
        <div className="mt-8 text-center">
          <a
            href={COMPANY_PROFILE_DOC.href}
            target="_blank"
            rel="noopener noreferrer"
            className="px-6 py-3 border border-forest/20 text-forest rounded-full font-bold text-sm hover:bg-forest/5 transition-colors inline-flex items-center justify-center gap-2"
          >
            <Download className="w-4 h-4" />
            {COMPANY_PROFILE_DOC.label}
          </a>
          <p className="mt-3 text-[13px] text-forest/60">
            {COMPANY_PROFILE_DOC.description}
          </p>
        </div>
      </div>
    </section>
  );
};

export default CompanyOverview;
