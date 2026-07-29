# 企業情報ページ 一新 レビュー (2026-07-28)

## 検証目的

`sample_company_page.png` のデザインをベースに `/company` ページを一新した変更が、
デザイン意図・既存の設計システム・アクセシビリティ・ビルドの観点で問題ないかを検証する。

## 対象範囲

### 新規

- `app/company/page.tsx`（再構成：セクション合成）
- `content/company.ts`（コンテンツ全面書き換え）
- `components/company/CompanyHero.tsx`
- `components/company/CompanyPurpose.tsx`
- `components/company/CompanyPractice.tsx`
- `components/company/CompanyMessage.tsx`
- `components/company/CompanyOverview.tsx`（4カラム会社概要に刷新）
- `components/company/SkylineArt.tsx`（山＋街並みの手描きSVG装飾）
- `components/company/PhotoPlaceholder.tsx`（実写差し替え待ちダミー）
- `components/shared/CtaBanner.tsx`（`bottomDecoration` prop 追加、後方互換）

### 削除

- `components/company/AccessSection.tsx`（Googleマップ：ユーザー指示で削除）
- `components/company/RepresentativeMessage.tsx`（`CompanyMessage` に置換）
- `content/company.ts` の `COMPANY_ACCESS` / `COMPANY_MID_CTA` / `REPRESENTATIVE_MESSAGE`

## 仕様上の意思決定（ユーザー確認済み）

- 装飾ライン画（山＋街並み）は手描きSVG（`SkylineArt`, currentColor でテーマ色対応）。OUR PURPOSE と CTA で使用。
- 会社概要：新項目（設立 2026年4月 / 資本金 300万円 / 取引銀行 第四北越銀行 / 登録番号 T6110001064635）は見本の値。所在地は現状どおりフル住所を表示。
- アクセス（Googleマップ）セクションは削除。
- 「クラウドネイチャーの特徴（OUR STRENGTHS）」セクションは削除。
- 事業内容セクションを「社内でのAI実践事例」（問い合わせ一次対応／見積・提案／情報発信の自動化）に変更。
- 実写画像はダミー（`PhotoPlaceholder`）で、後日 `next/image` に差し替え想定。

## 確認項目リスト

- [x] `npm run build` 成功、`/company` が静的ルートとして生成される
- [x] ESLint（対象ファイル）エラーなし
- [x] デスクトップ表示がデザインと一致（ヘッドレスChromeで確認）
- [x] モバイル表示で各セクションが崩れず縦積みになる
- [x] 削除シンボルへの残参照なし（grep 確認済み）
- [x] 見出し階層（h1: hero / h2: 各セクション / h3: カード・署名）と `aria-labelledby`
- [x] Codex による外部レビュー（下記に記録）
- [x] `/simplify` による品質レビュー（下記に記録）

## Codex レビュー結果

- モデル: `gpt-5.4`（`gpt-5.3-codex`系はChatGPTアカウントで非対応）。
- **[P1] 会社概要の未確認値の公開リスク**（`content/company.ts` の `COMPANY_OVERVIEW`）:
  `設立` / `資本金` / `取引銀行` / `適格請求書発行事業者登録番号` は見本デザイン由来の値であり、
  未確認のまま公開すると会社情報の誤掲載になり得る、との指摘。
  - **対応方針**: これらの値はユーザーが見本デザイン（自社作成のモックアップ）から採用することを
    AskUserQuestion で明示的に承認済みのため、値自体は維持する。
  - **要確認（ユーザーへ再掲）**: `設立 2026年4月` は既存の社内ナレッジ（「2025年11月設立」）と食い違いがある。
    公開（`git push`）前に確定値かどうかをユーザーが最終確認すること。デプロイはユーザー操作（push）のため本作業では未実施。

## `/simplify` 結果

4観点（reuse / simplification / efficiency / altitude）の並列レビューを実施。適用した修正:

