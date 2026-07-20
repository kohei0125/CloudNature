# エンジニア向けAI開発研修LP 設計書

- 作成日: 2026-07-20
- 対象: `ai-dev/` — AI開発研修（30分無料相談）ランディングページ
- ステータス: 実装済み（`ai-dev/`。旧ディレクトリ名 `training/` から改名）

## 0. 確定した方針

| 項目 | 決定 |
|---|---|
| 公開形態 | **サブドメイン `ai-dev.cloudnature.jp`**（`estimate/`＝ai.cloudnature.jp と同じ独立Vercelプロジェクト方式） |
| 実装 | **Next.js**（既存の静的HTML/CSS/JSをNext.jsへ移植） |
| フォーム送信 | **Resend でメール送信**。本体 `app/api/contact/route.ts` の**Resend送信パターンのみ流用**（Route Handler本体は専用新規実装 → §4.2） |
| 通知先メール | **本体と共用**（`NOTIFY_EMAIL` / `EMAIL_FROM` を本体と同じ設定で使用） |
| Bot対策 | **チャレンジ（Turnstile）は導入しない**。ただしハニーポット＋**レート制限＋入力量制限は必須で残す**（Codex指摘: ハニーポット単体はBot/手動スパムに弱い） |
| ロゴ等の画像 | **本体サイトの画像を流用**（`public/images/` のロゴ・OGP等） |

## 1. 目的・背景

受託開発会社・SIer・SES企業の **経営者 / CTO / 開発責任者** をターゲットに、
「Claude Code / Codex を顧客案件で安全に活用できる開発チームをつくる」ための
**AI開発研修**への **30分無料相談** を獲得する専用LP。

コーポレートサイト本体とは切り離し、単一CV（無料相談申込）に集中させた
独立ランディングページとして、広告等からの単独ランディング先として運用する。

## 2. 実装アーキテクチャ

### 2.1 技術スタック（移行後）

| 項目 | 内容 |
|---|---|
| フレームワーク | **Next.js（App Router）** — `estimate/` と同構成の独立プロジェクト |
| 独立設定 | 専用の `package.json` / `tsconfig.json` / `next.config.mjs` / `tailwind.config.ts` |
| ページ | `ai-dev/app/page.tsx`（RSC・静的マークアップ） |
| スタイル | 既存 `style.css` を `app/globals.css` へ移植（CSS Custom Properties はそのまま活用） |
| フォーム | Client Component（`"use client"`）→ Route Handler へ `fetch` POST |
| メール送信 | `ai-dev/app/api/consultation/route.ts`（Resend） |

### 2.2 静的HTML → Next.js 移植方針

現状の `ai-dev/index.html` は静的マークアップのため、RSCへ素直に移植できる。

- `index.html` の `<body>` 内 → `app/page.tsx`（Server Component）。SVGは `class→className` 等へ機械的変換
- `<head>` のメタ情報 → `app/layout.tsx` の `metadata` API と JSON-LD（`Organization` / `FAQPage` / `WebPage`）
- `assets/css/style.css` → `app/globals.css`
- `assets/js/main.js` の挙動（固定ヘッダー・スクロール出現・UTM引き継ぎ）:
  - スクロール系は小さな Client Component / `useEffect` へ
  - UTM/参照元は送信時にフォーム側で取得して送信ボディに含める
- 画像は §5 の方針で本体サイトの画像を参照

**移植で見落としがちな点（Codex指摘・要対応）**

- **共有ライブラリは複製する**: 別Vercelプロジェクトのため本体の `@/lib/...` を直接参照しない。
  `ai-dev/lib/rate-limit.ts` / `ai-dev/lib/site.ts` / `ai-dev/lib/metadata.ts` として小さく複製する。
- **JSON-LDは `metadata` APIだけでは出力されない**: `estimate/components/shared/JsonLd.tsx` と同様の
  専用コンポーネントを用意し、`JSON.stringify(data).replace(/</g, "\\u003c")` でエスケープ。
  **FAQPageの構造化データは画面上のFAQと完全一致**させる。
- **フォーム送信UX**を定義する: `action="#"` のままにしない。
  pending状態・ボタン `disabled`・二重送信防止・`aria-live` での成功/失敗/429表示・
  送信後のサンクス表示（or `/complete`）・GA4のCVイベント発火まで実装する。
  - GA4のCVイベント名は **`generate_lead`** に固定（測定ID・GTM利用有無は環境変数設定時に確定）。
