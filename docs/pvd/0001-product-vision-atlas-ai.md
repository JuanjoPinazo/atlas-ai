# PVD-0001 — Product Vision de ATLAS AI

| | |
|---|---|
| **Tipo de documento** | Product Vision Document (no es un ADR) |
| **Estado** | Propuesto |
| **Fecha** | 2026-07-09 |
| **Relación con ADRs** | Los ADR-0001, ADR-0002 y ADR-0003 implementan esta visión. Este documento no describe tecnología: describe **identidad**. Cuando exista conflicto, la tecnología se ajusta a este documento, no al revés. |

---

## Cómo leer este documento

Este no es un documento técnico ni un roadmap. Es la definición de **quiénes somos y qué no somos**, escrita para resolver dudas de producto cuando no haya una respuesta obvia. Cada sección termina siendo una herramienta de decisión, no solo una declaración de intenciones. La sección final (§11) convierte todo el documento en un checklist utilizable.

---

## 1. Qué es ATLAS AI

**ATLAS AI es la plataforma donde el conocimiento de una empresa se convierte en una fuerza de trabajo digital gobernada, auditable y que se vuelve más valiosa con el tiempo.**

No vendemos agentes. Vendemos la capacidad de una empresa de convertir lo que sabe — sus procesos, sus decisiones, su criterio acumulado — en trabajo ejecutado de forma consistente, trazable y segura, a través de Empleados Digitales que son la interfaz de ese conocimiento, no su origen.

Un cliente no compra "un chatbot con IA". Compra un sistema donde:

- El conocimiento institucional deja de vivir en la cabeza de las personas o en documentos dispersos y pasa a ser un activo estructurado, versionado y consultable ([Company Brain](../adr/0002-company-brain.md)).
- Ese conocimiento se pone a trabajar a través de agentes con alcance definido, no con autonomía indiscriminada.
- Cada acción y cada respuesta es explicable hasta su origen exacto.

---

## 2. Qué problemas resuelve

1. **Conocimiento fragmentado y volátil.** El saber operativo de una empresa vive en documentos dispersos, hilos de correo, y en la cabeza de empleados que eventualmente se van. ATLAS AI lo convierte en un activo persistente que sobrevive a las personas.
2. **Trabajo repetitivo que exige contexto, no juicio.** Tareas que hoy consumen tiempo humano no porque requieran criterio experto, sino porque requieren *saber dónde está la información correcta* — eso es exactamente lo que un Empleado Digital con acceso gobernado al Brain puede hacer.
3. **Desconfianza en la automatización con IA.** La mayoría de la IA empresarial actual es una caja negra: responde, pero no se puede auditar por qué. ATLAS AI resuelve esto por diseño, no como añadido — cada respuesta es trazable a las unidades de conocimiento exactas que la originaron.
4. **Inconsistencia entre respuestas.** Sin una fuente de verdad compartida, distintos agentes (o distintos empleados humanos) dan respuestas distintas a la misma pregunta. El Brain centraliza la verdad; los agentes la heredan, no la inventan cada uno por su cuenta.
5. **Coste de escalar operación sin escalar cabezas 1:1.** Permite crecer la capacidad operativa de una empresa sin que el crecimiento de headcount sea la única palanca — pero sin sacrificar gobernanza a cambio de velocidad.

---

## 3. Qué problemas NO pretende resolver

Esta sección importa tanto como la anterior — protege el foco del producto.

1. **No somos un CRM.** No gestionamos pipeline de ventas, contactos o pronósticos comerciales como función primaria. Nos integramos con sistemas de ese tipo; no competimos por sustituirlos.
2. **No somos una herramienta de creatividad genérica.** No competimos por ser "otro chat de IA" para generar texto o imágenes sin contexto empresarial. Todo lo que hacemos parte del conocimiento gobernado de la empresa, no de un modelo genérico suelto.
3. **No somos una plataforma de BI/analítica.** No sustituimos dashboards ni herramientas de datos. Un Empleado Digital puede consumir datos de esos sistemas, pero no reconstruimos esa categoría.
4. **No sustituimos sistemas transaccionales (ERP, contabilidad, nómina).** Nos integramos con ellos como fuente o destino de acción; no aspiramos a ser el sistema de registro de esos dominios.
5. **No vendemos autonomía total sin supervisión.** No es un objetivo de producto tener agentes que actúan sin ningún punto de control humano configurable. Quien busque "IA que hace lo que quiera sola" no es nuestro cliente objetivo.
6. **No competimos en ser el modelo más barato o más rápido.** No somos una capa de infraestructura de LLMs. El modelo es intercambiable; nuestro valor no vive ahí.
7. **No reemplazamos el juicio humano en decisiones de alto riesgo.** Ampliamos la capacidad operativa; no delegamos responsabilidad legal, ética o estratégica a un agente sin supervisión.

**Regla práctica**: si una propuesta de funcionalidad encaja mejor en esta lista que en la de §2, la respuesta por defecto es no construirla — o construirla como integración con un producto de terceros, nunca como núcleo de ATLAS AI.

---

## 4. Filosofía del producto

