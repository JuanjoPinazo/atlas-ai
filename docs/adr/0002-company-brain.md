# ADR-0002: Company Brain — El Núcleo de Conocimiento Compartido

| | |
|---|---|
| **Estado** | Propuesto |
| **Fecha** | 2026-07-09 |
| **Depende de** | [ADR-0001: Arquitectura Base de ATLAS AI](0001-arquitectura-base-atlas-ai.md) |
| **Alcance** | Diseño del núcleo de conocimiento compartido de la plataforma |

---

## 0. Principio rector

> **Los Empleados Digitales no son el centro de ATLAS AI. Son consumidores desechables de un conocimiento que los sobrevive.**

En la mayoría de plataformas de agentes, cada agente acumula su propia memoria, su propio contexto, sus propios documentos. El resultado es conocimiento fragmentado, no auditable, inconsistente entre agentes, y que desaparece si el agente se reconfigura o se elimina.

ATLAS AI invierte esa relación. **Company Brain es el sistema de registro del conocimiento de la empresa**: persiste, se versiona y se audita con independencia total de qué agentes existan hoy. Un Empleado Digital no "sabe" cosas por sí mismo — **solicita contexto al Company Brain** para cada tarea, de forma efímera, igual que un proceso stateless solicita datos a una base de datos.

Esto tiene una consecuencia de diseño no negociable:

```
Digital Employees, Agent Runtime, Workflows, Conversations
                        │
                        │  (consumen conocimiento, no lo poseen)
                        ▼
                 ┌───────────────┐
                 │  COMPANY BRAIN │  ← fuente de verdad, vive independiente
                 └───────────────┘
```

Esto **corrige la capa de dependencias del ADR-0001**: Company Brain no es un módulo más de "Capa 1 — Dominio core", es la base sobre la que Digital Employees, Knowledge Base (que este ADR absorbe y reemplaza) e Integrations Hub se apoyan. Se detalla en la §14.

---

## 1. Visión conceptual

Company Brain no es "una base vectorial". Es un sistema de cuatro capas, cada una con una responsabilidad distinta:

```
┌──────────────────────────────────────────────────────────────────┐
│  CAPA 4 — Context Packages                                        │
│  Contexto ensamblado, presupuestado y citado, listo para un LLM   │
│  (efímero por ejecución, pero versionado y auditable)             │
└───────────────────────────▲──────────────────────────────────────┘
                             │  ensamblado bajo demanda
┌───────────────────────────┴──────────────────────────────────────┐
│  CAPA 3 — Grafo Semántico                                          │
│  Entidades (personas, productos, políticas, procesos) y relaciones │
│  entre ellas y entre Knowledge Units                                │
└───────────────────────────▲──────────────────────────────────────┘
                             │  extracción de entidades/relaciones
┌───────────────────────────┴──────────────────────────────────────┐
│  CAPA 2 — Knowledge Units                                          │
│  Fragmentos atómicos, normalizados, versionados, embebidos.        │
│  Es la unidad mínima recuperable.                                  │
└───────────────────────────▲──────────────────────────────────────┘
                             │  extracción / chunking / embedding
┌───────────────────────────┴──────────────────────────────────────┐
│  CAPA 1 — Fuentes Crudas (Sources)                                 │
│  Documentos, correos, transcripciones, registros de integraciones, │
│  entradas manuales — inmutables, referencia de procedencia          │
└──────────────────────────────────────────────────────────────────┘
```

**Por qué cuatro capas y no una tabla de embeddings**: si el conocimiento fuera solo vectores, no habría forma de versionarlo con sentido, de explicar relaciones entre hechos, ni de dar a los agentes algo mejor que "los k chunks más parecidos". Las capas 3 y 4 son las que convierten búsqueda semántica en **razonamiento contextual gobernado**.

---

## 2. Entidades principales

