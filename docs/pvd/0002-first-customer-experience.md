# PVD-0002 — First Customer Experience

| | |
|---|---|
| **Tipo de documento** | Product Vision Document — diseño de experiencia |
| **Estado** | Propuesto |
| **Fecha** | 2026-07-09 |
| **Se apoya en** | [PVD-0001: Product Vision](0001-product-vision-atlas-ai.md) — especialmente §6 (Principios de UX) y §4 ("incorporar a un empleado", no "configurar un software") |
| **Implementa técnicamente** | [ADR-0001](../adr/0001-arquitectura-base-atlas-ai.md) (Tenancy, Capability Model, Digital Employees) · [ADR-0002](../adr/0002-company-brain.md) (Company Brain) · [ADR-0003](../adr/0003-context-engine-retrieval-pipeline.md) (Context Engine) · [ADR-0005](../adr/0005-decision-engine-validation-engine.md) (Decision Engine, Policies) |

---

## Antes de nada

En quince minutos no vamos a pedirle a nadie que configure un software.

Vamos a presentarle a alguien.

Cuando una empresa contrata a una persona, no le entrega un manual de 40 páginas antes de dejarla trabajar. Le cuenta quién es la empresa, le enseña dónde está lo importante, le dice qué puede decidir sola y qué debe consultar, y al final del primer día esa persona ya hizo algo real, aunque pequeño.

Eso es lo que este documento diseña: los primeros quince minutos de un cliente con su primer Empleado Digital. No un wizard de configuración. Una incorporación.

Si al final de este flujo el cliente ha "configurado permisos", hemos fallado. Si al final ha visto a alguien trabajar por primera vez, hemos acertado.

---

## Principios de esta experiencia

Cinco reglas que gobiernan cada decisión de este documento — y de cualquier pantalla que se añada después:

1. **Ningún campo sin una razón visible.** Si el cliente no puede adivinar para qué le pedimos un dato, no se lo pedimos.
2. **Todo lo que se pregunta, se ve usado en la demo final.** Si un dato del wizard no aparece reflejado en el minuto 15, ese dato no pertenece al wizard.
3. **El sistema trabaja mientras el cliente piensa.** La ingesta del Company Brain, la indexación, el arranque del Context Engine — todo ocurre en paralelo, en segundo plano, mientras el cliente sigue avanzando. Nunca hay una barra de progreso bloqueando la conversación.
4. **Un experto en quince minutos, no un formulario en quince minutos.** Las preguntas se formulan como las haría un jefe de equipo el primer día, no como las haría un panel de administración.
5. **Mostrar, no explicar.** No hay una pantalla que describa lo que Company Brain, Decision Engine o Policies hacen. Hay una pantalla que lo hace, delante del cliente.

---

## Lo que deliberadamente NO preguntamos en los primeros 15 minutos

Tan importante como lo que se incluye es lo que se corta:

- No pedimos facturación ni plan de precios — eso es una decisión de después del "sí", no de antes.
- No mostramos la matriz completa del Capability Model — eso vive en Configuración avanzada, no en la incorporación.
- No pedimos SSO, roles de equipo ni invitaciones — se ofrece al final, como paso opcional, no como bloqueo.
- No exigimos conectar todos los sistemas de la empresa — con uno o dos documentos basta para sentir el producto funcionando.
- No usamos ningún término técnico de nuestra arquitectura ("Knowledge Unit", "Capability Grant", "Policy Evaluator") en ninguna pantalla — esos nombres son nuestros, no del cliente.

---

## 1. El wizard de incorporación

Seis momentos, quince minutos, un solo hilo narrativo: **de "no nos conocemos" a "esto ya está trabajando".**

| Momento | Ventana de tiempo | Pregunta que responde para el cliente |
|---|---|---|
| 0 — Bienvenida | 0:00 – 0:30 | "¿Qué va a pasar en los próximos quince minutos?" |
| 1 — Quién eres | 0:30 – 2:00 | "¿A quién estoy a punto de conocer?" |
| 2 — Qué sabe tu empresa | 2:00 – 6:00 | "¿Cómo le enseño lo que ya sabemos?" |
| 3 — Qué necesitas | 6:00 – 8:00 | "¿Con qué quiero que empiece a ayudarme?" |
| 4 — Cuánta libertad le das | 8:00 – 11:00 | "¿Qué puede hacer solo, y qué prefiero revisar yo?" |
| 5 — Nombre y voz | 11:00 – 12:00 | "¿Cómo se presenta?" |
| 6 — La demo | 12:00 – 15:00 | "¿Y esto realmente funciona?" |

El orden no es arbitrario: primero identidad, después conocimiento (lo más valioso y lo que más tarda en procesarse, así que arranca antes), después propósito, después confianza, después nombre, y solo al final — con todo ya cargado — la prueba. Pedir confianza (Momento 4) antes de que el cliente haya visto qué documentos aportó (Momento 2) generaría ansiedad sin contexto; el orden respeta cómo un humano decide confiar: primero conoce, después decide cuánto delega.

---

## 2. Pantallas

