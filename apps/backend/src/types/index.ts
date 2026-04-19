export type Stage = 
  | 'INTAKE' 
  | 'CAUSAL' 
  | 'DOMAIN' 
  | 'ROOT' 
  | 'STRATEGY' 
  | 'ROADMAP' 
  | 'ACTION' 
  | 'COMMITMENT' 
  | 'TRACKING' 
  | 'REPORT';

export interface SessionState {
  sessionId: string;
  caseId: string;
  userId: string;
  currentStage: Stage;
  history: Stage[];
  retries: number;
  maxRetries: number;
  riskFlags: string[];
  lastError?: string;
  schemaVersion: number;
}

export interface ValidationResult {
  success: boolean;
  errors: string[];
  repairedData?: any;
}

export interface StagePayload<T = any> {
  stage: Stage;
  data: T;
  timestamp: string;
  model?: string;
}
