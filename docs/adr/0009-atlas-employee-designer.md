# AED-0001 — Atlas Employee Designer

| | |
|---|---|
| **Designación de arquitectura** | ADR-0009 (fundamental) |
| **Estado** | Propuesto |
| **Fecha** | 2026-07-09 |
| **Alcance** | Transversal — el sistema de diseño de Empleados Digitales es el mismo para cualquier vertical |
| **Depende de** | [ADR-0001](0001-arquitectura-base-atlas-ai.md) · [ADR-0002](0002-company-brain.md) · [ADR-0005](0005-decision-engine-validation-engine.md) · [ADR-0006](0006-digital-employee-runtime.md) · [ADR-0007](0007-knowledge-acquisition-engine.md) · [AIF-0001 / ADR-0008](0008-atlas-intelligence-framework.md) |
| **Relacionado con** | [PVD-0001](../pvd/0001-product-vision-atlas-ai.md) · [PVD-0002](../pvd/0002-first-customer-experience.md) · [PVD-0003](../pvd/0003-business-dna.md) · [Atlas Dental Knowledge Library](../dkb/00_Master_Index.md) · [Atlas Business Value Library](../abvl/00_Master_Index.md) |
| **Estatus especial** | Documento fundamental. Define el único sistema de creación, configuración y evolución de Empleados Digitales — ningún vertical ni módulo puede crear un Empleado Digital por una vía distinta a la aquí descrita. |

---

## 0. Por qué este documento existe — Designer no es Runtime

[ADR-0006](0006-digital-employee-runtime.md) define **cómo se ejecuta** un Empleado Digital: el bucle de conversación, el ensamblado de prompt, la generación, la validación. Es el sistema que hace el trabajo del día a día.

Este documento define algo anterior y distinto: **cómo se diseña, se incorpora, se forma, se evalúa y — si corresponde — se retira** un Empleado Digital a lo largo del tiempo. Si ADR-0006 es el puesto de trabajo y el proceso operativo diario, AED-0001 es el expediente completo del empleado: su descripción de puesto, su formación, su historial de desempeño, sus certificaciones, su trayectoria.

Ningún Empleado Digital existe en ATLAS AI sin haber pasado por este sistema. El Digital Employee Runtime ejecuta lo que Atlas Employee Designer ya definió — nunca al revés.

---

## 1. Filosofía

Un Empleado Digital no es un producto de software que se configura. Es una entidad que se **diseña**, con la misma seriedad con la que una empresa diseñaría un puesto de trabajo real: con un rol claro, un propósito medible, límites explícitos, y una trayectoria de desarrollo — no un formulario técnico de permisos.

Cuatro convicciones gobiernan este documento:

1. **Se diseña un rol, no se programa un comportamiento.** El propietario define qué necesita que se haga, con quién colabora, y qué tan libre es de actuar — de la misma forma en que definiría el puesto de un empleado humano nuevo, coherente con la metáfora de incorporación de [PVD-0002](../pvd/0002-first-customer-experience.md).
2. **Todo Empleado Digital es prescindible.** El conocimiento y el valor que genera pertenecen a la empresa, no a él — puede reconfigurarse, sustituirse o retirarse sin pérdida, exactamente como establece [PVD-0001 §4](../pvd/0001-product-vision-atlas-ai.md). Este documento diseña entidades desechables con el mismo rigor con el que se diseñaría algo permanente, precisamente porque esa disciplina es la que hace segura la sustitución.
3. **El diseño no es un acto único.** Un Empleado Digital tiene un ciclo de vida — se forma, mejora, a veces se equivoca, y evoluciona con evidencia real, nunca con una configuración congelada el día de su creación.
4. **Diseñar mal un Empleado Digital es un riesgo de negocio, no solo un defecto técnico.** Un rol mal definido, con límites difusos, es tan peligroso para una empresa como un puesto de trabajo humano mal definido — este documento trata el diseño de roles con la seriedad de una decisión de contratación real.

---

## 2. Qué es un Empleado Digital

