# PVD-0007 — ROI Intelligence Platform

| | |
|---|---|
| **Tipo de documento** | Product Vision Document — orientado al propietario de la empresa |
| **Estado** | Propuesto |
| **Fecha** | 2026-07-09 |
| **Se apoya en** | [PVD-0001](0001-product-vision-atlas-ai.md) (honestidad como principio comercial) · [PVD-0004](0004-atlas-home.md) (tono, disciplina anti-vanidad) · [PVD-0006](0006-atlas-intelligence-network.md) (benchmarking) |
| **Ejemplos ilustrados con** | [PVD-0005: Blueprint Dental](0005-atlas-dental-intelligence-blueprint.md) — este documento es horizontal, válido para cualquier vertical; el dental se usa porque ya está definido con detalle |

---

## 0. Por qué existe este documento

Un propietario de empresa no adopta un sistema de IA por curiosidad tecnológica. Lo adopta, lo mantiene o lo cancela por una sola razón: **si le devuelve más de lo que cuesta.**

Este documento no está escrito para el equipo técnico de ATLAS AI. Está escrito para responder, con números reales y trazables, la pregunta que se hace cualquier propietario a los tres meses de pagar una suscripción: *¿esto me está haciendo ganar dinero, ahorrar tiempo, o simplemente me está costando una cuota más?*

Y trae, además, un compromiso que no es habitual en software empresarial: **ATLAS AI muestra este número aunque sea modesto.** Si un mes el valor generado apenas cubre el coste de la plataforma, el propietario lo verá exactamente así — no porque sea buena publicidad, sino porque la confianza de todo el producto (PVD-0001 §4) depende de que las cifras que enseñamos sean siempre ciertas, nunca las más favorables.

---

## 1. El modelo de ROI

El valor que genera ATLAS AI se descompone en cuatro bloques, y ninguno se solapa con los demás — cada euro o cada hora se cuenta **una sola vez**, en el bloque que le corresponde:

```
Valor generado este mes
   = Costes evitados
   + Horas ahorradas (valorizadas)
   + Ingresos recuperados
   + Oportunidades creadas
   − Coste de la plataforma ATLAS AI
   ────────────────────────────────
   = ROI neto del mes
```

| Bloque | Responde a | Ejemplo |
|---|---|---|
| **Costes evitados** | ¿Qué gasto no tuve que hacer? | No contraté a una persona más en recepción para el pico de llamadas |
| **Horas ahorradas** | ¿Qué tiempo de mi equipo se liberó? | El equipo dedicó 14 horas menos a tareas repetitivas esta semana |
| **Ingresos recuperados** | ¿Qué dinero se habría perdido y no se perdió? | Un presupuesto que llevaba dos semanas sin respuesta, se cerró tras el seguimiento automático |
| **Oportunidades creadas** | ¿Qué valor nuevo apareció que antes no existía? | Se detectó capacidad libre en agenda y se ofreció a pacientes en lista de espera |

El **coste de la plataforma se resta siempre, de forma visible**, antes de mostrar cualquier cifra de ROI. Nunca se enseña "valor generado" sin restar lo que ATLAS AI cuesta ese mes — es la diferencia entre un informe honesto y un informe de marketing.

---

## 2. La regla de oro: todo euro se explica igual que una respuesta

En el resto de la plataforma, ningún Empleado Digital puede afirmar algo que no pueda citar (ADR-0005 §5, PVD-0001 §6). Este documento aplica exactamente el mismo estándar al dinero: **ninguna cifra de ROI aparece sin poder abrirse y mostrar, uno por uno, los hechos reales que la componen.**

Si el dashboard dice "1.240€ recuperados este mes en presupuestos", un clic debe llevar a la lista exacta de presupuestos concretos que estaban parados y se cerraron tras el seguimiento del sistema — con fecha, importe y el hilo de seguimiento que lo demuestra. Un número de ROI que no se puede desglosar así **no se publica**, exactamente con el mismo criterio con el que una respuesta sin cita no se entrega (ADR-0005 §5).

---

## 3. KPIs — el conjunto reducido que importa

Un propietario no necesita cuarenta métricas. Necesita las que realmente cambian una decisión:

| KPI | Por qué importa |
|---|---|
| Llamadas atendidas sin espera / llamadas que antes se habrían perdido | Mide capacidad de respuesta real, no solo volumen |
| Tiempo medio de primera respuesta (llamada, mensaje, presupuesto) | La velocidad de respuesta es, en la mayoría de negocios, el factor que más pesa en la decisión del cliente |
| Tasa de cierre de presupuestos, y su evolución | El indicador comercial más directo del negocio |
| Citas confirmadas automáticamente y huecos recuperados | Uso real de la capacidad instalada del negocio |
| Recall recuperado (pacientes/clientes que volvieron gracias a un recordatorio) | Retención sin esfuerzo comercial activo |
| Horas de equipo humano liberadas por semana | El tiempo que el equipo puede dedicar a lo que un sistema no puede hacer |
| ROI neto acumulado | La cifra que responde, sin rodeos, si merece la pena seguir |

