# AUD-0005 — Auditoría: Sprint 20.3 (Discovery Interview)

| | |
|---|---|
| **Tipo** | Auditoría técnica independiente — no es un ADR |
| **Fecha** | 2026-07-11 |
| **Auditor** | Product Auditor de ATLAS AI |
| **Metodología** | Lectura directa de código y migraciones reales, **prueba empírica en navegador contra la aplicación real conectada a Supabase**, y ejecución real de `npm run test`, `npm run test:integration`, `npm run build`. Ninguna afirmación proviene de `walkthrough.md`. |

---

## Nota metodológica — léase antes que cualquier hallazgo

Durante esta auditoría, el código de Discovery Interview se modificó **en vivo, varias veces**, mientras la auditoría ya estaba en curso (mismo fenómeno ya documentado en AUD-0003). Marcas de tiempo verificadas: `supabase/migrations/00017_discovery_interview.sql` y los repositorios de entrevista cambiaron de contenido entre las 20:xx y las 21:59, incluyendo un cambio de firma de `createInterview` de `(organizationId: string)` a `(payload: CreateInterviewPayload)` capturado a mitad de lectura.

Esto llevó a un hallazgo metodológico más importante que cualquier punto individual de la lista: **se intentó crear una entrevista real contra la aplicación en ejecución, conectada a Supabase, y la operación falló con un error devuelto directamente por PostgREST: `Could not find the 'created_by' column of 'discovery_interviews' in the schema cache`** — pese a que el archivo de migración en disco, en el momento de la prueba, ya declaraba esa columna. Esto demuestra que **el archivo de migración en el repositorio no es prueba de que la base de datos real conectada tenga esa migración aplicada.** Todos los hallazgos de "RLS/esquema correcto" de esta auditoría, y de las anteriores (AUD-0002, AUD-0003, AUD-0004), están verificados por lectura de los archivos `.sql`, no por consulta directa a una base de datos que se ha demostrado, aquí, que puede estar desincronizada. Se marca como advertencia transversal aplicable a todo el programa de auditoría, no solo a este sprint.

---

## Veredicto

# NO APTO

Se confirma, mediante prueba directa en navegador contra la aplicación real, que la creación de una entrevista falla hoy contra la base de datos conectada. A eso se suman una regresión de pruebas ya señalada en AUD-0004 y sin corregir, un archivo de pruebas nuevo que no ejecuta ninguna prueba por usar la API de un framework distinto al configurado en el proyecto, y brechas de contenido reales en los campos de inteligencia por respuesta.

---

## Hallazgos por punto de verificación

### 1. ¿Las tablas `discovery_interviews` y `discovery_interview_answers` tienen RLS real?

**CUMPLIDO en el archivo de migración — no confirmado contra la base de datos real (ver Nota metodológica).**

`supabase/migrations/00017_discovery_interview.sql:37-46` — ambas tablas tienen `ENABLE ROW LEVEL SECURITY` y políticas que dependen de `get_current_organization_id()` (la función corregida y verificada en AUD-0004): `discovery_interviews` mediante comparación directa con `WITH CHECK`; `discovery_interview_answers` mediante `EXISTS` mirando a la entrevista padre. No son políticas `USING (true)`. Sin embargo, la prueba empírica de esta misma auditoría demuestra que el contenido de este archivo no garantiza que la base de datos conectada lo tenga aplicado.

### 2. ¿`organization_id` se resuelve server-side?

**PARCIAL.**

`src/app/actions/interview.ts`, función `checkAccess(orgId)` — cuerpo íntegro: un comentario, sin ninguna comprobación real: *"In production we would check if the user belongs to orgId. For now, we trust the tenantId in the path if authenticated, or use RLS."* No hay verificación de aplicación que confirme que el llamador pertenece a `organizationId` antes de usarlo. La única barrera real es la restricción `WITH CHECK` de la política RLS (punto 1) — una defensa, pero solo una de las dos capas que exige el principio de defensa en profundidad ya fijado en ADR-0001 §5.2. La capa de aplicación es, literalmente, un no-op.

### 3. ¿El autoguardado persiste realmente en Supabase?

**PARCIAL — mecanismo bien diseñado, fallo empírico al probarlo.**

