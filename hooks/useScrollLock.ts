'use client';

import { useEffect, useRef } from "react";

/**
 * body のスクロールをロックするカスタムフック。
 * iOS Safari では overflow:hidden だけではスクロールを防げないため
 * position:fixed + touch-action:none で確実にブロックする。
 */
export function useScrollLock(isLocked: boolean) {
  const scrollYRef = useRef(0);

  useEffect(() => {
    if (!isLocked) return;

    scrollYRef.current = window.scrollY;

    const { style } = document.body;
    style.position = "fixed";
    style.top = `-${scrollYRef.current}px`;
    style.left = "0";
    style.right = "0";
    style.overflow = "hidden";
    style.touchAction = "none";

    return () => {
      style.position = "";
      style.top = "";
      style.left = "";
      style.right = "";
      style.overflow = "";
      style.touchAction = "";
      window.scrollTo(0, scrollYRef.current);
    };
  }, [isLocked]);
}
