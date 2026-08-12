# GA4管理画面 設定手順書（Organic経由の問い合わせ計測）

作成日: 2026-08-12
対象: GA4の編集者権限を持つ担当者
所要時間: 約30分（+ 反映待ち24〜48時間）

実装側の設計は `docs/20260812_organic_inquiry_tracking_review.md` を参照。

---

## この手順で実現すること

SEO Weekly Metrics の **SEO Inquiries（Organic経由の問い合わせ件数）** を、
サイト別・問い合わせ種別（通常 / AI見積もり）別に週次で取得できる状態にする。

## 前提（コード側で実装済み・デプロイ待ち）

今回追加した週次KPI用のイベントは **`inquiry_submit` の1つだけ**。

| イベント | 発火タイミング | サイト |
| --- | --- | --- |
| **`inquiry_submit`** | 問い合わせ・見積もり・相談の**送信成功時** | 全サイト共通（今回追加） |
| `estimate_cta_click` | AI見積もりへの導線クリック時 | cloudnature.jp（今回追加） |

`inquiry_submit` のパラメータ:

| パラメータ | 値 |
| --- | --- |
| `lead_type` | `contact_form`（通常問い合わせ）/ `ai_estimate`（AI見積もり）/ `training_consultation`（AI研修LP）/ `academy_consultation`（AIアカデミー） |
| `lead_location` | 発火元のパス |
| `inquiry_subject` | 問い合わせ種別セレクトの値（固定選択肢） |

> ⚠️ **既存イベントには触らないこと**
> `generate_lead`（見積もり完了）と `contact_submit`（お問い合わせ）は
> **Google広告にコンバージョンとしてインポート済み**で、`generate_lead` は
> 入札最適化の主コンバージョンです（`docs/20260410_google_ads_setup_guide.md`）。
> これらの設定は今回変更しません。今回の作業で新しく触るのは `inquiry_submit` だけです。

> ⚠️ **本手順はコードがデプロイされた後に実施すること。**
> 未デプロイの状態ではイベントが発生せず、STEP 2 の確認ができません。

---

## ⚠️ 最初に必ず確認すること

### 対象プロパティの特定

計測は **2つの別プロパティ**に分かれている。作業対象を取り違えないこと。

| サイト群 | 測定ID | 備考 |
| --- | --- | --- |
| cloudnature.jp / ai.cloudnature.jp / ai-dev.cloudnature.jp | `G-1CF4H5GXSM` | 3サブドメインで**共通**。ホスト名ディメンションで分離する |
| niigata-ai-academy.com | `G-MTJGTGMWGG` | **別プロパティ**。同じ設定を2回行う必要がある |

> ⚠️ **要確認事項（担当者しか判断できない）**:
> niigata-ai-academy のコードには測定IDが2つ存在する。
> - `src/pages/_app.page.tsx` … `G-MTJGTGMWGG` をハードコード
> - 環境変数 `NEXT_PUBLIC_GOOGLE_ANALYTICS_ID` … ローカルでは `G-EB0PYQZ1YG`
>
> **本番Vercelの環境変数の値と、実際にデータが入っているプロパティを先に確認すること。**
> 両方にデータが入っている場合、週次で参照する側を決めてから STEP 1 に進む。

---

## STEP 1. データ保持期間を14か月に変更する

週次で前年同期と比較するために必須。**デフォルトは2か月**で、過ぎたデータは戻せない。

1. GA4 を開き、左下の **管理**（歯車アイコン）をクリック
2. 「プロパティ」列で対象プロパティ（`G-1CF4H5GXSM`）が選ばれていることを確認
3. **データの収集と修正** → **データの保持** をクリック
4. 「イベントデータの保持」を **「14 か月」** に変更
5. **保存** をクリック

> 📌 この設定は過去に遡って適用されない。**最優先で実施する。**

---

## STEP 2. イベントが届いているか確認する

カスタムディメンション登録の前に、イベントが実際に届いていることを確認する。

1. **管理** → **データの表示** → **DebugView** を開く
2. 別タブで本番サイトを開き、Chrome拡張「Google Analytics Debugger」をONにする
   （拡張を使わない場合は、URL末尾に `?debug_mode=1` を付けて開く）
