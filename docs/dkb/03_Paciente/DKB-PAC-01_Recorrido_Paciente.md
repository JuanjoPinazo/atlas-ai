# DKB-PAC-01 — Recorrido Completo del Paciente

| Campo | Valor |
|---|---|
| **Biblioteca** | Atlas Dental Knowledge Library |
| **Categoría** | 03 · Paciente |
| **ID de documento** | DKB-PAC-01 |
| **Versión** | 1.0 |
| **Responsable** | Por asignar — Equipo de Producto, Vertical Dental |
| **Fecha de última actualización** | 2026-07-09 |
| **Nivel de confianza** | Borrador — pendiente de validación con clínicas piloto |
| **Fuentes** | Conocimiento experto de consultoría en gestión y operaciones de clínicas dentales. Pendiente: entrevistas con clínicas piloto de cada modelo (ver [DKB-EMP-01](../01_Empresa/DKB-EMP-01_Modelos_Clinica.md)) |
| **Evidencia** | Sin evidencia empírica todavía — cada hipótesis marcada explícitamente (ver convención de trazabilidad en el [Índice Maestro](../00_Master_Index.md)) |
| **Relación con otros documentos** | Documento fundacional de la biblioteca — alimenta a DKB-REC-01 (Recepción), DKB-AGE-01 (Agenda), DKB-FIN-01 (Presupuestos y Financiación), DKB-AUT-01 (Automatizaciones), DKB-ROI-01 (KPIs y ROI), DKB-IA-01 (Empleados Digitales), todos pendientes. Relacionado con [DKB-EMP-01](../01_Empresa/DKB-EMP-01_Modelos_Clinica.md) (el recorrido varía según modelo de clínica) |
| **Prioridad de construcción** | 1 de 12 (ver [Índice Maestro](../00_Master_Index.md) §3) |

---

## Por qué este documento es el primero de la biblioteca

Prácticamente toda oportunidad de negocio de una clínica dental — y prácticamente todo riesgo de perderla — vive en algún punto de este recorrido. No hay ningún otro documento de la biblioteca del que se puedan derivar tantos activos de producto de forma tan directa: cada etapa de este recorrido apunta a un Empleado Digital concreto, a una automatización concreta, a un indicador de ROI concreto. Por eso se construye primero, y por eso el resto de la biblioteca lo referencia constantemente en vez de repetir su contenido.

---

## Mapa del recorrido

```
Captación
   │
   ▼
Primer contacto ────────────▶ (llamada, formulario web, mensaje, walk-in)
   │
   ▼
Primera visita
   │
   ▼
Diagnóstico  (exclusivamente clínico — el sistema nunca participa en esta decisión)
   │
   ▼
Presentación de tratamiento
   │
   ▼
Presupuesto
   │
   ▼
Financiación
   │
   ▼
Aceptación
   │
   ▼
Ejecución  (una o varias sesiones, coordinadas en agenda)
   │
   ▼
Seguimiento  (durante el tratamiento, si tiene varias fases)
   │
   ▼
Alta
   │
   ├──▶ Reseña  (si el desenlace fue positivo)
   │
   ▼
Recall  (revisión periódica, típicamente semestral)
   │
   ├──▶ vuelve al ciclo, o
   ▼
Reactivación  (si el paciente se vuelve inactivo)
   │
   ▼
Recomendación  (boca a boca, activo silencioso que atraviesa todo el recorrido)
```

**Nota de alcance**: este documento cubre las 15 etapas listadas. No repite contenido ya definido en la arquitectura general de ATLAS AI (Decision Engine, Capability Model, Company Brain) — donde aplica, se referencia por nombre.

---

## Convención de trazabilidad de este documento

Idéntica a la de toda la biblioteca (ver [Índice Maestro](../00_Master_Index.md) §2.2): **[HECHO]**, **[HIPÓTESIS — validar con clínicas piloto]**, **[RECOMENDACIÓN]**. Ninguna cifra estadística o económica de este documento es un dato real — todas están marcadas como hipótesis ilustrativas.

---

## 1. Captación

### 1. Definición
El conjunto de acciones y canales por los que un paciente potencial llega a conocer la existencia de la clínica, antes de cualquier contacto directo — marketing propio, SEO local, redes sociales, plataformas de reseñas, referidos de pacientes o de otras clínicas.

### 2. Funcionamiento habitual actual
Combinación de canales gestionados con distinto grado de sistematización: presencia en Google Business Profile, alguna campaña puntual, boca a boca, y — en clínicas especializadas — referidos de otras clínicas. Rara vez existe una medición consistente de qué canal trae efectivamente pacientes.

### 3. Problemas frecuentes
Falta de atribución clara del origen del paciente ("¿cómo nos conociste?" rara vez se registra de forma sistemática). Inversión en canales sin saber cuáles convierten realmente. Dependencia de canales informales (boca a boca) sin ningún mecanismo que los refuerce activamente.

### 4. Consecuencias económicas y operativas
Sin atribución de origen, es imposible optimizar el gasto de captación — se sigue invirtiendo en lo de siempre por costumbre, no por evidencia. El coste de adquisición real por canal queda desconocido.

### 5. Necesidades de cada actor
El propietario necesita saber qué canal funciona para decidir dónde invertir. Marketing (interno o externo) necesita datos de conversión reales, no solo de alcance. El paciente potencial necesita encontrar información clara y confiable antes de decidir llamar.

### 6. Datos necesarios
Canales de captación actualmente en uso, si existe algún registro de origen de paciente, presupuesto de marketing aproximado si lo hay.

### 7. Qué puede hacer ATLAS
Registrar de forma sistemática el origen declarado de cada nuevo contacto (ver DKB-MKT-01, pendiente). Consolidar esa atribución junto con el resultado real (¿se convirtió en cita? ¿en tratamiento aceptado?) para dar visibilidad de qué canal genera valor, no solo volumen.

### 8. Qué no debe hacer ATLAS
Tomar decisiones de inversión en marketing por su cuenta — puede informar con datos, la decisión de presupuesto es siempre humana.

### 9. Automatizaciones recomendadas
Registro estructurado del origen de cada contacto nuevo. Consolidación automática de atribución de canal hasta el resultado final (cita, presupuesto, tratamiento aceptado).

### 10. Decisiones que requieren aprobación humana
Cualquier decisión de presupuesto o cambio de canal de marketing.

### 11. Riesgos
**[HIPÓTESIS — validar con clínicas piloto]** La atribución de origen depende de que el paciente la declare con precisión en el primer contacto — un dato con margen de error inherente que debe tratarse como orientativo, no como verdad absoluta.

### 12. KPIs
Distribución de nuevos contactos por canal declarado, tasa de conversión de contacto a cita por canal.

### 13. Beneficio cuantificable
**[HIPÓTESIS — validar con clínicas piloto]** Redirección de presupuesto de marketing hacia el canal de mejor conversión real, en vez de mantenerlo repartido por costumbre.

### 14. Argumento comercial
Sabe por fin qué canal de captación te trae pacientes de verdad, no solo clics.

### 15. Ejemplo práctico
Una clínica que invierte en dos canales de marketing distintos descubre, tras unos meses de atribución sistemática, que uno de ellos trae el doble de contactos pero la mitad de conversión a tratamiento aceptado que el otro — información que antes no tenía forma de ver consolidada.

### 16. Ayuda contextual para mostrar en la plataforma
> "Cada vez que preguntamos '¿cómo nos conociste?', ese dato queda guardado y conectado al resultado final — así sabrás qué canal funciona de verdad."

### 17. Preguntas para la implantación
¿Qué canales de captación usáis hoy? ¿Se pregunta sistemáticamente el origen a cada nuevo contacto? ¿Existe presupuesto de marketing gestionado activamente?

### 18. Diferencias entre clínica privada y franquicia
En una franquicia, gran parte de la captación suele estar centralizada a nivel de marca (campañas nacionales, SEO de marca); la atribución de origen es más relevante para la sede a nivel de captación local complementaria. En una clínica privada, toda la captación es responsabilidad directa de la propia clínica.

### 19. Nivel de prioridad
**Fase 2** — requiere que existan ya canales de captación medianamente activos para aportar valor; menor urgencia que las etapas de conversión directa del recorrido.

### 20. Entidades y relaciones de conocimiento necesarias
`KnowledgeEntity` de tipo "canal de captación", con relación a cada `conversation` (ADR-0006) por su origen declarado. Métrica agregada de conversión por canal, consumida por DKB-ROI-01.

---

## 2. Primer contacto

### 1. Definición
El primer punto de interacción directa entre el paciente potencial y la clínica: una llamada telefónica, un formulario web, un mensaje por WhatsApp o redes, o una visita sin cita previa.

### 2. Funcionamiento habitual actual
Gestionado, en la mayoría de clínicas, por recepción — con volumen concentrado en franjas horarias concretas, y con una proporción notable de llamadas perdidas en picos de actividad o fuera de horario.

