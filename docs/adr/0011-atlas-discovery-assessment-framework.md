# ADR-0011: Atlas Discovery & Assessment Framework

| | |
|---|---|
| **Estado** | Propuesto |
| **Fecha** | 2026-07-09 |
| **Alcance** | Transversal — el motor de diagnóstico es el mismo para cualquier vertical; el contenido de las preguntas y del catálogo de oportunidades se instancia por vertical |
| **Depende de** | [AIF-0001 / ADR-0008](0008-atlas-intelligence-framework.md) (Maturity Model, Opportunity/Risk/ROI Engine) · [AED-0001 / ADR-0009](0009-atlas-employee-designer.md) (especializaciones recomendables) · [PVD-0006](../pvd/0006-atlas-intelligence-network.md) (benchmarking anonimizado) · [PVD-0007](../pvd/0007-roi-intelligence-platform.md) (disciplina de ROI) |
| **Instanciado por** | [Atlas Dental Knowledge Library](../dkb/00_Master_Index.md) y [Atlas Business Value Library](../abvl/00_Master_Index.md) para el vertical Dental — el patrón se repite igual para cualquier vertical futuro |
| **Precede a** | [PVD-0002: First Customer Experience](../pvd/0002-first-customer-experience.md) — Discovery ocurre antes de que exista una cuenta; el onboarding de PVD-0002 ocurre después de la decisión de compra |
| **Estatus especial** | Documento fundamental. Define el único sistema de diagnóstico previo a la implantación — ningún equipo comercial ni ningún vertical diseña su propio proceso de auditoría inicial por fuera de este marco. |

---

## 0. Dónde vive este documento en el recorrido del cliente

```
Prospecto desconocido
        │
        ▼
   ATLAS DISCOVERY & ASSESSMENT FRAMEWORK   ◀── este documento
   (audita, puntúa, recomienda, propone)
        │
        ▼
   Decisión de compra
        │
        ▼
   PVD-0002 — Primeros 15 minutos (onboarding)
        │
        ▼
   Operación real — Company Brain, Decision Engine,
   Atlas Intelligence Framework, ROI real
```

PVD-0002 diseñó la mejor incorporación posible **una vez que alguien ya decidió confiar en ATLAS AI**. Este documento diseña lo que ocurre **antes de esa decisión** — el diagnóstico que convierte a un desconocido en un cliente informado, y que además configura de antemano cómo debería empezar su onboarding cuando llegue ese momento.

---

## 1. Filosofía del Discovery

Un Discovery de ATLAS AI no es un cuestionario para calificar un lead. Es una auditoría de consultoría real, con el mismo rigor que aplicaría una firma de estrategia — y debe generar valor genuino para el prospecto **incluso si nunca llega a comprar**. Esta es una decisión deliberada, coherente con [PVD-0001 §9](../pvd/0001-product-vision-atlas-ai.md): la confianza comercial de ATLAS AI se construye demostrando criterio real antes de pedir nada a cambio, no con una demo genérica seguida de una tabla de precios.

Dos consecuencias directas de esta filosofía:

1. **Nunca se inventa un dato sobre el negocio del prospecto.** Todo lo que el sistema afirma sobre esa empresa concreta proviene de lo que el propio prospecto declaró, de señales públicas verificables, o de una comparación anonimizada contra el agregado de la red (§13) — nunca de una suposición genérica disfrazada de diagnóstico personalizado.
2. **El Discovery puede concluir, legítimamente, que ATLAS AI no es el momento adecuado para ese negocio.** Un sistema de diagnóstico honesto debe poder decir "no" — coherente con el principio comercial de [PVD-0001 §9](../pvd/0001-product-vision-atlas-ai.md) de no vender promesas que no se pueden cumplir.

---

## 2. Objetivos

| Para el prospecto | Para ATLAS AI |
|---|---|
| Entender, con criterio experto, dónde está su negocio hoy y qué oportunidades reales tiene | Calificar el ajuste real del prospecto (tamaño, urgencia, madurez, riesgo) antes de invertir esfuerzo comercial |
| Recibir una estimación honesta de valor potencial, sin promesas infladas | Configurar de antemano cómo debería empezar el onboarding de PVD-0002 si el prospecto decide avanzar |
| Ver, en un documento claro, un plan de implantación concreto, no genérico | Generar una propuesta comercial y un informe ejecutivo fundamentados, sin trabajo manual repetido en cada oportunidad comercial |

