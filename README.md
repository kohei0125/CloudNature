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

`backend/.env.sample` を参照。主要な変数:

```bash
DATABASE_URL=postgresql://...          # Neon pooled endpoint
API_KEY=                               # Vercel → backend 間認証（ローカルでは空でスキップ）
LLM_PROVIDER=gemini                    # "gemini" | "openai" | "fallback"
GEMINI_API_KEY=<your-key>
OPENAI_API_KEY=<your-key>
RESEND_API_KEY=<your-key>              # 週次レポートメール送信に使用
REPORT_EMAIL=                          # 週次レポート送信先メールアドレス
GOOGLE_SERVICE_ACCOUNT_JSON=           # ローカル開発用（Cloud RunではADC）
GSC_SITE_URL=sc-domain:cloudnature.jp  # Search Console ドメインプロパティ
GA4_PROPERTY_ID=properties/XXXXXXXXX   # GA4 プロパティID
```

### estimate/.env.local

`estimate/.env.sample` を参照。主要な変数:

```bash
BACKEND_URL=http://localhost:8000
NEXT_PUBLIC_API_BASE=
NEXT_PUBLIC_ENV=development
BACKEND_API_KEY=
NEXT_PUBLIC_GA_ID=          # GA4測定ID（コーポレートサイトと同じ値、ローカルでは空でOK）
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

| コンポーネント | デプロイ先 | デプロイ方法 |
|---|---|---|
| コーポレートサイト | Vercel | `git push`（自動） |
| AI見積もりフロントエンド | Vercel (`estimate/` を Root Directory に指定) | `git push`（自動） |
| 見積もりバックエンド | GCP Cloud Run (asia-northeast1) | `./deploy.sh` |
| データベース | Neon (Serverless PostgreSQL) | — |

### バックエンドのデプロイ

```bash
# デフォルト設定でデプロイ（プロジェクトルートから実行）
./deploy.sh

# 環境変数で上書きも可能
IMAGE_TAG=v1.2.0 ./deploy.sh
```

`deploy.sh` は以下を自動実行します:

1. Cloud Build で `backend/` の Docker イメージをビルド＆プッシュ
2. ダイジェスト指定で Cloud Run にデプロイ（タグの不整合を防止）
3. 環境変数・Secret Manager 参照を一括設定
4. Cloud Scheduler ジョブ（週次レポート）の作成・更新

| 環境変数 | デフォルト値 | 説明 |
|---|---|---|
| `GCP_PROJECT` | `video-gen-demo` | GCP プロジェクト ID |
| `GCP_REGION` | `asia-northeast1` | Cloud Run リージョン |
| `SERVICE_NAME` | `backend` | Cloud Run サービス名 |
| `IMAGE_TAG` | git short hash | イメージタグ |
| `SCHEDULER_SCHEDULE` | `0 10 * * 1` | 週次レポートの cron 式（デフォルト: 毎週月曜 10:00 JST） |

シークレット（`API_KEY`, `OPENAI_API_KEY`, `RESEND_API_KEY`, `DATABASE_URL`）は GCP Secret Manager から自動参照されます。

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

## GA4 アクセス計測

コーポレートサイト（cloudnature.jp）と見積もりサイト（ai.cloudnature.jp）で **同一の GA4 プロパティ**（測定ID）を共有し、1つのプロパティ内で両サイトのデータを収集する。

| サイト | GA4タグ | 設定場所 |
|---|---|---|
| cloudnature.jp | `components/shared/GoogleAnalytics.tsx` | `app/layout.tsx` |
| ai.cloudnature.jp | `estimate/components/shared/GoogleAnalytics.tsx` | `estimate/app/layout.tsx` |

- **測定ID**: 環境変数 `NEXT_PUBLIC_GA_ID`（Vercel の各プロジェクトで同じ値を設定）
- **cross-domain**: GA4 管理画面で手動設定済み
- **ローカル開発**: `NEXT_PUBLIC_GA_ID` を空にすれば計測タグは出力されない

### 週次レポート

バックエンドが GA4 Data API + Search Console API からデータを取得し、Resend 経由でメール送信する。

- **スケジュール**: Cloud Scheduler → `POST /api/v1/reports/weekly`（毎週月曜 10:00 JST）
- **認証**: Cloud Scheduler → Cloud Run は OIDC トークン（IAM `roles/run.invoker`）。`X-API-Key` チェックはスキップ
- **送信先**: 環境変数 `REPORT_EMAIL` に設定したアドレス
- **冪等性**: `year_week` 単位で重複送信を防止（DB に `WeeklyReportLog` で記録）
- **サイト別（hostName）セクション**: cloudnature.jp / ai.cloudnature.jp ごとのセッション・ユーザー・PV・前週比を表示
- **閲覧ページ別 Top**: `hostName` + `pagePath` の2次元で集計（2サイトの同一パスが合算されない）
- **本番ホスト絞り込み**: `PRODUCTION_HOSTS`（`ga4_service.py`）で localhost や `*.vercel.app` を除外
- **GSC host分離**: 現時点ではスコープ外（`sc-domain:cloudnature.jp` はサブドメインを含むが、ai.cloudnature.jp の検索流入はほぼないため将来課題）

Scheduler ジョブは `deploy.sh` のステップ 3 で自動作成・更新される。手動実行: `gcloud scheduler jobs run weekly-report --project video-gen-demo --location asia-northeast1`

関連コード: `backend/app/services/ga4_service.py`, `backend/app/tasks/weekly_report.py`, `backend/app/templates/weekly_report_email.html`

---

## ドキュメント

| ファイル | 内容 |
|---|---|
| [`docs/TODO.md`](docs/TODO.md) | デプロイチェックリスト & 技術的負債 |
| [`docs/20260217_estimate_deploy_design.md`](docs/20260217_estimate_deploy_design.md) | デプロイ設計（Cloud Run + Neon + Vercel） |
| [`docs/20260216_estimate_strategy.md`](docs/20260216_estimate_strategy.md) | 見積もりシステム戦略 |
| [`docs/20260216_estimate_top_design.md`](docs/20260216_estimate_top_design.md) | 見積もり UI/UX 設計 |
| [`docs/20260212_estimate_system_design.md`](docs/20260212_estimate_system_design.md) | システム設計 |
| [`docs/20260310_weekly_report_review.md`](docs/20260310_weekly_report_review.md) | 週次レポート機能 検証・レビュー |
