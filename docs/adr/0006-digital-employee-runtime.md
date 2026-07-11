# ADR-0006: Digital Employee Runtime

| | |
|---|---|
| **Estado** | Propuesto |
| **Fecha** | 2026-07-09 |
| **Depende de** | [ADR-0001](0001-arquitectura-base-atlas-ai.md) · [ADR-0002](0002-company-brain.md) · [ADR-0003](0003-context-engine-retrieval-pipeline.md) · [ADR-0005](0005-decision-engine-validation-engine.md) |
| **Relacionado con** | [PVD-0001](../pvd/0001-product-vision-atlas-ai.md) · [PVD-0002](../pvd/0002-first-customer-experience.md) · [PVD-0003](../pvd/0003-business-dna.md) · [PVD-0004](../pvd/0004-atlas-home.md) |
| **Estatus especial** | Este documento consolida y hace operativos ADR-0001, ADR-0002, ADR-0003 y ADR-0005 en un único sistema en ejecución. Es el documento técnico de mayor autoridad de ATLAS AI: ante cualquier ambigüedad de implementación no cubierta explícitamente por un ADR anterior, este documento decide. |

---

## 0. Por qué este es el documento más importante

Cada ADR anterior definió una pieza correcta por separado: dónde vive el conocimiento (ADR-0002), cómo se recupera sin explotar el presupuesto de tokens (ADR-0003), cómo se controla que el LLM nunca decida solo (ADR-0005). Ninguno de ellos, por separado, ejecuta nada. **Este documento es donde esas piezas dejan de ser diagramas y se convierten en un sistema que responde a un mensaje real, de un cliente real, en producción.**

Si el Digital Employee Runtime falla — en su flujo, en sus estados, en su manejo de errores — toda la disciplina de gobernanza descrita en los documentos anteriores es papel mojado, porque es exactamente aquí, en el bucle de ejecución real, donde esa disciplina se cumple o se rompe.

---

## 1. Qué es el Digital Employee Runtime

Es el sistema que ejecuta, de principio a fin, cualquier interacción con cualquier Empleado Digital — desde que llega un mensaje hasta que se entrega una respuesta validada, explicable y auditada. Integra diez componentes:

| Componente | Ya definido en | Rol en el Runtime |
|---|---|---|
| **Conversation Manager** | — (nuevo en este ADR) | Dueño del hilo de conversación: turnos, mensajes, estado de la charla |
| **Agent Runtime** | ADR-0001 | El director de orquesta — inicia, secuencia y cierra cada ejecución (`run`) |
| **Prompt Builder** | — (nuevo en este ADR) | Ensambla el prompt final respetando el presupuesto de tokens (ADR-0003 §8.1) |
| **LLM Adapter** | ADR-0001 §7 (mencionado) | Abstrae proveedores de modelo, normaliza streaming y tool-calling |
| **Context Engine** | ADR-0003 | Recupera y presupuesta conocimiento del Company Brain |
| **Decision Engine** | ADR-0005 | Arbitra cada propuesta del LLM de forma determinista |
| **Validation Engine** | ADR-0005 | Verifica cada respuesta candidata antes de entrega |
| **Explainability Engine** | ADR-0005 §12 (como `ExplanationBuilder`, ahora elevado) | Ensambla la explicación completa de cualquier mensaje o ejecución |
| **Timeline** | — (nuevo en este ADR) | Reconstrucción cronológica narrable de lo ocurrido en un run/conversación |
| **Tool Executor** | ADR-0005 §12 (parcial, solo `consultar_conocimiento`) | Ejecuta cualquier acción autorizada, no solo recuperación de contexto |

Ningún componente de esta lista actúa fuera de este flujo. No existe un segundo camino de ejecución "más rápido" que se salte Decision Engine o Validation Engine — no como excepción de rendimiento, no como atajo interno.

---

## 2. Arquitectura de componentes

