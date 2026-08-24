"use client";

import { useEffect, useRef, type ReactNode } from "react";

/**
 * 記事内の横スクロールする表（.table-scroll）に data-scrollable を付ける。
 *
 * 端の影だけではスクロールできることが伝わらなかったため、表の下に
 * 「横にスライドできます」（.table-scroll-hint）を置いている。ただし
 * 実際にはみ出していない表にヒントを出すと嘘になるので、ここで実測して
 * 出し分ける。CSS 側の既定値は app/globals.css を参照。
 *
 * NewsBody をクライアント化すると sanitize-html までバンドルに載るため、
 * DOM を触る役目だけをこの薄いラッパーに切り出している。
 */
const TableScrollHints = ({ children }: { children: ReactNode }) => {
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    const scrollers = Array.from(root.querySelectorAll<HTMLElement>(".table-scroll"));
    if (scrollers.length === 0) return;

    // 右端まで見たあとはヒントの役目が終わるので消す
    const sync = (el: HTMLElement) => {
      const remaining = el.scrollWidth - el.clientWidth - el.scrollLeft;
      el.dataset.scrollable = remaining > 1 ? "true" : "false";
    };
    const syncAll = () => scrollers.forEach(sync);
    const handleScroll = (event: Event) => sync(event.currentTarget as HTMLElement);

    syncAll();

    const observer = new ResizeObserver(syncAll);
    scrollers.forEach((el) => {
      observer.observe(el);
      el.addEventListener("scroll", handleScroll, { passive: true });
    });

    // 和文フォントの読み込みで列幅が変わることがあるので、確定後にもう一度測る
    let cancelled = false;
    document.fonts?.ready.then(() => {
      if (!cancelled) syncAll();
    });

    return () => {
      cancelled = true;
      observer.disconnect();
      scrollers.forEach((el) => el.removeEventListener("scroll", handleScroll));
    };
  }, []);

  return <div ref={rootRef}>{children}</div>;
};

export default TableScrollHints;
