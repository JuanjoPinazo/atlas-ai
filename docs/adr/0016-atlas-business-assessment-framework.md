# ADR-0016: Atlas Business Assessment (ABA)

| | |
|---|---|
| **Estado** | Propuesto |
| **Fecha** | 2026-07-11 |
| **Alcance** | Transversal — el motor de evaluación es el mismo para cualquier vertical; el banco de preguntas es una instanciación |
| **Depende de** | [ADR-0011](0011-atlas-discovery-assessment-framework.md) · [AIF-0001 / ADR-0008](0008-atlas-intelligence-framework.md) · [AED-0001 / ADR-0009](0009-atlas-employee-designer.md) · [ADR-0015](0015-atlas-integration-hub.md) |
| **Instanciado por** | [Atlas Dental Knowledge Library](../dkb/00_Master_Index.md) y [Atlas Business Value Library](../abvl/00_Master_Index.md), cuya taxonomía de 9 categorías operativas se reutiliza aquí sin modificarla |
| **Nota de alcance** | Este documento no rediseña el proceso comercial de Discovery ya definido en ADR-0011 — define el **motor de contenido y puntuación** que ese proceso consume en sus etapas de cuestionario y scoring |

---

## 0. Qué es ABA y qué NO es

[ADR-0011](0011-atlas-discovery-assessment-framework.md) definió el **proceso** completo de Discovery: metodología, etapas, generación de propuesta comercial, gobernanza de revisión humana. Dos de sus etapas — "Cuestionario adaptativo" (§4) y "Modelo de puntuación" (§5) — se describieron ahí de forma abstracta, sin especificar cómo funciona realmente un árbol de preguntas que se adapta, ni cómo una respuesta concreta se convierte en un número.

**Atlas Business Assessment es ese motor.** No es un proceso comercial nuevo, no sustituye ni redefine el pipeline de ADR-0011, no cambia cómo ni cuándo se genera una propuesta comercial. Es el componente que ADR-0011 orquesta y consume: el banco de preguntas, el árbol adaptativo que decide qué preguntar a continuación, el motor de puntuación que traduce respuestas en índices, y la lógica que convierte esos índices en oportunidades y un roadmap concretos.

Esta distinción importa porque evita duplicar arquitectura: **ADR-0011 gobierna cuándo y cómo se usa un Assessment; ABA define qué se pregunta y cómo se puntúa.**

---

## 1. Arquitectura del Assessment

```
┌─────────────────────────────────────────────────────────────┐
│  CAPA DE GENERACIÓN                                            │
│  Oportunidades detectadas · Roadmap · Contenido de propuesta   │
└───────────────────────────▲─────────────────────────────────┘
                            │
┌───────────────────────────┴─────────────────────────────────┐
│  CAPA DE PUNTUACIÓN                                             │
│  Motor de puntuación → índices (Maturity, Opportunity,          │
│  Health, Digital/DNA/Employee Readiness — ya definidos          │
│  en ADR-0011 §6-11, aquí se calculan, no se redefinen)          │
└───────────────────────────▲─────────────────────────────────┘
                            │
┌───────────────────────────┴─────────────────────────────────┐
│  CAPA DE ÁRBOL ADAPTATIVO                                       │
│  Reglas de ramificación — decide la siguiente pregunta          │
│  o si ya hay señal suficiente para dejar de preguntar           │
└───────────────────────────▲─────────────────────────────────┘
                            │
┌───────────────────────────┴─────────────────────────────────┐
│  CAPA DE CONTENIDO                                              │
│  Banco de preguntas — versionado, instanciado por vertical      │
│  (para Dental: la biblioteca ABA-Dental-01, §17)                │
└─────────────────────────────────────────────────────────────┘
```

Cada capa es reemplazable sin tocar las demás — el mismo principio de separación ya aplicado en toda la plataforma (Adaptador/Connector en ADR-0015, motor/conocimiento en AIF-0001 frente a DKB/ABVL).

---

## 2. Árbol de preguntas adaptativo

El árbol no es una lista fija — es un grafo donde cada nodo es una pregunta y cada arista es una condición sobre la respuesta ya dada. Las categorías raíz del árbol son las **9 categorías operativas ya establecidas** por la Atlas Dental Knowledge Library ([Índice Maestro §1](../dkb/00_Master_Index.md)): Empresa, Personas, Paciente, Servicios, Agenda, Recepción, Marketing, Finanzas, Operaciones — deliberadamente, no se inventa una taxonomía nueva para el Assessment.

