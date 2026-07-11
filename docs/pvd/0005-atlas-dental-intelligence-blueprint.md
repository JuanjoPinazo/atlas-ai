# PVD-0005 — Atlas Dental Intelligence Blueprint

| | |
|---|---|
| **Tipo de documento** | Product Vision Document — blueprint de vertical |
| **Estado** | Propuesto |
| **Fecha** | 2026-07-09 |
| **Se apoya en** | [PVD-0001](0001-product-vision-atlas-ai.md) · [PVD-0002](0002-first-customer-experience.md) · [PVD-0003](0003-business-dna.md) · [PVD-0004](0004-atlas-home.md) |
| **Implementado sobre** | [ADR-0002: Company Brain](../adr/0002-company-brain.md) · [ADR-0005: Decision Engine + Validation Engine](../adr/0005-decision-engine-validation-engine.md) · [ADR-0006: Digital Employee Runtime](../adr/0006-digital-employee-runtime.md) · [ADR-0007: Knowledge Acquisition Engine](../adr/0007-knowledge-acquisition-engine.md) |

---

## 0. Qué es este documento

Todo lo construido hasta ahora es horizontal: Company Brain, Decision Engine, Business DNA funcionan igual para una clínica dental que para una asesoría o una cadena de retail. Este documento es lo contrario — es la primera vez que ATLAS AI se pone a prueba contra un negocio real, con sus procesos reales, sus riesgos reales y sus personas reales.

**Este es el documento maestro del vertical Dental**: define cómo funciona una clínica, quién participa, qué procesos existen, y — para cada uno — qué parte le corresponde a un Empleado Digital, qué debe saber, qué puede automatizar y qué debe explicar siempre. Cualquier decisión de producto específica del vertical dental que no esté en este documento, no está decidida todavía.

---

## 1. Cómo funciona una clínica dental

Una clínica dental es, operativamente, un negocio de cita programada de alto valor por paciente, con un ciclo de vida largo (un paciente puede llevar 15 años en la misma clínica) y una particularidad que la distingue de casi cualquier otro vertical: **la confianza es el producto tanto como el tratamiento**. La mayoría de los pacientes llegan con algo de aprensión; la forma en que se les habla, se les explica un presupuesto o se les recuerda una revisión importa casi tanto como la calidad clínica.

El negocio se sostiene sobre tres motores simultáneos:

1. **Motor clínico** — diagnóstico, tratamiento, seguimiento. Exclusivamente humano, con el dentista como responsable legal y clínico final de cualquier decisión.
2. **Motor comercial** — presupuestos, financiación, aceptación de tratamiento. Es donde más ingresos se pierden hoy en clínicas reales: presupuestos que nunca se cierran, revisiones que nunca se agendan.
3. **Motor operativo** — agenda, llamadas, recepción, urgencias, campañas, reputación. Es el motor de mayor volumen y menor margen de error tolerado si algo falla (una cita mal gestionada es una mala experiencia; una urgencia mal gestionada puede ser grave).

ATLAS AI para Dental existe para reforzar los motores 2 y 3 sin tocar, en ningún caso, la autoridad del motor 1.

---

## 2. Actores

| Actor | Rol |
|---|---|
| **Paciente** | El centro del recorrido — desde lead hasta paciente fidelizado de largo plazo |
| **Lead / paciente potencial** | Contacto aún no convertido, vía campaña, referido o búsqueda |
| **Recepción** | Primer contacto humano, gestión de agenda y llamadas |
| **Coordinador/a de tratamiento** | Traduce el plan clínico del dentista en presupuesto, financiación y seguimiento comercial |
| **Dentista general** | Diagnóstico y tratamiento de base, responsable clínico |
| **Especialistas** (ortodoncia, endodoncia, periodoncia, implantología, odontopediatría) | Tratamientos específicos derivados |
| **Higienista dental** | Limpiezas, revisiones periódicas, educación del paciente |
| **Auxiliar/asistente dental** | Apoyo clínico directo durante el tratamiento |
| **Propietario/gerente de la clínica** | Cliente de ATLAS AI — define Business DNA, aprueba, supervisa |
| **Entidad de financiación** | Tercero que evalúa y concede crédito al paciente para el tratamiento |
| **Laboratorio dental** | Fabricación de prótesis, coronas, alineadores — proveedor externo |
| **Plataformas de reputación** | Google, Doctoralia y equivalentes — canal de reseñas públicas |

