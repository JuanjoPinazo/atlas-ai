# AIF-0001 — Atlas Intelligence Framework

| | |
|---|---|
| **Designación de arquitectura** | ADR-0008 (fundamental) |
| **Estado** | Propuesto |
| **Fecha** | 2026-07-09 |
| **Alcance** | Transversal — válido para todos los verticales de ATLAS AI (Dental, Estética, Veterinaria, Talleres, Asesorías, Inmobiliarias y los que sigan). No pertenece a ningún vertical. |
| **Depende de** | [ADR-0001](0001-arquitectura-base-atlas-ai.md) · [ADR-0002](0002-company-brain.md) · [ADR-0003](0003-context-engine-retrieval-pipeline.md) · [ADR-0005](0005-decision-engine-validation-engine.md) · [ADR-0006](0006-digital-employee-runtime.md) · [ADR-0007](0007-knowledge-acquisition-engine.md) |
| **Relacionado con** | [PVD-0001](../pvd/0001-product-vision-atlas-ai.md) · [PVD-0003](../pvd/0003-business-dna.md) · [PVD-0004](../pvd/0004-atlas-home.md) · [PVD-0006](../pvd/0006-atlas-intelligence-network.md) · [PVD-0007](../pvd/0007-roi-intelligence-platform.md) |
| **Estatus especial** | Documento de referencia permanente. Ningún vertical (Dental, u otro) puede definir un mecanismo de inteligencia propio que contradiga o duplique lo aquí establecido — los verticales aportan conocimiento de dominio (ver Atlas Dental Knowledge Library), nunca una arquitectura de razonamiento alternativa. |

---

## 0. Qué es este documento y por qué existe

Todo lo construido hasta ahora — Company Brain, Context Engine, Decision Engine, Digital Employee Runtime, Knowledge Acquisition — responde a **cómo ATLAS AI ejecuta**: cómo recupera conocimiento, cómo arbitra una propuesta del LLM, cómo entrega una respuesta auditada. La Atlas Dental Knowledge Library responde a **qué sabe ATLAS AI** sobre un vertical concreto.

Ninguno de esos documentos responde a la pregunta que este sí responde: **¿cómo piensa ATLAS AI sobre el negocio de un cliente?** No cómo genera una respuesta a una pregunta puntual — cómo detecta que algo importa, cómo decide qué es prioritario, cómo mide si algo funcionó, cómo aprende de ello, y cómo se lo explica a un propietario de la forma en que lo haría un director de operaciones de confianza.

Ese razonamiento no puede vivir dentro de un vertical, porque el mismo razonamiento — "esta oportunidad importa más que esa otra", "este patrón es un riesgo", "esto generó valor real" — se aplica igual a una clínica dental, un taller mecánico o una asesoría fiscal. Vive aquí, en una capa transversal por encima de Company Brain y por debajo de la experiencia visible del producto (ATLAS Home, el Executive Copilot). **Este documento define esa capa: diez motores de inteligencia, los principios permanentes que los gobiernan a todos, el ciclo por el que el dato se convierte en aprendizaje, y los cinco niveles de madurez que una empresa puede alcanzar usándolos.**

Este documento se escribe para durar años. Los verticales cambiarán, los modelos de LLM cambiarán, la interfaz de usuario cambiará — la arquitectura de razonamiento que aquí se define no debería tener que reescribirse cada vez que ocurra alguna de esas cosas.

---

## 1. Posición en la arquitectura — la Capa de Inteligencia

```
Capa 0 — Plataforma:          Tenancy · IAM · Permission/Capability Engine · Audit
Capa 1 — Conocimiento:         Company Brain · Context Engine · Business DNA
Capa 2 — Control:              Decision Engine · Validation Engine
Capa 3 — INTELIGENCIA:         ATLAS INTELLIGENCE FRAMEWORK (10 motores) ← este documento
Capa 4 — Dominio de agentes:   Digital Employees · Integrations Hub
Capa 5 — Ejecución:            Agent Runtime (Digital Employee Runtime) · Workflows
Capa 6 — Interacción:          Conversations · Notifications · ATLAS Home · Executive Copilot
Capa 7 — Negocio:              Billing · Admin Console · Marketplace
```

La Capa de Inteligencia **no ejecuta nada por sí misma**. Lee de las capas 1 y 2 (conocimiento y decisiones ya tomadas y auditadas), sintetiza señales de negocio de mayor orden, y entrega esas señales hacia arriba — a la interfaz de usuario (ATLAS Home, PVD-0004) o hacia la Capa 2 como una nueva propuesta que debe volver a pasar por el Decision Engine antes de convertirse en cualquier acción real.

### Principio unificador de esta capa

> **Todo motor propone. Ninguno decide.**

Es la extensión directa, a esta nueva capa, del principio rector de ADR-0005 §0 ("el LLM propone, el motor dispone"). Ningún motor de este documento tiene autoridad para ejecutar una acción, modificar el Brain, cambiar una política o alterar el Business DNA por su cuenta. Cada motor produce un objeto de salida tipado — una oportunidad, un riesgo, una recomendación, una prioridad — que se audita, se explica, y que solo se convierte en algo real si pasa por la gobernanza ya establecida (Decision Engine, Policy Evaluator, Approval Orchestrator).

---

## 2. Componentes de referencia introducidos por este documento

Dos superficies de producto se mencionan en las interacciones de los diez motores y no estaban formalmente definidas en los ADR anteriores. Se definen aquí, sin introducir mecanismos de gobernanza nuevos — les dan una superficie de producto a mecanismos ya descritos.

**Knowledge Studio** — la herramienta de trabajo donde humanos autorizados (equipo de ATLAS o administradores de cada cliente) revisan, editan y curan directamente el conocimiento antes de su promoción: `KnowledgeProposal` (ADR-0002 §8), `DNAChangeProposal` (PVD-0003 §4), políticas (ADR-0005 §11), y Knowledge Packs (PVD-0006 §6). Es la interfaz humana de la gobernanza de conocimiento ya definida — no un motor de decisión nuevo.

**Marketplace** — la superficie de distribución y descubrimiento donde los Knowledge Packs, plantillas de vertical (como la Atlas Dental Knowledge Library), configuraciones reutilizables de Empleados Digitales, e integraciones de terceros se publican y se instalan. Es el lugar donde la inteligencia colectiva de Atlas Intelligence Network (PVD-0006) se vuelve tangible y adoptable por un cliente concreto.

### Distinción de vocabulario usada en cada motor: métricas vs. KPIs

Para evitar ambigüedad, se aplica de forma consistente en los diez motores: **métricas** son indicadores técnicos/operativos internos del propio motor (volumen procesado, latencia, tasa de falsos positivos) usados para vigilar su salud; **KPIs** son indicadores de valor de negocio visibles para el cliente (vía ATLAS Home, el Copilot, o el dashboard de ROI de PVD-0007).

---

## 3. Atlas Principles

La filosofía permanente que gobierna todo motor de inteligencia de ATLAS AI, sin excepción de vertical, de cliente ni de nivel de madurez alcanzado.