El recorrido del árbol respeta el mismo principio de restricción de contenido ya fijado en [PVD-0002 §Principios](../pvd/0002-first-customer-experience.md) y reafirmado en [ADR-0011 §4](0011-atlas-discovery-assessment-framework.md): el árbol se acorta activamente donde ya hay señal suficiente, y profundiza solo donde hay ambigüedad o donde una respuesta revela un vacío relevante.

---

## 3. Banco de preguntas

Cada pregunta del banco declara, como mínimo:

| Campo | Propósito |
|---|---|
| `id` | Identificador único, con prefijo de categoría (p. ej. `PAC-01`) |
| `categoría` | Una de las 9 categorías operativas (§2) |
| `texto` | La pregunta tal como se presenta, redactada en el mismo registro conversacional ya exigido en ADR-0011 §4 |
| `formato` | Sí/no, escala, numérico, texto libre, selección múltiple |
| `profundiza_si` | Condición sobre la respuesta que activa preguntas adicionales de la misma categoría (§5) |
| `mapea_a` | El índice (§6) y/o la oportunidad de negocio (§7) que esta pregunta alimenta |

Este esquema es el mismo, sin importar el vertical — lo que cambia entre verticales es el contenido concreto de cada campo, nunca la forma.

---

## 4. Motor de puntuación

Reutiliza sin modificar el marco común ya fijado en [ADR-0011 §5](0011-atlas-discovery-assessment-framework.md): cada respuesta es una señal con un peso y una confianza propia — una respuesta autodeclarada nunca pesa igual que una señal pública verificable. Lo que este documento añade es la mecánica concreta: **cada respuesta a una pregunta del banco se convierte en exactamente una señal de entrada de ese marco**, con el peso y la categoría de índice que la propia pregunta ya declara en su campo `mapea_a`.

---

## 5. Reglas de ramificación

Tres tipos de regla, aplicadas en este orden:

1. **Profundización por vacío detectado.** Una respuesta que indica ausencia de un proceso (p. ej. "no hacemos seguimiento sistemático de presupuestos") activa las preguntas de profundización de esa categoría — casi siempre las de mayor peso hacia el Opportunity Score (§6).
2. **Cierre por proceso ya resuelto.** Una respuesta que indica un proceso ya bien gestionado desactiva las preguntas de profundización de esa categoría y el árbol avanza a la siguiente — evita alargar el cuestionario sin necesidad.
3. **Dependencia entre categorías.** Ciertas respuestas de una categoría activan o desactivan preguntas de otra — p. ej., una respuesta que indica que la clínica es multidisciplinar (categoría Empresa) activa un bloque adicional en Servicios sobre coordinación entre especialistas ([DKB-PAC-01 §6](../dkb/03_Paciente/DKB-PAC-01_Recorrido_Paciente.md) equivalente para el escenario multi-especialidad).

---

## 6. Cálculo de índices

Los índices son, exactamente, los ya nombrados y definidos en ADR-0011 §6-11 — ABA no crea índices nuevos, calcula los existentes:

| Índice | Cómo lo calcula ABA |
|---|---|
| **Atlas Maturity Assessment** | Patrón de respuestas de las categorías Empresa, Personas y Operaciones, mapeado a los 5 niveles del Atlas Maturity Model ([AIF-0001 §5](0008-atlas-intelligence-framework.md)) |
| **Atlas Opportunity Score** | Suma ponderada de las oportunidades detectadas (§7), cada una multiplicada por la confianza de la señal que la activó |
| **Health Score** | Agregación de respuestas de categorías de estado actual (Paciente, Recepción, Marketing) — nunca de las de potencial |
| **Digital Readiness** | Agregación de respuestas de Operaciones y Agenda sobre sistemas ya digitalizados y su capacidad de integración (ver §14) |
| **Business DNA Readiness** | Agregación de respuestas de Empresa y Personas sobre claridad de criterio de decisión y autoridad comercial |
| **Employee Readiness** | Agregación de respuestas de Personas sobre apertura al cambio y claridad de roles existentes |

---

## 7. Generación automática de oportunidades