```
                              ┌─────────────────────┐
        Usuario / Workflow ──▶│ Conversation Manager │
                              └──────────┬───────────┘
                                         │ crea/reanuda run_id
                                         ▼
                              ┌─────────────────────┐
                     ┌───────▶│    Agent Runtime      │◀───────┐
                     │        │   (conductor)          │        │
                     │        └──────────┬───────────┘        │
                     │                   │                     │
          ┌──────────┴──────┐   ┌────────▼────────┐   ┌────────┴─────────┐
          │  Context Engine  │   │  Prompt Builder  │   │   Tool Executor   │
          │    (ADR-0003)    │──▶│                  │   │                  │
          └──────────────────┘   └────────┬────────┘   └────────▲─────────┘
                                            │                     │
                                   ┌────────▼────────┐            │
                                   │   LLM Adapter    │            │
                                   └────────┬────────┘            │
                                            │ propuesta            │
                                   ┌────────▼────────┐            │
                                   │ Decision Engine   │───────────┘
                                   │    (ADR-0005)     │
                                   └────────┬────────┘
                                            │ response
                                   ┌────────▼────────┐
                                   │ Validation Engine │
                                   │    (ADR-0005)     │
                                   └────────┬────────┘
                                            │ VALIDATED
                          ┌─────────────────┼─────────────────┐
                          ▼                                    ▼
                ┌───────────────────┐               ┌───────────────────┐
                │ Explainability     │               │      Timeline       │
                │ Engine             │               │                     │
                └───────────────────┘               └───────────────────┘
                          │                                    │
                          └─────────────────┬──────────────────┘
                                            ▼
                                 Conversation Manager
                                 (mensaje final entregado)
```

**Conversation Manager** está en los dos extremos del diagrama porque es tanto el punto de entrada (recibe el mensaje) como el punto de salida (entrega la respuesta ya validada, explicada y con su lugar en la Timeline).

---

## 3. Flujo completo

Secuencia íntegra de un turno conversacional — el diagrama central de este documento:

```
Conversation Manager
   │ 1. recibe mensaje del usuario, lo añade al hilo, crea/reanuda run_id
   ▼
Agent Runtime
   │ 2. resuelve capability_grant_id, Business DNA del agente, snapshot_version
   ▼
Context Engine
   │ 3. ContextRequest(initial) → ContextPackage (ADR-0003 §3)
   ▼
Decision Engine
   │ 4. evalúa suficiencia (ADR-0005 §4.1) — si insuficiente, vuelve a 3 (follow-up)
   ▼
Prompt Builder
   │ 5. ensambla: instrucciones (rol + tono DNA) + historial presupuestado
   │    (Conversation Manager) + ContextPackage + tarea actual
   ▼
LLM Adapter
   │ 6. invoca al proveedor, transmite streaming provisional (§5) al cliente
   │    en paralelo, normaliza la salida a Propuesta estructurada (ADR-0005 §2)
   ▼
Decision Engine
   │ 7. arbitra la propuesta:
   │      context_request  → vuelve a Context Engine (follow-up autorizado)
   │      action_request    → Tool Executor (§6) → resultado vuelve a 5 (nuevo ciclo)
   │      escalation_request→ Agent Consultation (ADR-0005 §4.6) → Workflows
   │      abstain            → EXECUTION_HALTED
   │      response           → continúa a 8
   ▼
Validation Engine
   │ 8. verifica (ADR-0005 §5) → VALIDATED o REJECTED
   │      REJECTED con reintentos disponibles → vuelve a 5 con retroalimentación
   │      REJECTED sin reintentos → EXECUTION_HALTED
   ▼
Explainability Engine
   │ 9. ensambla el paquete de explicación del mensaje final
   ▼
Timeline
   │ 10. registra la secuencia completa del run en la línea de tiempo narrable
   ▼
Conversation Manager
   │ 11. convierte el mensaje provisional en mensaje final (commit, §5),
   │     lo entrega con su explicación y su lugar en la Timeline adjuntos
   ▼
   Fin del turno — Conversation Manager queda a la espera del siguiente mensaje
```

Los pasos 5–8 pueden repetirse varias veces dentro de un mismo turno (ciclos de tool-calling, follow-ups de contexto, reintentos tras rechazo) — el turno no termina hasta que el paso 8 produce `VALIDATED` o el run entra en `EXECUTION_HALTED`/`FAILED`.

