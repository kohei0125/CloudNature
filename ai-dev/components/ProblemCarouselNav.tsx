"use client";

import { Fragment, useCallback, useEffect, useState } from "react";

/**
 * モバイルの課題カルーセル用の操作UI（前へ・次へボタン、ページネーション、現在位置の読み上げ）。
 * トラック要素のスクロール位置から中央に最も近いカードをアクティブとして表示する。
 * デスクトップではCSSで非表示。
 */
export default function ProblemCarouselNav({
  items,
  trackId,
}: {
  items: { num: string; color: string; title: string }[];
  trackId: string;
}) {
  const [active, setActive] = useState(0);
  const total = items.length;

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

  const scrollToIndex = useCallback(
    (index: number) => {
      const track = document.getElementById(trackId);
      if (!track) return;
      const clamped = Math.max(0, Math.min(total - 1, index));
      const child = track.children[clamped] as HTMLElement | undefined;
      if (!child) return;
      track.scrollTo({
        left: child.offsetLeft - (track.clientWidth - child.offsetWidth) / 2,
        behavior: "smooth",
      });
    },
    [trackId, total]
  );

  // 横スクロール専用のトラックにフォーカスがある間は左右キーでカードを送る
  useEffect(() => {
    const track = document.getElementById(trackId);
    if (!track) return;

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") {
        e.preventDefault();
        scrollToIndex(active + 1);
      } else if (e.key === "ArrowLeft") {
        e.preventDefault();
        scrollToIndex(active - 1);
      }
    };

    track.addEventListener("keydown", onKeyDown);
    return () => track.removeEventListener("keydown", onKeyDown);
  }, [trackId, active, scrollToIndex]);

  const activeColor = items[active]?.color ?? "blue";

  return (
    <div className="problem__nav">
      <p className="problem__hint" aria-hidden="true">
        <span className="problem__hint-icon">
          <svg viewBox="0 0 24 24">
            <path d="M4 12h4M16 12h4M6.5 9.5L4 12l2.5 2.5M17.5 9.5L20 12l-2.5 2.5" />
            <path d="M9.5 13v4a2 2 0 0 0 2 2h1a2.5 2.5 0 0 0 2.5-2.5V12" />
            <path d="M9.5 13V8.5a1.25 1.25 0 0 1 2.5 0V12" />
          </svg>
        </span>
        横にスワイプして、3つの課題を確認
      </p>
      <div className="problem__controls">
        <button
          type="button"
          className="problem__nav-btn"
          aria-label="前の課題へ"
          onClick={() => scrollToIndex(active - 1)}
          disabled={active === 0}
        >
          <svg aria-hidden="true" viewBox="0 0 24 24">
            <path d="M15 6l-6 6 6 6" />
          </svg>
        </button>
        <div className={`problem__dots problem__dots--${activeColor}`} aria-hidden="true">
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
        <button
          type="button"
          className="problem__nav-btn"
          aria-label="次の課題へ"
          onClick={() => scrollToIndex(active + 1)}
          disabled={active === total - 1}
        >
          <svg aria-hidden="true" viewBox="0 0 24 24">
            <path d="M9 6l6 6-6 6" />
          </svg>
        </button>
      </div>
      <p className="sr-only" aria-live="polite" aria-atomic="true">
        {total}つの課題の{active + 1}番目：{items[active]?.title}
      </p>
    </div>
  );
}