| Principio | Qué significa en la práctica |
|---|---|
| **Nunca sustituimos al profesional.** | Ningún motor toma una decisión que corresponda al juicio experto del cliente (clínico, legal, técnico según el vertical) — solo informa, prioriza y recomienda. Heredado de [PVD-0001 §3](../pvd/0001-product-vision-atlas-ai.md) y aplicado aquí a los diez motores sin excepción. |
| **Nunca ocultamos el uso de IA.** | Toda recomendación, alerta o respuesta generada por un motor de esta capa se identifica como tal ante el usuario — nunca se presenta como si fuera una observación puramente humana. |
| **Toda decisión debe poder explicarse.** | Ninguna salida de ningún motor se entrega sin que el Explainability Engine (§6.8) pueda reconstruir, bajo petición, por qué se produjo. |
| **Toda automatización debe aportar valor.** | Ninguna automatización se justifica por ser técnicamente posible — debe ser trazable hasta un beneficio real medido por el ROI Engine (§6.5), con la misma disciplina anti-inflación de [PVD-0007](../pvd/0007-roi-intelligence-platform.md). |
| **Toda acción debe quedar auditada.** | Cada propuesta de cada motor genera un evento de auditoría, se ejecute o no, se acepte o se rechace — heredado del estándar transversal de ADR-0001 §6.3. |
| **Toda IA debe respetar el Business DNA.** | Ningún motor puede proponer algo que contradiga una `DNARedLine` (PVD-0003 §3.1) — las líneas rojas del cliente son axiomas para los diez motores, no una señal más a ponderar. |
| **Todo aprendizaje requiere trazabilidad.** | El Learning Engine (§6.6) nunca actualiza confianza, conocimiento o comportamiento sin dejar registro de qué observación concreta lo motivó. |
| **Todo conocimiento posee un nivel de confianza.** | Ningún dato, patrón o recomendación se presenta como verdad absoluta — todo lleva asociada una puntuación de confianza calculada por el Confidence Engine (§6.7), visible bajo petición. |
| **Todo motor propone, ninguno decide.** *(§1)* | El principio estructural que hace posible a todos los demás — sin él, ningún otro principio de esta lista sería verificable en el código, solo una intención de diseño. |
| **La inteligencia colectiva nunca compromete la privacidad individual.** | Cualquier señal que un motor derive de patrones agregados de red respeta, sin excepción, las garantías de [PVD-0006 §11](../pvd/0006-atlas-intelligence-network.md) — el aprendizaje entre clientes nunca filtra datos de un cliente concreto. |
| **Toda inteligencia debe ser reproducible.** | Dado el mismo `snapshot_version` del Brain y del Business DNA, cualquier motor debe poder reconstruir la misma salida que produjo en su momento — la inteligencia de ATLAS AI nunca es una caja negra no determinista incluso cuando internamente usa modelos probabilísticos. |

---

## 4. Atlas Intelligence Lifecycle

El ciclo completo por el que un hecho crudo se convierte, con el tiempo, en una empresa más inteligente. Es un ciclo cerrado — el aprendizaje de una vuelta alimenta la siguiente.

```
   DATO                    la unidad más pequeña: un documento subido, un mensaje,
     │                     un evento de herramienta, un registro de sistema externo
     ▼
   INFORMACIÓN             el dato normalizado y estructurado — una KnowledgeUnit
     │                     tras el pipeline de ingesta (ADR-0007)
     ▼
   CONOCIMIENTO            información organizada, versionada y contextualizada —
     │                     el Company Brain canónico (ADR-0002) y el Business DNA
     │                     de la empresa (PVD-0003)
     ▼
   INTELIGENCIA            patrones y señales de negocio derivadas del conocimiento —
     │                     exactamente donde operan los diez motores de este documento
     ▼
   RECOMENDACIÓN           la síntesis accionable propuesta por el Recommendation
     │                     Engine (§6.3), expuesta por el Executive Copilot (§6.10) —
     │                     siempre como propuesta, nunca como acción ejecutada
     ▼
   ACCIÓN                  si se autoriza vía Decision Engine (ADR-0005), la
     │                     recomendación se convierte en ejecución real a través
     │                     del Agent Runtime y el Tool Executor (ADR-0006)
     ▼
   RESULTADO               el efecto observable de esa acción — un run_event,
     │                     un cambio medible en un KPI, un hecho de negocio real
     │                     (un presupuesto cerrado, una cita recuperada)
     ▼
   APRENDIZAJE             el Learning Engine (§6.6) observa el resultado, actualiza
     │                     confianza (Confidence Engine, §6.7), y — si corresponde —
     │                     genera una nueva propuesta de conocimiento o de DNA,
     │                     siempre a través de la gobernanza ya establecida
     │
     └──────────────▶ vuelve a DATO / INFORMACIÓN, con el sistema un poco
                        más informado que en la vuelta anterior
```

Ninguna etapa de este ciclo puede saltarse. Un motor que produjera "inteligencia" sin conocimiento versionado detrás, o una "acción" que no derive de una recomendación auditada, rompe el ciclo — y con él, la explicabilidad de todo lo que ocurre después.

---

## 5. Atlas Maturity Model

Cinco niveles de madurez que describen cuánta inteligencia de esta capa una empresa cliente usa realmente, y cuánta autonomía delega como consecuencia — nunca como precondición. **El nivel de madurez se gana con evidencia real, nunca se asigna por defecto ni se vende como una promesa inicial.**

| Nivel | Nombre | Qué caracteriza a la empresa | Motores predominantes activos | Autonomía típica |
|---|---|---|---|---|
| **1** | Digitalización | Procesos básicos digitalizados (agenda, algún sistema de gestión), pero sin inteligencia activa — los datos existen, no se usan para decidir nada todavía | Ninguno de los diez motores opera todavía con datos suficientes | Ninguna — es el estado anterior o inicial a ATLAS AI |
| **2** | Automatización asistida | Procesos repetitivos automatizados (recepción, recordatorios, seguimiento básico) bajo supervisión humana estrecha — el estado inmediato tras el onboarding ([PVD-0002](../pvd/0002-first-customer-experience.md)) | Confidence Engine, Explainability Engine (como base de confianza) | Baja — la mayoría de acciones requiere aprobación (PVD-0002 §Momento 4) |
| **3** | Inteligencia operativa | Opportunity, Risk y Priority Engine generan señales activas, consumidas regularmente por el propietario vía ATLAS Home — la empresa empieza a decidir con datos, pero toda decisión sigue siendo humana | Opportunity, Risk, Priority, ROI | Media — automatización de bajo riesgo sin aprobación, decisiones de negocio siguen siendo 100% humanas |
| **4** | Inteligencia predictiva y semi-autónoma | Recommendation Engine y ROI Engine maduros; el Executive Copilot es la interfaz principal de gestión diaria; un conjunto ampliado de acciones de bajo riesgo se ejecuta con autonomía dentro de límites calibrados con historial real (fricción asimétrica de [PVD-0003 §10](../pvd/0003-business-dna.md)); el Business Evolution Engine empieza a proponer cambios estructurales | Recommendation, ROI, Executive Copilot, Business Evolution | Alta en categorías de bajo riesgo demostrado — sigue siendo baja en categorías sensibles o clínicas |
| **5** | Empresa autónoma supervisada | El negocio delega un alto grado de operación diaria dentro de límites explícitos, auditados y calibrados con evidencia real — el propietario supervisa por excepción, no por operación diaria | Los diez motores operando de forma coordinada y madura | Muy alta en lo delegable — **nunca en líneas rojas, que permanecen absolutas en cualquier nivel** |

### Nota crítica sobre el Nivel 5

"Empresa autónoma supervisada" **no significa que la IA decida todo**. Significa que la empresa ha demostrado, con evidencia real y auditada a lo largo del tiempo, que puede delegar mucho más de lo que delegaba al principio — dentro de límites que siguen existiendo y que siguen siendo absolutos donde corresponde (decisiones clínicas, éticas, legales, cualquier `DNARedLine` vigente). Ninguna empresa alcanza el Nivel 5 relajando sus líneas rojas — las alcanza generando suficiente historial de confianza en todo lo demás como para que el Decision Engine (ADR-0005) reduzca de forma legítima la fricción de aprobación en las categorías que sí lo permiten.

### Cómo se mide el nivel