---

## 4. Estados

Este documento **extiende** la máquina de estados de ADR-0005 §3 — no la contradice, la completa con los estados que solo existen al integrar Conversation Manager, Prompt Builder y streaming. A partir de este ADR, esta es la máquina de estados canónica y de mayor autoridad del sistema.

| Estado nuevo | Se inserta | Significado |
|---|---|---|
| `CONVERSATION_RECEIVED` | antes de `CONTEXT_PENDING` | Conversation Manager recibió el mensaje y creó/reanudó el `run_id` |
| `PROMPT_ASSEMBLING` | entre `CONTEXT_EVALUATING` (suficiente) y `GENERATING` | Prompt Builder está ensamblando el prompt final presupuestado |
| `GENERATING_STREAMING` | sustituye a `GENERATING` cuando `proposal_type` esperado es `response` | Tokens fluyendo del LLM Adapter, mostrados como provisionales al cliente |
| `TOOL_EXECUTING` | tras `ACTION_AUTHORIZED` | Tool Executor ejecutando la acción; el run vuelve a `PROMPT_ASSEMBLING` al terminar |
| `COMMITTING` | entre `VALIDATED` y `COMPLETED` | Explainability Engine y Timeline procesando; el mensaje provisional aún no es final |
| `RETRACTED` | alternativa a `COMMITTING` cuando `REJECTED` con reintento | El contenido provisional mostrado se descarta visualmente antes de regenerar |

El resto de estados (`CONTEXT_PENDING`, `CONTEXT_EVALUATING`, `CONTEXT_INSUFFICIENT`, `PROPOSAL_RECEIVED`, `ACTION_AUTHORIZED`, `APPROVAL_REQUIRED`, `POLICY_CONFLICT`, `AGENT_CONSULTATION_REQUIRED`, `RESPONSE_GENERATED`, `VALIDATING`, `VALIDATED`, `REJECTED`, `EXECUTION_HALTED`, `COMPLETED`, `FAILED`) se heredan sin cambios de ADR-0005 §3.

---

## 5. Streaming

Existe una tensión real entre dos principios que este ADR debe resolver explícitamente: la experiencia de usuario espera ver texto aparecer en tiempo real (percepción de velocidad), mientras que el principio rector de ADR-0005 §0 exige que **ninguna salida del LLM sea directamente entregada sin pasar por Validation Engine**.

**Resolución: streaming provisional, entrega comprometida.**

- Los tokens del LLM Adapter se transmiten en tiempo real al cliente (vía Realtime, ADR-0001) apenas se generan, mostrados en la interfaz como **texto provisional** — visualmente distinguible (p. ej. un estado de "escribiendo…" persistente hasta el commit).
- Ese texto provisional **no es un mensaje entregado**. No tiene citas adjuntas, no está en la Timeline todavía, no puede citarse desde ningún otro lugar del sistema.
- Cuando la propuesta completa llega a Validation Engine y resulta `VALIDATED`, el Runtime emite un evento de **commit**: el texto provisional se convierte en el mensaje final, con sus citas, su explicación y su entrada en la Timeline ya adjuntas — normalmente sin cambios visibles de contenido si todo fue bien, pero ahora es un artefacto permanente y auditable.
- Si resulta `REJECTED` y hay reintento disponible (ADR-0005 §6), el Runtime emite un evento de **retract**: el texto provisional se retira de la pantalla con una transición breve (no un parpadeo brusco), y un nuevo ciclo de streaming comienza con el prompt corregido.
- Las propuestas de tipo `action_request`, `context_request` o `escalation_request` no tienen fase de streaming visible para el usuario — son estructuradas, no texto narrativo, y su resultado (si procede) solo se refleja en la conversación cuando genera, finalmente, una `response`.

Esta distinción — **mostrar no es lo mismo que entregar** — es la pieza de diseño que permite tener streaming de baja latencia sin debilitar el principio de que ninguna respuesta es "real" hasta que Validation Engine la confirma.

---