Cada pregunta cuyo campo `mapea_a` (§3) referencia una oportunidad de la [Atlas Business Value Library](../abvl/00_Master_Index.md), y cuya respuesta indica un vacío, genera un candidato de oportunidad para ese prospecto concreto — mismo mecanismo ya descrito en [ADR-0011 §16](0011-atlas-discovery-assessment-framework.md), ahora con el origen exacto de la señal trazado hasta la pregunta y la respuesta que la activó. Ninguna oportunidad se genera sin esa trazabilidad — coherente con la disciplina de explicabilidad de toda la plataforma.

---

## 8. Priorización

ABA no implementa un motor de priorización propio — entrega sus oportunidades detectadas (§7) al Priority Engine ya definido en [AIF-0001 §6.4](0008-atlas-intelligence-framework.md), que las ordena por el mismo criterio de urgencia × impacto × confianza que usa para cualquier otro cliente ya operando. Es, otra vez, reutilización, no duplicación.

---

## 9. Relación con Discovery

ADR-0011 orquesta el proceso completo — decide cuándo se lanza un Assessment, qué se muestra al prospecto, y gobierna la revisión humana antes de cualquier entrega comercial. ABA es el motor que ADR-0011 invoca en sus etapas 2 ("Cuestionario adaptativo") y 4 ("Modelo de puntuación", ver [ADR-0011 §3](0011-atlas-discovery-assessment-framework.md)). Ningún dato ni índice de ABA llega al prospecto sin pasar, después, por la gobernanza ya fijada en ADR-0011 §17-18.

---

## 10. Relación con Business Value

El banco de preguntas está diseñado, pregunta a pregunta, para poder activar cualquier entrada del catálogo de la [Atlas Business Value Library](../abvl/00_Master_Index.md) — es la fuente de la que se derivan las condiciones de activación de cada oportunidad (§7). Un cambio en el catálogo de ABVL (una oportunidad nueva, una prioridad revisada) debe reflejarse en el banco de preguntas correspondiente, nunca al revés.

---

## 11. Relación con Company Brain

Si el prospecto se convierte en cliente, las respuestas ya dadas durante el Assessment no se descartan — se convierten en las primeras `KnowledgeProposal` del Company Brain de ese cliente ([ADR-0002 §8](0002-company-brain.md)), gobernadas exactamente igual que cualquier otra propuesta de conocimiento, nunca aplicadas de forma silenciosa. Una respuesta como "trabajamos con tres laboratorios externos habituales" se convierte en el punto de partida real del dominio de Operaciones de ese cliente, no en un dato que se pierde tras la venta.

---

## 12. Relación con Business DNA

Las preguntas de las categorías Empresa y Personas que tocan apetito de riesgo y autoridad de decisión alimentan directamente los primeros valores de `DNATrait` y `DNARedLine` del cliente — generalización, a una escala mucho más rica (≈100 preguntas frente a las 5 del Momento 4 de onboarding), del mismo mecanismo ya descrito en [PVD-0002](../pvd/0002-first-customer-experience.md) y [PVD-0003 §4](../pvd/0003-business-dna.md). El Momento 4 del onboarding no repite lo ya respondido en el Assessment — lo confirma y lo refina.

---

## 13. Relación con Employee Designer

Las oportunidades detectadas (§7), una vez priorizadas (§8), determinan directamente qué especializaciones de [AED-0001 §4](0009-atlas-employee-designer.md) recomendar primero — mismo mecanismo ya descrito en ADR-0011 §16 ("Empleados Digitales recomendados"), ahora alimentado con precisión pregunta por pregunta en vez de una inferencia genérica de vertical.

---

## 14. Relación con Integration Hub

Las preguntas de la categoría Operaciones que preguntan qué sistema de gestión clínica, agenda o pasarela de pago usa la clínica (p. ej. `OPE-01`, §17) se contrastan directamente contra el catálogo de conectores prioritarios ya definido en [ADR-0015](0015-atlas-integration-hub.md). El resultado no es solo informativo — determina la complejidad real de implantación: si la clínica usa un PMS ya catalogado y certificado, el Digital Readiness (§6) sube; si usa un sistema no catalogado, ABA lo señala como una brecha a resolver en el plan de implantación (§15), no como una suposición optimista.

---

## 15. Generación automática de Roadmap

A partir de las oportunidades priorizadas (§8), ABA genera una secuencia candidata de implantación respetando tres restricciones, en este orden:

1. **Viabilidad técnica real** — una oportunidad que depende de un conector no disponible o no catalogado (§14) no se secuencia antes de resolver esa dependencia.
2. **El orden de impacto ya validado del catálogo de vertical** — la prioridad general de [ABVL](../abvl/00_Master_Index.md) (MVP/Fase 2/Avanzado) es el punto de partida, nunca se ignora sin motivo.
3. **Las brechas específicas de este prospecto** — una oportunidad de alto impacto general pero ya bien resuelta por este prospecto concreto (señal negativa en §7) se reordena hacia abajo, aunque el catálogo general la marque como prioritaria.

Esta secuencia candidata es la que alimenta el "Plan de implantación" ya definido en [ADR-0011 §15](0011-atlas-discovery-assessment-framework.md) — ABA la genera, ADR-0011 la presenta y la gobierna.

---

## 16. Generación automática de propuesta comercial

ABA no genera el documento de propuesta comercial en sí — ese artefacto, su plantilla y su gobernanza de revisión humana obligatoria ya están definidos en [ADR-0011 §17](0011-atlas-discovery-assessment-framework.md). Lo que ABA aporta es el **contenido estructurado y trazable** que rellena esa plantilla: cada oportunidad citada en la propuesta enlaza a la pregunta y la respuesta exactas que la originaron (§7), de modo que ningún punto de la propuesta comercial es una afirmación genérica de vertical — todos son trazables al propio prospecto.

---

## 17. La biblioteca ABA-Dental-01

Primera instanciación del banco de preguntas (§3), para el vertical Dental — 99 preguntas organizadas en las 9 categorías operativas ya establecidas por la Atlas Dental Knowledge Library. **Nivel de confianza: Borrador**, misma convención de trazabilidad que el resto de bibliotecas del programa — pendiente de validación con clínicas piloto antes de fijar pesos definitivos.

### 01 · Empresa (12 preguntas)

| ID | Pregunta | Formato | Mapea a |
|---|---|---|---|
| EMP-01 | ¿Cuántas sedes tiene la clínica? | Numérico | Digital Readiness, modelo de clínica ([DKB-EMP-01](../dkb/01_Empresa/DKB-EMP-01_Modelos_Clinica.md)) |
| EMP-02 | ¿La clínica pertenece a una franquicia o cadena? | Sí/No | Modelo de clínica (franquicia) |
| EMP-03 | ¿Cuántos profesionales clínicos trabajan en la clínica? | Numérico | Tamaño, complejidad |
| EMP-04 | ¿La clínica es de gestión familiar? | Sí/No | Modelo de clínica (familiar) |
| EMP-05 | ¿Existe un gerente o responsable de gestión distinto del/de los dentista(s)? | Sí/No | Business DNA Readiness |
| EMP-06 | ¿La clínica dispone de laboratorio propio? | Sí/No | Modelo de clínica (laboratorio propio) |
| EMP-07 | ¿Con cuántos laboratorios externos trabaja habitualmente? | Numérico | Modelo de clínica (laboratorio externo) |
| EMP-08 | ¿La clínica se posiciona como premium o de alto standing? | Escala | Modelo de clínica (premium) |
| EMP-09 | ¿La clínica ofrece más de una especialidad bajo el mismo techo? | Sí/No | Modelo de clínica (multidisciplinar) |
| EMP-10 | ¿Cuánto tiempo lleva operando la clínica? | Numérico (años) | Atlas Maturity Assessment |
| EMP-11 | ¿Quién toma las decisiones comerciales importantes? | Texto/Opción | Business DNA Readiness |
| EMP-12 | ¿Ha cambiado la titularidad o gestión en los últimos 2 años? | Sí/No | Health Score |

### 02 · Personas (11 preguntas)

