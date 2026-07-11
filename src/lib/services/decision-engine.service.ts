import { DecisionState, DecisionRule, DecisionLog } from '@/types/decision';

export class DecisionEngineService {
  /**
   * Simulates evaluating a context against a set of declarative rules.
   * In a real implementation, this would fetch rules from the DB for the company_id,
   * parse condition_schemas, and evaluate them against the contextSnapshot.
   */
  public async evaluateDecision(
    companyId: string, 
    contextSnapshot: Record<string, any>, 
    rules: DecisionRule[]
  ): Promise<{ finalState: DecisionState, appliedRule?: DecisionRule, reason: string }> {
    
    console.log(`[Decision Engine] Evaluating decision for company ${companyId}`);
    
    // Default fallback state
    let finalState = DecisionState.READY;
    let appliedRule: DecisionRule | undefined;
    let reason = "All checks passed. Ready for execution.";

    // Simple declarative rule engine simulation
    // We sort rules by priority (lower number = higher priority)
    const sortedRules = [...rules].sort((a, b) => a.priority - b.priority);

    for (const rule of sortedRules) {
      if (!rule.is_active) continue;

      // Simulate a declarative condition evaluation
      // Example condition: { field: "confidence", operator: "<", value: 0.8 }
      const condition = rule.condition_schema;
      
      if (condition.field && condition.operator && condition.value !== undefined) {
        const contextValue = contextSnapshot[condition.field];
        let conditionMet = false;

        if (contextValue !== undefined) {
          switch (condition.operator) {
            case '<': conditionMet = contextValue < condition.value; break;
            case '>': conditionMet = contextValue > condition.value; break;
            case '===': conditionMet = contextValue === condition.value; break;
            case 'includes': conditionMet = Array.isArray(contextValue) && contextValue.includes(condition.value); break;
          }
        }

        if (conditionMet) {
          // Condition met, apply action
          appliedRule = rule;
          
          if (rule.action_schema.transition_to) {
            finalState = rule.action_schema.transition_to as DecisionState;
          }
          
          reason = `Rule triggered: ${rule.name}. Condition met (${condition.field} ${condition.operator} ${condition.value}).`;
          break; // Stop evaluating lower priority rules
        }
      }
    }

    return { finalState, appliedRule, reason };
  }

  /**
   * Simulates logging the decision to the database.
   */
  public async logDecision(log: Partial<DecisionLog>): Promise<DecisionLog> {
    console.log(`[Decision Engine] Logged decision: ${log.final_state} - ${log.decision_reason}`);
    
    // Mock return of a created log entry
    return {
      id: `log_${Math.random().toString(36).substr(2, 9)}`,
      company_id: log.company_id!,
      initial_state: log.initial_state!,
      final_state: log.final_state!,
      decision_reason: log.decision_reason,
      context_snapshot: log.context_snapshot || {},
      created_at: new Date().toISOString()
    };
  }
}

export const decisionEngineService = new DecisionEngineService();
