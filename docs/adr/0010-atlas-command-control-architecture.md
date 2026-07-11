# ADR-0010: Atlas Command & Control Architecture

| | |
|---|---|
| **Estado** | Propuesto |
| **Fecha** | 2026-07-09 |
| **Alcance** | Interno — el plano de operación de ATLAS AI como empresa, no una capa del producto que un cliente ve |
| **Depende de** | [ADR-0001 §5](0001-arquitectura-base-atlas-ai.md) (aislamiento multi-tenant) · [ADR-0002](0002-company-brain.md) · [ADR-0005](0005-decision-engine-validation-engine.md) · [ADR-0006](0006-digital-employee-runtime.md) · [ADR-0007](0007-knowledge-acquisition-engine.md) · [AIF-0001 / ADR-0008](0008-atlas-intelligence-framework.md) · [AED-0001 / ADR-0009](0009-atlas-employee-designer.md) |
| **Relacionado con** | [PVD-0006](../pvd/0006-atlas-intelligence-network.md) (mecanismo de anonimización reutilizado en §18) · [PVD-0007](../pvd/0007-roi-intelligence-platform.md) |
| **Estatus especial** | Documento fundamental de operación. Define el único sistema desde el que ATLAS AI, como empresa, administra a todos sus clientes — ningún equipo interno gestiona un tenant por una vía distinta a la aquí descrita. |

---

## 0. Qué resuelve este documento

Todo lo construido hasta ahora — Company Brain, Decision Engine, Atlas Intelligence Framework, Atlas Employee Designer — describe cómo funciona la plataforma **desde dentro de un tenant**. Ningún documento anterior responde a una pregunta igual de crítica: **¿cómo administra ATLAS AI, como empresa, a miles de esos tenants a la vez, con un equipo que nunca podrá crecer al mismo ritmo que el número de clientes?**

Ese es el plano que este documento diseña. No es una funcionalidad más del producto — es el sistema nervioso operativo de la propia empresa ATLAS AI, y su calidad de diseño determina directamente si el modelo de negocio de la plataforma escala o se ahoga en soporte manual.

---

## 1. Principio rector: visibilidad operativa sin violar aislamiento

La tensión de este documento es estructuralmente idéntica a la que resolvió [PVD-0006](../pvd/0006-atlas-intelligence-network.md) para el aprendizaje colectivo entre clientes — aquí se aplica al equipo interno de ATLAS AI en vez de a otros tenants:

> **El equipo de ATLAS AI necesita visibilidad completa de la salud del sistema a través de todos los tenants. Nunca necesita, por defecto, visibilidad del contenido de ningún tenant.**

Esta distinción — **salud del sistema** frente a **contenido de negocio** — es la que separa un dato legítimamente visible en el plano de control (¿está el pipeline de ingesta de este cliente funcionando? ¿cuántos tokens ha consumido? ¿tiene una ejecución bloqueada?) de un dato que nunca debería aparecer ahí sin justificación explícita y auditada (¿qué dice exactamente el presupuesto que su Empleado Digital le envió a un paciente concreto?). El diseño de cada una de las veinte capacidades de este documento se somete a esta misma pregunta.

### Plano de Control frente a Plano de Datos

```
                    ATLAS AI (la empresa) — Plano de Control
   ┌────────────────────────────────────────────────────────────────┐
   │   Atlas HQ          Atlas Command Center      Atlas Control      │
   │   (estratégico,      (operativo, gestión        Tower            │
   │    agregado,          diaria de clientes,      (monitorización   │
   │    cadencia semanal)  despliegues, licencias)   en vivo,          │
   │                                                  incidentes)      │
   └─────────────────────────────┬──────────────────────────────────┘
                                  │  solo señales de salud del sistema,
                                  │  nunca contenido de tenant sin
                                  │  acceso explícito y auditado (§10)
                                  ▼
   ┌────────────────────────────────────────────────────────────────┐
   │                Plano de Datos — miles de tenants aislados          │
   │  Tenant A: Brain · DNA · Digital Employees · Decision Engine       │
   │  Tenant B: Brain · DNA · Digital Employees · Decision Engine       │
   │  Tenant N: ...                                                       │
   └────────────────────────────────────────────────────────────────┘
```

El Plano de Control **nunca ejecuta acciones dentro de un tenant** — observa, agrega, alerta y, cuando hace falta, concede acceso de soporte acotado (§10). La ejecución real de cualquier cosa dentro de un tenant sigue viviendo, sin excepción, en el Plano de Datos ya definido en los ADR anteriores.

