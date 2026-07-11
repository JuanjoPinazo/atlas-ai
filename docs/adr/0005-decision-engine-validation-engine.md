# ADR-0005: Decision Engine + Validation Engine

| | |
|---|---|
| **Estado** | Propuesto |
| **Fecha** | 2026-07-09 |
| **Depende de** | [ADR-0001: Arquitectura Base](0001-arquitectura-base-atlas-ai.md) · [ADR-0002: Company Brain](0002-company-brain.md) · [ADR-0003: Context Engine + Retrieval Pipeline](0003-context-engine-retrieval-pipeline.md) |
| **Relacionado con** | [PVD-0001: Product Vision](../pvd/0001-product-vision-atlas-ai.md) §7 ("Ningún agente actúa fuera de un alcance explícito", "Explicabilidad por encima de autonomía") |
| **Nota de numeración** | ADR-0004 no existe todavía — este documento se numera 0005 según instrucción explícita. Queda reservado para un ADR futuro (candidato natural: extracción de entidades/grafo semántico de ADR-0002, o diseño detallado del Capability Model). |

---

## 0. Principio rector

> **El LLM propone. El motor dispone.**

Hasta ahora, la arquitectura garantiza *qué conocimiento* llega a un agente (Company Brain, ADR-0002) y *cómo se recupera de forma presupuestada* (Context Engine, ADR-0003). Pero no ha definido todavía **quién decide qué hacer con ese conocimiento** — y ese es el hueco que cierra este ADR.

Un LLM es extraordinario generando texto y razonando sobre lenguaje. Es una mala elección como **árbitro de control**: no es determinista, no es completamente auditable en su proceso interno, y su "decisión" de actuar, detenerse o escalar no es reproducible ni verificable de la misma forma que una regla de negocio.

Por eso ATLAS AI introduce dos motores deterministas que envuelven cada interacción con el LLM:

- **Decision Engine** — antes de que cualquier salida del LLM tenga efecto en el mundo (una acción, una llamada a herramienta, una respuesta entregada), decide si esa salida está autorizada a proceder, y en qué forma.
- **Validation Engine** — después de que el LLM genera una respuesta candidata, verifica que cumple con permisos, políticas, compliance y estándares de calidad antes de que se considere definitiva.

Ninguno de los dos motores usa al LLM para decidir. Cuando alguno de ellos usa un LLM como fuente de una señal (p. ej. para detectar una posible alucinación), esa señal se trata como un dato de entrada más, evaluado contra umbrales deterministas — nunca como la decisión en sí (se detalla en §7).

---

## 1. Posición en la arquitectura

Se introduce una **nueva capa de control**, entre el conocimiento (ADR-0002/0003) y la ejecución (ADR-0001):

```
Capa 0 — Plataforma:         Tenancy · IAM · Permission/Capability Engine · Audit
Capa 1 — Conocimiento:        Company Brain · Context Engine
Capa 2 — Control:             DECISION ENGINE · VALIDATION ENGINE   ← nueva, este ADR
Capa 3 — Dominio de agentes:  Digital Employees (definiciones) · Integrations Hub
Capa 4 — Ejecución:           Agent Runtime · Workflows
Capa 5 — Interacción:         Conversations · Notifications
Capa 6 — Negocio:             Billing · Admin Console
```

Notas sobre esta capa:

- El **Permission/Capability Engine** se separa de "Digital Employees" y se reubica en Capa 0 (ya insinuado en ADR-0001 §6.1 como motor centralizado). Esto es necesario porque el Decision Engine depende de él directamente y no puede depender de Capa 3 sin crear un ciclo.
- **Agent Runtime nunca invoca al LLM sin pasar el resultado por el Decision Engine**, y **nunca entrega una respuesta al usuario/sistema sin que haya pasado por el Validation Engine**. No son pasos opcionales del pipeline de ejecución — son obligatorios por contrato de Agent Runtime.
- Digital Employees pasa a ser puramente **declarativo** (define rol, capacidades, dominios) — la aplicación de esas reglas en tiempo de ejecución ocurre en Capa 2, no en Capa 3.

