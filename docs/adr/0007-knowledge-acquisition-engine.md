# ADR-0007: Knowledge Acquisition Engine

| | |
|---|---|
| **Estado** | Propuesto |
| **Fecha** | 2026-07-09 |
| **Depende de** | [ADR-0001](0001-arquitectura-base-atlas-ai.md) · [ADR-0002](0002-company-brain.md) · [ADR-0003](0003-context-engine-retrieval-pipeline.md) · [ADR-0005](0005-decision-engine-validation-engine.md) |
| **Relacionado con** | [PVD-0002](../pvd/0002-first-customer-experience.md) (Momento 2: "Qué debería saber") · [PVD-0003](../pvd/0003-business-dna.md) (calibración de sensibilidad y confianza) |

---

## 0. Qué resuelve este ADR

ADR-0002 §8 estableció el **contrato**: fuentes entran, pasan por un pipeline de ingesta asíncrono, y salen como `KnowledgeUnit` canónicas o `KnowledgeProposal` pendientes de revisión. Ese ADR no especificó **cómo** un PDF escaneado se convierte en algo que un Empleado Digital puede citar con precisión. Este documento especifica exactamente eso: el pipeline técnico completo, etapa por etapa, desde el archivo crudo hasta la unidad de conocimiento indexada.

**Principio que gobierna cada decisión de este ADR**: ningún documento se convierte en conocimiento canónico sin pasar por una cadena de transformación auditable, reversible y — donde la confianza no sea suficiente — revisable por un humano antes de ser verdad para la empresa.

---

## 1. Pipeline completo

```
Fuente (conector / subida manual / propuesta de agente)
        │
        ▼
IngestionJob creado (queued) — vía cola asíncrona (ADR-0001 §1.2)
        │
        ▼
TrustAndPolicyGate (pre-verificación, antes de gastar cómputo)
        │  ¿una DNARedLine excluye esta fuente/dominio? → rechazo inmediato, auditado
        │  ¿una política de Decision Engine exige revisión forzosa? → se marca desde ya
        ▼
DocumentTypeRouter
        │
        ├─(escaneado / imagen)──▶ OCRService ──▶ texto + confianza por región
        │
        ▼
DocumentParserService ──▶ ParsedDocumentTree (estructura + referencias de posición)
        │
        ▼
DiffEngine (solo si es re-ingesta de una fuente ya conocida)
        │  compara ChunkVersionHash contra la versión anterior
        │  → solo las secciones que cambiaron continúan el pipeline completo
        ▼
ChunkingService ──▶ ChunkCandidate[] (jerárquico: documento → sección → párrafo)
        │
        ▼
EnrichmentService ──▶ embedding + entidades/relaciones + dominio + sensibilidad + confianza
        │
        ▼
ConflictDetector ──▶ compara contra el Brain canónico existente
        │  sin conflicto / contradicción / redundancia / candidata a sustitución
        ▼
ProposalPromotionService
        │
        ├─ confianza suficiente + sin conflicto + política lo permite
        │        → promoción automática → KnowledgeUnit (nueva versión)
        │
        └─ confianza insuficiente / conflicto detectado / política exige revisión
                 → KnowledgeProposal + ApprovalOrchestrator (ADR-0005 §12, reutilizado)
                        │
                        ▼
                 Revisión humana (aprobar / rechazar / editar)
                        │
                        ▼
                 KnowledgeUnit (nueva versión) o descarte, ambos auditados
        │
        ▼
IndexUpdateService ──▶ pgvector + full-text + grafo (con resolución de entidades)
        │              + invalidación de caché de ContextPackage afectados
        ▼
IngestionJob completado ──▶ auditado como `knowledge.mutation` (ADR-0002 §9)
```

Cada flecha de este diagrama es un límite de responsabilidad entre servicios (§16) — ningún servicio hace el trabajo del siguiente ni se lo salta.

---

## 2. Detección de tipo y enrutamiento

