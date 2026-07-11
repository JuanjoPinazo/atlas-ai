# DKB-EMP-01 — Modelos de Clínica Dental

| Campo | Valor |
|---|---|
| **Biblioteca** | Atlas Dental Knowledge Library |
| **Categoría** | 01 · Empresa |
| **ID de documento** | DKB-EMP-01 |
| **Versión** | 1.0 |
| **Responsable** | Por asignar — Equipo de Producto, Vertical Dental |
| **Fecha de última actualización** | 2026-07-09 |
| **Nivel de confianza** | Borrador — pendiente de validación con clínicas piloto |
| **Fuentes** | Conocimiento experto de consultoría en gestión dental. Pendiente: entrevistas con clínicas piloto |
| **Evidencia** | Sin evidencia empírica todavía — cada hipótesis marcada explícitamente (ver convención de trazabilidad) |
| **Relación con otros documentos** | Alimentado por → [DKB-PAC-01](../03_Paciente/DKB-PAC-01_Recorrido_Paciente.md) (el recorrido del paciente varía según modelo de clínica). Se apoya en → [PVD-0002](../../pvd/0002-first-customer-experience.md), [PVD-0003](../../pvd/0003-business-dna.md), [PVD-0005](../../pvd/0005-atlas-dental-intelligence-blueprint.md), [PVD-0006](../../pvd/0006-atlas-intelligence-network.md), [PVD-0007](../../pvd/0007-roi-intelligence-platform.md), [ADR-0002](../../adr/0002-company-brain.md) |
| **Prioridad de construcción** | 12 de 12 (ver [Índice Maestro](../00_Master_Index.md)) |

---

## Cómo leer este documento

Este documento pertenece a la **Atlas Dental Knowledge Library** — la biblioteca de documentos de conocimiento independientes, versionados y con metadatos propios que, en conjunto, forman la base de conocimiento definitiva del vertical dental. Cada documento de la biblioteca es autocontenido y está escrito para poder alimentar directamente, en el futuro, la generación automática de Knowledge Domains, Knowledge Units, Business DNA, Policies, Decision Rules, automatizaciones, Empleados Digitales, Knowledge Packs, material comercial, ayuda contextual y guiones de onboarding.

Este documento se construyó primero como **plantilla de calidad** (fijando el nivel de detalle de 20 campos por subapartado), pero en la hoja de ruta de construcción por impacto de negocio ocupa el **último** lugar de prioridad — ver el [Índice Maestro](../00_Master_Index.md) para la taxonomía completa de las 12 categorías de la biblioteca y el orden de construcción real.

### Convención de trazabilidad de afirmaciones

Todo el documento distingue explícitamente tres tipos de afirmación, marcadas en línea:

- **[HECHO]** — algo verificable por definición o por lo ya establecido en la arquitectura de ATLAS AI (ADR/PVD existentes).
- **[HIPÓTESIS — validar con clínicas piloto]** — una afirmación operativa o económica razonable pero no verificada con datos reales; **no se inventa ninguna cifra estadística o económica concreta en este documento** — donde se ilustra una magnitud, se marca explícitamente como ejemplo hipotético a validar, nunca como dato real.
- **[RECOMENDACIÓN]** — una decisión de producto o de implantación sugerida, abierta a discusión.

### Marco de priorización

Los nueve modelos de este documento no tienen la misma urgencia de producto. Se ordenan según una lógica de complejidad de gobernanza creciente, no de importancia de negocio:

| Prioridad | Criterio | Modelos |
|---|---|---|
| **MVP** | Sede única, un solo centro de decisión, gobernanza de Business DNA simple | Clínica independiente, Clínica familiar |
| **Fase 2** | Sede única, pero con mayor complejidad de configuración (tono, multi-especialidad, canal de captación) | Clínica premium, Clínica multidisciplinar, Clínica especializada |
| **Avanzado** | Multi-sede o multi-entidad, requiere gobernanza de Business DNA de más de un nivel | Franquicia, Grupo de clínicas, Clínica con laboratorio propio, Clínica con laboratorio externo |

**[RECOMENDACIÓN]** Este orden de prioridad debe usarse como guía de roadmap de producto para el vertical dental, no solo como clasificación descriptiva.

---

## Matriz comparativa de los nueve modelos

| Modelo | Nº de sedes típico | Centro de decisión | Complejidad de Business DNA | Canal de captación dominante | Prioridad |
|---|---|---|---|---|---|
| Independiente | 1 | Propietario único | Baja | Boca a boca, cercanía local | MVP |
| Familiar | 1 | Núcleo familiar | Baja-media | Relación multigeneracional | MVP |
| Premium | 1 | Propietario / dirección | Media-alta (tono, tiempos) | Reputación, referidos de alto valor | Fase 2 |
| Multidisciplinar | 1 | Dirección médica + gerencia | Media-alta (multi-especialidad) | Derivación interna + marketing | Fase 2 |
| Especializada | 1 | Propietario / dirección | Media (identidad de nicho) | Referidos de otras clínicas + marketing especializado | Fase 2 |
| Franquicia | 1 sede, parte de red | Central + franquiciado (dos niveles) | Alta (DNA de marca + override local) | Marketing centralizado de marca | Avanzado |
| Grupo de clínicas | Varias, propiedad única | Dirección de grupo + gerencia por sede | Alta (DNA compartido, sin relación contractual externa) | Variable por sede | Avanzado |
| Con laboratorio propio | 1 (+ unidad de laboratorio) | Propietario / dirección técnica | Media (coordinación operativa) | Variable | Avanzado |
| Con laboratorio externo | 1 | Propietario / dirección | Baja-media | Variable | Fase 2 |

**[HIPÓTESIS — validar con clínicas piloto]** Esta matriz es una primera aproximación basada en patrones habituales del sector; los valores concretos de "complejidad" y "canal dominante" deben confirmarse con entrevistas reales antes de fijarse como parámetros de producto definitivos (ver preguntas de implantación en cada modelo).

---

## 1. Clínica independiente

### 1. Definición
Negocio dental de propiedad y gestión de un único odontólogo o un pequeño grupo de socios, sin pertenencia a una red de franquicia ni a un grupo corporativo. Modelo predominante del sector en volumen de establecimientos **[HECHO — estructural, no cuantificado aquí]**.

