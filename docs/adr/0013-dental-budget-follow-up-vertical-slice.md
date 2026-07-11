# ADR-0013: Dental Budget Follow-up Vertical Slice

| | |
|---|---|
| **Estado** | Propuesto — listo para implementación |
| **Fecha** | 2026-07-09 |
| **Alcance** | Un único flujo funcional real, un único vertical (Dental), un único modelo de clínica (independiente) |
| **Base obligatoria** | [ADR-0001](0001-arquitectura-base-atlas-ai.md)–[ADR-0012](0012-atlas-event-driven-architecture.md) · [AIF-0001](0008-atlas-intelligence-framework.md) · [AED-0001](0009-atlas-employee-designer.md) · [DKB-PAC-01 §6](../dkb/03_Paciente/DKB-PAC-01_Recorrido_Paciente.md) · [ABVL-01](../abvl/ABVL-01_Seguimiento_Presupuestos_Pendientes.md) |
| **Ley de este documento** | No se crea ningún motor, servicio de gobernanza ni mecanismo de datos nuevo que no esté ya definido en la base obligatoria. Cada pieza de este ADR es una instanciación concreta de algo ya existente — si un elemento de este flujo pareciera requerir algo nuevo, la resolución correcta es encontrar dónde ya vive en la arquitectura, no inventarlo aquí. |

---

## 0. Por qué este ADR existe

Doce ADR y dos frameworks fundamentales han definido, por separado, cómo piensa, decide, aprende y se audita ATLAS AI. Ninguno de ellos, todavía, ha demostrado que las piezas encajan de verdad, con datos reales, en un flujo de negocio completo de principio a fin. Este documento es esa prueba: **el seguimiento de un presupuesto dental pendiente**, exactamente la oportunidad ya identificada como la de mayor impacto económico del vertical ([ABVL-01](../abvl/ABVL-01_Seguimiento_Presupuestos_Pendientes.md)), implementada usando **únicamente** mecanismos ya definidos — Company Brain, Business DNA, Decision Engine, los motores de AIF-0001, Atlas Employee Designer y el Event Bus de ADR-0012.

Si este flujo requiere inventar algo nuevo para funcionar, la arquitectura de los doce ADR anteriores está incompleta. Si no lo requiere, queda demostrado que ATLAS AI es una plataforma coherente, no una colección de documentos bien escritos por separado.

---

## 1. Alcance funcional del MVP

Un presupuesto dental, para una clínica independiente de sede única (modelo priorizado como MVP en [DKB-EMP-01 §19](../dkb/01_Empresa/DKB-EMP-01_Modelos_Clinica.md)), recorre su ciclo completo: creación, aprobación de primer envío, envío, seguimiento sistemático gobernado ante ausencia de respuesta, decisión del paciente, atribución conservadora de ROI, y generación de señal de aprendizaje. Un único tratamiento por presupuesto (sin consolidación multi-especialidad, ver §20). Canal de comunicación asíncrono (mensajería), sin canal de voz en este MVP.

---

## 2. Actores

| Actor | Rol en el flujo |
|---|---|
| **Paciente** | Recibe el presupuesto y, si aplica, el seguimiento; responde aceptando, rechazando o planteando una duda |
| **Coordinador humano** | Crea o revisa el borrador del presupuesto; aprueba el primer envío (línea roja no negociable, [DKB-EMP-01](../dkb/01_Empresa/DKB-EMP-01_Modelos_Clinica.md)) |
| **Coordinador de Presupuestos Digital** | `DigitalEmployeeProfile` diseñado según [AED-0001](0009-atlas-employee-designer.md), ejecuta el seguimiento gobernado y resuelve dudas generales desde el Brain |
| **Gerente** | Configura los parámetros de Business DNA que gobiernan cadencia y tono (§9); observa el ROI atribuido resultante |

---

## 3. Estados del presupuesto

