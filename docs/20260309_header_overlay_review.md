# ヘッダーオーバーレイ リロード時ロゴ黒化問題 — 根本原因分析と修正

## 検証目的

本番環境（Vercel SSG）でのみ、トップページリロード時にヘッダーロゴが黒になる問題の根本原因特定と恒久修正。

## 対象範囲

- `components/shared/Header.tsx`
- `components/shared/HeaderWrapper.tsx`

## 根本原因

### Vercel SSG の HTML 出力が不定

Vercel の SSG ビルドでは、ルートレイアウト内の `usePathname()` が期待通りの値を返さない場合がある。これにより `isHome=false` → `isHeroOverlay=false` でレンダーされ、**SSG HTML のロゴ opacity がローカルビルドと逆転**する。

### v1〜v7 が失敗した理由

| バージョン | アプローチ | 失敗理由 |
|---|---|---|
| v1〜v5 | `isHeroOverlay` の計測タイミング改善 | state は正しかった。問題は DOM 反映 |
| v6 | 二重画像 + Tailwind className opacity | SSG HTML の className が逆。hydration が className を確実にパッチしない |
| v7 | 二重画像 + inline style opacity | SSG HTML の inline style が逆。hydration が style も確実にパッチしない |

**共通の失敗パターン**: 全て「SSG HTML を正しくする」か「hydration で DOM をパッチする」前提だったが、Vercel SSG の出力が制御不能なため破綻。

## 最終修正（v8）— mounted パターン

### 方針: SSG HTML に依存しない

SSG の出力を信頼せず、**サーバーとクライアントの初回レンダーを強制的に一致**させる。

### Header.tsx

```tsx
const [mounted, setMounted] = useState(false);
useEffect(() => setMounted(true), []);

// SSG: 常に白ロゴ表示（mounted=false → heroMode=true）
// クライアント: isHeroOverlay に従う
const heroMode = mounted ? isHeroOverlay : true;
```

- `mounted=false`（SSG + クライアント初回レンダー）: **全ページで白ロゴ表示**
- `mounted=true`（useEffect 後）: `isHeroOverlay` に従って正しいロゴ表示
- hydration ミスマッチが**構造的に発生しない**（サーバー・クライアント初回が同一出力）

### 副作用

- 非ホームページ: JS 実行まで一瞬白ロゴが見える → ヘッダーが透明背景のため実質不可視

### HeaderWrapper.tsx

スクロールベースの `isHeroOverlay` 判定はそのまま維持。シンプルな scroll イベントハンドラで `data-hero-dark-end` boundary を監視。

## 確認項目

- [x] `npm run build` 成功
- [x] ローカルでトップリロード → 白ロゴ維持
- [x] スクロールでヒーロー通過 → 黒ロゴ切り替え（クロスフェード）
- [x] Vercel デプロイ後、本番で確認 → **解決**