### 2. Funcionamiento habitual actual
El propietario suele ejercer simultáneamente de clínico y de gestor del negocio. La recepción, cuando existe como rol dedicado, suele ser una única persona. Las decisiones — de precio, de proceso, de trato al paciente — están centralizadas en el propietario, y buena parte del conocimiento operativo vive en su cabeza, no en documentos formales.

### 3. Problemas frecuentes
- El dentista dedica tiempo de sillón (el recurso más caro de la clínica) a tareas administrativas.
- Falta de seguimiento sistemático de presupuestos y de recall, porque nadie tiene tiempo dedicado a ello.
- Procesos informales, no documentados — el conocimiento operativo depende de la memoria del propietario.
- Recepción sobrecargada en horas punta, con llamadas perdidas.
- Sin redundancia operativa si el titular falta.

### 4. Consecuencias económicas y operativas
El coste de oportunidad de que el propietario gestione en vez de tratar es alto — cada hora de gestión es una hora de sillón no facturada. La falta de seguimiento sistemático de presupuestos y recall es, en este modelo, la fuga de ingresos más probable **[HIPÓTESIS — validar con clínicas piloto]**, precisamente porque no hay una persona dedicada a esa tarea.

### 5. Necesidades de cada actor
- **Propietario**: liberar tiempo de gestión sin perder visibilidad ni control sobre lo importante.
- **Recepción** (si existe): apoyo en picos de llamadas y en tareas repetitivas.
- **Paciente**: cercanía y confianza — el activo diferencial de este modelo frente a estructuras más grandes.

### 6. Datos necesarios
Número de sillones, especialidades ofrecidas, tamaño de equipo, herramienta de gestión clínica actual (si la hay), volumen aproximado de llamadas y citas semanales.

### 7. Qué puede hacer ATLAS
Absorber la gestión de llamadas y preguntas frecuentes, hacer seguimiento sistemático de presupuestos pendientes (el mayor punto de fuga identificado), automatizar recordatorios de revisión, y dar al propietario visibilidad de negocio sin que tenga que pedir informes a nadie (ATLAS Home, ver referencia arquitectónica).

### 8. Qué no debe hacer ATLAS
Sustituir el criterio clínico o comercial del propietario. Imponer procesos rígidos que no encajen con la agilidad característica de este modelo. Tomar decisiones de precio o descuento sin aprobación explícita.

### 9. Automatizaciones recomendadas
Recepción digital de llamadas y preguntas frecuentes, seguimiento activo de presupuestos pendientes, recordatorios de revisión periódica, confirmaciones de cita.

### 10. Decisiones que requieren aprobación humana
Cualquier presupuesto antes de su primer envío. Cualquier campaña de marketing con coste asociado. Cualquier cambio de precio o condición comercial.

### 11. Riesgos
**[HIPÓTESIS — validar con clínicas piloto]** Al estar tan implicado personalmente en cada decisión, el propietario de una clínica independiente puede ser más reticente a delegar en un sistema si no percibe trazabilidad clara de cada acción — mayor necesidad relativa de explicabilidad visible desde el primer día.

### 12. KPIs
Tasa de cierre de presupuestos, llamadas gestionadas que antes se habrían perdido, horas de gestión administrativa liberadas al propietario.

### 13. Beneficio cuantificable
**[HIPÓTESIS — validar con clínicas piloto]** El valor de una hora de gestión liberada es proporcionalmente mayor en este modelo que en uno con gerente dedicado, porque la hora liberada es, con frecuencia, hora de sillón del propio propietario — el recurso de mayor coste de oportunidad de la clínica.

### 14. Argumento comercial
Recupera las horas que hoy dedicas a gestionar en vez de tratar.

### 15. Ejemplo práctico
Un dentista que atiende pacientes toda la mañana llega a mediodía con llamadas perdidas acumuladas y presupuestos de la semana anterior sin seguimiento. Con ATLAS, ambas cosas se gestionan en tiempo real mientras él sigue en el sillón — sin que tenga que interrumpir su jornada clínica para atenderlas.

### 16. Ayuda contextual para mostrar en la plataforma
> "Como clínica independiente, es probable que hoy dediques tiempo de sillón a tareas de gestión. Empecemos por ahí."

### 17. Preguntas para la implantación
¿Quién gestiona hoy la recepción cuando el titular está en consulta? ¿Existe ya un seguimiento sistemático de presupuestos pendientes? ¿Cuántas horas semanales dedica el propietario a tareas no clínicas?

### 18. Diferencias entre clínica privada y franquicia
Sin marca corporativa que seguir ni procesos centralizados impuestos — máxima libertad para personalizar el Business DNA y el tono de comunicación desde cero. A cambio, no cuenta con el respaldo de protocolos ya probados en decenas de sedes de la misma marca, aunque sí puede beneficiarse de los Knowledge Packs generales de vertical vía Atlas Intelligence Network.

### 19. Nivel de prioridad
**MVP.**

### 20. Entidades y relaciones de conocimiento necesarias
Un `KnowledgeDomain` por área operativa (Agenda, Presupuestos, Tratamientos…) con un único propietario de decisión. `DNATrait` de apetito de riesgo inicialmente bajo (el propietario querrá aprobar la mayoría de acciones al inicio, coherente con el patrón de incorporación gradual de confianza). `capability_grant` inicial estrecho por defecto para cualquier Empleado Digital.

---

## 2. Clínica familiar

### 1. Definición
Clínica de propiedad familiar, a menudo multigeneracional, con varios miembros de una misma familia repartiendo responsabilidades clínicas y de gestión.

### 2. Funcionamiento habitual actual
Reparto de responsabilidades entre familiares — típicamente uno más orientado a lo clínico y otro más a la gestión — con una cultura fuerte de relación de largo plazo con el paciente, en ocasiones con pacientes que llevan generaciones en la misma clínica.

### 3. Problemas frecuentes
Roles difusos entre familiares sobre quién decide qué. Resistencia al cambio de procesos por apego a la forma tradicional de trabajar. Decisiones que históricamente se tomaban "de palabra" y nunca se formalizaron.

