# トップSERVICEセクションのリード文を削除し、/services/system-dev のH1をサービス名に戻す

`content/home.ts` の `SERVICES_SECTION.lead`（見出し直下のリード文と `/services/system-dev` への文脈内リンク）を削除する。あわせて `/services/system-dev` のH1を「新潟のシステム開発会社」から「システム開発」に変更する。

## Status

accepted（2026-08-23）

ADR 0002 が追加した `SERVICES_SECTION.lead` を撤回する。ADR 0003 は「`SERVICES_SECTION.lead` は変更しない（スコープ外）」と明記していたが、本ADRでその判断を更新する。ADR 0003 が守った `/services/system-dev` の **title・description は本ADRでも変更しない**（変更するのは可視のH1のみ）。

## Context

- `SERVICES_SECTION.lead` は本文そのものではなく、「新潟のシステム開発」というアンカーテキスト付きの内部リンクをトップに置くための器として ADR 0002（2026-08-16、`41126be`）で新設された。
- その前提であるトップの「システム開発」軸は、6日後の ADR 0003（2026-08-22）で「AI開発・AI導入支援」軸へ戻され、すでに撤回されている。
- リード文の1文目「受発注・在庫・勤怠などの業務システムから〜」は直下のシステム開発カードの説明と内容が重複し、2文目はセクションヘッダーの「すべてのサービスを見る」CTAと役割が重なっていた。
- `/services/system-dev` のH1「新潟のシステム開発会社」は、他のサービス詳細ページ（/services/ai-agent =「AIエージェント開発」、/services/ai-support =「法人向けAI導入支援」）がサービス名をそのままH1に出しているのと不揃いで、詳細ページを開いたユーザーには会社紹介ページのような見出しに読める。

## Decision

- `content/home.ts` の `SERVICES_SECTION.lead` を削除し、`components/home/ServicesSection.tsx` の描画箇所（および未使用になる `SmartLink` の import）も削除する。
- `content/services.ts` の `SYSTEM_DEV_HERO.title` を「システム開発」に変更する。地域名を含む語はページのH1ではなく title / description が担当する、という役割分担にする。

### 変更しないもの

- `PAGE_META.servicesSystemDev` の title・description（「新潟のシステム開発会社｜…」）。`/services/system-dev` は引き続き「新潟 システム開発」系クエリのOwnerであり、この語を手放す判断ではない（ADR 0003 と同じ扱い）。
- グローバルナビ・`llms.txt`・各 usecases 記事から `/services/system-dev` への内部リンク。トップからの導線もサービスカード経由で残る。

## Consequences

- トップから `/services/system-dev` へ渡していた、アンカーテキストを制御できる唯一の内部リンクが無くなる。カードのリンクはカード全体が `<a>` のためアンカーテキストを制御できない。ただし設置から1週間（2026-08-16〜08-23）で効果測定期間には達しておらず、失う実測値は無い。
- H1と `<title>` が別の語（「システム開発」/「新潟のシステム開発会社｜…」）になる。SERPのスニペットは title 側が担うため検索面の対応は維持されるが、次に `/services/system-dev` のSEOを見直す際は、この不一致を許容し続けるかを再確認すること。
