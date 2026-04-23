import Image from "next/image";
import { SERVICES_SECTION, SERVICES } from "@/content/home";
import SectionHeader from "@/components/shared/SectionHeader";

const SERVICE_ICONS: Record<string, string> = {
  "ai-support": "/images/renewal/icon_service_1_tr.png",
  "ai": "/images/renewal/icon_service_2_tr.png",
  "dev": "/images/renewal/icon_service_3_tr.png"
};

const ServicesSection = () => {
  return (
    <section id="services" aria-labelledby="services-heading" className="py-16 md:py-24 bg-teal-50">
      <div className="mx-auto max-w-7xl px-6 md:px-8">
        <SectionHeader
          eyebrow={SERVICES_SECTION.eyebrow}
          title={SERVICES_SECTION.title}
          cta={{ label: SERVICES_SECTION.cta, href: "/services" }}
          headingId="services-heading"
        />

        <div className="grid md:grid-cols-3 gap-4 md:gap-5">
          {SERVICES.map((service) => {
            const IconSrc = SERVICE_ICONS[service.id];
            return (
              <div
                key={service.id}
                className="rounded-2xl border border-gray-100 bg-white p-6 md:p-8 shadow-sm hover:shadow-md transition-shadow flex flex-col h-full"
              >
                {/* Title */}
                <h3 className="text-base md:text-lg font-bold text-gray-900 text-center mb-6">{service.title}</h3>

                <div className="flex gap-4 md:gap-5 flex-grow">
                  {/* Icon */}
                  <div className="w-16 h-16 md:w-20 md:h-20 shrink-0 flex items-start justify-center">
                    <Image src={IconSrc} alt="" width={80} height={80} className="object-contain" />
                  </div>

                  {/* Content (Description + Tags) */}
                  <div className="flex flex-col flex-grow">
                    <p className="text-[13px] md:text-sm text-gray-600 leading-relaxed mb-6">{service.description}</p>

                    {/* Tag chips */}
                    <div className="flex flex-wrap gap-2 mt-auto">
                      {service.techStack.map((tag) => (
                        <span key={tag} className="px-2.5 py-1 rounded-md bg-teal-50 text-teal-800 text-[11px] font-bold">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default ServicesSection;
