# コーポレートサイト総合レビュー(2026-07-02)

## 検証目的

cloudnature.jp をプロ視点で総合評価し、修正すべき点を整理する。
特に「新潟における AI 開発・AI エージェント開発の確固たる地位確立」という
事業目標に照らして、SEO・ブランディング・技術品質の観点から改善点を洗い出す。

## 対象範囲

- コーポレートサイト(`app/`, `components/`, `content/`, `next.config.mjs` ほか)
- 見積もりシステム(`estimate/`, `backend/`)は対象外
- 調査方法: 3 観点(SEO / ブランディング / 技術)の並行コード調査
  + 本番サイト実査 + 検索結果の競合確認 + Codex(gpt-5.5)セカンドオピニオン

## 総合評価

| 観点 | 評価 | 一言 |
|---|---|---|
| SEO 基盤 | ★★★★☆ | canonical / sitemap / 構造化データ / メタ最適化は高水準。h1 と地域エンティティ情報が弱点 |
| コンテンツ SEO | ★★★☆☆ | トピッククラスタの土台は良好。薄い記事・誤リンク・カテゴリ未リンク化が足かせ |
| ブランディング | ★★★☆☆ | 「人手に代わる仕組み」の一貫性は強い。実績数字の根拠とお知らせの実在性が信頼リスク |
| 技術品質 | ★★★★☆ | a11y・XSS 対策・コンテンツ分離は優秀。realtime-translate の無認証公開が唯一の重大リスク |

### 検索順位の現状(2026-07-02 時点)

- 「新潟 AI開発 会社」の上位: にいがたAIビジネス、新潟人工知能研究所(NAIL)、
  新潟日報生成AI研究所、メビウス、ドコドアのまとめ記事など。**cloudnature.jp 本体は上位不在**
- 一方、usecases の補助金記事(`niigata-ai-subsidy-guide-2026`)はニッチ KW で露出あり
  → 記事経由の指名獲得は機能し始めている。会社サイト本体の地域 KW 強化が次の課題

---

## 指摘事項(優先度順)

### P0 — 即時対応(セキュリティ / 信頼リスク)

**1. `/realtime-translate` が実質無認証で OpenAI Realtime API トークンを発行【最重要】**
- `components/realtime-translate/RealtimeTranslateApp.tsx:17-18` で `BYPASS_GATE = true`、
  さらに固定パスワードがクライアントバンドルに露出
- `app/api/realtime-translate/session/route.ts` が一時トークン(TTL 600秒)を発行。
  ページの `noindex` は検索避けであってアクセス制御ではない
- 防御は `lib/rate-limit.ts` のインメモリ制限のみ。Vercel サーバーレスでは
  インスタンス間で状態共有されず実効性が低い → **請求濫用リスク**
- 対処: `BYPASS_GATE=false` + パスワード環境変数化。恒久策は公開サイトからの分離
  (Vercel 認証保護 / middleware IP 制限 / 別デプロイ)、レート制限の共有ストア化

**2. お知らせフォールバックに実在性未確認の PR 文言**
- `content/home.ts:178-185` の `NEWS_ITEMS`(microCMS 不通時フォールバック)に
  「日経クロステック『注目スタートアップ』特集に掲載」「セミナー開催」等
- `app/news/page.tsx:47`・`app/news/[slug]/page.tsx:31-58` の `buildFallbackArticle` で
  **実ページ化・canonical 付きでインデックスされうる**
- 事実でない場合は景表法・E-E-A-T 毀損に直結。事実か即確認し、
  未確定のものはフォールバックから削除 or noindex 化

### P1 — 高優先(SEO / 表示品質)

**3. TOP の h1 にターゲット KW が無い**
- `content/home.ts:7-8`「AIトランスフォーメーションで人手に代わる仕組みを」が h1。
  「新潟のAI開発・AIエージェント開発パートナー」はバッジ `<p>` 側
- git 履歴上、一度 KW 寄せした h1 を意図的に戻した経緯あり(`9476a15`→`084ccbd`)。
  地域1位戦略と矛盾するため、バッジと h1 の役割入れ替え(または KW を h1 に統合)を推奨

**4. LocalBusiness JSON-LD が骨組みだけ・`sameAs` 空配列**
- `app/layout.tsx:105-125`: telephone / geo / openingHoursSpecification / priceRange 欠落
- Google Business Profile 未連携(`sameAs: []`)はローカル SEO の最大の機会損失。
  GBP 作成 → `sameAs` に GBP・SNS を列挙、`@type` は `ProfessionalService` へ具体化余地

