# 「新潟 × システム開発」検索流入の役割分担 検証ドキュメント

作成日: 2026-08-12 / 方針改訂: 2026-08-12（同日・第2版）

> **重要**: 本ドキュメントは第1版で前提を誤っていた。§0 に経緯を残したうえで、
> 第2版として目的・原因分析・KPI・結論を書き直している。

---

## 0. 方針改訂の経緯（第1版 → 第2版）

### 0-1. 第1版の前提と、それが誤りだった理由

| # | 第1版の前提 | 実際 | 誤りと判明した理由 |
| --- | --- | --- | --- |
| 1 | `ai.cloudnature.jp` は問い合わせフォームを持たない | **持つ**。Step 13 で氏名・電話番号・メールアドレスを必須取得している（`estimate/lib/stepConfig.ts:103-125`、電話・メールは正規表現で検証） | 「サイト内にHTMLの問い合わせフォームが無い」ことを「連絡先を取得できない」と読み違えた。実際はチャット形式の見積もりフロー自体が連絡先取得フォームを兼ねている |
| 2 | `ai.cloudnature.jp` に露出が集中すると商談にならない | **商談導線が揃っている**。Notion保存（`backend/app/services/notion_service.py`）、運営者通知メール（`backend/app/api/v1/estimate.py` の `send_estimate_notification`）、見積もりメール送信、完了画面のTimeRex予約カレンダー（`estimate/components/complete/BookingSection.tsx`）、問い合わせフォームへのリンク | 「クリック0件」という結果だけを見て、ページの構造的欠陥と結論づけた。実際は順位が低い（平均48.57位）ためクリックに至っていないだけで、到達後のファネルは機能する設計になっている |
| 3 | 代表URLを `ai.cloudnature.jp` から `/services/system-dev` へ移すこと自体が望ましい | **望ましくない**。費用・見積もり検討層は `ai.cloudnature.jp` が受けるほうが、そのまま見積もり開始→連絡先取得→予約まで進む | 前提1・2が誤っていたため、「受注に近いページ＝コーポレートのサービスページ」と決めつけた |
| 4 | `ai.cloudnature.jp` への内部リンク集中は問題 | **一律には問題ではない**。主要CVページへ内部リンクを集めること自体は設計として妥当 | 同上 |

### 0-2. 見直した理由

事業側の想定導線が次のとおりであることを確認した。

1. 検索ユーザーを `https://ai.cloudnature.jp/` に誘導
2. 無料AI見積もりを利用してもらう
3. 氏名・会社名・電話番号・メールアドレスを取得
4. 概算見積もりをメール送信
5. 完了画面の予約カレンダー・問い合わせ導線から商談化

つまり `ai.cloudnature.jp` は「露出を奪っている競合ページ」ではなく、**この事業の主要コンバージョンページ**である。
したがって目的は「代表URLの奪還」ではなく、**2つのURLの役割を分け、検索流入と商談数の両方を伸ばすこと**に改める。

### 0-3. 第1版のうち維持する事実

前提は誤っていたが、以下の**実測事実そのものは有効**であり、第2版でも根拠として使う。

- 技術的な阻害要因（noindex・canonical誤指定・robotsブロック・sitemap欠落）は両サイトとも無い
- `/services/system-dev` は改修前、可視テキスト約1,448文字と薄く、h1に「新潟」を含んでいなかった
- 同ページへの記事本文内リンクは1本のみだった
- GSC上、`/services` 配下4ページはいずれも記録に現れていない

---

## 1. 目的（第2版）

検索結果の代表URLを機械的に `/services/system-dev` へ移すことではなく、
**2つのURLの役割を分けたうえで、検索流入と商談数を伸ばすこと**。

### 1-1. 役割分担

| | `ai.cloudnature.jp` | `/services/system-dev` |
| --- | --- | --- |
| **役割** | 見積もり・費用検討層の獲得／無料AI見積もりの開始・完了／無料相談予約・商談化 | 会社・サービスの信頼形成／対応領域・進め方・保守内容の説明／**AI見積もりへの送客** |
| **想定クエリ** | 新潟 システム開発 / システム開発 新潟 / システム開発 見積もり / システム開発 費用 / システム開発 相場 / 業務システム 見積もり | クラウドネイチャー システム開発 / 新潟 システム開発会社 / システム開発会社 比較 / 業務システム開発会社 / システム開発 対応領域 / システム開発 保守 |
| **ゴール** | 見積もり完了・予約獲得 | 信頼形成 → 見積もりツールへの送客 |

