# ADR-0014: Production Data Runtime & Fallback Strategy

| | |
|---|---|
| **Estado** | Propuesto — listo para implementación, con hallazgos de auditoría del código actual |
| **Fecha** | 2026-07-09 |
| **Base obligatoria** | [ADR-0001](0001-arquitectura-base-atlas-ai.md) · [ADR-0010](0010-atlas-command-control-architecture.md) · [ADR-0012](0012-atlas-event-driven-architecture.md) · [ADR-0013](0013-dental-budget-follow-up-vertical-slice.md) |
| **Decisión obligatoria** | LocalDB puede existir como herramienta de desarrollo o demostración, **pero nunca debe activarse automáticamente en producción cuando Supabase falle.** Un fallo de Supabase en producción es un error visible, nunca una sustitución silenciosa de datos. |

---

## 0. Estado actual, auditado

Antes de definir la estrategia, este ADR registra lo que existe hoy en el repositorio — no es un escenario hipotético, es el punto de partida real que este documento gobierna y que debe remediarse.

| Hallazgo | Ubicación | Riesgo si se despliega tal cual |
|---|---|---|
| `LocalDB` — una clase que persiste a un archivo JSON en disco (`.data/atlas_db.json`), pensada como sustituto de Supabase mientras Docker no está disponible en desarrollo | `src/lib/services/local-db.ts` | Es hoy el **único** almacén del Event Bus y del flujo de presupuestos — no un fallback, la fuente primaria de facto |
| El Event Bus completo (ADR-0012) lee y escribe exclusivamente en `LocalDB`, sin ninguna ruta hacia Supabase | `src/lib/services/event-bus.ts` | El Event Store de ADR-0012 §3 no existe todavía como tabla real — existe como archivo JSON local |
| Las Server Actions del flujo de presupuestos (ADR-0013) llaman directamente a `LocalDB`/`EventBusService` | `src/app/actions/orchestrator.ts`, `src/app/actions/budget.ts`, `src/app/actions/roi.ts` | El flujo demostrado en ADR-0013 no es, todavía, el flujo que correría en producción |
| Tres instanciaciones de cliente Supabase independientes y no coordinadas | `src/lib/supabase/client.ts`, `src/lib/supabase/server.ts`, `src/lib/repositories/dental-knowledge.ts` | Sin contrato único, cada una gestiona variables de entorno y errores de forma distinta |
| Fallback silencioso real: captura errores de Supabase y devuelve un array mock, con solo un `console.warn` como señal | `src/lib/repositories/dental-knowledge.ts` (todos sus métodos) | Es exactamente el patrón que la Decisión Obligatoria de este ADR prohíbe — invisible en producción salvo revisión manual de logs |
| Variables de entorno de Supabase resueltas con `\|\| ''` (cadena vacía silenciosa) en vez de fallo explícito | `src/lib/repositories/dental-knowledge.ts` | Una configuración ausente no falla — se comporta como si la configuración existiera, con un cliente inválido |
| Repositorios sin contrato compartido — algunos llaman a Supabase, algunos a `LocalDB`, algunos devuelven arrays fijos sin llamar a nada | `src/lib/repositories/*.ts` | Ningún criterio uniforme de qué es una fuente de datos legítima en cada entorno |
| Migraciones ya en curso con una convención numérica de 5 dígitos, parcialmente alineada con esta serie de ADR | `supabase/migrations/00001`–`00010` | Base real sobre la que este ADR construye — no se empieza de cero |
| Directorio de seeds ya iniciado, sin política de aislamiento formalizada | `supabase/seeds/` | Riesgo de que datos de ejemplo se confundan con datos reales sin un marcador explícito (§6) |

Cada sección siguiente de este documento resuelve uno o más de estos hallazgos de forma explícita.

---

## 1. Fuente de verdad por entorno

Seis conceptos distintos, cada uno con una única fuente de verdad legítima — nunca intercambiables entre sí de forma implícita:

| Concepto | Qué es | Fuente de datos legítima | Cuándo se activa |
|---|---|---|---|
| **Producción** | El sistema sirviendo a clientes reales | Supabase — proyecto de producción | Siempre, sin excepción, sin fallback de ningún tipo |
| **Desarrollo local** | Un ingeniero trabajando en su máquina | Supabase local (CLI + Docker) | Por defecto en desarrollo, cuando Docker está disponible |
| **Fallback local (LocalDB)** | Conveniencia de desarrollo cuando Docker no está disponible | `LocalDB` (archivo JSON local) | Solo con una bandera explícita de desarrollo, nunca automática, nunca en un entorno desplegado (ni Preview ni Producción) |
| **Modo DEMO** | Presentación deliberada — a un prospecto de Discovery (ADR-0011), en onboarding (PVD-0002) | Supabase (proyecto o rama de demo) sembrado con datos de ejemplo — o `LocalDB`, solo si la demo es explícitamente portátil/sin conexión | Activado por configuración explícita, **nunca** como consecuencia de un fallo de Supabase |
| **Datos simulados** | Contenido de ejemplo usado dentro de cualquiera de los anteriores | Seeds versionados y aislados (§6) | Se cargan de forma explícita, nunca se generan de improviso dentro de código de producción |
| **Datos reales de cliente** | El contenido real de un tenant | Supabase de producción, aislado por RLS (ADR-0001 §5) | Solo en producción |

La distinción que importa no es "Supabase frente a no-Supabase" — es **explícito frente a implícito**. Cualquiera de estas fuentes es legítima en su contexto declarado; ninguna lo es si aparece por sustitución silenciosa de otra.

---

## 2. Prohibición de fallback silencioso en producción

Regla sin excepción: **un fallo de Supabase en producción se propaga como error visible — nunca se absorbe devolviendo datos de otro origen.**

- Ningún `catch` de una llamada a Supabase en código de producción puede devolver un valor sustituto (mock, array vacío con apariencia de válido, `LocalDB`) sin que ese fallo quede, como mínimo, registrado como incidencia de severidad alta y visible en Atlas Control Tower (ADR-0010 §8, §16) — nunca solo un `console.warn`.
- **Hallazgo a remediar**: `src/lib/repositories/dental-knowledge.ts` implementa hoy exactamente el patrón prohibido — cada método captura el error de Supabase, emite un `console.warn`, y devuelve un array mock como si fuera una respuesta válida. Este patrón se elimina como parte de la adopción de este ADR (§20), sustituido por propagación de error explícita.
- **Degradación observable, sí; sustitución silenciosa, no.** Un disyuntor (circuit breaker) que, tras fallos repetidos, marca una funcionalidad como "degradada" y lo comunica activamente (evento `TenantHealthDegraded`, ADR-0012 §13) es una respuesta legítima. Devolver datos falsos disfrazados de reales no lo es, sin importar cuán bienintencionada sea la implementación.
- Las variables de entorno de conexión a Supabase nunca se resuelven con un valor por defecto silencioso (`|| ''`) — su ausencia debe fallar de forma explícita al arrancar el proceso, no producir un cliente inválido que falla más tarde de forma opaca.

---

## 3. Contrato común de repositorios

Todo repositorio de datos de la plataforma implementa un **contrato único**, independientemente de si su implementación concreta apunta a Supabase de producción, Supabase local, o (solo en desarrollo) `LocalDB`:

- Métodos con forma idéntica sin importar la fuente subyacente — el código que consume un repositorio nunca sabe, ni le importa, si detrás hay Supabase o `LocalDB`, salvo por la garantía de que el contrato se cumple igual.
- Ningún método captura un error de su fuente de datos y devuelve un valor sustituto por su cuenta — cualquier error se propaga al llamador, que decide cómo tratarlo según el principio de §2.
- Una única fábrica de cliente Supabase por proceso (servidor) y por navegador (cliente) — **hallazgo a remediar**: hoy existen tres instanciaciones independientes (`src/lib/supabase/client.ts`, `src/lib/supabase/server.ts`, y una tercera dentro de `src/lib/repositories/dental-knowledge.ts` que evita las dos anteriores). Se consolidan en una única fábrica por contexto, sin excepciones de conveniencia.
- El origen de datos activo (Supabase de producción, Supabase local, `LocalDB`, seed de demo) se **inyecta por configuración de entorno**, nunca se decide dentro del propio código de un repositorio.

---

## 4. Estrategia de feature flags

Reutiliza el mismo mecanismo de despliegue por cohortes ya definido en [ADR-0010 §5 y §7](0010-atlas-command-control-architecture.md), aplicado aquí a la migración de cada repositorio desde su implementación actual (mock fijo, `LocalDB`, o fallback silencioso) hacia el contrato de §3 respaldado por Supabase real:

- Cada repositorio migrado se activa primero tras una bandera de característica, verificable en un subconjunto de tráfico o de tenants, antes de convertirse en el comportamiento por defecto.
- Ninguna bandera de característica determina el **modo** de entorno (producción/demo/desarrollo) — eso lo determina exclusivamente la configuración de entorno de §1, nunca una condición evaluada en tiempo de ejecución dentro de la lógica de negocio.

---

## 5. Modo DEMO explícito

**No existe todavía en el código auditado** — este documento define lo que debe existir.

- Un modo DEMO se activa por configuración explícita (variable de entorno o equivalente), nunca de forma implícita ni como resultado de la ausencia de configuración de producción.
- Corre sobre Supabase (proyecto o rama de demo) sembrado con los datos de §6, salvo el caso explícito de una demo portátil sin conexión, donde `LocalDB` es una elección deliberada y declarada — nunca una sustitución de emergencia.
- El comportamiento observado en modo DEMO debe respetar el mismo contrato de repositorios (§3) que producción — coherente con la disciplina ya fijada en [ADR-0013 §18](0013-dental-budget-follow-up-vertical-slice.md): la demo cambia de fuente de datos, nunca de contrato de presentación.
- Un usuario o proceso interno siempre puede determinar, sin ambigüedad, si está operando en modo DEMO — nunca es una condición oculta.

---

## 6. Datos seed aislados

El directorio `supabase/seeds/` ya iniciado en el repositorio se formaliza con una regla de aislamiento obligatoria:

- Todo dato sembrado se marca de forma verificable como tal (p. ej. un espacio de identificadores de organización reservado exclusivamente a semillas, nunca compartido con el rango usado por tenants reales).
- Ningún dato de `supabase/seeds/` se ejecuta jamás contra el proyecto de Supabase de producción — es una operación técnicamente imposible por configuración, no solo una política a respetar.
- Los seeds están versionados igual que las migraciones (§9) — un cambio en los datos de ejemplo es una revisión auditable, no una edición manual ad-hoc.

---

## 7. RLS y aislamiento entre tenants

Este documento no redefine el aislamiento multi-tenant — reafirma que [ADR-0001 §5](0001-arquitectura-base-atlas-ai.md) se aplica sin excepción a **cualquier** tabla nueva introducida por esta serie de ADR, incluido el Event Store unificado de ADR-0012 §3 una vez implementado sobre Supabase (§10). Ninguna tabla nueva se considera completa sin su política RLS correspondiente revisada.

---

## 8. Service Role y límites de uso

La clave de rol de servicio de Supabase (que evita RLS) se usa exclusivamente en contextos de servidor de confianza y para operaciones explícitamente privilegiadas — migraciones, el Plano de Control de ADR-0010, agregaciones anonimizadas entre tenants (PVD-0006 §5, ADR-0010 §18). Nunca es accesible desde código ejecutable en el navegador, y nunca se usa como atajo para evitar la fricción normal de RLS en un repositorio de uso general. Se audita, como parte de la remediación de §20, que ninguna de las tres instanciaciones de cliente encontradas hoy (§0) use esta clave fuera de un contexto server-only ya verificado.

---

## 9. Migraciones y rollback

Se formaliza la convención ya en curso en el repositorio (`supabase/migrations/00001`–`00010`, numeración secuencial de cinco dígitos):

- Toda migración es secuencial, nunca se edita una ya aplicada — un cambio posterior es una migración nueva.
- Toda migración de esquema que sustente un ADR de esta serie declara, en un comentario de cabecera del propio archivo, a qué ADR corresponde (p. ej. `00010_dental_budget_followup.sql` corresponde a ADR-0013) — trazabilidad directa entre decisión arquitectónica y esquema real.
- Toda migración debe tener una vía de reversión razonable documentada, salvo que sea explícitamente irreversible (p. ej. una migración de expurgo de datos) — en cuyo caso esa irreversibilidad se declara, no se descubre en el momento de necesitar revertir.

---

## 10. Event Store en Supabase

**Hallazgo directo de §0**: el `PlatformEvent` descrito conceptualmente en [ADR-0012 §3 y §16](0012-atlas-event-driven-architecture.md) no existe hoy como tabla de Supabase — el Event Bus completo (`src/lib/services/event-bus.ts`) opera exclusivamente sobre `LocalDB`.

Este ADR fija la migración de esa pieza como la de mayor prioridad de remediación (§20): el Event Store debe implementarse como una tabla real de Supabase, con las garantías de durabilidad, orden y aislamiento por tenant ya exigidas en ADR-0012 §2–§3, antes de que el flujo de presupuestos de ADR-0013 pueda considerarse listo para producción. Mientras esa migración no se complete, cualquier demo o piloto basado en el estado actual del código debe declararse explícitamente como **modo DEMO sobre `LocalDB`** (§1, §5) — nunca presentarse ni desplegarse como si fuera comportamiento de producción.

