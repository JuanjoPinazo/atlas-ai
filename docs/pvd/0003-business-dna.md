# PVD-0003 — Business DNA

| | |
|---|---|
| **Tipo de documento** | Product Vision Document — documento de referencia del comportamiento empresarial |
| **Estado** | Propuesto |
| **Fecha** | 2026-07-09 |
| **Se apoya en** | [PVD-0001](0001-product-vision-atlas-ai.md) · [PVD-0002](0002-first-customer-experience.md) |
| **Condiciona el comportamiento de** | [ADR-0002: Company Brain](../adr/0002-company-brain.md) · [ADR-0003: Context Engine](../adr/0003-context-engine-retrieval-pipeline.md) · [ADR-0005: Decision Engine + Validation Engine](../adr/0005-decision-engine-validation-engine.md) |
| **Nota de alcance** | Este documento define el concepto, su representación conceptual y su efecto en cada sistema. El esquema de datos exhaustivo (tablas, servicios) se formaliza en un ADR posterior — candidato natural para el ADR-0004 pendiente. |

---

## 0. La distinción que justifica este documento

Company Brain (ADR-0002) responde a una pregunta: **¿qué sabe la empresa?**

Este documento responde a otra, distinta y anterior: **¿quién es la empresa mientras actúa sobre lo que sabe?**

Dos empresas pueden subir exactamente los mismos documentos a su Company Brain — la misma política de reembolsos, el mismo manual de soporte — y aun así merecer Empleados Digitales que se comportan de forma reconociblemente distinta: uno responde en el acto, otro pide revisión antes de prometer nada; uno es cercano, otro es formal; uno prioriza cerrar rápido, otro prioriza no equivocarse nunca en una cifra. Esa diferencia no está en los documentos. Está en el **carácter** de la empresa.

**Business DNA es la representación estructurada, versionada y gobernada de ese carácter.** Si Company Brain es la memoria de la empresa, Business DNA es su temperamento — y es, junto al Brain, el otro cimiento sobre el que se construye todo comportamiento observable de un Empleado Digital.

---

## 1. Qué es el Business DNA

Business DNA es el conjunto estructurado de:

- **Valores declarados y priorizados** — no una lista plana, sino un orden: qué gana cuando dos valores entran en tensión.
- **Apetito de riesgo** — cuánta autonomía se siente cómoda dando, por categoría de acción y, si hace falta, por dominio.
- **Tono y estilo de comunicación** — cómo habla la empresa cuando habla a través de un Empleado Digital.
- **Prioridades operativas** — qué se optimiza primero cuando dos buenas decisiones compiten (p. ej. "cliente antes que velocidad").
- **Líneas rojas** — comportamientos que nunca ocurren, sin excepción, sin importar el contexto ni la urgencia.

No es un campo de texto libre tipo "system prompt". Es un conjunto de dimensiones nombradas, con valores explícitos, versionadas y auditables — coherente con el resto de la plataforma, donde nada gobernante vive como texto sin estructura (ADR-0002 §1, ADR-0005 §2).

---

## 2. Qué NO es el Business DNA

1. **No es un generador de personalidad decorativa.** No existe para que un agente "tenga chispa" — existe para que el comportamiento de la empresa sea consistente y explicable.
2. **No sustituye al Capability Model ni a Policies.** El DNA **parametriza sus valores por defecto**; la aplicación real de permisos y reglas sigue viviendo, exactamente igual, en el Decision Engine y el Policy Evaluator (ADR-0005). El DNA decide *cuán cauteloso empezar siendo*; no decide caso por caso.
3. **No es modificable por cualquiera.** Solo usuarios humanos con autorización suficiente (típicamente Owner/Admin) pueden cambiarlo — nunca un agente por su cuenta, y nunca un usuario final conversando con un agente ("sé más flexible conmigo" de un cliente externo no debe tocar el DNA de la empresa, jamás).
4. **No es el mismo objeto que el conocimiento del Brain.** Un hecho ("nuestra política de reembolso es de 30 días") es Company Brain. Un rasgo de carácter ("preferimos perder una venta antes que prometer algo que no cumpliremos") es Business DNA. Cuando haya duda sobre dónde vive un dato nuevo, esta es la pregunta que la resuelve (retomada en §12).

---

## 3. Cómo se representa

### 3.1 Entidades

