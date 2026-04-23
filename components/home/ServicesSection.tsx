"use client";

import Image from "next/image";
import Link from "next/link";
import { useRef, useEffect, useState } from "react";
import { ArrowRight } from "lucide-react";
import { SERVICES_SECTION, SERVICES } from "@/content/home";
import SectionHeader from "@/components/shared/SectionHeader";

/* ── Icon map ── */
const SERVICE_ICONS: Record<string, string> = {
  "ai-support": "/images/renewal/icon_service_1_tr.png",
  ai: "/images/renewal/icon_service_2_tr.png",
  dev: "/images/renewal/icon_service_3_tr.png",
};

/* ── Scroll-reveal hook ── */
function useReveal() {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (mq.matches) {
      setVisible(true);
      return;
    }
    const io = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setVisible(true); io.disconnect(); } },
      { threshold: 0.15 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return { ref, visible };
}

const SERVICE_PATHS: Record<string, string> = {
  dev: "/services/system-dev",
  ai: "/services/ai-agent",
  "ai-support": "/services/ai-support",
};

const NUMBERS = ["01", "02", "03"];

const CARD_CONFIG = [
  { cols: "md:col-span-4", offset: "", delay: "0s" },
  { cols: "md:col-span-4", offset: "", delay: "0.12s" },
  { cols: "md:col-span-4", offset: "", delay: "0.24s" },
] as const;

const ServicesSection = () => {
  const r1 = useReveal();
  const r2 = useReveal();
  const r3 = useReveal();
  const reveals = [r1, r2, r3];

  return (
    <section
      id="services"
      aria-labelledby="services-heading"
      className="relative py-16 md:py-24 overflow-hidden"
      style={{ backgroundColor: "#F6FAFA" }}
    >
      <div className="relative mx-auto max-w-7xl px-6 md:px-8">
        <SectionHeader
          eyebrow={SERVICES_SECTION.eyebrow}
          title={SERVICES_SECTION.title}
          cta={{ label: SERVICES_SECTION.cta, href: "/services" }}
          headingId="services-heading"
        />

        {/* ── Grid ── */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4 md:gap-5 items-stretch">
          {SERVICES.map((service, i) => {
            const cfg = CARD_CONFIG[i];
            const r = reveals[i];
            const isAccent = i === 1;

            return (
              <div
                key={service.id}
                ref={r.ref}
                className={`${cfg.cols} ${cfg.offset} group cursor-pointer flex flex-col`}
                style={{
                  opacity: r.visible ? 1 : 0,
                  transform: r.visible ? "none" : "translateY(20px)",
                  transition: `opacity 0.7s cubic-bezier(0.16,1,0.3,1) ${cfg.delay}, transform 0.7s cubic-bezier(0.16,1,0.3,1) ${cfg.delay}`,
                }}
              >
                <Link href={SERVICE_PATHS[service.id] ?? `/services/${service.id}`} className="block flex-1">
                  <div
                    className="relative overflow-hidden p-6 md:p-7 h-full flex flex-col"
                    style={{
                      borderRadius: "14px",
                      background: isAccent
                        ? "linear-gradient(155deg, #055448 0%, #0A5346 100%)"
                        : "#ffffff",
                      border: isAccent ? "none" : "1px solid rgba(5,84,72,0.07)",
                      boxShadow: isAccent
                        ? "0 8px 32px rgba(5,84,72,0.12)"
                        : "0 1px 2px rgba(5,84,72,0.03)",
                    }}
                  >
                    {/* Decorative number */}
                    <span
                      className="absolute -top-2 right-3 font-black text-[80px] leading-none select-none pointer-events-none"
                      style={{
                        color: isAccent ? "rgba(255,255,255,0.04)" : "rgba(5,84,72,0.035)",
                        fontFamily: "'Inter','Helvetica Neue',sans-serif",
                        letterSpacing: "-0.04em",
                      }}
                      aria-hidden="true"
                    >
                      {NUMBERS[i]}
                    </span>

                    {/* Icon */}
                    <div className="relative z-10 mb-5">
                      <Image
                        src={SERVICE_ICONS[service.id]}
                        alt=""
                        width={56}
                        height={56}
                        className={`object-contain ${isAccent ? "brightness-0 invert opacity-90" : "opacity-85"}`}
                      />
                    </div>

                    {/* Title */}
                    <h3
                      className="relative z-10 text-base font-bold tracking-tight mb-2"
                      style={{ color: isAccent ? "#ffffff" : "#0f1f1b" }}
                    >
                      {service.title}
                    </h3>

                    {/* Description */}
                    <p
                      className="relative z-10 text-[12.5px] leading-[1.85] mb-4"
                      style={{ color: isAccent ? "rgba(255,255,255,0.7)" : "#4b5563" }}
                    >
                      {service.description}
                    </p>

                    {/* Tags */}
                    <p
                      className="relative z-10 text-[11px] font-semibold tracking-[0.05em] mt-auto"
                      style={{ color: isAccent ? "rgba(128,203,196,0.9)" : "#055448" }}
                    >
                      {service.techStack.join(" / ")}
                    </p>
                  </div>
                </Link>

                {/* External CTA (AI support only) */}
                {service.ctaUrl && (
                  <Link
                    href={service.ctaUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-[11px] font-bold mt-3 ml-1 transition-colors duration-300 group/link"
                    style={{ color: "#055448" }}
                  >
                    <span className="border-b border-transparent group-hover/link:border-current transition-colors duration-300">
                      {service.ctaLabel}
                    </span>
                    <ArrowRight className="w-3 h-3 group-hover/link:translate-x-0.5 transition-transform duration-300" />
                  </Link>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default ServicesSection;
