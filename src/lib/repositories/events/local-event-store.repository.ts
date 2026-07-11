import { IEventStoreRepository } from './event.repository.interface';
import { LocalDB } from '@/lib/services/local-db';

export class LocalEventStoreRepository implements IEventStoreRepository {
  async appendEvent(eventData: any): Promise<{ success: boolean; data?: any; error?: string }> {
    const db = LocalDB.getDB();
    db.events.push({
      id: eventData.event_id,
      type: eventData.event_type,
      payload: eventData.payload,
      correlationId: eventData.correlation_id,
      causationId: eventData.causation_id,
      timestamp: eventData.occurred_at,
      status: eventData.processing_status
    });
    LocalDB.saveDB(db);
    return { success: true, data: eventData };
  }

  async getPendingEvents(organizationId: string): Promise<{ data: any[] | null; error: any | null }> {
    const db = LocalDB.getDB();
    const pending = db.events
      .filter(e => e.status === 'PENDING')
      .map(e => ({
        event_id: e.id,
        event_type: e.type,
        payload: e.payload,
        correlation_id: e.correlationId,
        causation_id: e.causationId,
        occurred_at: e.timestamp,
        processing_status: e.status
      }));
    return { data: pending, error: null };
  }

  async getAllEvents(organizationId: string): Promise<{ data: any[] | null; error: any | null }> {
    const db = LocalDB.getDB();
    const all = db.events.map(e => ({
      event_id: e.id,
      event_type: e.type,
      payload: e.payload,
      correlation_id: e.correlationId,
      causation_id: e.causationId,
      occurred_at: e.timestamp,
      processing_status: e.status
    }));
    return { data: all, error: null };
  }

  async fetchEventsByCorrelationId(correlationId: string, organizationId: string): Promise<{ success: boolean; data?: any[]; error?: string }> {
    const db = LocalDB.getDB();
    const filtered = db.events.filter(e => e.correlationId === correlationId).map(e => ({
      event_id: e.id,
      event_type: e.type,
      payload: e.payload,
      correlation_id: e.correlationId,
      causation_id: e.causationId,
      occurred_at: e.timestamp,
      processing_status: e.status
    }));
    return { success: true, data: filtered };
  }

  async updateEventStatus(eventId: string, status: string, errorDetail?: string): Promise<{ success: boolean; error?: string }> {
    const db = LocalDB.getDB();
    const evt = db.events.find(e => e.id === eventId);
    if (evt) {
      evt.status = status;
      LocalDB.saveDB(db);
    }
    return { success: true };
  }

  async checkEventExists(idempotencyKey: string): Promise<boolean> {
    return false;
  }
}