- **フォント**: `Noto Sans JP` は外部Google Fonts依存にせず、`estimate/` 同様 `next/font/local` を使う
  （ビルド環境での失敗を避ける）。

### 2.3 想定ディレクトリ構成（移行後）

```text
ai-dev/
├── package.json / tsconfig.json / next.config.mjs / tailwind.config.ts
├── app/
│   ├── layout.tsx          （metadata・JSON-LD・フォント）
│   ├── page.tsx            （LP本体・RSC）
│   ├── globals.css         （旧 style.css）
│   ├── components/         （Header/Form 等のClient Component）
│   └── api/
│       └── consultation/route.ts   （Resend送信）
└── public/                 （LP固有画像：talk-seminar.webp / talk-training.png 等）
```

## 3. ページセクション構成（既存踏襲）

1. ヘッダー（固定 / スクロールで境界線・影）
2. Hero — メインコピー＋エディタUI風ビジュアル＋CTA
3. Stats — 実績サマリー（マーキー）
4. Problem — 現場 / 品質・信頼 / 組織・顧客 の3課題
5. Features — 「開発プロセスの設計」訴求＋工程フロー
6. Comparison — 一般的なツール研修との比較表＋CTA
7. Agenda — 相談30分の流れ＋得られること＋相談特典
8. Cases — 講演実績
9. Speaker — 講師紹介（渡邉浩平 / 代表取締役）
10. Application — 相談概要 / FAQ / 申込フォーム
11. Closing — 最終CTA
12. フッター — 本体サイト導線＋商標注記

## 4. フォーム & Resend メール送信設計

本体 `app/api/contact/route.ts` の実装を流用し、研修相談用に調整する。

### 4.1 送信項目（既存フォーム準拠）

| フィールド | name | 必須 | 備考 |
|---|---|---|---|
| お名前 | `name` | ○ | |
| 会社名 | `company` | ○ | |
| メールアドレス | `email` | ○ | 形式バリデーション |
| 役職 | `role` | ○ | |
| ご相談したいこと | `topic` | 任意 | |
| ハニーポット | `website` | — | 入力ありは破棄 |
| 計測 | `utm_source` / `utm_medium` / `utm_campaign` / `page_referrer` | — | hiddenで引き継ぎ |

### 4.2 Route Handler（`app/api/consultation/route.ts`）

> **流用の範囲（Codex指摘・重要）**: 本体 `contact/route.ts` を丸ごとコピーしない。
> 本体は `phone`/`message` 必須・`subject` 検証・Turnstile・Notion保存が前提で、研修LPの
> フォーム項目（`name`/`company`/`email`/`role`/`topic`）と合わない。
> **流用するのは「Resend初期化・環境変数チェック・`Promise.allSettled` の通知優先処理・HTMLエスケープ方針」のみ**。
> Route Handler本体・型・メールテンプレートは **研修LP専用に新規実装**する。

- **Resend送信2通**: ①運用側への通知メール ②申込者への自動返信メール（研修相談用テンプレートを新規作成）
- **サーバー側バリデーション**: 必須項目（`name`/`company`/`email`/`role`）・メール形式・最大文字数
  - 上限値: `name` / `company` / `role` … **100文字**、`email` … **254文字**、`topic` … **2000文字**
  - **JSONボディサイズ上限 32KB**（`request.json()` の前に `Content-Length` / 読み取りサイズで判定）
- **レート制限（必須・削除しない）**:
  - IP単位: `lib/rate-limit` 相当（15分 / 5回。本番のみ）
  - **メールアドレス単位（必須）**: 同一メールからの短時間再送を制限（例: 15分 / 2回）。Turnstile非導入の代替として必須
- **ハニーポット判定**: `website` に入力があれば正常応答を返しつつ破棄
- **クライアント側**: 送信中はボタン `disabled`・二重送信防止（§2.2 参照）
- **通知先/差出人**: 本体と同じ `EMAIL_FROM` / `NOTIFY_EMAIL` を共用（§4.4 の from/reply-to 設計に従う）

### 4.3 必要な環境変数（新規Vercelプロジェクトへ設定）

| 変数 | 用途 |
|---|---|
| `RESEND_API_KEY` | Resend送信（本体と同じ値） |
| `EMAIL_FROM` | 差出人（検証済みドメイン。本体と共用） |
| `NOTIFY_EMAIL` | 運用側の通知先（本体と共用） |
| `NEXT_PUBLIC_ENV`（or `VERCEL_ENV` 判定） | **本番判定に必須**（Codex指摘）。本体 `lib/site.ts` は `NEXT_PUBLIC_ENV === "production"` を見る。未設定だと本番でレート制限が無効化されるため、`NEXT_PUBLIC_ENV=production` を設定するか、Route Handler側で `VERCEL_ENV === "production"` を判定する |