Formalmente, un Empleado Digital es un **`DigitalEmployeeProfile`**: una entidad con nombre, rol, propósito declarado, un conjunto acotado de dominios de conocimiento accesibles, un `capability_grant` (ADR-0001 §6.2), un perfil de personalidad y tono heredado y matizado del Business DNA (PVD-0003), y un ciclo de vida propio auditado.

No es un chatbot genérico ni un agente sin estructura. Lo distingue de eso:

- **Tiene un propósito ligado a un proceso real de negocio** — típicamente derivado de un proceso de la biblioteca de conocimiento de vertical ([Atlas Dental Knowledge Library](../dkb/00_Master_Index.md)) o de una oportunidad documentada en la [Atlas Business Value Library](../abvl/00_Master_Index.md).
- **Opera estrictamente dentro de un alcance de capacidades definido**, nunca con acceso implícito a todo lo que la organización sabe o puede hacer.
- **Se gobierna en tiempo de ejecución** por el Decision Engine y el Validation Engine (ADR-0005) — el diseño define el marco, la gobernanza en tiempo real lo hace cumplir.
- **No almacena conocimiento propio intransferible** (§11) — lo que aprende de valor duradero se convierte en conocimiento gobernado de la empresa, nunca en un secreto suyo.

---

## 3. Ciclo de vida

```
DISEÑO
   │  se define rol, propósito, alcance inicial de capacidades
   ▼
INCORPORACIÓN
   │  se crea el DigitalEmployeeProfile, se aplica herencia de DNA,
   │  el capability_grant inicial es deliberadamente conservador
   ▼
FORMACIÓN INICIAL
   │  se calibra su acceso a los dominios de Company Brain relevantes
   │  a su rol — no accede a todo el Brain, solo a lo que su rol requiere
   ▼
SUPERVISIÓN ESTRECHA (periodo de prueba)
   │  alta fricción de aprobación por defecto (PVD-0002 §Momento 4,
   │  PVD-0003 §10) — el empleado actúa, el humano revisa con frecuencia
   ▼
DESEMPEÑO ACTIVO ◀──────────────────────────────┐
   │  operación normal, medido por KPIs (§13)     │
   │  y ROI individual (§14)                      │
   ▼                                              │
EVALUACIÓN CONTINUA                               │
   │  seguimiento de desempeño, candidato a         │
   │  certificación (§16) o a ajuste de alcance      │
   ▼                                              │
   ├──▶ DESARROLLO / AMPLIACIÓN DE CAPACIDADES ────┘
   │      (solo con evidencia acumulada — fricción
   │       asimétrica de PVD-0003 §10)
   │
   ├──▶ REDEFINICIÓN DE ROL
   │      (el negocio cambia, el rol se ajusta — nunca en silencio)
   │
   ├──▶ SUSPENSIÓN TEMPORAL
   │      (pausa sin eliminar el perfil ni su historial)
   │
   └──▶ RETIRO / DESACTIVACIÓN
          (el perfil se archiva, su historial de auditoría se conserva
           íntegro, ningún conocimiento que generó se pierde porque
           nunca vivió solo "en su cabeza" — §11)
```

Toda transición de este ciclo se audita con el mismo rigor que un evento de ejecución (ADR-0006 §10) — pero en una escala de tiempo distinta: semanas o meses, no segundos.

---

## 4. Especializaciones

Una especialización es una combinación acotada y con nombre de: dominio(s) de conocimiento accesibles, conjunto de herramientas asignadas, e intenciones de tarea para las que está optimizada. No es una categoría técnica interna — es, deliberadamente, un **título de puesto reconocible**, igual que lo sería para un empleado humano.

| Categoría de especialización | Ejemplos (vertical Dental) | Perfil de riesgo típico |
|---|---|---|
| Operativa | Recepción Digital, Agenda y Recall | Bajo — mayormente lectura y programación |
| Comercial | Coordinador de Presupuestos, Reputación y Campañas | Medio — acciones con impacto económico o reputacional |
| De riesgo acotado | Guardián de Urgencias | Máxima restricción — solo triage y escalado, nunca decisión |
| Analítica | Analista de Negocio (ver [AIF-0001 §6.10](0008-atlas-intelligence-framework.md), Executive Copilot) | Bajo en ejecución, alto en visibilidad de datos |

