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

    let syncFrameId: number | null = null;
    let retryFrameId: number | null = null;
    let cancelled = false;

    const syncHeroOverlay = () => {
      if (cancelled) return;

      const boundary = document.querySelector<HTMLElement>("[data-hero-dark-end]");
      if (!boundary) {
        retryFrameId = window.requestAnimationFrame(syncHeroOverlay);
        return;
      }

      const header = document.querySelector<HTMLElement>("[data-site-header]");
      const headerHeight = header?.getBoundingClientRect().height ?? getFallbackHeaderHeight();
      heroThresholdRef.current = boundary.getBoundingClientRect().top + window.scrollY - headerHeight;
      setIsHeroOverlay(window.scrollY < heroThresholdRef.current);
    };

    syncFrameId = window.requestAnimationFrame(() => {
      syncFrameId = window.requestAnimationFrame(syncHeroOverlay);
    });

    window.addEventListener("load", syncHeroOverlay);
    window.addEventListener("pageshow", syncHeroOverlay);
    window.addEventListener("resize", syncHeroOverlay);
    window.visualViewport?.addEventListener("resize", syncHeroOverlay);

    return () => {
      cancelled = true;
      if (syncFrameId !== null) {
        window.cancelAnimationFrame(syncFrameId);
      }
      if (retryFrameId !== null) {
        window.cancelAnimationFrame(retryFrameId);
      }
      window.removeEventListener("load", syncHeroOverlay);
      window.removeEventListener("pageshow", syncHeroOverlay);
      window.removeEventListener("resize", syncHeroOverlay);
      window.visualViewport?.removeEventListener("resize", syncHeroOverlay);
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
