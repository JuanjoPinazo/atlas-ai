-- Migration 00002: Align Company Brain with ADR-0002 Conceptual Model

-- 1. Knowledge Domains (Hierarchical functional areas)
CREATE TABLE knowledge_domains (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    company_id UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    parent_id UUID REFERENCES knowledge_domains(id) ON DELETE SET NULL,
    config JSONB NOT NULL DEFAULT '{}'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Knowledge Sources (Origins of knowledge)
CREATE TABLE knowledge_sources (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    company_id UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
    domain_id UUID REFERENCES knowledge_domains(id) ON DELETE SET NULL,
    name VARCHAR(255) NOT NULL,
    source_type VARCHAR(50) NOT NULL, -- 'connector', 'manual', 'agent_proposal'
    trust_level INT DEFAULT 50, -- 0-100 scale
    metadata JSONB NOT NULL DEFAULT '{}'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. Knowledge Documents (Raw artifacts)
CREATE TABLE knowledge_documents (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    company_id UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
    source_id UUID NOT NULL REFERENCES knowledge_sources(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    storage_path VARCHAR(1024), -- path in Supabase Storage
    content_hash VARCHAR(255),
    metadata JSONB NOT NULL DEFAULT '{}'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. Knowledge Units (Atomic fragments, versioned)
CREATE TABLE knowledge_units (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    company_id UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
    domain_id UUID REFERENCES knowledge_domains(id) ON DELETE SET NULL,
    document_id UUID REFERENCES knowledge_documents(id) ON DELETE SET NULL,
    unit_type VARCHAR(50) NOT NULL DEFAULT 'text', -- 'text', 'summary', 'policy_rule'
    content TEXT NOT NULL,
    embedding vector(1536),
    valid_from TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    valid_to TIMESTAMP WITH TIME ZONE,
    superseded_by UUID REFERENCES knowledge_units(id) ON DELETE SET NULL,
    metadata JSONB NOT NULL DEFAULT '{}'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX ON knowledge_units USING hnsw (embedding vector_cosine_ops);

-- 5. Knowledge Entities (Graph nodes)
CREATE TABLE knowledge_entities (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    company_id UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    entity_type VARCHAR(50) NOT NULL, -- 'person', 'product', 'process', 'decision'
    description TEXT,
    metadata JSONB NOT NULL DEFAULT '{}'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 6. Knowledge Relations (Graph edges)
CREATE TABLE knowledge_relations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    company_id UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
    source_entity_id UUID REFERENCES knowledge_entities(id) ON DELETE CASCADE,
    target_entity_id UUID REFERENCES knowledge_entities(id) ON DELETE CASCADE,
    source_unit_id UUID REFERENCES knowledge_units(id) ON DELETE CASCADE,
    target_unit_id UUID REFERENCES knowledge_units(id) ON DELETE CASCADE,
    relation_type VARCHAR(100) NOT NULL, -- 'depends_on', 'part_of', 'approved_by'
    weight FLOAT DEFAULT 1.0,
    metadata JSONB NOT NULL DEFAULT '{}'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    CHECK (
      (source_entity_id IS NOT NULL AND target_entity_id IS NOT NULL) OR 
      (source_unit_id IS NOT NULL AND target_unit_id IS NOT NULL) OR
      (source_entity_id IS NOT NULL AND target_unit_id IS NOT NULL) OR
      (source_unit_id IS NOT NULL AND target_entity_id IS NOT NULL)
    )
);

-- 7. Knowledge Proposals (Pending promotion)
CREATE TABLE knowledge_proposals (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    company_id UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
    domain_id UUID REFERENCES knowledge_domains(id) ON DELETE SET NULL,
    proposed_by VARCHAR(255) NOT NULL, -- agent_id or user_id
    proposal_type VARCHAR(50) NOT NULL, -- 'new_unit', 'update_unit', 'new_relation'
    content TEXT NOT NULL,
    status VARCHAR(50) DEFAULT 'pending', -- 'pending', 'approved', 'rejected'
    metadata JSONB NOT NULL DEFAULT '{}'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 8. Context Packages (Assembled context)
CREATE TABLE context_packages (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    company_id UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
    run_id VARCHAR(255) NOT NULL,
    intent VARCHAR(255) NOT NULL,
    budget_used INT NOT NULL,
    snapshot_version VARCHAR(255) NOT NULL,
    units JSONB NOT NULL DEFAULT '[]'::jsonb, -- Array of cited unit references
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 9. Retrieval Events (Audit log for context queries)
CREATE TABLE retrieval_events (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    company_id UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
    context_package_id UUID NOT NULL REFERENCES context_packages(id) ON DELETE CASCADE,
    agent_id VARCHAR(255) NOT NULL,
    relevance_score FLOAT,
    access_policy_applied JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 10. Access Policies (Visibility rules)
CREATE TABLE access_policies (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    company_id UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
    domain_id UUID REFERENCES knowledge_domains(id) ON DELETE CASCADE,
    role_or_capability VARCHAR(255) NOT NULL,
    sensitivity_level INT DEFAULT 0,
    config JSONB NOT NULL DEFAULT '{}'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Apply Triggers
CREATE TRIGGER update_knowledge_domains_updated_at BEFORE UPDATE ON knowledge_domains FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_knowledge_sources_updated_at BEFORE UPDATE ON knowledge_sources FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_knowledge_documents_updated_at BEFORE UPDATE ON knowledge_documents FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_knowledge_units_updated_at BEFORE UPDATE ON knowledge_units FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_knowledge_entities_updated_at BEFORE UPDATE ON knowledge_entities FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_knowledge_proposals_updated_at BEFORE UPDATE ON knowledge_proposals FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_access_policies_updated_at BEFORE UPDATE ON access_policies FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER audit_knowledge_domains AFTER INSERT OR UPDATE OR DELETE ON knowledge_domains FOR EACH ROW EXECUTE FUNCTION audit_trigger_func();
CREATE TRIGGER audit_knowledge_sources AFTER INSERT OR UPDATE OR DELETE ON knowledge_sources FOR EACH ROW EXECUTE FUNCTION audit_trigger_func();
CREATE TRIGGER audit_knowledge_units AFTER INSERT OR UPDATE OR DELETE ON knowledge_units FOR EACH ROW EXECUTE FUNCTION audit_trigger_func();
CREATE TRIGGER audit_knowledge_relations AFTER INSERT OR UPDATE OR DELETE ON knowledge_relations FOR EACH ROW EXECUTE FUNCTION audit_trigger_func();
CREATE TRIGGER audit_access_policies AFTER INSERT OR UPDATE OR DELETE ON access_policies FOR EACH ROW EXECUTE FUNCTION audit_trigger_func();
