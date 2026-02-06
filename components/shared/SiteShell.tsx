'use client';

import { useEffect, useState, useRef } from "react";
import Header from "./Header";
import MobileMenu from "./MobileMenu";
import Footer from "./Footer";
import AIConcierge from "./AIConcierge";

interface Props {
  children: React.ReactNode;
}

const SiteShell = ({ children }: Props) => {
  const [isVisible, setIsVisible] = useState(true);
  const [isScrolled, setIsScrolled] = useState(false);
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

    // Sync initial state
    handleScroll();

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="flex flex-col min-h-screen font-sans text-[#19231B] selection:bg-[#DD9348] selection:text-white">
      <Header
        isScrolled={isScrolled}
        isVisible={isVisible}
        isMobileMenuOpen={mobileMenuOpen}
        onToggleMobileMenu={() => setMobileMenuOpen(!mobileMenuOpen)}
      />
      <MobileMenu isOpen={mobileMenuOpen} onClose={() => setMobileMenuOpen(false)} />
      <main className="flex-grow">{children}</main>
      <Footer />
      <AIConcierge />
    </div>
  );
};

export default SiteShell;
