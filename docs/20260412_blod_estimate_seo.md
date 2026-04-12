# ai.cloudnature.jp SEO実装設計書

> **目的**：ai.cloudnature.jp の title/meta 最適化と構造化データ実装
> **技術スタック**：Next.js App Router（`estimate/app/` ディレクトリ）
> **対象ページ**：`/`（トップ）、`/chat`（シミュレーター本体）
> **対象キーワード**：システム見積もり, ツール見積もり, AI導入, 新潟, 安い

---

## 1. title / meta description の最適化

### 1-1. トップページ（ `/` ）

**現状：**
```
AI見積もりシミュレーター｜システム開発費を最短1分で自動算出
```

**変更後：**

```tsx
// estimate/app/layout.tsx の metadata export を変更

const isProduction = process.env.NEXT_PUBLIC_ENV === "production";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "新潟のシステム開発・AI導入見積もり｜最短1分で自動算出【CloudNature】",
    template: "%s | CloudNature AI見積もり",
  },
  description:
    "新潟の中小企業向けにAIを活用したシステム開発を提供。AI見積もりシミュレーターで、Webアプリ・AIエージェント・業務自動化の概算費用を最短1分で無料算出。従来の相場の1/2のコスト感で、補助金活用のご提案も可能です。",
  // ※ meta keywords は Google のランキングに使用されない（2009年公式発表）。
  //    SEO効果は期待せず、他検索エンジン向けの補助情報として残す。
  keywords: [
    "AI見積もり",
    "AI導入",
    "システム開発 見積もり",
    "見積もりツール",
    "開発コスト シミュレーター",
    "ソフトウェア開発 費用",
    "AIエージェント 開発",
    "新潟 システム開発",
    "CloudNature",
  ],
  openGraph: {
    title: "新潟のシステム開発・AI導入見積もり｜最短1分で自動算出【CloudNature】",
    description:
      "新潟の中小企業向けAI見積もりシミュレーター。Webアプリ・AIエージェント・業務自動化の概算費用を最短1分で無料算出。",
    url: SITE_URL,
    siteName: "CloudNature AI見積もり",
    locale: "ja_JP",
    type: "website",
    images: [
      {
        url: "/images/og-img.jpg",
        width: 1200,
        height: 630,
        alt: "CloudNature AI見積もりシミュレーター",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "新潟のシステム開発・AI導入見積もり｜最短1分で自動算出",
    description:
      "新潟の中小企業向けAI見積もりシミュレーター。概算費用を最短1分で無料算出。",
    images: ["/images/og-img.jpg"],
  },
  alternates: {
    canonical: SITE_URL,
  },
  // 非本番環境のみ noindex（本番では robots 指定なし = index, follow がデフォルト）
  ...(!isProduction && {
    robots: { index: false, follow: false },
  }),
};
```

**設計意図：**
- title の先頭に「新潟」を配置 → 地域キーワードの最重要シグナル
- 「システム開発」「AI導入」「見積もり」の3大検索意図をカバー
- 【CloudNature】でブランド名を末尾に（指名検索のCTR向上）
- description に「中小企業」「Webアプリ」「AIエージェント」「業務自動化」「補助金」を自然に含める
- 文字数：title 34文字（PC表示30〜35文字に収まる）、description 120文字以内
- `meta keywords` は Google ランキングに不使用だが、他エンジン向け補助情報として設定

**重要：キーワードの可視テキストへの反映**

`meta keywords` だけでは Google 対策にならない。以下の可視テキスト（H1/H2）への反映が必須：

| キーワード | 反映先 | 対応 |
|---|---|---|
| システム見積もり | H1（既存） | 対応済み |
| AI導入 | H2 or サブコピー | `estimate/content/estimate.ts` に追記が必要 |
| 新潟 | H1 or ヒーロー下テキスト | `estimate/content/estimate.ts` の hero セクションに「新潟」を追記 |
| 安い | H2（既存「安くて正確」） | 対応済み |
| ツール見積もり / 見積もりツール | H2 or セクション見出し | 「見積もりツール」をページ内テキストに追記 |

