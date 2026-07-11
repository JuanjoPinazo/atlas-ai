-- Migration 00008: Decision Engine Schema

-- 1. Enum for Decision States
CREATE TYPE decision_state AS ENUM (
    'CONTEXT_REQUIRED',
    'READY',
    'HUMAN_APPROVAL',
    'POLICY_CONFLICT',
    'BLOCKED',
    'EXECUTING',
    'VALIDATING',
    'COMPLETED',
    'FAILED'
);

-- 2. Declarative Decision Rules (Configured in DB, not hardcoded)
CREATE TABLE decision_rules (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    company_id UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    priority INTEGER DEFAULT 100, -- Lower number means higher priority
    condition_schema JSONB NOT NULL DEFAULT '{}'::jsonb, -- Declarative condition logic (e.g., {"field": "amount", "operator": ">", "value": 1000})
    action_schema JSONB NOT NULL DEFAULT '{}'::jsonb, -- Action to take if condition is met (e.g., transition to state)
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. Decision Logs (Tracking decisions made by the engine)
CREATE TABLE decision_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    company_id UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
    context_id UUID, -- Reference to the specific context or request being decided upon (can be null for general decisions)
    rule_id UUID REFERENCES decision_rules(id) ON DELETE SET NULL, -- Rule that triggered the decision, if any
    initial_state decision_state NOT NULL,
    final_state decision_state NOT NULL,
    decision_reason TEXT, -- Explanation of why this decision was made
    context_snapshot JSONB NOT NULL DEFAULT '{}'::jsonb, -- Snapshot of variables at time of decision
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. Validation Logs (Tracking validation engine results)
CREATE TABLE validation_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    company_id UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
    decision_log_id UUID REFERENCES decision_logs(id) ON DELETE CASCADE,
    validation_type VARCHAR(100) NOT NULL, -- e.g., 'schema_check', 'policy_check', 'hallucination_check'
    is_valid BOOLEAN NOT NULL,
    validation_details JSONB NOT NULL DEFAULT '{}'::jsonb, -- Specific details of the validation (e.g., which policy failed)
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX idx_decision_rules_company ON decision_rules(company_id);
CREATE INDEX idx_decision_rules_priority ON decision_rules(priority);
CREATE INDEX idx_decision_logs_company ON decision_logs(company_id);
CREATE INDEX idx_decision_logs_state ON decision_logs(final_state);
CREATE INDEX idx_validation_logs_company ON validation_logs(company_id);
CREATE INDEX idx_validation_logs_decision ON validation_logs(decision_log_id);

-- RLS Policies
ALTER TABLE decision_rules ENABLE ROW LEVEL SECURITY;
ALTER TABLE decision_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE validation_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Enable read access for users" ON decision_rules
    FOR SELECT USING (true);

CREATE POLICY "Enable read access for users" ON decision_logs
    FOR SELECT USING (true);

CREATE POLICY "Enable read access for users" ON validation_logs
    FOR SELECT USING (true);
