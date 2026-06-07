"use client";

import { useState } from "react";
import { KeyRound, Languages, Loader2, Mic, Volume2 } from "lucide-react";
import { GATE_COPY } from "@/content/realtime-translate";

// ゲート画面: 企業ロゴ + 使い方 + パスワード入力
// パスワードはサーバー側（/api/realtime-translate/session）で照合する

// GATE_COPY.steps と同順のアイコン
const STEP_ICONS = [Mic, Languages, Volume2];

interface PasswordGateProps {
  onUnlock: (password: string) => void;
  /** ゲートに戻された理由の通知（パスワード失効時など） */
  notice?: string | null;
}

const PasswordGate = ({ onUnlock, notice }: PasswordGateProps) => {
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!password.trim() || submitting) return;

    setSubmitting(true);
    setError(null);
    try {
      const res = await fetch("/api/realtime-translate/session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password, verifyOnly: true }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => null);
        throw new Error(data?.error ?? GATE_COPY.fallbackError);
      }
      onUnlock(password);
    } catch (err) {
      setError(err instanceof Error ? err.message : GATE_COPY.fallbackError);
      setSubmitting(false);
    }
  };

  return (
    <div className="mx-auto w-full max-w-md px-6 py-12">
      <div className="mb-10 text-center">
        <h1 className="text-2xl font-bold text-forest">{GATE_COPY.title}</h1>
        <p className="mt-2 text-sm text-gray-500">{GATE_COPY.subtitle}</p>
      </div>

      {/* ゲートに戻された理由（パスワード失効時など） */}
      {notice ? (
        <p
          role="status"
          className="mb-6 rounded-xl bg-sunset/10 px-4 py-3 text-center text-sm font-bold text-sunset"
        >
          {notice}
        </p>
      ) : null}

      {/* 使い方 */}
      <section
        aria-label={GATE_COPY.usageTitle}
        className="mb-8 rounded-2xl border border-teal-100 bg-white p-6 shadow-sm"
      >
        <h2 className="mb-5 text-sm font-bold tracking-widest text-sage">
          {GATE_COPY.usageTitle}
        </h2>
        <ol className="space-y-5">
          {GATE_COPY.steps.map((step, index) => {
            const StepIcon = STEP_ICONS[index];
            return (
              <li key={step.title} className="flex items-start gap-4">
                <span className="relative mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-teal-50 text-teal-800">
                  <StepIcon className="h-4 w-4" aria-hidden="true" />
                  <span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-teal-800 text-[10px] font-bold text-white">
                    {index + 1}
                  </span>
                </span>
                <div>
                  <p className="text-sm font-bold text-forest">{step.title}</p>
                  <p className="mt-0.5 text-sm leading-relaxed text-gray-600">
                    {step.text}
                  </p>
                </div>
              </li>
            );
          })}
        </ol>
      </section>

      {/* パスワード入力 */}
      <form onSubmit={handleSubmit} noValidate>
        <label
          htmlFor="gate-password"
          className="mb-2 block text-sm font-bold text-forest"
        >
          {GATE_COPY.passwordLabel}
        </label>
        <div className="relative">
          <KeyRound
            className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400"
            aria-hidden="true"
          />
          <input
            id="gate-password"
            type="text"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder={GATE_COPY.passwordPlaceholder}
            autoComplete="off"
            className="w-full rounded-xl border border-gray-300 bg-white py-3 pl-11 pr-4 text-base text-forest placeholder:text-gray-400 focus:border-teal-700 focus:outline-none focus:ring-2 focus:ring-teal-700/20"
          />
        </div>
        {error ? (
          <p role="alert" className="mt-3 text-sm font-bold text-red-600">
            {error}
          </p>
        ) : null}
        <button
          type="submit"
          disabled={!password.trim() || submitting}
          className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl bg-teal-800 py-3.5 text-base font-bold text-white transition-colors hover:bg-teal-700 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {submitting ? (
            <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
          ) : null}
          {submitting ? GATE_COPY.submitting : GATE_COPY.submit}
        </button>
      </form>
    </div>
  );
};

export default PasswordGate;
