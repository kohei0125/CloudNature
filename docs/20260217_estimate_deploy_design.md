# AI見積もりシステム デプロイ設計書

## 1. 概要

AI見積もりシステム（estimate フロントエンド + backend API）の本番デプロイ構成を定義する。
コーポレートサイト（cloudnature.co.jp）は既に Vercel で運用中であり、estimate フロントエンドも Vercel に統一する。
backend は GCP Cloud Run、データベースは Neon（Serverless PostgreSQL）で構築する。

### 1.1 対象コンポーネント

| コンポーネント | 技術スタック | デプロイ先 |
|---|---|---|
| estimate（フロントエンド） | Next.js 16 / React 19 / TypeScript | Vercel |
| backend（API） | Python 3.12 / FastAPI / SQLModel | GCP Cloud Run |
| データベース | PostgreSQL（Serverless） | Neon |

### 1.2 設計方針

- **コスト最小化**: Neon Free Tier + Cloud Run 従量課金で固定費 $0 を実現
- **レイテンシ対策**: DB 書き込みの非同期化（fire-and-forget）で Neon のリージョン遅延を吸収
- **運用簡素化**: マネージドサービスの組合せで、インフラ管理を最小限に

---

## 2. アーキテクチャ

```
ユーザー（日本）
  │
  ▼
┌──────────────────────┐
│  Vercel              │
│                      │
│  estimate            │
│  (Next.js)           │
│                      │
│  /api/estimate/*     │  API Routes（Vercel Functions）
│  /api/pdf            │  が backend へプロキシ
└──────────┬───────────┘
           │ HTTPS + X-API-Key
           ▼
┌──────────────────────┐
│  GCP Cloud Run       │
│  (asia-northeast1)   │
│                      │
│  backend             │
│  (FastAPI :8000)     │
│                      │
│  /api/v1/estimate/*  │
│  /api/v1/health      │
└──────────┬───────────┘
           │ TLS (sslmode=require)
           ▼
┌──────────────────────┐
│  Neon                │
│  (Singapore)         │
│                      │
│  PostgreSQL          │
│  (pooled endpoint)   │
└──────────────────────┘
```

### 2.1 通信フロー

1. ユーザーが `estimate.cloudnature.co.jp` にアクセス
2. Vercel が Next.js ページを配信（SSR / Static）
3. クライアントから `/api/estimate/*` を呼び出し
4. Vercel Functions（API Routes）が `BACKEND_URL` に対してリクエストを転送
5. リクエスト時に `X-API-Key` ヘッダを付与し、backend 側で検証
6. backend が Neon PostgreSQL に接続してデータを永続化
7. LLM 呼び出し（OpenAI API）は backend から直接実行

### 2.2 ドメイン構成

| ドメイン | 用途 | 管理 |
|---|---|---|
| `cloudnature.co.jp` | コーポレートサイト | Vercel |
| `estimate.cloudnature.co.jp` | 見積もりフロントエンド | Vercel |
| `backend-*.a.run.app`（または独自ドメイン） | API | GCP Cloud Run |
| `*.neon.tech` | PostgreSQL 接続先 | Neon |

---

## 3. Neon 構成詳細

### 3.1 プラン

**Free Tier** で開始する。

| 項目 | Free Tier 仕様 |
|---|---|
| Compute | 0.25 CU（自動スケール）、190 CU-hours/月 |
| Storage | 0.5 GB |
| Branches | 10 |
| Projects | 1 |
| 接続プーリング | Neon pooler 内蔵 |
| バックアップ | 24 時間以内の Branch Restore |

### 3.2 リージョン

Neon は東京リージョン未提供のため、最寄りの **Singapore (ap-southeast-1)** を選択する。
Cloud Run（asia-northeast1）との間のレイテンシは ~60-80ms だが、非同期設計で吸収する（§4 参照）。

### 3.3 接続方式

Neon の **pooled endpoint** を使用し、TLS を必須化する。

```
DATABASE_URL=postgresql://USER:PASSWORD@EP-XXXX-pooler.ap-southeast-1.aws.neon.tech/estimate?sslmode=require
```

- pooled endpoint は PgBouncer ベースの接続プーリングを提供
- Cloud Run のインスタンス増減に対して接続数を安定させる
- アプリ側の pool_size は小さめに設定（§4.3 参照）

