# CloudNature AI 見積もりバックエンド

AI見積もりシステムのバックエンドAPI。ユーザーの入力を受け取り、LLMで概算見積もり・要件定義データを生成する。

## 技術スタック

- **Python 3.12+**
- **FastAPI** — WebAPI フレームワーク
- **SQLModel** (SQLAlchemy) — ORM
- **SQLite** — データベース（開発環境）
- **OpenAI API** (gpt-4o) — LLM
- **Resend** — メール送信
- **Pydantic v2** — バリデーション + 設定管理

## セットアップ

**推奨: Docker Compose（ルートディレクトリから）**

```bash
cd backend
cp .env.sample .env
# .env を編集して OPENAI_API_KEY 等を設定

# ルートに戻って起動
cd ..
docker compose up --build
# → http://localhost:8000 (API)
# → http://localhost:8000/docs (Swagger UI)
```

<details>
<summary>Docker を使わない場合（Python 3.12+ が必要）</summary>

```bash
cd backend
python -m venv .venv
source .venv/bin/activate  # Windows: .venv\Scripts\activate
pip install -r requirements.txt

cp .env.sample .env
# .env を編集して OPENAI_API_KEY 等を設定

uvicorn app.main:app --reload --port 8000
```

</details>

`http://localhost:8000/docs` で Swagger UI が起動します。

### 環境変数

| 変数 | 説明 | デフォルト |
|------|------|-----------|
| `OPENAI_API_KEY` | OpenAI API キー | `""` (未設定時はフォールバック) |
| `OPENAI_MODEL` | 使用モデル | `gpt-4o` |
| `LLM_MAX_RETRIES` | LLM リトライ回数 | `3` |
| `LLM_TIMEOUT` | LLM タイムアウト (秒) | `30` |
| `RESEND_API_KEY` | Resend API キー | `""` (未設定時はメール送信スキップ) |
| `DATABASE_URL` | DB接続文字列 | `sqlite:///./estimate.db` |
| `FRONTEND_URL` | フロントエンドURL | `http://localhost:3001` |
| `CORS_ORIGINS` | CORS許可オリジン（カンマ区切り） | `http://localhost:3001` |
| `DATA_TTL_DAYS` | データ保持期間 (日) | `31` |

## ディレクトリ構成

```
backend/
├── app/
│   ├── main.py                 # FastAPIアプリ、CORS、レート制限、lifespan
│   ├── config.py               # pydantic-settings 環境変数管理
│   ├── db.py                   # SQLite + SQLModel セットアップ
│   │
│   ├── api/v1/
│   │   ├── router.py           # ルーター集約
│   │   ├── estimate.py         # セッション・ステップ・見積もり生成API
│   │   └── health.py           # ヘルスチェック（DB接続確認付き）
│   │
│   ├── core/
│   │   ├── llm/
│   │   │   ├── adapter.py      # LLMAdapter 抽象基底クラス
│   │   │   ├── openai_adapter.py # OpenAI API実装（system/userロール分離）
│   │   │   ├── fallback.py     # フォールバック（固定テンプレート）
│   │   │   └── factory.py      # アダプターファクトリ
│   │   └── sanitizer.py        # PII除去（メール、電話、URL等）
│   │
│   ├── models/
│   │   ├── session.py          # EstimateSession
│   │   ├── step_answer.py      # StepAnswer (session_id+step_number複合ユニーク)
│   │   └── generated.py        # GeneratedEstimate
│   │
│   ├── schemas/
│   │   ├── request.py          # リクエスト（バリデーション付き）
│   │   ├── response.py         # レスポンス
│   │   ├── llm_output.py       # LLM出力 JSON Schema バリデーション
│   │   └── step_options.py     # ステップ選択肢の定数
│   │
│   ├── services/
│   │   ├── session_service.py  # セッションCRUD + TTL管理
│   │   ├── estimate_service.py # LLM呼び出し + バリデーション + リトライ
│   │   ├── email_service.py    # Resend経由メール送信
│   │   └── pdf_service.py      # フロントエンドPDF APIプロキシ
│   │
│   ├── prompts/v1/
│   │   ├── dynamic_questions.txt  # Step 8 用 systemプロンプト（AI機能提案）
│   │   └── estimate_generation.txt # 見積もり生成用 systemプロンプト
│   │
│   └── tasks/
│       └── cleanup.py          # TTL データ削除ジョブ
│
├── requirements.txt
├── pyproject.toml
├── Dockerfile
├── .env.sample
└── .dockerignore
```