`DocumentTypeRouter` es la primera decisión estructural: determina el formato real del documento (PDF con capa de texto, PDF escaneado sin texto extraíble, DOCX, HTML, correo, hoja de cálculo, imagen suelta, transcripción ya en texto) y decide la ruta de extracción. Un PDF con páginas mixtas (algunas con texto, algunas escaneadas) se procesa página a página, no como un bloque homogéneo — cada página toma la ruta que le corresponde.

---

## 3. OCR

Se activa únicamente para contenido sin capa de texto extraíble. `OCRService` es una **abstracción sobre proveedor**, con el mismo principio que el `LLMAdapterService` de ADR-0006 §9: el motor de OCR concreto es intercambiable, nunca una dependencia estructural del producto.

Puntos no negociables de esta etapa:

- **Confianza por región, no por documento.** Cada bloque de texto extraído lleva su propia puntuación de confianza. Un documento con una tabla mal escaneada y el resto perfectamente legible no se trata como "documento de baja confianza" en bloque — solo esa tabla se marca para revisión.
- **Preservación de layout.** El OCR no produce texto plano concatenado — conserva posición y estructura (columnas, tablas, encabezados) como metadatos que pasan intactos al `DocumentParserService`. Perder la estructura de una tabla financiera en el OCR es perder el hecho, aunque el texto en sí sea correcto.
- **Detección de idioma por región**, no asumida globalmente — determina qué tokenizador y qué modelo de embedding usar más adelante.
- **Bajo umbral de confianza → nunca se ingiere en silencio.** Una región por debajo del umbral configurado nunca se convierte directamente en `ChunkCandidate` — se marca `low_confidence` y se enruta a revisión humana obligatoria (§10), sin excepción de `trust_level` de la fuente.

---

## 4. Parser

`DocumentParserService` unifica cualquier formato de entrada (texto nativo o salida de OCR) en una única representación intermedia: el **`ParsedDocumentTree`** — un árbol jerárquico con nodos tipados (título, sección, subsección, párrafo, tabla, lista) y, crucialmente, una **referencia de posición** por nodo (página, coordenadas o ruta estructural equivalente).

Esa referencia de posición es la pieza que permite, más adelante, que la cita de un `ContextPackage` (ADR-0003) no sea solo "esto viene del documento X" sino "esto viene exactamente de este párrafo, en esta página" — es lo que sostiene la tarjeta de cita con enlace al documento original prometida en la demo de PVD-0002 §10.

---

## 5. Chunking

`ChunkingService` nunca corta por conteo de caracteres arbitrario. Los límites de fragmento se alinean siempre con los nodos del `ParsedDocumentTree` — nunca se parte una tabla, una entrada de lista o una frase a la mitad.

### 5.1 Jerárquico, no plano

En vez del solapamiento de ventana deslizante habitual en pipelines RAG genéricos, ATLAS AI produce una **jerarquía de granularidades** desde el propio chunking:

```
Documento (resumen generado)
   └── Sección (resumen generado)
          └── Párrafo / tabla / lista (contenido verbatim — el ChunkCandidate hoja)
```

Esto no es una optimización adicional — es la fuente directa de los "niveles de zoom" que el Context Engine usa para caber en presupuesto sin truncar (ADR-0002 §9, ADR-0003 §8.2). El chunking jerárquico y el mecanismo de zoom-out del Context Engine son, literalmente, la misma estructura de datos vista desde dos etapas distintas del sistema.

### 5.2 Límites de tamaño

Cada `ChunkCandidate` hoja respeta un rango de tokens objetivo (mínimo y máximo configurable) — lo bastante grande para ser útil por sí solo, lo bastante pequeño para ser preciso en recuperación. Un párrafo que excede el máximo se subdivide respetando frases completas; una sección con párrafos muy cortos puede fusionarse si mantiene coherencia temática — nunca por conveniencia de conteo, siempre validado contra la estructura del árbol.

---

## 6. Enriquecimiento

`EnrichmentService` toma cada `ChunkCandidate` y produce, antes de que exista como conocimiento utilizable:

- **Embedding** — para el índice vectorial (ADR-0003 §6).
- **Extracción de entidades y relaciones** — alimenta el grafo semántico (ADR-0002 Capa 3), con resolución de entidades contra el grafo ya existente (§11) para no duplicar nodos.
- **Clasificación de dominio** (`KnowledgeDomain`) — a qué área pertenece este fragmento.
- **Clasificación de sensibilidad** (`sensitivity_level`) — calibrada por defecto según Business DNA (§12).
- **Puntuación de confianza de extracción** — distinta del `trust_level` de la fuente: mide cuán fiable fue la propia extracción (¿el OCR era claro? ¿la estructura era ambigua?), no cuán fiable es la fuente en sí.

Estas dos puntuaciones de confianza — de fuente y de extracción — **nunca se combinan en un solo número** en esta etapa. Se mantienen separadas porque responden preguntas distintas y ambas alimentan, por separado, la decisión de promoción (§7).

---

## 7. Knowledge Units y Knowledge Proposals

La decisión de qué camino toma un `ChunkCandidate` enriquecido — canónico directo o propuesta pendiente — la toma `ProposalPromotionService`, evaluando tres señales en conjunto, nunca una sola de forma aislada:

| Señal | Favorece promoción automática | Fuerza revisión |
|---|---|---|
| `trust_level` de la `KnowledgeSource` | Alto (fuente verificada, conector de sistema interno) | Bajo (propuesta de agente, fuente externa no verificada) |
| Confianza de extracción (§6) | Alta (texto nativo, estructura clara) | Baja (OCR de baja confianza, estructura ambigua) |
| Resultado de `ConflictDetector` (§8) | Sin conflicto | Contradicción o candidata a sustitución ambigua |

Solo cuando **las tres** señales son favorables se crea directamente una `KnowledgeUnit` (nueva versión). Si cualquiera no lo es, se crea una `KnowledgeProposal` — nunca se promedia el riesgo para "casi calificar".

---

## 8. Conflictos

`ConflictDetector` compara cada candidato contra el Brain canónico existente antes de que exista la posibilidad de promoción. Distingue tres tipos, cada uno con tratamiento por defecto distinto — ninguno se resuelve en silencio:

| Tipo | Cómo se detecta | Tratamiento por defecto |
|---|---|---|
| **Contradicción** | Mismo `KnowledgeEntity` referenciado (entity-linking) + alta similitud semántica + contenido divergente en el mismo atributo | Siempre a revisión humana. Ambas versiones coexisten, marcadas, hasta resolución explícita (mismo principio de ADR-0002 §6) |
| **Redundancia** | Distancia de embedding por debajo del umbral de casi-duplicado (mismo mecanismo que `Deduplicator`, ADR-0003 §6, aplicado aquí en el momento de ingesta) | Auto-colapso permitido **solo si** el `trust_level` de ambas fuentes es igual o el nuevo es mayor; si el nuevo es de menor confianza, va a revisión (un duplicado de menor confianza no debe fusionarse silenciosamente con uno de mayor confianza) |
| **Candidata a sustitución** | Alta similitud + misma línea de `KnowledgeSource` + metadatos que sugieren versión posterior (nombre de archivo, fecha, título explícito) | Promoción automática como nueva versión **solo si** la línea de procedencia es la misma fuente exacta; si proviene de una fuente distinta, a revisión — una fuente nueva no puede "sustituir" silenciosamente el conocimiento que vino de otra |

---

## 9. Versionado y diffing

Se hereda el modelo append-only de ADR-0002 §6 sin modificarlo — este ADR formaliza el mecanismo que lo hace eficiente a escala.

- Cada nodo del `ParsedDocumentTree`, en su ruta estructural, tiene un **`ChunkVersionHash`** — un hash del contenido de esa sección en esa versión del documento.
- En una re-ingesta, `DiffEngine` compara los hashes nuevos contra los de la versión anterior del mismo `KnowledgeDocument` **antes** de ejecutar chunking, enriquecimiento o detección de conflictos sobre el contenido sin cambios.
- Solo las rutas con hash distinto continúan el pipeline completo. Las rutas sin cambios no regeneran embedding ni vuelven a pasar por extracción de entidades — se conserva su `KnowledgeUnit` tal cual, sin nueva versión.
- Las rutas que existían y ya no aparecen en la nueva versión del documento generan una actualización de `valid_to` sobre su `KnowledgeUnit` correspondiente (marcada como superada por ausencia, no por contradicción) — nunca se elimina, se versiona igual que cualquier otro cambio.

