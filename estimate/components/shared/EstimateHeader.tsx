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
          {/* SVG は余白なしのため、旧 PNG（余白込み h-10/h-12）と見た目が同じサイズになる高さに調整 */}
          <Image
            src="/images/cloudnature_logo_horizontal_color.svg"
            alt="CloudNature"
            width={258}
            height={45}
            className={`h-8 w-auto object-contain transition-all duration-300 md:h-9 ${shouldUseWhiteLogo ? "brightness-0 invert" : ""}`}
            priority
            unoptimized
          />
        </a>
        <nav
          aria-label="補助ナビゲーション"
          className={`ml-auto hidden items-center gap-6 text-sm font-medium md:flex ${shouldUseWhiteLogo ? "text-white/85" : "text-forest/75"
            }`}
        >
          <a
            href="https://cloudnature.jp/company"
            rel="noopener noreferrer"
            className="transition-colors hover:text-sunset"
          >
            会社概要
          </a>
          <a
            href="https://cloudnature.jp/cases"
            rel="noopener noreferrer"
            className="transition-colors hover:text-sunset"
          >
            導入事例
          </a>
          <a
            href="https://cloudnature.jp/contact"
            rel="noopener noreferrer"
            className="transition-colors hover:text-sunset"
          >
            お問い合わせ
          </a>
        </nav>
      </div>
    </header>
  );
}