### 3. Problemas frecuentes
Llamadas perdidas sin retorno posterior. Tiempo de respuesta lento a mensajes o formularios web. Falta de guion consistente entre distintas personas de recepción, generando experiencias desiguales. Preguntas frecuentes repetidas que consumen tiempo de recepción sin necesidad.

### 4. Consecuencias económicas y operativas
Cada primer contacto perdido o mal gestionado es, potencialmente, un paciente que se va a la competencia — es, con diferencia, el punto de mayor volumen y mayor fuga silenciosa de todo el recorrido.

### 5. Necesidades de cada actor
El paciente potencial necesita una respuesta rápida y clara, en el canal que prefiera. Recepción necesita apoyo en volumen y en preguntas repetitivas para poder dedicar tiempo a lo que realmente requiere trato humano.

### 6. Datos necesarios
Canales de contacto disponibles hoy, volumen aproximado de contactos semanales, franjas horarias de mayor carga, preguntas más frecuentes recibidas.

### 7. Qué puede hacer ATLAS
Responder de inmediato en cualquier canal, a cualquier hora, con preguntas frecuentes desde el conocimiento de la clínica (catálogo de tratamientos, horarios, ubicación, precios orientativos). Aplicar el protocolo de triage de urgencia en cada contacto, con prioridad sobre cualquier otra intención del mensaje. Gestionar directamente el agendamiento de la primera cita cuando el paciente ya está decidido.

### 8. Qué no debe hacer ATLAS
Dar información clínica personalizada a un paciente que aún no ha sido visto — solo información general del catálogo de la clínica. Ocultar en ningún momento que puede estar hablando con un sistema asistido por IA.

### 9. Automatizaciones recomendadas
Recepción digital multicanal (llamada, WhatsApp, formulario web), respuestas a preguntas frecuentes, agendamiento directo de primera cita, triage de urgencia como prioridad absoluta sobre cualquier otra intención detectada.

### 10. Decisiones que requieren aprobación humana
Ninguna decisión clínica, por definición — el sistema informa y agenda, nunca diagnostica ni aconseja de forma personalizada.

### 11. Riesgos
Un primer contacto mal resuelto (tono equivocado, respuesta genérica quezz no responde a lo preguntado) puede tener más impacto reputacional que en cualquier otra etapa, porque es la primera impresión completa de la clínica.

### 12. KPIs
Tiempo medio de primera respuesta por canal, proporción de contactos gestionados sin espera, tasa de conversión de primer contacto a primera cita agendada.

### 13. Beneficio cuantificable
**[HIPÓTESIS — validar con clínicas piloto]** Recuperación de una parte significativa de los contactos que hoy se pierden en picos de volumen u horario no cubierto, dado que en este modelo el coste marginal de atender un contacto adicional es bajo.

### 14. Argumento comercial
Ningún paciente potencial vuelve a esperar, ni se pierde por estar fuera de horario.

### 15. Ejemplo práctico
Un paciente escribe por WhatsApp un sábado por la tarde preguntando precio orientativo de un tratamiento y disponibilidad — recibe respuesta inmediata con información del catálogo y una propuesta de horario para la semana siguiente, sin esperar al lunes.

### 16. Ayuda contextual para mostrar en la plataforma
> "Configura los canales por los que tus pacientes pueden contactarte — tu Recepción Digital responderá en todos ellos con el mismo criterio."

### 17. Preguntas para la implantación
¿Qué canales de contacto ofrecéis hoy? ¿Cuál es el volumen aproximado semanal? ¿Existe ya un guion o criterio compartido entre quienes atienden?

### 18. Diferencias entre clínica privada y franquicia
En una franquicia, el guion y el tono del primer contacto suelen venir parcialmente definidos por la marca central, para garantizar consistencia entre sedes; en una clínica privada, el guion se construye desde cero a partir del estilo propio de la clínica.

### 19. Nivel de prioridad
**MVP** — el punto de mayor volumen y mayor visibilidad de valor inmediato de todo el recorrido.

### 20. Entidades y relaciones de conocimiento necesarias
`KnowledgeDomain` de "Recepción y Políticas de Cita" con preguntas frecuentes y precios orientativos. Protocolo de triage de urgencia como `KnowledgeUnit` de tipo protocolo. `conversation` (ADR-0006) por cada contacto, con `run` gatillado por el Empleado Digital de Recepción.

---

## 3. Primera visita

### 1. Definición
La primera vez que el paciente acude físicamente a la clínica: recepción, cumplimentación de historia clínica, exploración inicial.

### 2. Funcionamiento habitual actual
Recogida de datos personales y de historia clínica en el propio momento de la visita, a menudo en papel o en formularios digitales rellenados en la sala de espera — consumiendo tiempo de sillón que podría dedicarse directamente a la exploración.

### 3. Problemas frecuentes
Tiempo de sillón perdido en tareas administrativas que podrían resolverse antes. Historia clínica incompleta si el paciente rellena el formulario con prisa en la sala de espera. Primera impresión de desorganización si la recepción física no está bien coordinada con la agenda.

### 4. Consecuencias económicas y operativas
Cada minuto de sillón dedicado a papeleo es un minuto no dedicado a exploración clínica — en un modelo de negocio donde el sillón es el recurso más caro, este tiempo tiene un coste de oportunidad directo.

### 5. Necesidades de cada actor
El paciente necesita sentirse bien recibido y no perder tiempo en trámites. El equipo clínico necesita la información de historia clínica disponible y completa antes de empezar la exploración.

### 6. Datos necesarios
Proceso actual de recogida de historia clínica, tiempo medio dedicado a trámites en la primera visita, sistema de gestión clínica en uso.

### 7. Qué puede hacer ATLAS
Enviar el formulario de historia clínica antes de la cita para que el paciente lo complete con calma en casa — el contenido va directamente al sistema clínico de la clínica, nunca al Company Brain compartido de conocimiento general (los datos de un paciente concreto no son conocimiento organizativo). Enviar recordatorios de documentación pendiente. Gestionar el check-in digital previo a la llegada.

### 8. Qué no debe hacer ATLAS
Sustituir la exploración clínica ni la anamnesis realizada por el propio profesional — solo prepara el terreno administrativo para que esa exploración empiece antes y mejor informada.

### 9. Automatizaciones recomendadas
Envío anticipado de formularios de historia clínica, recordatorio de documentación pendiente, check-in digital previo a la llegada, aviso al equipo clínico de la llegada del paciente.

### 10. Decisiones que requieren aprobación humana
Ninguna — esta etapa es, en su mayoría, logística y administrativa; la exploración clínica en sí es, por definición, decisión exclusiva del profesional.

### 11. Riesgos
**[HIPÓTESIS — validar con clínicas piloto]** Un formulario de historia clínica enviado con demasiada antelación puede no completarse a tiempo; el momento óptimo de envío probablemente varía según el perfil de paciente y debe calibrarse con datos reales.

### 12. KPIs
Proporción de formularios de historia clínica completados antes de la cita, tiempo de sillón dedicado a trámites administrativos en primera visita.

### 13. Beneficio cuantificable
**[HIPÓTESIS — validar con clínicas piloto]** Reducción del tiempo de sillón dedicado a papeleo en primera visita, redirigido a exploración clínica.

### 14. Argumento comercial
Que la primera visita empiece por la exploración, no por el papeleo.

### 15. Ejemplo práctico
Un paciente recibe, dos días antes de su primera cita, un enlace para completar su historia clínica desde el móvil — llega a la clínica con el trámite ya resuelto, y el equipo clínico empieza la exploración con la información ya disponible.

### 16. Ayuda contextual para mostrar en la plataforma
> "Envía el formulario de historia clínica antes de la primera visita — así ganas tiempo de sillón desde el primer día."

### 17. Preguntas para la implantación
¿Cómo se recoge hoy la historia clínica de un paciente nuevo? ¿Cuánto tiempo de sillón se dedica habitualmente a trámites en la primera visita?

### 18. Diferencias entre clínica privada y franquicia
El formato del formulario de historia clínica puede venir estandarizado por la marca en una franquicia (mismo formulario en todas las sedes); en una clínica privada, se define desde cero según el criterio de la propia clínica.

### 19. Nivel de prioridad
**Fase 2** — de menor urgencia que las etapas de conversión de mayor volumen, aunque de valor operativo real.

### 20. Entidades y relaciones de conocimiento necesarias
Formulario de historia clínica como plantilla estructurada (no como `KnowledgeUnit` de contenido genérico, sino como esquema de captura por paciente, integrado con el sistema clínico vía Integrations Hub — nunca almacenado como conocimiento compartido, ver §5 de PVD-0005).

---

## 4. Diagnóstico

### 1. Definición
La exploración clínica, valoración de radiografías u otras pruebas, y determinación de qué necesita el paciente — un acto exclusivamente clínico, realizado por el dentista.

