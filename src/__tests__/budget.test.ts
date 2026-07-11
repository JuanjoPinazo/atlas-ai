import { describe, it, expect, beforeEach } from 'vitest';
import { EventRouterService } from '@/lib/services/event-bus';
import { LocalDB } from '@/lib/services/local-db';

describe('Event Bus ROI Strictness', () => {
  beforeEach(() => {
    // Reset local DB state
    LocalDB.saveDB({
      patients: [],
      budgets: [],
      events: [],
      roi_events: [],
      opportunities: []
    });
  });

  it('does NOT generate ROI if BudgetAccepted occurs without prior BudgetFollowUpDue in correlation', () => {
    // Simulamos un evento de presupuesto aceptado que no viene del motor de seguimiento (por ej, el paciente aceptó por su cuenta)
    const dbBefore = LocalDB.getDB();
    expect(dbBefore.roi_events.length).toBe(0);

    EventRouterService.route({
      id: 'evt-1',
      type: 'BudgetAccepted',
      payload: { budget_id: 'b-1', amount: 1000 },
      correlationId: 'b-1'
    });

    const dbAfter = LocalDB.getDB();
    expect(dbAfter.roi_events.length).toBe(0); // No ROI attributed
  });

  it('generates ROI if BudgetAccepted occurs WITH prior BudgetFollowUpDue in correlation', () => {
    const dbBefore = LocalDB.getDB();
    
    // Inyectamos el evento previo
    dbBefore.events.push({
      id: 'evt-1',
      type: 'BudgetFollowUpDue',
      payload: { budget_id: 'b-2', amount: 2000, days: 15 },
      correlationId: 'b-2',
      causationId: null,
      timestamp: new Date().toISOString(),
      status: 'COMPLETED'
    });
    LocalDB.saveDB(dbBefore);

    // Routamos el evento de aceptación
    EventRouterService.route({
      id: 'evt-2',
      type: 'BudgetAccepted',
      payload: { budget_id: 'b-2', amount: 2000 },
      correlationId: 'b-2'
    });

    const dbAfter = LocalDB.getDB();
    expect(dbAfter.roi_events.length).toBe(1);
    expect(dbAfter.roi_events[0].value).toBe(2000);
  });

  it('is idempotent: processing the same BudgetAccepted twice does NOT duplicate ROI', () => {
    const dbBefore = LocalDB.getDB();
    
    dbBefore.events.push({
      id: 'evt-1',
      type: 'BudgetFollowUpDue',
      payload: { budget_id: 'b-3', amount: 3000, days: 15 },
      correlationId: 'b-3',
      causationId: null,
      timestamp: new Date().toISOString(),
      status: 'COMPLETED'
    });
    LocalDB.saveDB(dbBefore);

    const acceptEvent = {
      id: 'evt-3',
      type: 'BudgetAccepted',
      payload: { budget_id: 'b-3', amount: 3000 },
      correlationId: 'b-3'
    };

    EventRouterService.route(acceptEvent);
    const dbAfterFirst = LocalDB.getDB();
    expect(dbAfterFirst.roi_events.length).toBe(1);

    // Routamos el mismo evento otra vez (replay/idempotency failure test)
    EventRouterService.route(acceptEvent);
    const dbAfterSecond = LocalDB.getDB();
    // Debería seguir siendo 1
    expect(dbAfterSecond.roi_events.length).toBe(1);
  });
});
