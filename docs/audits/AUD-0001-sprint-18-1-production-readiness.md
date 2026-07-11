# AUD-0001 — Auditoría de Preparación para Producción: Sprint 18.1

| | |
|---|---|
| **Tipo** | Auditoría técnica objetiva — no es un ADR |
| **Fecha** | 2026-07-11 |
| **Auditor** | Principal Software Auditor de ATLAS AI |
| **Alcance** | Implementación real de Sprint 18.1 frente a [ADR-0012](../adr/0012-atlas-event-driven-architecture.md), [ADR-0013](../adr/0013-dental-budget-follow-up-vertical-slice.md), [ADR-0014](../adr/0014-production-data-runtime-and-fallback-strategy.md) |
| **Metodología** | Lectura directa de código fuente, migraciones SQL y configuración; ejecución real de `npm run test` y `npm run build`. **No se ha dado por válida ninguna afirmación de `walkthrough.md` ni de ningún resumen — todo hallazgo está anclado a archivo y línea verificados en este mismo turno.** |

---

## Veredicto ejecutivo

**No listo para producción. Bloqueante: el build falla. Crítico: el aislamiento por tenant no existe a nivel de base de datos, y el pipeline de eventos/ROI prometido por ADR-0012/0013 no opera sobre Supabase pese a que existe una implementación paralela correcta pero desconectada.**

Hay trabajo real y de buena calidad en esta entrega — el patrón de fábrica de repositorios (`BudgetRepositoryFactory`), la tabla `dental_budgets` respaldada por Supabase, y una implementación de configuración de servidor (`server-environment.ts`) que sí aplica correctamente la Decisión Obligatoria de ADR-0014. El problema no es ausencia de esfuerzo — es que **la pieza bien diseñada (`server-environment.ts` + `EventStoreFactory` + `SupabaseEventStoreRepository`) nunca se conectó al camino de código que realmente se ejecuta**, mientras que el camino que sí se ejecuta (`environment.ts` + `EventBusService` + `LocalDB`) es exactamente el patrón que ADR-0014 prohíbe.

---

## Hallazgos por punto de verificación

### 1. ¿Existe `platform_events` en migraciones Supabase?

**CONFIRMADO**, con una reserva crítica.

- Evidencia: `supabase/migrations/00010_dental_budget_followup.sql:7-21` — tabla `platform_events` con `organization_id`, `event_type`, `correlation_id`, `causation_id`, `idempotency_key UNIQUE`, tal como especifica ADR-0012 §6, §16.
- **Reserva crítica**: la misma migración, líneas 88-103, activa RLS (`ENABLE ROW LEVEL SECURITY`) pero inmediatamente la neutraliza con `CREATE POLICY "Allow all operations for now" ... USING (true)` en las seis tablas nuevas, incluida `platform_events`. La tabla existe; el aislamiento que se supone debe imponer, no.

### 2. ¿`EventBusService` escribe y lee de Supabase en modo `SUPABASE`?

**NO CONFIRMADO — incumplido.**

- Evidencia: `src/lib/services/event-bus.ts:1,6,19,27,43,50` — `EventBusService.emit()` y `.processQueue()` importan y usan `LocalDB` de forma incondicional. No existe ninguna rama, condición ni parámetro que dirija estas operaciones hacia Supabase bajo ningún modo.
- Existe una implementación Supabase completa y correctamente diseñada en paralelo — `src/lib/repositories/events/supabase-event-store.repository.ts` + `src/lib/repositories/events/event-store.factory.ts` — pero **está huérfana**: ningún archivo fuera de su propio módulo la importa ni la invoca (verificado por búsqueda exhaustiva de referencias).
- El propio autor de `SupabaseBudgetRepository` lo admite en un comentario: `src/lib/repositories/budget/supabase-budget.repository.ts:109-110` — *"El EventBusService actual usa LocalDB temporalmente. Para Production Readiness, debe usar SupabaseEventStore."*

### 3. ¿`budget.ts`, `orchestrator.ts` y `roi.ts` acceden directa o indirectamente a `LocalDB`?

| Archivo | Acceso directo | Acceso indirecto |
|---|---|---|
| `src/app/actions/budget.ts` | No — usa `BudgetRepositoryFactory` correctamente en los 4 métodos | Sí — la fábrica puede resolver a `LocalDB` por configuración ausente (ver punto 8) |
| `src/app/actions/orchestrator.ts` | **Sí** — `LocalDB.getDB()` en la línea 9, sin ninguna fábrica ni condición de entorno | — |
| `src/app/actions/roi.ts` | **Sí** — `LocalDB.getDB()` en la línea 6, sin ninguna fábrica ni condición de entorno | — |