| # | Pantalla | Contenido principal | Única acción disponible |
|---|---|---|---|
| 1 | **Bienvenida** | Una frase. Sin formulario. "En los próximos quince minutos vas a conocer a tu primer Empleado Digital." | Empezar |
| 2 | **Cuéntanos de tu empresa** | Nombre de la empresa · Sector (selector con 8–10 opciones comunes) · Tamaño de equipo (3 rangos) | Continuar |
| 3 | **Qué debería saber** | Zona de arrastrar y soltar documentos + botones de conexión (Drive, Notion, Slack, correo) · Animación en vivo: "Leyendo tus documentos…" | Continuar (activo incluso con 0 documentos) |
| 4 | **Elige su primera tarea** | 3–4 tarjetas con tareas sugeridas según el sector elegido, más una opción "Otra tarea" en texto libre | Seleccionar una tarjeta |
| 5 | **Define su criterio** | 3–5 controles tipo interruptor, uno por categoría de acción relevante a la tarea elegida, formulados como frases, no como permisos | Continuar |
| 6 | **Dale nombre y voz** | Campo de nombre · Selector de tono (cercano / formal) · Selector de ícono/avatar | Continuar |
| 7 | **La demo** | Vista dividida: conversación real a la izquierda, "Por qué respondió esto" a la derecha con citas a los documentos reales del cliente | Ir al panel principal |

Siete pantallas. Ninguna pide más de tres decisiones. Ninguna tiene scroll.

---

## 3. Flujo UX — el arco emocional

**Momento 0 (0:00–0:30).** Sin campos. Una frase y un botón. El cliente no ha tomado ninguna decisión todavía y ya sabe qué va a pasar. Tono: expectante, no burocrático.

**Momento 1 (0:30–2:00).** Tres preguntas, todas de una línea, todas con valor por defecto sugerido apenas empieza a escribir (autocompletado de sector por nombre de empresa cuando sea posible). Aquí no se siente "estoy dando de alta una cuenta" — se siente "me están preguntando antes de presentarme a alguien".

**Momento 2 (2:00–6:00).** El momento de mayor inversión emocional y el de mayor valor técnico. El cliente arrastra un par de documentos o conecta una herramienta que ya usa. En cuanto suelta el primer archivo, aparece movimiento inmediato en pantalla — fragmentos del documento resaltándose, una línea de estado que cambia ("Encontramos 3 políticas, 12 procesos…") — aunque el procesamiento real completo tarde más, la sensación de "esto ya está pasando" es instantánea. Este es el instante donde el producto dice, sin decirlo: *ya te estoy escuchando.*

**Momento 3 (6:00–8:00).** Ligero, casi divertido. Tarjetas, no formularios. El cliente elige una tarea reconocible ("Responder preguntas de soporte", "Resumir reuniones") en vez de describir un caso de uso abstracto.

**Momento 4 (8:00–11:00).** El más delicado de diseñar: aquí se define, sin que el cliente lo perciba como tal, el Capability Model y las Policies iniciales. Se presenta como una conversación de confianza ("¿Puede responder directamente a un cliente, o prefieres revisar antes de que se envíe?"), nunca como una matriz de permisos. Cada interruptor tiene una frase de una línea a su lado explicando la consecuencia concreta, no la regla abstracta.

**Momento 5 (11:00–12:00).** El respiro antes del clímax. Ponerle nombre es un acto simbólico deliberado — coherente con PVD-0001 §6 (metáfora de "incorporar a un empleado"). Pequeño, cálido, rápido.

**Momento 6 (12:00–15:00).** El clímax. Ver algo funcionar. No una animación de producto — una respuesta real, generada con los documentos reales que el propio cliente subió hace nueve minutos, con las citas exactas a la izquierda de la pantalla. Este es el único momento del flujo diseñado para provocar una reacción física (inclinarse hacia la pantalla), no solo comprensión.

---

## 4. Qué preguntas hacer

Copy exacto, tal como debe sentirse — conversacional, nunca administrativo:

| Pantalla | Pregunta / etiqueta | Formato |
|---|---|---|
| 2 | "¿Cómo se llama tu empresa?" | texto libre |
| 2 | "¿A qué se dedica?" | selector (Ventas y Retail, Servicios profesionales, Salud, Tecnología, Educación, Finanzas, Manufactura, Otro) |
| 2 | "¿Cuántas personas forman el equipo que va a trabajar con esto?" | 3 rangos (1–10 / 11–50 / 51+) |
| 3 | "¿Qué debería saber tu primer Empleado Digital para empezar a ayudar hoy?" | zona de subida + conectores |
| 4 | "¿En qué quieres que te ayude primero?" | tarjetas + opción libre |
| 5 | "¿Puede responder directamente, o prefieres revisar antes de que salga algo hacia fuera?" | interruptor por categoría de acción |
| 5 | "¿Hay algo que preferirías que no toque todavía?" | lista de exclusión (p. ej. "Información financiera", "Datos de RRHH") con opción de marcar |
| 6 | "¿Cómo se llama?" | texto libre, con sugerencias neutras precargadas |
| 6 | "¿Cómo prefieres que se comunique?" | cercano / formal |

