import { IConnector, IConnectorHealth, IConnectorCapabilities } from './Connector.interface';
import { ConnectorType } from '@/lib/schemas/integration';
import { ObservabilityService } from '@/lib/services/observability.service';

export abstract class ConnectorAdapter implements IConnector {
  protected isConnected: boolean = false;
  protected credentials: any = null;

  constructor(protected type: ConnectorType) {}

  async connect(credentials: any): Promise<boolean> {
    try {
      this.credentials = credentials;
      // Simulamos latencia de conexión
      await new Promise(resolve => setTimeout(resolve, 800));
      this.isConnected = true;
      ObservabilityService.logEvent(`CONNECTOR_CONNECTED`, { type: this.type });
      return true;
    } catch (e: any) {
      ObservabilityService.logError(`Connector ${this.type} failed to connect`, e);
      return false;
    }
  }

  async disconnect(): Promise<boolean> {
    this.isConnected = false;
    this.credentials = null;
    ObservabilityService.logEvent(`CONNECTOR_DISCONNECTED`, { type: this.type });
    return true;
  }

  async health(): Promise<IConnectorHealth> {
    return {
      status: this.isConnected ? 'HEALTHY' : 'UNHEALTHY',
      latencyMs: this.isConnected ? Math.floor(Math.random() * 150) + 20 : 0,
      lastCheck: new Date().toISOString()
    };
  }

  abstract sync(options?: { full?: boolean; since?: string; }): Promise<{ recordsProcessed: number; success: boolean; }>;

  abstract receiveEvent(payload: any): Promise<boolean>;

  abstract sendEvent(eventName: string, payload: any): Promise<boolean>;

  abstract capabilities(): IConnectorCapabilities;
}