---

## 2. Las tres superficies

No es una sola consola — son tres, con audiencia y cadencia distintas, porque un mismo panel no puede servir bien a una decisión estratégica trimestral y a un incidente que necesita respuesta en minutos.

| Superficie | Audiencia | Cadencia | Pregunta que responde |
|---|---|---|---|
| **Atlas HQ** | Dirección / liderazgo de ATLAS AI | Semanal / mensual | "¿Cómo va el negocio en su conjunto?" — crecimiento, retención, margen agregado |
| **Atlas Command Center** | Equipo de operaciones y soporte | Diaria, por cliente o por ticket | "¿Qué necesita este cliente concreto hoy?" — gestión de cuentas, despliegues, licencias, facturación |
| **Atlas Control Tower** | Ingeniería de guardia / SRE | Tiempo real, segundo a segundo durante un incidente | "¿Qué está fallando ahora mismo, en qué tenants, y con qué severidad?" |

Las tres comparten el mismo dato subyacente — nunca son tres fuentes de verdad distintas — pero lo presentan a la escala temporal y de agregación que corresponde a cada decisión.

---

## 3. Cómo un equipo pequeño administra miles de clientes

Tres decisiones de diseño hacen esto posible, ninguna de las cuales es "contratar más soporte":

1. **Automatización por defecto, atención humana por excepción.** La inmensa mayoría de operaciones de este documento — aprovisionamiento, escalado, actualización de versión, monitorización rutinaria — ocurren sin intervención humana. El equipo de ATLAS AI solo aparece cuando algo requiere de verdad su criterio, exactamente el mismo principio de "supervisión por excepción" que el Nivel 5 del Atlas Maturity Model (AIF-0001 §5) promete a los clientes de ATLAS AI — la propia empresa aplica su producto a su propia operación.
2. **Los diez motores de AIF-0001, apuntados a la flota de tenants en vez de a un solo negocio.** El Opportunity Engine, el Risk Engine y el Priority Engine (AIF-0001 §6.1–6.4) no están reservados al cliente final — Atlas Command Center y Atlas Control Tower los reutilizan sin modificar su arquitectura, aplicados sobre señales de salud de cada tenant en vez de sobre señales de negocio de un cliente. El Risk Engine detecta qué instalación necesita atención antes de que el cliente tenga que abrir un ticket; el Priority Engine ordena esas señales exactamente igual que ordena las oportunidades de un propietario en ATLAS Home.
3. **Vistas agregadas y priorizadas, nunca listas planas de miles de filas.** Ningún operador humano revisa "todos los tenants" — revisa lo que el Priority Engine ya decidió que merece atención, con el resto agregado en un estado de salud general.

---

## 4. Gestión de clientes

Directorio de tenants con estado de ciclo de vida (prueba, activo, en riesgo, cancelado), plan contratado, y una puntuación de salud derivada — nunca calculada desde contenido, siempre desde señales de sistema y de uso (adopción de funcionalidades, frecuencia de uso del Executive Copilot, nivel de madurez del Atlas Maturity Model ya evaluado por el Business Evolution Engine, AIF-0001 §6.9). Vive en Atlas Command Center.

---

## 5. Gestión de despliegues

Qué tenants operan en la capa compartida con RLS y cuáles en un tier de aislamiento dedicado (ADR-0001 §5.1), estado de adopción de Knowledge Packs por tenant (con su distribución escalonada ya descrita en PVD-0006 §8), y qué cohortes de clientes están en cada fase de un despliegue por etapas (canary → adopción amplia).

---

## 6. Versionado

Inventario cruzado de versiones activas: versión de plataforma, versión de cada Knowledge Pack adoptado por tenant, versión activa del `BusinessDNAProfile` de cada cliente (PVD-0003 §5), versión del Digital Employee Runtime. Es la base de datos que responde, en segundos, "¿qué tenants siguen en una versión antigua de X?" — imprescindible para cualquier operación de soporte o de actualización.

---

## 7. Actualizaciones

Toda actualización de plataforma se distribuye por cohortes, nunca de golpe a la totalidad de tenants — mismo principio de distribución escalonada ya validado para Knowledge Packs (PVD-0006 §8), aplicado aquí a cambios de plataforma. Incluye capacidad de reversión inmediata por cohorte si una actualización introduce una regresión, sin afectar a tenants fuera de esa cohorte.