## 6. Tool Calling

Se generaliza el patrón que ADR-0005 §12 definió únicamente para `consultar_conocimiento` a **cualquier acción** que un Empleado Digital pueda ejecutar.

### 6.1 Registro de herramientas

Cada capability ejecutable (email, CRM, calendario, la propia recuperación de conocimiento) se registra con: nombre, esquema de parámetros esperado, capability requerida para invocarla, y una **clasificación de riesgo** (`read` / `write`) que determina su tratamiento por defecto en el Decision Engine y su alineación con el apetito de riesgo del Business DNA (PVD-0003 §7).

| Clase | Ejemplos | Tratamiento por defecto |
|---|---|---|
| **read** (informativas) | `consultar_conocimiento`, `consultar_calendario` | Gate rápido de `CapabilityGate` (ADR-0005 §4.3), rara vez requiere aprobación |
| **write** (con efecto externo) | `enviar_email`, `actualizar_registro_crm` | Más propensas a `APPROVAL_REQUIRED` por defecto (PVD-0003 §7); nunca reintentadas automáticamente sin control (§9) |

### 6.2 Flujo

```
LLM Adapter entrega proposal_type = action_request (nombre + parámetros)
        │
        ▼
Decision Engine → CapabilityGate (ADR-0005 §4.3)
        │
   ┌────┴─────┬───────────────┐
 fuera de   requiere        autorizada
 alcance    aprobación
   │            │               │
 EXECUTION_ APPROVAL_       Tool Executor
 HALTED     REQUIRED         │
                              ▼
                     ejecuta contra Integrations Hub (ADR-0001)
                              │
                              ▼
                  resultado estructurado (éxito/fallo + payload)
                              │
                              ▼
                  vuelve a Prompt Builder como nuevo turno interno
                  (el agente razona sobre el resultado de la tool)
```

### 6.3 Guarda de encadenamiento

Igual que `max_follow_up_calls` acota las peticiones de contexto (ADR-0003 §10.3), existe un **`max_tool_calls_per_turn`** independiente que acota cuántas herramientas puede encadenar un agente dentro de un mismo turno conversacional antes de forzar una respuesta o una detención — evita bucles de acción-reacción sin fin, con el mismo espíritu de "presupuesto agotado, respuesta explícita, nunca fallo silencioso" (ADR-0003 §10.3).

---

## 7. Manejo de errores

No todo lo que interrumpe un flujo feliz es un "error" — este ADR distingue explícitamente entre **resultados de gobernanza** (el sistema funcionó correctamente y decidió detenerse o denegar) y **errores técnicos reales** (algo falló de forma no intencionada). Confundirlos en el código de manejo de errores sería un defecto de diseño grave.

| Categoría | Ejemplos | Tratamiento |
|---|---|---|
| **Resultado de gobernanza** (no es un error) | `POLICY_CONFLICT`, acción fuera de capacidad, `REJECTED` por Validation Engine | Se maneja íntegramente por la máquina de estados (§4); nunca pasa por un manejador de excepciones genérico |
| **Error transitorio de infraestructura** | Timeout del proveedor LLM, rate limit, caída de red momentánea | Reintento automático acotado con backoff (§9) |
| **Error de integración** | Una tool externa devuelve error (API caída, credencial expirada) | Se captura como resultado estructurado de fallo, se devuelve al LLM como tal — el agente puede decidir cómo proceder; nunca se oculta como si la tool hubiera tenido éxito |
| **Error de contrato** | El LLM Adapter no puede normalizar la salida del proveedor a una Propuesta válida (ADR-0005 §2) | `ProposalClassifier` (ADR-0005 §12) lo rechaza por formato; se solicita regeneración con instrucción de formato corregido, con el mismo límite de reintentos que un `REJECTED` (§9) |
| **Error irrecuperable** | Caída de base de datos, fallo de infraestructura del propio Runtime | El run pasa a `FAILED` inmediatamente, se preserva todo el estado parcial ya persistido para diagnóstico, se notifica al equipo de operaciones — nunca se reintenta indefinidamente |

