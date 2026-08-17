# TOP ヘッダー登場演出が本番でのみ効かない問題 検証ドキュメント

作成日: 2026-08-17
ブランチ: `fix/header-hero-overlay-hydration`

---

## 1. 検証目的

「ローカルではヘッダーが意図どおり遅れて表示されるが、本番では最初から表示されている」
という報告の原因を特定し、応急処置ではなく根本原因を取り除く。

## 2. 対象範囲

- `components/shared/HeaderWrapper.tsx` / `components/shared/Header.tsx`
- `components/home/HeroSection.tsx`
- `app/globals.css` / `app/layout.tsx` / `tailwind.config.ts` / `lib/hero-motion.ts`

## 3. 確認項目

- [x] 本番のサーバーHTML（JS実行前）で該当クラス・styleが出力されているか
- [x] 実ブラウザのハイドレーション後に React が何を出力しようとしているか
- [x] デプロイ済みコミット・JSバンドル・Next.js のバージョンにズレがないか
- [x] 同一ビルドをローカルの本番サーバで動かした場合の挙動
- [x] 修正後、サーバーHTMLとクライアントの出力が一致するか
- [x] 既存挙動（スクロールで隠れる／影／メニュー展開中の白背景／ルート遷移リセット）の回帰
- [x] `prefers-reduced-motion` が新しいアニメーションにも効くか
- [x] `:has()` 非対応ブラウザでの劣化

---

## 4. 原因（実測で確定）

### 4-1. 事象

`Header.tsx` は `isHeroOverlay`（＝`HeaderWrapper` の `usePathname() === "/"`）を条件に
`animate-hero-appear` クラスと inline style（`animation-delay: 2.45s`）を出し分けていた。

| | ヘッダーの出力 |
| --- | --- |
| ローカル（dev / `next start` とも） | `... animate-hero-appear bg-transparent md:bg-white ...` + `style="animation-delay:2.45s;animation-duration:800ms"` |
| **本番（cloudnature.jp）** | `... bg-white ...`（**クラスも style も無し**） |

つまり本番のサーバー描画時点で `isHeroOverlay = false` になっていた。

### 4-2. なぜ直らないか — React は属性のハイドレーション不一致を修復しない

実ブラウザで DOM 要素の React Fiber を読むと、次のようになっていた。

```
React が求める className : ... transform animate-hero-appear bg-transparent md:bg-white ...
React が求める style     : { animationDelay: "2.45s", animationDuration: "800ms" }
実際の DOM の className  : ... transform bg-white ...
実際の DOM の style      : null
```

クライアントは正しく `true` を計算している（Fiber の `key` も `"/"`）。
しかし **React はハイドレーション時の属性不一致を DOM へ反映し直さない**。
サーバー側の DOM を採用し、Fiber にはクライアント値を記録するため、以降の再レンダリングは
「新 props と memoizedProps は同じ」と判定され、**DOM は永久に直らない**。
クライアントサイド遷移で `/company` → `/` と戻しても直らないことを確認済み。

結果、ヘッダーは `animation: none` / `opacity: 1` となり最初から表示される。
本番では例外も警告も出ないため、無言で壊れ続ける。

### 4-3. 切り分けで否定した仮説

| 仮説 | 結果 |
| --- | --- |
| デプロイが古い | ✕ 本番は `43033bb`（PR #8 マージ）で最新。PR #8 の文言も反映済み |
| JS バンドルが古い | ✕ 配信チャンクに `animate-hero-appear`・`2.45`・正しい条件式が含まれる |
| Next.js のバージョン差 | ✕ `package-lock.json` は 16.1.6 固定・コミット済み。ローカル実物も 16.1.6 |
| CDN キャッシュ | ✕ キャッシュバスター付きでも同じ |
| ビルドモードの差 | ✕ 同一ビルドをローカルで `next start` するとクラスは付く。ISR 再生成後も維持 |
| `usePathname()` が壊れている | ✕ 本番 `/company` は `aria-current="page"` が正しく出る |

**未解明として残った点**: 同じコード・同じ Next バージョンで、Vercel のビルドだけが
`/` のプリレンダーで `false` になる理由。Preview デプロイが Vercel SSO で保護されており
匿名アクセスできず、再現確認に至っていない。

