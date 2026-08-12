# Organic経由の問い合わせ計測 実装レビュー

作成日: 2026-08-12
対象ブランチ: `feat/ga4-lead-conversion-tracking`

## 検証目的

SEO Weekly Metrics の **SEO Inquiries（Organic経由の問い合わせ件数）が全24レコードで「未取得(計測未設定)」** になっている状態を解消する。
「順位・クリックが伸びた結果、問い合わせが増えたのか」を週次で検証できるようにすることがゴール。

具体的には、GA4 上で次の 1 クエリが取れる状態にする。

> セッションのデフォルトチャネルグループ = `Organic Search` に絞った上での、
> 問い合わせ完了イベント数を **サイト別・問い合わせ種別（通常 / AI見積もり）別** に週次で取得する。

## 対象範囲

| 対象 | ドメイン | 実装ディレクトリ | 本タスクでの扱い |
| --- | --- | --- | --- |
| コーポレートサイト | cloudnature.jp | `app/` `components/` | 実装対象 |
| AI見積もり | ai.cloudnature.jp | `estimate/` | 実装対象 |
| AI研修LP | ai-dev.cloudnature.jp | `ai-dev/` | 実装対象（既存イベントの不具合修正） |
| AIアカデミー | niigata-ai-academy.com | **別リポジトリ** `~/Dev/niigata-ai-academy` | 別PRで対応 |

対象外: GA4管理画面の設定（アカウント権限が必要なため手順書のみ）、本番デプロイ・マージ。

## 確認項目リスト

### A. 現状の計測タグ棚卸し

- [x] A-1. 導入済みタグの種類（GA4 / GTM / その他）を特定する
- [x] A-2. 測定IDがサブドメイン間で共通か、別プロパティかを確認する
- [x] A-3. 既存イベントを全列挙し、壊してはいけないものを確定する
- [x] A-4. クロスサブドメインでセッションが継続するか（自己参照リファラにならないか）確認する

### B. 問い合わせイベントの実装

- [x] B-1. 通常問い合わせと見積もり経由を区別できるパラメータ設計にする
- [x] B-2. GA4推奨イベント名に寄せ、週次抽出時に1イベントで串刺しできるようにする
- [x] B-3. 既存イベントを削除せず後方互換を保つ
- [x] B-4. 個人情報（氏名・メール・電話）をパラメータに含めない

### C. コンバージョン地点の一意化

- [x] C-1. 各フォームの完了状態が一意なURL／状態として識別できるか確認する
- [x] C-2. 完了ページが未整備の箇所を洗い出し、URLを付与する

### D. 成果物

- [x] D-1. GA4管理画面の設定手順書を作成する
- [x] D-2. Codex による対話レビューを実施し、指摘を反映する

---

## A. 現状の計測タグ棚卸し（コード実測 2026-08-12）

### A-1 / A-2. 導入済みタグ

| ドメイン | 実装 | 測定ID | 備考 |
| --- | --- | --- | --- |
| cloudnature.jp | gtag.js 直挿し | `G-1CF4H5GXSM` | `components/shared/GoogleAnalytics.tsx` |
| ai.cloudnature.jp | gtag.js 直挿し | `G-1CF4H5GXSM`（本番は定数で固定） | `estimate/components/shared/GoogleAnalytics.tsx:7-8` |
| ai-dev.cloudnature.jp | gtag.js 直挿し | `G-1CF4H5GXSM` | `ai-dev/components/GoogleAnalytics.tsx` |
| niigata-ai-academy.com | GTM + gtag.js + Google広告 | `G-MTJGTGMWGG`（**別プロパティ**） | 別リポジトリ |

- **GTMは3サイトとも未使用**。各 `GoogleAnalytics.tsx` に GTM 分岐は存在するが `NEXT_PUBLIC_GTM_ID` が空のため
  gtag.js 経路が有効。したがって本タスクは **コード直書き（gtag.js）** で実装し、GTMコンテナには依存しない。