3. 実際にお問い合わせフォームからテスト送信する
4. DebugView のタイムラインに **`inquiry_submit`** が表示されることを確認
5. `inquiry_submit` をクリックし、パラメータに以下が含まれることを確認
   - `lead_type` = `contact_form`
   - `lead_location` = `/contact`
   - `inquiry_subject` = 選択した種別
6. **氏名・メールアドレス・電話番号がパラメータに含まれていないこと**を目視で確認する

同様に AI見積もり（ai.cloudnature.jp）でも送信し、`lead_type` = `ai_estimate` を確認する。

> ✅ ここで表示されなければ、以降の手順を進めても意味がない。実装側に差し戻すこと。
> 📌 同じタイミングで `contact_submit` や `generate_lead` も表示されるが、これは既存イベントで正常。

---

## STEP 3. カスタムディメンションを登録する

`lead_type` 等はこの登録をしないとレポートで選択できない。
**登録した時点以降のデータにのみ適用され、過去データには遡及しない。**

1. **管理** → **データの表示** → **カスタム定義** をクリック
2. **［カスタム ディメンションを作成］** をクリック
3. 以下を入力して **保存**

**① lead_type（最重要）**

| 項目 | 入力値 |
| --- | --- |
| ディメンション名 | `lead_type` |
| 範囲 | **イベント** |
| 説明 | 問い合わせ種別（通常 / AI見積もり / 研修相談） |
| イベント パラメータ | `lead_type` |

4. 同じ手順で残り3つを作成する

**② lead_location**

| 項目 | 入力値 |
| --- | --- |
| ディメンション名 | `lead_location` |
| 範囲 | **イベント** |
| イベント パラメータ | `lead_location` |

**③ inquiry_subject**

| 項目 | 入力値 |
| --- | --- |
| ディメンション名 | `inquiry_subject` |
| 範囲 | **イベント** |
| イベント パラメータ | `inquiry_subject` |

**④ cta_location**

| 項目 | 入力値 |
| --- | --- |
| ディメンション名 | `cta_location` |
| 範囲 | **イベント** |
| イベント パラメータ | `cta_location` |

> 📌 カスタムディメンションの上限は50個。現在の使用数は同じ画面で確認できる。

---

## STEP 4. `inquiry_submit` をキーイベント（旧コンバージョン）に設定する

1. **管理** → **データの表示** → **キーイベント** をクリック
2. 一覧に `inquiry_submit` があれば、右端の **「キーイベントとしてマークを付ける」トグルをON**
3. 一覧に無い場合（まだイベントが1件も届いていない場合）:
   - **［新しいキーイベント］** をクリック
   - 新しいイベント名に **`inquiry_submit`** と**正確に**入力して **保存**

> 🚫 **やってはいけないこと**
> - `inquiry_submit` を **Google広告にインポートしないこと**。
>   既存の `generate_lead` / `contact_submit` と二重計上になり、広告のCV数が水増しされる。
> - 既存の `generate_lead` / `contact_submit` のキーイベント設定を**変更・解除しないこと**。
>   広告の入札最適化が停止する。

---

## STEP 5. 週次レポート（探索）を作成する

Organic経由の問い合わせ件数を取り出すレポートを作る。

1. 左メニューの **探索** をクリック
2. **［空白］**（新しい探索を作成）を選択
3. 左の「変数」列を以下のように設定する

**ディメンションを追加**（＋ボタン → 検索して選択 → インポート）
- `セッションのデフォルト チャネル グループ`
- `ホスト名`
- `lead_type`

**指標を追加**
- `イベント数`

4. 「設定」列（中央）に以下をドラッグ＆ドロップする

| 項目 | 設定値 |
| --- | --- |
| 行 | `ホスト名`、`lead_type` |
| 値 | `イベント数` |

5. 「設定」列の **フィルタ** に以下を2つ追加する
   - `イベント名` … 完全一致 … `inquiry_submit`
   - `セッションのデフォルト チャネル グループ` … 完全一致 … `Organic Search`
