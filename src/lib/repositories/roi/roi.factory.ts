import { IROIRepository } from './roi.repository.interface';
import { SupabaseROIRepository } from './supabase-roi.repository';
import { LocalROIRepository } from './local-roi.repository';
import { SERVER_ENVIRONMENT } from '@/config/server-environment';

export class ROIRepositoryFactory {
  static getRepository(): IROIRepository {
    if (SERVER_ENVIRONMENT.DATA_PROVIDER === 'supabase') {
      return new SupabaseROIRepository();
    }
    if (SERVER_ENVIRONMENT.DATA_PROVIDER === 'local') {
      return new LocalROIRepository();
    }
    
    throw new Error(`ATLAS_RUNTIME_ERROR: ROIRepository not implemented for data provider: ${SERVER_ENVIRONMENT.DATA_PROVIDER}`);
  }
}