El **Business Evolution Engine** (§6.9) es, de los diez motores, el responsable de evaluar en qué nivel se encuentra una empresa y qué le falta para avanzar al siguiente — se detalla en su propia sección.

---

## 6. Los diez motores

### 6.1 Opportunity Engine

| Ficha técnica | |
|---|---|
| **Propósito** | Detectar oportunidades de negocio reales dentro de la operación del cliente — capacidad no utilizada, patrones de recuperación de ingreso, señales de comparación de red favorables |
| **Nivel de autonomía** | Solo propone — nunca ejecuta una acción comercial por su cuenta |
| **Aprobación humana** | No requerida para *detectar* y mostrar una oportunidad; sí requerida para cualquier acción comercial derivada (ver Recommendation Engine, §6.3) |

**Principios**: una oportunidad no detectada es, en la práctica, invisible para el negocio — el coste de no señalarla es tan real como el de una decisión equivocada. Toda oportunidad se presenta con su origen y su confianza visibles, nunca como una certeza.

**Funcionamiento interno**: el motor mantiene una biblioteca de "firmas de oportunidad" — patrones estructurales conocidos (hueco de agenda no ofrecido, seguimiento de presupuesto ausente, paciente/cliente vencido en revisión periódica, benchmark de red por debajo de la mediana del segmento) — con un núcleo transversal a todo vertical y extensiones específicas aportadas por cada biblioteca de conocimiento de vertical (p. ej. la Atlas Dental Knowledge Library). Escanea señales estructuradas de forma periódica y bajo demanda, comparando el estado actual contra cada firma.

**Entradas**: eventos de agenda, eventos de seguimiento de presupuesto (`ROIEvent`, ver §6.5), estado de recall (Company Brain vía integración clínica/operativa), señales de benchmarking de Atlas Intelligence Network (PVD-0006 §10).

**Salidas**: `OpportunityCandidate` — tipo de oportunidad, dominio afectado, impacto estimado (vía ROI Engine), puntuación de confianza (vía Confidence Engine), justificación citada.

**Reglas**: una oportunidad nunca se genera sin al menos una firma de patrón coincidente y una fuente de datos verificable. El impacto estimado se calcula siempre con la misma disciplina anti-inflación del ROI Engine (§6.5).

**Restricciones**: nunca genera una oportunidad basada en datos de categoría especial (salud u otros protegidos) como criterio de segmentación, herencia directa de las líneas rojas de vertical (ver Atlas Dental Knowledge Library, DKB-EMP-01).

**Interacción con Company Brain**: lee estado operativo estructurado (nunca conocimiento genérico de contenido) para detectar patrones — nunca escribe en el Brain directamente.

**Interacción con Business DNA**: los umbrales de sensibilidad de detección (cuán "agresivo" es el motor al señalar oportunidades) se calibran por el apetito de riesgo y las prioridades operativas declaradas en el DNA (PVD-0003 §1).

**Interacción con Decision Engine**: cualquier oportunidad que implique una acción concreta (contactar a un paciente, ofrecer un hueco) pasa, si se acepta, por el mismo `CapabilityGate` y `PolicyEvaluator` que cualquier otra acción (ADR-0005 §4.3–4.5).

**Interacción con Knowledge Studio**: las firmas de oportunidad nuevas o corregidas se curan y validan ahí antes de activarse en producción.

**Interacción con Marketplace**: las firmas de oportunidad de un vertical (p. ej. las derivadas de DKB-PAC-01) pueden empaquetarse y distribuirse como parte de un Knowledge Pack.

**Interacción con Digital Employees**: una oportunidad aceptada se traduce en una tarea que un Empleado Digital concreto ejecuta (p. ej. el Empleado Digital de Agenda y Recall ofreciendo el hueco liberado).

**Trazabilidad**: cada `OpportunityCandidate` referencia los eventos exactos que lo originaron — reconstruible igual que un `RetrievalEvent` (ADR-0003 §11).

**Ejemplos reales** *(ilustrativos)*: detección de un hueco de agenda liberado por cancelación, ofrecido de forma proactiva a la lista de espera antes de que quede vacío; detección de que un segmento de clientes está por debajo de la mediana de recall recuperado de su categoría en Atlas Intelligence Network.

**Riesgos**: sobre-señalización (demasiadas oportunidades de bajo valor real) satura al propietario y erosiona la confianza en el motor — mitigado por el Priority Engine (§6.4), que filtra antes de mostrar.

**Límites**: no detecta oportunidades fuera de los dominios ya representados en el Company Brain y el DKB de vertical — no "inventa" categorías de negocio nuevas por sí mismo.

**Métricas**: volumen de candidatos generados, tasa de falsos positivos (oportunidades descartadas por el propietario como no relevantes).

**KPIs**: proporción de oportunidades detectadas que se convierten en acción, valor total atribuido a oportunidades detectadas (alimenta el bloque "Oportunidades creadas" de PVD-0007 §7).

**Roadmap evolutivo**: fase inicial con firmas predefinidas por vertical; fase posterior con generación asistida de nuevas firmas a partir de patrones detectados por el Learning Engine (§6.6), siempre con curación humana antes de activarse.

---

### 6.2 Risk Engine

| Ficha técnica | |
|---|---|
| **Propósito** | Detectar riesgos operativos, financieros, de cumplimiento y reputacionales antes de que se materialicen en un daño real |
| **Nivel de autonomía** | Solo alerta — nunca mitiga un riesgo por su cuenta |
| **Aprobación humana** | Siempre requerida para cualquier acción de mitigación derivada |

**Principios**: un riesgo detectado a tiempo cuesta una fracción de lo que cuesta el mismo riesgo materializado — el valor de este motor está, casi por completo, en la anticipación. Ante la duda entre alertar de más o de menos, este motor alerta de más, con severidad graduada.

**Funcionamiento interno**: analiza tendencias (no solo eventos puntuales) sobre las mismas fuentes que ya audita el resto de la plataforma — `decision_events`, `validation_events`, `policy_evaluations`, `execution_halts` (ADR-0005) — junto con señales de negocio (caída de tasa de cierre de presupuestos, aumento de reseñas negativas, proximidad a un umbral de una `DNARedLine`).

**Entradas**: series temporales de eventos de gobernanza (ADR-0005), señales de reputación (Marketing/Reputación de vertical), indicadores financieros del ROI Engine.

**Salidas**: `RiskAlert` — tipo de riesgo, severidad, dominio afectado, tendencia (empeorando/estable/mejorando), confianza.

**Reglas**: todo `RiskAlert` de severidad alta genera notificación inmediata (nunca esperando al resumen diario de ATLAS Home). La severidad se recalcula con cada nueva observación, nunca queda congelada en su valor inicial.

**Restricciones**: nunca silencia ni suprime automáticamente un riesgo detectado por conveniencia de presentación — un mes con menos actividad de otros motores no implica reducir la vigilancia de riesgo.

**Interacción con Company Brain**: consulta la vigencia y confianza de las `KnowledgeUnit` implicadas en un riesgo (p. ej. una política desactualizada como causa raíz).

**Interacción con Business DNA**: la proximidad a una `DNARedLine` es, por definición, la categoría de riesgo de mayor severidad posible — nunca se pondera igual que un riesgo operativo menor.

**Interacción con Decision Engine**: se alimenta directamente de `POLICY_CONFLICT` y `EXECUTION_HALTED` como señales de entrada de primer orden (ADR-0005 §4.5, §4.7).

**Interacción con Knowledge Studio**: los patrones de riesgo se revisan y calibran ahí — un umbral de riesgo mal calibrado (demasiados falsos positivos) se corrige como una entrada de curación, no como un parche de código aislado.