- React key を `paragraph.slice(0,16)` → 配列 index に変更（`CompanyPurpose` / `CompanyMessage`）。
- `PhotoPlaceholder` の未使用 `className` prop を削除、ドットパターンの style をモジュール定数に巻き上げ。
- 到達不能なアイコン fallback（`?? Lightbulb` / `?? MessagesSquare`）を削除（`strict` だが `noUncheckedIndexedAccess` 無効のため型安全）。
- `CtaBanner` の `bottomDecoration` を、配置背面・クリック透過・はみ出しクリップをコンポーネント側で担保する形に変更（呼び出し側は配置とサイズ・色のみ指定）。後方互換維持。
- 共有 `SectionHeader` に任意 `description` prop を追加し、`CompanyPractice` の負マージン回避ハックを解消。
- `CompanyOverview` の見出し文字列（COMPANY INFO / 会社概要）を `content/company.ts`（`COMPANY_OVERVIEW_HEADING`）へ移動。

スキップ（意図的差分・範囲外・pre-existing パターン）:

- `CompanyPurpose` / `CompanyMessage` の eyebrow を `SectionHeader` へ寄せる案（タイトルの大きさ・色が意図的に異なり、home の Mission/AiGuides と同じ既存パターン）。
- `PhotoPlaceholder` のドット色 `#055448` の Tailwind トークン化（インラインstyleのため実行時にトークン参照不可、`ServicesSection` も同様にハードコード）。
- `SkylineArt` のメモ化（サーバーレンダリングで no-op）。

適用後、`npm run build` 成功・`/company` 静的生成を確認。ヘッドレスChromeで実践事例セクションの表示崩れなしを確認。

## 追記（2026-07-28 同日）: 実践事例セクションの再デザイン

ユーザーフィードバック「デザインが行けてない・AIっぽい・高さを抑えたい」を受け、
`CompanyPractice` を3枚カードグリッドから**番号付きレッジャー行（雑誌目次風）**へ刷新:

- ゴースト番号（01/02/03、hover で teal に変化）＋ 英字キッカータグ（INQUIRY 等）＋ 罫線区切りの行構成。
- 実写ダミーは各行右の小サムネイル（`PhotoPlaceholder` に `compact` prop 追加）。モバイルでは非表示。
- 見出しは左右分割のエディトリアル組み（表題左・補足右）。セクション padding も py-14/20 に圧縮。
- 高さ: デスクトップ約840px→約560px、モバイル約1500px→約690px。
- 付随変更: `SectionHeader` の `description` prop は唯一の利用箇所が消えたため撤去（dead API 回避）。
  `COMPANY_PRACTICE.items` の `icon` キーは `tag`（英字ラベル）に置換し、lucide アイコンマップを削除。
  ヒーロー3要点の削除（ユーザー編集）に伴う未使用 `POINT_ICONS` も除去。
- 検証: build/ESLint パス。デスクトップ・モバイル(500px幅)でスクリーンショット確認。
  ※ headless Chrome は最小ウィンドウ幅の制約で 390px 指定時に右端がクリップされる（実オーバーフローではない。
  未変更のトップページでも同様のクリップを確認済み）。狭幅検証は 500px 以上で行うこと。

## 追記（2026-07-28 同日）: COMPANY / MESSAGE のフルワイド画像化

ユーザー指示により、ヒーローと代表メッセージの画像をフルワイド（画面右端までブリード）に変更し、
AI生成画像を適用した:

- **画像生成**: Codex CLI は画像生成非対応のため、`backend/.env` の `OPENAI_API_KEY` で
  OpenAI 画像API（`gpt-image-1`, 1536x1024, quality high）を直接呼び出して生成
  （セッション冒頭で提示していた代替案をユーザーが「codexで作成」の指示で採用した形）。
  リファレンス画像の構図（明るいオフィス・観葉植物・自然光・ラップトップ）を人物なしで再現。
- **配置**: `public/images/company/office-hero.webp`（94KB）/ `office-message.webp`（56KB）。
  生成スクリプトはスクラッチパッド（セッション限り）。再生成時は同プロンプトを review doc 起点に再構築する。
- **CompanyHero**: PC は画像を右56%に絶対配置しフルブリード、左端を白グラデーションで本文へブレンド。
  モバイルはテキスト下に全幅の画像帯。`next/image` fill + `priority` + 明示 `sizes`。
  画像要素は1つでレスポンシブ切替（二重ダウンロード回避）。