---

## 2. El contrato de propuesta del LLM

Para que "el LLM nunca decida directamente" sea algo verificable y no solo una intención, la salida del LLM **nunca es directamente accionable**. Cada llamada al LLM dentro de un run debe devolver una **propuesta estructurada**, no texto libre ejecutado como si fuera una orden:

| Campo | Descripción |
|---|---|
| `proposal_type` | uno de: `response` (respuesta final candidata) · `context_request` (necesita más información) · `action_request` (quiere ejecutar una capability/tool) · `escalation_request` (cree que hace falta otro agente) · `abstain` (no puede proceder) |
| `payload` | contenido de la propuesta: texto de respuesta, sub-consulta de contexto, parámetros de acción, motivo de escalado |
| `citations[]` | ids de `KnowledgeUnit`+versión que el LLM afirma haber usado para cada afirmación relevante (obligatorio si `proposal_type = response`) |
| `self_reported_confidence` | señal declarada por el propio LLM (0–1) — es una señal más, nunca la última palabra |

El Decision Engine (para propuestas pre-ejecución) y el Validation Engine (para propuestas de tipo `response`) son los únicos componentes autorizados a convertir esta propuesta en un efecto real: una llamada a Context Engine, una ejecución de tool, una respuesta entregada, o una detención.

---

## 3. Máquina de estados de una ejecución

Cada `run_id` (Agent Runtime, ADR-0001) transita por un conjunto fijo y auditado de estados. Ningún estado se salta ni se infiere implícitamente.

| Estado | Significado | Quién lo produce |
|---|---|---|
| `CONTEXT_PENDING` | Run iniciado, aún no se solicitó contexto | Agent Runtime |
| `CONTEXT_EVALUATING` | `ContextPackage` recibido, evaluando suficiencia | Decision Engine |
| `CONTEXT_INSUFFICIENT` | Cobertura insuficiente detectada antes de invocar al LLM | Decision Engine |
| `GENERATING` | LLM invocado, esperando propuesta | Agent Runtime |
| `PROPOSAL_RECEIVED` | Propuesta estructurada recibida, pendiente de arbitraje | Decision Engine |
| `CONTEXT_REQUEST_AUTHORIZED` | Follow-up de contexto autorizado (dentro de límites, ADR-0003 §10.3) | Decision Engine |
| `ACTION_AUTHORIZED` | Acción dentro de capacidad del agente, sin aprobación requerida | Decision Engine |
| `APPROVAL_REQUIRED` | Acción requiere aprobación humana — ejecución en pausa | Decision Engine |
| `APPROVAL_GRANTED` / `APPROVAL_DENIED` | Resultado de la aprobación humana | Ser humano vía Admin/UI |
| `POLICY_CONFLICT` | Dos o más políticas aplicables producen veredictos contradictorios | Decision Engine |
| `AGENT_CONSULTATION_REQUIRED` | La tarea excede el dominio/capacidad del agente actual | Decision Engine |
| `RESPONSE_GENERATED` | Propuesta de tipo `response` recibida, pendiente de validación | Decision Engine |
| `VALIDATING` | Validation Engine ejecutando sus verificaciones | Validation Engine |
| `VALIDATED` | Respuesta aprobada, lista para entrega | Validation Engine |
| `REJECTED` | Respuesta rechazada — puede regenerarse (con límite) o detenerse | Validation Engine |
| `EXECUTION_HALTED` | Detención determinista (presupuesto, iteraciones, conflicto sin resolver) | Decision Engine |
| `COMPLETED` | Respuesta entregada | Agent Runtime |
| `FAILED` | Terminal, sin resolución posible dentro de los límites configurados | Decision Engine |

### Diagrama de transiciones (simplificado)

