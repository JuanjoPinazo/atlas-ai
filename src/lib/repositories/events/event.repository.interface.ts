export interface IEvent {
  id?: string;
  event_id: string;
  event_type: string;
  event_version: string;
  organization_id: string;
  correlation_id: string;
  causation_id?: string | null;
  occurred_at: string;
  payload: any;
  sensitivity: string;
  processing_status: string;
  idempotency_key?: string | null;
}

export interface IEventStoreRepository {
  appendEvent(eventData: any): Promise<{ success: boolean; data?: IEvent; error?: string }>;
  fetchEventsByCorrelationId(correlationId: string, organizationId: string): Promise<{ success: boolean; data?: IEvent[]; error?: string }>;
  getPendingEvents(organizationId: string): Promise<{ data: any[] | null; error: any | null }>;
  getAllEvents(organizationId: string): Promise<{ data: any[] | null; error: any | null }>;
  updateEventStatus(eventId: string, status: string, errorDetail?: string): Promise<{ success: boolean; error?: string } | void>;
  checkEventExists(idempotencyKey: string): Promise<boolean>;
}
