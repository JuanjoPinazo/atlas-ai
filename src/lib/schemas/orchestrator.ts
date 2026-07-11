import { z } from 'zod';

export const AtlasEventSchema = z.object({
  id: z.string(),
  type: z.string(), // e.g., 'PATIENT_CANCELLED', 'LEAD_GENERATED'
  payload: z.any(),
  timestamp: z.string(),
  source: z.string(),
  processing_time_ms: z.number(),
  status: z.enum(['pending', 'processing', 'completed', 'failed'])
});

export const ServiceStatusSchema = z.object({
  name: z.string(),
  status: z.enum(['online', 'degraded', 'offline']),
  latency_ms: z.number(),
  events_processed: z.number(),
  subscriptions: z.array(z.string())
});

export type AtlasEvent = z.infer<typeof AtlasEventSchema>;
export type ServiceStatus = z.infer<typeof ServiceStatusSchema>;
