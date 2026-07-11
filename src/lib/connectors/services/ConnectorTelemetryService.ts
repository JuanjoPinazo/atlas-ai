import { ObservabilityService } from '@/lib/services/observability.service';

export class ConnectorTelemetryService {
  static logSyncStart(organizationId: string, connectorType: string, syncType: string) {
    ObservabilityService.logEvent('CONNECTOR_SYNC_START', { organizationId, connectorType, syncType });
  }

  static logSyncEnd(organizationId: string, connectorType: string, records: number, durationMs: number) {
    ObservabilityService.logEvent('CONNECTOR_SYNC_END', { organizationId, connectorType, records, durationMs });
  }

  static logError(organizationId: string, connectorType: string, errorMsg: string) {
    ObservabilityService.logError(`CONNECTOR_SYNC_ERROR`, new Error(`${connectorType}: ${errorMsg}`));
  }
}
