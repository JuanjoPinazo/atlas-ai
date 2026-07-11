# Atlas Dental Knowledge Library — Índice Maestro

| Campo | Valor |
|---|---|
| **Biblioteca** | Atlas Dental Knowledge Library |
| **ID de documento** | DKB-IDX-00 |
| **Versión** | 1.0 |
| **Responsable** | Por asignar — Equipo de Producto, Vertical Dental |
| **Fecha de última actualización** | 2026-07-09 |
| **Nivel de confianza** | Estructural — define las reglas de la biblioteca, no contenido de dominio |
| **Relación con otros documentos** | Referenciado por todos los documentos de la biblioteca |

---

## Qué es esta biblioteca

La Atlas Dental Knowledge Library es la base de conocimiento definitiva del vertical dental de ATLAS AI: una colección de documentos independientes, versionables y con metadatos propios, organizados por dominio de negocio en vez de por orden de creación. Cada documento puede evolucionar, revisarse y ganar (o perder) confianza sin arrastrar al resto de la biblioteca — y, en conjunto, están escritos para alimentar directamente la generación de Knowledge Domains, Knowledge Units, Business DNA, Policies, Decision Rules, automatizaciones, Empleados Digitales, Knowledge Packs, material comercial, ayuda contextual y guiones de onboarding.

Dos principios distintos gobiernan esta biblioteca, y no deben confundirse entre sí:

1. **La taxonomía** (§1) — cómo se organiza el conocimiento, de forma estable y permanente.
2. **La hoja de ruta de construcción** (§3) — en qué orden se escribe, que sigue el impacto de negocio, no el orden de la taxonomía.

---

## 1. Taxonomía — las 12 categorías

```
docs/dkb/
├── 00_Master_Index.md                 ◀── este documento
├── 01_Empresa/          (DKB-EMP-…)
├── 02_Personas/         (DKB-PER-…)
├── 03_Paciente/         (DKB-PAC-…)
├── 04_Servicios/        (DKB-SRV-…)
├── 05_Agenda/           (DKB-AGE-…)
├── 06_Recepcion/        (DKB-REC-…)
├── 07_Marketing/        (DKB-MKT-…)
├── 08_Finanzas/         (DKB-FIN-…)
├── 09_Operaciones/      (DKB-OPE-…)
├── 10_Automatizaciones/ (DKB-AUT-…)
├── 11_IA/               (DKB-IA-…)
└── 12_ROI/              (DKB-ROI-…)
```

| # | Categoría | Código | Qué cubre |
|---|---|---|---|
| 01 | Empresa | `EMP` | Modelos de negocio de clínica: independiente, familiar, premium, multidisciplinar, especializada, franquicia, grupo, laboratorio propio/externo |
| 02 | Personas | `PER` | Roles humanos: propietario, gerente, director médico, recepción, coordinador de tratamientos, odontólogos, especialistas, higienistas, auxiliares, marketing, laboratorio |
| 03 | Paciente | `PAC` | El recorrido completo del paciente, de captación a recomendación |
| 04 | Servicios | `SRV` | Catálogo de especialidades y tratamientos ofrecidos |
| 05 | Agenda | `AGE` | Planificación, recursos, huecos, listas de espera, cancelaciones |
| 06 | Recepción | `REC` | Llamadas, mensajería, primer contacto, urgencias, objeciones |
| 07 | Marketing | `MKT` | Captación, SEO local, campañas, reputación, origen de paciente |
| 08 | Finanzas | `FIN` | Presupuestos, financiación, fases de pago, impagos |
| 09 | Operaciones | `OPE` | Laboratorio, materiales, proveedores, coordinación interna |
| 10 | Automatizaciones | `AUT` | Catálogo transversal de automatizaciones recomendadas por proceso |
| 11 | IA | `IA` | Empleados Digitales del vertical y su configuración |
| 12 | ROI | `ROI` | Indicadores, rentabilidad, beneficio cuantificable |

**Convención de ID de documento**: `DKB-<CÓDIGO>-<NN>` (p. ej. `DKB-PAC-01`). El número es un contador propio de cada categoría, no correlativo entre categorías — la biblioteca crece por dominio, no por secuencia global.

---

## 2. Esquema de metadatos obligatorio

Todo documento de la biblioteca incluye, en su cabecera, estos campos sin excepción:

| Campo | Significado |
|---|---|
| **Biblioteca / Categoría / ID de documento** | Ubicación del documento en la taxonomía (§1) |
| **Versión** | Numeración semántica simple (1.0, 1.1, 2.0…) — un cambio de versión mayor implica revalidación del nivel de confianza |
| **Responsable** | Persona o equipo dueño del contenido — quién decide si una revisión se acepta |
| **Fecha de última actualización** | Fecha de la última modificación sustantiva, no de formato |
| **Nivel de confianza** | Ver escala en §2.1 |
| **Fuentes** | De dónde viene el conocimiento del documento (consultoría experta, entrevistas, datos de clínicas piloto…) |
| **Evidencia** | Qué prueba concreta respalda las afirmaciones del documento — distinto de "fuentes": la fuente dice de dónde viene la idea, la evidencia dice qué la confirma |
| **Relación con otros documentos** | Enlaces explícitos a documentos de los que depende, a los que alimenta, o con los que se relaciona |

### 2.1 Escala de nivel de confianza

| Nivel | Significado |
|---|---|
| **Borrador** | Contenido de partida, basado en conocimiento experto de consultoría, sin contraste con clínicas reales todavía |
| **Validado parcialmente** | Contrastado con 1–2 clínicas piloto; patrones plausibles pero sin confirmar a escala |
| **Validado** | Contrastado con múltiples clínicas piloto de distintos modelos; patrón confirmado con evidencia real |

