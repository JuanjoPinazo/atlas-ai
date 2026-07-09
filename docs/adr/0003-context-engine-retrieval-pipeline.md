# ADR-0003: Context Engine + Retrieval Pipeline

| | |
|---|---|
| **Estado** | Propuesto |
| **Fecha** | 2026-07-09 |
| **Depende de** | [ADR-0001: Arquitectura Base](0001-arquitectura-base-atlas-ai.md) · [ADR-0002: Company Brain](0002-company-brain.md) |
| **Alcance** | Especificación operativa del Context Engine y su pipeline de recuperación |

---

## 0. Propósito de este ADR

ADR-0002 estableció **qué es** el Context Engine y **por qué** debe existir (§5 y §10 de ese documento). Este ADR especifica **cómo funciona operativamente**: el contrato exacto de solicitud/respuesta, el pipeline de recuperación paso a paso, el algoritmo de fusión y ranking, el mecanismo de presupuesto de tokens, el protocolo de tool-calling para contexto adicional, y el inventario de tablas y servicios necesarios para construirlo.

Este documento vive en `packages/company-brain` (decisión de ADR-0002 §13). No contiene código — especifica contratos, algoritmos y estructuras de datos a nivel conceptual, con precisión suficiente para implementarse sin ambigüedad.

**Regla de trazabilidad de todo este ADR**: ninguna decisión aquí contradice ADR-0001 §5–6 (tenancy, RLS, Capability Model) ni ADR-0002 §5–11 (capas del Brain, versionado, Context Engineering). Donde este documento detalla, ADR-0002 sigue siendo la referencia conceptual.

---

## 1. Responsabilidad del Context Engine

El Context Engine es **el único punto de entrada** para obtener conocimiento del Company Brain. Es:

- **Sin estado entre solicitudes** (cada `ContextRequest` es independiente; el estado de una ejecución vive en `run_context_budgets`, ver §12).
- **Consumidor, no dueño, del contenido** — lee `KnowledgeUnit`, `KnowledgeEntity`, `KnowledgeRelation` (ADR-0002 §2); no los modifica. La escritura de conocimiento es responsabilidad exclusiva del pipeline de ingesta (ADR-0002 §8).
- **El único lugar donde se aplica el Capability Model a la recuperación de conocimiento** (§4 de este documento).

No es responsabilidad del Context Engine: decidir qué hace el agente con el contexto, orquestar el `Workflow`, ni gestionar la conversación. Esas responsabilidades permanecen en Agent Runtime y Conversations (ADR-0001).

---

## 2. El contrato de `ContextRequest`

Toda solicitud de contexto, sea inicial o de seguimiento (§7), usa el mismo contrato:

| Campo | Origen | Descripción |
|---|---|---|
| `request_id` | generado | Identificador único de la solicitud |
| `organization_id` | sesión/JWT, **nunca del cliente** | Tenant — resuelto server-side, igual que en ADR-0001 §5.2 |
| `run_id` | Agent Runtime | Ejecución de agente que solicita contexto |
| `agent_id` | Agent Runtime | Empleado Digital que solicita |
| `capability_grant_id` | Agent Runtime | Referencia al grant de capacidades del agente (ADR-0001 §6.2) |
| `task_intent` | Agent Runtime / LLM (en follow-up) | Descripción concreta de la necesidad de contexto — **no la conversación completa** |
| `domain_hints` | opcional | Dominios sugeridos; si se omite, se infieren (§3, etapa 2) |
| `token_budget` | Agent Runtime | Tokens máximos asignables a esta solicitud |
| `retrieval_mode` | `initial` \| `follow_up` | Determina presupuesto por defecto y límites (§9, §11) |
| `exclude_unit_ids` | Agent Runtime (acumulado en el run) | Unidades ya entregadas en este `run_id`, para no repetirlas |
| `sensitivity_ceiling` | opcional | Solo puede **restringir** más, nunca ampliar, lo que ya permite el `capability_grant_id` |
| `as_of` | opcional | Fecha de referencia para vigencia temporal (por defecto, ahora) — permite reconstrucción histórica (ADR-0002 §6) |