ただし後述のとおり、**根本原因は「なぜ false になったか」ではなく
「クライアントでしか確定しない値がサーバー描画のマークアップを支配していたこと」**であり、
本修正はその依存自体を取り除いている。

### 4-4. 同種バグの再発である

2026-03 にも `isHeroOverlay` が `getBoundingClientRect()` ベースの判定で
「本番 SSG のみ `false`」になる不具合が発生している（[[debugging]]）。
判定方法は変わったが、**ページ固有の状態をレイアウト側のクライアント処理で推測する**
という構造が同じため再発した。

---

## 5. 修正方針

「TOP かどうか」をクライアントフックで推測するのをやめ、
**TOP にしか存在しないヒーロー要素の有無を起点に CSS で表現する**。

| ファイル | 変更 |
| --- | --- |
| `components/home/HeroSection.tsx` | ルート `<section>` に `data-hero-section` を付与 |
| `components/shared/Header.tsx` | `isHeroOverlay` prop を廃止。背景は常に `bg-white`。CSS が必要とするクライアント状態のみ `data-scrolled` / `data-menu-open` として公開 |
| `components/shared/HeaderWrapper.tsx` | `usePathname()` は `key`（ルート遷移時の状態リセット）専用に限定 |
| `app/globals.css` | `@keyframes hero-appear` と `body:has([data-hero-section])` 起点の2規則を追加 |
| `app/layout.tsx` | `<body>` に `--hero-header-delay` を出力（遅延値の単一ソースを維持） |
| `tailwind.config.ts` | 未使用になった `hero-appear` の animation / keyframes を削除 |
| `lib/hero-motion.ts` | `heroHeaderMotion` を削除し、CSS 変数名の定数を追加 |

これにより**ヘッダーのマークアップはルートに依存しなくなり、
ハイドレーション不一致が原理的に起きない**。

---

## 6. 検証結果

### 6-1. ハイドレーション

| ページ | サーバーHTML と React の出力が一致 |
| --- | --- |
| `/` | ✅ 一致（Fiber の `memoizedProps.className` と実DOMが完全一致） |
| `/company` | ✅ 一致 |

`/` と `/company` でヘッダーのマークアップが**完全に同一**になったことを確認
（`class="fixed top-0 ... transform bg-white translate-y-0"`）。

### 6-2. アニメーション（Web Animations API でシークして計測）

| currentTime | opacity |
| --- | --- |
| 0ms | 0 |
| 2449ms | 0 |
| 2450ms（遅延終了） | 0 |
| 2850ms | 0.68 |
| 3250ms（2450+800、終了） | 1 |

適用値は `animation-name: hero-appear` / `delay: 2.45s` / `duration: 0.8s` / `fill: both`。
`duration-300` に上書きされる旧問題も解消（0.8s が適用）。

### 6-3. その他

- `/company` ではヒーローが無く `animation-name: none` / `opacity: 1` ✅
- 透過規則はコンパイル後 CSS で `@media (max-width:767px)` に正しく包まれている ✅
- `prefers-reduced-motion` の既存規則（`*` に `!important`）が新アニメーションにも適用 ✅
- `hero-appear` は opacity のみを動かすため、`translate-y` のスクロール制御を
  `fill: both` が潰さない ✅
- `--hero-header-delay: 2.45s` が `<body>` にサーバー描画で出力されている ✅
- `data-scrolled` は `shadow-sm` と**同一の `isScrolled` state** から出力しており、
  従来から動作している経路と同じ ✅

### 6-4. 環境制約により未実施の検証

自動化タブがバックグラウンド（`visibility: hidden`）になるため React の状態更新が
スロットリングされ、**実ブラウザでのスクロール連動（`data-scrolled` の付与 →
モバイルで背景が白に戻る）の end-to-end 確認だけができていない**。
セレクタの一致・メディアクエリ・state の経路は静的に確認済みだが、
公開前に実機のモバイル幅で以下を目視確認することを推奨する。

1. TOP 最上部でヘッダーが透過し、ヒーローに重なって見えるか
2. スクロールすると白背景 + 影に戻るか
3. ハンバーガーメニューを開くと白背景になるか

## 7. Codex レビュー