| Entidad | Capa | Descripción |
|---|---|---|
| `KnowledgeDomain` | Organización | Categoría de primer nivel del conocimiento (Ventas, RRHH, Producto, Legal, Operaciones…), configurable por tenant |
| `KnowledgeSource` | 1 | Origen del conocimiento: conector, subida manual, transcripción, propuesta de agente. Incluye `trust_level` |
| `KnowledgeDocument` | 1 | Artefacto crudo ingerido (un archivo, una página, un registro), inmutable, referenciado por versión de fuente |
| `KnowledgeUnit` | 2 | Fragmento atómico recuperable: contenido normalizado, embedding, metadatos, versión, vigencia temporal |
| `KnowledgeEntity` | 3 | Nodo del grafo: persona, producto, política, proceso, decisión, cliente… |
| `KnowledgeRelation` | 3 | Arista del grafo: relaciones tipadas entre entidades y/o Knowledge Units (`depende_de`, `sustituye_a`, `pertenece_a`, `aprobado_por`…) |
| `KnowledgeVersion` | 2 | Registro histórico append-only de cada versión de una `KnowledgeUnit` |
| `KnowledgeProposal` | 2 (pre-canónico) | Candidato a nuevo conocimiento, propuesto por agente o humano, pendiente de promoción |
| `ContextPackage` | 4 | Contexto ensamblado para una ejecución concreta: lista citada de Knowledge Units, presupuesto de tokens usado, versión de snapshot del Brain |
| `RetrievalEvent` | Transversal | Registro de auditoría: qué se recuperó, para quién/qué agente, con qué relevancia, bajo qué permiso |
| `AccessPolicy` | Transversal | Reglas de visibilidad por `KnowledgeDomain` / `sensitivity_level` ligadas al Capability Model del ADR-0001 |

### Relación entre entidades (simplificado)

```
Organization
   └── KnowledgeDomain (1..N)
          └── KnowledgeSource (1..N)
                 └── KnowledgeDocument (1..N, inmutable)
                        └── KnowledgeUnit (1..N, versionado)
                               ├── KnowledgeVersion (histórico)
                               ├── embedding (pgvector)
                               └── KnowledgeEntity ⇄ KnowledgeRelation (N..N, grafo)

KnowledgeProposal ──(revisión/promoción)──> KnowledgeUnit (nueva versión)

Agent Run ──solicita──> ContextPackage ──compuesto de──> KnowledgeUnit[] (referencia, no copia)
                              │
                              └──registra──> RetrievalEvent
```

Punto de diseño importante: **`ContextPackage` referencia Knowledge Units, no las copia**. Esto mantiene el Brain como única fuente de verdad y hace que el paquete de contexto sea ligero, trazable y reproducible.

---

## 3. ¿Dónde vive el conocimiento?

Consistente con ADR-0001 (Postgres/Supabase como base, sin dependencias exóticas prematuras):

- **Metadatos, estructura, versiones, grafo**: Postgres (Supabase), tablas `knowledge_*`, con `organization_id` y RLS igual que el resto de la plataforma — el aislamiento multi-tenant del ADR-0001 aplica sin excepción al conocimiento.
- **Embeddings**: `pgvector` dentro del mismo Postgres, indexado HNSW por `KnowledgeDomain` para acotar el espacio de búsqueda antes de comparar vectores.
- **Contenido crudo voluminoso** (PDFs, audio de transcripciones, adjuntos): Supabase Storage, con el registro `KnowledgeDocument` apuntando al objeto — nunca se guarda el binario en la tabla.
- **`ContextPackage`**: persistido igualmente en Postgres (no en memoria/caché volátil) porque es una pieza de auditoría, no solo de rendimiento. La caché (Redis/Vercel KV) es una capa de aceleración por encima, no el sistema de registro.

No se introduce un vector store externo dedicado en esta fase — es una decisión ya marcada como abierta en ADR-0001 y se mantiene igual aquí: se revisa si el volumen por tenant lo justifica.

---

## 4. ¿Cómo se organiza?

Organización en dos ejes simultáneos, no uno solo:

1. **Eje jerárquico (`KnowledgeDomain`)** — organiza por área funcional de la empresa. Es la forma en que un humano navega el Brain en la UI, y el primer filtro de acceso (un agente de Ventas no necesita ver por defecto el dominio Legal).
2. **Eje relacional (grafo semántico)** — organiza por significado, no por carpeta. Una política de RRHH puede relacionarse con un proceso de Operaciones aunque vivan en dominios distintos. El grafo es lo que permite responder "¿qué más depende de esto?" antes de que un agente actúe sobre información desactualizada.

Los `KnowledgeDomain` son **configurables por tenant** (no hardcodeados), porque la forma en que una empresa organiza su conocimiento es parte de su identidad organizativa — pero cada tenant parte de una plantilla base (Ventas, RRHH, Producto, Legal, Operaciones, Finanzas) para no partir de cero.

---

## 5. ¿Cómo acceden los agentes?

