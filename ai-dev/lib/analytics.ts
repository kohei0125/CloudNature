/**
 * GA4 計測ヘルパー（AI研修LP）。
 *
 * 全サイトの問い合わせ完了を `inquiry_submit` に統一し、種別は `lead_type`
 * パラメータで分離する。週次の「Organic経由の問い合わせ件数」はこのイベントを正とする。
 *
 * ⚠️ `generate_lead` を統一イベントに使わないこと。Google広告に「見積もり完了＝主
 * コンバージョン（入札最適化対象）」としてインポート済みで、研修相談を相乗りさせると
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
 * GTM を使う構成かどうか。`components/GoogleAnalytics.tsx` と同じ判定にする。
 *
 * gtag.js と GTM は排他だが、GTM 構成でも GA4 タグが読み込まれれば `window.gtag` が
 * 定義される。そのため `window.gtag` の有無で分岐すると GTM 起動の前後で送信経路が
 * 変わり、同じイベントが一部のユーザーでしか計測されない。判定は実行時ではなく
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
    // 計測の失敗でフォーム送信を妨げない
  }
}

/**
 * 無料相談の申込完了（コンバージョン）。
 *
 * 2つ送るのは意図的:
 * 1. `inquiry_submit` … 全サイト共通の週次KPI用（今回追加）。
 *    gtag.js 構成では GTM 形式の `dataLayer.push` が解釈されずイベントが欠損していたため、
 *    構成に応じた経路で送るようにした（2026-08-12 修正）。
 * 2. `generate_lead`（GTM形式の dataLayer push）… 従来からの送信をそのまま残す。
 *    このサイトの `NEXT_PUBLIC_GTM_ID` は Vercel 側で管理されておりリポジトリからは
 *    値を確認できない。GTM が有効な場合、この push を消すと既存のコンバージョンタグが
 *    無言で発火しなくなるため、後方互換として維持する（GTM 未導入なら誰も読まない no-op）。
 *
 * GA4 のキーイベントに設定するのは `inquiry_submit` のみ。Google広告にはインポートしないこと。
 */
export function trackLead(): void {
  sendEvent("inquiry_submit", {
    lead_type: "training_consultation",
    lead_location: "/",
  });

  try {
    window.dataLayer = window.dataLayer ?? [];
    window.dataLayer.push({ event: "generate_lead" });
  } catch {
    // 計測の失敗でフォーム送信を妨げない
  }
}
