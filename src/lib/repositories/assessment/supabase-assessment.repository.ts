import { IAssessmentRepository } from './assessment.repository.interface';
import { 
  AssessmentSession, 
  AssessmentAnswer, 
  AssessmentQuestion, 
  AssessmentBranchRule,
  AssessmentScore,
  AssessmentRecommendation,
  AssessmentReport
} from '@/lib/schemas/assessment';
import { createClient } from '@/lib/supabase/server';
import { ObservabilityService } from '@/lib/services/observability.service';

export class SupabaseAssessmentRepository implements IAssessmentRepository {
  
  async getTemplateAndQuestions(versionCode: string = '1.0.0') {
    const supabase = await createClient();
    
    // 1. Get version ID
    const { data: vData, error: vError } = await supabase
      .from('assessment_template_versions')
      .select('id')
      .eq('version', versionCode)
      .single();
      
    if (vError) throw vError;
    const versionId = vData.id;

    // 2. Get questions with categories
    const { data: qData, error: qError } = await supabase
      .from('assessment_questions')
      .select('*, assessment_categories!inner(version_id)')
      .eq('assessment_categories.version_id', versionId)
      .order('order_index', { ascending: true });

    if (qError) throw qError;

    // 3. Get rules
    const { data: rData, error: rError } = await supabase
      .from('assessment_branch_rules')
      .select('*');

    if (rError) throw rError;

    return { 
      questions: qData as AssessmentQuestion[], 
      rules: rData as AssessmentBranchRule[],
      versionId
    };
  }

  async getLatestSession(organizationId: string) {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from('assessment_sessions')
      .select('*')
      .eq('organization_id', organizationId)
      .is('deleted_at', null)
      .order('created_at', { ascending: false })
      .limit(1)
      .single();
    
    if (error && error.code !== 'PGRST116') throw error;
    return { data: data as AssessmentSession | null, error: null };
  }

  async createSession(organizationId: string, versionId: string) {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from('assessment_sessions')
      .insert({ organization_id: organizationId, version_id: versionId, status: 'IN_PROGRESS' })
      .select()
      .single();
      
    if (error) throw error;
    return { data: data as AssessmentSession, error: null };
  }

  async getSessionAnswers(sessionId: string) {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from('assessment_answers')
      .select('*')
      .eq('session_id', sessionId);
      
    if (error) throw error;
    return { data: data as AssessmentAnswer[], error: null };
  }

  async saveAnswer(answer: Omit<AssessmentAnswer, 'id' | 'created_at' | 'updated_at'>) {
    const supabase = await createClient();
    const { error } = await supabase
      .from('assessment_answers')
      .upsert({
        session_id: answer.session_id,
        question_id: answer.question_id,
        selected_option_ids: answer.selected_option_ids,
        confidence_score: answer.confidence_score,
        skipped: answer.skipped,
        updated_at: new Date().toISOString()
      }, { onConflict: 'session_id,question_id' });
      
    if (error) throw error;
  }

  async finishSession(
    sessionId: string, 
    scores: AssessmentScore[], 
    recommendations: AssessmentRecommendation[],
    report: AssessmentReport
  ) {
    const supabase = await createClient();
    
    // Update session status
    await supabase.from('assessment_sessions').update({ status: 'COMPLETED', completed_at: new Date().toISOString() }).eq('id', sessionId);

    // Insert Scores
    for (const s of scores) {
      await supabase.from('assessment_scores').insert({
        session_id: s.session_id,
        index_name: s.index_name,
        score: s.score,
        formula_explanation: s.formula_explanation,
        confidence: s.confidence,
        data_points_used: s.data_points_used
      });
    }

    // Insert Recs
    for (const r of recommendations) {
      await supabase.from('assessment_recommendations').insert({
        session_id: r.session_id,
        type: r.type,
        target_code: r.target_code,
        title: r.title,
        description: r.description,
        viability: r.viability,
        justification: r.justification
      });
    }

    // Insert Report
    await supabase.from('assessment_reports').insert({
      session_id: report.session_id,
      executive_summary: report.executive_summary,
      labeled_data: report.labeled_data,
      is_reviewed: report.is_reviewed
    });
  }

  async getReport(sessionId: string) {
    const supabase = await createClient();
    const { data: report } = await supabase.from('assessment_reports').select('*').eq('session_id', sessionId).single();
    const { data: scores } = await supabase.from('assessment_scores').select('*').eq('session_id', sessionId);
    const { data: recs } = await supabase.from('assessment_recommendations').select('*').eq('session_id', sessionId);

    return { data: { report: report as AssessmentReport, scores: scores as AssessmentScore[], recommendations: recs as AssessmentRecommendation[] }, error: null };
  }
}
