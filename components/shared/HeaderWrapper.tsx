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
  const heroThresholdRef = useRef(0);

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

      if (isHome && heroThresholdRef.current > 0) {
        setIsHeroOverlay(currentScrollY < heroThresholdRef.current);
      }

      lastScrollY.current = currentScrollY;
    };

    handleScroll();

    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [isHome]);

  useEffect(() => {
    if (!isHome) return;

    let pendingRaf: number | null = null;
    let cancelled = false;
    let boundaryObserver: MutationObserver | null = null;

    const measure = () => {
      pendingRaf = null;
      if (cancelled) return;

      const boundary = document.querySelector<HTMLElement>("[data-hero-dark-end]");
      if (!boundary) {
        waitForBoundary();
        return;
      }

      const header = document.querySelector<HTMLElement>("[data-site-header]");
      const headerHeight = header?.getBoundingClientRect().height ?? getFallbackHeaderHeight();
      heroThresholdRef.current = boundary.getBoundingClientRect().top + window.scrollY - headerHeight;

      if (window.scrollY <= 5) {
        setIsHeroOverlay(true);
      } else {
        setIsHeroOverlay(window.scrollY < heroThresholdRef.current);
      }
    };

    const scheduleSync = () => {
      if (pendingRaf !== null) cancelAnimationFrame(pendingRaf);
      pendingRaf = requestAnimationFrame(measure);
    };

    const waitForBoundary = () => {
      if (boundaryObserver) return;
      boundaryObserver = new MutationObserver(() => {
        if (document.querySelector("[data-hero-dark-end]")) {
          boundaryObserver!.disconnect();
          boundaryObserver = null;
          scheduleSync();
        }
      });
      boundaryObserver.observe(document.body, { childList: true, subtree: true });
    };

    // Phase 1: 即時計測（boundary 未発見なら MutationObserver で待機）
    scheduleSync();

    // Phase 2: フォント読み込み後に再計測
    document.fonts.ready.then(() => {
      if (!cancelled) scheduleSync();
    });

    // Phase 3: load / pageshow / resize で再計測
    window.addEventListener("load", scheduleSync);
    window.addEventListener("pageshow", scheduleSync);
    window.addEventListener("resize", scheduleSync);
    window.visualViewport?.addEventListener("resize", scheduleSync);

    return () => {
      cancelled = true;
      if (pendingRaf !== null) cancelAnimationFrame(pendingRaf);
      boundaryObserver?.disconnect();
      window.removeEventListener("load", scheduleSync);
      window.removeEventListener("pageshow", scheduleSync);
      window.removeEventListener("resize", scheduleSync);
      window.visualViewport?.removeEventListener("resize", scheduleSync);
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
