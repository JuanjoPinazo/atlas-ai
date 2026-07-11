# PVD-0004 — ATLAS Home

| | |
|---|---|
| **Tipo de documento** | Product Vision Document — diseño de la pantalla principal |
| **Estado** | Propuesto |
| **Fecha** | 2026-07-09 |
| **Se apoya en** | [PVD-0001](0001-product-vision-atlas-ai.md) (principios de UX) · [PVD-0002](0002-first-customer-experience.md) (tono, restricción, "no confeti") · [PVD-0003](0003-business-dna.md) (tono heredado del carácter de la empresa) |
| **Se alimenta de** | [ADR-0002: Company Brain](../adr/0002-company-brain.md) · [ADR-0005: Decision Engine + Validation Engine](../adr/0005-decision-engine-validation-engine.md) (aprobaciones, detenciones, validaciones) |

---

## 0. Por qué esto no es un dashboard

Un dashboard te enseña números y te deja el trabajo de interpretarlos. Cuarenta widgets, todos con el mismo peso visual, ninguno con criterio. El usuario llega, escanea, no sabe por dónde empezar, y cierra la pestaña sin haber decidido nada.

ATLAS Home hace lo contrario: **ya hizo la síntesis por ti.** No te enseña que hubo 34 conversaciones ayer — te dice qué de esas 34 conversaciones merece tu atención hoy, y por qué. La diferencia entre un dashboard y esta pantalla es la misma diferencia que hay entre un informe de datos y que alguien de confianza entre a tu despacho y te diga: "esto es lo que pasó, esto necesito que decidas, y esto va bien solo".

Esa es la pantalla que vamos a diseñar.

---

## 1. La metáfora: quién te habla

Esta pantalla habla con **una sola voz, coherente y con criterio** — pero esa voz no es un personaje nuevo. No tiene nombre propio, no tiene avatar, no aparece en la lista de Empleados Digitales de la empresa. Es, deliberadamente, la forma en que **ATLAS como plataforma** resume el trabajo hecho por todo el equipo digital de la empresa.

Esta es una decisión de diseño, no un detalle: si le diéramos nombre y cara a "quien te saluda cada mañana", estaríamos creando un agente más — y el principio fundacional de ATLAS AI es que ningún agente es el centro del sistema ([PVD-0001 §4](0001-product-vision-atlas-ai.md)). El Director de Operaciones Digital no es alguien. Es la voz con la que el conocimiento, las decisiones y el trabajo de tus Empleados Digitales se te presentan de forma unificada, una vez al día.

Por eso el lenguaje de esta pantalla dice **"tu equipo"**, no **"yo"**. "Tu equipo gestionó 34 conversaciones anoche" — no "Gestioné 34 conversaciones anoche".

---

## 2. Información prioritaria

No todo lo que ocurrió merece un lugar en esta pantalla. El orden de aparición sigue una jerarquía estricta, siempre la misma, sin excepción:

1. **Lo que requiere una decisión tuya ahora** — aprobaciones pendientes, conflictos de política sin resolver. Nada es más importante que esto, porque hay trabajo real detenido esperando.
2. **Lo que indica riesgo** — una detención inesperada, una caída de confianza en un dominio, una fuente de conocimiento que dejó de sincronizarse.
3. **Lo que indica oportunidad** — un patrón que el sistema notó y que tiene valor de negocio.
4. **Lo que es simplemente estado** — salud general, objetivos, progreso. Importante, pero nunca urgente, y por eso nunca ocupa el primer scroll.

Ninguna categoría inferior aparece antes que una superior con contenido pendiente, sin importar qué tan atractiva sea visualmente. Un dashboard normal pondría el gráfico bonito arriba. Esta pantalla nunca lo hace si hay algo esperando una decisión.

**Restricción dura de contenido**: lo esencial de la pantalla debe leerse sin necesidad de más de un scroll. Si un día hay más de lo que cabe en ese espacio, se resume y se enlaza a una vista completa — nunca se alarga la pantalla principal para caber todo.

---

## 3. Tono

