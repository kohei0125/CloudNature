"use client";

import Image from "next/image";
import { usePathname } from "next/navigation";
import { useEffect, useState, useRef } from "react";

export default function EstimateHeader() {
  const pathname = usePathname();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const lastScrollY = useRef(0);
  const shouldUseWhiteLogo = pathname === "/" && !isScrolled;

  useEffect(() => {
    lastScrollY.current = window.scrollY;

    function handleScroll() {
      const currentScrollY = window.scrollY;

      if (currentScrollY > lastScrollY.current && currentScrollY > 100) {
        setIsVisible(false);
      } else {
        setIsVisible(true);
      }

      setIsScrolled(currentScrollY > 10);
      lastScrollY.current = currentScrollY;
    }

    handleScroll(); // initialize

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // チャットページは独自ナビがあるためヘッダー非表示
  if (pathname === "/chat") return null;

  return (
    <header
      className={`fixed left-0 right-0 top-0 z-50 transform transition-all duration-300 ${isVisible ? "translate-y-0" : "-translate-y-full"
        } ${isScrolled
          ? "bg-white/90 py-2 shadow-sm backdrop-blur-md md:py-3"
          : "bg-transparent py-3 md:py-5"
        }`}
    >
      <div className="container mx-auto flex items-center px-6">
        <a href="https://cloudnature.jp" rel="noopener noreferrer">
          <Image
            src="/images/cloudnature.png"
            alt="CloudNature"
            width={215}
            height={50}
            className={`h-10 w-auto object-contain transition-all duration-300 md:h-12 ${shouldUseWhiteLogo ? "brightness-0 invert" : ""}`}
            priority
          />
        </a>
      </div>
    </header>
  );
}
