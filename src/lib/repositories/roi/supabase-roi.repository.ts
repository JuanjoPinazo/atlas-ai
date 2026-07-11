import { IROIRepository } from './roi.repository.interface';
import { createClient } from '@/lib/supabase/server';
import { ObservabilityService } from '@/lib/services/observability.service';

export class SupabaseROIRepository implements IROIRepository {
  async attributeROIIdempotent(eventId: string, organizationId: string, correlationId: string, amount: number): Promise<{ success: boolean; data?: any; error?: string } | void> {
    try {
      const supabase = await createClient();
      
      const { data, error } = await supabase.rpc('attribute_roi_idempotent', {
        p_event_id: eventId,
        p_organization_id: organizationId,
        p_budget_id: correlationId,
        p_amount: amount
      });

      if (error) {
        throw error;
      }

      if (data) {
        ObservabilityService.logEvent('ROI_ATTRIBUTED_SUPABASE', { eventId, amount });
      }

      return { success: true, data };
    } catch (err: any) {
      ObservabilityService.logError(`SupabaseROIRepository.attributeROIIdempotent failed`, err);
      throw err; // Fail-fast en producción
    }
  }

  async getROIMetrics(organizationId: string): Promise<{ success: boolean; data?: any; error?: string }> {
    try {
      const supabase = await createClient();
      const { data, error } = await supabase
        .from('roi_events')
        .select('value')
        .eq('organization_id', organizationId);

      if (error) throw error;

      const realGenerated = data.reduce((acc, curr) => acc + Number(curr.value), 0);

      return {
        success: true,
        data: {
          totalGenerated: realGenerated,
          realGenerated: realGenerated,
          realEventsCount: data.length
        }
      };
    } catch (err: any) {
      ObservabilityService.logError(`SupabaseROIRepository.getROIMetrics failed`, err);
      return { success: false, error: err.message };
    }
  }
}
