export enum DecisionState {
  CONTEXT_REQUIRED = 'CONTEXT_REQUIRED',
  READY = 'READY',
  HUMAN_APPROVAL = 'HUMAN_APPROVAL',
  POLICY_CONFLICT = 'POLICY_CONFLICT',
  BLOCKED = 'BLOCKED',
  EXECUTING = 'EXECUTING',
  VALIDATING = 'VALIDATING',
  COMPLETED = 'COMPLETED',
  FAILED = 'FAILED'
}

export interface DecisionRule {
  id: string;
  company_id: string;
  name: string;
  description?: string;
  priority: number;
  condition_schema: Record<string, any>;
  action_schema: Record<string, any>;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface DecisionLog {
  id: string;
  company_id: string;
  context_id?: string;
  rule_id?: string;
  initial_state: DecisionState;
  final_state: DecisionState;
  decision_reason?: string;
  context_snapshot: Record<string, any>;
  created_at: string;
}

export interface ValidationLog {
  id: string;
  company_id: string;
  decision_log_id?: string;
  validation_type: string;
  is_valid: boolean;
  validation_details: Record<string, any>;
  created_at: string;
}
