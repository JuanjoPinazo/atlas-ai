# AUD-0002 — Auditoría de Verificación Final: Sprint 18.3

| | |
|---|---|
| **Tipo** | Auditoría técnica independiente — no es un ADR |
| **Fecha** | 2026-07-11 |
| **Auditor** | Principal Software Auditor de ATLAS AI |
| **Base** | [AUD-0001](AUD-0001-sprint-18-1-production-readiness.md) · [ADR-0012](../adr/0012-atlas-event-driven-architecture.md) · [ADR-0013](../adr/0013-dental-budget-follow-up-vertical-slice.md) · [ADR-0014](../adr/0014-production-data-runtime-and-fallback-strategy.md) |
| **Metodología** | Lectura directa de código fuente y migraciones reales, ejecución real de `npm run build`, `npm run test`, `npm run test:integration`, e inspección del artefacto de build (`.next/static`) para verificar ausencia de fuga de secretos. Ninguna afirmación de esta auditoría proviene de `walkthrough.md` ni de ningún resumen — cada hallazgo está anclado a archivo y línea verificados en este turno. |

---

## Veredicto final

# APTO PARA PILOTO CONTROLADO

**No apto para "Production Ready"** — no se evalúa esa denominación en esta auditoría (requiere, además, despliegue real en Vercel, backups, monitorización y operación continuada, según el propio encargo).

Sprint 18.3 corrigió, de forma genuina y verificable, los hallazgos más graves de AUD-0001: la política RLS de "permitir todo" ha sido eliminada, el Event Store y la atribución de ROI ahora operan sobre Supabase con idempotencia real a nivel de base de datos, `dental-knowledge.ts` ya no devuelve mocks ante fallos, y el build compila. Esto es una remediación seria, no cosmética.

Pero quedan dos condiciones que deben resolverse **antes de dar por cerrado el piloto controlado**, no después:

1. **La aprobación humana obligatoria antes del primer envío de un presupuesto no está conectada al código que realmente se ejecuta.** Existe una implementación correcta (`BudgetLifecycleService`) que nadie invoca — es exactamente el mismo patrón de "pieza bien diseñada pero huérfana" que ya se señaló en AUD-0001 para el Event Store, y que en esta ocasión sí se corrigió para el Event Store pero no para la máquina de estados de presupuestos. Mientras esto no se conecte, la línea roja más importante del vertical dental ([DKB-EMP-01](../dkb/01_Empresa/DKB-EMP-01_Modelos_Clinica.md), [ABVL-01 §12](../abvl/ABVL-01_Seguimiento_Presupuestos_Pendientes.md)) no se aplica en producción real.
2. **El aislamiento de tenants por RLS está correctamente definido en SQL, pero no verificado empíricamente.** La única prueba de "integración" existente es un marcador de posición que no se conecta a ninguna base de datos real — su propio código lo declara así. Un piloto controlado con un único tenant de confianza es razonable mientras esto se resuelve; una expansión a un segundo cliente real no debería ocurrir sin esa verificación.

---

## Hallazgos por punto de verificación

### 1. `npm run build`

**CUMPLIDO.** Ejecutado en este turno — compila con éxito, TypeScript pasa sin errores, genera las 26 rutas de la aplicación. El error de `BudgetList.tsx` de AUD-0001 está corregido.

### 2. `npm run test`

**CUMPLIDO.** Ejecutado en este turno — 3 archivos, 5 pruebas, todas en verde (941ms). Sube desde 2 archivos/4 pruebas en AUD-0001.

### 3. `npm run test:integration`

**PARCIAL — el comando pasa, pero no verifica lo que su nombre promete.**

