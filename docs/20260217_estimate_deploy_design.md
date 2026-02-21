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
| データベース | PostgreSQL 17（Serverless） | Neon |

### 1.2 設計方針

- **コスト最小化**: Neon Free Tier + Cloud Run 従量課金で固定費 $0 を実現
- **レイテンシ対策**: DB 書き込みの非同期化（fire-and-forget）で Neon のリージョン遅延を吸収
- **運用簡素化**: マネージドサービスの組合せで、インフラ管理を最小限に
- **環境統一**: ローカル開発・本番ともに Neon に接続（環境差異を排除）

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
│  PostgreSQL 17       │
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

### 3.1 プロジェクト情報

| 項目 | 値 |
|---|---|
| Project ID | `long-math-54903705` |
| Project 名 | `cloudnature-estimate` |
| リージョン | Singapore (ap-southeast-1) |
| PostgreSQL | 17 |
| Database 名 | `neondb` |
| Role | `neondb_owner` |
| Endpoint | `ep-soft-silence-a1xc7x35-pooler.ap-southeast-1.aws.neon.tech` |

### 3.2 プラン

**Free Tier** で開始する。

| 項目 | Free Tier 仕様 |
|---|---|
| Compute | 0.25 CU（自動スケール）、190 CU-hours/月 |
| Storage | 0.5 GB |
| Branches | 10 |
| Projects | 1 |
| 接続プーリング | Neon pooler 内蔵 |
| バックアップ | 24 時間以内の Branch Restore |

### 3.3 接続方式

Neon の **pooled endpoint** を使用し、TLS を必須化する。

```
DATABASE_URL=postgresql://neondb_owner:<PASSWORD>@ep-soft-silence-a1xc7x35-pooler.ap-southeast-1.aws.neon.tech/neondb?sslmode=require
```

- pooled endpoint は PgBouncer ベースの接続プーリングを提供
- Cloud Run のインスタンス増減に対して接続数を安定させる
- アプリ側の pool_size は小さめに設定（§4.3 参照）

### 3.4 ストレージ見積もり

| テーブル | 1レコードあたり | 月間想定件数 | 月間増分 |
|---|---|---|---|
| EstimateSession | ~200 bytes | ~100 | ~20 KB |
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

### 4.3 コネクションプール設定

`backend/app/db.py`:

```python
engine = create_engine(
    settings.database_url,
    echo=False,
    pool_size=2,
    max_overflow=3,
    pool_pre_ping=True,
)
```

- `pool_size=2`: Neon Free Tier の接続制限を考慮し小さめに設定
- `max_overflow=3`: Cloud Run の瞬間的な負荷に対応
- `pool_pre_ping=True`: Neon の接続切断（アイドルタイムアウト等）を自動検知

### 4.4 セッション検証のキャッシュ

セッション存在確認（SELECT）を TTL 付きキャッシュで高速化する。

```python
_session_cache: dict[str, float] = {}
_CACHE_TTL = 300  # 5分

def get_session_cached(session_id: str) -> EstimateSession | None:
    now = time()
    if session_id in _session_cache and now - _session_cache[session_id] < _CACHE_TTL:
        return EstimateSession(id=session_id, status="in_progress")
    session = get_estimate_session(session_id)
    if session:
        _session_cache[session_id] = now
    return session
```

### 4.5 レイテンシ影響の最終評価

| API | 対策後の同期 DB 処理 | ユーザー体感への影響 |
|---|---|---|
| POST /session | INSERT 1件（~70ms） | 初回1回のみ。許容範囲 |
| POST /step (1-6, 8-10) | **なし（fire-and-forget + キャッシュ）** | **影響ゼロ** |
| POST /step (7) | fire-and-forget + LLM数秒 | DB遅延は誤差 |
| POST /generate | LLM 数秒が支配的 | DB遅延は誤差 |
| GET /result | SELECT 1件（~70ms） | ポーリング2秒間隔のため無視可能 |

---

## 5. API Key 認証

### 5.1 方式

Vercel Functions（estimate の API Routes）から Cloud Run（backend）への通信を API Key で保護する。
Cloud Run 自体は `--allow-unauthenticated` とし、アプリケーションレベルで API Key を検証する。

### 5.2 フロー

```
estimate (Vercel Functions)
  → fetch(BACKEND_URL, { headers: { "X-API-Key": API_KEY } })
  → Cloud Run (backend)
    → ミドルウェアで X-API-Key を検証
    → 不一致の場合 403 Forbidden
```

### 5.3 シークレット管理

| シークレット | 保管先 | 用途 |
|---|---|---|
| `API_KEY` | GCP Secret Manager | backend の API Key 検証用 |
| `BACKEND_API_KEY` | Vercel 環境変数 | estimate → backend 通信用（`API_KEY` と同じ値） |
| `OPENAI_API_KEY` | GCP Secret Manager | LLM 呼び出し |
| `RESEND_API_KEY` | GCP Secret Manager | メール送信 |
| `DATABASE_URL` | GCP Secret Manager | Neon 接続文字列 |

