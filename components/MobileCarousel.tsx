"use client";

import { useState, useRef } from "react";
import { cn } from "@/lib/utils";

const MobileCarousel = ({ children }: { children: React.ReactNode[] }) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);

  const handleScroll = () => {
    if (scrollRef.current) {
      const scrollLeft = scrollRef.current.scrollLeft;
      // Use the first child's width for calculation if available, otherwise estimate
      const itemWidth = scrollRef.current.firstElementChild
        ? (scrollRef.current.firstElementChild as HTMLElement).offsetWidth + 16 // 16 is gap-4
        : scrollRef.current.clientWidth * 0.85;

      const index = Math.round(scrollLeft / itemWidth);
      setActiveIndex(Math.max(0, Math.min(index, children.length - 1)));
    }
  };

  const scrollTo = (index: number) => {
    if (scrollRef.current) {
      const itemWidth = scrollRef.current.firstElementChild
        ? (scrollRef.current.firstElementChild as HTMLElement).offsetWidth + 16
        : scrollRef.current.clientWidth * 0.85;

      scrollRef.current.scrollTo({
        left: index * itemWidth,
        behavior: "smooth",
      });
    }
  };

  return (
    <div className="flex flex-col gap-4">
      {/* Scroll Container */}
      <div
        ref={scrollRef}
        onScroll={handleScroll}
        className="w-full overflow-x-auto pb-4 px-4 snap-x snap-mandatory flex gap-4 hide-scrollbar"
      >
        {children.map((child, index) => (
          <div
            key={index}
            className="snap-center shrink-0 w-[85vw] max-w-[320px]"
          >
            {child}
          </div>
        ))}
        {/* Spacer for proper end padding */}
        <div className="w-1 shrink-0" />
      </div>

      {/* Dots Indicator */}
      <div className="flex justify-center gap-2">
        {children.map((_, index) => (
          <button
            key={index}
            onClick={() => scrollTo(index)}
            className={cn(
              "w-2 h-2 rounded-full transition-all duration-300",
              activeIndex === index
                ? "bg-[#DD9348] w-6"
                : "bg-[#19231B]/20 hover:bg-[#19231B]/40"
            )}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
};

export default MobileCarousel;
