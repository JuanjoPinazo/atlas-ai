"use server";

import { CommandCenterRepository } from '@/lib/repositories/command-center';

export async function fetchCommandCenterData() {
  try {
    const clients = await CommandCenterRepository.getClients();
    const alerts = await CommandCenterRepository.getAlerts();
    
    return {
      success: true,
      data: { clients, alerts }
    };
  } catch (error: any) {
    return {
      success: false,
      error: error.message
    };
  }
}
