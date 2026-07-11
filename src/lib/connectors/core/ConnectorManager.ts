import { ConnectorType } from '@/lib/schemas/integration';
import { ConnectorFactory } from './ConnectorFactory';
import { IConnector, IConnectorHealth } from './Connector.interface';

export class ConnectorManager {
  private static activeConnections = new Map<string, IConnector>();

  static async getConnector(organizationId: string, type: ConnectorType): Promise<IConnector> {
    const connectionKey = `${organizationId}-${type}`;
    
    if (this.activeConnections.has(connectionKey)) {
      return this.activeConnections.get(connectionKey)!;
    }

    const connector = ConnectorFactory.create(type);
    
    // En un entorno real, buscaríamos las credenciales en la DB segura aquí
    const credentials = { token: 'demo-token-123' }; 
    const connected = await connector.connect(credentials);
    
    if (connected) {
      this.activeConnections.set(connectionKey, connector);
    }
    
    return connector;
  }

  static async releaseConnector(organizationId: string, type: ConnectorType): Promise<void> {
    const connectionKey = `${organizationId}-${type}`;
    const connector = this.activeConnections.get(connectionKey);
    if (connector) {
      await connector.disconnect();
      this.activeConnections.delete(connectionKey);
    }
  }

  static async testConnection(type: ConnectorType, credentials: any): Promise<{ success: boolean; latencyMs: number }> {
    const tempConnector = ConnectorFactory.create(type);
    const start = Date.now();
    const connected = await tempConnector.connect(credentials);
    const end = Date.now();
    
    if (connected) {
      await tempConnector.disconnect();
      return { success: true, latencyMs: end - start };
    }
    return { success: false, latencyMs: 0 };
  }
}
