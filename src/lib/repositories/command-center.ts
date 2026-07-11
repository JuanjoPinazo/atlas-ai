import { ClientNode, GlobalAlert } from '../schemas/command-center';

export class CommandCenterRepository {
  static async getClients(): Promise<ClientNode[]> {
    return [
      {
        id: 'c-1',
        name: 'Clínica Dental Levante',
        location: 'Valencia',
        health_score: 95,
        active_employees: 3,
        knowledge_pack_version: 'v1.4.2',
        status: 'healthy',
        ai_consumption_tokens: 1250000,
        roi_generated: 45000
      },
      {
        id: 'c-2',
        name: 'Odontología Madrid Centro',
        location: 'Madrid',
        health_score: 88,
        active_employees: 2,
        knowledge_pack_version: 'v1.4.2',
        status: 'healthy',
        ai_consumption_tokens: 850000,
        roi_generated: 22000
      },
      {
        id: 'c-3',
        name: 'Clínica Sur Sevilla',
        location: 'Sevilla',
        health_score: 45,
        active_employees: 1,
        knowledge_pack_version: 'v1.3.0',
        status: 'critical',
        ai_consumption_tokens: 120000,
        roi_generated: 3500
      },
      {
        id: 'c-4',
        name: 'Ortodoncia BCN',
        location: 'Barcelona',
        health_score: 72,
        active_employees: 4,
        knowledge_pack_version: 'v1.4.0',
        status: 'warning',
        ai_consumption_tokens: 2100000,
        roi_generated: 89000
      },
      {
        id: 'c-5',
        name: 'Dental Norte Bilbao',
        location: 'Bilbao',
        health_score: 98,
        active_employees: 2,
        knowledge_pack_version: 'v1.4.2',
        status: 'healthy',
        ai_consumption_tokens: 950000,
        roi_generated: 31000
      }
    ];
  }

  static async getAlerts(): Promise<GlobalAlert[]> {
    return [
      {
        id: 'a-1',
        severity: 'critical',
        message: 'Latencia detectada en LLM Endpoint (OpenAI EU) > 2s.',
        timestamp: 'Hace 5 min'
      },
      {
        id: 'a-2',
        severity: 'high',
        message: 'Clínica Sur Sevilla ha desactivado el Agente de Rescates.',
        client_id: 'c-3',
        timestamp: 'Hace 12 min'
      },
      {
        id: 'a-3',
        severity: 'info',
        message: 'Despliegue OTA v1.4.2 completado en 15 clínicas.',
        timestamp: 'Hace 1 hora'
      }
    ];
  }
}
