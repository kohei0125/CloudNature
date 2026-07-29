import Image from "next/image";
import { COMPANY_MESSAGE } from "@/content/company";

// 代表メッセージ。
// モバイル: セクション冒頭にフルブリード画像を置き、下端を背景色（teal-50）へ溶かして
//           テキストへ流れるエディトリアルな導入にする（ヒーローの縦グラデーションと呼応）。
// PC: 画像を右側に画面端までフルブリードさせ、左端をセクション背景色（teal-50）へ溶かす。
// 画像要素は1つだけにし、レスポンシブなクラス切替のみで二重ダウンロードを避ける。
const CompanyMessage = () => {
  return (
    <section
      id="message"
      aria-labelledby="message-heading"
      className="relative overflow-hidden bg-teal-50"
    >
      {/* 画像（モバイル: 冒頭のフルブリード帯 / PC: 右44%フルブリード） */}
      <div className="relative h-56 w-full sm:h-64 md:absolute md:inset-y-0 md:right-0 md:h-auto md:w-[44%]">
        <Image
          src={COMPANY_MESSAGE.image.src}
          alt={COMPANY_MESSAGE.image.alt}
          fill
          sizes="(min-width: 768px) 44vw, 100vw"
          className="object-cover"
        />
        {/* モバイル: 下端をセクション背景へ溶かしてテキストへつなぐ */}
        <div className="absolute inset-x-0 bottom-0 h-28 bg-gradient-to-b from-transparent to-teal-50 md:hidden" />
        {/* PC: 左端をセクション背景へ溶かす */}
        <div className="absolute inset-0 hidden bg-gradient-to-r from-teal-50 via-teal-50/40 via-20% to-transparent to-55% md:block" />
      </div>

      {/* テキスト */}
      <div className="container relative z-10 mx-auto max-w-6xl px-6 pb-12 pt-6 md:py-16">
        <div className="md:max-w-[52%]">
          <p className="mb-4 text-sm font-bold uppercase tracking-[0.2em] text-teal-800">
            {COMPANY_MESSAGE.eyebrow}
          </p>
          <h2
            id="message-heading"
            className="mb-6 whitespace-pre-line text-[clamp(1.5rem,4vw,2.25rem)] font-bold leading-[1.35] text-forest"
          >
            {COMPANY_MESSAGE.title}
          </h2>
          <div className="space-y-4 text-[14px] leading-[1.85] text-forest/75">
            {COMPANY_MESSAGE.paragraphs.map((paragraph, i) => (
              <p key={i}>{paragraph}</p>
            ))}
          </div>

          {/* 署名 */}
          <div className="mt-6">
            <p className="text-lg font-bold text-forest">{COMPANY_MESSAGE.name}</p>
            <p className="text-sm text-gray-500">{COMPANY_MESSAGE.role}</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CompanyMessage;
