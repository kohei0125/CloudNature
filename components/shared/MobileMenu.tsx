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

  useEffect(() => {
    if (isOpen) {
      previousFocusRef.current = document.activeElement as HTMLElement;
      const firstLink = menuRef.current?.querySelector<HTMLElement>("a[href]");
      firstLink?.focus();
    } else {
      previousFocusRef.current?.focus();
    }
  }, [isOpen]);

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
        "!fixed inset-0 w-full h-[100dvh] z-[99999] bg-white text-gray-900 v-stack overflow-hidden overscroll-none transition-opacity duration-200",
        isOpen ? "opacity-100 visible pointer-events-auto" : "opacity-0 invisible pointer-events-none"
      )}
      aria-hidden={!isOpen}
    >
      <button
        type="button"
        onClick={onClose}
        aria-label="メニューを閉じる"
        className="absolute top-5 right-6 z-20 flex items-center gap-2 p-2 text-gray-700 hover:text-teal-800 transition-colors duration-200"
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
              "text-2xl font-bold tracking-wider transition-all duration-300 hover:text-teal-700",
              isPathActive(item.path, pathname) ? "text-teal-800" : "text-gray-900"
            )}
          >
            {item.label}
          </Link>
        ))}

        <div className="pt-8 border-t border-gray-200">
          <p className="text-[10px] text-gray-500 mb-4 font-bold tracking-widest uppercase">{HEADER_COPY.mobilePrompt}</p>
          <Link
            href="/contact"
            onClick={onClose}
            className="inline-flex items-center justify-between gap-3 text-base font-bold text-teal-800 hover:text-teal-700 transition-colors group"
          >
            <span className="border-b border-teal-800/30 pb-0.5 group-hover:border-teal-700 transition-colors">{HEADER_COPY.mobileButton}</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </nav>
    </div>
  );
};

export default MobileMenu;
