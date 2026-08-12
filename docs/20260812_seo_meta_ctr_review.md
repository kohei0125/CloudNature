# 検索CTR改善のための Title / Meta description 見直し（2026-08-12）

## 検証目的

GSC実測（2026-07-09〜08-05）で、1ページ目表示にもかかわらずクリック0件が2期連続しているクエリのCTRを回復させる。

| クエリ | Imp | 平均順位 | CTR | 着地URL |
| --- | --- | --- | --- | --- |
| 見積もりai 中小企業 | 36 | 9.22位 | 0% | /cases |
| ai導入 失敗 勘違い | 28 | 6.43位 | 0% | /usecases/ai-installation-failure |
| ai導入 中小企業 失敗 | 7 | 6.71位 | 0% | /usecases/ai-installation-failure |

あわせて Ahrefs Site Audit（2026-08-07クロール）の「Meta description too short」21件・「Title too long」2件を棚卸しする。

## 対象範囲

- `content/common.ts`（PAGE_META: cases / services / servicesSystemDev / company / news / privacy / security / terms）
- `content/usecases/_common.ts`（USECASES_SECTION.description）
- `content/usecases/ai-installation-failure.ts`（title / excerpt）
- `app/usecases/[slug]/page.tsx`（titleテンプレート）

canonical / noindex / 301 / URL変更は対象外。本番公開（マージ）はしない。

## SERP実査で判明した課題（2026-08-12、Google日本語検索を実機確認）

1. **/usecases/ai-installation-failure は「ai導入 中小企業 失敗」で1位、「ai導入 失敗 勘違い」で2位に実際に表示されている**が、
   - titleが「…成功企業がやっている“ …」で途切れ、フックが見えない（titleテンプレートのセクション名サフィックス16文字が原因）
   - クエリ語「中小企業」「勘違い」がtitle/descriptionに無い。競合上位はほぼ全てtitleに両語を含む
   - スニペットはmeta descriptionでなく本文抽出が表示されている
2. **/cases は「見積もりai 中小企業」で3位表示**だが、titleに「見積もり」が無く、競合の「見積もりAIとは/○つのステップ」系ハウツーの中で内容が伝わらない
3. Ahrefsの「Meta description too short」は110文字未満（半角基準）の一律判定で、日本語ページには過剰検出。**日本語で90文字前後あるページは実質適正**であり、真に薄いのは規約系（22〜30文字）とお知らせ一覧（45文字）など

## 確認項目

- [x] 変更対象のtitle/descriptionの定義箇所を特定（PAGE_META / article.excerpt / titleテンプレート）
- [x] 事実主張（95%削減・80%削減・無料・サービス構成・規約の記載項目）が既存コンテンツに存在することを確認
- [x] 誇大表現（No.1・最安・必ず等）を含まない
- [x] 文言変更の横断確認（OG/Twitter/JSON-LD/llms.txtはすべて同一ソースから動的生成で自動追従、記事内アンカーテキストは新titleと整合）
- [x] `npm run build` / `npm run lint` パス
- [x] Codexレビュー実施

## 改善案（各3パターン、★=採用）

### /cases（狙い: 見積もりai 中小企業）

| 案 | Title | クリックされると考える理由 |
| --- | --- | --- |
| ★A | AI導入事例｜見積もり作成95%削減など中小企業の成果 | クエリ3語（見積もり/AI/中小企業）を表示域30文字内に収め、実数値95%で「とは/ステップ」系解説記事と差別化できる |
| B | 見積もりAI・業務自動化の導入事例｜中小企業の実績と成果 | 検索語「見積もりAI」を先頭完全一致にし、ツール検討層のクリックを直接拾う |
| C | AIで何がどれだけ変わった？中小企業のAI導入事例と数字 | 疑問形＋「数字」で、解説記事が並ぶSERPに対し実績ページである違いを打ち出す |

★A description: 「見積もりAIで作成時間を数日から1分に短縮（工数95%削減）、コンテンツ制作の工数80%削減など、新潟の中小企業で実際に成果が出たAI導入事例を、課題・解決策・数字つきでご紹介します。」

### /usecases/ai-installation-failure（狙い: ai導入 失敗 勘違い / ai導入 中小企業 失敗）

