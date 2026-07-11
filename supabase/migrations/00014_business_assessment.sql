-- ==============================================================================
-- Migration: 00014_business_assessment
-- Description: Estructura de base de datos para el Motor de Evaluación Empresarial
-- ==============================================================================

CREATE TABLE IF NOT EXISTS tenant_assessments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id UUID NOT NULL,
    status VARCHAR(50) NOT NULL DEFAULT 'IN_PROGRESS',
    answers JSONB DEFAULT '{}'::jsonb,
    scores JSONB DEFAULT '{}'::jsonb,
    overall_score INT NOT NULL DEFAULT 0,
    recommendation_ids JSONB DEFAULT '[]'::jsonb,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- RLS
ALTER TABLE tenant_assessments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Tenant isolation for assessments" ON tenant_assessments
FOR ALL USING (organization_id = get_current_organization_id())
WITH CHECK (organization_id = get_current_organization_id());

-- Índices
CREATE INDEX idx_tenant_assessments_org ON tenant_assessments(organization_id);