```
DRAFT ──▶ PENDING_APPROVAL ──▶ SENT ──▶ PENDING_DECISION
                                              │
                     ┌────────────────────────┼───────────────────────┐
                     ▼                        ▼                       ▼
              FOLLOW_UP_DUE              ACCEPTED                REJECTED
                     │                        ▲                       │
                     ▼                        │                       │
            FOLLOW_UP_ACTIVE ─────────────────┘                       │
                     │                                                 │
                     ├──▶ (vuelve a PENDING_DECISION si no hay         │
                     │     respuesta y quedan intentos)                │
                     │                                                 │
                     ▼                                                 ▼
                 EXPIRED ◀──────────────────────────────────────────────┘
                     │
                     ▼
                ARCHIVED ◀── (también alcanzable desde ACCEPTED o REJECTED)
```

| Estado | Significado |
|---|---|
| `DRAFT` | Borrador en construcción, aún no enviado a revisión |
| `PENDING_APPROVAL` | Esperando la aprobación humana obligatoria de primer envío |
| `SENT` | Enviado al paciente por primera vez |
| `PENDING_DECISION` | Esperando respuesta del paciente, sin seguimiento activo todavía |
| `FOLLOW_UP_DUE` | El tiempo mínimo sin respuesta se cumplió — candidato detectado por el Opportunity Engine |
| `FOLLOW_UP_ACTIVE` | Un intento de seguimiento está en curso o se acaba de enviar |
| `ACCEPTED` | Terminal — el paciente aceptó |
| `REJECTED` | Terminal — el paciente rechazó explícitamente |
| `EXPIRED` | Terminal — condiciones caducadas o intentos máximos agotados sin respuesta |
| `ARCHIVED` | Terminal final — housekeeping tras periodo de retención |

---

## 4. Transiciones permitidas

| Desde | Hacia | Disparador |
|---|---|---|
| `DRAFT` | `PENDING_APPROVAL` | Coordinador humano o Coordinador de Presupuestos Digital completa el borrador |
| `PENDING_APPROVAL` | `SENT` | Aprobación humana concedida (`APPROVAL_GRANTED`, ADR-0005 §4.4) |
| `PENDING_APPROVAL` | `DRAFT` | Aprobación denegada, se devuelve a edición |
| `SENT` | `PENDING_DECISION` | Confirmación de entrega del mensaje |
| `PENDING_DECISION` | `ACCEPTED` / `REJECTED` | Respuesta directa del paciente, sin necesidad de seguimiento |
| `PENDING_DECISION` | `FOLLOW_UP_DUE` | Tiempo mínimo sin respuesta cumplido (§9) — Opportunity Engine |
| `FOLLOW_UP_DUE` | `FOLLOW_UP_ACTIVE` | Recomendación autorizada y enviada (§9–§10) |
| `FOLLOW_UP_ACTIVE` | `PENDING_DECISION` | Intento enviado, a la espera, con intentos restantes |
| `FOLLOW_UP_ACTIVE` | `ACCEPTED` / `REJECTED` | Respuesta del paciente tras el intento de seguimiento |
| `FOLLOW_UP_DUE` / `FOLLOW_UP_ACTIVE` / `PENDING_DECISION` | `EXPIRED` | Condiciones caducadas o intentos máximos agotados |
| `ACCEPTED` / `REJECTED` / `EXPIRED` | `ARCHIVED` | Vencimiento del periodo de retención operativa |

Ninguna otra transición es válida — cualquier intento de transición fuera de esta tabla se rechaza como error de contrato (ADR-0006 §7), nunca se ejecuta de forma silenciosa.

---

## 5. Eventos de dominio

Estos doce eventos **refinan y registran en el Event Catalog** (ADR-0012 §4) las entradas genéricas `BudgetCreated`/`BudgetAccepted` ya anticipadas en [ADR-0012 §13](0012-atlas-event-driven-architecture.md), y añaden las entradas granulares del sub-flujo de seguimiento que ese catálogo todavía no detallaba.

