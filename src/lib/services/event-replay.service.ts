import { EventStoreFactory } from '@/lib/repositories/events/event-store.factory';
import { EventRouterService } from './event-bus';
import { ObservabilityService } from './observability.service';

export class EventReplayService {
  /**
   * Re-procesa todos los eventos completados o fallidos de forma inmutable,
   * sin duplicar efectos secundarios ya gestionados o reconstruyendo
   * vistas materializadas.
   */
  static async replayAll(organizationId: string) {
    try {
      const repo = EventStoreFactory.getRepository();
      const { data: allEvents, error } = await repo.getAllEvents(organizationId);

      if (error || !allEvents) {
        throw new Error(error || 'No events found');
      }

      ObservabilityService.logEvent('REPLAY_STARTED', { count: allEvents.length });

      // Ordenar por fecha cronológica para asegurar re-proceso correcto
      const sortedEvents = allEvents.sort((a, b) => 
        new Date(a.occurred_at).getTime() - new Date(b.occurred_at).getTime()
      );

      let processedCount = 0;
      let failedCount = 0;

      for (const evt of sortedEvents) {
        try {
          await EventRouterService.route({
            id: evt.event_id,
            type: evt.event_type,
            payload: evt.payload,
            correlationId: evt.correlation_id
          });
          processedCount++;
        } catch (err: any) {
          ObservabilityService.logError(`Replay failed for event ${evt.event_id}`, err);
          failedCount++;
        }
      }

      ObservabilityService.logEvent('REPLAY_COMPLETED', { processedCount, failedCount });
      return { success: true, processedCount, failedCount };
    } catch (error: any) {
      ObservabilityService.logError('EventReplayService failed to replay', error);
      return { success: false, error: error.message };
    }
  }
}
