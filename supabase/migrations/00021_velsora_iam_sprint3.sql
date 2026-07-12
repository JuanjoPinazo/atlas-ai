-- 00021_velsora_iam_sprint3.sql

-- 1. Create SECURITY DEFINER functions to prevent RLS recursion and ensure strict security
CREATE OR REPLACE FUNCTION current_user_is_superadmin()
RETURNS BOOLEAN
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  is_superadmin BOOLEAN;
BEGIN
  SELECT EXISTS (
    SELECT 1 
    FROM organization_memberships m
    WHERE m.user_id = auth.uid()
    AND m.role = 'SUPERADMIN'
    AND m.status = 'ACTIVE'
  ) INTO is_superadmin;
  RETURN is_superadmin;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION current_user_role(org_id UUID)
RETURNS app_role
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  user_role app_role;
BEGIN
  SELECT m.role INTO user_role
  FROM organization_memberships m
  WHERE m.organization_id = org_id
  AND m.user_id = auth.uid()
  AND m.status = 'ACTIVE'
  LIMIT 1;
  RETURN user_role;
END;
$$ LANGUAGE plpgsql;

-- Make sure is_active_member uses the most strict path and explicitly checks auth.uid()
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

-- 2. Revoke indiscriminant ALL permissions
-- Primero, revocamos cualquier permiso general otorgado previamente en 00020.
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
        -- Validamos si la tabla existe en public schema para evitar errores si algún módulo no está creado
        IF EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = t) THEN
            -- Revocamos a anon y authenticated cualquier grant
            EXECUTE format('REVOKE ALL ON TABLE public.%I FROM anon, authenticated, public;', t);
            
            -- Asignamos explícitamente:
            -- service_role: acceso total administrativo.
            EXECUTE format('GRANT ALL ON TABLE public.%I TO service_role;', t);
            
            -- authenticated: solo lo necesario para operar, RLS bloqueará los datos indebidos.
            EXECUTE format('GRANT SELECT, INSERT, UPDATE, DELETE ON TABLE public.%I TO authenticated;', t);
            
            -- anon: No damos NADA por defecto. 
            -- Si la app necesita acceso anónimo a algo, deberá crearse una excepción explícita.
            -- En este Sprint, anon NO tiene acceso a datos internos.
        END IF;
    END LOOP;
END;
$$;
