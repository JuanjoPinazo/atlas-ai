# ADR-0012: Atlas Event Driven Architecture

| | |
|---|---|
| **Estado** | Propuesto |
| **Fecha** | 2026-07-09 |
| **Alcance** | Transversal — el backbone de eventos es único para toda la plataforma, todos los verticales, todos los módulos |
| **Depende de** | Toda la arquitectura anterior — [ADR-0001](0001-arquitectura-base-atlas-ai.md) a [ADR-0011](0011-atlas-discovery-assessment-framework.md), [AIF-0001](0008-atlas-intelligence-framework.md), [AED-0001](0009-atlas-employee-designer.md) |
| **Estatus especial** | Documento arquitectónico central de **Atlas OS**. A partir de este ADR, ATLAS AI deja de describirse como una colección de módulos que se llaman entre sí y pasa a describirse como un sistema operativo de negocio cuyo núcleo es un bus de eventos — todo módulo nuevo se integra publicando y consumiendo eventos de este backbone, nunca por acoplamiento directo no documentado. |

---

## 0. Qué resuelve este documento — y qué no inventa

Cada ADR anterior, sin excepción, ya emitía eventos: `run_events` (ADR-0006 §10), `decision_events` y `validation_events` (ADR-0005 §10), `retrieval_events` (ADR-0003 §11), `knowledge.mutation` y `knowledge.retrieval` (ADR-0002 §9, ADR-0007), `DNAChangeEvent` (PVD-0003 §5), `approval_requests` (ADR-0005 §11). **ATLAS AI ya era, de facto, un sistema orientado a eventos — simplemente nunca lo había declarado como principio arquitectónico explícito, y cada módulo mantenía su propia tabla de eventos sin un contrato ni un catálogo compartido.**

Este documento no introduce un mecanismo nuevo — **eleva ese backbone implícito a capa arquitectónica de primer nivel**, con un catálogo único, contratos versionados, y una disciplina de consumo común para los diez motores de [AIF-0001](0008-atlas-intelligence-framework.md), el sistema de diseño de [AED-0001](0009-atlas-employee-designer.md), el Discovery de [ADR-0011](0011-atlas-discovery-assessment-framework.md), y el plano de operación de [ADR-0010](0010-atlas-command-control-architecture.md).

---

## 1. Qué NO cambia

No todo se convierte en un evento asíncrono — hacerlo destruiría precisamente el diseño cuidadoso de latencia y streaming de [ADR-0006](0006-digital-employee-runtime.md).

- **La llamada de Agent Runtime a Context Engine** (`ContextRequest`/`ContextPackage`, ADR-0003) sigue siendo una interacción directa dentro del ciclo de una ejecución — necesita respuesta inmediata, no puede esperar a un ciclo de publicación/consumo.
- **El streaming de tokens del LLM Adapter** (ADR-0006 §5) sigue siendo un canal en tiempo real, no una secuencia de eventos discretos.
- **La arbitración del Decision Engine sobre una propuesta** (ADR-0005) sigue ocurriendo en el mismo ciclo síncrono de la ejecución.

Lo que el Event Bus gobierna es todo lo que ocurre **después** de que algo ya sucedió: la notificación a otros módulos, la propagación de estado, la auditoría, y el consumo asíncrono de los diez motores de AIF-0001. La regla práctica: **si algo necesita una respuesta antes de continuar la ejecución actual, es una llamada directa; si algo necesita que otros se enteren de que ocurrió, es un evento.**

---

## 2. Event Bus

El canal de publicación/suscripción por el que circula todo evento de la plataforma. Propiedades no negociables:

- **Aislado por tenant, con la misma disciplina de defensa en profundidad que el resto de la plataforma** (ADR-0001 §5) — un evento de una organización nunca es entregable a un suscriptor de otra, verificado tanto en el propio evento como en la capa de entrega.
- **Entrega al menos una vez, ordenada por tenant y por flujo causal** (§6) — un consumidor puede recibir un evento duplicado, nunca fuera de orden respecto a su cadena de causalidad.
- **Duradero** — ningún evento se pierde por la caída de un consumidor; se reintenta la entrega hasta confirmación de procesamiento.
- Construido sobre la misma infraestructura de cola asíncrona ya prevista en [ADR-0001 §7](0001-arquitectura-base-atlas-ai.md) para desacoplar la ejecución de agentes del ciclo de request/response — el Event Bus es una extensión de esa misma decisión de infraestructura, no una tecnología paralela nueva.

---

## 3. Event Store

La fuente de verdad única y append-only de todo evento emitido en la plataforma — un registro unificado que **sustituye conceptualmente**, sin eliminarlas, a las tablas de eventos ya definidas por separado en ADR anteriores.

### Decisión arquitectónica: proyecciones, no fuentes de verdad paralelas

`run_events`, `decision_events`, `validation_events`, `retrieval_events` y cualquier tabla de eventos específica de un módulo **se conservan**, porque optimizan consultas frecuentes de su propio dominio — pero pasan a ser **proyecciones de lectura derivadas del Event Store**, nunca fuentes de verdad independientes. La prueba de que esto es cierto en la práctica: cualquiera de esas tablas debe poder reconstruirse por completo mediante Event Replay (§8) si se perdiera o corrompiera. Si una tabla no pudiera reconstruirse así, no sería una proyección legítima — sería una fuente de verdad oculta, y eso es exactamente lo que este documento elimina.

Este es un patrón ligero de Event Sourcing aplicado al historial y la auditoría de la plataforma — no implica que **todo** el estado de ATLAS AI (una `KnowledgeUnit`, un `DigitalEmployeeProfile`) se reconstruya solo desde eventos; esas entidades siguen teniendo su tabla de estado actual, y **además** cada cambio sobre ellas emite el evento correspondiente al Event Store.

---

## 4. Event Catalog

El registro central y gobernado de todo tipo de evento que existe en la plataforma — nombre, propósito, módulo emisor, contrato de payload (§6), versión activa (§7). **Ningún módulo puede emitir un tipo de evento que no esté antes registrado en el catálogo** — es la misma disciplina de gobernanza que ya rige la creación de una `KnowledgeUnit` o una `Policy`: nada entra al sistema sin pasar por un punto de control declarado.

El catálogo se gestiona desde Knowledge Studio (AIF-0001 §2), igual que el resto de artefactos gobernados de la plataforma — no es una lista de configuración técnica aislada del resto de la disciplina de gobernanza ya establecida.

---

## 5. Event Routing

Un evento se enruta a sus consumidores según tres dimensiones combinadas, nunca una sola:

1. **Por tipo** (a qué se suscribió cada módulo — p. ej. el Risk Engine se suscribe a `AppointmentCancelled`, `ReviewReceived`, `PolicyConflictRaised`).
2. **Por tenant** — el mismo aislamiento de §2, aplicado en la capa de entrega, no solo en el origen.
3. **Por prioridad** — reutiliza directamente la lógica del Priority Engine (AIF-0001 §6.4): un `RiskDetected` de severidad alta se entrega con menor latencia y mayor prioridad de procesamiento que un `KnowledgeLearned` rutinario. El Event Bus no implementa una lógica de priorización propia — consume la misma que ya gobierna qué ve primero un propietario en ATLAS Home.

---

## 6. Event Contracts

Todo evento comparte una envolvente común, y añade un payload específico de su tipo, registrado en el Event Catalog (§4). Se define aquí como contrato de forma — tipos e interfaces, sin lógica, mismo principio de ADR-0006 §12.

