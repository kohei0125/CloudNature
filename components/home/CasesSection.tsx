import { ArrowRight } from "lucide-react";
import Image from "next/image";
import { CASES_SECTION, CASE_STUDIES } from "@/content/home";
import SectionHeader from "@/components/shared/SectionHeader";

const CasesSection = () => {
  return (
    <section className="py-16 md:py-24 bg-forest text-white relative overflow-hidden">
      <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_20%_20%,#8A9668,transparent_25%),radial-gradient(circle_at_80%_30%,#C8E8FF,transparent_20%),radial-gradient(circle_at_50%_80%,#DD9348,transparent_25%)]"></div>
      <div className="container mx-auto px-6 relative z-10">
        <SectionHeader
          eyebrow={CASES_SECTION.eyebrow}
          title={CASES_SECTION.title}
          centered
          darkMode
        />

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
                  <span className="px-3 py-1 bg-sunset text-white text-[10px] font-bold rounded-full shadow-md">
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
                  <div className="pl-3 border-l-2 border-sunset">
                    <p className="text-[10px] text-sunset font-bold uppercase mb-1 tracking-wider">AFTER</p>
                    <p className="text-xs text-white leading-relaxed">
                      {study.after}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-12 text-center">
          <button className="text-sunset font-bold inline-flex items-center gap-2 hover:gap-3 transition-all">
            {CASES_SECTION.cta} <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </section>
  );
};

export default CasesSection;