Cada especialización del vertical Dental se deriva directamente de un proceso documentado en [DKB-PAC-01](../dkb/03_Paciente/DKB-PAC-01_Recorrido_Paciente.md) y, con frecuencia, de una oportunidad concreta de la [Atlas Business Value Library](../abvl/00_Master_Index.md) — nunca se inventa una especialización sin un proceso o una oportunidad de negocio real detrás.

---

## 5. Competencias

Una competencia es una **habilidad funcional concreta**, distinta de una capacidad (§7): la capacidad es lo que un Empleado Digital tiene *permitido* hacer; la competencia es lo bien que lo hace, medido con evidencia real.

Se definen tres niveles de dominio por competencia:

| Nivel | Significado | Requisito |
|---|---|---|
| **Novato** | Competencia recién asignada, sin historial de desempeño | Nivel de partida obligatorio de cualquier competencia nueva |
| **Competente** | Historial consistente sin incidencias relevantes | Volumen mínimo de ejecuciones + tasa de validación (ADR-0005 §5) por encima de umbral |
| **Experto** | Historial extenso, alto grado de confianza acumulada, candidato a certificación (§16) | Evaluado por el Confidence Engine y el Business Evolution Engine (AIF-0001 §6.7, §6.9), aplicados a nivel de empleado individual |

El nivel de dominio de una competencia **nunca se asigna por antigüedad ni por defecto** — se gana con evidencia, igual que un nivel de madurez empresarial en el Atlas Maturity Model (AIF-0001 §5).

---

## 6. Herramientas

El diseño de un Empleado Digital incluye la asignación explícita de herramientas desde el registro central definido en [ADR-0006 §6.1](0006-digital-employee-runtime.md) — nunca acceso implícito a "todas las herramientas disponibles". Un humano autorizado, típicamente desde Knowledge Studio (AIF-0001 §2), selecciona qué herramientas concretas corresponden a la especialización de ese empleado, respetando la clasificación de riesgo (`read`/`write`) ya definida en ADR-0006.

La asignación de herramientas en el diseño es la que después el `CapabilityGate` (ADR-0005 §4.3) verifica en cada ejecución real — el diseño declara el marco, el Decision Engine lo hace cumplir.

---

## 7. Capacidades

Es la superficie de diseño del Capability Model ya definido en [ADR-0001 §6.2](0001-arquitectura-base-atlas-ai.md): aquí es donde un humano autorizado define, para un `DigitalEmployeeProfile` concreto, sus `allowed_domains`, su `sensitivity_ceiling`, y qué categorías de acción requieren `APPROVAL_REQUIRED` por defecto.

**Capacidad ≠ competencia**: un empleado puede tener la capacidad (el permiso) de ejecutar una acción desde el primer día, con competencia de nivel Novato — el permiso no implica dominio, y el diseño trata ambas dimensiones por separado.

---

## 8. Límites

Todo Empleado Digital opera bajo cuatro capas de límites simultáneas, aplicadas todas a la vez — la más restrictiva siempre gana:

| Capa | Origen | Ejemplo |
|---|---|---|
| **De plataforma** | Nunca configurable, aplica a cualquier Empleado Digital de cualquier cliente | Ningún Empleado Digital puede evitar el Decision Engine (ADR-0005 §0) |
| **De vertical** | Líneas rojas de la biblioteca de conocimiento del vertical | Nunca diagnosticar clínicamente (ver [DKB-EMP-01](../dkb/01_Empresa/DKB-EMP-01_Modelos_Clinica.md)) |
| **De cliente** | `DNARedLine` específica del Business DNA de esa organización | "No debe tocar información financiera" (PVD-0003 §3.1) |
| **De rol** | El `capability_grant` concreto de ese `DigitalEmployeeProfile` | El Guardián de Urgencias no tiene acceso al dominio de Marketing |

