import { DiscoveryResult } from '../schemas/discovery';
import { AssessmentRepositoryFactory } from './assessment/assessment.factory';

export class DiscoveryRepository {
  static async getDiscoveryResultFromAssessment(sessionId: string): Promise<DiscoveryResult> {
    const repo = AssessmentRepositoryFactory.getRepository();
    const reportData = await repo.getReport(sessionId);

    if (!reportData.data || !reportData.data.report.is_reviewed) {
      throw new Error('No existe reporte válido o no ha sido revisado.');
    }

    const { scores, recommendations, report } = reportData.data;

    const health = scores.find(s => s.index_name === 'Health')?.score || 0;
    const opp = scores.find(s => s.index_name === 'Opportunity')?.score || 0;
    const digital = scores.find(s => s.index_name === 'Digital Readiness')?.score || 0;

    return {
      id: `dis-${Date.now()}`,
      clinic_name: 'Clínica Atlas', // This would come from org settings in a real app
      health_score: health,
      opportunity_score: opp,
      digital_readiness: digital,
      dimensions: scores.map(s => ({ name: s.index_name, score: s.score })),
      recommended_employees: recommendations.filter(r => r.type === 'Employee Designer').map(r => ({
        id: crypto.randomUUID(),
        name: r.target_code,
        role: r.title
      })),
      recommended_packs: recommendations.filter(r => r.type === 'Integration Hub').map(r => r.title),
      business_value_opportunities: recommendations.map(r => ({
        title: r.title,
        roi_estimate: 15000 // Estimated fixed ROI for now as we don't have ABVL ROI tables locally
      })),
      total_roi_estimate: recommendations.length * 15000,
      proposal_price: 1500,
      implementation_plan: recommendations.map((r, i) => ({
        phase: `Fase ${i + 1}: ${r.title}`,
        description: r.description,
        weeks: 2
      }))
    };
  }
}
