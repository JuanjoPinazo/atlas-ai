"use server";

import { DiscoveryRepository } from '@/lib/repositories/discovery';
import { AssessmentRepositoryFactory } from '@/lib/repositories/assessment/assessment.factory';

export async function processDiscoveryForm(data: any) {
  try {
    const repo = AssessmentRepositoryFactory.getRepository();
    // Use default tenant session for the demo
    const sessionRes = await repo.getLatestSession('00000000-0000-0000-0000-000000000000');
    
    if (!sessionRes.data) {
      throw new Error('No assessment found');
    }

    const result = await DiscoveryRepository.getDiscoveryResultFromAssessment(sessionRes.data.id);
    return {
      success: true,
      data: result
    };
  } catch (error: any) {
    return {
      success: false,
      error: error.message
    };
  }
}