- Microsoft Clarity を併用（`NEXT_PUBLIC_CLARITY_ID`、本番のみ）。今回は変更しない。

### A-3. 既存イベント一覧（変更前）

| イベント | サイト | 実装箇所 | 本タスクでの扱い |
| --- | --- | --- | --- |
| `contact_submit` | cloudnature.jp | `components/contact/ContactForm.tsx:105` | **維持**（後方互換） |
| `estimate_start` | ai.cloudnature.jp | `estimate/hooks/useEstimateApi.ts:55` | 変更なし |
| `estimate_step` | ai.cloudnature.jp | `estimate/app/chat/page.tsx:160` | 変更なし |
| `estimate_step_freetext` | ai.cloudnature.jp | `estimate/app/chat/page.tsx:166` | 変更なし |
| `estimate_step_ai_features` | ai.cloudnature.jp | `estimate/app/chat/page.tsx:172` | 変更なし |
| `generate_lead` | ai.cloudnature.jp | `estimate/app/chat/page.tsx:198` | **パラメータ追加**（イベント名は維持） |
| `view_estimate_complete` | ai.cloudnature.jp | `estimate/app/complete/page.tsx:36` | 変更なし |
| `view_estimate_pdf` | ai.cloudnature.jp | `estimate/components/complete/EmailNotice.tsx:43` | 変更なし |
| `generate_lead`（dataLayer） | ai-dev.cloudnature.jp | `ai-dev/components/ConsultationForm.tsx:83` | **不具合修正** |

### A-4. 判明した問題点

| # | 問題 | 影響 |
| --- | --- | --- |
| P1 | 問い合わせイベント名が **サイトごとにバラバラ**（`contact_submit` / `generate_lead`） | 「Organic経由の問い合わせ総数」を1イベントで抽出できない。これが SEO Inquiries 未取得の直接原因 |
| P2 | コーポレートの問い合わせ完了が **インラインの state 切り替え**でURLが `/contact` のまま | 完了地点を一意に識別できない。GA4/広告のコンバージョン地点として指定不可 |
| P3 | ai-dev の `window.dataLayer.push({event:"generate_lead"})` が **GTMコンテナ未導入のため到達しない** | 研修LPの申込が GA4 に1件も記録されていない（サイレント欠損） |
| P4 | 問い合わせ種別を示すパラメータがなく、通常問い合わせと見積もり経由を分離できない | 依頼の「見積もりツール経由と通常を区別」が満たせない |
| P5 | AI見積もりへの導線（CTA）クリックが未計測 | Organic流入がCV地点に到達したか追跡できない |
| P6 | `generate_lead` と `contact_submit` は **Google広告にコンバージョンとしてインポート済み**（`docs/20260410_google_ads_setup_guide.md:59-67`）。`generate_lead` は入札最適化の**主コンバージョン**で意味は「見積もり完了」に固定 | この2つを統一イベントに流用すると広告の入札最適化の母集団が変わる。GA4→広告のインポートはイベント名単位で、`lead_type` では分離できない（Codexレビュー指摘） |

- クロスサブドメイン（A-4）は **問題なし**。3サイトとも同一測定ID かつ本番で `cookie_domain: '.cloudnature.jp'` を
  指定しているため `_ga` Cookie が共有され、cloudnature.jp → ai.cloudnature.jp でセッションと参照元が維持される。
  自己参照リファラによるセッション分断は発生しない。**この点は既存実装のままで要件を満たす。**

---

## B. 実装方針

### B-1 / B-2. イベント設計

問い合わせ完了を **新規イベント `inquiry_submit` に統一**する。サイト・種別の分離は **パラメータ**で行う。

**当初は GA4 推奨名の `generate_lead` に統一する設計だったが、P6 のため取りやめた。**
`generate_lead` は広告の主コンバージョンとして「見積もり完了」の意味が固定されており、
通常問い合わせを相乗りさせると入札最適化が壊れる。既存イベントの意味を変えずに
週次KPIを1イベントで串刺しするため、**KPI専用の独立したイベント名**を新設する。