---

## 3. Procesos

```
Captación ──▶ Primer contacto ──▶ Primera cita ──▶ Diagnóstico ──▶ Presupuesto
                                                                        │
Revisión periódica ◀── Alta del tratamiento ◀── Ejecución del tratamiento ◀── Financiación / Aceptación
        │
        └──▶ Recall / fidelización ──▶ (nuevo ciclo) o ──▶ Reseña / recomendación

Procesos transversales, activos en cualquier punto del recorrido:
  Llamadas · Agenda · Urgencias · Campañas · Cumplimiento normativo · Facturación
```

Los procesos transversales no pertenecen a una etapa del recorrido — atraviesan todas. Se detallan por separado en §7–§16.

---

## 4. Recorrido completo del paciente

```
Descubrimiento (campaña, referido, búsqueda)
        │
        ▼
Primer contacto (llamada o formulario) ──▶ Empleado Digital de Recepción resuelve
        │                                   dudas iniciales, agenda primera cita
        ▼
Primera cita — recepción, historia clínica, exploración
        │
        ▼
Diagnóstico (exclusivamente del dentista)
        │
        ▼
Plan de tratamiento (dentista) ──▶ Presupuesto (coordinador + apoyo del agente)
        │
        ▼
Financiación / aceptación
        │
        ▼
Ejecución del tratamiento (múltiples sesiones, coordinadas en agenda)
        │
        ▼
Alta del tratamiento
        │
        ├──▶ Solicitud de reseña (momento oportuno, nunca automático sin criterio)
        │
        ▼
Revisión periódica (recall, cada 6 meses típico)
        │
        └──▶ Vuelve al inicio del ciclo, o deriva a nuevo tratamiento
```

Cada flecha de este recorrido es un punto donde un Empleado Digital puede reducir fricción — y cada nodo marcado como exclusivo del dentista es, sin excepción, una frontera que ningún agente cruza (§6).

---

## 5. La distinción que gobierna todo lo demás: Company Brain ≠ Historia Clínica

Antes de entrar en cada proceso, una regla arquitectónica que se aplica a todos ellos sin excepción:

**El Company Brain de una clínica dental contiene conocimiento organizativo — nunca datos clínicos de un paciente concreto.**

- Van al Brain (ADR-0002): catálogo de tratamientos, protocolos generales, tarifario, políticas de cancelación, criterios de triage de urgencia, guiones de llamada, plantillas de presupuesto, condiciones de financiación, calendario de campañas.
- **Nunca** van al Brain como conocimiento genérico: historia clínica de un paciente, radiografías, diagnósticos individuales, datos de salud personales. Esos datos viven en el sistema de gestión clínica de la clínica (su PMS/HCE), a los que un Empleado Digital accede **por integración, por paciente concreto, con autorización explícita para ese acto** — no por recuperación semántica general como si fueran conocimiento de empresa.

Confundir estas dos cosas no es un matiz técnico — es exactamente el tipo de error que convertiría una plataforma de conocimiento gobernado en un riesgo de privacidad de datos de salud (categoría especial de datos, Art. 9 RGPD). Cada sección siguiente respeta esta distinción explícitamente.

---

## 6. Líneas rojas no negociables del vertical Dental

Estas `DNARedLine` (PVD-0003 §3.1) se activan **por defecto** al elegir el sector "Salud dental" en el onboarding (PVD-0002 §2) — no son configuración opcional, son parte de la plantilla del vertical:

1. **Ningún Empleado Digital diagnostica, prescribe o da consejo clínico personalizado.** Puede explicar procedimientos en general; nunca puede decirle a un paciente concreto qué le pasa o qué tratamiento necesita.
2. **Ninguna urgencia real se gestiona de forma autónoma.** Toda señal de urgencia dispara escalado inmediato a un humano — nunca una respuesta que retrase la derivación (§15).
3. **Ningún dato de historia clínica se almacena como conocimiento genérico del Brain.** Se accede por paciente, bajo autorización explícita, nunca se indexa como contenido recuperable de forma semántica general (§5).
4. **Ninguna comunicación con un paciente oculta que puede estar hablando con un sistema asistido por IA**, con opción visible de pasar a un humano en cualquier momento.
5. **Ningún presupuesto o compromiso financiero se envía a un paciente sin al menos una revisión humana inicial**, hasta que la clínica, explícitamente, decida relajar ese control (patrón de fricción asimétrica de PVD-0003 §10 — endurecer es fácil, relajar exige confirmación deliberada).