| Evento | Transición que representa | Módulo emisor |
|---|---|---|
| `BudgetCreated` | Creación de `DRAFT` | Coordinador humano / Coordinador de Presupuestos Digital |
| `BudgetApproved` | `PENDING_APPROVAL → SENT` (aprobación) | Decision Engine |
| `BudgetSent` | Entrada a `SENT` | Tool Executor (envío confirmado) |
| `BudgetFollowUpDue` | `PENDING_DECISION → FOLLOW_UP_DUE` | Opportunity Engine (AIF-0001 §6.1) |
| `BudgetFollowUpProposed` | Propuesta concreta de acción de seguimiento | Recommendation Engine (AIF-0001 §6.3) |
| `BudgetFollowUpAuthorized` | Autorización de la propuesta | Decision Engine (`CapabilityGate`) |
| `BudgetFollowUpSent` | Entrada a `FOLLOW_UP_ACTIVE` | Tool Executor |
| `BudgetPatientResponded` | Respuesta recibida, pendiente de clasificar | Conversation Manager |
| `BudgetAccepted` | Entrada a `ACCEPTED` | Decision Engine (tras Validation Engine) |
| `BudgetRejected` | Entrada a `REJECTED` | Decision Engine (tras Validation Engine) |
| `BudgetExpired` | Entrada a `EXPIRED` | `BudgetLifecycleService` (§16) |
| `ROIAttributed` | Atribución de valor tras desenlace | ROI Engine (AIF-0001 §6.5) |

No toda transición interna genera un evento de dominio propio — la transición `PENDING_APPROVAL → DRAFT` (rechazo interno de aprobación), por ejemplo, ya queda capturada en `decision_events`/`approval_requests` (ADR-0005 §11) sin necesidad de un tipo de evento adicional, coherente con la disciplina de no proliferación de ADR-0012 §17.

---

## 6. Payload de cada evento

Todos los eventos usan la envolvente común `EventEnvelope<T>` ya definida en [ADR-0012 §6](0012-atlas-event-driven-architecture.md). Payload específico por tipo:

| Evento | Payload |
|---|---|
| `BudgetCreated` | `budgetId`, `patientReferenceId`, `treatmentType`, `value`, `phases[]`, `validUntil` |
| `BudgetApproved` | `budgetId`, `approvedByUserId`, `approvalRequestId` (ref. a ADR-0005 §11) |
| `BudgetSent` | `budgetId`, `channel`, `sentAt` |
| `BudgetFollowUpDue` | `budgetId`, `opportunityCandidateId` (ref. AIF-0001 §6.1), `daysSinceSent` |
| `BudgetFollowUpProposed` | `budgetId`, `recommendationId` (ref. AIF-0001 §6.3), `proposedChannel`, `proposedContentSummary` |
| `BudgetFollowUpAuthorized` | `budgetId`, `attemptNumber`, `capabilityGrantId` |
| `BudgetFollowUpSent` | `budgetId`, `attemptNumber`, `channel`, `idempotencyKey` (§8), `sentAt` |
| `BudgetPatientResponded` | `budgetId`, `responseChannel`, `responseReceivedAt` |
| `BudgetAccepted` | `budgetId`, `acceptedAfterFollowUp` (bool), `attemptNumberAtAcceptance` |
| `BudgetRejected` | `budgetId`, `rejectionReasonCategory` (opcional, si el paciente lo indicó) |
| `BudgetExpired` | `budgetId`, `expirationReason` (`conditions_expired` \| `max_attempts_reached`) |
| `ROIAttributed` | `budgetId`, `attributedValue`, `attributionBasis` (§12), `confidenceScore` |

Ningún payload contiene contenido clínico ni el texto literal de la conversación con el paciente — solo referencias e identificadores (§14).

---

## 7. `correlationId` y `causationId` durante todo el recorrido

Un único `correlationId` (`corr-budget-<budgetId>`) se asigna en `BudgetCreated` y se propaga sin excepción a los doce eventos de este flujo. La cadena causal se encadena evento a evento:

```
BudgetCreated (causationId: null)
   └─▶ BudgetApproved (causationId: BudgetCreated.eventId)
         └─▶ BudgetSent (causationId: BudgetApproved.eventId)
               └─▶ BudgetFollowUpDue (causationId: BudgetSent.eventId)
                     └─▶ BudgetFollowUpProposed (causationId: BudgetFollowUpDue.eventId)
                           └─▶ BudgetFollowUpAuthorized (causationId: BudgetFollowUpProposed.eventId)
                                 └─▶ BudgetFollowUpSent (causationId: BudgetFollowUpAuthorized.eventId)
                                       └─▶ BudgetPatientResponded (causationId: BudgetFollowUpSent.eventId)
                                             └─▶ BudgetAccepted (causationId: BudgetPatientResponded.eventId)
                                                   └─▶ ROIAttributed (causationId: BudgetAccepted.eventId)
```

Esta cadena es, literalmente, lo que el Explainability Engine (AIF-0001 §6.8) recorre para responder "¿por qué se atribuyó este ROI?" con una respuesta trazable evento a evento, no una reconstrucción aproximada — es la aplicación directa y concreta de lo que ADR-0012 §6 prometía en abstracto.

---

## 8. Modelo de idempotencia

`BudgetFollowUpSent` es una acción **no idempotente por naturaleza** — enviar el mismo mensaje dos veces a un paciente es un contacto duplicado real, no un efecto neutro. Se aplica el mismo principio de ADR-0006 §9:

- Cada intento de envío lleva una `idempotencyKey` determinista (`budgetId` + `attemptNumber`).
- Antes de ejecutar un envío, el `ToolExecutorService` (ADR-0006 §9) verifica si esa `idempotencyKey` ya tiene un registro de envío exitoso — si lo tiene, no reintenta, solo confirma el estado ya alcanzado.
- Un fallo transitorio de infraestructura durante el envío se reintenta con backoff (ADR-0006 §8) **antes** de confirmar el envío, nunca después — evita duplicidad por reintento tardío.
- Los eventos en sí (`BudgetFollowUpSent`, etc.) son también deduplicables por `eventId` en el consumo, coherente con la garantía de "al menos una vez" del Event Bus (ADR-0012 §2).

---

## 9. Reglas declarativas de seguimiento

Un `FollowUpPolicy` por organización y, si aplica, por tipo de tratamiento — resuelto por `FollowUpPolicyResolver` (§16) combinando tres fuentes, nunca hardcodeado:

| Regla | Fuente de resolución |
|---|---|
| **Tiempo mínimo** antes del primer seguimiento | Business DNA — apetito de riesgo comercial (PVD-0003 §1) |
| **Cadencia** entre intentos sucesivos | Business DNA, calibrable con el tiempo por el Learning Engine (AIF-0001 §6.6), nunca aplicado automáticamente sin revisión en Knowledge Studio |
| **Número máximo de intentos** | Business DNA — mismo apetito de riesgo |
| **Importe** del presupuesto | Company Brain — usado por el Priority Engine para ordenar candidatos, no para decidir si se hace seguimiento o no |
| **Tipo de tratamiento** | Company Brain — ventana de decisión típica por tratamiento ([DKB-PAC-01 §6](../dkb/03_Paciente/DKB-PAC-01_Recorrido_Paciente.md)) |
| **Canal preferido** | Perfil de contacto del paciente, vía Integrations Hub |
| **Condiciones caducadas** | Campo `validUntil` del propio presupuesto — un presupuesto con condiciones vencidas nunca genera un nuevo intento, transiciona directamente a `EXPIRED` |

Un presupuesto marcado `REJECTED` **nunca** vuelve a generar un `BudgetFollowUpDue`, sin excepción — regla ya establecida en [ABVL-01 §10](../abvl/ABVL-01_Seguimiento_Presupuestos_Pendientes.md), aplicada aquí como invariante del propio `BudgetLifecycleService`.

