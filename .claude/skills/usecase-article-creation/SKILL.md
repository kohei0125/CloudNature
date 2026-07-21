---
name: usecase-article-creation
description: CloudNature の /usecases 配下に SEO 記事を新規作成するための体系的な手順。資料調査 → 記事ファイル作成 → EEAT 強化 → トーン精査 → スマホ可読性最適化 → 画像最適化 → HTML 属性正規化 → Vercel React/デザイン準拠 → ブラウザ実機確認の順で進める。ブログ記事、ユースケース記事、AI 関連の解説記事を作成・改修する際に使用する。
---

# CloudNature ユースケース記事作成スキル

`app/usecases/` 配下の記事を新規作成・改修する際の標準手順。本スキルは CloudNature プロジェクトの構造・規約・過去の修正履歴を踏まえて体系化されている。

## 全体フロー（15 フェーズ）

```
Phase 0  目標把握 / 資料確認
Phase 1  コードベース構造の把握
Phase 2  記事ファイルの初版作成
Phase 3  index.ts へ登録
Phase 4  型チェック・lint
Phase 5  EEAT 強化
Phase 6  AI 特有トーンの精査
Phase 7  スマホ可読性の最適化
Phase 8  画像準備（ウォーターマーク除去・最適化）
Phase 9  画像の本文組み込み
Phase 10 HTML 属性の正規化
Phase 11 Vercel React / デザインベストプラクティス準拠
Phase 12 ブラウザ実機確認
Phase 13 トラブルシューティング
Phase 14 /simplify によるレビュー
Phase 15 最終チェックリスト
```

---

## Phase 0: 目標把握 / 資料確認

- ターゲットキーワード（主＋副×2〜3）を確定する
- 想定読者像とコンバージョン地点を明確化
- `docs/` 配下にリサーチ資料があれば必読
  - SEO プラン、競合分析、キーワードレポート
  - 既存記事のテンプレート（例: `20260324_usecase_blog_template.md`）
- 既存記事との重複・カニバリを避ける

## Phase 1: コードベース構造の把握

最低でも以下を読み、データ構造と表示パイプラインを把握する。

| ファイル | 把握すべき内容 |
|---|---|
| `types/usecases.ts` または `types/index.ts` | `UseCaseArticle` 型の必須フィールド |
| `content/usecases/_common.ts` | `USECASES_SECTION` / `USECASES_CTA` / `USECASES_DETAIL` |
| `content/usecases/index.ts` | 既存記事の登録順（新着順） |
| `content/usecases/<既存記事>.ts` | HTML 文字列の慣習（`<figure>`/`<figcaption>` 等） |
| `app/usecases/[slug]/page.tsx` | メタデータ・JSON-LD・関連サービスの表示構造 |
| `components/news/NewsBody.tsx` | `sanitize-html` の許可属性、`prose` クラス |
| `lib/related-content.ts` | 関連サービス ID のマスタ |

## Phase 2: 記事ファイルの初版作成

`content/usecases/<slug>.ts` を新規作成。

### `UseCaseArticle` の各フィールド

| フィールド | 規約 |
|---|---|
| `id` | kebab-case のスラグ。URL になる（例: `ai-poc-method-cost-kpi`） |
| `publishedAt` | `"YYYY-MM-DD"` の ISO 形式 |
| `category` | 既存カテゴリと統一（例: `"実践ガイド"`） |
| `relatedServiceIds` | `lib/related-content.ts` の ID（例: `["ai-support", "ai"]`） |
| `title` | 30〜40 文字。主キーワードを含む。区切りは「｜」を使う |
| `excerpt` | 120〜160 文字。読み手の状況と記事の効用を端的に |
| `body` | HTML 文字列（後述） |
| `image` | サムネイルパス。新規画像が用意できない場合は既存 `/images/tmp/blog_banner1.jpg` を仮指定 |

### body の HTML 構造

```html
<h2>セクション見出し｜副題</h2>
<p>段落（2〜4 文を 1 段落に）</p>
<p>短い行を<br />リズムよく並べたい場合は<br />br タグで改行できる（冒頭フック等）</p>
<figure>
  <img src="/images/blog/<dir>/<name>.webp"
       alt="説明的な alt（200 文字以内、見て分かる情報）"
       width="1600" height="893" loading="lazy" />
  <figcaption>キャプション</figcaption>
</figure>
<h3>サブ見出し</h3>
<table>
  <thead><tr><th>...</th></tr></thead>
  <tbody><tr><td>...</td></tr></tbody>
</table>
<ul>
  <li><strong>項目</strong>：説明</li>
</ul>
```

