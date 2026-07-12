-- 00019_unify_tenants.sql

-- 1. Create rate_limits table
CREATE TABLE rate_limits (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    action_type TEXT NOT NULL,
    identifier TEXT NOT NULL, -- e.g., IP or Email
    attempts INT DEFAULT 1,
    blocked_until TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(action_type, identifier)
);

CREATE INDEX idx_rate_limits_lookup ON rate_limits(action_type, identifier);

-- 2. Backfill companies to organizations
-- Since both use UUIDs and similar schemas, we can migrate the companies to organizations, keeping the same ID.
INSERT INTO organizations (id, name, slug, status, created_at, updated_at)
SELECT id, name, slug, status, created_at, updated_at 
FROM companies 
ON CONFLICT (slug) DO NOTHING;

-- 3. Point business tables to organizations(id) 
-- As a progressive deprecation, we will add an explicit organization_id column to the most critical business tables 
-- and copy the data. For full deprecation, all tables would be altered.

ALTER TABLE company_brain ADD COLUMN IF NOT EXISTS organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE;
UPDATE company_brain SET organization_id = company_id WHERE organization_id IS NULL;

ALTER TABLE knowledge_documents ADD COLUMN IF NOT EXISTS organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE;
UPDATE knowledge_documents SET organization_id = company_id WHERE organization_id IS NULL;

ALTER TABLE tenant_assessments ADD COLUMN IF NOT EXISTS organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE;
-- tenant_assessments already had tenant_id, we will map it if it exists.
-- UPDATE tenant_assessments SET organization_id = tenant_id WHERE organization_id IS NULL;

-- 4. Set up RLS using organizations(id) for these hardened tables
ALTER TABLE company_brain ENABLE ROW LEVEL SECURITY;
ALTER TABLE knowledge_documents ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can access their org company_brain" ON company_brain
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM organization_memberships
            WHERE organization_memberships.organization_id = company_brain.organization_id
            AND organization_memberships.user_id = auth.uid()
            AND organization_memberships.status = 'ACTIVE'
        )
    );

CREATE POLICY "Users can access their org knowledge_documents" ON knowledge_documents
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM organization_memberships
            WHERE organization_memberships.organization_id = knowledge_documents.organization_id
            AND organization_memberships.user_id = auth.uid()
            AND organization_memberships.status = 'ACTIVE'
        )
    );

-- Rate limits should only be accessed by service_role, no policy needed for standard users.
ALTER TABLE rate_limits ENABLE ROW LEVEL SECURITY;
