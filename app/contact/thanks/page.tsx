import type { Metadata } from "next";
import Link from "next/link";
import { CheckCircle, ArrowRight } from "lucide-react";
import { CONTACT_FORM_LABELS } from "@/content/contact";
import EstimateCtaLink from "@/components/shared/EstimateCtaLink";

/**
 * お問い合わせ完了ページ。
 *
 * 送信成功時に `/contact` からリダイレクトされる。コンバージョン地点を一意なURLとして
 * 識別できるようにするためのページで、検索結果には出さない（noindex）。
 *
 * 重要: GA4のコンバージョンは「このURLの到達」ではなくイベント `inquiry_submit` を正とする。
 * 直接アクセスやリロードで件数が水増しされるのを避けるため。
 * （`generate_lead` は Google広告の見積もり完了コンバージョン専用で、この導線では発火しない）
 */
export const metadata: Metadata = {
  title: `${CONTACT_FORM_LABELS.successTitle}｜株式会社クラウドネイチャー`,
  robots: { index: false, follow: false },
};

export default function ContactThanksPage() {
  return (
    <div className="w-full bg-cream">
      <section className="py-24 md:py-32">
        <div className="container mx-auto px-6">
          <div className="mx-auto max-w-2xl rounded-2xl border border-gray-200 bg-white p-8 text-center md:p-12">
            <CheckCircle className="mx-auto mb-4 h-16 w-16 text-sage" />
            <h1 className="mb-2 text-xl font-bold text-forest">
              {CONTACT_FORM_LABELS.successTitle}
            </h1>
            <p className="mb-6 leading-relaxed text-gray-600">
              {CONTACT_FORM_LABELS.successMessage}
            </p>
            <div className="v-stack sm:h-stack justify-center gap-3">
              <Link
                href="/cases"
                className="inline-flex items-center justify-center gap-2 rounded-full bg-mist px-6 py-3 text-sm font-bold text-forest transition-colors hover:bg-gray-200"
              >
                {CONTACT_FORM_LABELS.successCta}
                <ArrowRight className="h-4 w-4" />
              </Link>
              <EstimateCtaLink
                ctaLocation="contact_thanks"
                className="btn-puffy btn-puffy-accent inline-flex items-center justify-center gap-2 rounded-full px-6 py-3 text-sm font-bold text-white"
              >
                {CONTACT_FORM_LABELS.estimateCta}
                <ArrowRight className="h-4 w-4" />
              </EstimateCtaLink>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
