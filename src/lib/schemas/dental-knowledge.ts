import { z } from 'zod';

export const DentalItemPrioritySchema = z.enum(['MVP', 'Fase 2', 'Avanzado']);
export const DentalItemStatusSchema = z.enum(['borrador', 'pendiente de revisión', 'aprobado', 'obsoleto', 'rechazado']);
export const EvidenceLevelSchema = z.enum(['alta', 'media', 'baja']);

export const DentalDomainSchema = z.object({
  id: z.string().uuid(),
  tenant_id: z.string(),
  name: z.string(),
  description: z.string().nullable(),
  icon: z.string().nullable(),
});

export const DentalCategorySchema = z.object({
  id: z.string().uuid(),
  tenant_id: z.string(),
  domain_id: z.string().uuid(),
  name: z.string(),
  description: z.string().nullable(),
});

export const DentalItemSchema = z.object({
  id: z.string().uuid(),
  tenant_id: z.string(),
  category_id: z.string().uuid(),
  title: z.string(),
  description: z.string().nullable(),
  problem_solved: z.string().nullable(),
  current_process: z.string().nullable(),
  atlas_proposal: z.string().nullable(),
  limits: z.string().nullable(),
  risks: z.string().nullable(),
  benefits: z.string().nullable(),
  kpis: z.string().nullable(),
  example: z.string().nullable(),
  commercial_argument: z.string().nullable(),
  contextual_help: z.string().nullable(),
  applicable_clinics: z.array(z.string()).default([]),
  applicable_specialties: z.array(z.string()).default([]),
  priority: DentalItemPrioritySchema.default('MVP'),
  status: DentalItemStatusSchema.default('borrador'),
  confidence_level: z.number().min(0).max(100).default(0),
  responsible: z.string().nullable(),
  version: z.number().default(1),
  last_review_date: z.string().nullable(),
  is_deleted: z.boolean().default(false),
  created_at: z.string().nullable(),
  updated_at: z.string().nullable(),
});

export const DentalCommercialBenefitSchema = z.object({
  id: z.string().uuid(),
  item_id: z.string().uuid(),
  target_role: z.string().nullable(),
  problem: z.string().nullable(),
  solution: z.string().nullable(),
  benefit: z.string().nullable(),
  kpi: z.string().nullable(),
  example: z.string().nullable(),
  economic_impact_expected: z.string().nullable(),
  evidence_level: EvidenceLevelSchema.default('media'),
});

export const DentalImplementationQuestionSchema = z.object({
  id: z.string().uuid(),
  item_id: z.string().uuid(),
  category: z.string().nullable(),
  question_text: z.string(),
});

export const DentalAutomationBlueprintSchema = z.object({
  id: z.string().uuid(),
  item_id: z.string().uuid(),
  trigger_event: z.string(),
  conditions: z.string().nullable(),
  action: z.string(),
  requires_approval: z.boolean().default(false),
  channel: z.string().nullable(),
  risk_level: z.string().nullable(),
  kpi_impact: z.string().nullable(),
  responsible_agent: z.string().nullable(),
});

export type DentalDomain = z.infer<typeof DentalDomainSchema>;
export type DentalCategory = z.infer<typeof DentalCategorySchema>;
export type DentalItem = z.infer<typeof DentalItemSchema>;
export type DentalCommercialBenefit = z.infer<typeof DentalCommercialBenefitSchema>;
export type DentalImplementationQuestion = z.infer<typeof DentalImplementationQuestionSchema>;
export type DentalAutomationBlueprint = z.infer<typeof DentalAutomationBlueprintSchema>;