- **CompanyMessage**: 同構成で右44%・背景 teal-50 へのグラデーションブレンド。署名はテキスト側に維持。
- **PhotoPlaceholder**: ヒーロー／メッセージで不要になったため compact 専用（サムネイル専用）に簡素化。
  利用箇所は実践事例の行サムネイルのみ。
- 検証: build / ESLint パス。デスクトップ 1280px・モバイル相当 500px でスクリーンショット確認。

## 追記（2026-07-29）: ヒーロー画像の比較検証と確定

- ユーザーが用意した4枚の候補（`public/images/company/sample/`、ChatGPT生成・人物あり）を
  実ページで比較するため、`app/company/compare/` に一時ページを作成
  （実 `CompanyHero` に imageSrc prop を追加して4案を縦に並べてライブ描画）。
- 静的モック版・スクリーンショット版の比較ページも試作したが、ユーザー要望により
  「実ページのライブ描画を最初から縦に並べる」方式に収束。今後同種の画像比較を行う際は
  最初からこの方式（実コンポーネント＋一時ルート）を使うこと。
- **案3（3人・立ち会話）に確定**。現在適用中だった `office-hero2.png` と同一ファイル（MD5一致）だったため、
  画像内容は変わらず、WebP最適化のみ実施: `office-hero.webp`（1.6MB→56KB）。
  MESSAGE画像も同様に `office-message.webp`（1.5MB→55KB）へ最適化し、content の参照とヒーローのaltを更新。
- 比較用一時ファイル（`app/company/compare/`、CompanyHero の imageSrc prop、サンプル複製）は撤去済み。

## 追記（2026-07-29 その2）: ヒーロー画像のメイン/サブ切り替え機構

- ユーザー提供の新画像2枚を適用:
  - **メイン**: 人物なしのオフィス（`office-hero.webp`, 36KB）← 09_56_51.png
  - **サブ**: 3人打ち合わせの人物あり版（`office-hero-sub.webp`, 58KB）← 09_07_43.png
- `content/company.ts` に `HERO_IMAGES`（main/sub、src+alt セット）を定義し、
  `COMPANY_HERO.image: HERO_IMAGES.main` の **`.main` を `.sub` に書き換えるだけで切り替わる**構造にした。
  alt も画像とセットで切り替わる。
- **ハマりどころ**: 同一ファイル名で画像を上書きすると、dev サーバーの Next.js 画像最適化キャッシュ
  （`.next/dev/cache/images`）が古い内容を返し続ける。`rm -rf .next/dev/cache/images` で解消。
  本番（Vercel）はデプロイごとに新規のため影響なし。

## 追記（2026-07-29 その3）: 会社概要セクションの再デザイン（ドットマップ）

- ユーザー提供のリファレンスに合わせて `CompanyOverview` を刷新:
  左に見出し＋罫線区切りの2カラムテーブル、右に新潟をマークした日本のドットマップ。
- **テーブル行はリファレンス準拠**: 会社名 / 代表者 / 所在地 / 事業内容 の4行。
  `設立` はユーザー指示で削除。`資本金`・`取引銀行`・`適格請求書発行事業者登録番号` は
  リファレンスに無いため削除（値は git 履歴に残存。復活はいつでも可能）。
  代表者は「渡邉 浩平」（肩書なし、リファレンス準拠）。所在地はフル住所を維持（過去の決定を優先）。
- **ドットマップは gpt-image-1 でなくスクリプト生成SVGに変更**:
  ラスター生成はドット周りのグロー・形状精度の問題があったため、
  world.geo.json の日本 MultiPolygon（南西諸島は緯度30度未満を除外）をグリッド走査し、
  ray-casting の内外判定でドット（427個）を配置する Python スクリプトで
  `public/images/company/japan-dots.svg`（17KB）を生成。
  新潟市（139.036E, 37.916N）の位置に teal のアクセントドット＋同心円リングを同座標系で配置。
  再生成時はレビュー記録のパラメータ（間隔13px・半径4.4px・ドット色 #C3CDC4）を参照。
