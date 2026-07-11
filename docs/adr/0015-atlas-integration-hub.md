# ADR-0015: Atlas Integration Hub

| | |
|---|---|
| **Estado** | Propuesto |
| **Fecha** | 2026-07-11 |
| **Alcance** | Transversal — el framework de integración es el mismo para cualquier vertical; los conectores concretos son instanciaciones |
| **Depende de** | [ADR-0001](0001-arquitectura-base-atlas-ai.md) · [ADR-0005](0005-decision-engine-validation-engine.md) · [ADR-0006](0006-digital-employee-runtime.md) · [ADR-0007](0007-knowledge-acquisition-engine.md) · [ADR-0012](0012-atlas-event-driven-architecture.md) · [ADR-0014](0014-production-data-runtime-and-fallback-strategy.md) · [AIF-0001 / ADR-0008](0008-atlas-intelligence-framework.md) · [AED-0001 / ADR-0009](0009-atlas-employee-designer.md) |
| **Relacionado con** | [PVD-0005 §5](../pvd/0005-atlas-dental-intelligence-blueprint.md) ("Company Brain ≠ Historia Clínica") · [PVD-0006](../pvd/0006-atlas-intelligence-network.md) (Marketplace) · [ADR-0011](0011-atlas-discovery-assessment-framework.md) (Digital Readiness) |
| **Nota de alcance** | Este documento diseña el **framework** general de integración. No diseña ningún conector concreto — el catálogo de conectores prioritarios de Dental (§Conectores prioritarios) se cataloga y prioriza, no se especifica técnicamente. Eso corresponde a ADR posteriores, uno por conector o familia de conectores. |
| **Estatus especial** | Documento fundamental de Atlas OS. Ningún módulo de la plataforma habla directamente con un sistema externo — todo acceso a un sistema externo pasa por este framework. |

---

## 1. Filosofía del Integration Hub

ATLAS AI no sustituye los sistemas que una clínica ya usa — el PMS donde vive la ficha del paciente, el calendario donde ya gestiona su agenda, la pasarela de pago con la que ya cobra. Este es un anti-objetivo ya fijado desde [PVD-0001 §3](../pvd/0001-product-vision-atlas-ai.md): "no sustituimos sistemas transaccionales de terceros; nos integramos con ellos, nunca competimos por sustituirlos." El Integration Hub es la pieza arquitectónica que hace ese principio real, no solo declarado: es la capa por la que ATLAS AI **lee y actúa** sobre esos sistemas sin nunca convertirse en un segundo sistema de registro que compita con ellos.

Tres convicciones gobiernan este documento:

1. **Un conector es una traducción, nunca una copia.** El Hub nunca duplica el sistema de registro de un tercero dentro de ATLAS AI — traduce sus señales a eventos de plataforma y sus acciones a llamadas gobernadas, sin convertirse en el lugar donde esa información "vive" de verdad.
2. **Ninguna integración está exenta de la gobernanza del resto de la plataforma.** Una llamada a Stripe o una lectura de Gesden pasa por el mismo Decision Engine, el mismo Event Bus, la misma auditoría que cualquier otra acción de un Empleado Digital — no existe una vía rápida "porque es solo una integración".
3. **Un conector se construye una vez y beneficia a todos los clientes que usan ese mismo sistema.** Igual que un Knowledge Pack (PVD-0006), un conector certificado (§20) es un activo reutilizable de la plataforma, no una integración a medida por cliente.

---

## 2. Principios arquitectónicos

- **Adaptador, no reescritura.** Cada tipo de integración (§3) se normaliza a través de un Adaptador (§5) antes de tocar el resto de la plataforma — ningún otro módulo conoce los detalles del protocolo externo concreto.
- **Minimización de datos por diseño.** Un conector nunca importa ni sincroniza más información de la estrictamente necesaria para la capacidad que declara — coherente con la disciplina de sensibilidad ya establecida en [ADR-0002](0002-company-brain.md) y, de forma explícita para el vertical dental, con [PVD-0005 §5](../pvd/0005-atlas-dental-intelligence-blueprint.md).
- **Todo conector es sustituible.** Mismo principio que rige a un Empleado Digital ([AED-0001 §1](0009-atlas-employee-designer.md)): un conector mal mantenido se sustituye sin romper el resto del sistema, porque nada fuera de su propio Adaptador conoce sus detalles internos.
- **Gobernanza uniforme, sin excepción de conveniencia.** Ninguna integración se exime del Decision Engine (ADR-0005), del Event Bus (ADR-0012) ni de la auditoría transversal (ADR-0001 §6.3).
- **Un fallo externo nunca se convierte en un fallback silencioso.** Extiende directamente la Decisión Obligatoria de [ADR-0014 §2](0014-production-data-runtime-and-fallback-strategy.md) al mundo exterior: si Gesden no responde, ATLAS AI nunca "inventa" un dato de paciente para seguir adelante — el fallo se propaga, se audita y se muestra.

