---
name: subdomain-lp-creation
description: >-
  CloudNature モノレポにサブドメインのランディングページ（LP）を、独立した Next.js
  サブプロジェクトとして新規追加するための体系的なワークフロー。設計書作成 → 意思決定 →
  サブプロジェクト構築 → 実装（RSC + Vanilla CSS）→ 相談フォーム（Resend）→ SEO/計測 →
  Codex 対話レビュー → /simplify → 検証 → Vercel デプロイ設定 → README 更新 の順で進める。
  「サブドメインにLPを追加」「研修LP」「新しいランディングページ」「〇〇のLPを作りたい」
  「ai-dev のような別サイトを追加」等、cloudnature.jp のサブドメインで独立運用する
  マーケティングページ／LP を作成・追加する際に使用する。既存の estimate/・ai-dev/ を
  生きたテンプレートとして参照する。
---

# サブドメイン LP 作成ワークフロー

CloudNature モノレポに、サブドメイン（例: `ai-dev.cloudnature.jp`）で独立運用する LP を
**独立した Next.js サブプロジェクト**として追加する。コーポレートサイト（`app/`）や見積もり
（`estimate/`）とは別に、独自の `node_modules` / `tsconfig.json` / `next.config.mjs` を持ち、
Vercel で Root Directory を指定して個別デプロイする。

## 最重要原則: 既存サブプロジェクトを複製元にする

**`ai-dev/`（最新・最も洗練）または `estimate/` が唯一の正しいテンプレート。**
ゼロから書かず、`ai-dev/` の構造・設定ファイル・パターンを読んで踏襲する。ボイラープレートを
記憶から再現しようとしないこと。まず `ai-dev/` の該当ファイルを Read してから着手する。

参照ドキュメント（必要になった段階で読む）:
- **技術規約・ファイル構成・環境変数・デプロイ・SEO/計測** → [references/technical-conventions.md](references/technical-conventions.md)
- **既知の落とし穴（Resend v6・日本語折り返し・カルーセルのスクロール崩れ・デザイントークン）** → [references/pitfalls.md](references/pitfalls.md)

`pitfalls.md` は実装中に必ず一度は目を通す。これらは今回の LP 作成で実際に踏んで修正した罠で、
知らなければ同じ手戻りが発生する。

---

## ワークフロー

CLAUDE.md のプロジェクト規約（検証前の設計書作成、Codex 対話レビュー、軽微でない変更後の
`/simplify`、コミット/プッシュは都度指示待ち）を必ず守る。

### Phase 0 — 設計書を先に作る（着手前・必須）

実装に入る**前に** `docs/YYYYMMDD_<対象>_lp_design.md` を作成する（例:
`docs/20260720_ai-dev_lp_design.md`）。既存の設計書を複製元にして、端的に以下をまとめる:
- 目的・ターゲット読者・提供価値
- サブドメイン名・デプロイ先
- 技術方針（本節の決定事項）
- ページ構成（セクション一覧）
- Codex レビュー記録欄（後述の Phase 6 で追記する）

### Phase 1 — 方針を確定する（AskUserQuestion）

過去に確定した既定路線。未確定の点だけ `AskUserQuestion` で確認する:
- **デプロイ形態**: サブドメインの独立サブプロジェクト（既定）
- **実装**: 静的 HTML ではなく Next.js（既定。App Router + RSC）
- **メール**: Resend で送信（本体コーポレートサイトと共通の環境変数）
- **ボット対策**: ハニーポットのみ（既定）
- **画像**: 本体サイトのロゴ・画像を流用
- **環境変数**: `NOTIFY_EMAIL` / `EMAIL_FROM` は本体と共通値

### Phase 2 — サブプロジェクトを構築

