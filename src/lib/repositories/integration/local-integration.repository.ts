import { IIntegrationRepository } from './integration.repository.interface';
import { TenantConnector, ConnectorType, ConnectorSyncLog } from '@/lib/schemas/integration';
import { LocalDB } from '@/lib/services/local-db';

export class LocalIntegrationRepository implements IIntegrationRepository {
  async getInstalledConnectors(organizationId: string) {
    const db = LocalDB.getDB();
    const connectors = (db.connectors || []).filter(c => c.organization_id === organizationId);
    return { data: connectors, error: null };
  }

  async getConnector(organizationId: string, type: ConnectorType) {
    const db = LocalDB.getDB();
    const connector = (db.connectors || []).find(c => c.organization_id === organizationId && c.connector_type === type);
    return { data: connector || null, error: null };
  }

  async installConnector(organizationId: string, type: ConnectorType) {
    const db = LocalDB.getDB();
    if (!db.connectors) db.connectors = [];
    
    const newConnector: TenantConnector = {
      id: crypto.randomUUID(),
      organization_id: organizationId,
      connector_type: type,
      status: 'DISCONNECTED',
      health_score: 100,
      latency_ms: 0,
      config: {},
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    
    db.connectors.push(newConnector);
    LocalDB.saveDB(db);
    return { data: newConnector, error: null };
  }

  async removeConnector(organizationId: string, type: ConnectorType) {
    const db = LocalDB.getDB();
    if (!db.connectors) return { success: true, error: null };
    db.connectors = db.connectors.filter(c => !(c.organization_id === organizationId && c.connector_type === type));
    LocalDB.saveDB(db);
    return { success: true, error: null };
  }

  async updateConnectorStatus(id: string, status: string, latencyMs?: number, healthScore?: number) {
    const db = LocalDB.getDB();
    if (!db.connectors) return { success: false, error: 'No connectors' };
    const connector = db.connectors.find(c => c.id === id);
    if (connector) {
      connector.status = status as any;
      if (latencyMs !== undefined) connector.latency_ms = latencyMs;
      if (healthScore !== undefined) connector.health_score = healthScore;
      connector.updated_at = new Date().toISOString();
      LocalDB.saveDB(db);
    }
    return { success: true, error: null };
  }

  async logSyncEvent(log: Omit<ConnectorSyncLog, 'id' | 'started_at' | 'completed_at'>) {
    const db = LocalDB.getDB();
    if (!db.connector_logs) db.connector_logs = [];
    db.connector_logs.push({
      ...log,
      id: crypto.randomUUID(),
      started_at: new Date().toISOString(),
      completed_at: new Date().toISOString()
    });
    LocalDB.saveDB(db);
  }
}