```typescript
interface EventEnvelope<TPayload> {
  readonly eventId: string;
  readonly eventType: string;          // p. ej. "BudgetAccepted", registrado en el catálogo
  readonly eventVersion: string;        // p. ej. "v1" — ver §7
  readonly organizationId: string;      // nunca confiado del emisor sin verificación (ADR-0001 §5.2)
  readonly occurredAt: string;
  readonly correlationId: string;       // agrupa todos los eventos de un mismo proceso de negocio
  readonly causationId: string | null;  // el evento que causó directamente este — construye la cadena causal
  readonly payload: TPayload;
}

// Ejemplo de contrato específico
interface BudgetAcceptedPayload {
  readonly budgetId: string;
  readonly patientReferenceId: string;   // referencia, nunca dato clínico (PVD-0005 §5)
  readonly value: number;
  readonly acceptedAfterFollowUp: boolean; // marca de comportamiento observable (ABVL-01 §14)
}

interface OpportunityDetectedPayload {
  readonly opportunityCandidateId: string;
  readonly opportunityType: string;      // referencia a un ID de ABVL, p. ej. "ABVL-01"
  readonly estimatedImpact: number;
  readonly confidenceScore: number;
}
```

`correlationId` y `causationId` son la pieza que convierte al Event Bus en el sustento técnico real de la explicabilidad de toda la plataforma (§9) — no una promesa de diseño, sino una cadena reconstruible evento a evento.

---

## 7. Event Versioning

Un evento, una vez emitido, es inmutable — nunca se corrige ni se reescribe. Si el contrato de un tipo de evento necesita cambiar, se crea una nueva versión (`BudgetAccepted.v2`) registrada en el Event Catalog, con las reglas de compatibilidad declaradas explícitamente: qué consumidores deben migrar y en qué plazo, y durante cuánto tiempo coexisten ambas versiones activas. Ningún consumidor puede asumir silenciosamente una sola versión — debe declarar qué versiones entiende.

---

## 8. Event Replay

La capacidad de reprocesar eventos históricos, con tres usos distintos y explícitos:

1. **Reconstrucción de una proyección** (§3) si se pierde o se corrompe — la prueba de legitimidad arquitectónica de cualquier tabla derivada.
2. **Reproducibilidad para explicabilidad** — reconstruir el estado exacto que llevó a una decisión en un `snapshot_version` concreto (ADR-0002 §11.4, ADR-0003, ADR-0005), ahora sustentado directamente en la cadena de eventos real, no en una inferencia posterior.
3. **Incorporación de un consumidor nuevo** — un motor o módulo que se añade después necesita poder "ponerse al día" con el historial relevante sin depender de una migración manual de datos.

Todo consumidor debe ser **seguro ante reprocesamiento** — recibir el mismo evento dos veces nunca debe duplicar un efecto real (misma disciplina de idempotencia ya exigida a las herramientas en ADR-0006 §9).

---

## 9. Event Audit

El Event Store **es**, en la práctica, el mecanismo técnico que sostiene el módulo de Audit transversal ya definido en ADR-0001 §6.3 — no un sistema paralelo. Cada evento, por diseño (§6), lleva su propia procedencia (`causationId`, `organizationId`, `occurredAt`) sin necesidad de reconstrucción posterior. La política de retención y expurgo de eventos, todavía pendiente desde ADR-0003 §15, ADR-0005 §14 y ADR-0007 §18, se aplica ahora sobre un único Event Store, no sobre tablas dispersas — este documento no la resuelve, pero elimina la fragmentación que la hacía más difícil de operar.

---

## 10. Event Prioritization

Ya introducida en §5 como parte del enrutamiento — se detalla aquí como disciplina propia porque afecta también al **consumo**, no solo a la entrega: un motor suscrito a `RiskDetected` procesa antes los eventos de severidad alta que los de severidad baja, incluso si llegaron en orden inverso, siempre que no rompa la cadena causal de un mismo `correlationId`. La prioridad nunca reordena eventos dentro de una misma cadena causal — solo entre cadenas distintas.

---

## 11. Event Security