---

## 3. Metodología

```
1. Selección de vertical
        │
        ▼
2. Cuestionario adaptativo (§4)          ← preguntas sourced del DKB del vertical
        │
        ▼
3. Señales complementarias                 (presencia pública, reseñas, web —
        │                                    nunca contenido privado del negocio)
        ▼
4. Modelo de puntuación (§5)
        │
        ├──▶ Atlas Maturity Assessment (§6)
        ├──▶ Atlas Opportunity Score (§7)
        ├──▶ Health Score (§8)
        ├──▶ Digital Readiness (§9)
        ├──▶ Business DNA Readiness (§10)
        └──▶ Employee Readiness (§11)
        │
        ▼
5. Riesgos detectados (§12) + Benchmarking (§13)
        │
        ▼
6. ROI estimado (§14) + Plan de implantación (§15)
        │
        ▼
7. Recomendaciones automáticas (§16):
   Empleados Digitales · Knowledge Packs · Business Value Opportunities
        │
        ▼
8. Propuesta comercial (§17) + PDF ejecutivo (§18)
   ambos revisados por un humano antes de llegar al prospecto
```

Cada etapa de este pipeline es auditable y reconstruible — un Discovery, igual que cualquier ejecución de la plataforma, debe poder explicarse (Explainability Engine, AIF-0001 §6.8) aunque el prospecto todavía no sea cliente.

---

## 4. Cuestionarios adaptativos

No es un formulario fijo — es un cuestionario que cambia según el vertical elegido y según las respuestas ya dadas, con el mismo principio de restricción que [PVD-0002 §Principios](../pvd/0002-first-customer-experience.md): ningún campo sin una razón visible, ninguna pregunta que el prospecto no pueda responder sin pensar mucho.

Las preguntas se generan a partir de las etapas ya documentadas en la biblioteca de conocimiento del vertical activo — para Dental, directamente de las 15 etapas de [DKB-PAC-01](../dkb/03_Paciente/DKB-PAC-01_Recorrido_Paciente.md). Una respuesta que revela un vacío en una etapa concreta (p. ej. "no hacemos seguimiento sistemático de presupuestos") activa de inmediato preguntas de profundización sobre esa etapa y desactiva preguntas de otras etapas de menor relevancia dada la respuesta — el cuestionario se acorta donde ya hay señal suficiente y profundiza donde hay ambigüedad.

---

## 5. Modelo de puntuación

Todos los puntajes de este documento (§6–§11) comparten un marco común, nunca uno distinto por puntaje:

- Cada señal de entrada (respuesta del cuestionario, señal pública, comparación de benchmark) tiene un peso y una **confianza propia** — una respuesta autodeclarada del prospecto tiene, por defecto, menor confianza que una señal pública verificable, y ambas tienen menor confianza que un dato observado de operación real (que en esta fase todavía no existe).
- Ningún puntaje se presenta sin su nivel de confianza visible — mismo principio del Confidence Engine (AIF-0001 §6.7), aplicado aquí a datos de prospecto en vez de datos de tenant ya operando.
- Los pesos y umbrales del modelo se calibran, con el tiempo, comparando la estimación de Discovery contra el desempeño real observado una vez el prospecto se convierte en cliente — el propio modelo de puntuación es, en sí mismo, un candidato de aprendizaje continuo (Learning Engine, AIF-0001 §6.6), aplicado a escala de todos los Discovery realizados, no de un solo cliente.

---

## 6. Atlas Maturity Assessment

Aplica directamente el Atlas Maturity Model de cinco niveles ya definido en [AIF-0001 §5](0008-atlas-intelligence-framework.md) — este documento no define un modelo de madurez propio, estima en qué nivel de partida se encontraría el prospecto si empezara hoy.

Dado que no existe todavía ningún dato de operación real, la estimación de este apartado se etiqueta siempre como **punto de partida estimado**, no como una evaluación firme — la evaluación firme solo la produce el Business Evolution Engine (AIF-0001 §6.9) una vez existe historial real de uso. La mayoría de prospectos, antes de implantar ATLAS AI, se ubican en Nivel 1 o Nivel 2 casi por definición — la utilidad de este apartado no es tanto el nivel de partida en sí, sino identificar con precisión **qué le falta** para avanzar, información que alimenta directamente el plan de implantación (§15).

