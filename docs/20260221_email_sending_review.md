# メール送信機能レビュー

**作成日**: 2026-02-21
**更新日**: 2026-02-21（Gemini検証結果を反映し優先度・文脈を修正）
**対象**: コーポレートサイト（お問い合わせ）+ 見積もりサイト（概算見積もり）

---

## アーキテクチャ全体像

### メール送信経路

メール送信は3箇所に分散しており、見積もり完了時に **2つの経路が並行して発火する設計** になっている。

| 経路 | トリガー | セキュリティ |
|---|---|---|
| **Python バックエンド** (`backend/app/services/email_service.py`) | `/api/v1/estimate/generate` のバックグラウンドタスク | APIキー認証 + レート制限(60req/min) |
| **Next.js estimate** (`estimate/app/api/estimate/email/route.ts`) | クライアント (`estimate/app/chat/page.tsx` L128) から直接呼出し | **なし** |
| **Next.js contact** (`app/api/contact/route.ts`) | お問い合わせフォーム送信 | Turnstile + インメモリレート制限 |

### 対象ファイル一覧

| # | パス | 役割 |
|---|---|---|
| 1 | `app/api/contact/route.ts` | コーポレートサイト お問い合わせAPI |
| 2 | `app/api/contact/emailTemplates.ts` | お問い合わせ用HTMLテンプレート |
| 3 | `estimate/app/api/estimate/email/route.ts` | 見積もりサイト メール送信API |
| 4 | `estimate/app/api/estimate/email/emailTemplates.ts` | 見積もり用HTMLテンプレート |
| 5 | `backend/app/services/email_service.py` | Python バックエンド メール送信サービス |
| 6 | `backend/app/templates/estimate_email.html` | Python側 顧客向けHTMLテンプレート |
| 7 | `backend/app/templates/estimate_notification.html` | Python側 管理者通知HTMLテンプレート |

---

## CRITICAL - 即対応が必要

### 1. 見積もりメールの二重送信リスク

見積もり完了時、以下の2経路で **同時にメールが送られる**：

1. **Python バックエンド**: `backend/app/api/v1/estimate.py` L140 → `_send_emails()` → `send_estimate_email()` + `send_estimate_notification()`
2. **Next.js フロント**: `estimate/app/chat/page.tsx` L128 → `sendEstimateEmail()` → `/api/estimate/email` route

顧客は **同じ内容のメールを2通受け取る可能性** がある。これが最大の設計上の問題。

**対策**: 一方を廃止する。Python バックエンドに統合するのが望ましい（APIキー認証 + レート制限が既にあるため）。Next.js側の `/api/estimate/email` ルートを廃止し、メール送信はバックエンドに一本化する。

---

### 2. 見積もりAPI（Next.js側）がスパム踏み台になり得る

**ファイル**: `estimate/app/api/estimate/email/route.ts`

- レート制限 **なし**
- Turnstileボット対策 **なし**
- `clientEmail` のフォーマット検証 **なし**
- 入力サイズ制限 **なし**

攻撃者が任意のメールアドレスに対して大量送信可能。Resendコスト増加、送信ドメインのレピュテーション低下、最悪の場合ドメインがブラックリスト入りするリスクがある。

> **補足**: Python バックエンド側は `backend/app/main.py` のミドルウェアでAPIキー認証 + レート制限（60req/min/IP）が適用済み。無防備なのは **Next.js側のみ**。

**対策**: #1 でバックエンド統合する場合はこのルートごと廃止される。統合しない場合は Turnstile + レート制限 + emailフォーマット検証 + 入力サイズ上限を追加する。

---

## HIGH - 早期対応推奨

### 3. Python バックエンドの HTML インジェクション

**ファイル**: `backend/app/services/email_service.py` 88-91行目

```python
html = (
    html.replace("{{client_name}}", client_name)
    .replace("{{client_company}}", client_company)
    .replace("{{client_email}}", client_email)
)
```

`str.replace` でユーザー入力をエスケープなしにHTMLへ埋め込んでいる。Next.js側の `emailTemplates.ts` では `escapeHtml()` で対策済みだが、Python側は未対策。

