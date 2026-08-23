# docs/blog — ブログ記事の制作資料置き場

`/usecases` 記事・お知らせ(microCMS)など、**公開コンテンツの制作にまつわる非本番ファイル**をここに集約する。
本番で使われるファイル(記事データ `content/usecases/*.ts`、配信画像 `public/images/blog/`)はここには置かない。

## 構成

| ディレクトリ | 置くもの | 例 |
|---|---|---|
| `guidelines/` | 恒常的な執筆ルール・記事テンプレート・冒頭フック管理表 | `blog_opening_hooks.md` |
| `prompts/` | 記事生成プロンプト一式と作業手順書(旧 `content/usecases/usecase_design/`) | `WORKFLOW.md`, `00_primary_information_for_eeat.md` |
| `specs/` | 記事ごとの企画・構成・挿入画像の仕様書(YAML等) | `20260823_ai_memo_iPhone.yaml` |
| `drafts/` | 記事・お知らせの原稿/下書き(microCMS入稿用の原稿を含む) | `20260731_news_ai_lab_subsidy_partner.md` |
| `research/` | SEOキーワード調査・記事ネタ・リライト計画 | `20260331_seo-keywords.md` |
| `reviews/` | 記事のレビュー・ファクトチェック記録 | `20260809_niigata_ai_subsidy_blog_factcheck_2026-08-09.md` |
| `assets/` | 原稿用の画像素材マスター(本番配信は `public/images/blog/` 側) | `20260731_news_partner_thumbnail.webp` |

## 運用ルール

1. **ファイル名は `YYYYMMDD_<内容>.md`** を基本とする(恒常的なガイドラインは日付なしでよい)。
2. **記事本文のレビュー・ファクトチェック記録**は `reviews/` に置き、命名は `YYYYMMDD_<対象>_review.md` を基本とする。サイト構成・システム改修など記事本文以外の検証記録は従来どおり `docs/` 直下。
3. 記事作成の手順・冒頭フック管理表(`guidelines/blog_opening_hooks.md`)の運用は `.claude/skills/usecase-article-creation/SKILL.md` を参照(Codex は対になる `.agents/skills/usecase-article-creation/SKILL.md` を使う。両者は必ず同期させること)。
4. 一次情報(実績・数値)は `prompts/00_primary_information_for_eeat.md` が唯一の正。運用は `prompts/WORKFLOW.md` を参照。