---

## 3. Tipos de integración

| Tipo | Uso típico en el vertical dental | Naturaleza |
|---|---|---|
| **APIs REST** | La mayoría de PMS modernos, pasarelas de pago, plataformas de comunicación | Síncrono, request/response |
| **GraphQL** | Sistemas de nueva generación que lo expongan — poco frecuente hoy en el ecosistema dental, el Adaptador debe soportarlo para proveedores futuros | Síncrono, consulta tipada |
| **Webhooks** | Confirmación de pago, mensaje entrante de WhatsApp, evento de calendario | Asíncrono, entrante, iniciado por el tercero |
| **Ficheros CSV/Excel** | Exportaciones periódicas de sistemas PMS legados sin API | Por lotes, programado |
| **FTP/SFTP** | Entrega periódica de esos ficheros por parte de laboratorios o proveedores sin API moderna | Por lotes, programado |
| **Email** | Notificaciones de proveedores de financiación o laboratorios pequeños sin ninguna otra vía | Asíncrono, entrante, no estructurado |
| **Bases de datos** | Conexión de solo lectura al PMS cuando no ofrece ni API ni exportación | El caso de mayor sensibilidad — máximo cuidado de gobierno (§7-8) |
| **HL7/FHIR** | Preparación futura — estándar de interoperabilidad sanitaria hacia el que probablemente migren los PMS dentales, y puente natural hacia otros verticales sanitarios (Estética, Veterinaria) | No se implementa todavía; el Adaptador reserva el espacio conceptual |

---

## 4. Catálogo de conectores

El registro central y gobernado de **definiciones** de conector — metadatos, contrato (§Modelo estándar Connector), capacidades declaradas — distinto de una **instancia** activa de ese conector para un tenant concreto (que además lleva credenciales propias, §7). El catálogo es la lista que un cliente ve al configurar sus integraciones, y la base sobre la que el Marketplace (§19) publica y distribuye conectores.

---

## 5. Adaptadores

La capa de traducción técnica por tipo de integración (§3): un Adaptador sabe hablar REST, webhook, SFTP o email — nada más. Un Connector (la definición de negocio de un proveedor concreto, p. ej. "Gesden") se construye **sobre** uno o más Adaptadores, nunca reimplementa la lógica de protocolo por su cuenta. Esta separación es lo que permite que añadir un proveedor nuevo del mismo tipo (otro PMS que también expone REST) sea una tarea de definición de Connector, no de construcción de infraestructura nueva.

---

## 6. Modelo de autenticación

El Hub soporta una estrategia de autenticación conectable por conector, nunca hardcodeada en su implementación: OAuth2 (la mayoría de APIs modernas), clave de API, autenticación básica, certificado/mTLS (sistemas de grado sanitario que lo exijan), par de claves SSH (SFTP). La estrategia de autenticación es un atributo declarado del Connector (§Modelo estándar Connector), no una decisión de código distinta por proveedor.

---

## 7. Gestión de credenciales

Las credenciales de un conector se almacenan **por tenant**, con el mismo aislamiento por `organization_id` y RLS ya exigido en toda la plataforma (ADR-0001 §5.2) — la cuenta de Gesden de una clínica nunca es visible, ni siquiera a nivel de metadatos, para otra. Ninguna credencial de tenant se comparte entre organizaciones aunque usen el mismo proveedor externo.

---

## 8. Gestión de secretos

