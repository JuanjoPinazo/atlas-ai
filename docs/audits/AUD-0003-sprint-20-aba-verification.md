# AUD-0003 — Auditoría de Verificación: Sprint 20 (Atlas Business Assessment)

| | |
|---|---|
| **Tipo** | Auditoría técnica independiente — no es un ADR |
| **Fecha** | 2026-07-11 |
| **Auditor** | Principal Product & Software Auditor de ATLAS AI |
| **Base** | [ADR-0016](../adr/0016-atlas-business-assessment-framework.md) · [ADR-0011](../adr/0011-atlas-discovery-assessment-framework.md) · [ADR-0015](../adr/0015-atlas-integration-hub.md) |
| **Metodología** | Lectura directa de código fuente y migraciones reales, ejecución real de `npm run test` y `npm run build`. Ninguna afirmación proviene de `walkthrough.md` ni de descripciones de GA. |
| **Nota metodológica** | Durante esta auditoría se detectó que el repositorio estaba siendo modificado activamente (marcas de tiempo de archivo entre las 20:02 y las 20:07, mientras la auditoría ya estaba en curso). Un primer intento de `npm run build` falló con un error real de TypeScript, capturado en ese estado transitorio (`AssessmentEngine.getRecommendationsDetails` no existía tras una reescritura parcial). Tras confirmar que no había más cambios de archivo, se repitió la verificación completa. Todos los hallazgos de este informe corresponden al **estado final verificado**, no al estado transitorio. |

---

## Hallazgo crítico — léase antes que cualquier otro punto

**La migración `00014_business_assessment.sql` redefine `get_current_organization_id()` para devolver siempre la constante fija `00000000-0000-0000-0000-000000000000`, sobrescribiendo la implementación correcta que Sprint 18.3 ya había corregido en `00012_strict_rls_and_idempotency.sql` (verificada en [AUD-0002](AUD-0002-sprint-18-3-final-verification.md), punto 8).**

Evidencia exacta — `supabase/migrations/00014_business_assessment.sql:6-10`:

```sql
CREATE OR REPLACE FUNCTION get_current_organization_id() RETURNS UUID AS $$
BEGIN
  RETURN '00000000-0000-0000-0000-000000000000'::uuid;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
```

Las migraciones se ejecutan en orden secuencial. `00014` se aplica **después** de `00012`, y `CREATE OR REPLACE FUNCTION` sustituye la función existente sin aviso. El resultado: a partir de esta migración, **ninguna tabla de toda la plataforma que dependa de `get_current_organization_id()` para su política RLS aísla tenants realmente** — no solo las tablas nuevas de Assessment, sino `platform_events`, `roi_events`, `dental_patients_reference`, `dental_budgets`, `dental_budget_status_history`, `opportunity_candidates` y `dental_budget_follow_up_attempts`, todas ellas ya auditadas y dadas por corregidas en AUD-0002.

Esto no es un hallazgo de Assessment — es una **regresión de seguridad de plataforma completa**, introducida como efecto secundario de Sprint 20. Se marca como bloqueante por encima de cualquier otro resultado de este informe.

---

## Hallazgos por punto de verificación

### 1. ¿Las 99 preguntas existen realmente en el sistema?

**PARCIAL.**

- La cantidad existe: `supabase/migrations/00016_seed_aba_dental_01.sql:35-67` genera exactamente 99 filas en `assessment_questions` mediante un bucle `FOR i IN 1..99 LOOP`.
- El contenido no existe: cada pregunta se genera con `q_text := 'Pregunta de evaluación ' || i || ' sobre procedimientos de la clínica.'` (línea 37) — texto genérico y numerado, no ninguna de las 99 preguntas reales y específicas diseñadas en [ADR-0016 §17](../adr/0016-atlas-business-assessment-framework.md) (`PAC-01`, `OPE-01`, etc.). Ninguna pregunta del catálogo real de ADR-0016 aparece en el sistema.

### 2. ¿Están versionadas o hardcodeadas en componentes?

**CUMPLIDO — mejora real respecto al estado anterior.**

- El banco de preguntas hardcodeado en un componente TypeScript (`src/lib/assessment/verticals/dental-assessment.ts`, 4 preguntas, verificado en una fase temprana de esta misma auditoría) **ha sido eliminado** — ya no existe en el sistema de archivos.
- En su lugar, existe un sistema real de plantillas versionadas: `assessment_templates` + `assessment_template_versions` (`00015_assessment_operational.sql`), con la primera versión sembrada como `'1.0.0'` / `status: 'PUBLISHED'` (`00016_seed_aba_dental_01.sql:24-26`).

### 3. ¿La ramificación es realmente adaptativa?

**PARCIAL — el motor es real, el contenido no está poblado.**

