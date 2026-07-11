-- ==============================================================================
-- Migration: 00017_discovery_interview
-- Description: Estructura de BD completa para Discovery Interview (Sprint 20.3)
-- ==============================================================================

CREATE TABLE IF NOT EXISTS discovery_interviews (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id UUID NOT NULL,
    prospect_id UUID,
    created_by UUID,
    status VARCHAR(50) NOT NULL DEFAULT 'PENDING', -- PENDING, IN_PROGRESS, COMPLETED, REVIEWED
    clinic_name VARCHAR(255),
    interviewee_name VARCHAR(255),
    interviewee_role VARCHAR(255),
    consultant_name VARCHAR(255),
    interview_date TIMESTAMPTZ,
    duration_minutes INT,
    general_notes TEXT,
    summary_generated JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    deleted_at TIMESTAMPTZ
);

CREATE TABLE IF NOT EXISTS discovery_interview_answers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    interview_id UUID NOT NULL REFERENCES discovery_interviews(id) ON DELETE CASCADE,
    block_id VARCHAR(50) NOT NULL,
    question_key VARCHAR(100) NOT NULL,
    answer_text TEXT,
    intelligence JSONB DEFAULT '{}'::jsonb, -- { pain_level, economic_impact, affected_area, observations, ideas, priority }
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE(interview_id, block_id, question_key)
);

-- RLS Config
ALTER TABLE discovery_interviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE discovery_interview_answers ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Tenant isolation for interviews" ON discovery_interviews;
CREATE POLICY "Tenant isolation for interviews" ON discovery_interviews
FOR ALL USING (organization_id = get_current_organization_id() AND deleted_at IS NULL)
WITH CHECK (organization_id = get_current_organization_id());

DROP POLICY IF EXISTS "Tenant isolation for interview answers" ON discovery_interview_answers;
CREATE POLICY "Tenant isolation for interview answers" ON discovery_interview_answers
    FOR ALL
    USING (
        EXISTS (
            SELECT 1 FROM discovery_interviews di
            WHERE di.id = discovery_interview_answers.interview_id
            AND di.organization_id = get_current_organization_id()
        )
    );

-- GRANTS
GRANT SELECT, INSERT, UPDATE, DELETE ON discovery_interviews TO authenticated, anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON discovery_interviews TO service_role;
GRANT SELECT, INSERT, UPDATE, DELETE ON discovery_interview_answers TO authenticated, anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON discovery_interview_answers TO service_role;

-- Trigger para updated_at en discovery_interviews
CREATE OR REPLACE FUNCTION set_updated_at_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_discovery_interviews_updated_at ON discovery_interviews;
CREATE TRIGGER trg_discovery_interviews_updated_at
BEFORE UPDATE ON discovery_interviews
FOR EACH ROW
EXECUTE FUNCTION set_updated_at_timestamp();

DROP TRIGGER IF EXISTS trg_discovery_interview_answers_updated_at ON discovery_interview_answers;
CREATE TRIGGER trg_discovery_interview_answers_updated_at
BEFORE UPDATE ON discovery_interview_answers
FOR EACH ROW
EXECUTE FUNCTION set_updated_at_timestamp();
