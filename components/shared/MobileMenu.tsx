'use client';

import { useEffect, useRef, useCallback } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ArrowRight, X } from "lucide-react";
import { cn, isPathActive } from "@/lib/utils";
import { NAV_ITEMS } from "@/content/common";
import { HEADER_COPY } from "@/content/layout";
import { useScrollLock } from "@/hooks/useScrollLock";

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

const MobileMenu = ({ isOpen, onClose }: MobileMenuProps) => {
  const pathname = usePathname();
  const menuRef = useRef<HTMLDivElement>(null);
  const previousFocusRef = useRef<HTMLElement | null>(null);

  useScrollLock(isOpen);

  // フォーカス管理: メニュー開閉時にフォーカスを保存・復元
  useEffect(() => {
    if (isOpen) {
      previousFocusRef.current = document.activeElement as HTMLElement;
      const firstLink = menuRef.current?.querySelector<HTMLElement>("a[href]");
      firstLink?.focus();
    } else {
      previousFocusRef.current?.focus();
    }
  }, [isOpen]);

  // フォーカストラップ & ESC キーハンドラ
  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (e.key === "Escape") {
      onClose();
      return;
    }

    if (e.key === "Tab" && menuRef.current) {
      const focusableElements = menuRef.current.querySelectorAll<HTMLElement>(
        'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])'
      );
      if (focusableElements.length === 0) return;

      const first = focusableElements[0];
      const last = focusableElements[focusableElements.length - 1];

      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    }
  }, [onClose]);

  // isOpen 時のみリスナーを登録
  useEffect(() => {
    if (!isOpen) return;
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, handleKeyDown]);

  return (
    <div
      ref={menuRef}
      id="mobile-navigation"
      role="dialog"
      aria-modal="true"
      aria-label="モバイルメニュー"
      className={cn(
        "!fixed inset-0 w-full h-[100dvh] z-[99999] bg-cream text-forest v-stack overflow-hidden overscroll-none texture-grain transition-opacity duration-200",
        isOpen ? "opacity-100 visible pointer-events-auto" : "opacity-0 invisible pointer-events-none"
      )}
      aria-hidden={!isOpen}
    >
      {/* Ambient Background Blobs (Light Theme) */}
      <div className="absolute top-0 left-0 w-[80vw] h-[80vw] bg-cloud rounded-full mix-blend-multiply filter blur-[80px] opacity-40 pointer-events-none"></div>
      <div className="absolute bottom-0 right-0 w-[80vw] h-[80vw] bg-sunset rounded-full mix-blend-multiply filter blur-[80px] opacity-30 pointer-events-none"></div>

      {/* Close Button */}
      <button
        type="button"
        onClick={onClose}
        aria-label="メニューを閉じる"
        className="absolute top-5 right-6 z-20 flex items-center gap-2 p-2 text-forest hover:text-sunset transition-colors duration-200"
      >
        <span className="text-xs font-bold tracking-widest uppercase">閉じる</span>
        <X className="w-7 h-7" strokeWidth={2.5} />
      </button>

      <nav className="v-stack justify-center flex-1 min-h-0 px-8 pb-[env(safe-area-inset-bottom,2rem)] pt-20 gap-6 z-10" aria-label="モバイルナビゲーション">
        {NAV_ITEMS.map((item) => (
          <Link
            key={item.path}
            href={item.path}
            onClick={onClose}
            aria-current={isPathActive(item.path, pathname) ? "page" : undefined}
            className={cn(
              "text-2xl font-sans font-bold tracking-wider transition-all duration-300 transform hover:text-sunset",
              isPathActive(item.path, pathname) ? "text-sunset" : "text-forest"
            )}
          >
            {item.label}
          </Link>
        ))}

        <div className="pt-8 border-t border-forest/10">
          <p className="text-[10px] text-gray-500 mb-4 font-bold tracking-widest uppercase">{HEADER_COPY.mobilePrompt}</p>
          <Link
            href="/contact"
            onClick={onClose}
            className="inline-flex items-center justify-between gap-3 text-base font-sans font-bold text-forest hover:text-sunset transition-colors group"
          >
            <span className="border-b border-forest/30 pb-0.5 group-hover:border-sunset transition-colors">{HEADER_COPY.mobileButton}</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </nav>
    </div>
  );
};

export default MobileMenu;