### 2. Funcionamiento habitual actual
Exploración física, revisión de historia clínica, y en muchos casos apoyo de pruebas radiológicas o escáner intraoral, todo bajo el criterio exclusivo del profesional.

### 3. Problemas frecuentes
El dentista puede no tener, en el momento de la exploración, visibilidad rápida del historial completo de visitas o tratamientos previos del paciente en la clínica si el sistema de gestión no lo presenta de forma clara.

### 4. Consecuencias económicas y operativas
Un diagnóstico bien informado, con contexto histórico completo del paciente disponible al instante, reduce el riesgo de decisiones clínicas tomadas sin toda la información relevante — pero esto es responsabilidad del sistema clínico de gestión, no de ATLAS AI.

### 5. Necesidades de cada actor
El dentista necesita el historial clínico relevante del paciente disponible de forma clara e inmediata, sin tener que buscarlo. El paciente necesita sentir que su historial y su tiempo previo con la clínica son tenidos en cuenta.

### 6. Datos necesarios
Sistema de gestión clínica en uso y su capacidad de presentar historial de forma consolidada.

### 7. Qué puede hacer ATLAS
Únicamente preparar contexto administrativo y de relación (visitas previas, tratamientos ya realizados en la clínica, presupuestos anteriores) para que el profesional lo tenga disponible — nunca sugerir ni influir en el diagnóstico en sí.

### 8. Qué no debe hacer ATLAS
Diagnosticar, sugerir un tratamiento, ni interpretar una prueba clínica bajo ninguna circunstancia. Esta es la línea roja más estricta de todo el vertical dental (ver DKB-EMP-01 y PVD-0005 §6).

### 9. Automatizaciones recomendadas
Preparación de un resumen administrativo y de relación del paciente (no clínico) disponible antes de la consulta.

### 10. Decisiones que requieren aprobación humana
La totalidad del diagnóstico, sin excepción — no es una decisión que se apruebe o se delegue, es una decisión que nunca entra en el ámbito de un Empleado Digital.

### 11. Riesgos
Ninguno atribuible a ATLAS AI en esta etapa, precisamente porque el sistema no participa en el acto clínico — el único riesgo real es de diseño de producto: que alguna funcionalidad futura, por conveniencia, difumine esta frontera. Se marca aquí como línea roja explícita para prevenirlo.

### 12. KPIs
No aplican KPIs de producto a esta etapa — es un acto clínico, no un proceso operativo medible por ATLAS AI.

### 13. Beneficio cuantificable
No aplica directamente — el beneficio de esta etapa es indirecto, vía el tiempo y contexto ya preparados en las etapas anteriores (primera visita, primer contacto).

### 14. Argumento comercial
Nunca sustituimos tu criterio clínico — lo que hacemos es asegurarnos de que llegues a él con toda la información de relación ya preparada.

### 15. Ejemplo práctico
El dentista abre la ficha de un paciente y ve, sin tener que buscarlo, que hace dos años se le presentó un presupuesto de ortodoncia que nunca se aceptó — información de relación útil para la conversación, nunca una sugerencia clínica.

### 16. Ayuda contextual para mostrar en la plataforma
> "ATLAS nunca participa en el diagnóstico. Solo prepara el contexto de relación con el paciente para que llegues informado a la consulta."

### 17. Preguntas para la implantación
¿Qué información de relación con el paciente sería útil tener visible antes de la consulta, sin que sea información clínica?

### 18. Diferencias entre clínica privada y franquicia
No hay diferencia relevante — el diagnóstico es siempre y en cualquier modelo una decisión exclusivamente clínica del profesional que atiende, sin excepción por tipo de clínica.

### 19. Nivel de prioridad
**MVP** — como apoyo puramente informativo y administrativo (nunca clínico), es simple de construir y refuerza la confianza en los límites del sistema desde el primer día.

### 20. Entidades y relaciones de conocimiento necesarias
Ninguna entidad de conocimiento clínico. Vista de resumen de relación (visitas, presupuestos, tratamientos previos en la clínica) generada desde datos administrativos ya existentes, nunca desde el Company Brain compartido de conocimiento general.

---

## 5. Presentación de tratamiento

### 1. Definición
El momento en que el dentista comunica al paciente el diagnóstico y el plan de tratamiento propuesto, antes de traducirlo en un presupuesto formal.

### 2. Funcionamiento habitual actual
Explicación verbal del profesional, con distinto grado de apoyo visual (radiografías, fotos intraorales, a veces material educativo) según la clínica. La claridad de esta explicación condiciona en gran medida si el paciente acepta después el presupuesto.

### 3. Problemas frecuentes
Terminología clínica que el paciente no entiende bien y no siempre pregunta. Falta de material de apoyo visual o escrito que el paciente pueda revisar después, en casa, con calma. El paciente sale de la consulta sin tener claro qué implica realmente el tratamiento propuesto (duración, sesiones, cuidados).

### 4. Consecuencias económicas y operativas
Una presentación de tratamiento poco clara reduce directamente la probabilidad de aceptación del presupuesto posterior — es, en muchos casos, la causa real de un "no" que en realidad es un "no lo entendí bien".

### 5. Necesidades de cada actor
El paciente necesita entender, en términos claros, qué se le propone y por qué. El dentista necesita poder concentrarse en la explicación clínica sin tener que generar también material de apoyo desde cero cada vez.

### 6. Datos necesarios
Catálogo de tratamientos de la clínica con sus explicaciones estándar, material educativo existente (si lo hay).

### 7. Qué puede hacer ATLAS
Explicar, en términos generales del catálogo de la clínica, en qué consiste un tratamiento, su duración típica, número de sesiones y cuidados posteriores — siempre en términos generales, nunca aplicado al caso concreto de un paciente salvo que el dentista lo haya indicado explícitamente primero. Enviar al paciente, después de la consulta, un resumen escrito de lo explicado verbalmente, para que lo revise con calma.

### 8. Qué no debe hacer ATLAS
Sugerir qué tratamiento necesita un paciente concreto — solo puede explicar lo que el dentista ya ha propuesto, nunca proponerlo por su cuenta.

### 9. Automatizaciones recomendadas
Envío de resumen escrito post-consulta con la explicación del tratamiento propuesto por el dentista. Material educativo de apoyo desde el catálogo de la clínica, adaptado al tratamiento concreto ya indicado.

### 10. Decisiones que requieren aprobación humana
El contenido clínico de la explicación siempre lo determina el dentista — el sistema solo lo estructura y lo comunica de forma clara después.

### 11. Riesgos
Si el resumen escrito generado no refleja con precisión lo que el dentista explicó verbalmente, puede generar confusión en vez de claridad — necesita revisión del profesional antes del primer envío en cada caso hasta que el proceso esté validado.

### 12. KPIs
Proporción de pacientes que reciben resumen escrito tras la consulta, tasa de aceptación de presupuesto tras presentación con material de apoyo frente a sin él.

### 13. Beneficio cuantificable
**[HIPÓTESIS — validar con clínicas piloto]** Mejora en la tasa de aceptación de presupuestos cuando el paciente recibe un resumen claro y revisable en casa, frente a depender solo de lo recordado de la consulta verbal.

### 14. Argumento comercial
Que tu explicación en consulta no se pierda cuando el paciente sale por la puerta.

### 15. Ejemplo práctico
Tras explicar un plan de tratamiento de rehabilitación en varias fases, el paciente recibe esa misma tarde un resumen escrito claro con las fases, duración estimada y cuidados — algo a lo que puede volver antes de decidir sobre el presupuesto.

### 16. Ayuda contextual para mostrar en la plataforma
> "Después de cada consulta con plan de tratamiento propuesto, podemos enviar un resumen claro al paciente — revisa el contenido antes del primer envío."

### 17. Preguntas para la implantación
¿Existe hoy algún material de apoyo o resumen que se entregue al paciente tras la presentación de un tratamiento? ¿Qué parte de la explicación se pierde con más frecuencia?

### 18. Diferencias entre clínica privada y franquicia
En una franquicia, el material educativo y las explicaciones estándar de cada tratamiento suelen venir predefinidos por la marca central, con mayor consistencia entre sedes; en una clínica privada, se construyen desde el criterio propio de cada profesional.

### 19. Nivel de prioridad
**Fase 2** — de alto valor pero de mayor sensibilidad clínica que otras etapas, requiere validación cuidadosa del contenido generado antes de automatizarse con amplitud.

### 20. Entidades y relaciones de conocimiento necesarias
`KnowledgeDomain` de "Tratamientos y Protocolos" con explicaciones estándar por tratamiento del catálogo. Plantilla de resumen post-consulta vinculada al plan de tratamiento indicado por el dentista, nunca generada sin esa indicación previa.

---

## 6. Presupuesto

### 1. Definición
La traducción del plan de tratamiento en una propuesta económica desglosada, con fases, plazos y condiciones de pago, presentada formalmente al paciente.