### 4. Consecuencias económicas y operativas
El crecimiento del negocio puede verse limitado por la capacidad de coordinación informal entre familiares. La falta de procesos claros puede generar fricción interna si el negocio crece más allá de lo que la coordinación informal puede sostener.

### 5. Necesidades de cada actor
Preservar el vínculo personal con el paciente — el activo principal de este modelo — mientras se gana eficiencia operativa. Necesidad de que cualquier automatización no traicione el tono cercano que define la marca de la clínica.

### 6. Datos necesarios
Qué miembro de la familia decide qué tipo de asunto, antigüedad media de la base de pacientes, estilo de comunicación habitual de la clínica.

### 7. Qué puede hacer ATLAS
Reforzar el tono cercano de la clínica en cada interacción automatizada (vía Business DNA), y mantener consistencia de trato entre los distintos miembros de la familia que atienden — evitando que un paciente perciba un trato distinto según quién le atendió esa vez.

### 8. Qué no debe hacer ATLAS
Imponer un tono corporativo o distante que rompa el activo relacional de la clínica. Automatizar decisiones que tradicionalmente se tomaban "de palabra" sin que la familia haya formalizado antes cuál es el criterio real detrás de esa decisión.

### 9. Automatizaciones recomendadas
Recall con tono personalizado y cercano, seguimiento de presupuestos con el mismo estilo en cualquier canal, gestos de continuidad de relación (recordatorios de hitos relevantes del paciente en la clínica).

### 10. Decisiones que requieren aprobación humana
Cualquier cambio de tono o política que afecte a la relación con pacientes de largo plazo. Decisiones que tradicionalmente correspondían a un familiar concreto, hasta que la familia decida formalizar ese criterio.

### 11. Riesgos
**[HIPÓTESIS — validar con clínicas piloto]** Mayor sensibilidad emocional a que la comunicación se perciba "robótica" que en otros modelos, precisamente porque el activo diferencial de esta clínica es la cercanía personal.

### 12. KPIs
Tasa de retención de pacientes multigeneracionales, consistencia de tono percibida entre los distintos agentes/familiares que atienden.

### 13. Beneficio cuantificable
**[HIPÓTESIS — validar con clínicas piloto]** Reducción de la fricción de coordinación entre familiares al formalizar procesos operativos sin perder el estilo relacional que caracteriza a la clínica.

### 14. Argumento comercial
Mantén la cercanía que te ha traído hasta aquí, sin que dependa de la memoria de cada uno.

### 15. Ejemplo práctico
Un paciente de tercera generación en la misma clínica recibe un recordatorio de revisión con el mismo tono cercano que ha recibido siempre, aunque quien lo atienda esa vez sea un familiar distinto al habitual — el sistema ayuda a mantener la continuidad del trato, no a sustituirlo.

### 16. Ayuda contextual para mostrar en la plataforma
> "Configura el tono de tu Business DNA para que refleje cómo tu familia siempre ha tratado a sus pacientes."

### 17. Preguntas para la implantación
¿Qué miembro de la familia decide qué tipo de asunto? ¿Hay algo del trato actual que consideráis intransferible a un sistema?

### 18. Diferencias entre clínica privada y franquicia
El Business DNA de una clínica familiar es intransferible y único de esa familia concreta; una franquicia, en cambio, impone un DNA corporativo compartido entre todas sus sedes, con mucho menor margen de personalización relacional local.

### 19. Nivel de prioridad
**MVP.**

### 20. Entidades y relaciones de conocimiento necesarias
`DNAToneProfile` con calidez alta por defecto. `DNATrait` de "prioridad de relación de largo plazo: alta". Posible entidad de tipo "hito de relación con paciente" en el grafo semántico, usada solo como disparador de comunicación, nunca como almacenamiento de historia clínica.

---

## 3. Clínica premium

### 1. Definición
Clínica posicionada en el segmento alto del mercado, con foco explícito en experiencia del paciente, cuidado de instalaciones, y tratamientos de mayor ticket medio (estética dental, rehabilitación compleja, implantología avanzada).

### 2. Funcionamiento habitual actual
Proceso de decisión del paciente más largo y consultivo, mayor inversión en experiencia en cada punto de contacto (desde la primera llamada hasta el seguimiento posterior), a menudo con personal dedicado a coordinación de tratamiento.

### 3. Problemas frecuentes
Expectativas de paciente muy altas en cada interacción — un fallo de experiencia pesa proporcionalmente más que en un modelo de precio medio. Presupuestos de alto valor que exigen un proceso de presentación cuidado. Riesgo percibido de que la automatización "abarate" la sensación de trato premium si no se ejecuta con el mismo nivel de cuidado.

### 4. Consecuencias económicas y operativas
El coste de adquisición por paciente suele ser mayor, pero también lo es el valor de cada paciente a lo largo del tiempo — cualquier fuga (un presupuesto no cerrado, una cita mal gestionada) representa una pérdida absoluta más alta que en otros modelos.

### 5. Necesidades de cada actor
Consistencia de excelencia en cada interacción, sin excepciones. Tiempos de respuesta rápidos — la percepción de "premium" incluye explícitamente no hacer esperar al paciente. Personalización visible del trato.

### 6. Datos necesarios
Ticket medio de tratamiento, tiempo medio del proceso de decisión del paciente, canales de contacto preferidos por este segmento de paciente.

### 7. Qué puede hacer ATLAS
Garantizar tiempos de respuesta rápidos y consistentes en cada canal. Preparar contexto rico antes de cada interacción humana, para que el coordinador de tratamiento llegue ya informado. Hacer seguimiento impecable de presupuestos de alto valor.

### 8. Qué no debe hacer ATLAS
Usar un tono genérico o plantillas visiblemente automatizadas — la calidad de la comunicación debe ser indistinguible del trato humano premium. Gestionar la presentación inicial de un presupuesto de tratamiento complejo sin pasar antes por el coordinador humano.

### 9. Automatizaciones recomendadas
Confirmaciones y recordatorios con cuidado estético de marca. Seguimiento post-tratamiento reforzado, como parte explícita de la experiencia premium. Gestión proactiva de reseñas, dado el peso del boca a boca en este segmento.

### 10. Decisiones que requieren aprobación humana
La presentación inicial de cualquier presupuesto de tratamiento complejo. Cualquier gestión de una experiencia negativa reportada por un paciente.