> **影響範囲の補足**: このテンプレート (`estimate_notification.html`) の宛先は管理者 (`notify_email`) のみ。顧客向けテンプレート (`estimate_email.html`) にはプレースホルダーが一切ないため、顧客に直接悪意あるHTMLが届くことはない。影響は「管理者のメールクライアント上での表示崩れ・リンク改ざん」に限定される。

**対策**: Jinja2の `autoescape=True` を導入するか、最低限 `html.escape()` を適用する。

---

### 4. Turnstile の Fail-Open 設計

**ファイル**: `app/api/contact/route.ts` 119行目

```typescript
if (CLOUDFLARE_TURNSTILE_SECRET_KEY) {  // 空なら検証スキップ
```

> **意図的な設計である点**: L6-10 のコメントにある通り、開発環境（`NEXT_PUBLIC_ENV !== "production"`）では意図的にスキップする設計。本番で `NEXT_PUBLIC_ENV=production` かつ `CLOUDFLARE_TURNSTILE_SECRET_KEY` が未設定の場合のみ問題になる。リスクは低いが、Fail-Close化は良い改善。

**対策**: 本番環境で `CLOUDFLARE_TURNSTILE_SECRET_KEY` が未設定の場合は 503 を返すか起動時にエラーとする（Fail-Close化）。

---

### 5. 見積もり API の入力バリデーション不足

**ファイル**: `estimate/app/api/estimate/email/route.ts`

`estimate` オブジェクトの構造・文字数・数値範囲が未検証（L33 で `!estimate || !clientEmail` のみ）。巨大なペイロードでPDF生成（`@react-pdf/renderer` の `renderToBuffer`）を走らせるDoS攻撃が理論上可能。

**対策**: zodスキーマ等で `estimate` の型・サイズ・数値範囲をサーバーサイドでバリデーションする。#1 でバックエンド統合する場合は pydantic での検証に統一できる。

---

## MEDIUM - 設計改善

### 6. インメモリレート制限の限界

**ファイル**: `app/api/contact/route.ts` 17行目

- サーバーレス/マルチインスタンス環境ではプロセス間で共有されない
- 再起動でリセットされる
- `x-forwarded-for` は偽装可能
- IPが `"unknown"` に集約されて誤ブロックの可能性

> **現状の評価**: 現在のシングルインスタンス運用であれば許容範囲。スケール時に対応が必要。Python バックエンド側も同様にインメモリだが、FastAPIミドルウェアで60req/min制限がかかっている。

**対策**: Redis / Upstash 等の共有ストアを利用したレート制限に移行する。

---

### 7. 同一機能の3重実装

| 機能 | contact (Next.js) | estimate (Next.js) | backend (Python) |
|---|---|---|---|
| `escapeHtml` | あり | あり (重複コピー) | **なし** |
| `getResend` singleton | あり | あり (重複コピー) | 直接設定 |
| レート制限 | あり (インメモリ) | **なし** | あり (ミドルウェア) |
| Turnstile | あり | **なし** | 不要 (API認証) |
| メールバリデーション | あり | **なし** | **なし** |

対策レベルにバラつきがあり、修正漏れが既に発生している。

> **根本原因**: 見積もりメールが Python バックエンドと Next.js の両方から送られる設計になっているため、必然的にコードが重複した。#1（二重送信リスク）を解消すれば、この重複も大部分が解消される。

**対策**: #1 でバックエンド統合を行えば estimate 側の Next.js メール送信コードは廃止できる。残る contact と backend 間では、最低限 `escapeHtml` 相当の処理を Python 側にも導入する。

---

### 8. エラーハンドリング方針の不一致

**ファイル**: `app/api/contact/route.ts`, `estimate/app/api/estimate/email/route.ts` 共通

```typescript
// 管理者通知失敗 → 全体エラー (throw)
if (notifyResult.status === "rejected") throw notifyResult.reason;

// 確認メール失敗 → 成功を返す (ログのみ)
if (confirmResult.status === "rejected") {
  console.error("...", confirmResult.reason);
}
```

意図は「管理者に届かないとリードを失う」だが、設計判断が明文化されておらず、運用時に混乱の元になる。確認メール失敗時にユーザーへのフィードバックもない。

**対策**: エラーハンドリングポリシーを明文化し、確認メール失敗時のリトライ戦略やユーザーへの通知方法を検討する。

---

### 9. テンプレート品質の不統一