**5. usecases 記事の品質ばらつき・誤リンク**
- 誤リンク: `content/usecases/business-automation-small-start.ts:179` の
  アンカー「AI見積もりシステム」が `/usecases/ai-installation-failure`(失敗記事)を指す
- 薄い記事2本: `ai-auto-sales-delivery.ts`・`ai-analytics-auto-report.ts`
  (新潟言及ゼロ、相互リンクなし、画像が `/images/tmp/` の暫定パス+裸 `<img>`)
  ※一覧・sitemap には載っているため厳密にはオーファンではない(Codex 指摘で修正)
- 後半記事(4〜9本目)の excerpt が 50〜75 字と短く SERP スニペットを活かせていない

**6. ヒーロー画像の二重プリロード**
- `components/home/HeroSection.tsx`: モバイル用・PC 用の両 `<Image priority>` を
  CSS 出し分けで併存 → 非表示側もプリロードされ、モバイルで約 1MB の無駄(LCP 悪化)
- h1 も 2 つ DOM 出力される(文言同一のため実害小だが 1 ページ 1 h1 が理想)
- 対処: `priority` を片側のみ or `<picture>`/media で単一化。PC 原本(3344px/998KB)も縮小推奨

**7. JS 依存の初期非表示(堅牢性)**
- `components/shared/ScrollReveal.tsx`(framer-motion `initial:hidden`)で主要ページの
  セクションが JS 失敗時に不可視。`prefers-reduced-motion` でも framer のインライン style は残る
- Codex 追加指摘: TOP の `ServicesSection` も独自 reveal で同じ問題
- 対処: `useReducedMotion` フォールバック、重要コンテンツは SSR 可視のまま演出付与

**8. デプロイ物の肥大**
- `public/images/blog/*/_original` 約 27MB(未参照の原本 PNG)、`/images/tmp/` 約 12MB、
  `.DS_Store` ×5、`renewal-site-img.png`(940KB)等 → 削除 or リポジトリ外へ

### P2 — 中優先(ブランディング / ポジショニング)

**9. 実績数字の出所が弱い・表現ゆれ**
- `common.ts:41`「95%削減」と `cases.ts:19`「数日→1分」は矛盾とまでは言えない(Codex 修正)が、
  `cases.ts:85`「平均80%の工数削減」は母数 3 件(数値実績は実質 1 件)で根拠が弱い
- 数字は出所を一本化し、算出根拠(対象業務・期間)を事例側に明記する

**10. AI 企業ポジショニングの希釈**
- サービス配列先頭が「システム開発」(`home.ts:60-67`)で AI エージェント開発が 2 番手
- TOP とサービス詳細でサービス順が不一致(Codex 指摘)。
  全体を「AIエージェント開発 → AI導入・伴走支援 → システム開発」等 AI 主語の順へ統一
- `services.ts:12`「必要な分だけ、確かな技術を」は価格訴求で AI 専門性が伝わらない

**11. 代表経歴・EEAT 要素の埋没**
- 最大の差別化資産「数十万人が毎日使うサービスの開発」(`company.ts:32`)が
  company ページ内に留まる。TOP・事例導入部へ露出を。顔写真・資格・
  クラウドパートナー認定の掲載も権威性補強に有効
- 事例が全て匿名(`cases.ts:36,58`)。1 社でも実名・ロゴ・インタビュー許諾の獲得を

**12. AIEO(AI 検索)対応の再検討**
- `app/robots.ts:16-19`: `OAI-SearchBot` のみ許可、`GPTBot`/`ClaudeBot`/`Google-Extended` ブロック。
  `ClaudeBot` ブロックは Claude での引用、`Google-Extended` は Gemini/AI Overviews 露出に影響
- Codex 追加指摘: `public/llms.txt` が弱い(主力の新潟×AI 記事を載せず薄い記事を前面に)

### P3 — 低優先(整理・磨き込み)

- **CSP 未設定**: `next.config.mjs` に `frame-ancestors` / `base-uri` / `object-src` だけでも追加
- **デッドコード**: `AiGuidesSection.tsx`(未参照)+ `home.ts:210-239` の
  `AI_GUIDES_ITEMS` が実在しない slug を保持 → 有効化すると 4 本の 404。削除 or slug 修正
- **デッド CTA**: 「資料ダウンロード」(`layout.ts:5` 等)に配布実体が見当たらない
- **カテゴリ未リンク化**: usecases / news のカテゴリ・年別が `<span>` で絞り込み不可
  (`app/usecases/page.tsx:99-127` 等)→ カテゴリページ新設で内部リンク階層を構築