Ningún nivel de madurez, certificación ni antigüedad relaja una capa superior a la del rol — un empleado "experto" en una competencia sigue sujeto a las tres capas de límites que están por encima de su diseño individual.

---

## 9. Personalidad

Distinta del tono (§10): la personalidad es el carácter de fondo con el que un Empleado Digital razona y actúa dentro de sus límites — su nivel de proactividad, cómo enmarca una situación ambigua, cuán directo es al comunicar un límite.

Se hereda por defecto del `BusinessDNAProfile` del cliente (PVD-0003), pero admite matices por rol, siempre auditados como *override* explícito (PVD-0003 §3.2) — nunca silenciosos. El ejemplo canónico es el Guardián de Urgencias: aunque el DNA general de la clínica sea cercano y pausado, este rol tiene, por diseño, una personalidad más directa y urgente — la función lo exige, y ese matiz queda registrado como una desviación intencional del perfil general, no como una inconsistencia.

---

## 10. Tono

Hereda el `DNAToneProfile` del cliente (PVD-0003 §3.1) por defecto en todo Empleado Digital nuevo — coherente con el Momento 5 del onboarding (PVD-0002, "dale nombre y voz"). Admite personalización por rol con el mismo mecanismo de *override* auditado que la personalidad (§9): un mismo cliente puede tener un Coordinador de Presupuestos algo más formal (dado que gestiona compromisos económicos) y una Recepción Digital más cercana, ambos derivados del mismo DNA base pero matizados por función.

---

## 11. Memoria

**Un Empleado Digital no acumula memoria privada intransferible.**

Esta es, de todas las decisiones de este documento, la que más protege la filosofía de PVD-0001: si un empleado guardara conocimiento "en su propia cabeza" en vez de en el Brain, su retiro (§3) supondría una pérdida real de valor — exactamente lo que la plataforma existe para evitar.

Tres capas de memoria, con tratamiento distinto:

1. **Memoria conversacional/episódica** — el hilo de una conversación concreta (`conversation_messages`, ADR-0006 §11). Ephemeral por diseño, vive en Conversations, nunca en el Brain.
2. **Conocimiento de valor duradero** — cualquier cosa aprendida durante una ejecución que merezca persistir se convierte en una `KnowledgeProposal` (ADR-0002 §8) o una `DNAChangeProposal` (PVD-0003 §4), gobernada exactamente igual que cualquier otra propuesta — nunca queda como un ajuste interno invisible del propio empleado.
3. **Historial de aprendizaje del propio empleado** — distinto de ambas (§17): es el registro de cómo ha evolucionado el diseño del empleado en sí, no conocimiento del negocio.

Ningún Empleado Digital tiene, ni puede tener por diseño, una "relación personal" acumulada con un cliente o paciente concreto que no sea reconstruible por otro empleado con el mismo `capability_grant` — la continuidad de servicio nunca depende de que sea "el mismo" agente el que atienda dos veces.

---

## 12. Objetivos

Todo `DigitalEmployeeProfile` define objetivos explícitos y medibles, derivados directamente del proceso o la oportunidad que justifica su existencia (§4). Un objetivo mal definido — vago, no medible, o desconectado de un proceso real — es, por diseño de este documento, motivo de rediseño del rol antes de su incorporación.

Ejemplo: el objetivo del Coordinador de Presupuestos no es "ayudar con presupuestos" — es, siguiendo directamente [ABVL-01 §21](../abvl/ABVL-01_Seguimiento_Presupuestos_Pendientes.md), "maximizar la tasa de cierre de presupuestos gestionados mediante seguimiento sistemático, sin presión indebida sobre el paciente".

---

## 13. KPIs

Cada Empleado Digital tiene KPIs propios, distintos de (pero agregables a) los KPIs de la empresa completa (AIF-0001, PVD-0007). Se derivan directamente del campo "KPIs" de la oportunidad de la Business Value Library o del proceso de la Knowledge Library que justifica su rol — nunca se inventan métricas genéricas de "actividad" (número de mensajes enviados) desconectadas de valor real.

---

## 14. ROI individual

