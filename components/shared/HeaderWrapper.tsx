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
  const applyHeroOverlayRef = useRef<(() => void) | null>(null);

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

      if (isHome) {
        applyHeroOverlayRef.current?.();
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
    if (!isHome) {
      heroThresholdRef.current = 0;
      applyHeroOverlayRef.current = null;
      return;
    }

    let pendingSettleRaf: number | null = null;
    let cancelled = false;
    let boundaryObserver: MutationObserver | null = null;
    let stableFrames = 0;
    let lastObservedScrollY = 0;
    let settleStartTime = 0;

    const disconnectBoundaryObserver = () => {
      boundaryObserver?.disconnect();
      boundaryObserver = null;
    };

    const measureBoundary = () => {
      const boundary = document.querySelector<HTMLElement>("[data-hero-dark-end]");
      if (!boundary) return false;

      const header = document.querySelector<HTMLElement>("[data-site-header]");
      const headerHeight = header?.getBoundingClientRect().height ?? getFallbackHeaderHeight();
      heroThresholdRef.current = boundary.getBoundingClientRect().top + window.scrollY - headerHeight;
      disconnectBoundaryObserver();

      return true;
    };

    const applyHeroOverlay = () => {
      const currentScrollY = window.scrollY;

      if (currentScrollY <= 5) {
        setIsHeroOverlay(true);
        return;
      }

      if (heroThresholdRef.current > 0) {
        setIsHeroOverlay(currentScrollY < heroThresholdRef.current);
      }
    };

    const runStableHeroSync = () => {
      pendingSettleRaf = null;
      if (cancelled) return;

      if (!measureBoundary()) {
        waitForBoundary();
        return;
      }

      const currentScrollY = window.scrollY;
      if (Math.abs(currentScrollY - lastObservedScrollY) <= 1) {
        stableFrames += 1;
      } else {
        stableFrames = 0;
      }
      lastObservedScrollY = currentScrollY;

      if (stableFrames >= 2 || performance.now() - settleStartTime >= 500) {
        applyHeroOverlay();
        return;
      }

      pendingSettleRaf = requestAnimationFrame(runStableHeroSync);
    };

    const scheduleStableHeroSync = () => {
      if (pendingSettleRaf !== null) cancelAnimationFrame(pendingSettleRaf);
      stableFrames = 0;
      lastObservedScrollY = window.scrollY;
      settleStartTime = performance.now();
      pendingSettleRaf = requestAnimationFrame(runStableHeroSync);
    };

    const waitForBoundary = () => {
      if (boundaryObserver) return;
      boundaryObserver = new MutationObserver(() => {
        if (document.querySelector("[data-hero-dark-end]")) {
          disconnectBoundaryObserver();
          scheduleStableHeroSync();
        }
      });
      boundaryObserver.observe(document.body, { childList: true, subtree: true });
    };

    applyHeroOverlayRef.current = applyHeroOverlay;

    scheduleStableHeroSync();

    document.fonts?.ready.then(() => {
      if (!cancelled) scheduleStableHeroSync();
    });

    window.addEventListener("load", scheduleStableHeroSync);
    window.addEventListener("pageshow", scheduleStableHeroSync);
    window.addEventListener("resize", scheduleStableHeroSync);
    window.visualViewport?.addEventListener("resize", scheduleStableHeroSync);

    return () => {
      cancelled = true;
      applyHeroOverlayRef.current = null;
      if (pendingSettleRaf !== null) cancelAnimationFrame(pendingSettleRaf);
      disconnectBoundaryObserver();
      window.removeEventListener("load", scheduleStableHeroSync);
      window.removeEventListener("pageshow", scheduleStableHeroSync);
      window.removeEventListener("resize", scheduleStableHeroSync);
      window.visualViewport?.removeEventListener("resize", scheduleStableHeroSync);
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