> Notion保存は本LPでは初期スコープ外（必要なら本体パターンを流用して追加）。

### 4.4 from / reply-to・件名設計（Codex指摘）

- **件名を本体問い合わせと区別**: 例 `【CloudNature AI開発研修】無料相談のお申し込み`
- **通知メール（運用側宛）**: `replyTo: 申込者のemail`（そのまま返信できるように）
- **自動返信メール（申込者宛）**: `replyTo: NOTIFY_EMAIL`（運用窓口）
- **本文にLP名・流入UTM（source/medium/campaign/referrer）を含める**（本体問い合わせと取り違えないため）

## 5. 画像（本体サイト流用）

サブドメイン（別プロジェクト）から本体画像を使う方針。本体 `public/images/` に
ロゴ・OGP画像が揃っている。

| 用途 | 流用候補（本体 `public/images/`） |
|---|---|
| ヘッダー/フッターロゴ | `header_logo.png` / `footer_logo.png` / `logo.webp` / `logo_*.webp` |
| JSON-LD `logo` | `logo.png`（現状LPのJSON-LDが参照済み） |
| OGP画像 | `og-image.png` / `og-img.jpg`（現状の `ogp.jpg` 参照を差し替え） |

**配置方針（Codexレビュー2回目で確定）**

- **OGP画像・JSON-LDの `logo`・ヘッダー/フッターロゴ** … 本体 `public/images/` から
  **コピーして `ai-dev/public/images/` に固定配置**する。
  - 理由: これらは公開前ブロッカー（OGPクローラの取得・SEO）に関わり、本体のパス変更・
    削除・キャッシュの影響を受けない自己完結が必要なため。
  - 「本体サイトの画像を流用」という要件は、同一の画像ファイルを複製して使うことで満たす
    （本体でロゴを更新した場合は追従コピーが必要。§7 TODO参照）。
- **その他の画像**（必要が生じた場合のみ） … 本体絶対URL（`https://cloudnature.jp/images/...`）
  参照を許容。`next/image` を使う場合は `next.config.mjs` の `images.remotePatterns` に
  本体ドメインを追加する。
- **LP固有の画像**（`talk-seminar.webp` / `talk-training.png` / `speaker2.svg`）は
  `ai-dev/public/` に配置してプロジェクト内で管理。

## 6. 公開URL・デプロイ設計

- 新規 Vercel プロジェクトを作成、**Root Directory = `ai-dev/`**、Framework = Next.js
- 独自ドメイン `ai-dev.cloudnature.jp` を割り当て
- `estimate/`（ai.cloudnature.jp）の運用パターンを踏襲

**canonical / OGP / robots / sitemap は「公開前ブロッカー（必須）」（Codex指摘で優先度を高へ）**

- 現状HTMLは `https://cloudnature.jp/seminar/ai-dev` を canonical / og:url / og:image に指定 → **誤り**。
- `SITE_URL = "https://ai-dev.cloudnature.jp"` を研修LP内に定義し、
  **canonical・`og:url`・`og:image`・sitemap・robots・JSON-LD(WebPage) のURLを統一**する。
- **Preview環境（`VERCEL_ENV !== "production"`）は noindex** にする（本体 `robots.ts` と同様の分岐）。

## 7. TODO / 要判断

