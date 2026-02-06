'use client';

import { useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
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
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed top-0 left-0 w-full h-[100dvh] z-[9999] bg-[#F0EEE9] text-[#19231B] flex flex-col overflow-hidden animate-in slide-in-from-right duration-500 ease-in-out texture-grain">

      {/* Ambient Background Blobs (Light Theme) */}
      <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-[#C8E8FF] rounded-full mix-blend-multiply filter blur-[80px] opacity-40 pointer-events-none animate-blob"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-[#DD9348] rounded-full mix-blend-multiply filter blur-[80px] opacity-30 pointer-events-none animate-blob animation-delay-2000"></div>

      {/* Background Watermark Logo */}
      <div className="absolute -bottom-10 -right-10 w-[90vw] h-[90vw] opacity-[0.05] pointer-events-none mix-blend-multiply">
        <Image
          src="/images/logo.png"
          alt=""
          fill
          className="object-contain grayscale"
        />
      </div>

      <nav className="flex flex-col justify-center flex-grow px-8 pb-32 pt-24 space-y-6 z-10" aria-label="モバイルナビゲーション">
        {NAV_ITEMS.map((item, index) => (
          <Link
            key={item.path}
            href={item.path}
            onClick={onClose}
            className={`text-2xl font-sans font-bold tracking-wider transition-all duration-300 transform hover:translate-x-2 hover:text-[#DD9348] animate-in slide-in-from-bottom-2 fade-in ${isActive(item.path) ? "text-[#DD9348]" : "text-[#19231B]"}`}
            style={{ animationDelay: `${index * 60}ms` }}
          >
            {item.label}
          </Link>
        ))}

        <div
          className="pt-8 border-t border-[#19231B]/10 animate-in slide-in-from-bottom-2 fade-in"
          style={{ animationDelay: `${NAV_ITEMS.length * 60}ms` }}
        >
          <p className="text-[10px] text-gray-500 mb-4 font-bold tracking-widest uppercase">{HEADER_COPY.mobilePrompt}</p>
          <Link
            href="/contact"
            onClick={onClose}
            className="inline-flex items-center justify-between gap-3 text-base font-sans font-bold text-[#19231B] hover:text-[#DD9348] transition-colors group"
          >
            <span className="border-b border-[#19231B]/30 pb-0.5 group-hover:border-[#DD9348] transition-colors">{HEADER_COPY.mobileButton}</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </nav>
    </div>
  );
};

export default MobileMenu;