- Aislamiento por tenant como invariante (§2, §5), verificado en origen y en entrega, nunca confiado en un solo punto.
- Clasificación de sensibilidad por tipo de evento — un evento como `PatientCreated` nunca lleva contenido clínico en su payload (coherente con [PVD-0005 §5](../pvd/0005-atlas-dental-intelligence-blueprint.md): solo una referencia y metadatos no sensibles); un evento de auditoría de decisión puede llevar más detalle porque su naturaleza es distinta.
- Acceso al contenido de un evento desde el Plano de Control (ADR-0010) se rige por el mismo `SupportAccessGrant` acotado, temporal y auditado ya definido en ADR-0010 §10 — el Event Bus no crea una vía de acceso alternativa a contenido de tenant.

---

## 12. Event Observability

Salud del propio bus como infraestructura: rendimiento de entrega, retraso acumulado por consumidor, profundidad de cola de reintento, tasa de eventos sin consumidor activo. Alimenta directamente Atlas Control Tower (ADR-0010 §2, §8) — un consumidor con retraso creciente es, en sí mismo, una señal de riesgo de sistema que el Risk Engine interno de ADR-0010 §16 debe poder detectar.

---

## 13. Catálogo de eventos principales

| Evento | Módulo emisor | Consumidores principales |
|---|---|---|
| `PatientCreated` | Recepción Digital / Integrations Hub | Agenda, ROI Engine, Opportunity Engine |
| `PatientUpdated` | Recepción Digital / Integrations Hub | Agenda, Company Brain (nunca contenido clínico, solo referencia) |
| `LeadCaptured` | Marketing / Discovery | Opportunity Engine, ROI Engine (atribución de origen, DKB-PAC-01 §1) |
| `BudgetCreated` | Coordinador de Presupuestos (vía Decision Engine, `APPROVAL_REQUIRED`) | ROI Engine, Opportunity Engine, Priority Engine, Atlas HQ |
| `BudgetAccepted` | Coordinador de Presupuestos | ROI Engine (ABVL-01), Agenda (programación de tratamiento), Learning Engine |
| `AppointmentCancelled` | Agenda | Opportunity Engine (ABVL-05), Risk Engine (ABVL-20) |
| `AppointmentCompleted` | Agenda / Agent Runtime | ROI Engine, Recall trigger (ABVL-02), Reseña trigger (ABVL de reputación) |
| `ReviewReceived` | Integrations Hub / Reputación y Campañas | Risk Engine (reseña negativa), Opportunity Engine, ATLAS Home |
| `KnowledgeLearned` | Knowledge Acquisition Engine / Learning Engine | Knowledge Studio, Confidence Engine |
| `KnowledgeApproved` | Knowledge Studio (revisión humana) | Context Engine (invalidación de caché), Confidence Engine |
| `DNAChanged` | Business DNA (PVD-0003 §5) | Digital Employee Runtime (refresco de tono/personalidad), Decision Engine |
| `EmployeeCertified` | Atlas Employee Designer (`CertificationService`) | Decision Engine (fricción de aprobación), Atlas Team Concept, Atlas HQ |
| `EmployeeAssigned` | Atlas Employee Designer | Atlas Team Concept, Decision Engine |
| `OpportunityDetected` | Opportunity Engine (AIF-0001 §6.1) | Priority Engine, Recommendation Engine, ATLAS Home |
| `RiskDetected` | Risk Engine (AIF-0001 §6.2) | Priority Engine, Atlas Control Tower, Executive Copilot |
| `ROIUpdated` | ROI Engine (AIF-0001 §6.5) | ATLAS Home, Atlas HQ, Business Evolution Engine |
| `PolicyConflictRaised` | Decision Engine (`POLICY_CONFLICT`, ADR-0005 §4.5) | Risk Engine, Atlas Control Tower |
| `ApprovalRequested` / `ApprovalResolved` | Decision Engine (ADR-0005 §11) | Priority Engine, Notifications, Atlas Command Center |
| `ExecutionHalted` | Decision Engine (ADR-0005 §4.7) | Risk Engine, Atlas Control Tower |
| `KnowledgePackPublished` | Knowledge Studio / Marketplace | `PackDistributionService` (PVD-0006 §13) |
| `KnowledgePackAdopted` | Cliente, vía Marketplace | Company Brain (ingesta), Confidence Engine |
| `BenchmarkComputed` | Atlas Intelligence Network (PVD-0006 §5) | ROI Engine, Opportunity Engine, ATLAS Home |
| `DiscoverySessionCompleted` | Atlas Discovery & Assessment (ADR-0011) | Equipo comercial, generación de propuesta |
| `ProspectConverted` | Discovery → Onboarding (ADR-0011 §21) | ROI Engine (contraste proyección vs. real), Atlas HQ |
| `TenantHealthDegraded` | Atlas Command & Control (ADR-0010 §11) | Atlas Control Tower, Risk Engine interno |

