# CloudNature AI見積もりシステム — TODO一覧

最終更新: 2026-02-17

---

## デプロイチェックリスト（本番公開）

本番URL: https://ai.cloudnature.jp

### Phase 1: インフラ準備

#### 1-1. Neon セットアップ
- [ ] https://console.neon.tech でプロジェクト作成
  - リージョンは Cloud Run（asia-northeast1）に最も近いものを選択（2026-02 時点では `Singapore (ap-southeast-1)` が最寄り。東京が追加されていればそちらを優先）
- [ ] Database `estimate` を作成
- [ ] Role `estimate_user` を作成（パスワード自動生成）
- [ ] Pooled endpoint の接続文字列を控える
  ```
  postgresql://estimate_user:PASSWORD@ep-xxxx-pooler.REGION.aws.neon.tech/estimate?sslmode=require
  ```

#### 1-2. GCP プロジェクト準備
- [ ] GCP プロジェクトを選択 / 作成
  ```bash
  gcloud auth login
  gcloud config set project PROJECT_ID
  ```
- [ ] 必要な API を有効化
  ```bash
  gcloud services enable \
    run.googleapis.com \
    artifactregistry.googleapis.com \
    secretmanager.googleapis.com
  ```

#### 1-3. API Key 生成
- [ ] backend ↔ estimate 間の API Key を生成
  ```bash
  openssl rand -hex 32
  ```
- [ ] 生成した値を控える（Secret Manager + Vercel の両方で使う）

#### 1-4. Cloud Run 用サービスアカウント作成
- [ ] 専用サービスアカウントを作成（デフォルト SA は権限過多のため避ける）
  ```bash
  gcloud iam service-accounts create cloudrun-backend \
    --display-name="Cloud Run Backend"
  ```

#### 1-5. GCP Secret Manager にシークレット登録
- [ ] `api-key`（上で生成した API Key）
- [ ] `openai-api-key`
- [ ] `resend-api-key`
- [ ] `database-url`（Neon の pooled endpoint 接続文字列）
  ```bash
  echo -n "VALUE" | gcloud secrets create api-key --data-file=-
  echo -n "sk-xxx" | gcloud secrets create openai-api-key --data-file=-
  echo -n "re_xxx" | gcloud secrets create resend-api-key --data-file=-
  echo -n "postgresql://..." | gcloud secrets create database-url --data-file=-
  ```

#### 1-6. Secret Manager の IAM 権限付与
- [ ] Cloud Run サービスアカウントに `secretAccessor` ロールを付与
  ```bash
  SA_EMAIL=cloudrun-backend@PROJECT_ID.iam.gserviceaccount.com
  for SECRET in api-key openai-api-key resend-api-key database-url; do
    gcloud secrets add-iam-policy-binding $SECRET \
      --member="serviceAccount:${SA_EMAIL}" \
      --role="roles/secretmanager.secretAccessor"
  done
  ```
  > **注意**: この手順を省略すると `--set-secrets` 指定時に Permission denied で Cloud Run が起動しません。

#### 1-7. Artifact Registry 作成
- [ ] Docker リポジトリを作成
  ```bash
  gcloud artifacts repositories create cloudnature \
    --repository-format=docker \
    --location=asia-northeast1
  gcloud auth configure-docker asia-northeast1-docker.pkg.dev
  ```

---

### Phase 2: Backend デプロイ（Cloud Run）

#### 2-1. Docker イメージ ビルド & プッシュ
- [ ] backend イメージをビルド
  ```bash
  docker build -t asia-northeast1-docker.pkg.dev/PROJECT_ID/cloudnature/backend:latest ./backend
  docker push asia-northeast1-docker.pkg.dev/PROJECT_ID/cloudnature/backend:latest
  ```

#### 2-2. Cloud Run デプロイ
- [ ] デプロイ実行
  ```bash
  gcloud run deploy backend \
    --image=asia-northeast1-docker.pkg.dev/PROJECT_ID/cloudnature/backend:latest \
    --region=asia-northeast1 \
    --platform=managed \
    --port=8000 \
    --memory=512Mi \
    --cpu=1 \
    --min-instances=0 \
    --max-instances=3 \
    --service-account=cloudrun-backend@PROJECT_ID.iam.gserviceaccount.com \
    --set-secrets=API_KEY=api-key:latest,OPENAI_API_KEY=openai-api-key:latest,RESEND_API_KEY=resend-api-key:latest,DATABASE_URL=database-url:latest \
    --set-env-vars=OPENAI_MODEL=gpt-4o,LLM_MAX_RETRIES=3,LLM_TIMEOUT=30,FRONTEND_URL=https://ai.cloudnature.jp,CORS_ORIGINS=https://ai.cloudnature.jp,DATA_TTL_DAYS=31,"EMAIL_FROM=CloudNature <noreply@cloudnature.co.jp>" \
    --allow-unauthenticated
  ```
