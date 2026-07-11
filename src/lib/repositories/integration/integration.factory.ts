import { SERVER_ENVIRONMENT } from '@/config/server-environment';
import { IIntegrationRepository } from './integration.repository.interface';
import { SupabaseIntegrationRepository } from './supabase-integration.repository';
import { LocalIntegrationRepository } from './local-integration.repository';

export class IntegrationRepositoryFactory {
  static getRepository(): IIntegrationRepository {
    if (SERVER_ENVIRONMENT.DATA_PROVIDER === 'supabase') {
      return new SupabaseIntegrationRepository();
    }
    
    if (SERVER_ENVIRONMENT.DATA_PROVIDER === 'local') {
      return new LocalIntegrationRepository();
    }
    
    throw new Error(`ATLAS_RUNTIME_ERROR: IntegrationRepository not implemented for data provider: ${SERVER_ENVIRONMENT.DATA_PROVIDER}`);
  }
}
