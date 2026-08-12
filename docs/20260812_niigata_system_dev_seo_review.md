# 「新潟 システム開発」系クエリの着地URL是正 検証ドキュメント

作成日: 2026-08-12

## 1. 検証目的

GSC 実測（2026-07-09〜08-05）で、受注に最も近い「新潟 × システム開発」系クエリの着地URLが
コーポレートサイトのサービスページではなく **見積もりツールのサブドメイン `ai.cloudnature.jp`** に
なっている。この着地URLを `/services/system-dev` に寄せる。

KPI: `/services/system-dev` の Impressions と平均順位（Organic Clicks 総量ではない）。

### 前提データ（ユーザー提供・GSC実測 直近28日）

| クエリ | Impressions | 平均順位 | Googleが返しているURL |
| --- | --- | --- | --- |
| 新潟 システム 開発 | 21 | 21.33 | ai.cloudnature.jp/ |
| システム開発 新潟 | 12 | 17.75 | ai.cloudnature.jp/ |
| 新潟 システム開発 | 6 | 17.83 | ai.cloudnature.jp/ |
| アプリ開発会社 新潟 | 3 | 54.67 | cloudnature.jp/ |

- `ai.cloudnature.jp`: 13クエリ / 102imp / 0click / 平均48.57位
- `/services/system-dev`: GSC 上位ページ15件に出現せず

## 2. 対象範囲

- `cloudnature.jp`（本体）: `app/services/system-dev/`, `content/services.ts`, `content/common.ts`,
  `content/usecases/*.ts`, `app/sitemap.ts`
- `ai.cloudnature.jp`（`estimate/`）: **調査のみ。設定変更しない**
- canonical / noindex / 301 / URL変更: **実装しない。提案の文章のみ**

## 3. 現状調査の結果（リポジトリ + 本番実サイト実測）

### 3-1. サブドメイン構成

| 項目 | cloudnature.jp | ai.cloudnature.jp |
| --- | --- | --- |
| 実体 | Next.js（本体 `app/`） | Next.js（`estimate/`、別Vercelプロジェクト） |
| canonical | `https://cloudnature.jp/services/system-dev`（自己参照） | `https://ai.cloudnature.jp`（自己参照） |
| robots meta | `index, follow` | 指定なし（= index可） |
| robots.txt | Allow: /、学習系botのみ Disallow | Allow: /（`/api/`・`/complete` のみ Disallow） |
| sitemap | 本体13静的URL + news + usecases（system-dev 含む） | `/` と `/chat` の2URLのみ |

→ 技術的な阻害要因（noindex・canonical誤指定・robots ブロック・sitemap 欠落）は**いずれも無い**。
   両サイトとも正常にインデックス可能な状態。

### 3-1b. Ahrefs 連携GSCでの独立確認（2026-07-09〜08-05・全ページ）

Ahrefs MCP の `gsc-pages`（project_id 10203766）で同期間の**全ページ**（15件）を取得した結果:

- `/services/system-dev` は**リストに1件も出現しない**（= 当該期間の記録上インプレッション0）
- さらに `/services`・`/services/ai-agent`・`/services/ai-support` も**1件も出現しない**
  → 問題は system-dev 単独ではなく、**サービスページ群が丸ごと検索露出を持っていない**
- `ai.cloudnature.jp/` は 13キーワード / 102imp / 0click / 平均48.57位（ユーザー提供値と一致）
- 露出上位は `/cases`（45imp）、`/usecases/*`（67・54・36imp…）で、**記事群が流入の主体**

※GSCは低ボリュームのクエリ・ページを匿名化・除外することがあるため、
　「記録上0」は実際の露出が厳密に0であることまでは保証しない。

### 3-2. `<title>` の実測（本番HTML）

| URL | title |
| --- | --- |
| `ai.cloudnature.jp/` | **新潟のシステム開発**・AI導入見積もり｜最短1分で自動算出【CloudNature】 |
| `/services/system-dev` | 新潟の**業務**システム開発・既存システム連携 \| 株式会社クラウドネイチャー |

`ai.cloudnature.jp` は `keywords` に `"新潟 システム開発"` を明示的に含む（`estimate/app/layout.tsx`）。

### 3-3. `/services/system-dev` のページ実態（本番HTML実測）

- h1: `システム開発`（**「新潟」を含まない**）
- 見出し構成: h1 → h3（キャッチコピー）→ h2「よくあるご質問」→ h2「関連する事例・コンテンツ」→ h2 CTA
- 可視テキスト量: **約1,448文字**（ヘッダー・フッター込み）
- 「新潟」出現数 4（大半がヘッダー/フッター/FAQ由来）、「システム開発」出現数 4
- 本文の実体は `ServiceDetailCard` 1枚（対象/ゴール/特徴の3項目）+ FAQ5件のみ