### 11. Riesgos
**[HIPÓTESIS — validar con clínicas piloto]** El coste reputacional de un fallo de automatización es mayor en este modelo que en otros — un error visible puede dañar la percepción premium de forma desproporcionada a su gravedad real.

### 12. KPIs
Tiempo de primera respuesta, tasa de cierre de presupuestos de alto valor, puntuación media de reseñas.

### 13. Beneficio cuantificable
**[HIPÓTESIS — validar con clínicas piloto]** Dado el ticket medio más alto de este modelo, el valor recuperado por cada presupuesto de seguimiento activo es proporcionalmente mayor incluso con la misma tasa de mejora de cierre que en modelos de ticket medio inferior.

### 14. Argumento comercial
La misma excelencia que ya ofreces en el sillón, en cada llamada y en cada seguimiento.

### 15. Ejemplo práctico
Un paciente con un presupuesto de rehabilitación oral completa de alto valor queda pendiente de decisión. El sistema hace seguimiento con el mismo cuidado y tono que recibiría en consulta, y avisa al coordinador humano en el momento adecuado para retomar el contacto personal — nunca sustituye ese contacto en un caso de este valor.

### 16. Ayuda contextual para mostrar en la plataforma
> "En clínicas premium, cada segundo de espera cuenta como parte de la experiencia. Configura tiempos de respuesta exigentes desde el primer día."

### 17. Preguntas para la implantación
¿Cuál es el ticket medio actual? ¿Qué parte de la experiencia del paciente consideráis intransferible a un sistema automatizado?

### 18. Diferencias entre clínica privada y franquicia
En una clínica premium independiente, el propio negocio define su estándar de experiencia. En una franquicia premium, ese estándar viene dado por la marca central y debe respetarse de forma más estricta entre sedes — menor margen de personalización local del tono.

### 19. Nivel de prioridad
**Fase 2.**

### 20. Entidades y relaciones de conocimiento necesarias
`DNAToneProfile` de alta formalidad y cuidado, con umbral de confianza (`ConfidenceScorer`, en términos de la arquitectura general) más exigente antes de entregar cualquier respuesta automatizada. `DNATrait` de "tiempo de respuesta objetivo" como parámetro explícito, no implícito.

---

## 4. Clínica multidisciplinar

### 1. Definición
Clínica que integra varias especialidades bajo un mismo techo — odontología general, ortodoncia, implantología, periodoncia, endodoncia, odontopediatría, entre otras — con varios profesionales especialistas coordinados.

### 2. Funcionamiento habitual actual
Derivación interna entre especialistas: el dentista general diagnostica y deriva a un especialista de la propia clínica. Agenda más compleja, con múltiples profesionales y, a menudo, salas o equipamiento específico por especialidad. Tratamientos que combinan fases de más de una especialidad.

### 3. Problemas frecuentes
Falta de visibilidad cruzada entre especialistas sobre un paciente compartido. Agenda difícil de coordinar cuando un tratamiento requiere citas encadenadas con distintos profesionales. Presupuestos que combinan varias especialidades y necesitan consolidación antes de presentarse al paciente.

### 4. Consecuencias económicas y operativas
Mayor ticket medio potencial gracias a tratamientos combinados entre especialidades, pero también mayor riesgo de fricción si la coordinación falla — el paciente percibe la descoordinación entre especialistas como falta de profesionalidad, con impacto directo en confianza y en tasa de aceptación.

### 5. Necesidades de cada actor
Cada especialista necesita visibilidad del contexto compartido del paciente, sin acceder a información que no le corresponde. Necesidad de coordinación de agenda entre profesionales y salas especializadas. Necesidad de presupuestos consolidados cuando un tratamiento cruza varias especialidades.

### 6. Datos necesarios
Qué especialidades operan en la clínica, cómo se gestiona hoy la derivación interna, si los presupuestos multi-especialidad se consolidan o se presentan por separado.

### 7. Qué puede hacer ATLAS
Coordinar agenda multi-profesional y multi-sala. Generar presupuestos consolidados que combinan fases de distintas especialidades. Notificar automáticamente a un especialista cuando otro deriva un caso.

### 8. Qué no debe hacer ATLAS
Decidir a qué especialista se deriva un caso clínico — es, sin excepción, una decisión exclusivamente clínica. El sistema puede facilitar la coordinación logística de una derivación ya decidida por un profesional, nunca decidirla por su cuenta.

### 9. Automatizaciones recomendadas
Agenda coordinada entre profesionales, presupuesto consolidado multi-fase, notificación automática de derivación interna, seguimiento de tratamientos con fases repartidas entre especialidades.

### 10. Decisiones que requieren aprobación humana
Cualquier derivación clínica entre especialistas. La composición final de un presupuesto multi-especialidad antes de su primer envío.

### 11. Riesgos
Mayor complejidad de configuración del modelo de capacidades — cada especialista con su propio ámbito de conocimiento — con más superficie de error si los límites de acceso entre especialistas no están bien definidos (por ejemplo, qué parte del caso de un paciente de ortodoncia debe ser visible para el especialista de implantología que colabora en el mismo caso, y qué no).

### 12. KPIs
Tiempo de coordinación entre especialidades, tasa de cierre de presupuestos multi-fase, tiempo entre derivación interna y primera cita con el especialista derivado.

### 13. Beneficio cuantificable
**[HIPÓTESIS — validar con clínicas piloto]** Reducción del tiempo de coordinación administrativa entre especialistas, hoy frecuentemente gestionado por comunicación informal entre profesionales.

### 14. Argumento comercial
Que tus especialistas trabajen como un solo equipo, no como clínicas independientes bajo el mismo techo.

### 15. Ejemplo práctico
Un paciente de periodoncia que necesita, después, una fase de implantología: el sistema coordina la transición de agenda entre ambos especialistas y consolida el presupuesto de ambas fases, sin que el paciente tenga que gestionar dos procesos separados.

### 16. Ayuda contextual para mostrar en la plataforma
> "Define qué especialidades hay en tu clínica y cómo se derivan casos entre ellas — así podremos coordinar agenda y presupuestos automáticamente."

### 17. Preguntas para la implantación
¿Qué especialidades operan en la clínica? ¿Cómo se gestiona hoy la derivación interna entre profesionales? ¿Los presupuestos multi-especialidad se consolidan hoy o se presentan por separado?

