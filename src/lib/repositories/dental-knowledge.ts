import { createClient } from '@/lib/supabase/server';
import { ObservabilityService } from '@/lib/services/observability.service';
import { 
  DentalDomain, 
  DentalCategory, 
  DentalItem,
  DentalCommercialBenefit,
  DentalImplementationQuestion,
  DentalAutomationBlueprint
} from '../schemas/dental-knowledge';
import { SERVER_ENVIRONMENT } from '@/config/server-environment';

export class DentalKnowledgeRepository {
  
  static async getDomains(tenantId: string): Promise<DentalDomain[]> {
    if (SERVER_ENVIRONMENT.DATA_PROVIDER !== 'supabase') {
      return [
        { id: 'dom-1', tenant_id: tenantId, name: 'Modelos de clínica', description: 'Organización', icon: 'Building' }
      ];
    }
    try {
      const supabase = await createClient();
      const { data, error } = await supabase
        .from('dental_knowledge_domains')
        .select('*')
        .eq('tenant_id', tenantId);
        
      if (error) throw error;
      return data || [];
    } catch (e: any) {
      ObservabilityService.logError('DentalKnowledgeRepository.getDomains failed', e);
      throw e;
    }
  }

  static async getCategories(tenantId: string): Promise<DentalCategory[]> {
    if (SERVER_ENVIRONMENT.DATA_PROVIDER !== 'supabase') {
      return [
        { id: 'cat-1', tenant_id: tenantId, domain_id: 'dom-1', name: 'Agenda', description: 'Gestión de citas' },
        { id: 'cat-2', tenant_id: tenantId, domain_id: 'dom-1', name: 'Recepción', description: 'Operaciones de mostrador' }
      ];
    }
    try {
      const supabase = await createClient();
      const { data, error } = await supabase
        .from('dental_knowledge_categories')
        .select('*')
        .eq('tenant_id', tenantId);
        
      if (error) throw error;
      return data || [];
    } catch (e: any) {
      ObservabilityService.logError('DentalKnowledgeRepository.getCategories failed', e);
      throw e;
    }
  }

  static async getItems(tenantId: string): Promise<DentalItem[]> {
    if (SERVER_ENVIRONMENT.DATA_PROVIDER !== 'supabase') {
      return [
        {
          id: 'item-1',
          tenant_id: tenantId,
          category_id: 'cat-1',
          title: 'Gestión de Cancelaciones Última Hora',
          description: 'Protocolo de recuperación de huecos',
          problem_solved: 'Pérdida de ingresos por huecos vacíos',
          current_process: 'Llamadas manuales',
          atlas_proposal: 'Envío automático WhatsApp',
          limits: 'No agendar cirugías complejas',
          risks: 'Riesgo bajo',
          benefits: 'Recuperación del 60% de huecos',
          kpis: 'Tasa recuperación',
          example: 'Paciente A cancela, B entra.',
          commercial_argument: '1.500€/semana extra',
          contextual_help: 'Requiere integración de agenda',
          applicable_clinics: ['privada', 'franquicia'],
          applicable_specialties: [],
          priority: 'MVP',
          status: 'aprobado',
          confidence_level: 95,
          responsible: 'Dra. Elena',
          version: 1,
          last_review_date: new Date().toISOString(),
          is_deleted: false,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }
      ];
    }
    try {
      const supabase = await createClient();
      const { data, error } = await supabase
        .from('dental_knowledge_items')
        .select('*')
        .eq('tenant_id', tenantId)
        .eq('is_deleted', false);
        
      if (error) throw error;
      return data || [];
    } catch (e: any) {
      ObservabilityService.logError('DentalKnowledgeRepository.getItems failed', e);
      throw e;
    }
  }

  static async getCommercialBenefits(tenantId: string): Promise<DentalCommercialBenefit[]> {
    if (SERVER_ENVIRONMENT.DATA_PROVIDER !== 'supabase') {
      return [
        { id: 'b1', item_id: 'item-1', target_role: 'gerente', problem: 'Pérdida', solution: 'Auto', benefit: 'Sillones llenos', kpi: 'Ocupación', economic_impact_expected: '+6,000/mes', evidence_level: 'alta', example: '' }
      ];
    }
    try {
      const supabase = await createClient();
      const { data, error } = await supabase
        .from('dental_commercial_benefits')
        .select('*')
        .eq('tenant_id', tenantId);
      if (error) throw error;
      return data || [];
    } catch (e: any) {
      ObservabilityService.logError('DentalKnowledgeRepository.getCommercialBenefits failed', e);
      throw e;
    }
  }

  static async getImplementationQuestions(tenantId: string): Promise<DentalImplementationQuestion[]> {
    if (SERVER_ENVIRONMENT.DATA_PROVIDER !== 'supabase') {
      return [
        { id: 'q1', item_id: 'item-1', category: 'agenda', question_text: '¿Cuánta antelación pedís?' }
      ];
    }
    try {
      const supabase = await createClient();
      const { data, error } = await supabase
        .from('dental_implementation_questions')
        .select('*')
        .eq('tenant_id', tenantId);
      if (error) throw error;
      return data || [];
    } catch (e: any) {
      ObservabilityService.logError('DentalKnowledgeRepository.getImplementationQuestions failed', e);
      throw e;
    }
  }

  static async getAutomations(tenantId: string): Promise<DentalAutomationBlueprint[]> {
    if (SERVER_ENVIRONMENT.DATA_PROVIDER !== 'supabase') {
      return [
        { id: 'a1', item_id: 'item-1', trigger_event: 'Cancelación', conditions: '< 24h', action: 'Enviar mensaje', requires_approval: false, channel: 'WhatsApp', risk_level: 'Bajo', kpi_impact: 'Alta', responsible_agent: 'Atlas Clínico' }
      ];
    }
    try {
      const supabase = await createClient();
      const { data, error } = await supabase
        .from('dental_automation_blueprints')
        .select('*')
        .eq('tenant_id', tenantId);
      if (error) throw error;
      return data || [];
    } catch (e: any) {
      ObservabilityService.logError('DentalKnowledgeRepository.getAutomations failed', e);
      throw e;
    }
  }
}