```
CONTEXT_PENDING
      │
      ▼
CONTEXT_EVALUATING ──(insuficiente)──▶ CONTEXT_INSUFFICIENT ──▶ (follow-up, ADR-0003) ──┐
      │(suficiente)                                                                     │
      ▼                                                                                 │
   GENERATING ◀────────────────────────────────────────────────────────────────────────┘
      │
      ▼
PROPOSAL_RECEIVED
      │
      ├─ context_request ──▶ CONTEXT_REQUEST_AUTHORIZED ──▶ (vuelve a GENERATING)
      ├─ action_request  ──▶ ACTION_AUTHORIZED ──▶ (Tool Executor, fin de este ciclo)
      │                  └─▶ APPROVAL_REQUIRED ──▶ APPROVAL_GRANTED/DENIED ──▶ (según resultado)
      │                  └─▶ POLICY_CONFLICT ──▶ EXECUTION_HALTED (nunca autoresuelto)
      ├─ escalation_request ▶ AGENT_CONSULTATION_REQUIRED ──▶ (Workflow, ADR-0001)
      ├─ abstain ──▶ EXECUTION_HALTED
      └─ response ──▶ RESPONSE_GENERATED ──▶ VALIDATING
                                                   │
                                        ┌──────────┴──────────┐
                                        ▼                     ▼
                                    VALIDATED             REJECTED
                                        │                     │
                                        ▼                     ├─(reintentos disponibles)─▶ GENERATING
                                    COMPLETED                  └─(agotados)─▶ EXECUTION_HALTED / FAILED
```

Toda transición se persiste (§10) — el historial completo de estados de un `run_id` es reconstruible sin ambigüedad.

---

## 4. Decisiones deterministas del Decision Engine

### 4.1 ¿Existe suficiente contexto?

Ocurre **antes de invocar al LLM**, usando exclusivamente metadatos del `ContextPackage` (ADR-0003) — no requiere generación:

- `coverage_score`: proporción de los dominios inferidos como relevantes para `task_intent` que efectivamente tienen unidades devueltas por encima de un umbral de `final_score`.
- `empty_result_flag`: si la recuperación no devolvió nada relevante en absoluto.
- `average_final_score` de las unidades devueltas, comparado contra un umbral mínimo configurable por dominio.

Si estas métricas caen bajo umbral, el estado pasa a `CONTEXT_INSUFFICIENT` **sin gastar una llamada al LLM** — se solicita automáticamente un follow-up de contexto (dentro de los límites de `max_follow_up_calls`, ADR-0003 §10.3) o, si el presupuesto de follow-ups ya está agotado, se pasa a `EXECUTION_HALTED` con motivo `insufficient_context_budget_exhausted`.

> **Nota de extensión a ADR-0003**: esto requiere que `ContextPackage` exponga `coverage_score`, `empty_result_flag` y `average_final_score` como campos del paquete, no solo como datos derivables del `RetrievalEvent`. Se registra como enmienda menor al contrato de §2 de ADR-0003.

### 4.2 ¿Necesita más información? (post-generación)

Si la propuesta del LLM es `context_request`, el Decision Engine no la ejecuta automáticamente solo porque el LLM la pidió: verifica que quede presupuesto de follow-up (`run_context_budgets`, ADR-0003 §8.3) y que la sub-consulta no repita una ya realizada en el mismo `run_id`. Si pasa ambas comprobaciones → `CONTEXT_REQUEST_AUTHORIZED`. Si no → se le devuelve al LLM una señal explícita de "presupuesto agotado" (mismo patrón que ADR-0003 §10.3), nunca un fallo silencioso.

### 4.3 ¿Puede ejecutar acciones?

Si la propuesta es `action_request`, el Decision Engine consulta el **Capability Model** (ADR-0001 §6.2) del agente: ¿la acción solicitada (tool/capability concreta + parámetros) está dentro del alcance declarado del `capability_grant_id` de este agente? Es una comprobación binaria y determinista contra una tabla de reglas, no una interpretación.

