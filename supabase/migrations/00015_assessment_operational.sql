-- ==============================================================================
-- Migration: 00015_assessment_operational
-- Description: Estructura de BD completa para ABA Operational Readiness
-- ==============================================================================

CREATE TABLE IF NOT EXISTS assessment_templates (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    code VARCHAR(50) UNIQUE NOT NULL, -- e.g., 'ABA-DENTAL'
    name VARCHAR(255) NOT NULL,
    description TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS assessment_template_versions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    template_id UUID NOT NULL REFERENCES assessment_templates(id) ON DELETE CASCADE,
    version VARCHAR(20) NOT NULL,
    status VARCHAR(20) NOT NULL DEFAULT 'DRAFT', -- DRAFT, PUBLISHED, ARCHIVED
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE(template_id, version)
);

CREATE TABLE IF NOT EXISTS assessment_categories (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    version_id UUID NOT NULL REFERENCES assessment_template_versions(id) ON DELETE CASCADE,
    code VARCHAR(50) NOT NULL,
    name VARCHAR(255) NOT NULL,
    order_index INT NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS assessment_questions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    category_id UUID NOT NULL REFERENCES assessment_categories(id) ON DELETE CASCADE,
    code VARCHAR(50) NOT NULL,
    text TEXT NOT NULL,
    format VARCHAR(50) NOT NULL DEFAULT 'SINGLE_CHOICE', -- SINGLE_CHOICE, MULTIPLE_CHOICE
    options JSONB NOT NULL DEFAULT '[]'::jsonb,
    help_context JSONB NOT NULL DEFAULT '{}'::jsonb, -- { reason, problem, economic_impact, validation_status }
    provisional_weight INT NOT NULL DEFAULT 1,
    mandatory BOOLEAN NOT NULL DEFAULT true,
    order_index INT NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS assessment_branch_rules (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    question_id UUID NOT NULL REFERENCES assessment_questions(id) ON DELETE CASCADE,
    condition_option_id VARCHAR(100) NOT NULL, -- If this option is selected
    action VARCHAR(50) NOT NULL, -- SHOW_QUESTION, HIDE_QUESTION, END_ASSESSMENT
    target_id VARCHAR(100), -- ID of the question to show/hide, if applicable
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS assessment_sessions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id UUID NOT NULL,
    version_id UUID NOT NULL REFERENCES assessment_template_versions(id) ON DELETE RESTRICT,
    status VARCHAR(50) NOT NULL DEFAULT 'DRAFT', -- DRAFT, IN_PROGRESS, COMPLETED, REVIEWED
    started_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    completed_at TIMESTAMPTZ,
    deleted_at TIMESTAMPTZ, -- soft delete
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS assessment_answers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    session_id UUID NOT NULL REFERENCES assessment_sessions(id) ON DELETE CASCADE,
    question_id UUID NOT NULL REFERENCES assessment_questions(id) ON DELETE RESTRICT,
    selected_option_ids JSONB NOT NULL, -- Array of strings
    confidence_score FLOAT, -- Computed confidence based on answer
    skipped BOOLEAN NOT NULL DEFAULT false,
    skipped_reason TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE(session_id, question_id)
);

CREATE TABLE IF NOT EXISTS assessment_scores (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    session_id UUID NOT NULL REFERENCES assessment_sessions(id) ON DELETE CASCADE,
    index_name VARCHAR(50) NOT NULL, -- Maturity, Opportunity, Health, Digital Readiness, Business DNA, Employee Readiness
    score FLOAT NOT NULL,
    formula_explanation TEXT,
    confidence FLOAT,
    data_points_used JSONB,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE(session_id, index_name)
);

CREATE TABLE IF NOT EXISTS assessment_recommendations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    session_id UUID NOT NULL REFERENCES assessment_sessions(id) ON DELETE CASCADE,
    type VARCHAR(50) NOT NULL, -- ABVL, Employee Designer, Integration Hub, Knowledge Pack
    target_code VARCHAR(100) NOT NULL, -- Code of the entity being recommended
    title VARCHAR(255) NOT NULL,
    description TEXT,
    viability VARCHAR(50), -- E.g., 'AVAILABLE', 'DEMO_ONLY', 'INCOMPATIBLE'
    justification TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS assessment_opportunities (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    session_id UUID NOT NULL REFERENCES assessment_sessions(id) ON DELETE CASCADE,
    category VARCHAR(50) NOT NULL,
    description TEXT,
    roi_range_low INT,
    roi_range_high INT,
    confidence FLOAT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS assessment_reports (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    session_id UUID NOT NULL REFERENCES assessment_sessions(id) ON DELETE CASCADE UNIQUE,
    executive_summary TEXT,
    labeled_data JSONB NOT NULL DEFAULT '{}'::jsonb, -- Store tagged data: hypothesis, declared, projection, benchmark
    is_reviewed BOOLEAN NOT NULL DEFAULT false,
    reviewed_at TIMESTAMPTZ,
    reviewed_by UUID,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- RLS Config
ALTER TABLE assessment_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE assessment_template_versions ENABLE ROW LEVEL SECURITY;
ALTER TABLE assessment_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE assessment_questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE assessment_branch_rules ENABLE ROW LEVEL SECURITY;
ALTER TABLE assessment_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE assessment_answers ENABLE ROW LEVEL SECURITY;
ALTER TABLE assessment_scores ENABLE ROW LEVEL SECURITY;
ALTER TABLE assessment_recommendations ENABLE ROW LEVEL SECURITY;
ALTER TABLE assessment_opportunities ENABLE ROW LEVEL SECURITY;
ALTER TABLE assessment_reports ENABLE ROW LEVEL SECURITY;

-- Templates are global read-only for all tenants
CREATE POLICY "Templates are viewable by all" ON assessment_templates FOR SELECT USING (true);
CREATE POLICY "Template versions are viewable by all" ON assessment_template_versions FOR SELECT USING (true);
CREATE POLICY "Categories are viewable by all" ON assessment_categories FOR SELECT USING (true);
CREATE POLICY "Questions are viewable by all" ON assessment_questions FOR SELECT USING (true);
CREATE POLICY "Branch rules are viewable by all" ON assessment_branch_rules FOR SELECT USING (true);

-- Sessions and dependent data are isolated per tenant
CREATE POLICY "Tenant isolation for sessions" ON assessment_sessions
FOR ALL USING (organization_id = get_current_organization_id() AND deleted_at IS NULL)
WITH CHECK (organization_id = get_current_organization_id());

CREATE POLICY "Tenant isolation for answers" ON assessment_answers
FOR ALL USING (EXISTS (SELECT 1 FROM assessment_sessions s WHERE s.id = assessment_answers.session_id AND s.organization_id = get_current_organization_id()));

CREATE POLICY "Tenant isolation for scores" ON assessment_scores
FOR ALL USING (EXISTS (SELECT 1 FROM assessment_sessions s WHERE s.id = assessment_scores.session_id AND s.organization_id = get_current_organization_id()));

CREATE POLICY "Tenant isolation for recommendations" ON assessment_recommendations
FOR ALL USING (EXISTS (SELECT 1 FROM assessment_sessions s WHERE s.id = assessment_recommendations.session_id AND s.organization_id = get_current_organization_id()));

CREATE POLICY "Tenant isolation for opportunities" ON assessment_opportunities
FOR ALL USING (EXISTS (SELECT 1 FROM assessment_sessions s WHERE s.id = assessment_opportunities.session_id AND s.organization_id = get_current_organization_id()));

CREATE POLICY "Tenant isolation for reports" ON assessment_reports
FOR ALL USING (EXISTS (SELECT 1 FROM assessment_sessions s WHERE s.id = assessment_reports.session_id AND s.organization_id = get_current_organization_id()));
