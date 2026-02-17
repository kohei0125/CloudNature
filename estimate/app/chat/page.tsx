"use client";

import { useEffect, useCallback, useMemo, useRef } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { AnimatePresence } from "framer-motion";
import { Send } from "lucide-react";
import { EstimateProvider, useEstimateSession } from "@/hooks/useEstimateSession";
import { useStepNavigation } from "@/hooks/useStepNavigation";
import { useSessionPersistence } from "@/hooks/useSessionPersistence";
import { useEstimateApi } from "@/hooks/useEstimateApi";
import { save } from "@/lib/sessionStorage";
import ChatErrorBoundary from "@/components/chat/ChatErrorBoundary";
import ProgressBar from "@/components/chat/ProgressBar";
import QuestionBubble from "@/components/chat/QuestionBubble";
import StepRenderer from "@/components/chat/StepRenderer";
import NavigationControls from "@/components/chat/NavigationControls";
import TypingIndicator from "@/components/chat/TypingIndicator";
import ErrorRetry from "@/components/chat/ErrorRetry";
import { STEP_MESSAGES, AI_MESSAGES } from "@/content/estimate";
import type { StepOption } from "@/types/estimate";

function ChatPageContent() {
  const router = useRouter();
  const { state, dispatch } = useEstimateSession();
  useSessionPersistence();
  const { startSession, submitStep, triggerGenerate } = useEstimateApi();
  const sessionInitRef = useRef(false);
  const stateRef = useRef(state);
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
    goNext,
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

  // Get AI options for the current step
  const aiOptions: StepOption[] | undefined = useMemo(() => {
    if (currentStep === 8) return state.aiOptions.step8Features;
    return undefined;
  }, [currentStep, state.aiOptions.step8Features]);

  // Typing message for AI steps
  const typingMessage = useMemo(() => {
    if (!isGenerating) return undefined;
    if (currentStep === 8) return AI_MESSAGES.generatingFeatures;
    return AI_MESSAGES.generatingEstimate;
  }, [isGenerating, currentStep]);

  // Handle advancing to next step (used by select auto-advance and next button)
  const handleNext = useCallback(async () => {
    const { answers, sessionId } = stateRef.current;
    const answer = answers[currentStep];

    // Submit step to backend
    if (sessionId && answer !== undefined) {
      await submitStep(currentStep, answer);
    }

    goNext();
  }, [currentStep, goNext, submitStep]);

  // Handle final submission
  const handleSubmit = useCallback(async () => {
    const { sessionId, answers } = stateRef.current;
    if (!sessionId) return;

    const lastAnswer = answers[currentStep];
    if (lastAnswer !== undefined) {
      await submitStep(currentStep, lastAnswer);
    }

    const result = await triggerGenerate();
    if (result?.estimate) {
      save("estimate_result", result.estimate);
      router.push("/complete");
    }
  }, [currentStep, submitStep, triggerGenerate, router]);

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
      {/* Logo header */}
      <div className="center py-4">
        <Image
          src="/images/header_logo.png"
          alt="CloudNature"
          width={180}
          height={40}
          className="h-8 w-auto md:h-9"
          priority
        />
      </div>

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
              <div key={`step-${currentStep}`} className="v-stack gap-8">
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
                      <button
                        type="button"
                        onClick={handleSubmit}
                        disabled={!canProceed}
                        className="btn-submit mt-2 inline-flex w-full items-center justify-center gap-2 rounded-xl px-6 py-3.5 text-sm font-bold md:w-auto md:self-end md:text-base"
                      >
                        <Send className="h-4 w-4" />
                        送信する
                      </button>
                    )}
                  </div>
                )}
              </div>
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