- Dentro de alcance + sin bandera de aprobación → `ACTION_AUTHORIZED`.
- Dentro de alcance + bandera de aprobación requerida (configurada por tipo de acción, ADR-0001 §6.2) → `APPROVAL_REQUIRED`.
- Fuera de alcance → rechazo inmediato, se registra como intento fuera de capacidad (señal de seguridad, ver §13) y el run pasa a `EXECUTION_HALTED` o, si el agente puede replantear sin esa acción, vuelve a `GENERATING` con la restricción señalada.

### 4.4 ¿Requiere aprobación humana?

Determinado enteramente por configuración declarativa del Capability Model — no por juicio del LLM ni del Decision Engine en el momento. El Decision Engine solo **aplica** la regla ya definida. Al entrar en `APPROVAL_REQUIRED`, se crea un `approval_request` (§11), se notifica (módulo Notifications, ADR-0001), y la ejecución queda genuinamente pausada — no hay temporizador que la autorice por defecto si nadie responde; el timeout, si existe, deriva a `EXECUTION_HALTED`, nunca a autorización implícita.

### 4.5 ¿Existe conflicto entre políticas?

El **Policy Evaluator** (§12) resuelve todas las políticas aplicables a una acción o respuesta propuesta (definidas en `policies`, §11). Si dos o más políticas producen veredictos contradictorios (una permite, otra prohíbe, para la misma acción) → `POLICY_CONFLICT`. Este estado **nunca se autoresuelve por prioridad implícita** — se detiene la ejecución y se escala a revisión humana explícita. Resolver conflictos de política silenciosamente (aunque sea con una regla de prioridad) es exactamente el tipo de decisión opaca que este ADR existe para prevenir.

### 4.6 ¿Debe consultar a otro agente?

Dos vías, ambas gatilladas de forma determinista:

1. **El LLM propone `escalation_request`** — el Decision Engine valida que la razón declarada sea consistente con un dominio real fuera de su capacidad (no acepta la propuesta a ciegas).
2. **El propio Decision Engine infiere la necesidad** — si un `action_request` o `context_request` implica un dominio (`KnowledgeDomain`) fuera de los `allowed_domains` del `capability_grant_id` del agente actual, se dispara `AGENT_CONSULTATION_REQUIRED` sin esperar a que el LLM lo pida.

En ambos casos, la resolución concreta (qué agente, cómo se le pasa contexto) se delega al módulo Workflows (ADR-0001) — el Decision Engine decide *que* hace falta consultar, no organiza la consulta en sí.

### 4.7 ¿Debe detener la ejecución?

`EXECUTION_HALTED` se alcanza por cualquiera de estas condiciones deterministas, sin excepción y sin intervención del LLM:

- Presupuesto de tokens del run agotado (ADR-0003 §8.3).
- `max_follow_up_calls` agotado con contexto aún insuficiente.
- `POLICY_CONFLICT` sin resolución humana en el tiempo configurado.
- Intento repetido de acción fuera de capacidad (umbral configurable, p. ej. 2 intentos).
- Reintentos de `REJECTED` por Validation Engine agotados (§6).
- Propuesta explícita `abstain` del LLM (el propio modelo declara que no puede proceder con lo que tiene).

---

## 5. Validation Engine — verificaciones sobre la respuesta

Solo se ejecuta sobre propuestas `RESPONSE_GENERATED` — es la última puerta antes de que algo llegue a un humano o a un sistema externo.

