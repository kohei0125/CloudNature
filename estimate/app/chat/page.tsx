"use client";

import { useEffect, useCallback, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import { Send } from "lucide-react";
import dynamic from "next/dynamic";
import type { TurnstileInstance } from "@marsidev/react-turnstile";

const Turnstile = dynamic(
  () => import("@marsidev/react-turnstile").then((mod) => mod.Turnstile),
  { ssr: false }
);
import { EstimateProvider, useEstimateSession } from "@/hooks/useEstimateSession";
import { useStepNavigation } from "@/hooks/useStepNavigation";
import { useSessionPersistence } from "@/hooks/useSessionPersistence";
import { useEstimateApi } from "@/hooks/useEstimateApi";
import { save } from "@/lib/sessionStorage";
import { reportError } from "@/lib/errorReporter";
import ChatErrorBoundary from "@/components/chat/ChatErrorBoundary";
import ProgressBar from "@/components/chat/ProgressBar";
import QuestionBubble from "@/components/chat/QuestionBubble";
import StepRenderer from "@/components/chat/StepRenderer";
import NavigationControls from "@/components/chat/NavigationControls";
import TypingIndicator from "@/components/chat/TypingIndicator";
import ErrorRetry from "@/components/chat/ErrorRetry";
import {
  STEP_MESSAGES,
  AI_MESSAGES,
  GENERATING_ESTIMATE_STAGES,
} from "@/content/estimate";
import type { StepOption } from "@/types/estimate";

// ローカルはクラウドフレアのチェックをスキップ
const IS_PRODUCTION = process.env.NEXT_PUBLIC_ENV === "production";
const TURNSTILE_SITE_KEY = IS_PRODUCTION
  ? (process.env.NEXT_PUBLIC_CLOUDFLARE_TURNSTILE_SITE_KEY ?? "")
  : "";

function ChatPageContent() {
  const router = useRouter();
  const { state, dispatch } = useEstimateSession();
  useSessionPersistence();
  const { startSession, submitStep, triggerGenerate } = useEstimateApi();
  const sessionInitRef = useRef(false);
  const stateRef = useRef(state);
  const turnstileRef = useRef<TurnstileInstance | null>(null);
  const isAdvancingRef = useRef(false);
  const isSubmittingRef = useRef(false);
  const [turnstileToken, setTurnstileToken] = useState<string | null>(null);
  const [generatingElapsedSec, setGeneratingElapsedSec] = useState(0);
  useEffect(() => {
    stateRef.current = state;
  }, [state]);

  const {
    currentStep,
    stepConfig,
    totalSteps,
    canGoNext,
    canGoBack,
    isLastStep,
    goBack,
    setAnswer,
  } = useStepNavigation();

  const currentAnswer = state.answers[currentStep] ?? (stepConfig?.type === "multi-select" ? [] : "");
  const isGenerating = state.status === "generating";
  const isError = state.status === "error";
  const isEstimateGenerating = isGenerating && !(stepConfig?.aiGenerated || currentStep === 7);

  // ステップ遷移時にスクロールをトップへリセット
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [currentStep]);

  // 見積生成中のみ経過秒数をカウントして表示メッセージを切り替える
  useEffect(() => {
    if (!isEstimateGenerating) return;

    const startMs = Date.now();
    const intervalId = window.setInterval(() => {
      const elapsedSec = Math.floor((Date.now() - startMs) / 1000);
      setGeneratingElapsedSec(elapsedSec);
    }, 1000);

    return () => {
      window.clearInterval(intervalId);
      setGeneratingElapsedSec(0);
    };
  }, [isEstimateGenerating]);

  // Initialize session on mount
  useEffect(() => {
    async function initSession() {
      if (sessionInitRef.current) return;
      if (state.sessionId) return;
      sessionInitRef.current = true;
      await startSession();
    }
    initSession();
  }, [state.sessionId, startSession]);

  // Get AI options for the current step (append "その他" for step 8)
  const aiOptions: StepOption[] | undefined = useMemo(() => {
    if (stepConfig?.aiGenerated) {
      const features = state.aiOptions.step8Features ?? [];
      return [...features, { value: "other", label: "その他" }];
    }
    return undefined;
  }, [stepConfig?.aiGenerated, state.aiOptions.step8Features]);

  const generatingEstimateMessage = useMemo(() => {
    if (generatingElapsedSec < 5) return GENERATING_ESTIMATE_STAGES[0];
    if (generatingElapsedSec < 10) return GENERATING_ESTIMATE_STAGES[1];
    if (generatingElapsedSec < 15) return GENERATING_ESTIMATE_STAGES[2];
    return GENERATING_ESTIMATE_STAGES[3];
  }, [generatingElapsedSec]);

  // Typing message for AI steps
  const typingMessage = !isGenerating
    ? undefined
    : (stepConfig?.aiGenerated || currentStep === 7)
      ? AI_MESSAGES.generatingFeatures
      : generatingEstimateMessage;

  // Handle advancing to next step (used by select auto-advance and next button)
  // Uses dispatch directly instead of goNext() to avoid stale canGoNextRef
  // after async submitStep (which temporarily sets status to "generating").
  const handleNext = useCallback(async () => {
    if (isAdvancingRef.current) return;
    isAdvancingRef.current = true;
    try {
      const { answers, sessionId } = stateRef.current;
      const answer = answers[currentStep];

      // Step 7: await AI option generation — pass all answers explicitly
      if (currentStep === 7 && sessionId && answer !== undefined) {
        const allAnswers = { ...answers, [currentStep]: answer } as Record<string, string | string[]>;
        const res = await submitStep(currentStep, answer, allAnswers);
        if (res === null) {
          // submitStep は通信失敗時に submit_step_failed を既に通知して null を返す
          dispatch({ type: "SET_STATUS", status: "error" });
          return;
        }
        if (!res.aiOptions?.step8Features?.length) {
          reportError({
            sessionId,
            errorType: "step7_ai_options_empty",
            message: "step8Features missing or empty",
            stepNumber: 7,
          });
          dispatch({ type: "SET_STATUS", status: "error" });
          return;
        }
      }

      // GA4: ステップ完了イベント
      window.gtag?.("event", "estimate_step", {
        step_number: currentStep,
        step_type: stepConfig?.type,
      });
      if (currentStep === 4) {
        const text = answers[4];
        window.gtag?.("event", "estimate_step_freetext", {
          text_length: typeof text === "string" ? text.length : 0,
        });
      }
      if (currentStep === 8) {
        const selected = answers[8];
        window.gtag?.("event", "estimate_step_ai_features", {
          selected_count: Array.isArray(selected) ? selected.length : 0,
        });
      }

      dispatch({ type: "NEXT_STEP" });
    } finally {
      isAdvancingRef.current = false;
    }
  }, [currentStep, stepConfig, dispatch, submitStep]);

  // Handle final submission — all answers are sent via triggerGenerate
  const handleSubmit = useCallback(async () => {
    if (isSubmittingRef.current) return;
    const { sessionId } = stateRef.current;
    if (!sessionId) return;
    if (TURNSTILE_SITE_KEY && !turnstileToken) return;

    isSubmittingRef.current = true;
    try {
      const token = turnstileToken ?? undefined;
      const result = await triggerGenerate(token);
      // 1回限り消費されるTurnstileトークンを失敗時の再試行のためにリセット
      turnstileRef.current?.reset();
      setTurnstileToken(null);
      if (result?.estimate) {
        window.gtag?.("event", "generate_lead", {
          session_id: stateRef.current.sessionId,
        });
        save("estimate_result", result.estimate);
        router.push("/complete");
      }
    } finally {
      isSubmittingRef.current = false;
    }
  }, [triggerGenerate, router, turnstileToken]);

  const handleRetry = useCallback(() => {
    dispatch({ type: "SET_STATUS", status: "in_progress" });
    // Step 7 はAI機能候補生成失敗で error に落ちる経路。
    // ユーザーが再選択しなくてもリトライできるよう handleNext を再実行する。
    if (stateRef.current.currentStep === 7) {
      void handleNext();
    }
  }, [dispatch, handleNext]);

  const handleExit = useCallback(() => {
    router.push("/");
  }, [router]);

  // Current step question text
  const questionText = STEP_MESSAGES[currentStep]?.question ?? "";

  // Whether this step needs a manual "next" button (text, email, multi-select)
  const needsNextButton = stepConfig?.type === "text" || stepConfig?.type === "email" || stepConfig?.type === "contact" || stepConfig?.type === "multi-select";
  const canSubmit = isLastStep && state.status !== "generating" && stepConfig !== undefined && (() => {
    const answer = state.answers[currentStep];
    if (!answer) return false;
    if (stepConfig.validation && stepConfig.validation(answer) !== null) return false;
    if (TURNSTILE_SITE_KEY && !turnstileToken) return false;
    return true;
  })();
  const canProceed = isLastStep ? canSubmit : canGoNext;

  return (
    <div className="v-stack min-h-[100dvh]">
      {/* Top navigation bar */}
      <NavigationControls
        canGoBack={canGoBack}
        onBack={goBack}
        onExit={handleExit}
      />

      {/* Header text */}
      <div className="pb-3 pt-1 text-center">
        <p className="text-sm font-medium text-gray-600">
          欲しいシステムの見積が1分で！
        </p>
      </div>

      {/* Progress bar */}
      <div className="pb-8">
        <ProgressBar currentStep={currentStep} totalSteps={totalSteps} />
      </div>

      {/* Main content area */}
      <div className="flex-1 px-4 md:px-6">
        <div className="mx-auto w-full max-w-2xl">
          <AnimatePresence mode="wait">
            {isGenerating ? (
              <TypingIndicator key="typing" message={typingMessage} />
            ) : isError ? (
              <ErrorRetry key="error" onRetry={handleRetry} />
            ) : (
              <motion.div
                key={`step-${currentStep}`}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.15 }}
                className="v-stack gap-8"
              >
                {/* Question bubble with avatar */}
                <QuestionBubble question={questionText} />

                {/* Input area */}
                {stepConfig && (
                  <div className="v-stack gap-4 pl-0 md:pl-24">
                    <StepRenderer
                      stepConfig={stepConfig}
                      value={currentAnswer}
                      onChange={setAnswer}
                      aiOptions={aiOptions}
                      onAutoAdvance={handleNext}
                    />

                    {/* Next / Submit button for text/email/multi-select steps */}
                    {needsNextButton && !isLastStep && (
                      <button
                        type="button"
                        onClick={handleNext}
                        disabled={!canGoNext}
                        className="btn-submit mt-2 w-full rounded-xl px-6 py-3.5 text-sm font-bold md:w-auto md:self-end md:text-base"
                      >
                        次へ
                      </button>
                    )}

                    {isLastStep && (
                      <>
                        {TURNSTILE_SITE_KEY && (
                          <Turnstile
                            ref={turnstileRef}
                            siteKey={TURNSTILE_SITE_KEY}
                            onSuccess={(token) => setTurnstileToken(token)}
                            onExpire={() => setTurnstileToken(null)}
                            onError={() => setTurnstileToken(null)}
                            options={{ size: "normal", theme: "light" }}
                          />
                        )}
                        <button
                          type="button"
                          onClick={handleSubmit}
                          disabled={!canProceed}
                          className="btn-submit mt-2 inline-flex w-full items-center justify-center gap-2 rounded-xl px-6 py-3.5 text-sm font-bold md:w-auto md:self-end md:text-base"
                        >
                          <Send className="h-4 w-4" />
                          送信する
                        </button>
                      </>
                    )}
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Bottom safe area spacer for mobile */}
      <div className="h-8 pb-[env(safe-area-inset-bottom)]" />
    </div>
  );
}

export default function ChatPage() {
  return (
    <EstimateProvider>
      <ChatErrorBoundary>
        <ChatPageContent />
      </ChatErrorBoundary>
    </EstimateProvider>
  );
}
