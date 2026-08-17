import { getImageProps } from "next/image";
import { cn } from "@/lib/utils";
import { HERO_MOTION_DELAY, heroDelay } from "@/lib/hero-motion";
import { HERO_COPY } from "@/content/home";

// モバイル/PC で異なるヒーロー画像をアートディレクション（<picture>）で出し分ける。
// CSS 出し分け（2つの <Image priority>）では非表示側もダウンロード+プリロードされるため、
// ビューポートに一致する画像のみ取得されるこの形にしている。
// priority: LCP 要素のため loading を eager にする（getImageProps は preload <link> を
// 注入しないため二重プリロードは発生しない）。入力は静的なので props はモジュール読込時に一度だけ算出。
const heroImageCommon = {
  alt: HERO_COPY.heroImageAlt,
  fill: true,
  sizes: "100vw",
  priority: true,
};
const {
  props: { srcSet: heroDesktopSrcSet },
} = getImageProps({ ...heroImageCommon, src: HERO_COPY.pcImageSrc });
const {
  props: { srcSet: heroMobileSrcSet, alt: heroAlt, ...heroImgProps },
} = getImageProps({ ...heroImageCommon, src: HERO_COPY.imageSrc });

const HeroBackground = () => (
  <picture>
    <source media="(min-width: 768px)" srcSet={heroDesktopSrcSet} sizes="100vw" />
    <img
      {...heroImgProps}
      alt={heroAlt}
      srcSet={heroMobileSrcSet}
      fetchPriority="high"
      className="object-cover object-center"
    />
  </picture>
);

// 見出し帯（アイブロウ）。字下げは PC のみ（モバイルは見出し1行目と左端を揃える）
const EYEBROW_CLASS = "md:pl-2 font-bold tracking-wide text-teal-800";

// 日本語の大見出し。Noto Sans JP は 400/700 しか読み込んでいないため、font-extrabold(800) を
// 指定しても実際は 700 で描画される。誤解を避けるため実ウェイトの 700 を明示する。
const HEADING_CLASS = "font-bold tracking-[-0.01em] text-gray-900";

// 本文。各段落2行 + 段落間は行送りの約半分（0.9em）。行送りは 1.8。
// モバイル/PC で変えるのは文字サイズと text-shadow のみ。
const PARAGRAPH_CLASS = "space-y-[0.9em] leading-[1.8] text-gray-800";

// モバイルのヒーロー高。ビューポート「高さ」基準（svh/dvh）にすると、スクロールに伴う
// アドレスバーの伸縮で高さが変わり、背景画像が拡大縮小して見える。幅基準にすると
// スクロール中に値が変わらないため、画像がずれない。
const MOBILE_HERO_HEIGHT = "clamp(560px, 182vw, 820px)";
// テキストを中央よりやや上に置くための下パディング（ヒーロー高に対する比率）
const MOBILE_TEXT_RAISE = 0.16;

// 見出しのフォントサイズ（モバイル / PC）
const HEADING_SIZE = {
  mobile: "clamp(1.05rem, 5.35vw, 1.5rem)",
  pc: "clamp(2rem, 3.5vw, 2.8rem)",
};
// 見出し2行目と説明文の字下げ量（見出しフォントサイズに対する比率）。半角よりやや広い程度。
// 両方を同じ値から導出することで、画面幅が変わっても左端が揃う。
const INDENT_RATIO = 0.6;
const indentOf = (headingSize: string) => `calc(${INDENT_RATIO} * (${headingSize}))`;

// 見出し2行目のうち、強調語だけブランドカラーにする
const headingLine2Parts = HERO_COPY.headingLine2.split(HERO_COPY.headingHighlight);

