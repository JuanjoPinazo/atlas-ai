import { ConnectorAdapter } from '../core/ConnectorAdapter';
import { IConnectorCapabilities } from '../core/Connector.interface';

export class DentalLabConnector extends ConnectorAdapter {
  constructor() {
    super('DENTAL_LAB');
  }

  async sync(options?: { full?: boolean; since?: string }): Promise<{ recordsProcessed: number; success: boolean }> {
    if (!this.isConnected) return { recordsProcessed: 0, success: false };
    await new Promise(resolve => setTimeout(resolve, 500));
    return { recordsProcessed: options?.full ? 150 : 2, success: true };
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
      type: 'DENTAL_LAB',
      supportsRealtime: false,
      supportsHistoricalSync: true,
      eventsEmitted: ['ORDER_STATUS_CHANGED'],
      eventsConsumed: ['PLACE_ORDER']
    };
  }
}