### 4. ¿Se utiliza `BudgetRepositoryFactory` en todas las rutas?

**Incumplido — solo parcialmente.**

- `budget.ts` sí la usa en sus 4 Server Actions.
- `orchestrator.ts` y `roi.ts` **no la usan en absoluto** — acceden a `LocalDB` de forma directa, incumpliendo el contrato común de repositorios exigido en ADR-0014 §3.

### 5. ¿Existe cualquier fallback automático de Supabase a mock, fixtures o `LocalDB`?

**Confirmado, en cuatro formas distintas:**

1. **Fallback silencioso explícito** en `src/lib/repositories/dental-knowledge.ts` (detalle en el punto 6).
2. **Fallback por ausencia de configuración**: `BudgetRepositoryFactory.getRepository()` (`src/lib/repositories/budget/budget.factory.ts:9-17`) resuelve `ENVIRONMENT.DATA_SOURCE`, que por defecto (`src/config/environment.ts:5`) es `'LOCAL'` si `NEXT_PUBLIC_DATA_SOURCE` no está definida. **Se verificó que `.env.local` del propio proyecto no define esta variable** — es decir, el propio entorno de desarrollo activo hoy resolvería a `LocalBudgetRepository` de forma silenciosa.
3. **Contaminación real+mock** en `orchestrator.ts:8-17` — combina eventos reales de `LocalDB` con eventos mock de `OrchestratorRepository.getLiveEvents()` en la misma respuesta ("Unir reales y mocks"), sin distinguirlos para el consumidor.
4. **Inflación de cifra de negocio** en `roi.ts:10-15` — suma un valor hardcodeado (`baseValue = 42500`) al ROI real acumulado y lo presenta como una única cifra `totalGenerated`, sin distinguir origen. Esto no es solo un incumplimiento de ADR-0014 §2 — es una violación directa de la disciplina anti-inflación de [PVD-0007 §11](../pvd/0007-roi-intelligence-platform.md): la cifra de ROI mostrada nunca debería mezclar un valor inventado con uno real sin etiquetar.

### 6. ¿`dental-knowledge.ts` sigue capturando errores y devolviendo mocks?

**Confirmado, sin remediar desde la auditoría previa.**

- 6 bloques `catch` (líneas 28, 45, 63, 105, 120, 135), cada uno devuelve un array hardcodeado ante cualquier error de Supabase.
- Solo 1 de los 6 (`getDomains`) registra la incidencia (`console.warn`, línea 29) — los otros 5 fallan en completo silencio, sin ningún registro.
- Sigue usando su propia instanciación de cliente (`createClient(supabaseUrl, supabaseKey)`, línea 15) con `process.env.NEXT_PUBLIC_SUPABASE_URL || ''` (línea 11) — una variable de configuración ausente produce un cliente inválido en vez de un fallo explícito al arrancar.

### 7. ¿Cuántas fábricas/clientes Supabase existen realmente?

**Cuatro puntos de creación de cliente**, no unificados:

| Archivo | Contexto | Estado |
|---|---|---|
| `src/lib/supabase/client.ts` | Navegador (`createBrowserClient`) | Legítimo — patrón estándar de Next.js SSR |
| `src/lib/supabase/server.ts` | Servidor (`createServerClient`) | Legítimo |
| `src/lib/supabase/middleware.ts` | Middleware (`createServerClient` inline) | Legítimo |
| `src/lib/repositories/dental-knowledge.ts` | Independiente, `createClient` de `@supabase/supabase-js` | **Duplicado no coordinado** — bypasea las tres fábricas anteriores |

### 8. ¿`NEXT_PUBLIC_DATA_SOURCE` se utiliza de forma segura?

**Incumplido en los tres criterios exigidos por ADR-0014 §8.**

- No expone secretos directamente — es un modo, no una clave. *(único subcriterio que se cumple)*
- **Sí permite seleccionar `LocalDB` en producción**: no existe ningún guardia que lo impida. El valor por defecto ante ausencia de configuración es `'LOCAL'` (`src/config/environment.ts:5`), sin ninguna comprobación de `runtimeMode`.
- **Sí depende de una variable pública para una decisión crítica del servidor**: `BudgetRepositoryFactory.getRepository()`, invocada dentro de Server Actions (`budget.ts`), decide su fuente de datos leyendo `ENVIRONMENT.DATA_SOURCE`, construida desde `NEXT_PUBLIC_DATA_SOURCE`.

