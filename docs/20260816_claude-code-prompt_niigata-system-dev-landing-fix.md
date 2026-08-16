# 依頼：「新潟 システム開発」の着地を cloudnature.jp 本体に戻すため、トップページの H1 / title / meta の書き換え、/services/system-dev との役割分担、ai.cloudnature.jp（ミツモリAI）の title / meta / フッター修正までを一括で行ってください

## 背景（GSC実測データ）

株式会社クラウドネイチャーは、新潟市の中小企業向けにシステム開発・AIエージェント開発・法人向けAI導入支援を提供する会社。このリポジトリでは企業サイト cloudnature.jp と、AI見積もりツール「ミツモリAI」ai.cloudnature.jp の両方を管理している。

各ページの役割：
- cloudnature.jp/（トップ）：会社全体の傘。ブランド接触と各サービスへの分岐
- cloudnature.jp/services/system-dev：システム開発の Money Page。「新潟 システム開発」の本命 Owner
- ai.cloudnature.jp/：システム開発検討者に概算見積もりを体験させる Conversion / Lead Generation ページ。「新潟 システム開発」の順位を取りにいくページではない

現状：
- トップ H1「新潟のAI開発・AIエージェント開発パートナー」／title「新潟のAI開発・AIエージェント開発会社 | 株式会社クラウドネイチャー」
- ai.cloudnature.jp の title「新潟のシステム開発・AI導入見積もり｜最短1分で自動算出【CloudNature】」。meta keywords に「新潟 システム開発」を含む
- ai.cloudnature.jp のフッター Service リンクは3本とも cloudnature.jp/services（ハブ）宛て

GSC / 2026-05-18〜08-14（約3ヶ月）/ 実測

| クエリ | Imp | Clicks | 平均順位 | 着地URL |
| --- | --- | --- | --- | --- |
| 新潟 システム 開発 | 37 | 0 | 20.7 | ai.cloudnature.jp/ |
| システム開発 新潟 | 35 | 0 | 18.9 | ai.cloudnature.jp/ |
| 新潟 システム開発 | 11 | 0 | 17.7 | ai.cloudnature.jp/ |
| 新潟 ai開発 | 6 | 0 | 12.2 | /usecases/niigata-ai-development-company-guide |
| ai開発 新潟 | 5 | 0 | 16.8 | / |
| ai開発 見積もり | 56 | 0 | 53.8 | ai.cloudnature.jp/ |
| 見積もり 自動化 ai | 35 | 0 | 66.6 | ai.cloudnature.jp/ |

同期間、非ブランドの商用クエリでのクリックは0件。「新潟 システム開発」系は cloudnature.jp 本体が着地せず、見積もりツール（別サブドメイン）に流れている。一方、ミツモリAIが本来拾うべき見積もり系は順位が低い。

Ahrefs推定値（実検索回数ではない）：「新潟 システム 開発」月100（商業・ローカル意図）、「新潟 AI開発」0、「AI開発 パートナー」0、「AIエージェント開発」（全国）300、「AI開発」（全国）1,900だが情報収集意図。「システム開発 新潟」の上位10位にはDR4・DR20のサイトが入っており、参入余地がある。

## 目的

「新潟 システム開発」系クエリで cloudnature.jp 本体（トップまたは /services/system-dev）が着地するようにし、この語での順位とクリックを動かすこと。同時に ai.cloudnature.jp を見積もり・費用・概算系の意図に専念させ、意図と着地の一致を作ること。「AI開発」単体の順位は目的にしない。ai.cloudnature.jp のトラフィックを減らすことも目的ではない。

## お願いしたいこと

1. 両サイトの H1 / title / meta description / meta keywords / OG の実装箇所（共通レイアウト含む）と、ai.cloudnature.jp フッターのリンク定義を確認する
2. **cloudnature.jp トップ**：H1・title・meta description・OG title を、「新潟 システム開発」を先頭に置き「AIエージェント開発」を差別化語として続ける方向で書き換える。ヒーロー直下のリード文も、システム開発→AIエージェント開発の順で語られるよう見直す。方向性の例は「新潟のシステム開発・AIエージェント開発会社」（あくまで例。文言はあなたが決める）
3. **cloudnature.jp トップと /services/system-dev の役割分担**：「新潟 システム開発」の本命 Owner は /services/system-dev。トップは会社全体の傘として同語を含めてよいが、system-dev の H1・リード文の近似複製にならないよう差別化し、トップ本文中に system-dev への文脈内リンク（アンカーに「新潟のシステム開発」を含む）を追加する
4. **ai.cloudnature.jp トップ**：title・meta description・OG title を、「新潟のシステム開発」を主語にせず、見積もりツールとしての価値が先に立つ構成へ書き換える（方向性の例：「システム開発の概算見積もりを最短1分で｜ミツモリAI」。文言はあなたが決める）。meta keywords から「新潟 システム開発」を外す。keywords タグ自体を残すか削るかはあなたの判断でよい
5. **ai.cloudnature.jp フッター**：Service リンクを、各サービスページ（cloudnature.jp/services/system-dev、/services/ai-agent、/services/ai-support）へ個別に向ける
6. build と lint を通し、ブランチにコミットして PR を作成する。両サイト分を1つの PR にまとめてよい
7. 完了報告を出す

## 具体的な直し方はあなたが判断してください

文言・語順・リード文の構成は、リポジトリ内のトーン、既存ページの書き方、サービス内容やツールの実際の機能を見たうえであなたが決めてください。こちらから型（文字数・キーワード出現数・見出し構成）は指定しません。ただし以下だけ守ってください。

- 事実の創作禁止：実績数値・料金・導入企業名・補助金・見積もり精度・所要時間など、事実に関わる記述を新しく作らない。既存の記載にある事実だけを使い、不足は「要確認」と明示する
- HUMAN領域の禁止：canonical / noindex / 301 / URL変更 / 価格 / 外部連絡は実装しない。必要と判断した場合は提案として文章で出す
- 公開の禁止：本番デプロイ・main へのマージはしない。ブランチと PR まで
- サイト間のKW競合回避：「新潟 システム開発」「新潟 AI開発」「AIエージェント開発」の Owner は cloudnature.jp（システム開発は /services/system-dev）。ai.cloudnature.jp の Owner は見積もり・費用・概算系の語のみ。niigata-ai-academy.com / ai-dev.cloudnature.jp に関わるコードがこのリポジトリにあっても触らない。「AI研修」「内製化」系の語はトップの H1 / title に入れない

## 完了後に出してほしいもの

- 変更ファイル一覧
- cloudnature.jp トップ・/services/system-dev（触った場合）・ai.cloudnature.jp トップ、それぞれの H1 / title / meta description / meta keywords / OG の変更前後の対比
- 追加・変更した内部リンクの箇所とアンカーテキスト（トップ→system-dev、ミツモリAIフッター）
- HUMAN領域に該当し提案に留めたものがあれば列挙
- PRリンク
- 変更を反映した日付（実施日）

完了報告は、Notionにそのまま貼り付けられる1つのMarkdownブロックとして出力してください（見出し `### 実施記録 YYYY-MM-DD` から始め、変更内容の一覧・変更前後の対比・PRリンク・実施日を含める）。
