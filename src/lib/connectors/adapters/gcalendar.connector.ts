import { ConnectorAdapter } from '../core/ConnectorAdapter';
import { IConnectorCapabilities } from '../core/Connector.interface';

export class GCalendarConnector extends ConnectorAdapter {
  constructor() {
    super('GOOGLE_CALENDAR');
  }

  async sync(options?: { full?: boolean; since?: string }): Promise<{ recordsProcessed: number; success: boolean }> {
    if (!this.isConnected) return { recordsProcessed: 0, success: false };
    await new Promise(resolve => setTimeout(resolve, 1000));
    return { recordsProcessed: options?.full ? 1200 : 20, success: true };
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
      type: 'GOOGLE_CALENDAR',
      supportsRealtime: true,
      supportsHistoricalSync: true,
      eventsEmitted: ['EVENT_CREATED', 'EVENT_UPDATED', 'EVENT_CANCELLED'],
      eventsConsumed: ['CREATE_EVENT', 'UPDATE_EVENT']
    };
  }
}
