# AUD-0004 — Auditoría de Consolidación: Sprint 20.2

| | |
|---|---|
| **Tipo** | Auditoría técnica independiente — no es un ADR |
| **Fecha** | 2026-07-11 |
| **Auditor** | Principal Enterprise Software Auditor y Arquitecto de Atlas AI |
| **Base** | [AUD-0003](AUD-0003-sprint-20-aba-verification.md) — todos los hallazgos P0 y P1 de ese informe |
| **Metodología** | Lectura directa de código fuente y migraciones reales, ejecución real de `npm run test`, `npm run test:integration` y `npm run build`. Ninguna afirmación proviene de `walkthrough.md`. |

---

## Veredicto

# NO APTO

Sprint 20.2 corrigió, de forma real y verificable, el hallazgo más grave de AUD-0003 — la regresión de RLS de plataforma completa — y avanzó de forma sustancial en el contenido y el motor de puntuación de Assessment. Esto es progreso genuino y se documenta como tal punto por punto. Pero dos hechos impiden cualquier veredicto de aptitud, ni siquiera para piloto controlado:

1. **La suite de pruebas unitarias falla.** `npm run test` reporta 1 de 8 pruebas en rojo — una regresión real introducida por el propio Sprint 20.2, no un problema preexistente.
2. **El ciclo de gobernanza central de ABA sigue roto de extremo a extremo.** La aprobación humana no se persiste nunca en base de datos, y el guardián que Discovery añadió para exigir esa aprobación (`is_reviewed`) por tanto bloquearía siempre el paso, en la práctica, aunque el código de ambos lados se haya escrito con buena intención.

---

## Hallazgos por punto de verificación

### 1. ¿`get_current_organization_id()` ya no se redefine en ninguna migración posterior?

**CUMPLIDO.**

Búsqueda exhaustiva (`grep -rn "CREATE OR REPLACE FUNCTION get_current_organization_id\|CREATE FUNCTION get_current_organization_id" supabase/migrations/*.sql`) devuelve una única coincidencia: `supabase/migrations/00012_strict_rls_and_idempotency.sql:24`. La redefinición que existía en `00014_business_assessment.sql:6-10` en el estado auditado por AUD-0003 ha sido eliminada — el archivo actual (`00014_business_assessment.sql`, líneas 1-26) solo contiene la tabla `tenant_assessments` y su política RLS, sin ninguna declaración de función.

### 2. ¿RLS vuelve a estar correctamente aislado para toda la plataforma?

**CUMPLIDO a nivel de definición SQL — no verificado empíricamente contra una base de datos real.**

La única definición de `get_current_organization_id()` (`00012_strict_rls_and_idempotency.sql:24-40`) restaura la lógica correcta: JWT claim de `organization_id` → `auth.uid()` → constante de demo solo como último recurso. Todas las tablas de plataforma (`platform_events`, `roi_events`, `dental_budgets`, etc.) y las nuevas de Assessment dependen de esta única función. Como ya se señaló en AUD-0002, esta auditoría no dispone de una instancia viva de Supabase/PostgreSQL contra la que ejecutar una verificación directa de aislamiento cruzado — la corrección se confirma por lectura de la definición, no por prueba en vivo (ver punto 15 sobre el estado de la prueba de integración).

### 3. ¿Las 99 preguntas son exactamente las definidas en ADR-0016 y no texto autogenerado?

**CUMPLIDO, con dos matices menores documentados.**

- `supabase/migrations/00016_seed_aba_dental_01.sql` ya no genera texto con un bucle (`'Pregunta de evaluación ' || i`, hallazgo de AUD-0003) — contiene 543 líneas de contenido específico del vertical dental.
- Verificación textual directa: `OPE-01` = *"¿Qué sistema de gestión clínica (PMS) utiliza la clínica?"* y `PAC-01` = *"¿Existe seguimiento sistemático de presupuestos pendientes?"* — coinciden literalmente con [ADR-0016 §17](../adr/0016-atlas-business-assessment-framework.md).
- 99 códigos de pregunta distintos verificados, distribuidos exactamente como en ADR-0016 §17 (EMP:12, PER:11, PAC:13, SRV:10, AGE:12, REC:10, MKT:10, FIN:11, OPE:10).
- **Matiz 1**: 2 de 99 preguntas (las primeras transcritas, `PAC-01` y `OPE-01`) contienen en su campo `mapea_a` texto de prosa con formato markdown copiado literalmente de la tabla de ADR-0016 (p. ej. `"**ABVL-01** — señal de mayor peso de toda la biblioteca"`) en lugar de una referencia limpia — un defecto de calidad de datos aislado, no sistémico (las 97 restantes usan referencias limpias como `"ABVL-01"`).
- **Matiz 2**: el esquema `AssessmentQuestion.help_context` exige `economic_impact` y `validation_status` (`src/lib/schemas/assessment.ts:20-26`); ninguna de las 99 filas sembradas puebla estos dos campos (0 coincidencias verificadas).

