import { SupabaseClient } from '@supabase/supabase-js';
import { Database } from '@/types/database';

export class BrainRepository {
  constructor(private supabase: SupabaseClient<Database>) {}

  // --- Company Brain Settings ---
  async getBrainConfig(companyId: string) {
    const { data, error } = await this.supabase
      .from('company_brain')
      .select('*')
      .eq('company_id', companyId)
      .single();

    if (error && error.code !== 'PGRST116') throw error; // Ignore not found
    return data;
  }

  async upsertBrainConfig(companyId: string, payload: Partial<Database['public']['Tables']['company_brain']['Insert']>) {
    const { data, error } = await (this.supabase.from('company_brain') as any)
      .upsert({ ...payload, company_id: companyId }, { onConflict: 'company_id' })
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  // --- Services ---
  async getServices(companyId: string) {
    const { data, error } = await this.supabase
      .from('company_services')
      .select('*')
      .eq('company_id', companyId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data;
  }

  async getServiceById(id: string, companyId: string) {
    const { data, error } = await this.supabase
      .from('company_services')
      .select('*')
      .eq('id', id)
      .eq('company_id', companyId)
      .single();

    if (error) throw error;
    return data;
  }

  async createService(payload: Database['public']['Tables']['company_services']['Insert']) {
    const { data, error } = await (this.supabase.from('company_services') as any)
      .insert(payload)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  async updateService(id: string, companyId: string, payload: Database['public']['Tables']['company_services']['Update']) {
    const { data, error } = await (this.supabase.from('company_services') as any)
      .update(payload)
      .eq('id', id)
      .eq('company_id', companyId)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  async deleteService(id: string, companyId: string) {
    const { error } = await this.supabase
      .from('company_services')
      .delete()
      .eq('id', id)
      .eq('company_id', companyId);

    if (error) throw error;
  }

  // --- Policies ---
  async getPolicies(companyId: string) {
    const { data, error } = await this.supabase
      .from('company_policies')
      .select('*')
      .eq('company_id', companyId)
      .order('priority', { ascending: false });

    if (error) throw error;
    return data;
  }

  async createPolicy(payload: Database['public']['Tables']['company_policies']['Insert']) {
    const { data, error } = await (this.supabase.from('company_policies') as any)
      .insert(payload)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  async updatePolicy(id: string, companyId: string, payload: Database['public']['Tables']['company_policies']['Update']) {
    const { data, error } = await (this.supabase.from('company_policies') as any)
      .update(payload)
      .eq('id', id)
      .eq('company_id', companyId)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  async deletePolicy(id: string, companyId: string) {
    const { error } = await this.supabase
      .from('company_policies')
      .delete()
      .eq('id', id)
      .eq('company_id', companyId);

    if (error) throw error;
  }

  // --- Prompts ---
  async getPrompts(companyId: string) {
    const { data, error } = await this.supabase
      .from('company_prompts')
      .select('*')
      .eq('company_id', companyId);

    if (error) throw error;
    return data;
  }

  // Similar CRUD methods can be added for documents, knowledge, memories, etc.

  // --- ADR-0002: Knowledge Domains ---
  async getDomains(companyId: string) {
    const { data, error } = await (this.supabase.from('knowledge_domains') as any)
      .select('*')
      .eq('company_id', companyId);
    if (error) throw error;
    return data;
  }

  async createDomain(payload: Database['public']['Tables']['knowledge_domains']['Insert']) {
    const { data, error } = await (this.supabase.from('knowledge_domains') as any)
      .insert(payload)
      .select()
      .single();
    if (error) throw error;
    return data;
  }

  // --- ADR-0002: Knowledge Sources ---
  async getSources(companyId: string) {
    const { data, error } = await (this.supabase.from('knowledge_sources') as any)
      .select('*')
      .eq('company_id', companyId);
    if (error) throw error;
    return data;
  }

  async createSource(payload: Database['public']['Tables']['knowledge_sources']['Insert']) {
    const { data, error } = await (this.supabase.from('knowledge_sources') as any)
      .insert(payload)
      .select()
      .single();
    if (error) throw error;
    return data;
  }

  // --- ADR-0002: Knowledge Units ---
  async getUnits(companyId: string) {
    const { data, error } = await (this.supabase.from('knowledge_units') as any)
      .select('*')
      .eq('company_id', companyId);
    if (error) throw error;
    return data;
  }

  async createUnit(payload: Database['public']['Tables']['knowledge_units']['Insert']) {
    const { data, error } = await (this.supabase.from('knowledge_units') as any)
      .insert(payload)
      .select()
      .single();
    if (error) throw error;
    return data;
  }

  // --- ADR-0002: Knowledge Proposals ---
  async getProposals(companyId: string) {
    const { data, error } = await (this.supabase.from('knowledge_proposals') as any)
      .select('*')
      .eq('company_id', companyId);
    if (error) throw error;
    return data;
  }

  async createProposal(payload: Database['public']['Tables']['knowledge_proposals']['Insert']) {
    const { data, error } = await (this.supabase.from('knowledge_proposals') as any)
      .insert(payload)
      .select()
      .single();
    if (error) throw error;
    return data;
  }
}
