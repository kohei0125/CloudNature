/**
 * GA4 計測ヘルパー（AI見積もり）。
 *
 * 全サイトの問い合わせ完了を `inquiry_submit` に統一し、種別は `lead_type`
 * パラメータで分離する。週次の「Organic経由の問い合わせ件数」はこのイベントを正とする。
 * コーポレート（`lib/analytics.ts`）・AI研修LP（`ai-dev/lib/analytics.ts`）と同じ形を保つこと。
 *
 * ⚠️ 見積もりフローの `generate_lead` はこのヘルパーを通さない。あちらは Google広告の
 * 主コンバージョン（入札最適化対象）としてインポート済みで、送信経路も含めて
 * 現状を維持する必要があるため、発火箇所に直接書いてある
 * （docs/20260410_google_ads_setup_guide.md:59-67）。
 *
 * 個人情報（氏名・メールアドレス・電話番号・自由入力本文）は
 * いかなるパラメータにも含めないこと。
 *
 * 設計の詳細: docs/20260812_organic_inquiry_tracking_review.md
 */

/**
 * GTM を使う構成かどうか。`components/shared/GoogleAnalytics.tsx` と同じ判定にする。
 * 実行時に `window.gtag` の有無で分岐すると GTM 起動の前後で経路が変わり、
 * 同じイベントが一部のユーザーでしか計測されないため、ビルド時の環境変数で決定する。
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
    // 計測の失敗で見積もり完了フローを妨げない
  }
}

/**
 * 見積もり生成の完了（＝連絡先を伴うリード獲得）。全サイト共通の週次KPI用イベント。
 * GA4 のキーイベントとして登録するが、Google広告にはインポートしないこと
 * （既存の `generate_lead` と二重計上になるため）。
 */
export function trackLead(): void {
  sendEvent("inquiry_submit", {
    lead_type: "ai_estimate",
    lead_location: "/chat",
  });
}