---

## 6. Vercel デプロイ設定（estimate）

estimate フロントエンドは `git push` で自動デプロイされる。

### 6.1 プロジェクト設定

| 項目 | 値 |
|---|---|
| Framework | Next.js（自動検出） |
| Root Directory | `estimate` |
| Build Command | `npm run build` |
| Output | standalone（`next.config.mjs` で設定済み） |
| Node.js Version | 20.x |

### 6.2 環境変数（Vercel ダッシュボードで設定）

| 変数名 | 値 | スコープ |
|---|---|---|
| `BACKEND_URL` | `https://backend-xxxxx-an.a.run.app` | Production / Preview |
| `BACKEND_API_KEY` | （Secret Manager の `API_KEY` と同じ値） | Production / Preview |
| `NEXT_PUBLIC_CLOUDFLARE_TURNSTILE_SITE_KEY` | （Turnstile サイトキー） | Production / Preview |
| `CLOUDFLARE_TURNSTILE_SECRET_KEY` | （Turnstile シークレットキー） | Production / Preview |

### 6.3 カスタムドメイン

Vercel ダッシュボードで `estimate.cloudnature.co.jp` を追加し、DNS に CNAME レコードを設定する。

---

## 7. Cloud Run デプロイ手順

### 7.1 前提条件（初回のみ）

```bash
# GCP にログイン
gcloud auth login
gcloud config set project PROJECT_ID

# 必要な API を有効化
gcloud services enable \
  run.googleapis.com \
  artifactregistry.googleapis.com \
  secretmanager.googleapis.com
```

### 7.2 Artifact Registry 作成（初回のみ）

```bash
gcloud artifacts repositories create cloudnature \
  --repository-format=docker \
  --location=asia-northeast1

gcloud auth configure-docker asia-northeast1-docker.pkg.dev
```

### 7.3 Secret Manager 登録（初回のみ）

各シークレットを登録する。値は実際のものに置き換えること。

```bash
# API Key（Vercel → backend 間認証）
echo -n "YOUR_API_KEY" | gcloud secrets create api-key --data-file=-

# OpenAI API Key
echo -n "sk-xxx" | gcloud secrets create openai-api-key --data-file=-

# Resend API Key（メール送信）
echo -n "re_xxx" | gcloud secrets create resend-api-key --data-file=-

# Neon 接続文字列
echo -n "postgresql://neondb_owner:PASSWORD@ep-soft-silence-a1xc7x35-pooler.ap-southeast-1.aws.neon.tech/neondb?sslmode=require" \
  | gcloud secrets create database-url --data-file=-
```

シークレットの値を更新する場合:

```bash
echo -n "NEW_VALUE" | gcloud secrets versions add SECRET_NAME --data-file=-
```

### 7.4 backend デプロイ（毎回）

backend を変更するたびに、プロジェクトルートからデプロイスクリプトを実行する。

```bash
./deploy.sh
```

スクリプトは以下を自動実行する:

1. **Cloud Build** で `backend/` の Docker イメージをビルド＆プッシュ
2. **ダイジェスト指定**で Cloud Run にデプロイ（`:latest` タグの不整合を防止）
3. **環境変数**（プレーンテキスト）と **Secret Manager 参照**を一括設定

#### デプロイスクリプトの設定値

環境変数で上書き可能（デフォルト値は `deploy.sh` に記載）:

| 変数 | デフォルト値 | 用途 |
|---|---|---|
| `GCP_PROJECT` | `video-gen-demo` | GCP プロジェクト ID |
| `GCP_REGION` | `asia-northeast1` | Cloud Run リージョン |
| `SERVICE_NAME` | `backend` | Cloud Run サービス名 |
| `IMAGE_TAG` | `backend/` の git short hash | イメージタグ |
| `OPENAI_MODEL` | `gpt-4o` | LLM モデル |
| `LLM_MAX_RETRIES` | `3` | LLM リトライ回数 |
| `LLM_TIMEOUT` | `30` | LLM タイムアウト（秒） |
| `FRONTEND_URL` | `https://ai.cloudnature.jp` | CORS 許可オリジン |
| `CORS_ORIGINS` | `https://ai.cloudnature.jp` | CORS 許可オリジン |
| `DATA_TTL_DAYS` | `31` | データ保持日数 |
| `EMAIL_FROM` | `CloudNature <cloudnature@stage-site.net>` | メール送信元 |
| `NOTIFY_EMAIL` | `k.watanabe.sys.contact@gmail.com` | 管理者通知先 |

シークレット（Secret Manager 参照名）:

| 変数 | デフォルト参照名 |
|---|---|
| `SECRET_API_KEY` | `api-key` |
| `SECRET_OPENAI_API_KEY` | `openai-api-key` |
| `SECRET_RESEND_API_KEY` | `resend-api-key` |
| `SECRET_DATABASE_URL` | `database-url` |

#### 使用例

