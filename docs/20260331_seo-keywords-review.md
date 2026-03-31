# CloudNature SEOキーワード方針 精査レビュー（更新版）

- 作成日: 2026-03-31
- 最終更新: 2026-03-31（二次レビュー反映）
- 対象ドキュメント: `docs/20260331_seo-keywords.md`
- 対象サイト:
  - `cloudnature.jp`
  - `ai.cloudnature.jp`

---

## 1. 結論

元ドキュメントの方向性は概ね妥当です。
ただし、そのまま実施するのは非推奨です。

理由:

- 一部の施策がすでに実装済み（構造化データ・LP・FAQ等）
- 構造化データへの期待値がやや高い（リッチリザルト表示は限定的）
- ページごとの対策キーワード数が多すぎる（1ページ5〜10個は逆効果）
- 本当に優先すべき施策が「キーワード追加」より「一次情報の強化」に寄っている
- 「技術・仕様系キーワード」にコピー上の訴求文言が混在している（SEO対策とコピーライティングの区別が必要）

したがって、`docs/20260331_seo-keywords.md` は実行計画としてではなく、キーワード候補集として扱うのが適切です。
実際の施策は、本レビューの優先順で進めるのがよいです。

---

## 2. 実装確認サマリー

### すでに実装済み

#### `cloudnature.jp`

- 主要ページの `title` / `description` 更新
  - `content/common.ts`
- `Organization` / `LocalBusiness` / `WebSite` の JSON-LD
  - `app/layout.tsx`
- `LocalBusiness.areaServed`
  - `app/layout.tsx`
- サービス個別ページ
  - `app/services/ai-support/page.tsx`
  - `app/services/ai-agent/page.tsx`
  - `app/services/system-dev/page.tsx`
- サービス用 `Service` 構造化データ
  - `lib/structured-data.ts`
- サービス / お問い合わせの FAQ JSON-LD
  - `app/services/page.tsx`
  - `app/services/ai-support/page.tsx`
  - `app/services/ai-agent/page.tsx`
  - `app/services/system-dev/page.tsx`
  - `app/contact/page.tsx`
- Breadcrumb JSON-LD
  - 下層ページで実装済み

#### `ai.cloudnature.jp`

- `/` のランディングページ
  - `estimate/app/page.tsx`
- `WebApplication` JSON-LD
  - `estimate/app/page.tsx`
- FAQ JSON-LD
  - `estimate/app/page.tsx`
- OGP / canonical / robots / sitemap
  - `estimate/app/layout.tsx`
  - `estimate/app/robots.ts`
  - `estimate/app/sitemap.ts`

### 元ドキュメントで「未実装」扱いだが、実際は実装済み

- `ai.cloudnature.jp` の LP 追加
- `ai.cloudnature.jp` の FAQ 構造化データ
- `ai.cloudnature.jp` の `WebApplication`
- `cloudnature.jp` の `Service`
- `cloudnature.jp` のお問い合わせ FAQ 構造化データ
- `cloudnature.jp` の `areaServed`

---

## 3. 評価

### 採用してよい方針

- 「新潟 × 中小企業 × AI導入支援 × 伴走型」の軸を明確にする
- `/services/ai-support` を `AI導入支援` 系の主受け皿にする
- `/services/ai-agent` を `AIエージェント開発 / AIチャットボット / 社内ナレッジAI` の受け皿にする
- `/services/system-dev` を `既存システム連携 / 業務システム開発` の受け皿にする
- ブログを課題起点で作る
- `cloudnature.jp` から `ai.cloudnature.jp` への内部リンクを強める

### そのまま採用しない方がよい方針

