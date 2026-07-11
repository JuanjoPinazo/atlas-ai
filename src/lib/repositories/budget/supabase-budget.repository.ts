import { IBudgetRepository, Budget } from './budget.repository.interface';
import { createClient } from '@/lib/supabase/server';
import { EventBusService } from '@/lib/services/event-bus';

export class SupabaseBudgetRepository implements IBudgetRepository {
  async fetchBudgets(tenantId: string) {
    try {
      const supabase = await createClient();
      const { data, error } = await supabase
        .from('dental_budgets')
        .select('*, patient:dental_patients_reference(*)')
        .eq('organization_id', tenantId);

      if (error) throw error;
      
      // Mapear la salida
      const budgets: Budget[] = data.map((b: any) => ({
        id: b.id,
        patient_id: b.patient_id,
        amount: b.total_amount,
        status: b.status,
        treatment: b.general_treatment,
        issued_at: b.issued_at,
        follow_up_count: b.follow_up_count,
        patient: b.patient ? {
          id: b.patient.id,
          name: b.patient.display_name,
          channel: b.patient.preferred_channel
        } : undefined
      }));

      return { success: true, data: budgets };
    } catch (err: any) {
      console.error("[SupabaseBudgetRepository] Error fetching budgets:", err);
      return { success: false, error: err.message };
    }
  }

  async fetchBudgetDetail(tenantId: string, id: string) {
    try {
      const supabase = await createClient();
      const { data, error } = await supabase
        .from('dental_budgets')
        .select('*, patient:dental_patients_reference(*)')
        .eq('organization_id', tenantId)
        .eq('id', id)
        .single();

      if (error) throw error;

      // Obtener historial y oportunidades
      const { data: history } = await supabase
        .from('platform_events')
        .select('*')
        .eq('organization_id', tenantId)
        .eq('correlation_id', id);

      const { data: opps } = await supabase
        .from('opportunity_candidates')
        .select('*')
        .eq('organization_id', tenantId)
        .eq('reference_id', id)
        .single();

      const budget: Budget & { history?: any[]; opportunity?: any } = {
        id: data.id,
        patient_id: data.patient_id,
        amount: data.total_amount,
        status: data.status,
        treatment: data.general_treatment,
        issued_at: data.issued_at,
        follow_up_count: data.follow_up_count,
        patient: data.patient ? {
          id: data.patient.id,
          name: data.patient.display_name,
          channel: data.patient.preferred_channel
        } : undefined,
        history: history || [],
        opportunity: opps || undefined
      };

      return { success: true, data: budget };
    } catch (err: any) {
      console.error("[SupabaseBudgetRepository] Error fetching budget detail:", err);
      return { success: false, error: err.message };
    }
  }

  async simulateTime(tenantId: string, days: number) {
    try {
      const supabase = await createClient();
      // Esto es una acción peligrosa, normalmente se usaría un RPC
      const { data: budgets } = await supabase
        .from('dental_budgets')
        .select('*')
        .eq('organization_id', tenantId)
        .eq('status', 'PENDING_DECISION');

      if (!budgets) return { success: true };

      for (const b of budgets) {
        const issued = new Date(b.issued_at);
        issued.setDate(issued.getDate() - days);
        const elapsedDays = Math.floor((new Date().getTime() - issued.getTime()) / (1000 * 3600 * 24));

        await supabase.from('dental_budgets').update({ issued_at: issued.toISOString() }).eq('id', b.id);

        if (elapsedDays >= 14 && b.follow_up_count === 0) {
          // Emitir evento (lo hace en Supabase si el bus usa supabase o usa EventBusService modificado para usar supabase)
          // El EventBusService actual usa LocalDB temporalmente. Para Production Readiness, debe usar SupabaseEventStore.
          EventBusService.emit('BudgetFollowUpDue', { budget_id: b.id, amount: b.total_amount, days: elapsedDays }, b.id);
        }
      }
      return { success: true };
    } catch (err: any) {
      return { success: false, error: err.message };
    }
  }

  async simulateAction(tenantId: string, action: string, budgetId: string) {
    try {
      const supabase = await createClient();
      
      if (action === 'APPROVE_FOLLOW_UP') {
        await supabase.from('dental_budgets')
          .update({ status: 'FOLLOW_UP_SCHEDULED', follow_up_count: 1 })
          .eq('id', budgetId)
          .eq('organization_id', tenantId);
        EventBusService.emit('FollowUpApproved', { budget_id: budgetId, method: 'WHATSAPP' }, budgetId);
      }

      if (action === 'ACCEPT_BUDGET') {
        await supabase.from('dental_budgets')
          .update({ status: 'ACCEPTED' })
          .eq('id', budgetId)
          .eq('organization_id', tenantId);
        
        const { data } = await supabase.from('dental_budgets').select('total_amount').eq('id', budgetId).single();
        EventBusService.emit('BudgetAccepted', { budget_id: budgetId, amount: data?.total_amount }, budgetId);
      }

      if (action === 'REJECT_BUDGET') {
        await supabase.from('dental_budgets')
          .update({ status: 'REJECTED' })
          .eq('id', budgetId)
          .eq('organization_id', tenantId);
        EventBusService.emit('BudgetRejected', { budget_id: budgetId }, budgetId);
      }

      return { success: true };
    } catch (err: any) {
      return { success: false, error: err.message };
    }
  }
}