`/services/system-dev` は本体ドメインからAI見積もりページへ内部リンクを供給する役割も担う。

### 1-2. やらないこと（禁止事項）

- `ai.cloudnature.jp` を noindex にしない
- クロスドメイン canonical を設定しない
- 301リダイレクトを行わない
- `/services/system-dev` を削除しない
- どちらか一方へSEO評価を無理に統合しない
- 実績数値・導入企業名・料金・対応能力を創作しない
- 「検索順位が上がる」「代表URLが移る」と断定しない
- GSCの匿名化データを実際のゼロと断定しない

---

## 2. 対象範囲

- `cloudnature.jp`（本体）: `app/services/system-dev/`, `content/services.ts`, `content/common.ts`,
  `content/usecases/*.ts`, `components/`, `types/`, `app/sitemap.ts`
- `ai.cloudnature.jp`（`estimate/`）: **調査のみ。設定変更しない**
- canonical / noindex / 301 / URL変更: **実装しない。提案の文章のみ**

---

## 3. 現状調査の結果（リポジトリ + 本番実サイト実測）

### 3-1. サブドメイン構成

| 項目 | cloudnature.jp | ai.cloudnature.jp |
| --- | --- | --- |
| canonical | 自己参照（正常） | 自己参照（正常） |
| robots meta | `index, follow` | 指定なし（= index可） |
| robots.txt | Allow: /（学習系botのみ Disallow） | Allow: /（`/api/`・`/complete` のみ Disallow） |
| sitemap | 本体13静的URL + news + usecases | `/` と `/chat` の2URL |

→ 技術的な阻害要因は**いずれも無い**。両サイトとも正常にインデックス可能。

### 3-2. `ai.cloudnature.jp` のコンバージョンファネル（実装確認済み）

| # | 段階 | 実装 |
| --- | --- | --- |
| 1 | ランディング | `estimate/app/page.tsx` |
| 2 | 見積もりチャット開始 | `estimate/app/chat/` 全13ステップ（`lib/stepConfig.ts`） |
| 3 | 連絡先取得 | **Step 13**（`type: "contact"`, `required: true`）氏名・電話番号・メールアドレスを検証つきで必須取得 |
| 4 | 保存・通知 | Notion保存（`backend/app/services/notion_service.py`）、運営者通知メール（`send_estimate_notification`） |
| 5 | 見積もりメール | 完了画面 `EmailNotice` + バックエンドから送信 |
| 6 | 商談化 | 完了画面の **TimeRex予約カレンダー**（約30分・オンライン）+ `cloudnature.jp/contact` へのリンク |

**このファネルが、システム開発案件の主要な商談入口である。**

### 3-3. `<title>` の実測

| URL | title |
| --- | --- |
| `ai.cloudnature.jp/` | 新潟のシステム開発・AI導入見積もり｜最短1分で自動算出【CloudNature】 |
| `/services/system-dev`（改修後） | 新潟のシステム開発**会社**｜業務システム・既存システム連携 \| 株式会社クラウドネイチャー |

改修後は、ai側が「システム開発（費用・見積もり）」、本体側が「システム開発**会社**（対応領域・保守）」と、
狙う語を分けている。

### 3-4. GSC 実測（2026-07-09〜08-05 / Ahrefs連携・全ページ15件）

| ページ | Imp | Clicks | 平均順位 |
| --- | --- | --- | --- |
| `ai.cloudnature.jp/` | 102 | 0 | 48.57 |
| `/cases` | 45 | 1 | 11.16 |
| `/usecases/ai-analytics-auto-report` | 67 | 0 | 37.27 |
| `/usecases/ai-installation-failure` | 54 | 0 | 15.69 |
| `/services` 配下4ページ | — | — | リストに出現せず |

対象クエリの着地URLは `ai.cloudnature.jp/` （新潟 システム 開発 21imp/21.33位、システム開発 新潟 12imp/17.75位、
新潟 システム開発 6imp/17.83位）。

**読み替え**: これは「奪われている」のではなく、**主要CVページが対象クエリで既に露出を得ている**状態である。
課題は着地URLの付け替えではなく、**平均48.57位という順位の低さ**（＝クリックに至っていないこと）にある。

