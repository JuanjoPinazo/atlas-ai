import { ConnectorAdapter } from '../core/ConnectorAdapter';
import { IConnectorCapabilities } from '../core/Connector.interface';

export class M365Connector extends ConnectorAdapter {
  constructor() {
    super('MICROSOFT_365');
  }

  async sync(options?: { full?: boolean; since?: string }): Promise<{ recordsProcessed: number; success: boolean }> {
    if (!this.isConnected) return { recordsProcessed: 0, success: false };
    await new Promise(resolve => setTimeout(resolve, 1200));
    return { recordsProcessed: options?.full ? 3000 : 50, success: true };
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
      type: 'MICROSOFT_365',
      supportsRealtime: true,
      supportsHistoricalSync: true,
      eventsEmitted: ['EMAIL_RECEIVED', 'CALENDAR_EVENT_CREATED'],
      eventsConsumed: ['SEND_EMAIL', 'CREATE_MEETING']
    };
  }
}
