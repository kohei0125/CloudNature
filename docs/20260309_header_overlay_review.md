# ヘッダーオーバーレイ リロード時ロゴ黒化問題 — 根本原因分析と修正

## 検証目的

本番環境（Vercel SSG）でのみ、トップページリロード時にヘッダーロゴが黒になる問題の根本原因特定と恒久修正。

## 対象範囲

- `components/shared/Header.tsx`
- `components/shared/HeaderWrapper.tsx`

## 根本原因

### 診断結果

診断ログにより以下が判明:
- **全ての React render**: `isHeroOverlay=true`, `logoSrc=cloudnature_white.png`（白）
- **実際の DOM**: `cloudnature.png`（黒）が表示される

→ React は正しく白ロゴを render しているが、**DOM の `<img src>` が更新されていない**

### 原因: React hydration の img src スキップ

React 18 は hydration 時に `<img>` の `src` 属性の差分を**意図的にスキップ**する。画像の再読み込みによるフリッカーを避けるため。

#### 発生シナリオ
1. ユーザーが `/philosophy` 等を閲覧（SSG HTML に黒ロゴ `cloudnature.png`）
2. クライアントサイドナビゲーションで `/` に遷移（React が白ロゴを render → DOM 更新される）
3. ページをリロード（Cmd+R）
4. ブラウザが新しい HTML を取得... しかし **bfcache やブラウザの最適化** により、前回の DOM が一部残る場合がある
5. React hydration 時に `<img src>` の差分をスキップ → 黒ロゴが DOM に残る

### v1〜v6 が全て失敗した理由

全てのアプローチが `isHeroOverlay` の state 管理（計測タイミング）を改善する方向だったが、**state は常に正しかった**。問題は React が正しい state を DOM に反映しない（img src をスキップする）点にあった。

## 修正内容

### Header.tsx — ロゴの二重レンダリング + CSS opacity 切り替え

`src` 属性の動的変更を完全廃止。白ロゴ・黒ロゴの両方を常に DOM に配置し、CSS `opacity` で表示切り替え。

- 白ロゴ: `opacity-100` / `opacity-0`（isHeroOverlay に応じて）
- 黒ロゴ: `opacity-0` / `opacity-100`（逆）、`absolute` 配置で重ねる
- `transition-opacity duration-300` でスムーズなクロスフェード
- 白ロゴのみ `priority`（LCP 最適化）、黒ロゴは通常ロード
- a11y: 黒ロゴは `alt=""` + `aria-hidden` で重複読み上げ防止

### HeaderWrapper.tsx — IntersectionObserver（維持）

IO ベースの境界検出は正しく動作しているためそのまま維持。

## Codex レビュー結果

- デュアル画像レイアウト: 正しく構成 ✅
- a11y: 問題なし ✅
- パフォーマンス: 非表示側ロゴから `priority` 削除済み ✅
- トランジション: `opacity + duration-300` で自然 ✅

## 確認項目

- [x] `npm run build` 成功
- [ ] ローカルでトップリロード → 白ロゴ維持
- [ ] スクロール途中でリロード → 適切なロゴ表示
- [ ] スクロールでヒーロー通過 → 黒ロゴ切り替え（クロスフェード）
- [ ] 他ページ → ホーム遷移（SPA）→ 白ロゴ表示
- [ ] Vercel デプロイ後、スマホ実機で確認