Extiende directamente la disciplina ya fijada en [ADR-0014 §16](0014-production-data-runtime-and-fallback-strategy.md), aplicada aquí a secretos de terceros en vez de a la configuración propia de la plataforma: ninguna clave de API o token OAuth de un conector se almacena en texto plano, ninguna variable de configuración de conector se resuelve con un valor por defecto silencioso ante ausencia, y el acceso a un secreto de conector fuera de la ejecución del propio Adaptador requiere el mismo `SupportAccessGrant` acotado y auditado ya definido en [ADR-0010 §10](0010-atlas-command-control-architecture.md).

---

## 9. Sincronización

Tres estrategias, elegidas por conector según lo que el proveedor externo permite, nunca una sola impuesta:

- **Push** (dirigido por webhook) — tiempo real, preferido cuando el proveedor lo ofrece.
- **Pull** (sondeo programado) — para proveedores sin webhooks, ejecutado sobre la misma infraestructura de cola asíncrona ya prevista en [ADR-0001 §7](0001-arquitectura-base-atlas-ai.md).
- **Por lotes** (importación programada de ficheros) — para los tipos CSV/Excel y FTP/SFTP de §3.

---

## 10. Eventos emitidos (del mundo exterior hacia ATLAS)

Cuando el Hub recibe una señal externa (un webhook, un cambio detectado por sondeo, un fichero nuevo en SFTP), la traduce en dos etapas, nunca en una sola:

1. Un evento genérico de conector (`ConnectorEventReceived`), con el payload crudo normalizado por el Adaptador — publicado en el Event Bus (ADR-0012).
2. Si corresponde, un módulo de dominio (nunca el propio Hub) traduce ese evento genérico a un evento de dominio ya catalogado — p. ej., un mensaje entrante de WhatsApp se convierte, por el módulo de Presupuestos, en `BudgetPatientResponded` ([ADR-0013 §5](0013-dental-budget-follow-up-vertical-slice.md)).

Esta separación en dos etapas evita que el Integration Hub acumule lógica de negocio propia — es, deliberadamente, un traductor genérico, nunca un motor de dominio (mismo principio de "no crear motores nuevos" ya aplicado en ADR-0013).

---

## 11. Eventos recibidos (de ATLAS hacia el mundo exterior)

Cuando un Empleado Digital necesita ejecutar una acción externa (enviar un mensaje de WhatsApp, cobrar un pago), esa acción ya pasó por el Decision Engine como cualquier otra (`action_request` autorizado, ADR-0005 §4.3, ejecutado por el Tool Executor, ADR-0006 §6). El Hub **recibe** esa instrucción ya gobernada — nunca decide por su cuenta si ejecutarla — la traduce a la llamada externa concreta vía el Adaptador correspondiente, y reporta el resultado (éxito o fallo) de vuelta como un nuevo evento (`ConnectorActionCompleted`/`ConnectorActionFailed`) al Event Bus.

---

## 12. Reintentos

Aplica directamente la taxonomía ya fijada en [ADR-0006 §7-8](0006-digital-employee-runtime.md): un fallo transitorio de un proveedor externo se reintenta con backoff acotado; una acción no idempotente (enviar un mensaje, cobrar un pago) nunca se reintenta sin una clave de idempotencia verificada, mismo patrón que [ADR-0013 §8](0013-dental-budget-follow-up-vertical-slice.md) generalizado aquí a cualquier conector.

---

## 13. Circuit Breaker

Ante fallos consecutivos de un proveedor externo, el Hub deja de intentar llamadas durante un periodo de enfriamiento, marca el `health` del conector (§Modelo estándar Connector) como degradado, y emite un evento de alerta — nunca sigue reintentando indefinidamente ni recurre a un dato sustituto silencioso (misma prohibición de ADR-0014 §2, extendida aquí). El estado del disyuntor es visible, no una degradación oculta.

---

## 14. Rate Limiting

Cada conector declara los límites de uso del proveedor externo que representa (§Modelo estándar Connector, campo `capacidades`). El Hub aplica ese límite de forma activa, por tenant y por conector, tanto para respetar las condiciones del proveedor externo (evitar que se suspenda la cuenta de un cliente) como para proteger la propia infraestructura de ATLAS AI de que un conector con mucha demanda degrade a los demás — mismo principio de "vecino ruidoso" ya fijado en ADR-0001 §7, aplicado aquí al presupuesto de llamadas externas.

---

## 15. Monitorización

