"use client";

import { CheckCircle2, ArrowRight } from "lucide-react";
import Image from "next/image";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import type { ServiceDetail } from "@/types";

const accentBg: Record<string, string> = {
  sage: "bg-sage",
  sunset: "bg-sunset",
  sea: "bg-sea",
};

const accentBgLight: Record<string, string> = {
  sage: "bg-sage/10",
  sunset: "bg-sunset/10",
  sea: "bg-sea/10",
};

const accentText: Record<string, string> = {
  sage: "text-sage",
  sunset: "text-sunset",
  sea: "text-sea",
};

const accentBorderLeft: Record<string, string> = {
  sage: "border-l-sage",
  sunset: "border-l-sunset",
  sea: "border-l-sea",
};

interface ServiceDetailCardProps {
  service: ServiceDetail;
  index: number;
}

const ServiceDetailCard = ({ service, index }: ServiceDetailCardProps) => {
  const isEven = index % 2 === 0;
  const num = String(index + 1).padStart(2, "0");

  return (
    <div
      className={cn(
        "group bg-white rounded-2xl shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden v-stack md:h-stack",
        !isEven && "md:h-stack-reverse"
      )}
    >
      {/* Image section */}
      {service.image && (
        <div className="relative w-full md:w-2/5 aspect-[16/10] md:aspect-auto md:min-h-[400px] overflow-hidden">
          <Image
            src={service.image}
            alt={service.title}
            fill
            sizes="(min-width: 768px) 40vw, 100vw"
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
          {/* Mobile gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-forest/60 via-forest/20 to-transparent md:hidden" />
          {/* Desktop accent overlay */}
          <div
            className={cn(
              "absolute inset-0 opacity-0 md:opacity-20 transition-opacity duration-300",
              service.accentColor === "sage" && "bg-sage mix-blend-overlay",
              service.accentColor === "sunset" && "bg-sunset mix-blend-overlay",
              service.accentColor === "sea" && "bg-sea mix-blend-overlay"
            )}
          />
          {/* Mobile: number on image */}
          <span className="absolute bottom-4 left-5 text-[4.5rem] font-bold leading-none text-white/20 pointer-events-none select-none md:hidden">
            {num}
          </span>
          {/* Mobile: subtitle badge on image */}
          <span
            className={cn(
              "absolute top-4 left-5 px-3 py-1 rounded-full text-[0.65rem] font-bold tracking-wider uppercase text-white md:hidden",
              accentBg[service.accentColor]
            )}
          >
            {service.subtitle}
          </span>
        </div>
      )}

      {/* Content section */}
      <div
        className={cn(
          "p-6 md:p-10 md:w-3/5 v-stack relative justify-center",
          "border-l-4 ml-4 md:border-l-0 md:ml-0",
          accentBorderLeft[service.accentColor]
        )}
      >
        {/* Background Number (desktop) */}
        <span
          className={cn(
            "absolute top-4 text-[6rem] font-bold leading-none text-forest/[0.04] pointer-events-none select-none z-0 hidden md:block",
            isEven ? "right-6" : "left-6"
          )}
        >
          {num}
        </span>

        <div className="relative z-10">
          {/* Subtitle (desktop only - mobile shows on image) */}
          <p
            className={cn(
              "text-xs font-bold tracking-wider uppercase mb-2 hidden md:block",
              accentText[service.accentColor]
            )}
          >
            {service.subtitle}
          </p>
          <h3 className="text-2xl md:text-3xl font-serif font-bold text-forest mb-4">
            {service.title}
          </h3>
          <p className="text-gray-600 text-sm md:text-base leading-relaxed mb-8">
            {service.description}
          </p>

          {/* Feature cards */}
          <div className="space-y-3 mb-8">
            {service.features.map((feature, idx) => (
              <motion.div
                key={idx}
                className={cn(
                  "flex gap-3 p-3 rounded-xl border border-forest/5",
                  accentBgLight[service.accentColor]
                )}
                initial={{ opacity: 0, x: -12 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: 0.4, delay: idx * 0.1 }}
              >
                <div
                  className={cn(
                    "w-6 h-6 rounded-lg center flex-shrink-0 mt-0.5",
                    accentBg[service.accentColor]
                  )}
                >
                  <CheckCircle2 className="w-3.5 h-3.5 text-white" />
                </div>
                <div>
                  <p className="font-bold text-forest text-sm">
                    {feature.title}
                  </p>
                  <p className="text-gray-600 text-xs leading-relaxed mt-0.5">
                    {feature.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Tech stack badges */}
          <div className="flex flex-wrap gap-2">
            {service.techStack.map((tech) => (
              <span
                key={tech}
                className={cn(
                  "px-3 py-1.5 text-xs font-medium rounded-lg",
                  accentBgLight[service.accentColor],
                  accentText[service.accentColor]
                )}
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
