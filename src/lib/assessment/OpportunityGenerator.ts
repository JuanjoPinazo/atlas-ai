import { 
  AssessmentQuestion, 
  AssessmentAnswer, 
  AssessmentOpportunity
} from '../schemas/assessment';

export class OpportunityGenerator {
  
  static generate(
    questions: AssessmentQuestion[],
    answers: AssessmentAnswer[],
    sessionId: string
  ): AssessmentOpportunity[] {
    const opportunities: AssessmentOpportunity[] = [];

    for (const ans of answers) {
      const q = questions.find(q => q.id === ans.question_id || q.code === ans.question_id); // Fallback for code vs id
      if (!q) continue;

      const selectedOpts = q.options.filter(o => ans.selected_option_ids.includes(o.id));
      for (const opt of selectedOpts) {
        // If an option maps to a specific ABVL code and the score indicates a gap (e.g. score < 5)
        if (opt.mapea_a && (opt.mapea_a.startsWith('ABVL') || opt.mapea_a.startsWith('Integration'))) {
          if (opt.score < 5) {
            opportunities.push({
              id: crypto.randomUUID(),
              session_id: sessionId,
              category: opt.mapea_a,
              description: `Brecha detectada originada en la pregunta: ${q.text}`,
              roi_range_low: 5000,
              roi_range_high: 15000,
              confidence: q.help_context.confianza || 0.8
            });
          }
        }
      }
    }

    return opportunities;
  }
}
