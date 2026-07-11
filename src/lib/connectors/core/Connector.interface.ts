import { ConnectorType } from '@/lib/schemas/integration';

export interface IConnectorHealth {
  status: 'HEALTHY' | 'DEGRADED' | 'UNHEALTHY';
  latencyMs: number;
  lastCheck: string;
  details?: string;
}

export interface IConnectorCapabilities {
  type: ConnectorType;
  supportsRealtime: boolean;
  supportsHistoricalSync: boolean;
  eventsEmitted: string[];
  eventsConsumed: string[];
}

export interface IConnector {
  /**
   * Inicializa la conexión con el servicio externo
   */
  connect(credentials: any): Promise<boolean>;

  /**
   * Cierra la conexión de forma segura
   */
  disconnect(): Promise<boolean>;

  /**
   * Verifica la salud y latencia del conector
   */
  health(): Promise<IConnectorHealth>;

  /**
   * Sincroniza datos históricos o en batch
   */
  sync(options?: { full?: boolean, since?: string }): Promise<{ recordsProcessed: number, success: boolean }>;

  /**
   * Procesa un evento entrante desde el servicio externo hacia Atlas
   */
  receiveEvent(payload: any): Promise<boolean>;

  /**
   * Envía un evento desde Atlas hacia el servicio externo
   */
  sendEvent(eventName: string, payload: any): Promise<boolean>;

  /**
   * Devuelve las capacidades declaradas de este conector
   */
  capabilities(): IConnectorCapabilities;
}