---

## 8. Monitorización

Señales de salud del sistema en tiempo real: disponibilidad, tasa de error, latencia por etapa (incluida la latencia del pipeline de Context Engine, ADR-0003, y del Decision/Validation Engine, ADR-0005), profundidad de cola del Agent Runtime (ADR-0001 §7), salud de cada proveedor de LLM configurado (`LLMAdapterService`, ADR-0006 §9). Alimenta directamente Atlas Control Tower.

---

## 9. Observabilidad

Distinta de la monitorización (que vigila métricas ya conocidas): la observabilidad permite responder preguntas nuevas y no anticipadas sobre el comportamiento del sistema, agregando — en forma de salud de sistema, nunca de contenido — los mismos eventos estructurados que cada tenant ya audita para sí mismo (`run_events` ADR-0006 §10, `decision_events`/`validation_events` ADR-0005 §10, `retrieval_events` ADR-0003 §11). El Plano de Control indexa estos eventos de forma cruzada entre tenants para diagnóstico de ingeniería, sin necesitar nunca acceder al contenido semántico de ninguno de ellos.

---

## 10. Diagnóstico remoto

La sección de mayor sensibilidad de gobernanza de todo el documento — es donde la tensión de §1 se vuelve más concreta.

**Por defecto**, el diagnóstico remoto de un tenant se limita a señales técnicas: estado de la máquina de estados de una ejecución bloqueada (ADR-0005 §3), registros de error, latencia, estado de sincronización de una fuente de conocimiento — nunca el contenido de una conversación, un presupuesto o una `KnowledgeUnit` concreta.

Cuando un caso de soporte requiere ver contenido real (un cliente reporta "mi Empleado Digital respondió mal a este paciente"), se aplica un protocolo explícito:

1. Se solicita un **`SupportAccessGrant`** — acotado a un objeto o conjunto de objetos concretos, con motivo declarado, nunca acceso general al tenant.
2. El grant es **de tiempo limitado** y se revoca automáticamente al expirar.
3. **Se audita íntegramente** — quién accedió, cuándo, a qué, y por qué — con el mismo rigor que cualquier `RetrievalEvent` o `decision_event` de la plataforma.
4. **Es visible para el propio cliente** — un tenant puede ver, en su propio historial de auditoría, cualquier acceso de soporte concedido sobre su cuenta, igual que puede ver cualquier otro evento que le afecta. Transparencia hacia dentro, aplicada aquí hacia el cliente sobre accesos externos a su información — mismo principio que PVD-0006 §11.7 aplica a un contribuyente de la red, ahora aplicado a un cliente frente al propio equipo de ATLAS AI.

---

## 11. Estado de cada instalación

Una ficha de salud por tenant, siempre agregada y nunca de contenido: disponibilidad reciente, tasa de error, cola de trabajos pendiente, fecha de la última ingesta de conocimiento exitosa, número de Empleados Digitales activos frente a suspendidos, `snapshot_version` vigente del Brain frente a la más reciente disponible (para detectar tenants desincronizados). Vive en Atlas Command Center, con resumen agregado también visible en Atlas Control Tower cuando hay una alerta activa.

---

## 12. Gestión de licencias

Plan contratado, funcionalidades habilitadas por plan (incluido el nivel de acceso a Knowledge Packs y benchmarking de Atlas Intelligence Network, PVD-0006 §12), número de asientos, y estado de participación en Atlas Intelligence Network (opt-in/opt-out, PVD-0006 §11.1) — un dato que el Plano de Control debe respetar activamente: un tenant con opt-out nunca debe aparecer, ni siquiera de forma agregada, en ninguna comparativa (§18).

---

## 13. Consumo IA

Volumen de uso — tokens consumidos, número de ejecuciones, número de llamadas a herramientas — agregado por tenant y por periodo, alimentado directamente por el mismo presupuesto de tokens y las mismas guardas ya definidas en ADR-0003 §8 y §9. Es la base técnica sobre la que se calculan tanto costes (§14) como facturación de uso (§15).

---

## 14. Costes

La traducción a coste real de infraestructura (proveedor de LLM, cómputo, almacenamiento) del consumo de IA (§13), atribuido por tenant siempre que sea técnicamente posible. Alimenta el análisis de margen a nivel de Atlas HQ — distinto de "Consumo IA", que mide volumen, no dinero, mismo principio de distinción métricas/KPIs ya establecido en AIF-0001 §2.