El tono de esta pantalla **no es fijo** — hereda el `DNAToneProfile` de la empresa (PVD-0003 §3.1, §9). Una organización con un DNA formal recibe una redacción medida y precisa; una con un DNA cercano recibe una redacción más cálida y directa. Pero, sea cual sea el DNA, hay reglas de tono que **no dependen del carácter de la empresa** y se aplican siempre:

- **Nunca hype.** Cero signos de exclamación por defecto, cero "¡Buen trabajo!", cero gamificación, cero confeti — el mismo principio de cierre ya establecido en el minuto 15 del onboarding ([PVD-0002 §10](0002-first-customer-experience.md)) se aplica aquí todos los días, no solo el primero.
- **Preciso, no genérico.** "Un cliente preguntó tres veces por el mismo error de facturación esta semana" en vez de "Actividad de soporte elevada".
- **Nunca alarmista sin motivo.** Un riesgo se nombra con la misma calma con la que se nombra un logro — la urgencia se transmite por posición en la jerarquía (§2), no por mayúsculas ni color rojo agresivo.
- **Siempre justificable.** Cada frase de esta pantalla, igual que cualquier respuesta de un Empleado Digital, debe poder trazarse a datos reales del sistema (§7) — la disciplina anti-alucinación de ADR-0005 no se relaja porque esto sea "solo un resumen".

---

## 4. Arquitectura de la pantalla

Siete zonas, de arriba hacia abajo, en este orden fijo. Una zona sin contenido real ese día **no se muestra vacía ni con un placeholder** — desaparece (desarrollado en §6).

### 4.1 Saludo

Una sola línea. No es "Buenos días, Juanjo" — ese saludo no dice nada. Es la línea que ya contiene lo más importante del día, calibrada por hora y por lo que hay pendiente:

> *"Buenos días. Hay dos cosas esperando tu decisión antes de que el equipo pueda seguir con dos tareas."*

Si no hay nada pendiente:

> *"Buenos días. Todo avanzó solo anoche — no hace falta nada de ti ahora mismo."*

El saludo nunca es intercambiable entre un día ocupado y uno tranquilo. Si sonara igual en ambos casos, no estaría cumpliendo su función.

### 4.2 Resumen diario

Tres a cinco frases, en prosa — no una lista de bullets. Es el equivalente textual de que alguien te informe verbalmente antes de tu primera reunión: qué trabajó el equipo digital, qué se resolvió solo, qué generó fricción. Se escribe **una vez, al principio del día**, y no se reescribe cada vez que ocurre un evento menor — a diferencia de la zona 4.3, esta no es una vista en vivo. Es un resumen, no un feed.

> *"Tu equipo digital gestionó 34 conversaciones desde ayer. La mayoría (28) se resolvieron sin intervención, con una confianza alta y respaldadas por tu base de conocimiento. Tres se marcaron para tu revisión antes de responder — están abajo. Además, notamos que el dominio de Producto no ha recibido documentos nuevos en tres semanas; puede que valga la pena revisarlo."*

### 4.3 Lo que necesita de ti ahora

La zona de mayor prioridad visual, justo debajo del resumen. Contiene, sin mezclar:

- **Aprobaciones pendientes** (`APPROVAL_REQUIRED`, ADR-0005 §4.4) — cada una como una tarjeta de Alerta con acción de un clic (aprobar/rechazar) y el contexto mínimo necesario para decidir sin salir de la pantalla.
- **Conflictos de política sin resolver** (`POLICY_CONFLICT`, ADR-0005 §4.5) — nunca autoresueltos, siempre presentados con las dos políticas en conflicto explícitas, no como un error genérico.
- **Ejecuciones detenidas** (`EXECUTION_HALTED`, ADR-0005 §4.7) que requieren decisión humana para continuar o descartar.

Esta zona, a diferencia de 4.2, **sí se actualiza en vivo** — si llega una nueva aprobación mientras el propietario está mirando la pantalla, aparece sin necesidad de recargar. Es la única zona con esa propiedad, porque es la única donde el tiempo de respuesta importa de verdad.