| Verificación | Qué comprueba | Cómo |
|---|---|---|
| **Permisos** | Que el `capability_grant_id` siga siendo válido en el momento de entrega (protección contra TOCTOU si el grant cambió durante la ejecución) | Re-consulta al Permission/Capability Engine, no reutiliza el resultado cacheado del Decision Engine |
| **Políticas** | Que la respuesta final no viole ninguna política aplicable a su contenido o canal de entrega | Policy Evaluator, mismo motor que §4.5 |
| **Compliance / GDPR** | Minimización de datos, ausencia de PII innecesaria, ninguna cita a `KnowledgeUnit` marcada para expurgo (derecho al olvido) | Regla determinista contra flags de la unidad citada (ver riesgo en ADR-0002 sobre retención) |
| **Información sensible** | Que el `sensitivity_level` de cada unidad citada sea compatible con el destinatario/canal de la respuesta | Comparación de `sensitivity_level` vs. clearance del destinatario, determinista |
| **Contradicciones** | Que la respuesta no contradiga una `KnowledgeUnit` canónica de mayor `final_score`/vigencia que no fue citada | `ContradictionDetector` compara afirmaciones contra el `snapshot_version` del `ContextPackage` |
| **Alucinaciones** | Que cada afirmación relevante tenga soporte en `citations[]`, y que esas citas existan realmente en el `ContextPackage` entregado | `HallucinationDetector`: cobertura de citas + verificación de que los `unit_id` citados no son inventados |
| **Confianza** | Puntuación agregada de fiabilidad de la respuesta | `ConfidenceScorer` combina `self_reported_confidence`, cobertura de citas y `final_score` promedio de las unidades citadas (ver §7) |
| **Explicación de la decisión** | Que exista una cadena de auditoría completa y legible: qué contexto, qué decisiones, qué validaciones | `ExplanationBuilder` ensambla el paquete de explicación; si no se puede construir uno completo, la respuesta se rechaza aunque el resto de checks pasen |

Cualquier verificación fallida produce `REJECTED` con un motivo estructurado (no un genérico "falló validación") — el motivo determina si se reintenta generación con retroalimentación explícita al LLM, se escala a `POLICY_CONFLICT`/`APPROVAL_REQUIRED` según el tipo de fallo, o se detiene el run.

---

## 6. Reintentos tras rechazo

Un `REJECTED` no es automáticamente un fallo del run. El Decision Engine decide el siguiente paso según el motivo:

- **Rechazo por alucinación/contradicción** → se regenera con retroalimentación explícita ("esta afirmación no tiene respaldo en el contexto entregado") — máximo N reintentos configurables (por defecto 2).
- **Rechazo por confianza baja** → si hay presupuesto de follow-up disponible, se intenta primero enriquecer contexto antes de regenerar; si no, se detiene.
- **Rechazo por compliance/información sensible** → nunca se reintenta automáticamente sin cambiar el contexto o el canal de entrega — se detiene y se marca para revisión, porque reintentar con el mismo contexto probablemente reproduce el mismo problema.
- **Reintentos agotados en cualquier caso** → `EXECUTION_HALTED` → `FAILED`, con el motivo original y el historial completo de intentos preservado en auditoría.

---

## 7. Nota sobre el uso de LLMs como verificadores

`HallucinationDetector` y `ContradictionDetector` pueden apoyarse en un modelo (el mismo LLM u otro más económico) como **juez auxiliar** para comparar una afirmación contra el contenido citado. Esto no contradice el principio rector de §0: la salida de ese modelo juez es, igual que la propuesta original, **una señal con una puntuación**, nunca una decisión. El `ConfidenceScorer` la combina con las demás señales deterministas (cobertura de citas, `final_score` de las unidades) y es la comparación contra un **umbral fijo y configurado** — no el juicio del modelo juez — la que produce `VALIDATED` o `REJECTED`. El modelo nunca tiene la última palabra; solo aporta un número más a una fórmula determinista.

---

## 8. Integración con Context Engine

