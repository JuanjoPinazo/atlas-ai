import { IInterviewRepository } from './interview.repository.interface';
import { SupabaseInterviewRepository } from './supabase-interview.repository';
import { LocalInterviewRepository } from './local-interview.repository';
import { SERVER_ENVIRONMENT } from '@/config/server-environment';

export class InterviewRepositoryFactory {
  static getRepository(): IInterviewRepository {
    if (SERVER_ENVIRONMENT.RUNTIME_MODE === 'development_local' && SERVER_ENVIRONMENT.DATA_PROVIDER === 'local') {
      // Retornaríamos un local db si persistiera entre requests.
      // Sin embargo, para Next.js con dev local, la implementación supabase-local suele usarse
      // si usamos Supabase local (Docker).
      // Si el proyecto usa un mock puro en desarrollo local (singleton in memory):
      if (!global.localInterviewRepo) {
        global.localInterviewRepo = new LocalInterviewRepository();
      }
      return global.localInterviewRepo;
    }

    // Por defecto y para production/staging (o local-supabase)
    return new SupabaseInterviewRepository();
  }
}

declare global {
  var localInterviewRepo: LocalInterviewRepository | undefined;
}
