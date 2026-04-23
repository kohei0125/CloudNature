"use client";

import { useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { AI_GUIDES_SECTION, AI_GUIDES_ITEMS } from "@/content/home";

const AiGuidesSection = () => {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: "left" | "right") => {
    if (!scrollRef.current) return;
    const amount = 300;
    scrollRef.current.scrollBy({ left: direction === "left" ? -amount : amount, behavior: "smooth" });
  };

  return (
    <section id="ai-guides" className="py-16 md:py-24 bg-white">
      <div className="mx-auto max-w-7xl px-6 md:px-8">
        {/* Header */}
        <div className="flex items-end justify-between mb-8 md:mb-12">
          <div>
            <p className="text-sm font-bold tracking-[0.2em] text-teal-800 mb-2 uppercase">
              {AI_GUIDES_SECTION.eyebrow}
            </p>
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900">
              {AI_GUIDES_SECTION.title}
            </h2>
          </div>
          <div className="hidden md:flex gap-3">
            <button
              onClick={() => scroll("left")}
              className="w-10 h-10 rounded-full border border-gray-300 hover:border-teal-800 hover:bg-teal-50 flex items-center justify-center transition-colors"
              aria-label="前のガイド"
            >
              <ChevronLeft className="w-5 h-5 text-gray-600" />
            </button>
            <button
              onClick={() => scroll("right")}
              className="w-10 h-10 rounded-full border border-gray-300 hover:border-teal-800 hover:bg-teal-50 flex items-center justify-center transition-colors"
              aria-label="次のガイド"
            >
              <ChevronRight className="w-5 h-5 text-gray-600" />
            </button>
          </div>
        </div>

        {/* Cards carousel */}
        <div ref={scrollRef} className="flex gap-5 overflow-x-auto hide-scrollbar -mr-6 md:-mr-8 pr-6 md:pr-8 snap-x snap-mandatory">
          {AI_GUIDES_ITEMS.map((item) => (
            <Link
              key={item.id}
              href={item.url}
              className="flex-shrink-0 w-[260px] md:w-[280px] group snap-start"
            >
              <div className="rounded-xl border border-gray-200 overflow-hidden hover:shadow-md transition-shadow bg-white">
                <div className="relative h-36">
                  <Image
                    src={item.image}
                    alt={item.title}
                    fill
                    sizes="280px"
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
                <div className="p-4">
                  <span className="inline-block px-3 py-0.5 rounded-full bg-teal-100 text-teal-800 text-[10px] font-bold mb-2">
                    {item.category}
                  </span>
                  <h3 className="text-sm font-bold text-gray-900 leading-snug line-clamp-2">
                    {item.title}
                  </h3>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default AiGuidesSection;