Ningún error, de ninguna categoría, se descarta sin dejar rastro: incluso un `FAILED` por infraestructura genera su `run_event` correspondiente (§10) — la Timeline de un run fallido debe poder reconstruirse igual que la de uno exitoso.

---

## 8. Reintentos

| Origen del reintento | Política | Cuenta contra |
|---|---|---|
| `REJECTED` por Validation Engine (ADR-0005 §6) | Máximo configurable (por defecto 2), con retroalimentación explícita en el prompt regenerado | Techo acumulado de tokens del run (ADR-0003 §8.3) |
| Fallo transitorio del proveedor LLM (LLM Adapter) | Backoff exponencial acotado; al agotar reintentos, conmuta a proveedor secundario si está configurado (ADR-0001 §7); si no hay fallback, `EXECUTION_HALTED` | No cuenta como reintento de generación — es reintento de infraestructura, contado aparte |
| Fallo de Tool Executor | **Solo se reintenta automáticamente si la tool es idempotente** (declarada como tal en el registro de herramientas, §6.1). Una tool con efecto externo no idempotente (`enviar_email`) nunca se reintenta en silencio — el fallo se devuelve al agente para que decida | Guarda `max_tool_calls_per_turn` (§6.3) |
| Error de contrato (Propuesta mal formada) | Mismo límite que `REJECTED` — es, en la práctica, la misma categoría de reintento con causa distinta | Techo acumulado del run |

Cada reintento, de cualquier origen, genera su propio `run_event` (§10) — el número de reintentos y su motivo son visibles en la Timeline de un run, no un detalle interno invisible.

---

## 9. Servicios

### 9.1 Servicios ya definidos (se reutilizan sin cambios)

De ADR-0003 §13: `ContextEngineService`, `CapabilityResolver`, `QueryUnderstandingService`, `VectorRetriever`, `FullTextRetriever`, `GraphRetriever`, `FusionRanker`, `Deduplicator`, `BudgetAssembler`, `ContextPackageBuilder`, `RetrievalAuditor`, `RunBudgetTracker`.

De ADR-0005 §12: `DecisionEngineService`, `ContextSufficiencyEvaluator`, `ProposalClassifier`, `CapabilityGate`, `PolicyEvaluator`, `ApprovalOrchestrator`, `AgentConsultationRouter`, `HaltController`, `ValidationEngineService`, `PermissionRevalidator`, `ComplianceChecker`, `ContradictionDetector`, `HallucinationDetector`, `ConfidenceScorer`, `ExplanationBuilder`.

### 9.2 Servicios nuevos de este ADR

| Servicio | Responsabilidad | Entrada → Salida |
|---|---|---|
| `AgentRuntimeOrchestrator` | El conductor: secuencia todos los demás servicios según el flujo de §3 | mensaje entrante → run completado (`COMPLETED`/`FAILED`) |
| `ConversationManagerService` | Dueño del hilo: mensajes, turnos, estado de conversación | mensaje de usuario → `run_id` creado/reanudado; mensaje validado → mensaje entregado |
| `PromptBuilderService` | Ensambla el prompt final respetando el reparto de presupuesto (ADR-0003 §8.1) | instrucciones + historial + `ContextPackage` + tarea → prompt ensamblado |
| `LLMAdapterService` | Abstrae proveedores, normaliza streaming y tool-calling a la Propuesta estructurada | prompt + configuración de modelo → stream de tokens + Propuesta final |
| `StreamRelayService` | Gestiona el canal de streaming provisional (§5): emisión, commit, retract | tokens del LLM Adapter → eventos de UI (`provisional`/`commit`/`retract`) |
| `ToolExecutorService` | Ejecuta cualquier acción autorizada contra Integrations Hub | `action_request` autorizada → resultado estructurado |
| `ExplainabilityEngineService` | Ensambla la explicación completa de un mensaje o run, a partir de todos los eventos registrados | `run_id` / `message_id` → paquete de explicación |
| `TimelineService` | Proyecta los `run_events` (+ detalle de tablas especializadas) en una narrativa cronológica legible | `run_id` / `conversation_id` → secuencia de entradas narrables |

