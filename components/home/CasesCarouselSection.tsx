"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";
import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";
import SectionHeader from "@/components/shared/SectionHeader";
import { USECASES_SECTION, USECASES_ARTICLES } from "@/content/usecases";
import { formatDateJP } from "@/lib/utils";

const CasesCarouselSection = () => {
  /* --- PC carousel --- */
  const pcPlugins = useRef([Autoplay({ delay: 5000, stopOnInteraction: true })]);
  const [pcRef, pcApi] = useEmblaCarousel(
    { loop: true, align: "start", slidesToScroll: 1 },
    pcPlugins.current
  );
  const [pcIndex, setPcIndex] = useState(0);
  const [pcCount, setPcCount] = useState(0);

  const pcPrev = useCallback(() => pcApi?.scrollPrev(), [pcApi]);
  const pcNext = useCallback(() => pcApi?.scrollNext(), [pcApi]);

  const onPcSelect = useCallback(() => {
    if (!pcApi) return;
    setPcIndex(pcApi.selectedScrollSnap());
  }, [pcApi]);

  useEffect(() => {
    if (!pcApi) return;
    setPcCount(pcApi.scrollSnapList().length);
    onPcSelect();
    pcApi.on("select", onPcSelect);
    pcApi.on("reInit", onPcSelect);
    return () => {
      pcApi.off("select", onPcSelect);
      pcApi.off("reInit", onPcSelect);
    };
  }, [pcApi, onPcSelect]);

  /* --- モバイル carousel --- */
  const spPlugins = useRef([Autoplay({ delay: 4000, stopOnInteraction: true })]);
  const [spRef, spApi] = useEmblaCarousel(
    { loop: true, align: "center", slidesToScroll: 1 },
    spPlugins.current
  );
  const [spIndex, setSpIndex] = useState(0);
  const [spCount, setSpCount] = useState(0);

  const onSpSelect = useCallback(() => {
    if (!spApi) return;
    setSpIndex(spApi.selectedScrollSnap());
  }, [spApi]);

  useEffect(() => {
    if (!spApi) return;
    setSpCount(spApi.scrollSnapList().length);
    onSpSelect();
    spApi.on("select", onSpSelect);
    spApi.on("reInit", onSpSelect);
    return () => {
      spApi.off("select", onSpSelect);
      spApi.off("reInit", onSpSelect);
    };
  }, [spApi, onSpSelect]);

  return (
    <section id="usecases" aria-labelledby="usecases-heading" className="bg-white py-12 md:py-16 overflow-hidden">
      <div className="max-w-6xl mx-auto px-6">
        <SectionHeader
          eyebrow={USECASES_SECTION.eyebrow}
          title={USECASES_SECTION.title}
          cta={USECASES_SECTION.cta}
          eyebrowColor="text-teal-800"
          ctaDesktopOnly
          headingId="usecases-heading"
        />
      </div>

      {/* ===== PC/タブレット カルーセル ===== */}
      <div className="hidden md:block pl-[max(1.5rem,calc((100vw-72rem)/2))] mr-0">
        <div className="relative">
          <div ref={pcRef} className="overflow-hidden">
            <div className="flex -ml-3 pr-6">
              {USECASES_ARTICLES.map((article) => (
                <div
                  key={article.id}
                  className="flex-[0_0_38%] lg:flex-[0_0_24%] pl-3"
                >
                  <Link
                    href={`/usecases/${article.id}`}
                    className="group flex flex-col bg-white rounded-lg border border-gray-100/50 shadow-sm hover:shadow-lg transition-all duration-300 h-full overflow-hidden"
                  >
                    <div className="relative w-full aspect-video overflow-hidden bg-gray-50">
                      <Image
                        src={article.image}
                        alt=""
                        fill
                        className="object-cover blur-md scale-110 opacity-60"
                        sizes="(max-width: 1024px) 45vw, 25vw"
                      />
                      <Image
                        src={article.image}
                        alt={article.title}
                        fill
                        className="object-contain transition-transform duration-500 group-hover:scale-105"
                        sizes="(max-width: 1024px) 45vw, 25vw"
                      />
                    </div>
                    <div className="p-3 flex items-center justify-between gap-2">
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2 mb-1.5">
                          <span className="inline-flex px-2 py-0.5 rounded-full bg-teal-50 text-teal-800 text-[10px] font-bold tracking-wide">
                            {article.category}
                          </span>
                          <time className="text-[10px] text-gray-400">
                            {formatDateJP(article.publishedAt)}
                          </time>
                        </div>
                        <h3 className="text-gray-900 font-bold leading-snug line-clamp-2 text-sm group-hover:text-teal-700 transition-colors mb-1">
                          {article.title}
                        </h3>
                        <p className="text-xs text-gray-500 leading-relaxed line-clamp-2">
                          {article.excerpt}
                        </p>
                      </div>
                      <div className="w-5 h-5 flex-shrink-0 rounded-full bg-teal-100 text-teal-800 flex items-center justify-center transition-transform group-hover:bg-teal-800 group-hover:text-white self-end">
                        <ArrowRight className="w-3.5 h-3.5" />
                      </div>
                    </div>
                  </Link>
                </div>
              ))}
            </div>
          </div>

          <div className="flex justify-end items-center gap-3 mt-6 pr-6">
            <div className="text-sm font-bold text-gray-400 mr-2 tracking-widest">
              {pcIndex + 1} / {pcCount}
            </div>
            <button
              onClick={pcPrev}
              className="btn-carousel-prev"
              aria-label="前へ"
            >
              <ChevronLeft className="w-5 h-5 ml-0.5" />
            </button>
            <button
              onClick={pcNext}
              className="btn-carousel-next"
              aria-label="次へ"
            >
              <ChevronRight className="w-5 h-5 mr-0.5" />
            </button>
          </div>
        </div>
      </div>

      {/* ===== スマホ スワイプカルーセル ===== */}
      <div className="block md:hidden">
        <div ref={spRef} className="overflow-hidden px-6">
          <div className="flex -ml-3">
            {USECASES_ARTICLES.map((article) => (
              <div
                key={article.id}
                className="flex-[0_0_85%] pl-3"
              >
                <Link
                  href={`/usecases/${article.id}`}
                  className="group flex flex-col bg-white rounded-lg border border-gray-100 shadow-sm overflow-hidden h-full"
                >
                  <div className="relative w-full aspect-video overflow-hidden bg-gray-50">
                    <Image
                      src={article.image}
                      alt=""
                      fill
                      className="object-cover blur-md scale-110 opacity-60"
                      sizes="85vw"
                    />
                    <Image
                      src={article.image}
                      alt={article.title}
                      fill
                      className="object-contain"
                      sizes="85vw"
                    />
                  </div>
                  <div className="p-3.5 flex items-center justify-between gap-2">
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="inline-flex px-2 py-0.5 rounded-full bg-teal-50 text-teal-800 text-[10px] font-bold tracking-wide">
                          {article.category}
                        </span>
                        <time className="text-[10px] text-gray-400">
                          {formatDateJP(article.publishedAt)}
                        </time>
                      </div>
                      <h3 className="text-gray-900 font-bold text-sm leading-snug line-clamp-2">
                        {article.title}
                      </h3>
                    </div>
                    <div className="w-5 h-5 rounded-full bg-teal-100 text-teal-800 flex items-center justify-center flex-shrink-0 self-end">
                      <ChevronRight className="w-3 h-3" />
                    </div>
                  </div>
                </Link>
              </div>
            ))}
          </div>
        </div>

        <div className="flex flex-col items-center gap-5 mt-5 px-6">
          <div className="flex gap-1.5">
            {Array.from({ length: spCount }).map((_, i) => (
              <button
                key={i}
                onClick={() => spApi?.scrollTo(i)}
                className={`w-2 h-2 rounded-full transition-all ${i === spIndex ? "bg-teal-800 w-5" : "bg-gray-300"}`}
                aria-label={`スライド ${i + 1}`}
              />
            ))}
          </div>
          <Link
            href={USECASES_SECTION.cta.href}
            className="flex items-center justify-center gap-2 bg-teal-800 text-white font-bold py-3 px-6 hover:bg-teal-700 transition-colors text-[13px] rounded-sm w-full"
          >
            {USECASES_SECTION.cta.label}
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </section>
  );
};

export default CasesCarouselSection;
