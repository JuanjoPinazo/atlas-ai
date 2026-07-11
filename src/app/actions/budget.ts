"use server";

import { BudgetRepositoryFactory } from '@/lib/repositories/budget/budget.factory';

// Note: tenantId should dynamically come from the session, 
// for demo we mock it or pass it. Using a default for now.
const DEFAULT_TENANT = '00000000-0000-0000-0000-000000000000';

export async function fetchBudgets() {
  const repo = BudgetRepositoryFactory.getRepository();
  return repo.fetchBudgets(DEFAULT_TENANT);
}

export async function fetchBudgetDetail(id: string) {
  const repo = BudgetRepositoryFactory.getRepository();
  return repo.fetchBudgetDetail(DEFAULT_TENANT, id);
}

export async function simulateTime(days: number) {
  const repo = BudgetRepositoryFactory.getRepository();
  return repo.simulateTime(DEFAULT_TENANT, days);
}

export async function simulateAction(action: string, budgetId: string) {
  const repo = BudgetRepositoryFactory.getRepository();
  return repo.simulateAction(DEFAULT_TENANT, action, budgetId);
}