**Hallazgo relevante**: existe, en paralelo, una implementación **correcta** de esta misma decisión — `src/config/server-environment.ts` — que usa variables **sin prefijo público** (`ATLAS_RUNTIME_MODE`, `ATLAS_DATA_PROVIDER`) y **falla explícitamente al arrancar** (`throw`) si el modo es `production` o `staging` y el proveedor no es `supabase` (líneas 7-13). Es exactamente el comportamiento que exige la Decisión Obligatoria de ADR-0014. El problema no es que falte esta pieza — es que **nada del camino de ejecución real la usa**; solo la consume el `EventStoreFactory` huérfano del punto 2.

### 9. ¿Las pruebas RLS son reales contra PostgreSQL/Supabase o solo mocks unitarios?

**Incumplido — es el hallazgo de mayor severidad de esta auditoría.**

- `src/__tests__/supabase.rls.test.ts` mockea por completo `createClient` (`vi.mock`, línea 5-7) y simula el filtro `.eq('organization_id', ...)` en JavaScript puro — nunca toca una base de datos real.
- El propio comentario del test lo admite (líneas 18-20): *"En un entorno de base de datos real, el RLS evaluaría auth.uid() contra organization_id de forma invisible. Aquí simulamos el filtro explícito del repositorio."*
- Y, de forma más grave: **aunque existiera un test de integración real, fallaría**, porque la política RLS efectivamente desplegada (`00010_dental_budget_followup.sql:98-103`) es `USING (true)` — permite todas las operaciones a cualquier organización, sobre las seis tablas nuevas. No hay aislamiento de tenant que verificar porque no hay aislamiento de tenant implementado.

### 10. ¿La idempotencia está reforzada mediante restricciones `UNIQUE` reales en PostgreSQL?

**Parcial.**

- `platform_events.idempotency_key` sí tiene `UNIQUE` a nivel de columna (`00010_dental_budget_followup.sql:20`) — correcto en principio.
- Pero esa columna no está poblada por ningún código real: `EventBusService` no escribe en `platform_events` (punto 2).
- `roi_events` **no tiene ninguna restricción `UNIQUE`** sobre `event_id` pese a la relación conceptual 1:1 con un evento de aceptación — nada impide, a nivel de base de datos, una doble atribución de ROI ante procesamiento concurrente.
- No existe una tabla `follow_up_attempts` con clave de idempotencia por intento, tal como especifica [ADR-0013 §15.2](../adr/0013-dental-budget-follow-up-vertical-slice.md) — la idempotencia de envíos de seguimiento no está modelada en el esquema en absoluto.
- La única protección de idempotencia real y verificada hoy (`src/__tests__/budget.test.ts:61-91`) es una comprobación `.some()` en JavaScript sobre el array `roi_events` de `LocalDB` — no una restricción de base de datos, y por tanto no segura ante concurrencia real.

### 11. ¿El ROI se atribuye mediante eventos persistidos en Supabase?

**Incumplido.**

Toda la lógica de atribución (`EventRouterService.route`, caso `'BudgetAccepted'`, `event-bus.ts:65-85`) opera sobre `db.roi_events` de `LocalDB`. La Server Action `fetchROIMetrics` (`roi.ts`) lee exclusivamente de `LocalDB`. La tabla `roi_events` de Supabase existe en el esquema pero está vacía por diseño — ningún camino de código escribe en ella.

### 12. ¿El Event Replay funciona sobre Supabase?

**Incumplido — no implementado en absoluto**, ni sobre `LocalDB` ni sobre Supabase. No existe ningún `EventReplayService` ni `EventReplayJob` en el código fuente. La única aparición de la palabra "replay" es un comentario dentro del nombre de un caso de prueba de idempotencia (`budget.test.ts:86`), no una funcionalidad real.

### 13. ¿La Service Role se usa exclusivamente server-side?

**Cumplido, por ausencia — con matiz.**

No se encontró ningún uso de una clave de rol de servicio (`SERVICE_ROLE`) en todo `src/`, ni definida en `.env.local`. No hay fuga al cliente porque no hay uso en absoluto. El matiz: esto también significa que ninguna operación privilegiada del Plano de Control (ADR-0010 §8, agregaciones entre tenants) está implementada todavía — no hay nada más que auditar en esta dimensión más allá de confirmar la ausencia.

