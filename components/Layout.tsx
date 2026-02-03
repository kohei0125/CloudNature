import React, { useState, useEffect } from 'react';
import { NavLink, Outlet, useLocation } from 'react-router-dom';
import { Menu, X, Leaf, ArrowRight, ShieldCheck, Check } from 'lucide-react';
import { NAV_ITEMS, COLORS } from '../constants';
import AIConcierge from './AIConcierge';

const Layout: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location]);

  return (
    <div className="flex flex-col min-h-screen font-sans text-[#19231B] selection:bg-[#DD9348] selection:text-white">
      {/* Header */}
      <header
        className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
          isScrolled ? 'bg-white/90 backdrop-blur-md shadow-sm py-3' : 'bg-transparent py-5'
        }`}
      >
        <div className="container mx-auto px-6 flex justify-between items-center">
          <NavLink to="/" className="flex items-center gap-2 group">
            <div className="relative">
              <Leaf className={`w-8 h-8 transition-colors ${isScrolled ? 'text-[#8A9668]' : 'text-[#19231B]'}`} />
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-[#DD9348] rounded-full animate-ping opacity-75"></div>
            </div>
            <div>
              <span className={`text-xl font-serif font-bold tracking-wider ${isScrolled ? 'text-[#19231B]' : 'text-[#19231B]'}`}>
                CloudNature
              </span>
            </div>
          </NavLink>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-8">
            {NAV_ITEMS.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) =>
                  `text-sm font-medium tracking-wide transition-colors hover:text-[#DD9348] relative group ${
                    isActive ? 'text-[#DD9348]' : 'text-[#19231B]'
                  }`
                }
              >
                {item.label}
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-[#DD9348] transition-all group-hover:w-full"></span>
              </NavLink>
            ))}
            <NavLink
               to="/contact"
               className="bg-[#19231B] text-white px-6 py-2 rounded-full text-sm font-bold hover:bg-[#DD9348] transition-colors shadow-lg"
            >
              無料相談
            </NavLink>
          </nav>

          {/* Mobile Menu Toggle */}
          <button
            className="md:hidden p-2"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X /> : <Menu />}
          </button>
        </div>
      </header>

      {/* Mobile Menu Overlay */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-30 bg-[#EDE8E5] pt-24 px-6 md:hidden animate-in slide-in-from-right duration-300">
          <nav className="flex flex-col gap-6">
            {NAV_ITEMS.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) =>
                  `text-2xl font-serif font-bold ${isActive ? 'text-[#DD9348]' : 'text-[#19231B]'}`
                }
              >
                {item.label}
              </NavLink>
            ))}
            <div className="pt-8 border-t border-gray-300">
              <p className="text-sm text-gray-500 mb-4">お急ぎの方はこちら</p>
              <NavLink
                to="/contact"
                className="flex items-center justify-between w-full bg-[#19231B] text-white px-6 py-4 rounded-full font-bold shadow-lg"
              >
                <span>無料相談を予約する</span>
                <ArrowRight />
              </NavLink>
            </div>
          </nav>
        </div>
      )}

      {/* Main Content */}
      <main className="flex-grow">
        <Outlet />
      </main>

      {/* Footer */}
      <footer className="bg-[#19231B] text-white pt-24 pb-12 relative overflow-hidden">
         {/* Background Texture Effect */}
         <div className="absolute inset-0 opacity-5 bg-[url('https://www.transparenttextures.com/patterns/wood-pattern.png')]"></div>
         
         {/* Leaf Vein Background Graphic behind Logo */}
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
                <span className="text-3xl font-serif font-bold tracking-wide">CloudNature</span>
              </div>
              <p className="text-gray-400 leading-loose max-w-md mb-8 pl-1">
                「仕組み」で、地方を変える。<br />
                AI時代を共に歩む、あなたのITパートナー。<br />
                受託開発からDX伴走支援まで、誠実にサポートします。
              </p>
              <div className="flex gap-4 pl-1">
                 {/* Social placeholders */}
                 <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-[#DD9348] transition-colors cursor-pointer group">
                    <span className="text-xs font-bold group-hover:text-white">FB</span>
                 </div>
                 <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-[#DD9348] transition-colors cursor-pointer group">
                    <span className="text-xs font-bold group-hover:text-white">X</span>
                 </div>
              </div>
            </div>

            <div>
              <h4 className="font-bold mb-6 text-[#8A9668] tracking-widest text-sm uppercase">Service</h4>
              <ul className="space-y-4 text-gray-400 text-sm">
                <li><NavLink to="/services" className="hover:text-white transition-colors flex items-center gap-2"><ArrowRight className="w-3 h-3 opacity-0 hover:opacity-100 transition-opacity"/> 受託システム開発</NavLink></li>
                <li><NavLink to="/services" className="hover:text-white transition-colors flex items-center gap-2"><ArrowRight className="w-3 h-3 opacity-0 hover:opacity-100 transition-opacity"/> AIエージェント開発</NavLink></li>
                <li><NavLink to="/services" className="hover:text-white transition-colors flex items-center gap-2"><ArrowRight className="w-3 h-3 opacity-0 hover:opacity-100 transition-opacity"/> DX伴走支援</NavLink></li>
              </ul>
            </div>

            <div>
              <h4 className="font-bold mb-6 text-[#8A9668] tracking-widest text-sm uppercase">Company</h4>
              <ul className="space-y-4 text-gray-400 text-sm">
                <li><NavLink to="/philosophy" className="hover:text-white transition-colors">想い (Philosophy)</NavLink></li>
                <li><NavLink to="/cases" className="hover:text-white transition-colors">導入事例</NavLink></li>
                <li><NavLink to="/privacy" className="hover:text-white transition-colors">プライバシーポリシー</NavLink></li>
                <li><NavLink to="/security" className="hover:text-white transition-colors">情報セキュリティ方針</NavLink></li>
              </ul>
            </div>
          </div>

          <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row justify-between items-center text-xs text-gray-500">
            <p>&copy; 2025 CloudNature Co., Ltd. All Rights Reserved.</p>
            <div className="flex gap-8 mt-4 md:mt-0">
               <div className="flex items-center gap-2">
                 <ShieldCheck className="w-4 h-4 text-[#8A9668]" />
                 <span>AI Guidelines</span>
               </div>
               <div className="flex items-center gap-2">
                 <Check className="w-4 h-4 text-[#8A9668]" />
                 <span>GDPR Compliant</span>
               </div>
            </div>
          </div>
        </div>
      </footer>
      
      <AIConcierge />
    </div>
  );
};

export default Layout;