### 18. Diferencias entre clínica privada y franquicia
En una franquicia multidisciplinar, el catálogo de especialidades y sus protocolos de derivación pueden venir parcialmente estandarizados desde la marca central. En un modelo independiente multidisciplinar, cada clínica define su propio protocolo de coordinación desde cero.

### 19. Nivel de prioridad
**Fase 2.**

### 20. Entidades y relaciones de conocimiento necesarias
Un `KnowledgeDomain` por especialidad, con `capability_grant` diferenciado por profesional. `KnowledgeRelation` de tipo "deriva a" entre entidades de especialidad en el grafo semántico. Necesidad de una política explícita (`Policy`) que defina qué contexto de un caso compartido es visible entre especialistas distintos.

---

## 5. Clínica especializada (monoespecialidad)

### 1. Definición
Clínica centrada en una única especialidad — por ejemplo, solo ortodoncia, solo implantología, o solo odontopediatría — sin oferta de odontología general.

### 2. Funcionamiento habitual actual
Proceso muy estandarizado en torno a un único tipo de tratamiento, a menudo con alto volumen de un mismo tipo de caso y protocolos internos muy maduros y repetibles.

### 3. Problemas frecuentes
Dependencia fuerte de la captación externa, ya que no existe el flujo natural de derivación interna que tiene una clínica generalista. Necesidad de diferenciación competitiva frente a otras clínicas de la misma especialidad en la misma zona.

### 4. Consecuencias económicas y operativas
El marketing y la gestión de reputación pesan proporcionalmente más en este modelo que en uno generalista, precisamente porque la captación no llega por derivación interna espontánea.

### 5. Necesidades de cada actor
Fuerte necesidad de marketing y captación externa eficaz. Protocolos de tratamiento muy pulidos y replicables, dado el volumen y grado de especialización. Gestión sistemática de la relación con clínicas generales que derivan pacientes — un actor adicional característico de este modelo.

### 6. Datos necesarios
Especialidad concreta, canal principal de captación (marketing propio frente a referidos de otras clínicas), volumen típico de caso gestionado.

### 7. Qué puede hacer ATLAS
Reforzar marketing y gestión de reputación con mayor intensidad que en otros modelos. Gestionar de forma sistemática la relación con clínicas remitentes. Mantener en el Brain protocolos de tratamiento altamente estandarizados, dado el volumen repetible de esta especialidad.

### 8. Qué no debe hacer ATLAS
Diluir la identidad de especialización con contenido genérico de odontología general que no corresponde a la marca de la clínica.

### 9. Automatizaciones recomendadas
Seguimiento sistemático de referidos de clínicas remitentes. Campañas de captación específicas de la especialidad. Contenido educativo especializado en el Brain para responder preguntas frecuentes muy propias del tratamiento concreto.

### 10. Decisiones que requieren aprobación humana
Comunicación con clínicas remitentes sobre casos concretos. Cualquier campaña de captación con coste asociado.

### 11. Riesgos
**[HIPÓTESIS — validar con clínicas piloto]** Mayor exposición a la volatilidad de los canales de captación externos si no se diversifica adecuadamente entre marketing propio y red de referidos.

### 12. KPIs
Volumen de referidos gestionados, coste de adquisición por canal, tasa de conversión de primera consulta a tratamiento aceptado.

### 13. Beneficio cuantificable
**[HIPÓTESIS — validar con clínicas piloto]** Mejora de la retención y seguimiento de la relación con clínicas remitentes mediante comunicación sistemática, frente a la gestión informal habitual hoy.

### 14. Argumento comercial
Conviértete en la referencia de tu especialidad en tu zona, sin que la captación dependa de la memoria de quién te recomendó.

### 15. Ejemplo práctico
Una clínica de ortodoncia que recibe referidos de varias clínicas generales de su zona: el sistema hace seguimiento sistemático de cada relación de referido, informando al remitente del estado del caso derivado, siempre con el consentimiento explícito del paciente.

### 16. Ayuda contextual para mostrar en la plataforma
> "Como clínica especializada, gran parte de tu captación probablemente llega por referidos. Configuremos cómo gestionarlos de forma sistemática."

### 17. Preguntas para la implantación
¿Qué proporción de pacientes llega por referido frente a marketing propio? ¿Existe ya una comunicación sistemática con las clínicas remitentes?

### 18. Diferencias entre clínica privada y franquicia
Una franquicia especializada en una única disciplina centraliza el protocolo clínico y de marketing a nivel de marca. Una clínica especializada independiente construye su propio protocolo y reputación desde cero, con una sola sede.

### 19. Nivel de prioridad
**Fase 2.**

### 20. Entidades y relaciones de conocimiento necesarias
`KnowledgeEntity` de tipo "clínica remitente" en el grafo semántico (relación de negocio, nunca dato clínico de un paciente concreto). `KnowledgeDomain` de marketing especializado, con contenido educativo propio de la especialidad.

---

## 6. Franquicia

### 1. Definición
Clínica que opera bajo la marca, protocolos y estándares de una cadena franquiciadora, con un contrato que regula qué decisiones corresponden a la central y cuáles al franquiciado local.

### 2. Funcionamiento habitual actual
Doble capa de gobernanza: la marca central define estándares de marca, protocolos, y a menudo tarifario de referencia y proveedores homologados; el franquiciado gestiona la operación diaria de su sede dentro de ese marco.

### 3. Problemas frecuentes
Tensión entre estandarización de marca y necesidad de adaptación a las condiciones locales. Reporting exigido por la central que consume tiempo del franquiciado. Dificultad para que una mejora descubierta en una sede se propague de forma sistemática a las demás.

### 4. Consecuencias económicas y operativas
La consistencia de marca entre sedes es un activo colectivo — o un pasivo colectivo, si una sede concreta falla y daña la percepción de toda la red. La central necesita visibilidad agregada del desempeño de sus franquiciados para gestionar ese riesgo.

### 5. Necesidades de cada actor
La central necesita estandarización y visibilidad multi-sede. El franquiciado local necesita margen real de gestión operativa dentro del marco impuesto por la marca.

