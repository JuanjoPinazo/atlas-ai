"use server";

import { DiscoveryRepository } from '@/lib/repositories/discovery';

export async function processDiscoveryForm(data: any) {
  try {
    const result = await DiscoveryRepository.simulateDiscoveryResult(data);
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
