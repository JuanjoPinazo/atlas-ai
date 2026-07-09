-- ==============================================================================
-- ⚠️ ADVERTENCIA: NO EJECUTAR EN PRODUCCIÓN SIN BACKUP ⚠️
-- Este script destruye el esquema público y lo reconstruye desde cero, 
-- perdiendo todos los datos existentes.
-- ==============================================================================

-- 1. DROP DE TABLAS (Orden inverso a la creación)
DROP TABLE IF EXISTS public.opstar_center_business_metrics CASCADE;
DROP TABLE IF EXISTS public.opstar_center_objectives CASCADE;
DROP TABLE IF EXISTS public.opstar_study_governance CASCADE;
DROP TABLE IF EXISTS public.opstar_oct_evidence CASCADE;
DROP TABLE IF EXISTS public.ecrf_opstar_records CASCADE;
DROP TABLE IF EXISTS public.opstar_investigators CASCADE;
DROP TABLE IF EXISTS public.hospital_operators CASCADE;
DROP TABLE IF EXISTS public.operators CASCADE;
DROP TABLE IF EXISTS public.profiles CASCADE;
DROP TABLE IF EXISTS public.hospitals CASCADE;

-- DROP DE FUNCIONES HELPER
DROP FUNCTION IF EXISTS public.get_current_user_role CASCADE;
DROP FUNCTION IF EXISTS public.get_current_user_hospital_ids CASCADE;
DROP FUNCTION IF EXISTS public.is_admin CASCADE;
DROP FUNCTION IF EXISTS public.is_monitor CASCADE;
DROP FUNCTION IF EXISTS public.can_access_case CASCADE;
DROP FUNCTION IF EXISTS public.can_edit_case CASCADE;
DROP FUNCTION IF EXISTS public.check_locked_case CASCADE;
DROP FUNCTION IF EXISTS public.update_modified_column CASCADE;

-- DROP DE ENUMS
DROP TYPE IF EXISTS public.user_role CASCADE;
DROP TYPE IF EXISTS public.case_status CASCADE;
DROP TYPE IF EXISTS public.wash_quality CASCADE;
DROP TYPE IF EXISTS public.evidence_type CASCADE;
DROP TYPE IF EXISTS public.evidence_phase CASCADE;
DROP TYPE IF EXISTS public.strategy_change_type CASCADE;
DROP TYPE IF EXISTS public.center_type CASCADE;
DROP TYPE IF EXISTS public.record_status CASCADE;

-- 2. EJECUCIÓN DE MIGRACIONES
-- En un entorno normal, usarías Supabase CLI para aplicar migraciones en orden.
-- Si estás usando pgAdmin o psql, debes copiar y pegar el contenido de los archivos 
-- de migraciones en el siguiente orden:
-- 1. migrations/0001_initial_schema.sql
-- 2. migrations/0002_auth_roles_hospitals.sql
-- 3. migrations/0003_zero_contrast_registry.sql
-- 4. migrations/0004_helper_functions.sql
-- 5. migrations/0005_oct_evidence_storage.sql
-- 6. migrations/0006_demo_center_and_bi.sql
-- 7. migrations/0007_rls_policies.sql

-- 3. EJECUCIÓN DE SEEDS (Opcional)
-- Ejecutar en orden:
-- 1. seeds/001_seed_hospitals.sql
-- 2. seeds/002_seed_admin_user.sql
-- 3. seeds/003_seed_demo_data.sql
