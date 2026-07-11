import { IEvent, IEventStoreRepository } from './event.repository.interface';
import { createClient } from '@/lib/supabase/server';
import { ObservabilityService } from '@/lib/services/observability.service';

export class SupabaseEventStoreRepository implements IEventStoreRepository {
  async appendEvent(event: IEvent) {
    try {
      const supabase = await createClient();
      const { data, error } = await supabase
        .from('platform_events')
        .insert({
          event_id: event.event_id,
          event_type: event.event_type,
          event_version: event.event_version,
          organization_id: event.organization_id,
          correlation_id: event.correlation_id,
          causation_id: event.causation_id,
          occurred_at: event.occurred_at,
          payload: event.payload,
          sensitivity: event.sensitivity,
          status: event.processing_status,
          idempotency_key: event.idempotency_key
        })
        .select()
        .single();

      if (error) {
        // Violación de unicidad para idempotency_key
        if (error.code === '23505') {
          ObservabilityService.logIdempotencyHit(event.event_id);
          return { success: true, data: event }; // Se considera éxito porque el objetivo final ya se logró
        }
        throw error;
      }
      return { success: true, data: data as unknown as IEvent };
    } catch (err: any) {
      ObservabilityService.logError(`SupabaseEventStoreRepository.appendEvent failed`, err);
      throw err; // Fail-fast en producción
    }
  }

  async fetchEventsByCorrelationId(correlationId: string, organizationId: string) {
    try {
      const supabase = await createClient();
      const { data, error } = await supabase
        .from('platform_events')
        .select('*')
        .eq('organization_id', organizationId)
        .eq('correlation_id', correlationId)
        .order('occurred_at', { ascending: true });

      if (error) throw error;
      return { success: true, data: data as unknown as IEvent[] };
    } catch (err: any) {
      ObservabilityService.logError(`SupabaseEventStoreRepository.fetchEventsByCorrelationId failed`, err);
      throw err;
    }
  }

  async getPendingEvents(organizationId: string): Promise<{ data: any[] | null; error: any | null }> {
    try {
      const supabase = await createClient();
      const { data, error } = await supabase
        .from('platform_events')
        .select('*')
        .eq('organization_id', organizationId)
        .eq('status', 'PENDING')
        .order('occurred_at', { ascending: true });

      return { data, error };
    } catch (e: any) {
      ObservabilityService.logError('SupabaseEventStoreRepository.getPendingEvents failed', e);
      return { data: null, error: e.message };
    }
  }

  async getAllEvents(organizationId: string): Promise<{ data: any[] | null; error: any | null }> {
    try {
      const supabase = await createClient();
      const { data, error } = await supabase
        .from('platform_events')
        .select('*')
        .eq('organization_id', organizationId)
        .order('occurred_at', { ascending: true });

      return { data, error };
    } catch (e: any) {
      ObservabilityService.logError('SupabaseEventStoreRepository.getAllEvents failed', e);
      return { data: null, error: e.message };
    }
  }

  async updateEventStatus(eventId: string, status: string, errorLog?: string) {
    try {
      const supabase = await createClient();
      const { error } = await supabase
        .from('platform_events')
        .update({ status, error_log: errorLog })
        .eq('event_id', eventId);

      if (error) throw error;
      return { success: true };
    } catch (err: any) {
      ObservabilityService.logError(`SupabaseEventStoreRepository.updateEventStatus failed`, err);
      throw err;
    }
  }

  async checkEventExists(idempotencyKey: string): Promise<boolean> {
    try {
      const supabase = await createClient();
      const { count, error } = await supabase
        .from('platform_events')
        .select('*', { count: 'exact', head: true })
        .eq('idempotency_key', idempotencyKey);
        
      if (error) throw error;
      return (count || 0) > 0;
    } catch (e: any) {
      ObservabilityService.logError('SupabaseEventStoreRepository.checkEventExists failed', e);
      return false;
    }
  }
}
