"use client";

import { useEffect, useRef } from "react";
import {
  ArrowLeft,
  ArrowLeftRight,
  Loader2,
  Mic,
  MicOff,
  Square,
  Trash2,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { TRANSLATOR_COPY } from "@/content/realtime-translate";
import { useRealtimeTranslator } from "./useRealtimeTranslator";

// 翻訳画面: 開始・停止 / マイク ON・OFF / 翻訳履歴
// 言語方向の指定は不要（話した言語を自動判定し、日↔英を双方向に通訳する）

interface TranslatorPanelProps {
  password: string;
  /** ゲート画面へ戻る（パスワード再入力が必要になる） */
  onBack: () => void;
  /** 保存済みパスワードが失効していた場合（401）の通知 */
  onAuthError: () => void;
}

const TranslatorPanel = ({ password, onBack, onAuthError }: TranslatorPanelProps) => {
  const {
    status,
    micEnabled,
    messages,
    error,
    start,
    stop,
    toggleMic,
    clearMessages,
  } = useRealtimeTranslator(onAuthError);
  const transcriptRef = useRef<HTMLDivElement | null>(null);

  // 新しい翻訳テキストが追加されたら最下部へスクロール
  // （delta ごとに発火するため、アニメーションが競合する smooth は使わない）
  useEffect(() => {
    transcriptRef.current?.scrollTo({
      top: transcriptRef.current.scrollHeight,
      behavior: "auto",
    });
  }, [messages]);

  const isActive = status === "active";
  const isConnecting = status === "connecting";

  const handleToggleSession = () => {
    if (isActive || isConnecting) {
      stop();
    } else {
      start(password);
    }
  };

  // 戻る前に接続を確実に停止する
  const handleBack = () => {
    stop();
    onBack();
  };

  return (
    <div className="mx-auto flex w-full max-w-md flex-col px-6 py-8">
      {/* 戻る（パスワード再入力が必要） */}
      <button
        type="button"
        onClick={handleBack}
        className="mb-4 flex items-center gap-1.5 self-start text-sm font-bold text-gray-500 transition-colors hover:text-teal-800"
      >
        <ArrowLeft className="h-4 w-4" aria-hidden="true" />
        {TRANSLATOR_COPY.back}
      </button>

      {/* 双方向通訳の表示（話した言語を自動判定） */}
      <div className="flex items-center justify-center gap-3 rounded-2xl bg-teal-50 py-3.5 text-sm font-bold text-teal-800">
        {TRANSLATOR_COPY.langJa}
        <ArrowLeftRight className="h-4 w-4" aria-hidden="true" />
        {TRANSLATOR_COPY.langEn}
        <span className="rounded-full bg-teal-800 px-2.5 py-0.5 text-[11px] font-bold text-white">
          {TRANSLATOR_COPY.autoDetect}
        </span>
      </div>

      {/* ステータス */}
      <div className="mt-6 flex items-center justify-center gap-2 text-sm font-bold">
        <span
          className={cn(
            "h-2.5 w-2.5 rounded-full",
            isActive ? "animate-pulse bg-sea" : "bg-gray-300"
          )}
          aria-hidden="true"
        />
        <span className={isActive ? "text-teal-800" : "text-gray-500"}>
          {isConnecting
            ? TRANSLATOR_COPY.statusConnecting
            : isActive
              ? micEnabled
                ? TRANSLATOR_COPY.statusActive
                : TRANSLATOR_COPY.statusMicOff
              : TRANSLATOR_COPY.statusIdle}
        </span>
      </div>

      {/* 翻訳履歴 */}
      <div
        ref={transcriptRef}
        aria-live="polite"
        className="mt-4 h-[40vh] min-h-56 overflow-y-auto rounded-2xl border border-teal-100 bg-white p-4 shadow-sm"
      >
        {messages.length === 0 ? (
          <p className="flex h-full items-center justify-center text-center text-sm text-gray-400">
            {TRANSLATOR_COPY.emptyTranscript}
          </p>
        ) : (
          <ul className="space-y-3">
            {messages.map((m) => (
              <li
                key={m.id}
                className={cn(
                  "max-w-[85%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed",
                  m.role === "user"
                    ? "ml-auto rounded-br-md bg-teal-800 text-white"
                    : "mr-auto rounded-bl-md bg-teal-50 text-forest"
                )}
              >
                {m.text}
              </li>
            ))}
          </ul>
        )}
      </div>

      {error ? (
        <p role="alert" className="mt-3 text-center text-sm font-bold text-red-600">
          {error}
        </p>
      ) : null}

      {/* 操作ボタン */}
      <div className="mt-6 flex items-center justify-center gap-6">
        <button
          type="button"
          onClick={clearMessages}
          disabled={messages.length === 0}
          aria-label={TRANSLATOR_COPY.clearHistory}
          className="flex h-12 w-12 items-center justify-center rounded-full border border-gray-300 bg-white text-gray-500 transition-colors hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-40"
        >
          <Trash2 className="h-5 w-5" aria-hidden="true" />
        </button>

        <button
          type="button"
          onClick={handleToggleSession}
          aria-label={
            isActive || isConnecting
              ? TRANSLATOR_COPY.stopLabel
              : TRANSLATOR_COPY.startLabel
          }
          className={cn(
            "flex h-20 w-20 items-center justify-center rounded-full text-white shadow-lg transition-all",
            isActive || isConnecting
              ? "bg-red-500 hover:bg-red-600"
              : "bg-teal-800 hover:bg-teal-700"
          )}
        >
          {isConnecting ? (
            <Loader2 className="h-8 w-8 animate-spin" aria-hidden="true" />
          ) : isActive ? (
            <Square className="h-7 w-7" aria-hidden="true" />
          ) : (
            <Mic className="h-8 w-8" aria-hidden="true" />
          )}
        </button>

        <button
          type="button"
          onClick={toggleMic}
          disabled={!isActive}
          aria-label={
            micEnabled ? TRANSLATOR_COPY.micOffLabel : TRANSLATOR_COPY.micOnLabel
          }
          aria-pressed={!micEnabled}
          className={cn(
            "flex h-12 w-12 items-center justify-center rounded-full border transition-colors disabled:cursor-not-allowed disabled:opacity-40",
            micEnabled
              ? "border-gray-300 bg-white text-gray-500 hover:bg-gray-50"
              : "border-sunset bg-sunset text-white"
          )}
        >
          {micEnabled ? (
            <Mic className="h-5 w-5" aria-hidden="true" />
          ) : (
            <MicOff className="h-5 w-5" aria-hidden="true" />
          )}
        </button>
      </div>

      <p className="mt-4 text-center text-xs leading-relaxed text-gray-400">
        {TRANSLATOR_COPY.hint1}
        <br />
        {TRANSLATOR_COPY.hint2}
      </p>
    </div>
  );
};

export default TranslatorPanel;
