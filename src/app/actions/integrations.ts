"use server";

import { IntegrationRepositoryFactory } from '@/lib/repositories/integration/integration.factory';
import { ConnectorManager } from '@/lib/connectors/core/ConnectorManager';
import { ConnectorType } from '@/lib/schemas/integration';
import { revalidatePath } from 'next/cache';

const DEFAULT_TENANT = '00000000-0000-0000-0000-000000000000';

export async function getInstalledConnectors() {
  const repo = IntegrationRepositoryFactory.getRepository();
  return await repo.getInstalledConnectors(DEFAULT_TENANT);
}

export async function installConnector(type: ConnectorType) {
  const repo = IntegrationRepositoryFactory.getRepository();
  const res = await repo.installConnector(DEFAULT_TENANT, type);
  revalidatePath(`/[tenantId]/integration-hub`);
  revalidatePath(`/[tenantId]/integration-hub/marketplace`);
  return res;
}

export async function connectConnector(type: ConnectorType, credentials: any) {
  const repo = IntegrationRepositoryFactory.getRepository();
  const connectorRecord = await repo.getConnector(DEFAULT_TENANT, type);
  
  if (!connectorRecord.data) {
    return { success: false, error: 'Connector not installed' };
  }

  // Probar conexión real/simulada
  const testRes = await ConnectorManager.testConnection(type, credentials);
  if (testRes.success) {
    await repo.updateConnectorStatus(connectorRecord.data.id, 'CONNECTED', testRes.latencyMs, 100);
    revalidatePath(`/[tenantId]/integration-hub`);
    return { success: true };
  }
  
  await repo.updateConnectorStatus(connectorRecord.data.id, 'ERROR', 0, 0);
  revalidatePath(`/[tenantId]/integration-hub`);
  return { success: false, error: 'Failed to connect. Invalid credentials or timeout.' };
}

export async function disconnectConnector(type: ConnectorType) {
  const repo = IntegrationRepositoryFactory.getRepository();
  const connectorRecord = await repo.getConnector(DEFAULT_TENANT, type);
  if (!connectorRecord.data) return { success: false, error: 'Connector not installed' };

  await ConnectorManager.releaseConnector(DEFAULT_TENANT, type);
  await repo.updateConnectorStatus(connectorRecord.data.id, 'DISCONNECTED', 0, 0);
  
  revalidatePath(`/[tenantId]/integration-hub`);
  return { success: true };
}

export async function removeConnector(type: ConnectorType) {
  const repo = IntegrationRepositoryFactory.getRepository();
  await ConnectorManager.releaseConnector(DEFAULT_TENANT, type);
  const res = await repo.removeConnector(DEFAULT_TENANT, type);
  
  revalidatePath(`/[tenantId]/integration-hub`);
  revalidatePath(`/[tenantId]/integration-hub/marketplace`);
  return res;
}

export async function syncConnector(type: ConnectorType, options?: { full?: boolean }) {
  const repo = IntegrationRepositoryFactory.getRepository();
  const connectorRecord = await repo.getConnector(DEFAULT_TENANT, type);
  if (!connectorRecord.data || connectorRecord.data.status !== 'CONNECTED') {
    return { success: false, error: 'Connector is not connected' };
  }

  // Update status to SYNCING
  await repo.updateConnectorStatus(connectorRecord.data.id, 'SYNCING');
  revalidatePath(`/[tenantId]/integration-hub`);

  // Ejecutar sincronización
  const connector = await ConnectorManager.getConnector(DEFAULT_TENANT, type);
  const start = Date.now();
  const result = await connector.sync(options);
  const end = Date.now();

  // Log
  await repo.logSyncEvent({
    tenant_connector_id: connectorRecord.data.id,
    sync_type: options?.full ? 'FULL' : 'DELTA',
    status: result.success ? 'SUCCESS' : 'FAILED',
    records_processed: result.recordsProcessed,
    error_message: result.success ? undefined : 'Sync failed during execution'
  });

  // Restore status
  await repo.updateConnectorStatus(connectorRecord.data.id, result.success ? 'CONNECTED' : 'ERROR', end - start, result.success ? 100 : 50);
  revalidatePath(`/[tenantId]/integration-hub`);

  return { ...result, error: result.success ? undefined : 'Sync execution failed' };
}