### 推奨構成

0. **冒頭フック（必須・後述）**
1. リード（問題提起 + 「この記事で得られるもの」）
2. 定義（用語の意味、本開発との違い等の比較表）
3. 進め方／フェーズ
4. 業種別／タイプ別の整理（地域記事なら主要産業）
5. 費用相場（規模別・フェーズ別）
6. 補助金・公的支援（地域記事の場合）
7. KPI 設計／成功基準
8. データ・ガバナンス（公的ガイドラインを引用）
9. 失敗パターンと回避策
10. 自社の支援アプローチ（過度な実績主張を避ける）
11. まとめ（原則の再掲）
12. CTA（AI 見積もり、無料相談）
13. FAQ（6〜8 問）
14. 監修クレジット + 最終更新日 + 出典

### 冒頭フック（必須）

執筆者は「株式会社クラウドネイチャー代表が自分で執筆する企業ブログの編集者兼ゴーストライター」という立場で書く。記事本文を始める前に、必ず「人間味のある冒頭フック」を入れる。

**目的**

- いきなり専門的で硬い説明から始めない
- 読者が代表者個人の考え方や人柄に興味を持てるようにする
- 記事を読む心理的なハードルを下げる
- 少しだけクスッと笑える空気を作る
- AIが生成した機械的な文章に見せない

**代表者の文章上の人物像**

- 新潟でAI開発会社を経営する、技術者出身の代表
- 真面目だが、細かい部分で迷ったり悩んだりする
- 自分を大きく見せず、軽い自虐や率直な本音を交える
- 知的ではあるが、気取った表現やポエム調にはしない
- 読者に話しかけるような、砕けた柔らかい文章を使う

**作成ガイドライン**

以下は品質のための目安であり、逐語的に守るべき制約ではない。**数値や形式を満たすことより、自然で人間らしい文章になることを常に優先する**。ガイドラインに合わせた結果、文章が不自然になるくらいなら逸脱してよい。

1. 分量は 200〜500 字・3〜7 段落程度を目安にする（話の流れが自然なら多少前後してよい）
2. 一人称の「私」を基本とする。ただし、毎文「私は」で始めない
3. 題材の例（この分類に無理に当てはめなくてよい。複数が混ざっても自然ならよい）
   - 最近の小さな悩み
   - 仕事中に感じた違和感
   - 経営者として迷っていること
   - AIやツールを使っていて起きた少しおかしな出来事
   - ブログや画像を作っている途中の裏話
   - 期待していたことと現実の小さなズレ
   - 日常の何気ない出来事
   - 最近増えた選択肢や判断への疲れ
4. 軽い自虐、意外なオチ、少しおかしな状況、率直な本音などを入れると人間味が出る。ただし無理に入れない。入れる場合も詰め込みすぎない
5. 笑わせようとしすぎず、「真面目な人が少しぼやいている」程度にする
6. 本文と直接関係のない話から始めてもよい
7. 最後は、冒頭の話と記事テーマが自然につながるように着地させる（つなぎ方の形式は自由）
8. 結論や専門知識を冒頭で説明しすぎない
9. 文の長さに変化をつけ、会話に近い自然なリズムにする。短い行を改行で並べるなど、原文のリズムを活かした表現も可
10. 内部では異なる方向性の導入を複数（目安3案）考え、その中から最も自然で人間味のある1案だけを出力する

**個人情報・エピソードの扱い**

- 入力された近況や実体験がある場合は、それを最優先で使用する
- 過去に共有されている本人の事実や仕事上の状況は使用してよい
- 共有されていない具体的な出来事、場所、人物、失敗談は創作しない
- 使える個人ネタがない場合は、記事制作中の出来事や、仕事で一般的に感じる小さな違和感を使う
- 事実か分からない内容を、実体験のように断定しない

**避ける表現**

- 冒頭から「本記事では〇〇を解説します」と始める
- 一般論や業界説明から始める
- 過度にビジネスライクな挨拶
- 無理に笑いを取りにいく文章
- 大げさな成功談や自己アピール
- 感傷的すぎるポエム調
- 毎回同じ「最近、〇〇が増えました」という入り方
- 「便利になったはずなのに、なぜか忙しい」のような同じ構文の多用
- 本文の内容を言い換えただけの導入
- AI特有の整いすぎた三段論法
- 箇条書き形式の冒頭