Este mecanismo es lo que permite que resincronizar un documento de 200 páginas con un cambio de una frase cueste, en cómputo real, lo mismo que ingerir esa frase sola.

---

## 10. Revisión humana

No se construye un mecanismo de revisión nuevo. Toda `KnowledgeProposal` y todo `ConflictDetection` que requiera decisión humana se enruta a través de `ApprovalOrchestrator` (ADR-0005 §12) — el mismo servicio que gestiona aprobaciones de acciones de agente. Una revisión de conocimiento **es**, a efectos del sistema, un tipo más de `approval_request` (ADR-0005 §11), no una cola paralela con su propia lógica de estado.

Dos modos de consumo de esa misma cola:

- **Revisión por lotes (onboarding)** — durante el Momento 2 de PVD-0002, el flujo de revisión se presenta agregado y ligero: el cliente ve el resultado de la ingesta en curso, no cada `ChunkCandidate` individual — solo se le muestran conflictos o contenido de baja confianza que realmente necesiten su criterio.
- **Revisión continua (conectores)** — para sincronización recurrente de fuentes externas, las propuestas se acumulan en la cola normal de aprobaciones, visibles desde la zona "Lo que necesita de ti" de ATLAS Home (PVD-0004 §4.3) cuando corresponde.

El revisor ve siempre: el fragmento propuesto, su ubicación exacta en el documento original (gracias a la referencia de posición del Parser, §4), y — si aplica — el contenido canónico con el que entra en conflicto, lado a lado. Puede aprobar, rechazar o editar antes de aprobar; editar no es silencioso — la versión editada queda registrada como distinta de la propuesta original del pipeline.

---

## 11. Integración con Company Brain

`IndexUpdateService` es el único punto de escritura final hacia las estructuras de ADR-0002/ADR-0003:

- **Índice vectorial y léxico** — actualización incremental, no reindexado completo, acotada por lo que `DiffEngine` (§9) marcó como cambiado.
- **Grafo semántico, con resolución de entidades.** Antes de crear un nuevo `KnowledgeEntity`, se comprueba si ya existe un nodo que represente la misma entidad del mundo real (mismo nombre normalizado, mismo identificador externo si lo hay, alta similitud semántica de contexto) — evita que "Juan Pérez" mencionado en tres documentos distintos se convierta en tres nodos del grafo sin relación entre sí.
- **Invalidación de caché.** Toda promoción de una nueva `KnowledgeUnit` incrementa el `snapshot_version` de los dominios afectados e invalida los `ContextPackage` cacheados que dependían de versiones anteriores (ADR-0003 §8, ADR-0002 §8) — sin excepción, sin ventana de inconsistencia tolerada.

---

## 12. Integración con Business DNA

El Business DNA (PVD-0003) actúa en dos momentos distintos del pipeline, no solo al final:

- **Antes de gastar cómputo — `TrustAndPolicyGate`.** Una `DNARedLine` que excluye una fuente, un dominio o un tipo de contenido se evalúa **antes** de OCR y Parser, no después — si una empresa declaró que nunca debe ingerirse información financiera de fuentes externas, esa exclusión detiene el pipeline en la primera etapa, no después de haber procesado el documento entero (PVD-0003 §7, líneas rojas como axiomas).
- **Durante enriquecimiento y promoción — calibración de umbrales.** El apetito de riesgo del DNA calibra el umbral de confianza combinada exigido en `ProposalPromotionService` (§7): una organización cautelosa exige más para promover automáticamente; una organización que prioriza velocidad tolera más autopromoción. También calibra el `sensitivity_level` mínimo asignado por defecto en dominios que el DNA marca como sensibles (PVD-0003 §6).

**Qué NO afecta el DNA en esta etapa**: el tono de comunicación (`DNAToneProfile`) no tiene ningún rol en la ingesta — es una dimensión de generación de respuestas, no de almacenamiento de conocimiento. Mezclarlas sería repetir el mismo error que PVD-0003 §2 ya advierte evitar: confundir un hecho con un rasgo de carácter.

