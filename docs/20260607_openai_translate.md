

| 方法                  | 手軽さ | 内容                                          |
| ------------------- | --: | ------------------------------------------- |
| OpenAI Realtime API |   高 | 音声入力→翻訳→音声返答を1つのAPIで実装しやすい                  |
| Google/AWS構成        | 中〜低 | Speech-to-Text、翻訳、Text-to-Speechを組み合わせる必要あり |
| ネイティブアプリ            |   中 | iOS/Android別実装が必要                           |

結論：まずはPWAで作るのが一番早いです。

構成はこれです。

| 役割      | 技術                                                  |
| ------- | --------------------------------------------------- |
| スマホ画面   | Next.js / React                                     |
| 音声入出力   | WebRTC                                              |
| APIキー保護 | Next.js API Routes / Cloud Run / Firebase Functions |
| 翻訳AI    | OpenAI Realtime API                                 |
| 配布      | Vercel / Firebase Hosting                           |

重要なのは、スマホ側にOpenAI APIキーを置かないことです。サーバー側で一時トークンを発行し、スマホはその一時トークンでRealtime APIに接続します。

OpenAIはRealtime APIで音声エージェント構築を想定しており、音声体験向けのAPIとして案内されています。([OpenAI][1])
GoogleやAWSでも可能ですが、基本的には音声認識、翻訳、音声合成を複数APIで組み合わせる構成になります。Google Speech-to-Textは音声をテキスト化するAPI、AWS Transcribe Streamingはリアルタイム文字起こし用です。([Google Cloud Documentation][2])

実装イメージ：

```txt
スマホ
  ↓ マイク音声
WebRTC
  ↓
OpenAI Realtime API
  ↓
翻訳された音声
スマホで再生
```

最小画面：

| 画面   | 機能               |
| ---- | ---------------- |
| トップ  | 翻訳元・翻訳先言語を選択     |
| 通話画面 | マイクON/OFF、翻訳音声再生 |
| 履歴   | 翻訳テキスト表示         |

最初のMVPならこれで十分です。

```txt
日本語 → 英語
英語 → 日本語
開始ボタン
停止ボタン
翻訳テキスト表示
音声読み上げ
```

おすすめ実装順：

| 順番 | やること                      |
| -: | ------------------------- |
|  1 | Next.jsでスマホ用画面を作る         |
|  2 | サーバー側でRealtime用の一時トークンを発行 |
|  3 | スマホブラウザでマイク許可             |
|  4 | WebRTCでRealtime APIへ接続    |
|  5 | システムプロンプトで翻訳専用にする         |

プロンプト例：

```txt
You are a real-time interpreter.
Translate the user's spoken Japanese into natural English.
Do not answer questions.
Do not add explanations.
Only translate.
```

逆方向なら：

```txt
You are a real-time interpreter.
Translate the user's spoken English into natural Japanese.
Do not answer questions.
Do not add explanations.
Only translate.
```

最短で作るなら、ネイティブアプリではなく「スマホ対応Webアプリ + OpenAI Realtime API」がベストです。

[1]: https://openai.com/ja-JP/api/?utm_source=chatgpt.com "API プラットフォーム"
[2]: https://docs.cloud.google.com/speech-to-text/docs?utm_source=chatgpt.com "Cloud Speech-to-Text documentation"

---

# 実装設計（2026-06-07 追記）

## 概要

コーポレートサイト（cloudnature.jp）に日英リアルタイム音声翻訳ツールを追加する。
OpenAI Realtime API（`gpt-realtime`）+ WebRTC によるブラウザ完結構成。

**双方向自動通訳**: 言語方向の切替ボタンは設けない。入力音声の言語をモデルが自動判定し、
日本語 → 英語 / 英語 → 日本語を 1 セッション内でシームレスに通訳する
（instructions で双方向の通訳ルールを指定）。

## URL / アクセス制御

- パス: `/realtime-translate`（コーポレートサイト内・Vercel）
- 検索エンジン非掲載: `metadata.robots` で noindex、`sitemap.xml` には含めない
- 入口ページ: **使い方 + パスワード入力**（企業ロゴはヘッダーに表示されるため、ページ内には置かない）
- パスワード: 固定 **「クラウドネイチャー」**（カタカナ・ハードコーディング）
  - サーバー側（API Route）で照合する。クライアント側のみの判定にはしない
  - 認証成功後は `sessionStorage` に保持し、トークン発行のたびに再照合する

## アーキテクチャ

