import { z } from 'zod';

export const DiscoveryResultSchema = z.object({
  id: z.string(),
  clinic_name: z.string(),
  health_score: z.number().min(0).max(100),
  opportunity_score: z.number().min(0).max(100),
  digital_readiness: z.number().min(0).max(100),
  dimensions: z.array(z.object({
    name: z.string(),
    score: z.number().min(0).max(100)
  })),
  recommended_employees: z.array(z.object({
    id: z.string(),
    name: z.string(),
    role: z.string()
  })),
  recommended_packs: z.array(z.string()),
  business_value_opportunities: z.array(z.object({
    title: z.string(),
    roi_estimate: z.number()
  })),
  total_roi_estimate: z.number(),
  proposal_price: z.number(),
  implementation_plan: z.array(z.object({
    phase: z.string(),
    description: z.string(),
    weeks: z.number()
  }))
});

export type DiscoveryResult = z.infer<typeof DiscoveryResultSchema>;