La salud, latencia y tasa de error de cada conector, agregada por tenant y por flota completa, alimenta directamente Atlas Control Tower ([ADR-0010 §8](0010-atlas-command-control-architecture.md)) — sin introducir un sistema de monitorización paralelo. Un conector degradado en muchos tenants a la vez es, en sí mismo, una señal de riesgo de plataforma (reutiliza el Risk Engine interno de ADR-0010 §3, no una lógica de alerta propia del Hub).

---

## 16. Auditoría

Toda llamada externa, entrante o saliente, es un evento auditable en el Event Bus (ADR-0012) — la misma disciplina transversal de ADR-0001 §6.3 se aplica sin excepción a las integraciones. No existe ninguna llamada a un sistema externo que no deje rastro.

---

## 17. Versionado de conectores

Un Connector se versiona igual que un Knowledge Pack ([PVD-0006 §6-9](../pvd/0006-atlas-intelligence-network.md)): un cambio en la API de un proveedor externo se traduce en una nueva versión del conector, nunca en la edición silenciosa de la versión existente. La adopción de una nueva versión por parte de un tenant sigue el mismo despliegue por cohortes ya definido en [ADR-0010 §7](0010-atlas-command-control-architecture.md), nunca una actualización forzada sin aviso.

---

## 18. Sandbox

Todo conector debe declarar, cuando el proveedor externo lo permite, un modo sandbox — credenciales y entorno de pruebas del propio proveedor (Stripe en modo test, Twilio con credenciales de prueba). El modo sandbox es el que se usa durante Discovery ([ADR-0011](0011-atlas-discovery-assessment-framework.md)) y durante la configuración inicial de un conector por parte de un cliente, nunca contra datos ni sistemas reales — coherente con el Modo DEMO explícito ya definido en [ADR-0014 §5](0014-production-data-runtime-and-fallback-strategy.md).

---

## 19. Marketplace de conectores

Extiende directamente la definición ya introducida en [AIF-0001 §2](0008-atlas-intelligence-framework.md) ("integraciones de terceros" como parte del Marketplace) con tratamiento arquitectónico completo: los conectores se publican, se descubren y se instalan por un cliente exactamente con el mismo mecanismo que un Knowledge Pack — el Marketplace es una superficie compartida, no una para conocimiento y otra distinta para integraciones.

---

## 20. Certificación de conectores

Ningún conector llega al Marketplace general sin pasar por un proceso de certificación, gestionado desde Knowledge Studio con el mismo rigor de curación humana ya exigido para un Knowledge Pack (ADR-0007 §10, PVD-0006 §6). Tres niveles:

| Nivel | Significado |
|---|---|
| **Comunidad** | Construido y mantenido sin revisión formal de ATLAS AI — visibilidad limitada, uso bajo responsabilidad del cliente |
| **Verificado** | Revisado por el equipo de ATLAS AI — autenticación, manejo de errores y límites de tasa correctos, sin fuga de datos detectada |
| **Certificado** | Verificado además con historial de uso real sostenido sin incidencias — mismo criterio de evidencia acumulada que una certificación de competencia de un Empleado Digital ([AED-0001 §16](0009-atlas-employee-designer.md)) |

Un conector puede perder su nivel de certificación si se degrada su fiabilidad — la certificación se revisa periódicamente, nunca es permanente por defecto.

---

## Modelo estándar `Connector`

Contrato de forma — tipos e interfaces, sin lógica, mismo principio ya usado en ADR-0006 §12 y ADR-0012 §6.

