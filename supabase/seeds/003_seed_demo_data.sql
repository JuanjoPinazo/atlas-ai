-- 003_seed_demo_data.sql
-- Seed para operadores, investigadores y casos de demo clínica

DO $$
DECLARE
  demo_hospital_id UUID := 'd4e5f6a7-b8c9-0d1e-2f3a-4b5c6d7e8f9a'; -- Centro Demo OPSTAR
  demo_operator_id UUID := 'e5f6a7b8-c9d0-1e2f-3a4b-5c6d7e8f9a0b';
  admin_uid UUID := '00000000-0000-0000-0000-000000000001';
  demo_case_id UUID := 'f6a7b8c9-d0e1-2f3a-4b5c-6d7e8f9a0b1c';
BEGIN

  -- 1. Crear Operador Demo
  INSERT INTO public.operators (id, first_name, last_name)
  VALUES (demo_operator_id, 'Dr. Demo', 'Cardiólogo')
  ON CONFLICT (id) DO NOTHING;

  -- 2. Asociar operador al hospital demo
  INSERT INTO public.hospital_operators (hospital_id, operator_id, is_main_center)
  VALUES (demo_hospital_id, demo_operator_id, true)
  ON CONFLICT DO NOTHING;

  -- 3. Crear un caso Demo Clínico (Zero-Contrast)
  INSERT INTO public.ecrf_opstar_records (
    id, hospital_id, operator_id, procedure_date, patient_code, 
    local_nhc, coronary_segment, saline_protocol_used, 
    syringe_size_ml, fast_pullback_seconds, contrast_during_oct_ml, 
    total_contrast_ml, wash_quality, lesion_length_mm, 
    proximal_reference_mm, distal_reference_mm, mla_mm2, 
    final_stent_expansion_percent, case_status, created_by
  )
  VALUES (
    demo_case_id, demo_hospital_id, demo_operator_id, CURRENT_DATE, 'DEMO-001', 
    'NHC-9999', 'LAD proximal', true, 
    20, 2, 0, 
    15.5, 'excellent', 24.5, 
    3.5, 3.0, 4.2, 
    95.0, 'submitted', admin_uid
  )
  ON CONFLICT (id) DO NOTHING;

  -- 4. Datos ejecutivos de demostración (BI) para el admin
  INSERT INTO public.opstar_center_business_metrics (
    hospital_id, period_month, stent_savings_eur, contrast_savings_eur, procedure_time_savings_min, total_roi_eur
  )
  VALUES 
    (demo_hospital_id, date_trunc('month', CURRENT_DATE - INTERVAL '2 months'), 1200, 350, 45, 1550),
    (demo_hospital_id, date_trunc('month', CURRENT_DATE - INTERVAL '1 month'), 1500, 400, 50, 1900),
    (demo_hospital_id, date_trunc('month', CURRENT_DATE), 800, 200, 20, 1000)
  ON CONFLICT DO NOTHING;

END $$;