**Nunca por acceso directo a la base de datos.** Los agentes (y cualquier módulo consumidor) acceden exclusivamente a través de un **Context Engine** — un servicio con un contrato único de solicitud/respuesta:

```
Solicitud de contexto
──────────────────────
- agent_id / run_id
- intención de la tarea (task intent, no la conversación completa)
- dominios relevantes (opcional, se puede inferir)
- presupuesto de tokens disponible
- capability grant del agente (del Capability Model, ADR-0001 §6.2)

                    │
                    ▼
            ┌───────────────┐
            │ Context Engine │
            └───────┬───────┘
                    │
                    ▼
Respuesta: ContextPackage
──────────────────────
- lista de fragmentos de conocimiento, cada uno citado (id + versión)
- resumen del grafo relevante (entidades/relaciones implicadas)
- tokens usados / tokens disponibles restantes
- snapshot_version (ver §7)
```

Este contrato es la razón por la que el sistema es multi-agente seguro y auditable a la vez: **ningún agente construye su propio prompt libremente contra la base de conocimiento**; todos pasan por el mismo punto de control, que aplica permisos, presupuesto y trazabilidad de forma uniforme.

La memoria conversacional/episódica de un agente (lo que dijo el usuario hace 2 turnos) es **distinta y no vive en Company Brain** — vive en el módulo de Conversations del ADR-0001. Company Brain solo contiene conocimiento organizacional compartido, no historial de charla. Esta separación es intencional: evita que "recuerdos" efímeros de una conversación contaminen el conocimiento canónico de la empresa.

---

## 6. ¿Cómo se versiona?

Regla base: **las Knowledge Units son inmutables una vez creadas — nunca se actualizan in place**.

- Cada actualización crea una **nueva versión** (`KnowledgeVersion`), con `valid_from`. La versión anterior recibe `valid_to` y `superseded_by`.
- Toda `KnowledgeUnit` tiene vigencia temporal explícita, no solo "última versión gana". Esto permite reconstruir **qué sabía la empresa en un momento dado** — imprescindible para explicar por qué un agente actuó de una forma concreta en el pasado, incluso si el conocimiento ha cambiado desde entonces.
- Los `KnowledgeDocument` (fuente cruda) también versionan: una re-ingesta de un documento modificado no sobrescribe el anterior, genera una nueva versión de documento y dispara un **diff selectivo** — solo se re-procesan (chunk/embed) los fragmentos que cambiaron, no el documento entero.
- **Conflictos entre fuentes** (dos documentos que dicen cosas distintas) no se resuelven automáticamente por defecto: ambas versiones coexisten con `trust_level` de su fuente y `confidence`; la resolución es explícita (curación humana o regla de prioridad de fuente configurada por el tenant), nunca silenciosa.

Esto convierte cada `ContextPackage` en algo **reproducible**: dado su `snapshot_version`, siempre se puede reconstruir exactamente qué conocimiento vio un agente en una ejecución concreta.

---

## 7. ¿Cómo se actualiza?

Tres vías de entrada, todas convergiendo en el mismo pipeline de ingesta:

1. **Conectores** (Integrations Hub, ADR-0001) — sincronización desde sistemas externos (correo, wikis, ERPs).
2. **Autoría manual** — humanos editando/subiendo conocimiento directamente desde la UI.
3. **Propuestas de agente** — un agente, durante su ejecución, puede generar una `KnowledgeProposal` ("esto que descubrí debería quedar registrado"). **Nunca escribe directamente al Brain canónico.**

```
Fuente (conector / manual / agente)
        │
        ▼
┌─────────────────┐
│ Pipeline de       │  extracción → chunking → normalización
│ Ingesta (async,   │  → embedding → extracción de entidades/relaciones
│ vía cola ADR-0001)│
└────────┬─────────┘
         │
         ▼
  ¿Fuente confiable + regla automática de promoción?
         │                              │
        Sí                              No
         │                              │
         ▼                              ▼
 KnowledgeUnit (nueva versión,   KnowledgeProposal (pendiente)
  canónica, indexada)                    │
                                          ▼
                                 Revisión (humano o política)
                                          │
                                 aprobada → KnowledgeUnit (nueva versión)
                                 rechazada → descartada (auditada igualmente)
```

