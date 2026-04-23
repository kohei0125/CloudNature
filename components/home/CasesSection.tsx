"use client";

import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRef } from "react";
import { CASES_SECTION, CASE_STUDIES } from "@/content/home";

const SmartLink = ({ href, className, children }: { href: string; className: string; children: React.ReactNode }) =>
  href.startsWith('http') ? (
    <a href={href} target="_blank" rel="noopener noreferrer" className={className}>{children}</a>
  ) : (
    <Link href={href} className={className}>{children}</Link>
  );

const CasesSection = () => {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: "left" | "right") => {
    if (!scrollRef.current) return;
    const amount = 320;
    scrollRef.current.scrollBy({ left: direction === "left" ? -amount : amount, behavior: "smooth" });
  };

  return (
    <section id="cases" aria-labelledby="cases-heading" className="py-16 md:py-24 bg-teal text-white relative overflow-hidden">
      <div className="w-full px-6 md:px-12 lg:px-16">
        <div className="grid md:grid-cols-[280px_1fr] gap-8 md:gap-12 items-start">
          {/* Left: Description */}
          <div className="flex flex-col">
            <p className="text-[13px] font-bold tracking-[0.1em] text-white mb-4 uppercase">
              {CASES_SECTION.eyebrow}
            </p>
            <h2 id="cases-heading" className="text-2xl md:text-[28px] font-bold text-white mb-6 leading-snug">
              {CASES_SECTION.titleLine1}
            </h2>
            <p className="text-[13px] text-teal-50/90 leading-relaxed mb-8">
              {CASES_SECTION.description.split('\n').map((line, i) => (
                <span key={i}>
                  {line}
                  {i !== CASES_SECTION.description.split('\n').length - 1 && <br />}
                </span>
              ))}
            </p>
            <Link
              href="/cases"
              className="inline-flex items-center gap-1.5 text-[13px] font-bold text-white hover:opacity-80 transition-opacity"
            >
              {CASES_SECTION.cta} <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {/* Right: Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {CASE_STUDIES.map((study) => (
              <div key={study.id} className="flex flex-col h-full">
                {/* Image with Tag */}
                {study.link ? (
                  <SmartLink href={study.link.href} className="relative block h-[185px] md:h-[220px] w-full overflow-hidden mb-5 group">
                    <Image src={study.image} alt={study.title} fill sizes="(max-width: 768px) 100vw, 33vw" className="object-cover group-hover:scale-105 transition-transform duration-500" />
                  </SmartLink>
                ) : (
                  <div className="relative h-[160px] md:h-[220px] w-full overflow-hidden mb-5">
                    <Image
                      src={study.image}
                      alt={study.title}
                      fill
                      sizes="(max-width: 768px) 100vw, 33vw"
                      className="object-cover"
                    />
                    {/* Tag in bottom left */}
                    <div className="absolute bottom-3 left-3 bg-white rounded-full px-3 py-1">
                      <span className="text-teal text-[11px] font-bold tracking-wide">{study.category}</span>
                    </div>
                  </div>
                )}

                {/* Content */}
                <div className="flex flex-col flex-grow">
                  <h3 className="text-[15px] font-bold text-white leading-snug mb-3">
                    {study.title}
                  </h3>
                  <p className="text-[12px] text-teal-50/90 leading-relaxed mb-5">
                    {study.after.split('。').filter(Boolean).map((sentence, i) => (
                      <span key={i}>
                        {sentence}。
                        {i === 0 && <br />}
                      </span>
                    ))}
                  </p>

                  {/* Link */}
                  {study.link && (
                    <SmartLink href={study.link.href} className="text-white text-[12px] font-bold inline-flex items-center gap-1.5 mt-auto hover:opacity-80 transition-opacity">
                      {study.link.label} <ArrowRight className="w-3.5 h-3.5" />
                    </SmartLink>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default CasesSection;