---

## 10. Integraciones

| Sistema | Rol exacto en este flujo |
|---|---|
| **Company Brain** (ADR-0002) | Fuente del tarifario y del catálogo de tratamientos citado en `BudgetCreated`; fuente de la ventana de decisión típica por tratamiento (§9) |
| **Business DNA** (PVD-0003) | Fuente de los parámetros de cadencia, tiempo mínimo y máximo de intentos (§9); fuente del `DNAToneProfile` del mensaje de seguimiento |
| **Decision Engine** (ADR-0005) | Gobierna la aprobación de primer envío (`APPROVAL_REQUIRED`) y la autorización de cada intento de seguimiento (`CapabilityGate`); clasifica la respuesta del paciente vía Validation Engine antes de `BudgetAccepted`/`BudgetRejected` |
| **Atlas Employee Designer** (AED-0001) | Define el `DigitalEmployeeProfile` del Coordinador de Presupuestos Digital: su `capability_grant` (dominio Precios y Presupuestos, acción de envío de seguimiento), su objetivo (literalmente el de [ABVL-01 §21](../abvl/ABVL-01_Seguimiento_Presupuestos_Pendientes.md)) |
| **Opportunity Engine** (AIF-0001 §6.1) | Detecta la transición `PENDING_DECISION → FOLLOW_UP_DUE` con el algoritmo ya definido en ABVL-01 §9 |
| **Priority Engine** (AIF-0001 §6.4) | Ordena este candidato frente a otras señales activas del tenant, por valor económico × confianza |
| **Recommendation Engine** (AIF-0001 §6.3) | Sintetiza `BudgetFollowUpProposed` — canal, contenido, momento — a partir de la oportunidad y el Business DNA |
| **ROI Engine** (AIF-0001 §6.5) | Calcula `ROIAttributed` con el criterio conservador de §12 |
| **Explainability Engine** (AIF-0001 §6.8) | Reconstruye la cadena completa de §7 bajo demanda |
| **Event Bus** (ADR-0012) | Transporta los doce eventos de §5, registrados en el Event Catalog antes de la primera emisión en producción |

---

## 11. Aprobaciones humanas necesarias

| Momento | Aprobación requerida |
|---|---|
| Primer envío del presupuesto (`PENDING_APPROVAL → SENT`) | **Siempre**, sin excepción — línea roja del vertical |
| Intentos de seguimiento sucesivos, dentro de la política ya autorizada | No requiere aprobación individual — `ACTION_AUTHORIZED` directo, una vez el proceso general fue activado por la clínica |
| Cualquier objeción o duda del paciente fuera del conocimiento general del Brain | Escala a humano (`AgentConsultationRouter`, ADR-0005 §4.6) |
| Cualquier negociación de condiciones económicas | Siempre requiere aprobación humana |
| Clasificación ambigua de la respuesta del paciente (ni claramente aceptación ni rechazo) | Nunca se asume — escala a humano antes de cualquier transición terminal |

---

## 12. Criterio conservador de atribución de ROI

`ROIAttributed` se emite **únicamente** cuando existe la secuencia causal completa: `BudgetSent → BudgetFollowUpDue → BudgetFollowUpSent → BudgetAccepted`, en ese orden, con `causationId` verificable en cada paso (§7) — exactamente la disciplina ya fijada en [ABVL-01 §14](../abvl/ABVL-01_Seguimiento_Presupuestos_Pendientes.md) y [PVD-0007 §6](../pvd/0007-roi-intelligence-platform.md).

Si `PENDING_DECISION → ACCEPTED` ocurre **sin pasar nunca** por `FOLLOW_UP_DUE`, no se emite `ROIAttributed` como ingreso recuperado — el presupuesto se habría cerrado igual sin intervención, y atribuirle valor sería inflar la cifra. Ese caso se registra como conversión de línea base, no como valor generado por el mecanismo de seguimiento.

---

## 13. Manejo de errores y reintentos

