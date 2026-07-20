"use client";

import { useEffect } from "react";

const GROUP_SELECTORS = [
  ".problem .card-grid > *",
  ".features__grid > *",
  ".comparison__grid > *",
  ".agenda__grid > *",
  ".talks > *",
  ".speaker__panel",
  ".application__grid > *",
  ".closing__inner > *",
];

/** スクロール出現（reduced-motion時・IntersectionObserver非対応時は静的表示のまま） */
export default function ScrollReveal() {
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    if (!("IntersectionObserver" in window)) return;

    const targets: Element[] = [];

    GROUP_SELECTORS.forEach((selector) => {
      const els = document.querySelectorAll(selector);
      els.forEach((el, i) => {
        el.classList.add("reveal");
        (el as HTMLElement).style.transitionDelay = `${i * 70}ms`;
        targets.push(el);
      });
    });

    document.querySelectorAll("main .section-title").forEach((el) => {
      el.classList.add("reveal");
      targets.push(el);
    });

    const marker = document.querySelector(".marker");
    if (marker) marker.classList.add("marker-init");

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            io.unobserve(entry.target);
          }
        });
      },
      { rootMargin: "0px 0px -10% 0px", threshold: 0.1 }
    );

    targets.forEach((t) => io.observe(t));

    return () => io.disconnect();
  }, []);

  return null;
}