```typescript
type ConnectorStatus = 'active' | 'deprecated' | 'sandbox_only' | 'disabled';
type ConnectorHealth = 'healthy' | 'degraded' | 'down';
type CertificationLevel = 'community' | 'verified' | 'certified';

interface Connector {
  readonly provider: string;                 // p. ej. "gesden", "whatsapp_business", "stripe"
  readonly version: string;                   // semántico, versionado (§17)
  readonly capabilities: ConnectorCapability[];
  readonly events: ConnectorEventType[];       // tipos de evento que este conector puede emitir (§10)
  readonly actions: ConnectorAction[];         // acciones que este conector puede ejecutar (§11)
  readonly permissions: ConnectorPermissionScope[]; // qué capability_grant exige cada acción
  readonly status: ConnectorStatus;
  readonly health: ConnectorHealth;            // estado en vivo, alimenta Control Tower (§15)
  readonly latency: { p50Ms: number; p95Ms: number };
  readonly errors: { ratePercent: number; lastErrorSummary?: string };
  readonly cost: { model: 'free' | 'subscription' | 'per_call'; estimateNote?: string };
  readonly documentation: { url: string; certificationLevel: CertificationLevel };
}

interface ConnectorCapability {
  readonly name: string;               // p. ej. "read_appointments", "send_message"
  readonly integrationType: 'rest' | 'graphql' | 'webhook' | 'file' | 'sftp' | 'email' | 'database' | 'hl7_fhir';
  readonly rateLimit?: { requests: number; perSeconds: number };
}

interface ConnectorAction {
  readonly name: string;
  readonly parametersSchemaRef: string; // referencia al esquema de parámetros, no el esquema embebido aquí
  readonly idempotent: boolean;          // mismo principio de ADR-0006 §9
}

interface ConnectorEventType {
  readonly name: string;                // se registra también en el Event Catalog (ADR-0012 §4)
  readonly sensitivity: 'LOW' | 'NORMAL' | 'HIGH' | 'CRITICAL';
}

interface ConnectorPermissionScope {
  readonly action: string;
  readonly requiredCapabilityDomain: string; // referencia a un KnowledgeDomain o categoría de acción
}
```

---

## Conectores prioritarios para Dental

Catalogados y priorizados — **no especificados técnicamente en este documento**, cada uno se desarrolla en su propio ADR posterior.

| Conector | Categoría | Tipo de integración principal | Prioridad | Referencia de proceso |
|---|---|---|---|---|
| **Gesden** | Sistema de gestión clínica (PMS) | REST o base de datos, según versión | MVP | [DKB-PAC-01 §3, §6](../dkb/03_Paciente/DKB-PAC-01_Recorrido_Paciente.md); nunca clínico, solo referencia (PVD-0005 §5) |
| **Klinikk** | PMS | REST | MVP | Igual que Gesden |
| **Dentidesk** | PMS | REST | MVP | Igual que Gesden |
| **WhatsApp Business** | Comunicación con el paciente | API REST + Webhook | MVP | Canal por defecto en [ADR-0013](0013-dental-budget-follow-up-vertical-slice.md) |
| **Twilio** | Comunicación (SMS, voz) | REST + Webhook | MVP | [DKB-PAC-01 §7](../dkb/03_Paciente/DKB-PAC-01_Recorrido_Paciente.md) (Recepción) |
| **Aircall** | Telefonía / centralita | REST + Webhook | MVP | Recepción, triage de llamadas |
| **Google Calendar** | Agenda | REST | Fase 2 | [DKB-PAC-01 §9](../dkb/03_Paciente/DKB-PAC-01_Recorrido_Paciente.md) (Agenda), complementario al PMS |
| **Microsoft 365** | Agenda / correo | REST | Fase 2 | Igual que Google Calendar |
| **Stripe** | Pagos | REST + Webhook | Fase 2 | [ABVL-07](../abvl/00_Master_Index.md) (Financiación) |
| **Redsys** | Pagos (España) | REST + Webhook | Fase 2 | Igual que Stripe |
| **Santander Consumer** | Financiación externa | REST | Fase 2 | [DKB-PAC-01 §7](../dkb/03_Paciente/DKB-PAC-01_Recorrido_Paciente.md) (Financiación) — nunca simula aprobación de crédito, solo informa condiciones |
| **Pepper Money** | Financiación externa | REST | Fase 2 | Igual que Santander Consumer |
| **Laboratorios dentales** | Operaciones | REST, email o FTP/SFTP según laboratorio | Avanzado | [DKB-EMP-01 §8-9](../dkb/01_Empresa/DKB-EMP-01_Modelos_Clinica.md) |
| **Proveedores de implantes** | Operaciones / materiales | REST o EDI/FTP según proveedor | Avanzado | Gestión de materiales y pedidos |
| **Escáneres intraorales** | Diagnóstico clínico | Archivo o API propietaria del fabricante | Avanzado — máxima sensibilidad | Solo metadatos de estado (p. ej. "escaneo completado"), **nunca contenido de imagen diagnóstica**, coherente sin excepción con [PVD-0005 §5](../pvd/0005-atlas-dental-intelligence-blueprint.md) |

