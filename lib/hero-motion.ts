/**
 * TOP ヒーローの登場演出のタイミング（秒）。
 *
 * 背景写真 → 見出し帯 → 見出し1行目 → 2行目 → 本文 → ヘッダー の順に現れる。
 * ヘッダー（components/shared/Header.tsx）とヒーロー本体
 * （components/home/HeroSection.tsx）が別ファイルにあるため、順序が崩れないよう
 * 遅延はここに集約する。アニメーション本体は tailwind.config.ts の
 * animate-hero-* に定義。
 *
 * image を 0 にしているのは、opacity:0 の要素が LCP の計測対象外になるため。
 * 開始を遅らせるとそのぶん LCP が悪化する。
 */
export const HERO_MOTION_DELAY = {
  image: 0,
  eyebrow: 1,
  headingLine1: 1.15,
  headingLine2: 1.3,
  paragraphs: 2.05,
  // 本文（2.05s + 0.9s）が出そろった直後
  header: 3,
} as const;

/** 上記の遅延を style 属性に渡す形へ変換する */
export const heroDelay = (delaySeconds: number) => ({
  animationDelay: `${delaySeconds}s`,
});

/**
 * ヘッダー用。ヘッダーは transition 用の `duration-300` を持っており、
 * tailwindcss-animate はこの `duration-*` を animation-duration にも当てるため、
 * animate-hero-appear の 800ms が 300ms に上書きされてしまう。
 * そのため duration も style 属性で明示する。
 */
export const heroHeaderMotion = {
  ...heroDelay(HERO_MOTION_DELAY.header),
  animationDuration: "800ms",
};
