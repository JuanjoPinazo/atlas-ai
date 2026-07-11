import { describe, it, expect } from 'vitest';
import { AssessmentEngine } from '../AssessmentEngine';
import { AssessmentQuestion, AssessmentAnswer, AssessmentBranchRule } from '@/lib/schemas/assessment';
import { ReportGenerator } from '../ReportGenerator';

describe('Atlas Business Assessment - Operational Readiness Tests', () => {

  const mockQuestions: AssessmentQuestion[] = [
    {
      id: 'q1', category_id: 'EMP-01', code: 'ABA-DEN-Q001', text: 'Q1', format: 'SINGLE_CHOICE',
      options: [{ id: 'A', label: 'Op A', score: 0 }, { id: 'B', label: 'Op B', score: 10 }],
      help_context: { reason: '', problem: '', economic_impact: '', validation_status: 'APPROVED', confianza: 1 },
      provisional_weight: 1, mandatory: true, order_index: 10
    },
    {
      id: 'q2', category_id: 'EMP-01', code: 'ABA-DEN-Q002', text: 'Q2', format: 'SINGLE_CHOICE',
      options: [{ id: 'A', label: 'Op A', score: 4, mapea_a: 'ABVL-01' }, { id: 'B', label: 'Op B', score: 10 }],
      help_context: { reason: '', problem: '', economic_impact: '', validation_status: 'APPROVED', confianza: 1 },
      provisional_weight: 1, mandatory: true, order_index: 20
    }
  ];

  it('evaluates branching rules (HIDE_QUESTION)', () => {
    const answers: AssessmentAnswer[] = [
      { id: '1', session_id: 's1', question_id: 'q1', selected_option_ids: ['A'], confidence_score: 1, skipped: false }
    ];
    const rules: AssessmentBranchRule[] = [
      { id: 'r1', question_id: 'q1', condition_option_id: 'A', action: 'HIDE_QUESTION', target_id: 'ABA-DEN-Q002' }
    ];

    const visible = AssessmentEngine.evaluateBranching(mockQuestions, answers, rules);
    expect(visible.length).toBe(1);
    expect(visible[0].code).toBe('ABA-DEN-Q001');
  });

  it('calculates the 6 specialised scoring indices', () => {
    const answers: AssessmentAnswer[] = [
      { id: '1', session_id: 's1', question_id: 'q1', selected_option_ids: ['B'], confidence_score: 1, skipped: false },
      { id: '2', session_id: 's1', question_id: 'q2', selected_option_ids: ['A'], confidence_score: 1, skipped: false }
    ];

    const scores = AssessmentEngine.calculateScores(mockQuestions, answers, 's1');
    expect(scores.length).toBe(6);
    
    const maturity = scores.find(s => s.index_name === 'Maturity');
    expect(maturity).toBeDefined();
    // q1 max 10, picked 10. q2 max 10, picked 4. total max 20, picked 14. 14/20 = 70%
    expect(maturity?.score).toBe(70);
    
    const opp = scores.find(s => s.index_name === 'Opportunity');
    expect(opp?.score).toBe(15); // 1 opportunity * 15
  });

  it('generates executive report with correct labeled sections', () => {
    const session = { id: 's1', organization_id: 'o1', version_id: 'v1', status: 'COMPLETED' as const, started_at: '', updated_at: '' };
    const scores = AssessmentEngine.calculateScores(mockQuestions, [], 's1');
    const report = ReportGenerator.generateReport(session, scores, [], []);
    
    expect(report.labeled_data).toHaveProperty('declared');
    expect(report.labeled_data).toHaveProperty('hypothesis');
    expect(report.labeled_data).toHaveProperty('projection');
    expect(report.labeled_data).toHaveProperty('benchmark');
    expect(report.is_reviewed).toBe(false);
  });

});