Aplicando directamente la taxonomía de [ADR-0006 §7–§8](0006-digital-employee-runtime.md):

| Situación | Categoría | Tratamiento |
|---|---|---|
| Proveedor de mensajería caído al enviar el seguimiento | Error transitorio de infraestructura | Reintento con backoff, nunca duplica el envío (§8) |
| Fallo del LLM Adapter al componer el mensaje de seguimiento | Error de contrato / regeneración | Reintento acotado (mismo límite que `REJECTED`, ADR-0005 §6) |
| `POLICY_CONFLICT` inesperado en una autorización de seguimiento | Resultado de gobernanza, no error | Se detiene ese intento, se notifica al gerente, nunca se fuerza |
| Todos los reintentos de envío agotados | Error irrecuperable de ese intento | El presupuesto permanece en `FOLLOW_UP_DUE`, se reintenta en el siguiente ciclo de cadencia, nunca se marca `EXPIRED` solo por un fallo técnico puntual |

---

## 14. Protección de datos

- Ningún payload de evento de §6 contiene contenido clínico — solo `patientReferenceId` (un identificador, nunca datos de salud), `treatmentType` como categoría del catálogo, y valores económicos.
- El presupuesto en sí vive en el sistema de gestión clínica de la clínica (vía Integrations Hub) — el Event Bus y el Brain nunca almacenan la ficha del paciente, coherente sin excepción con [PVD-0005 §5](../pvd/0005-atlas-dental-intelligence-blueprint.md) ("Company Brain ≠ Historia Clínica").
- Toda acción sobre un presupuesto concreto (humana o del Coordinador Digital) queda registrada con su `agent_id`/`user_id`, visible para el gerente en cualquier momento (ADR-0006 §10).
- Cualquier acceso de soporte de ATLAS AI al contenido de un presupuesto concreto requiere `SupportAccessGrant` (ADR-0010 §10), nunca acceso directo.

---

## 15. Esquema exhaustivo de datos

### 15.1 Reutilizadas sin cambio

`policies`, `approval_requests`, `decision_events`, `validation_events`, `run_events`, `knowledge_units`, `PlatformEvent` (Event Store, ADR-0012 §16).

### 15.2 Nuevas de este ADR

| Tabla | Propósito | Columnas clave |
|---|---|---|
| `budgets` | La entidad Presupuesto y su estado actual | `id`, `organization_id`, `patient_reference_id`, `treatment_type`, `value`, `phases` (json), `state`, `valid_until`, `correlation_id`, `created_at` |
| `follow_up_policies` | Reglas declarativas resueltas de §9, versionadas | `id`, `organization_id`, `treatment_type` (nullable = por defecto), `min_time_days`, `cadence_days`, `max_attempts`, `source` (`dna_default`/`override`) |
| `follow_up_attempts` | Cada intento individual de seguimiento | `id`, `budget_id`, `attempt_number`, `channel`, `idempotency_key`, `sent_at`, `status` |
| `roi_attributions` | Instancia específica de `ROIEvent` (AIF-0001 §6.5) para este flujo | `id`, `budget_id`, `attributed_value`, `attribution_basis`, `confidence_score`, `correlation_id` |

`budget_state_transitions` **no se crea como tabla separada** — es una proyección derivada del Event Store (ADR-0012 §3), reconstruible por completo vía Event Replay a partir de los doce eventos de §5. Crear una tabla paralela contradiría la decisión arquitectónica ya fijada en ese ADR.

Todas las tablas nuevas heredan `organization_id` + RLS (ADR-0001 §5.2), sin excepción.

---

## 16. Server Actions y servicios necesarios

### 16.1 Server Actions (mutaciones de usuario)