---

## 7. Atlas Opportunity Score

Puntaje compuesto (0–100) que estima cuánto valor podría generar ATLAS AI para este prospecto concreto, calculado cruzando las señales detectadas contra el catálogo completo de la biblioteca de valor de negocio del vertical (para Dental, [Atlas Business Value Library](../abvl/00_Master_Index.md)) — cuantas más oportunidades documentadas encuentran una señal de vacío real en las respuestas del prospecto, y cuanto mayor sea el impacto económico estimado de esas oportunidades concretas, mayor el puntaje.

**[HIPÓTESIS — validar con clínicas piloto]** No es una cifra económica en sí misma — es un índice relativo, útil para priorizar el esfuerzo comercial y para ordenar qué prospectos merecen seguimiento prioritario, nunca una promesa de resultado.

---

## 8. Health Score

Distinto del Opportunity Score: no mide cuánto valor *podría* capturarse, mide cuán saludable está la operación **hoy**, antes de cualquier intervención — señales como consistencia de reputación online pública, indicios de sobrecarga operativa autodeclarada, o rotación de personal si el prospecto la menciona. Un Health Score bajo no descalifica a un prospecto — a menudo indica justo lo contrario, mayor urgencia de necesidad — pero sí condiciona el tono y la cautela con la que se diseña el plan de implantación inicial (§15).

---

## 9. Digital Readiness

Evalúa cuán preparada está la empresa, técnica y operativamente, para adoptar ATLAS AI: si ya usa algún sistema de gestión digital, si tiene agenda digitalizada, si el equipo ya está habituado a herramientas digitales en su trabajo diario. Un Digital Readiness bajo no es un impedimento, pero determina cuán conservador debe ser el `capability_grant` inicial y cuánta formación adicional necesitará el equipo humano al incorporar sus primeros Empleados Digitales ([AED-0001 §3](0009-atlas-employee-designer.md), periodo de supervisión estrecha).

---

## 10. Business DNA Readiness

Evalúa cuán clara tiene la empresa su propio carácter operativo — apetito de riesgo, prioridades, líneas rojas — antes incluso de empezar el onboarding. Un prospecto que responde con precisión y seguridad a preguntas de tipo "¿qué puede hacer un empleado nuevo sin preguntarte primero?" tiene un Business DNA Readiness alto; uno que nunca se lo ha planteado explícitamente tiene uno bajo, lo que indica que el Momento 4 del onboarding de PVD-0002 necesitará más tiempo y más acompañamiento guiado del habitual.

---

## 11. Employee Readiness

La dimensión de gestión del cambio, la más "de consultoría" de las tres puntuaciones de preparación: evalúa cuán preparado está el **equipo humano** para trabajar junto a Empleados Digitales — señales de apertura declarada del propietario, señales de posible resistencia del equipo, claridad actual de roles dentro de la organización. Se conecta directamente con el Atlas Team Concept ([AED-0001 §21](0009-atlas-employee-designer.md)): un Employee Readiness bajo sugiere que el plan de implantación debe introducir los primeros Empleados Digitales explícitamente como acompañamiento de roles existentes, nunca como sustitución visible desde el primer día.

---

## 12. Riesgos detectados en el prospecto

Discovery no solo detecta oportunidad — también detecta señales de riesgo específicas de ese prospecto, que deben abordarse en la conversación comercial antes de avanzar, nunca ocultarse para cerrar la venta:

- **Expectativa de autonomía total desde el primer día.** Un prospecto que pide explícitamente "que la IA decida todo sola" es una señal de desajuste directo con [PVD-0001 §3 y §9](../pvd/0001-product-vision-atlas-ai.md) — Discovery lo marca como riesgo de expectativa a corregir en la conversación comercial, no como una funcionalidad a prometer.
- **Procesos completamente indocumentados.** Dificulta la ingesta inicial de conocimiento (ADR-0007) — el plan de implantación debe prever tiempo adicional de documentación antes de que el Company Brain tenga suficiente base.
- **Ausencia de un centro de decisión claro** (relevante en modelos como clínica familiar o grupo de clínicas, ver [DKB-EMP-01](../dkb/01_Empresa/DKB-EMP-01_Modelos_Clinica.md)) — riesgo de fricción en la aprobación de decisiones de Business DNA si nadie tiene autoridad clara para tomarlas.

