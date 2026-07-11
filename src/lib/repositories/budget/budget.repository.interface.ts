export interface Patient {
  id: string;
  name: string;
  channel: string;
}

export interface Budget {
  id: string;
  patient_id: string;
  amount: number;
  status: string;
  treatment: string;
  issued_at: string;
  follow_up_count: number;
  patient?: Patient;
}

export interface IBudgetRepository {
  fetchBudgets(tenantId: string): Promise<{ success: boolean; data?: Budget[]; error?: string }>;
  fetchBudgetDetail(tenantId: string, id: string): Promise<{ success: boolean; data?: Budget & { history?: any[]; opportunity?: any }; error?: string }>;
  simulateTime(tenantId: string, days: number): Promise<{ success: boolean; error?: string }>;
  simulateAction(tenantId: string, action: string, budgetId: string): Promise<{ success: boolean; error?: string }>;
}