Este flujo de promoción es la pieza clave que responde a "cómo evitar que agentes contaminen el conocimiento de la empresa": las propuestas de agente son **siempre de menor confianza por defecto** y pasan por gobernanza antes de volverse canónicas, mientras que fuentes de sistemas verificados pueden configurarse con promoción automática.

Toda actualización (aprobada o rechazada) invalida las cachés de `ContextPackage` que dependían de la unidad afectada.

---

## 8. ¿Cómo se indexa?

Índice híbrido, no uno solo — porque cada tipo de pregunta necesita un mecanismo distinto:

| Mecanismo | Resuelve | Implementación |
|---|---|---|
| Vectorial (semántico) | "¿qué se parece en significado a esto?" | `pgvector`, HNSW, particionado por `KnowledgeDomain` |
| Léxico (full-text) | Términos exactos, códigos, nombres propios, cifras | `tsvector` de Postgres |
| Grafo | "¿qué está relacionado con esto y cómo?" | Recorrido de `KnowledgeRelation` desde entidades semilla |
| Metadatos | Filtrado previo (dominio, sensibilidad, vigencia, tenant) | Índices B-tree estándar, aplicados **antes** de la búsqueda vectorial para acotar el espacio |
| Resúmenes precomputados | Recuperación a distintos niveles de detalle (ver §9) | Generados en el pipeline de ingesta, almacenados como `KnowledgeUnit` de tipo `summary` enlazadas a la unidad completa |

El orden de aplicación importa: **primero se filtra por metadatos y permisos, después se busca semánticamente** — nunca al revés. Esto es tanto una optimización de rendimiento como una garantía de seguridad (un agente sin acceso a Legal nunca llega a comparar vectores contra contenido de Legal).

---

## 9. ¿Cómo se audita?

Dos flujos de auditoría distintos, ambos obligatorios y no desactivables (heredado del principio del ADR-0001 §6.3):

1. **Auditoría de mutación** — todo lo que cambia en el Brain: quién/qué (`KnowledgeSource` o agente) creó, modificó o promovió una unidad, cuándo, y bajo qué revisión. Es la trazabilidad de "por qué la empresa sabe lo que sabe".
2. **Auditoría de recuperación (`RetrievalEvent`)** — cada vez que el Context Engine entrega un `ContextPackage`, se registra qué unidades se entregaron, a qué agente/ejecución, con qué score de relevancia y bajo qué política de acceso. Es la trazabilidad de "por qué el agente dijo/hizo lo que dijo/hizo" — se puede reconstruir el razonamiento de un agente hasta el conocimiento exacto que lo originó.

Ambos flujos alimentan el módulo Audit transversal del ADR-0001 como un tipo de evento especializado (`knowledge.mutation`, `knowledge.retrieval`), no como un sistema de auditoría paralelo.

---

## 10. Context Engineering: construir contexto sin prompts gigantes

Esta sección es el núcleo intelectual real del documento: **el Context Engine no busca "meter todo lo relevante", busca construir el contexto mínimo suficiente, presupuestado, estructurado y citado.**

### 10.1 Principios

1. **Retrieval-first, no inclusion-first.** Por defecto nunca se inyecta el Brain ni un dominio completo en el prompt. Se recupera el top-k de Knowledge Units más relevantes para la intención concreta de la tarea, no para "toda la conversación".
2. **Presupuesto de tokens como restricción de primera clase.** Cada solicitud de contexto declara un presupuesto. El Context Engine asigna ese presupuesto entre: instrucciones del agente, historial conversacional relevante, y conocimiento recuperado — con el conocimiento como partición explícita, no como resto de lo que sobre.
3. **Niveles de resumen jerárquico (zoom).** Cada Knowledge Unit puede tener versiones resumidas precomputadas (documento → sección → chunk). Si el presupuesto es ajustado, el Context Engine sube de nivel de zoom (usa el resumen) en vez de truncar arbitrariamente el texto.
4. **Recuperación dinámica vía tool-calling, no precarga estática.** El Context Package inicial es deliberadamente mínimo. Si el agente, durante su razonamiento, necesita más detalle, invoca una herramienta de búsqueda (`buscar_conocimiento`) que hace una nueva solicitud acotada al Context Engine — el contexto crece bajo demanda, no por adelantado "por si acaso".
5. **Deduplicación y compresión antes del ensamblado final.** Si varias unidades recuperadas son semánticamente redundantes (alta similitud entre sí), se colapsan en una sola antes de contar contra el presupuesto.
6. **Contexto estructurado, no texto libre concatenado.** El `ContextPackage` se organiza en segmentos con rol explícito (hechos, políticas, ejemplos, entidades relevantes), cada uno con su cita de origen — no un bloque de texto plano. Esto mejora tanto el razonamiento del LLM como la explicabilidad posterior.