※GSCは低ボリュームのクエリ・ページを匿名化・除外することがあるため、リストに出現しないことをもって
　露出が実際にゼロであると断定はできない。

---

## 4. 現状の課題（第2版の整理）

| # | 課題 | 状況 | 確度 |
| --- | --- | --- | --- |
| 1 | `ai.cloudnature.jp` の対象クエリでの**順位が低くクリックに至っていない** | 平均48.57位 / CTR 0% | 実測 |
| 2 | `/services/system-dev` が「会社を探す」意図に応えられる情報量を持っていなかった | 改修前 約1,448文字、h1「システム開発」のみ | 実測 |
| 3 | 本体ドメインから `ai.cloudnature.jp` への送客が、CTAバナー中心で文脈依存の導線が薄かった | サービス詳細ページのFV付近にCTAが無かった | 実測 |
| 4 | 2ページが同じ語（新潟 システム開発）で正面から競合しうる | ai側title先頭が「新潟のシステム開発」、本体側も同語だった | 可能性 |

課題4について、本改修では本体側のh1・titleを「システム開発**会社**」に寄せ、
費用・見積もり語の訴求はai側に残す形で棲み分けを図っている。ただし
**これで代表URLの選ばれ方が変わると断定はできない**（Googleの判断であり、検証は事後の実測による）。

---

## 5. KPI（ファネル基準・第2版で全面変更）

第1版では `/services/system-dev` の Impressions と平均順位を主KPIにしていたが、
これは事業成果と直結しない。**主KPIをファネル指標に変更する。**

### 5-0. 現状の計測実装（コード実測 2026-08-12）

KPI名を実装と突き合わせるため、先に既存のGA4イベントを整理する。

| イベント | 発火タイミング | 実装箇所 |
| --- | --- | --- |
| `estimate_start` | セッション作成成功時（＝チャット開始） | `estimate/hooks/useEstimateApi.ts:55` |
| `estimate_step`（`step_number`・`step_type`） | **各ステップの回答送信が成功した後**（コード上のコメントも「ステップ完了イベント」） | `estimate/app/chat/page.tsx:160` |
| `estimate_step_freetext` | Step 4 完了時 | `estimate/app/chat/page.tsx:166` |
| `estimate_step_ai_features` | Step 8 完了時 | `estimate/app/chat/page.tsx:172` |
| `generate_lead` | 見積もり生成成功時 | `estimate/app/chat/page.tsx:198` |
| `view_estimate_complete` | 完了画面の表示時 | `estimate/app/complete/page.tsx:36` |
| `view_estimate_pdf` | 完了画面からPDFを開いた時 | `estimate/components/complete/EmailNotice.tsx:43` |

**重要**: ステップの「表示」「着手」を示すイベントは存在しない。`estimate_step` は回答送信後に発火するため、
現状測れるのは **Step N 完了** であって Step N 到達ではない。

### 5-1. 主要評価指標（実装に合わせて定義）

| # | 指標 | 測定元 | 現状の可否 |
| --- | --- | --- | --- |
| 1 | `ai.cloudnature.jp` の対象クエリでの **Impressions・平均順位・CTR** | GSC（Ahrefs project_id 10203764） | ✅ 測定可。基準値: 13クエリ / 102imp / 0click / 48.57位 |
| 2 | **AI見積もり開始率** | GA4 `estimate_start` ÷ ランディングのセッション数 | ✅ 測定可 |
| 3 | **各ステップの完了率・離脱率** | GA4 `estimate_step` の `step_number` 分布 | ⚠️ **完了ベースでのみ算出可**。「表示したが未回答で離脱」は現状分離できない |
| 4 | **Step 13 完了率**（連絡先の入力完了） | GA4 `estimate_step`（`step_number = 13`） | ✅ 測定可。※「Step 13 到達（＝画面表示）」は測れないため、近似として `step_number = 12` の完了を使う |
| 5 | **見積もり完了率** | GA4 `generate_lead` / `view_estimate_complete` | ✅ 測定可 |
| 6 | **無料相談予約率** | TimeRex 管理画面 | ⚠️ **GA4では測定不可**。予約完了時のイベント送信を実装していないため、TimeRex側の実績と突き合わせる運用が必要 |
| 7 | **商談化率** | Notion（案件レコード） | ✅ 運用で測定 |
| 8 | **受注率** | Notion / 社内管理 | ✅ 運用で測定 |

