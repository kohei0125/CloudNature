import Image from "next/image";
import { COMPANY_HERO } from "@/content/company";

// 企業情報ページのヒーロー。
// モバイル: 画像を全面背景にし、テキスト帯は白を保ったまま短い距離で写真へ溶かす。
// PC: 画像を右側に画面端までフルブリードさせ、左端を白グラデーションで本文側へ溶かす。
// 画像要素は1つだけにし、レスポンシブなクラス切替のみで二重ダウンロードを避ける。
const CompanyHero = () => {
  return (
    <section
      id="company-hero"
      aria-labelledby="company-hero-heading"
      className="relative overflow-hidden bg-white"
    >
      {/* 画像（モバイル: 全面背景 / PC: 右56%フルブリード） */}
      <div className="absolute inset-0 md:inset-y-0 md:left-auto md:right-0 md:w-[56%]">
        <Image
          src={COMPANY_HERO.image.src}
          alt={COMPANY_HERO.image.alt}
          fill
          priority
          sizes="(min-width: 768px) 56vw, 100vw"
          className="object-cover object-center"
        />
        {/* PC: 左端を白背景へ溶かす（横方向） */}
        <div className="absolute inset-0 hidden bg-gradient-to-r from-white via-white/40 via-20% to-transparent to-55% md:block" />
      </div>

      {/* モバイル: テキスト帯は白を保ち、短い距離で写真へ溶かす（下部の写真は鮮明に見せる） */}
      <div className="absolute inset-0 bg-gradient-to-b from-white from-45% via-white/60 via-60% to-transparent to-78% md:hidden" />

      {/* テキスト */}
      <div className="container relative z-10 mx-auto max-w-6xl px-6 pt-24 pb-36 md:pt-28 md:pb-0">
        <div className="animate-hero-fade-in md:flex md:min-h-[360px] md:max-w-[52%] md:flex-col md:justify-center md:pb-12 lg:min-h-[400px]">
          <p className="mb-5 text-sm font-bold uppercase tracking-[0.2em] text-teal-800">
            {COMPANY_HERO.eyebrow}
          </p>
          <h1
            id="company-hero-heading"
            className="mb-6 text-[clamp(2rem,6vw,3.25rem)] font-bold leading-[1.2] tracking-tight text-forest"
          >
            {/* \n 区切りの各セグメントを inline-block にし、折り返しは区切り位置でのみ起こす */}
            {COMPANY_HERO.title.split("\n").map((segment, i) => (
              <span key={i} className="inline-block">
                {segment}
              </span>
            ))}
          </h1>
          <p className="max-w-xl text-[15px] leading-[1.9] text-gray-600">
            {COMPANY_HERO.description}
          </p>
        </div>
      </div>

    </section>
  );
};

export default CompanyHero;
