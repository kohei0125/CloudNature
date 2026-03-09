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

    let observer: IntersectionObserver | null = null;
    let frameId: number | null = null;
    let cancelled = false;

    const connectObserver = () => {
      if (cancelled) return;

      const target = document.querySelector<HTMLElement>("[data-home-hero]");

      if (!target) {
        frameId = window.requestAnimationFrame(connectObserver);
        return;
      }

      // getBoundingClientRect で即時判定し、Observer の初回コールバック遅延を回避
      const headerHeight = window.innerWidth < 768 ? 48 : 72;
      const rect = target.getBoundingClientRect();
      setIsHeroOverlay(rect.bottom > headerHeight && rect.top < window.innerHeight);

      observer?.disconnect();
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

    const handleResize = () => {
      observer?.disconnect();
      connectObserver();
    };

    connectObserver();

    window.addEventListener("resize", handleResize);
    window.visualViewport?.addEventListener("resize", handleResize);

    return () => {
      cancelled = true;
      if (frameId !== null) {
        window.cancelAnimationFrame(frameId);
      }
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
