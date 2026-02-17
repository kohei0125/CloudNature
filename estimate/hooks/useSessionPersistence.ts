"use client";

import { useEffect, useRef, useCallback } from "react";
import { useEstimateSession, initialSession } from "./useEstimateSession";
import { save, load, clear } from "@/lib/sessionStorage";
import type { EstimateSession } from "@/types/estimate";

const SESSION_KEY = "session";
const DEBOUNCE_MS = 500;

export function useSessionPersistence() {
  const { state, dispatch } = useEstimateSession();
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const restoredRef = useRef(false);

  // Restore session on mount (once)
  useEffect(() => {
    function restoreSession() {
      if (restoredRef.current) return;
      restoredRef.current = true;

      const saved = load<EstimateSession>(SESSION_KEY);
      if (saved && saved.currentStep > 1) {
        dispatch({ type: "RESTORE_SESSION", session: saved });
      }
    }

    restoreSession();
  }, [dispatch]);

  // Extract persistable fields (excludes messages to reduce save frequency)
  const { currentStep, answers, sessionId, status, consent, aiOptions } = state;

  // Auto-save with debounce whenever persistable fields change
  useEffect(() => {
    function saveSession() {
      if (currentStep <= 1 && Object.keys(answers).length === 0) {
        return;
      }

      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }

      timerRef.current = setTimeout(() => {
        save(SESSION_KEY, { currentStep, answers, sessionId, status, consent, aiOptions });
      }, DEBOUNCE_MS);
    }

    saveSession();

    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, [currentStep, answers, sessionId, status, consent, aiOptions]);

  // Clear saved session (e.g. on reset)
  const clearSession = useCallback(() => {
    clear(SESSION_KEY);
    dispatch({ type: "RESET" });
  }, [dispatch]);

  return { clearSession };
}