### 6. Datos necesarios
Qué está centralizado por contrato (marca, protocolos, tarifario, proveedores) y qué queda a decisión local. Estructura y frecuencia del reporting exigido por la central.

### 7. Qué puede hacer ATLAS
Aplicar un Business DNA de dos niveles — un perfil corporativo de marca heredado por todas las sedes, con posibilidad de *override* local explícito y auditado allí donde el contrato lo permite. Generar reporting agregado para la central de forma automática. Distribuir mejoras detectadas en una sede al resto de la red de la misma marca, mediante el mismo mecanismo de paquetes de conocimiento versionados usado a escala de todo el sector, pero aplicado aquí de forma privada dentro de la red de franquicia.

### 8. Qué no debe hacer ATLAS
Permitir que una sede local modifique de forma silenciosa un estándar que la central considera no negociable — el equivalente, a nivel de marca, a una restricción absoluta que ninguna sede individual puede relajar sin autorización expresa de la central.

### 9. Automatizaciones recomendadas
Reporting automático hacia la central. Distribución de actualizaciones de protocolo desde la central hacia todas las sedes. Comparación de desempeño entre sedes de la misma marca, visible solo dentro de la propia red, nunca frente a competidores externos.

### 10. Decisiones que requieren aprobación humana
Cualquier desviación de una sede respecto al estándar de marca. Cualquier cambio de tarifario fuera del rango autorizado localmente por contrato.

### 11. Riesgos
Mayor complejidad de gobernanza, al existir dos niveles de Business DNA potencialmente en tensión. Riesgo de que la central use la visibilidad que ofrece la plataforma para un nivel de control que fricciona con la autonomía operativa razonable del franquiciado — **[HIPÓTESIS — validar con marcas franquiciadoras reales]** cuál es el balance de control aceptable en la práctica.

### 12. KPIs
Consistencia de indicadores clave entre sedes de la misma marca. Tiempo de propagación de una mejora de protocolo a toda la red. Nivel de cumplimiento del estándar de marca.

### 13. Beneficio cuantificable
**[HIPÓTESIS — validar con clínicas piloto]** Valor de que una mejora de proceso descubierta en una sede se aplique de forma sistemática a todas las demás, frente a depender de la comunicación manual entre franquiciados.

### 14. Argumento comercial
Una sola plataforma que garantiza el mismo estándar de marca en cada sede, con visibilidad total para la central sin sacrificar agilidad operativa local.

### 15. Ejemplo práctico
Una sede detecta que un ajuste en su protocolo de recall reduce el olvido de revisiones por parte de los pacientes. La central lo revisa, lo valida, y lo distribuye como actualización al resto de sedes de la red.

### 16. Ayuda contextual para mostrar en la plataforma
> "Como sede de una franquicia, algunos ajustes de tu Business DNA vienen definidos por tu marca central y no pueden modificarse localmente. Los verás marcados como no editables."

### 17. Preguntas para la implantación
¿Qué decide la central y qué decide la sede, exactamente? ¿Existe ya un mecanismo de propagación de mejoras entre sedes? ¿Qué reporting exige hoy la central, y con qué frecuencia?

### 18. Diferencias entre clínica privada y franquicia
Esta es, en sí misma, la comparación central de este apartado. La diferencia estructural principal frente a cualquier modelo privado es la existencia de un Business DNA de marca superior al de la sede individual, con restricciones no editables localmente — un mecanismo de gobernanza de dos niveles que no existe en ningún modelo privado de este documento, salvo, con menor rigidez contractual, en el grupo de clínicas (§7).

### 19. Nivel de prioridad
**Avanzado.**

### 20. Entidades y relaciones de conocimiento necesarias
`BusinessDNAProfile` de dos niveles jerárquicos (marca central → sede), con restricciones marcadas como no editables por la sede. Paquete de conocimiento versionado de distribución privada dentro de la red de marca. Reporting agregado como una vista de datos propia de la central, distinta de la vista operativa de cada sede.

---

## 7. Grupo de clínicas

### 1. Definición
Conjunto de clínicas bajo una misma propiedad — sin relación de franquicia con un tercero — que pueden operar con una marca compartida o con marcas distintas por sede.

### 2. Funcionamiento habitual actual
Similar a la franquicia en la necesidad de gobernanza multi-sede, pero sin relación contractual entre partes distintas: es una única empresa con varias ubicaciones. Mayor margen de estandarización directa que en una franquicia (no hay negociación entre partes), pero también complejidad real de gestionar volumen y consistencia entre sedes.

### 3. Problemas frecuentes
Silos de información entre sedes, gestionadas históricamente de forma algo distinta unas de otras. Dificultad para tener una visión consolidada del negocio completo. Capacidad mal redistribuida entre sedes — una con lista de espera mientras otra tiene huecos libres.

### 4. Consecuencias económicas y operativas
Pérdida de eficiencia de escala si cada sede opera como si fuera independiente pese a compartir propiedad — el grupo no capitaliza la ventaja que debería tener por su tamaño.

### 5. Necesidades de cada actor
Visión consolidada del negocio a nivel de grupo, además de por sede individual. Posibilidad de derivar pacientes o capacidad entre sedes cuando tiene sentido. Consistencia operativa sin perder la identidad local si las sedes operan con nombres o marcas distintas.

### 6. Datos necesarios
Número de sedes, si comparten marca o no, si existe hoy derivación de pacientes entre sedes, y cómo está estructurada la gestión (gerencia única frente a gerencia por sede).

### 7. Qué puede hacer ATLAS
Ofrecer una vista financiera consolidada a nivel de grupo además de por sede. Facilitar la derivación de pacientes o capacidad entre sedes cuando el grupo lo permite explícitamente. Aplicar un Business DNA compartido con posibilidad de *override* local, de forma similar a una franquicia, pero sin la rigidez de un contrato con un tercero — es el propio grupo quien decide su nivel de centralización.

### 8. Qué no debe hacer ATLAS
Forzar homogeneización entre sedes que el propio grupo no ha decidido explícitamente — a diferencia de una franquicia con marca externa, aquí la decisión de cuánto centralizar es enteramente del propietario del grupo, y el sistema debe reflejar esa decisión, nunca imponerla por defecto.

