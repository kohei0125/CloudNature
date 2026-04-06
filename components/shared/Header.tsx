'use client';

import { useEffect, useState } from "react";
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

const Header = ({ isScrolled, isHeroOverlay, isVisible, isMobileMenuOpen, onOpenMobileMenu, onCloseMobileMenu }: HeaderProps) => {
  const pathname = usePathname();

  // SSG HTML は Vercel 上で isHeroOverlay の値が不定になる場合がある。
  // hydration ミスマッチを回避するため、SSG では常に白ロゴ表示とし、
  // マウント後に JS で正しい状態に切り替える。
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    const mount = () => setMounted(true);
    mount();
  }, []);

  // SSG: 常に黒ロゴ表示（mounted=false → heroMode=false）
  // クライアント: isHeroOverlay に従う
  const heroMode = mounted ? isHeroOverlay : false;

  return (
    <header
      data-site-header
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300 transform",
        isVisible || isMobileMenuOpen ? "translate-y-0" : "-translate-y-full",
        isMobileMenuOpen
          ? "bg-transparent"
          : isScrolled
            ? heroMode
              ? "bg-transparent py-1.5 md:py-2"
              : "bg-transparent py-1.5 md:bg-white/90 md:py-2 md:backdrop-blur-md md:shadow-sm"
            : "bg-transparent py-1.5 md:py-2"
      )}
    >
      <div className="mx-auto max-w-full px-4 md:px-16 flex justify-between items-center">
        <Link href="/" className="flex items-center gap-2 group relative">
          {/* 白ロゴ（ヒーローオーバーレイ時） */}
          <Image
            src="/images/cloudnature_white.png"
            alt={HEADER_COPY.brand}
            width={180}
            height={50}
            style={{ opacity: heroMode ? 1 : 0, transition: "opacity 300ms" }}
            className="h-10 w-auto object-contain md:h-12"
            priority
          />
          {/* 黒ロゴ（通常時） */}
          <Image
            src="/images/cloudnature.png"
            alt=""
            width={180}
            height={50}
            style={{ opacity: heroMode ? 0 : 1, transition: "opacity 300ms" }}
            className="absolute inset-y-0 left-0 my-auto h-10 w-auto object-contain md:h-11"
            aria-hidden
          />
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-6 lg:gap-8" aria-label="メインナビゲーション">
          {NAV_ITEMS.map((item) => (
            <Link
              key={item.path}
              href={item.path}
              aria-current={isPathActive(item.path, pathname) ? "page" : undefined}
              className={cn(
                "text-sm font-medium tracking-wide transition-colors hover:text-sunset relative group",
                isPathActive(item.path, pathname) ? "text-sunset" : heroMode ? "text-white" : "text-forest"
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
              heroMode ? "bg-white text-forest hover:bg-sunset hover:text-white" : "bg-sunset text-white hover:bg-forest"
            )}
          >
            {HEADER_COPY.consultation}
          </Link>
        </nav>

        {/* Mobile Menu Toggle */}
        <button
          type="button"
          className={cn(
            "absolute right-0 inset-y-0 flex w-12 flex-col items-center justify-center gap-0.5 shadow-lg transition-colors md:hidden",
            isMobileMenuOpen
              ? "text-forest"
              : heroMode
                ? "bg-white text-sunset"
                : "bg-sunset text-white"
          )}
          onClick={isMobileMenuOpen ? onCloseMobileMenu : onOpenMobileMenu}
          aria-label={isMobileMenuOpen ? "メニューを閉じる" : "メニューを開く"}
          aria-expanded={isMobileMenuOpen}
          aria-controls="mobile-navigation"
        >
          {isMobileMenuOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
          <span className="text-[8px] font-semibold leading-none tracking-[0.18em]">MENU</span>
        </button>
      </div>
    </header>
  );
};

export default Header;
