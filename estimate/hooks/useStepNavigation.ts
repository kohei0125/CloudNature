"use client";

import { useCallback, useEffect, useMemo, useRef } from "react";
import { useEstimateSession } from "./useEstimateSession";
import { getStepConfig, TOTAL_STEPS } from "@/lib/stepConfig";
import type { StepConfig } from "@/types/estimate";

export function useStepNavigation() {
  const { state, dispatch } = useEstimateSession();
  const { currentStep, answers, aiOptions, status } = state;

  const stepConfig = useMemo(
    () => getStepConfig(currentStep),
    [currentStep]
  );

  // Check if the current step has a valid answer
  const isCurrentStepValid = useMemo(() => {
    if (!stepConfig) return false;
    return validateStep(stepConfig, answers[currentStep]);
  }, [stepConfig, currentStep, answers]);

  // Check if AI-generated steps have their options ready
  const isAiStepReady = useMemo(() => {
    if (!stepConfig?.aiGenerated) return true;

    switch (currentStep) {
      case 8:
        return (
          aiOptions.step8Features !== undefined &&
          aiOptions.step8Features.length > 0
        );
      default:
        return true;
    }
  }, [stepConfig, currentStep, aiOptions]);

  const canGoNext =
    currentStep < TOTAL_STEPS &&
    status !== "generating" &&
    isCurrentStepValid;

  const canGoBack = currentStep > 1 && status !== "generating";

  const isLastStep = currentStep === TOTAL_STEPS;

  // Refs so that goNext/goBack always read the latest value,
  // even when called from a stale closure (e.g. SelectInput auto-advance).
  const canGoNextRef = useRef(canGoNext);
  const canGoBackRef = useRef(canGoBack);
  useEffect(() => {
    canGoNextRef.current = canGoNext;
    canGoBackRef.current = canGoBack;
  });

  const goNext = useCallback(() => {
    if (canGoNextRef.current) {
      dispatch({ type: "NEXT_STEP" });
    }
  }, [dispatch]);

  const goBack = useCallback(() => {
    if (canGoBackRef.current) {
      dispatch({ type: "PREV_STEP" });
    }
  }, [dispatch]);

  const setAnswer = useCallback(
    (value: string | string[]) => {
      dispatch({ type: "SET_ANSWER", stepId: currentStep, value });
    },
    [currentStep, dispatch]
  );

  const progress = Math.round((currentStep / TOTAL_STEPS) * 100);

  return {
    currentStep,
    stepConfig,
    totalSteps: TOTAL_STEPS,
    isCurrentStepValid,
    isAiStepReady,
    canGoNext,
    canGoBack,
    isLastStep,
    goNext,
    goBack,
    setAnswer,
    progress,
  };
}

// ---------------------------------------------------------------------------
// Validation helper
// ---------------------------------------------------------------------------
function validateStep(
  config: StepConfig,
  answer: string | string[] | undefined
): boolean {
  // Optional step with no answer is valid
  if (!config.required && (answer === undefined || answer === "")) {
    return true;
  }

  // Required step must have an answer
  if (config.required && (answer === undefined || answer === "")) {
    return false;
  }

  // Multi-select must have at least one selection
  if (config.type === "multi-select") {
    if (!Array.isArray(answer) || answer.length === 0) {
      return config.required ? false : true;
    }
  }

  // Custom validation
  if (config.validation && answer !== undefined) {
    const error = config.validation(answer);
    if (error) return false;
  }

  return true;
}