### 4. ¿Existen las 9 categorías oficiales?

**CUMPLIDO.**

Verificado directamente en `00016_seed_aba_dental_01.sql`: `EMP` (Empresa), `PER` (Personas), `PAC` (Paciente), `SRV` (Servicios), `AGE` (Agenda), `REC` (Recepción), `MKT` (Marketing), `FIN` (Finanzas), `OPE` (Operaciones) — las 9 categorías exactas de [ADR-0016 §2](../adr/0016-atlas-business-assessment-framework.md), sustituyendo a las 4 categorías (`OPERATIONS`, `FINANCE`, `PATIENT_EXPERIENCE`, `MARKETING`) señaladas como desviación en AUD-0003.

### 5. ¿Los 6 índices se calculan mediante reglas reales?

**CUMPLIDO.**

`src/lib/assessment/AssessmentEngine.ts:38-155`, función `calculateScores` — los 4 índices que en AUD-0003 llevaban el comentario `// Mocked for now` (Health, Digital Readiness, Business DNA, Employee Readiness) ahora se calculan mediante `getPerc()`, una agregación real por categoría sobre las respuestas efectivas. Ningún valor fijo permanece en esta función. Caveat honesto ya documentado en el propio código (línea 90): la fórmula de Business DNA reutiliza las mismas categorías que Maturity de forma simplificada, en vez de una fórmula bespoke — una aproximación declarada, no un mock oculto.

### 6. ¿Las oportunidades se generan desde ABVL?

**CUMPLIDO, con un valor de impacto todavía fijo.**

`src/lib/assessment/OpportunityGenerator.ts` (nuevo) genera oportunidades reales: itera respuestas reales, filtra por `opt.mapea_a` que referencia `ABVL-*` o `Integration Hub`, y solo cuando la puntuación indica un vacío (`opt.score < 5`) — coherente con [ADR-0016 §7](../adr/0016-atlas-business-assessment-framework.md). Está conectado tanto al cálculo del índice Opportunity como a la generación de recomendaciones (línea 165 de `AssessmentEngine.ts`, comentario explícito: *"We base recommendations entirely on generated opportunities to avoid mocks"*). Caveat: `roi_range_low: 5000, roi_range_high: 15000` (`OpportunityGenerator.ts:30-31`) son constantes fijas idénticas para cualquier oportunidad, sin importar a qué entrada de ABVL corresponda.

### 7. ¿Las recomendaciones consultan realmente Employee Designer, Integration Hub, Knowledge Packs y Business Value Library?

**INCUMPLIDO.**

`src/lib/assessment/AssessmentEngine.ts:157-194`, función `generateRecommendations` — la lógica es un `if/else` binario: si `opp.category === 'Integration Hub'` genera un objeto genérico fijo (`target_code: 'PMS Integration'`, título y descripción fijos); en cualquier otro caso, genera un objeto genérico de tipo `'Employee Designer'` con `target_code: opp.category` y un título de plantilla (`Implantar automatización para ${opp.category}`). Ninguno de los dos casos consulta un registro real: no se busca en el catálogo real de especializaciones de [AED-0001](../adr/0009-atlas-employee-designer.md), ni en el catálogo de conectores de [ADR-0015](../adr/0015-atlas-integration-hub.md), ni en ningún registro de Knowledge Packs. Los tipos `'ABVL'` y `'Knowledge Pack'`, aunque están definidos en `AssessmentRecommendation.type` (`schemas/assessment.ts:73`), nunca se generan en la práctica.

### 8. ¿`approveAndTransferAssessment` ya no es un stub?

**INCUMPLIDO — confirmado por comentarios explícitos en el propio código actual.**