| 項目 | Next.js (contact) | Next.js (estimate) | Python (backend) |
|---|---|---|---|
| 顧客名表示 | `${name} 様` | `${clientName} 様` | **「お客様」固定** |
| PDF添付ファイル名 | - | `概算お見積書.pdf` | `概算見積書.pdf`（「お」なし） |
| メール件名 | 統一的 | 統一的 | **微妙に異なる** |
| XSS対策 | `escapeHtml` | `escapeHtml` | **未対策** |

ブランド体験が分裂しており、ユーザーが同じサービスから受け取るメールとして一貫性に欠ける。

**対策**: テンプレート文面・ファイル名・件名の規約を統一する。

---

## LOW - 改善余地

### 10. 監査ログ・追跡性の不足

Next.js側はResendのメッセージIDをログに残しておらず、送信追跡が困難。再送制御・重複送信検知の仕組みもない。

> **補足**: Python バックエンド側は `logger.info` でResendのメッセージIDを記録済み（L51, L103-106）。

**対策**: Next.js側でもResendレスポンスのIDを構造化ログに記録し、失敗時のアラート・リトライ機構を追加する。

---

### 11. Python 側の async/sync 混在

**ファイル**: `backend/app/services/email_service.py` 20行目, 60行目

`async def` で定義されているが、内部で `resend.Emails.send()` を同期呼び出ししており、IOバウンドのブロッキングとなる。

> **実害は限定的**: この関数は `BackgroundTasks` から呼ばれており（`backend/app/api/v1/estimate.py` L140）、FastAPIのバックグラウンドタスクは別スレッドで実行されるため、メインのイベントループはブロックされない。

**対策**: `asyncio.to_thread()` でラップするのが理想だが、急ぎではない。

---

## 優先対応ロードマップ

| 優先度 | 対応内容 | 対象ファイル |
|---|---|---|
| **P0** | 見積もりメール送信をバックエンドに一本化し二重送信を解消 | `estimate/app/api/estimate/email/route.ts`, `estimate/app/chat/page.tsx`, `backend/app/api/v1/estimate.py` |
| **P0** | 一本化しない場合: estimate API に Turnstile + レート制限 + emailバリデーション追加 | `estimate/app/api/estimate/email/route.ts` |
| **P1** | Python テンプレートに HTMLエスケープを導入 | `backend/app/services/email_service.py` |
| **P1** | Turnstile secret 未設定時は Fail-Close 化 | `app/api/contact/route.ts` |
| **P1** | 見積もり API の入力バリデーション強化 | `estimate/app/api/estimate/email/route.ts` |
| **P2** | レート制限をRedis/Upstash等の共有ストアに移行 | `app/api/contact/route.ts` |
| **P2** | エラーハンドリングポリシーの明文化 | 全API Route |
| **P3** | テンプレート文面・添付ファイル名・件名の統一 | 全テンプレートファイル |
| **P3** | Next.js側にResendメッセージIDのログ記録追加 | 全Next.js API Route |
| **P3** | Python async/sync 混在の改善 | `backend/app/services/email_service.py` |

---

## 修正要否の総合判定

| # | 項目 | 初回判定 | 検証後判定 | 理由 |
|---|---|---|---|---|
| 1 | 二重送信リスク | 未指摘 | **P0 (新規)** | 顧客に同内容メール2通が届く最大の問題 |
| 2 | スパム踏み台 | P0 | **P0** | Next.js側が無防備（Python側はAPIキー認証済み） |
| 3 | HTML インジェクション | P0 | **P1に下げ** | 影響は管理者メールのみに限定 |
| 4 | Fail-Open | P1 | **P1** | 意図的な開発環境スキップだが本番設定漏れリスクあり |
| 5 | バリデーション不足 | P1 | **P1** | DoSリスクは理論上可能 |
| 6 | インメモリ制限 | P1 | **P2に下げ** | シングルインスタンスなら許容範囲 |
| 7 | 3重実装 | P2 | **P0に統合** | 二重送信の根本原因 |
| 8 | エラーハンドリング | P2 | **P2** | 変更なし |
| 9 | テンプレート不統一 | P3 | **P3** | 変更なし |
| 10 | 監査ログ | P3 | **P3** | Python側は対応済み、Next.js側のみ |
| 11 | async/sync混在 | P3 | **P3** | BackgroundTasksで実害なし |