- Diseño: `src/app/(dashboard)/[tenantId]/discovery/interview/[interviewId]/_components/useInterviewHooks.ts:45-66` — debounce de 1.500 ms, llamada real a Server Action, fallback a `localStorage` si falla el guardado remoto, con reintento manual expuesto en la UI (`QuestionItem.tsx:70-76`). Es un diseño de resiliencia genuino y correcto.
- `src/lib/repositories/interview/supabase-interview.repository.ts`, método `saveAnswer` — hace un `select` seguido de `update` o `insert` (no un `upsert` atómico contra la restricción `UNIQUE(interview_id, block_id, question_key)` de la migración) — expuesto a una condición de carrera teórica bajo guardado concurrente muy próximo en el tiempo, aunque de bajo riesgo práctico dado el debounce de 1.500 ms de un único usuario por sesión.
- **Hallazgo empírico**: al probar la creación de una entrevista contra la aplicación real (necesaria antes de poder probar el autoguardado de ninguna respuesta), la operación falló en el navegador con un error de Supabase real (ver Nota metodológica). No fue posible completar una prueba de guardado de una respuesta real durante esta auditoría.

### 4. ¿Cerrar y reabrir conserva todas las respuestas?

**CUMPLIDO por diseño de código — no verificado empíricamente, por el mismo motivo del punto 3.**

`src/app/(dashboard)/[tenantId]/discovery/interview/[interviewId]/page.tsx` es un Server Component que llama a `getInterviewWithAnswersAction(interviewId)` en cada visita/recarga, trayendo la entrevista y **todas** sus respuestas frescas desde el repositorio (`Promise.all([repo.getInterview(id), repo.getAnswers(id)])`) y pasándolas como `initialAnswers` al cliente, que las usa para hidratar cada `QuestionItem`. El diseño es correcto; no se pudo completar una prueba de extremo a extremo por el fallo del punto 3.

### 5. ¿Los 10 bloques y todas las preguntas están implementados?

**CUMPLIDO.**

`InterviewWizardClient.tsx:31-43` define 10 bloques (`BLOCK_1` a `BLOCK_10`) más una cabecera, con títulos temáticos reales ("La Clínica", "Un Día Normal", "Problemas", "Recorrido del Paciente", "Recepción", "Coordinadora", "Laboratorios", "Stock", "Tecnología", "Futuro y Resumen"). Verificado un total de 17 preguntas reales repartidas entre esos 10 bloques (líneas 119-259), con texto específico y consultivo (no genérico ni autogenerado), más el bloque de resumen final.

### 6. ¿Pain Level, Economic Impact, Affected Area, observaciones e ideas se guardan por respuesta?

**PARCIAL — 2 de 5 campos ausentes o mal implementados.**

Verificado en `QuestionItem.tsx:109-166`:

| Campo pedido | Estado | Evidencia |
|---|---|---|
| Pain Level | **Presente** | Líneas 112-127, selector 1-5 |
| Economic Impact | **Presente, con inconsistencia de valores** | Líneas 130-143: el `<select>` ofrece `LOW/MEDIUM/HIGH/CRITICAL`; el tipo `EconomicImpact` en `src/lib/schemas/interview.ts:2` declara `'LOW' \| 'MEDIUM' \| 'HIGH' \| 'VERY_HIGH' \| null` — `CRITICAL` no es un valor válido del tipo declarado |
| Affected Area | **Ausente** | No existe ningún campo de formulario para `affected_area` en todo `QuestionItem.tsx`, pese a estar declarado en `InterviewIntelligence` (`schemas/interview.ts:23`) |
| Observaciones | **Ausente como campo propio** | No existe un campo distinto para `observations`; el único campo de texto libre adicional (línea 157, etiquetado "Observaciones / Ideas para Atlas") guarda su valor exclusivamente en `intelligence.ideas` |
| Ideas | **Presente** | Mismo campo de la fila anterior, guarda en `ideas` |

Además, la UI usa `intelligence.literal_quotes` (línea 148) y `intelligence.needs_deep_dive` (línea 101), ninguno de los dos declarado en `InterviewIntelligence` (`schemas/interview.ts:20-27`) — se guardan igualmente en el JSONB por ser JavaScript sin tipado estricto en tiempo de ejecución, pero divergen del contrato de tipos declarado.

