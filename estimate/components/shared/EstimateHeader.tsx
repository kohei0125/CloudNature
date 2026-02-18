"use client";

import Image from "next/image";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

export default function EstimateHeader() {
  const pathname = usePathname();
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    function handleScroll() {
      setIsScrolled(window.scrollY > 10);
    }
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // チャットページは独自ナビがあるためヘッダー非表示
  if (pathname === "/chat") return null;

  return (
    <header
      className={`fixed left-0 right-0 top-0 z-50 transition-all duration-300 ${
        isScrolled
          ? "bg-white/90 py-2 shadow-sm backdrop-blur-md md:py-3"
          : "bg-transparent py-3 md:py-5"
      }`}
    >
      <div className="container mx-auto flex items-center px-6">
        <a href="https://cloudnature.jp" rel="noopener noreferrer">
          <Image
            src="/images/header_logo.png"
            alt="CloudNature"
            width={180}
            height={50}
            className="h-10 w-auto object-contain transition-all duration-300 md:h-12"
            priority
          />
        </a>
      </div>
    </header>
  );
}
