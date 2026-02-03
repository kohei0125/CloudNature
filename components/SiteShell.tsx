'use client';

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Menu, X, Leaf, ArrowRight, ShieldCheck, Check } from "lucide-react";
import { NAV_ITEMS, HEADER_COPY, FOOTER_COPY } from "@/content/strings";
import AIConcierge from "./AIConcierge";

interface Props {
  children: React.ReactNode;
}

const SiteShell = ({ children }: Props) => {
  const pathname = usePathname();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const isActive = (path: string) =>
    path === "/" ? pathname === "/" : pathname.startsWith(path);

  return (
    <div className="flex flex-col min-h-screen font-sans text-[#19231B] selection:bg-[#DD9348] selection:text-white">
      {/* Header */}
      <header
        className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${isScrolled ? "bg-white/90 backdrop-blur-md shadow-sm py-3" : "bg-transparent py-5"
          }`}
      >
        <div className="container mx-auto px-6 flex justify-between items-center">
          <Link href="/" className="flex items-center gap-2 group">
            <div className="relative">
              <Leaf className={`w-8 h-8 transition-colors ${isScrolled ? "text-[#8A9668]" : "text-[#19231B]"}`} />
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-[#DD9348] rounded-full animate-ping opacity-75"></div>
            </div>
            <div>
              <span className="text-xl font-serif font-bold tracking-wider text-[#19231B]">
                {HEADER_COPY.brand}
              </span>
            </div>
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
          <button className="md:hidden p-2" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
            {mobileMenuOpen ? <X /> : <Menu />}
          </button>
        </div>
      </header>

      {/* Mobile Menu Overlay */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-30 bg-[#EDE8E5] pt-24 px-6 md:hidden animate-in slide-in-from-right duration-300">
          <nav className="flex flex-col gap-6" aria-label="モバイルナビゲーション">
            {NAV_ITEMS.map((item) => (
              <Link
                key={item.path}
                href={item.path}
                onClick={() => setMobileMenuOpen(false)}
                className={`text-2xl font-serif font-bold ${isActive(item.path) ? "text-[#DD9348]" : "text-[#19231B]"
                  }`}
              >
                {item.label}
              </Link>
            ))}
            <div className="pt-8 border-t border-gray-300">
              <p className="text-sm text-gray-500 mb-4">{HEADER_COPY.mobilePrompt}</p>
              <Link
                href="/contact"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center justify-between w-full bg-[#19231B] text-white px-6 py-4 rounded-full font-bold shadow-lg"
              >
                <span>{HEADER_COPY.mobileButton}</span>
                <ArrowRight />
              </Link>
            </div>
          </nav>
        </div>
      )}

      {/* Main Content */}
      <main className="flex-grow">{children}</main>

      {/* Footer */}
      <footer className="bg-[#19231B] text-white pt-24 pb-12 relative overflow-hidden">
        <div className="absolute inset-0 opacity-5 bg-[url('/images/wood-pattern.svg')]"></div>
        <div className="absolute top-10 left-10 w-64 h-64 pointer-events-none opacity-5">
          <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg" className="w-full h-full fill-current text-white">
            <path d="M100,0 C120,50 180,80 200,100 C150,120 120,180 100,200 C80,150 20,120 0,100 C50,80 80,20 100,0 Z M100,0 L100,200 M0,100 L200,100" />
          </svg>
        </div>

        <div className="container mx-auto px-6 relative z-10">
          <div className="grid md:grid-cols-4 gap-12 mb-16">
            <div className="md:col-span-2">
              <div className="flex items-center gap-3 mb-6">
                <Leaf className="w-10 h-10 text-[#8A9668]" />
                <span className="text-3xl font-serif font-bold tracking-wide">{HEADER_COPY.brand}</span>
              </div>
              <p className="text-gray-400 leading-loose max-w-md mb-8 pl-1">
                {FOOTER_COPY.taglineLines[0]}
                <br />
                {FOOTER_COPY.taglineLines[1]}
                <br />
                {FOOTER_COPY.taglineLines[2]}
              </p>
              <div className="flex gap-4 pl-1">
                {FOOTER_COPY.socials.map((s) => (
                  <div
                    key={s}
                    className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-[#DD9348] transition-colors cursor-pointer group"
                  >
                    <span className="text-xs font-bold group-hover:text-white">{s}</span>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h4 className="font-bold mb-6 text-[#8A9668] tracking-widest text-sm uppercase">{FOOTER_COPY.serviceHeading}</h4>
              <ul className="space-y-4 text-gray-400 text-sm">
                {FOOTER_COPY.serviceLinks.map((link) => (
                  <li key={link.label}>
                    <Link href={link.path} className="group hover:text-white transition-colors flex items-center gap-2">
                      <ArrowRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" /> {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="font-bold mb-6 text-[#8A9668] tracking-widest text-sm uppercase">{FOOTER_COPY.companyHeading}</h4>
              <ul className="space-y-4 text-gray-400 text-sm">
                {FOOTER_COPY.companyLinks.map((link) => (
                  <li key={link.label}>
                    <Link href={link.path} className="group hover:text-white transition-colors flex items-center gap-2">
                      <ArrowRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" /> {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row justify-between items-center text-xs text-gray-500">
            <p>{FOOTER_COPY.copyright}</p>
            <div className="flex gap-8 mt-4 md:mt-0">
              {FOOTER_COPY.badges.map((badge) => {
                const Icon = badge.icon;
                return (
                  <div key={badge.label} className="flex items-center gap-2">
                    <Icon className="w-4 h-4 text-[#8A9668]" />
                    <span>{badge.label}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </footer>

      <AIConcierge />
    </div>
  );
};

export default SiteShell;