- [ ] デプロイ後の Cloud Run URL を控える（例: `https://backend-xxxxx-an.a.run.app`）

#### 2-3. Backend 動作確認
- [ ] ヘルスチェック（API Key 不要で通ること）
  ```bash
  curl https://CLOUD_RUN_URL/api/v1/health
  # → {"status":"ok","timestamp":"2026-02-17T..."}
  ```
- [ ] API Key なしで 403 になること
  ```bash
  curl -X POST https://CLOUD_RUN_URL/api/v1/estimate/session \
    -H "Content-Type: application/json" -d '{}'
  # → {"detail":"Invalid API key"}
  ```
- [ ] API Key 付きでセッション作成できること
  ```bash
  curl -X POST https://CLOUD_RUN_URL/api/v1/estimate/session \
    -H "Content-Type: application/json" \
    -H "X-API-Key: YOUR_API_KEY" \
    -d '{}'
  # → {"session_id":"...","status":"in_progress"}
  ```
- [ ] Neon にテーブルが自動作成されていること（Neon Console の SQL Editor で確認）
  ```sql
  SELECT table_name FROM information_schema.tables WHERE table_schema = 'public';
  ```

---

### Phase 3: Frontend デプロイ（Vercel）

#### 3-1. Vercel プロジェクト設定
- [ ] Vercel に新規プロジェクト作成（GitHub リポジトリ連携）
- [ ] Root Directory: `estimate`
- [ ] Framework: Next.js（自動検出）
- [ ] Node.js Version: 20.x

#### 3-2. Vercel 環境変数設定
- [ ] `BACKEND_URL` = `https://CLOUD_RUN_URL`（Phase 2 で控えた URL）
- [ ] `BACKEND_API_KEY` = Phase 1-3 で生成した API Key
- [ ] `NEXT_PUBLIC_ENV` = `production`

#### 3-3. カスタムドメイン設定
- [ ] Vercel ダッシュボードで `ai.cloudnature.jp` をカスタムドメインとして追加
- [ ] DNS に CNAME レコードを追加
  ```
  ai.cloudnature.jp → cname.vercel-dns.com
  ```
- [ ] SSL 証明書の自動発行を確認（Vercel 側で自動）

#### 3-4. デプロイ & ビルド確認
- [ ] Vercel でデプロイが成功すること
- [ ] ビルドログにエラーがないこと

---

### Phase 4: E2E 動作確認

#### 4-1. 基本フロー確認
- [ ] https://ai.cloudnature.jp にアクセスしてランディングページが表示される
- [ ] 「無料で見積もる」ボタンからチャット画面に遷移する
- [ ] Step 1〜7 の質問に回答できる（各ステップでレスポンスが返る）
- [ ] Step 7 回答後に AI 動的質問（Step 8 の選択肢）が生成される
- [ ] Step 8〜13 まで回答できる
- [ ] 見積もり生成が開始される（ローディング表示）
- [ ] 完了ページに見積もり結果が表示される

#### 4-2. レイテンシ確認
- [ ] `/step` API のレスポンスタイムが fire-and-forget により高速化されていること
  - Step 1〜6: ~100ms 以内を目安
  - Step 7: LLM 呼び出しがあるため数秒は許容

#### 4-3. エラーケース確認
- [ ] 不正なセッションIDで `/step` を叩くと 404 が返る
- [ ] ブラウザをリロードしてもセッションが復元される
- [ ] ネットワーク切断後のリトライが機能する

#### 4-4. セキュリティ確認
- [ ] ブラウザの DevTools で `X-API-Key` がクライアント側に露出していないこと
  （API Key は Vercel Functions 内でのみ使用され、ブラウザには渡らない）
- [ ] Cloud Run の URL に直接アクセスしても API Key なしでは操作できないこと

---

## 既存の技術的負債

### P0: CRITICAL（リリースブロッカー）

#### 1. メール送信が未実装
- **概要**: `backend/app/services/email_service.py` と `pdf_service.py` が存在するが、どこからも呼び出されていない。見積もり生成後にユーザーへメール送信されない。
- **対象ファイル**:
  - `backend/app/services/email_service.py` — 実装済みだが未使用
  - `backend/app/services/pdf_service.py` — 実装済みだが未使用
  - `backend/app/api/v1/estimate.py` — generate エンドポイントにメール送信処理を追加
