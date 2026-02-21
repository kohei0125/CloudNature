# CloudNature

CloudNature コーポレートサイト & AI見積もりシステムのモノレポ。

## 構成

```
├── app/             コーポレートサイト (Next.js)   → cloudnature.jp
├── estimate/        AI見積もりフロントエンド (Next.js) → ai.cloudnature.jp
├── backend/         見積もりAPI (FastAPI)           → Cloud Run
├── docs/            設計書・TODO
└── docker-compose.yml  ローカル開発用
```

| サービス | 技術スタック | ポート |
|---|---|---|
| コーポレートサイト | Next.js 16, React 19, Tailwind CSS | 3000 |
| AI見積もりフロントエンド | Next.js 16, React 19, Tailwind CSS, react-pdf | 3001 |
| 見積もりバックエンド | FastAPI, SQLModel, OpenAI API | 8000 |

### データベース

- **ローカル・本番共通**: Neon (Serverless PostgreSQL, Singapore)

### 認証

Vercel (estimate) → Cloud Run (backend) 間は `X-API-Key` ヘッダで保護。
`API_KEY` が空の場合はスキップされる（ローカル開発用）。

---

## ローカル起動

### Docker Compose（推奨）

```bash
# 1. 環境変数を設定（初回のみ）
cp backend/.env.sample backend/.env
# backend/.env を編集して DATABASE_URL, OPENAI_API_KEY 等を設定

# 2. 起動
docker compose up -d --build
# → フロントエンド: http://localhost:3001
# → バックエンド:   http://localhost:8000
# → Swagger UI:     http://localhost:8000/docs

# 3. ログ確認
docker compose logs -f
```

ソースコードの変更はホットリロードで即反映されます。

**トラブルシューティング**: フロントエンドで SWC / Turbopack のエラーが出る場合は、`node_modules` ボリュームを削除して再ビルドしてください:

```bash
docker compose down -v && docker compose up -d --build
```

### コーポレートサイト（別途起動）

```bash
npm install
npm run dev
# → http://localhost:3000
```

### Docker を使わない場合

<details>
<summary>直接起動する方法（Node.js 20+ / Python 3.12+ が必要）</summary>

#### バックエンド

```bash
cd backend
python3 -m venv .venv
.venv/bin/pip install -r requirements.txt
cp .env.sample .env  # OPENAI_API_KEY を設定
.venv/bin/uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload
```

#### 見積もりフロントエンド

```bash
cd estimate
npm install
cp .env.sample .env.local  # 必要に応じて編集
npm run dev
```

</details>

---

## 環境変数

### backend/.env

```bash
# Database (Neon pooled endpoint)
DATABASE_URL=postgresql://neondb_owner:<PASSWORD>@ep-soft-silence-a1xc7x35-pooler.ap-southeast-1.aws.neon.tech/neondb?sslmode=require

# API Key（Vercel → backend 間認証、ローカルでは空でスキップ）
API_KEY=

# LLM
OPENAI_API_KEY=<your-openai-api-key>
OPENAI_MODEL=gpt-4o
LLM_MAX_RETRIES=3
LLM_TIMEOUT=30

# Email
RESEND_API_KEY=<your-resend-api-key>
EMAIL_FROM=CloudNature <cloudnature@stage-site.net>
NOTIFY_EMAIL=k.watanabe.sys.contact@gmail.com

# App
FRONTEND_URL=http://localhost:3001
CORS_ORIGINS=http://localhost:3001
DATA_TTL_DAYS=31
```

### estimate/.env.local

```bash
BACKEND_URL=http://localhost:8000
NEXT_PUBLIC_API_BASE=
NEXT_PUBLIC_ENV=development
BACKEND_API_KEY=
```

---

## API エンドポイント

| メソッド | パス | 概要 |
|---|---|---|
| POST | `/api/v1/estimate/session` | セッション作成 |
| GET | `/api/v1/estimate/session/{id}` | セッション取得 |
| POST | `/api/v1/estimate/step` | ステップ回答送信（Step 7 のみ AI 動的質問生成） |
| POST | `/api/v1/estimate/generate` | 全回答を受け取り見積もり生成 |
| GET | `/api/v1/estimate/result/{id}` | 生成結果ポーリング |
| GET | `/api/v1/health` | ヘルスチェック（API Key 不要） |

DB 書き込みは `/generate` の最終送信時のみ。Step 1-12 の回答はフロントエンドの localStorage で管理し、Step 7 では回答をリクエスト Body に含めて AI 動的質問を生成する。

---

## 本番デプロイ

| コンポーネント | デプロイ先 |
|---|---|
| コーポレートサイト | Vercel |
| AI見積もりフロントエンド | Vercel (`estimate/` を Root Directory に指定) |
| 見積もりバックエンド | GCP Cloud Run (asia-northeast1) |
| データベース | Neon (Serverless PostgreSQL) |

詳細は [`docs/20260217_estimate_deploy_design.md`](docs/20260217_estimate_deploy_design.md) を参照。
デプロイ手順のチェックリストは [`docs/TODO.md`](docs/TODO.md) を参照。

---

## ビルド確認

```bash
# コーポレートサイト
npm run lint -- --max-warnings=0
npm run build

# 見積もりフロントエンド
cd estimate && npm run build
```

---

## ドキュメント

| ファイル | 内容 |
|---|---|
| [`docs/TODO.md`](docs/TODO.md) | デプロイチェックリスト & 技術的負債 |
| [`docs/20260217_estimate_deploy_design.md`](docs/20260217_estimate_deploy_design.md) | デプロイ設計（Cloud Run + Neon + Vercel） |
| [`docs/20260216_estimate_strategy.md`](docs/20260216_estimate_strategy.md) | 見積もりシステム戦略 |
| [`docs/20260216_estimate_top_design.md`](docs/20260216_estimate_top_design.md) | 見積もり UI/UX 設計 |
| [`docs/20260212_estimate_system_design.md`](docs/20260212_estimate_system_design.md) | システム設計 |
