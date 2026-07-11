import { IBudgetRepository, Budget } from './budget.repository.interface';
import { DEMO_STATE } from './fixtures';

export class DemoBudgetRepository implements IBudgetRepository {
  private state = JSON.parse(JSON.stringify(DEMO_STATE));

  async fetchBudgets(tenantId: string) {
    const budgets: Budget[] = this.state.budgets.map((b: any) => {
      const p = this.state.patients.find((pat: any) => pat.id === b.patient_id);
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
    const b = this.state.budgets.find((b: any) => b.id === id);
    if (!b) return { success: false, error: 'Not found' };
    
    const p = this.state.patients.find((pat: any) => pat.id === b.patient_id);
    const history = this.state.events.filter((e: any) => e.correlationId === id);
    const opp = this.state.opportunities.find((o: any) => o.budget_id === id);
    
    return {
      success: true,
      data: { ...b, patient: p, history, opportunity: opp }
    };
  }

  async simulateTime(tenantId: string, days: number) {
    this.state.budgets.forEach((b: any) => {
      if (b.status === 'PENDING_DECISION') {
        const issued = new Date(b.issued_at);
        issued.setDate(issued.getDate() - days);
        b.issued_at = issued.toISOString();
        
        const elapsedDays = Math.floor((new Date().getTime() - issued.getTime()) / (1000 * 3600 * 24));
        
        if (elapsedDays >= 14 && b.follow_up_count === 0) {
          this.state.events.push({
            id: 'evt-' + Math.random(),
            type: 'BudgetFollowUpDue',
            payload: { budget_id: b.id, amount: b.amount, days: elapsedDays },
            correlationId: b.id,
            timestamp: new Date().toISOString()
          });
          this.state.opportunities.push({
            id: 'opp-' + Math.random(),
            type: 'ABVL-01',
            budget_id: b.id,
            status: 'DETECTED',
            impact: b.amount
          });
        }
      }
    });
    return { success: true };
  }

  async simulateAction(tenantId: string, action: string, budgetId: string) {
    const budget = this.state.budgets.find((b: any) => b.id === budgetId);
    if (!budget) return { success: false, error: 'Budget not found' };

    if (action === 'APPROVE_FOLLOW_UP') {
      budget.follow_up_count += 1;
      budget.status = 'FOLLOW_UP_SCHEDULED';
      this.state.events.push({
        id: 'evt-' + Math.random(),
        type: 'FollowUpApproved',
        payload: { budget_id: budgetId, method: 'WHATSAPP' },
        correlationId: budgetId,
        timestamp: new Date().toISOString()
      });
    }

    if (action === 'ACCEPT_BUDGET') {
      budget.status = 'ACCEPTED';
      this.state.events.push({
        id: 'evt-' + Math.random(),
        type: 'BudgetAccepted',
        payload: { budget_id: budgetId, amount: budget.amount },
        correlationId: budgetId,
        timestamp: new Date().toISOString()
      });
    }

    if (action === 'REJECT_BUDGET') {
      budget.status = 'REJECTED';
      this.state.events.push({
        id: 'evt-' + Math.random(),
        type: 'BudgetRejected',
        payload: { budget_id: budgetId },
        correlationId: budgetId,
        timestamp: new Date().toISOString()
      });
    }

    return { success: true };
  }
}