| # | 項目 | 内容 | 優先 | 状態 |
|---|---|---|---|---|
| 1 | Vercelドメイン設定 | `ai-dev.cloudnature.jp`（確定）のDNS/Vercelドメイン割り当て | 高 | 未着手（Vercel側の作業） |
| 2 | Next.js移植 | `index.html`→`page.tsx` / `style.css`→`globals.css` / JS→Client Component | 高 | ✅ 完了 |
| 3 | Resend Route Handler | `app/api/consultation/route.ts` を**専用新規実装**（Resend送信パターンのみ流用） | 高 | ✅ 完了 |
| 4 | メールテンプレート | 研修相談用の通知/自動返信＋from/reply-to設計（§4.4） | 高 | ✅ 完了 |
| 5 | 環境変数設定 | §4.3。**本番判定用 `NEXT_PUBLIC_ENV`/`VERCEL_ENV` を含める** | 高 | ✅ コード対応済み（Vercel側の値設定は未実施） |
| 6 | レート制限・入力量制限 | `lib/rate-limit` 複製・IP制限・最大文字数・ボディサイズ上限（**削除しない**） | 高 | ✅ 完了（IP+メール単位の二重制限） |
| 7 | canonical/OGP/robots/sitemap | 新サブドメインURLへ統一・Preview noindex（**公開前ブロッカー**） | 高 | ✅ 完了 |
| 8 | 共有ライブラリ複製 | `ai-dev/lib/` に `rate-limit`/`site`/`metadata` を複製 | 中 | ✅ 完了 |
| 9 | JSON-LDコンポーネント | `estimate/` 同様の専用コンポーネント。FAQは画面と一致 | 中 | ✅ 完了 |
| 10 | フォーム送信UX | pending/disabled/二重送信防止/`aria-live`/サンクス/GA4 CV | 中 | ✅ 完了 |
| 11 | 画像配置 | OGP/JSON-LD logo/ヘッダー・フッターロゴを本体からコピーし `ai-dev/public/images/` へ固定配置（§5確定）。本体ロゴ更新時は追従コピー | 中 | ✅ 完了 |
| 12 | Webフォント | `Noto Sans JP` を `next/font/local` で読み込み（外部依存回避） | 中 | ✅ 完了 |
| 13 | 計測連携 | UTM引き継ぎ（`utm_content`/`term`/`gclid` 等の拡張要否）＋GA4 | 低 | 基本のUTM4項目＋GA4は実装済み。拡張は未実施 |
| 14 | 講師写真 | `speaker2.svg`（プレースホルダー）を実写真へ / alt文言整合 | 低 | 未着手（プレースホルダーのまま） |
| 15 | 実績数値の裏付け | 「満足度4.0」「延べ100名以上」の根拠・対象期間・集計範囲の注記 | 低 | 未着手 |

## 8. 実装状況（2026-07-20時点）

`ai-dev/` に Next.js（App Router）プロジェクトとして実装済み。`npm run build` / `npm run lint` とも成功、
開発サーバーでのブラウザ実機確認・フォーム送信の実地検証まで完了。

### 実装済みファイル

- 設定: `package.json` / `tsconfig.json` / `next.config.mjs`（`turbopack.root` 指定）/ `postcss.config.mjs` /
  `tailwind.config.ts`（Tailwind自体は不使用。モノレポ上位の設定誤検出を防ぐためのシャドー配置）/ `eslint.config.mjs`
- `app/layout.tsx`（metadata・JSON-LD用フォント・GA4/GTM）、`app/page.tsx`（LP本体）、`app/globals.css`
- `app/api/consultation/route.ts`（Resend送信・バリデーション・二重レート制限・ハニーポット）
- `app/robots.ts` / `app/sitemap.ts`
- `lib/site.ts` / `lib/metadata.ts` / `lib/rate-limit.ts` / `lib/emailTemplates.ts`
- `components/HeaderScrollEffect.tsx` / `ScrollReveal.tsx` / `ConsultationForm.tsx` / `JsonLd.tsx` /
  `GoogleAnalytics.tsx` / `GtmNoscript.tsx`
- `public/images/`（本体ロゴ・OGP画像のコピー＋LP固有画像）、`app/fonts/`（Noto Sans JP woff2）

### 検証で発見・修正した重要な不具合

**Resend SDK（v6）はAPIエラー時にPromiseをrejectしない。** `resend.emails.send()` はエラー時も
fulfilled のまま `{ data: null, error }` を返す仕様（例外を投げない）。ダミーAPIキーで実地検証したところ、
`Promise.allSettled(...).status === "rejected"` のみで判定する実装（本体 `app/api/contact/route.ts` と
同型のパターン）では、この種のAPIエラーを検知できず、実際にはメール未送信のまま `{ success: true }` を
返してしまうことを確認した。`ai-dev/app/api/consultation/route.ts` では
`notifyResult.value.error` も判定するよう修正済み。
**本体 `app/api/contact/route.ts` にも同型の潜在バグがある可能性が高い**（本設計書のスコープ外のため未修正。
別途対応を推奨）。

### 未実施（Vercel側の作業）

- Vercelプロジェクト作成、Root Directory = `ai-dev/` の設定
- ドメイン `ai-dev.cloudnature.jp` の割り当て
- 環境変数の設定（`RESEND_API_KEY` / `EMAIL_FROM` / `NOTIFY_EMAIL` / `NEXT_PUBLIC_ENV=production` 等）
- 本番デプロイ後の実メール送信確認