Todos los servicios nuevos viven en un nuevo paquete `packages/agent-runtime`, que depende de `packages/company-brain` (ADR-0002/0003) y `packages/decision-engine` (ADR-0005), y es, a su vez, el único consumidor directo de `packages/ai-engine` (invocación de modelos, ADR-0001 §7) a través de `LLMAdapterService`.

---

## 10. Eventos

Todo lo que ocurre dentro de un run se emite como evento tipado. Es el mecanismo unificador que alimenta Timeline, Explainability Engine, Audit (ADR-0001 §6.3) y la Home de PVD-0004 (§7 de ese documento) a la vez, sin que cada uno tenga que leer tablas especializadas distintas para reconstruir "qué pasó".

| Evento | Se emite cuando | Consumido principalmente por |
|---|---|---|
| `run.started` | Conversation Manager crea el `run_id` | Timeline, Audit |
| `run.context_requested` / `run.context_received` | Ciclo con Context Engine (inicial o follow-up) | Timeline, Explainability Engine |
| `run.generation_started` | LLM Adapter comienza a emitir tokens | StreamRelayService |
| `run.proposal_received` | Propuesta estructurada completa | Decision Engine, Timeline |
| `run.action_authorized` / `run.action_denied` | Resultado de `CapabilityGate` | Timeline, Audit |
| `run.tool_invoked` / `run.tool_completed` / `run.tool_failed` | Ciclo de Tool Executor | Timeline, Explainability Engine |
| `run.approval_required` / `run.approval_resolved` | Ciclo de `ApprovalOrchestrator` | Notifications (ADR-0001), PVD-0004 §4.3 |
| `run.policy_conflict` | Detectado por `PolicyEvaluator` | Notifications, Audit |
| `run.agent_consultation_requested` | Detectado por `AgentConsultationRouter` | Workflows (ADR-0001) |
| `run.response_generated` | Propuesta de tipo `response` recibida | Validation Engine |
| `run.validated` / `run.rejected` | Resultado de Validation Engine | Timeline, StreamRelayService (commit/retract) |
| `run.committed` | Mensaje provisional se convierte en final | Conversation Manager, Explainability Engine |
| `run.halted` / `run.completed` / `run.failed` | Estados terminales | Timeline, Audit, PVD-0004 §4.4 (salud) |

`run.generation_token` (los tokens individuales) se transmite en vivo por el canal de streaming pero **no se persiste evento por evento** — solo el texto final ensamblado se guarda, como parte de `run.committed`. Persistir cada token generaría un volumen de auditoría sin valor added sobre el mensaje final ya persistido.

---

## 11. Tablas

### 11.1 Ya definidas (se reutilizan sin cambios)

De ADR-0002: `knowledge_domains`, `knowledge_sources`, `knowledge_documents`, `knowledge_units`, `knowledge_versions`, `knowledge_entities`, `knowledge_relations`, `knowledge_proposals`, `access_policies`. De ADR-0003: `context_packages`, `context_package_segments`, `retrieval_events`, `retrieval_event_candidates`, `run_context_budgets`. De ADR-0005: `agent_run_states`, `decision_events`, `policies`, `policy_evaluations`, `approval_requests`, `agent_consultation_requests`, `validation_events`, `response_citations`, `execution_halts`.

### 11.2 Nuevas de este ADR

| Tabla | Propósito | Columnas clave |
|---|---|---|
| `conversations` | Hilo de conversación entre un usuario/sistema y un Empleado Digital | `id`, `organization_id`, `agent_id`, `status`, `created_at` |
| `conversation_messages` | Cada mensaje del hilo, humano o del agente | `id`, `conversation_id`, `run_id` (nullable), `role`, `content`, `status` (`provisional`/`committed`/`retracted`), `created_at` |
| `run_events` | Registro append-only de todo evento tipado de §10 — la columna vertebral de Timeline y Explainability | `id`, `run_id`, `event_type`, `payload` (json), `created_at` |
| `tool_invocations` | Cada ejecución de herramienta, con su resultado | `id`, `run_id`, `tool_name`, `parameters` (json), `result` (json), `status`, `idempotent` (bool), `capability_grant_id`, `created_at` |
| `explanation_packages` | Caché materializada del paquete de explicación de un mensaje (derivada, no fuente de verdad — se puede reconstruir desde `run_events` + tablas especializadas) | `message_id`, `content` (json), `generated_at`, `source_snapshot_version` |

