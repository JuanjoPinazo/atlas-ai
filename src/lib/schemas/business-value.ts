import { z } from 'zod';

export const ValueOpportunityStatusSchema = z.enum(['detected', 'analyzing', 'executing', 'recovered']);
export const ValueOpportunityImpactSchema = z.enum(['high', 'medium', 'low']);

export const ValueOpportunitySchema = z.object({
  id: z.string(),
  title: z.string(),
  description: z.string(),
  status: ValueOpportunityStatusSchema,
  impact_level: ValueOpportunityImpactSchema,
  difficulty: z.number().min(1).max(5),
  potential_roi: z.number(), // Extracted value in Euros
  commercial_explanation: z.string(),
  area: z.string(),
});

export type ValueOpportunity = z.infer<typeof ValueOpportunitySchema>;