const HeroHeading = ({ className, size }: { className: string; size: string }) => (
  // 行ごとにワイプさせるため、各行を inline-block で包む
  <p className={cn(HEADING_CLASS, className)} style={{ fontSize: size }}>
    <span className="animate-hero-wipe inline-block" style={heroDelay(HERO_MOTION_DELAY.headingLine1)}>
      {HERO_COPY.headingLine1}
    </span>
    <br />
    {/* 2行目は半角よりやや広い程度に字下げする */}
    <span
      className="animate-hero-wipe inline-block"
      style={{ paddingLeft: indentOf(size), ...heroDelay(HERO_MOTION_DELAY.headingLine2) }}
    >
      {headingLine2Parts.map((part, i) => (
        <span key={i}>
          {part}
          {i < headingLine2Parts.length - 1 && (
            <span className="text-teal-800">{HERO_COPY.headingHighlight}</span>
          )}
        </span>
      ))}
    </span>
  </p>
);

const HeroParagraphs = ({
  className,
  size,
  measure,
}: {
  className: string;
  size: string;
  measure: string;
}) => (
  // 見出し2行目と左端を揃えるための字下げ。字下げ分を max-width に足して、
  // 行長（＝改行位置）が字下げの有無で変わらないようにする。
  <div
    className={cn(PARAGRAPH_CLASS, "animate-hero-rise", className)}
    style={{
      paddingLeft: indentOf(size),
      maxWidth: `calc(${measure} + ${indentOf(size)})`,
      ...heroDelay(HERO_MOTION_DELAY.paragraphs),
    }}
  >
    {HERO_COPY.paragraphs.map((segments, paragraphIndex) => (
      <p key={paragraphIndex}>
        {segments.map((segment, segmentIndex) => (
          // 文節ごとに inline-block にして、改行位置を文節の切れ目だけに限定する
          <span key={segmentIndex} className="inline-block">
            {segment}
          </span>
        ))}
      </p>
    ))}
  </div>
);

