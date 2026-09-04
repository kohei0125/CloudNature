# 検証記録: 新潟AIセミナー比較記事の追加 & テーブル表示改善

## 検証目的

`content/usecases/` への新規記事追加、および記事作成中に発見したモバイルでの
比較テーブル表示不具合の修正について、push 前に妥当性を確認する。

## 対象範囲

1. 新規記事 `content/usecases/niigata-ai-seminar-training.ts`
   （「新潟のAIセミナー・生成AI研修会社5選｜2026年比較ガイド」）
   の `content/usecases/index.ts` への登録
2. 記事用画像 `public/images/blog/niigata-ai-seminar-training/*.webp`（4枚）
3. `app/globals.css` の比較テーブル共通スタイル修正（サイト全体の `.prose table` に影響）
   - 1列目（行ラベル）を横スクロール中も固定表示（sticky）
   - 日本語の行頭禁則（`line-break: strict`）
4. `docs/blog/guidelines/blog_opening_hooks.md` の管理表更新

## 確認項目

- [ ] 記事本文: EEAT・事実性（自社サービス開示、根拠のない優劣断定がないか）
- [ ] 記事本文: 変動しやすい情報（金額・開催日・件数）が入っていないか
- [ ] `app/globals.css` の変更が既存の全記事（13本）のテーブル表示を壊していないか
- [ ] `line-break: strict` / `white-space: nowrap` / `min-width` の副作用（数値折り返し等、既存ルールとの整合）
- [ ] 型チェック・lint
- [ ] コミット対象に無関係な未追跡ファイル（`.claude/skills/natural-japanese`、`docs/architecture/*`）を含めていないか

## 経緯（ユーザーとの対話で発生した修正）

1. 記事初版作成（比較表・5社紹介・FAQ等）
2. 画像未作成のため一時 index.ts 未登録 → 画像到着後に登録
3. 自社(新潟AIアカデミー)とにいがたAIビジネスの差別化ポイントを訂正（バイブコーディング特化）
4. 3〜5社目の公式サイトリンクを削除（ユーザー指示）
5. モバイルでのテーブル表示が見づらいとの指摘 → 1列目 sticky 化
6. 会社紹介文が「詰まって見える」との指摘 → 説明文と「向いている企業」を別段落に分割
7. テーブルの改行位置（「ー」の孤立）が不自然との指摘 → `line-break: strict` 追加
8. さらに「折り返しない幅に」との指摘 → 1列目 nowrap 化 + 他列 min-width 確保（後に Codex 指摘で撤回、下記参照）

## Codex レビュー結果（`gpt-5.4`、uncommitted diff 全体）

1回目のレビュー（1列目 `white-space: nowrap` + 他列 `min-width: 7.5rem` を含む状態）で以下を指摘:

- **[P1] 1列目 nowrap の全記事への回帰リスク**：`niigata-ai-subsidy-guide-2026.ts` など、1列目に長文ラベル
  （例:「会計・販売・人事など、登録済みの業務ソフト・SaaSを導入したい」）を使う既存テーブルがあり、
  これを nowrap にすると1列だけでビューポートの大半を占め、他列がほぼ読めなくなる。
  → **対応**：`white-space: nowrap` と他列の `min-width: 7.5rem` を撤回。代わりに、今回の記事側の
  比較表の1列目を正式社名から短縮社名（`にいがたAIビジネス`／`新潟AIアカデミー`／
  `グローカルマーケティング`／`KOIYAL`／`新潟日報生成AI研究所`。元の依頼書 v2 yaml の `short_name` と一致）
  に変更し、`line-break: strict` だけで2行程度に自然に収まる形にした（CSS側のリスクをゼロに）。
  実機検証用フィクスチャ（本番と同一の生成済みCSSを読み込む静的HTML）で、新記事側の短縮社名が
  孤立文字なく折り返すこと、既存の長文ラベル表（補助金ガイド）が無変化であることを確認済み。
- **[P3] レビュー記録の配置**：`docs/` 直下ではなく `docs/blog/reviews/` に置くべき（記事レビュー記録のため）。
  → **対応**：本ファイルを `docs/blog/reviews/20260904_niigata_ai_seminar_review.md` へ移動。

## 最終確認結果

- [x] 記事本文: EEAT・事実性（自社サービス開示あり、根拠のない優劣断定なし、変動情報なし）
- [x] `app/globals.css`: 最終的に sticky 化 + `line-break: strict` のみ（nowrap/min-widthは撤回）。
      既存13記事のテーブルへの影響なしをフィクスチャ検証で確認
- [x] 型チェック（`npx tsc --noEmit`）・lint 通過
- [x] コミット対象から無関係な未追跡ファイル（`.claude/skills/natural-japanese`、`docs/architecture/*`）を除外
- [x] Codex 指摘2件（P1・P3）とも対応済み
