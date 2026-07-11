import { IROIRepository } from './roi.repository.interface';
import { LocalDB } from '@/lib/services/local-db';
import { ObservabilityService } from '@/lib/services/observability.service';

export class LocalROIRepository implements IROIRepository {
  async attributeROIIdempotent(eventId: string, organizationId: string, correlationId: string, amount: number): Promise<void> {
    const db = LocalDB.getDB();
    const hasFollowUp = db.events.some(e => e.correlationId === correlationId && e.type === 'BudgetFollowUpDue');
    const roiExists = db.roi_events.some(r => r.event_id === eventId);
    
    if (hasFollowUp && !roiExists) {
      db.roi_events.push({
        id: 'roi-' + Math.random().toString(36).substr(2, 9),
        event_id: eventId,
        type: 'ABVL-01',
        value: amount,
        created_at: new Date().toISOString()
      });
      LocalDB.saveDB(db);
      ObservabilityService.logEvent('ROI_ATTRIBUTED', { amount });
    } else if (hasFollowUp && roiExists) {
      ObservabilityService.logIdempotencyHit(eventId);
    }
  }

  async getROIMetrics(organizationId: string): Promise<{ success: boolean; data?: any; error?: string }> {
    const db = LocalDB.getDB();
    const realGenerated = db.roi_events.reduce((acc, curr) => acc + curr.value, 0);
    return {
      success: true,
      data: {
        totalGenerated: realGenerated,
        realGenerated: realGenerated,
        realEventsCount: db.roi_events.length
      }
    };
  }
}
