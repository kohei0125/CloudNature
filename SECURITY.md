# SECURITY.md

セキュリティ関連の修正内容と対処方法の記録。

## 2026-07-02: リアルタイム翻訳のパスワードゲート必須化

### 内容

総合レビュー（`docs/20260702_website_comprehensive_review.md` P0-1）で、
`/realtime-translate` が実質無認証で OpenAI Realtime API の一時トークンを
発行できる状態を検出し、修正した。

- `RealtimeTranslateApp.tsx` の `BYPASS_GATE = true` によりパスワードゲートが
  無効化され、さらに照合用パスワードがクライアントバンドルに露出していた。
- レート制限（IP ごと 15 分 10 回）はインメモリ実装のため、Vercel の
  サーバーレス環境ではインスタンス間で共有されず、防御として不十分。
- URL を知る第三者が従量課金の Realtime API セッションを開始でき、
  請求濫用につながるリスクがあった。

### 対処方法

- `BYPASS_GATE` / `BYPASS_PASSWORD` を削除し、パスワード入力を必須に戻した
  （`components/realtime-translate/RealtimeTranslateApp.tsx`）。
- ハードコードされていた照合パスワードを環境変数
  `REALTIME_TRANSLATE_PASSWORD` へ移行（`app/api/realtime-translate/session/route.ts`）。
  未設定時はトークンを発行しないフェイルクローズ動作（500 を返す）。
- **旧パスワード「クラウドネイチャー」はデプロイ済み JS バンドルに露出していたため
  漏えい済みとして扱い、本番では必ず別の値を設定すること。**
  Vercel: `vercel env add REALTIME_TRANSLATE_PASSWORD`（Production / Preview）。
- 残課題（P1 以降）: レート制限の共有ストア化（Vercel KV / Upstash / WAF）、
  またはページ自体の公開サイトからの分離。

## 2026-06-07: リアルタイム翻訳機能追加に伴う修正

### 1. Permissions-Policy のページ限定緩和

- **内容**: 全ルートで `microphone=()`（マイク全面禁止）としていた `Permissions-Policy` ヘッダーを、
  `/realtime-translate` のみ `microphone=(self)` に緩和した（`next.config.mjs`）。
- **理由**: リアルタイム音声翻訳ページで `getUserMedia` によるマイク入力が必要なため。
- **対処方法**: 緩和は同一オリジン（`self`）かつ対象 1 ページのみ。カメラ・位置情報は引き続き全ページで禁止。
  他ページのポリシーは変更していない（`curl -I` で確認済み）。

### 2. `.env.sample` への実 API キー混入の除去

- **内容**: git 管理対象の `.env.sample` に OpenAI の実 API キーが一時的に記載されていたため、
  プレースホルダー（空値）に戻した。
- **対処方法**:
  - 実キーは gitignore 済みの `.env.local` / `.env` にのみ保持する。
  - 該当キーはコミット前に除去したためリポジトリ履歴には残っていない。
    念のためキーのローテーション（OpenAI ダッシュボードで再発行）を推奨。
  - 今後、`.env.sample` には値を入れずキー名のみを記載すること。

### 3. リアルタイム翻訳の API キー保護設計

- OpenAI API キーはサーバー側（Next.js API Route）のみで使用し、クライアントには
  有効期限 10 分の一時トークン（`ek_...`）のみを渡す。
- ゲートパスワード（固定「クラウドネイチャー」）はサーバー側で照合し、
  一時トークン発行のたびに再照合する。
- 本番環境では IP ごとのレート制限（15 分 10 回）を適用。
- ページは noindex・sitemap 除外で非公開運用。