- **文言統一**: 「見積り/見積もり」ゆれ、`contact.ts:6`「お気軽にお相談ください」→
  「ご相談ください」へ統一(誤字ではなく校正レベル・Codex 修正)、
  VALUE3 の英語サブタイトル `Integrity & Trust` と日本語の不対応(`home.ts:49`)
- **その他**: CMS リンクの `rel=noopener` 強制(`NewsBody.tsx:20`)、
  `layout.tsx:31` 既定 title と `common.ts:31` の不一致、視覚パンくず無し、
  OGP 画像がほぼ全ページ共通、Noto Sans JP の `subsets:["latin"]` 指定

---

## 良い点(維持すべき資産)

- **SEO 基盤**: 全ページ canonical、`lib/structured-data.ts` による体系的な JSON-LD
  (Organization + LocalBusiness + WebSite の @graph、Article、FAQPage、Service に
  `areaServed: 新潟県`)、動的 sitemap/robots、非本番 noindex
- **メタ最適化**: 全ページ title が「新潟の〜」型で統一(`common.ts:29-79`)。
  本番実査でも title「新潟のAI開発・AIエージェント開発会社」を確認
- **コンテンツ**: `niigata-ai-development-company-guide` をハブとするトピッククラスタ、
  公的一次情報への外部リンク、FDE(シェアード型 AI 開発)という独自概念
- **メッセージ一貫性**: 「人手に代わる、仕組みを届ける」「何から始めればいいか分からない」
  への共感フックが全ページで反復。CTA も「AI見積もり+問い合わせ」の二段構えで統一
- **技術**: 生 `<img>` ゼロ(usecases 薄記事2本を除く)、`next/font`、
  MobileMenu の完全なフォーカストラップ、ContactForm の aria 徹底、
  sanitize-html によるサーバー側 XSS 対策、Turnstile + `after()` の問い合わせ設計、
  セキュリティヘッダ 5 種、content/ 分離パターンの徹底

---

## Codex レビュー(gpt-5.5 / read-only)

- 指摘 15 件中、重大 2 件(realtime-translate 無認証、ニュースフォールバック)を**妥当**と確認
- 修正された指摘: ①薄い記事 2 本は sitemap・一覧に載るため「オーファン」は言い過ぎ
  ②「95% vs 数日→1分」は矛盾ではない(「平均80%」の根拠不足が本質)
  ③「お相談ください」は誤字ではなく校正レベル
- 追加の見落とし: ① `public/llms.txt` が弱くAIEO機会損失 ② `ServicesSection` の
  独自 reveal も JS 失敗時不可視 ③ TOP とサービス詳細のサービス順不一致
- 実測補正: `_original` は約 27MB、`/images/tmp/` は約 12MB

## 対応ロードマップ(推奨)

| 期限目安 | 対応 |
|---|---|
| 今すぐ | P0-1: realtime-translate のゲート復活+パスワード環境変数化(恒久策は分離) |
| 今すぐ | P0-2: NEWS_ITEMS の事実確認、未確定項目の削除 |
| 今週 | P1-3〜5: TOP h1 の KW 化、GBP 作成+ sameAs、誤リンク修正、tmp 画像正規化 |
| 今週 | P1-6〜8: ヒーロー画像単一化、_original/.DS_Store 削除 |
| 今月 | P2: サービス順の AI 主語統一、実績数字の根拠一本化、代表経歴の TOP 露出 |
| 今月 | P2-12: llms.txt 強化、ClaudeBot 許可の判断、薄い記事 2 本のテコ入れ or 統合 |
| 随時 | P3: CSP、デッドコード/CTA 整理、カテゴリページ、文言統一 |

## 検証結果・対応状況

- 2026-07-02: 調査完了・本ドキュメント作成
- 2026-07-02: **P0 対応済み**
  - P0-1: `BYPASS_GATE` を撤廃しパスワード必須化。照合パスワードを環境変数
    `REALTIME_TRANSLATE_PASSWORD` へ移行(フェイルクローズ)。詳細は SECURITY.md 参照。
    **要オペレーション: Vercel に新パスワードを設定**(旧パスワードは漏えい済み扱い)
  - P0-2: 日経クロステック掲載のお知らせは**事実でないことをユーザーが確認** →
    `content/home.ts` の `NEWS_ITEMS` から削除
  - 未確認のまま残存: 「中小企業向けAI活用セミナー開催」(seminar-ai-intro)、
    「記事執筆工数80%削減事例」(case-marketing-automation) → 事実確認待ち
