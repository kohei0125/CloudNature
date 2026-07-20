# CloudNature

CloudNature コーポレートサイト・AI見積もりシステム・AI開発研修LP のモノレポ。

## 構成

```
├── app/             コーポレートサイト (Next.js)   → cloudnature.jp
├── estimate/        AI見積もりフロントエンド (Next.js) → ai.cloudnature.jp
├── ai-dev/          AI開発研修LP (Next.js)          → ai-dev.cloudnature.jp
├── backend/         見積もりAPI (FastAPI)           → Cloud Run
├── gas/             ファネルダッシュボード (Google Apps Script)
├── docs/            設計書・TODO
└── docker-compose.yml  ローカル開発用
```

| サービス | 技術スタック | ポート |
|---|---|---|
| コーポレートサイト | Next.js 16, React 19, Tailwind CSS | 3000 |
| AI見積もりフロントエンド | Next.js 16, React 19, Tailwind CSS, react-pdf | 3001 |
| AI開発研修LP | Next.js 16, React 19, Vanilla CSS, Resend | 3002 |
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
NEXT_PUBLIC_GA_ID=          # 非本番のGA4測定ID。estimate本番は共有IDをコード固定
```

### ai-dev/.env.local

`ai-dev/.env.sample` を参照。主要な変数:

```bash
NEXT_PUBLIC_ENV=development
RESEND_API_KEY=             # メール送信（本体コーポレートサイトと共通の値）
EMAIL_FROM=
NOTIFY_EMAIL=              # 無料相談フォームの通知先
NEXT_PUBLIC_GTM_ID=        # 任意。未設定時はGA4直接タグに切り替わる
NEXT_PUBLIC_GA_ID=         # 非本番のGA4測定ID。本番は共有IDをコード固定
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
| POST | `/api/v1/estimate/report-error` | クライアント側エラー報告（運用者へメール通知） |
| GET | `/api/v1/health` | ヘルスチェック（API Key 不要） |

DB 書き込みは `/generate` の最終送信時のみ。Step 1-12 の回答はフロントエンドの localStorage で管理し、Step 7 では回答をリクエスト Body に含めて AI 動的質問を生成する。

---

## 本番デプロイ

| コンポーネント | デプロイ先 | デプロイ方法 |
|---|---|---|
| コーポレートサイト | Vercel | `git push`（自動） |
| AI見積もりフロントエンド | Vercel (`estimate/` を Root Directory に指定) | `git push`（自動） |
| AI開発研修LP | Vercel (`ai-dev/` を Root Directory に指定) | `git push`（自動） |
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

# AI開発研修LP
cd ai-dev && npm run lint && npm run build
```

---

## GA4 アクセス計測

コーポレートサイト（cloudnature.jp）・見積もりサイト（ai.cloudnature.jp）・AI開発研修LP（ai-dev.cloudnature.jp）で **同一の GA4 プロパティ**（測定ID）を共有し、1つのプロパティ内で全サイトのデータを収集する。

| サイト | GA4タグ | 設定場所 |
|---|---|---|
| cloudnature.jp | `components/shared/GoogleAnalytics.tsx` | `app/layout.tsx` |
| ai.cloudnature.jp | `estimate/components/shared/GoogleAnalytics.tsx` | `estimate/app/layout.tsx` |
| ai-dev.cloudnature.jp | `ai-dev/components/GoogleAnalytics.tsx` | `ai-dev/app/layout.tsx` |

- **測定ID**: `cloudnature.jp` は環境変数 `NEXT_PUBLIC_GA_ID`、`ai.cloudnature.jp` / `ai-dev.cloudnature.jp` は本番で共有 ID `G-1CF4H5GXSM` を使用
- **cross-domain**: GA4 管理画面で手動設定済み
- **ローカル開発**: `estimate` は `NEXT_PUBLIC_ENV!=production` かつ `NEXT_PUBLIC_GA_ID` が空なら計測タグは出力されない

### 週次レポート

バックエンドが GA4 Data API + Search Console API からデータを取得し、Resend 経由でメール送信する。

- **テストコマンド**
※weekly_report_logテーブルに同じyear_weekのレコードがない場合のみ実行される
`gcloud scheduler jobs run weekly-report --project video-gen-demo --location asia-northeast1`

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

### ファネルダッシュボード（Google Spreadsheet）

週次データを Google Spreadsheet に蓄積し、チャートで可視化する。GAS が GA4 / GSC API から直接データを取得する方式（バックエンドとは独立）。

- **GASコード**: `gas/funnel_dashboard.js`（Apps Script の `コード.gs` にコピペ）
- **設定ファイル**: `gas/appsscript.json`
- **スケジュール**: 毎週月曜 10:30 JST（メール送信の30分後）
- **シート構成**: 週次サマリー / チャネル別 / 検索キーワード Top10 / 閲覧ページ Top10 / キーイベント詳細 / チャート
- **メールリンク**: 環境変数 `FUNNEL_SPREADSHEET_URL` を設定すると週次メールのフッターにリンクが表示される

セットアップ手順・設計詳細は [`docs/20260322_spreadsheet_funnel_design.md`](docs/20260322_spreadsheet_funnel_design.md) を参照。

---

## リアルタイム翻訳ツール（/realtime-translate）

OpenAI Realtime API（`gpt-realtime`）+ WebRTC による日英双方向の音声通訳ツール。
コーポレートサイト内のページとして動作する（noindex・sitemap 除外の非公開運用）。

設計書: [`docs/20260607_openai_translate.md`](docs/20260607_openai_translate.md)

### 仕組み

```
ブラウザ → POST /api/realtime-translate/session（パスワード照合）
        ← 一時トークン（ek_...、10分有効）
