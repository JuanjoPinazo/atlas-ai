export type InterviewStatus = 'PENDING' | 'IN_PROGRESS' | 'COMPLETED' | 'REVIEWED';
export type EconomicImpact = 'LOW' | 'MEDIUM' | 'HIGH' | 'VERY_HIGH' | null;

export interface DiscoveryInterview {
  id: string;
  organization_id: string;
  prospect_id?: string | null;
  created_by?: string | null;
  status: 'PENDING' | 'IN_PROGRESS' | 'COMPLETED' | 'REVIEWED';
  clinic_name?: string;
  interviewee_name?: string;
  interviewee_role?: string;
  consultant_name?: string;
  interview_date?: string;
  duration_minutes?: number;
  general_notes?: string;
  summary_generated?: any;
  created_at: string;
  updated_at: string;
}

export interface InterviewIntelligence {
  pain_level?: number; // 1-5
  economic_impact?: 'LOW' | 'MEDIUM' | 'HIGH' | 'VERY_HIGH';
  affected_area?: string;
  observations?: string;
  ideas?: string;
  needs_deep_dive?: boolean;
  literal_quotes?: string;
}

export interface DiscoveryInterviewAnswer {
  id: string;
  interview_id: string;
  block_id: string;
  question_key: string;
  answer_text?: string;
  intelligence?: InterviewIntelligence;
  created_at: string;
  updated_at: string;
}