**Regla de confianza cero en el cliente**: `organization_id`, `capability_grant_id` y los límites de presupuesto agregados por `run_id` se resuelven y verifican siempre server-side. Un `ContextRequest` que intente ampliar su propio presupuesto o dominio más allá de lo que su grant permite se rechaza, no se recorta silenciosamente.

---

## 3. Pipeline de construcción de un `ContextPackage`

```
 0. Resolución de identidad/tenant       (organization_id, capability_grant_id verificados)
              │
 1. Capability Filtering (pre-filtro)     dominios permitidos + sensitivity_ceiling + deny-list
              │                            ← se calcula ANTES de tocar cualquier índice
 2. Query Understanding                   normaliza task_intent, infiere dominios si faltan,
              │                            genera sub-consultas si la intención es compuesta
 3. Recuperación multi-estrategia          vector + full-text + grafo, EN PARALELO,
              │                            todas acotadas por el filtro de la etapa 1
 4. Fusión y ranking                       combina listas candidatas (RRF) + ajusta por
              │                            relevancia / vigencia / trust_level (§6)
 5. Deduplicación semántica                colapsa unidades casi-idénticas antes de contar
              │                            contra presupuesto
 6. Ensamblado con presupuesto             zoom-out → drop, nunca truncado ciego (§8)
              │
 7. Estructuración y citación              segmentos tipados (hecho/política/ejemplo/entidad),
              │                            cada uno citado con unit_id + version_id
 8. Persistencia                           ContextPackage + segmentos + snapshot_version
              │
 9. Auditoría                              RetrievalEvent (§9)
              │
10. Respuesta                              devuelto a Agent Runtime / Tool Executor
```

Cada etapa es una responsabilidad de un servicio distinto (§13) — esto permite testear, optimizar y sustituir cada etapa (p. ej. cambiar el algoritmo de fusión) sin tocar las demás.

---

## 4. Solicitud desde Agent Runtime

Existen exactamente **dos puntos de entrada** al Context Engine, ambos con el mismo contrato (§2) pero distinto `retrieval_mode`:

### 4.1 Solicitud inicial (`initial`)

Ocurre una vez, al comienzo de la ejecución de un agente, orquestada por Agent Runtime **antes** de la primera llamada al LLM. Se ejecuta dentro del worker asíncrono del Agent Runtime (ADR-0001 §1.2) — nunca bloquea la capa web.

```
Agent Runtime                Context Engine              LLM Provider
     │                             │
     │── ContextRequest(initial) ─▶│
     │                             │── pipeline §3 ──▶
     │◀──── ContextPackage ────────│
     │
     │── prompt = instrucciones + ContextPackage + tarea ──▶
     │                                                        │
     │◀──────────────────── respuesta / tool_call ───────────│
```

### 4.2 Solicitud de seguimiento (`follow_up`)

Ocurre en cualquier punto durante el razonamiento del LLM, **iniciada por el propio LLM** mediante tool-calling (§7). No la decide Agent Runtime de antemano — es la aplicación directa del principio "recuperación dinámica, no precarga" de ADR-0002 §10.1.

---

## 5. Aplicación del Capability Model antes de recuperar

Regla fijada en ADR-0002 §5: **el filtrado por permisos ocurre antes de cualquier búsqueda semántica, nunca después.** Este ADR la hace operativa:

1. `capability_grant_id` se resuelve a un conjunto concreto: `allowed_domains[]`, `max_sensitivity_level`, `denied_source_ids[]` (exclusiones explícitas dentro de dominios permitidos).
2. Ese conjunto se traduce en un **predicado de metadatos obligatorio**, aplicado como condición de filtrado en la etapa 1 del pipeline — antes de invocar el índice vectorial, el full-text o el recorrido de grafo.
3. Las tres estrategias de recuperación (§6) **reciben el predicado ya resuelto**, no lo calculan ellas mismas — evita que una estrategia futura se añada sin heredar el filtrado (fuente común de fugas de seguridad).
4. El recorrido de grafo respeta el mismo predicado en cada salto: una entidad o relación fuera de `allowed_domains` o por encima de `max_sensitivity_level` **no es transitable**, aunque esté a un salto de una entidad permitida.
5. **Default-deny**: si `capability_grant_id` no resuelve (grant inválido, revocado, o ambiguo), el conjunto de dominios permitidos es vacío. El pipeline continúa (no lanza error opaco) pero devuelve un `ContextPackage` vacío, y el `RetrievalEvent` correspondiente se marca con `flag: capability_resolution_failed` para observabilidad — nunca se asume acceso por defecto.