### 2. Funcionamiento habitual actual
Elaborado por el coordinador de tratamientos (o por el propio dentista en clínicas más pequeñas) a partir del plan clínico, presentado al paciente en persona o enviado por escrito, con seguimiento posterior de calidad muy variable entre clínicas.

### 3. Problemas frecuentes
Es, con diferencia, el punto de mayor fuga de ingresos identificado en el vertical: presupuestos presentados que nunca reciben respuesta, sin ningún seguimiento sistemático posterior. Presupuestos poco claros en su desglose. Falta de recordatorio de caducidad de las condiciones ofrecidas.

### 4. Consecuencias económicas y operativas
Cada presupuesto sin seguimiento es, potencialmente, ingreso ya "ganado" en la conversación clínica que se pierde por simple falta de continuidad administrativa — no por decisión real del paciente.

### 5. Necesidades de cada actor
El paciente necesita un desglose claro y tiempo razonable para decidir, sin sentirse presionado ni tampoco olvidado. El coordinador de tratamientos necesita liberar tiempo del seguimiento manual repetitivo para dedicarlo a las conversaciones que sí requieren su criterio.

### 6. Datos necesarios
Plantilla de presupuesto actual, tarifario, condiciones de fases de pago habituales, tiempo medio que tarda un paciente en decidir.

### 7. Qué puede hacer ATLAS
Redactar el presupuesto desglosado por fases a partir del plan de tratamiento estructurado que introduce el dentista. Explicar las opciones de pago disponibles. Hacer seguimiento activo y sistemático de presupuestos pendientes de respuesta — el mayor valor añadido de esta etapa.

### 8. Qué no debe hacer ATLAS
Enviar el primer presupuesto a un paciente concreto sin aprobación humana inicial, hasta que la clínica decida explícitamente relajar ese control. Modificar precios o condiciones sin autorización.

### 9. Automatizaciones recomendadas
Generación de presupuesto desglosado desde el plan estructurado del dentista. Seguimiento activo de presupuestos pendientes con recordatorios espaciados. Aviso de proximidad de caducidad de condiciones ofrecidas.

### 10. Decisiones que requieren aprobación humana
El primer envío de cualquier presupuesto a un paciente concreto. Cualquier modificación de condiciones económicas fuera de lo ya predefinido.

### 11. Riesgos
Un seguimiento demasiado insistente puede percibirse como presión comercial no deseada — la cadencia y el tono del seguimiento deben calibrarse con cuidado (parte del Business DNA de la clínica), nunca por defecto agresivos.

### 12. KPIs
Tasa de cierre de presupuestos, tiempo medio hasta la decisión del paciente, proporción de presupuestos con seguimiento activo frente a sin seguimiento.

### 13. Beneficio cuantificable
**[HIPÓTESIS — validar con clínicas piloto]** Incremento de la tasa de cierre de presupuestos gracias al seguimiento sistemático, frente al abandono habitual sin seguimiento — este es, de las 15 etapas de este documento, el candidato más fuerte a mayor beneficio cuantificable directo (ver DKB-ROI-01, pendiente).

### 14. Argumento comercial
Que ningún presupuesto se pierda por falta de seguimiento, nunca más.

### 15. Ejemplo práctico
Un presupuesto de implantología queda sin respuesta durante dos semanas. El sistema hace seguimiento con el tono habitual de la clínica, resuelve una duda sobre financiación que el paciente tenía pendiente, y el presupuesto se cierra — sin que nadie del equipo hubiera tenido tiempo de hacer ese seguimiento manualmente.

### 16. Ayuda contextual para mostrar en la plataforma
> "El primer envío de cualquier presupuesto pasa por tu revisión. El seguimiento posterior puede automatizarse en cuanto lo decidas."

### 17. Preguntas para la implantación
¿Existe hoy seguimiento sistemático de presupuestos pendientes? ¿Cuánto tiempo suele tardar un paciente en decidir? ¿Qué tono de seguimiento es aceptable para la clínica?

### 18. Diferencias entre clínica privada y franquicia
El tarifario y las condiciones de financiación pueden venir parcialmente centralizados por la marca en una franquicia; el criterio de seguimiento (cadencia, tono) puede seguir siendo local incluso en ese caso.

### 19. Nivel de prioridad
**MVP** — el mayor punto de fuga de ingresos identificado del vertical.

### 20. Entidades y relaciones de conocimiento necesarias
`KnowledgeDomain` de "Precios y Presupuestos" con tarifario y plantillas de fases de pago. `Policy` de aprobación obligatoria en primer envío (`APPROVAL_REQUIRED`, arquitectura general de Decision Engine). Evento de seguimiento vinculado al presupuesto para trazabilidad de ROI (DKB-ROI-01).

---

## 7. Financiación

### 1. Definición
Las opciones de pago aplazado disponibles para el paciente, ya sea mediante cuotas propias de la clínica o mediante entidades de crédito al consumo externas.

### 2. Funcionamiento habitual actual
Presentado como parte del presupuesto o inmediatamente después, con distinto grado de claridad según la clínica; la solicitud de financiación externa se gestiona directamente con la entidad de crédito, fuera del sistema de la clínica.

### 3. Problemas frecuentes
Falta de claridad sobre qué opciones existen realmente. Proceso de solicitud a entidad externa percibido como lento o confuso por el paciente. Ausencia de seguimiento de qué pacientes iniciaron una solicitud de financiación pero no la completaron.

### 4. Consecuencias económicas y operativas
La financiación es, para tratamientos de alto valor, a menudo la diferencia entre aceptar o rechazar un presupuesto — una gestión poco clara de esta etapa puede perder tratamientos que el paciente sí quería, solo por fricción en el proceso de pago.

### 5. Necesidades de cada actor
El paciente necesita entender con claridad sus opciones y plazos reales. La clínica necesita que el proceso de financiación no se convierta en un cuello de botella entre presupuesto aceptado y tratamiento iniciado.

### 6. Datos necesarios
Opciones de financiación propia y externa disponibles, condiciones generales de cada una, entidades colaboradoras.

### 7. Qué puede hacer ATLAS
Presentar con claridad las opciones de financiación disponibles y sus condiciones generales, desde el conocimiento ya validado de la clínica. Orientar sobre criterios de elegibilidad informativos generales.

### 8. Qué no debe hacer ATLAS
Simular, prometer o gestionar la aprobación de una solicitud de crédito — eso ocurre siempre en el sistema de la entidad financiera externa, fuera del alcance de cualquier Empleado Digital. Esta es una línea roja explícita del vertical (ver DKB-EMP-01 y PVD-0005 §12).

### 9. Automatizaciones recomendadas
Presentación estructurada de opciones de financiación disponibles. Recordatorio de solicitud de financiación iniciada pero no completada, con el consentimiento del paciente.

### 10. Decisiones que requieren aprobación humana
Cualquier caso en el que el paciente tenga dudas sobre su situación financiera concreta — se deriva siempre a trato humano, nunca se improvisa una respuesta.

### 11. Riesgos
Cruzar datos de salud (el tratamiento) con datos financieros del paciente es la combinación de información más sensible de todo el recorrido — tratada con la máxima cautela de sensibilidad por defecto en el Business DNA de la clínica.

### 12. KPIs
Proporción de presupuestos aceptados que usan financiación, tiempo medio entre presupuesto aceptado e inicio de tratamiento cuando media una solicitud de financiación.

### 13. Beneficio cuantificable
**[HIPÓTESIS — validar con clínicas piloto]** Reducción de tratamientos que se pierden por fricción o confusión en el proceso de financiación, no por rechazo real del tratamiento en sí.

### 14. Argumento comercial
Que la financiación sea un puente hacia el tratamiento, no una barrera de confusión.

### 15. Ejemplo práctico
Un paciente que aceptó un presupuesto de ortodoncia pero no ha completado su solicitud de financiación externa recibe un recordatorio claro con el enlace y los pasos pendientes, evitando que el proceso se enfríe por simple olvido.

### 16. Ayuda contextual para mostrar en la plataforma
> "Explica las opciones de financiación con claridad — nunca prometas ni gestiones la aprobación de una solicitud de crédito, eso corresponde siempre a la entidad financiera."

### 17. Preguntas para la implantación
¿Qué opciones de financiación propia y externa ofrecéis? ¿Existe seguimiento hoy de solicitudes de financiación iniciadas y no completadas?

### 18. Diferencias entre clínica privada y franquicia
Las entidades de financiación colaboradoras suelen venir negociadas centralmente en una franquicia, con mejores condiciones por volumen agregado de toda la red; en una clínica privada, la relación con la entidad de crédito se negocia de forma individual.

### 19. Nivel de prioridad
**Fase 2** — depende de la integración con entidades externas, de mayor complejidad que el seguimiento de presupuesto en sí.

### 20. Entidades y relaciones de conocimiento necesarias
`KnowledgeDomain` de "Financiación" con condiciones generales por entidad colaboradora. `DNARedLine` explícita que impide cualquier simulación o promesa de aprobación de crédito.

---

