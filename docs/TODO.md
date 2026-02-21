# CloudNature AI見積もりシステム — TODO一覧

最終更新: 2026-02-21

---

## 未対応

### E2E・品質確認
- [ ] `/step` API のレスポンスタイムが fire-and-forget により高速化されていること
  - Step 1〜6: ~100ms 以内を目安
  - Step 7: LLM 呼び出しがあるため数秒は許容
- [ ] ネットワーク切断後のリトライが機能する

### 技術的負債
- [ ] APIキーの漏洩リスク対応（`backend/.env`）
  - [ ] OpenAI / Resend のAPIキーをローテーション
  - [ ] `.env` が git 履歴に含まれていないか確認（含まれていれば履歴削除）
  - [ ] 本番では Secret Manager 運用を徹底
- [ ] バックエンドテストを追加（`backend/tests/`）
- [ ] `Session.email` 未使用を整理（Step 13 の連絡先から保存/利用）

### 低優先の検討事項
- [ ] Turbopack の複数 lockfile 警告対応（`next.config.mjs` の `turbopack.root` など）
- [ ] `CORS` デフォルト値が localhost 前提のため、本番値上書きを運用で担保
- [ ] `/api/pdf` の無認証公開に対する認証またはレート制限を検討

---

## 対応済み

### デプロイ
- [x] Neon プロジェクト作成 / DB・Role 作成 / pooled endpoint 設定
- [x] GCP プロジェクト準備 / API有効化 / SA作成 / Secret Manager 設定 / IAM付与 / Artifact Registry 作成
- [x] Cloud Run へ backend デプロイ、URL控え、ヘルスチェック・APIキー認証確認、Neonテーブル自動作成確認
- [x] Vercel へ `estimate` デプロイ、環境変数設定、`ai.cloudnature.jp` ドメイン設定、SSL確認、ビルド成功確認

### 本番/E2E確認
- [x] `https://ai.cloudnature.jp` にアクセスしてランディングページが表示される
- [x] 「無料で見積もる」からチャット画面へ遷移
- [x] Step 1〜7 回答
- [x] Step 7 後に AI 動的質問（Step 8 選択肢）生成
- [x] Step 8〜13 回答
- [x] 見積もり生成開始（ローディング表示）
- [x] 完了ページに見積もり結果表示
- [x] 不正セッションIDで `/step` が 404 を返す
- [x] リロード時のセッション復元
- [x] `X-API-Key` がクライアントへ露出しない構成
- [x] Cloud Run 直アクセス時に APIキーなし操作を拒否

### 技術的負債の対応済み項目
- [x] メール送信未実装の解消
  - `backend/app/api/v1/estimate.py` で `background_tasks` による非同期送信
  - `backend/app/services/email_service.py` / `backend/app/services/pdf_service.py` を実運用フローに接続
- [x] Docker コンテナ root 実行の解消
- [x] `/complete` ページの価格ハイライトカード空表示の解消
- [x] PII サニタイザーのステップ番号不整合を修正
- [x] `estimate` の ESLint 設定を追加（`estimate/eslint.config.mjs`）
- [x] 未使用コンポーネント削除
- [x] `estimate` の `.env.local.example` 追加
- [x] メールバリデーション正規表現の重複解消
- [x] OpenAI アダプターのエラーハンドリング改善
- [x] `docker-compose` のフロントエンドヘルスチェック追加
- [x] アクセシビリティ改善

### 軽微対応の完了分
- [x] `console.error` の本番残存を整理 — `estimate/lib/logger.ts` を導入し全箇所を置き換え
- [x] `backend` / `estimate` 配下の `.gitignore` 明示追加
- [x] `estimate` アプリに `error.tsx` / `not-found.tsx` を追加

### 対応不要判断
- [x] `pdf/route.ts` の `eslint-disable` コメントは現時点で対応不要

---

## 補足

- 旧チェックリストの詳細コマンドは `docs/20260217_estimate_deploy_design.md` を参照。
- 本ファイルは「現在の残課題を把握しやすいこと」を優先し、未対応を上段に集約。
