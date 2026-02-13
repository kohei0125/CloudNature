"use client";

import { useEffect, useRef, useState } from "react";

interface NumberTickerProps {
  value: number;
  suffix?: string;
  decimals?: number;
  duration?: number;
  className?: string;
}

const NumberTicker = ({
  value,
  suffix = "",
  decimals = 0,
  duration = 1.5,
  className,
}: NumberTickerProps) => {
  const [display, setDisplay] = useState("0");
  const ref = useRef<HTMLSpanElement>(null);
  const hasAnimated = useRef(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasAnimated.current) {
          hasAnimated.current = true;
          animate();
        }
      },
      { threshold: 0.3 }
    );
    observer.observe(el);

    function animate() {
      const start = performance.now();
      const ms = duration * 1000;

      function tick(now: number) {
        const t = Math.min((now - start) / ms, 1);
        const eased = 1 - Math.pow(2, -10 * t);
        const current = eased * value;
        setDisplay(current.toFixed(decimals));
        if (t < 1) requestAnimationFrame(tick);
      }

      requestAnimationFrame(tick);
    }

    return () => observer.disconnect();
  }, [value, decimals, duration]);

  return (
    <span ref={ref} className={className}>
      {display}
      {suffix}
    </span>
  );
};

export default NumberTicker;