- `AssessmentEngine.evaluateBranching()` (`src/lib/assessment/AssessmentEngine.ts:11-39`) es un motor de reglas genuino: procesa `AssessmentBranchRule[]` con acciones `SHOW_QUESTION`/`HIDE_QUESTION`, verificado por una prueba unitaria real que pasa (`src/lib/assessment/tests/assessment.test.ts:23-34`).
- Pero de 99 preguntas sembradas, existe **una única regla de ramificación** en todo el sistema (`00016_seed_aba_dental_01.sql:70-74`), explícitamente etiquetada en el propio SQL como `-- Insert one Branch Rule for Demo`. El árbol adaptativo, en la práctica, no ramifica nada salvo ese caso de demostración.

### 4. ¿Cada pregunta contiene categoría, formato, `profundiza_si`, `mapea_a`, ayuda contextual?

**PARCIAL — presentes estructuralmente, genéricas en sustancia.**

- Los cinco campos existen como columnas/claves reales: `category_id`, `format` (`'SINGLE_CHOICE'`), `options[].profundiza_si`, `options[].mapea_a`, `help_context` (con `reason`, `problem`, `economic_impact`) — esquema en `src/lib/schemas/assessment.ts:13-30`, poblado en `00016_seed_aba_dental_01.sql:39-62`.
- Pero el valor de estos campos es **idéntico y repetido en las 99 filas** — las mismas tres opciones ("Nivel Básico (Manual)" / "Nivel Medio (Parcial)" / "Nivel Avanzado (Automático)"), el mismo `mapea_a` (`rec_bot_basic`, `rec_bot_inter`, `none`), el mismo `help_context` genérico ("Evaluación sistemática del área.") para cualquiera de las 99 preguntas, sin diferenciación real por pregunta.
- Categorías usadas: `OPERATIONS`, `FINANCE`, `PATIENT_EXPERIENCE`, `MARKETING` (4) — no las 9 categorías operativas que ADR-0016 §2 exige reutilizar de la Atlas Dental Knowledge Library (Empresa, Personas, Paciente, Servicios, Agenda, Recepción, Marketing, Finanzas, Operaciones).

### 5. ¿Las puntuaciones se calculan mediante reglas declarativas o valores simulados?

**PARCIAL — dos de seis índices son reales, cuatro son constantes.**

- `Maturity` y `Opportunity` se calculan genuinamente a partir de las respuestas reales (`src/lib/assessment/AssessmentEngine.ts:41-96`), verificado por prueba unitaria con matemática exacta esperada (75% / 25%, `assessment.test.ts:36-52`).
- `Health` (línea 92), `Digital Readiness` (línea 101), `Business DNA` (línea 110) y `Employee Readiness` (línea 119) están hardcodeados con valores fijos (`90`, `65`, `80`, `50` respectivamente), cada uno con el comentario explícito `// Mocked for now` en el propio código fuente.

### 6. ¿Cada oportunidad puede trazarse hasta preguntas y respuestas concretas?

**INCUMPLIDO.**

Evidencia: `src/app/actions/assessment.ts`, función `finishAssessment`, llamada a `ReportGenerator.generateReport(sessionRes.data, scores, recommendations, [] // opportunities mock)`. El array de oportunidades se pasa **siempre vacío**, con el comentario explícito `// opportunities mock` en el propio código. No se genera ninguna oportunidad real en ningún punto del flujo — no hay nada que trazar.

### 7. ¿Las recomendaciones de empleados, conectores, packs y BVO proceden de catálogos reales?

**INCUMPLIDO.**

Evidencia: `src/lib/assessment/AssessmentEngine.ts:127-157`, función `generateRecommendations` — comentario explícito en el propio código: *"Simplified logic. Real implementation would look up the target in catalogs."* La función construye un título genérico (`Recomendación: ${opt.mapea_a}`) sin consultar ni validar contra el catálogo real de [Atlas Employee Designer](../adr/0009-atlas-employee-designer.md), la [Atlas Business Value Library](../abvl/00_Master_Index.md), el catálogo de conectores de [ADR-0015](../adr/0015-atlas-integration-hub.md), ni ningún registro real de Knowledge Packs. Dado que `mapea_a` es, además, un valor genérico repetido (punto 4), no hay ninguna referencia real que buscar aunque existiera esa lógica.

### 8. ¿`OPE-01` contrasta realmente el PMS declarado con Integration Hub?

**INCUMPLIDO.**

No existe ninguna pregunta equivalente a `OPE-01` ("¿qué sistema de gestión clínica utiliza la clínica?") en los datos reales sembrados — las 99 preguntas son genéricas (punto 1). Búsqueda exhaustiva de referencias cruzadas a `IntegrationHub`/`ConnectorFactory`/nombres de PMS en todo el código de Assessment: cero resultados relevantes.