**Interacción con Marketplace**: patrones de riesgo genéricos de vertical (p. ej. señales de riesgo reputacional dental) se distribuyen como parte de Knowledge Packs.

**Interacción con Digital Employees**: un riesgo de severidad alta puede activar un `AgentConsultationRequest` (ADR-0005 §4.6) si requiere involucrar a un especialista.

**Trazabilidad**: cada `RiskAlert` es reconstruible hasta los eventos concretos y la tendencia observada que lo originó.

**Ejemplos reales** *(ilustrativos)*: alerta temprana ante una tendencia sostenida de caída en la tasa de cierre de presupuestos de un dominio concreto; alerta de severidad alta ante la proximidad reiterada a una línea roja de aprobación de financiación.

**Riesgos**: un motor de riesgo demasiado sensible genera fatiga de alertas — mitigado por el mismo mecanismo de priorización que Opportunity Engine (§6.4).

**Límites**: detecta riesgos visibles en los datos que ya audita la plataforma — no sustituye una auditoría de cumplimiento normativo externa ni asesoría legal.

**Métricas**: tiempo medio de detección desde el inicio real de la tendencia, tasa de falsos positivos.

**KPIs**: proporción de riesgos alertados que se mitigaron antes de materializarse, coste evitado atribuible (alimenta PVD-0007 §4).

**Roadmap evolutivo**: fase inicial centrada en riesgos derivados de la propia plataforma (gobernanza, financieros directos); fase posterior incorporando señales externas (reputación pública, normativa sectorial cambiante) vía Integrations Hub.

---

### 6.3 Recommendation Engine

| Ficha técnica | |
|---|---|
| **Propósito** | Sintetizar las señales de Opportunity Engine y Risk Engine en una recomendación concreta y accionable — la respuesta a "¿y qué hacemos con esto?" |
| **Nivel de autonomía** | Propone siempre; la ejecución de lo recomendado sigue el mismo circuito de aprobación que cualquier acción de agente |
| **Aprobación humana** | Depende de la acción recomendada — se rige por el mismo Capability Model que cualquier `action_request` (ADR-0005 §4.3–4.4) |

**Principios**: una oportunidad o un riesgo sin una recomendación concreta asociada es información, no inteligencia útil — este motor es el que cierra esa distancia. Una recomendación siempre incluye una alternativa de "no actuar" explícita cuando es razonable, nunca presiona hacia la acción por defecto.

**Funcionamiento interno**: consume `OpportunityCandidate` y `RiskAlert`, los cruza con las prioridades operativas del Business DNA (PVD-0003 §1) y con el impacto estimado del ROI Engine, y genera una propuesta de acción concreta con su justificación completa.

**Entradas**: `OpportunityCandidate`, `RiskAlert`, prioridades del Business DNA, estimación de impacto del ROI Engine.

**Salidas**: `Recommendation` — acción propuesta, justificación, impacto estimado, nivel de confianza, urgencia.

**Reglas**: toda `Recommendation` debe poder trazarse a al menos un `OpportunityCandidate` o `RiskAlert` de origen — nunca se genera de la nada.

**Restricciones**: nunca recomienda una acción que el Capability Model del cliente ya ha marcado como fuera de alcance o como línea roja — se filtra antes de generarse, no después.

**Interacción con Company Brain**: cita las `KnowledgeUnit` relevantes (protocolo, política) que justifican la forma concreta de la recomendación.

**Interacción con Business DNA**: la redacción y el tono de la recomendación heredan el `DNAToneProfile` del cliente — una recomendación mal calibrada de tono es tan defecto como una mal calibrada de contenido.

**Interacción con Decision Engine**: toda recomendación aceptada por el usuario se convierte en un `action_request` estándar, sujeto íntegramente al pipeline de ADR-0005.

**Interacción con Knowledge Studio**: las plantillas de recomendación por tipo de oportunidad/riesgo se curan ahí.

**Interacción con Marketplace**: plantillas de recomendación de alto rendimiento verificado pueden distribuirse como parte de un Knowledge Pack (PVD-0006 §6).

**Interacción con Digital Employees**: una recomendación aceptada se asigna al Empleado Digital con la capability adecuada para ejecutarla.

**Trazabilidad**: cadena completa desde el dato de origen hasta la recomendación final, reconstruible por el Explainability Engine (§6.8).

**Ejemplos reales** *(ilustrativos)*: ante una oportunidad de recall vencido, recomendación concreta de contacto con horarios propuestos; ante un riesgo de caída de cierre de presupuestos, recomendación de revisar el guion de seguimiento de un dominio concreto.

**Riesgos**: una recomendación mal fundamentada, aceptada sin suficiente escrutinio por rutina, puede erosionar la confianza si falla — mitigado por mostrar siempre la confianza y la justificación junto a la recomendación, nunca de forma aislada.

**Límites**: no recomienda decisiones estratégicas de alto nivel (eso corresponde al Business Evolution Engine, §6.9) — se limita a recomendaciones operativas y tácticas.

**Métricas**: tasa de aceptación de recomendaciones, tiempo medio entre recomendación y decisión del usuario.

**KPIs**: valor generado por recomendaciones aceptadas (alimenta directamente el ROI Engine, §6.5).

**Roadmap evolutivo**: fase inicial con recomendaciones de una sola acción; fase posterior con recomendaciones de secuencia (varias acciones coordinadas) para oportunidades o riesgos complejos.

---

### 6.4 Priority Engine

| Ficha técnica | |
|---|---|
| **Propósito** | Ordenar el conjunto de oportunidades, riesgos y recomendaciones activas en lo que realmente merece la atención del propietario ahora — es el motor que hace posible la disciplina de restricción de contenido de ATLAS Home |
| **Nivel de autonomía** | Solo ordena — no genera contenido propio, no decide qué se hace con lo priorizado |
| **Aprobación humana** | No aplica — es un motor de ranking, no de acción |

**Principios**: no todo lo verdadero merece atención inmediata. La disciplina de este motor es la misma que gobierna PVD-0004 §2: decisión pendiente antes que riesgo, riesgo antes que oportunidad, oportunidad antes que estado — este motor es, literalmente, el mecanismo detrás de esa jerarquía de producto.

**Funcionamiento interno**: calcula, para cada candidato de entrada, una puntuación de prioridad como función de urgencia, impacto estimado (ROI Engine) y confianza (Confidence Engine), y aplica la jerarquía categórica fija (decisión > riesgo > oportunidad > estado) por encima de cualquier puntuación numérica dentro de cada categoría.

**Entradas**: todos los `OpportunityCandidate`, `RiskAlert` y `Recommendation` activos de un cliente.

**Salidas**: lista ordenada con puntuación de prioridad, consumida directamente por ATLAS Home (PVD-0004) y por el Executive Copilot (§6.10).

**Reglas**: la jerarquía categórica nunca se invierte por una puntuación numérica alta de una categoría inferior — un riesgo de baja puntuación siempre precede a una oportunidad de puntuación alta.

**Restricciones**: límite duro de elementos mostrados por defecto (coherente con la restricción de contenido de PVD-0004 §2) — el resto queda accesible bajo demanda, nunca oculto sin acceso.

**Interacción con Company Brain**: ninguna directa — opera exclusivamente sobre las salidas de otros motores.

**Interacción con Business DNA**: las prioridades operativas declaradas (PVD-0003 §1) ajustan los pesos relativos de impacto por dominio.

**Interacción con Decision Engine**: ninguna directa — es un motor de presentación, no de control de ejecución.

**Interacción con Knowledge Studio**: los pesos y la fórmula de priorización se ajustan y versionan ahí, con historial de cambios auditado.

**Interacción con Marketplace**: no aplica directamente — es lógica de plataforma, no contenido distribuible.