### 3.4 ストレージ見積もり

| テーブル | 1レコードあたり | 月間想定件数 | 月間増分 |
|---|---|---|---|
| EstimateSession | ~200 bytes | ~100 | ~20 KB |
| StepAnswer | ~300 bytes | ~1,000 (100 × 10steps) | ~300 KB |
| GeneratedEstimate | ~5 KB (JSON) | ~100 | ~500 KB |

TTL 31日で自動削除するため、累積ストレージは **~1 MB 程度** で安定し、Free Tier の 0.5 GB を十分下回る。

### 3.5 コスト見積もり

| 項目 | 想定費用 |
|---|---|
| Neon (Free Tier) | $0 |
| Cloud Run（従量課金、アイドル時 $0） | $0〜5 |
| Artifact Registry | ~$1 |
| Secret Manager | ~$0 |
| **合計** | **~$1〜6** |

---

## 4. レイテンシ対策: DB 操作の非同期化

### 4.1 課題

Cloud Run (東京) ↔ Neon (Singapore) 間のレイテンシは ~60-80ms/クエリ。
`/step` API は SELECT + UPSERT の2クエリを実行するため、同期的に処理すると +140ms の遅延が発生する。

### 4.2 対策: fire-and-forget パターン

DB 書き込みをバックグラウンドタスクにし、レスポンスを即座に返す。

**変更対象: `backend/app/api/v1/estimate.py` — `/step` エンドポイント**

```python
# 変更前: DB完了を待ってからレスポンス
session_service.save_step_answer(
    session_id=request.session_id,
    step_number=request.step_number,
    value=request.value,
)
return StepResponse(success=True, next_step=next_step, ai_options=ai_options)

# 変更後: バックグラウンドで保存、即座にレスポンス
from fastapi import BackgroundTasks

@router.post("/step", response_model=StepResponse)
async def submit_step(
    request: SubmitStepRequest,
    background_tasks: BackgroundTasks,
) -> StepResponse:
    # セッション検証はキャッシュから（§4.3）
    session = session_service.get_session_cached(request.session_id)
    if session is None:
        raise HTTPException(status_code=404, detail="Session not found")

    # 回答保存はバックグラウンドで実行
    background_tasks.add_task(
        session_service.save_step_answer,
        session_id=request.session_id,
        step_number=request.step_number,
        value=request.value,
    )

    next_step = request.step_number + 1
    ai_options = None

    if request.step_number == 7:
        try:
            ai_options = await estimate_service.generate_dynamic_questions(
                request.session_id
            )
        except Exception:
            logger.exception("Failed to generate dynamic questions")

    return StepResponse(success=True, next_step=next_step, ai_options=ai_options)
```

### 4.3 セッション検証のキャッシュ

セッション存在確認（SELECT）を TTL 付きキャッシュで高速化する。

**追加: `backend/app/services/session_service.py`**

```python
from functools import lru_cache
from time import time

_session_cache: dict[str, float] = {}
_CACHE_TTL = 300  # 5分

def get_session_cached(session_id: str) -> EstimateSession | None:
    """キャッシュ付きセッション取得。存在確認のみに使用。"""
    now = time()
    if session_id in _session_cache and now - _session_cache[session_id] < _CACHE_TTL:
        # キャッシュヒット: DBアクセス不要
        return EstimateSession(id=session_id, status="in_progress")

    session = get_estimate_session(session_id)
    if session:
        _session_cache[session_id] = now
    return session
```

### 4.4 レイテンシ影響の最終評価

| API | 対策後の同期 DB 処理 | ユーザー体感への影響 |
|---|---|---|
| POST /session | INSERT 1件（~70ms） | 初回1回のみ。許容範囲 |
| POST /step (1-6, 8-10) | **なし（fire-and-forget + キャッシュ）** | **影響ゼロ** |
| POST /step (7) | fire-and-forget + LLM数秒 | DB遅延は誤差 |
| POST /generate | LLM 数秒が支配的 | DB遅延は誤差 |
| GET /result | SELECT 1件（~70ms） | ポーリング2秒間隔のため無視可能 |

---

## 5. データベース移行（SQLite → PostgreSQL）

### 5.1 変更対象ファイル