実施日: 2026-08-17 / モデル: gpt-5.4

**要修正: なし / 改善候補: なし。**

確認された点（抜粋）:

- `Header` はルート判定を持たず、初期出力に効く可変要素は初期値 false 由来のみで SSR/CSR 一致
- `body:has([data-hero-section]) [data-site-header]` は `.bg-white` や `.duration-300` より
  高詳細度で、`@tailwind utilities` 展開後に書かれているため適用順でも勝つ
  （`node_modules/tailwindcss-animate/index.js` の実装まで確認）
- `animation: hero-appear 800ms ease-out var(--hero-header-delay, 2.45s) both` は
  1つ目の time が duration、2つ目が delay として解釈される正しい記法
- `animate-hero-appear` / `heroHeaderMotion` / 旧 `isHeroOverlay` の残存参照なし
- `:has()` 非対応時はデフォルトの「即時表示・白背景」に落ちるだけでレイアウトは壊れない

---

## 7-2. 追加対応: ヒーローのテキストが上下にカクつく（2026-08-17）

### 報告

「リロードすると、非表示されていた文字の箇所だけ上下の幅がカクついている」

### 調査

**レイアウトシフトは発生していない。**

- `layout-shift` エントリは dev・本番ビルドとも 0件
- ヒーローの高さは常に 712px（`min-height: clamp(560px, 182vw, 820px)` が支配）
- テキスト列は 299px・リード文ブロックは 160px で、静止状態では完全に一定
- Web フォントとフォールバックフォントを強制的に切り替えて比較しても、
  テキスト列の高さ・位置とも差分 0（フォント差し替えによるリフローではない）

### 原因

ヒーロー内のアニメーションのうち、**縦方向に動くのは `hero-rise` だけ**だった。

| アニメーション | 対象 | 動き |
| --- | --- | --- |
| `hero-wipe` | h1・見出し2行 | `clip-path` の横ワイプ（縦には動かない） |
| `hero-zoom-in` | 背景写真 | `scale(1.03) → none` |
| **`hero-rise`** | **リード文ブロック（1箇所のみ）** | **`translateY(8px) → none`** |

リード文が 8px 下から浮き上がるため、**見出しとリード文の間隔が 36px → 28px と
詰まりながら現れる**。これが「文字の箇所だけ上下の幅がカクつく」の正体。

### 対応

`hero-rise` から `transform` を外し、opacity のみのフェードに変更。
縦に動かなくなったため名称も実態に合わせて **`hero-text-in`** へ改名した。

**背景写真の `hero-zoom-in` はユーザー要望により変更しない**（演出として残す）。

検証（Web Animations API でシーク）:

| currentTime | リード文 transform | 見出しとの間隔 | 背景 transform |
| --- | --- | --- | --- |
| 0ms | none | 28px | scale(1.03) |
| 400ms | none | 28px | scale(1.004) |
| 900ms | none | 28px | scale(1.00009) |
| 1550ms 以降 | none | 28px | scale(1) |

リード文は全区間で `transform: none`、見出しとの間隔も一定。背景のズームは維持されている。

### 経緯（記録）

初回は背景の `hero-zoom-in`（1.2秒かけて scale(1.03) → none）を原因と判断して
opacity のみに変更したが、これは誤りだった。ユーザーから「背景のアニメーションは
残したい」との指示があり revert 済み。報告の「**文字の箇所だけ**」という限定を
正しく読めば、縦に動く唯一の要素であるリード文に絞り込めた。

## 8. 公開時にユーザーへ見え方が変わる点

本修正は**本番の見た目を2点変える**（いずれも本来の設計意図どおりに戻すもの）。

1. **TOP でヘッダーが約2.45秒遅れて現れるようになる**（現在は最初から表示）
2. **モバイルの TOP 最上部で、ヘッダー背景が白 → 透過になる**
   （スクロール後・メニュー展開中は従来どおり白）
3. **ヒーローのリード文が下から浮き上がらなくなる**（フェードのみ。§7-2）。
   背景写真のズームは従来どおり残る。

2 は今回まで本番で壊れていたことに気づかれていなかった可能性がある。
`isHeroOverlay` が false だったため、透過背景も同時に効いていなかった。