### 4.4 Salud de la empresa

No son métricas de vanidad. Es una respuesta corta y honesta a: **¿está funcionando bien mi plantilla digital?**

- Cobertura y frescura del Company Brain por dominio (¿hay dominios con conocimiento desactualizado u obsoleto?).
- Tasa de validación de respuestas (`validation_events`, ADR-0005 §10) — no como porcentaje frío, sino como frase: *"9 de cada 10 respuestas pasaron todas las verificaciones sin necesidad de reintento."*
- Cualquier fuente de conocimiento que dejó de sincronizarse.

Se presenta con un lenguaje de estado, no de KPI: **bien / atención / requiere revisión** — tres niveles, nunca un número aislado sin contexto de qué significa.

### 4.5 Oportunidades

Distinta de una Alerta y distinta de una Recomendación (la diferencia se define en §5). Una oportunidad es algo que el sistema **notó** con potencial de valor, pero que requiere reflexión del propietario, no una acción de un clic:

> *"El 40% de las preguntas de soporte esta semana fueron sobre el mismo proceso de devolución. Podría valer la pena convertirlo en una guía dedicada — tu equipo digital respondería más rápido y de forma más consistente."*

Máximo dos o tres por día. Una oportunidad que se repite sin acción durante varios días no se repite indefinidamente — se agrupa o se retira, para no entrenar al propietario a ignorarla.

### 4.6 Tareas sugeridas

La zona más táctica: cosas concretas y de bajo riesgo que el equipo digital ya está en condiciones de hacer, pero que nadie le ha pedido todavía.

> *"Tu Empleado Digital de Soporte tiene acceso al dominio de Facturación pero nunca lo ha usado. ¿Quieres que empiece a responder también preguntas de facturación?"*

Cada tarea sugerida tiene una única acción disponible ("Activar" / "Ignorar") — nunca abre un formulario de configuración desde aquí.

### 4.7 Objetivos

La zona de horizonte más largo, y por eso la última. Objetivos que la empresa definió (explícita o implícitamente, a través de las prioridades operativas de su Business DNA, PVD-0003 §1) con progreso visible, sin insistencia:

> *"Reducir el tiempo medio de primera respuesta — 3.2h esta semana, frente a 5.1h hace un mes."*

Sin barras de progreso gamificadas, sin celebraciones al alcanzar un hito — un objetivo cumplido se marca con la misma calma que uno en curso.

---

## 5. Alertas, Recomendaciones y Oportunidades — la diferencia

Tres términos que se usan sueltos en muchos productos y que aquí tienen significados distintos y no intercambiables:

| Término | Qué significa | Nivel de urgencia | Acción esperada |
|---|---|---|---|
| **Alerta** | Algo requiere tu decisión o indica riesgo real | Alta — vive en la zona 4.3 | Aprobar, rechazar o resolver, normalmente en un clic |
| **Recomendación** | El sistema sugiere una acción concreta, de bajo riesgo, que puedes aceptar sin pensarlo mucho | Baja — puede vivir junto a cualquier zona relevante (p. ej. una recomendación de salud en 4.4, una recomendación táctica en 4.6) | Aceptar o descartar en un clic |
| **Oportunidad** | El sistema notó un patrón con valor potencial que merece que lo pienses, no que lo aceptes de inmediato | Media, pero no urgente — vive en la zona 4.5 | Reflexionar, no ejecutar en el acto |

Confundir estas tres categorías en la interfaz sería el mismo error que confundir un hecho con un rasgo de carácter en Business DNA — cada una tiene su propio contrato de urgencia y de acción, y mezclarlas entrena al usuario a ignorar todas por igual.

---

## 6. Cuando no hay nada que decir — el día tranquilo

Este es, quizás, el principio más importante de todo el documento: **un día tranquilo se ve tranquilo.**

