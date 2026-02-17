# CloudNature AI 見積もりフロントエンド

チャット形式の対話型フォームで、AIがシステム開発の概算見積もりを自動生成するWebアプリケーション。

## 技術スタック

- **Next.js 16** (Turbopack, App Router)
- **React 19** / TypeScript
- **Tailwind CSS 3** + カスタムユーティリティ (`v-stack`, `h-stack`, `center`)
- **Framer Motion** — アニメーション
- **@react-pdf/renderer** — サーバーサイドPDF生成
- **Lucide React** — アイコン

## セットアップ

**推奨: Docker Compose（ルートディレクトリから）**

```bash
docker compose up --build
# → http://localhost:3001 (フロントエンド)
# → http://localhost:8000 (バックエンドAPI)
```

<details>
<summary>Docker を使わない場合（Node.js 20+ が必要）</summary>

```bash
cd estimate
npm install
BACKEND_URL=http://localhost:8000 npm run dev
# → http://localhost:3001
```

※ バックエンドを別途起動する必要があります。

</details>

### 環境変数

| 変数 | 説明 | デフォルト |
|------|------|-----------|
| `BACKEND_URL` | FastAPIバックエンドのURL（サーバーサイドのみ） | `http://localhost:8000` |
| `NEXT_PUBLIC_API_BASE` | クライアント側APIベースURL（空 = 相対パス） | `""` |

## ディレクトリ構成

```
estimate/
├── app/
│   ├── layout.tsx              # 見積もり専用レイアウト（Noto Sans/Serif JP）
│   ├── page.tsx                # ランディングページ
│   ├── globals.css             # Tailwindベース + glass-card, btn-puffy
│   ├── chat/
│   │   └── page.tsx            # 13ステップ対話型チャットフォーム
│   ├── complete/
│   │   └── page.tsx            # 完了ページ（相談予約CTA）
│   └── api/
│       ├── estimate/
│       │   ├── start/route.ts  # POST → バックエンド /session
│       │   ├── step/route.ts   # POST → バックエンド /step
│       │   ├── generate/route.ts # POST → バックエンド /generate
│       │   └── session/route.ts  # GET → バックエンド /session, /result
│       └── pdf/
│           └── route.ts        # POST: @react-pdf/renderer でPDF生成
│
├── components/
│   ├── chat/                   # チャットUI
│   │   ├── ChatContainer.tsx   # スクロール管理 + メッセージ一覧
│   │   ├── ChatBubble.tsx      # system / user バブル（memo化）
│   │   ├── ChatErrorBoundary.tsx # ランタイムエラーキャッチ
│   │   ├── QuestionBubble.tsx  # 質問メッセージ表示
│   │   ├── TypingIndicator.tsx # AI思考中アニメーション
│   │   ├── ProgressBar.tsx     # ステップ進捗バー
│   │   ├── StepRenderer.tsx    # 入力タイプ別レンダラー
│   │   ├── NavigationControls.tsx # 戻る/次へ/送信ボタン
│   │   └── ErrorRetry.tsx      # エラー表示 + リトライ
│   ├── inputs/                 # 入力コンポーネント（6種）
│   │   ├── SelectInput.tsx     # 単一選択
│   │   ├── MultiSelectInput.tsx # 複数選択（チップUI）
│   │   ├── TextInput.tsx       # テキストエリア
│   │   ├── EmailInput.tsx      # メール入力
│   │   ├── SelectTextInput.tsx # 選択 + 自由記述
│   │   └── ContactInput.tsx    # お名前・企業名・メールアドレス（信頼信号付き）
│   ├── landing/                # ランディングページ
│   │   ├── HeroSection.tsx
│   │   ├── BenefitsSection.tsx
│   │   ├── FlowSection.tsx
│   │   └── TrustBar.tsx
│   ├── pdf/                    # PDFテンプレート
│   │   ├── EstimatePdf.tsx     # 概算見積書
│   │   └── shared/             # PDF共通（ヘッダー、スタイル）
│   └── shared/
│       └── EstimateHeader.tsx  # 最小限ブランドヘッダー
│
├── hooks/
│   ├── useEstimateSession.tsx  # useReducer + Context（セッション状態管理）
│   ├── useStepNavigation.ts    # ステップ移動 + バリデーション
│   ├── useEstimateApi.ts       # バックエンドAPI呼び出し
│   └── useSessionPersistence.ts # localStorage同期（24h TTL, debounce）
│
├── lib/
│   ├── estimateApi.ts          # APIクライアント（AbortController付き）
│   ├── stepConfig.ts           # 13ステップ定義 + バリデーションルール
│   ├── sessionStorage.ts       # localStorage wrapper（TTL + スキーマバージョン）
│   └── utils.ts                # cn() ユーティリティ
│
├── content/
│   └── estimate.ts             # 全コピー（ステップ、選択肢、エラーメッセージ、LP）
│
└── types/
    └── estimate.ts             # 全型定義
```

## アーキテクチャ

### BFF (Backend For Frontend) パターン

クライアント → Next.js API Routes → FastAPI バックエンド

- クライアントは `/api/estimate/*` にリクエスト
- Next.js API Routes が FastAPI へプロキシ（snake_case ↔ camelCase 変換）
- バックエンドURLはサーバーサイド環境変数のみで管理（クライアントに露出しない）
- 全ルートに AbortController タイムアウト設定済み

### 状態管理

`useReducer` + `Context` パターンで、以下の状態を一元管理:

- `currentStep` — 現在のステップ番号 (1-13)
- `answers` — 各ステップの回答値
- `messages` — チャットメッセージ履歴
- `aiOptions` — AI生成の選択肢 (Step 8: 機能提案)
- `status` — セッション状態 (`in_progress` / `generating` / `completed` / `error`)

`localStorage` への自動保存は messages を除外して debounce (500ms) で実行。

### 13ステップ構成

| Step | タイプ | 内容 |
|------|--------|------|
| 1-5 | select | 業種・システム種類等の基本情報 |
| 6 | text | 自由記述（システム概要） |
| 7 | select | 追加設定 |
| 8 | AI生成 | AIが入力に基づき機能候補を動的に生成 |
| 9-12 | select/multi-select | タイムライン・デバイス・予算等 |
| 13 | contact | お名前・企業名・メールアドレス（JSON形式で保存） |

## npm scripts

```bash
npm run dev       # 開発サーバー (port 3001)
npm run build     # プロダクションビルド
npm run start     # プロダクション起動
npm run lint      # ESLint (--max-warnings=0)
```

## デザイン

- CloudNature ブランドカラー: `sage` (#8A9668), `forest` (#19231B), `pebble` (#EDE8E5), `sunset` (#DD9348), `cloud` (#C8E8FF)
- フォント: Noto Sans JP (本文) / Noto Serif JP (見出し)
- glass-card: 半透明ガラス効果（モバイルではシャドウにフォールバック）
- btn-puffy: 立体的な押しボタン効果
- safe-area-inset 対応（ノッチ付きiPhone）
