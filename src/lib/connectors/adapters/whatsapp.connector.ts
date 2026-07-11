import { ConnectorAdapter } from '../core/ConnectorAdapter';
import { IConnectorCapabilities } from '../core/Connector.interface';

export class WhatsAppConnector extends ConnectorAdapter {
  constructor() {
    super('WHATSAPP_BUSINESS');
  }

  async sync(options?: { full?: boolean; since?: string }): Promise<{ recordsProcessed: number; success: boolean }> {
    if (!this.isConnected) return { recordsProcessed: 0, success: false };
    await new Promise(resolve => setTimeout(resolve, 800));
    return { recordsProcessed: options?.full ? 500 : 5, success: true };
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
      type: 'WHATSAPP_BUSINESS',
      supportsRealtime: true,
      supportsHistoricalSync: false,
      eventsEmitted: ['MESSAGE_RECEIVED', 'MESSAGE_READ'],
      eventsConsumed: ['SEND_MESSAGE', 'SEND_TEMPLATE']
    };
  }
}