| Entidad | Qué captura |
|---|---|
| `BusinessDNAProfile` | El perfil raíz por organización — versionado, igual que una `KnowledgeUnit` (append-only, `valid_from`/`valid_to`) |
| `DNATrait` | Un rasgo con nombre y valor/peso — p. ej. `tolerancia_al_riesgo: media`, `formalidad: alta`, `prioridad_cliente_vs_velocidad: cliente` |
| `DNARedLine` | Una restricción absoluta — con alcance (`domain_scope`), descripción, y nivel de fricción requerido para modificarla (§10) |
| `DNAToneProfile` | Parámetros de estilo de comunicación — formalidad, calidez, verbosidad — heredados por defecto por cada Empleado Digital nuevo |
| `DNAChangeProposal` | Un cambio pendiente de confirmación, con su origen (§4) |
| `DNAChangeEvent` | El registro auditado de cada cambio ya aplicado |

### 3.2 Jerarquía con herencia

El DNA no es plano — se hereda y se puede refinar, nunca se contradice en silencio:

```
BusinessDNAProfile (organización)
        │
        ├── override opcional por KnowledgeDomain
        │        (p. ej. el dominio Legal hereda "tolerancia_al_riesgo: media"
        │         de la organización, pero la sobrescribe a "baja")
        │
        └── override opcional por Empleado Digital
                 (un agente concreto puede matizar tono sin heredar
                  automáticamente cualquier cambio futuro del perfil general)
```

Todo override queda registrado como una desviación explícita del valor heredado, nunca como un valor "distinto sin explicación" — el mismo principio de trazabilidad que rige el resto de la plataforma.

---

## 4. Cómo se aprende

Tres fuentes, con gobernanza distinta según cuán directa es la autoría humana:

1. **Onboarding explícito.** El Momento 4 del wizard de incorporación (PVD-0002, "¿Puede responder directamente o prefieres revisar?", "¿Hay algo que no debería tocar?") es la primera siembra real del DNA de una empresa — no solo del Capability Model y las Policies como se describió allí: esas mismas respuestas son, simultáneamente, la primera versión de `DNATrait` (apetito de riesgo) y `DNARedLine` (exclusiones) de la organización.
2. **Inferencia observada.** El sistema observa patrones reales de uso: qué `approval_requests` se aprueban sistemáticamente sin cambios, cuáles se rechazan siempre, qué respuestas los humanos editan antes de enviar (una señal de tono, no solo de contenido). Estos patrones generan `DNAChangeProposal` con origen `inferred` — **nunca se aplican directamente**. Igual que una `KnowledgeProposal` de agente (ADR-0002 §8), pasan por confirmación antes de ser canónicas.
3. **Conversación directa** con un humano autorizado — desarrollado en detalle en §10.

Regla común a las tres: **ningún cambio de DNA es silencioso.** La diferencia entre las fuentes está en cuánta fricción de confirmación exige cada una, no en si la exigen.

---

## 5. Cómo evoluciona

- **Versionado append-only**, mismo patrón que las `KnowledgeUnit` (ADR-0002 §6): un cambio de DNA nunca sobrescribe el anterior, crea una nueva versión con `valid_from`, y la anterior queda con `valid_to` — permite reconstruir "qué carácter tenía la empresa" en cualquier momento pasado, imprescindible para poder explicar por qué un agente actuó con cierta cautela en una fecha concreta.
- **Fricción deliberada, a diferencia del Brain.** El Company Brain está diseñado para crecer sin fricción — cuantos más documentos, mejor. El Business DNA está diseñado exactamente al revés: cambia poco, y cada cambio es un evento visible, nunca un efecto secundario de otra acción. Un carácter que cambia todos los días no es un carácter, es ruido — y un sistema de IA empresarial con un carácter inestable es, por definición, menos confiable, no más flexible.
- **Auditoría completa.** Cada `DNAChangeEvent` registra: qué rasgo cambió, valor anterior, valor nuevo, origen (onboarding/inferred/conversational), quién lo autorizó, y cuándo entró en vigor — alimenta el módulo Audit transversal (ADR-0001 §6.3) como tipo de evento `dna.change`, siguiendo el mismo patrón que `knowledge.*`, `decision.*` y `validation.*`.

---

## 6. Cómo afecta al Company Brain

El DNA no cambia *qué* se almacena en el Brain — cambia cómo se prioriza y se clasifica lo que ya existe:

- **Pesos de ranking por defecto** (ADR-0003 §7): una organización cuyo DNA prioriza "rigor sobre velocidad" arranca con `w_t` (peso de confianza de fuente) más alto por defecto en sus dominios sensibles; una organización que prioriza velocidad arranca con `w_r` (relevancia) dominante.
- **Clasificación de sensibilidad por defecto.** Un DNA que declara "privacidad" como valor prioritario eleva el `sensitivity_level` por defecto asignado durante la ingesta (ADR-0002 §8), incluso antes de que un humano lo revise explícitamente.
- **Prioridad de indexación.** Los dominios que el DNA marca como críticos (p. ej. "cliente antes que todo" → dominio Soporte) reciben prioridad de procesamiento en el pipeline de ingesta cuando hay contención de recursos.

El Brain sigue siendo la única fuente de verdad factual — el DNA solo decide cómo se pesa y se protege esa verdad por defecto.

---

## 7. Cómo afecta al Decision Engine

El DNA es la fuente de la que derivan los umbrales por defecto de todo el mecanismo descrito en ADR-0005:

- **`coverage_score` mínimo** (ADR-0005 §4.1) más exigente en organizaciones con apetito de riesgo bajo — un DNA cauteloso no deja avanzar con contexto parcial tan fácilmente como uno que prioriza velocidad.
- **Categorías de acción que requieren `APPROVAL_REQUIRED`** (§4.4) — el Momento 4 del onboarding (PVD-0002) las fija por primera vez, pero el DNA es el mecanismo general que las mantiene y las propaga a nuevos Empleados Digitales que se creen después, sin tener que repetir la pregunta cada vez.
- **Umbrales de `HaltController`** (§4.7) — cuántos intentos fallidos se toleran antes de detener, cuán agresivamente se agota el presupuesto de follow-up — calibrados por el apetito de riesgo declarado.
- **Líneas rojas como axiomas del Policy Evaluator.** Esto es la pieza más importante de esta sección: una `DNARedLine` **no es una política más que puede entrar en conflicto** con otra (ADR-0005 §4.5). Se evalúa primero, siempre gana, y su implicación nunca produce un estado `POLICY_CONFLICT` — produce directamente denegación o detención. `POLICY_CONFLICT` queda reservado, por definición, para contradicciones entre políticas *no constitucionales*. Las líneas rojas son la constitución; las políticas ordinarias son la legislación que se mueve dentro de ella.

---

## 8. Cómo afecta al Validation Engine

- **Umbral de confianza** (`ConfidenceScorer`, ADR-0005 §5/§7) se calibra por apetito de riesgo: una organización cautelosa exige una puntuación de confianza más alta para llegar a `VALIDATED` — la misma respuesta, con la misma cobertura de citas, puede validar en una empresa y rechazarse en otra.
- **Nueva verificación: coherencia de tono.** Se añade al conjunto de verificaciones de ADR-0005 §5 un check adicional, alimentado directamente por `DNAToneProfile`: ¿la respuesta generada es consistente con el tono declarado de la empresa? Es una verificación de calidad de marca, no de seguridad — un fallo aquí no detiene la ejecución por defecto, pero se registra y puede activar regeneración si el DNA lo marca como estricto.
- **El check de compliance/información sensible obtiene su fuente de verdad más estricta de las `DNARedLine`.** Cuando ADR-0005 §5 describe la verificación de "compliance / GDPR", las líneas rojas del DNA son, en la práctica, el conjunto de reglas de mayor prioridad que ese check evalúa primero.

---

## 9. Cómo afecta a los Empleados Digitales

- **Tono por defecto heredado.** Cada Empleado Digital nuevo nace con el `DNAToneProfile` de la organización (o del dominio, si hay override) — el Momento 5 del onboarding (PVD-0002, "dale nombre y voz") no parte de cero: parte de lo que el DNA ya define, y solo permite matizar, no contradecir sin justificación.
- **Alcance de capacidades por defecto.** Un nuevo agente hereda el apetito de riesgo del DNA para las categorías de acción relevantes a su rol — un humano puede ajustar el `capability_grant` de un agente concreto, pero el punto de partida ya refleja el carácter de la empresa, no una plantilla genérica.
- **Consistencia entre agentes.** Este es el efecto más importante a nivel de producto: sin un DNA compartido, cada Empleado Digital terminaría desarrollando su propio "carácter" de forma implícita según cómo fue configurado individualmente — exactamente el mismo problema de fragmentación que Company Brain resuelve para el conocimiento (ADR-0002 §0), pero aplicado al comportamiento. El DNA es lo que garantiza que diez Empleados Digitales de la misma empresa se *sientan* como parte de la misma empresa, aunque hagan tareas completamente distintas.

