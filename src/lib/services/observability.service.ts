export class ObservabilityService {
  static logError(context: string, error: Error | string) {
    const errorMsg = error instanceof Error ? error.message : error;
    console.error(`[Atlas HQ Telemetry] [ERROR] [${context}]`, errorMsg);
    // In production, this would send an HTTP POST to an external logging service
  }

  static logEvent(type: string, metadata: any = {}) {
    console.log(`[Atlas HQ Telemetry] [EVENT] ${type}`, JSON.stringify(metadata));
  }

  static trackLatency(operation: string, durationMs: number) {
    if (durationMs > 1000) {
      console.warn(`[Atlas HQ Telemetry] [LATENCY WARNING] ${operation} took ${durationMs}ms`);
    } else {
      console.log(`[Atlas HQ Telemetry] [LATENCY] ${operation}: ${durationMs}ms`);
    }
  }

  static logIdempotencyHit(eventId: string) {
    console.info(`[Atlas HQ Telemetry] [IDEMPOTENCY] Skipped duplicate event processing for ${eventId}`);
  }
}