#### 計測を厳密にするために必要な追加実装（未実施・提案）

- **ステップ表示イベント**（例: `estimate_step_view`）を各ステップの描画時に発火させる。
  これがないと「Step N を見て離脱した」人数が取れず、真の離脱率が出せない。
- **TimeRex 予約完了イベント**の送信（TimeRexのコールバック or GTMトリガー）。
  現状は完了画面までしかGA4で追えない。
- **CTAの配置識別イベント**。`/services/system-dev` にはAI見積もりへの導線が4箇所あり
  （ヒーロー / サービス詳細カード / ご相談の入口 / 末尾バナー）、現状はどれが押されたか区別できない。
  クリック時に配置名（`hero` / `detail_card` / `entry_card` / `bottom_banner`）を伴うイベントを送れば、
  効いていない導線を根拠を持って整理できる。

### 5-2. 補助指標（事業成果の判断材料としては従属）

- 検索結果でどちらのURLが表示されたか（着地URLの分布）
- `/services/system-dev` の Impressions・平均順位・CTR
- `/services/system-dev` → `ai.cloudnature.jp` の遷移数・遷移率（同一GA4プロパティ内のサブドメイン間遷移として計測）

**着地URLがどちらであるかは、それ自体を目標にしない。** 最終的に評価するのは 2〜8 のファネル指標である。

### 5-4. KPI定義を修正した経緯（2026-08-12・レビュー指摘）

第2版の初稿では、KPIを「Step 1 着手」「Step 13 到達率」と書き、GA4測定IDをai側 `G-BKHWKEZ26E` としていた。
いずれもレビューで実装との不一致を指摘され、コードと本番配信HTMLで確認して修正した。

| 誤り | 実際 |
| --- | --- |
| ai側のGA4測定IDは `G-BKHWKEZ26E` | 本体と同じ `G-1CF4H5GXSM` を共有（2026-04時点では別IDだったが、その後統一された） |
| 「Step 1 着手」「Step 13 到達率」を測る | `estimate_step` は回答送信後に発火するため、測れるのは「Step N **完了**」 |

原因は、2026-04時点の古い情報を現況確認せずに前提にしたこと。GA4/計測まわりは
**実装コードと本番配信HTMLの両方で現況を確認してから書く**。

### 5-3. 計測上の注意

- **本体と ai は同一のGA4測定ID `G-1CF4H5GXSM` を共有している**（2026-08-12 実測）。
  - コード: `estimate/components/shared/GoogleAnalytics.tsx:7` が
    `SHARED_GA_ID = "G-1CF4H5GXSM"` を持ち、本番（`NEXT_PUBLIC_ENV === "production"`）では
    env の `NEXT_PUBLIC_GA_ID` ではなくこの共有IDを使う。非本番のみ env で上書きする設計。
  - 本番配信HTML: `cloudnature.jp` / `ai.cloudnature.jp` のいずれも `G-1CF4H5GXSM` のみを含み、
    GTMコンテナ（`GTM-`）は両サイトとも検出されなかった。
  - したがってファネルは**1つのGA4プロパティ内で追える**。本体側とai側で別プロパティを見比べる必要はない。
  - 補足: `NEXT_PUBLIC_GTM_ID` が設定されるとGTM経由に切り替わり、実際の測定IDはGTMの設定次第になる。
    計測がおかしい時は、まず本番配信中のHTMLで実際のタグを確認すること。
  - ai側の本番設定には `cookie_domain: '.cloudnature.jp'` が付与される実装になっている
    （`GoogleAnalytics.tsx` の `gtag('config', ...)`）。ただしこのスクリプトは
    `strategy="afterInteractive"` でクライアント側に注入されるため、初期HTMLのgrepでは確認できない。
    実際の付与状況はブラウザの開発者ツールで確認する。
- インデックス更新の反映には数週間かかる。短期の数値変動で結論を出さない。

---

## 6. 現在の差分の再評価（残す / 修正する / 戻す）

判断基準: ①信頼形成に役立つか ②ai側と検索意図・内容が過度に重複しないか ③AI見積もりへの送客につながるか
④SEOを優先しすぎて不自然でないか ⑤提供できる内容を超えた断定がないか