- **El conocimiento es el activo. Los agentes son la interfaz.** Un agente se puede reconfigurar, sustituir o eliminar sin pérdida — el Brain no. Cualquier decisión que invierta esta jerarquía está equivocada por definición.
- **La confianza se gana con trazabilidad, no se declara con marketing.** No decimos "confía en nuestra IA"; mostramos exactamente en qué se basó cada respuesta.
- **Gobernable antes que impresionante.** Una demo espectacular que no se puede auditar no es un producto de ATLAS AI, aunque funcione.
- **El valor compone con el tiempo.** Cuanto más tiempo usa una empresa la plataforma, más rico y preciso es su Brain, y más valiosos se vuelven sus Empleados Digitales — el producto debe estar diseñado para que esto sea cierto por construcción, no por casualidad.
- **Un Empleado Digital que no puede explicar su respuesta no es un empleado — es un riesgo.** Este es el estándar que aplicamos a toda funcionalidad nueva relacionada con IA.

---

## 5. Principios de diseño (qué construimos y cómo decidimos)

1. **Toda funcionalidad nueva debe fortalecer el Brain o exponerlo mejor.** Si una función no toca el conocimiento compartido — no lo alimenta, no lo consulta, no lo hace más accesible — hay que preguntarse seriamente si pertenece al núcleo del producto.
2. **Preferimos lo explicable a lo mágico.** Ante dos formas de resolver algo, se prefiere la que un humano pueda auditar por encima de la que impresiona más pero opaca el razonamiento.
3. **Configurable pero no infinito.** La configurabilidad es una herramienta, no un objetivo. Cada nueva opción de configuración debe justificar su complejidad con una necesidad real observada, no hipotética.
4. **Alcance limitado por defecto en cada Empleado Digital.** El principio de menor privilegio no es solo una decisión de seguridad (ADR-0001 §6.2) — es un principio de producto: preferimos varios Empleados Digitales con roles claros a un "super-agente" que todo lo puede.
5. **La gobernanza no se sacrifica por velocidad de lanzamiento.** Una funcionalidad que rompe auditoría, versionado o el Capability Model no se lanza "para después arreglarla" — se retrasa.

---

## 6. Principios de experiencia de usuario

1. **El "por qué" siempre está a un clic de distancia.** Cualquier respuesta o acción de un Empleado Digital debe permitir al usuario ver de inmediato qué conocimiento la originó — nunca una respuesta sin procedencia visible.
2. **La aprobación humana se diseña como control, no como trámite.** Los puntos de aprobación (human-in-the-loop) deben sentirse rápidos, contextuales y con información suficiente para decidir en segundos — si un punto de aprobación se siente burocrático, es un fallo de diseño, no una consecuencia inevitable de la gobernanza.
3. **Nunca se oculta qué conocimiento se usó, aunque el usuario no lo pida.** La transparencia es el estado por defecto, no una función avanzada que hay que activar.
4. **La metáfora de producto es "incorporar y formar a un empleado", no "configurar un software".** El onboarding de un Empleado Digital debe sentirse coherente con esa metáfora — define rol, le das acceso a lo que necesita saber, y lo supervisas al principio más de cerca.
5. **Simple por defecto, potente si se profundiza.** Un administrador nuevo no debe enfrentarse al Capability Model completo el primer día. La complejidad del sistema existe, pero se revela progresivamente según la necesidad del usuario.

---

## 7. Principios de inteligencia artificial

1. **Ningún agente actúa fuera de un alcance de capacidades explícito.** No existe la opción de un agente "sin restricciones configuradas" — el alcance vacío es el estado por defecto, no el máximo (ADR-0001 §6.2, ADR-0002 §5).
2. **Toda acción de alto impacto es aprobable por humanos, y esto no es una opción premium que se pueda quitar para vender velocidad.** La gobernanza no se comercializa como feature opcional.
3. **Los modelos LLM son intercambiables; el Brain y el gobierno no lo son.** No apostamos la identidad del producto a ningún proveedor de modelos — eso es infraestructura reemplazable, no ventaja competitiva.
4. **Explicabilidad por encima de autonomía.** Preferimos un agente más lento pero que justifica cada paso, a uno más rápido pero opaco. Esto se mantiene como principio incluso cuando la capacidad de los modelos permita más autonomía técnica.
5. **Un agente de IA se audita con el mismo estándar que un empleado humano, no con un estándar relajado "porque es una máquina".** Ninguna acción de un agente queda exenta de trazabilidad por ser "solo IA".

---

## 8. Principios de arquitectura

Estos principios ya están implementados técnicamente en los ADR-0001 a ADR-0003; aquí se elevan a nivel de identidad de producto, para que cualquier decisión futura los respete incluso si cambia la implementación concreta.

