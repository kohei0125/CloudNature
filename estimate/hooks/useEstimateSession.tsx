"use client";

import {
  createContext,
  useContext,
  useReducer,
  type ReactNode,
} from "react";
import type {
  EstimateSession,
  EstimateAction,
  SessionStatus,
} from "@/types/estimate";
import { TOTAL_STEPS } from "@/lib/stepConfig";

// ---------------------------------------------------------------------------
// Initial state
// ---------------------------------------------------------------------------
export const initialSession: EstimateSession = {
  sessionId: null,
  currentStep: 1,
  answers: {},
  messages: [],
  status: "idle",
  consent: false,
  aiOptions: {},
};

// ---------------------------------------------------------------------------
// Reducer
// ---------------------------------------------------------------------------
function estimateReducer(
  state: EstimateSession,
  action: EstimateAction
): EstimateSession {
  switch (action.type) {
    case "SET_ANSWER":
      return {
        ...state,
        answers: { ...state.answers, [action.stepId]: action.value },
      };

    case "NEXT_STEP":
      return {
        ...state,
        currentStep: Math.min(state.currentStep + 1, TOTAL_STEPS),
      };

    case "PREV_STEP":
      return {
        ...state,
        currentStep: Math.max(state.currentStep - 1, 1),
      };

    case "ADD_MESSAGE":
      return {
        ...state,
        messages: [...state.messages, action.message],
      };

    case "SET_AI_OPTIONS":
      return {
        ...state,
        aiOptions: { ...state.aiOptions, ...action.payload },
      };

    case "SET_STATUS":
      return { ...state, status: action.status };

    case "SET_SESSION_ID":
      return { ...state, sessionId: action.sessionId };

    case "SET_CONSENT":
      return { ...state, consent: action.value };

    case "RESTORE_SESSION":
      return {
        ...initialSession,
        ...action.session,
        messages: Array.isArray(action.session.messages)
          ? action.session.messages
          : [],
      };

    case "RESET":
      return { ...initialSession };

    default:
      return state;
  }
}

// ---------------------------------------------------------------------------
// Context
// ---------------------------------------------------------------------------
interface EstimateContextValue {
  state: EstimateSession;
  dispatch: React.Dispatch<EstimateAction>;
}

const EstimateContext = createContext<EstimateContextValue | null>(null);

// ---------------------------------------------------------------------------
// Provider
// ---------------------------------------------------------------------------
export function EstimateProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(estimateReducer, initialSession);

  return (
    <EstimateContext.Provider value={{ state, dispatch }}>
      {children}
    </EstimateContext.Provider>
  );
}

// ---------------------------------------------------------------------------
// Hook
// ---------------------------------------------------------------------------
export function useEstimateSession() {
  const ctx = useContext(EstimateContext);
  if (!ctx) {
    throw new Error(
      "useEstimateSession must be used within an EstimateProvider"
    );
  }
  return ctx;
}

// ---------------------------------------------------------------------------
// Convenience selectors
// ---------------------------------------------------------------------------
export function useCurrentStep() {
  const { state } = useEstimateSession();
  return state.currentStep;
}

export function useSessionStatus(): SessionStatus {
  const { state } = useEstimateSession();
  return state.status;
}