---

## 13. Benchmarking

Reutiliza, sin modificarlo, el mecanismo de comparación anonimizada de [PVD-0006 §5 y §10](../pvd/0006-atlas-intelligence-network.md): el prospecto no participa todavía en Atlas Intelligence Network (no es cliente), pero puede compararse contra el agregado ya existente de tenants opt-in de su mismo vertical y segmento de tamaño, con el mismo umbral k-anónimo obligatorio y las mismas garantías de que ningún competidor concreto es identificable. Es, para el prospecto, la primera muestra tangible de lo que la red colectiva de ATLAS AI puede ofrecerle — antes incluso de ser parte de ella.

---

## 14. ROI estimado

Aplica el mismo modelo de cuatro bloques de [PVD-0007 §1](../pvd/0007-roi-intelligence-platform.md) (costes evitados, horas ahorradas, ingresos recuperados, oportunidades creadas) — con una diferencia crítica de etiquetado que se aplica sin excepción: **todo el contenido de este apartado es una proyección, nunca un hecho observado**, porque no existe todavía ningún `run_event` real que lo sostenga.

- Los inputs son autodeclarados por el prospecto (volumen de llamadas, ticket medio, tasa de cierre actual si la conoce) o derivados de rangos de benchmark anonimizado (§13) — nunca datos inventados por el sistema.
- La incertidumbre de esta proyección es, por diseño, mayor que la de cualquier `ROISummary` real de PVD-0007 — se presenta siempre como un rango, nunca como una cifra puntual con falsa precisión.
- Una vez el prospecto se convierte en cliente, esta proyección **se conserva y se contrasta** contra el `ROISummary` real que el ROI Engine (AIF-0001 §6.5) empieza a producir — la diferencia entre lo proyectado y lo real es, con el tiempo, la señal que calibra y mejora el propio modelo de estimación de Discovery para futuros prospectos (cierre de ciclo con el Learning Engine, AIF-0001 §6.6, ahora aplicado a escala de todos los Discovery pasados).

---

## 15. Plan de implantación

La síntesis operativa de todo lo anterior: una secuencia concreta y priorizada de qué activar primero, adaptada a las brechas reales detectadas en este prospecto — no una plantilla genérica de vertical. Reutiliza la lógica de priorización por impacto de negocio ya validada en la propia construcción de la Atlas Dental Knowledge Library (ver [Índice Maestro DKB §3](../dkb/00_Master_Index.md)), pero aplicada aquí a las oportunidades específicas de este prospecto concreto, no al roadmap general del vertical.

---

## 16. Recomendaciones automáticas

Tres catálogos de recomendación, generados a partir de las mismas señales de Discovery, cada uno consumiendo una biblioteca ya existente sin duplicar su contenido:

### Empleados Digitales recomendados
Se seleccionan de las especializaciones ya documentadas en [AED-0001 §4](0009-atlas-employee-designer.md), priorizadas por las brechas detectadas en el cuestionario — un prospecto con fuerte señal de presupuestos sin seguimiento recibe, como primera recomendación, un Coordinador de Presupuestos; uno con fuerte señal de llamadas perdidas, una Recepción Digital.

### Knowledge Packs recomendados
Se seleccionan del catálogo disponible en el Marketplace ([AIF-0001 §2](0008-atlas-intelligence-framework.md)) para el vertical del prospecto, priorizados por relevancia a las brechas detectadas — nunca se recomienda un pack genérico sin relación directa con una señal real del cuestionario.

### Business Value Opportunities detectadas
Se seleccionan directamente del catálogo de la biblioteca de valor de negocio del vertical (para Dental, [Atlas Business Value Library](../abvl/00_Master_Index.md)), ordenadas por el mismo criterio de impacto económico ya usado en la construcción de esa biblioteca, ajustado por la señal específica de este prospecto — si el cuestionario revela que el prospecto ya tiene un proceso de recall bien gestionado, `ABVL-02` (recall) no se recomienda como prioritaria pese a su alto impacto general de catálogo, porque la brecha real en este caso concreto es menor.