---

## 7. Llamadas

**Hoy**: la recepción atiende llamadas para pedir cita, reprogramar, preguntar precios orientativos, y — con menor frecuencia pero máxima gravedad — reportar una urgencia. El cuello de botella es el volumen en horas punta y las llamadas perdidas fuera de horario.

**Rol del Empleado Digital de Recepción**: responde preguntas frecuentes desde el Brain (horarios, ubicación, tratamientos, precios orientativos — nunca personalizados sin datos del paciente), gestiona la agenda directamente (§9), y aplica el protocolo de triage de urgencia en cada llamada (§15) antes de cualquier otra cosa — la detección de urgencia tiene prioridad sobre cualquier otra intención de la llamada.

---

## 8. Recepción

**Hoy**: check-in del paciente, verificación de datos, entrega de formularios de historia clínica o consentimiento, aviso al equipo clínico de la llegada.

**Rol del Empleado Digital**: envío de formularios de historia clínica **antes** de la cita (para que el paciente los rellene en casa y se ahorre tiempo de sillón — el contenido rellenado va al sistema clínico, no al Brain, por §5), recordatorios de documentación pendiente, check-in digital previo a la llegada. En recepción física, el agente apoya al equipo, nunca lo sustituye — es la interacción presencial de mayor carga emocional del recorrido.

---

## 9. Agenda

**Hoy**: coordinar disponibilidad de dentista + sillón/sala + equipamiento específico + duración estimada por tipo de tratamiento — un problema de asignación multi-recurso, no solo de calendario de una persona.

**Rol del Empleado Digital**: propone y confirma citas, gestiona reprogramaciones y cancelaciones, mantiene lista de espera activa y ofrece huecos liberados a pacientes en espera. Reservar cita para revisiones o limpiezas es una acción de bajo riesgo (autorizable sin aprobación); reservar una primera sesión de un tratamiento complejo (implantología, cirugía) requiere que el hueco y la duración hayan sido validados por el criterio clínico — el agente propone, el equipo confirma en esos casos.

---

## 10. Tratamientos

**Hoy**: el catálogo de tratamientos de una clínica es amplio y con terminología que confunde al paciente medio — explicar con claridad qué implica cada tratamiento reduce ansiedad y abandono.

**Rol del Empleado Digital**: explica en qué consiste un tratamiento, su duración típica, número de sesiones, cuidados posteriores — **siempre en términos generales del catálogo de la clínica, nunca aplicado al caso de un paciente concreto** sin que el dentista lo haya indicado explícitamente primero (línea roja §6.1). Si un paciente pregunta "¿qué tratamiento necesito?", la única respuesta correcta del agente es derivar a diagnóstico profesional, nunca aventurar una respuesta.

---

## 11. Presupuestos

**Hoy**: es, en la mayoría de clínicas reales, el punto de mayor fuga de ingresos — presupuestos presentados que nunca se responden, sin seguimiento sistemático.

**Rol del Empleado Digital de Presupuestos**: a partir del plan de tratamiento que introduce el dentista (estructurado, no libre), redacta el presupuesto desglosado por fases, explica opciones de pago, y — el mayor valor añadido — **hace seguimiento activo de presupuestos pendientes**, algo que hoy casi ninguna clínica hace de forma sistemática. El primer envío de cualquier presupuesto a un paciente concreto pasa por aprobación humana por defecto (línea roja §6.5); el seguimiento posterior (recordatorios, resolución de dudas sobre el presupuesto ya presentado) puede automatizarse con más libertad una vez la clínica lo confirma explícitamente.

---

## 12. Financiación

**Hoy**: la mayoría de tratamientos de valor alto (implantes, ortodoncia) se financian, vía cuotas propias de la clínica o entidades de crédito al consumo externas.