`src/app/actions/assessment.ts`, función `approveAndTransferAssessment` (líneas 79-92):

```
report.is_reviewed = true;

// Here we would do: await repo.updateReport(report);
// Then we simulate creating the real Discovery entities
// And redirecting to Discovery. We just trigger revalidation for now.
```

`is_reviewed` se modifica **solo en el objeto de memoria de la función**, nunca se persiste. `IAssessmentRepository` (`src/lib/repositories/assessment/assessment.repository.interface.ts`) sigue sin exponer ningún método `updateReport`/equivalente — la interfaz es idéntica a la ya auditada en AUD-0003. La función ahora sí ejecuta un `redirect()` real hacia Discovery, lo que da la apariencia de un flujo completo, pero ningún dato queda realmente aprobado ni transferido.

### 9. ¿Assessment transfiere datos reales a Discovery?

**INCUMPLIDO en la práctica, pese a una reescritura real del lado de Discovery.**

`src/lib/repositories/discovery.ts`, función `getDiscoveryResultFromAssessment` (nueva), consulta genuinamente el informe real de Assessment y **aplica correctamente la puerta de gobernanza**: `if (!reportData.data || !reportData.data.report.is_reviewed) { throw new Error('No existe reporte válido o no ha sido revisado.'); }`. Este es un diseño correcto. Pero, como el punto 8 confirma que `is_reviewed` nunca se persiste como `true`, esta comprobación **bloquearía siempre** el paso en un sistema real — las dos mitades del flujo están bien escritas por separado, pero no funcionan juntas todavía.

### 10. ¿Discovery deja de generar resultados simulados?

**PARCIAL.**

`DiscoveryRepository.simulateDiscoveryResult()` — la función completamente hardcodeada con empleados ficticios ("Dra. Aida", "Dr. Leo") y cifras inventadas señalada en AUD-0003 — **ha sido eliminada por completo**, sustituida por `getDiscoveryResultFromAssessment`, que deriva `health_score`, `opportunity_score`, `digital_readiness` y `dimensions` de los índices reales calculados por Assessment (punto 5). Persisten, no obstante, valores fijos con comentarios que lo admiten explícitamente (`src/lib/repositories/discovery.ts`): `clinic_name: 'Clínica Atlas', // This would come from org settings in a real app` (línea 21) y `roi_estimate: 15000 // Estimated fixed ROI for now as we don't have ABVL ROI tables locally` (línea 34), además de `proposal_price: 1500` y `weeks: 2` sin condición alguna.

### 11. ¿Business Studio reutiliza automáticamente la información del Assessment?

**INCUMPLIDO.**

Búsqueda exhaustiva de referencias a `assessment`/`Assessment` en todo el directorio `src/app/(dashboard)/[tenantId]/business-studio/`: cero resultados. Ningún archivo de este sprint toca ese módulo.

### 12. ¿El informe ejecutivo se genera a partir de datos reales?

**PARCIAL.**

`src/lib/assessment/ReportGenerator.ts:31-44` — las categorías `declared`, `hypothesis` y `projection` de `labeled_data` ahora se derivan genuinamente del array real de `opportunities` recibido (`.map(o => ...)`, usando `o.category` y `o.roi_range_high` reales) — una mejora sustancial frente a los arrays fijos de AUD-0003. Pero `benchmark: ['La media del sector dental está en 45% de Madurez Digital']` (línea 44) permanece como cadena de texto fija, idéntica, sin ningún cambio respecto al estado ya señalado como hallazgo en AUD-0003.

### 13. ¿No existen mocks ocultos?

**INCUMPLIDO.**

La mayoría de los mocks que quedan **ya no están ocultos** — están comentados explícitamente en el propio código (`// Estimated fixed ROI for now`, `// This would come from org settings in a real app`, `// Here we would do: await repo.updateReport(report)`), lo cual es una mejora real de transparencia respecto a AUD-0003. Pero la pregunta de este punto es si existen, no si están documentados: los valores de los puntos 7, 8, 9, 10 y 12 siguen siendo simulados en el camino de ejecución real, no solo en pruebas.

### 14. ¿No existen valores hardcodeados?

**INCUMPLIDO.**