**Interacción con Digital Employees**: ninguna directa.

**Trazabilidad**: la puntuación de cada elemento priorizado es reconstruible y explicable — nunca un ranking opaco.

**Ejemplos reales** *(ilustrativos)*: una aprobación pendiente de bajo importe económico pero de alta urgencia temporal se muestra antes que una oportunidad de alto valor pero sin urgencia.

**Riesgos**: una fórmula de priorización mal calibrada puede enterrar señales importantes bajo ruido de menor relevancia — mitigado por revisión periódica en Knowledge Studio con datos reales de qué prioriza correctamente el motor frente a qué ignora el usuario.

**Límites**: no puede compensar una mala calidad de entrada — si Opportunity Engine o Risk Engine generan candidatos de baja calidad, este motor los ordenará bien, pero seguirán siendo de baja calidad.

**Métricas**: correlación entre orden mostrado y orden de atención real del usuario.

**KPIs**: tiempo medio hasta que el usuario atiende el elemento de máxima prioridad mostrado.

**Roadmap evolutivo**: fase inicial con fórmula de pesos fija por vertical; fase posterior con ajuste continuo por Learning Engine según el comportamiento real de atención del usuario, siempre con supervisión de Knowledge Studio antes de aplicar cambios de peso.

---

### 6.5 ROI Engine

| Ficha técnica | |
|---|---|
| **Propósito** | Medir, con disciplina anti-inflación, el valor económico real generado por ATLAS AI — es el motor técnico que sostiene por completo [PVD-0007](../pvd/0007-roi-intelligence-platform.md) |
| **Nivel de autonomía** | Solo mide y reporta — nunca ejecuta ni decide una acción por su cuenta |
| **Aprobación humana** | No requerida para el cálculo; el modelo de cálculo en sí (pesos, atribución) se revisa en Knowledge Studio |

**Principios**: los cuatro ya establecidos en PVD-0007 §11 se aplican aquí sin cambios — nunca comparar contra un escenario inventado, nunca duplicar un evento entre categorías, marcar siempre el grado de certeza, restar siempre el coste de la plataforma antes de mostrar cualquier cifra neta.

**Funcionamiento interno**: recibe `run_events` (ADR-0006 §10), `RiskAlert` mitigados, `Recommendation` aceptadas, y eventos de negocio verificables (presupuesto cerrado, cita recuperada), y los clasifica en las cuatro categorías de PVD-0007 §1 (costes evitados, horas ahorradas, ingresos recuperados, oportunidades creadas), aplicando siempre la regla de atribución conservadora de PVD-0007 §6.

**Entradas**: `run_events`, eventos de negocio verificables con marca de comportamiento observable, coste de la plataforma del periodo.

**Salidas**: `ROIEvent` (unidad individual de valor atribuido) y `ROISummary` (agregado periódico, consumido por el dashboard financiero de PVD-0007 §12).

**Reglas**: ningún `ROIEvent` se genera sin una marca de comportamiento observable que lo justifique (PVD-0007 §6) — la ausencia de esa marca significa que el valor no se cuenta, aunque exista.

**Restricciones**: nunca proyecta valor futuro con el mismo nivel de certeza que valor ya verificado — toda proyección se etiqueta sin ambigüedad como tal (PVD-0007 §12).

**Interacción con Company Brain**: ninguna directa — opera sobre eventos, no sobre contenido de conocimiento.

**Interacción con Business DNA**: el coste de referencia usado para "costes evitados" (PVD-0007 §4) puede calibrarse por las condiciones declaradas del cliente en su perfil.

**Interacción con Decision Engine**: consume el resultado final de acciones ya autorizadas y ejecutadas — nunca antes de que una acción se haya completado y auditado.

**Interacción con Knowledge Studio**: los coeficientes de valorización (p. ej. coste medio de una hora de gestión) se revisan y ajustan ahí, con evidencia real por vertical.

**Interacción con Marketplace**: no aplica directamente.

**Interacción con Digital Employees**: cada acción ejecutada por un Empleado Digital es una fuente potencial de `ROIEvent`.

**Trazabilidad**: cada cifra del dashboard financiero es trazable, con un clic, hasta el `ROIEvent` exacto que la sostiene — regla de oro de PVD-0007 §2, sin excepción.

**Ejemplos reales** *(ilustrativos)*: cierre de un presupuesto tras seguimiento activo, atribuido como ingreso recuperado; recuperación de un hueco de agenda cancelado, atribuido como ingreso recuperado con marca de comportamiento observable.

**Riesgos**: presión comercial para inflar cifras de ROI visibles — mitigado estructuralmente por las reglas de PVD-0007 §11, que son parte del contrato de este motor, no una opción de configuración.

**Límites**: no puede medir valor que no deja ninguna huella observable en el sistema — un beneficio real pero invisible a los datos de la plataforma no se cuenta, y esto se declara explícitamente como limitación, no se disimula.

**Métricas**: cobertura de eventos con atribución completa frente a eventos sin marca de comportamiento suficiente para atribuir.

**KPIs**: ROI neto del periodo, valor por unidad (llamada, presupuesto, cita — PVD-0007 §8–10).

**Roadmap evolutivo**: fase inicial con las cuatro categorías de PVD-0007; fase posterior con calibración de coeficientes específica por cliente basada en su propio histórico, no solo en valores de referencia de vertical.

---

### 6.6 Learning Engine

| Ficha técnica | |
|---|---|
| **Propósito** | Cerrar el ciclo del Atlas Intelligence Lifecycle (§4): observar qué ocurrió tras una recomendación, una oportunidad o un riesgo, y traducirlo en mejoras gobernadas de conocimiento, confianza y comportamiento |
| **Nivel de autonomía** | Nunca aplica un cambio directamente — genera siempre una propuesta gobernada |
| **Aprobación humana** | Toda propuesta de este motor sigue el mismo circuito de revisión ya establecido (`KnowledgeProposal`, `DNAChangeProposal`) |

**Principios**: aprender sin trazabilidad es indistinguible de alucinar un patrón — este motor nunca actualiza nada sin poder señalar la observación exacta que lo motivó (Atlas Principles, §3).

**Funcionamiento interno**: observa el resultado real de acciones ya ejecutadas (aceptación o rechazo de recomendaciones, materialización o no de un riesgo alertado, conversión o no de una oportunidad) y busca correlaciones estadísticamente significativas entre configuración/comportamiento y resultado — el mismo principio de detección de ADR-0005 §7 (señal, nunca decisión) y de PVD-0006 §7 (patrón candidato, nunca publicación automática), aplicado aquí de forma sistemática a los diez motores.

**Entradas**: resultados observados de `Recommendation`, `OpportunityCandidate` y `RiskAlert` ya cerrados; comportamiento de aceptación/rechazo del usuario.

**Salidas**: actualizaciones de peso de confianza (hacia Confidence Engine), `KnowledgeProposal` o `DNAChangeProposal` cuando el patrón lo justifica.

**Reglas**: ningún patrón se promueve a cambio aplicado sin pasar por la misma gobernanza de revisión humana que cualquier otra propuesta de conocimiento (ADR-0007 §10, PVD-0003 §4).

**Restricciones**: nunca aprende un patrón que implique presión comercial no deseada sobre un cliente final — límite de aprendizaje explícito, no solo de ejecución (mismo principio que la Atlas Dental Knowledge Library, DKB-PAC-01 §18 de este documento equivalente).

**Interacción con Company Brain**: genera `KnowledgeProposal` cuando detecta que un protocolo o plantilla debería actualizarse según el resultado observado.

**Interacción con Business DNA**: genera `DNAChangeProposal` de origen `inferred` cuando detecta un patrón de comportamiento consistente no capturado todavía en el perfil (PVD-0003 §4.2).