Cada KPI de esta lista alimenta directamente uno de los cuatro bloques de §1 — no existe un KPI "suelto" que no se pueda explicar en términos de dinero u horas reales.

---

## 4. Costes evitados

Es el gasto que la empresa **no tuvo que hacer** gracias a que un Empleado Digital absorbió trabajo que, de otro modo, habría requerido contratar más personas, pagar horas extra, o externalizar un servicio.

Ejemplos reales medibles:

- Coste de contratar una persona adicional para cubrir el volumen de llamadas en horas punta — evitado si el volumen gestionado automáticamente equivale a esa carga de trabajo.
- Coste de un servicio externo de atención de llamadas fuera de horario — evitado si ese volumen ya se gestiona dentro de la plataforma.
- Coste de una agencia externa para redactar campañas — evitado o reducido si los borradores los genera el Empleado Digital de Campañas (revisados por el propietario antes de enviarse, como establece PVD-0005 §14).

Cada coste evitado se calcula contra un **coste de referencia real** (lo que costaría contratar, externalizar o pagar horas extra en el mercado local), nunca contra una cifra inflada de conveniencia.

---

## 5. Horas ahorradas

Es el tiempo del equipo humano que se liberó porque un Empleado Digital absorbió una tarea repetitiva — medido en horas, no solo en euros, porque el tiempo liberado tiene un valor que no siempre es sustituible por dinero (el equipo lo redirige a atención al cliente, a formación, a tareas que sí requieren su criterio).

Se muestra en dos capas, nunca mezcladas:

1. **Horas reales liberadas** — la cifra dura: cuántas horas de trabajo humano habría exigido lo que el sistema hizo, calculado sobre el tiempo medio real que ese tipo de tarea le llevaba al equipo antes de tener ATLAS AI.
2. **Valor estimado de esas horas** (opcional, secundario) — una traducción a euros usando el coste medio de esas horas de trabajo, siempre marcada como estimación, nunca como una cifra dura equivalente a un coste evitado (§4) — para no contar el mismo valor dos veces.

---

## 6. Ingresos recuperados

Es dinero que, con una probabilidad razonable, se habría perdido sin la intervención de un Empleado Digital — y que se recuperó de verdad.

Esta es la categoría donde más disciplina se exige, porque es la más fácil de inflar y la que más rápido destruye confianza si se exagera. La regla: **solo se cuenta como "recuperado" lo que tiene una marca de comportamiento observable que lo justifica**, nunca una suposición genérica.

Ejemplos con su marca de comportamiento exigida:

| Ejemplo | Qué se exige para contarlo |
|---|---|
| Presupuesto cerrado tras seguimiento | El presupuesto llevaba un periodo sin respuesta del paciente/cliente, el sistema hizo seguimiento activo, y se aceptó después de ese contacto |
| Revisión recuperada | El paciente estaba fuera de plazo de su revisión periódica, recibió un recordatorio del sistema, y agendó a raíz de ese contacto |
| Hueco de agenda recuperado | Una cancelación dejó un hueco, el sistema lo ofreció a la lista de espera, y se ocupó |
| Cliente reactivado | El cliente llevaba un periodo de inactividad definido, recibió una campaña de reactivación, y volvió a interactuar tras ella |

Si no existe esa secuencia de comportamiento observable, el ingreso no se cuenta como "recuperado" — se puede haber generado igualmente, pero de forma que no se puede atribuir con honestidad, y lo que no se puede atribuir con honestidad, en este documento, no se cuenta.

---

## 7. Oportunidades creadas

Es el bloque de **menor certeza**, y se presenta siempre marcado como tal — nunca con la misma seguridad que costes evitados o ingresos recuperados, porque aquí se trata de valor que no existía como expectativa previa, no de algo que se estaba a punto de perder.

Ejemplos:

- Capacidad de agenda no utilizada que se identificó y se ofreció activamente, generando una cita que de otro modo no habría existido.
- Un patrón detectado (p. ej. "muchos pacientes preguntan por un tratamiento que no se está promocionando activamente") que llevó a una acción comercial con resultado medible.
- Una mejora de proceso adoptada a partir de una comparación de red (Atlas Intelligence Network, PVD-0006 §10) que tuvo impacto verificable después de aplicarse.

Estas cifras se muestran con una etiqueta visible de "estimación" y, cuando es posible, con un rango en vez de una cifra única — la honestidad sobre la incertidumbre es parte del valor que este documento promete.

---

## 8. Valor por llamada

Traducir el ROI agregado a una unidad que un propietario entiende de un vistazo: *¿cuánto vale, de media, cada llamada que gestiona mi Empleado Digital de Recepción?*

```
Valor por llamada
   = coste evitado de gestión manual de esa llamada
   + (probabilidad de conversión a cita × valor medio de una cita nueva)
```

Ejemplo ilustrado (dental, PVD-0005 §7): si gestionar una llamada manualmente cuesta de media 3€ en tiempo de recepción, y 1 de cada 8 llamadas gestionadas se convierte en una cita nueva valorada en 90€ de media, el valor medio por llamada gestionada ronda los **14€** — una cifra que un propietario puede multiplicar mentalmente por su volumen mensual de llamadas sin necesitar ver ningún dashboard.

