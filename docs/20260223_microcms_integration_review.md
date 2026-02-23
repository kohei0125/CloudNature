# microCMS 導入レビュー

## 検証目的

microCMS 連携によるニュース/ブログセクションの実装が、セキュリティ・型安全性・エラーハンドリング・パフォーマンスの観点で問題ないか検証する。

## 対象範囲

### 新規ファイル
- `lib/microcms.ts` — API クライアント
- `types/microcms.ts` — 型定義 + マッピング関数
- `content/news.ts` — ニュースページ静的テキスト
- `components/news/NewsCard.tsx` — 一覧カード
- `components/news/NewsBody.tsx` — リッチエディタ HTML レンダラー（sanitize-html でサニタイズ）
- `app/news/page.tsx` — 一覧ページ
- `app/news/[slug]/page.tsx` — 詳細ページ（contentId ベース）
- `app/api/revalidate/route.ts` — Webhook ISR

### 変更ファイル
- `app/page.tsx` — async 化 + microCMS データ取得
- `components/home/NewsSection.tsx` — props 化 + next/image 移行 + disableLink 対応
- `next.config.mjs` — images.remotePatterns 追加
- `tailwind.config.ts` — typography プラグイン追加
- `content/common.ts` — PAGE_META.news 追加
- `types/index.ts` — microcms re-export 追加
- `app/sitemap.ts` — async 化 + ニュース URL 動的追加
- `.env.sample` — microCMS 環境変数追加

## Codex レビュー結果（1回目）

### [P2] `getAllNewsSlugs` のページネーション未対応
**指摘**: `limit: "100"` の1回取得のみ。101件以上で sitemap・generateStaticParams から漏れる。
**対応**: ✅ ページネーションループで全件取得に修正。

### [P2] フォールバック記事リンクの404化
**指摘**: 一覧はフォールバックで表示されるが、詳細ページは microCMS 不通で notFound()。
**対応**: ✅ `disableLink` props でフォールバック時はリンク無効化。

### [P3] モバイルの「次へ」ボタンが無機能
**指摘**: 右矢印ボタンに onClick がなく、ページインデックスも固定。
**対応**: ✅ 無機能なページャーUIを削除。

## Codex レビュー結果（2回目 — スキーマ修正後）

### [P1] HTML本文の未サニタイズ描画による XSS リスク
**指摘**: `dangerouslySetInnerHTML` で microCMS 由来の HTML をそのまま埋め込み。CMS アカウント侵害時にストアド XSS が成立する。
**対応**: ✅ `sanitize-html` を導入し、許可タグ・属性をホワイトリストで制限。iframe は YouTube/Vimeo のみ許可。

### [P2] ホームのフォールバック時もリンク無効化が必要
**指摘**: `app/page.tsx` の NewsSection でもフォールバック時にリンクが 404 を誘発する。
**対応**: ✅ `NewsSection` に `disableLink` props を追加し、ホーム・一覧の両方でフォールバック時はリンク無効化。

## 確認項目チェック結果

- [x] セキュリティ: sanitize-html で XSS 対策済み。Webhook 認証あり。APIキーはサーバーサイドのみ
- [x] 型安全性: microCMS スキーマに合わせた型定義（MicroCMSCategoryRef 等）
- [x] エラーハンドリング: フォールバック + disableLink で導線の整合性を確保
- [x] パフォーマンス: ISR 60秒、contentId 直接取得、next/image 適切
- [x] SEO: メタデータ・OGP・sitemap・canonical すべて対応。ページネーションで全記事カバー
- [x] コード品質: lint 0 warnings、ビルド成功