Extensión, a nivel de un solo Empleado Digital, del modelo de ROI de [PVD-0007](../pvd/0007-roi-intelligence-platform.md) — con la misma disciplina anti-inflación: solo se atribuye valor a un empleado concreto cuando existe un evento (`run_event`, ADR-0006 §10) etiquetado con su `agent_id` y una marca de comportamiento observable que lo sostiene.

El ROI individual responde a una pregunta muy concreta para el propietario: **¿este empleado concreto justifica ampliar su alcance, o debería reconsiderarse su rol?** — es, en la práctica, el filtro por el que un Empleado Digital pasa a Desarrollo/Ampliación de Capacidades (§3) o a Redefinición de Rol.

---

## 15. Formación continua

Un Empleado Digital "se forma" de dos maneras, ambas gobernadas, nunca silenciosas:

1. **Exposición a conocimiento nuevo o actualizado** de sus dominios asignados en el Brain, a medida que el pipeline de ingesta (ADR-0007) lo incorpora.
2. **Refinamiento de su comportamiento** a partir de patrones detectados por el Learning Engine (AIF-0001 §6.6) — nunca aplicado directamente, siempre como propuesta revisada en Knowledge Studio antes de afectar al empleado en producción.

La formación continua nunca es un ajuste interno del propio modelo que el resto de la plataforma no pueda auditar — es, siempre, una nueva versión declarada del diseño del empleado.

---

## 16. Certificaciones

Una certificación es el reconocimiento formal, otorgado tras revisión (típicamente en Knowledge Studio), de que un Empleado Digital ha demostrado un nivel **Experto** (§5) sostenido en una competencia concreta — nunca una certificación global de "buen empleado", siempre acotada a una competencia específica.

| Estado | Significado |
|---|---|
| **Sin certificar** | Estado por defecto de cualquier competencia nueva |
| **En evaluación** | Cumple los umbrales mínimos de volumen y desempeño, pendiente de revisión humana |
| **Certificado** | Revisado y confirmado — puede, si el propietario lo autoriza, reducir la fricción de aprobación en esa competencia concreta (fricción asimétrica de PVD-0003 §10) |

Una certificación **no es permanente por defecto** — se revisa periódicamente y puede revocarse si el desempeño se degrada, con el mismo rigor de auditoría que su concesión inicial.

---

## 17. Historial de aprendizaje

El expediente completo y auditable de cómo ha evolucionado el diseño de un Empleado Digital a lo largo de su ciclo de vida: cambios de `capability_grant`, competencias que alcanzaron nivel Experto, certificaciones concedidas o revocadas, ajustes de personalidad o tono, y las `KnowledgeProposal`/`DNAChangeProposal` que se originaron a partir de su actividad (§11).

Distinto de la Timeline de ADR-0006 (que reconstruye una ejecución concreta): este historial reconstruye **la trayectoria completa del empleado como entidad**, a lo largo de semanas o años, no de una sola conversación.

---

## 18. Explainability

Extiende el Explainability Engine (AIF-0001 §6.8) más allá de una respuesta o una ejecución puntual: cualquier decisión de **diseño** sobre un Empleado Digital debe poder explicarse igual que cualquier decisión de ejecución. Un propietario debe poder preguntar, en cualquier momento, "¿por qué este empleado tiene esta capacidad?", "¿por qué se certificó en esta competencia?", "¿por qué se amplió su alcance el mes pasado?" — y recibir una respuesta trazable hasta la evidencia y la aprobación humana concretas que lo motivaron, nunca una explicación genérica.

---

## 19. Supervisión humana

Solo usuarios con rol de autoridad suficiente (Owner/Admin, ADR-0001 §6.1) pueden crear, modificar el alcance de, certificar o retirar un Empleado Digital. Se aplica el mismo patrón de fricción asimétrica ya establecido en PVD-0003 §10: **crear un empleado con alcance conservador o retirarlo es de baja fricción; ampliar su alcance, certificar una competencia sensible, o relajar una restricción exige confirmación explícita adicional**, nunca el mismo gesto casual con el que se estrecha algo.

---