ブラウザ ⇄ OpenAI Realtime API（WebRTC 直接続・音声 + 文字起こし）
```

- OpenAI API キーはサーバー側のみ。ブラウザには短命の一時トークンだけを渡す
- 言語方向の指定は不要（instructions で日→英 / 英→日を自動判定）

### 運用上の注意

- **コスト**: Realtime API は音声入出力ともに従量課金で、テキスト API より高価。
  パスワードの共有範囲に注意し、OpenAI ダッシュボードで Usage Limit の設定を推奨

  | 利用量 | 月間利用時間 | 概算API費用 |
  | --- | ---: | ---: |
  | 個人利用 | 30分/日 | 約460円/月 |
  | 小規模PoC | 1時間/日 | 約920円/月 |
  | 10ユーザー | 合計10時間/日 | 約9,200円/月 |
  | 100ユーザー | 合計100時間/日 | 約92,000円/月 |
  | 1000ユーザー | 合計1000時間/日 | 約92万円/月 |
- **パスワード**: 固定「クラウドネイチャー」を `app/api/realtime-translate/session/route.ts` に
  ハードコード。変更はコード修正 + デプロイ。変更後、旧パスワードを保持しているユーザーは
  401 を受けて自動的に再入力画面へ戻る
- **環境変数**: `OPEN_AI_REALTIME_TRANSLATE_API_KEY`（Vercel / `.env.local`）。
  未設定の場合、翻訳開始時に 500 エラーになる
- **レート制限**: 本番のみ IP ごと 15 分 10 回（`lib/rate-limit.ts`）。インメモリ実装のため
  サーバーレスではインスタンスごとに独立し、再起動でリセットされる（厳密な防御ではない）
- **一時トークン**: 有効期限 10 分は「接続確立まで」の期限。確立済みの通話はトークン失効後も継続する

### 知っておくと良いこと

- **マイク許可**: `next.config.mjs` の Permissions-Policy は全ページ `microphone=()`（禁止）だが、
  `/realtime-translate` のみ `microphone=(self)` に緩和している。新しいページでマイクを使う場合は同様の追記が必要
- **HTTPS 必須**: `getUserMedia` はセキュアコンテキスト限定。スマホ実機での確認は本番 URL か
  Vercel Preview を使う（`http://<LAN IP>:3000` では動かない。localhost は例外的に可）
- **認証の持続**: パスワードは `sessionStorage` 保持（同一タブのリロードのみ有効）。
  「戻る」ボタンかタブを閉じると再入力が必要。トークン発行のたびにサーバー側で再照合される
- **翻訳履歴**: 最大 200 件で古いものから破棄。リロードで消え、どこにも保存されない（会話内容はサーバー・DB に残らない）
- **通訳の挙動**: instructions で「質問に答えない・翻訳のみ」を指定しているが、LLM のため完全な保証はない

---

## AI開発研修LP（ai-dev.cloudnature.jp）

エンジニア向け AI開発研修の紹介 + 無料相談フォームのランディングページ。
コーポレートサイト・見積もりとは独立した Next.js サブプロジェクトで、Vercel で `ai-dev/` を Root Directory に指定してデプロイする。

設計書: [`docs/20260720_ai-dev_lp_design.md`](docs/20260720_ai-dev_lp_design.md)

### 構成上の注意

- **独立サブプロジェクト**: 独自の `node_modules` / `tsconfig.json` / `next.config.mjs` を持つ（estimate と同じ構成。ルート `tsconfig.json` の `exclude` に含める）
- **スタイリング**: Tailwind ではなく **Vanilla CSS**（`ai-dev/app/globals.css` に design token を定義）
- **フォント**: `next/font/local` で Noto Sans JP をセルフホスト（外部フォント依存を排除しビルドの安定性を確保）
- **画像**: `next/image` で最適化。ロゴ等は本体コーポレートサイトの画像を流用

### 無料相談フォーム

`POST /api/consultation` が Resend でメール送信する。

- **メール送信**: `RESEND_API_KEY` / `EMAIL_FROM` / `NOTIFY_EMAIL`（本体コーポレートサイトと共通の値）
- **スパム対策**: ハニーポット（隠しフィールド）+ 入力バリデーション（`ai-dev/lib/validation.ts`）
- **レート制限**: 本番のみ IP + メールアドレス単位（`ai-dev/lib/rate-limit.ts`、インメモリ実装）
- **認証**: 公開フォームのため `X-API-Key` は不要（estimate → backend の認証とは別系統）
- **注意**: Resend v6 の SDK は送信失敗時も例外を投げず `{ data: null, error }` を返すため、`route.ts` の `emailSendError()` で明示的にエラーを判定している

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
| [`docs/20260322_spreadsheet_funnel_design.md`](docs/20260322_spreadsheet_funnel_design.md) | ファネルダッシュボード GAS実装指示書 |
| [`docs/20260607_openai_translate.md`](docs/20260607_openai_translate.md) | リアルタイム翻訳ツール 設計書 |
| [`docs/20260607_realtime_translate_review.md`](docs/20260607_realtime_translate_review.md) | リアルタイム翻訳ツール 検証・レビュー記録 |
| [`docs/20260720_ai-dev_lp_design.md`](docs/20260720_ai-dev_lp_design.md) | AI開発研修LP 設計・レビュー記録 |
