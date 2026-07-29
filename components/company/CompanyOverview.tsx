import Image from "next/image";
import { Download } from "lucide-react";
import {
  COMPANY_MAP,
  COMPANY_OVERVIEW,
  COMPANY_OVERVIEW_HEADING,
  COMPANY_PROFILE_DOC,
} from "@/content/company";

// 会社概要。左に見出し＋2カラムのテーブル、右に新潟をマークした日本のドットマップを配置する。
const CompanyOverview = () => {
  return (
    <section
      id="overview"
      aria-labelledby="overview-heading"
      className="bg-white py-16 md:py-24 texture-grain"
    >
      <div className="container mx-auto max-w-6xl px-6">
        <div className="grid items-center gap-12 md:grid-cols-[1fr_0.75fr] lg:gap-16">
          {/* 左：見出し＋テーブル＋会社紹介資料 */}
          <div>
            {/* 共有 SectionHeader はモバイルで中央寄せになるため、
                他の企業情報セクションと揃えて常に左揃えの手組みにする */}
            <div className="mb-8 md:mb-12">
              <p className="mb-3 text-sm font-bold uppercase tracking-[0.2em] text-teal-800">
                {COMPANY_OVERVIEW_HEADING.eyebrow}
              </p>
              <h2 id="overview-heading" className="text-2xl font-bold text-forest md:text-3xl">
                {COMPANY_OVERVIEW_HEADING.title}
              </h2>
            </div>

            <dl className="border border-forest/10">
              {COMPANY_OVERVIEW.map((item, i) => (
                <div
                  key={item.label}
                  className={`grid grid-cols-[6.5rem_1fr] gap-x-4 px-5 py-4 md:grid-cols-[8rem_1fr] md:gap-x-6 md:px-7 ${
                    i > 0 ? "border-t border-forest/10" : ""
                  }`}
                >
                  <dt className="text-[13px] font-bold leading-relaxed text-teal-800 md:text-sm">
                    {item.label}
                  </dt>
                  <dd className="text-[13px] leading-relaxed text-forest/80 md:text-sm">
                    {item.value}
                  </dd>
                </div>
              ))}
            </dl>

            {/* 会社紹介資料ダウンロード */}
            <div className="mt-8 text-center">
              <a
                href={COMPANY_PROFILE_DOC.href}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-outline-forest"
              >
                <Download className="h-4 w-4" />
                {COMPANY_PROFILE_DOC.label}
              </a>
              <p className="mt-3 text-[13px] text-forest/60">{COMPANY_PROFILE_DOC.description}</p>
            </div>
          </div>

          {/* 右：新潟をマークした日本のドットマップ（PCのみ表示） */}
          <div className="mx-auto hidden w-full max-w-[380px] md:block">
            <Image
              src={COMPANY_MAP.src}
              alt={COMPANY_MAP.alt}
              width={COMPANY_MAP.width}
              height={COMPANY_MAP.height}
              unoptimized
              className="h-auto w-full"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default CompanyOverview;