### 14. ¿`npm run test` y `npm run build` pasan realmente?

- **`npm run test`: PASA.** 2 archivos, 4 pruebas, 928ms. Ejecutado y verificado en este turno.
- **`npm run build`: FALLA.** Ejecutado y verificado en este turno — error de TypeScript real:
  ```
  ./src/app/(dashboard)/[tenantId]/dental/budgets/views/BudgetList.tsx:15:33
  Type error: Argument of type 'Budget[] | undefined' is not assignable to
  parameter of type 'SetStateAction<any[]>'.
  ```
  El build de producción no se completa. Este hallazgo, por sí solo, descalifica cualquier despliegue a producción independientemente de cualquier otro resultado de esta auditoría.

**Nota sobre el alcance real de las pruebas que sí pasan**: las 4 pruebas de `npm run test` verifican lógica de negocio (la regla conservadora de atribución de ROI) correctamente — pero exclusivamente contra `LocalDB`. Ninguna prueba existente ejercita el código Supabase real, ninguna verifica una restricción `UNIQUE` a nivel de base de datos, y la única prueba con nombre "RLS" no es una prueba de RLS real (punto 9). Un build verde de tests no implica cobertura de lo que esta auditoría necesitaba verificar.

---

## Mapeo a los criterios de preparación para producción (ADR-0014 §19)

| Criterio de ADR-0014 §19 | Estado |
|---|---|
| Event Store implementado como tabla real de Supabase con RLS verificada | **Incumplido** — la tabla existe, pero la RLS es `USING (true)` y `EventBusService` no la usa |
| Flujo de presupuestos opera sobre el contrato de repositorios respaldado por Supabase | **Parcial → incumplido en la práctica** — el CRUD de `dental_budgets` sí usa Supabase; la emisión de eventos que gobierna todo el flujo sigue en `LocalDB` (split-brain) |
| `dental-knowledge.ts` sin `catch` que devuelva mock | **Incumplido** — sin cambios desde la redacción de ADR-0014 |
| Única fábrica de cliente Supabase por contexto | **Incumplido** — 4 puntos de creación, 1 no consolidado |
| Ninguna variable de entorno resuelta con valor por defecto silencioso | **Incumplido** — `dental-knowledge.ts` (`\|\| ''`) y `environment.ts` (`\|\| 'LOCAL'`) |
| Modo DEMO explícito y verificable | **Parcial** — existe `DemoBudgetRepository`, pero no está separado con claridad del comportamiento por defecto ante ausencia de configuración |
| Seeds aislados con marcador verificable | **No evaluado en esta auditoría** — pendiente de revisión específica de `supabase/seeds/` |
| Preview de Vercel nunca apunta a producción | **No evaluable desde el código fuente** — es configuración de proyecto Vercel, fuera del alcance de esta auditoría |
| Pruebas de seguridad pasan, incluida regresión de fallback silencioso | **Incumplido** — la única prueba "RLS" es un mock que no verifica nada real |

---

## Hallazgos críticos con remediación exacta

