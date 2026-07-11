import { DiscoveryResult } from '../schemas/discovery';

export class DiscoveryRepository {
  static async simulateDiscoveryResult(data: any): Promise<DiscoveryResult> {
    // Artificial logic based on wizard answers to simulate AI reasoning
    return {
      id: `dis-${Date.now()}`,
      clinic_name: data.clinicName || 'Clínica Demo',
      health_score: 65,
      opportunity_score: 92,
      digital_readiness: 45,
      dimensions: [
        { name: 'Captación', score: 40 },
        { name: 'Ventas', score: 55 },
        { name: 'Fidelización', score: 30 },
        { name: 'Operaciones', score: 60 },
        { name: 'Finanzas', score: 75 }
      ],
      recommended_employees: [
        { id: 'emp-1', name: 'Dra. Aida', role: 'Asistente de Rescates' },
        { id: 'emp-2', name: 'Dr. Leo', role: 'Triaje 24/7' }
      ],
      recommended_packs: ['Atlas Dental Premium', 'Módulo de Ortodoncia Invisible'],
      business_value_opportunities: [
        { title: 'Recuperación de Cancelaciones de Última Hora', roi_estimate: 5500 },
        { title: 'Seguimiento de Presupuestos > 1000€', roi_estimate: 12000 },
        { title: 'Campaña Reactivación VIP Anual', roi_estimate: 8000 }
      ],
      total_roi_estimate: 25500,
      proposal_price: 1500,
      implementation_plan: [
        { phase: 'Fase 1: Ingesta del ADN', description: 'Extracción de conocimiento y tono.', weeks: 2 },
        { phase: 'Fase 2: Despliegue en Pruebas', description: 'Agentes en modo borrador.', weeks: 2 },
        { phase: 'Fase 3: Autonomía Controlada', description: 'Toma de decisiones supervisada.', weeks: 4 }
      ]
    };
  }
}