## 8. Aceptación

### 1. Definición
El momento en que el paciente confirma formalmente su decisión de proceder con el tratamiento propuesto, típicamente formalizado con la firma de un consentimiento informado.

### 2. Funcionamiento habitual actual
Confirmación verbal o por escrito, seguida de la firma de consentimiento informado y la programación de las primeras sesiones del tratamiento.

### 3. Problemas frecuentes
Demora entre la aceptación verbal y la formalización efectiva (firma de consentimiento, primera cita agendada), durante la cual el paciente puede enfriarse o cambiar de opinión.

### 4. Consecuencias económicas y operativas
Cuanto mayor la demora entre aceptación y formalización, mayor el riesgo de pérdida del tratamiento ya aceptado en principio.

### 5. Necesidades de cada actor
El paciente necesita que el paso de "acepto" a "ya está agendado" sea rápido y sin fricción. La clínica necesita asegurar la formalización del consentimiento informado antes de iniciar cualquier sesión clínica.

### 6. Datos necesarios
Proceso actual de formalización tras la aceptación, tiempo medio entre aceptación verbal y primera cita agendada.

### 7. Qué puede hacer ATLAS
Agilizar el envío y la firma digital del consentimiento informado inmediatamente tras la aceptación. Agendar la primera sesión del tratamiento en el mismo contacto en que se confirma la aceptación, sin demoras administrativas intermedias.

### 8. Qué no debe hacer ATLAS
Interpretar una respuesta ambigua del paciente como aceptación formal — solo procede cuando la confirmación es explícita e inequívoca.

### 9. Automatizaciones recomendadas
Envío inmediato de consentimiento informado tras aceptación verbal o escrita. Agendamiento directo de primera sesión en el mismo momento de la aceptación.

### 10. Decisiones que requieren aprobación humana
Ninguna decisión clínica; el propio contenido del consentimiento informado es siempre responsabilidad y redacción del equipo clínico, el sistema solo agiliza su entrega y firma.

### 11. Riesgos
**[HIPÓTESIS — validar con clínicas piloto]** Una aceptación gestionada de forma demasiado automática, sin ningún contacto humano de confirmación en tratamientos de alto valor, podría sentirse fría — a calibrar según el modelo de clínica (ver diferencia con clínica premium en DKB-EMP-01 §3).

### 12. KPIs
Tiempo medio entre aceptación y formalización completa (consentimiento firmado + primera cita agendada).

### 13. Beneficio cuantificable
**[HIPÓTESIS — validar con clínicas piloto]** Reducción de "aceptaciones fantasma" — pacientes que dijeron que sí pero nunca llegaron a formalizar por demora administrativa.

### 14. Argumento comercial
Que decir que sí y empezar el tratamiento sea, prácticamente, el mismo momento.

### 15. Ejemplo práctico
Un paciente confirma por teléfono que acepta el presupuesto — en la misma llamada recibe el enlace de firma digital del consentimiento y una propuesta de fecha para la primera sesión, sin tener que esperar a un contacto posterior.

### 16. Ayuda contextual para mostrar en la plataforma
> "En cuanto un paciente confirma, agiliza el consentimiento y la primera cita en el mismo momento — cuanto menor la demora, menor el riesgo de pérdida."

### 17. Preguntas para la implantación
¿Cuánto tiempo pasa hoy entre que un paciente acepta y empieza realmente el tratamiento? ¿Se pierde algún paciente en ese intervalo?

### 18. Diferencias entre clínica privada y franquicia
El formato del consentimiento informado puede venir estandarizado por la marca en una franquicia, con el mismo documento legal en todas las sedes.

### 19. Nivel de prioridad
**MVP** — proceso simple de automatizar, con impacto directo en cerrar el ciclo de conversión ya ganado.

### 20. Entidades y relaciones de conocimiento necesarias
Plantilla de consentimiento informado vinculada al tipo de tratamiento aceptado. Evento de aceptación como disparador directo de una acción de agenda (ver DKB-AGE-01, pendiente).

---

## 9. Ejecución

### 1. Definición
El desarrollo real del tratamiento, que puede implicar una única sesión o varias sesiones coordinadas a lo largo de semanas o meses, en función del tipo de tratamiento.

### 2. Funcionamiento habitual actual
Sesiones agendadas de forma más o menos coordinada con el ritmo clínico necesario (tiempos de cicatrización, fases de laboratorio en prótesis o implantes), gestionadas por el propio equipo clínico y de agenda.

### 3. Problemas frecuentes
Coordinación de agenda compleja cuando el tratamiento depende de un tiempo de laboratorio (ver DKB-EMP-01 §8-9) o de un tiempo de cicatrización clínico. Paciente que no entiende bien por qué debe esperar entre sesiones. Riesgo de abandono a mitad de un tratamiento largo si no hay seguimiento activo entre sesiones.

### 4. Consecuencias económicas y operativas
Un tratamiento abandonado a mitad de camino es una pérdida de ingresos ya en curso, además de un riesgo para la salud bucal del paciente y para la reputación de la clínica si el abandono se percibe como responsabilidad de la clínica.

### 5. Necesidades de cada actor
El paciente necesita entender el porqué de cada fase y del tiempo entre sesiones. El equipo clínico necesita que la agenda respete los tiempos clínicos reales del tratamiento, no solo la disponibilidad de sillón.

### 6. Datos necesarios
Duración típica y número de sesiones por tipo de tratamiento, tiempos de espera clínicos habituales (cicatrización, laboratorio).

### 7. Qué puede hacer ATLAS
Coordinar el calendario completo de sesiones de un tratamiento multi-fase desde su aceptación, explicando al paciente el porqué de cada intervalo. Hacer seguimiento activo entre sesiones para reducir el riesgo de abandono.

### 8. Qué no debe hacer ATLAS
Modificar el plan de sesiones o los tiempos clínicos definidos por el profesional — solo coordina la agenda dentro de los márgenes ya indicados clínicamente.

### 9. Automatizaciones recomendadas
Calendario completo de sesiones generado al aceptar el tratamiento. Recordatorios y seguimiento activo entre sesiones de tratamientos largos. Coordinación con tiempos de laboratorio cuando aplica (ver DKB-EMP-01 §8-9).

### 10. Decisiones que requieren aprobación humana
Cualquier reprogramación que afecte a los tiempos clínicos mínimos necesarios entre sesiones.

### 11. Riesgos
La coordinación de un tratamiento multi-fase es, de las 15 etapas de este documento, la de mayor dependencia de otros sistemas (agenda, laboratorio) — su automatización efectiva depende de la madurez de esos otros documentos de la biblioteca (DKB-AGE-01, DKB-OPE-01, ambos pendientes).

### 12. KPIs
Tasa de abandono de tratamientos multi-fase, tiempo medio entre sesiones frente al tiempo clínico óptimo indicado.

### 13. Beneficio cuantificable
**[HIPÓTESIS — validar con clínicas piloto]** Reducción de la tasa de abandono de tratamientos largos gracias al seguimiento activo entre sesiones.

### 14. Argumento comercial
Que ningún tratamiento se quede a medias por falta de seguimiento entre sesiones.

### 15. Ejemplo práctico
Un paciente en tratamiento de implantología con una fase de espera de varios meses entre la cirugía y la colocación de la prótesis recibe seguimiento periódico durante ese intervalo, en vez de desaparecer del radar de la clínica hasta la siguiente cita agendada.

### 16. Ayuda contextual para mostrar en la plataforma
> "Los tratamientos con varias fases pueden coordinarse de principio a fin desde el momento de la aceptación, incluyendo el seguimiento entre sesiones."

### 17. Preguntas para la implantación
¿Qué tratamientos de la clínica requieren varias sesiones con tiempos de espera intermedios? ¿Existe hoy seguimiento activo durante esos intervalos?

### 18. Diferencias entre clínica privada y franquicia
En un grupo o franquicia con laboratorio propio centralizado, la coordinación de fases dependientes de laboratorio ocurre a nivel de red, con mayor complejidad de asignación de prioridad entre sedes (ver DKB-EMP-01 §8).

### 19. Nivel de prioridad
**Avanzado** — requiere que Agenda y Operaciones (DKB-AGE-01, DKB-OPE-01) estén ya maduros para coordinar de forma fiable.

### 20. Entidades y relaciones de conocimiento necesarias
`KnowledgeRelation` de tipo "fase de" entre sesiones de un mismo tratamiento. Integración con estado de pedido de laboratorio cuando aplica (ver DKB-EMP-01 §8-9). Calendario de tratamiento como entidad propia, distinta de una cita individual.

---

## 10. Seguimiento

### 1. Definición
El contacto y monitorización activa del paciente durante el curso de un tratamiento, entre sesiones o tras una intervención concreta, para verificar evolución y resolver dudas.

### 2. Funcionamiento habitual actual
Habitualmente reactivo — el paciente contacta si tiene una duda o molestia, en vez de que la clínica contacte proactivamente para verificar cómo va la evolución.

