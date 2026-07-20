"use client";

import { Fragment, useEffect, useState } from "react";

/**
 * モバイルの課題カルーセル用のスワイプ誘導＋ページネーション。
 * トラック要素のスクロール位置から中央に最も近いカードをアクティブとして表示する。
 * デスクトップではCSSで非表示。
 */
export default function ProblemCarouselNav({
  items,
  trackId,
}: {
  items: { num: string; color: string }[];
  trackId: string;
}) {
  const [active, setActive] = useState(0);

  useEffect(() => {
    const track = document.getElementById(trackId);
    if (!track) return;

    const onScroll = () => {
      const center = track.scrollLeft + track.clientWidth / 2;
      let best = 0;
      let bestDist = Infinity;
      Array.from(track.children).forEach((child, i) => {
        const el = child as HTMLElement;
        const cardCenter = el.offsetLeft + el.offsetWidth / 2;
        const dist = Math.abs(cardCenter - center);
        if (dist < bestDist) {
          bestDist = dist;
          best = i;
        }
      });
      setActive(best);
    };

    track.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => track.removeEventListener("scroll", onScroll);
  }, [trackId]);

  const activeColor = items[active]?.color ?? "blue";

  return (
    <div className="problem__nav" aria-hidden="true">
      <p className="problem__hint">
        <span className="problem__hint-icon">
          <svg viewBox="0 0 24 24">
            <path d="M4 12h4M16 12h4M6.5 9.5L4 12l2.5 2.5M17.5 9.5L20 12l-2.5 2.5" />
            <path d="M9.5 13v4a2 2 0 0 0 2 2h1a2.5 2.5 0 0 0 2.5-2.5V12" />
            <path d="M9.5 13V8.5a1.25 1.25 0 0 1 2.5 0V12" />
          </svg>
        </span>
        横にスワイプして、3つの課題を確認
      </p>
      <div className={`problem__dots problem__dots--${activeColor}`}>
        {items.map((item, i) => (
          <Fragment key={item.num}>
            {i > 0 && (
              <span
                className={`problem__dots-line${i === active || i === active + 1 ? " is-active" : ""}`}
              />
            )}
            <span className={`problem__dots-num${i === active ? " is-active" : ""}`}>
              {item.num}
            </span>
          </Fragment>
        ))}
      </div>
    </div>
  );
}