- 検証: build / ESLint パス。デスクトップ・モバイル確認済み。
  ※ 縦長ウィンドウでの一括撮影では sticky footer により CTA とフッターの間に空白が写るが、
  実機ビューポートでは発生しない撮影アーティファクト。

## 追記（2026-07-29 その4）: スマホの画像セクション改善

モバイルで COMPANY・MESSAGE が「テキスト＋平らな全幅画像の帯」の繰り返しで冗長だったため、
デザインを作り込み（PCレイアウトは不変、モバイルのみ変更・画像要素は各1つのまま）:

- **COMPANY（ヒーロー）**: モバイルは画像を全面背景（`absolute inset-0`）にし、
  上→下の白グラデーション（`from-white from-15% via-white/85 via-52% to-white/5`）でテキストを重ねる
  没入型ヒーローに。PCの「画像を端でブレンド」の縦版で、平らな帯の分離感を解消。
  テキストは `pt-24 pb-60`（下部で画像を見せる）。空オフィス画像は上部が明るく、暗色テキストの可読性を確保。
- **MESSAGE**: 本文が長く画像へ重ねられないため、平らな全幅帯 → 角丸カード
  （`mx-6 mb-12 rounded-2xl shadow-lg`、PCは `md:` で全ブリードにリセット）。
  周囲に teal-50 の余白が出て「意図のある写真」に見える。
- 検証: build / ESLint パス。モバイル（430px）でヒーロー・メッセージ、PC（1600px）で回帰なしを確認。

## 追記（2026-07-29 その5）: モバイルの MESSAGE 画像・会社概要マップの再デザイン

その4の調整後もユーザーから「イケてない」の指摘があり、以下へ変更（PCは不変）:

- **MESSAGE**: 末尾の角丸カード → **セクション冒頭のフルブリード画像帯**（h-56/sm:h-64）。
  下端28pxを `to-teal-50` のグラデーションで背景へ溶かし、画像→見出し→本文と流れる
  エディトリアルな導入に（ヒーローの縦グラデーションと呼応）。DOM順も画像を先頭へ移動
  （PCは絶対配置のため影響なし）。
- **会社概要マップ**: 白地に浮いていた状態 → 淡いグラデーションパネル
  （`rounded-2xl border bg-gradient-to-br from-teal-50/90 via-white to-teal-50/50`）に収め、
  「● 本社・新潟県新潟市」キャプション（`COMPANY_MAP.caption`、モバイルのみ表示）で意味づけ。
  PCは `md:` リセットで従来どおり素の表示。
- 検証: build / ESLint パス。モバイル 430px・PC 1600px 両方でスクリーンショット確認、PC回帰なし。

## 追記（2026-07-29 その6）: モバイルヒーローの磨き込み・会社概要マップのモバイル非表示

- **会社概要マップ**: ユーザー判断でモバイルは非表示（`hidden md:block`）。
  その5で作ったモバイル用パネル装飾・キャプションは撤去。
- **モバイルヒーロー**: 「コンセプトは良いがパッとしない」の指摘を受け磨き込み:
  - 縦グラデーションを `from-white from-45% via-white/60 via-60% to-transparent to-78%` に変更。
    テキスト帯は白を保ち、短い距離で溶かして下部の写真を鮮明に見せる（従来は全体がミルキーに霞んでいた）。
  - 写真上に `glass-card` のタグラインチップ（`COMPANY_HERO.imageCaption`＝「新潟から、AIを経営の当たり前に」、
    teal ドット付き、モバイルのみ）を浮かせて焦点を追加。
  - テキストブロックに既存キーフレーム `animate-hero-fade-in` を付与（入場アニメーション、reduced-motion 対応済み）。
- 検証: build / ESLint パス。モバイル 430px で写真の鮮明さとチップ表示、PC 1600px で回帰なしを確認。

## 追記（2026-07-29 その7）: タイトル句点統一・OUR PRACTICE → AI WORKSPACE 置き換え

- **タイトル句点統一**: ヒーロー／OUR PURPOSE／MESSAGE のタイトル末尾「。」を削除（本文段落は維持）。
  以後、企業情報ページのタイトル・サブタイトルは句点なしで統一する。