**Rol del Empleado Digital**: presenta las opciones de financiación disponibles y sus condiciones generales (desde el Brain, nunca inventadas), orienta sobre criterios de elegibilidad informativos. **Nunca simula, promete ni gestiona la aprobación de una solicitud de crédito** — eso ocurre en el sistema de la entidad financiera externa, fuera del alcance de cualquier Empleado Digital. Cruzar datos de salud con datos financieros de un paciente es la combinación más sensible del vertical — tratada con la máxima cautela de sensibilidad por defecto (PVD-0003 §12).

---

## 13. Revisiones

**Hoy**: la revisión periódica (típicamente cada 6 meses) es, con diferencia, la mayor oportunidad de automatización de bajo riesgo y alto valor — pacientes que simplemente se olvidan de agendar su siguiente cita.

**Rol del Empleado Digital de Agenda y Recall**: identifica, vía integración con el sistema clínico, qué pacientes están próximos o ya vencidos en su revisión, y gestiona el contacto proactivo — recordatorio, oferta de horarios, confirmación. Es, de todos los procesos del vertical, el que puede operar con mayor autonomía por defecto: bajo riesgo clínico, alto valor recurrente, sin decisión comercial sensible de por medio.

---

## 14. Campañas

**Hoy**: campañas estacionales, de captación de nuevos pacientes, o de reactivación de pacientes inactivos — normalmente gestionadas de forma manual o por agencia externa, sin conexión con los datos reales de la clínica.

**Rol del Empleado Digital**: redacta borradores de campaña alineados al tono del Business DNA de la clínica, segmenta audiencias respetando el consentimiento de marketing registrado (nunca usando datos de salud como criterio de segmentación — línea roja §6.3 aplicada aquí también), y mide respuesta. El envío efectivo a una lista de pacientes requiere aprobación humana — es una acción de alto alcance (llega a muchas personas a la vez) y de cumplimiento normativo (RGPD, consentimiento de comunicaciones comerciales).

---

## 15. Urgencias

**Hoy**: el proceso de mayor tensión y mayor riesgo si se gestiona mal — un dolor agudo, un traumatismo, una inflamación, requieren respuesta y criterio inmediato.

**Rol del Empleado Digital**: aplica un **protocolo de triage propio de la clínica** (no un criterio médico general inventado por el agente) — un conjunto de preguntas estructuradas ya definidas por el equipo clínico y almacenadas en el Brain como protocolo, cuyo único propósito es decidir **con qué urgencia y hacia quién** derivar, nunca diagnosticar. Cualquier respuesta del paciente que sugiera gravedad (dolor severo, sangrado, traumatismo, fiebre) activa escalado inmediato a un humano disponible — este es el único proceso de todo el vertical donde la detención y derivación es, por diseño, más rápida de disparar que en cualquier otro dominio (umbral de `HaltController`/escalado más bajo, ADR-0005 §4.6–§4.7, calibrado específicamente para este proceso).

---

## 16. Google Reviews

**Hoy**: la reputación online es, para una clínica dental, un factor de decisión de primeros contactos casi tan importante como el boca a boca — y gestionarla bien es tedioso y se posterga.

**Rol del Empleado Digital de Reputación**: identifica el momento adecuado para solicitar una reseña (tras un desenlace positivo del tratamiento, nunca inmediatamente después de un procedimiento doloroso o una experiencia con fricción), redacta la solicitud con el tono del DNA de la clínica, y monitoriza reseñas nuevas. Ante una reseña negativa, el agente **nunca responde de forma autónoma** — la marca como prioritaria en ATLAS Home (PVD-0004 §4.3) y, como mucho, redacta un borrador de respuesta a la espera de aprobación del propietario.

---

## 17. Qué debe saber el Empleado Digital

Plantilla de `KnowledgeDomain` para el vertical Dental (ADR-0002 §4), instanciada automáticamente al elegir el sector en el onboarding:

| Dominio | Contenido típico |
|---|---|
| Tratamientos y Protocolos | catálogo de tratamientos, duración, sesiones, cuidados posteriores, protocolos clínicos generales (no personalizados) |
| Precios y Presupuestos | tarifario, plantillas de presupuesto, condiciones de fases de pago |
| Agenda y Políticas de Cita | horarios, duración estándar por tratamiento, política de cancelación/no-show |
| Financiación | opciones disponibles, condiciones generales, entidades colaboradoras |
| Marketing y Comunicación | tono de campañas, calendario, plantillas de mensajes |
| Cumplimiento y Consentimientos | textos de consentimiento informado, políticas de protección de datos de salud |
| Protocolo de Urgencias | criterios de triage propios de la clínica, a quién derivar y cómo |

