import { AtlasEvent, ServiceStatus } from '../schemas/orchestrator';

export class OrchestratorRepository {
  static async getLiveEvents(): Promise<AtlasEvent[]> {
    return [
      {
        id: 'evt-8891',
        type: 'PATIENT_CANCELLED_APPOINTMENT',
        payload: { patientId: 'p-102', reason: 'Enfermedad', anticipation_hours: 2 },
        timestamp: new Date(Date.now() - 1000 * 60 * 2).toISOString(),
        source: 'PMS_Webhook',
        processing_time_ms: 245,
        status: 'completed'
      },
      {
        id: 'evt-8892',
        type: 'NEW_LEAD_WEB',
        payload: { source: 'Landing Page', interest: 'Invisalign', contact: '+34 600... ' },
        timestamp: new Date(Date.now() - 1000 * 60 * 15).toISOString(),
        source: 'Web_Form',
        processing_time_ms: 120,
        status: 'completed'
      },
      {
        id: 'evt-8893',
        type: 'BUDGET_EXPIRED',
        payload: { budgetId: 'b-991', amount: 4500, days_pending: 15 },
        timestamp: new Date(Date.now() - 1000 * 60 * 45).toISOString(),
        source: 'CRON_Job',
        processing_time_ms: 85,
        status: 'completed'
      }
    ];
  }

  static async getServicesStatus(): Promise<ServiceStatus[]> {
    return [
      {
        name: 'Context Engine',
        status: 'online',
        latency_ms: 45,
        events_processed: 14502,
        subscriptions: ['*']
      },
      {
        name: 'Decision Engine',
        status: 'online',
        latency_ms: 120,
        events_processed: 8900,
        subscriptions: ['PATIENT_CANCELLED_APPOINTMENT', 'BUDGET_EXPIRED']
      },
      {
        name: 'Agent: Dra. Aida',
        status: 'online',
        latency_ms: 850,
        events_processed: 412,
        subscriptions: ['ACTION_REQUIRED_RESCUE']
      },
      {
        name: 'ROI Engine',
        status: 'online',
        latency_ms: 15,
        events_processed: 25000,
        subscriptions: ['VALUE_GENERATED']
      }
    ];
  }
}
