import { SERVER_ENVIRONMENT } from '@/config/server-environment';
import { IAssessmentRepository } from './assessment.repository.interface';
import { SupabaseAssessmentRepository } from './supabase-assessment.repository';
import { LocalAssessmentRepository } from './local-assessment.repository';

export class AssessmentRepositoryFactory {
  static getRepository(): IAssessmentRepository {
    if (SERVER_ENVIRONMENT.DATA_PROVIDER === 'supabase') {
      return new SupabaseAssessmentRepository();
    }
    
    if (SERVER_ENVIRONMENT.DATA_PROVIDER === 'local') {
      return new LocalAssessmentRepository();
    }
    
    throw new Error(`ATLAS_RUNTIME_ERROR: AssessmentRepository not implemented for data provider: ${SERVER_ENVIRONMENT.DATA_PROVIDER}`);
  }
}