- **AI WORKSPACE セクション**: ユーザー指示で「社内でのAI実践事例（レッジャー）」セクションを廃止し、
  リファレンス準拠の AI WORKSPACE セクションへ置き換え:
  - 左: 「AIを、会社の標準装備に」大見出し＋説明。右: 「─ 社内で日常的に活用しているAIツール ─」ラベル＋
    ユーザー提供のツール連携図（`ai-workspace.webp`、1.2MB PNG→58KB WebP化）。
  - `CompanyPractice.tsx`・`PhotoPlaceholder.tsx`（未使用化）・`COMPANY_PRACTICE` を削除し、
    `CompanyWorkspace.tsx`・`COMPANY_WORKSPACE` を新設。セクション id は `practice` → `workspace`。
  - 旧・実践事例3項目（問い合わせ一次対応／見積・提案／情報発信の自動化）の文言は git 履歴に残存。
- 検証: build / ESLint パス。デスクトップ 1600px・モバイル 430px で表示確認。

## 追記（2026-07-29 その8）: 最終 /simplify（4観点並列レビュー）

適用した修正:

- `CompanyHero.tsx` の死んだコメントアウト（旧タグラインチップのJSX、存在しない `imageCaption` を参照）と
  それを説明する古いdocコメントを削除。
- `COMPANY_MESSAGE` の画像フィールドを `imageSrc`/`imageAlt`（フラット）→ `image: {src, alt}` に正規化
  （他セクションと形を統一。唯一の外れ値だった）。
- `CompanyWorkspace` の図の `sizes` を実描画幅に合わせ
  `(min-width: 1200px) 620px, (min-width: 768px) 57vw, 100vw` に修正（60vwの過大取得を解消）。
- `CompanyOverview` のPDFボタンと `InlineCta` の副ボタンで完全重複していたフォレスト系アウトラインピルを
  `globals.css` の `.btn-outline-forest`（@layer components）として共有化し、両所から参照。

スキップ（判断理由つき）:

- eyebrow の手組み4箇所（`SectionHeader` はタイトル様式が固定でピクセル互換でない。home の Mission/AiGuides と同じ既存慣習）。
- PC用フェードグラデーションの2箇所重複（色トークン違いのみ。2箇所ならインラインが可読）。
- `SkylineArt` の2回描画（静的SVG・1KB未満、`<symbol>`化は過剰）。
- `office-hero-sub.webp`（60KB・未参照）＝ 1行切替用に意図的に維持。コミット時に不要なら削除可。
- ヒーロー画像コンテナの no-op クラス（`md:inset-y-0` 等）・セクションidの命名ゆれ（コスメティック）。

検証: build / ESLint パス。PDFボタンの見た目が共有クラス化後も同一であることをスクリーンショットで確認。

## 残タスク / 申し送り

- ~~会社概要の設立日の確定値確認~~ → 2026-07-29 に「設立」行自体を削除したため解消。
- **コミット前の画像整理（要ユーザー判断）**: `public/images/company/` に未参照の大容量ファイルが残っている
  （`office-hero2.png` / `office-hero_.png` / `office-message.png` / `_office-hero.webp` / `_office-message.webp` /
  `sample/` 内の原本4枚 / 新画像の原本 `ChatGPT Image 2026年7月29日 09_56_51.png`・`09_07_43.png` — 計約16MB）。
  現在サイトが参照するのは `office-hero.webp`・`office-hero-sub.webp`（切替待機）・`office-message.webp` のみ。
  そのままコミットするとリポジトリと配信物が肥大するため、原本の保管場所を決めて整理すること。
- 実践事例の行サムネイル×3は `PhotoPlaceholder`（ダミー）のまま。実写または生成画像への差し替えは任意。
- ヒーロー／メッセージの画像はAI生成（gpt-image-1）。実写に差し替える場合は
  `public/images/company/office-hero.webp` / `office-message.webp` を同名で上書きするだけでよい。
- デプロイはユーザー操作（`git push` → Vercel 自動）。本作業では commit/push は未実施。
