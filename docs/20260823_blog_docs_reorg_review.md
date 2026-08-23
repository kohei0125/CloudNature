# ブログ記事関連ファイルの配置整理 検証・レビュー

作成日: 2026-08-23

## 検証目的

`docs/`・`content/usecases/usecase_design/`・`draft/` に散らばっていたブログ記事の制作資料
(執筆ルール・プロンプト・下書き・調査・レビュー記録・画像仕様) を `docs/blog/` 配下へ集約する。
本番ビルド・公開URLに影響が出ていないこと、参照パスの更新漏れがないことを検証する。

## 対象範囲

### 移動するもの(非本番の制作資料のみ)

| 移動元 | 移動先 |
|---|---|
| `docs/20260324_usecase_blog_template.md`, `docs/20260330_blog-instructions.md`, `docs/blog_opening_hooks.md` | `docs/blog/guidelines/` |
| `content/usecases/usecase_design/` 一式 (WORKFLOW.md, 00_eeat, 01〜04プロンプト) | `docs/blog/prompts/` |
| `docs/20260814_usecase_article_images.yaml`, `docs/20260823_ai_memo_iPhone.yaml` | `docs/blog/specs/` |
| `draft/*.md` (4件), `docs/20260630_aspac_translate_blog.md`, `docs/20260731_news_ai_lab_subsidy_partner.md` | `docs/blog/drafts/` |
| `docs/20260331_seo-keywords.md`, `docs/20260412_blod_estimate_{idea,seo}.md`, `docs/20260519_development_seo_{gemini,gpt}.md`, `docs/20260520_fde_blog_gemini.md`, `docs/cloudnature_ai_subsidy_article_rewrite_plan.md` | `docs/blog/research/` |
| `docs/20260331_seo-keywords-review.md`, `docs/20260731_niigata_ai_subsidy_article_rewrite_review.md`, `docs/20260809_niigata_ai_subsidy_blog_factcheck_2026-08-09.md`, `docs/20260814_new_usecase_articles_review.md` | `docs/blog/reviews/` |
| `docs/assets/20260731_news_partner_thumbnail.webp` | `docs/blog/assets/` |

### 移動しないもの(本番に影響するため)

- `content/usecases/*.ts`(記事データ本体。アプリが import)
- `public/images/blog/**`(公開URLで配信中の画像)
- `public/docs/cloudnature-company-profile.pdf`(公開URL)
- `app/usecases/**`(ルーティング)
- サイト全体のSEO・広告・見積もり関連の docs(ブログ記事固有でないもの)

## 確認項目

- [x] `npm run build` が成功する(コーポレートサイト) — 全ルート生成を確認
- [x] `npm run lint --max-warnings=0` — 変更前後で結果が同一であることを確認(下記「既知の別問題」参照)
- [x] 移動ファイルへの旧パス参照が残っていない(`rg --hidden` で横断確認、残ヒットは `docs/blog/README.md` 内の旧パス説明のみ)
  - [x] `.claude/skills/usecase-article-creation/SKILL.md`(3箇所更新)
  - [x] `.agents/skills/usecase-article-creation/SKILL.md`(Codex指摘により3箇所更新)
  - [x] `docs/adr/0001`(seo-keywords / development_seo 参照を更新)
  - [x] 移動した docs 同士の相互参照(reviews → research / drafts / assets / prompts)
  - [x] CLAUDE.md / AGENTS.md / README.md
  - [x] Claude メモリ(blog-opening-hook-rule.md / MEMORY.md)
- [x] `git mv` で移動し、リネーム(R)として履歴が追跡されている(28ファイル)
- [x] 本番配信パス(`public/`、`content/usecases/*.ts`、`app/`)に差分がない(`git diff --stat` で確認。content/ の差分は usecase_design/ の .md 移動のみ)
- [x] CLAUDE.md / AGENTS.md に配置ルールを追記済み
- [x] `docs/blog/README.md` に構成の説明を追加済み

### 既知の別問題(→ /simplify フェーズで解消済み)

- `npm run lint -- --max-warnings=0` は**変更前のクリーンな状態でも exit 1** だった。原因は ESLint が `ai-dev/.next/` のビルド成果物を走査していたこと。`eslint.config.mjs` の ignores に `ai-dev/` を追加して解消(ai-dev は estimate 同様に独自の lint スクリプトを持つため、既存パターンに準拠)。修正後 exit 0 を確認。

## Codex レビュー結果

2026-08-23 実施(gpt-5.6-sol / uncommitted diff レビュー)。

| 重要度 | 指摘 | 対応 |
|---|---|---|
| P2 | Codex が参照する `.agents/skills/usecase-article-creation/SKILL.md` に旧パス `docs/blog_opening_hooks.md` が2箇所残存。`.claude` 側だけでなく `.agents` 側も同期が必要 | **対応済み**。`.agents` 側の3箇所(リサーチ資料パス含む)を新パスへ更新し、修正後の再 `rg` でクリーンを確認 |

## /simplify レビュー結果(4観点並列)

| 観点 | 指摘 | 対応 |
|---|---|---|
| 重複 / 簡潔化 / 深さ | 配置ルール表が CLAUDE.md・AGENTS.md・docs/blog/README.md の3箇所に全文重複 | **対応済み**。表は `docs/blog/README.md` のみに残し、CLAUDE.md/AGENTS.md は不変条件(本番2パスの保護・draft/ 禁止)+READMEへのポインタに縮約 |
| 簡潔化 | レビュー置き場ルールが5箇所に重複し、命名規約も矛盾 | **対応済み**。CLAUDE.md は「記事本文のレビュー」に限定して README を参照、命名の正は README の運用ルールに一本化 |
| 簡潔化 | README ルール4がスキルの手順を言い換えており「公開後追記」がスキルの「完成後追記」とズレ | **対応済み**。手順の再記述をやめ、SKILL.md への純粋なポインタに変更 |
| 深さ | `.claude/skills/` と `.agents/skills/` の同期義務がどこにも恒久記録されていない(更新漏れ2回目) | **対応済み**。CLAUDE.md 注意事項に同期ルールを明文化し、README からも両コピーを参照 |
| 深さ | `.gitignore` に旧 `draft/img/` が残存し、draft/ 禁止ルールと矛盾(再作成時に git が沈黙する) | **対応済み**。該当行を削除 |
| 効率 | ESLint が `ai-dev/.next/` を走査し lint ゲートが常に失敗 | **対応済み**。上記のとおり ignores に `ai-dev/` を追加 |
| 効率 | GitHub Actions のレビューWFに paths フィルタが無く docs のみのPRでも起動 / Vercel の Ignored Build Step 未設定 | **見送り**(提案のみ)。CI・デプロイ挙動の変更は運用判断が必要なため。必要なら `paths-ignore: ["docs/**"]` や Vercel の Ignored Build Step 設定で docs のみの変更をスキップできる |
| 簡潔化 | `docs/blog/assets/` が1ファイルのために存在 | **見送り**。今後も原稿用画像マスターの置き場として使う想定のため維持 |

## 対応状況

- 全項目対応済み。コミットはユーザーレビュー待ち(ステージ済み・未コミット)。
