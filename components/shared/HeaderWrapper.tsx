'use client';

import { useEffect, useState, useRef, useCallback } from "react";
import { usePathname } from "next/navigation";
import Header from "./Header";
import MobileMenu from "./MobileMenu";

const HeaderWrapper = () => {
  const pathname = usePathname();
  const isHome = pathname === "/";
  const [isVisible, setIsVisible] = useState(true);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isHeroOverlay, setIsHeroOverlay] = useState(isHome);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const lastScrollY = useRef(0);

  useEffect(() => {
    const syncHeaderState = () => {
      const currentScrollY = window.scrollY;

      if (currentScrollY > lastScrollY.current && currentScrollY > 100) {
        setIsVisible(false);
      } else {
        setIsVisible(true);
      }

      setIsScrolled(currentScrollY > 50);

      if (isHome) {
        if (currentScrollY <= 0) {
          setIsHeroOverlay(true);
          lastScrollY.current = currentScrollY;
          return;
        }

        const hero = document.querySelector<HTMLElement>("[data-home-hero]");

        if (hero) {
          const headerOffset = window.innerWidth < 768 ? 48 : 72;
          setIsHeroOverlay(hero.getBoundingClientRect().bottom > headerOffset);
        } else {
          setIsHeroOverlay(currentScrollY <= 0);
        }
      } else {
        setIsHeroOverlay(false);
      }

      lastScrollY.current = currentScrollY;
    };

    lastScrollY.current = window.scrollY;
    syncHeaderState();

    const frameId = window.requestAnimationFrame(syncHeaderState);
    const timeoutId = window.setTimeout(syncHeaderState, 250);

    window.addEventListener("scroll", syncHeaderState, { passive: true });
    window.addEventListener("resize", syncHeaderState);
    window.addEventListener("pageshow", syncHeaderState);
    window.addEventListener("load", syncHeaderState);
    window.visualViewport?.addEventListener("resize", syncHeaderState);

    return () => {
      window.cancelAnimationFrame(frameId);
      window.clearTimeout(timeoutId);
      window.removeEventListener("scroll", syncHeaderState);
      window.removeEventListener("resize", syncHeaderState);
      window.removeEventListener("pageshow", syncHeaderState);
      window.removeEventListener("load", syncHeaderState);
      window.visualViewport?.removeEventListener("resize", syncHeaderState);
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
        isHeroOverlay={isHeroOverlay}
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
