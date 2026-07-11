export const DEMO_STATE = {
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
