"use client";

import { useEffect, useRef } from "react";

/** 固定ヘッダー: スクロール後に境界線と影を表示する（スクロールエッジ） */
export default function HeaderScrollEffect({ children }: { children: React.ReactNode }) {
  const headerRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const header = headerRef.current;
    if (!header) return;

    const onScroll = () => {
      header.classList.toggle("is-scrolled", window.scrollY > 8);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header className="site-header" ref={headerRef}>
      {children}
    </header>
  );
}
