import { z } from 'zod';

export const ClientNodeSchema = z.object({
  id: z.string(),
  name: z.string(),
  location: z.string(), // e.g., 'Madrid', 'Valencia'
  health_score: z.number().min(0).max(100),
  active_employees: z.number(),
  knowledge_pack_version: z.string(),
  status: z.enum(['healthy', 'warning', 'critical']),
  ai_consumption_tokens: z.number(),
  roi_generated: z.number()
});

export const GlobalAlertSchema = z.object({
  id: z.string(),
  severity: z.enum(['critical', 'high', 'info']),
  message: z.string(),
  client_id: z.string().optional(),
  timestamp: z.string()
});

export type ClientNode = z.infer<typeof ClientNodeSchema>;
export type GlobalAlert = z.infer<typeof GlobalAlertSchema>;
