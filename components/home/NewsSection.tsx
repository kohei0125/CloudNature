"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";
import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { NEWS_SECTION, NEWS_CATEGORY_COLORS } from "@/content/home";
import type { NewsItem } from "@/types";

const formatDate = (iso: string) => {
  const d = new Date(iso);
  return `${d.getFullYear()}.${String(d.getMonth() + 1).padStart(2, "0")}.${String(d.getDate()).padStart(2, "0")}`;
};

interface NewsSectionProps {
  items: NewsItem[];
  disableLink?: boolean;
}

const NewsSection = ({ items, disableLink = false }: NewsSectionProps) => {
  const [emblaRef, emblaApi] = useEmblaCarousel(
    { loop: true, align: "start", slidesToScroll: 1 },
    [Autoplay({ delay: 5000, stopOnInteraction: true })]
  );

  const [canScrollPrev, setCanScrollPrev] = useState(false);
  const [canScrollNext, setCanScrollNext] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [scrollSnaps, setScrollSnaps] = useState<number[]>([]);

  const scrollPrev = useCallback(() => emblaApi?.scrollPrev(), [emblaApi]);
  const scrollNext = useCallback(() => emblaApi?.scrollNext(), [emblaApi]);

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setSelectedIndex(emblaApi.selectedScrollSnap());
    setCanScrollPrev(emblaApi.canScrollPrev());
    setCanScrollNext(emblaApi.canScrollNext());
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    setScrollSnaps(emblaApi.scrollSnapList());
    onSelect();
    emblaApi.on("select", onSelect);
    emblaApi.on("reInit", onSelect);
    return () => {
      emblaApi.off("select", onSelect);
      emblaApi.off("reInit", onSelect);
    };
  }, [emblaApi, onSelect]);

  const getSourceText = (category: string) => {
    switch (category) {
      case "ニュース": return "NEWS";
      case "事例紹介": return "CASE STUDY";
      case "イベント": return "EVENT";
      case "メディア": return "MEDIA";
      case "ブログ": return "BLOG";
      default: return category;
    }
  };

  return (
    <section className="bg-white py-20 md:py-28 overflow-hidden">
      <div className="max-w-6xl mx-auto px-6">
        {/* ヘッダー部分 */}
        <div className="flex flex-col md:flex-row md:justify-between md:items-start mb-8 lg:mb-12 gap-6 border-b border-stone/40 pb-8">
          <div>
            <h2 className="text-[clamp(1.75rem,5vw,2.5rem)] font-bold text-forest mb-2 font-serif tracking-tight">
              {NEWS_SECTION.title}
            </h2>
            <p className="text-sage font-medium tracking-wide">
              {NEWS_SECTION.eyebrow}
            </p>
          </div>
          <Link
            href={NEWS_SECTION.cta.href}
            className="hidden md:inline-flex items-center justify-center gap-2 bg-forest text-white font-bold py-3 px-6 hover:bg-forest/80 transition-colors text-sm rounded-sm"
          >
            {NEWS_SECTION.cta.label}
            <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
            </svg>
          </Link>
        </div>
      </div>

      {/* PC/タブレット向け カルーセル */}
      <div className="hidden md:block pl-[max(1.5rem,calc((100vw-72rem)/2))] mr-0">
        <div className="relative">
          <div ref={emblaRef} className="overflow-hidden">
            <div className="flex -ml-4 pr-6">
              {items.map((item) => (
                <div
                  key={item.id}
                  className="flex-[0_0_45%] lg:flex-[0_0_30%] pl-4"
                >
                  {(() => {
                    const cardContent = (
                      <>
                        <div className="relative w-full aspect-[16/10] overflow-hidden bg-mist">
                          {item.image ? (
                            <Image
                              src={item.image}
                              alt={item.title}
                              fill
                              className="object-cover transition-transform duration-500 group-hover:scale-105"
                              sizes="(max-width: 1024px) 45vw, 30vw"
                            />
                          ) : (
                            <div className="w-full h-full bg-gradient-to-br from-sage/10 to-cloud/30" />
                          )}
                        </div>
                        <div className="p-6 flex flex-col flex-1">
                          <h3 className="text-forest font-bold leading-relaxed mb-2 line-clamp-3 text-[15px] group-hover:text-sage transition-colors">
                            {item.title}
                          </h3>
                          <p className="text-sm text-gray-500 leading-relaxed line-clamp-2 mb-4">
                            {item.excerpt}
                          </p>
                          <div className="mt-auto flex items-center justify-between">
                            <span className="text-sm font-bold text-forest/60 tracking-widest uppercase">
                              {getSourceText(item.category)}
                            </span>
                            <div className="w-6 h-6 rounded-full bg-sage/20 text-sage flex items-center justify-center transition-transform group-hover:bg-sage group-hover:text-white">
                              <ArrowRight className="w-3.5 h-3.5" />
                            </div>
                          </div>
                        </div>
                      </>
                    );
                    return disableLink ? (
                      <div className="group block bg-white rounded-lg border border-gray-100/50 shadow-sm h-full flex flex-col overflow-hidden">
                        {cardContent}
                      </div>
                    ) : (
                      <Link
                        href={item.url}
                        className="group block bg-white rounded-lg border border-gray-100/50 shadow-sm hover:shadow-lg transition-all duration-300 h-full flex flex-col overflow-hidden"
                      >
                        {cardContent}
                      </Link>
                    );
                  })()}
                </div>
              ))}
            </div>
          </div>

          <div className="flex justify-end items-center gap-4 mt-10 pr-6">
            <div className="text-sm font-bold text-forest/50 mr-2 tracking-widest">
              {selectedIndex + 1} / {scrollSnaps.length}
            </div>
            <button
              onClick={scrollPrev}
              disabled={!canScrollPrev}
              className="w-10 h-10 flex items-center justify-center rounded-full bg-white text-forest shadow-sm hover:bg-sage hover:text-white transition-colors disabled:opacity-50"
              aria-label="前へ"
            >
              <ChevronLeft className="w-5 h-5 ml-0.5" />
            </button>
            <button
              onClick={scrollNext}
              disabled={!canScrollNext}
              className="w-10 h-10 flex items-center justify-center rounded-full bg-sage text-white hover:bg-forest transition-colors disabled:opacity-50"
              aria-label="次へ"
            >
              <ChevronRight className="w-5 h-5 mr-0.5" />
            </button>
          </div>
        </div>
      </div>

      {/* スマホ向け 縦積みリスト（3件固定表示） */}
      <div className="block md:hidden px-6 max-w-md mx-auto">
        <div className="flex flex-col gap-4">
          {items.slice(0, 3).map((item) => {
            const mobileContent = (
              <>
                <div className="relative flex-shrink-0 w-[90px] h-[90px] rounded overflow-hidden bg-mist">
                  {item.image ? (
                    <Image
                      src={item.image}
                      alt={item.title}
                      fill
                      className="object-cover transition-transform group-hover:scale-105"
                      sizes="90px"
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-sage/10 to-cloud/30" />
                  )}
                </div>
                <div className="flex flex-col justify-between flex-1 py-1 min-w-0">
                  <h3 className="text-forest font-bold text-[13px] leading-snug mb-2 line-clamp-3 group-hover:text-sage transition-colors">
                    {item.title}
                  </h3>
                  <div className="flex items-center justify-between mt-auto">
                    <span className="text-[11px] font-bold text-forest/60 tracking-wider uppercase">
                      {getSourceText(item.category)}
                    </span>
                    <div className="w-5 h-5 rounded-full bg-sage text-white flex items-center justify-center flex-shrink-0">
                      <ArrowRight className="w-3 h-3" />
                    </div>
                  </div>
                </div>
              </>
            );
            return disableLink ? (
              <div
                key={item.id}
                className="group flex items-center bg-white rounded-lg border border-gray-100 shadow-sm p-3 gap-4"
              >
                {mobileContent}
              </div>
            ) : (
              <Link
                key={item.id}
                href={item.url}
                className="group flex items-center bg-white rounded-lg border border-gray-100 shadow-sm hover:shadow-md transition-shadow p-3 gap-4"
              >
                {mobileContent}
              </Link>
            );
          })}
        </div>

        {/* スマホ用CTAボタン */}
        <div className="mt-8">
          <Link
            href={NEWS_SECTION.cta.href}
            className="flex items-center justify-center gap-2 bg-forest text-white font-bold py-3.5 px-6 hover:bg-forest/80 transition-colors text-sm rounded-sm w-full"
          >
            {NEWS_SECTION.cta.label}
            <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
            </svg>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default NewsSection;