1. **El conocimiento compartido es la base del sistema; los agentes son consumidores efímeros de ese conocimiento**, nunca al revés (ADR-0002 §0).
2. **Multi-tenant por diseño, con aislamiento reforzado en más de una capa** — nunca una sola barrera entre los datos de una empresa y los de otra (ADR-0001 §5).
3. **Todo es auditable por defecto, desde el primer commit del sistema** — la auditoría no es una fase posterior del roadmap, es un requisito de existencia de cualquier funcionalidad (ADR-0001 §6.3, ADR-0002 §9, ADR-0003 §11).
4. **No hay estado compartido mutado libremente.** El conocimiento se versiona de forma append-only, las actualizaciones se gobiernan, y la concurrencia se resuelve evitando la mutación compartida, no bloqueándola (ADR-0002 §11).
5. **Todo lo que consume recursos de IA tiene un presupuesto explícito y verificable** — nunca "lo que haga falta" (ADR-0003 §8–9).

---

## 9. Principios comerciales

1. **Vendemos confianza y gobernanza, no volumen de agentes.** El modelo de precios no debe incentivar crear agentes innecesarios para justificar el gasto — se paga por valor entregado, no por cantidad de "empleados" desplegados.
2. **El precio escala con el valor entregado (uso/impacto real), con opción de asientos para compra corporativa tradicional.** Evitamos un modelo puramente por asiento que desconecte el precio del valor generado por el Brain.
3. **Cliente objetivo: organizaciones con procesos que dependen de conocimiento institucional real**, no el mercado masivo de "IA barata para cualquiera". Esto es una decisión deliberada de foco, no una limitación temporal.
4. **La expansión dentro de una cuenta ocurre porque el Brain se vuelve más valioso con el uso**, no porque el equipo comercial fuerce upsells. El producto está diseñado para que "land and expand" sea una consecuencia natural, no una táctica de ventas agresiva.
5. **No vendemos promesas de autonomía total.** La propuesta comercial es honesta sobre qué hace la IA y qué no — esto es parte de la marca, no una limitación a ocultar en la letra pequeña.

---

## 10. Cómo queremos que evolucione en los próximos diez años

**Años 1–2 — Consolidar la categoría.** ATLAS AI se establece como una categoría propia y reconocible ("plataforma de Empleados Digitales gobernados por conocimiento compartido"), no como una feature más dentro de otra herramienta. El Company Brain y el Capability Model son ya, en esta fase, lo que un cliente reconoce como el corazón del producto — no los agentes individuales.

**Años 3–5 — El Brain como sistema de registro.** El Company Brain de cada cliente se convierte en el sistema de registro de facto de su conocimiento operativo — más citado, más consultado y más confiable que los documentos dispersos que sustituyó. En esta fase, perder acceso al Brain debe sentirse, para un cliente, como perder acceso a su propia memoria organizacional — esa es la señal de que el producto cumplió su promesa central.

**Años 5–10 — Posición de infraestructura.** ATLAS AI aspira a ser la capa por la que cualquier sistema — humano o de IA, interno o de terceros — accede al conocimiento gobernado de una empresa. No una aplicación aislada más en el stack, sino la infraestructura de conocimiento sobre la que otras aplicaciones (incluidas las que no construimos nosotros) se apoyan.

**Constantes que no cambian en ninguna fase:**

- La disciplina de "gobernanza primero" se mantiene incluso cuando competidores vendan autonomía sin fricción como diferenciador — es la apuesta de marca a largo plazo, no una limitación técnica temporal.
- ATLAS AI nunca se convierte en una caja negra que "resuelve todo". A medida que los modelos sean más capaces, la explicabilidad se vuelve más difícil de mantener, no menos importante — y por eso se protege activamente, no se abandona por comodidad.

---

## 11. Cómo usar este documento — checklist de decisión

Ante cualquier duda sobre una funcionalidad, integración, cambio de UX o decisión comercial futura, responder en orden:

1. **¿Fortalece el Brain o lo diluye?** Si diluye el conocimiento compartido (crea un silo de conocimiento fuera de él, por ejemplo), no se construye tal como está planteado.
2. **¿Es explicable y auditable de punta a punta?** Si no se puede explicar de dónde sale un resultado, no se lanza — se rediseña hasta que se pueda.
3. **¿Respeta el Capability Model o lo evita?** Ninguna funcionalidad puede ofrecer un atajo que permita a un agente actuar fuera de su alcance definido, ni siquiera por conveniencia técnica temporal.
4. **¿Encaja en la lista de "qué NO resolvemos" (§3)?** Si sí, la respuesta por defecto es no construirlo dentro del núcleo — evaluar como integración con terceros, no como feature propia.
5. **¿Vendemos autonomía irresponsable o confianza gobernada?** Si una propuesta comercial o de producto requiere prometer autonomía sin supervisión para ser atractiva, no es una propuesta de ATLAS AI.
6. **¿El precio o el diseño incentivan crear complejidad innecesaria** (más agentes, más configuración, más superficie) **en vez de más valor real?** Si es así, se rediseña el incentivo, no solo la funcionalidad.

Si una decisión pasa estos seis filtros, es coherente con la visión del producto — incluso si contradice una intuición de mercado a corto plazo. Si una decisión de negocio a corto plazo entra en conflicto con este documento, el conflicto se resuelve explícitamente y por escrito (un nuevo PVD o una enmienda), nunca por omisión silenciosa.