const HeroSection = () => {
  return (
    // data-hero-section: ヘッダーの登場演出と透過背景の起点。TOP にしか存在しないことを
    // 利用して app/globals.css が body:has([data-hero-section]) で拾う。
    // 「TOP かどうか」をレイアウト側の usePathname() で判定するとハイドレーション不一致で
    // 本番だけ壊れるため、DOM の実体を起点にしている（詳細は globals.css のコメント）。
    <section id="hero" data-hero-section className="relative overflow-hidden bg-white">
      {/* ヘッダー分のスペーサー。モバイルはヘッダーをメインビジュアルに重ねるため確保しない */}
      <div className="md:pt-[56px]" />

      {/* ===== モバイル: 写真を背景に敷き、中央のテキスト帯だけ白を強めにかける構成 ===== */}
      <div
        className="md:hidden relative flex items-center overflow-hidden"
        style={{
          minHeight: MOBILE_HERO_HEIGHT,
          paddingBottom: `calc(${MOBILE_TEXT_RAISE} * ${MOBILE_HERO_HEIGHT})`,
        }}
      >
        {/* 写真の下端（川）を切り落として橋を下寄りに見せるため、
            ヒーローより高いボックスに敷いて下側をはみ出させる */}
        <div className="animate-hero-image-in absolute inset-x-0 top-0 h-[125%]"
          style={heroDelay(HERO_MOTION_DELAY.image)}>
          <HeroBackground />
        </div>

        {/* テキスト帯を最も白くし、上は空が薄く透ける程度、下は写真をそのまま見せる。
            線形2点だと境目が帯として見えるため、イージングをかけた多段ストップにしている */}
        <div
          aria-hidden
          className="absolute inset-0"
          style={{
            background: [
              "linear-gradient(to bottom",
              "rgba(255,255,255,0.78) 0%",
              "rgba(255,255,255,0.86) 12%",
              "rgba(255,255,255,0.90) 20%",
              "rgba(255,255,255,0.90) 62%",
              "rgba(255,255,255,0.82) 68%",
              "rgba(255,255,255,0.66) 75%",
              "rgba(255,255,255,0.48) 81%",
              "rgba(255,255,255,0.30) 87%",
              "rgba(255,255,255,0.14) 93%",
              "rgba(255,255,255,0.04) 97%",
              "rgba(255,255,255,0) 100%)",
            ].join(", "),
          }}
        />

        <div className="relative w-full px-5">
          {/* SEO: ターゲットコピーを含む見出し帯を h1 とし、ディスプレイコピーは p で表示する */}
          <h1
            className={cn(EYEBROW_CLASS, "animate-hero-wipe text-sm leading-relaxed")}
            style={heroDelay(HERO_MOTION_DELAY.eyebrow)}
          >
            {HERO_COPY.badge}
          </h1>

          {/* 2行目は字下げのぶん長くなるため、320px 幅でも折り返さないサイズに抑えている */}
          <HeroHeading className="mt-7 leading-[1.45]" size={HEADING_SIZE.mobile} />

          <HeroParagraphs
            className="mt-7 text-[clamp(12.5px,3.4vw,14px)] [text-shadow:0_1px_3px_rgba(255,255,255,0.9)]"
            size={HEADING_SIZE.mobile}
            measure="23em"
          />
        </div>
      </div>

      {/* ===== PC: 背景写真 + 左側に白グラデーション ===== */}
      <div className="relative min-h-[600px] lg:min-h-[660px] hidden md:flex items-center">
        <div className="animate-hero-image-in absolute inset-0 z-0"
          style={heroDelay(HERO_MOTION_DELAY.image)}>
          <HeroBackground />
        </div>

        {/* テキスト列の幅はウィンドウ幅に比例しないため、グラデーションも px 基準にして
            どのウィンドウ幅でも文字が写真に重ならないようにする。
            線形2点だと変化の境目が帯として見えるため、イージングをかけた多段ストップで
            長い距離をかけて減衰させている */}
        <div
          className="absolute inset-0 z-[1]"
          style={{
            background: [
              "linear-gradient(to right",
              "#ffffff 0",
              "#ffffff 380px",
              "rgba(255,255,255,0.98) 450px",
              "rgba(255,255,255,0.94) 520px",
              "rgba(255,255,255,0.88) 590px",
              "rgba(255,255,255,0.79) 660px",
              "rgba(255,255,255,0.67) 730px",
              "rgba(255,255,255,0.53) 800px",
              "rgba(255,255,255,0.38) 870px",
              "rgba(255,255,255,0.24) 940px",
              "rgba(255,255,255,0.13) 1010px",
              "rgba(255,255,255,0.05) 1080px",
              "rgba(255,255,255,0) 1150px)",
            ].join(", "),
          }}
        />

        <div
          className="absolute inset-0 z-[2] opacity-[0.06] pointer-events-none"
          style={{
            backgroundImage: 'radial-gradient(#00684B 1.5px, transparent 1.5px)',
            backgroundSize: '24px 24px',
            WebkitMaskImage: 'linear-gradient(to right, black 30%, transparent 80%)',
            maskImage: 'linear-gradient(to right, black 30%, transparent 80%)'
          }}
        />

        <div className="absolute z-[2] top-0 right-0 w-[400px] h-[400px] pointer-events-none -translate-y-1/2 translate-x-1/4">
          <div className="absolute inset-0 bg-teal-400/20 rounded-full" />
        </div>
        <div className="absolute z-[2] bottom-0 left-0 w-[400px] h-[400px] lg:w-[500px] lg:h-[500px] pointer-events-none translate-y-[70%] -translate-x-[15%]">
          <div className="absolute inset-0 bg-teal-400/10 rounded-full" />
        </div>

        <div className="relative z-10 w-full px-10 lg:px-14 py-24">
          <div className="max-w-2xl lg:max-w-3xl">
            {/* SEO: H1 はモバイル側（mobile-first）に一本化。PC側の見出し帯は p で表示 */}
            <p
              className={cn(EYEBROW_CLASS, "animate-hero-wipe mb-7 text-base leading-relaxed")}
              style={heroDelay(HERO_MOTION_DELAY.eyebrow)}
            >
              {HERO_COPY.badge}
            </p>

            {/* 最大 2.8rem。ウィンドウが狭まるほど滑らかに縮小する */}
            <HeroHeading className="mb-9 leading-[1.4]" size={HEADING_SIZE.pc} />

            <HeroParagraphs
              className="text-[15px] [text-shadow:0_1px_3px_rgba(255,255,255,0.9),0_0_14px_rgba(255,255,255,0.85)]"
              size={HEADING_SIZE.pc}
              measure="24em"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