| ファイル | 変更内容 |
|---|---|
| `backend/requirements.txt` | `psycopg2-binary>=2.9.10` を追加 |
| `backend/app/db.py` | SQLite 固有の `check_same_thread=False` を条件付きに変更、コネクションプール設定追加 |
| `backend/app/config.py` | `api_key` 設定を追加 |
| `backend/app/main.py` | API Key 検証ミドルウェアを追加 |
| `backend/app/api/v1/estimate.py` | `/step` の fire-and-forget 化 |
| `backend/app/services/session_service.py` | セッションキャッシュ追加 |
| `backend/.env.sample` | `DATABASE_URL` を Neon 形式に更新、`API_KEY` を追加 |

### 5.2 db.py 変更内容

**変更前（SQLite）:**
```python
engine = create_engine(
    settings.database_url,
    echo=False,
    connect_args={"check_same_thread": False},
)
```

**変更後（PostgreSQL / SQLite 両対応）:**
```python
connect_args = {}
if settings.database_url.startswith("sqlite"):
    connect_args["check_same_thread"] = False

engine = create_engine(
    settings.database_url,
    echo=False,
    pool_size=2,
    max_overflow=3,
    pool_pre_ping=True,
    connect_args=connect_args,
)
```

- `pool_size=2`: Neon Free Tier の接続制限を考慮し小さめに設定
- `max_overflow=3`: Cloud Run の瞬間的な負荷に対応
- `pool_pre_ping=True`: Neon の接続切断（アイドルタイムアウト等）を自動検知

### 5.3 スキーマ移行

SQLModel の `create_db_and_tables()` が起動時にテーブルを自動作成するため、Alembic 等のマイグレーションツールは初期段階では不要。既存のモデル定義（`EstimateSession`, `StepAnswer`, `GeneratedEstimate`）はそのまま PostgreSQL で動作する。

### 5.4 .env.sample 更新

```bash
# Database (Neon pooled endpoint)
DATABASE_URL=postgresql://USER:PASSWORD@EP-XXXX-pooler.ap-southeast-1.aws.neon.tech/estimate?sslmode=require

# API Key (Vercel → backend 間認証)
API_KEY=

# LLM
OPENAI_API_KEY=
OPENAI_MODEL=gpt-4o
LLM_MAX_RETRIES=3
LLM_TIMEOUT=30

# Email
RESEND_API_KEY=
EMAIL_FROM=CloudNature <noreply@cloudnature.co.jp>

# App
FRONTEND_URL=https://estimate.cloudnature.co.jp
CORS_ORIGINS=https://estimate.cloudnature.co.jp
DATA_TTL_DAYS=31
```

---

## 6. API Key 認証

### 6.1 方式

Vercel Functions（estimate の API Routes）から Cloud Run（backend）への通信を API Key で保護する。
Cloud Run 自体は `--allow-unauthenticated` とし、アプリケーションレベルで API Key を検証する。

### 6.2 フロー

```
estimate (Vercel Functions)
  → fetch(BACKEND_URL, { headers: { "X-API-Key": API_KEY } })
  → Cloud Run (backend)
    → ミドルウェアで X-API-Key を検証
    → 不一致の場合 403 Forbidden
```

### 6.3 backend 側の実装

`app/config.py` に追加:
```python
api_key: str = ""
```

`app/main.py` に API Key 検証ミドルウェアを追加:
```python
class ApiKeyMiddleware(BaseHTTPMiddleware):
    async def dispatch(self, request: Request, call_next):
        if request.url.path == "/api/v1/health":
            return await call_next(request)
        if settings.api_key:
            provided = request.headers.get("X-API-Key", "")
            if provided != settings.api_key:
                raise HTTPException(status_code=403, detail="Invalid API key")
        return await call_next(request)
```

### 6.4 estimate 側の実装

各 API Route (`estimate/app/api/estimate/*/route.ts`) の `fetch` 呼び出しに API Key ヘッダを付与:
```typescript
const res = await fetch(`${BACKEND_URL}/api/v1/...`, {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
    "X-API-Key": process.env.BACKEND_API_KEY ?? "",
  },
  body: JSON.stringify(payload),
});
```

### 6.5 シークレット管理

