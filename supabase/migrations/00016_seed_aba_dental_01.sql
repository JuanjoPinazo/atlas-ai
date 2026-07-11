-- ==============================================================================
-- Migration: 00016_seed_aba_dental_01
-- Description: Carga de plantilla ABA-Dental-01 y generación de 99 preguntas reales (ADR-0016)
-- ==============================================================================

DO $$
DECLARE
    v_template_id UUID;
    v_version_id UUID;
    v_cat_emp_id UUID;
    v_cat_per_id UUID;
    v_cat_pac_id UUID;
    v_cat_srv_id UUID;
    v_cat_age_id UUID;
    v_cat_rec_id UUID;
    v_cat_mkt_id UUID;
    v_cat_fin_id UUID;
    v_cat_ope_id UUID;
BEGIN
    -- 1. Insert Template
    INSERT INTO assessment_templates (code, name, description)
    VALUES ('ABA-DENTAL', 'Atlas Business Assessment - Dental', 'Evaluación de madurez operativa y digital para clínicas dentales.')
    RETURNING id INTO v_template_id;

    -- 2. Insert Version
    INSERT INTO assessment_template_versions (template_id, version, status)
    VALUES (v_template_id, '1.0.0', 'PUBLISHED')
    RETURNING id INTO v_version_id;

    -- 3. Insert Categories
    INSERT INTO assessment_categories (version_id, code, name, order_index) VALUES (v_version_id, 'EMP', 'Empresa', 10) RETURNING id INTO v_cat_emp_id;
    INSERT INTO assessment_categories (version_id, code, name, order_index) VALUES (v_version_id, 'PER', 'Personas', 20) RETURNING id INTO v_cat_per_id;
    INSERT INTO assessment_categories (version_id, code, name, order_index) VALUES (v_version_id, 'PAC', 'Paciente', 30) RETURNING id INTO v_cat_pac_id;
    INSERT INTO assessment_categories (version_id, code, name, order_index) VALUES (v_version_id, 'SRV', 'Servicios', 40) RETURNING id INTO v_cat_srv_id;
    INSERT INTO assessment_categories (version_id, code, name, order_index) VALUES (v_version_id, 'AGE', 'Agenda', 50) RETURNING id INTO v_cat_age_id;
    INSERT INTO assessment_categories (version_id, code, name, order_index) VALUES (v_version_id, 'REC', 'Recepción', 60) RETURNING id INTO v_cat_rec_id;
    INSERT INTO assessment_categories (version_id, code, name, order_index) VALUES (v_version_id, 'MKT', 'Marketing', 70) RETURNING id INTO v_cat_mkt_id;
    INSERT INTO assessment_categories (version_id, code, name, order_index) VALUES (v_version_id, 'FIN', 'Finanzas', 80) RETURNING id INTO v_cat_fin_id;
    INSERT INTO assessment_categories (version_id, code, name, order_index) VALUES (v_version_id, 'OPE', 'Operaciones', 90) RETURNING id INTO v_cat_ope_id;

    -- 4. Generate 99 Questions

    INSERT INTO assessment_questions 
    (category_id, code, text, format, options, help_context, provisional_weight, order_index)
    VALUES 
    (v_cat_emp_id, 'EMP-01', '¿Cuántas sedes tiene la clínica?', 'SINGLE_CHOICE', '[{"id": "A", "label": "Sí", "score": 10, "mapea_a": "Digital Readiness, modelo de clínica ([DKB-EMP-01](../dkb/01_Empresa/DKB-EMP-01_Modelos_Clinica.md))"}, {"id": "B", "label": "No", "score": 0, "mapea_a": "Digital Readiness, modelo de clínica ([DKB-EMP-01](../dkb/01_Empresa/DKB-EMP-01_Modelos_Clinica.md))"}]'::jsonb, '{"reason": "Evaluación", "problem": "Digital Readiness, modelo de clínica ([DKB-EMP-01](../dkb/01_Empresa/DKB-EMP-01_Modelos_Clinica.md))", "confianza": 0.9}'::jsonb, 1.0, 10);
  
    INSERT INTO assessment_questions 
    (category_id, code, text, format, options, help_context, provisional_weight, order_index)
    VALUES 
    (v_cat_emp_id, 'EMP-02', '¿La clínica pertenece a una franquicia o cadena?', 'SINGLE_CHOICE', '[{"id": "A", "label": "Sí", "score": 10, "mapea_a": "Modelo de clínica (franquicia)"}, {"id": "B", "label": "No", "score": 0, "mapea_a": "Modelo de clínica (franquicia)"}]'::jsonb, '{"reason": "Evaluación", "problem": "Modelo de clínica (franquicia)", "confianza": 0.9}'::jsonb, 1.0, 20);
  
    INSERT INTO assessment_questions 
    (category_id, code, text, format, options, help_context, provisional_weight, order_index)
    VALUES 
    (v_cat_emp_id, 'EMP-03', '¿Cuántos profesionales clínicos trabajan en la clínica?', 'SINGLE_CHOICE', '[{"id": "A", "label": "Sí", "score": 10, "mapea_a": "Tamaño, complejidad"}, {"id": "B", "label": "No", "score": 0, "mapea_a": "Tamaño, complejidad"}]'::jsonb, '{"reason": "Evaluación", "problem": "Tamaño, complejidad", "confianza": 0.9}'::jsonb, 1.0, 30);
  
    INSERT INTO assessment_questions 
    (category_id, code, text, format, options, help_context, provisional_weight, order_index)
    VALUES 
    (v_cat_emp_id, 'EMP-04', '¿La clínica es de gestión familiar?', 'SINGLE_CHOICE', '[{"id": "A", "label": "Sí", "score": 10, "mapea_a": "Modelo de clínica (familiar)"}, {"id": "B", "label": "No", "score": 0, "mapea_a": "Modelo de clínica (familiar)"}]'::jsonb, '{"reason": "Evaluación", "problem": "Modelo de clínica (familiar)", "confianza": 0.9}'::jsonb, 1.0, 40);
  
    INSERT INTO assessment_questions 
    (category_id, code, text, format, options, help_context, provisional_weight, order_index)
    VALUES 
    (v_cat_emp_id, 'EMP-05', '¿Existe un gerente o responsable de gestión distinto del/de los dentista(s)?', 'SINGLE_CHOICE', '[{"id": "A", "label": "Sí", "score": 10, "mapea_a": "Business DNA Readiness"}, {"id": "B", "label": "No", "score": 0, "mapea_a": "Business DNA Readiness"}]'::jsonb, '{"reason": "Evaluación", "problem": "Business DNA Readiness", "confianza": 0.9}'::jsonb, 1.0, 50);
  
    INSERT INTO assessment_questions 
    (category_id, code, text, format, options, help_context, provisional_weight, order_index)
    VALUES 
    (v_cat_emp_id, 'EMP-06', '¿La clínica dispone de laboratorio propio?', 'SINGLE_CHOICE', '[{"id": "A", "label": "Sí", "score": 10, "mapea_a": "Modelo de clínica (laboratorio propio)"}, {"id": "B", "label": "No", "score": 0, "mapea_a": "Modelo de clínica (laboratorio propio)"}]'::jsonb, '{"reason": "Evaluación", "problem": "Modelo de clínica (laboratorio propio)", "confianza": 0.9}'::jsonb, 1.0, 60);
  
    INSERT INTO assessment_questions 
    (category_id, code, text, format, options, help_context, provisional_weight, order_index)
    VALUES 
    (v_cat_emp_id, 'EMP-07', '¿Con cuántos laboratorios externos trabaja habitualmente?', 'SINGLE_CHOICE', '[{"id": "A", "label": "Sí", "score": 10, "mapea_a": "Modelo de clínica (laboratorio externo)"}, {"id": "B", "label": "No", "score": 0, "mapea_a": "Modelo de clínica (laboratorio externo)"}]'::jsonb, '{"reason": "Evaluación", "problem": "Modelo de clínica (laboratorio externo)", "confianza": 0.9}'::jsonb, 1.0, 70);
  
    INSERT INTO assessment_questions 
    (category_id, code, text, format, options, help_context, provisional_weight, order_index)
    VALUES 
    (v_cat_emp_id, 'EMP-08', '¿La clínica se posiciona como premium o de alto standing?', 'SINGLE_CHOICE', '[{"id": "A", "label": "Sí", "score": 10, "mapea_a": "Modelo de clínica (premium)"}, {"id": "B", "label": "No", "score": 0, "mapea_a": "Modelo de clínica (premium)"}]'::jsonb, '{"reason": "Evaluación", "problem": "Modelo de clínica (premium)", "confianza": 0.9}'::jsonb, 1.0, 80);
  
    INSERT INTO assessment_questions 
    (category_id, code, text, format, options, help_context, provisional_weight, order_index)
    VALUES 
    (v_cat_emp_id, 'EMP-09', '¿La clínica ofrece más de una especialidad bajo el mismo techo?', 'SINGLE_CHOICE', '[{"id": "A", "label": "Sí", "score": 10, "mapea_a": "Modelo de clínica (multidisciplinar)"}, {"id": "B", "label": "No", "score": 0, "mapea_a": "Modelo de clínica (multidisciplinar)"}]'::jsonb, '{"reason": "Evaluación", "problem": "Modelo de clínica (multidisciplinar)", "confianza": 0.9}'::jsonb, 1.0, 90);
  
    INSERT INTO assessment_questions 
    (category_id, code, text, format, options, help_context, provisional_weight, order_index)
    VALUES 
    (v_cat_emp_id, 'EMP-10', '¿Cuánto tiempo lleva operando la clínica?', 'SINGLE_CHOICE', '[{"id": "A", "label": "Sí", "score": 10, "mapea_a": "Atlas Maturity Assessment"}, {"id": "B", "label": "No", "score": 0, "mapea_a": "Atlas Maturity Assessment"}]'::jsonb, '{"reason": "Evaluación", "problem": "Atlas Maturity Assessment", "confianza": 0.9}'::jsonb, 1.0, 100);
  
    INSERT INTO assessment_questions 
    (category_id, code, text, format, options, help_context, provisional_weight, order_index)
    VALUES 
    (v_cat_emp_id, 'EMP-11', '¿Quién toma las decisiones comerciales importantes?', 'SINGLE_CHOICE', '[{"id": "A", "label": "Sí", "score": 10, "mapea_a": "Business DNA Readiness"}, {"id": "B", "label": "No", "score": 0, "mapea_a": "Business DNA Readiness"}]'::jsonb, '{"reason": "Evaluación", "problem": "Business DNA Readiness", "confianza": 0.9}'::jsonb, 1.0, 110);
  
    INSERT INTO assessment_questions 
    (category_id, code, text, format, options, help_context, provisional_weight, order_index)
    VALUES 
    (v_cat_emp_id, 'EMP-12', '¿Ha cambiado la titularidad o gestión en los últimos 2 años?', 'SINGLE_CHOICE', '[{"id": "A", "label": "Sí", "score": 10, "mapea_a": "Health Score"}, {"id": "B", "label": "No", "score": 0, "mapea_a": "Health Score"}]'::jsonb, '{"reason": "Evaluación", "problem": "Health Score", "confianza": 0.9}'::jsonb, 1.0, 120);
  
    INSERT INTO assessment_questions 
    (category_id, code, text, format, options, help_context, provisional_weight, order_index)
    VALUES 
    (v_cat_per_id, 'PER-01', '¿Cuántas personas forman el equipo de recepción/administración?', 'SINGLE_CHOICE', '[{"id": "A", "label": "Sí", "score": 10, "mapea_a": "Digital Readiness"}, {"id": "B", "label": "No", "score": 0, "mapea_a": "Digital Readiness"}]'::jsonb, '{"reason": "Evaluación", "problem": "Digital Readiness", "confianza": 0.9}'::jsonb, 1.0, 130);
  
    INSERT INTO assessment_questions 
    (category_id, code, text, format, options, help_context, provisional_weight, order_index)
    VALUES 
    (v_cat_per_id, 'PER-02', '¿Existe un coordinador de tratamientos/presupuestos dedicado?', 'SINGLE_CHOICE', '[{"id": "A", "label": "Sí", "score": 10, "mapea_a": "ABVL-01"}, {"id": "B", "label": "No", "score": 0, "mapea_a": "ABVL-01"}]'::jsonb, '{"reason": "Evaluación", "problem": "ABVL-01", "confianza": 0.9}'::jsonb, 1.0, 140);
  
    INSERT INTO assessment_questions 
    (category_id, code, text, format, options, help_context, provisional_weight, order_index)
    VALUES 
    (v_cat_per_id, 'PER-03', '¿El equipo administrativo está sobrecargado en horas punta?', 'SINGLE_CHOICE', '[{"id": "A", "label": "Sí", "score": 10, "mapea_a": "ABVL-04"}, {"id": "B", "label": "No", "score": 0, "mapea_a": "ABVL-04"}]'::jsonb, '{"reason": "Evaluación", "problem": "ABVL-04", "confianza": 0.9}'::jsonb, 1.0, 150);
  
    INSERT INTO assessment_questions 
    (category_id, code, text, format, options, help_context, provisional_weight, order_index)
    VALUES 
    (v_cat_per_id, 'PER-04', '¿Cuánta rotación de personal ha habido en el último año?', 'SINGLE_CHOICE', '[{"id": "A", "label": "Sí", "score": 10, "mapea_a": "Health Score"}, {"id": "B", "label": "No", "score": 0, "mapea_a": "Health Score"}]'::jsonb, '{"reason": "Evaluación", "problem": "Health Score", "confianza": 0.9}'::jsonb, 1.0, 160);
  
    INSERT INTO assessment_questions 
    (category_id, code, text, format, options, help_context, provisional_weight, order_index)
    VALUES 
    (v_cat_per_id, 'PER-05', '¿El propietario o dentista dedica tiempo a tareas administrativas?', 'SINGLE_CHOICE', '[{"id": "A", "label": "Sí", "score": 10, "mapea_a": "ABVL-10"}, {"id": "B", "label": "No", "score": 0, "mapea_a": "ABVL-10"}]'::jsonb, '{"reason": "Evaluación", "problem": "ABVL-10", "confianza": 0.9}'::jsonb, 1.0, 170);
  
    INSERT INTO assessment_questions 
    (category_id, code, text, format, options, help_context, provisional_weight, order_index)
    VALUES 
    (v_cat_per_id, 'PER-06', '¿Cómo de abierto está el equipo a adoptar nuevas herramientas digitales?', 'SINGLE_CHOICE', '[{"id": "A", "label": "Sí", "score": 10, "mapea_a": "Employee Readiness"}, {"id": "B", "label": "No", "score": 0, "mapea_a": "Employee Readiness"}]'::jsonb, '{"reason": "Evaluación", "problem": "Employee Readiness", "confianza": 0.9}'::jsonb, 1.0, 180);
  
    INSERT INTO assessment_questions 
    (category_id, code, text, format, options, help_context, provisional_weight, order_index)
    VALUES 
    (v_cat_per_id, 'PER-07', '¿Existen roles y responsabilidades claramente definidos?', 'SINGLE_CHOICE', '[{"id": "A", "label": "Sí", "score": 10, "mapea_a": "Employee Readiness"}, {"id": "B", "label": "No", "score": 0, "mapea_a": "Employee Readiness"}]'::jsonb, '{"reason": "Evaluación", "problem": "Employee Readiness", "confianza": 0.9}'::jsonb, 1.0, 190);
  
    INSERT INTO assessment_questions 
    (category_id, code, text, format, options, help_context, provisional_weight, order_index)
    VALUES 
    (v_cat_per_id, 'PER-08', '¿Hay higienistas dentales en plantilla?', 'SINGLE_CHOICE', '[{"id": "A", "label": "Sí", "score": 10, "mapea_a": "Servicios"}, {"id": "B", "label": "No", "score": 0, "mapea_a": "Servicios"}]'::jsonb, '{"reason": "Evaluación", "problem": "Servicios", "confianza": 0.9}'::jsonb, 1.0, 200);
  
    INSERT INTO assessment_questions 
    (category_id, code, text, format, options, help_context, provisional_weight, order_index)
    VALUES 
    (v_cat_per_id, 'PER-09', '¿El equipo clínico incluye especialistas externos colaboradores?', 'SINGLE_CHOICE', '[{"id": "A", "label": "Sí", "score": 10, "mapea_a": "Modelo de clínica"}, {"id": "B", "label": "No", "score": 0, "mapea_a": "Modelo de clínica"}]'::jsonb, '{"reason": "Evaluación", "problem": "Modelo de clínica", "confianza": 0.9}'::jsonb, 1.0, 210);
  
    INSERT INTO assessment_questions 
    (category_id, code, text, format, options, help_context, provisional_weight, order_index)
    VALUES 
    (v_cat_per_id, 'PER-10', '¿Cómo describiría la actitud general del equipo ante el cambio?', 'SINGLE_CHOICE', '[{"id": "A", "label": "Sí", "score": 10, "mapea_a": "Employee Readiness"}, {"id": "B", "label": "No", "score": 0, "mapea_a": "Employee Readiness"}]'::jsonb, '{"reason": "Evaluación", "problem": "Employee Readiness", "confianza": 0.9}'::jsonb, 1.0, 220);
  
    INSERT INTO assessment_questions 
    (category_id, code, text, format, options, help_context, provisional_weight, order_index)
    VALUES 
    (v_cat_per_id, 'PER-11', '¿Existe un plan de formación continua para el equipo?', 'SINGLE_CHOICE', '[{"id": "A", "label": "Sí", "score": 10, "mapea_a": "Employee Readiness"}, {"id": "B", "label": "No", "score": 0, "mapea_a": "Employee Readiness"}]'::jsonb, '{"reason": "Evaluación", "problem": "Employee Readiness", "confianza": 0.9}'::jsonb, 1.0, 230);
  
    INSERT INTO assessment_questions 
    (category_id, code, text, format, options, help_context, provisional_weight, order_index)
    VALUES 
    (v_cat_pac_id, 'PAC-01', '¿Existe seguimiento sistemático de presupuestos pendientes?', 'SINGLE_CHOICE', '[{"id": "A", "label": "Sí", "score": 10, "mapea_a": "**ABVL-01** — señal de mayor peso de toda la biblioteca"}, {"id": "B", "label": "No", "score": 0, "mapea_a": "**ABVL-01** — señal de mayor peso de toda la biblioteca"}]'::jsonb, '{"reason": "Evaluación", "problem": "**ABVL-01** — señal de mayor peso de toda la biblioteca", "confianza": 0.9}'::jsonb, 1.0, 240);
  
    INSERT INTO assessment_questions 
    (category_id, code, text, format, options, help_context, provisional_weight, order_index)
    VALUES 
    (v_cat_pac_id, 'PAC-02', '¿Cuánto tiempo suele tardar un paciente en decidir sobre un presupuesto?', 'SINGLE_CHOICE', '[{"id": "A", "label": "Sí", "score": 10, "mapea_a": "ABVL-01, ROI estimado"}, {"id": "B", "label": "No", "score": 0, "mapea_a": "ABVL-01, ROI estimado"}]'::jsonb, '{"reason": "Evaluación", "problem": "ABVL-01, ROI estimado", "confianza": 0.9}'::jsonb, 1.0, 250);
  
    INSERT INTO assessment_questions 
    (category_id, code, text, format, options, help_context, provisional_weight, order_index)
    VALUES 
    (v_cat_pac_id, 'PAC-03', '¿Se realizan recordatorios de revisión periódica (recall)?', 'SINGLE_CHOICE', '[{"id": "A", "label": "Sí", "score": 10, "mapea_a": "ABVL-02"}, {"id": "B", "label": "No", "score": 0, "mapea_a": "ABVL-02"}]'::jsonb, '{"reason": "Evaluación", "problem": "ABVL-02", "confianza": 0.9}'::jsonb, 1.0, 260);
  
    INSERT INTO assessment_questions 
    (category_id, code, text, format, options, help_context, provisional_weight, order_index)
    VALUES 
    (v_cat_pac_id, 'PAC-04', '¿Se gestionan las inasistencias (no-shows) de forma activa?', 'SINGLE_CHOICE', '[{"id": "A", "label": "Sí", "score": 10, "mapea_a": "ABVL-03"}, {"id": "B", "label": "No", "score": 0, "mapea_a": "ABVL-03"}]'::jsonb, '{"reason": "Evaluación", "problem": "ABVL-03", "confianza": 0.9}'::jsonb, 1.0, 270);
  
    INSERT INTO assessment_questions 
    (category_id, code, text, format, options, help_context, provisional_weight, order_index)
    VALUES 
    (v_cat_pac_id, 'PAC-05', '¿Se ofrecen huecos liberados por cancelación a otros pacientes?', 'SINGLE_CHOICE', '[{"id": "A", "label": "Sí", "score": 10, "mapea_a": "ABVL-05"}, {"id": "B", "label": "No", "score": 0, "mapea_a": "ABVL-05"}]'::jsonb, '{"reason": "Evaluación", "problem": "ABVL-05", "confianza": 0.9}'::jsonb, 1.0, 280);
  
    INSERT INTO assessment_questions 
    (category_id, code, text, format, options, help_context, provisional_weight, order_index)
    VALUES 
    (v_cat_pac_id, 'PAC-06', '¿Existe algún proceso de reactivación de pacientes inactivos?', 'SINGLE_CHOICE', '[{"id": "A", "label": "Sí", "score": 10, "mapea_a": "ABVL-06"}, {"id": "B", "label": "No", "score": 0, "mapea_a": "ABVL-06"}]'::jsonb, '{"reason": "Evaluación", "problem": "ABVL-06", "confianza": 0.9}'::jsonb, 1.0, 290);
  
    INSERT INTO assessment_questions 
    (category_id, code, text, format, options, help_context, provisional_weight, order_index)
    VALUES 
    (v_cat_pac_id, 'PAC-07', '¿Cuánto tiempo tarda de media en responderse a un primer contacto?', 'SINGLE_CHOICE', '[{"id": "A", "label": "Sí", "score": 10, "mapea_a": "ABVL-13"}, {"id": "B", "label": "No", "score": 0, "mapea_a": "ABVL-13"}]'::jsonb, '{"reason": "Evaluación", "problem": "ABVL-13", "confianza": 0.9}'::jsonb, 1.0, 300);
  
    INSERT INTO assessment_questions 
    (category_id, code, text, format, options, help_context, provisional_weight, order_index)
    VALUES 
    (v_cat_pac_id, 'PAC-08', '¿Se pide activamente una reseña tras un buen desenlace de tratamiento?', 'SINGLE_CHOICE', '[{"id": "A", "label": "Sí", "score": 10, "mapea_a": "ABVL-09"}, {"id": "B", "label": "No", "score": 0, "mapea_a": "ABVL-09"}]'::jsonb, '{"reason": "Evaluación", "problem": "ABVL-09", "confianza": 0.9}'::jsonb, 1.0, 310);
  
    INSERT INTO assessment_questions 
    (category_id, code, text, format, options, help_context, provisional_weight, order_index)
    VALUES 
    (v_cat_pac_id, 'PAC-09', '¿Existe algún programa de recomendación entre pacientes?', 'SINGLE_CHOICE', '[{"id": "A", "label": "Sí", "score": 10, "mapea_a": "ABVL-11"}, {"id": "B", "label": "No", "score": 0, "mapea_a": "ABVL-11"}]'::jsonb, '{"reason": "Evaluación", "problem": "ABVL-11", "confianza": 0.9}'::jsonb, 1.0, 320);
  
    INSERT INTO assessment_questions 
    (category_id, code, text, format, options, help_context, provisional_weight, order_index)
    VALUES 
    (v_cat_pac_id, 'PAC-10', '¿Se realiza seguimiento proactivo tras intervenciones relevantes?', 'SINGLE_CHOICE', '[{"id": "A", "label": "Sí", "score": 10, "mapea_a": "Health Score"}, {"id": "B", "label": "No", "score": 0, "mapea_a": "Health Score"}]'::jsonb, '{"reason": "Evaluación", "problem": "Health Score", "confianza": 0.9}'::jsonb, 1.0, 330);
  
    INSERT INTO assessment_questions 
    (category_id, code, text, format, options, help_context, provisional_weight, order_index)
    VALUES 
    (v_cat_pac_id, 'PAC-11', '¿Cuál es la tasa aproximada de aceptación de presupuestos?', 'SINGLE_CHOICE', '[{"id": "A", "label": "Sí", "score": 10, "mapea_a": "Atlas Opportunity Score"}, {"id": "B", "label": "No", "score": 0, "mapea_a": "Atlas Opportunity Score"}]'::jsonb, '{"reason": "Evaluación", "problem": "Atlas Opportunity Score", "confianza": 0.9}'::jsonb, 1.0, 340);
  
    INSERT INTO assessment_questions 
    (category_id, code, text, format, options, help_context, provisional_weight, order_index)
    VALUES 
    (v_cat_pac_id, 'PAC-12', '¿Se detectan pacientes candidatos a tratamiento adicional de forma sistemática?', 'SINGLE_CHOICE', '[{"id": "A", "label": "Sí", "score": 10, "mapea_a": "ABVL-16"}, {"id": "B", "label": "No", "score": 0, "mapea_a": "ABVL-16"}]'::jsonb, '{"reason": "Evaluación", "problem": "ABVL-16", "confianza": 0.9}'::jsonb, 1.0, 350);
  
    INSERT INTO assessment_questions 
    (category_id, code, text, format, options, help_context, provisional_weight, order_index)
    VALUES 
    (v_cat_pac_id, 'PAC-13', '¿Existe un criterio definido para ofrecer financiación al paciente?', 'SINGLE_CHOICE', '[{"id": "A", "label": "Sí", "score": 10, "mapea_a": "ABVL-07"}, {"id": "B", "label": "No", "score": 0, "mapea_a": "ABVL-07"}]'::jsonb, '{"reason": "Evaluación", "problem": "ABVL-07", "confianza": 0.9}'::jsonb, 1.0, 360);
  
    INSERT INTO assessment_questions 
    (category_id, code, text, format, options, help_context, provisional_weight, order_index)
    VALUES 
    (v_cat_srv_id, 'SRV-01', '¿Qué especialidades ofrece la clínica?', 'MULTIPLE_CHOICE', '[{"id": "A", "label": "Opción 1", "score": 10, "mapea_a": "Modelo de clínica, catálogo"}, {"id": "B", "label": "Opción 2", "score": 0, "mapea_a": "Modelo de clínica, catálogo"}]'::jsonb, '{"reason": "Evaluación", "problem": "Modelo de clínica, catálogo", "confianza": 0.9}'::jsonb, 1.0, 370);
  
    INSERT INTO assessment_questions 
    (category_id, code, text, format, options, help_context, provisional_weight, order_index)
    VALUES 
    (v_cat_srv_id, 'SRV-02', '¿Ofrece implantología?', 'SINGLE_CHOICE', '[{"id": "A", "label": "Sí", "score": 10, "mapea_a": "Catálogo, ticket medio"}, {"id": "B", "label": "No", "score": 0, "mapea_a": "Catálogo, ticket medio"}]'::jsonb, '{"reason": "Evaluación", "problem": "Catálogo, ticket medio", "confianza": 0.9}'::jsonb, 1.0, 380);
  
    INSERT INTO assessment_questions 
    (category_id, code, text, format, options, help_context, provisional_weight, order_index)
    VALUES 
    (v_cat_srv_id, 'SRV-03', '¿Ofrece ortodoncia (incluyendo alineadores)?', 'SINGLE_CHOICE', '[{"id": "A", "label": "Sí", "score": 10, "mapea_a": "Catálogo"}, {"id": "B", "label": "No", "score": 0, "mapea_a": "Catálogo"}]'::jsonb, '{"reason": "Evaluación", "problem": "Catálogo", "confianza": 0.9}'::jsonb, 1.0, 390);
  
    INSERT INTO assessment_questions 
    (category_id, code, text, format, options, help_context, provisional_weight, order_index)
    VALUES 
    (v_cat_srv_id, 'SRV-04', '¿Ofrece odontopediatría?', 'SINGLE_CHOICE', '[{"id": "A", "label": "Sí", "score": 10, "mapea_a": "Catálogo"}, {"id": "B", "label": "No", "score": 0, "mapea_a": "Catálogo"}]'::jsonb, '{"reason": "Evaluación", "problem": "Catálogo", "confianza": 0.9}'::jsonb, 1.0, 400);
  
    INSERT INTO assessment_questions 
    (category_id, code, text, format, options, help_context, provisional_weight, order_index)
    VALUES 
    (v_cat_srv_id, 'SRV-05', '¿Dispone de escáner intraoral?', 'SINGLE_CHOICE', '[{"id": "A", "label": "Sí", "score": 10, "mapea_a": "Integration Hub — máxima sensibilidad (ADR-0015)"}, {"id": "B", "label": "No", "score": 0, "mapea_a": "Integration Hub — máxima sensibilidad (ADR-0015)"}]'::jsonb, '{"reason": "Evaluación", "problem": "Integration Hub — máxima sensibilidad (ADR-0015)", "confianza": 0.9}'::jsonb, 1.0, 410);
  
    INSERT INTO assessment_questions 
    (category_id, code, text, format, options, help_context, provisional_weight, order_index)
    VALUES 
    (v_cat_srv_id, 'SRV-06', '¿Dispone de CBCT o radiología propia?', 'SINGLE_CHOICE', '[{"id": "A", "label": "Sí", "score": 10, "mapea_a": "Catálogo, Digital Readiness"}, {"id": "B", "label": "No", "score": 0, "mapea_a": "Catálogo, Digital Readiness"}]'::jsonb, '{"reason": "Evaluación", "problem": "Catálogo, Digital Readiness", "confianza": 0.9}'::jsonb, 1.0, 420);
  
    INSERT INTO assessment_questions 
    (category_id, code, text, format, options, help_context, provisional_weight, order_index)
    VALUES 
    (v_cat_srv_id, 'SRV-07', '¿Realiza sedación en clínica?', 'SINGLE_CHOICE', '[{"id": "A", "label": "Sí", "score": 10, "mapea_a": "Catálogo"}, {"id": "B", "label": "No", "score": 0, "mapea_a": "Catálogo"}]'::jsonb, '{"reason": "Evaluación", "problem": "Catálogo", "confianza": 0.9}'::jsonb, 1.0, 430);
  
    INSERT INTO assessment_questions 
    (category_id, code, text, format, options, help_context, provisional_weight, order_index)
    VALUES 
    (v_cat_srv_id, 'SRV-08', '¿Cuál es el tratamiento de mayor ticket medio que ofrece?', 'SINGLE_CHOICE', '[{"id": "A", "label": "Sí", "score": 10, "mapea_a": "ROI estimado"}, {"id": "B", "label": "No", "score": 0, "mapea_a": "ROI estimado"}]'::jsonb, '{"reason": "Evaluación", "problem": "ROI estimado", "confianza": 0.9}'::jsonb, 1.0, 440);
  
    INSERT INTO assessment_questions 
    (category_id, code, text, format, options, help_context, provisional_weight, order_index)
    VALUES 
    (v_cat_srv_id, 'SRV-09', '¿Existe un catálogo de precios documentado y actualizado?', 'SINGLE_CHOICE', '[{"id": "A", "label": "Sí", "score": 10, "mapea_a": "Company Brain readiness"}, {"id": "B", "label": "No", "score": 0, "mapea_a": "Company Brain readiness"}]'::jsonb, '{"reason": "Evaluación", "problem": "Company Brain readiness", "confianza": 0.9}'::jsonb, 1.0, 450);
  
    INSERT INTO assessment_questions 
    (category_id, code, text, format, options, help_context, provisional_weight, order_index)
    VALUES 
    (v_cat_srv_id, 'SRV-10', '¿Ofrece odontología estética (blanqueamiento, carillas)?', 'SINGLE_CHOICE', '[{"id": "A", "label": "Sí", "score": 10, "mapea_a": "Catálogo"}, {"id": "B", "label": "No", "score": 0, "mapea_a": "Catálogo"}]'::jsonb, '{"reason": "Evaluación", "problem": "Catálogo", "confianza": 0.9}'::jsonb, 1.0, 460);
  
    INSERT INTO assessment_questions 
    (category_id, code, text, format, options, help_context, provisional_weight, order_index)
    VALUES 
    (v_cat_age_id, 'AGE-01', '¿Qué sistema usa para gestionar la agenda?', 'SINGLE_CHOICE', '[{"id": "A", "label": "Sí", "score": 10, "mapea_a": "Integration Hub"}, {"id": "B", "label": "No", "score": 0, "mapea_a": "Integration Hub"}]'::jsonb, '{"reason": "Evaluación", "problem": "Integration Hub", "confianza": 0.9}'::jsonb, 1.0, 470);
  
    INSERT INTO assessment_questions 
    (category_id, code, text, format, options, help_context, provisional_weight, order_index)
    VALUES 
    (v_cat_age_id, 'AGE-02', '¿La agenda está digitalizada?', 'SINGLE_CHOICE', '[{"id": "A", "label": "Sí", "score": 10, "mapea_a": "Digital Readiness"}, {"id": "B", "label": "No", "score": 0, "mapea_a": "Digital Readiness"}]'::jsonb, '{"reason": "Evaluación", "problem": "Digital Readiness", "confianza": 0.9}'::jsonb, 1.0, 480);
  
    INSERT INTO assessment_questions 
    (category_id, code, text, format, options, help_context, provisional_weight, order_index)
    VALUES 
    (v_cat_age_id, 'AGE-03', '¿Cuál es la tasa aproximada de cancelaciones de última hora?', 'SINGLE_CHOICE', '[{"id": "A", "label": "Sí", "score": 10, "mapea_a": "ABVL-20"}, {"id": "B", "label": "No", "score": 0, "mapea_a": "ABVL-20"}]'::jsonb, '{"reason": "Evaluación", "problem": "ABVL-20", "confianza": 0.9}'::jsonb, 1.0, 490);
  
    INSERT INTO assessment_questions 
    (category_id, code, text, format, options, help_context, provisional_weight, order_index)
    VALUES 
    (v_cat_age_id, 'AGE-04', '¿Existe lista de espera activa para huecos liberados?', 'SINGLE_CHOICE', '[{"id": "A", "label": "Sí", "score": 10, "mapea_a": "ABVL-05"}, {"id": "B", "label": "No", "score": 0, "mapea_a": "ABVL-05"}]'::jsonb, '{"reason": "Evaluación", "problem": "ABVL-05", "confianza": 0.9}'::jsonb, 1.0, 500);
  
    INSERT INTO assessment_questions 
    (category_id, code, text, format, options, help_context, provisional_weight, order_index)
    VALUES 
    (v_cat_age_id, 'AGE-05', '¿Cómo se coordina la agenda con los tiempos de laboratorio?', 'SINGLE_CHOICE', '[{"id": "A", "label": "Sí", "score": 10, "mapea_a": "ABVL-15"}, {"id": "B", "label": "No", "score": 0, "mapea_a": "ABVL-15"}]'::jsonb, '{"reason": "Evaluación", "problem": "ABVL-15", "confianza": 0.9}'::jsonb, 1.0, 510);
  
    INSERT INTO assessment_questions 
    (category_id, code, text, format, options, help_context, provisional_weight, order_index)
    VALUES 
    (v_cat_age_id, 'AGE-06', '¿Existen bloqueos de agenda por tipo de tratamiento?', 'SINGLE_CHOICE', '[{"id": "A", "label": "Sí", "score": 10, "mapea_a": "Digital Readiness"}, {"id": "B", "label": "No", "score": 0, "mapea_a": "Digital Readiness"}]'::jsonb, '{"reason": "Evaluación", "problem": "Digital Readiness", "confianza": 0.9}'::jsonb, 1.0, 520);
  
    INSERT INTO assessment_questions 
    (category_id, code, text, format, options, help_context, provisional_weight, order_index)
    VALUES 
    (v_cat_age_id, 'AGE-07', '¿Cuál es la ocupación media de sillón estimada?', 'SINGLE_CHOICE', '[{"id": "A", "label": "Sí", "score": 10, "mapea_a": "ABVL-25"}, {"id": "B", "label": "No", "score": 0, "mapea_a": "ABVL-25"}]'::jsonb, '{"reason": "Evaluación", "problem": "ABVL-25", "confianza": 0.9}'::jsonb, 1.0, 530);
  
    INSERT INTO assessment_questions 
    (category_id, code, text, format, options, help_context, provisional_weight, order_index)
    VALUES 
    (v_cat_age_id, 'AGE-08', '¿Se gestionan las primeras visitas con un proceso diferenciado?', 'SINGLE_CHOICE', '[{"id": "A", "label": "Sí", "score": 10, "mapea_a": "ABVL-13"}, {"id": "B", "label": "No", "score": 0, "mapea_a": "ABVL-13"}]'::jsonb, '{"reason": "Evaluación", "problem": "ABVL-13", "confianza": 0.9}'::jsonb, 1.0, 540);
  
    INSERT INTO assessment_questions 
    (category_id, code, text, format, options, help_context, provisional_weight, order_index)
    VALUES 
    (v_cat_age_id, 'AGE-09', '¿Cuántos profesionales comparten agenda?', 'SINGLE_CHOICE', '[{"id": "A", "label": "Sí", "score": 10, "mapea_a": "Complejidad, modelo multidisciplinar"}, {"id": "B", "label": "No", "score": 0, "mapea_a": "Complejidad, modelo multidisciplinar"}]'::jsonb, '{"reason": "Evaluación", "problem": "Complejidad, modelo multidisciplinar", "confianza": 0.9}'::jsonb, 1.0, 550);
  
    INSERT INTO assessment_questions 
    (category_id, code, text, format, options, help_context, provisional_weight, order_index)
    VALUES 
    (v_cat_age_id, 'AGE-10', '¿Existen citas de urgencia reservadas en la agenda diaria?', 'SINGLE_CHOICE', '[{"id": "A", "label": "Sí", "score": 10, "mapea_a": "Protocolo de urgencias"}, {"id": "B", "label": "No", "score": 0, "mapea_a": "Protocolo de urgencias"}]'::jsonb, '{"reason": "Evaluación", "problem": "Protocolo de urgencias", "confianza": 0.9}'::jsonb, 1.0, 560);
  
    INSERT INTO assessment_questions 
    (category_id, code, text, format, options, help_context, provisional_weight, order_index)
    VALUES 
    (v_cat_age_id, 'AGE-11', '¿Cuánto tiempo de antelación media tiene una cita nueva?', 'SINGLE_CHOICE', '[{"id": "A", "label": "Sí", "score": 10, "mapea_a": "ABVL-13"}, {"id": "B", "label": "No", "score": 0, "mapea_a": "ABVL-13"}]'::jsonb, '{"reason": "Evaluación", "problem": "ABVL-13", "confianza": 0.9}'::jsonb, 1.0, 570);
  
    INSERT INTO assessment_questions 
    (category_id, code, text, format, options, help_context, provisional_weight, order_index)
    VALUES 
    (v_cat_age_id, 'AGE-12', '¿Se agendan automáticamente citas de seguimiento tras el alta de un tratamiento?', 'SINGLE_CHOICE', '[{"id": "A", "label": "Sí", "score": 10, "mapea_a": "ABVL-02"}, {"id": "B", "label": "No", "score": 0, "mapea_a": "ABVL-02"}]'::jsonb, '{"reason": "Evaluación", "problem": "ABVL-02", "confianza": 0.9}'::jsonb, 1.0, 580);
  
    INSERT INTO assessment_questions 
    (category_id, code, text, format, options, help_context, provisional_weight, order_index)
    VALUES 
    (v_cat_rec_id, 'REC-01', '¿Cuántas llamadas recibe la clínica en un día típico?', 'SINGLE_CHOICE', '[{"id": "A", "label": "Sí", "score": 10, "mapea_a": "ABVL-04"}, {"id": "B", "label": "No", "score": 0, "mapea_a": "ABVL-04"}]'::jsonb, '{"reason": "Evaluación", "problem": "ABVL-04", "confianza": 0.9}'::jsonb, 1.0, 590);
  
    INSERT INTO assessment_questions 
    (category_id, code, text, format, options, help_context, provisional_weight, order_index)
    VALUES 
    (v_cat_rec_id, 'REC-02', '¿Se pierden llamadas en horas punta?', 'SINGLE_CHOICE', '[{"id": "A", "label": "Sí", "score": 10, "mapea_a": "ABVL-04"}, {"id": "B", "label": "No", "score": 0, "mapea_a": "ABVL-04"}]'::jsonb, '{"reason": "Evaluación", "problem": "ABVL-04", "confianza": 0.9}'::jsonb, 1.0, 600);
  
    INSERT INTO assessment_questions 
    (category_id, code, text, format, options, help_context, provisional_weight, order_index)
    VALUES 
    (v_cat_rec_id, 'REC-03', '¿Existe atención fuera del horario de apertura?', 'SINGLE_CHOICE', '[{"id": "A", "label": "Sí", "score": 10, "mapea_a": "ABVL-04"}, {"id": "B", "label": "No", "score": 0, "mapea_a": "ABVL-04"}]'::jsonb, '{"reason": "Evaluación", "problem": "ABVL-04", "confianza": 0.9}'::jsonb, 1.0, 610);
  
    INSERT INTO assessment_questions 
    (category_id, code, text, format, options, help_context, provisional_weight, order_index)
    VALUES 
    (v_cat_rec_id, 'REC-04', '¿Por qué canales pueden contactar los pacientes?', 'MULTIPLE_CHOICE', '[{"id": "A", "label": "Opción 1", "score": 10, "mapea_a": "Integration Hub"}, {"id": "B", "label": "Opción 2", "score": 0, "mapea_a": "Integration Hub"}]'::jsonb, '{"reason": "Evaluación", "problem": "Integration Hub", "confianza": 0.9}'::jsonb, 1.0, 620);
  
    INSERT INTO assessment_questions 
    (category_id, code, text, format, options, help_context, provisional_weight, order_index)
    VALUES 
    (v_cat_rec_id, 'REC-05', '¿Existe un guion o criterio compartido entre quienes atienden?', 'SINGLE_CHOICE', '[{"id": "A", "label": "Sí", "score": 10, "mapea_a": "ABVL-18"}, {"id": "B", "label": "No", "score": 0, "mapea_a": "ABVL-18"}]'::jsonb, '{"reason": "Evaluación", "problem": "ABVL-18", "confianza": 0.9}'::jsonb, 1.0, 630);
  
    INSERT INTO assessment_questions 
    (category_id, code, text, format, options, help_context, provisional_weight, order_index)
    VALUES 
    (v_cat_rec_id, 'REC-06', '¿Cómo se gestionan las urgencias telefónicas?', 'SINGLE_CHOICE', '[{"id": "A", "label": "Sí", "score": 10, "mapea_a": "Protocolo de urgencias"}, {"id": "B", "label": "No", "score": 0, "mapea_a": "Protocolo de urgencias"}]'::jsonb, '{"reason": "Evaluación", "problem": "Protocolo de urgencias", "confianza": 0.9}'::jsonb, 1.0, 640);
  
    INSERT INTO assessment_questions 
    (category_id, code, text, format, options, help_context, provisional_weight, order_index)
    VALUES 
    (v_cat_rec_id, 'REC-07', '¿Se registra el origen de cada nuevo contacto?', 'SINGLE_CHOICE', '[{"id": "A", "label": "Sí", "score": 10, "mapea_a": "ABVL-08"}, {"id": "B", "label": "No", "score": 0, "mapea_a": "ABVL-08"}]'::jsonb, '{"reason": "Evaluación", "problem": "ABVL-08", "confianza": 0.9}'::jsonb, 1.0, 650);
  
    INSERT INTO assessment_questions 
    (category_id, code, text, format, options, help_context, provisional_weight, order_index)
    VALUES 
    (v_cat_rec_id, 'REC-08', '¿Cuánto tiempo tarda de media en resolverse una duda frecuente?', 'SINGLE_CHOICE', '[{"id": "A", "label": "Sí", "score": 10, "mapea_a": "ABVL-13"}, {"id": "B", "label": "No", "score": 0, "mapea_a": "ABVL-13"}]'::jsonb, '{"reason": "Evaluación", "problem": "ABVL-13", "confianza": 0.9}'::jsonb, 1.0, 660);
  
    INSERT INTO assessment_questions 
    (category_id, code, text, format, options, help_context, provisional_weight, order_index)
    VALUES 
    (v_cat_rec_id, 'REC-09', '¿Existen preguntas frecuentes documentadas?', 'SINGLE_CHOICE', '[{"id": "A", "label": "Sí", "score": 10, "mapea_a": "Company Brain readiness"}, {"id": "B", "label": "No", "score": 0, "mapea_a": "Company Brain readiness"}]'::jsonb, '{"reason": "Evaluación", "problem": "Company Brain readiness", "confianza": 0.9}'::jsonb, 1.0, 670);
  
    INSERT INTO assessment_questions 
    (category_id, code, text, format, options, help_context, provisional_weight, order_index)
    VALUES 
    (v_cat_rec_id, 'REC-10', '¿Cómo describiría la carga de trabajo de recepción en horas punta?', 'SINGLE_CHOICE', '[{"id": "A", "label": "Sí", "score": 10, "mapea_a": "Health Score"}, {"id": "B", "label": "No", "score": 0, "mapea_a": "Health Score"}]'::jsonb, '{"reason": "Evaluación", "problem": "Health Score", "confianza": 0.9}'::jsonb, 1.0, 680);
  
    INSERT INTO assessment_questions 
    (category_id, code, text, format, options, help_context, provisional_weight, order_index)
    VALUES 
    (v_cat_mkt_id, 'MKT-01', '¿Qué canales de captación usa la clínica?', 'MULTIPLE_CHOICE', '[{"id": "A", "label": "Opción 1", "score": 10, "mapea_a": "ABVL-08"}, {"id": "B", "label": "Opción 2", "score": 0, "mapea_a": "ABVL-08"}]'::jsonb, '{"reason": "Evaluación", "problem": "ABVL-08", "confianza": 0.9}'::jsonb, 1.0, 690);
  
    INSERT INTO assessment_questions 
    (category_id, code, text, format, options, help_context, provisional_weight, order_index)
    VALUES 
    (v_cat_mkt_id, 'MKT-02', '¿Existe presencia activa en Google Business Profile?', 'SINGLE_CHOICE', '[{"id": "A", "label": "Sí", "score": 10, "mapea_a": "ABVL-09"}, {"id": "B", "label": "No", "score": 0, "mapea_a": "ABVL-09"}]'::jsonb, '{"reason": "Evaluación", "problem": "ABVL-09", "confianza": 0.9}'::jsonb, 1.0, 700);
  
    INSERT INTO assessment_questions 
    (category_id, code, text, format, options, help_context, provisional_weight, order_index)
    VALUES 
    (v_cat_mkt_id, 'MKT-03', '¿Se ejecutan campañas de pago (Google Ads, Meta)?', 'SINGLE_CHOICE', '[{"id": "A", "label": "Sí", "score": 10, "mapea_a": "ABVL-22"}, {"id": "B", "label": "No", "score": 0, "mapea_a": "ABVL-22"}]'::jsonb, '{"reason": "Evaluación", "problem": "ABVL-22", "confianza": 0.9}'::jsonb, 1.0, 710);
  
    INSERT INTO assessment_questions 
    (category_id, code, text, format, options, help_context, provisional_weight, order_index)
    VALUES 
    (v_cat_mkt_id, 'MKT-04', '¿Se mide la conversión real de cada canal de marketing?', 'SINGLE_CHOICE', '[{"id": "A", "label": "Sí", "score": 10, "mapea_a": "ABVL-08, ABVL-22"}, {"id": "B", "label": "No", "score": 0, "mapea_a": "ABVL-08, ABVL-22"}]'::jsonb, '{"reason": "Evaluación", "problem": "ABVL-08, ABVL-22", "confianza": 0.9}'::jsonb, 1.0, 720);
  
    INSERT INTO assessment_questions 
    (category_id, code, text, format, options, help_context, provisional_weight, order_index)
    VALUES 
    (v_cat_mkt_id, 'MKT-05', '¿Qué proporción de pacientes nuevos llega por referido?', 'SINGLE_CHOICE', '[{"id": "A", "label": "Sí", "score": 10, "mapea_a": "ABVL-11"}, {"id": "B", "label": "No", "score": 0, "mapea_a": "ABVL-11"}]'::jsonb, '{"reason": "Evaluación", "problem": "ABVL-11", "confianza": 0.9}'::jsonb, 1.0, 730);
  
    INSERT INTO assessment_questions 
    (category_id, code, text, format, options, help_context, provisional_weight, order_index)
    VALUES 
    (v_cat_mkt_id, 'MKT-06', '¿Existe relación sistemática con clínicas remitentes?', 'SINGLE_CHOICE', '[{"id": "A", "label": "Sí", "score": 10, "mapea_a": "Modelo de clínica especializada"}, {"id": "B", "label": "No", "score": 0, "mapea_a": "Modelo de clínica especializada"}]'::jsonb, '{"reason": "Evaluación", "problem": "Modelo de clínica especializada", "confianza": 0.9}'::jsonb, 1.0, 740);
  
    INSERT INTO assessment_questions 
    (category_id, code, text, format, options, help_context, provisional_weight, order_index)
    VALUES 
    (v_cat_mkt_id, 'MKT-07', '¿Cuál es la puntuación media de reseñas actual?', 'SINGLE_CHOICE', '[{"id": "A", "label": "Sí", "score": 10, "mapea_a": "Health Score"}, {"id": "B", "label": "No", "score": 0, "mapea_a": "Health Score"}]'::jsonb, '{"reason": "Evaluación", "problem": "Health Score", "confianza": 0.9}'::jsonb, 1.0, 750);
  
    INSERT INTO assessment_questions 
    (category_id, code, text, format, options, help_context, provisional_weight, order_index)
    VALUES 
    (v_cat_mkt_id, 'MKT-08', '¿Existe un protocolo de respuesta a reseñas negativas?', 'SINGLE_CHOICE', '[{"id": "A", "label": "Sí", "score": 10, "mapea_a": "ABVL-09"}, {"id": "B", "label": "No", "score": 0, "mapea_a": "ABVL-09"}]'::jsonb, '{"reason": "Evaluación", "problem": "ABVL-09", "confianza": 0.9}'::jsonb, 1.0, 760);
  
    INSERT INTO assessment_questions 
    (category_id, code, text, format, options, help_context, provisional_weight, order_index)
    VALUES 
    (v_cat_mkt_id, 'MKT-09', '¿Se realizan campañas de reactivación de pacientes inactivos?', 'SINGLE_CHOICE', '[{"id": "A", "label": "Sí", "score": 10, "mapea_a": "ABVL-06"}, {"id": "B", "label": "No", "score": 0, "mapea_a": "ABVL-06"}]'::jsonb, '{"reason": "Evaluación", "problem": "ABVL-06", "confianza": 0.9}'::jsonb, 1.0, 770);
  
    INSERT INTO assessment_questions 
    (category_id, code, text, format, options, help_context, provisional_weight, order_index)
    VALUES 
    (v_cat_mkt_id, 'MKT-10', '¿Existe un presupuesto de marketing definido y gestionado activamente?', 'SINGLE_CHOICE', '[{"id": "A", "label": "Sí", "score": 10, "mapea_a": "ABVL-22"}, {"id": "B", "label": "No", "score": 0, "mapea_a": "ABVL-22"}]'::jsonb, '{"reason": "Evaluación", "problem": "ABVL-22", "confianza": 0.9}'::jsonb, 1.0, 780);
  
    INSERT INTO assessment_questions 
    (category_id, code, text, format, options, help_context, provisional_weight, order_index)
    VALUES 
    (v_cat_fin_id, 'FIN-01', '¿Qué opciones de financiación ofrece la clínica?', 'MULTIPLE_CHOICE', '[{"id": "A", "label": "Opción 1", "score": 10, "mapea_a": "Integration Hub, ABVL-07"}, {"id": "B", "label": "Opción 2", "score": 0, "mapea_a": "Integration Hub, ABVL-07"}]'::jsonb, '{"reason": "Evaluación", "problem": "Integration Hub, ABVL-07", "confianza": 0.9}'::jsonb, 1.0, 790);
  
    INSERT INTO assessment_questions 
    (category_id, code, text, format, options, help_context, provisional_weight, order_index)
    VALUES 
    (v_cat_fin_id, 'FIN-02', '¿Trabaja con alguna entidad de financiación externa?', 'SINGLE_CHOICE', '[{"id": "A", "label": "Sí", "score": 10, "mapea_a": "Integration Hub"}, {"id": "B", "label": "No", "score": 0, "mapea_a": "Integration Hub"}]'::jsonb, '{"reason": "Evaluación", "problem": "Integration Hub", "confianza": 0.9}'::jsonb, 1.0, 800);
  
    INSERT INTO assessment_questions 
    (category_id, code, text, format, options, help_context, provisional_weight, order_index)
    VALUES 
    (v_cat_fin_id, 'FIN-03', '¿Existe seguimiento de impagos o cuotas vencidas?', 'SINGLE_CHOICE', '[{"id": "A", "label": "Sí", "score": 10, "mapea_a": "ABVL-17"}, {"id": "B", "label": "No", "score": 0, "mapea_a": "ABVL-17"}]'::jsonb, '{"reason": "Evaluación", "problem": "ABVL-17", "confianza": 0.9}'::jsonb, 1.0, 810);
  
    INSERT INTO assessment_questions 
    (category_id, code, text, format, options, help_context, provisional_weight, order_index)
    VALUES 
    (v_cat_fin_id, 'FIN-04', '¿Cuál es el ticket medio aproximado de tratamiento?', 'SINGLE_CHOICE', '[{"id": "A", "label": "Sí", "score": 10, "mapea_a": "ROI estimado"}, {"id": "B", "label": "No", "score": 0, "mapea_a": "ROI estimado"}]'::jsonb, '{"reason": "Evaluación", "problem": "ROI estimado", "confianza": 0.9}'::jsonb, 1.0, 820);
  
    INSERT INTO assessment_questions 
    (category_id, code, text, format, options, help_context, provisional_weight, order_index)
    VALUES 
    (v_cat_fin_id, 'FIN-05', '¿Cuál es la facturación aproximada mensual?', 'SINGLE_CHOICE', '[{"id": "A", "label": "Sí", "score": 10, "mapea_a": "Priorización, tamaño"}, {"id": "B", "label": "No", "score": 0, "mapea_a": "Priorización, tamaño"}]'::jsonb, '{"reason": "Evaluación", "problem": "Priorización, tamaño", "confianza": 0.9}'::jsonb, 1.0, 830);
  
    INSERT INTO assessment_questions 
    (category_id, code, text, format, options, help_context, provisional_weight, order_index)
    VALUES 
    (v_cat_fin_id, 'FIN-06', '¿Se consolidan presupuestos que abarcan varias especialidades?', 'SINGLE_CHOICE', '[{"id": "A", "label": "Sí", "score": 10, "mapea_a": "ABVL-12"}, {"id": "B", "label": "No", "score": 0, "mapea_a": "ABVL-12"}]'::jsonb, '{"reason": "Evaluación", "problem": "ABVL-12", "confianza": 0.9}'::jsonb, 1.0, 840);
  
    INSERT INTO assessment_questions 
    (category_id, code, text, format, options, help_context, provisional_weight, order_index)
    VALUES 
    (v_cat_fin_id, 'FIN-07', '¿Existen fases de pago predefinidas para tratamientos largos?', 'SINGLE_CHOICE', '[{"id": "A", "label": "Sí", "score": 10, "mapea_a": "ABVL-01"}, {"id": "B", "label": "No", "score": 0, "mapea_a": "ABVL-01"}]'::jsonb, '{"reason": "Evaluación", "problem": "ABVL-01", "confianza": 0.9}'::jsonb, 1.0, 850);
  
    INSERT INTO assessment_questions 
    (category_id, code, text, format, options, help_context, provisional_weight, order_index)
    VALUES 
    (v_cat_fin_id, 'FIN-08', '¿Se hace seguimiento del tiempo entre presupuesto aceptado e inicio de tratamiento?', 'SINGLE_CHOICE', '[{"id": "A", "label": "Sí", "score": 10, "mapea_a": "ABVL-01"}, {"id": "B", "label": "No", "score": 0, "mapea_a": "ABVL-01"}]'::jsonb, '{"reason": "Evaluación", "problem": "ABVL-01", "confianza": 0.9}'::jsonb, 1.0, 860);
  
    INSERT INTO assessment_questions 
    (category_id, code, text, format, options, help_context, provisional_weight, order_index)
    VALUES 
    (v_cat_fin_id, 'FIN-09', '¿Quién aprueba condiciones económicas especiales?', 'SINGLE_CHOICE', '[{"id": "A", "label": "Sí", "score": 10, "mapea_a": "Business DNA Readiness"}, {"id": "B", "label": "No", "score": 0, "mapea_a": "Business DNA Readiness"}]'::jsonb, '{"reason": "Evaluación", "problem": "Business DNA Readiness", "confianza": 0.9}'::jsonb, 1.0, 870);
  
    INSERT INTO assessment_questions 
    (category_id, code, text, format, options, help_context, provisional_weight, order_index)
    VALUES 
    (v_cat_fin_id, 'FIN-10', '¿Existe un sistema de facturación digital?', 'SINGLE_CHOICE', '[{"id": "A", "label": "Sí", "score": 10, "mapea_a": "Digital Readiness"}, {"id": "B", "label": "No", "score": 0, "mapea_a": "Digital Readiness"}]'::jsonb, '{"reason": "Evaluación", "problem": "Digital Readiness", "confianza": 0.9}'::jsonb, 1.0, 880);
  
    INSERT INTO assessment_questions 
    (category_id, code, text, format, options, help_context, provisional_weight, order_index)
    VALUES 
    (v_cat_fin_id, 'FIN-11', '¿Se revisa periódicamente el tarifario de la clínica?', 'SINGLE_CHOICE', '[{"id": "A", "label": "Sí", "score": 10, "mapea_a": "Company Brain readiness"}, {"id": "B", "label": "No", "score": 0, "mapea_a": "Company Brain readiness"}]'::jsonb, '{"reason": "Evaluación", "problem": "Company Brain readiness", "confianza": 0.9}'::jsonb, 1.0, 890);
  
    INSERT INTO assessment_questions 
    (category_id, code, text, format, options, help_context, provisional_weight, order_index)
    VALUES 
    (v_cat_ope_id, 'OPE-01', '¿Qué sistema de gestión clínica (PMS) utiliza la clínica?', 'SINGLE_CHOICE', '[{"id": "A", "label": "Sí", "score": 10, "mapea_a": "**Integration Hub — pregunta más determinante de toda la biblioteca**"}, {"id": "B", "label": "No", "score": 0, "mapea_a": "**Integration Hub — pregunta más determinante de toda la biblioteca**"}]'::jsonb, '{"reason": "Evaluación", "problem": "**Integration Hub — pregunta más determinante de toda la biblioteca**", "confianza": 0.9}'::jsonb, 1.0, 900);
  
    INSERT INTO assessment_questions 
    (category_id, code, text, format, options, help_context, provisional_weight, order_index)
    VALUES 
    (v_cat_ope_id, 'OPE-02', '¿El PMS ofrece API o exportación de datos?', 'SINGLE_CHOICE', '[{"id": "A", "label": "Sí", "score": 10, "mapea_a": "Integration Hub, viabilidad de implantación"}, {"id": "B", "label": "No", "score": 0, "mapea_a": "Integration Hub, viabilidad de implantación"}]'::jsonb, '{"reason": "Evaluación", "problem": "Integration Hub, viabilidad de implantación", "confianza": 0.9}'::jsonb, 1.0, 910);
  
    INSERT INTO assessment_questions 
    (category_id, code, text, format, options, help_context, provisional_weight, order_index)
    VALUES 
    (v_cat_ope_id, 'OPE-03', '¿Cómo se gestiona el pedido de materiales recurrentes?', 'SINGLE_CHOICE', '[{"id": "A", "label": "Sí", "score": 10, "mapea_a": "ABVL-23"}, {"id": "B", "label": "No", "score": 0, "mapea_a": "ABVL-23"}]'::jsonb, '{"reason": "Evaluación", "problem": "ABVL-23", "confianza": 0.9}'::jsonb, 1.0, 920);
  
    INSERT INTO assessment_questions 
    (category_id, code, text, format, options, help_context, provisional_weight, order_index)
    VALUES 
    (v_cat_ope_id, 'OPE-04', '¿Se ha sufrido rotura de stock que canceló un tratamiento?', 'SINGLE_CHOICE', '[{"id": "A", "label": "Sí", "score": 10, "mapea_a": "ABVL-23"}, {"id": "B", "label": "No", "score": 0, "mapea_a": "ABVL-23"}]'::jsonb, '{"reason": "Evaluación", "problem": "ABVL-23", "confianza": 0.9}'::jsonb, 1.0, 930);
  
    INSERT INTO assessment_questions 
    (category_id, code, text, format, options, help_context, provisional_weight, order_index)
    VALUES 
    (v_cat_ope_id, 'OPE-05', '¿Cómo se coordina la comunicación interna entre profesionales?', 'SINGLE_CHOICE', '[{"id": "A", "label": "Sí", "score": 10, "mapea_a": "ABVL-19"}, {"id": "B", "label": "No", "score": 0, "mapea_a": "ABVL-19"}]'::jsonb, '{"reason": "Evaluación", "problem": "ABVL-19", "confianza": 0.9}'::jsonb, 1.0, 940);
  
    INSERT INTO assessment_questions 
    (category_id, code, text, format, options, help_context, provisional_weight, order_index)
    VALUES 
    (v_cat_ope_id, 'OPE-06', '¿Existe un proceso documentado de gestión de incidencias?', 'SINGLE_CHOICE', '[{"id": "A", "label": "Sí", "score": 10, "mapea_a": "Health Score"}, {"id": "B", "label": "No", "score": 0, "mapea_a": "Health Score"}]'::jsonb, '{"reason": "Evaluación", "problem": "Health Score", "confianza": 0.9}'::jsonb, 1.0, 950);
  
    INSERT INTO assessment_questions 
    (category_id, code, text, format, options, help_context, provisional_weight, order_index)
    VALUES 
    (v_cat_ope_id, 'OPE-07', '¿Se realiza algún tipo de auditoría o control de calidad interno?', 'SINGLE_CHOICE', '[{"id": "A", "label": "Sí", "score": 10, "mapea_a": "Atlas Maturity Assessment"}, {"id": "B", "label": "No", "score": 0, "mapea_a": "Atlas Maturity Assessment"}]'::jsonb, '{"reason": "Evaluación", "problem": "Atlas Maturity Assessment", "confianza": 0.9}'::jsonb, 1.0, 960);
  
    INSERT INTO assessment_questions 
    (category_id, code, text, format, options, help_context, provisional_weight, order_index)
    VALUES 
    (v_cat_ope_id, 'OPE-08', '¿La clínica participa en algún grupo o red de intercambio de buenas prácticas?', 'SINGLE_CHOICE', '[{"id": "A", "label": "Sí", "score": 10, "mapea_a": "Preparación para Atlas Intelligence Network"}, {"id": "B", "label": "No", "score": 0, "mapea_a": "Preparación para Atlas Intelligence Network"}]'::jsonb, '{"reason": "Evaluación", "problem": "Preparación para Atlas Intelligence Network", "confianza": 0.9}'::jsonb, 1.0, 970);
  
    INSERT INTO assessment_questions 
    (category_id, code, text, format, options, help_context, provisional_weight, order_index)
    VALUES 
    (v_cat_ope_id, 'OPE-09', '¿Qué documentación de consentimiento informado se utiliza?', 'SINGLE_CHOICE', '[{"id": "A", "label": "Sí", "score": 10, "mapea_a": "Company Brain readiness, cumplimiento"}, {"id": "B", "label": "No", "score": 0, "mapea_a": "Company Brain readiness, cumplimiento"}]'::jsonb, '{"reason": "Evaluación", "problem": "Company Brain readiness, cumplimiento", "confianza": 0.9}'::jsonb, 1.0, 980);
  
    INSERT INTO assessment_questions 
    (category_id, code, text, format, options, help_context, provisional_weight, order_index)
    VALUES 
    (v_cat_ope_id, 'OPE-10', '¿Existe un plan de mantenimiento preventivo del equipamiento clínico?', 'SINGLE_CHOICE', '[{"id": "A", "label": "Sí", "score": 10, "mapea_a": "Health Score"}, {"id": "B", "label": "No", "score": 0, "mapea_a": "Health Score"}]'::jsonb, '{"reason": "Evaluación", "problem": "Health Score", "confianza": 0.9}'::jsonb, 1.0, 990);
  

  
END $$;
