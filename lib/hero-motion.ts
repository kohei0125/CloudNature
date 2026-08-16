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
/** 本文フェードの開始と長さ。長さは tailwind.config.ts の animate-hero-rise に合わせる */
const PARAGRAPHS_DELAY = 1.55;
const PARAGRAPHS_DURATION = 0.9;

export const HERO_MOTION_DELAY = {
  image: 0,
  eyebrow: 0.5,
  headingLine1: 0.65,
  headingLine2: 0.8,
  paragraphs: PARAGRAPHS_DELAY,
  // 本文が出そろった直後。本文の値から導出して、retiming しても順序が崩れないようにする
  header: PARAGRAPHS_DELAY + PARAGRAPHS_DURATION,
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