---

## 14. Cómo consume cada módulo el backbone de eventos

| Módulo | Rol frente al Event Bus |
|---|---|
| **Company Brain** (ADR-0002) | Emite `KnowledgeLearned`/`KnowledgeApproved`; consume ninguno directamente — su estado se actualiza por la vía ya establecida en ADR-0007, el evento es la notificación posterior, no el mecanismo de escritura |
| **Business DNA** (PVD-0003) | Emite `DNAChanged`; consumido por Digital Employee Runtime y Decision Engine para refrescar comportamiento sin reiniciar ninguna ejecución en curso |
| **Decision Engine** (ADR-0005) | Emite `PolicyConflictRaised`, `ApprovalRequested/Resolved`, `ExecutionHalted` — su arbitración en sí sigue siendo síncrona (§1), estos eventos son la notificación posterior al resto de la plataforma |
| **Atlas Employee Designer** (AED-0001) | Emite `EmployeeCertified`, `EmployeeAssigned`; consume `ROIUpdated` (para calcular ROI individual, AED-0001 §14) y eventos de ejecución etiquetados por `agent_id` |
| **Atlas Discovery & Assessment** (ADR-0011) | Emite `DiscoverySessionCompleted`, `ProspectConverted`; consume `BenchmarkComputed` para sus comparativas (ADR-0011 §13) |
| **Atlas Business Value Library** | No emite eventos en sí (es una biblioteca de conocimiento, no un sistema en ejecución) — es la referencia que da nombre y sentido a `opportunityType` en `OpportunityDetected` |
| **Atlas Intelligence Framework** (los diez motores) | Consumidor principal de casi todo el catálogo — cada motor se suscribe a los eventos relevantes a su función (Opportunity Engine a eventos operativos, Risk Engine a eventos de riesgo y gobernanza, ROI Engine a eventos de valor económico) y emite, a su vez, `OpportunityDetected`, `RiskDetected`, `ROIUpdated` como sus propias salidas |
| **Atlas HQ / Command Center / Control Tower** (ADR-0010) | Consumidor agregado de todo el catálogo, a través de las mismas instancias de Opportunity/Risk/Priority Engine reutilizadas para la flota (ADR-0010 §3) — nunca un consumidor con lógica de agregación propia y paralela |
| **ROI Platform** (PVD-0007) | Es, en la práctica, la superficie de presentación del `ROIUpdated` emitido por el ROI Engine — no un sistema separado con su propia fuente de eventos |
| **Atlas Intelligence Network** (PVD-0006) | Emite `BenchmarkComputed` tras cada ciclo de agregación anonimizada; consume eventos de resultado (`BudgetAccepted`, `AppointmentCompleted`, etc.) ya abstraídos localmente antes de cruzar la frontera del tenant (PVD-0006 §5) — el Event Bus nunca transporta un evento crudo de un tenant directamente a la red |
| **Marketplace** | Emite `KnowledgePackPublished`; consume `KnowledgePackAdopted` para métricas de adopción visibles en Atlas HQ |

---

## 15. Atlas OS — la metáfora que cierra el diseño

Un sistema operativo no es la suma de sus programas — es el núcleo que permite que programas independientes se comuniquen sin conocerse directamente entre sí, a través de un conjunto de primitivas comunes (procesos, señales, colas de mensajes). Con este documento, ATLAS AI adopta esa misma disciplina: **Company Brain, Business DNA, Decision Engine, los diez motores de AIF-0001, Atlas Employee Designer, Discovery, el Plano de Control y el Marketplace no se conocen directamente entre sí — se conocen a través del Event Bus, con un catálogo de eventos común como único lenguaje compartido.**