### 9. Automatizaciones recomendadas
Redistribución de capacidad entre sedes (ofrecer un hueco libre de una sede a un paciente en lista de espera de otra, cuando el grupo lo permite). Reporting consolidado a nivel de grupo. Comparación de desempeño entre sedes propias.

### 10. Decisiones que requieren aprobación humana
Cualquier derivación de paciente entre sedes distintas. Cualquier cambio de política que afecte al conjunto del grupo.

### 11. Riesgos
Los mismos riesgos de gobernanza multi-nivel descritos en franquicia (§6), atenuados por no existir una relación contractual entre partes distintas — el margen de ajuste es enteramente interno.

### 12. KPIs
Ocupación consolidada de sillón a nivel de grupo, eficiencia de redistribución de capacidad entre sedes, consistencia de indicadores entre sedes propias.

### 13. Beneficio cuantificable
**[HIPÓTESIS — validar con clínicas piloto]** Mejora de la ocupación total del grupo al redistribuir capacidad entre sedes, frente a gestionar cada sede de forma aislada como si fuera un negocio independiente.

### 14. Argumento comercial
Una sola plataforma para gestionar tu grupo como lo que es — un solo negocio con varias puertas, no varios negocios que comparten dueño.

### 15. Ejemplo práctico
Una sede con dos semanas de lista de espera para higiene y otra sede a diez minutos con huecos libres esa misma semana: el sistema ofrece proactivamente la alternativa al paciente, siempre con su consentimiento explícito.

### 16. Ayuda contextual para mostrar en la plataforma
> "Como grupo de clínicas, decide cuánto quieres centralizar entre tus sedes — esto configurará cómo se comparte el Business DNA entre ellas."

### 17. Preguntas para la implantación
¿Las sedes comparten marca? ¿Existe ya derivación de pacientes o capacidad entre sedes? ¿Quién tiene hoy visión consolidada del negocio completo?

### 18. Diferencias entre clínica privada y franquicia
Sin relación contractual entre partes distintas: el nivel de centralización es una decisión de negocio propia del grupo, no un término contractual impuesto por un franquiciador externo. Las restricciones de marca en una franquicia son no negociables por contrato; en un grupo propio, son negociables internamente en cualquier momento por el propio propietario.

### 19. Nivel de prioridad
**Avanzado.**

### 20. Entidades y relaciones de conocimiento necesarias
`BusinessDNAProfile` compartido a nivel de grupo con *overrides* por sede, sin marcado de "no editable" (a diferencia de franquicia, aquí toda restricción es modificable por el propio propietario del grupo). Vista de datos consolidada a nivel de grupo como agregación de las vistas de cada sede.

---

## 8. Clínica con laboratorio propio

### 1. Definición
Clínica que integra verticalmente su propio laboratorio de prótesis dental, en vez de externalizar la fabricación a un tercero — habitual en clínicas de mayor tamaño o grupos con volumen suficiente para justificarlo.

### 2. Funcionamiento habitual actual
Coordinación interna estrecha entre la clínica y el laboratorio, con comunicación directa y, potencialmente, tiempos de entrega más cortos y mayor control de calidad. Añade, a cambio, una unidad de negocio adicional que gestionar — producción, materiales, capacidad del laboratorio.

### 3. Problemas frecuentes
Cuellos de botella de capacidad del laboratorio propio en picos de demanda. Falta de visibilidad clínica sobre el estado real de fabricación de una prótesis hasta que ya es tarde para reaccionar. Coordinación de pedidos y materiales.

### 4. Consecuencias económicas y operativas
Cuando funciona bien, es una ventaja competitiva real en tiempos y calidad. Cuando el laboratorio se satura, se convierte en el cuello de botella de toda la clínica, afectando directamente a la agenda clínica.

### 5. Necesidades de cada actor
Visibilidad del estado de cada pedido de laboratorio desde la propia agenda clínica. Gestión de capacidad y materiales del laboratorio. Coordinación entre el plan de tratamiento y el tiempo de fabricación necesario antes de agendar la siguiente cita del paciente.

### 6. Datos necesarios
Capacidad de producción del laboratorio, tiempos medios de fabricación por tipo de trabajo, sistema de gestión del laboratorio si ya existe alguno.

### 7. Qué puede hacer ATLAS
Dar visibilidad del estado de cada pedido de laboratorio a quien agenda la siguiente cita del paciente, evitando agendar antes de que la prótesis esté lista. Alertar de un posible cuello de botella de capacidad antes de que afecte a la agenda clínica. Coordinar pedidos y materiales recurrentes.

### 8. Qué no debe hacer ATLAS
Tomar decisiones de producción o de priorización de trabajos dentro del laboratorio — es criterio exclusivo del equipo técnico del laboratorio; el sistema informa, nunca decide en su lugar.

### 9. Automatizaciones recomendadas
Alertas de estado de pedido de laboratorio. Coordinación automática entre la fecha estimada de entrega y la agenda de la siguiente cita del paciente. Gestión de pedidos de materiales recurrentes.

### 10. Decisiones que requieren aprobación humana
Priorización de trabajos del laboratorio en caso de sobrecarga de capacidad. Cualquier comunicación de retraso al paciente.

### 11. Riesgos
**[HIPÓTESIS — validar con clínicas piloto]** Dependencia de que el laboratorio propio tenga, o adopte, un sistema de gestión integrable — si el laboratorio trabaja de forma completamente manual, la visibilidad automática queda limitada hasta que se digitalice ese proceso interno.

### 12. KPIs
Tiempo medio de entrega del laboratorio, incidencias de agenda por prótesis no lista a tiempo, ocupación de capacidad del laboratorio.

### 13. Beneficio cuantificable
**[HIPÓTESIS — validar con clínicas piloto]** Reducción de citas reprogramadas por prótesis no lista a tiempo, frente a la coordinación informal actual.

### 14. Argumento comercial
Convierte tu laboratorio propio en una ventaja de verdad, no en un punto ciego de tu agenda.

### 15. Ejemplo práctico
El sistema detecta que una prótesis programada para estar lista un día concreto llevará, según el ritmo real de producción del laboratorio, un día de retraso, y avisa con antelación suficiente para reprogramar la cita del paciente sin que este llegue a la clínica en vano.

### 16. Ayuda contextual para mostrar en la plataforma
> "Conecta el sistema de tu laboratorio propio para que tu agenda clínica sepa siempre el estado real de cada prótesis."