- Ejecutado en este turno — 1 archivo, 1 prueba, verde (209ms).
- Evidencia: `src/__tests__/integration/rls.test.ts:18-28` — la prueba instancia `SupabaseBudgetRepository` y afirma `expect(repo).toBeDefined()` y `expect(tenantA).not.toBe(tenantB)` (dos literales de cadena distintos). No se conecta a ninguna base de datos, no crea usuarios, no inserta datos, no intenta una lectura cruzada real.
- El propio comentario del archivo lo admite (líneas 15-16, 21): *"we simulate the intent of the test since we don't have an ephemeral docker instance... Real validation happens when connected to `npm run test:integration` with valid .env"*.
- Un `npm run test:integration` en verde no debe interpretarse, hoy, como evidencia de que el aislamiento de tenants funciona.

### 4. ¿`EventBusService` ya no importa `LocalDB`?

**CUMPLIDO.** Evidencia: `src/lib/services/event-bus.ts` completo — ya no existe ninguna importación de `LocalDB`. `emit()` y `processQueue()` ahora usan `EventStoreFactory.getRepository()`; `EventRouterService.route()` usa `ROIRepositoryFactory.getRepository()`. Es una reescritura real, no un parche superficial.

### 5. ¿`orchestrator.ts` y `roi.ts` no importan `LocalDB`?

**CUMPLIDO en ambos, con una mejora adicional no exigida explícitamente pero relevante.**

- `src/app/actions/roi.ts` — sin importación de `LocalDB`; usa `ROIRepositoryFactory` exclusivamente.
- `src/app/actions/orchestrator.ts` — sin importación de `LocalDB`; usa `EventStoreFactory`. Además, corrige el hallazgo F de AUD-0001 (contaminación real+mock): ahora comprueba `SERVER_ENVIRONMENT.DATA_PROVIDER === 'supabase'` y, en ese caso, **no** mezcla eventos reales con los mocks de `OrchestratorRepository.getLiveEvents()` — evidencia en el propio código, línea 18: *"Orchestrator no debe mezclar eventos reales y simulados en la misma respuesta."*

### 6. ¿`BudgetRepositoryFactory` usa `server-environment.ts`?

**CUMPLIDO.** Evidencia: `src/lib/repositories/budget/budget.factory.ts:5,9,13,17` — importa y usa `SERVER_ENVIRONMENT` en lugar del antiguo `ENVIRONMENT`. El archivo inseguro `src/config/environment.ts` (basado en `NEXT_PUBLIC_DATA_SOURCE`) **ha sido eliminado por completo** — verificado por su ausencia en el sistema de archivos y por búsqueda exhaustiva de referencias (cero resultados) en todo `src/`.

### 7. ¿Producción y staging no permiten `local`?

**CUMPLIDO — sin cambios respecto a la pieza que ya era correcta en AUD-0001.** Evidencia: `src/config/server-environment.ts:7-13` — `throw` explícito si `runtimeMode === 'production'` o `'staging'` y `dataProvider !== 'supabase'`; `throw` adicional si `dataProvider === 'local'` fuera de `development_local`/`demo`. Esta pieza ya existía en AUD-0001 pero estaba desconectada; ahora **sí** gobierna el camino de ejecución real, verificado en los puntos 4, 5 y 6.

### 8. ¿Las políticas RLS ya no contienen `USING (true)`?

**CUMPLIDO.** Evidencia: `supabase/migrations/00012_strict_rls_and_idempotency.sql:6-12` elimina explícitamente las seis políticas `"Allow all operations for now"` (`DROP POLICY`); líneas 40-67 las sustituyen por políticas `USING (organization_id = get_current_organization_id())` `WITH CHECK (...)` en las seis tablas. Es una corrección real del hallazgo de mayor severidad de AUD-0001.

**Matiz a registrar**: `get_current_organization_id()` (líneas 24-35) intenta leer `organization_id` de un claim JWT personalizado y, si no existe, recurre a `auth.uid()` como si fuera el `organization_id`. Es una simplificación razonable para un piloto de tenant único, pero conflacionar usuario y organización no es el modelo final de IAM multi-usuario de [ADR-0001 §6.1](../adr/0001-arquitectura-base-atlas-ai.md) — debe revisarse antes de soportar más de un usuario por tenant.