→ `/` は「新潟 × AI導入 × システム見積もり」、`/chat` は「見積もりツール × 無料」に役割分担する。

---

### 1-2. チャット（シミュレーター本体）ページ（ `/chat` ）

```tsx
// estimate/app/chat/layout.tsx の metadata export を変更

export const metadata: Metadata = {
  // title.absolute を使い、親 layout の template 継承を回避する
  // （template 継承すると「...【CloudNature】 | CloudNature AI見積もり」と二重になるため）
  title: {
    absolute: "AI見積もりツール｜無料でシステム開発費を自動算出【CloudNature】",
  },
  description:
    "AIが質問に沿ってヒアリングし、システム開発の概算見積もり・開発計画書を最短1分で自動生成。営業電話なし・完全無料。新潟県の中小企業のAI導入・業務自動化をサポートします。",
  // 親 layout の OG/Twitter は shallow merge で消失するため、子側で明示的に再設定する
  openGraph: {
    title: "AI見積もりツール｜無料でシステム開発費を自動算出【CloudNature】",
    description:
      "質問に答えるだけで、AIがシステム開発の概算見積もりを自動生成。",
    url: `${SITE_URL}/chat`,
    siteName: "CloudNature AI見積もり",
    locale: "ja_JP",
    type: "website",
    images: [
      {
        url: "/images/og-img.jpg",
        width: 1200,
        height: 630,
        alt: "CloudNature AI見積もりシミュレーター",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "AI見積もりツール｜無料でシステム開発費を自動算出【CloudNature】",
    description:
      "質問に答えるだけで、AIがシステム開発の概算見積もりを自動生成。",
    images: ["/images/og-img.jpg"],
  },
  alternates: {
    canonical: `${SITE_URL}/chat`,
  },
};
```

**設計意図：**
- `/chat` は現在 index されており、`sitemap.ts` にも priority 0.8 で登録済み。この方針を維持する
- `title.absolute` を使用して親 template の `%s | CloudNature AI見積もり` 継承を回避（二重ブランド名防止）
- OG/Twitter は Next.js の shallow merge により親設定が消失するため、`images`, `card`, `siteName` 等を子側で明示的に再設定
- title に「見積もりツール」を含め、`/` との keyword 役割分担を実現

---

## 2. 構造化データの実装

### 2-1. 実装方針

現在の `estimate/app/page.tsx` では `next/script` の `Script` コンポーネントで構造化データを配置しているが、Next.js 公式ガイドでは `<script>` タグ直書き + `JSON.stringify` が推奨されている。

本改修では **Next.js 推奨パターン** に移行する：

```tsx
// 推奨: <script> タグ直書き（XSS対策のエスケープ付き）
<script
  type="application/ld+json"
  dangerouslySetInnerHTML={{
    __html: JSON.stringify(data).replace(/</g, "\\u003c"),
  }}
/>
```

参考: https://nextjs.org/docs/app/guides/json-ld

### 2-2. トップページに配置する構造化データ

現在の `estimate/app/page.tsx` には Organization, WebApplication, HowTo, FAQPage の4つが実装済み。
本改修では以下の変更を行う：

- **Organization**: 既存を更新（`areaServed`, `sameAs` を追加）
- **WebApplication**: 既存を更新（`description` にキーワード追加、`featureList` 追加）
  - ※ `aggregateRating` / `review` がないため Google の software-app リッチリザルト要件は未達。セマンティック情報としてのみ機能する
- **HowTo**: スコープを「AI見積もりの使い方」に変更し、`totalTime` を修正
  - 現状の `PT1M` は「AI見積もり→詳細ヒアリング→開発→納品」の全体に対して不自然
  - AI見積もり操作のステップのみに絞り、`totalTime: PT1M` と整合させる
- **FAQPage**: 既存を維持（FAQ項目の追加に伴い自動反映）
  - ※ Google は現在 FAQ リッチリザルトを権威サイト（政府・医療系）に限定しているため、商用 LP では表示されない。セマンティック情報としてのみ機能する
