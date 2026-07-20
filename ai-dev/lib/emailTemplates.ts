export interface ConsultationRequestBody {
  name: string;
  company: string;
  email: string;
  role: string;
  topic?: string;
  utmSource?: string;
  utmMedium?: string;
  utmCampaign?: string;
  pageReferrer?: string;
}

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function row(label: string, value: string, isLast = false): string {
  const borderStyle = isLast ? "" : "border-bottom: 1px solid #d5dfef;";
  return `
        <tr>
          <td style="padding: 12px; background: #f2f6fe; font-weight: bold; width: 30%; ${borderStyle} vertical-align: top;">${label}</td>
          <td style="padding: 12px; ${borderStyle} vertical-align: top; white-space: pre-wrap;">${value}</td>
        </tr>`;
}

export function buildNotificationEmailHtml(body: ConsultationRequestBody): string {
  const utmLines = [
    body.utmSource && `utm_source: ${escapeHtml(body.utmSource)}`,
    body.utmMedium && `utm_medium: ${escapeHtml(body.utmMedium)}`,
    body.utmCampaign && `utm_campaign: ${escapeHtml(body.utmCampaign)}`,
    body.pageReferrer && `referrer: ${escapeHtml(body.pageReferrer)}`,
  ].filter(Boolean);

  return `
<!DOCTYPE html>
<html lang="ja">
<head><meta charset="UTF-8"></head>
<body style="background-color: #e8f0fd; font-family: 'Helvetica Neue', Arial, 'Hiragino Kaku Gothic ProN', 'Hiragino Sans', Meiryo, sans-serif; color: #16233d; line-height: 1.6; margin: 0; padding: 40px 20px;">
  <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 15px rgba(0,0,0,0.05);">
    <div style="background-color: #060f22; padding: 24px; text-align: center;">
      <h1 style="color: #ffffff; margin: 0; font-size: 20px; font-weight: bold; letter-spacing: 1px;">CloudNature AI開発研修</h1>
    </div>
    <div style="padding: 40px 32px;">
      <h2 style="color: #0d2044; font-size: 18px; margin-top: 0; margin-bottom: 24px; border-bottom: 2px solid #f97b16; padding-bottom: 8px;">
        30分無料相談のお申し込みがありました
      </h2>
      <table style="width: 100%; border-collapse: collapse;">
        ${row("お名前", escapeHtml(body.name))}
        ${row("会社名", escapeHtml(body.company))}
        ${row("メールアドレス", `<a href="mailto:${escapeHtml(body.email)}" style="color: #2f6fd6;">${escapeHtml(body.email)}</a>`)}
        ${row("役職", escapeHtml(body.role))}
        ${row("ご相談したいこと", body.topic ? escapeHtml(body.topic) : "（未入力）", true)}
      </table>
      ${
        utmLines.length > 0
          ? `<p style="margin: 24px 0 0; font-size: 12px; color: #5a6b85;">${utmLines.join("<br>")}</p>`
          : ""
      }
    </div>
    <div style="background-color: #f8f9fa; padding: 20px; text-align: center; border-top: 1px solid #e8f0fd;">
      <p style="margin: 0; font-size: 12px; color: #888888;">このメールは ai-dev.cloudnature.jp（AI開発研修 無料相談フォーム）から自動送信されました。</p>
    </div>
  </div>
</body>
</html>`.trim();
}

export function buildConfirmationEmailHtml(body: ConsultationRequestBody): string {
  return `
<!DOCTYPE html>
<html lang="ja">
<head><meta charset="UTF-8"></head>
<body style="background-color: #e8f0fd; font-family: 'Helvetica Neue', Arial, 'Hiragino Kaku Gothic ProN', 'Hiragino Sans', Meiryo, sans-serif; color: #16233d; line-height: 1.6; margin: 0; padding: 40px 20px;">
  <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 15px rgba(0,0,0,0.05);">
    <div style="background-color: #060f22; padding: 24px; text-align: center;">
      <h1 style="color: #ffffff; margin: 0; font-size: 20px; font-weight: bold; letter-spacing: 1px;">CloudNature AI開発研修</h1>
    </div>
    <div style="padding: 40px 32px;">
      <h2 style="color: #0d2044; font-size: 18px; margin-top: 0; margin-bottom: 24px; border-bottom: 2px solid #f97b16; padding-bottom: 8px;">
        無料相談のお申し込みありがとうございます
      </h2>
      <p style="margin-top: 0;">${escapeHtml(body.name)} 様</p>
      <p>
        この度は「Claude Code / Codex を顧客案件で使うAI開発研修」の30分無料相談にお申し込みいただき、誠にありがとうございます。<br>
        以下の内容でお申し込みを受け付けいたしました。
      </p>
      <table style="width: 100%; border-collapse: collapse; margin-top: 24px; margin-bottom: 24px;">
        ${row("会社名", escapeHtml(body.company))}
        ${row("役職", escapeHtml(body.role))}
        ${row("ご相談したいこと", body.topic ? escapeHtml(body.topic) : "（未入力）", true)}
      </table>
      <p style="margin-bottom: 0;">
        内容を確認のうえ、担当者より日程調整のご連絡を差し上げます。<br>
        恐れ入りますが、いましばらくお待ちくださいますようお願い申し上げます。
      </p>
    </div>
    <div style="background-color: #f8f9fa; padding: 24px 32px; border-top: 1px solid #e8f0fd;">
      <p style="margin: 0 0 8px 0; font-size: 12px; color: #888888;">
        ※ このメールは ai-dev.cloudnature.jp（AI開発研修 無料相談フォーム）より自動送信されております。
      </p>
      <p style="margin: 0; font-size: 12px; color: #888888;">
        ※ お心当たりのない場合は、誠に恐れ入りますが本メールを破棄していただきますようお願いいたします。
      </p>
    </div>
  </div>
</body>
</html>`.trim();
}