- 2026-07-02: **P1 対応済み**
  - P1-3: TOP ヒーローのバッジ「新潟のAI開発・AIエージェント開発パートナー」を
    h1 に、ディスプレイコピーを p に役割交換(見た目は不変)。モバイル/PC 両レイアウト
  - P1-4: JSON-LD を補強 — LocalBusiness → `ProfessionalService` に具体化、
    geo(会社ページの地図埋め込みと同一座標)・hasMap・description・
    parentOrganization を追加。Organization に founder(渡邉浩平)・foundingDate を追加。
    **telephone / openingHours / sameAs(GBP・SNS)はサイト上に情報が無く未設定 →
    要ユーザー対応**(GBP 開設が最優先のローカル SEO 施策)
  - P1-5: 誤リンク修正(`business-automation-small-start.ts` の「AI見積もりシステム」→
    `https://ai.cloudnature.jp/`)。薄い記事 2 本の `/images/tmp/` 画像を webp 最適化して
    `/images/blog/ai-auto-sales-delivery/`・`/images/blog/ai-analytics-auto-report/` へ正規化
    (計約 2.9MB → 約 640KB)、`<figure>` + width/height + loading="lazy" 付与、
    excerpt を SERP 向けに拡充
  - P1-6: ヒーロー画像を `getImageProps` + `<picture>` のアートディレクションに変更。
    ビューポートに一致する画像のみダウンロードされる(旧: 非表示側もプリロード)。
    LCP 用に eager + fetchpriority="high" を維持
  - P1-7: `ScrollReveal` に `useReducedMotion` フォールバック追加。
    `ScrollReveal`/`ScrollRevealItem`/`ServicesSection` に `data-reveal` を付与し、
    layout.tsx の `<noscript>` スタイルで JS 無効時に初期非表示を解除
  - P1-8: `public/` から未参照アセットを削除 — `_original` ×2(17MB)、
    `images/tmp`(12MB)、`images/old`(2.6MB)、`renewal-site-img.png`(940KB)、
    `.DS_Store` ×5。public/ 全体 54MB → 22MB
  - 検証: lint(--max-warnings=0)/本番ビルド成功。dev サーバーで h1 出力・picture 出力・
    JSON-LD・noscript・記事画像 200・リンク修正を confirm 済み
- 2026-07-02: **P2 対応済み**(P2-11 代表経歴・EEAT はユーザー判断により保留)
  - P2-9: 実績数字の整合 — 事例詳細に「（工数95%削減）」を追記して 95% の出所を明示。
    根拠の弱かった事例 CTA「平均80%の工数削減」→「最大95%の工数削減」に変更
    (95%=見積もり事例、80%=マーケ事例に根拠が揃った状態)
  - P2-10: AI ポジショニング強化 — TOP のサービス順を「AI導入・伴走支援 →
    AIエージェント開発 → システム開発」に変更しサービス詳細ページと統一。
    表示順は `content/common.ts` の `SERVICE_ORDER` を単一ソースとして機械的に適用。
    サービスページ h1「必要な分だけ、確かな技術を」→「AI開発・AI導入支援を、必要な分だけ」、
    TOP HERO 説明の「AIとクラウド技術」→「AIエージェントと生成AI」
  - P2-12: AIEO 対応 — robots.ts で AI 検索・引用系クローラ
    (OAI-SearchBot / ChatGPT-User / Claude-SearchBot / Claude-User / PerplexityBot)を許可、
    学習用(GPTBot / Google-Extended / ClaudeBot)は引き続き拒否。
    llms.txt を静的ファイルから動的ルート(`app/llms.txt/route.ts`)に変更し、
    `USECASES_ARTICLES` から全 9 記事を自動掲載(記事追加に自動追従)。
    薄い記事 2 本に内部リンク(業務仕分け・スモールスタート記事・AIエージェント開発
    サービス)と新潟の地域文脈を追加しクラスタに接続
  - /simplify 追加適用: PageHero のアニメ定義集約、robots ルールの配列化、
    サービス順の単一ソース化、llms.txt 動的化。
    見送り: data-reveal 手付け規約の共通プリミティブ化、ServicesSection の
    ScrollReveal 統合(アニメ挙動が変わるため)→ 将来課題
  - 検証: lint / 本番ビルド成功。本番サーバーで TOP・/services のサービス順、
    /llms.txt の記事 9 本掲載、robots.txt 本番出力(ビルド時 VERCEL_ENV=production で確認)、
    PageHero の data-reveal を confirm 済み
- 残タスク: P2-11(代表経歴・EEAT。写真・資格等の素材が揃い次第)、P3(CSP・デッドコード
  整理・カテゴリページ・文言統一ほか)、GBP 開設(ユーザー)、Vercel への
  REALTIME_TRANSLATE_PASSWORD 設定(ユーザー)、お知らせ 2 件の事実確認(ユーザー)