| Server Action | Transición que dispara |
|---|---|
| `createBudgetDraft` | Crea `DRAFT`, emite `BudgetCreated` |
| `submitBudgetForApproval` | `DRAFT → PENDING_APPROVAL` |
| `approveBudgetSend` | Aprobación humana, dispara `BudgetApproved` → `SENT` |
| `recordPatientResponse` | Captura una respuesta entrante, dispara `BudgetPatientResponded` |
| `resolveBudgetDecision` | Tras clasificación del Decision/Validation Engine, dispara `BudgetAccepted`/`BudgetRejected` |

### 16.2 Servicios reutilizados sin modificar

`DecisionEngineService`, `CapabilityGate`, `PolicyEvaluator`, `ApprovalOrchestrator`, `ConfidenceScorer`, `ExplanationBuilder` (ADR-0005 §12); `ContextEngineService` (ADR-0003 §13); `PromptBuilderService`, `LLMAdapterService`, `ToolExecutorService` (ADR-0006 §9); instancias de Opportunity/Priority/Recommendation/ROI/Explainability Engine (AIF-0001 §6); `EmployeeDesignerService` (AED-0001 §22).

### 16.3 Servicios nuevos, específicos de este flujo

| Servicio | Responsabilidad |
|---|---|
| `BudgetLifecycleService` | Único responsable de validar y ejecutar transiciones de estado de §3–§4 — ninguna otra parte del sistema muta `budgets.state` directamente |
| `FollowUpPolicyResolver` | Resuelve el `FollowUpPolicy` efectivo de §9 combinando Business DNA, Company Brain y perfil de paciente |
| `BudgetROIAttributionService` | Aplica el criterio conservador de §12, delegando el cálculo real al ROI Engine — no reimplementa su lógica |

Ninguno de estos tres servicios nuevos contiene lógica de gobernanza, razonamiento o puntuación propia — son adaptadores finos que aplican los motores ya existentes al dominio concreto de Presupuesto.

---

## 17. Estrategia de pruebas

| Nivel | Casos obligatorios |
|---|---|
| **Unitarias** | Toda transición de §4 válida se acepta, toda transición fuera de tabla se rechaza; `idempotencyKey` impide doble envío; `ROIAttributed` nunca se genera sin la secuencia causal completa de §12 |
| **Integración** | El primer envío nunca omite `APPROVAL_REQUIRED`; el Opportunity Engine detecta `FOLLOW_UP_DUE` exactamente al cumplirse el tiempo mínimo configurado, ni antes ni después; `correlationId` se propaga sin pérdida en los doce eventos de un mismo presupuesto |
| **End-to-end** | (a) Camino completo con seguimiento y aceptación — verifica `ROIAttributed` correcto; (b) camino de aceptación directa sin seguimiento — verifica que **no** se genera `ROIAttributed` como ingreso recuperado (§12); (c) camino de rechazo — verifica que nunca se genera un intento posterior; (d) camino de expiración por intentos agotados; (e) reconstrucción completa de la cadena de explicación por el Explainability Engine desde cualquier estado terminal hasta `BudgetCreated` |

---

## 18. Estrategia para sustituir datos mock sin romper la demo existente

La demo del minuto 15 del onboarding ([PVD-0002 §10](../pvd/0002-first-customer-experience.md)) depende de un contrato de presentación — streaming, citas, explicación adjunta — no de que los datos detrás sean reales o simulados. Este flujo se activa detrás de esa misma interfaz sin modificar su contrato:

1. **Abstracción de fuente de datos.** La UI de onboarding consume un `ContextPackage` y un `ExplanationPackage` con la misma forma exacta, venga de un escenario simulado o de este flujo real — el cambio ocurre por debajo del contrato ya fijado en ADR-0006 §12, nunca en él.
2. **Activación por cohorte.** Se reutiliza el mismo mecanismo de despliegue escalonado ya definido en [ADR-0010 §5 y §7](0010-atlas-command-control-architecture.md) — el flujo real se activa primero para clínicas piloto seleccionadas, con el resto de tenants todavía sobre el escenario simulado hasta validación completa.
3. **Sin ruptura de guion.** El guion de la demo (pregunta ya relacionada con la tarea elegida, respuesta con citas, caso de aprobación en vivo) se mantiene idéntico — lo único que cambia, cohorte a cohorte, es si el presupuesto de ejemplo proviene de datos reales de la clínica o de un escenario preconstruido.

