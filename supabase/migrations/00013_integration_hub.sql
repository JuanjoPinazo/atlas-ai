-- ==============================================================================
-- Migration: 00013_integration_hub
-- Description: Estructura de base de datos para el Atlas Integration Hub
-- ==============================================================================

CREATE TABLE IF NOT EXISTS tenant_connectors (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id UUID NOT NULL,
    connector_type VARCHAR(50) NOT NULL,
    status VARCHAR(50) NOT NULL DEFAULT 'DISCONNECTED',
    health_score INT NOT NULL DEFAULT 100,
    latency_ms INT NOT NULL DEFAULT 0,
    last_sync_at TIMESTAMPTZ,
    error_message TEXT,
    config JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE(organization_id, connector_type)
);

CREATE TABLE IF NOT EXISTS connector_credentials (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_connector_id UUID NOT NULL REFERENCES tenant_connectors(id) ON DELETE CASCADE,
    credential_type VARCHAR(50) NOT NULL,
    encrypted_token TEXT NOT NULL,
    expires_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS connector_sync_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_connector_id UUID NOT NULL REFERENCES tenant_connectors(id) ON DELETE CASCADE,
    sync_type VARCHAR(50) NOT NULL, -- FULL, DELTA, EVENT
    status VARCHAR(50) NOT NULL, -- SUCCESS, FAILED, PARTIAL
    records_processed INT NOT NULL DEFAULT 0,
    error_message TEXT,
    started_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    completed_at TIMESTAMPTZ
);

-- RLS
ALTER TABLE tenant_connectors ENABLE ROW LEVEL SECURITY;
ALTER TABLE connector_credentials ENABLE ROW LEVEL SECURITY;
ALTER TABLE connector_sync_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Tenant isolation for connectors" ON tenant_connectors
FOR ALL USING (organization_id = get_current_organization_id())
WITH CHECK (organization_id = get_current_organization_id());

-- connector_credentials requiere join con tenant_connectors para la policy de org_id
CREATE POLICY "Tenant isolation for connector_credentials" ON connector_credentials
FOR ALL USING (
  EXISTS (
    SELECT 1 FROM tenant_connectors tc 
    WHERE tc.id = connector_credentials.tenant_connector_id 
    AND tc.organization_id = get_current_organization_id()
  )
);

CREATE POLICY "Tenant isolation for connector_sync_logs" ON connector_sync_logs
FOR ALL USING (
  EXISTS (
    SELECT 1 FROM tenant_connectors tc 
    WHERE tc.id = connector_sync_logs.tenant_connector_id 
    AND tc.organization_id = get_current_organization_id()
  )
);

-- Índices
CREATE INDEX idx_tenant_connectors_org ON tenant_connectors(organization_id);
CREATE INDEX idx_connector_sync_logs_connector ON connector_sync_logs(tenant_connector_id);
