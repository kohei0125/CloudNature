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
  const syncHeroOverlayRef = useRef<(() => void) | null>(null);

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
        syncHeroOverlayRef.current?.();
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
      syncHeroOverlayRef.current = null;
      return;
    }

    let pendingSettleRaf: number | null = null;
    let cancelled = false;
    let boundaryObserver: MutationObserver | null = null;
    let resizeObserver: ResizeObserver | null = null;
    let observedHero: HTMLElement | null = null;
    let observedHeader: HTMLElement | null = null;
    let stableFrames = 0;
    let lastObservedBoundaryTop = 0;
    let lastObservedHeaderHeight = 0;
    let settleStartTime = 0;

    const disconnectBoundaryObserver = () => {
      boundaryObserver?.disconnect();
      boundaryObserver = null;
    };

    const disconnectResizeObserver = () => {
      resizeObserver?.disconnect();
      resizeObserver = null;
      observedHero = null;
      observedHeader = null;
    };

    const ensureResizeObserver = (hero: HTMLElement, header: HTMLElement | null) => {
      if (typeof ResizeObserver === "undefined") return;

      if (resizeObserver && observedHero === hero && observedHeader === header) {
        return;
      }

      disconnectResizeObserver();
      resizeObserver = new ResizeObserver(() => {
        if (!cancelled) {
          scheduleStableHeroSync();
        }
      });
      resizeObserver.observe(hero);
      observedHero = hero;

      if (header) {
        resizeObserver.observe(header);
        observedHeader = header;
      }
    };

    const readHeroOverlay = () => {
      const hero = document.querySelector<HTMLElement>("[data-home-hero]");
      const boundary = document.querySelector<HTMLElement>("[data-hero-dark-end]");
      if (!hero || !boundary) return null;

      const header = document.querySelector<HTMLElement>("[data-site-header]");
      ensureResizeObserver(hero, header);
      const headerHeight = header?.getBoundingClientRect().height ?? getFallbackHeaderHeight();
      const boundaryTop = boundary.getBoundingClientRect().top;

      return {
        boundaryTop,
        headerHeight,
        isOverlay: boundaryTop > headerHeight + 1,
      };
    };

    const runStableHeroSync = () => {
      pendingSettleRaf = null;
      if (cancelled) return;

      const heroOverlay = readHeroOverlay();
      if (!heroOverlay) {
        waitForBoundary();
        return;
      }

      disconnectBoundaryObserver();

      if (
        Math.abs(heroOverlay.boundaryTop - lastObservedBoundaryTop) <= 1 &&
        Math.abs(heroOverlay.headerHeight - lastObservedHeaderHeight) <= 1
      ) {
        stableFrames += 1;
      } else {
        stableFrames = 0;
      }
      lastObservedBoundaryTop = heroOverlay.boundaryTop;
      lastObservedHeaderHeight = heroOverlay.headerHeight;

      if (stableFrames >= 2 || performance.now() - settleStartTime >= 500) {
        setIsHeroOverlay(heroOverlay.isOverlay);
        return;
      }

      pendingSettleRaf = requestAnimationFrame(runStableHeroSync);
    };

    const scheduleStableHeroSync = () => {
      if (pendingSettleRaf !== null) cancelAnimationFrame(pendingSettleRaf);
      stableFrames = 0;
      lastObservedBoundaryTop = 0;
      lastObservedHeaderHeight = 0;
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

    syncHeroOverlayRef.current = () => {
      const heroOverlay = readHeroOverlay();
      if (!heroOverlay) return;

      disconnectBoundaryObserver();
      setIsHeroOverlay(heroOverlay.isOverlay);
    };

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
      syncHeroOverlayRef.current = null;
      if (pendingSettleRaf !== null) cancelAnimationFrame(pendingSettleRaf);
      disconnectBoundaryObserver();
      disconnectResizeObserver();
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
