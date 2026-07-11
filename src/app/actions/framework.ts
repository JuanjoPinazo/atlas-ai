"use server";

import { FrameworkRepository } from '@/lib/repositories/framework';

export async function fetchFrameworkEngines() {
  try {
    const engines = await FrameworkRepository.getEngines();
    return {
      success: true,
      data: engines
    };
  } catch (error: any) {
    return {
      success: false,
      error: error.message
    };
  }
}