Esto es lo que hace posible que un vertical nuevo, o un motor nuevo, se incorpore a la plataforma sin tener que modificar el código de los módulos ya existentes — solo necesita publicar y suscribirse a eventos ya catalogados, exactamente igual que un programa nuevo en un sistema operativo no necesita que el propio sistema operativo se reescriba para ejecutarlo.

---

## 16. Entidades y servicios de referencia

| Entidad | Propósito |
|---|---|
| `PlatformEvent` | El registro unificado del Event Store (§3) — el envelope de §6 persistido |
| `EventCatalogEntry` | Un tipo de evento registrado, con su contrato, versión activa y módulo emisor (§4) |
| `EventSubscription` | La suscripción de un módulo a uno o más tipos de evento, con su filtro de prioridad si aplica |
| `EventReplayJob` | Una ejecución de reprocesamiento histórico (§8), acotada por rango temporal y tipo |

| Servicio | Responsabilidad |
|---|---|
| `EventBusService` | Publica y entrega eventos con las garantías de §2 |
| `EventStoreService` | Persiste el registro unificado y sirve como fuente de reconstrucción de proyecciones |
| `EventCatalogService` | Gestiona el registro, versión y gobernanza de tipos de evento (§4, §7) |
| `EventRouterService` | Aplica las tres dimensiones de enrutamiento de §5 |
| `EventReplayService` | Ejecuta reprocesamiento histórico de forma segura ante duplicidad (§8) |
| `EventObservabilityService` | Vigila la salud del propio bus, alimenta Atlas Control Tower (§12) |

El esquema de datos exhaustivo se desarrolla en un ADR posterior, siguiendo el mismo patrón de la serie.

---

## 17. Riesgos

| Riesgo | Severidad | Mitigación |
|---|---|---|
| Migrar todo a eventos introduce latencia donde antes había una llamada síncrona rápida | Alta si se aplica mal | Límite explícito de §1 — el streaming y la arbitración en tiempo real nunca pasan por el Event Bus |
| Proliferación de tipos de evento no documentados, cada módulo inventando el suyo | Alta | Event Catalog como punto de control obligatorio (§4) — ningún tipo nuevo sin registro previo |
| Una proyección deja de poder reconstruirse desde el Event Store por una divergencia silenciosa de esquema | Alta si ocurre | Event Replay (§8) como prueba de legitimidad continua, no solo mecanismo de recuperación de emergencia |
| Fuga de contenido sensible en el payload de un evento mal diseñado | Alta | Clasificación de sensibilidad obligatoria por tipo de evento en el Event Catalog (§11), revisada en el mismo proceso de gobernanza que cualquier `KnowledgeUnit` |
| El Event Bus se convierte en un cuello de botella único de toda la plataforma | Media | Aislamiento por tenant en la propia arquitectura de entrega (§2) evita que la carga de un tenant degrade a otro — misma disciplina de "noisy neighbor" ya prevista en ADR-0001 §7 |

---

## 18. Decisiones abiertas

- Tecnología concreta de transporte del Event Bus — depende directamente de la decisión de infraestructura de cola asíncrona todavía abierta en ADR-0001 §11.
- Plazo estándar de coexistencia entre versiones de un mismo tipo de evento (§7) antes de forzar la migración de consumidores rezagados.
- Si `EventReplayJob` debe estar disponible como autoservicio para cualquier módulo o requiere aprobación del equipo de plataforma, dado su coste computacional potencial a escala de toda la flota.
- Alcance exacto de la política de retención del Event Store — misma decisión pendiente heredada de ADR-0003 §15, ADR-0005 §14, ADR-0007 §18 y ADR-0010 §19, ahora unificada en un solo lugar para resolverse de una vez.
