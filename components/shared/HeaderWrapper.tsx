'use client';

import { useEffect, useState, useRef, useCallback } from "react";
import { usePathname } from "next/navigation";
import Header from "./Header";
import MobileMenu from "./MobileMenu";

const HeaderWrapper = () => {
  const pathname = usePathname();

  // TOP のモバイルはメインビジュアルの上にヘッダーを重ねる（白い帯との境目をなくすため）
  return <HeaderWrapperInner key={pathname} isHeroOverlay={pathname === "/"} />;
};

const HeaderWrapperInner = ({ isHeroOverlay }: { isHeroOverlay: boolean }) => {
  const [isVisible, setIsVisible] = useState(true);
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const lastScrollY = useRef(0);
  // メニュー展開中は body が position:fixed でロックされ window.scrollY が 0 になる。
  // その 0 で判定するとヘッダーが誤って透明化・非表示になるため、スクロール判定を止める。
  const isMenuOpenRef = useRef(false);

  useEffect(() => {
    const initScroll = () => {
      lastScrollY.current = window.scrollY;
      setIsScrolled(window.scrollY > 50);
    };
    initScroll();

    const handleScroll = () => {
      if (isMenuOpenRef.current) return;

      const currentScrollY = window.scrollY;

      if (currentScrollY > lastScrollY.current && currentScrollY > 100) {
        setIsVisible(false);
      } else {
        setIsVisible(true);
      }

      setIsScrolled(currentScrollY > 50);
      lastScrollY.current = currentScrollY;
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("resize", handleScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleScroll);
    };
  }, []);

  const handleOpenMobileMenu = useCallback(() => {
    isMenuOpenRef.current = true;
    setMobileMenuOpen(true);
  }, []);

  const handleCloseMobileMenu = useCallback(() => {
    // スクロール位置は useScrollLock の後始末で元に戻る。ロック中の値を取り込んでいないため、
    // 復帰時のスクロールイベントは「変化なし」と判定され、ヘッダーの状態が維持される。
    isMenuOpenRef.current = false;
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