```bash
# デフォルト設定でデプロイ
./deploy.sh

# イメージタグを指定してデプロイ
IMAGE_TAG=v1.2.0 ./deploy.sh

# 別のモデルを使用
OPENAI_MODEL=gpt-4o-mini ./deploy.sh
```

> Neon はパブリックインターネット経由の TLS 接続のため `--add-cloudsql-instances` は不要。

#### デプロイ確認

```bash
# ヘルスチェック
curl https://backend-638139893800.asia-northeast1.run.app/api/v1/health
```

---

## 8. 環境変数一覧

### 8.1 backend（Cloud Run）

| 変数名 | 供給元 | 説明 |
|---|---|---|
| `DATABASE_URL` | Secret Manager | Neon pooled endpoint 接続文字列 |
| `API_KEY` | Secret Manager | Vercel → backend 間の認証キー |
| `OPENAI_API_KEY` | Secret Manager | OpenAI API キー |
| `RESEND_API_KEY` | Secret Manager | Resend メール送信 API キー |
| `OPENAI_MODEL` | 環境変数 | `gpt-4o` |
| `LLM_MAX_RETRIES` | 環境変数 | `3` |
| `LLM_TIMEOUT` | 環境変数 | `30` |
| `FRONTEND_URL` | 環境変数 | `https://estimate.cloudnature.co.jp` |
| `CORS_ORIGINS` | 環境変数 | `https://estimate.cloudnature.co.jp` |
| `DATA_TTL_DAYS` | 環境変数 | `31` |
| `EMAIL_FROM` | 環境変数 | `CloudNature <noreply@cloudnature.co.jp>` |

### 8.2 ローカル開発（backend/.env）

ローカルでも Neon に直接接続する。`backend/.env` に設定:

```bash
# Database (Neon pooled endpoint)
DATABASE_URL=postgresql://neondb_owner:<PASSWORD>@ep-soft-silence-a1xc7x35-pooler.ap-southeast-1.aws.neon.tech/neondb?sslmode=require

# API Key（ローカルでは空でスキップ）
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

---

## 9. 運用設計

### 9.1 コールドスタート

**Cloud Run**: `min-instances=0` の場合、アイドル後の初回リクエストでコールドスタート（数秒）。
見積もりシステムはリアルタイム性が必須ではないため許容範囲。体感が問題になる場合は `min-instances=1` に変更（月額 +$5〜10）。

**Neon**: アイドル後の初回接続で ~0.5s のウォームアップ。`pool_pre_ping=True` と組合せて自動リカバリする。

### 9.2 定期クリーンアップタスク

現在の backend は起動時の `run_cleanup()` で TTL 超過データを削除している。
Cloud Run はリクエストがない間インスタンスが停止するため、確実な定期実行が保証されない。

**対策:** 初期段階では起動時の `run_cleanup()` で実用上は十分。
将来的には Cloud Scheduler から `/api/v1/cleanup` エンドポイントを定期呼び出しする方式に変更する。

### 9.3 レートリミッター

インメモリ型レートリミッター（`RateLimitMiddleware`、60 req/min/IP）は Cloud Run インスタンスごとに独立。
初期段階では `max-instances=3` のため問題にならないが、将来的には Redis（Memorystore）や Cloud Armor での制御を検討する。

### 9.4 監視

| 対象 | 方法 |
|---|---|
| API 死活監視 | `/api/v1/health` を外部 Uptime 監視で定期チェック |
| Cloud Run | 5xx レート、レイテンシ、インスタンス数を Cloud Monitoring で監視 |
| Neon | 接続数、CU 使用時間、ストレージ使用量を Neon Console で確認 |
| エラー通知 | Cloud Run のログベースアラート（5xx 頻発時に通知） |

### 9.5 Neon のセキュリティ

- TLS 必須（`sslmode=require`）で通信を暗号化
- Neon の IP Allow List を設定し、Cloud Run の egress IP のみ許可（将来的に）
- `DATABASE_URL` は GCP Secret Manager で管理し、環境変数に直接記載しない

---

## 10. 将来のスケールパス

| フェーズ | 変更内容 |
|---|---|
| 初期（本設計） | Neon Free Tier, Cloud Run min 0 |
| 成長期 | Neon Launch プラン（$19/月、10GB、SLA あり）、min-instances=1 |
| 拡大期 | Cloud Armor（WAF/DDoS 対策）、Cloud Scheduler でクリーンアップ |
| 大規模 | Cloud SQL（asia-northeast1）への移行を検討、Memorystore (Redis) でレートリミット・キャッシュ |

### 10.1 Cloud SQL への移行パス

Neon の制限を超えた場合の移行手順:

1. Cloud SQL インスタンス作成（asia-northeast1、db-f1-micro）
2. `pg_dump` / `pg_restore` でデータ移行
3. `DATABASE_URL` を Cloud SQL 形式に変更
4. Cloud Run に `--add-cloudsql-instances` フラグを追加
5. `db.py` の `pool_size` を 5 に引き上げ（同一リージョンのため余裕あり）
6. 動作確認後、Neon Project を削除