## APIエンドポイント

| メソッド | パス | 説明 |
|----------|------|------|
| `POST` | `/api/v1/estimate/session` | セッション作成 |
| `GET` | `/api/v1/estimate/session/{id}` | セッション取得 |
| `POST` | `/api/v1/estimate/step` | ステップ回答送信 |
| `POST` | `/api/v1/estimate/generate` | 見積もり生成トリガー |
| `GET` | `/api/v1/estimate/result/{id}` | 生成結果ポーリング |
| `GET` | `/api/v1/health` | ヘルスチェック |

### リクエスト例

```bash
# セッション作成
curl -X POST http://localhost:8000/api/v1/estimate/session

# ステップ回答送信
curl -X POST http://localhost:8000/api/v1/estimate/step \
  -H "Content-Type: application/json" \
  -d '{"session_id": "uuid", "step_number": 1, "value": "web_app"}'

# 見積もり生成
curl -X POST http://localhost:8000/api/v1/estimate/generate \
  -H "Content-Type: application/json" \
  -d '{"session_id": "uuid"}'
```

## アーキテクチャ

### LLM統合

```
ユーザー入力 → PII除去 → system/userロール分離プロンプト → OpenAI API
                                                          ↓
                                              JSON Schema バリデーション
                                              + 金額範囲チェック
                                                          ↓
                                              失敗時: 最大3回リトライ
                                              全失敗: フォールバックテンプレート
```

- **プロンプトインジェクション対策**: system/user メッセージロール分離。ユーザー入力はuserロールのみ。
- **PII除去**: メール、電話番号、URL、個人情報ステップ (13) をLLM送信前に除外。
- **出力検証**: JSON Schema + 金額範囲バリデーション（機能単価 1億円上限、合計 5億円上限、hybrid <= standard、hybrid合計 30万円以上）。
- **フォールバック**: OpenAI API障害時やバリデーション3回失敗時に、固定テンプレートで応答。

### 価格計算ロジック

```
hybrid_price = round(standard_price * 0.6)  # 40% OFF
```

通常のSIer価格（standard）に対し、AI活用で60%の価格（hybrid）を算出。

### セキュリティ

- **レート制限**: 60リクエスト/分/IP（インメモリ スライディングウィンドウ）
- **CORS**: 許可オリジン・メソッド・ヘッダーを明示的に制限
- **入力バリデーション**: session_id (UUIDパターン)、step_number (1-13)、value (長さ制限)
- **グレースフルシャットダウン**: 処理中レコードをerrorに更新

### データライフサイクル

- セッション保持期間: 31日（`DATA_TTL_DAYS`で変更可）
- TTL削除: 起動時 + 6時間ごとに自動実行
- 削除対象: セッション + 関連ステップ回答 + 生成結果

## Docker

```bash
# フロントエンドと一緒に起動（推奨）
docker compose up --build

# バックエンド単体
docker build -t cn-estimate-backend ./backend
docker run -p 8000:8000 --env-file ./backend/.env cn-estimate-backend
```

## テスト

```bash
pip install -e ".[dev]"
pytest
```

## ヘルスチェック

```bash
curl http://localhost:8000/api/v1/health
# {"status": "ok", "timestamp": "2026-02-15T..."}
# DB接続失敗時: {"status": "degraded", "timestamp": "..."}
```
