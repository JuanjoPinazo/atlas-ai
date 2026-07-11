import { IEventStoreRepository } from './event.repository.interface';
import { SupabaseEventStoreRepository } from './supabase-event-store.repository';
import { LocalEventStoreRepository } from './local-event-store.repository';
import { SERVER_ENVIRONMENT } from '@/config/server-environment';

export class EventStoreFactory {
  static getRepository(): IEventStoreRepository {
    if (SERVER_ENVIRONMENT.DATA_PROVIDER === 'supabase') {
      return new SupabaseEventStoreRepository();
    }
    
    if (SERVER_ENVIRONMENT.DATA_PROVIDER === 'local') {
      return new LocalEventStoreRepository();
    }
    
    throw new Error(`ATLAS_RUNTIME_ERROR: EventStore not implemented for data provider: ${SERVER_ENVIRONMENT.DATA_PROVIDER}`);
  }
}
