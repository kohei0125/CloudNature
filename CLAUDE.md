## プロジェクト概要

CloudNature — コーポレートサイト & AI見積もりシステムのモノレポ。

## リポジトリ構成

```
├── app/             コーポレートサイト (Next.js)   → cloudnature.jp
├── components/      コーポレートサイト共通コンポーネント
├── content/         コーポレートサイトのコンテンツ定義 (.ts)
├── estimate/        AI見積もりフロントエンド (Next.js) → ai.cloudnature.jp
├── backend/         見積もりAPI (FastAPI / Python)   → Cloud Run
├── docs/            設計書・TODO
├── types/           TypeScript 型定義
└── docker-compose.yml  ローカル開発用
```

## デプロイ

| コンポーネント | デプロイ先 | 方法 |
|---|---|---|
| コーポレートサイト | Vercel | git push（自動） |
| AI見積もりフロントエンド | Vercel (Root: `estimate/`) | git push（自動） |
| バックエンド | GCP Cloud Run (asia-northeast1) | `./deploy.sh` |
| DB | Neon (Serverless PostgreSQL) | — |

## コーディング規約

- **言語**: 日本語ベースでコメント・コミットメッセージを記述
- **フロントエンド**: TypeScript strict モード、ESModule (`"type": "module"`)
- **CSS**: Tailwind CSS を使用。カラーパレットは `tailwind.config.ts` に定義済み
  - カスタムカラー: sage, forest, pebble, sunset, cloud, earth, sea, stone, cream, linen, mist
- **パスエイリアス**: `@/*` → プロジェクトルート（コーポレートサイト・見積もりそれぞれ独自の tsconfig）
- **コンポーネント**: React Server Components (RSC) がデフォルト。クライアント側は `"use client"` を明記
- **アイコン**: lucide-react を使用

## 検証・レビュー

コードの検証やレビューは **Codex と対話しながら** 実施すること。

### ワークフロー

1. **検証内容のドキュメント作成（必須・着手前）**
   - 検証・レビューに着手する **前に**、`docs/` 配下に検証内容をまとめたファイルを作成する
   - ファイル名: `docs/YYYYMMDD_<対象>_review.md`（例: `docs/20260222_estimate_api_review.md`）
   - 記載内容: 極力端的に以下をまとめる
     - 検証目的
     - 対象範囲
     - 確認項目リスト
2. **Codex との対話レビュー**
   - 利用可能な Codex インターフェース（CLI / MCP など）を使い、Codex にコードを読ませてフィードバックを得る
   - Codex の指摘を検証ドキュメントに反映する
3. **結果の記録**
   - 検証結果・対応状況を同じドキュメントに追記する

## AI見積もりシステムの改修

- 見積もりバックエンド（`backend/`）や見積もりフロントエンド（`estimate/`）を改修・変更する際は、**最初に** `backend/docs/estimate_logic.md` を読んで全体のロジック・フローを把握すること
- 改修後は `backend/docs/estimate_logic.md` の該当箇所を必ず更新し、実装とドキュメントの乖離を防ぐこと

## 認証

Vercel (estimate) → Cloud Run (backend) 間は `X-API-Key` ヘッダで保護。
ローカル開発時は `API_KEY` を空にしてスキップ可能。

## 注意事項

- コーポレートサイトと見積もりフロントエンドは同一リポジトリだが、それぞれ独立した `node_modules`・`tsconfig.json`・`next.config.mjs` を持つ
- 見積もりサイトはサブドメイン（https://ai.cloudnature.jp/）で運用する
- `tsconfig.json`（ルート）の `exclude` に `estimate` が含まれる — 型チェックは各サブプロジェクト単位
- シークレット（API_KEY, OPENAI_API_KEY, RESEND_API_KEY, DATABASE_URL）は GCP Secret Manager で管理