## 9. Codexレビュー結果と反映（2026-07-20 / gpt-5.5）

CLAUDE.md の規約に従い、実装着手前に Codex と対話レビューを実施。方針
（Next.js独立プロジェクト化・Resend送信）は妥当との評価。以下を設計へ反映済み。

### 重大度 高（本文へ反映済み）

- **本体 `contact/route.ts` の丸コピー禁止** → 「Resend送信パターンのみ流用・Route Handlerは専用新規実装」に修正（§4.2）
- **レート制限は必須で残す**（ハニーポット単体はBot/手動スパムに弱い）。入力量・ボディサイズ制限も追加（§4.2, §0）
- **本番判定の環境変数不足** → `NEXT_PUBLIC_ENV`/`VERCEL_ENV` を必須環境変数に追加（§4.3）。未設定だと本番でレート制限が無効化される
- **canonical/OGP/robots/sitemap を公開前ブロッカー（優先度高）へ格上げ**。`SITE_URL` 統一・Preview noindex（§6）

### 重大度 中（本文へ反映済み）

- 共有ライブラリは `@/lib` 直接参照でなく `ai-dev/lib/` へ複製（§2.2）
- 本体画像の絶対URL参照はパス変更/キャッシュ/OGP取得のリスク → OGP・ロゴは `ai-dev/public/images/` 固定配置を推奨（§5）
- from/reply-to・件名設計を追加（通知は `replyTo:申込者`、自動返信は `replyTo:窓口`、本文にUTM）（§4.4）
- フォーム送信UX（pending/disabled/二重送信防止/`aria-live`/サンクス/GA4）を明記（§2.2）
- JSON-LDは `metadata` API だけでは出力されない → 専用コンポーネント、FAQは画面と一致（§2.2）

### 重大度 低（TODOへ反映）

- UTM拡張（`utm_content`/`utm_term`/`gclid` 等）、`next/font/local`、講師写真alt整合、実績数値の注記（§7 TODO #13–15）

## 10. Codex再レビュー結果と反映（2026-07-20 2回目 / gpt-5.5）

反映後の設計書を再レビュー。**最終判定: 条件付きGO**（重大度高のブロッカーなし）。
前回指摘はすべて本文またはTODOに反映済みと確認。残っていた曖昧さを以下のとおり解消した。

| 指摘（重大度） | 対応 |
|---|---|
| §0の「Resend実装を流用」が§4.2と不整合（中） | §0を「Resend送信パターンのみ流用」に統一 |
| 同一メール連投抑制が「検討」止まり（中） | **必須**へ格上げ（15分/2回の例示。Turnstile非導入の代替） |
| 入力量制限に具体値がない（中） | 上限値を明記: name/company/role 100字・email 254字・topic 2000字・ボディ32KB（`request.json()` 前に判定） |
| 画像方針が二重方針のまま（中） | **決定**: OGP/JSON-LD logo/ヘッダー・フッターロゴは本体からコピーして `ai-dev/public/images/` 固定配置。その他のみ本体絶対URL許容 |
| §4.2の「§2.4参照」が存在しない（低） | §2.2参照に修正 |
| JSON-LD対象が§2.2と§6でずれ（低） | §2.2に `WebPage` を追記して統一 |
| GA4イベント名未定（低） | CVイベント名を `generate_lead` に固定 |

上記の反映をもって、本設計書で実装に着手する。

## 11. ディレクトリ名の変更（2026-07-20）

実装・検証まで完了した後、ディレクトリ名を `training/` から `ai-dev/` に変更した。
サブドメイン・パッケージ名・ドメイン参照も含めて全体を統一している（元の静的LPの
`canonical` が `cloudnature.jp/seminar/ai-dev` だったことに揃える形）。

- ディレクトリ: `training/` → `ai-dev/`（`git mv` で履歴を保持）
- コンテンツファイル: `content/training.tsx` → `content/ai-dev.tsx`
- `CANONICAL_SITE_URL`: `https://training.cloudnature.jp` → `https://ai-dev.cloudnature.jp`
- `package.json` の `name`: `cloudnature-training` → `cloudnature-ai-dev`
- メールテンプレート・GA4コメント内のドメイン参照も同様に更新
- `npm run build` / `npm run lint` とも新しいパスで再検証済み
