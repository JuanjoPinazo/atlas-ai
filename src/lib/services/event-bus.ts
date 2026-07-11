import { ObservabilityService } from './observability.service';
import { EventStoreFactory } from '@/lib/repositories/events/event-store.factory';
import { ROIRepositoryFactory } from '@/lib/repositories/roi/roi.factory';

export class EventBusService {
  static async emit(type: string, payload: unknown, correlationId: string, causationId?: string) {
    const newEvent = {
      event_id: 'evt-' + Math.random().toString(36).substr(2, 9),
      event_type: type,
      event_version: '1.0',
      organization_id: '00000000-0000-0000-0000-000000000000',
      correlation_id: correlationId,
      causation_id: causationId || null,
      occurred_at: new Date().toISOString(),
      payload: payload,
      sensitivity: 'NORMAL',
      processing_status: 'PENDING'
    };

    const repo = EventStoreFactory.getRepository();
    await repo.appendEvent(newEvent);
    await this.processQueue();
  }

  static async processQueue() {
    const repo = EventStoreFactory.getRepository();
    const orgId = '00000000-0000-0000-0000-000000000000';
    const { data: pendingEvents } = await repo.getPendingEvents(orgId);

    if (!pendingEvents) return;

    for (const evt of pendingEvents) {
      await repo.updateEventStatus(evt.event_id, 'PROCESSING');
      const startTime = Date.now();
      try {
        await EventRouterService.route({
          id: evt.event_id,
          type: evt.event_type,
          payload: evt.payload,
          correlationId: evt.correlation_id
        });
        await repo.updateEventStatus(evt.event_id, 'COMPLETED');
        ObservabilityService.trackLatency(`EventRouterService.route(${evt.event_type})`, Date.now() - startTime);
      } catch (err) {
        await repo.updateEventStatus(evt.event_id, 'FAILED', (err as Error).message);
        ObservabilityService.logError(`EventBus processing failed for ${evt.event_id}`, err as Error);
      }
    }
  }
}

export class EventRouterService {
  static async route(event: { type: string; payload: unknown; correlationId: string; id: string }) {
    const roiRepo = ROIRepositoryFactory.getRepository();
    
    if (event.type === 'BudgetFollowUpDue') {
      // Future processing
    }

    if (event.type === 'BudgetAccepted') {
      const orgId = '00000000-0000-0000-0000-000000000000';
      await roiRepo.attributeROIIdempotent(
        event.id,
        orgId,
        event.correlationId,
        (event.payload as { amount: number }).amount
      );
    }
    return;
  }
}
