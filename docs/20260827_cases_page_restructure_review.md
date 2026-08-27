# /cases 「導入事例」→「開発・AI活用実績」再構成 検証記録

作成日: 2026-08-27

## 検証目的

`/cases` が「顧客導入実績が豊富な会社」に見える表現になっている一方、掲載3件は
すべて自社実績である。この乖離を解消しつつ、既に獲得している検索露出を維持する。

判断の根拠（Ahrefs GSC 実測、2026-05-27〜2026-08-26）:

| 指標 | 値 |
|---|---|
| `/cases` 表示回数 | 107（cloudnature.jp 内 3位） |
| 獲得キーワード | 5件 |
| 「見積もりai 中小企業」 | 平均 8.9位 / 88表示 |
| 「中小企業 ai導入事例」 | 平均 9.0位 / クリック1 |
| 実閲覧（Web Analytics） | 8PV / 3訪問者 / 平均滞在 23秒 |

→ 商談意図の強いクエリで1ページ目に到達しており、URL自体を捨てる合理性はない。
一方で滞在23秒は「見られているが刺さっていない」状態を示す。

**結論: URL・インデックスは維持し、見せ方を全面改修する。**

| 選択肢 | SEO | ブランド | 判断 |
|---|---|---|---|
| 削除・noindex | × | ○ | 非推奨（露出を無償で手放す） |
| 現状維持 | ○ | ×× | 非推奨（表示と実態が乖離） |
| URLを残して全面改修 | ○ | ○ | **採用** |
| TOPセクションのみ一時非表示 | ○ | ○ | **併用採用** |

## 事実確認（ユーザー確認済み・2026-08-27）

1. 掲載3件（ai-estimate / ai-lms / marketing-automation）は **すべて自社実績**。
   外部クライアントへの納品案件はゼロ。
   → `CLIENT PROJECTS` セクションは今回作らず、`INTERNAL PROJECTS` のみの構成とする。
2. お客様の声（`quote`）3件は実在の発言として確認できない → **全削除**。
3. TOPページの CASE STUDY セクションは **一旦セクションごと非表示**。

## 対象範囲

| ファイル | 変更内容 |
|---|---|
| `content/cases.ts` | ヒーロー文言、3件の client/category/results 書き換え、quote全削除、CTA文言 |
| `types/cases.ts` | `CaseStudyDetail.status`（現在の運用状況）を追加 |
| `components/cases/CaseStudyDetailCard.tsx` | `status` の表示追加 |
| `app/cases/page.tsx` | INTERNAL PROJECTS 見出し追加、注記文の修正、パンくず名、`scroll-mt-24` |
| `content/common.ts` | `NAV_ITEMS` ラベル、`PAGE_META.cases` の title/description |
| `content/layout.ts` | フッター `companyLinks` ラベル |
| `content/contact.ts` | `successCta` ラベル |
| `content/home.ts` | `CASE_STUDIES` の虚偽業種タグ修正（非表示中も実態と揃える）、`CASES_SECTION` 文言 |
| `app/page.tsx` | `CasesSection` と前後の `WaveSeparator` 2枚を除去し、1枚に統合 |
| `app/llms.txt/route.ts` | 見出し・記述を「開発・AI活用実績」へ |
| `app/sitemap.ts` | `/cases` の `lastModified` 更新 |

## 確認項目リスト

### 事実性（最優先）
- [ ] 実在確認できない `quote` が3件とも削除されている
- [ ] TOP（`home.ts`）と詳細（`cases.ts`）で業種・クライアント表記が矛盾しない
  - 旧: TOP「製造業/サービス業/小売業」 vs 詳細「自社プロダクト/研修サービス企業/マーケティング企業」
- [ ] 根拠を説明できない削減率・改善率が残っていない
  - 削除対象: 「研修管理工数を大幅に削減」「研修完了率が大幅に向上」「受講者満足度が改善」
    「執筆・投稿の工数を80%削減」「公開頻度が月3本→月8本」「リーチ数が3ヶ月で2倍」
  - 維持: AI見積もりの「約1時間 → 90%以上削減」（自社計測・算出根拠を併記）
- [ ] 新たに検証不能な主張を追加していない（`status` は公開実物で確認できるものだけ記載）

### SEO
- [ ] `/cases` の URL・canonical・sitemap 収録が維持されている（noindex を入れない）
- [ ] `PAGE_META.cases` に「見積もり」「AI」「事例」が残り、順位保持中のクエリと乖離しない
- [ ] title 長が全角基準で過大でない（日本語は全角換算で判断）
- [ ] パンくず JSON-LD の名称がナビ・H1 と整合