La tentación de cualquier pantalla de inicio es rellenarse a sí misma para justificar su propia existencia — mostrar algo, lo que sea, para no parecer vacía. ATLAS Home hace exactamente lo contrario. Si no hay aprobaciones pendientes, la zona 4.3 no existe ese día, ni con un mensaje de "todo en orden" ocupando espacio — simplemente no está. Si no hay oportunidades nuevas que notar, la zona 4.5 no aparece. El saludo (4.1) y el resumen (4.2) son las únicas dos zonas que aparecen siempre, porque son las que confirman, con su propio contenido, que efectivamente no hace falta nada más.

Un día con la pantalla casi vacía no es un fallo del producto. Es la prueba de que la plantilla digital está funcionando bien sin necesitar al propietario — y eso, dicho con la misma calma que todo lo demás, es exactamente la promesa del producto (PVD-0001 §1).

---

## 7. De dónde vienen los datos

Sin entrar en esquema de tablas (eso corresponde a un ADR, no a este documento), cada zona tiene una fuente real y auditable, nunca inventada para la ocasión:

| Zona | Fuente |
|---|---|
| Resumen diario | Agregación de `decision_events` y `validation_events` (ADR-0005) del periodo, más estadísticas de ingesta del Brain (ADR-0002) |
| Lo que necesita de ti | `approval_requests`, `policy_evaluations` con conflicto, `execution_halts` (ADR-0005) |
| Salud de la empresa | Cobertura/vigencia de `KnowledgeUnit` por dominio (ADR-0002), tasa de `VALIDATED` vs `REJECTED` (ADR-0005 §10) |
| Oportunidades | Patrones detectados sobre `retrieval_events` (ADR-0003) — gobernados con el mismo principio de propuesta-antes-de-mostrar que una `KnowledgeProposal` o una `DNAChangeProposal`: una oportunidad nunca se presenta como un hecho, siempre como una observación con su respaldo visible si se pide |
| Tareas sugeridas | Capacidad declarada pero no usada de cada Empleado Digital, cruzada con dominios activos del Brain |
| Objetivos | Prioridades operativas del Business DNA (PVD-0003 §1) convertidas en métricas de seguimiento simples |

Como con cualquier respuesta de un Empleado Digital, si el propietario toca cualquier frase de esta pantalla, debe poder ver de dónde sale — la explicabilidad no es una función exclusiva del chat, es una propiedad de toda la plataforma.

---

## 8. Qué NO hace esta pantalla

1. **No es un feed en tiempo real de todo lo que pasa.** Salvo la zona 4.3, esta pantalla no jitterea ni se reescribe constantemente — se piensa una vez al día, como una persona pensaría antes de darte los buenos días.
2. **No usa gamificación.** Sin rachas, sin insignias, sin barras de progreso festivas, sin "¡vas genial!". La confianza en un sistema de IA empresarial no se construye con dopamina barata.
3. **No muestra métricas sin interpretación.** Ningún número aparece solo — siempre acompañado de qué significa y, cuando aplica, qué se sugiere hacer con él.
4. **No introduce un nuevo agente con nombre y cara.** La voz que narra esta pantalla es la de la plataforma, no la de un personaje nuevo (§1).
5. **No se llena artificialmente en días tranquilos.** (§6, la regla que más cuesta respetar y la que más importa.)

---

## 9. Heurística de cierre

Ante cualquier propuesta futura de añadir algo a ATLAS Home, tres preguntas, en orden:

1. **¿En qué zona de la jerarquía de §2 vive esto — decisión, riesgo, oportunidad o estado?** Si no encaja en ninguna con claridad, no entra en Home; entra en la vista detallada correspondiente.
2. **¿Puede el propietario trazar esta frase hasta un dato real, igual que trazaría la respuesta de un Empleado Digital?** Si no, no se muestra tal como está — se rediseña hasta que se pueda.
3. **¿Seguiría teniendo sentido esta pantalla un día en que no hay nada de esto que mostrar?** Si la respuesta es no — si la función solo existe para que la pantalla "se vea llena" — la función no pertenece aquí.

La mejor pantalla de inicio para un software empresarial de IA no es la que más muestra. Es la que sabe, con criterio real, cuándo no hace falta mostrar nada.