### 3. Problemas frecuentes
Falta de seguimiento proactivo tras una intervención, dejando al paciente solo con cualquier duda o molestia postoperatoria. Dudas menores que, sin resolverse pronto, generan ansiedad evitable en el paciente.

### 4. Consecuencias económicas y operativas
Un seguimiento proactivo bien hecho refuerza la percepción de cuidado del paciente — un activo relacional directo, especialmente relevante en clínicas premium y familiares (ver DKB-EMP-01 §2-3).

### 5. Necesidades de cada actor
El paciente necesita sentir que no está solo tras una intervención. El equipo clínico necesita detectar cuanto antes cualquier señal de complicación real, para poder intervenir a tiempo.

### 6. Datos necesarios
Protocolo de seguimiento postoperatorio actual por tipo de intervención, si existe.

### 7. Qué puede hacer ATLAS
Contactar proactivamente al paciente tras una intervención, con preguntas estructuradas ya definidas por el equipo clínico (nunca preguntas de diagnóstico improvisadas). Escalar de inmediato a un humano cualquier respuesta que sugiera una posible complicación.

### 8. Qué no debe hacer ATLAS
Valorar clínicamente una respuesta del paciente sobre su evolución — solo puede recoger la información y escalarla según el protocolo ya definido por el equipo clínico, nunca interpretarla por su cuenta.

### 9. Automatizaciones recomendadas
Contacto proactivo estructurado tras intervenciones definidas como relevantes por la clínica. Escalado inmediato ante cualquier señal de alerta en la respuesta del paciente.

### 10. Decisiones que requieren aprobación humana
Cualquier respuesta del paciente que sugiera una posible complicación se deriva siempre y de inmediato a un humano — ninguna excepción.

### 11. Riesgos
El umbral de qué se considera "señal de alerta" debe ser conservador por defecto — ante la duda, siempre se escala, nunca se minimiza una respuesta del paciente.

### 12. KPIs
Proporción de intervenciones con seguimiento proactivo realizado, tiempo de escalado ante una señal de alerta detectada.

### 13. Beneficio cuantificable
**[HIPÓTESIS — validar con clínicas piloto]** Mejora de la percepción de cuidado del paciente y detección más temprana de complicaciones menores, reduciendo su severidad al atenderlas antes.

### 14. Argumento comercial
Que tus pacientes sepan que alguien se preocupa de cómo van, sin que tengan que llamar ellos primero.

### 15. Ejemplo práctico
Un paciente tras una extracción recibe, al día siguiente, un mensaje preguntando por su evolución según el protocolo definido por la clínica — su respuesta indica una molestia dentro de lo esperado, y el contacto queda registrado sin necesidad de intervención; en otro caso, una respuesta que sugiere sangrado persistente escala de inmediato al equipo clínico.

### 16. Ayuda contextual para mostrar en la plataforma
> "Define qué intervenciones merecen seguimiento proactivo y qué preguntas debe hacer tu equipo digital — nunca improvisará una valoración clínica."

### 17. Preguntas para la implantación
¿Qué intervenciones consideráis que merecen seguimiento proactivo? ¿Existe ya un protocolo de preguntas postoperatorias definido?

### 18. Diferencias entre clínica privada y franquicia
El protocolo de seguimiento postoperatorio puede venir estandarizado por la marca en una franquicia, garantizando el mismo nivel de cuidado en todas las sedes.

### 19. Nivel de prioridad
**MVP** — proceso de bajo riesgo clínico bien definido (con escalado conservador) y alto valor relacional.

### 20. Entidades y relaciones de conocimiento necesarias
`KnowledgeUnit` de tipo protocolo de seguimiento postoperatorio, por tipo de intervención. `Policy` de escalado inmediato ante cualquier señal de alerta detectada en la respuesta del paciente.

---

## 11. Alta

### 1. Definición
El cierre formal de un tratamiento, cuando se considera clínicamente finalizado.

### 2. Funcionamiento habitual actual
Comunicación del cierre por parte del profesional, a veces sin un cierre administrativo formal correspondiente — el paciente "termina" de facto sin un momento explícito de cierre.

### 3. Problemas frecuentes
Falta de un momento de cierre formal que marque claramente el fin del tratamiento y el inicio del ciclo de mantenimiento (revisión periódica). Oportunidad perdida de recoger una reseña o iniciar recomendación en el momento de mayor satisfacción del paciente.

### 4. Consecuencias económicas y operativas
El alta es, de las 15 etapas, el momento de mayor probabilidad de obtener una reseña positiva o una recomendación — un cierre difuso pierde esa ventana de oportunidad.

### 5. Necesidades de cada actor
El paciente necesita sentir que el tratamiento ha concluido con éxito, con claridad sobre los siguientes pasos (mantenimiento, revisión). La clínica necesita marcar el cierre para poder activar correctamente el ciclo de recall posterior.

### 6. Datos necesarios
Criterio de la clínica para considerar un tratamiento formalmente cerrado, plazo hasta la siguiente revisión recomendada según el tipo de tratamiento.

### 7. Qué puede hacer ATLAS
Formalizar el cierre administrativo del tratamiento en el momento en que el profesional lo confirma. Explicar al paciente el plan de mantenimiento posterior. Activar, desde este momento, el ciclo de recall con la cadencia adecuada al tratamiento realizado.

### 8. Qué no debe hacer ATLAS
Declarar un tratamiento como clínicamente finalizado por su cuenta — esa determinación es siempre del profesional; el sistema solo formaliza administrativamente lo ya decidido clínicamente.

### 9. Automatizaciones recomendadas
Cierre administrativo automático al confirmarse el alta clínica. Explicación del plan de mantenimiento posterior. Activación del ciclo de recall correspondiente.

### 10. Decisiones que requieren aprobación humana
La determinación clínica de que el tratamiento ha concluido, siempre del profesional.

### 11. Riesgos
**[HIPÓTESIS — validar con clínicas piloto]** Si el momento de solicitud de reseña se vincula automáticamente al alta sin margen de calibración, podría solicitarse en un momento inadecuado según el tipo de tratamiento o la experiencia real del paciente — ver etapa de Reseña (§14) para el criterio de momento oportuno.

### 12. KPIs
Proporción de tratamientos con cierre administrativo formal registrado, tiempo entre alta clínica y activación del ciclo de recall.

### 13. Beneficio cuantificable
**[HIPÓTESIS — validar con clínicas piloto]** Mejora de la tasa de recall recuperado gracias a una activación sistemática desde el momento exacto del alta, en vez de depender de que alguien lo recuerde manualmente después.

### 14. Argumento comercial
Que cada tratamiento termine con un cierre claro, no con un simple silencio.

### 15. Ejemplo práctico
Al confirmar el dentista que un tratamiento de ortodoncia ha finalizado, el sistema formaliza el cierre, explica al paciente el plan de retención y revisión posterior, y programa automáticamente el recordatorio de su primera revisión de mantenimiento.

### 16. Ayuda contextual para mostrar en la plataforma
> "Cuando confirmes el alta de un tratamiento, se activará automáticamente el plan de revisión posterior — revisa la cadencia recomendada para cada tipo de tratamiento."

### 17. Preguntas para la implantación
¿Existe hoy un momento formal de cierre de tratamiento? ¿Qué cadencia de revisión recomendáis tras cada tipo de tratamiento?

### 18. Diferencias entre clínica privada y franquicia
La cadencia de revisión recomendada por tipo de tratamiento puede venir estandarizada por la marca en una franquicia, como parte del protocolo clínico general de la red.

### 19. Nivel de prioridad
**Fase 2** — depende de que el recall (§12) y la reseña (§14) ya estén definidos para aprovechar completamente el momento de cierre.

### 20. Entidades y relaciones de conocimiento necesarias
Evento de "alta de tratamiento" como disparador de dos flujos posteriores: activación de recall (§12) y evaluación de momento oportuno de solicitud de reseña (§14).

---

## 12. Recall

### 1. Definición
La revisión periódica de mantenimiento, típicamente semestral, que aplica a todo paciente activo de la clínica independientemente de si tiene un tratamiento en curso.

### 2. Funcionamiento habitual actual
Dependiente, en la mayoría de clínicas, de que el propio paciente recuerde agendar su siguiente revisión — sin un sistema proactivo y sistemático de recordatorio.

### 3. Problemas frecuentes
Pacientes que simplemente se olvidan de agendar su revisión periódica, sin ninguna mala intención — es, con diferencia, la mayor oportunidad de automatización de bajo riesgo y alto valor de todo el recorrido, precisamente porque no depende de una decisión comercial compleja, solo de recordar algo que el paciente ya querría hacer.

### 4. Consecuencias económicas y operativas
Cada revisión no agendada es una pérdida de ingreso recurrente de bajo coste de servicio, además de una pérdida de oportunidad de detectar a tiempo cualquier problema incipiente en el paciente.

