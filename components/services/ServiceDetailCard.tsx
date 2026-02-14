import { CheckCircle2, ArrowRight } from "lucide-react";
import Image from "next/image";
import { cn } from "@/lib/utils";
import type { ServiceDetail } from "@/types";

const accentBorders: Record<string, string> = {
  sage: "border-t-sage",
  sunset: "border-t-sunset",
  sea: "border-t-sea",
};

const accentText: Record<string, string> = {
  sage: "text-sage",
  sunset: "text-sunset",
  sea: "text-sea",
};

interface ServiceDetailCardProps {
  service: ServiceDetail;
  index: number;
}

const ServiceDetailCard = ({ service, index }: ServiceDetailCardProps) => {
  const isEven = index % 2 === 0;

  return (
    <div
      className={cn(
        "group bg-white rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden border-t-[3px] v-stack md:h-stack",
        accentBorders[service.accentColor],
        !isEven && "md:h-stack-reverse"
      )}
    >
      {service.image && (
        <div className="relative w-full md:w-2/5 h-64 md:h-auto overflow-hidden">
          <Image
            src={service.image}
            alt={service.title}
            fill
            sizes="(min-width: 768px) 40vw, 100vw"
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-white/20 via-transparent to-transparent opacity-90 md:hidden" />
          <div
            className={cn(
              "absolute inset-0 opacity-0 md:opacity-20 transition-opacity duration-300",
              service.accentColor === "sage" && "bg-sage mix-blend-overlay",
              service.accentColor === "sunset" && "bg-sunset mix-blend-overlay",
              service.accentColor === "sea" && "bg-sea mix-blend-overlay"
            )}
          />
        </div>
      )}

      <div className="p-6 md:p-10 md:w-3/5 v-stack relative justify-center">
        {/* Background Number */}
        <span
          className={cn(
            "absolute top-4 text-[6rem] font-bold leading-none text-forest/[0.04] pointer-events-none select-none z-0",
            isEven ? "right-6" : "left-6"
          )}
        >
          {String(index + 1).padStart(2, "0")}
        </span>

        <div className="relative z-10">
          <p
            className={cn(
              "text-xs font-bold tracking-wider uppercase mb-2",
              accentText[service.accentColor]
            )}
          >
            {service.subtitle}
          </p>
          <h3 className="text-2xl font-bold text-forest mb-4">
            {service.title}
          </h3>
          <p className="text-gray-600 text-sm leading-relaxed mb-8">
            {service.description}
          </p>

          <ul className="space-y-4 mb-8">
            {service.features.map((feature, idx) => (
              <li key={idx} className="flex gap-3">
                <CheckCircle2
                  className={cn(
                    "w-5 h-5 mt-0.5 flex-shrink-0",
                    accentText[service.accentColor]
                  )}
                />
                <div>
                  <p className="font-bold text-forest text-sm">
                    {feature.title}
                  </p>
                  <p className="text-gray-600 text-xs leading-relaxed mt-0.5">
                    {feature.description}
                  </p>
                </div>
              </li>
            ))}
          </ul>

          <div className="flex flex-wrap gap-2">
            {service.techStack.map((tech) => (
              <span
                key={tech}
                className="px-3 py-1 bg-gray-100 text-gray-600 text-xs font-medium rounded-full"
              >
                {tech}
              </span>
            ))}
          </div>

          {service.externalUrl && (
            <a
              href={service.externalUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-8 btn-puffy btn-puffy-accent px-6 py-3 rounded-full font-bold text-sm text-white inline-flex items-center gap-2"
            >
              詳しくはこちら
              <ArrowRight className="w-4 h-4" />
            </a>
          )}
        </div>
      </div>
    </div>
  );
};

export default ServiceDetailCard;