**Interacción con Decision Engine**: consume `approval_requests` resueltas como señal directa de qué se acepta y qué se rechaza sistemáticamente.

**Interacción con Knowledge Studio**: es la superficie donde toda propuesta de este motor se revisa antes de aplicarse — el motor y la herramienta son, en la práctica, un mismo flujo de trabajo visto desde dos lados.

**Interacción con Marketplace**: los patrones validados y de alta confianza pueden convertirse en candidatos a Knowledge Pack (PVD-0006 §6–7), tras curación.

**Interacción con Digital Employees**: puede proponer ajustes de capability grant de un agente concreto si observa un patrón sostenido de acciones rechazadas por estar fuera de su alcance actual.

**Trazabilidad**: cada propuesta generada referencia el conjunto exacto de observaciones que la originó, con su tamaño de muestra y significancia.

**Ejemplos reales** *(ilustrativos)*: detección de que las recomendaciones de seguimiento de presupuesto enviadas un jueves tienen mayor tasa de aceptación que las enviadas un lunes, propuesta como ajuste de plantilla sujeta a revisión.

**Riesgos**: sobreajuste a patrones de muestra pequeña interpretados como señal real — mitigado por exigir tamaño de muestra mínimo antes de generar cualquier propuesta, mismo principio de umbral k-anónimo de PVD-0006 §5 aplicado aquí al aprendizaje intra-cliente.

**Límites**: no distingue por sí solo correlación de causalidad — ese juicio se reserva siempre a la revisión humana en Knowledge Studio.

**Métricas**: tasa de propuestas aceptadas frente a rechazadas en revisión humana.

**KPIs**: mejora medible en KPIs de otros motores atribuible a cambios promovidos por este motor.

**Roadmap evolutivo**: fase inicial centrada en patrones intra-cliente; fase posterior coordinada con Atlas Intelligence Network (PVD-0006) para patrones cross-cliente, con las mismas garantías de privacidad ya establecidas.

---

### 6.7 Confidence Engine

| Ficha técnica | |
|---|---|
| **Propósito** | Asignar y mantener una puntuación de confianza a cada señal, recomendación y pieza de conocimiento de la plataforma — el sustrato de puntuación que consumen los otros nueve motores |
| **Nivel de autonomía** | No decide nada por sí mismo — es un servicio de puntuación consumido por el resto |
| **Aprobación humana** | No aplica directamente; los umbrales que usan otros motores para actuar sobre una puntuación sí pueden requerir aprobación según el contexto de cada motor |

**Principios**: ninguna salida de la Capa de Inteligencia se presenta sin una puntuación de confianza visible — es la aplicación directa, a esta capa, del Atlas Principle "todo conocimiento posee un nivel de confianza" (§3).

**Funcionamiento interno**: extiende el `ConfidenceScorer` de ADR-0005 §5/§7 (originalmente acotado a la validación de una respuesta) a un sustrato transversal que combina, según el objeto puntuado, señales de origen (`trust_level` de fuente, ADR-0002), señales de extracción (confianza de OCR/parsing, ADR-0007 §6), señales de resultado histórico (tasa de acierto pasada del mismo tipo de señal, vía Learning Engine) y — para documentos del DKB de vertical — el nivel de confianza declarado en su cabecera (Borrador / Validado parcialmente / Validado).

**Entradas**: metadatos de origen de cualquier objeto puntuable (KnowledgeUnit, OpportunityCandidate, RiskAlert, Recommendation, documento de biblioteca de vertical).

**Salidas**: puntuación de confianza normalizada, con desglose de las señales que la componen.

**Reglas**: la puntuación nunca se presenta como un número aislado sin desglose disponible bajo demanda — coherente con el principio de explicabilidad.

**Restricciones**: nunca sube la confianza de un objeto por presión de negocio o urgencia comercial — solo por evidencia real acumulada.

**Interacción con Company Brain**: consume `trust_level` de `KnowledgeSource` y vigencia temporal de `KnowledgeUnit` como señales de entrada directas.

**Interacción con Business DNA**: el umbral mínimo de confianza para actuar automáticamente se calibra por el apetito de riesgo declarado (PVD-0003 §7).

**Interacción con Decision Engine**: alimenta directamente al `ConfidenceScorer` de ADR-0005 §5, del que este motor es la generalización a toda la Capa de Inteligencia.

**Interacción con Knowledge Studio**: el nivel de confianza documental (Borrador/Validado parcialmente/Validado del Índice Maestro de la biblioteca) se actualiza ahí, informado por las puntuaciones agregadas de este motor.

**Interacción con Marketplace**: la confianza acumulada de un Knowledge Pack (frecuencia de adopción, resultados observados tras su adopción) es un factor de visibilidad en el Marketplace.

**Interacción con Digital Employees**: la confianza de una fuente de conocimiento condiciona si un agente puede citarla sin reserva o debe señalarla como poco verificada.

**Trazabilidad**: toda puntuación es reconstruible hasta sus componentes exactos.

**Ejemplos reales** *(ilustrativos)*: una `KnowledgeUnit` extraída con OCR de baja confianza y sin validación humana posterior mantiene una puntuación baja aunque provenga de una fuente de alto `trust_level`, hasta que se revisa.

**Riesgos**: una fórmula de agregación mal calibrada puede sub-ponderar o sobre-ponderar una señal concreta de forma sistemática — mitigado por revisión periódica con datos reales en Knowledge Studio.

**Límites**: no puede generar confianza donde no hay evidencia — un objeto nuevo, sin historial, siempre parte de una confianza baja o media, nunca alta por defecto.

**Métricas**: correlación entre puntuación de confianza y resultado real observado posteriormente (calibración del propio motor).

**KPIs**: proporción de decisiones automáticas correctas por encima de cada umbral de confianza usado en producción.

**Roadmap evolutivo**: fase inicial con fórmula de agregación fija por tipo de objeto; fase posterior con calibración continua supervisada por el Learning Engine.

---

### 6.8 Explainability Engine

| Ficha técnica | |
|---|---|
| **Propósito** | Ser la superficie única de "por qué" para cualquier salida de cualquiera de los diez motores — extiende el `ExplainabilityEngineService` de ADR-0006 §9 más allá de las respuestas de agente |
| **Nivel de autonomía** | No decide nada — ensambla y presenta explicaciones ya existentes en la auditoría |
| **Aprobación humana** | No aplica |

**Principios**: la explicabilidad no se genera bajo demanda como un texto nuevo — se **ensambla** desde registros ya persistidos, exactamente como establece ADR-0005 §10: "la explicabilidad es una propiedad emergente de la auditoría completa, no una función añadida aparte". Este motor aplica ese mismo principio a los otros nueve.

**Funcionamiento interno**: recibe una solicitud de explicación referida a cualquier objeto de salida (una `Recommendation`, un `RiskAlert`, una cifra de `ROISummary`, una puntuación de confianza) y reconstruye la cadena completa de eventos, decisiones y fuentes que lo originaron, presentándola en lenguaje claro.

**Entradas**: identificador del objeto a explicar; toda la traza de eventos asociada disponible en el sistema (`run_events`, `decision_events`, `retrieval_events`, salidas de los otros nueve motores).

**Salidas**: paquete de explicación estructurado — análogo al `ExplanationPackage` de ADR-0006 §12, generalizado a cualquier objeto de la Capa de Inteligencia.

**Reglas**: si no se puede ensamblar una explicación completa para un objeto, ese objeto no debería haberse mostrado en primer lugar — un fallo de explicabilidad es tratado como un defecto del motor de origen, nunca como una limitación aceptable de este motor.

**Restricciones**: nunca genera una explicación plausible pero no verificada como sustituto de una traza real — si la traza no existe, lo declara explícitamente en vez de rellenar el hueco.