| 変更 | 判断 | 理由 |
| --- | --- | --- |
| `title` を「新潟のシステム開発**会社**｜業務システム・既存システム連携」に変更 | **残す** | 「新潟 システム開発会社」「業務システム開発会社」という割り当てクエリに合致。「会社」を含むことでai側（費用・見積もり）と語が分かれる |
| h1「システム開発」→「新潟のシステム開発」 | **修正** | 「新潟のシステム開発」はai側と正面から競合する語。**「新潟のシステム開発会社」に変更**し、会社探し意図に寄せた |
| meta description 冒頭「新潟のシステム開発会社。」 | **修正** | キーワードを置いただけの断片文で不自然だった。「新潟市を拠点に、業務に合わせたシステム開発を行う株式会社クラウドネイチャー。」という一文に書き換え、後半も対応領域・保守の説明に寄せた |
| 「対応する開発領域」6項目 | **残す** | 「システム開発 対応領域」クエリに直接対応。信頼形成に寄与し、ai側（費用算出）と内容が重複しない |
| 「導入の流れ」の掲載 | **残す** | 「進め方」の説明は信頼形成の中核。直接着地したユーザーがハブpage を経由せず把握できる |
| 「ご相談の入口」3項目 | **残す＋強化** | 「まず予算感だけ知りたい」カードに **AI見積もりへの直接リンクを追加**（③送客の主要導線） |
| FAQ「システム開発とAIエージェント開発の使い分け」 | **残す** | 切り分け支援＝信頼形成。ai側と重複しない |
| 断定表現の緩和（3箇所 + 既存FAQ 3箇所） | **残す** | ⑤に該当。既存システムの構成・API公開状況によっては実現できないため |
| 記事からの内部リンク8本 | **残す（意図別に整理）** | §6-1 参照 |
| `relatedServiceIds` に "dev" 追加（4記事） | **残す** | 信頼形成の補助導線 |
| — | **新規** | **FVのAI見積もりCTA**を追加（③送客） |

**戻した変更はない。** 第1版の変更のうち、h1 と meta description の2点を修正し、送客導線を新規追加した。

### 6-1. 内部リンクの検索意図別の使い分け

方針: 費用・見積もり・予算感が主題 → `ai.cloudnature.jp` ／ 対応領域・開発体制・会社選びが主題 → `/services/system-dev`

| 記事・箇所 | 主題 | リンク先 | アンカー |
| --- | --- | --- | --- |
| niigata-ai-development-company-guide（まとめ） | 会社選び | **system-dev** | 新潟のシステム開発会社としての対応領域 |
| niigata-ai-development-company-guide（冒頭・既存） | サービスの切り分け | system-dev | システム開発 |
| niigata-ai-development-company-guide（費用の見方・既存） | 費用 | **ai** | 無料のAI見積もりツール |
| niigata-fde-shared-ai-development | 提供体制 | system-dev | システム開発 |
| ai-development-bottleneck-shift（まとめ） | 提供体制 | system-dev | 業務システム開発 |
| ai-development-bottleneck-shift（費用感・既存） | 費用 | **ai** | AI見積もりシステム |
| niigata-ai-subsidy-guide-2026（FAQ 自社用システム） | 補助金の対象範囲 | system-dev | 業務システム開発 |
| niigata-ai-subsidy-guide-2026（相談導線） | 提供体制 | system-dev | システム開発 |
| niigata-ai-subsidy-guide-2026（費用感・既存） | 費用 | **ai** | AI見積もりシステム |
| business-automation-small-start（末尾） | 対応領域 | system-dev | 業務システム開発 |
| ai-poc-method-cost-kpi（本開発移行） | 進め方 | system-dev | システム開発 |
| ai-poc-method-cost-kpi（費用・既存） | 費用 | **ai** | AI見積もりシステム |
| ai-task-allocation（次のステップ） | 対応領域 | system-dev | 業務に合うシステム開発 |

費用が主題の箇所は既存の ai 宛リンク（記事全体で15本以上）がそのまま担っており、
今回の追加分はすべて「対応領域・体制・会社選び・進め方」が主題の箇所に置いている。
アンカーテキストは分散させ、完全一致の多用を避けている。

---

## 7. 実装内容（2026-08-12）

ブランチ: `seo/system-dev-local-intent`（未マージ・未デプロイ） / PR #3