- El Decision Engine es **cliente** del Context Engine (ADR-0003), nunca al revés — no hay dependencia circular.
- Toda solicitud de contexto adicional que el Decision Engine autoriza (§4.2) se traduce en un `ContextRequest` con `retrieval_mode = follow_up`, exactamente el contrato ya definido en ADR-0003 §2 — el Decision Engine no reimplementa recuperación, solo decide *si* se dispara.
- Los campos nuevos requeridos en `ContextPackage` (§4.1: `coverage_score`, `empty_result_flag`, `average_final_score`) se calculan dentro del propio pipeline de Context Engine (etapa de fusión/ranking, ADR-0003 §6–7), no en el Decision Engine — este último solo los consume.
- El `snapshot_version` del `ContextPackage` es el mismo que usa `ContradictionDetector` y `HallucinationDetector` del Validation Engine para verificar citas — garantiza que la validación se hace contra exactamente el mismo estado del Brain que vio el LLM al generar, no contra una versión más reciente que pudo haber cambiado mientras tanto (mismo principio de consistencia de lectura estable de ADR-0002 §11.4).

---

## 9. Flujo de extremo a extremo

```
Agent Runtime                Context Engine        Decision Engine         LLM              Validation Engine
     │                            │                       │                 │                      │
     │── ContextRequest(initial)─▶│                       │                 │                      │
     │◀──── ContextPackage ───────│                       │                 │                      │
     │                                                     │                 │                      │
     │── evaluar suficiencia ─────────────────────────────▶│                 │                      │
     │                                    (insuficiente)   │                 │                      │
     │◀──────── CONTEXT_INSUFFICIENT ─────────────────────│                 │                      │
     │── ContextRequest(follow_up) ──▶│                    │                 │                      │
     │◀──── ContextPackage (ampliado)─│                    │                 │                      │
     │                                                     │                 │                      │
     │── (suficiente) invocar LLM ────────────────────────────────────────▶│                      │
     │◀──────────────────────── proposal estructurada ─────────────────────│                      │
     │                                                     │                 │                      │
     │── arbitrar propuesta ──────────────────────────────▶│                 │                      │
     │                              (action_request, autorizado)            │                      │
     │◀──────────── ACTION_AUTHORIZED ────────────────────│                 │                      │
     │── ejecutar vía Tool Executor (ADR-0001) ─▶ [fin de este ciclo]        │                      │
     │                                                                                              │
     │                              (response)                                                       │
     │── arbitrar propuesta ──────────────────────────────▶│                 │                      │
     │◀──────────── RESPONSE_GENERATED ───────────────────│                 │                      │
     │── enviar a validación ──────────────────────────────────────────────────────────────────▶│
     │                                                                                    checks §5 │
     │◀───────────────────────────── VALIDATED / REJECTED ─────────────────────────────────────────│
     │
     │  (VALIDATED) → COMPLETED, entrega al usuario/sistema
     │  (REJECTED)  → §6: reintento acotado o EXECUTION_HALTED
```

Cada flecha de este diagrama corresponde a un evento persistido (§10) — el flujo completo de una ejecución es reconstruible después del hecho sin depender de logs no estructurados.

---

## 10. Auditoría

Sigue el mismo patrón ya establecido en ADR-0002 §9 y ADR-0003 §11: **todo evento de decisión o validación se registra, sin excepción, y alimenta el módulo Audit transversal de ADR-0001** como tipos de evento especializados (`decision.*`, `validation.*`).

- **`decision_events`**: una fila por cada transición de estado — qué propuesta se recibió, qué regla/umbral se evaluó, qué resultado produjo, con qué `capability_grant_id` y `snapshot_version`.
- **`validation_events`**: una fila por cada ejecución del Validation Engine — resultado de cada verificación individual (§5), no solo el veredicto final, para poder auditar *cuál* check falló y por qué.
- **`policy_evaluations`**: qué políticas se evaluaron para una decisión concreta y su veredicto individual — imprescindible para poder reconstruir un `POLICY_CONFLICT` después del hecho.
- **`approval_requests`**: ciclo de vida completo de cada aprobación humana — quién la resolvió, cuándo, con qué justificación si se proporcionó.