### 7. ¿El resumen final se genera exclusivamente desde datos registrados?

**CUMPLIDO.**

`Block10Summary.tsx:20-31` — las ocho secciones del resumen (`criticalProblems`, `repetitiveTasks`, `forgottenProcesses`, `opportunities`, `integrations`, `deepDive`, `essentialFeatures`, `wtp`) son, cada una, un `.filter()` puro sobre el array real `answers` recibido por props, con condiciones explícitas e inspeccionables (p. ej. `pain_level >= 4`, `question_key === 'q3_repetitivas'`). No hay llamada a ningún modelo de lenguaje ni generación de texto — el propio comentario del wizard lo declara: *"Resumen Final Agregado (UI funcional sin IA)"* (`InterviewWizardClient.tsx:251`).

### 8. ¿Cada resumen conserva trazabilidad hasta la pregunta original?

**CUMPLIDO.**

`Block10Summary.tsx:54-78` — cada elemento renderizado conserva y muestra `ans.block_id` (línea 74) y el texto íntegro de `ans.answer_text`, además de las citas literales (`literal_quotes`) cuando existen. El objeto de datos subyacente conserva también `question_key`, aunque no se muestra literalmente en la UI del resumen.

### 9. ¿El estado Pendiente/Revisado se persiste?

**CUMPLIDO en el mecanismo — no verificado empíricamente por el motivo ya expuesto.**

`Block10Summary.tsx:33-43`, función `handleUpdateStatus`, llama a `updateInterviewAction(interviewId, { status: newStatus })`, una Server Action real que delega en `repo.updateInterview` (confirmado real en `supabase-interview.repository.ts`), no una actualización de solo estado local.

### 10. ¿La vista de impresión no pierde contenido?

**INCUMPLIDO — confirmado por lógica de código, sin ambigüedad.**

`InterviewWizardClient.tsx` mantiene un único bloque abierto a la vez (`useState<string>('HEADER')`, línea 24, y alternancia exclusiva en la línea 76). El contenido de cada bloque solo se monta en el DOM si `isOpen || typeof window === 'undefined'` (línea 91) — tras la hidratación en el navegador, `typeof window` nunca es `undefined`, así que el contenido de cualquier bloque no activo **no existe en el DOM**, no solo está oculto por CSS. Al pulsar imprimir (`window.print()`, línea 62), solo el bloque actualmente abierto aparece en el documento impreso — las respuestas de los otros 9 bloques, y el resumen final de `Block10Summary` (que solo se renderiza dentro de `BLOCK_10`), quedan fuera salvo que ese sea el bloque activo en el momento de imprimir.

### 11. ¿Funciona correctamente en tablet?

**NO VERIFICABLE EN ESTA AUDITORÍA.**

Señales de intención real en el código: `QuestionItem.tsx:32-39`, función `handleFocus`, con el comentario explícito *"Scroll smoothly so keyboard doesn't hide input on iPad"* — una adaptación deliberada para tablet. Se usan clases responsivas de Tailwind (`md:grid-cols-2`, `md:p-8`) de forma consistente. No fue posible completar una verificación empírica a resolución de tablet (768×1024) durante esta auditoría: el entorno de previsualización sufrió las mismas ediciones en vivo del código que impidieron completar la prueba del punto 3, y la sesión de navegador se cerró tras el hallazgo empírico del punto 3 para no seguir interactuando con un entorno inestable a mitad de escritura. Se recomienda una verificación dedicada antes de cualquier entrevista piloto real en tablet.

### 12. ¿No existen respuestas, cifras o conclusiones simuladas?

**CUMPLIDO para el flujo real — con un generador de demo explícito y separado, correcto por diseño.**

