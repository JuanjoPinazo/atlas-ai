# PVD-0006 — Atlas Intelligence Network

| | |
|---|---|
| **Tipo de documento** | Product Vision Document — estrategia de red |
| **Estado** | Propuesto |
| **Fecha** | 2026-07-09 |
| **Se apoya en** | [PVD-0001](0001-product-vision-atlas-ai.md) · [PVD-0002](0002-first-customer-experience.md) · [PVD-0003](0003-business-dna.md) · [PVD-0004](0004-atlas-home.md) · [PVD-0005](0005-atlas-dental-intelligence-blueprint.md) |
| **Se apoya, y no contradice, en** | [ADR-0001 §5](../adr/0001-arquitectura-base-atlas-ai.md) (aislamiento multi-tenant) · [ADR-0002](../adr/0002-company-brain.md) (Company Brain) · [ADR-0007](../adr/0007-knowledge-acquisition-engine.md) (gobernanza de propuestas) |

---

## 0. La tensión que resuelve este documento

Todo lo construido hasta ahora protege una frontera con una disciplina casi obsesiva: **lo que sabe una empresa es suyo, y nunca de otra** (ADR-0001 §5, ADR-0002 §5). Esa frontera es correcta y no se toca.

Pero hay una pregunta que ATLAS AI no puede evitar si quiere convertirse en lo que PVD-0001 §10 promete a diez años — una capa de infraestructura, no una aplicación aislada más: **¿puede una plataforma que sirve a cientos de clínicas dentales, cientos de asesorías, cientos de talleres, hacer que cada una se beneficie de lo que las demás han aprendido, sin que ninguna vea ni un dato de la otra?**

Este es el documento que responde que sí — y que define, con la misma precisión con la que se definió el aislamiento, exactamente dónde está el límite entre "aprender de la red" y "filtrar datos privados". Es, probablemente, la decisión de mayor apalancamiento estratégico de todo ATLAS AI: es lo que convierte el valor de la plataforma de **lineal** (cada cliente vale lo que aporta su propio uso) en **exponencial** (cada cliente nuevo hace un poco mejor a todos los demás, desde el primer día).

Si este documento falla en un solo punto — si un dato privado sale por error de una empresa — la confianza que sostiene toda la plataforma (PVD-0001 §4) se rompe de forma irreversible. Por eso cada mecanismo aquí descrito está diseñado para que la fuga sea **estructuralmente imposible**, no solo prohibida por política.

---

## 1. Qué es Atlas Intelligence Network

Atlas Intelligence Network (AIN) es la capa que permite que patrones, estructuras y buenas prácticas — nunca datos — fluyan entre las empresas que usan ATLAS AI, con el objetivo de que cada organización se beneficie de la experiencia colectiva de su vertical sin que ninguna organización individual sea jamás identificable ni su información recuperable por otra.

La analogía correcta no es "compartir documentos" — es más parecida a cómo un sistema de tráfico colectivo aprende dónde hay atascos sin saber quién conduce cada coche: **viaja el patrón, nunca el dato de origen.**

---

## 2. Qué NO es Atlas Intelligence Network

1. **No es un marketplace de datos.** ATLAS AI no vende, cede ni intercambia datos de clientes con terceros, bajo ninguna circunstancia — esto no es una política revisable, es un límite de producto.
2. **No es una forma indirecta de que una empresa vea información de otra.** Si un mecanismo de agregación pudiera, con suficiente esfuerzo, reconstruir de qué empresa vino un dato, ese mecanismo está mal diseñado y no se publica (§5, §9).
3. **No es obligatorio.** La participación es un opt-in explícito por organización — nunca una condición implícita de usar la plataforma.
4. **No comparte contenido, nunca.** Ningún `KnowledgeUnit`, ninguna entidad del grafo semántico, ninguna conversación, ningún Business DNA específico de una empresa cruza jamás la frontera de su organización tal cual — se detalla en §4.
5. **No es un sistema de rankings públicos ni de presión competitiva.** El benchmarking (§10) es una herramienta de mejora privada para quien la recibe, nunca una tabla de clasificación visible entre empresas.

---

## 3. Qué conocimiento puede compartirse

Solo dos categorías de información, ambas ya despojadas de contenido específico antes de que exista la posibilidad de compartirlas:

| Categoría | Qué es | Ejemplo |
|---|---|---|
| **Patrones estructurales** | Cómo se organiza el conocimiento o la configuración, no qué contiene | "Las clínicas dentales que dividen su dominio de Presupuestos en fases de pago explícitas tienen menos presupuestos sin respuesta" |
| **Señales agregadas de resultado** | Métricas estadísticas combinadas de muchas organizaciones, nunca trazables a una sola | "El 63% de las clínicas de tamaño similar agenda la revisión de recall con 5 días de antelación media" |

