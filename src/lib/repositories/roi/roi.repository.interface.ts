export interface IROIRepository {
  attributeROIIdempotent(eventId: string, organizationId: string, correlationId: string, amount: number): Promise<{ success: boolean; data?: any; error?: string } | void>;
  getROIMetrics(organizationId: string): Promise<{ success: boolean; data?: any; error?: string }>;
}
