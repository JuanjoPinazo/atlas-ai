import { ConnectorAdapter } from '../core/ConnectorAdapter';
import { IConnectorCapabilities } from '../core/Connector.interface';

export class GesdenConnector extends ConnectorAdapter {
  constructor() {
    super('GESDEN');
  }

  async sync(options?: { full?: boolean; since?: string }): Promise<{ recordsProcessed: number; success: boolean }> {
    if (!this.isConnected) return { recordsProcessed: 0, success: false };
    // Simulamos la sincronización de pacientes y agendas de Gesden
    await new Promise(resolve => setTimeout(resolve, 1500));
    return { recordsProcessed: options?.full ? 4500 : 12, success: true };
  }

  async receiveEvent(payload: any): Promise<boolean> {
    if (!this.isConnected) return false;
    return true;
  }

  async sendEvent(eventName: string, payload: any): Promise<boolean> {
    if (!this.isConnected) return false;
    return true;
  }

  capabilities(): IConnectorCapabilities {
    return {
      type: 'GESDEN',
      supportsRealtime: true,
      supportsHistoricalSync: true,
      eventsEmitted: ['PATIENT_CREATED', 'APPOINTMENT_SCHEDULED', 'BUDGET_GENERATED'],
      eventsConsumed: ['UPDATE_PATIENT_RECORD']
    };
  }
}