### 実装
- [ ] `app/page.tsx` から `CasesSection` 除去後、`WaveSeparator` の色が
      ServicesSection(#F6FAFA) → CasesCarouselSection(#ffffff) で連続する
- [ ] `CasesSection.tsx` と `CASE_STUDIES` は将来の復活用に残す（意図的な未使用・デッドコードではない）
- [ ] `quote` フィールドは実名事例取得後に再利用するため型・描画を残す（誤用防止コメントを付す）
- [ ] `npm run build` / `npm run lint --max-warnings=0` が通る
- [ ] セクション `id` + `aria-labelledby` + `scroll-mt-24` が付与されている
- [ ] Codex による対話レビュー実施

## Codex 対話レビュー（gpt-5.6-sol / 計4回）

既定モデル `gpt-5.3-codex` / `gpt-5.1-codex-max` / `gpt-5.1-codex` はいずれも
"not supported when using Codex with a ChatGPT account" で失敗。
`~/.codex/config.toml` の `model = "gpt-5.6-sol"` を明示指定して実行した。

### 1回目 [P1] 未確認システムを「運用中」と断定していた
`CASES_HERO` / `CASES_INTERNAL_SECTION` / `llms.txt` で3件すべてを
「社内で運用しているシステム」と断定していたが、`ai-lms` / `marketing-automation` の
運用状況は未確認。**本改修の目的そのものに反する記述だった。**
→ 集約表現を「当社が自社開発したシステム」へ変更。運用継続の主張は、公開実物で
確認できる `ai-estimate` の `status` のみに限定。

### 2回目 [P1] 虚偽と判明した顧客実績が公開記事に残存
`/cases` だけ直しても、記事側に同じ主張が残っていた。
- `niigata-ai-development-company-guide.ts`: 「新潟県内の研修サービス企業では…
  マーケティング企業では…約80%削減した実績があります」→ 自社開発の記述へ訂正
- `business-automation-small-start.ts`: 4箇所（:32 支援先の80%削減・月3本→8本、
  :100 公開頻度2.7倍、:192 リーチ2倍・修了率大幅向上、横展開の支援先ケース）
  → すべて自社の取り組みとして書き換え、未検証の数値は削除

### 2回目 [P2] 名称変更が主要導線に未反映
`lib/related-content.ts:14`、`estimate/content/estimate.ts:348`、
`estimate/components/shared/EstimateHeader.tsx:77`、
`content/usecases/ai-estimate-automation.ts:242` が「導入事例」のままだった → 全て更新。

### 3回目 [P1] 検証不能な実績が配信画像に焼き込まれていた
`Niigata_AI_Selection_Blueprint-13.webp` に「自社と顧客の現場で実証されたアプローチ。」
「マーケティング企業／執筆・投稿業務の自動化で工数を約80%削減。」
「自社見積もり／数日から1分へ短縮。相場比 約40%のコスト削減設計。」が焼き込まれており、
本文を訂正しても画像で虚偽主張が配信され続ける状態だった。
→ 該当 `<figure>` ブロックを記事から削除。画像ファイルは公開URL維持の方針に従い
`public/` に残置（差し替え素材ができ次第、図版ごと再掲する）。

### 4回目
指摘なし。

## 検証結果

- [x] 実在確認できない `quote` を3件とも削除
- [x] TOP・詳細・記事・llms.txt でクライアント表記の矛盾を解消
- [x] 根拠を説明できない削減率・改善率を全削除（`/cases` および公開記事4箇所）
- [x] 新たな検証不能な主張を追加していない（Codex 1回目・3回目の指摘で2度是正）
- [x] `/cases` の URL・canonical・sitemap 収録を維持（noindex 不使用）
- [x] `PAGE_META.cases` に「AI」「見積もり」「事例」を保持しつつ「自社開発」を明示
- [x] パンくず JSON-LD・ナビ・H1 の名称整合
- [x] `WaveSeparator` を #F6FAFA → #ffffff の1枚に統合
- [x] `CasesSection.tsx` / `CASE_STUDIES` を残置し、非表示中も実態と一致する内容へ修正
- [x] `quote` 型・描画を残置し、誤用防止コメントを付与
- [x] `npm run lint --max-warnings=0` / `npm run build` 成功
- [x] `scroll-mt-24` 付与、h1 → h2 → h3 の階層を確立（従来は h2 が欠けていた）
- [x] Codex 対話レビュー（4回）完了

## /simplify（4観点の並行レビュー）

| 指摘 | 対応 |
|---|---|
| 節見出しが `SectionHeader` の手書きコピー（Reuse / Simplification / Altitude が重複指摘） | `<SectionHeader … centered />` へ置換。下層ページの確立パターンに統一 |
| `CaseStudyDetailCard` 内でラベル+本文の同一マークアップが3回 | ローカル `LabeledText` に集約 |
| `client` / `results[3]` / `status` が同じ事実を3回述べていた | `status` に一本化し、`client` は他2件と揃えて「自社開発」に |
| `CASES_INTERNAL_SECTION.description` がヒーローの主張の3度目の言い換え | 削除（滞在23秒のページで同じ主張を3回繰り返さない） |
| 残置メモが5箇所に重複、日付をハードコード | 2箇所（`app/page.tsx` と `types/cases.ts`）へ集約し圧縮 |
| `home.ts` の「非表示中も実態と一致させ続けること」が無期限の維持義務になっていた | 「復活前に再確認すること」という1回のゲートに変更 |
| パンくず名が手打ちで nav ラベルと二重管理 | `CASES_HERO.title` から導出（`app/usecases/page.tsx` と同方式） |
| `llms.txt` の実績3件が `CASE_STUDY_DETAILS` の手書きミラー（同ファイルの方針に反する） | `caseLines` として生成し、見出しも `CASES_HERO.title` から導出 |
| `quote` の掲載許諾ルールがコメント頼み | 型に `consentedAt: string` を必須追加。許諾日なしでは quote を追加できない |

**見送り**

- `CasesSection.tsx` / `CASE_STUDIES` の削除（2エージェントが推奨）— ユーザーが「コンポーネントとデータを残して1行で復活」を明示的に選択済みのため維持。あわせて、TOP から外したことで client component 1つと画像2枚がホームのバンドルから外れる効果もある
- `PATH_LABELS` によるナビ名称の全面一元化 — 本改修の範囲外。既存の `/company` の表記ゆれ（nav「会社情報」/ footer・パンくず「企業情報」）も未対応のまま
- `estimate/` 側の重複 — 別 Next.js サブプロジェクトで root からの import 不可のため、リテラル重複は正しい判断（Altitude が検証）
- `CaseStudyDetailCard` の `imageMobile`/`image` 二重ダウンロード — 本改修以前からの既存課題

## 追加対応: marketing-automation の掲載取りやめ（2026-08-27・ユーザー指示）

「コンテンツマーケティング業務の自動化」は実績として掲載しない方針となったため、
関連する掲載箇所を削除。掲載実績は `ai-estimate` / `ai-lms` の2件になった。

| ファイル | 削除内容 |
|---|---|
| `content/cases.ts` | `CASE_STUDY_DETAILS` の `marketing-automation` エントリ |
| `content/home.ts` | 休眠中 `CASE_STUDIES` の同カード |
| `content/home.ts` | フォールバックお知らせ `case-marketing-automation`（9件→8件） |
| `content/usecases/niigata-ai-development-company-guide.ts` | 自社実績の列挙から「コンテンツ制作の自動化」 |
| `app/cases/page.tsx` | インラインCTAの表示条件を `index < length - 1` に変更 |

- `app/llms.txt/route.ts` は `CASE_STUDY_DETAILS` から生成しているため自動で2件に追従（手当て不要）
- `lib/related-content.ts` の関連実績件数も同様に自動追従
- インラインCTAの条件変更理由: 実績2件では `index === 1` が末尾カードとなり、
  直後の `RelatedLinks` / `CtaBanner` とCTAが3連続になるため。3件目が追加されれば自動で復帰する
- `/news/case-marketing-automation` の静的生成が消える（50→49ページ）。サイトマップは
  microCMS 由来のみを収録しており本URLは未収録、GSC上の表示回数もゼロのため影響なし
- `public/images/marketing.jpg` は参照ゼロになったが、公開URLのため削除せず残置

## 本番反映前の最終チェック（2026-08-27）

| 項目 | 結果 |
|---|---|
| ルート `npm run lint --max-warnings=0` | 通過 |
| ルート `tsc --noEmit` | 通過 |
| ルート `npm run build` | 通過（49ページ） |
| `estimate/` `tsc --noEmit` | 通過 |
| `estimate/` `npm run build` | 通過 |
| ブラウザ実機確認（`/cases`・TOP、デスクトップ幅） | 実施 |
| Codex 最終レビュー | 実施 |

### 実機確認で見つけて直した2件

1. **`NOW` ブロックの枠が見えていなかった** — `bg-mist/70` を `bg-mist` のセクション上に置いていたため、
   ボックスが背景と同化して字下げされたテキストにしか見えなかった。
   `bg-white` + 左アクセント罫（quote ブロックと同じ体裁）に変更。
2. **`ai-lms` の箇条書き1番目と4番目がほぼ同一だった** —
   「動画視聴・演習問題・理解度テストをブラウザ上でワンストップ提供」と
   「ブラウザから動画視聴・演習・理解度テストを利用可能」が重複。4番目を意図した文言へ修正。

### 確認済みで問題なしと判断した項目

- 削除した `/news/case-marketing-automation` への内部リンクはゼロ。サイトマップ未収録、GSC表示回数もゼロ
- `lib/related-content.ts` の関連実績件数、`llms.txt` の実績一覧はいずれもデータ生成のため自動追従
- TOP の波形セパレータは #F6FAFA → #ffffff で連続（teal 帯の残骸なし）
- `ai-installation-failure.ts` の `10-ripple-effect.webp` は一般論の図で実績主張を含まない（Codex 指摘は過大評価）

### 残っている既知の問題（本改修の対象外・ユーザー判断待ち）

- `ai-installation-failure/09-case-study-estimate-automation.webp` に
  「事例：」「『ミツモリAI』を導入。」という**サイト上に存在しない製品名**と、
  第三者が導入したように読める表記が焼き込まれている。本文直上は
  「当社が自社の見積もり業務を自動化した例」と正しく書かれているため誤認リスクは限定的だが、
  今回是正した「自社実績が顧客導入に見える」パターンと同種。図版の作り直しが必要
- `CASES_INLINE_CTA` は実績2件のため現在レンダリングされない（3件目追加で自動復帰）

## 未実施・残課題

| 項目 | 内容 |
|---|---|
| 図版の差し替え | `Niigata_AI_Selection_Blueprint-13.webp` は虚偽主張が焼き込まれているため参照を外した。自社実績のみの内容で作り直して再掲する |
| `status` 未記入 | `ai-lms` の現在の運用状況が未確認のため空。事実が確定したら追記する |
| 実画面・処理フロー | 優先度: 中。キャプチャ素材が必要なため未実施 |
| 週次レポート記事の矛盾 | 2026-08-09 に削除した週次レポート機能を、`ai-analytics-auto-report.ts` と `business-automation-small-start.ts:83` が現在も運用中として紹介したまま（本改修の対象外・ユーザー判断待ちの既知課題） |
| フォールバックお知らせ | `content/home.ts` の `NEWS_ITEMS` は `/news/<id>` へリンクするが microCMS 未収録のため 404 の可能性。今回は虚偽の実績記述のみ訂正（本改修の対象外） |
| CLIENT PROJECTS 復活 | 実名顧客事例が2〜3件揃った時点で `/cases` に区分を追加し、TOP の `CasesSection` を復活 |

## 総合レビュー追補（2026-08-27）

現在の未コミット差分を独立に再確認した結果。ルート・`estimate/` ともに lint / build は成功したが、以下は未解消。

| 優先度 | 指摘 | 根拠・対応案 |
|---|---|---|
| P1 | `/cases` の meta description が、運用状況未確認の AI LMS を含めて「実際に使っているAIの実績」と一括断定している | **対応済み**。`content/common.ts` を、確認済みの「自社の業務課題のために開発したAI・システムの実績」へ修正 |
| P1 | AI LMS の `results` に、利用効果が確認できないまま「手作業を不要に」「場所・時間の制約を解消」と断定する表現が残る | **対応済み**。`content/cases.ts` を「受講状況をセクション単位で可視化」「ブラウザから利用可能」という実装機能の説明へ限定 |
| P2 | TOPを変更したのに sitemap のトップページ `lastModified` が旧日のまま | **対応済み**。`app/sitemap.ts` のトップページを `2026-08-27` へ更新 |
| P2 | 検証記録の残課題が最終差分と矛盾している | **対応済み**。削除済みの `marketing-automation` を残課題から除外 |

### 再検証結果

- `git diff --check`: 成功
- ルート `npm run lint`: 成功
- ルート `npm run build`: 成功（49ページ生成）
- `estimate/` の `npm run lint`: 成功
- `estimate/` の `npm run build`: 成功（13ページ生成）
- 既知警告: Next.js の workspace root 自動推定（複数 lockfile）と Browserslist DB の古さ。今回差分による失敗ではない

### `/simplify` 最終確認

Codex CLI（gpt-5.6-sol）で再利用性・可読性・不要な複雑性・既存パターンとの整合性を確認。
`content/usecases/ai-installation-failure.ts` で、画像説明を「自社開発」に変更した一方、前後の本文が「ある企業への導入事例」のまま残る矛盾を検出した。

→ 見出し・課題・解決策・効果を当社のAI見積もり実績へ統一し、未確認の顧客ヒアリング発言と社内波及効果を削除。自社実測値には注記を追加して対応済み。
