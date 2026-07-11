-- Migration: 00009_dental_knowledge_manager
-- Description: Schema for Dental Knowledge Manager

-- ENUMS
CREATE TYPE dental_item_priority AS ENUM ('MVP', 'Fase 2', 'Avanzado');
CREATE TYPE dental_item_status AS ENUM ('borrador', 'pendiente de revisión', 'aprobado', 'obsoleto', 'rechazado');
CREATE TYPE evidence_level AS ENUM ('alta', 'media', 'baja');

-- 1. Domains
CREATE TABLE dental_knowledge_domains (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id VARCHAR(255) NOT NULL,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    icon VARCHAR(100),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Categories
CREATE TABLE dental_knowledge_categories (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id VARCHAR(255) NOT NULL,
    domain_id UUID NOT NULL REFERENCES dental_knowledge_domains(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. Items
CREATE TABLE dental_knowledge_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id VARCHAR(255) NOT NULL,
    category_id UUID NOT NULL REFERENCES dental_knowledge_categories(id) ON DELETE CASCADE,
    
    title VARCHAR(255) NOT NULL,
    description TEXT,
    problem_solved TEXT,
    current_process TEXT,
    atlas_proposal TEXT,
    
    limits TEXT,
    risks TEXT,
    benefits TEXT,
    kpis TEXT,
    example TEXT,
    
    commercial_argument TEXT,
    contextual_help TEXT,
    
    applicable_clinics JSONB DEFAULT '[]'::JSONB, -- ['privada', 'franquicia', 'grupo', 'especializada', 'premium']
    applicable_specialties JSONB DEFAULT '[]'::JSONB,
    
    priority dental_item_priority DEFAULT 'MVP',
    status dental_item_status DEFAULT 'borrador',
    confidence_level INTEGER CHECK (confidence_level >= 0 AND confidence_level <= 100) DEFAULT 0,
    
    responsible VARCHAR(255),
    version INTEGER DEFAULT 1,
    last_review_date TIMESTAMP WITH TIME ZONE,
    
    is_deleted BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. Sources
CREATE TABLE dental_knowledge_sources (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id VARCHAR(255) NOT NULL,
    item_id UUID NOT NULL REFERENCES dental_knowledge_items(id) ON DELETE CASCADE,
    source_name VARCHAR(255) NOT NULL,
    url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 5. Versions (Append-only)
CREATE TABLE dental_knowledge_versions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id VARCHAR(255) NOT NULL,
    item_id UUID NOT NULL REFERENCES dental_knowledge_items(id) ON DELETE CASCADE,
    version_number INTEGER NOT NULL,
    content_snapshot JSONB NOT NULL,
    created_by VARCHAR(255),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 6. Reviews
CREATE TABLE dental_knowledge_reviews (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id VARCHAR(255) NOT NULL,
    item_id UUID NOT NULL REFERENCES dental_knowledge_items(id) ON DELETE CASCADE,
    reviewer_name VARCHAR(255) NOT NULL,
    comments TEXT,
    outcome dental_item_status NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 7. Implementation Questions
CREATE TABLE dental_implementation_questions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id VARCHAR(255) NOT NULL,
    item_id UUID NOT NULL REFERENCES dental_knowledge_items(id) ON DELETE CASCADE,
    category VARCHAR(100), -- 'recepción', 'agenda', 'presupuestos'...
    question_text TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 8. Commercial Benefits
CREATE TABLE dental_commercial_benefits (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id VARCHAR(255) NOT NULL,
    item_id UUID NOT NULL REFERENCES dental_knowledge_items(id) ON DELETE CASCADE,
    target_role VARCHAR(100), -- 'gerente', 'recepción', 'odontólogo'...
    problem TEXT,
    solution TEXT,
    benefit TEXT,
    kpi TEXT,
    example TEXT,
    economic_impact_expected VARCHAR(255),
    evidence_level evidence_level DEFAULT 'media',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 9. Automation Blueprints
CREATE TABLE dental_automation_blueprints (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id VARCHAR(255) NOT NULL,
    item_id UUID NOT NULL REFERENCES dental_knowledge_items(id) ON DELETE CASCADE,
    trigger_event VARCHAR(255) NOT NULL,
    conditions TEXT,
    action TEXT NOT NULL,
    requires_approval BOOLEAN DEFAULT FALSE,
    channel VARCHAR(100),
    risk_level VARCHAR(50),
    kpi_impact VARCHAR(255),
    responsible_agent VARCHAR(255),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 10. Pack Items
CREATE TABLE dental_pack_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id VARCHAR(255) NOT NULL,
    pack_name VARCHAR(255) NOT NULL, -- e.g. 'Dental Premium', 'Atlas Dental Intelligence Base'
    item_id UUID NOT NULL REFERENCES dental_knowledge_items(id) ON DELETE CASCADE,
    added_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_dental_domains_tenant ON dental_knowledge_domains(tenant_id);
CREATE INDEX idx_dental_categories_domain ON dental_knowledge_categories(domain_id);
CREATE INDEX idx_dental_items_category ON dental_knowledge_items(category_id);
CREATE INDEX idx_dental_items_status ON dental_knowledge_items(status);

-- RLS
ALTER TABLE dental_knowledge_domains ENABLE ROW LEVEL SECURITY;
ALTER TABLE dental_knowledge_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE dental_knowledge_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE dental_implementation_questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE dental_commercial_benefits ENABLE ROW LEVEL SECURITY;
ALTER TABLE dental_automation_blueprints ENABLE ROW LEVEL SECURITY;
ALTER TABLE dental_pack_items ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Enable read access for domains" ON dental_knowledge_domains FOR SELECT USING (true);
CREATE POLICY "Enable read access for categories" ON dental_knowledge_categories FOR SELECT USING (true);
CREATE POLICY "Enable read access for items" ON dental_knowledge_items FOR SELECT USING (true);
CREATE POLICY "Enable read access for questions" ON dental_implementation_questions FOR SELECT USING (true);
CREATE POLICY "Enable read access for benefits" ON dental_commercial_benefits FOR SELECT USING (true);
CREATE POLICY "Enable read access for automations" ON dental_automation_blueprints FOR SELECT USING (true);
CREATE POLICY "Enable read access for packs" ON dental_pack_items FOR SELECT USING (true);

-- ==========================================
-- SEED MOCK DATA
-- ==========================================
DO $$
DECLARE
    v_domain_id UUID;
    v_cat_reception UUID;
    v_cat_agenda UUID;
    v_item_cancellations UUID;
    v_item_budgets UUID;
BEGIN
    -- 1. Create Domain
    INSERT INTO dental_knowledge_domains (tenant_id, name, description, icon) 
    VALUES ('demo_tenant', 'Modelos de clínica', 'Organización y roles operativos para clínicas', 'Building')
    RETURNING id INTO v_domain_id;

    -- 2. Create Categories
    INSERT INTO dental_knowledge_categories (tenant_id, domain_id, name, description) 
    VALUES ('demo_tenant', v_domain_id, 'Recepción', 'Operaciones y atención en mostrador')
    RETURNING id INTO v_cat_reception;

    INSERT INTO dental_knowledge_categories (tenant_id, domain_id, name, description) 
    VALUES ('demo_tenant', v_domain_id, 'Agenda', 'Gestión de citas y huecos')
    RETURNING id INTO v_cat_agenda;

    -- 3. Create Items
    INSERT INTO dental_knowledge_items (
        tenant_id, category_id, title, description, problem_solved, current_process, 
        atlas_proposal, limits, risks, benefits, kpis, example, 
        commercial_argument, contextual_help, priority, status, confidence_level, responsible, last_review_date
    ) VALUES (
        'demo_tenant', v_cat_agenda, 'Gestión de Cancelaciones Última Hora',
        'Protocolo de recuperación de huecos cuando un paciente cancela con menos de 24h.',
        'Pérdida de ingresos por huecos vacíos en la agenda del doctor.',
        'La recepcionista llama a pacientes de la lista de espera manualmente.',
        'Atlas detecta la cancelación, filtra la lista de espera por urgencia y disponibilidad, y envía WhatsApps automáticos para cubrir el hueco en 5 minutos.',
        'No agendar pacientes que requieren autorización de mutua si el hueco es inmediato.',
        'Riesgo bajo. El paciente original ya canceló.',
        'Recuperación del 60% de huecos cancelados. Aumento de facturación diaria.',
        'Tasa de recuperación de cancelaciones (%)',
        'Paciente A cancela 12h antes. Atlas contacta a Paciente B (urgencia leve) y le da el hueco.',
        'Si tienes 5 cancelaciones semanales, recuperar 3 supone ~1.500€/semana extra.',
        'Este módulo requiere tener conectada la agenda con integración de WhatsApp de doble vía.',
        'MVP', 'aprobado', 95, 'Dra. Elena', NOW()
    ) RETURNING id INTO v_item_cancellations;

    INSERT INTO dental_knowledge_items (
        tenant_id, category_id, title, description, problem_solved, current_process, 
        atlas_proposal, limits, risks, benefits, kpis, example, 
        commercial_argument, contextual_help, priority, status, confidence_level, responsible, last_review_date
    ) VALUES (
        'demo_tenant', v_cat_reception, 'Seguimiento de Presupuestos Activo',
        'Pipeline para contactar pacientes que se llevaron un plan de tratamiento pero no aceptaron.',
        'Baja tasa de conversión de primeras visitas debido a falta de seguimiento comercial.',
        'La coordinadora llama a los 7 días si tiene tiempo, a menudo el paciente está frío.',
        'Atlas envía contenido de valor sobre el tratamiento a las 48h y hace un check-in por WhatsApp a los 5 días para agendar o resolver dudas.',
        'Limitar seguimientos a máximo 3 toques para evitar spam.',
        'Generar fricción si el tono no es empático.',
        '+20% en tasa de aceptación de planes de tratamiento de alto valor (implantes/ortodoncia).',
        'Tasa de aceptación de presupuestos (%)',
        'Envío de vídeo explicativo del Dr. sobre implantes 2 días después de la visita.',
        'Convertir 2 pacientes de implantes más al mes paga la herramienta todo el año.',
        'Asegúrate de configurar los links a los vídeos en el Business DNA.',
        'MVP', 'borrador', 60, 'Consultor Comercial', NOW()
    ) RETURNING id INTO v_item_budgets;

    -- 4. Implementation Questions
    INSERT INTO dental_implementation_questions (tenant_id, item_id, category, question_text)
    VALUES 
    ('demo_tenant', v_item_cancellations, 'agenda', '¿Utilizáis actualmente alguna lista de espera digital o en papel?'),
    ('demo_tenant', v_item_cancellations, 'agenda', '¿Cuánta antelación pedís para cancelaciones sin penalización?'),
    ('demo_tenant', v_item_budgets, 'presupuestos', '¿Quién es la persona responsable de entregar los presupuestos grandes?');

    -- 5. Commercial Benefits
    INSERT INTO dental_commercial_benefits (tenant_id, item_id, target_role, problem, solution, benefit, kpi, economic_impact_expected, evidence_level)
    VALUES 
    ('demo_tenant', v_item_cancellations, 'gerente', 'Pérdida de margen bruto', 'Recuperación automática de huecos', 'Sillones siempre ocupados', 'Ocupación', '+€6,000/mes', 'alta'),
    ('demo_tenant', v_item_cancellations, 'recepción', 'Estrés y llamadas frías', 'Atlas hace el filtro y el envío', 'Trabajo tranquilo y proactivo', 'Tiempo ahorrado', '5h semanales', 'alta');

    -- 6. Automations
    INSERT INTO dental_automation_blueprints (tenant_id, item_id, trigger_event, conditions, action, requires_approval, channel, responsible_agent)
    VALUES 
    ('demo_tenant', v_item_cancellations, 'Estado de Cita = Cancelada', 'Tiempo para cita < 24h', 'Buscar en lista espera y enviar oferta de hueco', false, 'WhatsApp', 'Atlas Clínico'),
    ('demo_tenant', v_item_budgets, 'Estado de Presupuesto = Entregado', 'Días desde entrega = 5', 'Enviar mensaje de seguimiento amigable', true, 'WhatsApp', 'Atlas Follow-up');

END $$;
