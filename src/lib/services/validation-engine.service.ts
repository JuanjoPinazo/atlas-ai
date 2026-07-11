import { ValidationLog } from '@/types/decision';

export class ValidationEngineService {
  /**
   * Simulates validating an action or output before committing it.
   */
  public async validate(
    companyId: string,
    validationType: string,
    payload: any
  ): Promise<{ isValid: boolean; details: Record<string, any> }> {
    
    console.log(`[Validation Engine] Validating ${validationType} for company ${companyId}`);
    
    // Simulate validation logic based on type
    let isValid = true;
    let details: Record<string, any> = {};

    switch (validationType) {
      case 'schema_check':
        if (!payload || Object.keys(payload).length === 0) {
          isValid = false;
          details = { error: 'Payload is empty or undefined' };
        } else {
          details = { message: 'Payload matches expected schema' };
        }
        break;
        
      case 'policy_check':
        // Simulated policy check: if payload has a 'restricted' flag set to true, it fails
        if (payload?.restricted === true) {
          isValid = false;
          details = { error: 'Payload violates restriction policy' };
        } else {
          details = { message: 'Policy check passed' };
        }
        break;

      default:
        details = { message: 'Unknown validation type, passing by default' };
    }

    return { isValid, details };
  }

  /**
   * Simulates logging the validation result to the database.
   */
  public async logValidation(log: Partial<ValidationLog>): Promise<ValidationLog> {
    console.log(`[Validation Engine] Logged validation: ${log.validation_type} - Valid: ${log.is_valid}`);
    
    return {
      id: `val_${Math.random().toString(36).substr(2, 9)}`,
      company_id: log.company_id!,
      decision_log_id: log.decision_log_id,
      validation_type: log.validation_type!,
      is_valid: log.is_valid!,
      validation_details: log.validation_details || {},
      created_at: new Date().toISOString()
    };
  }
}

export const validationEngineService = new ValidationEngineService();