---

## 19. Criterios verificables de aceptación

- [ ] Ningún presupuesto alcanza `SENT` sin un `BudgetApproved` previo con aprobación humana registrada y auditada.
- [ ] Ningún `BudgetFollowUpSent` existe sin un `BudgetFollowUpAuthorized` previo con el mismo `correlationId`.
- [ ] Un presupuesto en `REJECTED` nunca genera un evento `BudgetFollowUpDue` posterior.
- [ ] `ROIAttributed` solo se emite cuando la cadena causal completa de §12 existe y es verificable evento a evento.
- [ ] El número de intentos de seguimiento de cualquier presupuesto nunca excede el `max_attempts` configurado en su `FollowUpPolicy` efectiva.
- [ ] Ningún payload de evento de este flujo contiene información clínica (verificable por revisión de esquema del Event Catalog).
- [ ] El Explainability Engine reconstruye, para cualquier presupuesto en estado terminal, la cadena completa desde `BudgetCreated` sin huecos.
- [ ] La demo existente de PVD-0002 §10 sigue funcionando sin cambios de contrato tras activar este flujo en una cohorte piloto.
- [ ] Ningún envío duplicado de seguimiento ocurre ante un reintento de infraestructura (verificable por unicidad de `idempotencyKey` con envío confirmado).

---

## 20. Qué queda expresamente fuera del MVP

- Consolidación de presupuestos multi-especialidad ([DKB-PAC-01 §12](../dkb/03_Paciente/DKB-PAC-01_Recorrido_Paciente.md), [ABVL-12](../abvl/00_Master_Index.md)).
- Financiación externa real ([ABVL-07](../abvl/00_Master_Index.md)) — se referencia informativamente si aplica, sin gestión de solicitud de crédito.
- Modelos de clínica multi-sede, franquicia o grupo ([DKB-EMP-01](../dkb/01_Empresa/DKB-EMP-01_Modelos_Clinica.md)) — el MVP asume una única sede independiente.
- Canal de voz/llamada para el seguimiento — solo mensajería asíncrona en este MVP.
- Aplicación automática de calibración de cadencia por el Learning Engine — el MVP **genera** la señal de aprendizaje (§9), no la aplica sin revisión humana en Knowledge Studio.
- Comparativas de benchmarking de este flujo vía Atlas Intelligence Network — se activa en una fase posterior, no en este MVP.

---

## 21. Riesgos

| Riesgo | Severidad | Mitigación |
|---|---|---|
| Presión de calendario lleva a implementar un atajo de gobernanza "solo para este MVP" | Alta | La ley del documento (cabecera) se trata como no negociable — cualquier atajo es, por definición, una violación de este ADR, no una excepción válida |
| El criterio conservador de ROI (§12) se relaja bajo presión comercial para mostrar cifras más atractivas en la demo piloto | Alta | Mismo principio de PVD-0007 §11 — el ROI de un mes modesto se muestra igual que uno alto |
| La cohorte piloto de activación (§18) no representa bien la diversidad de clínicas independientes reales | Media | Selección deliberada de clínicas piloto con perfiles distintos (volumen, especialidad principal), no solo la más fácil de integrar |

---

## 22. Decisiones abiertas

- Valores exactos por defecto de `min_time_days`, `cadence_days` y `max_attempts` en `follow_up_policies` — a calibrar con las primeras clínicas piloto, nunca fijados por intuición sin revisión posterior.
- Criterio exacto de selección de las clínicas piloto de la cohorte de activación (§18).
- Si `resolveBudgetDecision` debe soportar clasificación multi-turno (varias interacciones antes de una decisión clara) en esta primera versión, o si toda ambigüedad prolongada escala directamente a humano sin más intentos automáticos de clarificación.
