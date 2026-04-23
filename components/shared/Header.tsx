'use client';

import Link from "next/link";
import { usePathname } from "next/navigation";
import Image from "next/image";
import { Menu, X } from "lucide-react";
import { cn, isPathActive } from "@/lib/utils";
import { NAV_ITEMS } from "@/content/common";
import { HEADER_COPY } from "@/content/layout";

interface HeaderProps {
  isScrolled: boolean;
  isHeroOverlay: boolean;
  isVisible: boolean;
  isMobileMenuOpen: boolean;
  onOpenMobileMenu: () => void;
  onCloseMobileMenu: () => void;
}

const Header = ({ isScrolled, isVisible, isMobileMenuOpen, onOpenMobileMenu, onCloseMobileMenu }: HeaderProps) => {
  const pathname = usePathname();

  return (
    <header
      data-site-header
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300 transform bg-white",
        isVisible || isMobileMenuOpen ? "translate-y-0" : "-translate-y-full",
        isScrolled && "shadow-sm"
      )}
    >
      <div className="mx-auto max-w-7xl px-4 md:px-8 flex justify-between items-center h-14 md:h-[56px]">
        <Link href="/" className="flex items-center">
          <Image
            src="/images/cloudnature.png"
            alt={HEADER_COPY.brand}
            width={180}
            height={50}
            className="h-8 w-auto object-contain md:h-10"
            priority
          />
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-5 lg:gap-7" aria-label="メインナビゲーション">
          {NAV_ITEMS.map((item) => (
            <Link
              key={item.path}
              href={item.path}
              aria-current={isPathActive(item.path, pathname) ? "page" : undefined}
              className={cn(
                "text-sm font-medium tracking-wide transition-colors hover:text-teal-700",
                isPathActive(item.path, pathname) ? "text-teal-800 font-bold" : "text-gray-700"
              )}
            >
              {item.label}
            </Link>
          ))}

          <Link
            href="/contact"
            className="btn-primary px-5 py-2 text-sm shadow-none"
          >
            {HEADER_COPY.contactCta}
          </Link>
        </nav>

        {/* Mobile Menu Toggle */}
        <button
          type="button"
          className="flex items-center justify-center w-10 h-10 text-teal-800 md:hidden"
          onClick={isMobileMenuOpen ? onCloseMobileMenu : onOpenMobileMenu}
          aria-label={isMobileMenuOpen ? "メニューを閉じる" : "メニューを開く"}
          aria-expanded={isMobileMenuOpen}
          aria-controls="mobile-navigation"
        >
          {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>
    </header>
  );
};

export default Header;
