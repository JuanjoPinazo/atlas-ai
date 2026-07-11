import { 
  AssessmentSession, 
  AssessmentAnswer, 
  AssessmentQuestion, 
  AssessmentBranchRule,
  AssessmentScore,
  AssessmentRecommendation,
  AssessmentReport
} from '@/lib/schemas/assessment';

export interface IAssessmentRepository {
  getTemplateAndQuestions(versionCode?: string): Promise<{ questions: AssessmentQuestion[], rules: AssessmentBranchRule[], versionId: string }>;
  getLatestSession(organizationId: string): Promise<{ data: AssessmentSession | null; error: string | null }>;
  createSession(organizationId: string, versionId: string): Promise<{ data: AssessmentSession | null; error: string | null }>;
  getSessionAnswers(sessionId: string): Promise<{ data: AssessmentAnswer[] | null; error: string | null }>;
  saveAnswer(answer: Omit<AssessmentAnswer, 'id' | 'created_at' | 'updated_at'>): Promise<void>;
  finishSession(
    sessionId: string, 
    scores: AssessmentScore[], 
    recommendations: AssessmentRecommendation[],
    report: AssessmentReport
  ): Promise<void>;
  getReport(sessionId: string): Promise<{ data: { report: AssessmentReport, scores: AssessmentScore[], recommendations: AssessmentRecommendation[] } | null; error: string | null }>;
}