- 1ページに多数のキーワードを詰め込む設計（Googleは同義語・関連語を自動解釈するため、不自然な羅列は逆効果）
- FAQ / Service / HowTo 構造化データを順位改善の主因として扱うこと（意味付けには有効だが、順位への直接影響は限定的。リッチリザルト表示も保証されない）
- `n8nとは` `Difyとは` のような定義記事を優先すること（自社の強みと直結しない。優先度C）
- `AI導入 スモールスタート` のような検索需要未確認語を先に強く押すこと
- 「大手SIerの半額以下」「全額返金保証」等の訴求文言をSEOキーワードとして扱うこと（これらはコピーライティングの領域。SEOキーワードではなくCVR改善施策として扱う。また景品表示法の観点から、根拠を示せない価格比較表現は避ける）

---

## 4. 実際に優先すべきこと

### 優先度A: すぐやる

1. URLごとの主キーワードを絞る

- 各ページは `主KW 1つ + 副KW 2〜3個` 程度に抑える
- 例:
  - `/` : `AI導入支援 新潟`
  - `/services/ai-support` : `AI導入支援`
  - `/services/ai-agent` : `AIエージェント開発`
  - `/services/system-dev` : `業務システム開発 新潟`
  - `/cases` : `AI導入事例`
  - `/usecases` : `AI導入ヒント` または `業務自動化事例`

2. 一次情報を増やす

- 事例に業種・課題・導入前後・数値・期間を明記する
- 費用の考え方、導入ステップ、失敗しやすい点を自社視点で書く
- 一般論ではなく、`CloudNatureならどう進めるか` を書く

3. ブログは 12 本ではなく 3〜4 本から始める

- 優先候補:
  - `AI導入 何から始める`
  - `AI導入 費用`
  - `FAQ チャットボット 導入`
  - `議事録 自動化 AI`

4. `ai.cloudnature.jp` の `/chat` を個別最適化する

- 現状はレイアウトの metadata を継承しているため、`/` と `/chat` の役割がやや混ざる
- `/` は集客LP、`/chat` はCVページとして分けて metadata を設計する
- **技術的注意**: `estimate/app/chat/page.tsx` は `"use client"` コンポーネントのため、`metadata` / `generateMetadata` を直接 export できない。対応方法は以下のいずれか:
  - `estimate/app/chat/layout.tsx` を新規作成し、そこで metadata を export する（推奨）
  - ルートグループ `estimate/app/(chat)/chat/` に restructure する

5. `Organization` の `sameAs` を設定する

- `app/layout.tsx` の Organization JSON-LD で `sameAs: []` が空配列のまま
- SNSアカウント（X / LinkedIn / Facebook 等）があれば追加する。なければこの項目は後回しでよい

### 優先度B: 次にやる

1. `cloudnature.jp` 側の内部リンクを再整理する

- ブログ記事から対応サービスへリンク
- サービスから導入事例へリンク
- 費用・導入検討系記事から `ai.cloudnature.jp` へリンク

2. `cases` / `usecases` の主語を揃える

- `事例` と `解説記事` の役割差をユーザーにも検索エンジンにも分かりやすくする
- カニバリを避ける

3. `ai.cloudnature.jp` の本文を少し厚くする

- `見積もりで分かること`
- `概算と正式見積もりの違い`
- `費用が変動する主因`
- `どんな案件に向いているか`

### 優先度C: 後回し

- HowTo 構造化データの拡張
- `n8nとは` `Difyとは` の定義記事（自社ドメイン権威性が低いため上位表示は困難。公式ドキュメントやQiita記事に勝てない）
- 検索ボリューム未確認のニッチキーワード大量展開（`求人票 AI 自動生成`、`営業トーク AI`、`請求書チェック AI` 等）
- 技術スタック名（Python / React / AWS / GCP 等）でのSEO対策（求職者向けには有効だが、顧客獲得向けではない。採用ページを作る場合に活用）

---

## 5. ページ別の推奨整理

