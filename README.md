# CloudNature

CloudNature コーポレートサイト & AI見積もりシステムのモノレポ。

## 構成

```
├── app/             コーポレートサイト (Next.js)   → cloudnature.jp
├── estimate/        AI見積もりシステム (Next.js)    → ai.cloudnature.jp
├── backend/         見積もりAPI (FastAPI)           → api
└── docker-compose.yml
```

| サービス | 技術スタック | ポート |
|---|---|---|
| コーポレートサイト | Next.js 16, React 19, Tailwind CSS | 3000 |
| AI見積もりフロントエンド | Next.js 16, React 19, Tailwind CSS, react-pdf | 3001 |
| 見積もりバックエンド | FastAPI, SQLModel (SQLite), OpenAI API | 8000 |

---

## ローカル起動（Docker Compose 推奨）

### 前提条件

- Docker / Docker Compose

### 1. 環境変数を設定

```bash
cd backend
cp .env.sample .env
# .env を編集して OPENAI_API_KEY と RESEND_API_KEY を設定
```

### 2. AI見積もりシステム（バックエンド + フロントエンド一括起動）

```bash
docker compose up --build
# → フロントエンド: http://localhost:3001
# → バックエンド:   http://localhost:8000
# → Swagger UI:     http://localhost:8000/docs
```

ソースコードの変更はホットリロードで即反映されます（volume mount済み）。

### 3. コーポレートサイト（ルート）

```bash
npm install
npm run dev
# → http://localhost:3000
```

### Docker を使わない場合

<details>
<summary>直接起動する方法（Node.js 20+ / Python 3.11+ が必要）</summary>

#### バックエンド

```bash
cd backend
python3 -m venv .venv
.venv/bin/pip install -r requirements.txt
cp .env.sample .env  # APIキーを設定
.venv/bin/uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload
```

#### フロントエンド

```bash
cd estimate
npm install
BACKEND_URL=http://localhost:8000 npm run dev
```

</details>

---

## 環境変数

### backend/.env

```
OPENAI_API_KEY=<your-openai-api-key>
OPENAI_MODEL=gpt-4o
LLM_MAX_RETRIES=3
LLM_TIMEOUT=30
RESEND_API_KEY=<your-resend-api-key>
DATABASE_URL=sqlite:///./estimate.db
FRONTEND_URL=http://localhost:3001
CORS_ORIGINS=http://localhost:3001
DATA_TTL_DAYS=31
```

---

## API エンドポイント

| メソッド | パス | 概要 |
|---|---|---|
| POST | `/api/v1/estimate/session` | セッション作成 |
| GET | `/api/v1/estimate/session/{id}` | セッション復元 |
| POST | `/api/v1/estimate/step` | ステップ回答送信 |
| POST | `/api/v1/estimate/generate` | 見積もり生成トリガー |
| GET | `/api/v1/estimate/result/{id}` | 生成結果取得 |
| GET | `/api/v1/health` | ヘルスチェック |

---

## ビルド確認

```bash
# コーポレートサイト
npm run build
npm run lint -- --max-warnings=0

# 見積もりフロントエンド
cd estimate && npm run build

# バックエンドテスト
cd backend && .venv/bin/python -m pytest
```
