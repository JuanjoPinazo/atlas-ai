import { IBudgetRepository, Budget } from './budget.repository.interface';
import { LocalDB } from '@/lib/services/local-db';
import { EventBusService } from '@/lib/services/event-bus';

export class LocalBudgetRepository implements IBudgetRepository {
  async fetchBudgets(tenantId: string) {
    const db = LocalDB.getDB();
    const budgets: Budget[] = db.budgets.map((b: any) => {
      const p = db.patients.find((pat: any) => pat.id === b.patient_id);
      return { 
        id: b.id,
        patient_id: b.patient_id,
        amount: b.amount,
        status: b.status,
        treatment: b.treatment,
        issued_at: b.issued_at,
        follow_up_count: b.follow_up_count,
        patient: p 
      };
    });
    return { success: true, data: budgets };
  }

  async fetchBudgetDetail(tenantId: string, id: string) {
    const db = LocalDB.getDB();
    const b = db.budgets.find((b: any) => b.id === id);
    if (!b) return { success: false, error: 'Not found' };
    
    const p = db.patients.find((pat: any) => pat.id === b.patient_id);
    const history = db.events.filter((e: any) => e.correlationId === id);
    const opp = db.opportunities.find((o: any) => o.budget_id === id);
    
    return {
      success: true,
      data: { ...b, patient: p, history, opportunity: opp }
    };
  }

  async simulateTime(tenantId: string, days: number) {
    const db = LocalDB.getDB();
    db.budgets.forEach((b: any) => {
      if (b.status === 'PENDING_DECISION') {
        const issued = new Date(b.issued_at);
        issued.setDate(issued.getDate() - days);
        b.issued_at = issued.toISOString();
        
        const elapsedDays = Math.floor((new Date().getTime() - issued.getTime()) / (1000 * 3600 * 24));
        
        if (elapsedDays >= 14 && b.follow_up_count === 0) {
          EventBusService.emit('BudgetFollowUpDue', { budget_id: b.id, amount: b.amount, days: elapsedDays }, b.id);
        }
      }
    });
    LocalDB.saveDB(db);
    return { success: true };
  }

  async simulateAction(tenantId: string, action: string, budgetId: string) {
    const db = LocalDB.getDB();
    const budget = db.budgets.find((b: any) => b.id === budgetId);
    if (!budget) return { success: false, error: 'Budget not found' };

    if (action === 'APPROVE_FOLLOW_UP') {
      budget.follow_up_count += 1;
      budget.status = 'FOLLOW_UP_SCHEDULED';
      EventBusService.emit('FollowUpApproved', { budget_id: budgetId, method: 'WHATSAPP' }, budgetId);
      LocalDB.saveDB(db);
    }

    if (action === 'ACCEPT_BUDGET') {
      budget.status = 'ACCEPTED';
      EventBusService.emit('BudgetAccepted', { budget_id: budgetId, amount: budget.amount }, budgetId);
      LocalDB.saveDB(db);
    }

    if (action === 'REJECT_BUDGET') {
      budget.status = 'REJECTED';
      EventBusService.emit('BudgetRejected', { budget_id: budgetId }, budgetId);
      LocalDB.saveDB(db);
    }

    return { success: true };
  }
}
