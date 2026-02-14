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

        <div className="grid lg:grid-cols-3 gap-8">
          {SERVICES.map((service, index) => (
            <div
              key={service.id}
              className={cn("bg-white overflow-hidden shadow-sm transition-all duration-300 v-stack h-full border-t-[3px]", topBorders[index], "group")}
            >
              <div className="p-6 md:p-8 flex-1">
                <h4 className="text-2xl font-bold text-forest mb-4">{service.title}</h4>
                <p className="text-gray-600 mb-6 text-sm leading-relaxed">{service.description}</p>
                <ul className="v-stack gap-3">
                  {service.features.map((feature, idx) => (
                    <li key={idx} className="flex items-center gap-2 text-sm text-forest font-medium">
                      <CheckCircle2 className="w-4 h-4 text-sage" />
                      {feature}
                    </li>
                  ))}
                </ul>
                {service.ctaUrl && (
                  <a
                    href={service.ctaUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-4 text-sm font-bold text-sea inline-flex items-center gap-1 hover:underline transition-colors"
                  >
                    {service.ctaLabel || "詳しくはこちら"}
                    <ArrowRight className="w-3.5 h-3.5" />
                  </a>
                )}
              </div>
              <div className="px-5 py-6 bg-forest text-white/80 text-xs">
                <div className="md:hidden overflow-hidden">
                  <div className="flex w-max gap-2 animate-infinite-scroll">
                    {[...service.techStack, ...service.techStack].map((tech, idx) => (
                      <span key={`${tech}-${idx}`} className="px-2 py-1 bg-white/15 border border-white/20 rounded-md whitespace-nowrap">
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="hidden md:flex flex-wrap gap-2">
                  {service.techStack.map((tech) => (
                    <span key={tech} className="px-2 py-1 bg-white/15 border border-white/20 rounded-md whitespace-nowrap">
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ServicesSection;
