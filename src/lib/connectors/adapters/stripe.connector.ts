import { ConnectorAdapter } from '../core/ConnectorAdapter';
import { IConnectorCapabilities } from '../core/Connector.interface';

export class StripeConnector extends ConnectorAdapter {
  constructor() {
    super('STRIPE');
  }

  async sync(options?: { full?: boolean; since?: string }): Promise<{ recordsProcessed: number; success: boolean }> {
    if (!this.isConnected) return { recordsProcessed: 0, success: false };
    await new Promise(resolve => setTimeout(resolve, 900));
    return { recordsProcessed: options?.full ? 800 : 10, success: true };
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
      type: 'STRIPE',
      supportsRealtime: true,
      supportsHistoricalSync: true,
      eventsEmitted: ['PAYMENT_INTENT_SUCCEEDED', 'CHARGE_REFUNDED'],
      eventsConsumed: ['CREATE_PAYMENT_LINK']
    };
  }
}