El `ExplanationBuilder` (§5) no genera una explicación nueva en el momento de pedirla — **ensambla** estos registros ya persistidos en una vista legible. La explicabilidad es una propiedad emergente de la auditoría completa, no una función añadida aparte.

---

## 11. Tablas necesarias

| Tabla | Propósito | Columnas clave |
|---|---|---|
| `agent_run_states` | Estado actual y transiciones de cada `run_id` | `run_id`, `organization_id`, `current_state`, `previous_state`, `entered_at`, `reason` |
| `decision_events` | Auditoría de cada decisión determinista (§10) | `id`, `run_id`, `proposal_type`, `rule_evaluated`, `input_signals` (json), `output_state`, `capability_grant_id`, `snapshot_version`, `created_at` |
| `policies` | Definición de políticas de negocio evaluables | `id`, `organization_id`, `domain_scope`, `rule_definition`, `verdict_type` (`allow`/`deny`/`require_approval`), `priority`, `active` |
| `policy_evaluations` | Resultado de evaluar políticas para una decisión concreta | `decision_event_id`, `policy_id`, `verdict`, `conflict_with_policy_id` (nullable) |
| `approval_requests` | Ciclo de vida de aprobaciones humanas | `id`, `run_id`, `action_requested` (json), `requested_at`, `resolved_by`, `resolution` (`granted`/`denied`/`timeout`), `resolved_at`, `justification` |
| `agent_consultation_requests` | Escalado a otro agente/dominio | `id`, `run_id`, `requesting_agent_id`, `required_domain`, `reason`, `resolved_via_workflow_id` |
| `validation_events` | Auditoría de cada verificación del Validation Engine (§10) | `id`, `run_id`, `response_proposal_id`, `check_name`, `result` (`pass`/`fail`), `detail` (json), `confidence_contribution`, `created_at` |
| `response_citations` | Mapeo de afirmaciones de una respuesta a `KnowledgeUnit` citadas | `response_proposal_id`, `claim_excerpt`, `unit_id`, `unit_version_id`, `citation_verified` (bool) |
| `execution_halts` | Registro de detenciones deterministas (§4.7) | `run_id`, `halt_reason`, `state_at_halt`, `retryable` (bool), `created_at` |

Todas las tablas nuevas heredan `organization_id` + RLS (ADR-0001 §5.2), sin excepción, igual que las tablas de ADR-0002 y ADR-0003.

---

## 12. Servicios necesarios

| Servicio | Responsabilidad | Entrada → Salida |
|---|---|---|
| `DecisionEngineService` | Orquesta la máquina de estados (§3), único punto de arbitraje de propuestas del LLM | propuesta estructurada + estado actual → nuevo estado |
| `ContextSufficiencyEvaluator` | Aplica §4.1 antes de invocar al LLM | `ContextPackage` → suficiente / insuficiente |
| `ProposalClassifier` | Valida que la propuesta del LLM tenga la forma esperada (§2) antes de arbitrarla | salida cruda del LLM → propuesta estructurada validada o rechazo por formato |
| `CapabilityGate` | Verifica una `action_request` contra el `capability_grant_id` (§4.3) | acción propuesta + grant → autorizado / requiere aprobación / fuera de alcance |
| `PolicyEvaluator` | Evalúa políticas aplicables, detecta conflictos (§4.5) | acción/respuesta + `organization_id` → veredictos + conflictos |
| `ApprovalOrchestrator` | Crea y resuelve `approval_requests`, pausa/reanuda el run | acción que requiere aprobación → resolución humana |
| `AgentConsultationRouter` | Determina y dispara consulta a otro agente (§4.6) | dominio requerido no cubierto → solicitud de consulta a Workflows |
| `HaltController` | Aplica las condiciones de §4.7 de forma centralizada | señales de presupuesto/reintentos/conflicto → decisión de detener o continuar |
| `ValidationEngineService` | Orquesta todas las verificaciones de §5 sobre una `response` | propuesta de respuesta → `VALIDATED` / `REJECTED` con motivo |
| `PermissionRevalidator` | Re-verifica permisos en el momento de entrega (protección TOCTOU) | `capability_grant_id` en el momento de entrega → válido / inválido |
| `ComplianceChecker` | GDPR, PII, expurgo, sensibilidad (§5) | respuesta + citas → conforme / no conforme |
| `ContradictionDetector` | Compara la respuesta contra el Brain en el `snapshot_version` del run | respuesta + `snapshot_version` → contradicción detectada / no |
| `HallucinationDetector` | Verifica cobertura y validez de `citations[]` | respuesta + `citations[]` + `ContextPackage` → cobertura verificada / afirmaciones sin soporte |
| `ConfidenceScorer` | Agrega señales (§7) en una puntuación final contra umbral | señales (LLM, citas, scores de recuperación) → puntuación + veredicto umbral |
| `ExplanationBuilder` | Ensambla la cadena de auditoría en una vista legible (§10) | `run_id` → paquete de explicación |