| # | Archivo | Función | Riesgo | Cambio exacto requerido | Prioridad |
|---|---|---|---|---|---|
| A | `supabase/migrations/00010_dental_budget_followup.sql` | Políticas `CREATE POLICY ... USING (true)` (líneas 98-103) | Cero aislamiento de tenant a nivel de base de datos en las 6 tablas nuevas — cualquier cliente autenticado puede leer/escribir datos de cualquier organización | Sustituir por políticas RLS reales que filtren por `organization_id` contra el claim de sesión, coherente con ADR-0001 §5.2 | **P0 — bloqueante** |
| B | `src/app/(dashboard)/[tenantId]/dental/budgets/views/BudgetList.tsx:15` | Componente de lista de presupuestos | `npm run build` falla — ningún despliegue es posible | Manejar el caso `res.data === undefined` antes de `setBudgets` (valor por defecto `[]` o guarda explícita) | **P0 — bloqueante** |
| C | `src/lib/services/event-bus.ts` | `EventBusService.emit`, `.processQueue`; `EventRouterService.route` | El pipeline de eventos completo de ADR-0012 no opera sobre Supabase pese a existir la implementación correcta ya construida | Sustituir las llamadas directas a `LocalDB` por `EventStoreFactory.getRepository()`, ya implementado en `src/lib/repositories/events/` | **P0 — bloqueante para considerar ADR-0012/0013 "en producción"** |
| D | `src/config/environment.ts` | Definición de `ENVIRONMENT.DATA_SOURCE` | Una variable pública, sin guardas, con valor por defecto `'LOCAL'`, gobierna una decisión crítica del servidor | Eliminar `ENVIRONMENT.DATA_SOURCE` como fuente de esta decisión; migrar `BudgetRepositoryFactory` a `SERVER_ENVIRONMENT.DATA_PROVIDER` (`server-environment.ts`), que ya implementa las guardas correctas | **P0** |
| E | `src/app/actions/roi.ts` | `fetchROIMetrics` | Inflación sistemática de la cifra de ROI mostrada al propietario (`baseValue = 42500` sumado sin distinción) — viola directamente PVD-0007 §11 | Eliminar `baseValue` hardcodeado; `totalGenerated` debe derivarse exclusivamente de eventos reales atribuidos, vía `EventStoreFactory`/tabla `roi_events` de Supabase | **P0** |
| F | `src/app/actions/orchestrator.ts` | `fetchOrchestratorData` | Contaminación de eventos reales con eventos mock en la misma respuesta, sin distinción para el consumidor | Eliminar la fusión con `OrchestratorRepository.getLiveEvents()`; la vista debe consumir exclusivamente `EventStoreFactory` | **P1** |
| G | `src/lib/repositories/dental-knowledge.ts` | Los 6 métodos con `catch (e)` | Fallback silencioso a datos mock ante cualquier fallo de Supabase, 5 de 6 casos sin ningún registro | Eliminar los bloques `catch` que devuelven mocks; propagar el error; consolidar el cliente con `src/lib/supabase/server.ts` | **P1** |
| H | `supabase/migrations/00010_dental_budget_followup.sql` | Tabla `roi_events` | Ninguna restricción `UNIQUE` sobre `event_id` — doble atribución posible bajo concurrencia | Añadir `UNIQUE(event_id)` a `roi_events` | **P1** |
| I | Esquema de datos (ausente) | — | No existe tabla `follow_up_attempts` con clave de idempotencia por intento, exigida en ADR-0013 §15.2 | Crear la tabla con `idempotency_key UNIQUE` antes de implementar el envío real de seguimientos | **P1** |
| J | Todo el pipeline de presupuestos | Máquina de estados | Los estados implementados (`DRAFT`, `PENDING_DECISION`, `FOLLOW_UP_SCHEDULED`, `ACCEPTED`, `REJECTED`, `EXPIRED`) no coinciden con los 10 estados de ADR-0013 §3 — falta `PENDING_APPROVAL`, `SENT`, `FOLLOW_UP_DUE`/`FOLLOW_UP_ACTIVE` diferenciados, `ARCHIVED`; y no se encontró ningún código que exija aprobación humana antes del primer envío | Alinear la máquina de estados exactamente con ADR-0013 §3-4, e implementar la puerta de aprobación humana obligatoria (§11) antes de considerar el flujo conforme | **P1 — gobernanza, no solo datos** |
| K | `src/__tests__/supabase.rls.test.ts` | Test completo | No verifica RLS real, solo simula filtrado en JavaScript; su propio comentario lo admite | Sustituir por una prueba de integración contra una instancia real de Postgres/Supabase local que verifique que la política RLS (una vez corregida, hallazgo A) rechaza acceso cruzado entre tenants | **P0** |

---

## Conclusión

Sprint 18.1 avanzó piezas reales y correctamente diseñadas — en particular `server-environment.ts` y el trío `IEventStoreRepository`/`SupabaseEventStoreRepository`/`EventStoreFactory` demuestran que el equipo sabe construir exactamente lo que ADR-0014 exige. El problema de esta entrega no es de diseño, es de **integración**: esas piezas correctas nunca se conectaron al camino de ejecución real, que sigue dependiendo de `LocalDB` y de una configuración insegura (`environment.ts`) para las operaciones que más importan — el Event Bus completo y la atribución de ROI.

Sumado a una política RLS que permite todo (hallazgo A) y a un build que no compila (hallazgo B), el veredicto es inequívoco: **esta entrega no cumple los criterios de ADR-0014 §19 y no debe presentarse como comportamiento de producción bajo ninguna circunstancia — incluida cualquier demo que pudiera confundirse con tal.**
