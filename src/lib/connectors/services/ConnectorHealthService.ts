import { ObservabilityService } from '@/lib/services/observability.service';

export class ConnectorHealthService {
  /**
   * Calcula un Health Score compuesto (0-100) basado en latencia y ratio de éxito.
   */
  static calculateHealthScore(latencyMs: number, errorCount: number, successCount: number): number {
    let score = 100;

    // Penalización por latencia (> 200ms)
    if (latencyMs > 200) score -= 10;
    if (latencyMs > 500) score -= 20;
    if (latencyMs > 1000) score -= 40;

    // Penalización por ratio de errores
    const total = errorCount + successCount;
    if (total > 0) {
      const errorRatio = errorCount / total;
      score -= (errorRatio * 50);
    }

    return Math.max(0, Math.floor(score));
  }

  static async reportHealthIssue(organizationId: string, connectorType: string, issueDetails: string) {
    ObservabilityService.logError(`Connector Health Issue [${connectorType}]`, new Error(issueDetails));
    // En el futuro, disparará una alerta a Command Center
  }
}
