// Step types
export type StepType = 'select' | 'multi-select' | 'text' | 'email' | 'contact' | 'select-text';

export type SessionStatus = 'idle' | 'in_progress' | 'generating' | 'completed' | 'error';

export interface StepOption {
  value: string;
  label: string;
}

export interface StepConfig {
  id: number;
  type: StepType;
  required: boolean;
  maxLength?: number;
  minLength?: number;
  placeholder?: string;
  aiGenerated?: boolean;
  options?: StepOption[];
  validation?: (value: string | string[]) => string | null;
}

export interface AiGeneratedOptions {
  step8Features?: StepOption[];
}

// Chat message
export interface ChatMessage {
  id: string;
  role: 'system' | 'user';
  content: string;
  timestamp: number;
}

// Session state
export interface EstimateSession {
  sessionId: string | null;
  currentStep: number;
  answers: Record<number, string | string[]>;
  messages: ChatMessage[];
  status: SessionStatus;
  consent: boolean;
  aiOptions: AiGeneratedOptions;
}

// useReducer action types
export type EstimateAction =
  | { type: 'SET_ANSWER'; stepId: number; value: string | string[] }
  | { type: 'NEXT_STEP' }
  | { type: 'PREV_STEP' }
  | { type: 'ADD_MESSAGE'; message: ChatMessage }
  | { type: 'SET_AI_OPTIONS'; payload: AiGeneratedOptions }
  | { type: 'SET_STATUS'; status: SessionStatus }
  | { type: 'SET_SESSION_ID'; sessionId: string }
  | { type: 'SET_CONSENT'; value: boolean }
  | { type: 'RESTORE_SESSION'; session: EstimateSession }
  | { type: 'RESET' };

// Feature for estimate
export interface EstimateFeature {
  name: string;
  detail: string;
  standardPrice: number;
  hybridPrice: number;
}

// Generated estimate data
export interface GeneratedEstimate {
  projectName: string;
  summary: string;
  developmentModelExplanation: string;
  features: EstimateFeature[];
  discussionAgenda: string[];
  totalCost: {
    standard: number;
    hybrid: number;
    message: string;
  };
}

// API response types
export interface SessionResponse {
  sessionId: string;
  status: SessionStatus;
}

export interface StepResponse {
  success: boolean;
  nextStep: number;
  aiOptions?: AiGeneratedOptions;
}

export interface EstimateResultResponse {
  status: 'processing' | 'completed' | 'error';
  estimate?: GeneratedEstimate;
}