- El flujo real (`createInterviewAction`, botón *"Nueva entrevista estratégica"*) no contiene ningún dato simulado.
- Existe `createDemoInterviewAction` (`src/app/actions/interview.ts`), que inserta una entrevista y respuestas de ejemplo con datos claramente ficticios (*"CLÍNICA DEMO - Dental Advance"*, *"Dra. Elena García"*). Verificado en el navegador que este flujo está detrás de un botón distinto y explícitamente etiquetado *"Generar Entrevista DEMO"*, separado del botón real *"Nueva entrevista estratégica"* — mismo patrón ya validado como legítimo en auditorías anteriores (Modo DEMO explícito, ADR-0014 §5), no un mock oculto.

### 13. `npm run test`, `npm run test:integration`, `npm run build`

| Comando | Resultado | Evidencia |
|---|---|---|
| `npm run test` | **FALLA** | 2 de 5 archivos fallan, 1 de 8 pruebas en rojo. (a) `src/lib/assessment/tests/assessment.test.ts:48` — la misma regresión de `calculateScores` ya señalada en AUD-0004, todavía sin corregir, no relacionada con este sprint pero presente en la suite. (b) `src/__tests__/actions/interview.test.ts:5` — **suite completa sin ejecutar ninguna prueba**: `ReferenceError: jest is not defined`. El archivo usa `jest.mock(...)`/`jest.fn()`, la API de Jest, mientras el proyecto entero usa Vitest (`vi.mock`/`vi.fn()`, confirmado en `package.json` y en el resto de archivos de prueba) — un archivo de pruebas nuevo para esta misma funcionalidad, escrito para el framework equivocado, que nunca llega a validar nada. |
| `npm run test:integration` | Pasa (1/1), sin valor probatorio | Mismo marcador de posición ya señalado en AUD-0002, AUD-0003 y AUD-0004 — no se conecta a ninguna base de datos real, no cubre Discovery Interview en absoluto. |
| `npm run build` | **Pasa** | Código de salida 0, verificado tras la última tanda de ediciones en vivo detectadas. |

---

## Tabla de remediación

| # | Hallazgo | Prioridad |
|---|---|---|
| 1 | Verificar y, si hace falta, aplicar realmente la migración `00017` (y cualquier migración pendiente) contra la base de datos de desarrollo conectada — el error `created_by` column not found demuestra una desincronización real, no hipotética | **P0 — bloqueante** |
| 2 | Corregir `src/__tests__/actions/interview.test.ts` para usar `vi` de Vitest en vez de `jest` — hoy no protege nada | **P0** |
| 3 | Corregir la regresión heredada de AUD-0004 en `assessment.test.ts` / `AssessmentEngine.calculateScores` (fuera del alcance de Discovery Interview pero bloqueante para cualquier `npm run test` limpio) | **P0** |
| 4 | Añadir el campo `affected_area` a la UI de `QuestionItem`, y separar `observations` de `ideas` como campos distintos, tal como pide el punto 6 | **P1** |
| 5 | Unificar `CRITICAL` (UI) con `VERY_HIGH` (tipo declarado) en `EconomicImpact`, y añadir `literal_quotes`/`needs_deep_dive` al tipo `InterviewIntelligence` para que el contrato de tipos refleje lo que realmente se guarda | **P1** |
| 6 | Rediseñar la vista de impresión para que renderice el contenido de los 10 bloques simultáneamente en el documento impreso, independientemente del acordeón activo en pantalla | **P1** |
| 7 | Implementar una verificación real de pertenencia a `organizationId` en `checkAccess`, en vez de un no-op, como segunda capa de defensa además de RLS | **P1** |
| 8 | Verificación dedicada en tablet real o emulado (768×1024) antes de cualquier entrevista piloto | **P1** |

---

## Conclusión

El diseño de Discovery Interview es, en su mayoría, sólido y consciente de sus propios requisitos: el resumen final sin IA sobre datos reales, el autoguardado con reintento y respaldo local, la separación limpia entre entrevista real y demo, y la recarga completa de respuestas al reabrir, están todos bien pensados. Pero esta auditoría encontró, de primera mano, que la funcionalidad falla al intentar usarla contra el entorno real conectado — no como una hipótesis de riesgo, sino como un error observado y reproducido en el navegador. Combinado con una suite de pruebas que no protege lo que dice proteger (un archivo entero no ejecuta ninguna prueba) y brechas de contenido reales en los campos de inteligencia por respuesta, el veredicto no puede ser otro que NO APTO.
