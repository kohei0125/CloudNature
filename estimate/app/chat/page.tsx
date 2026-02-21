"use client";

import { useEffect, useCallback, useMemo, useRef } from "react";
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
import { parseContact } from "@/lib/utils";
import { sendEstimateEmail } from "@/lib/estimateApi";
import { TOTAL_STEPS } from "@/lib/stepConfig";
import ChatErrorBoundary from "@/components/chat/ChatErrorBoundary";
import ProgressBar from "@/components/chat/ProgressBar";
import QuestionBubble from "@/components/chat/QuestionBubble";
import StepRenderer from "@/components/chat/StepRenderer";
import NavigationControls from "@/components/chat/NavigationControls";
import TypingIndicator from "@/components/chat/TypingIndicator";
import ErrorRetry from "@/components/chat/ErrorRetry";
import { STEP_MESSAGES, AI_MESSAGES } from "@/content/estimate";
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
  const turnstileTokenRef = useRef<string | null>(null);
  useEffect(() => {
    stateRef.current = state;
  });

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

  // Typing message for AI steps
  const typingMessage = !isGenerating
    ? undefined
    : (stepConfig?.aiGenerated || currentStep === 7)
      ? AI_MESSAGES.generatingFeatures
      : AI_MESSAGES.generatingEstimate;

  // Handle advancing to next step (used by select auto-advance and next button)
  // Uses dispatch directly instead of goNext() to avoid stale canGoNextRef
  // after async submitStep (which temporarily sets status to "generating").
  const handleNext = useCallback(async () => {
    const { answers, sessionId } = stateRef.current;
    const answer = answers[currentStep];

    // Step 7: await AI option generation — pass all answers explicitly
    if (currentStep === 7 && sessionId && answer !== undefined) {
      const allAnswers = { ...answers, [currentStep]: answer } as Record<string, string | string[]>;
      await submitStep(currentStep, answer, allAnswers);
    }

    dispatch({ type: "NEXT_STEP" });
  }, [currentStep, dispatch, submitStep]);

  // Handle final submission — all answers are sent via triggerGenerate
  const handleSubmit = useCallback(async () => {
    const { sessionId } = stateRef.current;
    if (!sessionId) return;

    const token = turnstileTokenRef.current ?? undefined;
    const result = await triggerGenerate(token);
    // Reset Turnstile for potential retry
    turnstileRef.current?.reset();
    turnstileTokenRef.current = null;
    if (result?.estimate) {
      save("estimate_result", result.estimate);

      // Fire-and-forget email send
      const rawContact = stateRef.current.answers[TOTAL_STEPS];
      if (typeof rawContact === "string") {
        const contact = parseContact(rawContact);
        if (contact.email) {
          sendEstimateEmail(result.estimate, contact.name, contact.email, contact.company);
        }
      }

      router.push("/complete");
    }
  }, [triggerGenerate, router]);

  const handleRetry = useCallback(() => {
    dispatch({ type: "SET_STATUS", status: "in_progress" });
  }, [dispatch]);

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
    if (stepConfig.validation) return stepConfig.validation(answer) === null;
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
                            onSuccess={(token) => { turnstileTokenRef.current = token; }}
                            onExpire={() => { turnstileTokenRef.current = null; }}
                            options={{ size: "compact", theme: "light" }}
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