Ninguna de las dos categorías contiene, en ningún punto de su ciclo de vida, un hecho específico de una empresa — se calculan *sobre* los datos de la empresa, dentro de su propio límite (§5), y solo la forma abstracta resultante viaja.

---

## 4. Qué jamás puede salir de una empresa

Sin excepción, sin configuración que lo permita, sin importar el nivel de opt-in:

- Contenido literal de cualquier `KnowledgeUnit` (ADR-0002).
- Cualquier `KnowledgeEntity` — personas, pacientes, clientes, proveedores nombrados.
- Datos de categoría especial — de salud, biométricos, u otros protegidos por normativa — un veto absoluto heredado directamente de PVD-0005 §5–6, aplicado aquí a cualquier vertical, no solo al dental.
- El `BusinessDNAProfile` específico de una organización — su carácter es información competitiva propia, nunca material de red (PVD-0003 §2).
- Contenido de conversaciones o mensajes (`conversation_messages`, ADR-0006 §11).
- Cualquier agregado derivado de menos de **K** organizaciones distintas (§5) — si no hay suficiente masa para anonimizar de verdad, simplemente no se publica ese agregado, sin importar cuánto valor tendría.
- `policies`, `capability_grant` o configuración operativa específica de una organización — podría revelar su modelo de negocio interno.

---

## 5. Cómo se anonimiza

El mecanismo tiene dos etapas, separadas físicamente, y solo la segunda produce algo visible fuera del límite del tenant:

```
DENTRO del límite de la organización (nunca sale nada crudo de aquí)
────────────────────────────────────────────────────────────────────
   Datos reales del tenant (Company Brain, decision_events, validation_events…)
                    │
                    ▼
       LocalAbstractionService
       calcula, dentro del propio límite del tenant,
       un resumen estructural/estadístico — nunca contenido
                    │
                    ▼
       Resumen abstracto (sin identificadores, sin contenido literal)
────────────────────────────────────────────────────────────────────
                    │  (solo esto cruza la frontera)
                    ▼
FUERA — Atlas Intelligence Network
────────────────────────────────────────────────────────────────────
       NetworkAggregationService
       combina resúmenes abstractos de muchas organizaciones
                    │
                    ▼
       ¿Provienen de al menos K organizaciones distintas?
                    │
              No ──▶ se descarta, no se publica nada
              Sí ──▶ se aplica ruido/agregación estadística
                     para que ninguna organización individual
                     sea reconstruible del resultado
                    │
                    ▼
       Patrón / benchmark / candidato a Knowledge Pack
```

Este es, deliberadamente, el mismo principio que sostiene el aprendizaje federado: **el modelo o el resumen viaja, los datos crudos nunca lo hacen.** La computación que produce el resumen ocurre dentro del límite de aislamiento del tenant (mismo perímetro de RLS de ADR-0001 §5), no en un servicio central que primero recibe los datos y luego promete anonimizarlos — si los datos crudos nunca salen, no hay una segunda oportunidad de fuga que gestionar después.

El umbral **K** (mínimo de organizaciones distintas para publicar un agregado) es configurable por tipo de métrica y vertical, pero tiene un mínimo absoluto no negociable en la plataforma — ningún agregado se publica jamás por debajo de ese mínimo, sin excepción de urgencia comercial.

---

## 6. Knowledge Packs — qué son y cómo evolucionan

Un **Knowledge Pack** es un paquete versionado de conocimiento genuinamente genérico de un vertical — plantillas de `KnowledgeDomain`, protocolos estándar, guiones y estructuras que **no contienen ningún dato de ninguna empresa concreta**. El "Protocolo de Triage de Urgencia" descrito en PVD-0005 §15 es el ejemplo canónico: no es información privada de una clínica, es una buena práctica de vertical que mejora cuando se refina con la experiencia de cientos de clínicas.

### Ciclo de vida

```
Patrón detectado (§7) ──▶ BestPracticeCandidate
        │
        ▼
Revisión experta (curación humana — nunca autopublicación)
        │
   ┌────┴────┐
 aprobado   rechazado (auditado, no se pierde el registro de por qué)
   │
   ▼
Knowledge Pack — nueva versión publicada
   │
   ▼
Distribución a organizaciones con opt-in en ese vertical (§8)
```

Un Knowledge Pack se versiona exactamente igual que una `KnowledgeUnit` (ADR-0002 §6): append-only, con `valid_from`/`valid_to`, nunca sobrescribe silenciosamente una versión anterior. Y su promoción sigue el mismo patrón de gobernanza ya establecido en toda la plataforma — propuesta, revisión, promoción — que `KnowledgeProposal` (ADR-0002 §8) y `DNAChangeProposal` (PVD-0003 §4) ya usan a nivel de organización. AIN no inventa un mecanismo de gobernanza nuevo; aplica el mismo, a escala de red.

