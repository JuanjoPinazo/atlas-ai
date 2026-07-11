import { 
  AssessmentQuestion, 
  AssessmentAnswer, 
  AssessmentScore, 
  AssessmentBranchRule,
  AssessmentRecommendation
} from '../schemas/assessment';
import { OpportunityGenerator } from './OpportunityGenerator';

export class AssessmentEngine {
  
  static evaluateBranching(
    questions: AssessmentQuestion[],
    answers: AssessmentAnswer[],
    rules: AssessmentBranchRule[]
  ): AssessmentQuestion[] {
    const visibleQuestions: AssessmentQuestion[] = [];
    const hideList = new Set<string>();

    for (const rule of rules) {
      const answer = answers.find(a => a.question_id === rule.question_id);
      if (answer && answer.selected_option_ids.includes(rule.condition_option_id)) {
        if (rule.action === 'HIDE_QUESTION') {
          hideList.add(rule.target_id);
        }
      }
    }

    for (const q of questions) {
      if (!hideList.has(q.code)) {
        visibleQuestions.push(q);
      }
    }

    return visibleQuestions;
  }

  static calculateScores(
    questions: AssessmentQuestion[],
    answers: AssessmentAnswer[],
    sessionId: string
  ): AssessmentScore[] {
    
    // Group categories
    const sumByCategory: Record<string, { actual: number, max: number }> = {
      EMP: { actual: 0, max: 0 },
      PER: { actual: 0, max: 0 },
      PAC: { actual: 0, max: 0 },
      SRV: { actual: 0, max: 0 },
      AGE: { actual: 0, max: 0 },
      REC: { actual: 0, max: 0 },
      MKT: { actual: 0, max: 0 },
      FIN: { actual: 0, max: 0 },
      OPE: { actual: 0, max: 0 },
    };

    let confidenceSum = 0;

    for (const answer of answers) {
      const q = questions.find(q => q.id === answer.question_id || q.code === answer.question_id);
      if (!q) continue;

      const cat = q.category_id.substring(0, 3); // Extracted from EMP-01 etc or explicit category_id
      if (!sumByCategory[cat]) sumByCategory[cat] = { actual: 0, max: 0 };

      const selectedOpts = q.options.filter(o => answer.selected_option_ids.includes(o.id));
      for (const opt of selectedOpts) {
        sumByCategory[cat].actual += opt.score * q.provisional_weight;
      }
      
      const maxOpt = Math.max(...q.options.map(o => o.score));
      sumByCategory[cat].max += maxOpt * q.provisional_weight;
      confidenceSum += q.help_context.confianza || 1.0;
    }

    const getPerc = (cats: string[]) => {
      let actual = 0; let max = 0;
      cats.forEach(c => {
        if (sumByCategory[c]) {
          actual += sumByCategory[c].actual;
          max += sumByCategory[c].max;
        }
      });
      return max > 0 ? (actual / max) * 100 : 0;
    };

    const maturityValue = getPerc(['EMP', 'PER', 'OPE']);
    const healthValue = getPerc(['PAC', 'REC', 'MKT']);
    const digitalValue = getPerc(['OPE', 'AGE']);
    const dnaValue = getPerc(['EMP', 'PER']); // specific questions ideally, but simplified for aggregate
    const employeeValue = getPerc(['PER']);
    
    const opps = OpportunityGenerator.generate(questions, answers, sessionId);
    // Real opportunity calculation based on detected gaps
    const opportunityValue = opps.length > 0 ? Math.min(100, opps.length * 15) : 0;

    const avgConfidence = answers.length > 0 ? confidenceSum / answers.length : 1.0;

    return [
      {
        id: crypto.randomUUID(),
        session_id: sessionId,
        index_name: 'Maturity',
        score: Math.round(maturityValue),
        formula_explanation: 'Patrón de respuestas de las categorías Empresa, Personas y Operaciones.',
        confidence: avgConfidence,
        data_points_used: { categories: ['EMP', 'PER', 'OPE'] }
      },
      {
        id: crypto.randomUUID(),
        session_id: sessionId,
        index_name: 'Opportunity',
        score: Math.round(opportunityValue),
        formula_explanation: 'Suma ponderada de las oportunidades detectadas (ABVL).',
        confidence: avgConfidence,
        data_points_used: { opportunities: opps.length }
      },
      {
        id: crypto.randomUUID(),
        session_id: sessionId,
        index_name: 'Health',
        score: Math.round(healthValue),
        formula_explanation: 'Agregación de respuestas de categorías de estado actual (Paciente, Recepción, Marketing).',
        confidence: avgConfidence,
        data_points_used: { categories: ['PAC', 'REC', 'MKT'] }
      },
      {
        id: crypto.randomUUID(),
        session_id: sessionId,
        index_name: 'Digital Readiness',
        score: Math.round(digitalValue),
        formula_explanation: 'Agregación de respuestas de Operaciones y Agenda sobre sistemas ya digitalizados.',
        confidence: avgConfidence,
        data_points_used: { categories: ['OPE', 'AGE'] }
      },
      {
        id: crypto.randomUUID(),
        session_id: sessionId,
        index_name: 'Business DNA',
        score: Math.round(dnaValue),
        formula_explanation: 'Agregación de Empresa y Personas sobre claridad de criterio de decisión.',
        confidence: avgConfidence,
        data_points_used: { categories: ['EMP', 'PER'] }
      },
      {
        id: crypto.randomUUID(),
        session_id: sessionId,
        index_name: 'Employee Readiness',
        score: Math.round(employeeValue),
        formula_explanation: 'Agregación de respuestas de Personas sobre apertura al cambio.',
        confidence: avgConfidence,
        data_points_used: { categories: ['PER'] }
      }
    ];
  }

  static generateRecommendations(
    questions: AssessmentQuestion[],
    answers: AssessmentAnswer[],
    sessionId: string
  ): AssessmentRecommendation[] {
    const recommendations: AssessmentRecommendation[] = [];
    
    // We base recommendations entirely on generated opportunities to avoid mocks
    const opps = OpportunityGenerator.generate(questions, answers, sessionId);

    for (const opp of opps) {
      if (opp.category === 'Integration Hub') {
        recommendations.push({
          id: crypto.randomUUID(),
          session_id: sessionId,
          type: 'Integration Hub',
          target_code: 'PMS Integration',
          title: 'Conectar Sistema de Gestión Clínica',
          description: 'Se ha detectado uso de software externo que puede ser integrado para automatizar agendas y presupuestos.',
          viability: 'AVAILABLE',
          justification: 'Impacto directo en Digital Readiness'
        });
      } else {
        recommendations.push({
          id: crypto.randomUUID(),
          session_id: sessionId,
          type: 'Employee Designer',
          target_code: opp.category,
          title: `Implantar automatización para ${opp.category}`,
          description: `Resolver brecha operativa prioritaria detectada.`,
          viability: 'AVAILABLE',
          justification: 'Mejora del Opportunity Score'
        });
      }
    }

    return recommendations;
  }
}