### 9. ¿Las pruebas RLS se ejecutan contra Supabase/PostgreSQL real?

**INCUMPLIDO.** Ver punto 3 — el único archivo con "RLS" en su nombre no ejecuta ninguna operación contra una base de datos real.

### 10. ¿Un usuario de tenant A no puede leer ni escribir datos de tenant B?

**PARCIAL — no verificable empíricamente en esta auditoría.**

La política SQL (punto 8) está correctamente definida para lograrlo. Pero:
- No existe una prueba automatizada que lo demuestre (punto 9).
- Esta auditoría no dispone de una instancia viva de Supabase/PostgreSQL contra la que ejecutar una verificación directa (mismo motivo que impidió al propio equipo de desarrollo completar la prueba de integración, según su propio comentario).
- **Recomendación**: antes de considerar este punto `CUMPLIDO`, ejecutar manualmente, contra una instancia real (local o de staging), una inserción como tenant A seguida de un intento de lectura como tenant B, y registrar el resultado. No se debe dar por buena la política solo porque su sintaxis es correcta.

### 11. ¿El primer envío requiere aprobación humana?

**INCUMPLIDO en el código que se ejecuta — implementado pero no conectado.**

- Evidencia positiva: `src/lib/services/budget-lifecycle.service.ts:16-43` — `BudgetLifecycleService.validateTransition()` implementa exactamente la regla exigida: rechaza `PENDING_APPROVAL → SENT` si `hasHumanApproval` es `false` (líneas 37-40).
- Evidencia del incumplimiento: búsqueda exhaustiva de `BudgetLifecycleService` en todo `src/` — la única aparición es su propia definición. **Ningún archivo lo importa ni lo invoca.**
- `src/lib/repositories/budget/supabase-budget.repository.ts` y `local-budget.repository.ts` (verificados de nuevo en este turno, sin cambios desde AUD-0001) siguen transicionando estados de forma directa dentro de `simulateAction()`, sin pasar por ningún validador ni exigir ninguna aprobación.
- Es, exactamente, el mismo patrón de "pieza correcta pero huérfana" que en AUD-0001 afectaba al Event Store — y que en esta ocasión **sí** se resolvió para el Event Store (punto 4) pero no para la máquina de estados de presupuestos.

### 12. ¿Los 10 estados de ADR-0013 están implementados?

**PARCIAL — definidos correctamente, no operativos.**

- `src/lib/services/budget-lifecycle.service.ts:3-13` define el tipo `BudgetState` con los 10 estados exactos de ADR-0013 §3, y la tabla de transiciones válidas de §4 (líneas 17-28) coincide con precisión.
- Pero, igual que en el punto 11, `SupabaseBudgetRepository`/`LocalBudgetRepository` (no modificados desde AUD-0001) siguen operando sobre un modelo de 6 estados (`DRAFT`, `PENDING_DECISION`, `FOLLOW_UP_SCHEDULED`, `ACCEPTED`, `REJECTED`, `EXPIRED`), sin `PENDING_APPROVAL`, `SENT`, `FOLLOW_UP_DUE`/`FOLLOW_UP_ACTIVE` diferenciados ni `ARCHIVED`.
- El esquema de `dental_budgets` (`00010_dental_budget_followup.sql:56`) todavía restringe `status` con el `CHECK` de 6 valores, no de 10 — la base de datos ni siquiera aceptaría hoy los estados que `BudgetLifecycleService` sí conoce.

### 13. ¿`follow_up_attempts` posee `idempotency_key UNIQUE`?

**CUMPLIDO**, con una diferencia de nombre sin impacto funcional.

Evidencia: `supabase/migrations/00012_strict_rls_and_idempotency.sql:83-91` — tabla `dental_budget_follow_up_attempts` (no `follow_up_attempts` a secas, como nombraba ADR-0013 §15.2, pero funcionalmente equivalente) con `idempotency_key VARCHAR(255) UNIQUE NOT NULL` y RLS propia aplicada.