### 5. Necesidades de cada actor
El paciente necesita un recordatorio oportuno y fácil de convertir en cita. La clínica necesita maximizar la ocupación de agenda con este tipo de cita, de bajo esfuerzo comercial y alto valor recurrente.

### 6. Datos necesarios
Cadencia de revisión recomendada, fecha de última revisión de cada paciente (vía sistema clínico), canal preferido de contacto del paciente.

### 7. Qué puede hacer ATLAS
Identificar, mediante consulta al sistema clínico, qué pacientes están próximos o ya vencidos en su revisión periódica. Contactar de forma proactiva ofreciendo horarios disponibles. Confirmar la cita en el mismo contacto.

### 8. Qué no debe hacer ATLAS
Insistir de forma excesiva si el paciente declina o no responde tras varios intentos razonables — el tono y la cadencia de insistencia forman parte del Business DNA de la clínica, calibrado para no resultar intrusivo.

### 9. Automatizaciones recomendadas
Identificación automática de pacientes próximos o vencidos en su revisión. Contacto proactivo con oferta de horarios. Confirmación directa de la cita.

### 10. Decisiones que requieren aprobación humana
Ninguna — es, de las 15 etapas de este documento, la que puede operar con mayor autonomía por defecto, dado su bajo riesgo clínico y ausencia de decisión comercial sensible.

### 11. Riesgos
Bajo, comparado con el resto de etapas — el mayor riesgo es de tono (recordatorio percibido como insistente) más que de gobernanza o de contenido clínico.

### 12. KPIs
Tasa de recall recuperado (revisiones agendadas tras recordatorio, sobre el total de pacientes contactados), tiempo medio entre vencimiento y cita agendada.

### 13. Beneficio cuantificable
**[HIPÓTESIS — validar con clínicas piloto]** Recuperación de una proporción significativa de revisiones que hoy simplemente no se agendan por olvido — junto con el seguimiento de presupuestos (§6), es el candidato más fuerte a mayor beneficio cuantificable de todo el recorrido, con la ventaja adicional de ser el de menor riesgo de ejecución.

### 14. Argumento comercial
Que ninguna revisión se pierda por simple olvido — de tus pacientes ni del calendario.

### 15. Ejemplo práctico
Un paciente que hizo su última limpieza hace seis meses recibe un recordatorio con dos propuestas de horario esa misma semana — confirma directamente por el mismo canal, sin necesidad de llamar a la clínica.

### 16. Ayuda contextual para mostrar en la plataforma
> "El recall es, probablemente, la automatización de mayor impacto con menor esfuerzo de configuración. Actívalo desde el primer día."

### 17. Preguntas para la implantación
¿Qué cadencia de revisión recomendáis por tipo de paciente o tratamiento? ¿Existe hoy algún sistema de recordatorio, aunque sea manual?

### 18. Diferencias entre clínica privada y franquicia
No hay diferencia estructural relevante — el recall funciona de forma equivalente en cualquier modelo de clínica, con la única variación de que en una franquicia la cadencia recomendada puede venir predefinida por la marca.

### 19. Nivel de prioridad
**MVP** — la automatización de mayor relación valor/riesgo de todo el recorrido del paciente.

### 20. Entidades y relaciones de conocimiento necesarias
`KnowledgeDomain` de "Agenda y Políticas de Cita" con cadencia de revisión por tipo de tratamiento. Consulta estructurada al sistema clínico (vía Integrations Hub) para identificar pacientes vencidos, nunca almacenamiento de esa lista como conocimiento genérico del Brain.

---

## 13. Reactivación

### 1. Definición
El contacto proactivo con pacientes que han dejado de acudir a la clínica durante un periodo prolongado, más allá de una simple revisión vencida (§12).

### 2. Funcionamiento habitual actual
Rara vez gestionado de forma sistemática — un paciente inactivo simplemente deja de aparecer en el radar de la clínica, sin ningún proceso definido de reconexión.

### 3. Problemas frecuentes
Ausencia de un criterio claro de cuándo un paciente pasa de "vencido en revisión" a "inactivo". Falta de un mensaje de reactivación distinto al recordatorio de recall habitual — un paciente inactivo de dos años necesita un tono distinto al de alguien con seis meses de retraso.

### 4. Consecuencias económicas y operativas
Reactivar a un paciente existente tiene, casi con certeza, menor coste que captar uno nuevo — es una oportunidad de bajo coste de adquisición que hoy se pierde por simple falta de proceso.

### 5. Necesidades de cada actor
El paciente inactivo necesita un motivo genuino para reconectar, no solo un recordatorio repetido de algo que ya ignoró antes. La clínica necesita un criterio claro de segmentación entre "vencido reciente" y "inactivo de largo plazo".

### 6. Datos necesarios
Criterio de la clínica para definir "paciente inactivo" (tiempo sin visita), historial de campañas de reactivación previas si las hay.

### 7. Qué puede hacer ATLAS
Identificar pacientes que cruzan el umbral de inactividad definido por la clínica. Contactar con un mensaje de reactivación distinto y con un motivo concreto (novedad, promoción específica de reactivación, cambio relevante en la clínica), nunca con el mismo tono de un recordatorio de rutina.

### 8. Qué no debe hacer ATLAS
Usar datos de salud del paciente como criterio de segmentación de una campaña de reactivación — línea roja heredada de marketing (ver §14 de este documento y PVD-0005 §6).

### 9. Automatizaciones recomendadas
Identificación automática de pacientes que cruzan el umbral de inactividad. Campaña de reactivación con tono y motivo diferenciado del recall habitual.

### 10. Decisiones que requieren aprobación humana
El envío de cualquier campaña de reactivación a una lista de pacientes, dado que es una acción de alto alcance con implicaciones de cumplimiento normativo (consentimiento de comunicaciones comerciales).

### 11. Riesgos
**[HIPÓTESIS — validar con clínicas piloto]** Un paciente que se volvió inactivo por una experiencia negativa concreta (no solo por olvido) puede reaccionar mal a una reactivación genérica — sin visibilidad de la causa real de inactividad, el mensaje corre el riesgo de sonar tan sordo a su situación como el silencio que lo precedió.

### 12. KPIs
Proporción de pacientes inactivos reactivados tras campaña, coste de reactivación frente a coste de captación de un paciente nuevo.

### 13. Beneficio cuantificable
**[HIPÓTESIS — validar con clínicas piloto]** Reactivación de una parte de la base de pacientes inactivos con un coste sensiblemente menor al de captación de un paciente completamente nuevo.

### 14. Argumento comercial
Antes de gastar en captar un paciente nuevo, reactiva a los que ya te conocían.

### 15. Ejemplo práctico
Un paciente sin visitas desde hace más de dos años recibe un mensaje de reactivación con una oferta concreta de revisión gratuita de bienvenida de vuelta — un motivo genuino de reconexión, distinto del simple "hace tiempo que no te vemos" de un recordatorio de recall.

### 16. Ayuda contextual para mostrar en la plataforma
> "Define a partir de cuánto tiempo sin visita consideras que un paciente está inactivo — así podremos diferenciarlo de un simple recordatorio de revisión."

### 17. Preguntas para la implantación
¿A partir de cuánto tiempo sin visita consideráis que un paciente pasa a estar inactivo? ¿Habéis hecho campañas de reactivación antes? ¿Qué resultado tuvieron?

### 18. Diferencias entre clínica privada y franquicia
En una franquicia, las campañas de reactivación pueden estar coordinadas o incluso financiadas a nivel de marca central, mientras que en una clínica privada el coste y diseño de la campaña recae enteramente en la propia clínica.

### 19. Nivel de prioridad
**MVP** — de alto valor comercial (menor coste que captación nueva) y complejidad moderada, similar en naturaleza a una campaña de marketing dirigida.

### 20. Entidades y relaciones de conocimiento necesarias
Umbral de inactividad como `DNATrait` o parámetro configurable de la clínica. `Policy` de aprobación obligatoria para el envío de cualquier campaña de reactivación a una lista de pacientes.

---

## 14. Reseña

### 1. Definición
La solicitud activa a un paciente de que comparta su experiencia en una plataforma de reputación pública (Google, Doctoralia u otras equivalentes).

### 2. Funcionamiento habitual actual
Solicitada de forma esporádica y no sistemática, dependiendo de si algún miembro del equipo se acuerda de pedirla en el momento adecuado.

### 3. Problemas frecuentes
Solicitud en el momento equivocado (justo después de un procedimiento doloroso, en vez de tras un desenlace positivo). Ausencia total de solicitud en la mayoría de los casos, perdiendo una fuente de reputación de bajo coste y alto valor.

### 4. Consecuencias económicas y operativas
La reputación online pesa, en el sector dental, casi tanto como el boca a boca tradicional en la decisión de un paciente potencial — gestionarla bien es una palanca de captación de bajo coste que hoy se posterga sistemáticamente por falta de tiempo.