| ID | Pregunta | Formato | Mapea a |
|---|---|---|---|
| PER-01 | ¿Cuántas personas forman el equipo de recepción/administración? | Numérico | Digital Readiness |
| PER-02 | ¿Existe un coordinador de tratamientos/presupuestos dedicado? | Sí/No | ABVL-01 |
| PER-03 | ¿El equipo administrativo está sobrecargado en horas punta? | Escala | ABVL-04 |
| PER-04 | ¿Cuánta rotación de personal ha habido en el último año? | Numérico | Health Score |
| PER-05 | ¿El propietario o dentista dedica tiempo a tareas administrativas? | Escala | ABVL-10 |
| PER-06 | ¿Cómo de abierto está el equipo a adoptar nuevas herramientas digitales? | Escala | Employee Readiness |
| PER-07 | ¿Existen roles y responsabilidades claramente definidos? | Sí/No | Employee Readiness |
| PER-08 | ¿Hay higienistas dentales en plantilla? | Sí/No | Servicios |
| PER-09 | ¿El equipo clínico incluye especialistas externos colaboradores? | Sí/No | Modelo de clínica |
| PER-10 | ¿Cómo describiría la actitud general del equipo ante el cambio? | Escala | Employee Readiness |
| PER-11 | ¿Existe un plan de formación continua para el equipo? | Sí/No | Employee Readiness |

### 03 · Paciente (13 preguntas)

| ID | Pregunta | Formato | Mapea a |
|---|---|---|---|
| PAC-01 | ¿Existe seguimiento sistemático de presupuestos pendientes? | Sí/No | **ABVL-01** — señal de mayor peso de toda la biblioteca |
| PAC-02 | ¿Cuánto tiempo suele tardar un paciente en decidir sobre un presupuesto? | Numérico (días) | ABVL-01, ROI estimado |
| PAC-03 | ¿Se realizan recordatorios de revisión periódica (recall)? | Sí/No | ABVL-02 |
| PAC-04 | ¿Se gestionan las inasistencias (no-shows) de forma activa? | Sí/No | ABVL-03 |
| PAC-05 | ¿Se ofrecen huecos liberados por cancelación a otros pacientes? | Sí/No | ABVL-05 |
| PAC-06 | ¿Existe algún proceso de reactivación de pacientes inactivos? | Sí/No | ABVL-06 |
| PAC-07 | ¿Cuánto tiempo tarda de media en responderse a un primer contacto? | Numérico | ABVL-13 |
| PAC-08 | ¿Se pide activamente una reseña tras un buen desenlace de tratamiento? | Sí/No | ABVL-09 |
| PAC-09 | ¿Existe algún programa de recomendación entre pacientes? | Sí/No | ABVL-11 |
| PAC-10 | ¿Se realiza seguimiento proactivo tras intervenciones relevantes? | Sí/No | Health Score |
| PAC-11 | ¿Cuál es la tasa aproximada de aceptación de presupuestos? | Numérico/Rango | Atlas Opportunity Score |
| PAC-12 | ¿Se detectan pacientes candidatos a tratamiento adicional de forma sistemática? | Sí/No | ABVL-16 |
| PAC-13 | ¿Existe un criterio definido para ofrecer financiación al paciente? | Sí/No | ABVL-07 |

### 04 · Servicios (10 preguntas)

| ID | Pregunta | Formato | Mapea a |
|---|---|---|---|
| SRV-01 | ¿Qué especialidades ofrece la clínica? | Selección múltiple | Modelo de clínica, catálogo |
| SRV-02 | ¿Ofrece implantología? | Sí/No | Catálogo, ticket medio |
| SRV-03 | ¿Ofrece ortodoncia (incluyendo alineadores)? | Sí/No | Catálogo |
| SRV-04 | ¿Ofrece odontopediatría? | Sí/No | Catálogo |
| SRV-05 | ¿Dispone de escáner intraoral? | Sí/No | Integration Hub — máxima sensibilidad (ADR-0015) |
| SRV-06 | ¿Dispone de CBCT o radiología propia? | Sí/No | Catálogo, Digital Readiness |
| SRV-07 | ¿Realiza sedación en clínica? | Sí/No | Catálogo |
| SRV-08 | ¿Cuál es el tratamiento de mayor ticket medio que ofrece? | Texto | ROI estimado |
| SRV-09 | ¿Existe un catálogo de precios documentado y actualizado? | Sí/No | Company Brain readiness |
| SRV-10 | ¿Ofrece odontología estética (blanqueamiento, carillas)? | Sí/No | Catálogo |

### 05 · Agenda (12 preguntas)