### 14. ¿`roi_events` impide atribución duplicada?

**CUMPLIDO, con un matiz de robustez a mejorar.**

- Evidencia: `supabase/migrations/00012_strict_rls_and_idempotency.sql:72-77` añade `CONSTRAINT uq_roi_events_event_id UNIQUE (event_id)` de forma idempotente (`IF NOT EXISTS` contra `pg_constraint`).
- La función `attribute_roi_idempotent` (`00011_event_store.sql:29-73`) comprueba existencia antes de insertar (patrón "verificar y luego actuar") y ahora, gracias a la restricción `UNIQUE`, cualquier intento de duplicado que burlara esa comprobación fallaría a nivel de base de datos en vez de duplicar la fila.
- **Matiz**: la función no captura explícitamente una excepción de violación de restricción única (`unique_violation`) — ante una carrera de concurrencia real muy ajustada, el segundo intento fallaría con un error de Postgres no controlado en vez de devolver `TRUE` de forma silenciosa como pretende la lógica de idempotencia. No invalida la garantía de no-duplicación (la restricción `UNIQUE` la sostiene), pero sí puede producir un error visible innecesario bajo concurrencia alta.

### 15. ¿No existe `baseValue` ni cifra de ROI hardcodeada?

**CUMPLIDO.** Búsqueda exhaustiva de `baseValue` y `42500`/`42,500` en todo `src/` — cero resultados. `src/lib/repositories/roi/supabase-roi.repository.ts:32-51` calcula `totalGenerated` exclusivamente como la suma de filas reales de `roi_events` filtradas por `organization_id`. Corrige por completo el hallazgo E de AUD-0001.

### 16. ¿`dental-knowledge.ts` ya no devuelve mocks ante errores?

**CUMPLIDO — remediación completa y bien diseñada.**

- Ya no existe ningún bloque `catch` que devuelva un array mock (verificado: cero coincidencias de `catch (e)` en el archivo).
- Ahora distingue correctamente entre dos situaciones distintas: si `SERVER_ENVIRONMENT.DATA_PROVIDER !== 'supabase'`, devuelve datos de ejemplo fijos de forma **explícita y predecible** (p. ej. `src/lib/repositories/dental-knowledge.ts:15-18`) — comportamiento de modo demo legítimo, no un fallback ante fallo. Si el proveedor es `'supabase'` y la consulta falla, el error se registra con `ObservabilityService.logError` y se relanza (`throw e`, línea 29) — nunca se sustituye en silencio.
- Además, ya no instancia su propio cliente Supabase — ahora importa `createClient` desde `@/lib/supabase/server` (línea 1), consolidando el cuarto cliente duplicado que señalaba AUD-0001, punto 7.

### 17. ¿El Event Replay funciona sobre `platform_events`?

**CUMPLIDO, con una simplificación documentada.**

- Evidencia: `src/app/actions/event-replay.ts` completo — `replayEventsForTenant()` exige `SERVER_ENVIRONMENT.DATA_PROVIDER === 'supabase'` (línea 15-17, sin excepción), lee todos los eventos de `platform_events` para un tenant ordenados por `occurred_at` (líneas 22-26), y los reprocesa uno a uno a través de `EventRouterService.route()` (líneas 44-58), apoyándose en la idempotencia ya verificada en el punto 14 para que el reprocesamiento sea seguro.
- **Simplificación reconocida por el propio código** (líneas 37-39): no limpia ni reconstruye las proyecciones antes de repetir — asume que la idempotencia existente es suficiente. Válido para el caso de uso actual (recalcular ROI), insuficiente si en el futuro se necesita reconstruir una proyección desde cero tras corrupción de datos, tal como exige [ADR-0012 §8](../adr/0012-atlas-event-driven-architecture.md).

### 18. ¿La Service Role no aparece en el bundle cliente?

