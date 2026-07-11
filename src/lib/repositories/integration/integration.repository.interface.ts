import { TenantConnector, ConnectorType, ConnectorSyncLog } from '@/lib/schemas/integration';

export interface IIntegrationRepository {
  getInstalledConnectors(organizationId: string): Promise<{ data: TenantConnector[] | null; error: string | null }>;
  getConnector(organizationId: string, type: ConnectorType): Promise<{ data: TenantConnector | null; error: string | null }>;
  installConnector(organizationId: string, type: ConnectorType): Promise<{ data: TenantConnector | null; error: string | null }>;
  removeConnector(organizationId: string, type: ConnectorType): Promise<{ success: boolean; error: string | null }>;
  updateConnectorStatus(id: string, status: string, latencyMs?: number, healthScore?: number): Promise<{ success: boolean; error: string | null }>;
  logSyncEvent(log: Omit<ConnectorSyncLog, 'id' | 'started_at' | 'completed_at'>): Promise<void>;
}
