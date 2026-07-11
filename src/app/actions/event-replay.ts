"use server";

import { createAdminClient } from '@/lib/supabase/admin';
import { SERVER_ENVIRONMENT } from '@/config/server-environment';
import { EventRouterService } from '@/lib/services/event-bus';
import { ObservabilityService } from '@/lib/services/observability.service';

/**
 * Event Replay rebuilds the derived state (projections like opportunity candidates and ROI)
 * based on the immutable append-only event store.
 * 
 * In a real production system, this would rebuild the read models for a specific tenant.
 */
export async function replayEventsForTenant(tenantId: string) {
  if (SERVER_ENVIRONMENT.DATA_PROVIDER !== 'supabase') {
    throw new Error('ATLAS_RUNTIME_ERROR: Event replay requires supabase data provider.');
  }

  const supabase = createAdminClient();
  
  // Get all completed/processed events in order
  const { data: events, error } = await supabase
    .from('platform_events')
    .select('*')
    .eq('organization_id', tenantId)
    .order('occurred_at', { ascending: true });

  if (error) {
    ObservabilityService.logError(`Event Replay failed to fetch events for ${tenantId}`, error);
    throw error;
  }

  if (!events || events.length === 0) {
    return { success: true, message: 'No events to replay.' };
  }

  // Clear current projections (For MVP, we just rely on idempotency, so we don't need to clear
  // but a full replay often involves wiping read models first or pointing to a new read model).
  // In our case, attributeROIIdempotent is safe to re-run.
  
  let processed = 0;
  let skipped = 0;

  for (const row of events) {
    try {
      // route expects id (event_id), type (event_type), payload, correlationId
      await EventRouterService.route({
        id: row.event_id,
        type: row.event_type,
        payload: row.payload,
        correlationId: row.correlation_id
      });
      processed++;
    } catch (e: any) {
      ObservabilityService.logError(`Event Replay failed on event ${row.event_id}`, e);
      // Depending on strictness, we might throw and abort, or just log. We abort here.
      throw e;
    }
  }

  return { success: true, processed, skipped };
}
