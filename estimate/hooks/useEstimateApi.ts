"use client";

import { useCallback, useEffect, useRef } from "react";
import { useEstimateSession } from "./useEstimateSession";
import * as api from "@/lib/estimateApi";
import { AI_MESSAGES, ERROR_MESSAGES } from "@/content/estimate";
import type { ChatMessage } from "@/types/estimate";

function createMessage(
  prefix: string,
  content: string
): ChatMessage {
  return {
    id: `${prefix}-${Date.now()}`,
    role: "system",
    content,
    timestamp: Date.now(),
  };
}

export function useEstimateApi() {
  const { state, dispatch } = useEstimateSession();
  const sessionIdRef = useRef(state.sessionId);
  const stateRef = useRef(state);
  useEffect(() => {
    sessionIdRef.current = state.sessionId;
    stateRef.current = state;
  });

  const addMessage = useCallback(
    (prefix: string, content: string) => {
      dispatch({ type: "ADD_MESSAGE", message: createMessage(prefix, content) });
    },
    [dispatch]
  );

  /** Initialize a new session with the backend. */
  const startSession = useCallback(async () => {
    try {
      dispatch({ type: "SET_STATUS", status: "in_progress" });
      const res = await api.createSession();
      dispatch({ type: "SET_SESSION_ID", sessionId: res.sessionId });
      return res.sessionId;
    } catch {
      dispatch({ type: "SET_STATUS", status: "error" });
      addMessage("error", ERROR_MESSAGES.networkError);
      return null;
    }
  }, [dispatch, addMessage]);

  /** Submit a step answer and handle AI generation for steps 8-10. */
  const submitStep = useCallback(
    async (stepNumber: number, value: string | string[], allAnswers?: Record<string, string | string[]>) => {
      const sessionId = sessionIdRef.current;
      if (!sessionId) return null;

      try {
        if (stepNumber === 7) {
          dispatch({ type: "SET_STATUS", status: "generating" });
        }

        const res = await api.submitStep(sessionId, stepNumber, value, allAnswers);

        if (res.aiOptions) {
          dispatch({ type: "SET_AI_OPTIONS", payload: res.aiOptions });
        }

        if (stepNumber === 7) {
          dispatch({ type: "SET_STATUS", status: "in_progress" });
        }

        return res;
      } catch {
        if (stepNumber === 7) {
          dispatch({ type: "SET_STATUS", status: "in_progress" });
        }
        addMessage("error", ERROR_MESSAGES.networkError);
        return null;
      }
    },
    [dispatch, addMessage]
  );

  /** Poll for estimate result until complete. */
  const pollForResult = useCallback(
    async (sessionId: string) => {
      const MAX_POLLS = 30;
      const POLL_INTERVAL_MS = 2000;
      let consecutiveErrors = 0;

      for (let i = 0; i < MAX_POLLS; i++) {
        await new Promise((r) => setTimeout(r, POLL_INTERVAL_MS));

        try {
          const res = await api.getEstimateResult(sessionId);
          consecutiveErrors = 0;

          if (res.status === "completed" && res.estimate) {
            dispatch({ type: "SET_STATUS", status: "completed" });
            addMessage("system-api", AI_MESSAGES.estimateReady);
            return res;
          }

          if (res.status === "error") {
            dispatch({ type: "SET_STATUS", status: "error" });
            addMessage("error", AI_MESSAGES.error);
            return null;
          }
        } catch {
          consecutiveErrors++;
          // Abort after 5 consecutive network errors
          if (consecutiveErrors >= 5) {
            dispatch({ type: "SET_STATUS", status: "error" });
            addMessage("error", ERROR_MESSAGES.networkError);
            return null;
          }
        }
      }

      dispatch({ type: "SET_STATUS", status: "error" });
      addMessage("error", ERROR_MESSAGES.serverError);
      return null;
    },
    [dispatch, addMessage]
  );

  /** Trigger final estimate generation. */
  const triggerGenerate = useCallback(async (turnstileToken?: string) => {
    const sessionId = sessionIdRef.current;
    if (!sessionId) return null;

    try {
      dispatch({ type: "SET_STATUS", status: "generating" });
      addMessage("system-api", AI_MESSAGES.generatingEstimate);

      const answers = stateRef.current.answers as Record<string, string | string[]>;
      const res = await api.generateEstimate(sessionId, answers, turnstileToken);

      if (res.status === "completed" && res.estimate) {
        dispatch({ type: "SET_STATUS", status: "completed" });
        addMessage("system-api", AI_MESSAGES.estimateReady);
        return res;
      }

      if (res.status === "processing") {
        return pollForResult(sessionId);
      }

      dispatch({ type: "SET_STATUS", status: "error" });
      addMessage("error", AI_MESSAGES.error);
      return null;
    } catch {
      dispatch({ type: "SET_STATUS", status: "error" });
      addMessage("error", ERROR_MESSAGES.networkError);
      return null;
    }
  }, [dispatch, addMessage, pollForResult]);

  return {
    startSession,
    submitStep,
    triggerGenerate,
    pollForResult,
  };
}
