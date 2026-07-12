-- 00020_velsora_iam_grants.sql

-- 1. Create SECURITY DEFINER functions to prevent RLS recursion
-- These functions bypass RLS to read memberships securely.
CREATE OR REPLACE FUNCTION get_user_memberships()
RETURNS TABLE (organization_id UUID)
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  RETURN QUERY 
  SELECT m.organization_id 
  FROM organization_memberships m
  WHERE m.user_id = auth.uid() 
  AND m.status = 'ACTIVE';
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION is_active_member(org_id UUID)
RETURNS BOOLEAN
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  is_member BOOLEAN;
BEGIN
  SELECT EXISTS (
    SELECT 1 
    FROM organization_memberships m
    WHERE m.organization_id = org_id
    AND m.user_id = auth.uid()
    AND m.status = 'ACTIVE'
  ) INTO is_member;
  RETURN is_member;
END;
$$ LANGUAGE plpgsql;

-- 2. Drop the existing recursive RLS policies
DROP POLICY IF EXISTS "Users can read their own memberships" ON organization_memberships;
DROP POLICY IF EXISTS "Users can read their organizations" ON organizations;
DROP POLICY IF EXISTS "Users can read invitations for their org" ON user_invitations;

-- 3. Recreate RLS policies without recursion
CREATE POLICY "Users can read their own memberships" ON organization_memberships
    FOR SELECT USING (
        user_id = auth.uid() OR
        is_active_member(organization_id)
    );

CREATE POLICY "Users can read their organizations" ON organizations
    FOR SELECT USING (
        is_active_member(id)
    );

CREATE POLICY "Users can read invitations for their org" ON user_invitations
    FOR SELECT USING (
        is_active_member(organization_id)
    );

-- 4. Apply strict explicit GRANts for anon, authenticated, and service_role
-- Principio de mínimo privilegio:
-- anon solo requiere acceso para poder ejecutar un login/registro básico, usualmente nada de estas tablas internas o muy poco, pero las políticas RLS bloquearán lecturas.
-- service_role requiere acceso administrativo a todo.
-- authenticated requiere acceso operativo según RLS.

DO $$
DECLARE
    t TEXT;
    core_tables TEXT[] := ARRAY[
        'profiles',
        'organizations',
        'organization_memberships',
        'user_invitations',
        'auth_audit_logs',
        'assessment_sessions',
        'tenant_assessments',
        'discovery_interviews',
        'discovery_interview_answers',
        'dental_budgets',
        'dental_budget_follow_up_attempts',
        'dental_budget_status_history',
        'platform_events',
        'roi_events',
        'rate_limits',
        'company_brain',
        'knowledge_documents',
        'tenant_connectors'
    ];
BEGIN
    FOR t IN SELECT unnest(core_tables)
    LOOP
        IF EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = t) THEN
            -- Permitimos acceso a service_role
            EXECUTE format('GRANT ALL ON TABLE public.%I TO service_role;', t);
            
            -- Permitimos acceso operativo para usuarios autenticados
            EXECUTE format('GRANT SELECT, INSERT, UPDATE, DELETE ON TABLE public.%I TO authenticated;', t);
            
            -- Para anon, se da GRANT pero las políticas RLS deben impedir el acceso. 
            EXECUTE format('GRANT SELECT ON TABLE public.%I TO anon;', t);
        END IF;
    END LOOP;
END;
$$;
