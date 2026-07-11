export type AssessmentCategory = 'OPERATIONS' | 'FINANCE' | 'PATIENT_EXPERIENCE' | 'MARKETING';

export type AssessmentSessionStatus = 'DRAFT' | 'IN_PROGRESS' | 'COMPLETED' | 'REVIEWED';

export interface AssessmentOption {
  id: string;
  label: string;
  score: number;
  mapea_a?: string;
  profundiza_si?: boolean;
}

export interface AssessmentQuestion {
  id: string;
  category_id: string;
  code: string;
  text: string;
  format: 'SINGLE_CHOICE' | 'MULTIPLE_CHOICE';
  options: AssessmentOption[];
  help_context: {
    reason: string;
    problem: string;
    economic_impact: string;
    validation_status: string;
    confianza: number;
  };
  provisional_weight: number;
  mandatory: boolean;
  order_index: number;
}

export interface AssessmentBranchRule {
  id: string;
  question_id: string;
  condition_option_id: string;
  action: 'SHOW_QUESTION' | 'HIDE_QUESTION' | 'END_ASSESSMENT';
  target_id: string;
}

export interface AssessmentSession {
  id: string;
  organization_id: string;
  version_id: string;
  status: AssessmentSessionStatus;
  started_at: string;
  completed_at?: string;
  updated_at: string;
}

export interface AssessmentAnswer {
  id: string;
  session_id: string;
  question_id: string;
  selected_option_ids: string[];
  confidence_score: number;
  skipped: boolean;
  skipped_reason?: string;
}

export interface AssessmentScore {
  id: string;
  session_id: string;
  index_name: 'Maturity' | 'Opportunity' | 'Health' | 'Digital Readiness' | 'Business DNA' | 'Employee Readiness';
  score: number;
  formula_explanation: string;
  confidence: number;
  data_points_used: any;
}

export interface AssessmentRecommendation {
  id: string;
  session_id: string;
  type: 'ABVL' | 'Employee Designer' | 'Integration Hub' | 'Knowledge Pack';
  target_code: string;
  title: string;
  description: string;
  viability: 'AVAILABLE' | 'DEMO_ONLY' | 'INCOMPATIBLE';
  justification: string;
}

export interface AssessmentOpportunity {
  id: string;
  session_id: string;
  category: string;
  description: string;
  roi_range_low: number;
  roi_range_high: number;
  confidence: number;
}

export interface AssessmentReport {
  id: string;
  session_id: string;
  executive_summary: string;
  labeled_data: {
    declared: string[];
    hypothesis: string[];
    projection: string[];
    benchmark: string[];
  };
  is_reviewed: boolean;
  reviewed_at?: string;
  reviewed_by?: string;
}