- **現状のフロー**: `generate_estimate()` → 結果をDBに保存 → 終了
- **あるべきフロー**: `generate_estimate()` → PDF取得 → メール送信 → 結果をDBに保存
- **影響**: `/complete` ページで「メールでお送りしました」と表示されるが、実際にはメールが届かない

#### 2. APIキーの漏洩リスク
- **概要**: `backend/.env` に本物の OpenAI API キーと Resend API キーが記載されている
- **対象ファイル**: `backend/.env`
- **対応**:
  - [ ] APIキーをローテーション（OpenAI / Resend のダッシュボードで再発行）
  - [ ] `.env` が git 履歴に含まれていないか確認。含まれている場合は `git filter-repo` で削除
  - [ ] 本番環境ではシークレット管理サービス（GCP Secret Manager）を使用

#### ~~3. Docker コンテナが root で実行されている~~ DONE

---

### P1: HIGH（本番前に対応必須）

#### ~~4. /complete ページの価格ハイライトカードが空~~ DONE

#### 5. 本番用 docker-compose が存在しない
- **概要**: 現在の `docker-compose.yml` は開発専用（`--reload`、volume mount、リソース制限なし）
- **対応**: Cloud Run デプロイにより `docker-compose.prod.yml` は不要。開発用のみ維持。

#### ~~6. PII サニタイザーのステップ番号が不整合~~ DONE

#### 7. estimate アプリに error.tsx / not-found.tsx がない
- **概要**: Next.js のエラーバウンダリと 404 ページが未定義
- **対象ファイル**:
  - `estimate/app/error.tsx` — 新規作成
  - `estimate/app/not-found.tsx` — 新規作成

#### 8. CI/CD パイプラインが未構築
- **概要**: GitHub Actions 等の自動テスト・ビルド・デプロイ設定がない
- **対応**:
  - [ ] `.github/workflows/deploy-backend.yml` — backend 自動デプロイ
  - [ ] estimate は Vercel の GitHub 連携で自動デプロイ

#### 9. estimate ディレクトリの ESLint 設定がない
- **対象ファイル**: `estimate/eslint.config.mjs` — 新規作成

#### 10. バックエンドのテストファイルが存在しない
- **対象ファイル**: `backend/tests/` — 新規作成

#### ~~11. 未使用コンポーネントの削除~~ DONE

---

### P2: MEDIUM（品質向上）

#### 12. Session.email フィールドが未使用
- **対応**: メール送信実装時に、Step 13 の連絡先情報から email を抽出してセッションに保存する

#### ~~13. estimate の .env.local.example がない~~ DONE

#### ~~14. メールバリデーション正規表現が3箇所で重複~~ DONE

#### 15. console.error が本番コードに残存（2箇所）
- `estimate/app/api/pdf/route.ts` — サーバーサイドのため許容可
- `estimate/components/chat/ChatErrorBoundary.tsx` — エラーバウンダリのため許容可

#### 16. cleanup.py で print() を使用
- CLI 実行時のため現状でも可

#### ~~17. OpenAI アダプターのエラーハンドリングが不足~~ DONE

#### 18. backend / estimate に .gitignore がない
- ルートの .gitignore でカバーされているが、明示的に追加が望ましい

#### ~~19. docker-compose にフロントエンドヘルスチェックがない~~ DONE

---

### P3: LOW（改善推奨）

#### ~~20. アクセシビリティ改善~~ DONE

#### 21. pdf/route.ts の eslint-disable コメント — 対応不要

#### 22. Turbopack の複数 lockfile 警告
- `next.config.mjs` で `turbopack.root` を設定するか無視

#### 23. CORS デフォルト値が localhost
- 本番デプロイ時に環境変数で上書きすれば OK

#### 24. /api/pdf が無認証で公開されている
- `estimate/app/api/pdf/route.ts` — 重い PDF レンダリングを誰でも叩ける
- Vercel の DDoS 保護があるため緊急度は低いが、将来的に認証またはレート制限を検討

---

## 対応状況まとめ

| 優先度 | 総数 | 完了 | 残り |
|--------|------|------|------|
| **デプロイ** | 4 Phase | 0 | 4 |
| **P0: CRITICAL** | 3件 | 1件 | 2件 |
| **P1: HIGH** | 8件 | 3件 | 5件 |
| **P2: MEDIUM** | 8件 | 4件 | 4件 |
| **P3: LOW** | 4件 | 1件 | 3件 |