---

## 9. Valor por presupuesto

```
Valor por presupuesto
   = valor medio del presupuesto
   × incremento en la tasa de cierre atribuible al seguimiento automático
```

Ejemplo ilustrado: si el presupuesto medio de un tratamiento es de 1.800€, y el seguimiento activo del Empleado Digital de Presupuestos (PVD-0005 §11) eleva la tasa de cierre en 6 puntos porcentuales frente al histórico sin seguimiento, el valor atribuible por cada presupuesto emitido es de aproximadamente **108€ de media**, incluso antes de saber si ese presupuesto concreto se cerró — es el valor esperado de tener seguimiento activo, no solo el de los casos que efectivamente cerraron.

---

## 10. Valor por cita

```
Valor por cita
   = valor de la cita en sí (evitar un hueco vacío)
   + valor de continuidad de la relación (probabilidad de que ese paciente/cliente vuelva)
```

Una cita gestionada bien no vale solo lo que factura ese día — vale también la probabilidad de que ese paciente vuelva a la clínica en el futuro. Este documento incluye esa segunda componente de forma explícita pero conservadora (con un horizonte corto, típicamente la siguiente revisión esperada, no una proyección de años de relación) — para no inflar el valor de una sola cita con expectativas que aún no se han cumplido.

---

## 11. Cómo se calcula con honestidad

Cinco reglas que gobiernan cada cifra de este sistema, sin excepción:

1. **Nunca se compara contra un escenario inventado de "cero automatización".** Se compara contra lo que la propia empresa hacía antes de activar cada función concreta — su propio histórico real, no una suposición de mercado.
2. **Ningún evento se cuenta en dos bloques.** Una hora ahorrada que además evitó una contratación se cuenta como coste evitado (§4), no como horas ahorradas y coste evitado a la vez.
3. **Los grados de certeza se muestran de forma distinta.** Costes evitados e ingresos recuperados se presentan como hechos verificados; oportunidades creadas se presenta siempre como estimación (§7).
4. **El coste de la plataforma siempre se resta**, de forma visible, antes de mostrar cualquier cifra neta (§1) — nunca se enseña solo el lado positivo.
5. **Toda cifra es trazable a eventos reales**, con un clic, hasta el hecho concreto que la sostiene (§2) — si no se puede trazar, no se publica.

---

## 12. El dashboard financiero

Vive enlazado desde ATLAS Home (PVD-0004 §4.4, "Salud de la empresa") y mantiene su mismo lenguaje: calmado, preciso, sin adornos, sin gamificación.

**Cabecera** — una sola cifra, la que de verdad importa:

> *"Este mes, ATLAS AI generó 3.420€ de valor neto para tu negocio — 4,8 veces lo que pagas por la plataforma."*

Debajo, sin necesidad de scroll, el desglose de los cuatro bloques de §1, cada uno con su cifra y un único clic para expandir su detalle trazable:

| Bloque | Cifra del mes | Certeza |
|---|---|---|
| Costes evitados | 640€ | Verificado |
| Horas ahorradas | 38 horas (≈ 760€ estimados) | Verificado (horas) / Estimado (€) |
| Ingresos recuperados | 2.180€ | Verificado |
| Oportunidades creadas | 480–720€ | Estimado |

**Valor por unidad** — una fila breve con las tres cifras de §8–§10 ("14€ por llamada · 108€ por presupuesto emitido · 62€ por cita gestionada"), como referencia rápida sin necesidad de cálculo.

**Comparación de red** (solo si la organización participa en Atlas Intelligence Network, PVD-0006): una frase, no una tabla de clasificación — *"Tu ROI por presupuesto está por encima de la media de clínicas de tamaño similar"* — con el mismo tono sobrio que cualquier benchmark de PVD-0006 §10.

**Tendencia** — evolución mes a mes en una sola línea simple, sin proyecciones especulativas mezcladas con datos reales; si se muestra una proyección, se etiqueta como tal de forma inequívoca, nunca en el mismo trazo visual que lo ya ocurrido.

**Cierre de la pantalla** — nunca una felicitación genérica. Si el ROI del mes fue bajo, la pantalla lo dice con la misma calma que si hubiera sido alto, y —cuando sea posible— apunta a qué bloque tuvo menos actividad ese mes, para que el propietario entienda el porqué, no solo el número.

---

## 13. Cómo usar este documento

Ante cualquier propuesta futura de añadir una nueva cifra de valor al dashboard financiero, una pregunta antes que cualquier otra:

**¿Puede el propietario hacer clic sobre esta cifra y ver, sin ambigüedad, los hechos reales que la sostienen?**

Si la respuesta es no, la cifra no se publica tal como está — se rediseña hasta que lo sea, o se descarta. Un sistema de IA que le pide a un propietario que confíe en su criterio (PVD-0005) no puede, al mismo tiempo, pedirle que confíe a ciegas en sus números. El ROI de ATLAS AI se gana exactamente igual que se gana cualquier otra respuesta de la plataforma: mostrando, no prometiendo.