---

## 15. Facturación SaaS

Operación real de cobro — gestión de planes, cambios de suscripción, incidencias de pago — conectada al módulo de Billing ya previsto en ADR-0001 (Capa de negocio). Atlas Command Center es donde el equipo de operaciones resuelve una incidencia de facturación concreta de un cliente; Atlas HQ es donde se ve el ingreso agregado resultante.

---

## 16. Alertas

Sistema de alertas con severidad graduada y enrutamiento según superficie: una alerta de severidad baja o de un solo tenant vive en Atlas Command Center; una alerta de severidad alta o que afecta a múltiples tenants simultáneamente se escala de inmediato a Atlas Control Tower. El mecanismo de detección reutiliza el Risk Engine de AIF-0001 (§6.2), aplicado a señales de sistema en vez de señales de negocio de cliente — misma arquitectura, entrada distinta.

---

## 17. Mantenimiento

Ventanas de mantenimiento programadas por cohorte (nunca a la totalidad de tenants de golpe, mismo principio que §7), con comunicación proactiva al cliente antes de cualquier ventana que pueda afectar a su disponibilidad — la comunicación de mantenimiento es, en sí misma, una acción auditada y visible para el cliente, no un evento silencioso.

---

## 18. Comparativas entre clientes (anonimizadas)

Reutiliza, sin modificarlo, el mecanismo de anonimización de dos etapas ya definido en [PVD-0006 §5](../pvd/0006-atlas-intelligence-network.md): abstracción dentro del límite del tenant, agregación central con umbral k-anónimo obligatorio. La diferencia frente a PVD-0006 es exclusivamente el **consumidor** de la comparativa — ahí es el propio cliente viendo su benchmark de sector; aquí es el equipo interno de ATLAS AI viendo, de forma agregada y nunca individualizada por debajo del umbral k-anónimo, qué segmentos de clientes muestran señales de riesgo u oportunidad de producto. Un tenant con opt-out de Atlas Intelligence Network (§12) queda excluido de esta vista exactamente igual que de la vista orientada a cliente.

---

## 19. Cumplimiento normativo

Panel de cumplimiento agregado: qué tenants tienen requisitos de residencia de datos activos, estado de completitud de la auditoría (`knowledge.mutation`, `decision.*`, `validation.*`, ya definidos en ADR-0002/0005), y seguimiento de la política de retención y expurgo de eventos de auditoría — todavía una decisión abierta en varios ADR anteriores (ADR-0003 §15, ADR-0005 §14, ADR-0007 §18). Este documento no la resuelve, pero es, por diseño, el lugar donde esa política, una vez definida, se opera y se verifica de forma centralizada.

---

## 20. Seguridad

Control de acceso propio del Plano de Control — un RBAC interno de ATLAS AI, separado del RBAC de cada tenant (ADR-0001 §6.1): quién del equipo puede ver qué superficie, quién puede conceder un `SupportAccessGrant` (§10), y bajo qué autorización. Incluye detección de anomalías de acceso interno (un patrón de acceso inusual del propio equipo de ATLAS AI es, en sí mismo, una señal de riesgo que el Risk Engine interno debe poder detectar) y un protocolo de respuesta a incidentes de seguridad multi-tenant.

---

## 21. Integraciones

| Sistema | Qué aporta al Plano de Control | Qué NO expone |
|---|---|---|
| **Company Brain** (ADR-0002) | Métricas agregadas de cobertura, frescura y estado de ingesta por tenant | El contenido de ninguna `KnowledgeUnit` sin `SupportAccessGrant` explícito |
| **Business DNA** (PVD-0003) | Señal de madurez de configuración (¿el tenant sigue en valores por defecto o ya personalizó su DNA?) | El contenido específico de rasgos o líneas rojas de un tenant sin justificación auditada |
| **Atlas Employee Designer** (AED-0001) | Vista de flota: número de Empleados Digitales activos, distribución de niveles de competencia y certificaciones a nivel agregado | El diseño detallado de un Empleado Digital de un tenant concreto, salvo soporte acotado |
| **Knowledge Studio** (AIF-0001 §2) | Es, de hecho, accedido *desde* Atlas Command Center por el equipo interno de curación de Knowledge Packs | No es una fuente de datos hacia el Plano de Control — es una herramienta que el equipo interno opera desde ahí |
| **Atlas Business Value Library** | Agregado de qué oportunidades (ABVL) se adoptan más entre la base de clientes, informando prioridad de producto | Datos de negocio específicos de un cliente que ejecuta una oportunidad concreta |
| **Atlas Intelligence Framework** (AIF-0001) | Los diez motores se reutilizan íntegros, aplicados a la flota de tenants en vez de a un solo negocio (§3) | Ninguna lógica de razonamiento nueva — misma arquitectura, ámbito distinto |