| シークレット | 保管先 | 用途 |
|---|---|---|
| `API_KEY` | GCP Secret Manager | backend の API Key 検証用 |
| `BACKEND_API_KEY` | Vercel 環境変数 | estimate → backend 通信用（同じ値） |
| `OPENAI_API_KEY` | GCP Secret Manager | LLM 呼び出し |
| `RESEND_API_KEY` | GCP Secret Manager | メール送信 |
| `DATABASE_URL` | GCP Secret Manager | Neon 接続文字列 |

---

## 7. Vercel デプロイ設定（estimate）

### 7.1 プロジェクト設定

| 項目 | 値 |
|---|---|
| Framework | Next.js（自動検出） |
| Root Directory | `estimate` |
| Build Command | `npm run build` |
| Output | standalone（`next.config.mjs` で設定済み） |
| Node.js Version | 20.x |

### 7.2 環境変数

| 変数名 | 値 | スコープ |
|---|---|---|
| `BACKEND_URL` | `https://backend-xxxxx-an.a.run.app` | Production / Preview |
| `BACKEND_API_KEY` | （Secret Manager と同じ値） | Production / Preview |

### 7.3 カスタムドメイン

Vercel ダッシュボードで `estimate.cloudnature.co.jp` を追加し、DNS に CNAME レコードを設定する。

---

## 8. Cloud Run デプロイ手順

### 8.1 前提条件

```bash
gcloud auth login
gcloud config set project PROJECT_ID
gcloud services enable \
  run.googleapis.com \
  artifactregistry.googleapis.com \
  secretmanager.googleapis.com
```

※ Cloud SQL を使わないため `sqladmin.googleapis.com` は不要。

### 8.2 Neon セットアップ

Neon コンソール（https://console.neon.tech）で操作:

1. **Project 作成**: リージョン `Singapore (ap-southeast-1)` を選択
2. **Database 作成**: `estimate`
3. **Role 作成**: `estimate_user`（パスワード自動生成）
4. **接続文字列を取得**: pooled endpoint 形式（`-pooler` を含む URL）

```
postgresql://estimate_user:PASSWORD@ep-xxxx-pooler.ap-southeast-1.aws.neon.tech/estimate?sslmode=require
```

### 8.3 Secret Manager 登録

```bash
echo -n "GENERATED_API_KEY" | gcloud secrets create api-key --data-file=-
echo -n "sk-xxx" | gcloud secrets create openai-api-key --data-file=-
echo -n "re_xxx" | gcloud secrets create resend-api-key --data-file=-
echo -n "postgresql://estimate_user:PASS@ep-xxxx-pooler.ap-southeast-1.aws.neon.tech/estimate?sslmode=require" \
  | gcloud secrets create database-url --data-file=-
```

### 8.4 Artifact Registry & イメージビルド

```bash
gcloud artifacts repositories create cloudnature \
  --repository-format=docker \
  --location=asia-northeast1

gcloud auth configure-docker asia-northeast1-docker.pkg.dev

docker build -t asia-northeast1-docker.pkg.dev/PROJECT_ID/cloudnature/backend:latest ./backend
docker push asia-northeast1-docker.pkg.dev/PROJECT_ID/cloudnature/backend:latest
```

### 8.5 Cloud Run デプロイ

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
  --set-secrets="\
API_KEY=api-key:latest,\
OPENAI_API_KEY=openai-api-key:latest,\
RESEND_API_KEY=resend-api-key:latest,\
DATABASE_URL=database-url:latest" \
  --set-env-vars="\
OPENAI_MODEL=gpt-4o,\
LLM_MAX_RETRIES=3,\
LLM_TIMEOUT=30,\
FRONTEND_URL=https://estimate.cloudnature.co.jp,\
CORS_ORIGINS=https://estimate.cloudnature.co.jp,\
DATA_TTL_DAYS=31,\
EMAIL_FROM=CloudNature <noreply@cloudnature.co.jp>" \
  --allow-unauthenticated
```

※ Neon はパブリックインターネット経由の TLS 接続のため `--add-cloudsql-instances` は不要。

---

## 9. CI/CD

### 9.1 backend（GitHub Actions → Cloud Run）

```yaml
# .github/workflows/deploy-backend.yml
name: Deploy Backend

on:
  push:
    branches: [main]
    paths: ['backend/**']

