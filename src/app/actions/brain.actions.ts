'use server';

import { revalidatePath } from 'next/cache';
import { createClient } from '@/lib/supabase/server';
import { BrainRepository } from '@/lib/repositories/brain.repository';
import { Database } from '@/types/database';

export async function updateCompanyBrainSettings(
  companyId: string,
  payload: Partial<Database['public']['Tables']['company_brain']['Insert']>
) {
  try {
    const supabase = await createClient();
    
    // In a real application, you would verify the session and user permissions here.
    // const { data: { user } } = await supabase.auth.getUser();
    // if (!user) throw new Error("Unauthorized");
    
    const repo = new BrainRepository(supabase);
    const data = await repo.upsertBrainConfig(companyId, payload);
    
    revalidatePath(`/(dashboard)/${companyId}/brain`, 'layout');
    
    return { success: true, data };
  } catch (error: any) {
    console.error('Error updating brain settings:', error);
    return { success: false, error: error.message };
  }
}

export async function createCompanyService(
  companyId: string,
  payload: Database['public']['Tables']['company_services']['Insert']
) {
  try {
    const supabase = await createClient();
    const repo = new BrainRepository(supabase);
    
    // Ensure companyId is forced from the server side context
    const data = await repo.createService({ ...payload, company_id: companyId });
    
    revalidatePath(`/(dashboard)/${companyId}/brain/services`);
    
    return { success: true, data };
  } catch (error: any) {
    console.error('Error creating service:', error);
    return { success: false, error: error.message };
  }
}

export async function updateCompanyService(
  id: string,
  companyId: string,
  payload: Database['public']['Tables']['company_services']['Update']
) {
  try {
    const supabase = await createClient();
    const repo = new BrainRepository(supabase);
    
    const data = await repo.updateService(id, companyId, payload);
    
    revalidatePath(`/(dashboard)/${companyId}/brain/services`);
    
    return { success: true, data };
  } catch (error: any) {
    console.error('Error updating service:', error);
    return { success: false, error: error.message };
  }
}

export async function deleteCompanyService(id: string, companyId: string) {
  try {
    const supabase = await createClient();
    const repo = new BrainRepository(supabase);
    
    await repo.deleteService(id, companyId);
    
    revalidatePath(`/(dashboard)/${companyId}/brain/services`);
    
    return { success: true };
  } catch (error: any) {
    console.error('Error deleting service:', error);
    return { success: false, error: error.message };
  }
}

// Similarly, we can add actions for Policies, Prompts, Documents, etc.