### 10.2 Flujo de ensamblado

```
Intención de tarea + presupuesto de tokens
              │
              ▼
   Filtrado por Capability Model + dominio
              │
              ▼
   Recuperación híbrida (vector + léxico + grafo)  →  candidatos (N)
              │
              ▼
   Ranking (relevancia + vigencia + confianza de fuente)
              │
              ▼
   Deduplicación semántica
              │
              ▼
   ¿Cabe en presupuesto?
        │             │
       Sí             No
        │             │
        ▼             ▼
  Ensamblar tal   Sustituir unidades de menor rango
  cual (detalle    por su nivel de resumen (zoom out)
  completo)        │
        │           ▼
        │      ¿Sigue sin caber? → recortar por prioridad,
        │                          nunca por truncado ciego
        ▼                                │
        └──────────────┬─────────────────┘
                        ▼
              ContextPackage final
              (estructurado, citado, con snapshot_version)
                        │
                        ▼
              RetrievalEvent registrado
```

Esto responde directamente a "cómo evitar prompts gigantes": el prompt gigante es, por diseño, un **fallo de presupuesto y de zoom**, no algo que se previene con reglas ad-hoc en cada agente. El presupuesto y los niveles de resumen viven en el Context Engine, así que la disciplina es uniforme para todos los agentes, presente y futuros.

---

## 11. Soporte de múltiples agentes trabajando simultáneamente

La concurrencia se resuelve por **diseño de datos**, no por locking:

1. **Lecturas sin contención.** El Brain canónico es, desde la perspectiva de un agente, de solo lectura. Múltiples agentes pueden solicitar `ContextPackage`s en paralelo sin coordinarse entre sí — Postgres MVCC gestiona la concurrencia de lectura sin fricción.
2. **Escritura de un solo punto (single-writer canonicalization).** Los agentes nunca escriben directamente al Brain; generan `KnowledgeProposal`s. El paso de promoción a `KnowledgeUnit` canónica es serializado (una promoción a la vez por unidad afectada), eliminando condiciones de carrera en la capa canónica.
3. **Contexto efímero por ejecución.** Cada `ContextPackage` es propio de su `run_id`. No existe un "contexto compartido mutable" entre agentes concurrentes — cada uno tiene el suyo, inmutable una vez emitido.
4. **`snapshot_version` fija la vista.** Si el Brain se actualiza mientras un agente está en mitad de su ejecución, ese agente sigue viendo la versión que se le entregó al inicio (consistencia de lectura estable) — evita que una actualización a mitad de vuelo produzca resultados inconsistentes dentro de una misma ejecución.
5. **Colaboración multi-agente en un mismo Workflow (ADR-0001).** Cuando varios agentes cooperan en una misma tarea, comparten un **Run Context**: conocimiento de solo lectura del Brain + un scratchpad de trabajo específico del workflow. Ese scratchpad es **append-only** (cada agente añade sus hallazgos como entradas nuevas, nunca sobrescribe las de otro) — mismo principio de inmutabilidad que el resto del sistema, aplicado también al espacio de trabajo temporal.

En otras palabras: **todo el sistema evita el problema de concurrencia evitando la mutación compartida**, no resolviéndolo con bloqueos. Es coherente con el resto de decisiones del documento (versionado append-only, promoción serializada, contexto por ejecución).

---

## 12. Flujo de información de extremo a extremo

```
INGESTA                                    RECUPERACIÓN / CONTEXTO
────────                                   ───────────────────────

Fuente externa / manual / propuesta agente     Agent Runtime necesita actuar
        │                                              │
        ▼                                              ▼
 Pipeline de ingesta (async, cola)             Solicitud de contexto
   extracción → chunk → embed →                (intención + presupuesto)
   entidades/relaciones                                │
        │                                              ▼
        ▼                                       Context Engine
 ¿Confiable / autopromoción?                     - filtra por Capability Model
   │            │                                - recupera híbrido
  Sí            No → KnowledgeProposal            - rankea + dedup
   │              → revisión → aprobado/rechazado - ensambla con presupuesto
   ▼                                              │
 KnowledgeUnit (nueva versión)                    ▼
   │                                       ContextPackage (citado, versionado)
   ▼                                              │
 Grafo actualizado                                ▼
   │                                       Agent Runtime → LLM
   ▼                                              │
 Índices actualizados                             ├─(necesita más detalle)→ tool call
   │                                              │      → nueva solicitud acotada
   ▼                                              │
 Invalidación de cachés de ContextPackage         ▼
   │                                       RetrievalEvent registrado (auditoría)
   ▼
 Auditoría de mutación registrada
```

