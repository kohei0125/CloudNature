/**
 * GA4 計測ヘルパー（AI研修LP）。
 *
 * 全サイトの問い合わせ完了を `inquiry_submit` に統一し、種別は `lead_type`
 * パラメータで分離する。週次の「Organic経由の問い合わせ件数」はこのイベントを正とする。
 *
 * ⚠️ `generate_lead` は使わないこと。Google広告に「見積もり完了＝主コンバージョン
 * （入札最適化対象）」としてインポート済みで、研修相談を相乗りさせると
 * 入札最適化の母集団が変わる（docs/20260410_google_ads_setup_guide.md:59-67）。
 *
 * 個人情報（氏名・メールアドレス・電話番号・所属）は
 * いかなるパラメータにも含めないこと。
 *
 * 設計の詳細: docs/20260812_organic_inquiry_tracking_review.md
 */

declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
  }
}

/**
 * gtag.js / GTM のどちらの構成でもイベントが届くように送信する。
 *
 * 以前は GTM 形式の `dataLayer.push({ event })` のみを行っていたが、
 * `NEXT_PUBLIC_GTM_ID` が未設定で gtag.js 直挿し構成のため、
 * gtag.js がこの形式を解釈せずイベントが欠損していた（2026-08-12 修正）。
 *
 * フォールバックとして残している `dataLayer.push` は GTM に切り替えた場合用。
 * このヘルパーはフォーム送信成功後にしか呼ばれず、その時点では gtag.js の
 * 初期化が完了しているため、gtag.js 構成でこの分岐に入ることは実質ない。
 */
function sendEvent(name: string, params: Record<string, unknown>): void {
  if (typeof window === "undefined") return;

  try {
    if (typeof window.gtag === "function") {
      window.gtag("event", name, params);
      return;
    }

    window.dataLayer = window.dataLayer ?? [];
    window.dataLayer.push({ event: name, ...params });
  } catch {
    // 計測の失敗でフォーム送信を妨げない
  }
}

/**
 * 無料相談の申込完了（コンバージョン）。全サイト共通の週次KPI用イベント。
 * GA4 のキーイベントとして登録するが、Google広告にはインポートしないこと。
 */
export function trackLead(): void {
  sendEvent("inquiry_submit", {
    lead_type: "training_consultation",
    lead_location: "/",
  });
}