---

## 6. Combinación de estrategias de recuperación

Tres estrategias corren **en paralelo**, todas ya acotadas por el predicado de permisos (§5):

| Estrategia | Resuelve | Mecanismo | Salida |
|---|---|---|---|
| Vectorial | similitud semántica | `pgvector`, HNSW, dentro de la partición de dominios permitidos | lista rankeada por similitud coseno |
| Full-text | coincidencia léxica exacta (términos, códigos, nombres) | `tsvector`/`ts_rank` de Postgres | lista rankeada por relevancia léxica |
| Grafo | expansión relacional | recorrido desde entidades semilla (extraídas de `task_intent` o de los primeros resultados vectoriales) hasta profundidad configurable (por defecto 2 saltos) | lista de unidades conectadas, puntuadas por distancia de grafo |

Los filtros de metadatos (dominio, sensibilidad, vigencia temporal `as_of`, tenant) se aplican **de forma idéntica** a las tres, en la misma etapa, para que ninguna estrategia pueda devolver candidatos que otra habría excluido.

### 6.1 Fusión

Las tres listas candidatas se combinan mediante **Reciprocal Rank Fusion (RRF)**: cada unidad recibe una puntuación de fusión igual a la suma, sobre las listas en las que aparece, de `1 / (k + rango_en_lista)`, con `k` constante de suavizado configurable (valor por defecto sugerido: 60, valor estándar en literatura de recuperación híbrida). Esto evita que una sola estrategia domine el resultado y no requiere normalizar escalas de score heterogéneas entre vectorial/léxico/grafo.

El resultado de la fusión es el **`relevance_score`** que alimenta el ranking final (§7).

---

## 7. Priorización: relevancia, vigencia y trust_level

La puntuación final de cada candidato **no es solo relevancia** — se combina con dos señales adicionales obligatorias:

```
final_score = (w_r × relevance_score) + (w_v × vigencia_score) + (w_t × trust_score)
```

| Señal | Cómo se calcula | Nota |
|---|---|---|
| `relevance_score` | salida de la fusión RRF (§6.1), normalizada 0–1 | mide "qué tan relacionado" |
| `vigencia_score` | decae con la antigüedad desde `valid_from`; es 0 si `valid_to` ya pasó respecto a `as_of` | penaliza conocimiento obsoleto sin descartarlo de golpe si sigue vigente |
| `trust_score` | normalización 0–1 de `trust_level` de la `KnowledgeSource` de origen | favorece fuentes verificadas sobre propuestas de baja confianza |

- **Pesos por defecto**: `w_r = 0.6`, `w_v = 0.25`, `w_t = 0.15` — configurables **por `KnowledgeDomain` y por tenant** (ADR-0002 §4 ya establece que los dominios son configurables; los pesos de ranking heredan esa misma flexibilidad). Un dominio Legal puede querer `w_t` más alto; un dominio de Producto en fase temprana puede tolerar `trust_score` más bajo a cambio de `relevance_score` más alto.
- **Desempate**: ante `final_score` empatado (diferencia menor a un umbral configurable), gana la unidad con `trust_score` mayor — en caso de duda, se prioriza la fuente más confiable, no la más reciente.
- Este ranking es la última etapa antes de deduplicar (§3, etapa 5) — la deduplicación opera ya sobre la lista ordenada, así que ante dos casi-duplicados se conserva el de mayor `final_score`.

---

## 8. Presupuesto de tokens

### 8.1 Reparto de responsabilidad

Agent Runtime decide **cuánto del contexto total del LLM se destina a conocimiento** (frente a instrucciones, historial conversacional y espacio de salida) — esa es una decisión de orquestación de la ejecución, no del Context Engine. El Context Engine solo recibe `token_budget` como un número ya decidido y **garantiza no excederlo**.

### 8.2 Mecanismo de ajuste (etapa 6 del pipeline)

Orden estricto de degradación, nunca se salta un paso:

1. **Ensamblar tal cual** si la lista rankeada y deduplicada cabe completa en `token_budget` (conteo con tokenizador real del modelo destino, no estimación por caracteres).
2. **Zoom-out**: para las unidades de menor `final_score` que no caben, sustituir el contenido completo por su nivel de resumen precomputado (ADR-0002 §9, tabla de mecanismos de índice) — se repite subiendo de nivel de resumen hasta caber o agotar niveles.
3. **Drop**: si tras agotar el zoom-out sigue sin caber, se descartan las unidades de menor `final_score` completas — nunca se trunca el texto de una unidad a mitad de contenido.
4. Se reserva un **buffer del 5–10%** del `token_budget` para overhead estructural (encabezados de segmento, citas) — el cálculo de "cabe o no cabe" se hace contra `token_budget − buffer`, no contra el total.

### 8.3 Guardas independientes por ejecución

Además del presupuesto por solicitud, cada `run_id` tiene un **techo acumulado** (`run_context_budgets`, §12) que suma tokens de todas las solicitudes (inicial + follow-ups) dentro de esa ejecución. Esto evita que múltiples solicitudes de seguimiento, individualmente razonables, se acumulen sin control — es la mitigación directa del riesgo "coste de LLM descontrolado" identificado en ADR-0001 §9.

---

## 9. Cómo evitar prompts gigantes (guardas concretas)

Consolidando lo anterior en una lista de guardas **obligatorias y no desactivables**:

1. `token_budget` por solicitud, verificado con tokenizador real, aplicado server-side.
2. Techo acumulado por `run_id` (§8.3), independiente del presupuesto por solicitud.
3. Número máximo de llamadas de seguimiento por ejecución (`max_follow_up_calls`, §11) — por defecto sugerido 3–5, configurable por agente/dominio.
4. Orden de degradación fijo: caber → zoom-out → drop. Nunca truncado ciego de una unidad.
5. Deduplicación **antes** de contar contra presupuesto — un casi-duplicado no puede "gastar" presupuesto dos veces.
6. Tope de segmentos por tipo (p. ej. máximo de ejemplos) independiente del conteo de tokens, para que un solo tipo de segmento no monopolice el paquete.
7. Recuperación dinámica vía tool-calling (§10) en vez de precarga — el paquete inicial es deliberadamente mínimo por diseño, no por accidente de presupuesto ajustado.

---

## 10. Tool-calling para pedir más contexto

### 10.1 Contrato de la herramienta

Se expone una única herramienta estándar a todo agente con acceso a conocimiento: `consultar_conocimiento`.

| Parámetro (visible al LLM) | Descripción |
|---|---|
| `consulta` | Sub-pregunta o necesidad concreta de información |
| `dominio` (opcional) | Pista de dominio, si el LLM ya lo sabe |
| `motivo` (opcional) | Por qué necesita esto — no afecta la recuperación, se registra para auditoría/depuración |

### 10.2 Flujo

```
LLM (mid-reasoning)
    │  emite tool_call: consultar_conocimiento(consulta, dominio?, motivo?)
    ▼
Tool Executor (ADR-0001, capa de Capability Model de agente)
    │  valida: ¿agente autorizado a usar esta tool? ¿max_follow_up_calls no excedido?
    ▼
Context Engine
    │  ContextRequest(retrieval_mode = follow_up,
    │                 task_intent = consulta,
    │                 exclude_unit_ids = unidades ya entregadas en este run_id,
    │                 token_budget = presupuesto reducido de seguimiento)
    │  → pipeline completo (§3)
    ▼
Resultado devuelto al LLM como tool result
    (mismo formato estructurado y citado que el ContextPackage inicial)
```

### 10.3 Guardas específicas

- **`max_follow_up_calls` por `run_id`**: al alcanzarse, la herramienta no falla silenciosamente — devuelve una respuesta estructurada de "presupuesto de consultas agotado", para que el LLM pueda razonar explícitamente con lo que ya tiene en vez de fallar de forma opaca.
- **`exclude_unit_ids` acumulativo**: cada follow-up conoce lo ya entregado en el `run_id`, evitando reentrega de las mismas unidades.
- **Presupuesto de tokens decreciente por defecto**: los follow-ups reciben una fracción del presupuesto restante del run, no el mismo presupuesto que la solicitud inicial — evita que un solo follow-up agote de golpe el techo acumulado (§8.3).
- Cada follow-up genera su propio `RetrievalEvent` (§11), enlazado al mismo `run_id` — el historial completo de qué se pidió y cuándo dentro de una ejecución es reconstruible íntegramente desde auditoría.