**Interacción con Company Brain**: cita directamente las `KnowledgeUnit` con su versión exacta implicadas en cualquier explicación.

**Interacción con Business DNA**: explica, cuando aplica, qué rasgo o línea roja del DNA condicionó una salida concreta (p. ej. por qué una recomendación requirió aprobación).

**Interacción con Decision Engine**: es, en la práctica, la capa de presentación del mismo principio que ya gobierna ADR-0005 — no introduce lógica de explicación nueva, la hace visible de forma unificada.

**Interacción con Knowledge Studio**: cualquier vacío de trazabilidad detectado al intentar explicar algo se reporta ahí como incidencia de calidad de datos.

**Interacción con Marketplace**: la calidad de explicabilidad de un Knowledge Pack (cuán bien se pueden justificar sus recomendaciones asociadas) es un criterio de curación antes de publicarlo.

**Interacción con Digital Employees**: es el mecanismo que responde a "¿por qué dijiste esto?" en cualquier conversación con un Empleado Digital, más allá del `ExplanationPackage` de un solo mensaje.

**Trazabilidad**: este motor **es** la trazabilidad de la plataforma expuesta como producto — no tiene trazabilidad propia adicional que rendir cuentas, es la que rinde cuentas de todo lo demás.

**Ejemplos reales** *(ilustrativos)*: un propietario pregunta por qué se le mostró una alerta de riesgo concreta y recibe la secuencia exacta de eventos, con fechas, que la originó.

**Riesgos**: una explicación técnicamente correcta pero mal redactada (demasiado densa, con jerga interna) falla en su propósito aunque sea precisa — mitigado por aplicar el mismo estándar de tono claro y sin adornos de PVD-0004 §3.

**Límites**: puede explicar el "por qué" de una salida del sistema; no puede explicar ni justificar el juicio profesional humano que ocurrió fuera de la plataforma.

**Métricas**: tiempo de ensamblado de una explicación, proporción de solicitudes de explicación resueltas por completo frente a parcialmente.

**KPIs**: satisfacción del usuario con la claridad de las explicaciones recibidas.

**Roadmap evolutivo**: fase inicial con explicaciones bajo demanda; fase posterior con explicaciones proactivas adjuntas por defecto a cualquier señal de alta relevancia, sin esperar a que el usuario pregunte.

---

### 6.9 Business Evolution Engine

| Ficha técnica | |
|---|---|
| **Propósito** | Observar la trayectoria de una empresa a lo largo del tiempo — no un momento puntual — y evaluar su nivel del Atlas Maturity Model (§5), proponiendo qué necesita para avanzar |
| **Nivel de autonomía** | Solo propone cambios estructurales — nunca los aplica, y su horizonte es siempre estratégico, nunca táctico del día a día |
| **Aprobación humana** | Siempre requerida — cualquier cambio estructural (ampliar autonomía delegada, relajar una línea roja) sigue el protocolo de fricción asimétrica de PVD-0003 §10 |

**Principios**: la madurez se demuestra con historial, nunca se asigna por aspiración o por antigüedad de cliente — este motor mide evidencia acumulada, no intención declarada.

**Funcionamiento interno**: agrega, en ventanas de tiempo largas (meses, no días), las salidas de los otros nueve motores — tasa de aceptación de recomendaciones, estabilidad de confianza, historial de aprobaciones concedidas sin incidencia — y las contrasta contra los criterios de cada nivel del Atlas Maturity Model (§5) para estimar el nivel actual y las brechas concretas hacia el siguiente.

**Entradas**: histórico agregado de KPIs y métricas de los otros nueve motores, historial de `approval_requests` (ADR-0005), evolución del Business DNA (versiones a lo largo del tiempo, PVD-0003 §5).

**Salidas**: `MaturityAssessment` (nivel estimado, evidencia que lo sostiene, brechas hacia el siguiente nivel) y `EvolutionProposal` (cambio estructural concreto sugerido — p. ej. relajar una categoría de aprobación con historial demostrado).

**Reglas**: ningún `EvolutionProposal` que implique relajar una restricción se genera sin un volumen mínimo de historial demostrado — el umbral es deliberadamente conservador.

**Restricciones**: nunca propone relajar una `DNARedLine` — solo puede proponer cambios dentro del espacio ya delegable por diseño (Nota crítica del Nivel 5, §5).

**Interacción con Company Brain**: observa la evolución de cobertura y frescura del Brain a lo largo del tiempo como una de las señales de madurez.

**Interacción con Business DNA**: es, de los diez motores, el que más directamente dialoga con la evolución del DNA en el tiempo — cada `EvolutionProposal` de relajación de restricción se canaliza como un `DNAChangeProposal` (PVD-0003 §4).

**Interacción con Decision Engine**: consume el historial completo de `approval_requests` como evidencia central de confianza demostrada.

**Interacción con Knowledge Studio**: cualquier `EvolutionProposal` se revisa ahí con el mismo rigor que una propuesta de conocimiento, dado su impacto estructural.

**Interacción con Marketplace**: puede sugerir la adopción de un Knowledge Pack más avanzado del vertical si el cliente ya demuestra madurez suficiente para aprovecharlo.

**Interacción con Digital Employees**: puede proponer la creación de un nuevo Empleado Digital si detecta que un proceso maduro y de alto volumen carece todavía de uno dedicado.

**Trazabilidad**: todo `MaturityAssessment` y `EvolutionProposal` cita la evidencia agregada exacta (periodo, volumen, resultado) que lo sostiene.

**Ejemplos reales** *(ilustrativos)*: tras varios meses sin ninguna incidencia en las aprobaciones de una categoría concreta de acción, propuesta de relajar la fricción de aprobación en esa categoría específica, presentada al propietario para su confirmación explícita.

**Riesgos**: presión (interna o del propio cliente, deseoso de "avanzar de nivel") para relajar criterios de evidencia — mitigado por umbrales de evidencia fijos, no negociables por conveniencia comercial.

**Límites**: mide evidencia dentro de la plataforma — no evalúa la salud general del negocio del cliente más allá de lo que ATLAS AI puede observar directamente.

**Métricas**: precisión retrospectiva de sus propias evaluaciones de madurez (¿el nivel asignado predijo bien la ausencia de incidencias tras una relajación de restricción?).

**KPIs**: proporción de clientes que avanzan de nivel de madurez de forma sostenida (sin retroceso) tras una `EvolutionProposal` aceptada.

**Roadmap evolutivo**: fase inicial con evaluación de madurez informativa (sin proponer cambios estructurales todavía); fase posterior con generación activa de `EvolutionProposal`, siempre sujeta a aprobación explícita.

---

### 6.10 Executive Copilot Engine

| Ficha técnica | |
|---|---|
| **Propósito** | La interfaz conversacional que da voz unificada a los otros nueve motores — formaliza, como motor de arquitectura, la voz de "Director de Operaciones Digital" ya descrita en [PVD-0004 §1](../pvd/0004-atlas-home.md) |
| **Nivel de autonomía** | Es, en esencia, un Empleado Digital especializado — sujeto exactamente al mismo Digital Employee Runtime (ADR-0006), sin excepción alguna |
| **Aprobación humana** | Igual que cualquier interacción de agente — depende de la acción concreta solicitada, nunca de que la pregunta venga formulada al Copilot en vez de a otro canal |

**Principios**: el Copilot no es un motor más con lógica propia de decisión — es la superficie de consulta y síntesis de todos los demás. No sabe nada que los otros nueve motores no sepan ya; su valor es hacerlo accesible en lenguaje natural, bajo demanda, en vez de solo en el resumen pasivo diario de ATLAS Home.

