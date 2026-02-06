'use client';

import Link from "next/link";
import { usePathname } from "next/navigation";
import Image from "next/image";
import { Menu, X } from "lucide-react";
import { NAV_ITEMS } from "@/content/common";
import { HEADER_COPY } from "@/content/layout";

interface HeaderProps {
  isScrolled: boolean;
  isVisible: boolean;
  isMobileMenuOpen: boolean;
  onToggleMobileMenu: () => void;
}

const Header = ({ isScrolled, isVisible, isMobileMenuOpen, onToggleMobileMenu }: HeaderProps) => {
  const pathname = usePathname();

  const isActive = (path: string) =>
    path === "/" ? pathname === "/" : pathname.startsWith(path);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-[10000] transition-all duration-300 transform ${isVisible ? "translate-y-0" : "-translate-y-full"
        } ${isScrolled ? "bg-white/90 backdrop-blur-md shadow-sm py-2 md:py-3" : "bg-transparent py-3 md:py-5"
        }`}
    >
      <div className="container mx-auto px-6 flex justify-between items-center">
        <Link href="/" className="flex items-center gap-2 group">
          <Image
            src="/images/header_logo.png"
            alt={HEADER_COPY.brand}
            width={180}
            height={50}
            className="object-contain h-10 md:h-12 w-auto"
            priority
          />
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-8" aria-label="メインナビゲーション">
          {NAV_ITEMS.map((item) => (
            <Link
              key={item.path}
              href={item.path}
              className={`text-sm font-medium tracking-wide transition-colors hover:text-[#DD9348] relative group ${isActive(item.path) ? "text-[#DD9348]" : "text-[#19231B]"
                }`}
            >
              {item.label}
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-[#DD9348] transition-all group-hover:w-full"></span>
            </Link>
          ))}
          <Link
            href="/contact"
            className="bg-[#19231B] text-white px-6 py-2 rounded-full text-sm font-bold hover:bg-[#DD9348] transition-colors shadow-lg"
          >
            {HEADER_COPY.consultation}
          </Link>
        </nav>

        {/* Mobile Menu Toggle */}
        <button className="md:hidden p-2" onClick={onToggleMobileMenu}>
          {isMobileMenuOpen ? <X /> : <Menu />}
        </button>
      </div>
    </header>
  );
};

export default Header;