| ID | Pregunta | Formato | Mapea a |
|---|---|---|---|
| AGE-01 | ¿Qué sistema usa para gestionar la agenda? | Texto/Opción | Integration Hub |
| AGE-02 | ¿La agenda está digitalizada? | Sí/No | Digital Readiness |
| AGE-03 | ¿Cuál es la tasa aproximada de cancelaciones de última hora? | Numérico | ABVL-20 |
| AGE-04 | ¿Existe lista de espera activa para huecos liberados? | Sí/No | ABVL-05 |
| AGE-05 | ¿Cómo se coordina la agenda con los tiempos de laboratorio? | Texto/Escala | ABVL-15 |
| AGE-06 | ¿Existen bloqueos de agenda por tipo de tratamiento? | Sí/No | Digital Readiness |
| AGE-07 | ¿Cuál es la ocupación media de sillón estimada? | Numérico/Rango | ABVL-25 |
| AGE-08 | ¿Se gestionan las primeras visitas con un proceso diferenciado? | Sí/No | ABVL-13 |
| AGE-09 | ¿Cuántos profesionales comparten agenda? | Numérico | Complejidad, modelo multidisciplinar |
| AGE-10 | ¿Existen citas de urgencia reservadas en la agenda diaria? | Sí/No | Protocolo de urgencias |
| AGE-11 | ¿Cuánto tiempo de antelación media tiene una cita nueva? | Numérico | ABVL-13 |
| AGE-12 | ¿Se agendan automáticamente citas de seguimiento tras el alta de un tratamiento? | Sí/No | ABVL-02 |

### 06 · Recepción (10 preguntas)

| ID | Pregunta | Formato | Mapea a |
|---|---|---|---|
| REC-01 | ¿Cuántas llamadas recibe la clínica en un día típico? | Numérico | ABVL-04 |
| REC-02 | ¿Se pierden llamadas en horas punta? | Escala | ABVL-04 |
| REC-03 | ¿Existe atención fuera del horario de apertura? | Sí/No | ABVL-04 |
| REC-04 | ¿Por qué canales pueden contactar los pacientes? | Selección múltiple | Integration Hub |
| REC-05 | ¿Existe un guion o criterio compartido entre quienes atienden? | Sí/No | ABVL-18 |
| REC-06 | ¿Cómo se gestionan las urgencias telefónicas? | Texto/Escala | Protocolo de urgencias |
| REC-07 | ¿Se registra el origen de cada nuevo contacto? | Sí/No | ABVL-08 |
| REC-08 | ¿Cuánto tiempo tarda de media en resolverse una duda frecuente? | Numérico | ABVL-13 |
| REC-09 | ¿Existen preguntas frecuentes documentadas? | Sí/No | Company Brain readiness |
| REC-10 | ¿Cómo describiría la carga de trabajo de recepción en horas punta? | Escala | Health Score |

### 07 · Marketing (10 preguntas)

| ID | Pregunta | Formato | Mapea a |
|---|---|---|---|
| MKT-01 | ¿Qué canales de captación usa la clínica? | Selección múltiple | ABVL-08 |
| MKT-02 | ¿Existe presencia activa en Google Business Profile? | Sí/No | ABVL-09 |
| MKT-03 | ¿Se ejecutan campañas de pago (Google Ads, Meta)? | Sí/No | ABVL-22 |
| MKT-04 | ¿Se mide la conversión real de cada canal de marketing? | Sí/No | ABVL-08, ABVL-22 |
| MKT-05 | ¿Qué proporción de pacientes nuevos llega por referido? | Numérico/Rango | ABVL-11 |
| MKT-06 | ¿Existe relación sistemática con clínicas remitentes? | Sí/No | Modelo de clínica especializada |
| MKT-07 | ¿Cuál es la puntuación media de reseñas actual? | Numérico | Health Score |
| MKT-08 | ¿Existe un protocolo de respuesta a reseñas negativas? | Sí/No | ABVL-09 |
| MKT-09 | ¿Se realizan campañas de reactivación de pacientes inactivos? | Sí/No | ABVL-06 |
| MKT-10 | ¿Existe un presupuesto de marketing definido y gestionado activamente? | Sí/No | ABVL-22 |

### 08 · Finanzas (11 preguntas)