| URL | 主キーワード | 副キーワード |
|---|---|---|
| `/` | AI導入支援 新潟 | 中小企業 AI、業務自動化、伴走型 |
| `/services/ai-support` | AI導入支援 | 生成AI 導入 コンサルティング、AI研修 法人、AI導入 何から始める |
| `/services/ai-agent` | AIエージェント開発 | AIチャットボット、社内ナレッジAI、問い合わせ自動化 |
| `/services/system-dev` | 業務システム開発 新潟 | 既存システム連携、API連携開発、受発注管理システム |
| `/cases` | AI導入事例 | AI活用実績、業種別事例、成果事例 |
| `/usecases` | AI導入ヒント | 業務自動化事例、AI活用術 |
| `https://ai.cloudnature.jp/` | システム開発 見積もり | システム開発 費用 相場、見積もり 無料、概算見積もり |
| `https://ai.cloudnature.jp/chat` | システム開発 見積もり シミュレーター | AI見積もり、自動見積もり |

---

## 6. 元ドキュメントの修正ポイント

### 修正すべき認識

- `ai.cloudnature.jp` は「読めるテキストが少ない単一チャットページのみ」という前提ではない
- FAQPage / WebApplication は未実装ではない
- `cloudnature.jp` の `Service` / `Breadcrumb` / お問い合わせ FAQ は未着手ではない

### 文書として残してよい部分

- 地域 × 業種 × 課題起点でキーワードを考える方針
- `AI導入支援` を軸に寄せる方向性
- 課題別ブログの種リスト
- Search Console / キーワードプランナーを使った運用方針

### 文書から落とすか、注釈に留めるべき部分

- 構造化データを主要施策として扱う書き方
- 未確認キーワードを強い推奨として書くこと
- 実装済みタスクを新規施策として列挙すること
- 「技術・仕様系キーワード」にコピー文言（「大手SIerの半額以下」等）を混在させていること
- `meta keywords` タグへの言及（`estimate/app/layout.tsx` に `keywords` フィールドがあるが、Google は meta keywords を評価対象にしていない。他検索エンジンでも効果は極めて限定的）

### 文書に追加すべき部分

- 競合キーワードマップ（Section 7）は有用。ポジショニング戦略の参考として残す
- ブログ記事候補リスト（Tier 4）はコンテンツ企画の種リストとして有用。ただし優先順位を付けて段階的に実施

---

## 7. 補足メモ

### Googleの考え方に照らした注意点

- コンテンツは「検索順位操作のため」ではなく「人に役立つ情報」を優先して作る
- 同義語や関連語を無理に全部入れなくても、Google側である程度解釈される
- FAQ構造化データは意味付けには有効だが、リッチリザルト表示の期待は限定的
- `meta keywords` はGoogle検索の評価対象ではない

### このサイトで効きやすい要素

- 新潟という地域性（地域KWは競合が少なく上位表示しやすい）
- 中小企業向けという対象の明確さ（大手コンサルとの差別化が明確）
- 導入支援から開発まで一気通貫で対応できること（これが最大の差別化。NABはコンサル中心、NAILは研究寄り）
- 実際の導入成果を数字で示せること（E-E-A-T の Experience に直結）
- AI見積もりシミュレーターという独自ツールの存在（ツール型コンテンツは被リンク獲得に有効）

---

## 8. 推奨アクション

1. `docs/20260331_seo-keywords.md` を実行計画としては使わず、候補集に格下げする
2. 本レビューを優先順位付きの運用版として扱う
3. 次の実装タスクは以下を優先する（上から順に）

- **完了** `ai.cloudnature.jp/chat` の個別 metadata 設計（`estimate/app/chat/layout.tsx` 新規作成）
- **部分対応** 各ページの title / description を「主KW 1 + 副KW 2〜3」に絞り込み（`/usecases` description 改善済み。他ページは現状概ね適切だが、個別の見直しは未実施）
- **未着手** 事例本文の一次情報強化（業種・課題・導入前後・数値・期間の明記。コンテンツ作成が必要）
- **未着手** ブログ 3〜4 本の先行公開（コンテンツ作成が必要）
- **スキップ** `Organization` の `sameAs` にSNSプロフィールを追加（SNSアカウントなし。開設時に再検討）
- **スキップ** `estimate/app/layout.tsx` の `keywords` フィールド削除（害がないため維持）
- **完了** `/usecases` CTA の分離（`USECASES_CTA` 新規作成）
- **部分対応** `/cases` と `/usecases` の役割差明確化（usecases 側の CTA 分離 + description 改善済み。cases 側の metadata・本文設計は未着手）
- **完了** `ai.cloudnature.jp` LP 本文拡充（`EstimateDetailsSection` 追加）
- **部分対応** `cloudnature.jp` 内部リンク再整理（usecases CTA 分離済み。ブログ→サービス導線はブログ記事作成時に対応が必要）