## 20. Integraciones

| Sistema | Qué recibe de AED-0001 | Qué NO hace AED-0001 |
|---|---|---|
| **Company Brain** (ADR-0002) | Define qué `KnowledgeDomain` puede consultar un empleado concreto — la frontera de acceso, no el contenido | No decide qué conocimiento existe ni lo modifica directamente |
| **Business DNA** (PVD-0003) | Hereda tono y personalidad por defecto (§9–10), con *overrides* auditados por rol | No define el DNA de la organización — solo lo consume y lo matiza |
| **Decision Engine** (ADR-0005) | Define el `capability_grant` inicial y las categorías con `APPROVAL_REQUIRED` que el Decision Engine hará cumplir en cada ejecución | No arbitra ninguna ejecución en tiempo real — eso es responsabilidad exclusiva del Decision Engine |
| **Atlas Intelligence Framework** (AIF-0001) | Consume Confidence Engine y Business Evolution Engine, aplicados a nivel de empleado individual, para informar certificaciones (§16) | No implementa lógica de razonamiento propia — reutiliza los diez motores ya definidos |
| **Atlas Business Value Library** (ABVL) | Cada especialización (§4) y cada objetivo (§12) se justifica, siempre que exista, en una oportunidad documentada de esta biblioteca | No inventa oportunidades de negocio — las consume ya documentadas |

---

## 21. Atlas Team Concept

**El propietario ve a su equipo humano y a su equipo digital como un único organigrama — no como una lista de personas y, en otra pantalla, una lista de "bots".**

Esta es la culminación práctica de la metáfora que sostiene todo el producto desde PVD-0002: si ATLAS AI incorpora Empleados Digitales de la misma forma en que se incorpora a una persona, el lugar natural para verlos es el mismo lugar donde se ve al resto del equipo.

### Principios del Atlas Team Concept

1. **Un Empleado Digital ocupa una posición reconocible**, con nombre y rol, nunca escondido en un panel de configuración técnica separado del resto de la organización.
2. **Nunca se difumina la distinción entre humano y digital.** Cada posición digital lleva un marcador visual inequívoco — coherente con el Atlas Principle "nunca ocultamos el uso de IA" (AIF-0001 §3), aplicado aquí a nivel estructural, no solo conversacional.
3. **Un Empleado Digital, por defecto, acompaña a un rol humano, no lo sustituye en el organigrama.** Se posiciona junto al rol humano al que da soporte — refuerza, no reemplaza, la estructura organizativa real.
4. **Todo Empleado Digital tiene un responsable humano visible** en el propio organigrama — la misma persona con autoridad para ampliar su alcance, certificarlo o retirarlo (§19).

### Ejemplo ilustrativo (clínica dental)

```
Propietario / Gerente
   │
   ├── Equipo Clínico (humano)
   │      ├── Dentista General
   │      ├── Especialistas
   │      └── Higienista
   │
   ├── Equipo Administrativo
   │      ├── Recepción (humana)              ⇄  🤖 Recepción Digital
   │      ├── Coordinador de Tratamientos      ⇄  🤖 Coordinador de Presupuestos
   │      └── (posición vacante)                   🤖 Agenda y Recall
   │
   └── Equipo Digital especializado
          ├── 🤖 Guardián de Urgencias   (siempre escala a un humano — nunca actúa solo)
          └── 🤖 Reputación y Campañas
```

Nótese que "Agenda y Recall" no acompaña a ningún rol humano concreto — cubre una función que, en muchas clínicas, no tenía a nadie dedicado (ver [DKB-PAC-01 §12](../dkb/03_Paciente/DKB-PAC-01_Recorrido_Paciente.md)) — el organigrama lo refleja como una posición digital que llena un vacío real, no que desplaza a alguien.

### Dónde vive esto en el producto

El Atlas Team Concept no introduce un motor nuevo — es una vista de presentación sobre datos que ya existen: los roles humanos (IAM, ADR-0001) y los perfiles de Empleados Digitales (`DigitalEmployeeProfile`, este documento), compuestos en una sola estructura visual. Se accede desde el mismo lugar donde un propietario gestionaría a su equipo humano, nunca desde un menú de "configuración de IA" separado — es la aplicación literal, en la interfaz, del principio "incorporamos, no configuramos" de PVD-0002.