### 3-4. 内部リンク（サイト内の票の集まり方）

| 宛先 | 本文内コンテキストリンク数 |
| --- | --- |
| `ai.cloudnature.jp`（見積もりツール） | ヘッダーナビ + 全ページの primary CTA + 記事本文内 15箇所以上 |
| `/services/system-dev` | **記事本文内はわずか1箇所**（`niigata-ai-development-company-guide.ts`）+ フッター + TOPカード |

`relatedServiceIds` に `"dev"` を持つ記事は10本中4本のみ。

## 4. `/services/system-dev` が地域クエリで出てこない原因（仮説）

いずれも断定ではなく**可能性**として記載する。GSCの当該クエリのURL単位データからは因果を確定できない。

| # | 仮説 | 根拠 | 確度 |
| --- | --- | --- | --- |
| 1 | 当該クエリの**代表URL選択で `/services/system-dev` が負けている**。ai側の方が適合シグナルが強く、Googleがそちらを返している | ai側は title 先頭が「新潟のシステム開発」で前方一致。system-dev 側は h1 に「新潟」が無く、title も「業務」が割り込む | 高 |
| 2 | `/services/system-dev` のコンテンツが薄く、クエリに対する情報充足度が不足している | 可視テキスト約1,448文字、実質 h3 見出し1本 + FAQ のみ。「新潟 システム開発」上位は会社概要・対応領域・進め方を持つ厚いページが一般的 | 高 |
| 3 | サイト内リンクの評価が `ai.cloudnature.jp` に集中し、`/services/system-dev` に集まっていない | 本文内リンク数が 15+ 対 1 | 中 |
| 4 | ai側がサブドメインの**ホームページ**であり、内部リンクも集中しているため、下層ページより選ばれやすい | 全ページの primary CTA + ヘッダーナビが ai 宛 | 中 |
| 5 | `/services/system-dev` に対する累積評価が不足している | 同期間の GSC 全ページリスト（15件）に出現せず、記録上インプレッション0。さらに `/services` 配下3ページすべてが同様（※GSCの匿名化により実際の露出が厳密に0とは限らない） | 中 |
| 6 | 「新潟 システム開発」の検索意図が「会社を探す」であり、サービス説明ページよりトップページ的なURLが選ばれやすい | 「アプリ開発会社 新潟」の着地が `cloudnature.jp/`（トップ）である点と整合 | 中 |

**補足（Codex レビューでの修正点）**: 当初は `estimate/app/layout.tsx` の `meta keywords` に
`"新潟 システム開発"` が入っていることを根拠に挙げていたが、`meta keywords` は Google の
ランキング要因としてほぼ機能しないため根拠から外した。また「同一サイト内カニバリ」という表現も、
実態は「2URLが同時に強い」のではなく「`/services/system-dev` が候補URLとして育っておらず、
代表URLとして選ばれていない」状態のため、表現を改めた。

**構造上の問題**: 結果として、問い合わせフォームを持たない `ai.cloudnature.jp` に露出が集中し、
「順位が上がっても商談にならない」構造になっている点は変わらない。

## 5. 確認項目リスト（実装後に検証する）

- [ ] `/services/system-dev` の h1 に「新潟」+「システム開発」が含まれる
- [ ] title が「新潟のシステム開発」で始まる（ai側と同等の前方一致を確保）
- [ ] 可視テキスト量が実測で有意に増えている（対象領域・進め方・費用の考え方・FAQ）
- [ ] 追記した記述に、実績数値・料金・導入企業名の**新規の創作**が無い
- [ ] FAQ 追加分が FAQPage JSON-LD と可視テキストで一致している
- [ ] `/usecases/` 記事から `/services/system-dev` への本文内リンクが増えている
- [ ] `relatedServiceIds` に `"dev"` を追加した記事で、記事下部「関連するサービス」に
      システム開発が出る
- [ ] `npm run build` / `npm run lint -- --max-warnings=0` が通る
- [ ] canonical / noindex / 301 / URL 変更を**一切していない**

## 6. Codex レビュー結果（gpt-5.4 / read-only）

着手前の診断とプランをレビューさせ、以下を反映した。

