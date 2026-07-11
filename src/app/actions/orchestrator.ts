"use server";

import { OrchestratorRepository } from '@/lib/repositories/orchestrator';
import { EventStoreFactory } from '@/lib/repositories/events/event-store.factory';
import { SERVER_ENVIRONMENT } from '@/config/server-environment';

export async function fetchOrchestratorData() {
  try {
    const mockEvents = await OrchestratorRepository.getLiveEvents();
    
    // El tenantId vendría por sesión. Usamos el default para la demo.
    const orgId = '00000000-0000-0000-0000-000000000000';
    const repo = EventStoreFactory.getRepository();
    const { data: realEventsRaw } = await repo.getAllEvents(orgId);
    
    let events: any[] = [];
    
    if (SERVER_ENVIRONMENT.DATA_PROVIDER === 'supabase') {
      // Orchestrator no debe mezclar eventos reales y simulados en la misma respuesta.
      events = (realEventsRaw || []).map(e => ({
        id: e.event_id,
        type: e.event_type,
        payload: e.payload,
        timestamp: e.occurred_at,
        source: 'Supabase_EventStore',
        processing_time_ms: 15,
        status: e.processing_status?.toLowerCase() as any
      })).sort((a: any, b: any) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
    } else {
      const realEvents = (realEventsRaw || []).map(e => ({
        id: e.event_id,
        type: e.event_type,
        payload: e.payload,
        timestamp: e.occurred_at,
        source: 'Local_EventBus',
        processing_time_ms: 15,
        status: e.processing_status?.toLowerCase() as any
      }));
      events = [...realEvents, ...mockEvents].sort((a: any, b: any) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
    }
    
    const services = await OrchestratorRepository.getServicesStatus();
    
    return {
      success: true,
      data: { events, services }
    };
  } catch (error: any) {
    return {
      success: false,
      data: undefined,
      error: error.message
    };
  }
}