---

## 11. Procesamiento asíncrono y reintentos

La tecnología concreta de cola asíncrona sigue siendo una decisión abierta heredada de [ADR-0001 §11](0001-arquitectura-base-atlas-ai.md) — este documento no la resuelve, pero fija una restricción sobre ella: cualquiera que sea la tecnología elegida, debe operar sobre estado durable respaldado por Supabase, nunca sobre el archivo JSON de `LocalDB`, que no ofrece garantías reales de concurrencia segura para procesamiento en cola.

---

## 12. Idempotencia distribuida

Extiende directamente la disciplina ya fijada en [ADR-0013 §8](0013-dental-budget-follow-up-vertical-slice.md): una clave de idempotencia (p. ej. `idempotencyKey` de un intento de seguimiento) debe reforzarse con una **restricción de unicidad a nivel de base de datos**, no solo verificarse en lógica de aplicación — es la única forma de garantizar la propiedad bajo solicitudes concurrentes o reintentadas. Un almacén como `LocalDB`, sin transacciones ni restricciones reales, no puede ofrecer esta garantía — otra razón concreta, no solo de principio, por la que nunca es una base legítima de producción.

---

## 13. Logs y observabilidad

Todo error de origen de datos (Supabase inaccesible, migración fallida, restricción de unicidad violada) se registra con severidad estructurada, nunca solo como texto de consola — alimenta directamente Atlas Control Tower (ADR-0010 §8–§9). El hallazgo de §0 (`console.warn` como única señal de un fallback ya en curso) es, en sí mismo, un ejemplo de observabilidad insuficiente que este ADR corrige por diseño, no solo por buena práctica.

---

## 14. Backups y recuperación

ATLAS AI adopta la infraestructura de backup y recuperación punto-en-el-tiempo ya nativa de Supabase como línea base de producción — coherente con el principio ya establecido de no reinventar infraestructura que la plataforma subyacente ya resuelve bien (ADR-0001 §7). No se construye un mecanismo de backup propio salvo necesidad demostrada que la oferta nativa no cubra.

---

## 15. Retención y expurgo

Misma decisión abierta heredada de ADR-0003 §15, ADR-0005 §14, ADR-0007 §18, ADR-0010 §19 y ADR-0012 §18 — este documento le da, por fin, un lugar de ejecución concreto: un mecanismo programado sobre Supabase (función programada o equivalente) que aplique la política una vez definida, operando sobre el Event Store unificado de §10. Los valores exactos de retención siguen pendientes de decisión de negocio y cumplimiento normativo, no de arquitectura.

---

## 16. Gestión de secretos

Las claves de Supabase (clave anónima pública, clave de rol de servicio secreta) se gestionan como variables de entorno de Vercel, nunca en código versionado, nunca con un valor de conveniencia si faltan. El patrón `process.env.X || ''` encontrado en `src/lib/repositories/dental-knowledge.ts` (§0) es, en la práctica, un problema de gestión de secretos además de un problema de fallback: una configuración ausente debe impedir el arranque del proceso de forma explícita, no producir un cliente aparentemente válido con credenciales vacías.

---

## 17. Despliegue Vercel + Supabase

- **Producción** (Vercel Production) apunta exclusivamente al proyecto de Supabase de producción.
- **Preview** (despliegues de PR en Vercel) apunta a un proyecto o rama de Supabase no productiva — nunca al proyecto real, sin excepción, para que una revisión de código no pueda tocar datos reales de cliente por error de configuración.
- **Desarrollo** apunta a Supabase local o, con bandera explícita, a `LocalDB` (§1).

---

## 18. Pruebas de seguridad

- Pruebas automatizadas de política RLS que verifiquen, de forma activa, que una consulta con credenciales de un tenant nunca puede leer ni escribir datos de otro (ADR-0001 §5).
- Verificación de que la clave de rol de servicio nunca aparece en el paquete de JavaScript entregado al navegador.
- Prueba específica de regresión sobre el hallazgo de §0: verificar que ningún repositorio de producción captura un error de Supabase y devuelve un valor sustituto sin propagar el error.

---

## 19. Criterios de preparación para producción

