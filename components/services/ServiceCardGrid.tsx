import { ArrowRight, ExternalLink } from "lucide-react";
import SectionHeader from "@/components/shared/SectionHeader";
import SmartLink, { isExternalHref } from "@/components/shared/SmartLink";
import { ScrollReveal } from "@/components/shared/ScrollReveal";
import type { ServiceScopeItem } from "@/types";

interface ServiceCardGridProps {
  /** section の id（見出しへの直リンク用。見出しの id もここから導出する） */
  id: string;
  eyebrow: string;
  title: string;
  items: ServiceScopeItem[];
}

/**
 * サービス詳細ページ用の、見出し + 説明カードを並べるセクション。
 * 演出は共有の ScrollReveal に任せる（動作軽減設定・JS 無効時の表示もそちらで担保される）。
 */
const ServiceCardGrid = ({ id, eyebrow, title, items }: ServiceCardGridProps) => {
  const headingId = `${id}-heading`;

  return (
    <section
      id={id}
      aria-labelledby={headingId}
      className="py-16 md:py-24 bg-white scroll-mt-24"
    >
      <div className="container mx-auto px-6">
        <SectionHeader eyebrow={eyebrow} title={title} centered headingId={headingId} />

        <ScrollReveal variant="fade-up">
          <ul className="grid gap-4 md:gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {items.map((item) => {
              // 別サイト（AI見積もり）へ出るリンクは ServiceDetailCard と同じ ExternalLink アイコンで示す
              const Icon = item.link && isExternalHref(item.link.href) ? ExternalLink : ArrowRight;

              return (
                <li
                  key={item.title}
                  className="rounded-2xl bg-white border border-forest/10 shadow-sm p-6 md:p-7"
                >
                  <h3 className="font-bold text-forest text-base md:text-lg mb-2 leading-snug">
                    {item.title}
                  </h3>
                  <p className="text-gray-600 text-sm leading-relaxed">{item.description}</p>
                  {item.link ? (
                    // py-3 はモバイルのタップ領域（44px）を確保するためのもの
                    <SmartLink
                      href={item.link.href}
                      className="mt-2 py-3 inline-flex items-center gap-2 text-sm font-bold text-teal-800 hover:gap-3 transition-all"
                    >
                      {item.link.label}
                      <Icon className="w-4 h-4 flex-shrink-0" />
                    </SmartLink>
                  ) : null}
                </li>
              );
            })}
          </ul>
        </ScrollReveal>
      </div>
    </section>
  );
};

export default ServiceCardGrid;
