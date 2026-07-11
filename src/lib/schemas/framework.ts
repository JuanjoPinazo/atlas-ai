import { z } from 'zod';

export const FrameworkEngineSchema = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string(),
  status: z.enum(['active', 'learning', 'paused']),
  autonomy: z.number().min(0).max(100),
  confidence: z.number().min(0).max(100),
  evolution: z.number(), // e.g. +5% 
  explanation: z.string(),
});

export type FrameworkEngine = z.infer<typeof FrameworkEngineSchema>;
