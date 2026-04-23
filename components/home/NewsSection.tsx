"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";
import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";
import SectionHeader from "@/components/shared/SectionHeader";
import { NEWS_SECTION, NEWS_CATEGORY_COLORS } from "@/content/home";
import type { NewsItem } from "@/types";

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
      case "お知らせ": return "NOTICE";
      case "事例紹介": return "CASE STUDY";
      case "イベント": return "EVENT";
      case "メディア": return "MEDIA";
      case "ブログ": return "BLOG";
      default: return category;
    }
  };

  return (
    <section id="news" aria-labelledby="news-heading" className="bg-white py-12 md:py-16 overflow-hidden">
      <div className="max-w-6xl mx-auto px-6">
        <SectionHeader
          eyebrow={NEWS_SECTION.eyebrow}
          title={NEWS_SECTION.title}
          cta={NEWS_SECTION.cta}
          eyebrowColor="text-teal-800"
          ctaDesktopOnly
          headingId="news-heading"
        />
      </div>

      {/* PC/タブレット向け カルーセル */}
      <div className="hidden md:block pl-[max(1.5rem,calc((100vw-72rem)/2))] mr-0">
        <div className="relative">
          <div ref={emblaRef} className="overflow-hidden">
            <div className="flex -ml-3 pr-6">
              {items.map((item) => (
                <div
                  key={item.id}
                  className="flex-[0_0_38%] lg:flex-[0_0_25%] pl-3"
                >
                  {(() => {
                    const cardContent = (
                      <>
                        <div className="relative w-full aspect-video overflow-hidden bg-gray-50">
                          {item.image ? (
                            <>
                              <Image
                                src={item.image}
                                alt=""
                                fill
                                className="object-cover blur-md scale-110 opacity-60"
                                sizes="(max-width: 1024px) 45vw, 30vw"
                              />
                              <Image
                                src={item.image}
                                alt={item.title}
                                fill
                                className="object-contain transition-transform duration-500 group-hover:scale-105"
                                sizes="(max-width: 1024px) 45vw, 30vw"
                              />
                            </>
                          ) : (
                            <div className="w-full h-full bg-gradient-to-br from-teal-50 to-teal-100/30" />
                          )}
                        </div>
                        <div className="p-4 flex flex-col flex-1">
                          <h3 className="text-gray-900 font-bold leading-snug mb-1.5 line-clamp-2 text-sm group-hover:text-teal-700 transition-colors">
                            {item.title}
                          </h3>
                          <p className="text-xs text-gray-500 leading-relaxed line-clamp-2 mb-3">
                            {item.excerpt}
                          </p>
                          <div className="mt-auto flex items-center justify-between">
                            <span className="text-xs font-bold text-gray-400 tracking-widest uppercase">
                              {getSourceText(item.category)}
                            </span>
                            <div className="w-6 h-6 rounded-full bg-teal-100 text-teal-800 flex items-center justify-center flex-shrink-0 transition-transform group-hover:bg-teal-800 group-hover:text-white">
                              <ArrowRight className="w-3.5 h-3.5" />
                            </div>
                          </div>
                        </div>
                      </>
                    );
                    return disableLink ? (
                      <div className="group flex flex-col bg-white rounded-lg border border-gray-100/50 shadow-sm h-full overflow-hidden">
                        {cardContent}
                      </div>
                    ) : (
                      <Link
                        href={item.url}
                        className="group flex flex-col bg-white rounded-lg border border-gray-100/50 shadow-sm hover:shadow-lg transition-all duration-300 h-full overflow-hidden"
                      >
                        {cardContent}
                      </Link>
                    );
                  })()}
                </div>
              ))}
            </div>
          </div>

          <div className="flex justify-end items-center gap-3 mt-6 pr-6">
            <div className="text-sm font-bold text-gray-400 mr-2 tracking-widest">
              {selectedIndex + 1} / {scrollSnaps.length}
            </div>
            <button
              onClick={scrollPrev}
              disabled={!canScrollPrev}
              className="btn-carousel-prev disabled:opacity-50"
              aria-label="前へ"
            >
              <ChevronLeft className="w-5 h-5 ml-0.5" />
            </button>
            <button
              onClick={scrollNext}
              disabled={!canScrollNext}
              className="btn-carousel-next disabled:opacity-50"
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
                <div className="relative flex-shrink-0 w-[90px] h-[90px] rounded overflow-hidden bg-gray-50">
                  {item.image ? (
                    <>
                      <Image
                        src={item.image}
                        alt=""
                        fill
                        className="object-cover blur-md scale-110 opacity-60"
                        sizes="90px"
                      />
                      <Image
                        src={item.image}
                        alt={item.title}
                        fill
                        className="object-contain transition-transform group-hover:scale-105"
                        sizes="90px"
                      />
                    </>
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-teal-50 to-teal-100/30" />
                  )}
                </div>
                <div className="flex flex-col justify-between flex-1 py-1 min-w-0 pr-6">
                  <h3 className="text-gray-900 font-bold text-[13px] leading-snug mb-2 line-clamp-2 group-hover:text-teal-700 transition-colors">
                    {item.title}
                  </h3>
                  <div className="flex items-center justify-between mt-auto">
                    <span className="text-[11px] font-bold text-gray-400 tracking-wider uppercase">
                      {getSourceText(item.category)}
                    </span>
                  </div>
                </div>
                <div className="w-5 h-5 rounded-full bg-teal-100 text-teal-800 flex items-center justify-center absolute right-3 bottom-3">
                  <ChevronRight className="w-3 h-3" />
                </div>
              </>
            );
            return disableLink ? (
              <div
                key={item.id}
                className="group relative flex items-center bg-white rounded-lg border border-gray-100 shadow-sm p-3 gap-4"
              >
                {mobileContent}
              </div>
            ) : (
              <Link
                key={item.id}
                href={item.url}
                className="group relative flex items-center bg-white rounded-lg border border-gray-100 shadow-sm hover:shadow-md transition-shadow p-3 gap-4"
              >
                {mobileContent}
              </Link>
            );
          })}
        </div>

        <div className="mt-8">
          <Link
            href={NEWS_SECTION.cta.href}
            className="flex items-center justify-center gap-2 bg-teal-800 text-white font-bold py-3.5 px-6 hover:bg-teal-700 transition-colors text-sm rounded-sm w-full"
          >
            {NEWS_SECTION.cta.label}
            <ArrowRight className="w-4 h-4 ml-1" />
          </Link>
        </div>
      </div>
    </section>
  );
};

export default NewsSection;
