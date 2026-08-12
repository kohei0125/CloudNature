/**
 * GA4 計測ヘルパー（コーポレートサイト）。
 *
 * 全サイトの問い合わせ完了を `inquiry_submit` に統一し、種別は `lead_type`
 * パラメータで分離する。週次の「Organic経由の問い合わせ件数」はこのイベントを正とする。
 *
 * ⚠️ `generate_lead` / `contact_submit` を統一イベントに使わないこと。
 * この2つは Google広告に「見積もり完了＝主コンバージョン（入札最適化対象）」
 * 「お問い合わせ＝補助コンバージョン」としてインポート済みで、意味が固定されている
 * （docs/20260410_google_ads_setup_guide.md:59-67）。
 * 通常問い合わせや研修相談を `generate_lead` に相乗りさせると、広告の入札最適化の
 * 母集団が変わってしまう。GA4→広告のインポートはイベント名単位で行われ、
 * `lead_type` では分離できないため、KPI用に独立したイベント名を使う。
 *
 * 個人情報（氏名・メールアドレス・電話番号・会社名・自由入力本文）は
 * いかなるパラメータにも含めないこと。
 *
 * 設計の詳細: docs/20260812_organic_inquiry_tracking_review.md
 */

/**
 * このサイトから送信しうる問い合わせの種別。
 * GA4 のカスタムディメンション `lead_type` として登録する。
 *
 * 他サイトは別の値を送る（`ai_estimate` = AI見積もり、`training_consultation` = AI研修LP、
 * `academy_consultation` = AIアカデミー）。全体の一覧は
 * docs/20260812_organic_inquiry_tracking_review.md を参照。
 * ここで送れる値を絞っているのは、誤って他サイトの種別を送らないようにするため。
 */
export type LeadType = "contact_form";

/**
 * AI見積もりへの導線の配置。どのCTAが効いているかを分離するために使う。
 * 値を増やしたら docs/20260812_ga4_conversion_setup_guide.md の一覧も更新すること。
 */
export type EstimateCtaLocation =
  | "hero" // TOPページのファーストビュー
  | "page_hero" // 下層ページのファーストビュー（PageHero）
  | "detail_card" // サービス詳細カードの外部リンク
  | "entry_card" // 「ご相談の入口」カード（ServiceCardGrid）
  | "inline" // 記事本文中の InlineCta
  | "bottom_banner" // ページ下部の CtaBanner
  | "contact_thanks" // お問い合わせ完了ページ
  | "nav" // ヘッダー・フッターのナビゲーション
  | "other"; // 上記以外（配置が未指定のまま計測されたもの）

type LeadParams = {
  leadType: LeadType;
  /** 発火元のパス（例: "/contact"）。低カーディナリティに保つため定数を渡す。 */
  leadLocation: string;
  /** 問い合わせ種別セレクトの固定値。自由入力は渡さないこと。 */
  inquirySubject?: string;
};

/**
 * GTM を使う構成かどうか。`components/shared/GoogleAnalytics.tsx` と同じ判定にする。
 *
 * gtag.js と GTM は排他で、GTM 構成でも GA4 タグが読み込まれた時点で `window.gtag` が
 * 定義される。そのため `window.gtag` の有無で分岐すると、GTM 起動の前後で送信経路が
 * 変わり同じイベントが一部のユーザーでしか計測されない。判定は実行時ではなく
 * ビルド時の環境変数で行い、経路を決定的にする。
 */
const USE_GTM = Boolean(process.env.NEXT_PUBLIC_GTM_ID);

function sendEvent(name: string, params: Record<string, unknown>): void {
  if (typeof window === "undefined") return;

  try {
    if (USE_GTM) {
      window.dataLayer = window.dataLayer ?? [];
      window.dataLayer.push({ event: name, ...params });
      return;
    }

    window.gtag?.("event", name, params);
  } catch {
    // 計測の失敗でフォーム送信やページ遷移を妨げない
  }
}

/**
 * 問い合わせ完了（コンバージョン）。全サイト共通の週次KPI用イベント。
 * GA4 のキーイベントとして登録するが、**Google広告にはインポートしないこと**
 * （既存の `generate_lead` / `contact_submit` と二重計上になるため）。
 */
export function trackLead({
  leadType,
  leadLocation,
  inquirySubject,
}: LeadParams): void {
  sendEvent("inquiry_submit", {
    lead_type: leadType,
    lead_location: leadLocation,
    ...(inquirySubject ? { inquiry_subject: inquirySubject } : {}),
  });
}

/**
 * 既存の `contact_submit`（Google広告の補助コンバージョン）。
 * 送信経路と名前を変えると広告側の計測が壊れるため、パラメータも含めて従来のまま送る。
 * 計測の失敗が送信完了フローを止めないよう、必ずこのヘルパー経由で呼ぶこと。
 */
export function trackLegacyContactSubmit(subject: string): void {
  sendEvent("contact_submit", { form_type: "contact", subject });
}

/** AI見積もり（ai.cloudnature.jp）への導線クリック。CV到達の診断用。 */
export function trackEstimateCtaClick(location: EstimateCtaLocation): void {
  sendEvent("estimate_cta_click", { cta_location: location });
}
