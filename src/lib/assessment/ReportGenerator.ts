import { 
  AssessmentSession, 
  AssessmentScore, 
  AssessmentRecommendation, 
  AssessmentOpportunity, 
  AssessmentReport 
} from '../schemas/assessment';

export class ReportGenerator {
  static generateReport(
    session: AssessmentSession,
    scores: AssessmentScore[],
    recommendations: AssessmentRecommendation[],
    opportunities: AssessmentOpportunity[]
  ): AssessmentReport {
    
    const maturity = scores.find(s => s.index_name === 'Maturity')?.score || 0;
    
    let summary = `Informe Ejecutivo generado el ${new Date().toLocaleDateString()}.\n`;
    summary += `La organización evaluada muestra un nivel de Madurez Digital del ${maturity}%.\n`;
    summary += `Se han detectado ${opportunities.length} áreas de oportunidad críticas y ${recommendations.length} recomendaciones tecnológicas.\n`;
    
    if (maturity < 50) {
      summary += 'Se recomienda una intervención urgente en los procesos operativos para evitar fugas de capital y reducir la carga manual.';
    } else if (maturity < 80) {
      summary += 'El sistema operativo base es estable, pero requiere integración y automatización para escalar sin añadir costes fijos.';
    } else {
      summary += 'La empresa presenta una alta madurez digital. El foco debe ser la optimización avanzada y la IA predictiva.';
    }

    // Dynamic data extraction from opportunities
    const declaredData = opportunities.map(o => `Falta detectada en el flujo de ${o.category}`);
    const hypothesisData = opportunities.map(o => `La automatización de ${o.category} podría eliminar los cuellos de botella actuales.`);
    const projectionData = opportunities.map(o => `El impacto estimado de abordar ${o.category} es de hasta ${o.roi_range_high}€. `);
    
    return {
      id: crypto.randomUUID(),
      session_id: session.id,
      executive_summary: summary,
      labeled_data: {
        declared: declaredData.length > 0 ? declaredData : ['Procesos operativos declarados por el negocio como resueltos.'],
        hypothesis: hypothesisData.length > 0 ? hypothesisData : ['Mantenimiento del nivel actual de optimización.'],
        projection: projectionData.length > 0 ? projectionData : ['Escalabilidad sin aumento de fricción técnica.'],
        benchmark: ['La media del sector dental está en 45% de Madurez Digital']
      },
      is_reviewed: false
    };
  }
}
