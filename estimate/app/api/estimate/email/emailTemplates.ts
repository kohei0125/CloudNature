export interface EstimateEmailData {
  clientName: string;
  clientEmail: string;
  clientCompany: string;
  projectName: string;
  standardCost: number;
  hybridCost: number;
  savingsPercent: number;
  costMessage: string;
}

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function formatPrice(price: number): string {
  return `${Math.round(price / 10000).toLocaleString("ja-JP")}万円`;
}

export function buildEstimateNotifyHtml(data: EstimateEmailData): string {
  return `
<!DOCTYPE html>
<html lang="ja">
<head><meta charset="UTF-8"></head>
<body style="background-color: #EDE8E5; font-family: 'Helvetica Neue', Arial, 'Hiragino Kaku Gothic ProN', 'Hiragino Sans', Meiryo, sans-serif; color: #19231B; line-height: 1.6; margin: 0; padding: 40px 20px;">
  <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 15px rgba(0,0,0,0.05);">
    <div style="background-color: #19231B; padding: 24px; text-align: center;">
      <h1 style="color: #ffffff; margin: 0; font-size: 20px; font-weight: bold; letter-spacing: 1px;">CloudNature</h1>
    </div>
    <div style="padding: 40px 32px;">
      <h2 style="color: #19231B; font-size: 18px; margin-top: 0; margin-bottom: 24px; border-bottom: 2px solid #8A9668; padding-bottom: 8px;">
        新しい概算見積もりリクエスト
      </h2>
      <h3 style="color: #19231B; font-size: 16px; margin-top: 0; margin-bottom: 16px;">
        ■ 顧客情報
      </h3>
      <table style="width: 100%; border-collapse: collapse; margin-bottom: 32px;">
        <tr>
          <td style="padding: 12px; background: #F4F2F0; font-weight: bold; width: 30%; border-bottom: 1px solid #EDE8E5; border-top: 1px solid #EDE8E5; vertical-align: top;">お名前</td>
          <td style="padding: 12px; border-bottom: 1px solid #EDE8E5; border-top: 1px solid #EDE8E5; vertical-align: top;">${escapeHtml(data.clientName)}</td>
        </tr>
        <tr>
          <td style="padding: 12px; background: #F4F2F0; font-weight: bold; border-bottom: 1px solid #EDE8E5; vertical-align: top;">メールアドレス</td>
          <td style="padding: 12px; border-bottom: 1px solid #EDE8E5; vertical-align: top;"><a href="mailto:${escapeHtml(data.clientEmail)}" style="color: #8A9668;">${escapeHtml(data.clientEmail)}</a></td>
        </tr>
        <tr>
          <td style="padding: 12px; background: #F4F2F0; font-weight: bold; border-bottom: 1px solid #EDE8E5; vertical-align: top;">会社名</td>
          <td style="padding: 12px; border-bottom: 1px solid #EDE8E5; vertical-align: top;">${data.clientCompany ? escapeHtml(data.clientCompany) : "（未入力）"}</td>
        </tr>
        <tr>
          <td style="padding: 12px; background: #F4F2F0; font-weight: bold; border-bottom: 1px solid #EDE8E5; vertical-align: top;">プロジェクト名</td>
          <td style="padding: 12px; border-bottom: 1px solid #EDE8E5; vertical-align: top;">${escapeHtml(data.projectName)}</td>
        </tr>
      </table>

      <h3 style="color: #19231B; font-size: 16px; margin-top: 0; margin-bottom: 16px;">
        ■ 見積もり概要
      </h3>
      <table style="width: 100%; border-collapse: collapse;">
        <tr>
          <td style="padding: 12px; background: #F4F2F0; font-weight: bold; width: 30%; border-bottom: 1px solid #EDE8E5; border-top: 1px solid #EDE8E5; vertical-align: top;">従来型コスト</td>
          <td style="padding: 12px; border-bottom: 1px solid #EDE8E5; border-top: 1px solid #EDE8E5; vertical-align: top;">${formatPrice(data.standardCost)}</td>
        </tr>
        <tr>
          <td style="padding: 12px; background: #F4F2F0; font-weight: bold; border-bottom: 1px solid #EDE8E5; vertical-align: top;">ハイブリッドコスト</td>
          <td style="padding: 12px; border-bottom: 1px solid #EDE8E5; vertical-align: top;">${formatPrice(data.hybridCost)}</td>
        </tr>
        <tr>
          <td style="padding: 12px; background: #F4F2F0; font-weight: bold; border-bottom: 1px solid #EDE8E5; vertical-align: top;">削減率</td>
          <td style="padding: 12px; border-bottom: 1px solid #EDE8E5; vertical-align: top; color: #8A9668; font-weight: bold;">約${data.savingsPercent}%</td>
        </tr>
      </table>

      <p style="margin-top: 24px; font-size: 13px; color: #888888;">
        ※ PDFお見積書がこのメールに添付されています。
      </p>
    </div>
    <div style="background-color: #F8F9FA; padding: 20px; text-align: center; border-top: 1px solid #EDE8E5;">
      <p style="margin: 0; font-size: 12px; color: #888888;">このメールは CloudNature 概算見積もりツールから自動送信されました。</p>
    </div>
  </div>
</body>
</html>`.trim();
}