**出力方法**

- 冒頭フックに「導入」「つかみ」などの見出しは付けず、`<p>` 段落として body の先頭（最初の `<h2>` の前）にそのまま置く
- 冒頭フックの後、そのまま記事本文（最初の `<h2>`）へ自然に移る

**管理表の運用（必須）**

- フックを書く**前に** `docs/blog_opening_hooks.md` の管理表を読み、過去記事と題材・オチ・書き出しの構文が被らないようにする
- 記事完成後、同じ管理表に**必ず1行追記**する（記事ID・公開日・題材カテゴリ・オチの種類・書き出しの1文）
- 管理表の更新は Phase 15 のチェックリスト項目になっている。追記漏れのまま完了としない

### 内部リンクの慣習

| 種類 | 用例 |
|---|---|
| 関連記事 | `<a href="/usecases/ai-installation-failure">...</a>` |
| サービス | `<a href="/services/ai-support">...</a>`（自動表示もある） |
| AI 見積もり | `<a href="https://ai.cloudnature.jp/" target="_blank" rel="noopener noreferrer">...</a>` |
| お問い合わせ | `<a href="/contact">...</a>` |

## Phase 3: index.ts へ登録

`content/usecases/index.ts` の `USECASES_ARTICLES` 配列の先頭に追加（新着順）。`import` 文も忘れずに。

## Phase 4: 型チェック・lint

```bash
npx tsc --noEmit
npm run lint  # 既存 lint エラーは新規追加とは無関係なら無視
```

## Phase 5: EEAT 強化

Google の品質評価基準に沿って次の要素を組み込む。

| 要素 | 実装方法 |
|---|---|
| **Experience（経験）** | 業界の一般的観察、現場で受ける相談の傾向。自社実績の数値主張は控えめに |
| **Expertise（専門性）** | 業種別ユースケース表、技術スタック（LLM API・Dify・n8n）への具体的言及 |
| **Authoritativeness（権威性）** | 経産省「AI 事業者ガイドライン」、個人情報保護委員会、新潟市企業立地ビジョン、NICO 等の公的情報を出典として引用 |
| **Trustworthiness（信頼性）** | 監修クレジット、最終更新日、参照情報源を末尾に明示 |

### 重要：避けるべき表現

- 「私たちが支援した〇〇社では…」（具体クライアント事例の捏造を疑われる）
- 「2 週間で執筆工数 80% 削減」のような未検証の効果数値
- 「創業まもないからこそ…」のような自己言及（依頼者の意向次第）

代わりに：
- 「業界レポートや公開事例を読み解くと…」
- 「市場で観察される典型パターンとして…」
- 「クラウドネイチャーが採用している進行モデルは…」

## Phase 6: AI 特有トーンの精査

`grep -c "——" <file>` で em ダッシュ数を確認し、ゼロにする。

| 旧用法 | 置換 |
|---|---|
| `<h2>タイトル——副題</h2>` | `<h2>タイトル｜副題</h2>` |
| `<strong>項目</strong>——説明` | `<strong>項目</strong>：説明` |
| `文中の——挿入——` | `。文中の挿入。` または `、挿入、` |
| `Go / No-Go` | 「進む／止める」 |
| `Conditional Go` | 「条件付きで進める」 |
| 英略語の乱用 | 平易な日本語へ |

その他、長い伸ばし棒や過度な太字も間引く。

## Phase 7: スマホ可読性の最適化

「ぶつ切り」と「文字詰まり」の中間を狙う。

- 1 段落 ＝ 2〜4 文（1 トピック）
- 関連する文は同じ段落に
- トピックが変わる時に段落を分ける
- リスト・テーブル・図版を多用して塊を分割

### `NewsBody.tsx` の prose 拡張（必要な場合）

`components/news/NewsBody.tsx` の className に以下が含まれていることを確認。なければ追加：

```
prose-p:text-[15px] md:prose-p:text-base
prose-p:leading-7 md:prose-p:leading-8
prose-p:my-3 md:prose-p:my-4
prose-h2:mt-8 prose-h2:mb-3 md:prose-h2:mt-12 md:prose-h2:mb-4
prose-h3:mt-6 prose-h3:mb-2 md:prose-h3:mt-8 md:prose-h3:mb-3
prose-figure:my-4 md:prose-figure:my-6
prose-figcaption:text-xs md:prose-figcaption:text-sm prose-figcaption:mt-2
prose-table:text-[13px] md:prose-table:text-sm prose-table:my-4
prose-img:my-4 md:prose-img:my-6
prose-li:my-1
```

