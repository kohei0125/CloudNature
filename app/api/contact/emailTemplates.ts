export interface ContactRequestBody {
  name: string;
  email: string;
  company?: string;
  subject: string;
  message: string;
  turnstileToken?: string;
}

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

export function buildEmailHtml(body: ContactRequestBody): string {
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
        新しいお問い合わせがありました
      </h2>
      <table style="width: 100%; border-collapse: collapse;">
        <tr>
          <td style="padding: 12px; background: #F4F2F0; font-weight: bold; width: 30%; border-bottom: 1px solid #EDE8E5; vertical-align: top;">お名前</td>
          <td style="padding: 12px; border-bottom: 1px solid #EDE8E5; vertical-align: top;">${escapeHtml(body.name)}</td>
        </tr>
        <tr>
          <td style="padding: 12px; background: #F4F2F0; font-weight: bold; border-bottom: 1px solid #EDE8E5; vertical-align: top;">メールアドレス</td>
          <td style="padding: 12px; border-bottom: 1px solid #EDE8E5; vertical-align: top;"><a href="mailto:${escapeHtml(body.email)}" style="color: #8A9668;">${escapeHtml(body.email)}</a></td>
        </tr>
        <tr>
          <td style="padding: 12px; background: #F4F2F0; font-weight: bold; border-bottom: 1px solid #EDE8E5; vertical-align: top;">会社名</td>
          <td style="padding: 12px; border-bottom: 1px solid #EDE8E5; vertical-align: top;">${body.company ? escapeHtml(body.company) : "（未入力）"}</td>
        </tr>
        <tr>
          <td style="padding: 12px; background: #F4F2F0; font-weight: bold; border-bottom: 1px solid #EDE8E5; vertical-align: top;">お問い合わせ種別</td>
          <td style="padding: 12px; border-bottom: 1px solid #EDE8E5; vertical-align: top;">${escapeHtml(body.subject)}</td>
        </tr>
        <tr>
          <td style="padding: 12px; background: #F4F2F0; font-weight: bold; border-bottom: 1px solid #EDE8E5; vertical-align: top;">お問い合わせ内容</td>
          <td style="padding: 12px; border-bottom: 1px solid #EDE8E5; white-space: pre-wrap; vertical-align: top;">${escapeHtml(body.message)}</td>
        </tr>
      </table>
    </div>
    <div style="background-color: #F8F9FA; padding: 20px; text-align: center; border-top: 1px solid #EDE8E5;">
      <p style="margin: 0; font-size: 12px; color: #888888;">このメールは CloudNature コーポレートサイトのお問い合わせフォームから自動送信されました。</p>
    </div>
  </div>
</body>
</html>`.trim();
}

export function buildConfirmationEmailHtml(body: ContactRequestBody): string {
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
        お問い合わせありがとうございます
      </h2>
      <p style="margin-top: 0;">${escapeHtml(body.name)} 様</p>
      <p>
        この度は CloudNature へお問い合わせいただき、誠にありがとうございます。<br>
        以下の内容でお問い合わせを受け付けいたしました。
      </p>
      <table style="width: 100%; border-collapse: collapse; margin-top: 24px; margin-bottom: 24px;">
        <tr>
          <td style="padding: 12px; background: #F4F2F0; font-weight: bold; width: 30%; border-bottom: 1px solid #EDE8E5; border-top: 1px solid #EDE8E5; vertical-align: top;">お問い合わせ種別</td>
          <td style="padding: 12px; border-bottom: 1px solid #EDE8E5; border-top: 1px solid #EDE8E5; vertical-align: top;">${escapeHtml(body.subject)}</td>
        </tr>
        <tr>
          <td style="padding: 12px; background: #F4F2F0; font-weight: bold; border-bottom: 1px solid #EDE8E5; vertical-align: top;">お問い合わせ内容</td>
          <td style="padding: 12px; border-bottom: 1px solid #EDE8E5; white-space: pre-wrap; vertical-align: top;">${escapeHtml(body.message)}</td>
        </tr>
      </table>
      <p style="margin-bottom: 0;">
        内容を確認のうえ、2営業日以内に担当者よりご連絡いたします。<br>
        恐れ入りますが、いましばらくお待ちくださいますようお願い申し上げます。
      </p>
    </div>
    <div style="background-color: #F8F9FA; padding: 24px 32px; border-top: 1px solid #EDE8E5;">
      <p style="margin: 0 0 8px 0; font-size: 12px; color: #888888;">
        ※ このメールは CloudNature のお問い合わせフォームより自動送信されております。
      </p>
      <p style="margin: 0; font-size: 12px; color: #888888;">
        ※ お心当たりのない場合は、誠に恐れ入りますが本メールを破棄していただきますようお願いいたします。
      </p>
    </div>
  </div>
</body>
</html>`.trim();
}