**Funcionamiento interno**: recibe una pregunta o solicitud en lenguaje natural del propietario ("¿por qué bajó el ROI este mes?", "¿qué debería priorizar esta semana?"), la enruta al motor o combinación de motores relevante (Priority Engine para "qué priorizar", ROI Engine + Explainability Engine para "por qué bajó"), y compone una respuesta — pasando, como cualquier generación de un Empleado Digital, por el ciclo completo de Context Engine → Decision Engine → Validation Engine de ADR-0006 §3.

**Entradas**: consulta en lenguaje natural del usuario, salidas activas de los otros nueve motores como contexto disponible.

**Salidas**: respuesta conversacional, citada y explicable, con posibilidad de proponer una acción concreta (que sigue el mismo circuito de aprobación que cualquier `action_request`).

**Reglas**: nunca responde con una síntesis que no pueda descomponerse en las salidas verificables de los motores de origen — no "opina" al margen de lo que el resto de la Capa de Inteligencia ya sabe.

**Restricciones**: mismas restricciones que cualquier Empleado Digital — nunca sustituye criterio profesional, nunca oculta que es un sistema asistido por IA, nunca actúa sin pasar por Decision Engine.

**Interacción con Company Brain**: consulta el Brain vía Context Engine exactamente igual que cualquier otro Empleado Digital (ADR-0003).

**Interacción con Business DNA**: su tono de conversación hereda el `DNAToneProfile` del cliente, igual que cualquier otro agente — el Copilot habla como la empresa quiere que se le hable a su propietario, no con un tono genérico de asistente corporativo.

**Interacción con Decision Engine**: cada propuesta de acción que surge de una conversación con el Copilot se procesa exactamente igual que la de cualquier otro agente — sin atajo por tratarse del canal ejecutivo.

**Interacción con Knowledge Studio**: no interactúa directamente — es un consumidor de las salidas ya curadas de los otros motores, no un punto de edición de conocimiento.

**Interacción con Marketplace**: puede informar al propietario sobre Knowledge Packs relevantes disponibles, nunca instalarlos sin confirmación explícita.

**Interacción con Digital Employees**: puede consultar, en nombre del propietario, el estado o desempeño de cualquier otro Empleado Digital de la cuenta, con los mismos límites de capability grant que aplicarían a esa consulta si viniera de otro canal.

**Trazabilidad**: cada respuesta del Copilot es tan trazable como cualquier mensaje de agente — vía el mismo `ExplanationPackage` y Timeline de ADR-0006.

**Ejemplos reales** *(ilustrativos)*: el propietario pregunta "¿qué debería hacer hoy?" y recibe una síntesis priorizada (vía Priority Engine) de las tres cosas de mayor relevancia real, con la opción de profundizar en cualquiera de ellas sin salir de la conversación.

**Riesgos**: la naturaleza conversacional puede tentar a construir un canal de "acceso rápido" con menos fricción de gobernanza que el resto de la plataforma — riesgo explícitamente rechazado por diseño: el Copilot nunca tiene privilegios mayores que cualquier otro Empleado Digital equivalente.

**Límites**: no inventa capacidades que la cuenta del cliente no tiene activas — si un motor o una integración no está disponible, lo dice, en vez de simular una respuesta.

**Métricas**: latencia de respuesta, proporción de consultas resueltas sin necesidad de derivar a otra pantalla de la plataforma.

**KPIs**: frecuencia de uso como canal principal de gestión diaria — es, en sí misma, una señal de madurez (Nivel 4 del Atlas Maturity Model, §5).

**Roadmap evolutivo**: fase inicial con consultas de síntesis y explicación; fase posterior como canal conversacional completo de gestión, con capacidad de iniciar workflows multi-paso directamente desde la conversación.

---

## 7. Cómo interactúan los diez motores entre sí

```
Company Brain + Business DNA + Decision Engine (eventos ya auditados)
        │
        ▼
┌─────────────────┐     ┌─────────────┐
│ Opportunity      │     │ Risk         │
│ Engine           │     │ Engine       │
└────────┬─────────┘     └──────┬──────┘
         │                       │
         └───────────┬───────────┘
                      ▼
            ┌─────────────────────┐
            │ Recommendation Engine │◀──── ROI Engine (impacto estimado)
            └──────────┬───────────┘
                      │
                      ▼
            ┌─────────────────┐
            │ Priority Engine   │◀──── Business DNA (pesos por prioridad operativa)
            └──────────┬───────┘
                      │
      ┌───────────────┼────────────────┐
      ▼               ▼                ▼
 ATLAS Home    Executive Copilot   Decision Engine
 (PVD-0004)      Engine             (si se acepta una acción)
                      │
                      ▼
                  Resultado real
                      │
                      ▼
             ┌─────────────────┐
             │ Learning Engine   │──▶ KnowledgeProposal / DNAChangeProposal
             └──────────┬───────┘         (vía Knowledge Studio)
                      │
                      ▼
             ┌─────────────────┐
             │ Confidence Engine │ (consumido por los nueve motores restantes)
             └─────────────────┘

  Explainability Engine y Business Evolution Engine operan de forma
  transversal sobre todo lo anterior — el primero bajo demanda en
  cualquier punto, el segundo en ventanas de tiempo largas.
```

Ningún motor de este documento opera de forma aislada — el valor real de la Capa de Inteligencia está en esta composición, no en ninguno de los diez motores por separado.

---

## 8. Gobernanza transversal de la capa completa

| Riesgo | Severidad | Mitigación |
|---|---|---|
| Fatiga de señales — demasiadas oportunidades, riesgos y recomendaciones saturan al propietario | Alta | Priority Engine (§6.4) con límite duro de contenido mostrado, mismo principio de restricción que PVD-0004 |
| Confianza excesiva en un motor con historial todavía corto | Alta | Confidence Engine (§6.7) con confianza baja por defecto para cualquier señal nueva sin evidencia acumulada |
| Un vertical intenta introducir lógica de razonamiento propia en vez de usar los diez motores transversales | Media-Alta | Estatus especial de este documento (cabecera) — los verticales aportan conocimiento (DKB), nunca arquitectura de razonamiento alternativa |
| Un motor genera una salida que contradice una `DNARedLine` por un fallo de integración | Alta si ocurre | Restricción explícita en cada uno de los diez motores (§6.1–6.10) — las líneas rojas se verifican en cada motor de origen, no solo en el Decision Engine final |
| El Business Evolution Engine (§6.9) se convierte en presión para "subir de nivel" sin evidencia suficiente | Media | Umbrales de evidencia fijos y no negociables por conveniencia comercial (§6.9) |

---

## 9. Cómo usar este documento

Ante cualquier duda futura sobre si una funcionalidad nueva pertenece a esta capa o a otra, dos preguntas, en orden:

1. **¿Produce una señal de negocio de mayor orden a partir de conocimiento y decisiones ya existentes, o ejecuta directamente algo en el mundo?** Si es lo segundo, pertenece a Agent Runtime o a Integrations Hub, no a este documento.
2. **¿Encaja en uno de los diez motores ya definidos, o requiere un undécimo motor?** Antes de proponer un motor nuevo, verificar con cuidado si lo que se necesita es, en realidad, una extensión de uno de los diez existentes — la composición de motores (§7) es, casi siempre, más potente que añadir un motor aislado nuevo.

Este documento se revisa cuando la arquitectura de razonamiento cambie de verdad — no cada vez que se añade un vertical nuevo a la plataforma. Un vertical nuevo (Estética, Veterinaria, Talleres, Asesorías, Inmobiliarias) se incorpora aportando su propia biblioteca de conocimiento, con el mismo patrón que la Atlas Dental Knowledge Library — nunca reescribiendo este documento.