---

## 11. Auditoría de cada `RetrievalEvent`

Todo `ContextRequest`, inicial o de seguimiento, produce exactamente un `RetrievalEvent`, sin excepción (regla heredada de ADR-0002 §9).

| Campo | Contenido |
|---|---|
| `retrieval_event_id` | identificador único |
| `organization_id`, `run_id`, `agent_id`, `request_id` | trazabilidad completa |
| `retrieval_mode` | `initial` \| `follow_up` |
| `capability_grant_id` usado | qué permisos se aplicaron |
| `domains_considered` | dominios efectivamente filtrados (§5) |
| `candidate_counts` | nº de candidatos por estrategia (vector/full-text/grafo) antes de fusión |
| `units_returned[]` | id + versión + desglose de score (`relevance_score`, `vigencia_score`, `trust_score`, `final_score`) por unidad entregada |
| `units_excluded_for_budget[]` | candidatos que **no** entraron por presupuesto — clave para depurar "por qué el agente no usó X" |
| `tokens_requested` / `tokens_used` | cumplimiento de presupuesto |
| `snapshot_version` | versión del Brain vista por esta solicitud (ADR-0002 §11.4) |
| `context_package_id` | referencia al paquete generado |
| `flag` | p. ej. `capability_resolution_failed` (§5.5) u otras condiciones anómalas |
| `latency_ms` por etapa | opcional pero recomendado para observabilidad operativa |
| `created_at` | timestamp |

Este evento alimenta el módulo Audit transversal de ADR-0001 como tipo `knowledge.retrieval`, exactamente como especifica ADR-0002 §9.

---

## 12. Tablas necesarias

### 12.1 Ya definidas conceptualmente en ADR-0002 (se listan por completitud, sin repetir su diseño)

`knowledge_domains`, `knowledge_sources`, `knowledge_documents`, `knowledge_units`, `knowledge_versions`, `knowledge_entities`, `knowledge_relations`, `knowledge_proposals`, `access_policies`.

### 12.2 Nuevas, específicas de este ADR

| Tabla | Propósito | Columnas clave |
|---|---|---|
| `context_packages` | Paquete de contexto ensamblado y persistido | `id`, `run_id`, `request_id`, `organization_id`, `retrieval_mode`, `snapshot_version`, `token_budget`, `tokens_used`, `created_at` |
| `context_package_segments` | Descomposición estructurada del paquete | `context_package_id`, `segment_type` (hecho/política/ejemplo/entidad), `ordinal`, `content`, `unit_id`, `unit_version_id` |
| `retrieval_events` | Auditoría completa de cada solicitud (§11) | ver tabla de §11 |
| `retrieval_event_candidates` | (recomendada, no estrictamente obligatoria) Detalle de **todos** los candidatos considerados, no solo los devueltos, con score por estrategia — necesaria para calibrar pesos de ranking (§7) sin reprocesar producción | `retrieval_event_id`, `unit_id`, `strategy`, `raw_score`, `fusion_score`, `included_in_package` (bool) |
| `run_context_budgets` | Techo acumulado por ejecución (§8.3, §10.3) | `run_id`, `organization_id`, `cumulative_tokens_used`, `max_follow_up_calls`, `follow_up_calls_used`, `updated_at` |

Todas las tablas nuevas heredan `organization_id` + RLS, sin excepción (ADR-0001 §5.2) — incluidas las de auditoría, que también son datos de tenant.

---

## 13. Funciones y servicios necesarios