**CUMPLIDO, verificado empíricamente contra el artefacto de build real, no solo por inspección de código.**

- `src/lib/supabase/admin.ts` define `createAdminClient()`, que exige `SUPABASE_SERVICE_ROLE_KEY` (variable **sin** prefijo `NEXT_PUBLIC_`, por tanto nunca incluida automáticamente en el bundle de cliente de Next.js).
- Solo se usa desde `src/app/actions/event-replay.ts`, un fichero `"use server"` — nunca importado por ningún componente `.tsx` (verificado por búsqueda exhaustiva, cero resultados).
- **Verificación adicional realizada en este turno**: tras ejecutar `npm run build`, se buscó el literal `SUPABASE_SERVICE_ROLE_KEY` y `createAdminClient` dentro de `.next/static/` (el directorio de artefactos servidos al navegador) — cero coincidencias.

### 19. ¿Los datos demo están etiquetados y separados?

**INCUMPLIDO.**

- No existe ninguna columna `is_seed_data`, `is_demo` ni equivalente en ninguna migración (búsqueda exhaustiva, cero resultados).
- `supabase/seeds/003_seed_demo_data.sql` no fija `organization_id` en absoluto en sus inserciones sobre las tablas relevantes (búsqueda exhaustiva de `organization_id` en ese archivo, cero resultados) — no hay ningún mecanismo verificable que impida que una fila sembrada se confunda con una fila real.
- Además, el único `organization_id` usado hoy por el código de aplicación real (`budget.ts`, `roi.ts`, `orchestrator.ts`) es el mismo valor fijo `00000000-0000-0000-0000-000000000000` en los tres — no hay, todavía, ninguna distinción operativa entre "el tenant de demo" y "el único tenant real" porque solo existe ese identificador en todo el sistema.

### 20. ¿Todos los criterios de ADR-0014 §19 están cumplidos?

| Criterio de ADR-0014 §19 | Estado |
|---|---|
| Event Store implementado como tabla real de Supabase con RLS verificada | **Parcial** — implementado y con RLS correctamente definida (puntos 4, 8); "verificada" en el sentido de probada contra una base de datos real, no todavía (puntos 9-10) |
| Flujo de presupuestos opera sobre el contrato de repositorios respaldado por Supabase | **Parcial** — el CRUD y la emisión de eventos sí operan sobre Supabase; la máquina de estados y la puerta de aprobación de ADR-0013 no están conectadas (puntos 11-12) |
| `dental-knowledge.ts` sin `catch` que devuelva mock | **Cumplido** |
| Única fábrica de cliente Supabase por contexto | **Cumplido** — el cuarto cliente duplicado se consolidó (punto 16) |
| Ninguna variable de entorno resuelta con valor por defecto silencioso | **Cumplido** — `environment.ts` inseguro eliminado; `server-environment.ts` falla explícitamente ante configuración inválida |
| Modo DEMO explícito y verificable | **Cumplido** — `SERVER_ENVIRONMENT.RUNTIME_MODE === 'demo'` gobierna `DemoBudgetRepository` de forma explícita, sin solaparse con el camino de producción |
| Seeds aislados con marcador verificable | **Incumplido** (punto 19) |
| Preview de Vercel nunca apunta a producción | **No evaluable desde el código fuente** — configuración de proyecto Vercel, fuera del alcance de esta auditoría |
| Pruebas de seguridad pasan, incluida regresión de fallback silencioso | **Parcial** — la regresión de fallback silencioso de `dental-knowledge.ts` está, de facto, corregida y verificable por inspección; no hay una prueba automatizada que la proteja de reaparecer, y la prueba de RLS sigue sin ser real (punto 9) |

---

## Hallazgo adicional no solicitado explícitamente, pero relevante

**Llamadas a `EventBusService.emit()` sin `await` en los ocho puntos de invocación.**

