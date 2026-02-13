'use client';

import Link from "next/link";
import { usePathname } from "next/navigation";
import Image from "next/image";
import { Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { NAV_ITEMS } from "@/content/common";
import { HEADER_COPY } from "@/content/layout";

interface HeaderProps {
  isScrolled: boolean;
  isVisible: boolean;
  isMobileMenuOpen: boolean;
  onOpenMobileMenu: () => void;
  onCloseMobileMenu: () => void;
}

const Header = ({ isScrolled, isVisible, isMobileMenuOpen, onOpenMobileMenu, onCloseMobileMenu }: HeaderProps) => {
  const pathname = usePathname();

  const isHome = pathname === "/";
  const isHeroOverlay = isHome && !isScrolled;

  const isActive = (path: string) =>
    path === "/" ? pathname === "/" : pathname.startsWith(path);

  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-[999999] transition-all duration-300 transform",
        isVisible || isMobileMenuOpen ? "translate-y-0" : "-translate-y-full",
        isMobileMenuOpen
          ? "bg-transparent"
          : isScrolled
            ? "bg-white/90 backdrop-blur-md shadow-sm py-2 md:py-3"
            : "bg-transparent py-3 md:py-5"
      )}
    >
      <div className="container mx-auto px-6 flex justify-between items-center">
        <Link href="/" className="flex items-center gap-2 group">
          <Image
            src="/images/header_logo.png"
            alt={HEADER_COPY.brand}
            width={180}
            height={50}
            className={cn("object-contain h-10 md:h-12 w-auto transition-all duration-300", isHeroOverlay && "brightness-0 invert")}
            priority
          />
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-8" aria-label="メインナビゲーション">
          {NAV_ITEMS.map((item) => (
            <Link
              key={item.path}
              href={item.path}
              className={cn(
                "text-sm font-medium tracking-wide transition-colors hover:text-sunset relative group",
                isActive(item.path) ? "text-sunset" : isHeroOverlay ? "text-white" : "text-forest"
              )}
            >
              {item.label}
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-sunset transition-all group-hover:w-full"></span>
            </Link>
          ))}
          <Link
            href="/contact"
            className={cn(
              "px-6 py-2 rounded-full text-sm font-bold transition-colors shadow-lg",
              isHeroOverlay ? "bg-white text-forest hover:bg-sunset hover:text-white" : "bg-forest text-white hover:bg-sunset"
            )}
          >
            {HEADER_COPY.consultation}
          </Link>
        </nav>

        {/* Mobile Menu Toggle */}
        <button
          type="button"
          className={cn("md:hidden p-2", isHeroOverlay ? "text-white" : "text-forest")}
          onClick={isMobileMenuOpen ? onCloseMobileMenu : onOpenMobileMenu}
          aria-label={isMobileMenuOpen ? "メニューを閉じる" : "メニューを開く"}
          aria-expanded={isMobileMenuOpen}
          aria-controls="mobile-navigation"
        >
          {isMobileMenuOpen ? <X /> : <Menu />}
        </button>
      </div>
    </header>
  );
};

export default Header;
