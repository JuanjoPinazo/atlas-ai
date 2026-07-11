import { IBudgetRepository } from './budget.repository.interface';
import { SupabaseBudgetRepository } from './supabase-budget.repository';
import { LocalBudgetRepository } from './local-budget.repository';
import { DemoBudgetRepository } from './demo-budget.repository';
import { SERVER_ENVIRONMENT } from '@/config/server-environment';

export class BudgetRepositoryFactory {
  static getRepository(): IBudgetRepository {
    if (SERVER_ENVIRONMENT.DATA_PROVIDER === 'supabase') {
      return new SupabaseBudgetRepository();
    }
    
    if (SERVER_ENVIRONMENT.RUNTIME_MODE === 'development_local' && SERVER_ENVIRONMENT.DATA_PROVIDER === 'local') {
      return new LocalBudgetRepository();
    }
    
    if (SERVER_ENVIRONMENT.RUNTIME_MODE === 'demo' && SERVER_ENVIRONMENT.DATA_PROVIDER === 'local') {
      return new DemoBudgetRepository();
    }
    
    throw new Error(`ATLAS_RUNTIME_ERROR: BudgetRepository not configured for mode ${SERVER_ENVIRONMENT.RUNTIME_MODE} and provider ${SERVER_ENVIRONMENT.DATA_PROVIDER}`);
  }
}