env:
  PROJECT_ID: PROJECT_ID
  REGION: asia-northeast1
  REGISTRY: asia-northeast1-docker.pkg.dev/PROJECT_ID/cloudnature

jobs:
  deploy:
    runs-on: ubuntu-latest
    permissions:
      contents: read
      id-token: write
    steps:
      - uses: actions/checkout@v4
      - uses: google-github-actions/auth@v2
        with:
          workload_identity_provider: ${{ secrets.WIF_PROVIDER }}
          service_account: ${{ secrets.WIF_SA }}
      - uses: google-github-actions/setup-gcloud@v2
      - run: gcloud auth configure-docker ${REGION}-docker.pkg.dev
      - run: |
          docker build -t ${REGISTRY}/backend:${{ github.sha }} ./backend
          docker push ${REGISTRY}/backend:${{ github.sha }}
      - run: |
          gcloud run deploy backend \
            --image=${REGISTRY}/backend:${{ github.sha }} \
            --region=${REGION}
```

### 9.2 estimate（Vercel 自動デプロイ）

Vercel の GitHub 連携により、`main` ブランチへの push で自動デプロイされる。
`estimate/` 配下の変更のみがトリガーとなるよう、Vercel の Root Directory 設定で制御する。

---

## 10. 運用設計

### 10.1 コールドスタート

**Cloud Run**: `min-instances=0` の場合、アイドル後の初回リクエストでコールドスタート（数秒）。
見積もりシステムはリアルタイム性が必須ではないため許容範囲。体感が問題になる場合は `min-instances=1` に変更（月額 +$5〜10）。

**Neon**: アイドル後の初回接続で ~0.5s のウォームアップ。`pool_pre_ping=True` と組合せて自動リカバリする。

### 10.2 定期クリーンアップタスク

現在の backend は `asyncio.create_task` で6時間ごとの TTL クリーンアップを実行している。
Cloud Run はリクエストがない間インスタンスが停止するため、確実な実行が保証されない。

**対策:** Cloud Scheduler から `/api/v1/cleanup` エンドポイントを定期呼び出しする方式に変更する。ただし初期段階では起動時の `run_cleanup()` で実用上は十分。

### 10.3 レートリミッター

インメモリ型レートリミッター（`RateLimitMiddleware`、60 req/min/IP）は Cloud Run インスタンスごとに独立。
初期段階では `max-instances=3` のため問題にならないが、将来的には Redis（Memorystore）や Cloud Armor での制御を検討する。

### 10.4 監視

| 対象 | 方法 |
|---|---|
| API 死活監視 | `/api/v1/health` を外部 Uptime 監視で定期チェック |
| Cloud Run | 5xx レート、レイテンシ、インスタンス数を Cloud Monitoring で監視 |
| Neon | 接続数、CU 使用時間、ストレージ使用量を Neon Console で確認 |
| エラー通知 | Cloud Run のログベースアラート（5xx 頻発時に通知） |

### 10.5 Neon のセキュリティ

- TLS 必須（`sslmode=require`）で通信を暗号化
- Neon の IP Allow List を設定し、Cloud Run の egress IP のみ許可（将来的に）
- `DATABASE_URL` は GCP Secret Manager で管理し、環境変数に直接記載しない

---

## 11. 将来のスケールパス

| フェーズ | 変更内容 |
|---|---|
| 初期（本設計） | Neon Free Tier, Cloud Run min 0 |
| 成長期 | Neon Launch プラン（$19/月、10GB、SLA あり）、min-instances=1 |
| 拡大期 | Cloud Armor（WAF/DDoS 対策）、Cloud Scheduler でクリーンアップ |
| 大規模 | Cloud SQL（asia-northeast1）への移行を検討、Memorystore (Redis) でレートリミット・キャッシュ |

### 11.1 Cloud SQL への移行パス

Neon の制限を超えた場合の移行手順:

1. Cloud SQL インスタンス作成（asia-northeast1、db-f1-micro）
2. `pg_dump` / `pg_restore` でデータ移行
3. `DATABASE_URL` を Cloud SQL 形式に変更
4. Cloud Run に `--add-cloudsql-instances` フラグを追加
5. `db.py` の `pool_size` を 5 に引き上げ（同一リージョンのため余裕あり）
6. 動作確認後、Neon Project を削除
