import { CheckCircle2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { ServiceDetail } from "@/types";

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
  return (
    <div
      className={cn(
        "relative overflow-hidden group bg-white rounded-xl shadow-sm border-t-[3px] hover:shadow-lg hover:-translate-y-1 transition-all duration-300",
        accentBorders[service.accentColor]
      )}
    >
      <span className="absolute top-4 right-6 text-[6rem] font-bold leading-none text-forest/[0.06] pointer-events-none select-none">
        {String(index + 1).padStart(2, "0")}
      </span>

      <div className="p-6 md:p-8 lg:p-10">
        <p
          className={cn(
            "text-xs font-bold tracking-wider uppercase mb-2",
            accentText[service.accentColor]
          )}
        >
          {service.subtitle}
        </p>
        <h3 className="text-2xl font-bold text-forest mb-4">{service.title}</h3>
        <p className="text-gray-600 text-sm leading-relaxed mb-8">
          {service.description}
        </p>

        <ul className="space-y-5">
          {service.features.map((feature, idx) => (
            <li key={idx} className="flex gap-3">
              <CheckCircle2
                className={cn(
                  "w-5 h-5 mt-0.5 flex-shrink-0",
                  accentText[service.accentColor]
                )}
              />
              <div>
                <p className="font-bold text-forest text-sm">{feature.title}</p>
                <p className="text-gray-600 text-sm leading-relaxed mt-1">
                  {feature.description}
                </p>
              </div>
            </li>
          ))}
        </ul>
      </div>

      <div className="px-6 md:px-8 lg:px-10 py-5 bg-forest text-white/80 text-xs">
        <div className="flex flex-wrap gap-2">
          {service.techStack.map((tech) => (
            <span
              key={tech}
              className="px-2 py-1 bg-white/15 border border-white/20 rounded-md whitespace-nowrap"
            >
              {tech}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ServiceDetailCard;
