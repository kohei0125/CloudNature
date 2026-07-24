# 技術規約・ファイル構成

CloudNature サブドメイン LP（独立 Next.js サブプロジェクト）の技術規約。
**すべて `ai-dev/` が正典**。迷ったら `ai-dev/` の実ファイルを Read すること。

## 目次
- ディレクトリ構成
- 設定ファイル（package.json / tsconfig / next.config）
- スタイリング（Vanilla CSS + design token）
- フォント（セルフホスト）
- 画像
- SEO・メタデータ
- 環境変数
- アナリティクス
- デプロイ

## ディレクトリ構成

`ai-dev/` の構成:

```
<slug>/
├── app/
│   ├── page.tsx            LP 本体（RSC）。マークアップのみ
│   ├── layout.tsx          metadata / JSON-LD / GA / GTM
│   ├── globals.css         Vanilla CSS（design token 定義）
│   ├── api/consultation/route.ts   相談フォーム（Resend）
│   ├── sitemap.ts / robots.ts      SEO ルートハンドラ
│   ├── icon.png / apple-icon.png
│   └── fonts/              セルフホストフォント（.woff2 等）
├── components/             "use client" コンポーネント
│   ├── ConsultationForm.tsx        フォーム UI
│   ├── HeaderScrollEffect.tsx      スクロールでヘッダー変化
│   ├── ScrollReveal.tsx            スクロール表示アニメ
│   ├── GoogleAnalytics.tsx / GtmNoscript.tsx
│   ├── JsonLd.tsx                  構造化データ挿入
│   └── （カルーセル等のページ固有クライアント部品）
├── content/                コピー・データ（.tsx。マークアップと分離）
├── lib/
│   ├── site.ts             CANONICAL_SITE_URL / IS_PRODUCTION / isIndexableDeployment()
│   ├── metadata.ts         SITE_URL / SITE_NAME / OG_IMAGE / MAIN_SITE_URL
│   ├── validation.ts       入力長などの定数
│   ├── rate-limit.ts       IP + メールのレート制限（インメモリ）
│   └── emailTemplates.ts   通知メール本文
├── public/images/          流用画像・OG 画像
├── package.json / tsconfig.json / next.config.mjs / postcss.config.mjs
├── .env.sample
└── eslint 設定
```

`app/page.tsx` は**マークアップのみ**、文言・配列データは `content/*.tsx` に置く。
クライアント挙動（フォーム送信・スクロール監視・カルーセル）だけを `components/` の
`"use client"` に切り出し、それ以外は RSC のまま。

## 設定ファイル

- **package.json**: `name: "cloudnature-<slug>"`。`scripts.dev` は未使用ポート
  （コーポレート 3000 / estimate 3001 / ai-dev 3002 …と重複しない番号）を `next dev --port` で指定。
  `lint` は `eslint . --ext .ts,.tsx --max-warnings=0`。依存は `next` / `react` / `react-dom` /
  `resend` が基本。**Tailwind は使わない**（`postcss.config.mjs` は autoprefixer のみ）。
- **tsconfig.json**: サブプロジェクト独自。パスエイリアス `@/*` は当該サブディレクトリ基準。
- **next.config.mjs**: セキュリティヘッダ（HSTS, X-Content-Type-Options, X-Frame-Options,
  Referrer-Policy, Permissions-Policy）を `headers()` で付与。`turbopack.root` を当該
  サブディレクトリに設定し、モノレポのルート誤検出を防ぐ（これが無いと余計な shadow config が必要になる）。
- **ルート `tsconfig.json`**: `exclude` に新サブディレクトリ名を追加（型チェックは各サブプロジェクト単位）。

## スタイリング（Vanilla CSS）

`app/globals.css` に集約。`:root` に design token（色・radius・shadow・container 幅）を定義し、
コンポーネントは `var(--token)` を参照。**色や間隔を複数箇所にハードコードしない**
（アクセントカラーは `--accent` のような 1 変数から派生させる）。落とし穴は pitfalls.md 参照。

## フォント

`next/font/local` で Noto Sans JP をセルフホスト（`app/fonts/` に .woff2 等を置く）。
`fonts.gstatic.com` への外部依存を排除し、ビルドの安定性とパフォーマンスを確保する。
`next/font/google` は使わない。

## 画像

- `next/image` を使用。`sizes` を必ず指定して、モバイルで実表示より大きい encode を配信しない
  （例: `sizes="(max-width: 767px) 84vw, (max-width: 1023px) 90vw, 380px"`）。
- ロゴ・共通画像は本体コーポレートサイトの画像を流用して `public/images/` に置く。
- OG 画像は **1200×630**。素材が大きい場合は `sips --resampleWidth 1200 <in> --out og-image.png`
  でリサイズ（アスペクト比 1.91:1 ≒ 1200:630。ほぼ同一なので歪まない）。空白・日本語を含む
  ファイル名は ASCII にリネームしてから使う。

## SEO・メタデータ

- `lib/metadata.ts` に `SITE_URL`（= `lib/site.ts` の `CANONICAL_SITE_URL`）、`SITE_NAME`、
  `OG_IMAGE`（url/width/height/alt）、`MAIN_SITE_URL = "https://cloudnature.jp"`。
- `app/layout.tsx` の `metadata` で `metadataBase`、`alternates.canonical`、`openGraph`、
  `twitter` を設定。OG/Twitter の画像は絶対 URL になる。
- JSON-LD は `components/JsonLd.tsx` で挿入。Organization / WebPage / FAQPage を `content/*.tsx`
  に定義して渡す。
- `app/sitemap.ts` / `app/robots.ts`（Next.js ルートハンドラ）。robots は `NODE_ENV` で本番判定。
- 非本番デプロイは `lib/site.ts` の `isIndexableDeployment()` で noindex にする
  （プレビュー環境のインデックスを防ぐ）。

## 環境変数（.env.sample）

```bash
NEXT_PUBLIC_ENV=development         # development / staging / production
RESEND_API_KEY=                     # 本体コーポレートサイトと共通の値
EMAIL_FROM=
NOTIFY_EMAIL=                       # 相談フォームの通知先
NEXT_PUBLIC_GTM_ID=                 # 任意。未設定時は GA4 直タグに切替
NEXT_PUBLIC_GA_ID=                  # 非本番の GA4 測定 ID
```

Vercel 側にも同じ変数を登録する。本番の GA4 測定 ID は共有 ID をコードに固定
（`GoogleAnalytics.tsx` の `SHARED_GA_ID`）。

## アナリティクス

コーポレート / 見積もり / 各 LP は**同一 GA4 プロパティ（共有測定 ID）**を使う。
`components/GoogleAnalytics.tsx` は本番なら共有 ID、非本番なら `NEXT_PUBLIC_GA_ID`。
`NEXT_PUBLIC_GTM_ID` があれば GTM 経由、無ければ GA4 直タグにフォールバック。

## デプロイ

- Vercel に**新規プロジェクト**として作成し、Root Directory = `<slug>/` を指定。`git push` で自動デプロイ。
- サブドメイン（`<slug>.cloudnature.jp`）を Vercel のドメイン設定で割り当てる。
- バックエンド（Cloud Run）や見積もりとは独立。DB も不要（フォームは Resend のみ）。