| 案 | Title | クリックされると考える理由 |
| --- | --- | --- |
| ★A | AI導入で中小企業が失敗する3つのパターン｜成功企業の共通点は1つ | 1〜2位表示2クエリの主要語（AI導入/中小企業/失敗）を前半に収め、途切れていたフックを表示域内で完結させる。「勘違い」はdescription側で太字マッチさせる |
| B | 「AIは誰でも使える」は勘違い｜中小企業のAI導入・失敗3パターン | クエリ「勘違い」をタイトル先頭ブロックで完全一致させ、記事内の最重要見出しの具体性で引く |
| C | なぜAIを入れてもエクセルに戻るのか｜中小企業のAI導入失敗3パターン | 解説系タイトルが並ぶSERPで唯一の「あるある」描写となり感情的な引っかかりを作る |

★A excerpt（=meta description）: 「「AIを入れたのに結局エクセルに戻った」——中小企業のAI導入は『AIは誰でも使える』という勘違いなど、3つの典型パターンでつまずきます。成果を出す企業が実践しているたった1つの共通点を、支援現場の実例から解説します。」

※titleサフィックスは全記事共通で「| AI導入のヒント・実践ガイド | クラウドネイチャー」→「| クラウドネイチャー」に短縮（16文字削減）。これにより「Title too long」2件（niigata-fde-shared-ai-development / ai-analytics-auto-report）も60文字未満に収まり解消。

## Meta description too short 21件の棚卸しと優先度

| 優先度 | URL | 現状文字数 | 対応 |
| --- | --- | --- | --- |
| P1 | /cases | 63 | ★A案に差し替え（約91文字） |
| P1 | /usecases/ai-installation-failure | 90 | 長さでなくクエリ語補完のため★A案に差し替え（約105文字） |
| P2 | /services | 67 | 3サービス明示＋無料AI見積もり追記（約104文字） |
| P2 | /services/system-dev | 72 | 無料AI見積もり追記（約103文字） |
| P2 | /usecases | 67 | 記事テーマ（失敗パターン/業務自動化/補助金）を明示（約89文字） |
| P2 | /company | 64 | 事業内容を追記（約85文字） |
| P2 | /news | 45 | 掲載内容（セミナー報告/イベント/リリース）を明示（約77文字） |
| P3 | /privacy | 22 | 記載項目を列挙（約83文字） |
| P3 | /security | 29 | 記載項目を列挙（約84文字） |
| P3 | /terms | 30 | 記載項目を列挙（約79文字） |
| 対応不要 | / (92)・/contact (79)・/services/ai-support (96)・usecases記事3本 (73〜90) | — | 日本語として表示幅十分。変更リスクの方が大きい |
| 対象外 | /news/○○ 5記事 | 57〜98 | microCMS管理のためリポジトリでは修正不可。CMS側での編集を推奨 |
| 対象外 | ai.cloudnature.jp/chat | 86 | 別プロパティ（見積もりサブドメイン）。日本語として十分な長さ |

## 検証結果・対応状況

- 2026-08-12 実装完了。変更ファイル: `content/common.ts` / `content/usecases/_common.ts` / `content/usecases/ai-installation-failure.ts` / `app/usecases/[slug]/page.tsx`
- `npm run build` パス（全ルート静的生成OK）
- ESLint（変更対象の `app` / `components` / `content` / `lib` / `types`）: エラー0・警告0。フル `npm run lint` で出る指摘は `ai-dev/.next` のローカルビルド生成物に対する既存のもので、本変更とは無関係
- Codexレビュー（gpt-5.4 / uncommitted diff）: 「既存機能や公開内容の正確性を損なう不具合なし。参照元やページ実装との整合も保たれている」→ 指摘0件
- 横断確認: OG / Twitter / JSON-LD / llms.txt はすべて同一ソース（PAGE_META / article.title / article.excerpt / USECASES_SECTION）からの動的生成のため自動追従。記事本文内の他記事からのアンカーテキスト（「AI導入で失敗する3つのパターン」等）は新title・記事内容と整合するため変更不要
- **効果測定ベースライン**: 変更反映日 = PRマージ日（本ドキュメント作成・実装は2026-08-12）。GSC比較は反映日起点の28日間 vs 直前28日間（Clicks / CTR / 対象3クエリ）で行う