---

## 22. Entidades y servicios de referencia

| Entidad | Propósito |
|---|---|
| `DigitalEmployeeProfile` | El registro central de un Empleado Digital: nombre, rol, especialización, capability_grant, DNA heredado/matizado, estado de ciclo de vida |
| `Competency` | Una competencia asignada, con su nivel de dominio (§5) y su historial de evidencia |
| `Certification` | Una certificación otorgada o revocada por competencia (§16) |
| `EmployeeLearningEvent` | Cada entrada del historial de aprendizaje del empleado (§17) |
| `TeamPosition` | La posición de un rol (humano o digital) dentro del Atlas Team Concept (§21), con su relación de acompañamiento si aplica |

| Servicio | Responsabilidad |
|---|---|
| `EmployeeDesignerService` | Orquesta la creación y modificación de un `DigitalEmployeeProfile`, aplicando herencia de DNA y validando límites (§8) |
| `LifecycleManager` | Gestiona las transiciones del ciclo de vida (§3), aplicando la fricción asimétrica correspondiente a cada transición |
| `CompetencyEvaluator` | Calcula el nivel de dominio de cada competencia a partir de evidencia real, en coordinación con el Confidence Engine (AIF-0001 §6.7) |
| `CertificationService` | Gestiona el ciclo de evaluación, concesión y revisión periódica de certificaciones |
| `TeamViewService` | Compone la vista del Atlas Team Concept a partir de roles humanos y perfiles de Empleados Digitales |

El esquema de datos exhaustivo (tablas y contratos de tipos) se desarrolla en un ADR posterior, siguiendo el mismo patrón de la serie: primero la visión y las garantías, después el esquema técnico exacto.

---

## 23. Riesgos

| Riesgo | Severidad | Mitigación |
|---|---|---|
| Un rol de Empleado Digital mal diseñado, con propósito difuso, genera valor difícil de medir y de justificar | Alta | Todo objetivo (§12) debe derivarse de un proceso o una oportunidad documentada — nunca de una intuición sin respaldo |
| La ampliación de capacidades se convierte en un trámite rutinario en vez de una decisión deliberada | Alta | Fricción asimétrica no negociable (§19) — ampliar siempre exige confirmación explícita adicional |
| El Atlas Team Concept difumina, con el tiempo, la distinción entre roles humanos y digitales por presión de diseño visual | Alta si ocurre | Marcador visual inequívoco como requisito de producto no opcional (§21, principio 2) |
| Un Empleado Digital acumula, por un fallo de implementación, conocimiento efectivo que no se refleja como `KnowledgeProposal` auditable | Alta si ocurre | El principio de "sin memoria privada intransferible" (§11) se trata como invariante de arquitectura, no como recomendación de diseño |
| Certificaciones que no se revisan periódicamente quedan desactualizadas respecto al desempeño real | Media | Revisión periódica obligatoria, nunca permanente por defecto (§16) |

---

## 24. Decisiones abiertas

- Frecuencia por defecto de revisión periódica de certificaciones (§16) — a calibrar con datos reales de las primeras clínicas piloto.
- Si `TeamPosition` debe soportar jerarquías más complejas que "acompaña a" (p. ej. varios Empleados Digitales apoyando a un mismo rol humano, o un Empleado Digital apoyando a varios roles) — se define con casos reales de verticales más allá del dental.
- Umbral exacto de volumen y desempeño para pasar de nivel Competente a Experto en una competencia (§5) — mismo patrón de calibración pendiente que otros umbrales de la plataforma (ADR-0003 §15, ADR-0005 §14).
- Si el Atlas Team Concept debe permitir a un cliente ocultar completamente el marcador visual de "Empleado Digital" en algún contexto — la posición por defecto de este documento es que no, sin excepción, coherente con el Atlas Principle correspondiente (AIF-0001 §3).