Todos los documentos de la biblioteca nacen en **Borrador** — subir de nivel es un evento explícito, registrado en el propio documento, nunca una promoción silenciosa.

### 2.2 Convención de trazabilidad de afirmaciones (dentro del cuerpo del documento)

Heredada de la primera plantilla de la biblioteca ([DKB-EMP-01](01_Empresa/DKB-EMP-01_Modelos_Clinica.md)) y obligatoria en toda la biblioteca:

- **[HECHO]** — verificable por definición o por lo ya establecido en la arquitectura de ATLAS AI.
- **[HIPÓTESIS — validar con clínicas piloto]** — afirmación razonable pero no verificada; nunca se inventa una cifra estadística o económica concreta sin este marcado.
- **[RECOMENDACIÓN]** — decisión de producto o de implantación sugerida, abierta a discusión.

---

## 3. Hoja de ruta de construcción por impacto de negocio

La biblioteca no se construye en el orden de la taxonomía (§1) — se construye en el orden en que genera valor de negocio verificable, para poder empezar a construir funcionalidad real, validar con clínicas piloto y medir ROI sin esperar a que la biblioteca esté completa.

| Orden | Documento | Categoría | Por qué este orden | Estado |
|---|---|---|---|---|
| **1** | Recorrido completo del paciente | 03 Paciente | De aquí se derivan casi todos los demás documentos y activos de producto — Business DNA, automatizaciones, Empleados Digitales, ROI, KPIs, Knowledge Packs | ✅ Construido — [DKB-PAC-01](03_Paciente/DKB-PAC-01_Recorrido_Paciente.md) |
| 2 | Recepción y comunicaciones | 06 Recepción | Mayor volumen de interacción diaria, mayor visibilidad inmediata de valor | Pendiente |
| 3 | Agenda y planificación | 05 Agenda | Segundo mayor volumen operativo, base de la coordinación de todo el recorrido | Pendiente |
| 4 | Presupuestos y financiación | 08 Finanzas | El mayor punto de fuga de ingresos identificado en el vertical | Pendiente |
| 5 | Automatizaciones | 10 Automatizaciones | Consolida en un catálogo transversal lo detectado en los 4 documentos anteriores | Pendiente |
| 6 | Indicadores y rentabilidad | 12 ROI | Con los 5 anteriores ya es posible definir KPIs y modelo de beneficio con base real | Pendiente |
| 7 | Organización y roles | 02 Personas | Necesario para refinar permisos y capability grants por rol | Pendiente |
| 8 | Servicios y especialidades | 04 Servicios | Catálogo de contenido, de menor complejidad de gobernanza | Pendiente |
| 9 | Operaciones | 09 Operaciones | Menor frecuencia de interacción con el paciente, mayor complejidad de integración (laboratorio) | Pendiente |
| 10 | Marketing y reputación | 07 Marketing | Depende de tener ya definido el recorrido y las automatizaciones base | Pendiente |
| 11 | Empleados Digitales | 11 IA | Se define mejor una vez existen los procesos que cada Empleado Digital va a cubrir | Pendiente |
| 12 | Modelos de clínica | 01 Empresa | Ya construido como plantilla de calidad — fija el nivel de detalle, no la prioridad de negocio | ✅ Construido — [DKB-EMP-01](01_Empresa/DKB-EMP-01_Modelos_Clinica.md) |

**[RECOMENDACIÓN]** Con los primeros cinco documentos de esta hoja de ruta completos, la biblioteca cubre aproximadamente el conjunto de procesos de mayor valor comercial del vertical dental — suficiente para empezar a construir funcionalidad real y validar con clínicas piloto sin esperar a que la biblioteca esté terminada al 100%.

---

## 4. Estado actual de la biblioteca

| ID | Documento | Categoría | Versión | Nivel de confianza | Orden de prioridad |
|---|---|---|---|---|---|
| [DKB-PAC-01](03_Paciente/DKB-PAC-01_Recorrido_Paciente.md) | Recorrido Completo del Paciente | 03 Paciente | 1.0 | Borrador | 1 |
| [DKB-EMP-01](01_Empresa/DKB-EMP-01_Modelos_Clinica.md) | Modelos de Clínica Dental | 01 Empresa | 1.0 | Borrador | 12 |

Este apartado se actualiza cada vez que se añade o revisa un documento de la biblioteca — es la fuente de verdad sobre qué existe, en qué versión y con qué nivel de confianza, sin tener que abrir cada documento individualmente.

---

## 5. Grafo de relaciones (vista inicial)

```
DKB-PAC-01 (Recorrido del Paciente)
   │  documento fundacional — el resto de la biblioteca lo referencia
   │
   ├──alimenta──▶ DKB-REC-01 (Recepción)         [pendiente]
   ├──alimenta──▶ DKB-AGE-01 (Agenda)             [pendiente]
   ├──alimenta──▶ DKB-FIN-01 (Presupuestos)       [pendiente]
   ├──alimenta──▶ DKB-AUT-01 (Automatizaciones)   [pendiente]
   ├──alimenta──▶ DKB-ROI-01 (KPIs y ROI)         [pendiente]
   ├──alimenta──▶ DKB-IA-01  (Empleados Digitales) [pendiente]
   └──relacionado──▶ DKB-EMP-01 (Modelos de Clínica) — el recorrido
                      varía ligeramente según el modelo de clínica
```

Este grafo se completa a medida que se añaden documentos — cada nuevo documento debe declarar sus relaciones en su propia cabecera (§2) y, cuando corresponda, actualizar este grafo.
