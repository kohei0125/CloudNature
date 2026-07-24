# 既知の落とし穴と対処

LP 作成中に実際に踏んで修正した罠。実装前・実装中に必ず確認する。

## 目次
1. Resend v6 は失敗時に例外を投げない（最重要）
2. 日本語の折り返し（word-break）
3. 横スクロール要素が縦にもずれる（overflow）
4. デザイントークンの重複ハードコード
5. Codex レビューのモデル指定
6. `react-hooks/set-state-in-effect` lint
7. 画像 `sizes` 未指定
8. ユーザー提供ファイルの削除

---

## 1. Resend v6 は失敗時に例外を投げない（最重要）

Resend v6 SDK の `emails.send()` は API エラー時も **throw せず** `{ data: null, error }` を返す。
`try/catch` だけでは失敗を検知できず、フォームが「成功」を返してしまう。

```ts
// route.ts — 送信結果を明示判定するヘルパー
function emailSendError(result: PromiseSettledResult<{ error: unknown }>): unknown {
  if (result.status === "rejected") return result.reason;   // 例外時
  if (result.value?.error) return result.value.error;        // API エラー時（v6 の罠）
  return null;
}
```

`Promise.allSettled` で複数送信（通知メール + 自動返信等）し、各結果を `emailSendError()` で
判定する。**本体コーポレートサイトの `app/api/contact/route.ts` にも同じ潜在バグがある可能性が高い**。

## 2. 日本語の折り返し（word-break）

`app/globals.css` の `body` はグローバルに:

```css
word-break: keep-all;       /* 「ツール」「設計」等の熟語・英単語を途中で割らない */
overflow-wrap: anywhere;    /* 収まらない場合のみ折り返す（break-word は grid/flex 最小幅計算に
                               反映されず、コンテナを押し広げて横はみ出しの原因になる）*/
```

- `overflow-wrap` は **`anywhere`** を使う（`break-word` はモバイルの横はみ出しを誘発する）。
- `keep-all` は熟語を割らない代わりに、句読点の無い長文を文節で折り返せない。文節折り返しを
  したい要素だけ **局所的に** `word-break: auto-phrase;` を当てる:

```css
.check-list li { word-break: auto-phrase; }   /* 「実践的な設計思想」を「設計」で割らせない */
```

- **`auto-phrase` は Safari / Firefox 未対応**。未対応時は無効値として `body` の `keep-all` に
  安全に縮退する。**`body` 全体を `auto-phrase` にしてはいけない**（Safari では `normal` に落ちて
  日本語が 1 文字ずつ改行される。iPhone が主流の国内モバイルで全面崩れ）。局所上書きが正解。
- グリッド/フレックス子要素の横はみ出し対策として `min-width: 0` を併用する。

## 3. 横スクロール要素が縦にもずれる（overflow）

カルーセルや横スクロール表で `overflow-x: auto` だけを指定すると、CSS 仕様上 **`overflow-y` が
`visible` → `auto` に計算され**、縦にもスクロール可能になる。タッチで上下左右にドリフトして
崩れる原因。横スクロール要素には必ず:

```css
.carousel-track {
  overflow-x: auto;
  overflow-y: hidden;              /* 縦スクロールを明示的に無効化（これが肝）*/
  touch-action: pan-x;            /* 縦スワイプはページへ、横だけカルーセルに */
  overscroll-behavior-x: contain; /* ページ本体へのスクロール連鎖（ラバーバンド）を防ぐ */
  scroll-snap-type: x mandatory;
}
```

比較表の `.table-wrap` 等、`overflow-x: auto` を使う**全ての横スクロール要素**に同じ対策を入れる。
モバイル非表示（`display: none`）の要素は対象外でよい。

## 4. デザイントークンの重複ハードコード

同じアクセントカラーを複数セレクタに直書きしない。`:root` にトークンを定義し、
`--accent` のような 1 変数から派生させる:

```css
:root { --accent-green: #2f9e5b; --accent-indigo: #5a63d6; }
.card--green  { --accent: var(--accent-green); }
.dots--green  { --accent: var(--accent-green); }
.dots-num.is-active  { color: var(--accent); }       /* 色別セレクタを 1 本に集約 */
.dots-line.is-active { background: var(--accent); }
```

色別セレクタを N 本書くと変更漏れの温床になる。`/simplify` でも必ず指摘される。

## 5. Codex レビューのモデル指定

`mcp__codex-cli__codex` は ChatGPT アカウント運用のため、`gpt-5.3-codex` 等の codex 専用モデルは
「not supported when using Codex with a ChatGPT account」で失敗する。**モデルは `gpt-5.5`**
（`~/.codex/config.toml` の既定）を指定する。CLAUDE.md はレビューを Codex 対話で行うことを必須と
している。レビューできない場合は `/codex:setup` を試す。

## 6. `react-hooks/set-state-in-effect` lint

`useEffect` 本体で直接 `setState` するとこの lint に引っかかる。UTM パラメータ取得のような
「読み取って使うだけ」の処理は、`useEffect`/`useRef` に載せず、送信時に `readUtmParams()` を
その場で呼ぶ形にする（イベントハンドラ内で読む）。

## 7. 画像 `sizes` 未指定

`next/image` に `width` だけ指定して `sizes` を省くと、DPR ベースの srcset になり、モバイルでも
フル幅 encode を配信してしまう（帯域・LCP 悪化）。実表示幅に合わせた `sizes` を必ず付ける
（technical-conventions.md の画像節参照）。

## 8. ユーザー提供ファイルの削除

`public/images/` にユーザーが置いた元画像（例: `ChatGPT Image ....png`）は、自動モードの分類器が
「明示指定のないユーザー提供ファイルの削除」をブロックすることがある。OG 画像化などで不要に
なっても**勝手に削除せず、削除してよいか確認する**。空白・日本語混じりのファイル名は
リネームして扱う。
