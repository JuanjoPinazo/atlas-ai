import { createClient } from '@/lib/supabase/server';
import { IInterviewRepository, CreateInterviewPayload } from './interview.repository.interface';
import { DiscoveryInterview, DiscoveryInterviewAnswer } from '@/lib/schemas/interview';

export class SupabaseInterviewRepository implements IInterviewRepository {
  async createInterview(payload: CreateInterviewPayload): Promise<{ data: DiscoveryInterview | null; error: string | null }> {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from('discovery_interviews')
      .insert({ 
        organization_id: payload.organizationId,
        prospect_id: payload.prospectId ?? null,
        created_by: payload.createdBy ?? null,
        status: 'PENDING' 
      })
      .select()
      .single();

    if (error) return { data: null, error: error.message };
    return { data, error: null };
  }

  async getInterview(id: string): Promise<{ data: DiscoveryInterview | null; error: string | null }> {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from('discovery_interviews')
      .select('*')
      .eq('id', id)
      .single();

    if (error) return { data: null, error: error.message };
    return { data, error: null };
  }

  async listInterviews(organizationId: string): Promise<{ data: DiscoveryInterview[] | null; error: string | null }> {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from('discovery_interviews')
      .select('*')
      .eq('organization_id', organizationId)
      .is('deleted_at', null)
      .order('created_at', { ascending: false });

    if (error) return { data: null, error: error.message };
    return { data, error: null };
  }

  async updateInterview(id: string, updates: Partial<DiscoveryInterview>): Promise<{ data: DiscoveryInterview | null; error: string | null }> {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from('discovery_interviews')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) return { data: null, error: error.message };
    return { data, error: null };
  }

  async saveAnswer(
    interviewId: string,
    blockId: string,
    questionKey: string,
    answerText: string,
    intelligence?: any
  ): Promise<{ data: DiscoveryInterviewAnswer | null; error: string | null }> {
    const supabase = await createClient();
    
    // Upsert equivalent logic
    const { data: existing } = await supabase
      .from('discovery_interview_answers')
      .select('id, intelligence')
      .eq('interview_id', interviewId)
      .eq('block_id', blockId)
      .eq('question_key', questionKey)
      .single();

    let mergedIntelligence = intelligence;
    if (existing && existing.intelligence && intelligence) {
      mergedIntelligence = { ...existing.intelligence, ...intelligence };
    }

    if (existing) {
      const { data, error } = await supabase
        .from('discovery_interview_answers')
        .update({ answer_text: answerText, intelligence: mergedIntelligence || existing.intelligence })
        .eq('id', existing.id)
        .select()
        .single();
      if (error) return { data: null, error: error.message };
      return { data, error: null };
    } else {
      const { data, error } = await supabase
        .from('discovery_interview_answers')
        .insert({
          interview_id: interviewId,
          block_id: blockId,
          question_key: questionKey,
          answer_text: answerText,
          intelligence: intelligence || {}
        })
        .select()
        .single();
      if (error) return { data: null, error: error.message };
      return { data, error: null };
    }
  }

  async getAnswers(interviewId: string): Promise<{ data: DiscoveryInterviewAnswer[] | null; error: string | null }> {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from('discovery_interview_answers')
      .select('*')
      .eq('interview_id', interviewId);

    if (error) return { data: null, error: error.message };
    return { data, error: null };
  }
}