---

## 13. Integración con Decision Engine

Ningún mecanismo de gobernanza se duplica — Knowledge Acquisition se apoya íntegramente en lo ya definido en ADR-0005:

- **Propuestas de conocimiento generadas por un agente** durante su ejecución (ADR-0002 §8, vía `KnowledgeProposal` de origen agente) se modelan como un `action_request` sobre una herramienta `proponer_conocimiento`, sujeta exactamente al mismo `CapabilityGate` (ADR-0005 §4.3) que cualquier otra acción. Un agente sin esa capability explícitamente concedida no puede generar propuestas de conocimiento, ni siquiera de baja confianza — el derecho a proponer no es un permiso implícito de existir como agente.
- **Políticas de ingesta** se evalúan con el mismo `PolicyEvaluator` (ADR-0005 §4.5) que cualquier otra política de la organización — una regla como "todo documento del dominio Legal requiere revisión sin importar el `trust_level` de la fuente" es una `policy` más en la misma tabla, no una excepción especial de este pipeline.
- **La cola de revisión** reutiliza `ApprovalOrchestrator` (§10) — ya cubierto, se repite aquí por completitud de la lista de integración pedida.

El resultado de este diseño es que el Knowledge Acquisition Engine no tiene "su propio" sistema de permisos, políticas o aprobaciones — es un **consumidor más** del Decision Engine, igual que Agent Runtime (ADR-0006). Esto es deliberado: dos motores de gobernanza distintos en la misma plataforma serían, tarde o temprano, dos fuentes de verdad distintas sobre qué está permitido.

---

## 14. Estados de un `IngestionJob`

| Estado | Significado |
|---|---|
| `QUEUED` | Recibido, pendiente de procesar |
| `POLICY_CHECK` | `TrustAndPolicyGate` evaluando exclusiones de DNA/política |
| `REJECTED_BY_POLICY` | Terminal — excluido antes de procesar, auditado |
| `EXTRACTING` | OCR (si aplica) + Parser en curso |
| `DIFFING` | Solo en re-ingesta — comparando contra versión anterior |
| `CHUNKING` | Generación jerárquica de `ChunkCandidate` |
| `ENRICHING` | Embedding, entidades, clasificación |
| `CONFLICT_CHECK` | `ConflictDetector` comparando contra el Brain canónico |
| `AWAITING_REVIEW` | Una o más propuestas/conflictos esperan aprobación humana |
| `PROMOTING` | Escribiendo `KnowledgeUnit` y actualizando índices |
| `COMPLETED` | Terminal — todo lo promovible ya es canónico |
| `FAILED` | Terminal — error no recuperable, preservado para diagnóstico |

---

## 15. Tablas

| Tabla | Propósito |
|---|---|
| `ingestion_jobs` | Seguimiento de cada ejecución del pipeline — `id`, `organization_id`, `source_id`, `document_id`, `state` (§14), `started_at`, `completed_at`, `error` |
| `parsed_document_trees` | `ParsedDocumentTree` persistido por `ingestion_job_id` — permite re-chunking sin repetir OCR/Parser |
| `ocr_results` | Resultado de OCR por región — `ingestion_job_id`, `region_reference`, `text`, `confidence`, `language` |
| `chunk_candidates` | Fragmentos pre-promoción, jerárquicos — `id`, `ingestion_job_id`, `parent_chunk_id`, `granularity` (`document`/`section`/`paragraph`), `content`, `position_reference`, `content_hash` |
| `chunk_version_hashes` | Hash por ruta estructural, usado por `DiffEngine` — `document_id`, `structural_path`, `hash`, `knowledge_unit_id` |
| `conflict_detections` | Cada conflicto detectado — `id`, `organization_id`, `candidate_chunk_id`, `conflicting_unit_id`, `conflict_type` (§8), `resolution_status` |

Todas heredan `organization_id` + RLS (ADR-0001 §5.2). Se reutilizan sin cambio `knowledge_sources`, `knowledge_documents`, `knowledge_units`, `knowledge_versions`, `knowledge_proposals`, `knowledge_entities`, `knowledge_relations` (ADR-0002) y `approval_requests`, `policies`, `policy_evaluations` (ADR-0005).