---

## 17. Generación automática de propuesta comercial

El sistema ensambla una propuesta comercial completa — resumen de diagnóstico, Opportunity Score, plan de implantación, Empleados Digitales y Knowledge Packs recomendados, ROI estimado con su rango de incertidumbre — a partir de los datos ya generados en las etapas anteriores, sin trabajo manual repetido por parte del equipo comercial.

**Ninguna propuesta se envía al prospecto sin revisión humana previa** — mismo principio rector que gobierna cualquier salida generada de la plataforma ("el LLM propone, el motor dispone", ADR-0005 §0, aplicado aquí al contenido comercial): el sistema ensambla el borrador completo, un humano del equipo comercial lo revisa, ajusta si hace falta, y lo aprueba antes de que llegue al prospecto.

---

## 18. Generación automática de PDF ejecutivo

Un informe ejecutivo, pensado para el propietario del negocio, no para un equipo técnico — mismo tono sobrio, preciso y sin adornos ya establecido en [PVD-0004 §3](../pvd/0004-atlas-home.md) y en el dashboard financiero de [PVD-0007 §12](../pvd/0007-roi-intelligence-platform.md): sin gamificación, sin superlativos de marketing, con cada cifra proyectada claramente etiquetada como tal.

Estructura estándar del PDF: resumen ejecutivo de una página, Atlas Maturity Assessment con su nivel de partida, Atlas Opportunity Score con las oportunidades de mayor impacto detectadas, ROI estimado con su rango de incertidumbre explícito, y el plan de implantación propuesto. Igual que la propuesta comercial (§17), se genera en borrador y requiere revisión humana antes de su entrega.

---

## 19. Reutilización para cualquier vertical futuro

El motor de Discovery descrito en este documento **no contiene ninguna lógica específica de un vertical** — ni de Dental ni de ningún otro. Todo lo que varía por vertical entra como una dependencia externa reemplazable:

| Elemento que varía por vertical | Fuente |
|---|---|
| Banco de preguntas del cuestionario adaptativo (§4) | La biblioteca de conocimiento del vertical (equivalente a la Atlas Dental Knowledge Library) |
| Catálogo de oportunidades para el Opportunity Score y las recomendaciones (§7, §16) | La biblioteca de valor de negocio del vertical (equivalente a la Atlas Business Value Library) |
| Especializaciones recomendables de Empleado Digital (§16) | Las plantillas de especialización ya definidas de forma transversal en AED-0001 §4, con ejemplos concretos aportados por cada vertical |
| Knowledge Packs recomendables (§16) | El Marketplace, filtrado por vertical |

Incorporar un vertical nuevo a ATLAS AI (Estética, Veterinaria, Talleres, Asesorías, Inmobiliarias) nunca requiere modificar este documento — requiere construir su propia biblioteca de conocimiento y de valor de negocio, siguiendo el mismo patrón ya validado con Dental, y el motor de Discovery las consume automáticamente.

---

## 20. Integraciones

| Sistema | Qué aporta a Discovery | Qué NO hace Discovery |
|---|---|---|
| **Atlas Intelligence Framework** | Reutiliza el Atlas Maturity Model (§6), y la arquitectura de puntuación y confianza de sus motores (§5) | No ejecuta los diez motores en tiempo real sobre un prospecto — no hay todavía datos de operación que procesar |
| **Atlas Employee Designer** | Fuente de las especializaciones recomendables (§16) | No crea un `DigitalEmployeeProfile` real — solo recomienda cuáles convendría crear tras la incorporación |
| **Atlas Business Value Library** | Fuente del catálogo de oportunidades para el Opportunity Score y las recomendaciones | No añade oportunidades nuevas al catálogo — solo las consume y las prioriza para un caso concreto |
| **Atlas Intelligence Network (PVD-0006)** | Fuente de los agregados anonimizados usados en benchmarking (§13) y en los rangos de referencia del ROI estimado (§14) | No expone nunca un solo tenant identificable, ni siquiera de forma indirecta, a un prospecto que todavía no es cliente |
| **PVD-0002 (Onboarding)** | Recibe el plan de implantación (§15) y las puntuaciones de preparación (§9–11) como configuración de partida del onboarding, si el prospecto decide avanzar | No sustituye el onboarding — lo informa y lo acelera |