`ai-dev/` の構成をテンプレートにディレクトリを作る。詳細は
[references/technical-conventions.md](references/technical-conventions.md) を参照。要点:
- `package.json`: `name: "cloudnature-<slug>"`、`dev` は未使用ポート（例 3002）を割り当て
- 独自の `tsconfig.json` / `next.config.mjs`（`turbopack.root` を設定してモノレポ誤検出を防ぐ）
- ルート `tsconfig.json` の `exclude` に新サブディレクトリを追加
- スタイルは **Tailwind ではなく Vanilla CSS**（`app/globals.css` に design token）
- フォントは `next/font/local` で Noto Sans JP をセルフホスト（外部フォント依存を排除）

### Phase 3 — 実装

`ai-dev/` の各ファイルを参照しながら実装する。マークアップ（`app/page.tsx`）とコピー/データ
（`content/*.tsx`）を分離し、クライアント挙動（フォーム・スクロール効果・カルーセル）のみ
`"use client"` コンポーネントに切り出す。**実装中は必ず
[references/pitfalls.md](references/pitfalls.md) を参照**（特に日本語の折り返しとカルーセル）。

### Phase 4 — 相談フォーム（Resend）

`POST /api/consultation` を実装。ハニーポット + バリデーション + レート制限（IP + メール）。
公開フォームなので `X-API-Key` は不要（見積もりの Vercel→backend 認証とは別系統）。
**Resend v6 は送信失敗時も例外を投げず `{ data, error }` を返す**ため `emailSendError()` で
明示判定する（最重要の罠）。詳細とコード骨子は
[references/pitfalls.md](references/pitfalls.md) と `ai-dev/app/api/consultation/route.ts`。

### Phase 5 — SEO・メタデータ・計測

canonical URL、OG 画像（1200×630）、JSON-LD（Organization / WebPage / FAQPage）、
`sitemap.ts` / `robots.ts`、非本番の noindex（`isIndexableDeployment()`）、
共有 GA4（本番は共有測定 ID をコード固定）+ 任意の GTM。詳細は technical-conventions.md。

### Phase 6 — Codex 対話レビュー（CLAUDE.md 必須）

`mcp__codex-cli__codex` にコードを読ませてレビューを受ける（ChatGPT アカウントでは
モデル `gpt-5.5` を使う。codex 専用モデル名は「not supported」で失敗する）。指摘を設計書に
反映し、修正後に再レビュー。やり取りを設計書の Codex レビュー記録欄に残す。

### Phase 7 — 検証

```bash
cd <slug> && npm run lint && npm run build   # lint は --max-warnings=0
```
可能ならブラウザ（`mcp__claude-in-chrome__*`）でモバイル表示・フォーム送信を確認する。
本セッションでは `resize_window` が不安定だったため、モバイル幅の確認は CSSOM/`matchMedia`
検査や幅制約 JS + スクリーンショットで代替できる。

### Phase 8 — /simplify とデプロイ設定・ドキュメント

- 軽微でない変更なので最後に `/simplify` を実行（reuse/簡潔化/効率/altitude）。
- Vercel は新規プロジェクトとして Root Directory = `<slug>/` を指定（`git push` で自動デプロイ）。
- ルート `README.md` を更新（構成ツリー・技術スタック表・デプロイ表・環境変数・ビルド確認・
  GA4 表・専用セクション・ドキュメント一覧に新 LP を追記）。
- **コミット/プッシュはユーザーの明示指示があるまで実行しない**（都度確認）。

---

## クイックチェックリスト

- [ ] `docs/` に設計書を先に作成した
- [ ] `ai-dev/` を複製元に構造を踏襲した（記憶から再現していない）
- [ ] ルート `tsconfig.json` の `exclude` に追加した
- [ ] Vanilla CSS（Tailwind 不使用）/ セルフホストフォント
- [ ] Resend の `emailSendError()` で明示エラー判定
- [ ] 日本語折り返し（keep-all + 局所 auto-phrase）を確認
- [ ] 横スクロール要素は `overflow-y: hidden` + `touch-action: pan-x`
- [ ] canonical / OG(1200×630) / JSON-LD / sitemap / robots / noindex
- [ ] Codex レビュー → 設計書に記録
- [ ] `npm run lint && npm run build` 通過
- [ ] `/simplify` 実行
- [ ] README 更新
- [ ] コミット/プッシュは指示待ち
