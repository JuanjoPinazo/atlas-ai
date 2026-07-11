import { z } from 'zod';

export const TrainingRecordSchema = z.object({
  id: z.string(),
  course_name: z.string(),
  version: z.string(),
  date_completed: z.string(),
  confidence_level: z.number().min(0).max(100),
  knowledge_domain: z.string()
});

export const DigitalEmployeeProfileSchema = z.object({
  id: z.string(),
  name: z.string(),
  specialty: z.string(),
  avatar_url: z.string().optional(),
  mission: z.string(),
  competencies: z.array(z.string()),
  tools: z.array(z.string()),
  permissions: z.array(z.string()),
  objectives: z.array(z.string()),
  kpis: z.array(z.object({
    name: z.string(),
    value: z.string(),
    trend: z.string()
  })),
  roi_generated: z.number(),
  certifications: z.array(z.string()),
  training_history: z.array(TrainingRecordSchema),
  status: z.enum(['active', 'training', 'offline'])
});

export const OrgNodeSchema = z.object({
  id: z.string(),
  name: z.string(),
  role: z.string(),
  type: z.enum(['human', 'digital']),
  children: z.array(z.any()).optional() // Recursive type
});

export type DigitalEmployeeProfile = z.infer<typeof DigitalEmployeeProfileSchema>;
export type TrainingRecord = z.infer<typeof TrainingRecordSchema>;
export type OrgNode = z.infer<typeof OrgNodeSchema>;