Estos servicios se ubican en un nuevo paquete `packages/decision-engine`, consumido por Agent Runtime (ADR-0001) y consumidor a su vez de `packages/company-brain` (ADR-0002/0003) y del Permission/Capability Engine de Capa 0. No contiene lógica de recuperación de conocimiento ni de generación — solo arbitraje y verificación.

---

## 13. Riesgos específicos

| Riesgo | Severidad | Mitigación |
|---|---|---|
| El Decision Engine se convierte en cuello de botella de latencia en cada ciclo de generación | Media-Alta | Las comprobaciones son consultas deterministas contra reglas/tablas indexadas, no invocaciones a LLM — diseñado para ser órdenes de magnitud más rápido que la generación misma |
| Reglas de política mal definidas producen `POLICY_CONFLICT` con demasiada frecuencia, degradando la experiencia | Media | `policy_evaluations` permite detectar políticas que colisionan sistemáticamente y corregirlas, no solo los conflictos puntuales |
| `HallucinationDetector`/`ContradictionDetector` basados en modelo-juez heredan el mismo riesgo de imprecisión que buscan detectar | Media | Se tratan como señal, no como veredicto (§7); umbral conservador por defecto, ajustable con datos reales de `validation_events` |
| Intentos repetidos fuera de capacidad no detectados a tiempo permiten a un agente "tantear" límites | Media | Umbral de intentos fallidos por capacidad (§4.7) con detención automática, registrado como señal de seguridad para revisión |
| `approval_requests` sin resolver bloquean ejecuciones indefinidamente | Media | Timeout configurable que deriva a `EXECUTION_HALTED`, nunca a autorización implícita (§4.4) |
| Reintentos tras `REJECTED` consumen presupuesto de tokens sin garantía de éxito | Media | Límite fijo de reintentos (§6) y consumo de reintento contado contra el techo acumulado del run (ADR-0003 §8.3) |

---

## 14. Decisiones abiertas

- Valores por defecto de umbrales: `coverage_score` mínimo, número de reintentos tras `REJECTED`, timeout de `approval_requests` — se calibran con datos reales, no solo con valores teóricos iniciales.
- Si `PolicyEvaluator` debe soportar políticas jerárquicas (organización → dominio → agente) con herencia explícita, o solo políticas planas por ahora.
- Mecanismo exacto de "modelo-juez" para `HallucinationDetector`/`ContradictionDetector`: ¿mismo proveedor que el agente o modelo dedicado más barato y especializado? Se define en un ADR posterior centrado en el pipeline de validación.
- Si `AgentConsultationRouter` debe poder iniciar un nuevo `Workflow` automáticamente o siempre requiere que un humano apruebe la composición multi-agente resultante.
- Política de expurgo/retención de `decision_events` y `validation_events` a escala — mismo tema pendiente que `retrieval_events` en ADR-0003 §15, a resolver en un ADR de compliance conjunto.