### 9. ¿Existe persistencia en Supabase?

**CUMPLIDO.**

Persistencia relacional real y comprehensiva verificada en `src/lib/repositories/assessment/supabase-assessment.repository.ts` — 11 tablas (`assessment_templates`, `assessment_template_versions`, `assessment_categories`, `assessment_questions`, `assessment_branch_rules`, `assessment_sessions`, `assessment_answers`, `assessment_scores`, `assessment_recommendations`, `assessment_opportunities`, `assessment_reports`), consultadas y escritas mediante el cliente Supabase canónico (`@/lib/supabase/server`), no una tabla de blob JSON genérica.

### 10. ¿Puede guardarse y reanudarse una evaluación?

**CUMPLIDO.**

`createSession` → `saveAnswer` (upsert por `session_id, question_id`) → `getSessionAnswers` → `getLatestSession` (`supabase-assessment.repository.ts:52-104`) forman un flujo de guardado y reanudación genuino y funcional a nivel de base de datos.

### 11. ¿Existe aislamiento multi-tenant mediante RLS?

**INCUMPLIDO — ver Hallazgo crítico al inicio de este informe.**

Las políticas RLS de las tablas de Assessment (`00015_assessment_operational.sql:155-172`) están correctamente escritas (`organization_id = get_current_organization_id()`, directa o vía `EXISTS` a la sesión padre). El problema no está en las políticas — está en que la función de la que todas dependen fue sobrescrita para devolver siempre el mismo valor fijo (`00014_business_assessment.sql:6-10`), neutralizando el aislamiento en la práctica para toda la plataforma, no solo para Assessment.

### 12. ¿El informe distingue hechos declarados, hipótesis, estimaciones y benchmarks?

**PARCIAL — la estructura es correcta, el contenido es de ejemplo.**

- `AssessmentReport.labeled_data: { declared, hypothesis, projection, benchmark }` (`src/lib/schemas/assessment.ts:95-100`) es, en sí misma, una arquitectura de tipos correcta y alineada con la disciplina de trazabilidad exigida en toda la plataforma.
- Pero `ReportGenerator.generateReport()` (`src/lib/assessment/ReportGenerator.ts:35-40`) rellena las cuatro categorías con **arrays de texto fijos y hardcodeados** (p. ej. `hypothesis: ['Atribución de marketing deficiente causa un 20% de pérdida de ROI']`), ignorando por completo los parámetros reales `scores`, `recommendations` y `opportunities` que la función recibe. El contenido no se deriva del assessment real de ningún cliente.

### 13. ¿Existe revisión humana antes de generar o entregar una propuesta?

**PARCIAL — la puerta visual existe, el mecanismo de aprobación no.**

- Evidencia positiva: `src/app/(dashboard)/[tenantId]/assessment/results/[assessmentId]/page.tsx:147-162` — un panel "Revisión Humana Obligatoria" se muestra condicionalmente si `!report.is_reviewed`, con el texto explícito *"Antes de presentar el Assessment al Prospecto o transferirlo al área de Discovery, debe ser revisado y aprobado"* y un botón que invoca `approveAndTransferAssessment`.
- Evidencia del incumplimiento: `src/app/actions/assessment.ts`, función `approveAndTransferAssessment` — comentario explícito en el propio código: *"Not fully implemented in this sprint, just the stub as requested."* La función devuelve `{ success: true, message: 'Transfer to Discovery started.' }` sin ninguna llamada a repositorio que actualice `is_reviewed` en la base de datos. `IAssessmentRepository` (`assessment.repository.interface.ts`) ni siquiera expone un método para persistir esa aprobación. El botón, hoy, no hace nada real.

### 14. ¿Los datos de ABA se transfieren realmente a Discovery y onboarding?

**INCUMPLIDO — confirmado por dos evidencias independientes.**

1. El propio comentario de `approveAndTransferAssessment` (punto 13) lo admite directamente.
2. Búsqueda exhaustiva de referencias a `assessment` en `src/app/actions/discovery.ts` y `src/lib/repositories/discovery.ts`: cero resultados. `DiscoveryRepository.simulateDiscoveryResult()` (`src/lib/repositories/discovery.ts`) genera un resultado **completamente hardcodeado e independiente** de cualquier respuesta real — `health_score: 65`, `opportunity_score: 92`, empleados recomendados con nombres ficticios ("Dra. Aida", "Dr. Leo"), packs ficticios ("Atlas Dental Premium"), y oportunidades de negocio con cifras de ROI inventadas y presentadas sin ninguna etiqueta de hipótesis (`roi_estimate: 12000` como si fuera un hecho) — el propio comentario del código lo llama *"Artificial logic... to simulate AI reasoning"*. Discovery y Assessment son, hoy, dos sistemas completamente desconectados.