### 5. Necesidades de cada actor
El paciente necesita que la solicitud llegue en un momento en el que genuinamente se sienta bien con su experiencia, nunca forzada. La clínica necesita un flujo constante de reseñas nuevas y auténticas.

### 6. Datos necesarios
Plataformas de reseña relevantes para la clínica, criterio actual (si existe) de cuándo se considera un buen momento para pedir una reseña.

### 7. Qué puede hacer ATLAS
Identificar el momento adecuado para solicitar una reseña — tras un desenlace positivo del tratamiento (alta, §11), nunca inmediatamente después de un procedimiento doloroso o una experiencia con fricción detectada. Redactar la solicitud con el tono del Business DNA de la clínica. Monitorizar reseñas nuevas y marcar cualquier reseña negativa como prioritaria para atención humana.

### 8. Qué no debe hacer ATLAS
Responder de forma autónoma a una reseña negativa — como mucho, redacta un borrador de respuesta a la espera de aprobación explícita del propietario. Solicitar reseñas de forma indiscriminada sin considerar el desenlace real de la experiencia del paciente.

### 9. Automatizaciones recomendadas
Identificación del momento oportuno de solicitud tras un desenlace positivo. Envío de solicitud de reseña con tono personalizado. Monitorización y alerta prioritaria ante reseñas negativas.

### 10. Decisiones que requieren aprobación humana
Cualquier respuesta pública a una reseña, especialmente negativa — nunca automática.

### 11. Riesgos
**[HIPÓTESIS — validar con clínicas piloto]** El criterio de "desenlace positivo" necesita calibrarse con cuidado — una solicitud mal calibrada tras una experiencia neutra o negativa puede generar el efecto contrario al buscado.

### 12. KPIs
Volumen de nuevas reseñas por periodo, puntuación media, tiempo de respuesta a reseñas negativas.

### 13. Beneficio cuantificable
**[HIPÓTESIS — validar con clínicas piloto]** Incremento del volumen de reseñas positivas gracias a la solicitud sistemática en el momento oportuno, frente a la solicitud esporádica actual.

### 14. Argumento comercial
Que tu buena reputación deje de depender de que alguien se acuerde de pedirla.

### 15. Ejemplo práctico
Tras el alta de un tratamiento de ortodoncia con evolución satisfactoria, el paciente recibe una solicitud de reseña con el tono cercano habitual de la clínica — una reseña negativa recibida ese mismo mes en otra plataforma se marca de inmediato como prioritaria en la vista del propietario, sin respuesta automática.

### 16. Ayuda contextual para mostrar en la plataforma
> "Configuramos el momento adecuado para pedir una reseña — nunca justo después de un procedimiento incómodo, siempre tras un desenlace positivo."

### 17. Preguntas para la implantación
¿En qué plataformas de reseña estáis presentes hoy? ¿Existe algún criterio actual de cuándo pedir una reseña?

### 18. Diferencias entre clínica privada y franquicia
En una franquicia, la reputación de una sede concreta puede afectar a la percepción de toda la marca — la gestión de reseñas negativas puede requerir coordinación adicional con la central en casos sensibles.

### 19. Nivel de prioridad
**MVP** — automatización sencilla, bajo riesgo (no hay respuesta autónoma a reseñas negativas), alto valor de reputación.

### 20. Entidades y relaciones de conocimiento necesarias
Evento de "desenlace positivo" (vinculado al alta, §11) como disparador de la solicitud. `DNAToneProfile` aplicado al mensaje de solicitud. Alerta prioritaria vinculada a cualquier reseña negativa detectada, visible en ATLAS Home (referencia arquitectónica general).

---

## 15. Recomendación

### 1. Definición
El boca a boca activo — que un paciente satisfecho recomiende explícitamente la clínica a otra persona — como canal de captación de nuevos pacientes.

### 2. Funcionamiento habitual actual
Ocurre de forma orgánica y no gestionada en la mayoría de clínicas, sin ningún mecanismo que la refuerce ni que permita medir su volumen real.

### 3. Problemas frecuentes
Imposibilidad de medir cuántos pacientes nuevos llegan realmente por recomendación, al no preguntarse o registrarse de forma sistemática (ver Captación, §1). Ausencia de cualquier programa que incentive o facilite la recomendación activa.

### 4. Consecuencias económicas y operativas
La recomendación es, probablemente, el canal de menor coste de adquisición de todos — no reforzarlo activamente es dejar sobre la mesa el canal de captación más rentable disponible.

### 5. Necesidades de cada actor
El paciente que recomienda necesita que sea fácil hacerlo (un enlace, una forma simple de compartir), no un proceso engorroso. La clínica necesita poder medir y, si lo decide, incentivar este canal sin que se sienta transaccional o forzado.

### 6. Datos necesarios
Si existe hoy algún programa de referidos, formal o informal, y su resultado si se conoce.

### 7. Qué puede hacer ATLAS
Facilitar un mecanismo simple para que un paciente satisfecho recomiende la clínica (enlace de referido, invitación simple). Medir de forma consolidada, junto con la etapa de Captación (§1), cuántos pacientes nuevos llegan realmente por recomendación.

### 8. Qué no debe hacer ATLAS
Presionar a un paciente para que recomiende, ni convertir el gesto en algo transaccional que devalúe la autenticidad de la recomendación — debe seguir sintiéndose como un gesto genuino, nunca como una solicitud comercial disfrazada.

### 9. Automatizaciones recomendadas
Mecanismo simple de referido tras un desenlace positivo. Medición consolidada del volumen y conversión de pacientes llegados por recomendación.

### 10. Decisiones que requieren aprobación humana
El diseño de cualquier programa de incentivo a la recomendación (descuentos, regalos), dado que implica una decisión comercial y de posicionamiento de marca.

### 11. Riesgos
**[HIPÓTESIS — validar con clínicas piloto]** Un programa de incentivos mal diseñado puede sentirse mercantilista y dañar precisamente la confianza que hace que la recomendación funcione en primer lugar — a diseñar con cuidado, nunca por defecto agresivo.

### 12. KPIs
Proporción de nuevos pacientes atribuidos a recomendación (consolidado con Captación, §1), volumen de referidos generados por paciente activo.

### 13. Beneficio cuantificable
**[HIPÓTESIS — validar con clínicas piloto]** Incremento del canal de captación de menor coste de adquisición disponible, al facilitarlo y medirlo de forma sistemática en vez de dejarlo completamente orgánico.

### 14. Argumento comercial
Que recomendar tu clínica sea tan fácil como quererlo hacer.

### 15. Ejemplo práctico
Un paciente satisfecho tras su tratamiento recibe, de forma discreta y no insistente, un enlace simple para compartir con alguien que pueda necesitar el mismo tipo de tratamiento — sin ningún tipo de presión ni seguimiento agresivo si no lo usa.

### 16. Ayuda contextual para mostrar en la plataforma
> "Facilita que tus pacientes satisfechos te recomienden, sin convertirlo en algo transaccional — mide el resultado igual que cualquier otro canal de captación."

### 17. Preguntas para la implantación
¿Existe hoy algún programa de referidos, formal o informal? ¿Sabéis qué proporción de pacientes nuevos llega por recomendación?

### 18. Diferencias entre clínica privada y franquicia
En una franquicia, un programa de referidos puede estar diseñado y financiado a nivel de marca central, aplicado de forma consistente en todas las sedes.

### 19. Nivel de prioridad
**Avanzado** — de menor urgencia inmediata que otras etapas, y de mayor complejidad de atribución y diseño comercial cuidadoso.

### 20. Entidades y relaciones de conocimiento necesarias
Mismo mecanismo de atribución de origen que Captación (§1), con un valor de canal específico "recomendación de paciente". Vinculación opcional a un programa de incentivos, si la clínica decide activarlo, como entidad de política comercial separada.

---

## Notas de cierre para la revisión de este documento

1. **Todas las afirmaciones marcadas [HIPÓTESIS]** deben contrastarse con clínicas piloto reales de distintos modelos (ver [DKB-EMP-01](../01_Empresa/DKB-EMP-01_Modelos_Clinica.md)) antes de convertirse en supuestos de producto firmes.
2. **La priorización MVP / Fase 2 / Avanzado por etapa** debe revisarse junto con el equipo de producto — en particular, confirmar que Presupuesto (§6) y Recall (§12) son, como se plantea aquí, los dos candidatos de mayor beneficio cuantificable antes de comprometer recursos de desarrollo en ese orden.
3. Con este documento completo, quedan ya identificables con precisión los primeros Empleados Digitales del vertical (Recepción Digital, Coordinador de Presupuestos, Agenda y Recall, Reputación y Campañas, Guardián de Urgencias) y el catálogo inicial de automatizaciones — insumo directo para DKB-REC-01, DKB-AGE-01, DKB-FIN-01, DKB-AUT-01, DKB-IA-01, siguientes en la hoja de ruta de construcción (ver [Índice Maestro](../00_Master_Index.md) §3).
