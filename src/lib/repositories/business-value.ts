import { ValueOpportunity } from '../schemas/business-value';

export class BusinessValueRepository {
  static async getOpportunities(): Promise<ValueOpportunity[]> {
    // Simulated demo data
    return [
      {
        id: 'opt-1',
        title: 'Recuperar 23 Presupuestos Estancados',
        description: 'Pacientes de ortodoncia que no han respondido en 14 días.',
        status: 'detected',
        impact_level: 'high',
        difficulty: 1,
        potential_roi: 8500,
        commercial_explanation: 'Atlas enviará un WhatsApp automatizado con un vídeo del doctor y una opción de financiación.',
        area: 'Ventas'
      },
      {
        id: 'opt-2',
        title: 'Optimizar Huecos de 15 Minutos',
        description: 'Rellenar huecos cortos con revisiones rápidas.',
        status: 'executing',
        impact_level: 'medium',
        difficulty: 2,
        potential_roi: 2400,
        commercial_explanation: 'El algoritmo reorganiza la agenda y cita pacientes de revisión en huecos muertos.',
        area: 'Agenda'
      },
      {
        id: 'opt-3',
        title: 'Campaña Reactivación VIP',
        description: 'Pacientes de alto valor inactivos por > 6 meses.',
        status: 'analyzing',
        impact_level: 'high',
        difficulty: 3,
        potential_roi: 12000,
        commercial_explanation: 'Diseño de campaña empática personalizada para pacientes VIP.',
        area: 'Marketing'
      },
      {
        id: 'opt-4',
        title: 'Fugas en Recepción',
        description: '15% de llamadas no atendidas en horario pico.',
        status: 'detected',
        impact_level: 'high',
        difficulty: 2,
        potential_roi: 5000,
        commercial_explanation: 'Derivar llamadas perdidas a Atlas Voice para agendar de forma autónoma.',
        area: 'Recepción'
      },
      {
        id: 'opt-5',
        title: 'Upsell Blanqueamiento',
        description: 'Ofrecer blanqueamiento tras limpieza.',
        status: 'recovered',
        impact_level: 'medium',
        difficulty: 1,
        potential_roi: 1800,
        commercial_explanation: 'Se han cerrado 12 blanqueamientos extra este mes mediante seguimiento automático.',
        area: 'Ventas'
      }
    ];
  }
}