La prioridad de este catálogo sigue la misma lógica de impacto de negocio ya validada en [DKB-PAC-01](../dkb/03_Paciente/DKB-PAC-01_Recorrido_Paciente.md) y [Atlas Business Value Library](../abvl/00_Master_Index.md): primero lo que hace real el flujo de mayor valor (presupuestos, comunicación con el paciente), después lo que lo complementa (agenda, financiación), y por último lo de mayor complejidad de integración y menor frecuencia de interacción directa con el paciente (operaciones, equipamiento clínico).

---

## Integración con el resto de la arquitectura

| Sistema | Cómo se integra el Hub con él |
|---|---|
| **Event Bus** (ADR-0012) | Es el mecanismo exclusivo de entrada y salida del Hub — ninguna señal externa ni acción saliente ocurre fuera de él (§10-11) |
| **Company Brain** (ADR-0002) | Los conectores de tipo archivo/base de datos alimentan el pipeline de ingesta (ADR-0007) como `KnowledgeSource` — **nunca** los conectores a sistemas clínicos por paciente, que se consultan en vivo y por referencia, jamás como conocimiento genérico (PVD-0005 §5) |
| **Business DNA** (PVD-0003) | Qué conectores están habilitados, y con qué nivel de sensibilidad se clasifican sus datos, se rige por las líneas rojas y el apetito de riesgo declarados por el cliente |
| **Atlas Employee Designer** (AED-0001) | El catálogo de conectores es la fuente real de "herramientas" asignables a un Empleado Digital (AED-0001 §6) — un Coordinador de Presupuestos solo puede usar los conectores de comunicación y pago que su `capability_grant` autoriza |
| **Discovery** (ADR-0011) | La evaluación de Digital Readiness (ADR-0011 §9) se basa directamente en qué conectores de este catálogo ya usaría un prospecto — determina la complejidad real de implantación |
| **ROI Engine** (AIF-0001 §6.5) | Eventos de conector (p. ej. confirmación de pago) son, con frecuencia, la marca de comportamiento observable que sostiene una atribución de ROI conservadora (ADR-0013 §12) |
| **Atlas HQ / Control Tower** (ADR-0010) | La salud y el coste agregado de conectores, a través de toda la flota de tenants, es una de las señales de negocio de mayor valor operativo para el equipo interno de ATLAS AI |

---

## Riesgos

| Riesgo | Severidad | Mitigación |
|---|---|---|
| Un conector a un PMS legado sin API obliga a una integración de base de datos de alta sensibilidad | Alta | Tratamiento explícito como caso de máximo cuidado de gobierno (§3, §7-8), nunca como una integración REST más |
| Presión comercial para lanzar un conector no certificado directamente a producción de un cliente | Alta | Proceso de certificación (§20) como requisito no negociable antes de Marketplace general, aunque sí se permite en nivel "Comunidad" con visibilidad limitada |
| Un conector de escáner intraoral termina, por conveniencia técnica, transmitiendo contenido de imagen diagnóstica | Crítica si ocurre | Línea roja explícita en el catálogo de conectores prioritarios — solo metadatos de estado, nunca contenido clínico |
| Proliferación de conectores ad-hoc por cliente, fuera del catálogo gobernado | Media | Todo conector, incluso uno construido para un solo cliente, se registra en el Catálogo (§4) antes de activarse — mismo principio que el Event Catalog de ADR-0012 §4 |

---

## Decisiones abiertas

- Tecnología concreta de almacenamiento cifrado de credenciales por tenant (§7-8) — a definir en el ADR de esquema de datos de este framework.
- Umbral exacto de fallos consecutivos que activa el disyuntor de circuito (§13) por tipo de conector.
- Orden exacto de desarrollo dentro de cada nivel de prioridad del catálogo de conectores de Dental — candidato a resolverse con datos reales de Discovery (ADR-0011) sobre qué sistemas declaran usar los primeros clientes piloto.
- Si HL7/FHIR (§3) debe empezar a prototiparse antes de la expansión a un segundo vertical sanitario, o esperar a que exista demanda real de un proveedor concreto que lo exija.