Todas heredan `organization_id` + RLS (ADR-0001 §5.2), sin excepción — incluida `run_events`, el registro más sensible de todo el sistema desde el punto de vista de auditoría.

---

## 12. Contratos TypeScript

Esta sección define **contratos de forma** — interfaces y tipos, sin lógica ni implementación — para fijar sin ambigüedad las estructuras que cruzan los límites entre los diez componentes de este Runtime. No es código ejecutable; es la especificación precisa de qué forma tiene cada mensaje que un componente le pasa a otro.

```typescript
// Estado del run — extiende ADR-0005 §3 con los estados de §4 de este documento
type RunState =
  | "CONVERSATION_RECEIVED" | "CONTEXT_PENDING" | "CONTEXT_EVALUATING"
  | "CONTEXT_INSUFFICIENT" | "PROMPT_ASSEMBLING" | "GENERATING_STREAMING"
  | "PROPOSAL_RECEIVED" | "TOOL_EXECUTING" | "ACTION_AUTHORIZED"
  | "APPROVAL_REQUIRED" | "POLICY_CONFLICT" | "AGENT_CONSULTATION_REQUIRED"
  | "RESPONSE_GENERATED" | "VALIDATING" | "VALIDATED" | "REJECTED"
  | "COMMITTING" | "RETRACTED" | "EXECUTION_HALTED" | "COMPLETED" | "FAILED";

// Propuesta estructurada del LLM (ADR-0005 §2), tal como la entrega LLM Adapter
type ProposalType = "response" | "context_request" | "action_request" | "escalation_request" | "abstain";

interface AgentProposal {
  readonly proposalType: ProposalType;
  readonly payload: ResponsePayload | ContextRequestPayload | ActionRequestPayload | EscalationPayload | null;
  readonly citations: ReadonlyArray<KnowledgeCitation>;
  readonly selfReportedConfidence: number; // 0..1
}

interface KnowledgeCitation {
  readonly unitId: string;
  readonly unitVersionId: string;
  readonly claimExcerpt: string;
}

interface ResponsePayload {
  readonly text: string;
}

interface ContextRequestPayload {
  readonly subQuery: string;
  readonly domainHint?: string;
}

interface ActionRequestPayload {
  readonly toolName: string;
  readonly parameters: Record<string, unknown>;
}

interface EscalationPayload {
  readonly requiredDomain: string;
  readonly reason: string;
}

// Entrada al Prompt Builder
interface PromptBuildInput {
  readonly runId: string;
  readonly agentInstructions: string;      // rol + tono heredado de Business DNA
  readonly conversationHistory: ReadonlyArray<ConversationMessage>;
  readonly contextPackage: ContextPackage; // ADR-0003 §2/§3
  readonly currentTask: string;
  readonly tokenBudget: TokenBudgetAllocation;
}

interface TokenBudgetAllocation {
  readonly instructions: number;
  readonly history: number;
  readonly knowledge: number;
  readonly output: number;
}

// Mensaje de conversación
type MessageRole = "user" | "agent";
type MessageStatus = "provisional" | "committed" | "retracted";

interface ConversationMessage {
  readonly id: string;
  readonly conversationId: string;
  readonly runId: string | null;
  readonly role: MessageRole;
  readonly content: string;
  readonly status: MessageStatus;
  readonly explanation?: ExplanationPackage;
  readonly createdAt: string;
}

// Invocación de herramienta
interface ToolInvocationRequest {
  readonly runId: string;
  readonly toolName: string;
  readonly parameters: Record<string, unknown>;
  readonly capabilityGrantId: string;
}

interface ToolInvocationResult {
  readonly status: "success" | "failure";
  readonly result: Record<string, unknown> | null;
  readonly errorReason?: string;
  readonly idempotent: boolean;
}

// Evento de run (§10) — forma unificada persistida en run_events
interface RunEvent {
  readonly id: string;
  readonly runId: string;
  readonly eventType: string; // p. ej. "run.validated", "run.tool_invoked"
  readonly payload: Record<string, unknown>;
  readonly createdAt: string;
}

// Paquete de explicación (Explainability Engine)
interface ExplanationPackage {
  readonly messageId: string;
  readonly snapshotVersion: string;
  readonly citations: ReadonlyArray<KnowledgeCitation>;
  readonly decisionsSummary: ReadonlyArray<{ description: string; ruleEvaluated: string }>;
  readonly validationsSummary: ReadonlyArray<{ checkName: string; result: "pass" | "fail" }>;
  readonly confidenceScore: number;
}

// Entrada de Timeline — proyección narrable de RunEvent
interface TimelineEntry {
  readonly ordinal: number;
  readonly runId: string;
  readonly summary: string;       // frase legible, no el payload crudo
  readonly linkedEventId: string;
  readonly occurredAt: string;
}
```

