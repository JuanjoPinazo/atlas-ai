import { IInterviewRepository, CreateInterviewPayload } from './interview.repository.interface';
import { DiscoveryInterview, DiscoveryInterviewAnswer } from '@/lib/schemas/interview';

export class LocalInterviewRepository implements IInterviewRepository {
  private interviews: DiscoveryInterview[] = [];
  private answers: DiscoveryInterviewAnswer[] = [];

  async createInterview(payload: CreateInterviewPayload): Promise<{ data: DiscoveryInterview | null; error: string | null }> {
    const id = crypto.randomUUID();
    const interview: DiscoveryInterview = {
      id,
      organization_id: payload.organizationId,
      prospect_id: payload.prospectId ?? null,
      created_by: payload.createdBy ?? null,
      status: 'PENDING',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    this.interviews.push(interview);
    return { data: interview, error: null };
  }

  async getInterview(id: string): Promise<{ data: DiscoveryInterview | null; error: string | null }> {
    const interview = this.interviews.find(i => i.id === id);
    if (!interview) return { data: null, error: 'Not found' };
    return { data: interview, error: null };
  }

  async listInterviews(organizationId: string): Promise<{ data: DiscoveryInterview[] | null; error: string | null }> {
    return { data: this.interviews.filter(i => i.organization_id === organizationId), error: null };
  }

  async updateInterview(id: string, updates: Partial<DiscoveryInterview>): Promise<{ data: DiscoveryInterview | null; error: string | null }> {
    const idx = this.interviews.findIndex(i => i.id === id);
    if (idx === -1) return { data: null, error: 'Not found' };
    this.interviews[idx] = { ...this.interviews[idx], ...updates, updated_at: new Date().toISOString() };
    return { data: this.interviews[idx], error: null };
  }

  async saveAnswer(
    interviewId: string,
    blockId: string,
    questionKey: string,
    answerText: string,
    intelligence?: any
  ): Promise<{ data: DiscoveryInterviewAnswer | null; error: string | null }> {
    const existingIdx = this.answers.findIndex(a => a.interview_id === interviewId && a.block_id === blockId && a.question_key === questionKey);
    
    if (existingIdx >= 0) {
      this.answers[existingIdx] = {
        ...this.answers[existingIdx],
        answer_text: answerText,
        intelligence: intelligence || this.answers[existingIdx].intelligence,
        updated_at: new Date().toISOString()
      };
      return { data: this.answers[existingIdx], error: null };
    }

    const answer: DiscoveryInterviewAnswer = {
      id: crypto.randomUUID(),
      interview_id: interviewId,
      block_id: blockId,
      question_key: questionKey,
      answer_text: answerText,
      intelligence,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    this.answers.push(answer);
    return { data: answer, error: null };
  }

  async getAnswers(interviewId: string): Promise<{ data: DiscoveryInterviewAnswer[] | null; error: string | null }> {
    return { data: this.answers.filter(a => a.interview_id === interviewId), error: null };
  }
}