| ID | Pregunta | Formato | Mapea a |
|---|---|---|---|
| FIN-01 | ¿Qué opciones de financiación ofrece la clínica? | Selección múltiple | Integration Hub, ABVL-07 |
| FIN-02 | ¿Trabaja con alguna entidad de financiación externa? | Texto/Opción | Integration Hub |
| FIN-03 | ¿Existe seguimiento de impagos o cuotas vencidas? | Sí/No | ABVL-17 |
| FIN-04 | ¿Cuál es el ticket medio aproximado de tratamiento? | Numérico | ROI estimado |
| FIN-05 | ¿Cuál es la facturación aproximada mensual? | Rango | Priorización, tamaño |
| FIN-06 | ¿Se consolidan presupuestos que abarcan varias especialidades? | Sí/No | ABVL-12 |
| FIN-07 | ¿Existen fases de pago predefinidas para tratamientos largos? | Sí/No | ABVL-01 |
| FIN-08 | ¿Se hace seguimiento del tiempo entre presupuesto aceptado e inicio de tratamiento? | Sí/No | ABVL-01 |
| FIN-09 | ¿Quién aprueba condiciones económicas especiales? | Texto | Business DNA Readiness |
| FIN-10 | ¿Existe un sistema de facturación digital? | Sí/No | Digital Readiness |
| FIN-11 | ¿Se revisa periódicamente el tarifario de la clínica? | Sí/No | Company Brain readiness |

### 09 · Operaciones (10 preguntas)

| ID | Pregunta | Formato | Mapea a |
|---|---|---|---|
| OPE-01 | ¿Qué sistema de gestión clínica (PMS) utiliza la clínica? | Texto/Opción | **Integration Hub — pregunta más determinante de toda la biblioteca** |
| OPE-02 | ¿El PMS ofrece API o exportación de datos? | Sí/No/No sabe | Integration Hub, viabilidad de implantación |
| OPE-03 | ¿Cómo se gestiona el pedido de materiales recurrentes? | Texto/Escala | ABVL-23 |
| OPE-04 | ¿Se ha sufrido rotura de stock que canceló un tratamiento? | Sí/No | ABVL-23 |
| OPE-05 | ¿Cómo se coordina la comunicación interna entre profesionales? | Texto/Escala | ABVL-19 |
| OPE-06 | ¿Existe un proceso documentado de gestión de incidencias? | Sí/No | Health Score |
| OPE-07 | ¿Se realiza algún tipo de auditoría o control de calidad interno? | Sí/No | Atlas Maturity Assessment |
| OPE-08 | ¿La clínica participa en algún grupo o red de intercambio de buenas prácticas? | Sí/No | Preparación para Atlas Intelligence Network |
| OPE-09 | ¿Qué documentación de consentimiento informado se utiliza? | Texto/Opción | Company Brain readiness, cumplimiento |
| OPE-10 | ¿Existe un plan de mantenimiento preventivo del equipamiento clínico? | Sí/No | Health Score |

**Total: 99 preguntas.**

---

## 18. Riesgos

| Riesgo | Severidad | Mitigación |
|---|---|---|
| El banco de preguntas se desincroniza del catálogo real de ABVL a medida que este crece | Media | El campo `mapea_a` (§3) se revisa como parte del mismo proceso de gobernanza que cualquier cambio de ABVL, nunca de forma independiente |
| Ramificación mal calibrada alarga el cuestionario más de lo tolerable | Media | Mismo límite de restricción de contenido de ADR-0011 §4/§23 — a validar con tiempos reales de clínicas piloto |
| Preguntas de Operaciones (OPE-01, OPE-02) generan expectativas de integración que el catálogo de conectores todavía no soporta | Alta | El resultado de esas preguntas debe presentarse siempre junto al estado real del catálogo de ADR-0015, nunca como una promesa genérica de compatibilidad |
| El peso de una señal se calibra por intuición sin validar contra desempeño real posterior | Media | Mismo principio de calibración continua ya aplicado en ADR-0011 §5 — pendiente de datos reales |

---

## 19. Decisiones abiertas

- Pesos exactos por defecto de cada pregunta hacia sus índices — a calibrar con clínicas piloto reales, no fijados por intuición inicial.
- Si el Assessment debe reutilizarse, más allá de Discovery, como mecanismo de reevaluación periódica de un cliente ya activo — candidato natural de integración futura con el Business Evolution Engine ([AIF-0001 §6.9](0008-atlas-intelligence-framework.md)).
- Umbral exacto de "señal suficiente" que activa el cierre anticipado de una categoría (§5, regla 2).
- Formato definitivo de las preguntas de selección múltiple y escala — a validar junto con la interfaz real del cuestionario en ADR-0011.