| ファイル | 変更 |
| --- | --- |
| `content/common.ts` | `PAGE_META.servicesSystemDev` の title / description を役割分担に合わせて調整。意図の割り当てをコメントで明記 |
| `content/services.ts` | `SYSTEM_DEV_HERO`（h1「新潟のシステム開発会社」+ FVのCTA）、`SYSTEM_DEV_SCOPE`（6項目）、`SYSTEM_DEV_ENTRY_POINTS`（3項目・見積もりへの直リンク付き）、`SYSTEM_DEV_FAQ` に1件追加。既存FAQを含む断定表現の緩和 |
| `types/services.ts` | `ServiceScopeItem`（`link?` を含む）を追加 |
| `components/services/ServiceCardGrid.tsx` | 新規。見出し+説明カードのグリッド。任意でカードから次アクションへのリンクを描画 |
| `components/shared/PageHero.tsx` | 任意の `cta` prop を追加（他ページは未指定のため影響なし） |
| `app/services/system-dev/page.tsx` | FVのCTA、`ServiceCardGrid`×2、`ImplementationFlow` を追加 |
| `app/sitemap.ts` | `/services/system-dev` の `lastModified` を更新 |
| `content/usecases/*.ts`（7本） | 検索意図別の内部リンクと `relatedServiceIds` |

### 7-1. AI見積もりへの導線（改修後）

| 位置 | 形式 | ラベル |
| --- | --- | --- |
| ファーストビュー | ボタン（新規） | 無料でAI見積もり |
| サービス詳細カード内 | テキストリンク（既存） | AI見積もりを試す |
| ご相談の入口「まず予算感だけ知りたい」 | カード内リンク（新規） | 無料でAI見積もりを試す |
| ページ末尾 CTAバナー | ボタン（既存） | 無料でAI見積もり |

セクション境界ごとに1つで、形式も分けている。押し売り感を避けるため、
記事中でよく使う `InlineCta` の追加配置は行っていない。

---

## 8. 検証結果

| 項目 | 結果 |
| --- | --- |
| `npx tsc --noEmit` | ✅ エラーなし |
| `npm run lint`（変更ファイル / `--max-warnings=0`） | ✅ No issues found |
| `npm run build` | ✅ 成功（46ページ静的生成） |
| h1 | ✅ 「新潟のシステム開発会社」 |
| title | ✅ 「新潟のシステム開発会社｜業務システム・既存システム連携 \| 株式会社クラウドネイチャー」 |
| meta description | ✅ 「新潟市を拠点に、業務に合わせたシステム開発を行う株式会社クラウドネイチャー。…」（自然な一文） |
| 可視テキスト量 | ✅ 約1,448 → 約2,900文字 |
| FAQPage 構造化データと可視テキストの一致 | ✅ `/services`5件・`/services/system-dev`6件すべて一致（プログラム照合） |
| デスクトップCTA導線 | ✅ ブラウザ実機で4箇所すべて確認 |
| モバイルCTA（タップ領域・幅） | ✅ FVボタン 188×48px、カードリンク 170×44px。いずれも375px幅に収まり、44pxのタップ領域を満たす（当初カードリンクが20pxだったため `py-3` を追加して修正） |
| 断定表現の残存 | ✅ 「活かしたまま」「壊さず」「止めずに」「使い続けたまま」いずれもサイト全体で0件 |
| 事実の創作 | ✅ 実績数値・料金・導入企業名・対応能力の新規記述なし |
| canonical / noindex / 301 / URL変更 | ✅ 一切なし |
| `ai.cloudnature.jp`（`estimate/`）の変更 | ✅ 一切なし |

### 8-1. `/simplify` レビュー（4観点並列）と対応

