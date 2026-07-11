"use server";

import { DentalKnowledgeRepository } from '@/lib/repositories/dental-knowledge';

export async function fetchDentalKnowledgeData(tenantId: string) {
  try {
    const [domains, categories, items, benefits, questions, automations] = await Promise.all([
      DentalKnowledgeRepository.getDomains(tenantId),
      DentalKnowledgeRepository.getCategories(tenantId),
      DentalKnowledgeRepository.getItems(tenantId),
      DentalKnowledgeRepository.getCommercialBenefits(tenantId),
      DentalKnowledgeRepository.getImplementationQuestions(tenantId),
      DentalKnowledgeRepository.getAutomations(tenantId)
    ]);

    return {
      success: true,
      data: {
        domains,
        categories,
        items,
        benefits,
        questions,
        automations
      }
    };
  } catch (error: any) {
    return {
      success: false,
      error: error.message
    };
  }
}
