'use client';

import { useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { NAV_ITEMS } from "@/content/common";
import { HEADER_COPY } from "@/content/layout";

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

const MobileMenu = ({ isOpen, onClose }: MobileMenuProps) => {
  const pathname = usePathname();

  const isActive = (path: string) =>
    path === "/" ? pathname === "/" : pathname.startsWith(path);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
      document.documentElement.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
      document.documentElement.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
      document.documentElement.style.overflow = "";
    };
  }, [isOpen]);

  return (
    <div
      id="mobile-navigation"
      className={cn(
        "!fixed inset-0 w-full h-screen min-h-[100dvh] z-[99999] bg-cream text-forest flex flex-col overflow-y-auto overflow-x-hidden overscroll-none texture-grain transition-opacity duration-200",
        isOpen ? "opacity-100 visible pointer-events-auto" : "opacity-0 invisible pointer-events-none"
      )}
      aria-hidden={!isOpen}
    >
      {/* Ambient Background Blobs (Light Theme) */}
      <div className="absolute top-0 left-0 w-[80vw] h-[80vw] bg-cloud rounded-full mix-blend-multiply filter blur-[80px] opacity-40 pointer-events-none"></div>
      <div className="absolute bottom-0 right-0 w-[80vw] h-[80vw] bg-sunset rounded-full mix-blend-multiply filter blur-[80px] opacity-30 pointer-events-none"></div>

      {/* Background Watermark Logo */}
      {isOpen && (
        <div className="absolute bottom-10 right-0 w-[90vw] h-[90vw] opacity-[0.05] pointer-events-none mix-blend-multiply">
          <Image
            src="/images/logo.png"
            alt=""
            fill
            className="object-contain grayscale"
          />
        </div>
      )}

      <nav className="flex flex-col justify-center flex-grow px-8 pb-32 pt-24 space-y-6 z-10" aria-label="モバイルナビゲーション">
        {NAV_ITEMS.map((item) => (
          <Link
            key={item.path}
            href={item.path}
            onClick={onClose}
            className={cn(
              "text-2xl font-sans font-bold tracking-wider transition-all duration-300 transform hover:text-sunset",
              isActive(item.path) ? "text-sunset" : "text-forest"
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