### 17. Preguntas para la implantación
¿Qué sistema usa hoy el laboratorio, si usa alguno? ¿Cómo se coordina hoy la agenda clínica con los tiempos reales del laboratorio?

### 18. Diferencias entre clínica privada y franquicia
En una franquicia con laboratorio propio centralizado a nivel de marca (sirviendo a varias sedes), la coordinación de capacidad ocurre a nivel de red completa, no de una sola clínica — con mayor complejidad de asignación de prioridad entre sedes que compiten por la misma capacidad de producción.

### 19. Nivel de prioridad
**Avanzado** — requiere integración con sistemas de laboratorio, de menor prioridad de producto que los modelos operativos base.

### 20. Entidades y relaciones de conocimiento necesarias
`KnowledgeDomain` de Operaciones de Laboratorio, con entidades de tipo "pedido de laboratorio" vinculadas al plan de tratamiento del paciente por identificador, nunca por contenido clínico. Integración de datos de capacidad como una fuente más dentro de Integrations Hub (referencia arquitectónica general).

---

## 9. Clínica con laboratorio externo

### 1. Definición
Modelo mayoritario del sector: la clínica externaliza la fabricación de prótesis a uno o varios laboratorios terceros.

### 2. Funcionamiento habitual actual
Coordinación por pedido — envío de impresiones o escaneados digitales, plazos de entrega pactados con el proveedor externo, y dependencia frecuente de canales de comunicación informales (llamada telefónica, mensajería) para conocer el estado de un pedido.

### 3. Problemas frecuentes
Falta de visibilidad del estado del pedido salvo que alguien llame al laboratorio para preguntar. Descoordinación entre el plazo real del laboratorio y la agenda de la siguiente cita del paciente. Gestión de varios laboratorios distintos según el tipo de trabajo.

### 4. Consecuencias económicas y operativas
El mismo riesgo que en laboratorio propio (citas mal coordinadas con el tiempo real de fabricación) pero con menos control directo, al tratarse de un proveedor externo fuera de la gestión diaria de la clínica.

### 5. Necesidades de cada actor
Visibilidad del estado de cada pedido externo. Gestión ordenada de la relación con varios proveedores de laboratorio. Coordinación de los plazos pactados con la agenda clínica.

### 6. Datos necesarios
Laboratorios externos habituales, plazos medios pactados por tipo de trabajo, canal de comunicación actual con cada proveedor.

### 7. Qué puede hacer ATLAS
Centralizar el seguimiento de pedidos a distintos laboratorios externos — por integración directa si el proveedor lo permite, o mediante seguimiento manual estructurado si no. Avisar de plazos próximos a vencer. Coordinar la agenda con el plazo pactado.

### 8. Qué no debe hacer ATLAS
Comprometer un plazo en nombre del laboratorio externo sin confirmación de este — el sistema puede hacer seguimiento y recordar, nunca puede garantizar un plazo que no controla directamente.

### 9. Automatizaciones recomendadas
Seguimiento centralizado de pedidos a múltiples laboratorios. Recordatorios de plazos próximos a vencer. Coordinación de la agenda con el plazo pactado por el proveedor.

### 10. Decisiones que requieren aprobación humana
Cambio de proveedor de laboratorio. Gestión de una incidencia de plazo incumplido frente al paciente.

### 11. Riesgos
**[HIPÓTESIS — validar con clínicas piloto]** Mayor dependencia de la disposición del laboratorio externo a compartir información de estado si no existe integración directa — parte del valor de este apartado depende de un tercero fuera del control operativo de la clínica.

### 12. KPIs
Cumplimiento de plazo por proveedor de laboratorio, incidencias de agenda derivadas de retraso externo.

### 13. Beneficio cuantificable
**[HIPÓTESIS — validar con clínicas piloto]** Reducción del tiempo dedicado por el equipo de la clínica a llamar al laboratorio para preguntar el estado de un pedido.

### 14. Argumento comercial
Deja de llamar al laboratorio para preguntar — que el sistema lo siga por ti.

### 15. Ejemplo práctico
Una clínica que trabaja con dos laboratorios externos distintos según el tipo de trabajo: el sistema centraliza el estado de ambos en un solo lugar, visible desde la ficha de agenda de cada paciente afectado.

### 16. Ayuda contextual para mostrar en la plataforma
> "Registra tus laboratorios externos habituales y sus plazos típicos — así podremos avisarte antes de que un retraso afecte a una cita."

### 17. Preguntas para la implantación
¿Cuántos laboratorios externos utilizáis? ¿Cómo os comunicáis hoy con ellos sobre el estado de un pedido?

### 18. Diferencias entre clínica privada y franquicia
En una franquicia, los laboratorios externos homologados suelen venir definidos o negociados por la marca central, con mejores condiciones gracias al volumen agregado de toda la red. En un modelo independiente, cada clínica negocia su propia relación con el laboratorio que elija.

### 19. Nivel de prioridad
**Fase 2** — más simple de implementar que el laboratorio propio, al no requerir integración con un sistema de producción interno, aunque sigue siendo de menor urgencia que los modelos operativos base.

### 20. Entidades y relaciones de conocimiento necesarias
`KnowledgeEntity` de tipo "proveedor de laboratorio" con plazos pactados como atributo estructurado. Integración opcional vía Integrations Hub cuando el proveedor lo permita; en su ausencia, seguimiento estructurado manual como fuente de datos válida pero de menor automatización.

---

## Notas de cierre para la revisión de esta plantilla

Antes de replicar este nivel de detalle en los once documentos restantes del programa, quedan pendientes de validación explícita:

1. **Todas las afirmaciones marcadas [HIPÓTESIS]** en este documento deben contrastarse con clínicas piloto reales antes de convertirse en supuestos de producto firmes.
2. **La matriz de priorización** (MVP / Fase 2 / Avanzado) es una propuesta de partida — debe revisarse con el equipo de producto y, si es posible, con señales tempranas de demanda real por modelo de clínica.
3. **El nivel de detalle de los 20 campos por modelo** es el que se replicará, sin reducir profundidad, en los documentos DKB-0001-02 a DKB-0001-12, salvo que esta revisión indique lo contrario.