## Phase 8: 画像準備

### 8.1 バックアップ

```bash
cd public/images/blog/<dir>
mkdir -p _original && cp *.png _original/
```

### 8.2 ウォーターマーク除去

**重要：以前の運用ミス**
- WM 領域を大きく指定しすぎるとコンテンツも削れる
- 単純な fill（背景色塗りつぶし）だと、グラデーション背景や複雑な UI で目立つ
- crop（下部カット）だと、コンテンツも失う
- 元から WM がない画像（自社サムネイルなど）に処理を適用してはいけない

**推奨：クローン・コピー方式**

WM 領域（典型例: 右下 360×85px）の真左の同サイズ領域をコピーして貼り付ける。グラデーション背景でも自然に繋がる。

```bash
# scripts/remove_wm_clone.sh を参照
bash .claude/skills/usecase-article-creation/scripts/remove_wm_clone.sh \
  public/images/blog/<dir>
```

### 8.3 WebP 変換 + リサイズ

```bash
for f in *.png; do
  base="${f%.png}"
  magick "$f" -resize 1600x\> -quality 85 -strip "${base}.webp"
done
rm *.png  # バックアップは _original/ にある
```

期待結果: 1 枚あたり 50〜150KB、合計で元 PNG の 1/5〜1/8 程度

## Phase 9: 画像の本文組み込み

### 各画像の内容把握

WebP を `Read` ツールで開き、画像のタイトル・説明・要点を把握してから配置先セクションを決める。

### `<figure>` のテンプレート

```html
<figure>
<img src="/images/blog/<dir>/<name>.webp"
     alt="図の内容を説明的に記述。alt は『画像が表示されない時に意味が伝わる』レベル"
     width="1600" height="893"
     loading="lazy" />
<figcaption>キャプション（要点を 1 文で）</figcaption>
</figure>
```

注意：
- 全画像に `alt`、`width`、`height` を明示（CLS 防止）
- ファーストビュー以外は `loading="lazy"`
- サムネイルは `page.tsx` 側で `priority` 指定されているため、本文最初の `<img>` は `lazy` のままで OK
- `width` / `height` は実際の WebP サイズと一致させる（クロップせず統一していれば 1600×893）

## Phase 10: HTML 属性の正規化

```bash
# 外部リンクは別タブ + セキュリティ完備
grep -nE 'target="_blank"' <file>
```

| 種類 | 推奨属性 |
|---|---|
| 外部リンク（外部ドメイン） | `target="_blank" rel="noopener noreferrer"` |
| サブドメイン（別 Next.js アプリ） | 同上（別タブで開いた方が UX 良好） |
| 内部リンク | 属性不要 |

`rel="noopener"` だけでは不足。`noreferrer` も付ける。

## Phase 11: Vercel React / デザインベストプラクティス準拠

| 観点 | チェック |
|---|---|
| Server Component | `app/usecases/[slug]/page.tsx` が `async function`（"use client" なし） |
| SSG | `generateStaticParams` で全記事を事前生成 |
| メタデータ | `generateMetadata` で title / description / OG / canonical |
| 構造化データ | breadcrumb + Article の JSON-LD |
| サニタイズ | `components/news/NewsBody.tsx` の `sanitize-html` |
| サムネイル | `next/image` + `priority` で LCP 最適化 |
| 本文画像 | 通常の `<img>`（`dangerouslySetInnerHTML` 内のため `next/image` は不可）。`loading="lazy"` は必須 |
| CLS | `width`/`height` 明示 |

## Phase 12: ブラウザ実機確認

### dev サーバー起動

```bash
# キャッシュ競合があれば先にクリア
rm -f .next/dev/lock
pkill -f "next dev" 2>/dev/null

# 起動（バックグラウンド）
npm run dev > /tmp/dev_server.log 2>&1 &
sleep 10
tail -5 /tmp/dev_server.log  # Local: の URL を確認
```

### Playwright でスクリーンショット

```bash
node .claude/skills/usecase-article-creation/scripts/screenshot.cjs \
  "http://localhost:3000/usecases/<slug>"
```

