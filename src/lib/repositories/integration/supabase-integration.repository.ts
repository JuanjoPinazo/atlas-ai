import { IIntegrationRepository } from './integration.repository.interface';
import { TenantConnector, ConnectorType, ConnectorSyncLog } from '@/lib/schemas/integration';
import { createClient } from '@/lib/supabase/server';
import { ObservabilityService } from '@/lib/services/observability.service';

export class SupabaseIntegrationRepository implements IIntegrationRepository {
  async getInstalledConnectors(organizationId: string) {
    try {
      const supabase = await createClient();
      const { data, error } = await supabase
        .from('tenant_connectors')
        .select('*')
        .eq('organization_id', organizationId);
      
      return { data, error: error?.message || null };
    } catch (e: any) {
      ObservabilityService.logError('SupabaseIntegrationRepository.getInstalledConnectors', e);
      return { data: null, error: e.message };
    }
  }

  async getConnector(organizationId: string, type: ConnectorType) {
    try {
      const supabase = await createClient();
      const { data, error } = await supabase
        .from('tenant_connectors')
        .select('*')
        .eq('organization_id', organizationId)
        .eq('connector_type', type)
        .single();
      
      return { data, error: error?.message || null };
    } catch (e: any) {
      return { data: null, error: e.message };
    }
  }

  async installConnector(organizationId: string, type: ConnectorType) {
    try {
      const supabase = await createClient();
      const { data, error } = await supabase
        .from('tenant_connectors')
        .insert({
          organization_id: organizationId,
          connector_type: type,
          status: 'DISCONNECTED',
          health_score: 100,
          latency_ms: 0
        })
        .select()
        .single();
        
      return { data, error: error?.message || null };
    } catch (e: any) {
      ObservabilityService.logError('SupabaseIntegrationRepository.installConnector', e);
      return { data: null, error: e.message };
    }
  }

  async removeConnector(organizationId: string, type: ConnectorType) {
    try {
      const supabase = await createClient();
      const { error } = await supabase
        .from('tenant_connectors')
        .delete()
        .eq('organization_id', organizationId)
        .eq('connector_type', type);
        
      return { success: !error, error: error?.message || null };
    } catch (e: any) {
      return { success: false, error: e.message };
    }
  }

  async updateConnectorStatus(id: string, status: string, latencyMs?: number, healthScore?: number) {
    try {
      const supabase = await createClient();
      const payload: any = { status, updated_at: new Date().toISOString() };
      if (latencyMs !== undefined) payload.latency_ms = latencyMs;
      if (healthScore !== undefined) payload.health_score = healthScore;

      const { error } = await supabase
        .from('tenant_connectors')
        .update(payload)
        .eq('id', id);

      return { success: !error, error: error?.message || null };
    } catch (e: any) {
      return { success: false, error: e.message };
    }
  }

  async logSyncEvent(log: Omit<ConnectorSyncLog, 'id' | 'started_at' | 'completed_at'>) {
    try {
      const supabase = await createClient();
      await supabase.from('connector_sync_logs').insert({
        ...log,
        completed_at: new Date().toISOString()
      });
    } catch (e: any) {
      ObservabilityService.logError('SupabaseIntegrationRepository.logSyncEvent', e);
    }
  }
}