- `emit()` es ahora `static async` (`event-bus.ts:5`), pero ninguna de sus ocho llamadas —cuatro en `local-budget.repository.ts` (líneas 50, 66, 72, 78) y cuatro en `supabase-budget.repository.ts` (líneas 111, 129, 139, 147)— usa `await`.
- Riesgo: una Server Action puede devolver éxito al cliente antes de que el evento se haya persistido y procesado realmente (incluida la atribución de ROI), y cualquier rechazo de la promesa de `emit()` queda sin capturar.
- No estaba entre los 20 puntos solicitados, pero es una regresión de fiabilidad introducida por el propio cambio de esta sprint (hacer `emit()` asíncrono) y debe corregirse junto con el resto de hallazgos de esta auditoría.

---

## Tabla de remediación pendiente

| # | Archivo | Función | Riesgo | Cambio exacto requerido | Prioridad |
|---|---|---|---|---|---|
| 1 | `src/lib/repositories/budget/supabase-budget.repository.ts`, `local-budget.repository.ts` | `simulateAction`, `simulateTime` | La línea roja de aprobación humana obligatoria no se aplica en el código real | Sustituir las transiciones directas por llamadas a `BudgetLifecycleService.validateTransition()`; rechazar la operación si devuelve `false` | **P0** |
| 2 | Esquema de `dental_budgets` + repositorios de presupuesto | — | El sistema en ejecución usa 6 estados, no los 10 de ADR-0013 | Actualizar el `CHECK` de `status` en `dental_budgets` a los 10 estados, y reescribir `simulateAction`/`simulateTime` (o sus sucesores) para operar sobre ellos vía `BudgetLifecycleService` | **P0** |
| 3 | `src/__tests__/integration/rls.test.ts` | Todo el archivo | No verifica RLS real; un futuro lector podría asumir cobertura que no existe | Sustituir por una prueba que se conecte a una instancia real (Supabase local vía CLI/Docker, o proyecto de staging), inserte como tenant A y verifique lectura vacía como tenant B | **P0** |
| 4 | `supabase/migrations/00012_strict_rls_and_idempotency.sql` | `get_current_organization_id()` | El fallback a `auth.uid()` conflaciona usuario y organización | Documentar como limitación temporal de tenant único, o resolver antes de soportar más de un usuario por tenant | **P1** |
| 5 | `src/lib/repositories/budget/local-budget.repository.ts`, `supabase-budget.repository.ts` | Los 8 sitios de llamada a `EventBusService.emit` | Posible condición de carrera entre respuesta al cliente y persistencia real del evento | Añadir `await` en las 8 llamadas | **P1** |
| 6 | `supabase/migrations/00011_event_store.sql` | `attribute_roi_idempotent` | Excepción no controlada ante una violación de la restricción `UNIQUE` bajo concurrencia real | Envolver el `INSERT` en un bloque `EXCEPTION WHEN unique_violation THEN RETURN TRUE` | **P2** |
| 7 | `supabase/seeds/003_seed_demo_data.sql` + esquema | — | Datos de demostración indistinguibles de datos reales | Añadir columna de marcado explícito (`is_seed_data` o rango de `organization_id` reservado) y aplicarla en los seeds | **P1** |

---

## Conclusión

Sprint 18.3 demuestra que el equipo puede resolver correctamente los problemas más difíciles de esta auditoría — la política RLS y la idempotencia a nivel de base de datos son, ahora, genuinamente correctas, no cosméticas. El patrón de riesgo que queda por cerrar no es de diseño, es el mismo de AUD-0001: **piezas construidas correctamente que no se conectan al camino de código que realmente se ejecuta.** Esta vez le pasó a la máquina de estados de presupuestos y a su puerta de aprobación humana, después de que exactamente ese mismo patrón se resolviera con éxito para el Event Store. Con los puntos 1, 2 y 3 de la tabla de remediación resueltos, este flujo estaría en condiciones razonables de evaluarse para una expansión más allá de un piloto de tenant único.