- **LocalBusiness**: 新規追加（地域SEO強化）
  - `ProfessionalService` は schema.org 上で deprecated note があるため、`LocalBusiness` を採用
- ~~BreadcrumbList~~: 追加しない
  - クロスドメイン（`cloudnature.jp` → `ai.cloudnature.jp`）のパンくずはサイト階層を正しく表さないため

```tsx
// estimate/app/page.tsx — <script> 直書きパターンに移行

// --- 1. Organization（既存を更新） ---
const organization = {
  "@context": "https://schema.org",
  "@type": "Organization",
  "@id": "https://cloudnature.jp/#organization",
  name: "株式会社クラウドネイチャー",
  alternateName: "CloudNature Co., Ltd.",
  url: "https://cloudnature.jp",
  logo: "https://cloudnature.jp/images/logo.png",
  description:
    "新潟の中小企業向けにAI導入支援、AIエージェント開発、システム開発を提供する伴走型パートナー。",
  address: {
    "@type": "PostalAddress",
    postalCode: "951-8068",
    addressLocality: "新潟市中央区",
    streetAddress: "上大川前通七番町1230番地7 ストークビル鏡橋 7F",
    addressRegion: "新潟県",
    addressCountry: "JP",
  },
  areaServed: {
    "@type": "State",
    name: "新潟県",
  },
  sameAs: [
    "https://niigata-ai-academy.com",
    // SNSアカウントがあれば追加
  ],
};

// --- 2. WebApplication（既存を更新） ---
const webApplication = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "CloudNature AI見積もりシミュレーター",
  url: "https://ai.cloudnature.jp",
  description:
    "AIエージェントがシステム開発の要件をヒアリングし、概算見積もりと開発計画書を最短1分で自動生成する無料ツール。新潟県の中小企業のAI導入・業務自動化を支援。",
  applicationCategory: "BusinessApplication",
  operatingSystem: "Web",
  offers: {
    "@type": "Offer",
    price: "0",
    priceCurrency: "JPY",
    description: "無料でご利用いただけます",
  },
  featureList: [
    "AIによる自動見積もり生成",
    "開発計画書の自動作成",
    "Webアプリ・AIエージェント・業務自動化に対応",
    "概算費用の即時算出",
  ],
  creator: {
    "@id": "https://cloudnature.jp/#organization",
  },
};

// --- 3. HowTo（スコープを「AI見積もりの使い方」に変更） ---
const howTo = {
  "@context": "https://schema.org",
  "@type": "HowTo",
  name: "AI見積もりシミュレーターの使い方",
  description:
    "AIチャットに質問形式で答えるだけで、システム開発の概算見積もりを自動生成できます。",
  totalTime: "PT1M",
  step: [
    {
      "@type": "HowToStep",
      position: 1,
      name: "見積もりを開始",
      text: "「無料で見積もりを始める」ボタンをクリックしてAIチャットを開始します。",
    },
    {
      "@type": "HowToStep",
      position: 2,
      name: "質問に回答",
      text: "AIの質問に答えていくだけで、要件が自動的に整理されます。",
    },
    {
      "@type": "HowToStep",
      position: 3,
      name: "見積もり結果を確認",
      text: "概算見積もり・WBS・機能一覧が自動生成されます。",
    },
  ],
};

// --- 4. FAQPage（既存のまま維持） ---
// LP_COPY.faq.items から動的生成。FAQ項目の追加は estimate/content/estimate.ts で行う
// ※ Google は商用サイトでの FAQ リッチリザルト表示を制限しているため、
//    リッチスニペットは期待せず、セマンティック情報としてのみ機能する

// --- 5. LocalBusiness（新規追加） ---
// ※ ProfessionalService は schema.org で deprecated note があるため LocalBusiness を使用
const localBusiness = {
  "@context": "https://schema.org",
  "@type": "LocalBusiness",
  name: "CloudNature - AI導入支援・システム開発",
  url: "https://ai.cloudnature.jp",
  image: "/images/og-img.jpg",
  address: {
    "@type": "PostalAddress",
    streetAddress: "上大川前通七番町1230番地7 ストークビル鏡橋 7F",
    addressLocality: "新潟市中央区",
    addressRegion: "新潟県",
    postalCode: "951-8068",
    addressCountry: "JP",
  },
  geo: {
    "@type": "GeoCoordinates",
    latitude: 37.91610,  // ← Googleマップで小数5桁以上の正確な値を取得すること
    longitude: 139.03640, // ← 同上
  },
  areaServed: [
    { "@type": "State", name: "新潟県" },
    { "@type": "City", name: "新潟市" },
    { "@type": "City", name: "長岡市" },
    { "@type": "City", name: "上越市" },
    { "@type": "City", name: "三条市" },
    { "@type": "City", name: "燕市" },
  ],
  priceRange: "$$",
  knowsAbout: [
    "AI導入支援",
    "AIエージェント開発",
    "システム開発",
    "業務自動化",
    "Webアプリケーション開発",
    "n8n",
    "生成AI活用支援",
  ],
  hasOfferCatalog: {
    "@type": "OfferCatalog",
    name: "システム開発サービス",
    itemListElement: [
      {
        "@type": "Offer",
        itemOffered: {
          "@type": "Service",
          name: "AIエージェント開発",
          description: "業務課題に合わせたAIエージェントの企画・開発・導入支援",
        },
      },
      {
        "@type": "Offer",
        itemOffered: {
          "@type": "Service",
          name: "Webアプリケーション開発",
          description: "業務効率化のためのWebアプリ・社内ツールの設計・開発",
        },
      },
      {
        "@type": "Offer",
        itemOffered: {
          "@type": "Service",
          name: "業務自動化",
          description: "n8n・AI活用による業務プロセスの自動化設計・構築",
        },
      },
      {
        "@type": "Offer",
        itemOffered: {
          "@type": "Service",
          name: "AI導入コンサルティング",
          description: "経営課題のヒアリングからAI活用方針の策定、実装支援まで",
        },
      },
    ],
  },
};

// JSX内での配置（<script> 直書き + XSSエスケープ）
<script type="application/ld+json"
  dangerouslySetInnerHTML={{ __html: JSON.stringify(organization).replace(/</g, "\\u003c") }} />
<script type="application/ld+json"
  dangerouslySetInnerHTML={{ __html: JSON.stringify(webApplication).replace(/</g, "\\u003c") }} />
<script type="application/ld+json"
  dangerouslySetInnerHTML={{ __html: JSON.stringify(howTo).replace(/</g, "\\u003c") }} />
{/* FAQPage: LP_COPY.faq.items から動的生成をそのまま維持（配置方法のみ <script> 直書きに変更） */}
<script type="application/ld+json"
  dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusiness).replace(/</g, "\\u003c") }} />
```