export function buildEstimateConfirmHtml(data: EstimateEmailData): string {
  return `
<!DOCTYPE html>
<html lang="ja">
<head><meta charset="UTF-8"></head>
<body style="background-color: #EDE8E5; font-family: 'Helvetica Neue', Arial, 'Hiragino Kaku Gothic ProN', 'Hiragino Sans', Meiryo, sans-serif; color: #19231B; line-height: 1.6; margin: 0; padding: 40px 20px;">
  <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 15px rgba(0,0,0,0.05);">
    <div style="background-color: #19231B; padding: 24px; text-align: center;">
      <h1 style="color: #ffffff; margin: 0; font-size: 20px; font-weight: bold; letter-spacing: 1px;">CloudNature</h1>
    </div>
    <div style="padding: 40px 32px;">
      <h2 style="color: #19231B; font-size: 18px; margin-top: 0; margin-bottom: 24px; border-bottom: 2px solid #8A9668; padding-bottom: 8px;">
        概算お見積もりが完成しました
      </h2>
      <p style="margin-top: 0;">${escapeHtml(data.clientName)} 様</p>
      <p>
        この度は CloudNature の概算見積もりツールをご利用いただき、誠にありがとうございます。<br>
        お見積もりの結果をお送りいたします。
      </p>

      <table style="width: 100%; border-collapse: collapse; margin-top: 24px; margin-bottom: 24px;">
        <tr>
          <td style="padding: 12px; background: #F4F2F0; font-weight: bold; width: 30%; border-bottom: 1px solid #EDE8E5; border-top: 1px solid #EDE8E5; vertical-align: top;">プロジェクト名</td>
          <td style="padding: 12px; border-bottom: 1px solid #EDE8E5; border-top: 1px solid #EDE8E5; vertical-align: top;">${escapeHtml(data.projectName)}</td>
        </tr>
        <tr>
          <td style="padding: 12px; background: #F4F2F0; font-weight: bold; border-bottom: 1px solid #EDE8E5; vertical-align: top;">従来型コスト</td>
          <td style="padding: 12px; border-bottom: 1px solid #EDE8E5; vertical-align: top;">${formatPrice(data.standardCost)}</td>
        </tr>
        <tr>
          <td style="padding: 12px; background: #F4F2F0; font-weight: bold; border-bottom: 1px solid #EDE8E5; vertical-align: top;">ハイブリッドコスト</td>
          <td style="padding: 12px; border-bottom: 1px solid #EDE8E5; vertical-align: top; color: #8A9668; font-weight: bold;">${formatPrice(data.hybridCost)}</td>
        </tr>
        <tr>
          <td style="padding: 12px; background: #F4F2F0; font-weight: bold; border-bottom: 1px solid #EDE8E5; vertical-align: top;">削減率</td>
          <td style="padding: 12px; border-bottom: 1px solid #EDE8E5; vertical-align: top; color: #8A9668; font-weight: bold;">約${data.savingsPercent}%</td>
        </tr>
      </table>

      <p>${escapeHtml(data.costMessage)}</p>

      <div style="text-align: center; margin-top: 32px; margin-bottom: 32px;">
        <a href="https://cloudnature.jp/contact" style="display: inline-block; background-color: #DD9348; color: #ffffff; text-decoration: none; font-weight: bold; font-size: 15px; padding: 14px 32px; border-radius: 8px;">
          無料相談を予約する
        </a>
      </div>

      <p style="margin-bottom: 0;">
        内容を確認のうえ、ご不明な点がございましたらお気軽に無料相談よりご連絡ください。<br>
        恐れ入りますが、今後とも変わらぬご愛顧を賜りますようお願い申し上げます。
      </p>
    </div>
    <div style="background-color: #F8F9FA; padding: 24px 32px; border-top: 1px solid #EDE8E5;">
      <p style="margin: 0 0 8px 0; font-size: 12px; color: #888888;">
        ※ 本見積もりはAIによる概算であり、法的拘束力はありません。正式なお見積もりは無料相談にてご案内いたします。
      </p>
      <p style="margin: 0 0 8px 0; font-size: 12px; color: #888888;">
        ※ PDFお見積書がこのメールに添付されています。
      </p>
      <p style="margin: 0 0 8px 0; font-size: 12px; color: #888888;">
        ※ このメールは CloudNature の概算見積もりツールより自動送信されております。
      </p>
      <p style="margin: 0; font-size: 12px; color: #888888;">
        ※ お心当たりのない場合は、誠に恐れ入りますが本メールを破棄していただきますようお願いいたします。
      </p>
    </div>
  </div>
</body>
</html>`.trim();
}