---

## 21. Cierre del ciclo con el resto del recorrido del cliente

Cuando un prospecto decide avanzar, el Discovery no se descarta — se convierte en la configuración de partida real del Momento 1 y Momento 4 del onboarding de PVD-0002: el sector ya está identificado, las puntuaciones de preparación ya existen, y el plan de implantación ya sugiere qué Empleado Digital incorporar primero. El propietario no repite lo que ya contó durante el proceso comercial — el sistema ya lo sabe, y el onboarding empieza un paso por delante.

---

## 22. Entidades y servicios de referencia

| Entidad | Propósito |
|---|---|
| `DiscoverySession` | El expediente completo de un proceso de Discovery para un prospecto concreto |
| `AdaptiveQuestionnaire` | Instancia del cuestionario, vinculada al banco de preguntas del vertical activo |
| `AssessmentScoreSet` | El conjunto de puntuaciones producidas (§6–§11), cada una con su nivel de confianza |
| `ROIProjection` | La estimación de ROI de §14, explícitamente distinta de `ROISummary` (AIF-0001 §6.5) |
| `ImplementationPlan` | El plan de implantación priorizado de §15 |
| `CommercialProposal` / `ExecutiveReport` | Los dos artefactos generados en §17–18, ambos en estado de borrador hasta revisión humana |

| Servicio | Responsabilidad |
|---|---|
| `DiscoveryOrchestratorService` | Conduce el pipeline completo de §3 |
| `AdaptiveQuestionnaireService` | Genera y adapta las preguntas a partir del banco del vertical activo |
| `ScoringEngine` | Calcula las seis puntuaciones de §6–§11 bajo el marco común de §5 |
| `BenchmarkComparisonService` | Reutiliza el mecanismo de PVD-0006 §5 para comparar al prospecto contra agregados anonimizados |
| `RecommendationComposerService` | Ensambla las tres listas de recomendación de §16 a partir de AED-0001, el Marketplace y la biblioteca de valor de negocio del vertical |
| `ProposalGeneratorService` / `ExecutiveReportGeneratorService` | Ensamblan los artefactos de §17–18, siempre en estado de borrador |

---

## 23. Riesgos de este sistema

| Riesgo | Severidad | Mitigación |
|---|---|---|
| Un Opportunity Score o un ROI estimado demasiado optimista genera expectativas que la implantación real no cumple | Alta | Etiquetado explícito e ineludible de proyección (§14), rango de incertidumbre siempre visible, nunca una cifra puntual |
| El cuestionario adaptativo se percibe como largo o intrusivo, dañando la primera impresión comercial | Media | Mismo principio de restricción de contenido que PVD-0002 — el cuestionario se acorta activamente donde ya hay señal suficiente (§4) |
| Recomendaciones genéricas de vertical presentadas como si fueran específicas del prospecto | Alta si ocurre | Toda recomendación debe trazarse a una señal concreta del cuestionario de ese prospecto (§16), nunca a un catálogo aplicado sin filtrar |
| Un vertical nuevo requiere, en la práctica, tocar la lógica del motor de Discovery en vez de solo aportar su biblioteca | Media | Separación estricta de responsabilidades de §19 tratada como invariante de arquitectura, no como aspiración de diseño |
| Presión comercial para saltarse la revisión humana de la propuesta o el PDF antes de enviarlos | Alta si ocurre | Regla no negociable de §17–18, coherente con el principio rector de toda la plataforma |

---

## 24. Decisiones abiertas

- Duración objetivo y profundidad del cuestionario adaptativo — a calibrar con datos reales de conversión comercial, con el mismo cuidado de restricción que PVD-0002 aplicó al onboarding.
- Mecanismo exacto de calibración del modelo de puntuación (§5) con datos reales de Discovery frente a desempeño posterior — candidato natural para un ADR posterior centrado en el pipeline de aprendizaje del propio Discovery.
- Si el Health Score (§8) debe incorporar señales públicas adicionales (redes sociales, presencia en directorios sectoriales) más allá de reseñas, y con qué garantías de verificación.
- Formato exacto y extensión del PDF ejecutivo (§18) — a validar con el equipo comercial y con prospectos reales antes de fijar una plantilla definitiva.