---

## 22. Entidades y servicios de referencia

| Entidad | Propósito |
|---|---|
| `TenantHealthRecord` | Ficha de salud agregada de un tenant (§11), fuente de Atlas Command Center y Control Tower |
| `SupportAccessGrant` | Acceso de soporte acotado, auditado y temporal a contenido de un tenant (§10) |
| `DeploymentCohort` | Agrupación de tenants para despliegue escalonado de versiones o Knowledge Packs (§5, §7) |
| `PlatformAlert` | Alerta de sistema con severidad y ámbito (un tenant o multi-tenant), enrutada según §16 |
| `ComplianceRecord` | Estado de cumplimiento normativo agregado por tenant (§19) |

| Servicio | Responsabilidad |
|---|---|
| `FleetOpportunityService` / `FleetRiskService` | Instancias del Opportunity Engine y Risk Engine de AIF-0001 (§6.1–6.2), apuntadas a señales de salud de tenant en vez de señales de negocio |
| `SupportAccessOrchestrator` | Gestiona la concesión, expiración y auditoría de `SupportAccessGrant` (§10) |
| `CohortRolloutService` | Ejecuta despliegues y mantenimientos por cohorte (§5, §7, §17) |
| `FleetBenchmarkingService` | Reutiliza el mecanismo de PVD-0006 §5 para comparativas internas anonimizadas (§18) |
| `InternalRBACService` | Control de acceso propio del Plano de Control, separado del RBAC de tenant (§20) |

El esquema de datos exhaustivo se desarrolla en un ADR posterior, siguiendo el mismo patrón de la serie.

---

## 23. Riesgos

| Riesgo | Severidad | Mitigación |
|---|---|---|
| El Plano de Control se convierte, con el tiempo, en una vía de acceso a contenido de tenant sin la disciplina de `SupportAccessGrant` | Crítica | El principio de §1 se trata como invariante de arquitectura, no como política revisable — cualquier función nueva que exponga contenido sin ese mecanismo se considera una violación de este ADR |
| Un equipo de soporte pequeño se satura si las alertas no están bien priorizadas | Alta | Reutilización directa del Priority Engine de AIF-0001 (§3), nunca listas planas sin ordenar |
| Comparativas internas (§18) identifican indirectamente a un tenant por debajo del umbral k-anónimo | Alta si ocurre | Mismo umbral mínimo no configurable a la baja que PVD-0006 §5, sin excepción por urgencia interna de negocio |
| Un despliegue por cohortes mal secuenciado (§7) afecta a un cliente crítico en la primera oleada | Media | Selección de cohortes con criterio de riesgo, nunca aleatoria — clientes de alto valor o alta sensibilidad normalmente en cohortes posteriores, no en canary |
| El RBAC interno (§20) no se audita con el mismo rigor que el RBAC de cliente, por ser "solo interno" | Alta si ocurre | Mismo estándar de auditoría transversal (ADR-0001 §6.3) aplicado sin relajación al acceso interno |

---

## 24. Decisiones abiertas

- Política definitiva de retención y expurgo de eventos de auditoría a escala de flota (§19) — decisión pendiente heredada de ADR-0003 §15, ADR-0005 §14 y ADR-0007 §18, que este documento opera pero no resuelve.
- Umbral exacto de severidad que escala una alerta de Atlas Command Center a Atlas Control Tower (§16) — a calibrar con datos reales de operación.
- Si `SupportAccessGrant` debe requerir notificación proactiva al cliente en el momento de concesión, o basta con que quede visible en su historial de auditoría bajo demanda (§10) — decisión de producto pendiente de validar con clientes piloto, en el mismo espíritu de honestidad comercial de PVD-0001 §9.
- Criterio exacto de asignación de tenants a cohortes de despliegue (§5, §7) — por tamaño, por antigüedad, por nivel de madurez del Atlas Maturity Model, o una combinación.