| パラメータ | 値 | 用途 |
| --- | --- | --- |
| `lead_type` | `contact_form` / `ai_estimate` / `training_consultation` / `academy_consultation` | 通常問い合わせと見積もり経由の区別（依頼要件） |
| `lead_location` | 発火元のパス（例 `/contact`） | どのページ経由の問い合わせか |
| `inquiry_subject` | 問い合わせ種別セレクトの固定値 | 相談内容の傾向把握。**自由入力ではないためPIIなし** |

サイト別の集計は GA4 組み込みディメンション **`ホスト名`** で分離できるため、専用パラメータは追加しない。

イベントの役割分担（**既存の広告用イベントには一切手を入れない**）:

| イベント | 役割 | 変更 |
| --- | --- | --- |
| `inquiry_submit` | **週次KPI（本タスクの目的）**。全サイト共通 | 新規 |
| `generate_lead` | Google広告の主コンバージョン（見積もり完了） | 変更なし |
| `contact_submit` | Google広告の補助コンバージョン（お問い合わせ） | 変更なし |
| `form_submit`（アカデミー） | 既存の集計用 | 変更なし |

補助イベント（CV到達の診断用）:

| イベント | パラメータ | 発火 |
| --- | --- | --- |
| `estimate_cta_click` | `cta_location`（`hero` / `inline` / `contact_thanks`） | AI見積もりへの導線クリック時 |

`docs/20260812_niigata_system_dev_seo_review.md` の「CTAの配置識別イベント」提案に対応する。

### B-3. 後方互換

既存イベント（`contact_submit` / `generate_lead` / `form_submit`）は **削除も改名もせず、
パラメータも変えずに継続送信**する。既存レポートと Google広告のコンバージョン設定を維持するため。
`inquiry_submit` を追加で送る二重送信構成とし、週次KPIは `inquiry_submit` 側を正とする。

### B-4. 個人情報の非送信

送信するのは `lead_type` / `lead_location` / `inquiry_subject`（固定選択肢）のみ。
氏名・メールアドレス・電話番号・会社名・自由入力本文は **一切パラメータに含めない**。
`inquiry_subject` の候補は `content/contact.ts:25-31` の5つの固定値で、自由入力ではない。

### C. コンバージョン地点の一意化

| サイト | 完了地点 | 変更 |
| --- | --- | --- |
| cloudnature.jp | `/contact/thanks` | **新規作成**。送信成功後にリダイレクト。`noindex` 指定 |
| ai.cloudnature.jp | `/complete` | 既存のまま（既に一意なURL） |
| ai-dev.cloudnature.jp | インライン完了表示 | LP単一ページ構成のため据え置き。イベントで識別 |

`/contact/thanks` への直接アクセス（bot・リロード）でCV数が水増しされないよう、
**コンバージョンはURL到達ではなくイベント `generate_lead` を正とする**。URLは人が funnel を追うための目印。

---

## 実装結果

### 変更ファイル（CloudNature / ブランチ `feat/ga4-lead-conversion-tracking`）

| ファイル | 変更内容 |
| --- | --- |
| `lib/analytics.ts` | 新規。`trackLead` / `trackEstimateCtaClick` |
| `components/shared/EstimateCtaLink.tsx` | 新規。CTAクリック計測用のクライアントコンポーネント |
| `app/contact/thanks/page.tsx` | 新規。サンクスページ（noindex） |
| `components/contact/ContactForm.tsx` | `inquiry_submit` 追加、送信成功時に `/contact/thanks` へ遷移、二重送信防止 |
| `components/home/HeroSection.tsx` | AI見積もりCTAを `EstimateCtaLink` に置換（`cta_location=hero`） |
| `components/shared/InlineCta.tsx` | 同上（`cta_location=inline`） |
| `estimate/app/chat/page.tsx` | `inquiry_submit` 追加（`generate_lead` は無変更） |
| `ai-dev/lib/analytics.ts` | 新規。欠損していたイベント送信の修正 |
| `ai-dev/components/ConsultationForm.tsx` | 壊れていた `dataLayer.push` を `trackLead` に置換 |

