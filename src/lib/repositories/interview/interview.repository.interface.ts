import { DiscoveryInterview, DiscoveryInterviewAnswer } from '@/lib/schemas/interview';

export interface CreateInterviewPayload {
  organizationId: string;
  prospectId?: string | null;
  createdBy?: string | null;
}

export interface IInterviewRepository {
  createInterview(payload: CreateInterviewPayload): Promise<{ data: DiscoveryInterview | null; error: string | null }>;
  getInterview(id: string): Promise<{ data: DiscoveryInterview | null; error: string | null }>;
  listInterviews(organizationId: string): Promise<{ data: DiscoveryInterview[] | null; error: string | null }>;
  updateInterview(id: string, updates: Partial<DiscoveryInterview>): Promise<{ data: DiscoveryInterview | null; error: string | null }>;
  
  saveAnswer(
    interviewId: string,
    blockId: string,
    questionKey: string,
    answerText: string,
    intelligence?: any
  ): Promise<{ data: DiscoveryInterviewAnswer | null; error: string | null }>;
  
  getAnswers(interviewId: string): Promise<{ data: DiscoveryInterviewAnswer[] | null; error: string | null }>;
}
