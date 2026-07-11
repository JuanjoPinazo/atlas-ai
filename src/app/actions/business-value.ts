"use server";

import { BusinessValueRepository } from '@/lib/repositories/business-value';

export async function fetchBusinessValueData() {
  try {
    const opportunities = await BusinessValueRepository.getOpportunities();
    return {
      success: true,
      data: { opportunities }
    };
  } catch (error: any) {
    return {
      success: false,
      error: error.message
    };
  }
}