6. 右上の期間を **前週の月曜〜日曜** に設定する
7. 左上の探索名を **「週次 Organic問い合わせ数」** に変更して保存

これで「ホスト名 × 問い合わせ種別」のOrganic経由件数が表示される。
毎週この探索を開き、期間を変えるだけで SEO Inquiries の値が取得できる。

**読み方の例**

| ホスト名 | lead_type | イベント数 |
| --- | --- | --- |
| cloudnature.jp | contact_form | 3 |
| ai.cloudnature.jp | ai_estimate | 5 |

→ cloudnature.jp の SEO Inquiries は **3**、AI見積もり経由は **5**、合計 **8**。

---

## STEP 6.（任意）自動取得用のAPI設定

Notion「SEO Growth OS」へ週次で自動連携する場合。
GCPプロジェクト `cloudnature-apps-script`（番号 `732878044533`）に
Google Analytics Data API は有効化済み（`docs/20260429_apps_script_ga4_permission_fix.md` 参照）。

### プロパティIDの確認

測定ID（`G-`で始まる）ではなく**数値のプロパティID**が必要。
**管理** → **プロパティの詳細** の右上に表示される9桁程度の数値を控える。

### runReport のリクエストボディ

```json
{
  "dateRanges": [{ "startDate": "2026-08-04", "endDate": "2026-08-10" }],
  "dimensions": [
    { "name": "hostName" },
    { "name": "customEvent:lead_type" }
  ],
  "metrics": [{ "name": "eventCount" }],
  "dimensionFilter": {
    "andGroup": {
      "expressions": [
        {
          "filter": {
            "fieldName": "eventName",
            "stringFilter": { "matchType": "EXACT", "value": "inquiry_submit" }
          }
        },
        {
          "filter": {
            "fieldName": "sessionDefaultChannelGroup",
            "stringFilter": { "matchType": "EXACT", "value": "Organic Search" }
          }
        }
      ]
    }
  }
}
```

> 📌 `customEvent:lead_type` は **STEP 3 の登録後**でないと使えない。
> 登録前の期間を指定すると `(not set)` になる。

---

## STEP 7. niigata-ai-academy.com にも同じ設定を行う

プロパティ `G-MTJGTGMWGG`（※冒頭の要確認事項を解決してから）に対して、
**STEP 1 / 3 / 4 / 5 を同じ手順で繰り返す**。

- STEP 3 で登録するのは `lead_type` / `lead_location` / `inquiry_subject` の3つ
  （`cta_location` はアカデミー側には無いため不要）
- STEP 4 では既存の `form_submit` および Google広告のコンバージョン設定を変更しないこと
  （`inquiry_submit` と二重計上になる）

---

## 完了チェックリスト

- [ ] データ保持期間を14か月に変更した（両プロパティ）
- [ ] DebugViewで `inquiry_submit` と `lead_type` を確認した
- [ ] パラメータに個人情報が含まれていないことを目視確認した
- [ ] カスタムディメンション4つを登録した
- [ ] `inquiry_submit` をキーイベントに設定した
- [ ] `inquiry_submit` を Google広告にインポート**していない**
- [ ] 既存の `generate_lead` / `contact_submit` / `form_submit` の設定を変更していない
- [ ] 探索レポート「週次 Organic問い合わせ数」を保存した
- [ ] niigata-ai-academy 側でも同じ設定を行った

---

## 注意点

- **反映待ち**: キーイベント・カスタムディメンションは標準レポートへの反映に最大24〜48時間かかる。
  DebugViewとリアルタイムレポートは即時反映される。
- **遡及しない**: カスタムディメンションもキーイベントも、設定した時点より前のデータには適用されない。
  そのため SEO Weekly Metrics の**過去12週分は引き続き「未取得(計測未設定)」のまま**とし、
  設定完了週から実測値の記録を開始すること（0埋めしないこと）。
- **`/contact/thanks` の到達数をCV数として使わないこと**。リロードや直接アクセスで水増しされる。
  件数は必ずイベント `inquiry_submit` を正とする。