Estos contratos son la referencia obligatoria para cualquier implementación futura — un cambio de forma en cualquiera de estos tipos es, por definición, un cambio que requiere revisar este ADR, no un ajuste silencioso en el código.

---

## 13. Riesgos específicos

| Riesgo | Severidad | Mitigación |
|---|---|---|
| El streaming provisional (§5) genera confusión si el usuario actúa sobre texto no confirmado (p. ej. lo copia antes del commit) | Media | Marca visual inequívoca de estado "provisional" mientras no hay commit; el mensaje no es citable ni exportable hasta `COMPLETED` |
| Ciclos largos de tool-calling (§6) degradan la latencia percibida sin que el usuario entienda por qué | Media | `max_tool_calls_per_turn` con feedback visible en Timeline en tiempo real (el usuario ve "consultando X" en vivo, no silencio) |
| Confusión entre error técnico y resultado de gobernanza en el manejo de excepciones de implementación | Alta si ocurre | Separación explícita de categorías en §7 como contrato de diseño, no solo como documentación — cualquier PR que capture `POLICY_CONFLICT` en un `catch` genérico está violando este ADR |
| Reintento automático de una tool no idempotente | Alta si ocurre (efectos duplicados, p. ej. doble envío de email) | Bandera `idempotent` obligatoria en el registro de herramientas (§6.1) y en `tool_invocations`; el reintento automático se rechaza en el propio contrato de tipos (§12) si la bandera es `false` |
| Volumen de `run_events` a escala (especialmente con streaming de alta frecuencia si se persistiera token a token) | Media | Decisión explícita de no persistir `run.generation_token` individualmente (§10) |
| `explanation_packages` como caché queda desincronizado si se reconstruye Timeline con lógica distinta a la de Explainability Engine | Baja-Media | Ambos servicios leen de la misma fuente (`run_events` + tablas especializadas) — nunca mantienen su propia copia de la verdad |

---

## 14. Decisiones abiertas

- Si `PromptBuilderService` debe soportar plantillas de prompt configurables por tenant/dominio, o si el ensamblado sigue una estructura fija en esta primera versión.
- Proveedor(es) concreto(s) soportados inicialmente por `LLMAdapterService` y política exacta de fallback entre proveedores (§8) — depende de la decisión abierta ya señalada en ADR-0001 §11 sobre `ai-engine`.
- Si `TimelineService` debe materializar y cachear sus proyecciones (`TimelineEntry`) o calcularlas siempre bajo demanda a partir de `run_events` — decisión de rendimiento a validar con datos reales de conversaciones largas.
- Umbral exacto de `max_tool_calls_per_turn` por defecto, y si debe variar según el apetito de riesgo del Business DNA (PVD-0003 §7) igual que otros umbrales del Decision Engine.
- Mecanismo exacto de reconexión del cliente a un canal de streaming interrumpido (§5) sin perder el estado provisional — a definir en un ADR de infraestructura de Realtime si la complejidad lo justifica.