---

## 9. TODO チェックリスト

凡例: **完了** = 実装済み / **部分対応** = 一部実装済み、残作業あり / **スキップ** = 意図的に見送り / **未着手** = 未実施

### 優先度A: すぐやる

- **完了** `estimate/app/chat/layout.tsx` 新規作成（`/chat` 専用 metadata）
- **スキップ** `estimate/app/layout.tsx` の `keywords` フィールド削除 → 害がないため維持
- **完了** `estimate/app/layout.tsx` の Twitter title typo 修正（「最1分」→「最短1分」）
- **部分対応** 各ページの title / description が「主KW 1 + 副KW 2〜3」に収まっているか確認 → `/usecases` の description を改善済み。他ページ（`/`, `/services/*`, `/cases` 等）は現状概ね適切だが個別精査は未実施
- **スキップ** `app/layout.tsx` の Organization `sameAs` にSNSプロフィール追加 → SNSアカウントなし。開設時に再検討
- **未着手** 事例本文の一次情報強化（業種・課題・導入前後の数値・期間を明記）
- **未着手** ブログ記事の先行公開（3〜4本）
  - [ ] 「AI導入 何から始める」
  - [ ] 「AI導入 費用」
  - [ ] 「FAQ チャットボット 導入」
  - [ ] 「議事録 自動化 AI」

### 優先度B: 次にやる

- **部分対応** `cloudnature.jp` 内部リンク再整理 → `/usecases` 専用 CTA 作成済み。サービス↔事例↔ユースケースの双方向リンクは `RelatedLinks` で既存。残: ブログ→サービス導線（ブログ記事作成時に対応）
- **部分対応** `/cases` と `/usecases` の役割差を明確化（カニバリ回避）→ usecases 側の CTA 分離 + description 改善済み。残: cases 側の metadata・本文設計の見直し
- **完了** `ai.cloudnature.jp` LP 本文の拡充 → `EstimateDetailsSection` を新規追加（見積もりに含まれるもの、概算と正式見積もりの違い、費用変動要因、対象プロジェクト）

### 優先度C: 後回し

- [ ] HowTo 構造化データの拡張
- [ ] 定義記事（`n8nとは`、`Difyとは` 等）
- [ ] 検索ボリューム未確認のニッチKW展開（`求人票 AI 自動生成`、`営業トーク AI` 等）
- [ ] 技術スタック名でのSEO対策（採用ページ向け）

### 運用・定期タスク

- [ ] Search Console で実際の検索クエリ確認（月次）
- [ ] 新規公開記事の検索順位確認（公開後 2〜4 週間、月次）
- [ ] キーワードプランナーでボリューム再確認（四半期）
- [ ] 競合 SERP 再調査 — NAB・NAIL 等の新規コンテンツチェック（半年）

---

## 10. 参考

- Google Search Central: Creating helpful, reliable, people-first content  
  https://developers.google.com/search/docs/fundamentals/creating-helpful-content
- Google Search Central: SEO Starter Guide  
  https://developers.google.com/search/docs/fundamentals/seo-starter-guide
- Google Search Central: Search appearance / structured data supported by Google Search  
  https://developers.google.com/search/docs/appearance
- Google Search Central: Software app structured data  
  https://developers.google.com/search/docs/appearance/structured-data/software-app
- Google Search Central Blog: Google does not use the keywords meta tag  
  https://developers.google.com/search/blog/2009/09/google-does-not-use-keywords-meta-tag
