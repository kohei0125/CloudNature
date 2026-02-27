import { CheckCircle2, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { SERVICES_SECTION, SERVICES } from "@/content/home";
import SectionHeader from "@/components/shared/SectionHeader";

const topBorders: Record<number, string> = {
  0: "border-t-sage",
  1: "border-t-sunset",
  2: "border-t-sea",
};

const ServicesSection = () => {
  return (
    <section className="py-16 md:py-24 bg-mist texture-grain overflow-hidden">
      <div className="container mx-auto px-6">
        <SectionHeader
          eyebrow={SERVICES_SECTION.eyebrow}
          title={SERVICES_SECTION.title}
          cta={{ label: SERVICES_SECTION.cta, href: "/services" }}
        />

        <div className="grid lg:grid-cols-3">
          {SERVICES.map((service, index) => (
            <div
              key={service.id}
              className={cn(
                "group v-stack h-full relative px-6 py-10 lg:px-10 lg:py-12 transition-colors duration-500 hover:bg-white/30",
                index !== SERVICES.length - 1 && "lg:border-r lg:border-forest/10"
              )}
            >
              {/* ダイナミック・トップアクセントボーダー */}
              <div className={cn("absolute top-0 left-0 h-[3px] transition-all duration-700 w-12 group-hover:w-full",
                index === 0 ? "bg-sage" : index === 1 ? "bg-sunset" : "bg-sea"
              )} />

              <div className="flex-1 v-stack relative z-10">
                {/* スタイリッシュなナンバリング */}
                <div className="mb-4 flex items-center gap-3">
                  <span className={cn("text-xs font-mono font-bold tracking-widest uppercase",
                    index === 0 ? "text-sage" : index === 1 ? "text-sunset" : "text-sea"
                  )}>
                    Service — 0{index + 1}
                  </span>
                </div>

                <h3 className="text-xl font-bold text-forest mb-4 leading-snug tracking-tight">
                  {service.title}
                </h3>

                <p className="text-gray-600 mb-8 text-sm leading-relaxed max-w-sm">
                  {service.description}
                </p>

                <ul className="v-stack gap-3 mb-8">
                  {service.features.map((feature, idx) => (
                    <li key={idx} className="flex items-start gap-2.5 text-sm text-forest font-medium">
                      <CheckCircle2 className={cn("w-3.5 h-3.5 shrink-0 mt-[3px]",
                        index === 0 ? "text-sage" : index === 1 ? "text-sunset" : "text-sea"
                      )} />
                      <span className="leading-snug">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="mt-auto relative z-10 pt-4 border-t border-forest/10">
                {service.ctaUrl && (
                  <a
                    href={service.ctaUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-[13px] font-bold text-forest hover:text-black transition-colors group/link w-fit"
                  >
                    <span className="relative inline-block">
                      {service.ctaLabel || "詳しくはこちら"}
                      <span className="absolute -bottom-1 left-0 w-full h-[1.5px] bg-forest/20 group-hover/link:bg-forest transition-colors" />
                    </span>
                    <ArrowRight className="w-3.5 h-3.5 group-hover/link:translate-x-1 transition-transform" />
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ServicesSection;
