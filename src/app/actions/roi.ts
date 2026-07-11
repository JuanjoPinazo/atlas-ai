"use server";

import { ROIRepositoryFactory } from '@/lib/repositories/roi/roi.factory';

export async function fetchROIMetrics() {
  try {
    const orgId = '00000000-0000-0000-0000-000000000000';
    const repo = ROIRepositoryFactory.getRepository();
    const metrics = await repo.getROIMetrics(orgId);
    
    return metrics;
  } catch (error: any) {
    return {
      success: false,
      data: undefined,
      error: error.message
    };
  }
}