Lista consolidada de valores fijos verificados en el camino de ejecución real (excluye deliberadamente los mocks legítimos de `src/lib/assessment/tests/assessment.test.ts` y de `local-assessment.repository.ts`, correctamente aislados detrás de `SERVER_ENVIRONMENT.DATA_PROVIDER === 'local'`, uso de desarrollo válido según [ADR-0014](../adr/0014-production-data-runtime-and-fallback-strategy.md)):

| Valor | Archivo | Línea |
|---|---|---|
| `roi_range_low: 5000, roi_range_high: 15000` | `OpportunityGenerator.ts` | 30-31 |
| `target_code: 'PMS Integration'` y título fijo | `AssessmentEngine.ts` | 173-174 |
| `clinic_name: 'Clínica Atlas'` | `discovery.ts` | 21 |
| `roi_estimate: 15000` | `discovery.ts` | 34 |
| `proposal_price: 1500` | `discovery.ts` | ~38 |
| `weeks: 2` | `discovery.ts` | ~42 |
| `benchmark: [...45% de Madurez Digital]` | `ReportGenerator.ts` | 44 |

### 15. Ejecución de comandos

| Comando | Resultado | Evidencia |
|---|---|---|
| `npm run test` | **FALLA** | 1 de 4 archivos, 1 de 8 pruebas en rojo — `src/lib/assessment/tests/assessment.test.ts:48`, `expect(maturity?.score).toBe(75)` recibe `0`. Causa raíz identificada: `calculateScores` (`AssessmentEngine.ts:63`) extrae la categoría con `q.category_id.substring(0, 3)`; los datos de prueba usan `category_id: 'cat1'` (→ `'cat'`), que no coincide con ninguna de las claves reales (`EMP`, `PER`, etc.) usadas por `getPerc()` — las respuestas de la prueba quedan invisibles para todas las fórmulas de índice. Es una regresión real introducida por la reescritura de esta misma sprint, no un fallo preexistente. |
| `npm run test:integration` | Pasa (1/1), pero sin valor probatorio | `src/__tests__/integration/rls.test.ts` (sin modificar desde antes de esta sprint, verificado por marca de tiempo) sigue siendo el mismo marcador de posición ya señalado en AUD-0002 y AUD-0003 — no se conecta a ninguna base de datos real. |
| `npm run build` | **Pasa** | Código de salida 0, sin errores de TypeScript. |

---

## Tabla de remediación pendiente para alcanzar APTO PARA PILOTO

| # | Hallazgo | Prioridad |
|---|---|---|
| 1 | Corregir la regresión de `calculateScores` / prueba unitaria en rojo (punto 15) | **P0 — bloqueante** |
| 2 | Añadir `updateReport`/`markReviewed` a `IAssessmentRepository` e implementarlo en ambos repositorios; conectar `approveAndTransferAssessment` para persistirlo de verdad (punto 8) | **P0 — bloqueante** |
| 3 | Verificar de extremo a extremo que, tras la corrección anterior, `getDiscoveryResultFromAssessment` recibe realmente un informe con `is_reviewed = true` (punto 9) | **P0 — bloqueante, depende del punto 2** |
| 4 | Conectar `generateRecommendations` a los catálogos reales de AED-0001, ADR-0015, Knowledge Packs y ABVL (punto 7) | **P1** |
| 5 | Sustituir los valores fijos de la tabla del punto 14 por cálculos o consultas reales | **P1** |
| 6 | Conectar Business Studio para reutilizar la salida de Assessment (punto 11) | **P1** |
| 7 | Sustituir la prueba de integración de RLS por una que se conecte a una instancia real (heredado de AUD-0002 y AUD-0003, todavía sin resolver) | **P1** |

---

## Conclusión

Sprint 20.2 demuestra que el equipo puede resolver, cuando se le pide con precisión, exactamente lo que se le pide: los siete primeros hallazgos de esta lista de verificación —los de mayor riesgo estructural, incluida la regresión de seguridad más grave detectada hasta ahora en todo el programa de auditoría— están genuinamente corregidos. Lo que impide el veredicto de aptitud no es falta de progreso, es que el propio proceso de corrección introdujo una regresión nueva (la prueba unitaria en rojo) y dejó sin cerrar el último eslabón de una cadena que, hasta ese punto, se había reconstruido con cuidado: la aprobación humana se calcula, se muestra, pero nunca se guarda — y todo lo que depende de que se guarde, incluida la promesa central de este sprint de conectar Assessment con Discovery, se detiene ahí.