---

## 16. Servicios

| Servicio | Responsabilidad |
|---|---|
| `IngestionOrchestrator` | Conduce el `IngestionJob` a través de todas las etapas del pipeline (§1) |
| `TrustAndPolicyGate` | Pre-verificación de líneas rojas de DNA y políticas de ingesta, antes de procesar contenido |
| `DocumentTypeRouter` | Determina formato y enruta a la ruta de extracción correcta |
| `OCRService` | Abstracción sobre proveedor de OCR, confianza por región, preservación de layout |
| `DocumentParserService` | Produce `ParsedDocumentTree` unificado con referencias de posición |
| `DiffEngine` | Compara `ChunkVersionHash` en re-ingestas, acota el reprocesamiento a lo cambiado |
| `ChunkingService` | Chunking jerárquico y multi-granularidad alineado a la estructura del árbol |
| `EnrichmentService` | Embedding, extracción de entidades/relaciones, clasificación de dominio y sensibilidad |
| `ConflictDetector` | Detecta contradicción, redundancia y candidatura a sustitución contra el Brain canónico |
| `ProposalPromotionService` | Decide promoción automática vs. `KnowledgeProposal`, combinando las tres señales de §7 |
| `IndexUpdateService` | Actualiza índice vectorial/léxico/grafo (con resolución de entidades) e invalida caché de `ContextPackage` |

Estos servicios viven en `packages/company-brain` (ADR-0002 §13), como una extensión del pipeline de ingesta ya anticipado allí — no como un paquete nuevo separado, porque su única razón de existir es alimentar el Brain.

---

## 17. Riesgos

| Riesgo | Severidad | Mitigación |
|---|---|---|
| OCR de baja calidad se ingiere como si fuera texto confiable | Alta | Confianza por región obligatoria (§3); umbral bajo fuerza revisión, nunca autopromoción, sin importar `trust_level` de la fuente |
| Resolución de entidades incorrecta fusiona dos entidades reales distintas en un solo nodo del grafo | Media-Alta | Umbral de similitud conservador por defecto en la fusión; fusión incierta se dirige a revisión en vez de fusionarse automáticamente |
| `DiffEngine` con hashing mal ajustado no detecta un cambio real (falso negativo) | Alta si ocurre | Hash sobre el contenido normalizado completo de la sección, no sobre metadatos; pruebas de regresión con documentos versionados reales antes de producción |
| Cola de revisión (`ApprovalOrchestrator` reutilizado) se satura con propuestas de baja relevancia en conectores de alto volumen | Media | Políticas de auto-promoción más permisivas configurables por fuente de alto `trust_level` conocido, sin bajar el umbral para fuentes nuevas o no verificadas |
| Ingesta de contenido excluido por línea roja ya ocurrió antes de que existiera esa línea roja (retroactividad) | Media | Fuera de alcance de este ADR — se resuelve con un proceso de re-auditoría/purga retroactiva a definir junto con la política de retención pendiente (ADR-0003 §15, ADR-0005 §14) |

---

## 18. Decisiones abiertas

- Proveedor(es) de OCR soportados inicialmente y política de fallback entre proveedores — mismo patrón de decisión pendiente que `LLMAdapterService` (ADR-0006 §14).
- Umbral exacto de similitud para resolución de entidades y para detección de redundancia — se calibra con datos reales, no solo con valor teórico inicial (mismo enfoque que ADR-0003 §15).
- Si `ChunkingService` debe permitir configurar el rango de tamaño de fragmento por `KnowledgeDomain`, dado que un dominio legal y uno de soporte conversacional pueden beneficiarse de granularidades distintas.
- Mecanismo exacto de re-auditoría retroactiva para contenido ingerido antes de la creación de una `DNARedLine` que lo habría excluido (riesgo señalado en §17).
- Si la revisión por lotes del onboarding (PVD-0002) debe tener un límite de tiempo antes de aplicar promoción automática por defecto a contenido de alta confianza no revisado, para no bloquear la demo del minuto 15 si el cliente no revisa todo a tiempo.