---

## 10. Cómo se modifica mediante conversación

Un humano autorizado puede cambiar el DNA hablándole directamente al sistema — "a partir de ahora, revisa conmigo cualquier respuesta sobre precios antes de enviarla", o "sé más cercano con los clientes nuevos". Esto es una capacidad de producto deliberada: el carácter de la empresa se ajusta con la misma naturalidad con la que se corregiría a un empleado humano, en una frase, no en un panel de configuración.

Pero — y esto es consistente con el principio rector de ADR-0005 §0 ("el LLM propone, el motor dispone") — **una frase nunca cambia el DNA directamente**:

```
Humano: "Sé más cercano con los clientes nuevos."
        │
        ▼
Interpretación estructurada → DNAChangeProposal
   (origen: conversational, trait: tono, valor propuesto: +calidez)
        │
        ▼
Reflejo en lenguaje llano, antes de aplicar nada:
   "A partir de ahora, tus Empleados Digitales usarán un tono más cercano
    y menos formal al hablar con clientes nuevos. ¿Confirmas?"
        │
        ▼
   Confirmación explícita del humano ──▶ DNAChangeEvent (aplicado, versionado, auditado)
```

### Fricción asimétrica, a propósito

No toda modificación conversacional merece la misma fricción:

- **Volverse más cauteloso** (añadir una línea roja, exigir más aprobación) se confirma con un solo clic — la plataforma nunca debe poner obstáculos a que una empresa se proteja más.
- **Volverse menos cauteloso** (relajar una línea roja, quitar una aprobación requerida) exige confirmación explícita adicional — nunca basta con la misma frase casual que la endureció. Esto no es fricción arbitraria: es la aplicación directa del principio de PVD-0001 §7 ("explicabilidad por encima de autonomía") al propio mecanismo que gobierna la autonomía.

Toda modificación, en cualquier dirección, genera su `DNAChangeEvent` y queda visible en el historial de la organización — nunca es un ajuste invisible que ocurre "en segundo plano" de una conversación operativa.

---

## 11. Tabla resumen de impacto

| Sistema | Qué recibe del DNA | Qué NO controla el DNA |
|---|---|---|
| Company Brain | pesos de ranking por defecto, sensibilidad por defecto, prioridad de indexación | el contenido factual en sí — eso siempre viene de fuentes reales |
| Decision Engine | umbrales de suficiencia, categorías con aprobación requerida, umbrales de detención, líneas rojas como axiomas | la existencia del propio mecanismo de arbitraje — el DNA lo parametriza, no lo reemplaza |
| Validation Engine | umbral de confianza, verificación de tono, fuente de las líneas rojas de compliance | la lógica de detección de alucinaciones/contradicciones en sí, que es estructural, no configurable por carácter |
| Empleados Digitales | tono por defecto, alcance de capacidades por defecto | la identidad de cada agente una vez personalizada explícitamente — el override queda registrado, no se vuelve a sobrescribir en silencio |

---

## 12. Documento de referencia — heurística de decisión

Ante cualquier duda futura sobre dónde vive un dato nuevo de comportamiento empresarial:

1. **¿Es un hecho o un rasgo de carácter?** Un hecho ("el horario de soporte es de 9 a 18h") es Company Brain. Un rasgo ("preferimos ser transparentes sobre retrasos antes de que se pregunte") es Business DNA.
2. **¿Cambia con frecuencia o cambia rara vez y de forma deliberada?** Si cambia con cada documento nuevo, es Brain. Si cambia solo cuando la empresa decide, de verdad, ser distinta, es DNA.
3. **¿Afecta a un caso concreto o a cómo se decide en general?** Una respuesta específica es resultado de aplicar el DNA sobre el Brain — nunca al revés.
4. **¿Quién lo está pidiendo?** Si es un agente infiriendo un patrón, es una propuesta que requiere confirmación (§4.2). Si es un humano autorizado hablando directamente, sigue el protocolo de §10 — nunca se aplica sin reflejo y confirmación explícita, sin importar cuán trivial parezca el cambio.

Si estas cuatro preguntas no bastan para decidir, el dato probablemente no pertenece a ninguno de los dos sistemas tal como están definidos — y esa es una señal de que hace falta una enmienda a este documento, no una excepción silenciosa a él.