確認ポイント：
- モバイル（390×844）: ファーストビュー、本文中段、フルページ
- デスクトップ（1280×800）: ファーストビュー、本文中段
- 段落間の余白（広すぎ／狭すぎ）
- テーブルの折り返し（横スクロール発生時は対処）
- 画像の表示崩れ
- 見出しと本文のリズム

問題があれば Phase 7 の prose 拡張に戻る。

## Phase 13: トラブルシューティング

| 症状 | 対処 |
|---|---|
| `Unable to acquire lock at .next/dev/lock` | `rm -f .next/dev/lock` + 既存プロセス kill |
| `Failed to restore task data` (Turbopack) | `rm -rf .next` で完全再ビルド |
| `Cannot find module './chunks/vendor-chunks/next.js'` | 別プロジェクトの dev サーバーが同ポート占有。ポート確認 |
| Playwright タイムアウト | `waitUntil: 'domcontentloaded'` + `waitForTimeout(3000)` |
| 画像 404 | `public/images/...` のパスを確認。`/public` は省略する |
| 型エラー | `npx tsc --noEmit` で詳細確認 |

## Phase 14: /simplify によるレビュー

ブラウザ実機確認まで終わったら、最終チェックリストに進む前に `/simplify` を実行する。

```
/simplify
```

これは CloudNature プロジェクト全体のルール（CLAUDE.md）として、リファクタリング・ロジック変更・バグ修正などの軽微でない作業の最後に必ず実行することになっている。`/simplify` スキルは以下を点検する：

- 重複コード・冗長な抽象化
- 未使用の変数・import
- 過剰なエラーハンドリング・防御的コード
- 効率化できる処理

記事作成タスクで主な対象になりやすい箇所：

- `content/usecases/<slug>.ts` の本文 HTML（同じ表現の繰り返し、過剰な `<strong>`、冗長な段落）
- `content/usecases/index.ts` への import 追加と並び順
- `components/news/NewsBody.tsx` を変更した場合の prose クラスの整理（クラス順序、重複指定）
- `scripts/` の補助スクリプト（記事用に追加した一時スクリプトの削除）

`/simplify` の指摘事項を反映してから Phase 15 へ進む。指摘がなければそのまま次へ。

## Phase 15: 最終チェックリスト

```
□ 型チェック (`npx tsc --noEmit`) 通過
□ 新規記事に起因する lint エラーなし
□ `/simplify` 実行済み・指摘事項を反映済み
□ index.ts に登録済み
□ 全画像に alt、width、height 明示
□ ファーストビュー以外は loading="lazy"
□ 外部リンクに target="_blank" rel="noopener noreferrer"
□ em ダッシュ「——」未使用 (`grep -c "——"` が 0)
□ 人間味のある冒頭フックが body 先頭にある（分量・形式はガイドライン目安、自然さ優先）
□ docs/blog_opening_hooks.md の管理表に本記事の行を追記済み
□ 過度な実績主張（具体クライアント事例の捏造）なし
□ 監修クレジット + 最終更新日 + 出典の透明性ブロックあり
□ FAQ 6 問以上
□ AI 見積もり / 無料相談への CTA を 2 箇所以上
□ 内部リンク 5 本以上（関連記事・サービス）
□ モバイル・デスクトップ両方で目視確認済み
□ sitemap.ts / robots.ts は自動取り込み（手動更新不要）
```

---

## 参考：過去の落とし穴

1. **ウォーターマーク削除範囲を過大にしてコンテンツを削除した**
   → 必ず Read で WM の実位置を確認し、最小領域でクローン・コピー方式を使う

2. **「2026 年 4 月に創業した」など起業時期の主張が不要だった**
   → 依頼者の意向を確認。一般には拠点情報のみで十分

3. **「私たちが支援した〇〇社では…」と実例として書いた**
   → 公開事例として承認されていない場合は使えない。「業界で観察される傾向」へ

4. **段落を 1 文ずつ分割しすぎて「ぶつ切り」に**
   → 1 段落 2〜4 文を基本とし、関連文をまとめる

5. **NewsBody の prose スタイルがデフォルトで段落間隔が広すぎた**
   → 本スキル Phase 7 の拡張クラスを適用

6. **外部リンクが `rel="noopener"` だけだった**
   → `noopener noreferrer` に統一

7. **`.next` キャッシュ破損で dev サーバーが起動しなかった**
   → Phase 13 を参照