---

## 7. Cómo se detectan mejores prácticas

`PatternDetectionService` opera **exclusivamente sobre los resúmenes abstractos ya agregados** (§5) — nunca ve un dato crudo de ninguna organización. Busca correlaciones estadísticamente significativas entre:

- **Patrones estructurales/de configuración** (cómo una organización organiza su Brain, sus políticas, su Business DNA — en forma, no en contenido).
- **Señales de resultado agregadas** (tasas de validación, tiempo de cierre de presupuesto, asistencia a revisiones, tasa de conflictos de política).

Un patrón detectado se convierte en `BestPracticeCandidate` — nunca directamente en un Knowledge Pack. La correlación estadística no es, por sí sola, una buena práctica: requiere revisión humana experta que confirme que el patrón tiene sentido causal, no solo estadístico, antes de convertirse en algo que se recomienda a otras organizaciones. Este es el mismo principio que gobierna cualquier señal de un modelo-juez en ADR-0005 §7: una señal automática nunca es la decisión final por sí sola.

---

## 8. Cómo se distribuyen actualizaciones

Nunca automático, nunca silencioso. Una actualización de Knowledge Pack a una organización opt-in se presenta exactamente con el mismo tratamiento que cualquier `KnowledgeProposal` de origen externo (ADR-0002 §8) — con un nuevo tipo de procedencia, `network_pack`:

- Aparece como oportunidad o tarea sugerida en ATLAS Home (PVD-0004 §4.5–§4.6): *"Detectamos una mejora en el protocolo estándar de tu sector. ¿Quieres incorporarla?"*
- La organización puede **aceptar**, **posponer**, o **aceptar con adaptación local** — si ya había personalizado su propia versión de ese contenido, la actualización de red nunca sobrescribe la personalización sin mostrarla primero lado a lado (mismo principio de override explícito de PVD-0003 §3.2).
- Distribución escalonada disponible: un Knowledge Pack nuevo puede liberarse primero a un grupo reducido de organizaciones (con su consentimiento) antes de una distribución más amplia, igual que un lanzamiento de software se valida antes de generalizarse.

---

## 9. Cómo se gestionan versiones

- Cada organización queda **anclada** a la versión de Knowledge Pack que adoptó — no hay actualización forzada. Subir de versión es siempre una decisión explícita (§8).
- Al actualizar, si la organización tiene personalizaciones locales sobre el pack anterior, se aplica un mecanismo de comparación análogo al `DiffEngine` de ADR-0007 §9: se identifica qué partes cambiaron a nivel de red y cuáles son personalización propia, y solo las primeras se proponen como actualización — las personalizaciones locales nunca se descartan en silencio.
- Toda adopción, personalización o rechazo de una versión de pack queda registrada con el mismo rigor de auditoría que cualquier mutación de conocimiento (`knowledge.mutation`, ADR-0002 §9), con el campo de procedencia marcado como `network_pack` y su número de versión.

---

## 10. Benchmarking

El complemento natural de los Knowledge Packs: en vez de una mejora de contenido, una organización recibe una **comparación de su propio desempeño frente al agregado anónimo de su segmento** — vertical y tamaño comparable (el mismo dato de "tamaño de equipo" capturado en el onboarding, PVD-0002 §4, se convierte aquí en la clave de segmentación de sus pares).

- Ejemplo de entrega: *"Tu tasa de cierre de presupuestos está por encima de la media de clínicas de tamaño similar. Tu tiempo de respuesta a reseñas negativas está por debajo — la mediana del sector responde en menos de 48h."*
- Se calcula con exactamente el mismo mecanismo de abstracción y umbral **K** de §5 — un benchmark nunca compara contra un competidor identificable, solo contra una distribución agregada.
- Se entrega con el mismo tono sobrio de ATLAS Home (PVD-0004 §3): información útil para decidir, nunca una tabla de clasificación ni una fuente de ansiedad competitiva (PVD-0004 §8, disciplina anti-gamificación, aplicada aquí también).

---

## 11. Cómo se mantiene la privacidad — la constitución de AIN

Consolidación de todas las garantías anteriores en un conjunto de reglas que no dependen de la buena voluntad de implementación futura, sino que son el contrato de existencia de todo el sistema:

1. **Opt-in explícito y revocable** por organización — nunca implícito, nunca irreversible.
2. **La abstracción ocurre dentro del límite del tenant**, nunca después de que los datos crudos hayan salido (§5) — no hay "anonimizar después", solo "nunca extraer sin anonimizar antes".
3. **k-anonimato obligatorio** con mínimo absoluto no configurable a la baja — ningún agregado por debajo del umbral se publica jamás.
4. **Veto absoluto sobre contenido, entidades y datos de categoría especial** (§4) — sin excepción por tipo de organización, vertical o nivel de plan contratado.
5. **Curación humana obligatoria** antes de publicar cualquier Knowledge Pack o patrón de mejor práctica (§6–§7) — ninguna correlación se convierte en recomendación sin revisión experta.
6. **Las líneas rojas del Business DNA de una organización se heredan también aquí.** Si una empresa declaró una `DNARedLine` sobre no compartir cierto tipo de información (PVD-0003 §3.1), esa línea roja gobierna también su participación en AIN — la privacidad de red nunca anula una restricción que la propia organización ya se impuso.
7. **Transparencia hacia el propio contribuyente.** Ninguna organización queda a ciegas sobre qué resumen abstracto aportó — puede ver en todo momento, con el mismo nivel de detalle que cualquier otro dato de su cuenta, exactamente qué se calculó y se envió en su nombre.
8. **La baja es inmediata y hacia adelante.** Una organización puede salir de AIN en cualquier momento — deja de contribuir de inmediato. Sus contribuciones pasadas ya agregadas no son recuperables de forma individual, no porque se prometa "olvidarlas" a posteriori, sino porque, por diseño (§5, §11.3), nunca fueron trazables a ella en primer lugar.

---

## 12. Modelo de negocio

**La privacidad no se vende. El conocimiento colectivo, sí.**

- Las garantías de §11 son universales — se aplican igual en cualquier plan de precios. No existe un nivel de suscripción "más privado" ni uno "menos privado" — sería, además de mal negocio, una traición directa a PVD-0001 §9 ("no vendemos promesas de autonomía irresponsable... la propuesta comercial es honesta").
- Lo que sí es parte de la propuesta comercial: **el acceso a Knowledge Packs curados y a benchmarking detallado** es una capacidad de los planes de nivel medio/alto — no la seguridad de los datos, sino la profundidad del conocimiento colectivo al que se accede.
- **Incentivo de reciprocidad, no transacción.** Las organizaciones que participan activamente (opt-in con contribución real, no solo consumo) reciben acceso preferente y más granular a nuevos patrones y benchmarks — un intercambio de conocimiento por conocimiento, nunca una compensación monetaria por datos, porque **ATLAS AI no vende datos de clientes, ni siquiera anonimizados, a terceros, bajo ninguna circunstancia.** AIN es un beneficio interno de la red de clientes de ATLAS AI, no un producto de datos independiente.
- **El verdadero efecto de negocio es el arranque en frío.** Una clínica dental nueva que se incorpora hoy no empieza con un Company Brain vacío en el sentido estructural — hereda, si lo acepta, los Knowledge Packs ya validados de su vertical (el propio PVD-0005 es, en efecto, la semilla del primer Knowledge Pack de Dental). Esto convierte la incorporación de cada cliente nuevo en algo que mejora la oferta para el siguiente cliente nuevo — el mecanismo concreto que hace posible la visión a 5-10 años de PVD-0001 §10: que ATLAS AI deje de ser "una aplicación más" y se convierta en la infraestructura de conocimiento de su categoría.

---

## 13. Servicios (referencia, detalle en ADR futuro)

| Servicio | Responsabilidad |
|---|---|
| `LocalAbstractionService` | Calcula resúmenes estructurales/estadísticos dentro del límite del tenant — punto donde el dato deja de ser crudo antes de poder salir |
| `NetworkAggregationService` | Combina resúmenes abstractos de múltiples organizaciones, aplica el umbral k-anónimo |
| `PatternDetectionService` | Busca correlaciones estadísticamente significativas entre configuración y resultado agregado |
| `KnowledgePackCurationService` | Gestiona el ciclo propuesta → revisión experta → publicación de un Knowledge Pack |
| `PackDistributionService` | Entrega actualizaciones de pack a organizaciones opt-in, gestiona adopción escalonada |
| `BenchmarkingService` | Calcula y sirve comparativas de segmento respetando k-anonimato |

El esquema de datos exhaustivo (tablas, contratos de tipos) se define en un ADR posterior, siguiendo el mismo patrón de esta serie de documentos: primero la visión y las garantías, después el esquema técnico exacto.

---

## 14. Cómo usar este documento

Ante cualquier propuesta futura de compartir algo a través de Atlas Intelligence Network, una sola pregunta gobierna la decisión, antes que cualquier otra:

**¿Puede reconstruirse, con cualquier cantidad de esfuerzo razonable, de qué organización salió este dato?**

Si la respuesta es sí, o incluso "probablemente no, pero no estamos seguros" — no se comparte. No hay excepción por valor de negocio, urgencia comercial, ni beneficio potencial para el cliente. La confianza que sostiene toda la plataforma (PVD-0001 §4) depende de que esta pregunta se responda con la misma disciplina la primera vez que la petición número diez mil.
