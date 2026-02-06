import { CheckCircle2 } from "lucide-react";
import { SERVICES_SECTION, SERVICES } from "@/content/home";
import SectionHeader from "@/components/shared/SectionHeader";

const ServicesSection = () => {
  return (
    <section className="py-16 md:py-24 bg-[#F8F9FA] texture-grain overflow-hidden">
      <div className="container mx-auto px-6">
        <SectionHeader
          eyebrow={SERVICES_SECTION.eyebrow}
          title={SERVICES_SECTION.title}
          cta={{ label: SERVICES_SECTION.cta, href: "/services" }}
        />

        <div className="grid lg:grid-cols-3 gap-8">
          {SERVICES.map((service) => (
            <div
              key={service.id}
              className="bg-white rounded-[32px] overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-300 flex flex-col h-full border border-gray-100 group"
            >
              <div className="p-6 md:p-8 flex-1">
                <div className="w-14 h-14 bg-[#EDE8E5] rounded-full flex items-center justify-center mb-6 text-[#19231B] group-hover:bg-[#19231B] group-hover:text-white transition-colors duration-300">
                  <service.icon className="w-7 h-7" />
                </div>
                <h4 className="text-2xl font-bold text-[#19231B] mb-4">{service.title}</h4>
                <p className="text-gray-600 mb-6 text-sm leading-relaxed">{service.description}</p>
                <ul className="space-y-3">
                  {service.features.map((feature, idx) => (
                    <li key={idx} className="flex items-center gap-2 text-sm text-[#19231B] font-medium">
                      <CheckCircle2 className="w-4 h-4 text-[#8A9668]" />
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
              {/* Refined Tech Tags: Better Visibility */}
              <div className="px-8 py-6 bg-[#19231B] text-white/80 text-xs border-t border-white/10 group-hover:bg-[#DD9348] transition-colors duration-300">
                <div className="flex overflow-hidden group/tags">
                  <div className="flex gap-2 animate-infinite-scroll w-max group-hover/tags:paused">
                    {/* First set of tags */}
                    {service.techStack.map((tech) => (
                      <span key={`org-${tech}`} className="shrink-0 px-2 py-1 bg-white/15 border border-white/20 rounded-md backdrop-blur-sm whitespace-nowrap">
                        {tech}
                      </span>
                    ))}
                    {/* Duplicate set for seamless loop */}
                    {service.techStack.map((tech) => (
                      <span key={`dup-${tech}`} className="shrink-0 px-2 py-1 bg-white/15 border border-white/20 rounded-md backdrop-blur-sm whitespace-nowrap">
                        {tech}
                      </span>
                    ))}
                  </div>
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