Nueve preguntas en total. Ninguna pregunta técnica. Ninguna pregunta que el cliente no pueda responder sin pensar más de cinco segundos.

---

## 5–9. Qué se genera automáticamente detrás de cada pantalla

Esta es la tabla que hace cumplir el Principio 2 ("todo lo que se pregunta se ve usado"): cada respuesta del cliente se traduce, sin que él lo vea, en las estructuras ya definidas en ADR-0001, ADR-0002, ADR-0003 y ADR-0005.

| Pantalla / respuesta del cliente | Company Brain (ADR-0002) | Decision Rules (ADR-0005 §4) | Policies (ADR-0005 §11) | Digital Employees (ADR-0001) | Context Engine (ADR-0003) |
|---|---|---|---|---|---|
| **Sector de la empresa** | Instancia la plantilla de `KnowledgeDomain` correspondiente al sector (ADR-0002 §4) | — | Siembra políticas por defecto propias del sector (p. ej. sanidad → política de datos clínicos activa desde el minuto uno) | — | Define los `domain_hints` por defecto para este tenant |
| **Documentos subidos / conectores** | Crea `KnowledgeSource` + `KnowledgeDocument`; dispara el pipeline de ingesta (extracción → chunk → embedding → grafo, ADR-0002 §8) | — | — | — | Primeras `KnowledgeUnit` quedan disponibles para recuperación en cuanto termina la ingesta — el Brain deja de estar vacío |
| **Tarea elegida** | Prioriza qué dominios se indexan/resumen primero | Define el `task_intent` por defecto del agente | — | Define el **rol** declarativo del Empleado Digital | Ajusta el presupuesto de tokens inicial según la complejidad típica de la tarea elegida |
| **"¿Puede responder directamente o prefieres revisar?"** | — | Crea las banderas de `APPROVAL_REQUIRED` por categoría de acción (ADR-0005 §4.4) | Crea entradas iniciales en `policies` con `verdict_type = require_approval` para las categorías marcadas | Define el `capability_grant_id` inicial del agente | — |
| **"¿Hay algo que no debería tocar?"** | Marca los `KnowledgeDomain` excluidos como fuera de `allowed_domains` | — | Crea `policies` con `verdict_type = deny` sobre esos dominios | Restringe el alcance del agente desde su creación | El predicado de filtrado (ADR-0003 §5) nunca llega siquiera a considerar esos dominios |
| **Nombre y tono** | — | — | — | Completa el registro del Empleado Digital (persona, tono) | — |

Nada de esto se le muestra al cliente como "tablas" o "reglas" — se le muestra, en la pantalla 7, como comportamiento observable.

---

## 10. La demo final

El minuto 12 al 15 no es una pantalla de "producto listo" — es la primera ejecución real del sistema completo, con datos reales del cliente, delante de sus ojos.

**Lo que ocurre técnicamente** (invisible para el cliente, pero es exactamente esto): se dispara la primera `ContextRequest` real de este tenant contra el Context Engine (ADR-0003), usando el `capability_grant_id` recién creado en el Momento 4, sobre los `KnowledgeUnit` generados a partir de los documentos del Momento 2. La respuesta pasa por el Decision Engine y el Validation Engine (ADR-0005) exactamente igual que cualquier ejecución en producción — no hay una versión "simplificada" de la demo. Lo que el cliente ve en el minuto 15 es, literalmente, el primer `RetrievalEvent` y el primer `decision_event` de su cuenta.

**Lo que ve el cliente:**

1. Una pregunta ya escrita, relacionada con la tarea elegida en el Momento 3, construida a partir de algo real de los documentos que subió ("¿Cuál es nuestra política de reembolsos?", si subió un documento que la contiene).
2. Una respuesta generada en vivo, con streaming visible — no aparece de golpe.
3. A la derecha, en el mismo instante, tarjetas de cita: fragmentos exactos del documento original, resaltados, con un enlace a "ver en el documento completo". Sin que el cliente lo pida — así de entrada.
4. Si la tarea elegida incluye una acción marcada como "requiere revisión" en el Momento 4, la demo provoca deliberadamente ese caso: el cliente ve, en vivo, cómo el sistema se detiene y le pide aprobar antes de continuar. No es un caso de error — es la prueba de que la gobernanza prometida en la Pantalla 5 es real, no un checkbox decorativo.
5. Cierre: una sola línea, sin adjetivos de marketing — *"[Nombre] ya está listo para trabajar contigo."* — y un único botón: **Ir al panel.**

No hay confeti. No hay "¡Enhorabuena!". El tono de cierre es el de alguien que acaba de terminar de mostrarte algo serio que funciona, no el de una app de consumo celebrando una descarga.

---

## Nota final para quien construya esto

Si en algún punto de la implementación hace falta añadir una pantalla, un campo o un paso intermedio que no aparece en este documento, la pregunta que decide si se añade no es "¿es útil tenerlo?" — casi todo lo es. La pregunta es: **¿el cliente lo verá reflejado en el minuto 15, y podría explicar por qué se lo preguntamos, sin ayuda?** Si la respuesta a cualquiera de las dos es no, no entra en los primeros quince minutos. Entra después, cuando ya haya confianza suficiente para pedir más.