| # | Codex の指摘 | 反映内容 |
| --- | --- | --- |
| 1 | `meta keywords` を根拠に挙げるのは弱い。Google はほぼ見ていない | §4 の仮説1から keywords を根拠から外し、title 前方一致・トップページ性・内部リンク集中に置き換えた |
| 2 | 「カニバリ」ではなく「代表URL選択で `/services/system-dev` が負けている」が正確 | §4 の表現を修正 |
| 3 | H1 だけ専用化しても中途半端。ページ固有の本文・見出し群まで作るべき | `SYSTEM_DEV_SCOPE`（対応する開発領域6項目）と `SYSTEM_DEV_ENTRY_POINTS`（ご相談の入口3項目）をこのページ専用に新設 |
| 4 | `ImplementationFlow` / `PricingApproach` のそのまま再掲は固有情報が増えず効果は限定的 | `PricingApproach` の再掲は取りやめ。`ImplementationFlow` は直接着地したユーザーへの導線価値があるため残し、代わりに固有セクション2本を主軸にした |
| 5 | FAQ 追加は慎重に。既存 `SYSTEM_DEV_FAQ` に価格目安・即日訪問など強い事実主張があり、面積を広げやすい | SEO目的の地域FAQ増設はやめ、実際の商談障壁に絞って2件のみ追加（いずれも既存の公開情報の範囲内で、新しい事実主張なし） |
| 6 | 効きやすい順は title/H1/固有本文 > 本文内リンク > relatedServiceIds > FAQ | この優先順で実装した |
| 7 | 完全一致アンカー `新潟のシステム開発` は1〜2本まで。残りは分散 | 完全一致は1本のみ。他は「システム開発」「業務システム開発」「業務に合うシステム開発」に分散 |
| 8 | title 変更リスクは中だが、現状主着地でないため取りに行く価値が上回る。ただし `業務システム`・`既存システム連携` は後半に残すこと | 主KWを前方に出しつつ後半に両方を残した |
| 9 | ローカルSEOの事業者シグナルが薄い（`app/layout.tsx` の `sameAs` が空、GBP未整備） | §8 の「人間が判断すべきこと」に追加 |
| 10 | クロスドメイン canonical は非推奨（ページ内容が重複ではないため） | §8 で「採用しない案」として明記 |

## 7. 実装結果（2026-08-12）

ブランチ: `seo/system-dev-local-intent`（未マージ・未デプロイ）

### 7-1. `/services/system-dev` の強化

| ファイル | 変更 |
| --- | --- |
| `content/common.ts` | `PAGE_META.servicesSystemDev.title` を「新潟のシステム開発会社｜業務システム・既存システム連携 \| 株式会社クラウドネイチャー」に変更。description の先頭に「新潟のシステム開発会社。」を追加 |
| `content/services.ts` | `SYSTEM_DEV_HERO`（H1・リード文）、`SYSTEM_DEV_SCOPE`（6項目）、`SYSTEM_DEV_ENTRY_POINTS`（3項目）を新設。`SYSTEM_DEV_FAQ` に1件追加 |
| `components/services/ServiceCardGrid.tsx` | 新規。見出し+説明カードを並べるセクション（同ページ内で2回使用） |
| `types/services.ts` | `ServiceScopeItem` 型を追加（content と component で共有） |
| `app/services/system-dev/page.tsx` | H1 を `SYSTEM_DEV_HERO` に差し替え、`ServiceCardGrid`×2 と `ImplementationFlow` を追加 |
| `app/sitemap.ts` | `/services/system-dev` の `lastModified` を 2026-08-12 に更新 |

`service.title`（=「システム開発」）は変更していない。ナビ・パンくず・`Service` JSON-LD の `name`・
関連リンクのラベルで共有されているため。

### 7-2. 内部リンク

`/usecases/` 記事の本文内に `/services/system-dev` へのコンテキストリンクを7箇所追加（追加前は本文内1箇所のみ）。

| 記事 | 箇所 | アンカーテキスト |
| --- | --- | --- |
| `niigata-ai-development-company-guide` | まとめの締め | **新潟のシステム開発**（完全一致・全体で1本のみ） |
| `niigata-ai-development-company-guide` | 冒頭のサービス切り分け（既存） | システム開発 |
| `niigata-fde-shared-ai-development` | 提供サービスの列挙 | システム開発 |
| `ai-development-bottleneck-shift` | まとめの締め | 業務システム開発 |
| `niigata-ai-subsidy-guide-2026` | FAQ「自社用の業務システム」 | 業務システム開発 |
| `niigata-ai-subsidy-guide-2026` | 相談セクションのサービス列挙 | システム開発 |
| `business-automation-small-start` | 末尾の相談導線 | 業務システム開発 |
| `ai-poc-method-cost-kpi` | 本開発移行の相談導線 | システム開発 |
| `ai-task-allocation` | 次のステップのリスト | 業務に合うシステム開発 |

