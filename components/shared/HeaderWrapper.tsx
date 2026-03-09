'use client';

import { useEffect, useState, useRef, useCallback } from "react";
import { usePathname } from "next/navigation";
import Header from "./Header";
import MobileMenu from "./MobileMenu";

const getFallbackHeaderHeight = () => (window.innerWidth < 768 ? 48 : 72);

const HeaderWrapper = () => {
  const pathname = usePathname();

  return <HeaderWrapperInner key={pathname} pathname={pathname} />;
};

interface HeaderWrapperInnerProps {
  pathname: string;
}

const HeaderWrapperInner = ({ pathname }: HeaderWrapperInnerProps) => {
  const isHome = pathname === "/";
  const [isVisible, setIsVisible] = useState(true);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isHeroOverlay, setIsHeroOverlay] = useState(isHome);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const lastScrollY = useRef(0);

  // スクロール: 表示/非表示 + スクロール状態
  useEffect(() => {
    lastScrollY.current = window.scrollY;

    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      if (currentScrollY > lastScrollY.current && currentScrollY > 100) {
        setIsVisible(false);
      } else {
        setIsVisible(true);
      }

      setIsScrolled(currentScrollY > 50);
      lastScrollY.current = currentScrollY;
    };

    handleScroll();

    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  // ヒーローオーバーレイ: IntersectionObserver で境界要素を監視
  useEffect(() => {
    if (!isHome) return;

    let intersectionObs: IntersectionObserver | null = null;
    let headerResizeObs: ResizeObserver | null = null;
    let mutObs: MutationObserver | null = null;
    let currentBoundary: HTMLElement | null = null;

    const createIntersectionObserver = (boundary: HTMLElement) => {
      intersectionObs?.disconnect();

      const headerEl = document.querySelector<HTMLElement>("[data-site-header]");
      const headerH = headerEl?.offsetHeight ?? getFallbackHeaderHeight();

      intersectionObs = new IntersectionObserver(
        ([entry]) => {
          const freshHeaderH = document.querySelector<HTMLElement>("[data-site-header]")?.offsetHeight ?? headerH;
          setIsHeroOverlay(entry.isIntersecting || entry.boundingClientRect.top > freshHeaderH);
        },
        {
          rootMargin: `-${headerH}px 0px 0px 0px`,
          threshold: 0,
        }
      );
      intersectionObs.observe(boundary);
    };

    const setupObservers = (boundary: HTMLElement) => {
      currentBoundary = boundary;
      createIntersectionObserver(boundary);

      // ヘッダー高さ変化（フォント読込等）で IO を再生成
      if (typeof ResizeObserver !== "undefined") {
        headerResizeObs?.disconnect();
        const headerEl = document.querySelector<HTMLElement>("[data-site-header]");
        if (headerEl) {
          headerResizeObs = new ResizeObserver(() => {
            if (currentBoundary) createIntersectionObserver(currentBoundary);
          });
          headerResizeObs.observe(headerEl);
        }
      }
    };

    // 境界要素を探す。SSG なら DOM に存在するはず。なければ MutationObserver で待機
    const boundary = document.querySelector<HTMLElement>("[data-hero-dark-end]");
    if (boundary) {
      setupObservers(boundary);
    } else {
      mutObs = new MutationObserver(() => {
        const el = document.querySelector<HTMLElement>("[data-hero-dark-end]");
        if (el) {
          mutObs?.disconnect();
          mutObs = null;
          setupObservers(el);
        }
      });
      mutObs.observe(document.body, { childList: true, subtree: true });
    }

    // ビューポートリサイズ時に IO を再生成
    const handleResize = () => {
      if (currentBoundary) createIntersectionObserver(currentBoundary);
    };
    window.addEventListener("resize", handleResize);

    return () => {
      intersectionObs?.disconnect();
      headerResizeObs?.disconnect();
      mutObs?.disconnect();
      window.removeEventListener("resize", handleResize);
    };
  }, [isHome]);

  const handleOpenMobileMenu = useCallback(() => {
    setMobileMenuOpen(true);
  }, []);

  const handleCloseMobileMenu = useCallback(() => {
    setMobileMenuOpen(false);
  }, []);

  return (
    <>
      <Header
        isScrolled={isScrolled}
        isHeroOverlay={isHome && isHeroOverlay}
        isVisible={isVisible}
        isMobileMenuOpen={mobileMenuOpen}
        onOpenMobileMenu={handleOpenMobileMenu}
        onCloseMobileMenu={handleCloseMobileMenu}
      />
      <MobileMenu isOpen={mobileMenuOpen} onClose={handleCloseMobileMenu} />
    </>
  );
};

export default HeaderWrapper;
