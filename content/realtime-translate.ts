// リアルタイム翻訳ページ（/realtime-translate）のコピー定義
// 設計: docs/20260607_openai_translate.md

export const REALTIME_TRANSLATE_META = {
  title: "リアルタイム翻訳 | 株式会社クラウドネイチャー",
  description: "日本語と英語の音声をリアルタイムで通訳するツールです。",
};

export const GATE_COPY = {
  title: "リアルタイム翻訳",
  subtitle: "日本語と英語の音声をリアルタイムで通訳します",
  usageTitle: "使い方",
  steps: [
    {
      title: "開始して話しかける",
      text: "マイクボタンを押してマイクを許可し、そのまま話しかけます。",
    },
    {
      title: "言語は自動判定",
      text: "日本語で話せば英語に、英語で話せば日本語に自動で通訳されます。",
    },
    {
      title: "翻訳音声が流れる",
      text: "翻訳された音声が自動で再生され、テキストも画面に表示されます。",
    },
  ],
  passwordLabel: "パスワード",
  passwordPlaceholder: "パスワードを入力",
  submit: "はじめる",
  submitting: "確認中...",
  fallbackError: "認証に失敗しました",
  reauthNotice: "パスワードの再入力が必要です。もう一度入力してください。",
} as const;

export const TRANSLATOR_COPY = {
  back: "戻る",
  langJa: "日本語",
  langEn: "English",
  autoDetect: "自動判定",
  statusConnecting: "接続中...",
  statusActive: "通訳中 — 話しかけてください",
  statusMicOff: "マイク OFF",
  statusIdle: "停止中",
  emptyTranscript: "翻訳テキストがここに表示されます",
  clearHistory: "履歴をクリア",
  startLabel: "翻訳を開始",
  stopLabel: "翻訳を停止",
  micOffLabel: "マイクを OFF にする",
  micOnLabel: "マイクを ON にする",
  hint1: "中央のボタンで翻訳を開始 / 停止できます。",
  hint2: "日本語で話せば英語に、英語で話せば日本語に自動で通訳されます。",
} as const;
