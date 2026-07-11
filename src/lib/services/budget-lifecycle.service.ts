import { ObservabilityService } from './observability.service';

export type BudgetState = 
  | 'DRAFT'
  | 'PENDING_APPROVAL'
  | 'SENT'
  | 'PENDING_DECISION'
  | 'FOLLOW_UP_DUE'
  | 'FOLLOW_UP_ACTIVE'
  | 'ACCEPTED'
  | 'REJECTED'
  | 'EXPIRED'
  | 'ARCHIVED';

export class BudgetLifecycleService {
  static validateTransition(currentState: BudgetState, nextState: BudgetState, hasHumanApproval: boolean = false): boolean {
    const validTransitions: Record<BudgetState, BudgetState[]> = {
      'DRAFT': ['PENDING_APPROVAL', 'SENT'],
      'PENDING_APPROVAL': ['SENT', 'REJECTED'],
      'SENT': ['PENDING_DECISION'],
      'PENDING_DECISION': ['FOLLOW_UP_DUE', 'ACCEPTED', 'REJECTED', 'EXPIRED'],
      'FOLLOW_UP_DUE': ['FOLLOW_UP_ACTIVE', 'ACCEPTED', 'REJECTED', 'EXPIRED'],
      'FOLLOW_UP_ACTIVE': ['ACCEPTED', 'REJECTED', 'EXPIRED', 'PENDING_DECISION'],
      'ACCEPTED': ['ARCHIVED'],
      'REJECTED': ['ARCHIVED'],
      'EXPIRED': ['ARCHIVED'],
      'ARCHIVED': []
    };

    const allowed = validTransitions[currentState]?.includes(nextState);

    if (!allowed) {
      ObservabilityService.logError(`Invalid state transition from ${currentState} to ${nextState}`, new Error('StateTransitionError'));
      return false;
    }

    if (nextState === 'SENT' && currentState === 'PENDING_APPROVAL' && !hasHumanApproval) {
      ObservabilityService.logError(`Transition to SENT requires human approval`, new Error('ApprovalRequiredError'));
      return false;
    }

    return true;
  }
}
