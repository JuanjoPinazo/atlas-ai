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
import { LocalDB } from '@/lib/services/local-db';

export class LocalAssessmentRepository implements IAssessmentRepository {
  
  // Mock data for local testing based on ADR-0016
  private mockQuestions: AssessmentQuestion[] = [
    {
      id: 'PAC-01',
      category_id: 'PAC',
      code: 'PAC-01',
      text: '¿Existe seguimiento sistemático de presupuestos pendientes?',
      format: 'SINGLE_CHOICE',
      options: [
        { id: 'A', label: 'Sí', score: 10, mapea_a: 'ABVL-01' },
        { id: 'B', label: 'No', score: 0, mapea_a: 'ABVL-01' }
      ],
      help_context: { reason: 'Señal de mayor peso', problem: 'ABVL-01', economic_impact: 'Alta', validation_status: 'APPROVED', confianza: 0.9 },
      provisional_weight: 1,
      mandatory: true,
      order_index: 10
    },
    {
      id: 'OPE-01',
      category_id: 'OPE',
      code: 'OPE-01',
      text: '¿Qué sistema de gestión clínica (PMS) utiliza la clínica?',
      format: 'SINGLE_CHOICE',
      options: [
        { id: 'A', label: 'Gesden', score: 10, mapea_a: 'Integration Hub' },
        { id: 'B', label: 'Otro', score: 0, mapea_a: 'Integration Hub' }
      ],
      help_context: { reason: 'Integración', problem: 'Integration Hub', economic_impact: 'Alta', validation_status: 'APPROVED', confianza: 0.9 },
      provisional_weight: 1,
      mandatory: true,
      order_index: 20
    }
  ];

  async getTemplateAndQuestions(versionCode: string = '1.0.0') {
    return { questions: this.mockQuestions, rules: [], versionId: 'v1' };
  }

  async getLatestSession(organizationId: string) {
    const db = LocalDB.getDB();
    const sessions = (db.assessments || []).filter((a: any) => a.organization_id === organizationId);
    if (sessions.length === 0) return { data: null, error: null };
    sessions.sort((a: any, b: any) => new Date(b.created_at || 0).getTime() - new Date(a.created_at || 0).getTime());
    return { data: sessions[0], error: null };
  }

  async createSession(organizationId: string, versionId: string) {
    const db = LocalDB.getDB();
    if (!db.assessments) db.assessments = [];
    const session: AssessmentSession = {
      id: crypto.randomUUID(),
      organization_id: organizationId,
      version_id: versionId,
      status: 'IN_PROGRESS',
      started_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    db.assessments.push(session);
    LocalDB.saveDB(db);
    return { data: session, error: null };
  }

  async getSessionAnswers(sessionId: string) {
    // In local db, we just mock answers empty for now since it's transient
    return { data: [], error: null };
  }

  async saveAnswer(answer: Omit<AssessmentAnswer, 'id' | 'created_at' | 'updated_at'>) {
    // Mock save
  }

  async finishSession(sessionId: string, scores: AssessmentScore[], recommendations: AssessmentRecommendation[], report: AssessmentReport) {
    const db = LocalDB.getDB();
    const session = db.assessments?.find((s: any) => s.id === sessionId);
    if (session) {
      session.status = 'COMPLETED';
      session.completed_at = new Date().toISOString();
      session.scores = scores; // Just attaching for local
      session.report = report;
      session.recommendations = recommendations;
      LocalDB.saveDB(db);
    }
  }

  async getReport(sessionId: string) {
    const db = LocalDB.getDB();
    const session = db.assessments?.find((s: any) => s.id === sessionId);
    if (!session || !session.report) return { data: null, error: 'Not found' };
    return { 
      data: { 
        report: session.report, 
        scores: session.scores || [], 
        recommendations: session.recommendations || [] 
      }, 
      error: null 
    };
  }
}
