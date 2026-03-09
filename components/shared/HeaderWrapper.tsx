'use client';

import { useEffect, useState, useRef, useCallback } from "react";
import { usePathname } from "next/navigation";
import Header from "./Header";
import MobileMenu from "./MobileMenu";

const getHeroObserverMargin = () =>
  window.innerWidth < 768 ? "-48px 0px 0px 0px" : "-72px 0px 0px 0px";

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

  useEffect(() => {
    if (!isHome) return;

    // ホームページでは初期状態を強制的に true に保ち、
    // ページ描画が安定してから Observer に制御を委譲する
    setIsHeroOverlay(true);

    let observer: IntersectionObserver | null = null;
    let cancelled = false;
    let observerReady = false;

    const timerId = window.setTimeout(() => {
      if (cancelled) return;
      observerReady = true;

      const target = document.querySelector<HTMLElement>("[data-home-hero]");
      if (!target) return;

      observer = new IntersectionObserver(
        ([entry]) => {
          setIsHeroOverlay(entry.isIntersecting);
        },
        {
          rootMargin: getHeroObserverMargin(),
          threshold: 0,
        }
      );

      observer.observe(target);
    }, 300);

    const handleResize = () => {
      if (!observerReady) return;
      observer?.disconnect();

      const target = document.querySelector<HTMLElement>("[data-home-hero]");
      if (!target) return;

      observer = new IntersectionObserver(
        ([entry]) => {
          setIsHeroOverlay(entry.isIntersecting);
        },
        {
          rootMargin: getHeroObserverMargin(),
          threshold: 0,
        }
      );

      observer.observe(target);
    };

    window.addEventListener("resize", handleResize);
    window.visualViewport?.addEventListener("resize", handleResize);

    return () => {
      cancelled = true;
      window.clearTimeout(timerId);
      observer?.disconnect();
      window.removeEventListener("resize", handleResize);
      window.visualViewport?.removeEventListener("resize", handleResize);
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