### 15. ¿`npm run test` y `npm run build` pasan?

**CUMPLIDO, en el estado final verificado.**

- `npm run test`: 4 archivos, 8 pruebas, todas en verde (905ms) — incluye pruebas reales de branching, cálculo de puntuación y estructura del informe.
- `npm run build`: código de salida 0, sin errores de TypeScript, genera correctamente las nuevas rutas (`/[tenantId]/assessment`, `/[tenantId]/assessment/wizard`, `/[tenantId]/assessment/results/[assessmentId]`, `/[tenantId]/integration-hub` y subrutas).
- Ver la Nota metodológica al inicio de este documento sobre el intento fallido intermedio durante la edición en vivo del repositorio.

---

## Tabla de remediación pendiente

| # | Archivo | Riesgo | Corrección requerida | Prioridad |
|---|---|---|---|---|
| 1 | `supabase/migrations/00014_business_assessment.sql:6-10` | `get_current_organization_id()` devuelve una constante fija, anulando el aislamiento RLS de **toda** la plataforma, no solo de Assessment | Eliminar esta redefinición de la migración; la función correcta ya existe en `00012` y no debe volver a declararse aquí | **P0 — bloqueante, afecta a toda la plataforma** |
| 2 | `supabase/migrations/00016_seed_aba_dental_01.sql` | Las 99 preguntas son texto genérico autogenerado, no el contenido real de ADR-0016 §17 | Sustituir el bucle generador por un `INSERT` con las 99 preguntas reales, sus categorías (9, no 4), opciones y `mapea_a` diferenciados por pregunta | **P0** |
| 3 | `src/lib/assessment/AssessmentEngine.ts:92,101,110,119` | 4 de 6 índices de puntuación son constantes hardcodeadas | Implementar el cálculo real de Health, Digital Readiness, Business DNA y Employee Readiness a partir de las respuestas, según ADR-0016 §6 | **P0** |
| 4 | `src/app/actions/assessment.ts`, `finishAssessment` | El array de oportunidades siempre está vacío (`// opportunities mock`) | Implementar la generación real de oportunidades a partir de respuestas con vacío detectado, referenciando IDs reales de ABVL | **P0** |
| 5 | `src/lib/assessment/AssessmentEngine.ts:127-157` | Las recomendaciones no consultan ningún catálogo real | Conectar `generateRecommendations` con los catálogos reales de AED-0001, ABVL, Marketplace e Integration Hub, tal como exige ADR-0016 §7, §13-14 | **P0** |
| 6 | `src/app/actions/assessment.ts`, `approveAndTransferAssessment` | Stub que no persiste la aprobación ni transfiere nada a Discovery | Añadir `updateReportReview` a `IAssessmentRepository`, implementarlo en ambos repositorios, y conectar la transferencia real de datos a Discovery/onboarding | **P0** |
| 7 | `src/lib/assessment/ReportGenerator.ts:35-40` | `labeled_data` contiene texto de ejemplo fijo, no derivado del assessment real | Generar cada categoría (`declared`, `hypothesis`, `projection`, `benchmark`) a partir de los `scores`/`recommendations`/`opportunities` reales recibidos | **P1** |
| 8 | Banco de preguntas | Categorías usadas (4) no coinciden con las 9 exigidas por ADR-0016 §2 | Migrar `assessment_categories` a la taxonomía de 9 categorías de la Atlas Dental Knowledge Library | **P1** |
| 9 | `src/lib/repositories/discovery.ts` | Discovery sigue siendo una simulación completa, desconectada de Assessment y de cualquier dato real | Sustituir `simulateDiscoveryResult` por un flujo real que consuma la salida de Assessment, siguiendo ADR-0011 §3-16 | **P1** |

---

## Conclusión

Sprint 20 construyó, en gran parte, la infraestructura correcta: un esquema relacional versionado que sigue con fidelidad el modelo de datos de ADR-0016, un motor de branching real y probado, un mecanismo de guardado y reanudación funcional, y una interfaz de revisión humana con la advertencia correcta en pantalla. Esto es progreso genuino, no cosmético.

Pero dos cosas lo invalidan como entregable utilizable hoy. Primero, el patrón ya señalado en AUD-0001 y AUD-0002 se repite una vez más: los mecanismos de gobernanza más importantes —persistir una aprobación, generar oportunidades reales, consultar catálogos reales— existen como piezas de interfaz o comentarios de intención, pero no como lógica conectada. Segundo, y de mayor gravedad: una migración de esta misma sprint **rompe silenciosamente** una corrección de seguridad ya validada en la sprint anterior, dejando sin aislamiento real de tenants a toda la plataforma, no solo al módulo auditado. Ningún resultado de este informe es válido como base de un piloto, controlado o no, hasta que el hallazgo crítico se resuelva.