| Servicio | Responsabilidad | Entrada → Salida |
|---|---|---|
| `ContextEngineService` | Orquesta el pipeline completo (§3); único punto de entrada público | `ContextRequest` → `ContextPackage` |
| `CapabilityResolver` | Resuelve `capability_grant_id` a dominios/sensibilidad/deny-list permitidos | `capability_grant_id` → predicado de acceso |
| `QueryUnderstandingService` | Normaliza `task_intent`, infiere dominios si faltan, genera sub-consultas si la intención es compuesta | `task_intent` → parámetros de recuperación |
| `VectorRetriever` | Búsqueda semántica acotada por el predicado de acceso | consulta + predicado → candidatos rankeados |
| `FullTextRetriever` | Búsqueda léxica acotada por el predicado de acceso | consulta + predicado → candidatos rankeados |
| `GraphRetriever` | Expansión desde entidades semilla, respetando el predicado en cada salto | entidades semilla + predicado → candidatos |
| `FusionRanker` | Combina listas (RRF) y aplica `final_score` (§6–§7) | listas candidatas → lista única rankeada |
| `Deduplicator` | Colapsa unidades casi-idénticas por distancia de embedding | lista rankeada → lista deduplicada |
| `BudgetAssembler` | Aplica caber → zoom-out → drop con conteo de tokens real (§8.2) | lista + `token_budget` → lista final ajustada |
| `ContextPackageBuilder` | Estructura en segmentos citados, persiste `context_packages` + `context_package_segments` | lista final → `ContextPackage` |
| `RetrievalAuditor` | Registra `retrieval_events` (+ `retrieval_event_candidates` si está activado) | traza del pipeline → `RetrievalEvent` |
| `RunBudgetTracker` | Mantiene `run_context_budgets`, aplica techo acumulado y `max_follow_up_calls` | `run_id` + tokens/llamada → permitir/denegar |
| `ToolExecutor.consultar_conocimiento` | Punto de entrada de follow-up desde el LLM; aplica guardas de §10.3 antes de invocar `ContextEngineService` | tool call del LLM → resultado de tool para el LLM |

Estos servicios viven en `packages/company-brain` (ADR-0002 §13). `ToolExecutor` es parte del Agent Runtime (ADR-0001) pero su handler específico para esta herramienta delega inmediatamente en `ContextEngineService` — no reimplementa lógica de recuperación.

---

## 14. Riesgos específicos de este ADR

| Riesgo | Severidad | Mitigación |
|---|---|---|
| Pesos de ranking (`w_r`, `w_v`, `w_t`) mal calibrados degradan la relevancia percibida sin error visible | Media-Alta | `retrieval_event_candidates` habilita calibración offline con datos reales antes de tocar producción |
| Recorrido de grafo profundo (>2 saltos) degrada latencia sin mejorar recuperación proporcionalmente | Media | Profundidad configurable con valor por defecto conservador (2), medido vía `latency_ms` por etapa |
| Un agente en bucle de follow-ups agota `max_follow_up_calls` en tareas legítimamente complejas | Media | Límite configurable por agente/dominio, no global fijo; respuesta explícita de "presupuesto agotado" en vez de bloqueo silencioso |
| Zoom-out agresivo pierde matices necesarios para la tarea | Media | `units_excluded_for_budget` y niveles de resumen usados quedan en auditoría — permite detectar el patrón y ajustar pesos o presupuesto por dominio |
| Fallo de `CapabilityResolver` interpretado como error en vez de default-deny | Alta si ocurre | Contrato explícito: fallo de resolución = conjunto vacío + `flag`, nunca excepción no controlada que un caller pueda malinterpretar como "sin filtro" |

---

## 15. Decisiones abiertas

- Valor final de la constante `k` de RRF y de los pesos por defecto `w_r/w_v/w_t` — se fijan con datos reales de uso, no solo por defecto teórico.
- Profundidad máxima configurable del recorrido de grafo por dominio (¿todos los dominios a 2 saltos, o algunos necesitan más?).
- Si `retrieval_event_candidates` se activa siempre o solo en modo de calibración/depuración, por coste de almacenamiento a escala.
- Estrategia de expiración/archivado de `retrieval_events` antiguos (relacionado con la retención de auditoría general de ADR-0001, a definir en un ADR de compliance).
- Si `max_follow_up_calls` debe poder ampliarse dinámicamente dentro de una ejecución (p. ej. con aprobación humana in-the-loop) o es un techo estrictamente fijo por configuración.