Ambos flujos comparten la misma infraestructura asíncrona (cola de trabajos) definida en ADR-0001 — no se introduce un sistema de mensajería paralelo.

---

## 13. Relación con ADR-0001 (corrección de capas)

El ADR-0001 situaba "Knowledge Base" como parte de la Capa 1 junto a Digital Employees e Integrations Hub, como si fueran pares. Este documento **reemplaza esa noción** por Company Brain como capa fundacional propia, de la que Digital Employees depende (no al revés):

```
Capas actualizadas
───────────────────
Capa 0 — Plataforma:        Tenancy · IAM · Audit
Capa 1 — Conocimiento:       COMPANY BRAIN  ← nueva capa fundacional
Capa 2 — Dominio de agentes: Digital Employees · Integrations Hub (alimenta el Brain)
Capa 3 — Ejecución:          Agent Runtime · Workflows (consumen el Brain vía Context Engine)
Capa 4 — Interacción:        Conversations · Notifications
Capa 5 — Negocio:            Billing · Admin Console
```

Se introduce además un nuevo paquete en la estructura del monorepo:

```
packages/
  company-brain/     # NUEVO — entidades, pipeline de ingesta, Context Engine
  ai-engine/          # se mantiene: mecánica de invocación LLM y tool-calling,
                       # consumidor de company-brain, no lo contiene
```

`ai-engine` deja de tener responsabilidad de RAG/embeddings propia — esa responsabilidad se centraliza por completo en `company-brain`. Esto evita que cada agente termine con su propia lógica de recuperación ad-hoc, que era exactamente el problema que este ADR busca evitar (§0).

---

## 14. Riesgos específicos de Company Brain

| Riesgo | Severidad | Mitigación |
|---|---|---|
| El Brain se convierte en cuello de botella si todo pasa por el Context Engine | Alta | Caché de `ContextPackage` con clave por snapshot_version + dominio + capability; precomputar paquetes para tareas frecuentes |
| Conocimiento obsoleto usado como si fuera vigente | Alta | Vigencia temporal obligatoria (`valid_from`/`valid_to`), sin excepciones; ranking penaliza antigüedad por defecto |
| Agentes "envenenando" el conocimiento canónico con propuestas erróneas en bucle | Alta | Confianza baja por defecto en `KnowledgeProposal`, gobernanza de promoción, límite de propuestas por agente/periodo |
| Fuga de conocimiento entre dominios/tenants vía el grafo (una relación cruza un límite que no debería) | Alta | Filtrado por permisos aplicado antes de cualquier recorrido de grafo, nunca después |
| Explosión de coste por recuperación excesiva ("por si acaso" en cada llamada) | Media | Presupuesto de tokens obligatorio en cada solicitud, recuperación dinámica vía tool-calling en vez de precarga |
| Resúmenes precomputados que se desincronizan de la unidad original | Media | Invalidación en cascada: nueva versión de unidad invalida su resumen asociado automáticamente |
| Crecimiento del grafo sin control (entidades/relaciones de baja calidad) | Media | Extracción de entidades con umbral de confianza, revisión periódica, deduplicación de entidades |

---

## 15. Decisiones abiertas

- Modelo exacto de `trust_level` por fuente y su efecto cuantitativo en el ranking de recuperación.
- Umbral y política por defecto de auto-promoción de `KnowledgeProposal` (¿por tipo de fuente? ¿por dominio? ¿configurable por tenant?).
- Algoritmo de extracción de entidades/relaciones para el grafo semántico (regla + LLM híbrido vs. pipeline dedicado) — se define en un ADR posterior de `company-brain`.
- Granularidad exacta de los niveles de resumen jerárquico (¿2 niveles bastan o se necesitan 3+?).
- Política de retención/expurgo de versiones antiguas de `KnowledgeUnit` (¿se archivan, se comprimen, se eliminan tras X tiempo por razones de compliance?).