---

## 18. Qué debe aprender

- **En el onboarding** (ADR-0007): ingesta del tarifario, protocolos y políticas ya existentes de la clínica — el pipeline de Knowledge Acquisition procesa estos documentos como cualquier otro vertical, sin lógica especial.
- **De patrones de uso reales, siempre gobernado**: qué preguntas se repiten en llamadas (para enriquecer el Brain con respuestas mejor formuladas), qué combinaciones de tratamiento y financiación tienden a cerrarse con éxito (alimenta una `KnowledgeProposal`, nunca se aplica directo), tendencias de sentimiento en reseñas.
- **Lo que nunca debe aprender por inferencia**: cualquier patrón que sugiera presionar a un paciente para aceptar un tratamiento o financiación no le beneficia — esto es, explícitamente, un límite de aprendizaje, no solo de ejecución (coherente con el anti-objetivo comercial de PVD-0001 §3 y §9: ATLAS AI no vende autonomía irresponsable, y eso incluye lo que el sistema tiene permitido *aprender*, no solo lo que tiene permitido *hacer*).

---

## 19. Qué debe automatizar

Automatización de bajo riesgo, alto volumen, sin decisión clínica ni comercial sensible involucrada:

- Confirmaciones, recordatorios y reprogramaciones simples de cita.
- Respuestas a preguntas frecuentes desde el Brain.
- Triage inicial de llamadas y derivación (nunca diagnóstico).
- Identificación y contacto proactivo de pacientes pendientes de revisión.
- Borradores de presupuesto a partir del plan estructurado del dentista.
- Seguimiento de presupuestos pendientes de respuesta.
- Borradores de campañas y solicitudes de reseña, con aprobación antes de envío masivo.

Se proponen cinco plantillas de Empleado Digital específicas del vertical, disponibles desde el Momento 3 del onboarding (PVD-0002 §2) al elegir el sector Dental:

| Empleado Digital | Procesos que cubre |
|---|---|
| **Recepción Digital** | Llamadas (§7), Recepción (§8) |
| **Agenda y Recall** | Agenda (§9), Revisiones (§13) |
| **Coordinador de Presupuestos** | Presupuestos (§11), Financiación (§12) |
| **Guardián de Urgencias** | Urgencias (§15) — el de menor alcance de capacidades de los cinco, por diseño |
| **Reputación y Campañas** | Campañas (§14), Google Reviews (§16) |

---

## 20. Qué debe explicar

Todo Empleado Digital del vertical Dental debe poder justificar, en cualquier momento y ante el propietario o el paciente:

- **De qué tarifa o protocolo salió** cualquier precio o descripción de tratamiento mencionado — cita exacta a la fuente del Brain (ADR-0003).
- **Que una recomendación de tratamiento viene del dentista**, nunca del propio agente, cuando se comunica un plan ya definido clínicamente.
- **Qué criterio de triage disparó un escalado de urgencia** — trazabilidad completa de la decisión (ADR-0005 §12, Explainability Engine).
- **En qué condiciones se basa cualquier mención de financiación** — nunca una cifra o plazo inventado.
- **Que el paciente está hablando, total o parcialmente, con un sistema asistido por IA**, de forma visible y con opción explícita de pasar a un humano — no como texto legal escondido, como parte natural de la conversación (línea roja §6.4).

---

## 21. Cómo usar este documento

Ante cualquier decisión futura específica del vertical Dental que no esté cubierta aquí, dos preguntas, en este orden:

1. **¿Toca el motor clínico (§1)?** Si la respuesta es sí en cualquier grado, la decisión por defecto es que el Empleado Digital informa y deriva, nunca decide ni sustituye criterio humano — sin excepciones de conveniencia comercial.
2. **¿Está ya cubierto por una de las líneas rojas de §6?** Si sí, la respuesta ya está decidida y no requiere nueva deliberación caso por caso — las líneas rojas de este vertical existen precisamente para no tener que reabrir estas preguntas cada vez.

Si ninguna pregunta resuelve el caso, la decisión se documenta como una enmienda a este blueprint — nunca como una excepción silenciosa en la implementación.