---

## 3. 実装チェックリスト

### 実装前

- [ ] OGP画像を差し替える場合は `/public/images/og-img.jpg` を新画像に置き換える（1200x630px推奨）
- [ ] 緯度・経度をGoogleマップで正確に取得する（小数5桁以上。例: `37.91612, 139.03645`）
- [ ] `estimate/content/estimate.ts` の `faq.items` に「新潟県外からも依頼できますか？」「補助金を使ってシステム開発を依頼できますか？」の2項目を追加する
- [ ] `estimate/content/estimate.ts` の hero セクションに「新潟」「AI導入」を可視テキストとして追記する
- [ ] noindex 判定の環境変数を統一する（現在 `layout.tsx` は `NEXT_PUBLIC_ENV`、`robots.ts` は `NODE_ENV` で不整合）

### 実装後

- [ ] Google Search Console でURL検査 → インデックス再リクエスト
- [ ] [Google リッチリザルトテスト](https://search.google.com/test/rich-results) で構造化データを検証
- [ ] [Schema.org Validator](https://validator.schema.org/) でエラーがないか確認
- [ ] OGPプレビュー確認（SNSシェアでの表示）
- [ ] モバイル・PC両方でtitleの表示を確認（検索結果での切れ方）
- [ ] `view-source:https://ai.cloudnature.jp` でmetaタグとJSON-LDが正しく出力されているか確認
- [ ] `/chat` ページの `<title>` が二重ブランド名になっていないか確認

### 継続確認（実装1週間後〜）

- [ ] `site:ai.cloudnature.jp` で検索してtitle/descriptionの表示を確認
- [ ] Google検索で「CloudNature AI見積もり」と検索し、表示を確認
- [ ] 「新潟 システム開発 見積もり」等の対象キーワードでの掲載順位を確認

---

## 4. 備考

### FAQの内容について

構造化データ内のFAQは、**ページ上に実際に表示されているFAQと完全に一致させる必要がある**。現在の実装では `LP_COPY.faq.items`（`estimate/content/estimate.ts`）から動的生成しているため、ページ表示とJSON-LDは自動的に一致する。

Googleは「ページ上に表示されていないFAQを構造化データにだけ記述する」ことをスパムとみなす可能性があるため、「補助金」「新潟県外」の2項目は必ず `estimate/content/estimate.ts` の `faq.items` に追加すること。

**注意**: Google は現在 FAQ リッチリザルト（検索結果でのアコーディオン表示）を権威サイト（政府・医療系）に限定しているため、商用 LP ではリッチスニペットとしての表示は期待しない。ただし、セマンティック情報としてクロール・理解の補助にはなるため、実装自体は有効。

追加するFAQ項目：

```ts
// estimate/content/estimate.ts の faq.items に追加
{
  q: "新潟県外からも依頼できますか？",
  a: "はい、オンラインでのヒアリング・開発に対応しているため、全国からご依頼いただけます。ただし、新潟県内のお客様には対面でのヒアリングも可能で、より密なコミュニケーションでプロジェクトを進められます。",
},
{
  q: "補助金を使ってシステム開発を依頼できますか？",
  a: "はい、IT導入補助金やものづくり補助金、新潟県独自の補助金（NICOの各種支援制度等）を活用した開発に対応しています。補助金の申請サポートも行っており、開発費用の最大2/3をカバーできるケースもあります。",
},
```

### areaServed の都市名について

LocalBusiness の `areaServed` に新潟県の主要都市名を列挙している。これにより「長岡 システム開発」「上越 AI導入」「三条 業務自動化」といった都市名 × サービス名の組み合わせでも Google に地域サービスとして認識されやすくなる。実際に対応可能な地域のみを記載すること。

### canonical の注意

`ai.cloudnature.jp` と `cloudnature.jp` で同一コンテンツが存在しないよう注意する。万が一、同じテキストが両方のサイトに存在する場合は、正規URLとしたい側に canonical を設定する。

### 環境変数の不整合

現在、noindex 判定で2つの環境変数が混在している：
- `estimate/app/layout.tsx`: `NEXT_PUBLIC_ENV === "production"`
- `estimate/app/robots.ts`: `NODE_ENV === "production"`

Vercel デプロイ時に両者が同じ値になるとは限らないため、どちらかに統一すること。

---

## 5. 参考情報

- [Next.js metadata API](https://nextjs.org/docs/app/api-reference/functions/generate-metadata)
- [Next.js JSON-LD ガイド](https://nextjs.org/docs/app/guides/json-ld)
- [Google FAQ 構造化データ](https://developers.google.com/search/docs/appearance/structured-data/faqpage)
- [Google Software App 構造化データ](https://developers.google.com/search/docs/appearance/structured-data/software-app)
- [Google Local Business 構造化データ](https://developers.google.com/search/docs/appearance/structured-data/local-business)
- [Google Title Links](https://developers.google.com/search/docs/appearance/title-link)
- [Google: meta keywords は使用しない](https://developers.google.com/search/blog/2009/09/google-does-not-use-keywords-meta-tag)