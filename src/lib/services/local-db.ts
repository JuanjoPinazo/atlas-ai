import fs from 'fs';
import path from 'path';

// This is a local JSON file DB to simulate Supabase persistence
// since we don't have access to the remote Supabase DB's schema
// and Docker is not available for a local instance.

const DB_PATH = path.join(process.cwd(), '.data', 'atlas_db.json');

export interface DBState {
  patients: { id: string; pms_id: string; name: string; channel: string }[];
  budgets: { id: string; patient_id: string; amount: number; status: string; treatment: string; issued_at: string; follow_up_count: number }[];
  events: { id: string; type: string; payload: unknown; correlationId: string; causationId: string | null; timestamp: string; status: string }[];
  roi_events: { id: string; event_id: string; type: string; value: number; created_at: string }[];
  opportunities: { id: string; type: string; budget_id: string; status: string; impact: number; created_at: string }[];
}

const INITIAL_STATE: DBState = {
  patients: [
    { id: 'p-1', pms_id: 'pms-992', name: 'Carlos Rodríguez', channel: 'WHATSAPP' },
    { id: 'p-2', pms_id: 'pms-812', name: 'Laura Martínez', channel: 'EMAIL' }
  ],
  budgets: [
    { id: 'b-1', patient_id: 'p-1', amount: 3500, status: 'PENDING_DECISION', treatment: 'Ortodoncia Invisible', issued_at: new Date(Date.now() - 15 * 24 * 3600 * 1000).toISOString(), follow_up_count: 0 },
    { id: 'b-2', patient_id: 'p-2', amount: 1200, status: 'PENDING_DECISION', treatment: 'Blanqueamiento y Carillas', issued_at: new Date(Date.now() - 2 * 24 * 3600 * 1000).toISOString(), follow_up_count: 0 }
  ],
  events: [],
  roi_events: [],
  opportunities: []
};

export class LocalDB {
  static getDB(): DBState {
    if (!fs.existsSync(path.dirname(DB_PATH))) {
      fs.mkdirSync(path.dirname(DB_PATH), { recursive: true });
    }
    if (!fs.existsSync(DB_PATH)) {
      fs.writeFileSync(DB_PATH, JSON.stringify(INITIAL_STATE, null, 2));
      return INITIAL_STATE;
    }
    return JSON.parse(fs.readFileSync(DB_PATH, 'utf-8'));
  }

  static saveDB(state: DBState) {
    fs.writeFileSync(DB_PATH, JSON.stringify(state, null, 2));
  }
}