`relatedServiceIds` に `"dev"` を追加（記事下部「関連するサービス」に露出）:
`business-automation-small-start` / `ai-poc-method-cost-kpi` / `niigata-ai-subsidy-guide-2026` / `ai-task-allocation`。
システム開発との関連が薄い `ai-installation-failure` / `ai-auto-sales-delivery` には追加していない。

### 7-3. 確認項目の結果

| 項目 | 結果 |
| --- | --- |
| H1 に「新潟」+「システム開発」 | ✅ `新潟のシステム開発` |
| title が「新潟のシステム開発」で始まる | ✅ |
| 可視テキスト量 | ✅ 約1,448 → **約2,866文字**（+98%）※ビルド済みHTML実測 |
| 「新潟」出現数 | ✅ 4 → 8 |
| 「システム開発」出現数 | ✅ 4 → 7 |
| 新規の事実創作なし | ✅ 実績数値・料金・導入企業名の新規記述なし。追記内容はすべて既存の公開コンテンツの範囲 |
| FAQ と FAQPage JSON-LD の一致 | ✅ 同一の `SYSTEM_DEV_FAQ` を両方に渡している |
| 記事からの本文内リンク | ✅ 1 → 8箇所（本文内）+ 関連サービス欄 |
| `npm run build` | ✅ 成功（8+ルート、静的生成） |
| `npx eslint --max-warnings=0`（変更ファイル） | ✅ No issues found |
| ブラウザ実機確認 | ✅ `next start` + Chrome でデスクトップ表示を確認（グリッド・タイムラインとも正常） |
| canonical / noindex / 301 / URL 変更 | ✅ 一切していない |
| `ai.cloudnature.jp`（`estimate/`）の変更 | ✅ 一切していない |

### 7-4. `/simplify` レビュー（4観点の並列レビュー）と対応

| 指摘 | 対応 |
| --- | --- |
| 新セクションが手書きの framer-motion を持ち、共有 `ScrollReveal` の `useReducedMotion` と `data-reveal`（JS無効時の表示解除）を両方スキップしていた | **修正**。`ScrollReveal` でラップし、コンポーネント自体を `"use client"` からサーバーコンポーネントへ変更 |
| `columns` prop が全呼び出し元で未使用（デッドコード）。`(index % 3)` のstagger計算も3列前提のハードコード | **修正**。prop ごと削除 |
| `bgClass` prop は常に既定値と同じ `bg-white`。加えてカードの `bg-white/70` は `bg-mist` 上のカードからのコピーで、白背景上では意味がない | **修正**。prop を削除し、カードを `bg-white border-forest/10` に変更 |
| `{title; description}` 型が4箇所で重複宣言 | **修正**。`types/services.ts` に `ServiceScopeItem` を追加して共有 |
| `SYSTEM_DEV_PAGE = { h1, lead }` はコードベース唯一の命名。他のページコピーは全て `{ eyebrow, title, description }` | **修正**。`SYSTEM_DEV_HERO` にリネームし形を統一 |
| コンポーネント名 `ServiceScope` が用途の片方（対応領域）しか表していない | **修正**。`ServiceCardGrid` にリネーム |
| 新規セクションとFAQで同じ主張が2〜3回繰り返されている（保守条件・SaaS一覧・スモールスタート） | **修正**。カードから重複部分を削り「詳細はFAQ」に集約。重複していた新規FAQ1件を削除（追加は2件→1件） |
| `ServiceDetail` に `pageH1`/`pageLead` を追加して3サービスページで共通化すべき（reuse観点） | **見送り**。altitude観点のレビューが逆の結論を出しており、そちらの根拠（`/services` 自身を含む全ページが個別の `*_HERO` 定数を持つ既存慣習。共通化するとナビ・JSON-LD・`SERVICE_PAGE_MAP` の3消費者に「どちらのtitleか」の曖昧さが入る）の方が実コードに即しているため |
| `PricingApproach` を新コンポーネント経由に統合すべき | **見送り**。今回の差分の範囲外で、既存ページの見た目に影響するため |
| `ServiceCardGrid` を `components/shared/` へ移すべき | **見送り**。現状の利用はサービス詳細ページのみで、`components/services/` の分類に合致 |

### 7-5. 実装中に観測した既存の論点（今回は未対応）

- `ImplementationFlow` はデスクトップ用タイムラインとモバイル用リストを両方DOMに出すため、
  同じ h3 が2組出力される。`/services` で既にそうなっている既存挙動であり、今回の追加で
  新たに発生した問題ではない。修正すると `/services` にも影響するため範囲外とした。

## 8. 人間が判断すべきこと（実装していない・提案のみ）

§ 別掲。完了報告の「経営判断が必要な論点」を参照。