- [ ] El Event Store de ADR-0012 está implementado como tabla real de Supabase, con RLS verificada — `EventBusService` ya no depende de `LocalDB` para ningún entorno desplegado.
- [ ] El flujo de presupuestos de ADR-0013 opera sobre el contrato de repositorios de §3, respaldado por Supabase, no por `LocalDB`.
- [ ] `src/lib/repositories/dental-knowledge.ts` ya no contiene ningún `catch` que devuelva un valor mock — todo error se propaga.
- [ ] Existe una única fábrica de cliente Supabase por contexto (servidor/navegador), y las tres instanciaciones independientes encontradas en la auditoría (§0) se han consolidado.
- [ ] Ninguna variable de entorno de conexión a Supabase se resuelve con un valor por defecto silencioso.
- [ ] El modo DEMO (§5) existe como configuración explícita y verificable, distinta de producción y de desarrollo.
- [ ] Los seeds de `supabase/seeds/` están aislados con un marcador verificable, nunca ejecutables contra producción.
- [ ] Preview de Vercel nunca apunta al proyecto de Supabase de producción.
- [ ] Las pruebas de seguridad de §18 pasan, incluida la prueba de regresión específica del hallazgo de fallback silencioso.

---

## 20. Plan para retirar progresivamente `LocalDB` de cualquier ruta de producción

`LocalDB` no se elimina — se **acota**, en fases, hasta que su único rol legítimo sea el ya declarado en la Decisión Obligatoria: herramienta de desarrollo sin Docker, o elección deliberada para una demo portátil sin conexión.

| Fase | Acción |
|---|---|
| **1** | Formalizar el contrato común de repositorios (§3); `LocalDB` se convierte en una implementación más de ese contrato, seleccionable solo por bandera explícita de desarrollo (§4) |
| **2** | Migrar el Event Store (§10) a una tabla real de Supabase — máxima prioridad, es la pieza que hoy sostiene por completo el Event Bus de ADR-0012 |
| **3** | Migrar las Server Actions del flujo de presupuestos (`orchestrator.ts`, `budget.ts`, `roi.ts`) para que consuman el contrato de §3 respaldado por Supabase, no `LocalDB`/`EventBusService` directamente |
| **4** | Eliminar el fallback silencioso de `dental-knowledge.ts` (§2), sustituido por propagación de error explícita y degradación observable |
| **5** | Consolidar las tres instanciaciones de cliente Supabase en una única fábrica por contexto (§3, §8) |
| **6** | Verificar, con los criterios de §19, que ninguna ruta de código alcanzable desde Preview o Producción puede, bajo ninguna condición de fallo, terminar escribiendo o leyendo de `LocalDB` |

Al final de esta fase, `LocalDB` sigue existiendo en el repositorio — como una implementación explícita y deliberada del contrato de repositorios, nunca como una posibilidad silenciosa de lo que production podría hacer si algo falla.

---

## 21. Riesgos

| Riesgo | Severidad | Mitigación |
|---|---|---|
| Presión de plazo hace que la migración del Event Store (§10, Fase 2) se posponga indefinidamente mientras el producto se sigue demostrando sobre `LocalDB` | Alta | Criterio de preparación para producción (§19) explícitamente bloqueante — ninguna demo pasa de "modo DEMO declarado" a "producción" sin esta migración completa |
| La eliminación del fallback silencioso de `dental-knowledge.ts` (Fase 4) expone errores que antes quedaban ocultos, generando ruido inicial de incidencias | Media | Esperado y deseable — es exactamente la visibilidad que este ADR busca recuperar; se acompaña de la observabilidad de §13 para no saturar sin contexto |
| Consolidar tres clientes Supabase en uno introduce una regresión si alguno tenía una configuración implícita distinta no documentada | Media | Auditoría explícita de las tres instanciaciones actuales (§0) antes de la consolidación, no una sustitución mecánica sin revisión |

---

## 22. Decisiones abiertas

- Tecnología exacta de cola asíncrona (§11) — decisión heredada de ADR-0001 §11, todavía sin resolver.
- Valores exactos de retención y expurgo (§15) — pendiente de decisión de negocio y cumplimiento normativo.
- Si el modo DEMO (§5) debe soportar, desde el primer momento, tanto la variante sobre Supabase sembrado como la variante portátil sobre `LocalDB`, o si la segunda se pospone a una fase posterior.
- Mecanismo exacto de marcado de datos seed (§6) — un rango de identificadores reservado frente a una columna explícita `is_seed_data`, a decidir con el esquema real de cada tabla.