| 指摘 | 対応 |
| --- | --- |
| 外部/内部リンクの出し分けは `components/home/CasesSection.tsx` の `SmartLink` が既に実装済み。新規コードが同じ分岐を再実装している | **修正**。`components/shared/SmartLink.tsx` へ切り出し、`CasesSection`・`ServiceCardGrid`・`PageHero`・`CtaBanner` で共用 |
| `external?: boolean` は href から導出できる冗長なデータ。`types/cases.ts` の `link` にもフラグは無い | **修正**。`external` を廃止し、`SmartLink` が `href` を見て判定。共有型 `LinkItem` を `types/services.ts` に追加 |
| `PageHero` のCTAが「puffyピル」クラスの5つ目のコピーで、パディングだけ違う新サイズを増やしている | **修正**。`InlineCta` と同じ `px-6 py-3` に揃え、新しい寸法を増やさないようにした |
| カードのリンクが `gap-1.5 hover:gap-2.5` で、`SectionHeader` の同じ見た目のリンク（`gap-2 hover:gap-3`）と挙動が違う | **修正**。`gap-2 hover:gap-3` に統一 |
| 別サイトへ出るリンクなのに内部リンクと見分けがつかない。同ページの `ServiceDetailCard` は `ExternalLink` アイコンを使っている | **修正**。外部リンク時は `ExternalLink` アイコンに切り替え |
| 同一ページで同じ遷移先に3種類のラベル（WCAG 3.2.4 Consistent Identification） | **修正**。ヒーロー・カード・下部バナーを「無料でAI見積もり」に統一 |
| `CtaBanner` だけ `ESTIMATE_URL` を同一タブで開き、他の全導線（HeroSection・InlineCta・ServiceDetailCard・記事本文）と挙動が違う | **修正**。`SmartLink` 経由にし、サイト全体でAI見積もりへの導線が別タブ＋`rel="noopener noreferrer"` に揃った（**サイト全体の挙動変更のため要確認事項**） |
| `content/usecases/ai-task-allocation.ts:27` の既存リンクに `target`/`rel` が無い（`content/` 内で唯一の例外） | **修正**。他と揃えた |
| `PrimaryCtaLink` を抽出して `InlineCta`・`CtaBanner`・`ContactForm`・`LegalDocument` を全て置き換えるべき | **見送り**。今回の差分の範囲外で、影響が広い |
| `ServiceDetail` に `hero` フィールドを追加して3サービスページを共通化すべき | **見送り**。第1回レビューでは逆に「各ページが個別の `*_HERO` 定数を持つのがこのコードベースの慣習」と指摘されており、他2ページの要件が出るまでは早すぎる |
| Service JSON-LD の `description` と可視リード文が異なる | **見送り**。`/services` ハブが同じ `@id` で `service.description` を出力しており、片方だけ変えると同一 `@id` に別内容が並ぶため悪化する |
| `:focus-visible` のスタイルがリポジトリ全体で未定義 | **見送り**。全インタラクティブ要素に影響する全体施策のため、別途対応（§9に記録） |

### 8-2. モバイル検証の制約

Chrome拡張の `resize_window` はウィンドウサイズの変更が実際のビューポートに反映されなかったため
（`window.innerWidth` が 1698 のまま）、**表示の目視によるモバイル確認はできていない**。
代わりに、各CTA要素の実測サイズ（幅・高さ）を取得し、375px幅の想定コンテンツ領域に収まるか、
タップ領域が44px以上かをプログラムで検証した。レイアウト自体は既存の
`InlineCta`（本番稼働中）と同一のクラス構成であり、`btn-puffy` 系CSSに幅指定は無い。

---

## 9. 既存の論点（今回は未対応）

- `ImplementationFlow` はデスクトップ用タイムラインとモバイル用リストを両方DOMに出すため、同じ h3 が2組出力される。
  `/services` で既にそうなっている既存挙動であり、今回の追加で発生した問題ではない。
- `app/layout.tsx` の Organization JSON-LD の `sameAs` が空配列のまま（コード内に
  「Google Business Profile・SNSを開設したらURLを追加する（ローカルSEOの最重要施策）」というTODOあり）。
- `estimate/` から本体へのアウトバウンドリンクは トップ・`/company`・`/cases`・`/contact` のみで、
  `/services` 配下へのリンクは無い。
- `app/globals.css` に `:focus-visible` の指定が一切なく、キーボード操作時のフォーカス表示はブラウザ既定に依存している。
  全インタラクティブ要素に関わるため、サイト全体の施策として別途検討する。
- `ESTIMATE_URL` 定数がありながら `content/common.ts:17`・`content/cases.ts`・`content/home.ts` は
  同じURLをハードコードしており、`app/llms.txt/route.ts` は `/chat` という別パスを指している。
  定数を唯一の正にする掃除は今回の範囲外。

## 10. 人間が判断すべきこと（実装していない・提案のみ）

完了報告の「経営判断が必要な論点」を参照。