```txt
スマホ / PC ブラウザ
  ↓ ① POST /api/realtime-translate/session { password, direction }
Next.js API Route（Vercel・サーバー側）
  ↓ ② POST https://api.openai.com/v1/realtime/client_secrets（OPEN_AI_REALTIME_TRANSLATE_API_KEY）
  ← ③ 一時クライアントシークレット（ek_...、有効期限 10 分）
ブラウザ
  ↓ ④ WebRTC SDP offer → https://api.openai.com/v1/realtime/calls（Bearer ek_...）
  ⇄ ⑤ 音声ストリーム + DataChannel "oai-events"（文字起こしイベント）
```

- OpenAI API キーはサーバー側のみ。ブラウザには短命の一時トークンだけを渡す
- 通訳プロンプト（instructions）はセッション作成時にサーバー側で注入する

## ファイル構成

| ファイル | 役割 |
| --- | --- |
| `app/realtime-translate/page.tsx` | ページ本体（metadata: noindex） |
| `components/realtime-translate/RealtimeTranslateApp.tsx` | 画面全体（ゲート → 翻訳 UI の切替） |
| `components/realtime-translate/PasswordGate.tsx` | ロゴ + 使い方 + パスワード入力 |
| `components/realtime-translate/TranslatorPanel.tsx` | 翻訳 UI（開始/停止・マイク・履歴・戻る） |
| `components/realtime-translate/useRealtimeTranslator.ts` | WebRTC 接続・Realtime イベント処理フック |
| `content/realtime-translate.ts` | ページの UI コピー定義（プロジェクト規約に準拠） |
| `app/api/realtime-translate/session/route.ts` | パスワード照合 + 一時トークン発行 |
| `lib/rate-limit.ts` | IP レート制限の共通ヘルパー（contact ルートと共用） |

## 補足仕様

- **パスワード失効時（401）**: 保存済みパスワードでトークン発行が 401 になった場合、
  接続を破棄して自動的にゲート画面へ戻し、通知（再入力が必要）を表示する
- **履歴上限**: 翻訳履歴は直近 200 件のみ保持（長時間セッションでの DOM 肥大防止）。
  履歴クリアボタンでも手動削除可能

## API 設計

`POST /api/realtime-translate/session`

| 項目 | 内容 |
| --- | --- |
| リクエスト | `{ password: string, verifyOnly?: boolean }` |
| 200 | `{ ok: true }`（verifyOnly 時）/ `{ clientSecret, expiresAt }`（トークン発行時） |
| 401 | パスワード不一致 |
| 429 | レート制限（IP ごと 15 分 10 回・本番のみ） |
| 500 | `OPEN_AI_REALTIME_TRANSLATE_API_KEY` 未設定 / OpenAI API エラー |

## セッション設定（サーバー側で固定）

- model: `gpt-realtime`
- instructions: 双方向通訳プロンプト（入力言語を自動判定し、日 → 英 / 英 → 日へ翻訳。
  質問に答えない・説明しない・翻訳のみ）
- `audio.input.transcription.model`: `gpt-4o-mini-transcribe`（発話の文字起こし）
- `audio.input.turn_detection`: `server_vad`
- `audio.output.voice`: `marin`
- `expires_after`: 600 秒

## UI（MVP）

1. **ゲート画面**: 企業ロゴ / 使い方（3 ステップ）/ パスワード入力
2. **翻訳画面**:
   - 双方向通訳の表示（日本語 ⇄ English・自動判定。方向切替ボタンなし）
   - 戻るボタン（接続を停止し、保持中のパスワードを破棄してゲート画面へ。再入力が必要）
   - 開始 / 停止ボタン
   - マイク ON / OFF
   - 翻訳履歴（自分の発話 + 翻訳テキスト、翻訳音声は自動再生）

## 環境変数

| 変数 | 用途 |
| --- | --- |
| `OPEN_AI_REALTIME_TRANSLATE_API_KEY` | Realtime API の一時トークン発行（**新規追加**・Vercel / `.env.local`） |

※ ゲートパスワードは「クラウドネイチャー」をサーバー側コードにハードコーディング（環境変数なし）

## セキュリティ

- OpenAI API キーは Vercel のサーバー環境変数のみ。クライアントへは 10 分で失効する一時トークンのみ
- パスワード照合はサーバー側。一時トークン発行のたびに再照合
- 本番では IP ごとのレート制限（15 分 10 回）でブルートフォース・乱用を抑止
- noindex + sitemap 除外で非公開運用