### 変更ファイル（niigata-ai-academy / 別リポジトリ・別PR）

| ファイル | 変更内容 |
| --- | --- |
| `src/lib/gtag/gtag.ts` | `trackLead`（`inquiry_submit`）を追加 |
| `src/components/readdy/common/ContactForm.tsx` | 送信成功時に `trackLead` を呼ぶ |

### 検証結果

| 対象 | tsc | ESLint | build |
| --- | --- | --- | --- |
| コーポレート | ✅ | ✅ | ✅ `/contact/thanks` の生成を確認 |
| estimate | ✅ | ✅ | ✅ |
| ai-dev | ✅ | ✅ | ✅ |
| niigata-ai-academy | ✅ | ✅ 既存エラー7件から増加なし | 未実行 |

## Codexレビュー結果

`gpt-5.6-sol` で作業ツリー全体をレビュー。

### 指摘と対応

| # | 重要度 | 指摘 | 対応 |
| --- | --- | --- | --- |
| 1 | 高 | `generate_lead` は Google広告に主コンバージョン（入札最適化対象）としてインポート済み。通常問い合わせを相乗りさせると入札の母集団が変わる。GA4→広告のインポートはイベント名単位のため `lead_type` では分離されない | **設計変更で対応**。統一イベントを `generate_lead` から新規の `inquiry_submit` に変更し、既存の広告用イベントは一切変更しないことにした |
| 2 | 中 | `router.push` 後に `finally` で送信ロックを解除するため、遷移待ち中に再送信でき二重計上しうる | **修正済み**。`finally` を廃止し、失敗時のみロック解除する `failAndReset` に変更（`ContactForm.tsx`）。見積もり側の再送信経路は既存挙動のため本タスクでは変更せず、下記「残課題」に記録 |
| 3 | 中 | `window.gtag` 未初期化時の `dataLayer.push({event})` フォールバックは、今回の欠損原因と同じGTM形式 | **コメントで明示**。本ヘルパーはフォーム送信成功後（ユーザー操作＋通信往復の後）にしか呼ばれず、その時点で gtag.js は初期化済みのため実質到達しない。GTM切替時のための分岐であることを明記した |

### Codexが問題なしと確認した点

- `contact_submit` を含む既存イベントの削除・改名なし
- `inquiry_subject` は `content/contact.ts:25` の5つの固定選択肢。氏名・メール・電話・自由記述がGA4へ渡る経路はない
- `submitted` state 削除による未使用変数・不正なsetStateなし。Turnstileのリセット処理も維持
- 3サイトとも同一測定ID + 本番で `.cloudnature.jp` Cookie を使用しており、サブドメイン計測の前提は妥当

## 残課題（本タスクでは未対応）

| # | 内容 | 理由 |
| --- | --- | --- |
| 1 | AI見積もりで完了ページから戻って再送信した場合、`generate_lead` / `inquiry_submit` が再発火しうる | 既存の挙動であり本タスクで新たに生じたものではない。修正は見積もりフローの状態管理の変更を伴うため別対応とする |
| 2 | niigata-ai-academy の測定IDが2系統（`G-MTJGTGMWGG` ハードコード / 環境変数 `G-EB0PYQZ1YG`）ある | 本番Vercelの環境変数値を確認できないため、どちらが正かは担当者判断。手順書の冒頭に確認事項として記載 |
| 3 | TimeRex予約完了、ステップ表示イベントの計測 | `docs/20260812_niigata_system_dev_seo_review.md` の既存提案。本タスクの目的（問い合わせ件数の取得）の範囲外 |
