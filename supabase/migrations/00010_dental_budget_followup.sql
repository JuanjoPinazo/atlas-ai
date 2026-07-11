-- Migration 00010: Dental Budget Follow-up & Event Bus (ADR-0012)
-- 
-- Description: First real vertical slice for ABVL-01. Implements Event Store and 
-- Dental Budgets tracking with RLS and Audit trails.

-- 1. Base Event Bus Tables (ADR-0012)
CREATE TABLE IF NOT EXISTS platform_events (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id UUID NOT NULL,
    event_type VARCHAR(255) NOT NULL,
    event_version VARCHAR(50) NOT NULL DEFAULT 'v1',
    correlation_id UUID NOT NULL,
    causation_id UUID,
    payload JSONB NOT NULL DEFAULT '{}'::jsonb,
    occurred_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    processed_at TIMESTAMPTZ,
    status VARCHAR(50) NOT NULL DEFAULT 'PENDING' CHECK (status IN ('PENDING', 'PROCESSING', 'COMPLETED', 'FAILED')),
    sensitivity VARCHAR(50) NOT NULL DEFAULT 'NORMAL' CHECK (sensitivity IN ('LOW', 'NORMAL', 'HIGH', 'CRITICAL')),
    error_log TEXT,
    idempotency_key VARCHAR(255) UNIQUE
);

CREATE INDEX idx_platform_events_org ON platform_events(organization_id);
CREATE INDEX idx_platform_events_correlation ON platform_events(correlation_id);
CREATE INDEX idx_platform_events_status ON platform_events(status);

-- 2. ROI Events
CREATE TABLE IF NOT EXISTS roi_events (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id UUID NOT NULL,
    event_id UUID NOT NULL REFERENCES platform_events(id),
    opportunity_type VARCHAR(255) NOT NULL,
    value_generated NUMERIC(10, 2) NOT NULL,
    currency VARCHAR(3) NOT NULL DEFAULT 'EUR',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX idx_roi_events_org ON roi_events(organization_id);

-- 3. Dental Budgets Tables
CREATE TABLE IF NOT EXISTS dental_patients_reference (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id UUID NOT NULL,
    pms_patient_id VARCHAR(255) NOT NULL, -- External ID
    display_name VARCHAR(255) NOT NULL,
    preferred_channel VARCHAR(50) NOT NULL DEFAULT 'WHATSAPP' CHECK (preferred_channel IN ('WHATSAPP', 'EMAIL', 'PHONE')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE(organization_id, pms_patient_id)
);

CREATE TABLE IF NOT EXISTS dental_budgets (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id UUID NOT NULL,
    patient_id UUID NOT NULL REFERENCES dental_patients_reference(id),
    pms_budget_id VARCHAR(255), -- External ID if exists
    total_amount NUMERIC(10, 2) NOT NULL,
    status VARCHAR(50) NOT NULL DEFAULT 'PENDING_DECISION' CHECK (status IN ('DRAFT', 'PENDING_DECISION', 'FOLLOW_UP_SCHEDULED', 'ACCEPTED', 'REJECTED', 'EXPIRED')),
    general_treatment VARCHAR(255) NOT NULL,
    issued_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    expires_at TIMESTAMPTZ,
    last_followed_up_at TIMESTAMPTZ,
    follow_up_count INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    deleted_at TIMESTAMPTZ
);

CREATE TABLE IF NOT EXISTS dental_budget_status_history (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    budget_id UUID NOT NULL REFERENCES dental_budgets(id) ON DELETE CASCADE,
    previous_status VARCHAR(50),
    new_status VARCHAR(50) NOT NULL,
    changed_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    changed_by_event_id UUID REFERENCES platform_events(id),
    reason TEXT
);

CREATE TABLE IF NOT EXISTS opportunity_candidates (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id UUID NOT NULL,
    opportunity_type VARCHAR(255) NOT NULL, -- e.g., 'ABVL-01'
    reference_id UUID NOT NULL, -- e.g., budget_id
    status VARCHAR(50) NOT NULL DEFAULT 'DETECTED' CHECK (status IN ('DETECTED', 'PRIORITIZED', 'ACTIONED', 'CONVERTED', 'DISCARDED')),
    estimated_impact NUMERIC(10, 2) NOT NULL,
    confidence_score NUMERIC(5, 2) NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Basic RLS
ALTER TABLE platform_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE roi_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE dental_patients_reference ENABLE ROW LEVEL SECURITY;
ALTER TABLE dental_budgets ENABLE ROW LEVEL SECURITY;
ALTER TABLE dental_budget_status_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE opportunity_candidates ENABLE ROW LEVEL SECURITY;

-- Disable RLS for now (Since we don't have auth implemented in the demo)
-- BUT we structure it so it can be enabled.
CREATE POLICY "Allow all operations for now" ON platform_events FOR ALL USING (true);
CREATE POLICY "Allow all operations for now" ON roi_events FOR ALL USING (true);
CREATE POLICY "Allow all operations for now" ON dental_patients_reference FOR ALL USING (true);
CREATE POLICY "Allow all operations for now" ON dental_budgets FOR ALL USING (true);
CREATE POLICY "Allow all operations for now" ON dental_budget_status_history FOR ALL USING (true);
CREATE POLICY "Allow all operations for now" ON opportunity_candidates FOR ALL USING (true);

