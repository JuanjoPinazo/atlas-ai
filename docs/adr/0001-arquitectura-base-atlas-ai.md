# ADR-0001: Arquitectura Base de ATLAS AI

| | |
|---|---|
| **Estado** | Propuesto |
| **Fecha** | 2026-07-09 |
| **Autores** | Arquitectura de Producto |
| **Alcance** | Arquitectura fundacional de la plataforma (pre-código) |

---

## 0. Contexto y declaración de producto

ATLAS AI **no es un CRM**. Es una plataforma SaaS multiempresa que permite a las organizaciones crear, configurar, supervisar y operar **Empleados Digitales**: agentes de IA con rol, identidad, memoria, herramientas y permisos propios, que ejecutan trabajo dentro de los sistemas de la empresa (no solo conversan).

Esta distinción es la que más condiciona la arquitectura frente a un CRM o SaaS de datos tradicional:

- El **objeto central del dominio no es el "contacto" o el "deal", es el Empleado Digital** (agente) y sus **ejecuciones** (runs, acciones, decisiones).
- Existen **dos sujetos con permisos**: humanos y agentes. Los agentes actúan sobre sistemas reales, por lo que necesitan un modelo de autorización, auditoría y contención propio.
- Hay una carga de trabajo que **no encaja en el ciclo request/response serverless**: ejecución de agentes, llamadas a LLM, tool-calling, tareas largas o asíncronas.
- La confianza del cliente depende de la **trazabilidad total** de lo que un agente hizo, por qué, y con qué autorización.

Estas cuatro particularidades son la base de las decisiones de este ADR.

---

## 1. Arquitectura completa

### 1.1 Visión de alto nivel

```
                    ┌──────────────────────────────────────────┐
                    │              Vercel Edge/CDN              │
                    │   Next.js App Router (RSC + Server Actions)│
                    └───────────────┬────────────────────────────┘
                                    │
              ┌─────────────────────┼─────────────────────┐
              │                     │                     │
      ┌───────▼───────┐    ┌────────▼────────┐   ┌────────▼────────┐
      │   Web App      │    │   API Routes /  │   │  Admin Console  │
      │ (Dashboard UI) │    │  Route Handlers │   │  (Ops interno)  │
      └───────┬────────┘    └────────┬────────┘   └────────┬────────┘
              │                      │                     │
              └──────────┬───────────┴──────────┬──────────┘
                         │                      │
                ┌────────▼────────┐   ┌─────────▼─────────┐
                │  Data Access     │   │  Permission /      │
                │  Layer (DAL)     │   │  Tenancy Engine     │
                └────────┬────────┘   └─────────┬───────────┘
                         │                      │
              ┌──────────▼──────────────────────▼───────────┐
              │              Supabase (Postgres)              │
              │  RLS multi-tenant · Auth · Storage · Realtime │
              │              pgvector (conocimiento)          │
              └──────────┬──────────────────────┬─────────────┘
                         │                      │
              ┌──────────▼──────────┐  ┌────────▼────────────┐
              │   Job Queue / Bus    │  │  Integraciones ext.  │
              │ (ejecución async)    │  │ (OAuth por tenant)   │
              └──────────┬───────────┘  └───────────────────────┘
                         │
              ┌──────────▼───────────┐
              │  Agent Runtime        │
              │  (workers, tool-call, │
              │   memoria, LLM router)│
              └──────────┬───────────┘
                         │
              ┌──────────▼───────────┐
              │  Proveedores LLM       │
              │ (abstraídos, no lock-in)│
              └────────────────────────┘
```

### 1.2 Decisión clave: separar "plataforma web" de "runtime de agentes"

La UI y el CRUD de configuración viven cómodamente en Next.js/Vercel (serverless, stateless, request/response). **La ejecución de agentes no**: puede implicar llamadas encadenadas a LLM, tool-calling, esperas, reintentos y duración variable, lo cual choca con los límites de tiempo de las funciones serverless de Vercel.

Por eso el Agent Runtime se trata como un **subsistema desacoplado**, orquestado vía cola de trabajos (job queue), que puede ejecutarse en Vercel Functions de larga duración, en un worker dedicado (Fly.io/Render/ECS) o en un servicio tipo Trigger.dev/Inngest. Next.js nunca ejecuta un agente de forma síncrona dentro de una request de usuario; siempre encola y notifica el resultado (via Realtime/webhooks).

### 1.3 Componentes principales

| Componente | Responsabilidad | Tecnología |
|---|---|---|
| Web App | UI del producto (dashboard, configuración, chat) | Next.js 15 (App Router), React 19, TS, Tailwind |
| Admin Console | Operación interna, soporte, impersonación de tenant | Next.js (app separada) |
| Data Access Layer | Único punto de acceso a datos, aplica contexto de tenant | TS, Supabase client tipado |
| Permission Engine | Evalúa RBAC/ABAC para humanos y agentes | TS puro (package compartido) |
| Agent Runtime | Ejecuta agentes: LLM calls, tool-calling, memoria | Workers Node/TS, colas |
| Knowledge Base | Ingesta, embeddings, RAG por tenant | Supabase + pgvector |
| Integrations Hub | Conectores OAuth a sistemas externos | Edge Functions / workers |
| Audit Log | Registro inmutable de toda acción humana o de agente | Postgres append-only + export |
| Billing | Medición de uso (tokens, runs) y facturación | Stripe + tabla de usage |

---

## 2. Estructura de carpetas

Se recomienda **monorepo con Turborepo** desde el día uno. Aunque el producto arranque como una sola app, el dominio (tenancy, permisos, runtime de agentes) debe vivir en paquetes agnósticos de framework para poder reutilizarse en workers, admin console y, más adelante, SDKs/API pública.

```
atlas-ai/
├── apps/
│   ├── web/                     # Producto SaaS (cliente final)
│   │   ├── src/
│   │   │   ├── app/
│   │   │   │   ├── (marketing)/
│   │   │   │   ├── (auth)/
│   │   │   │   ├── (dashboard)/
│   │   │   │   │   └── [org]/
│   │   │   │   │       ├── employees/       # Empleados Digitales
│   │   │   │   │       ├── conversations/
│   │   │   │   │       ├── workflows/
│   │   │   │   │       ├── knowledge/
│   │   │   │   │       ├── integrations/
│   │   │   │   │       ├── audit/
│   │   │   │   │       ├── settings/
│   │   │   │   │       └── billing/
│   │   │   │   └── api/
│   │   │   ├── components/
│   │   │   ├── features/        # slices por módulo de dominio
│   │   │   ├── server/          # server actions, DAL wiring
│   │   │   ├── hooks/
│   │   │   └── middleware.ts    # resolución de tenant, auth
│   │   └── ...
│   ├── admin/                   # Consola interna (equipo ATLAS)
│   └── workers/                 # Procesos del Agent Runtime (si no es externo)
│
├── packages/
│   ├── core/                    # Dominio puro: entidades, casos de uso
│   │   ├── tenancy/
│   │   ├── permissions/
│   │   ├── agents/
│   │   └── audit/
│   ├── ai-engine/                # Orquestación LLM, tool-calling, memoria
│   ├── database/                 # Cliente Supabase, tipos generados, DAL base
│   ├── auth/                     # Helpers de sesión, claims, RBAC/ABAC
│   ├── ui/                       # Componentes compartidos (Tailwind + shadcn)
│   └── config/                   # eslint, tsconfig, tailwind config compartidos
│
├── supabase/
│   ├── migrations/
│   ├── functions/                # Edge Functions (webhooks, triggers ligeros)
│   └── seed.sql
│
├── docs/
│   └── adr/                      # Este documento y siguientes decisiones
│
├── turbo.json
└── package.json
```

**Regla de dependencia**: `apps/*` puede importar de `packages/*`, nunca al revés. `packages/core` no importa de Next.js, React ni Supabase directamente (solo tipos) para mantenerlo testeable y portable.

---

## 3. Módulos principales

1. **Tenancy & Organization Management** — organizaciones, workspaces, jerarquía (si aplica), configuración por tenant.
2. **IAM (Identity & Access)** — usuarios humanos, invitaciones, sesiones, SSO futuro.
3. **Digital Employees** — definición de agentes: rol, persona, capacidades, modelo asignado, límites.
4. **Agent Runtime / Orchestration Engine** — ejecución real: tool-calling, memoria, encadenado de pasos, reintentos.
5. **Knowledge Base (RAG)** — documentos, embeddings, aislamiento de conocimiento por tenant/agente.
6. **Integrations Hub** — conectores OAuth/API a sistemas externos (correo, Slack, ERPs, calendarios).
7. **Workflows / Automation** — disparadores, programaciones, orquestación multi-agente.
8. **Conversations / Interaction Layer** — chat, hilos, aprobación humana (human-in-the-loop).
9. **Audit & Observability** — registro inmutable de toda acción, trazas, métricas de uso.
10. **Billing & Subscription** — medición de uso (tokens/agente-hora), planes, Stripe.
11. **Notifications** — email, in-app, webhooks salientes.
12. **Admin / Ops Console** — soporte, impersonación, salud de tenants, feature flags.

---

## 4. Dependencias entre módulos

Se modelan en **capas**; una capa nunca depende de una capa superior.

```
Capa 0 — Plataforma (transversal)
    Tenancy · IAM · Audit

Capa 1 — Dominio core
    Digital Employees · Knowledge Base · Integrations Hub

Capa 2 — Ejecución
    Agent Runtime · Workflows

Capa 3 — Interacción
    Conversations · Notifications

Capa 4 — Negocio
    Billing · Admin Console
```

Reglas concretas:

- **Todo módulo depende de Tenancy + IAM** (contexto de organización y usuario autenticado es obligatorio en cada operación).
- **Digital Employees** depende de Knowledge Base e Integrations Hub para saber qué puede "ver" y "usar" un agente, pero no depende de Agent Runtime (la definición de un agente es independiente de su ejecución).
- **Agent Runtime** depende de Digital Employees (config), Knowledge Base (contexto RAG) e Integrations Hub (tools), y emite eventos que consume Audit.
- **Workflows** depende de Agent Runtime, nunca al revés (un workflow orquesta runs, no es parte del runtime).
- **Audit** es un **consumidor pasivo transversal**: todos los módulos publican eventos, Audit nunca es dependencia de negocio de nadie (evita acoplamientos circulares).
- **Billing** depende de eventos de uso emitidos por Agent Runtime, no de su lógica interna.

---

## 5. Modelo multiempresa (multi-tenant)

### 5.1 Estrategia: Postgres compartido + RLS, con puerta abierta a aislamiento dedicado

Para "cientos de miles de usuarios" con onboarding self-service, **schema-per-tenant** o **DB-per-tenant** son inviables operativamente (miles de migraciones, pooling imposible de gestionar). La estrategia recomendada:

- **Base de datos compartida, filas etiquetadas por `organization_id`**, aislamiento reforzado con **Row Level Security (RLS)** nativa de Postgres/Supabase.
- Reservar **aislamiento dedicado (schema o proyecto Supabase separado) como funcionalidad premium** para clientes enterprise con requisitos de compliance/residencia de datos — no como default.

### 5.2 Mecánica

- Tabla raíz `organizations` (el tenant).
- **Toda tabla con datos de negocio** incluye `organization_id uuid not null references organizations(id)`.
- **RLS activada por defecto en todas las tablas**, con política base:
  ```sql
  using (organization_id = current_tenant_id())
  ```
  donde `current_tenant_id()` lee un **claim del JWT** inyectado en el token de Supabase Auth (custom access token hook).
- El **middleware de Next.js** resuelve el tenant (por subdominio `empresa.atlasai.com` o por selección explícita post-login), lo valida contra la membresía del usuario, y lo propaga al contexto de request.
- **Nunca se confía en `organization_id` enviado por el cliente** para lecturas/escrituras sensibles: siempre se deriva del JWT/sesión server-side, tanto en la capa de aplicación como en RLS (defensa en profundidad).
- Pooling de conexiones vía **Supavisor** (Supabase) para soportar alta concurrencia sin agotar conexiones Postgres.

### 5.3 Por qué esto importa más que en un CRM

Los agentes actúan con herramientas que tocan sistemas externos y datos sensibles. Una fuga de tenant aquí no es solo "ver un contacto ajeno": puede significar que un agente ejecute una acción con credenciales o contexto de otra empresa. Por eso el aislamiento se valida en **dos capas independientes** (aplicación + RLS), nunca solo una.

---

## 6. Sistema de permisos

Este es el punto donde ATLAS AI diverge más claramente de un SaaS convencional: **hay dos sujetos de permisos, humanos y agentes**, y deben modelarse de forma explícita y separada.

### 6.1 Permisos de humanos (RBAC + ABAC)

- **RBAC base** a nivel de organización: `Owner`, `Admin`, `Manager`, `Member`, `Viewer`.
- **ABAC/permisos finos** encima para acciones de módulo específicas (`employees.create`, `integrations.connect`, `billing.manage`, `agent_actions.approve`), definidas en `packages/core/permissions` como policy-as-code, no hardcodeadas en la UI.
- Evaluación centralizada: un único **Permission Engine** (TS puro, sin dependencias de framework) usado tanto en Server Actions/API routes como, indirectamente, para generar las políticas RLS.

### 6.2 Permisos de agentes (Capability Model) — pieza distintiva del producto

Cada Empleado Digital tiene un **perfil de capacidades** explícito, independiente del RBAC humano:

- **Qué herramientas puede invocar** (integraciones concretas, no "todas las de la org").
- **Qué datos/knowledge base puede leer**.
- **Qué acciones requieren aprobación humana** (human-in-the-loop) antes de ejecutarse — configurable por tipo de acción (ej. "enviar email externo" sí, "leer documento" no).
- **Límites operativos**: presupuesto de tokens, rate limit de acciones, alcance temporal.

Este modelo se audita igual que el de humanos, pero se evalúa en el momento de ejecución dentro del Agent Runtime, no solo en el borde de la API.

### 6.3 Defensa en profundidad

```
Petición humana → Server Action → Permission Engine (RBAC/ABAC) → DAL → RLS (Postgres)
Acción de agente → Agent Runtime → Capability Model → Tool Executor → Audit Log (obligatorio)
```

Ninguna acción de agente se ejecuta sin pasar por el Capability Model, y ninguna queda sin registro en Audit — no es opcional ni desactivable.

---

## 7. Estrategia de escalabilidad

- **Web tier stateless** en Vercel: escala horizontalmente sin estado, cacheable en edge para contenido no sensible a tenant.
- **Desacoplo ejecución de agentes ↔ request/response**: toda ejecución de agente pasa por cola (Inngest/Trigger.dev o cola propia sobre Postgres/pgmq), permitiendo escalar el worker fleet de forma independiente del tráfico web, con reintentos y backoff.
- **Caching de contexto caliente**: permisos resueltos, configuración de tenant, y metadatos de agentes en una capa de caché (Vercel KV/Redis) para evitar recalcular RBAC/ABAC en cada request.
- **Rate limiting por tenant**, no solo global — un tenant con agentes muy activos no debe degradar a los demás (problema de "noisy neighbor" es más agudo aquí que en un CRM porque el consumo es computacional, no solo de I/O).
- **Base de datos**: connection pooling vía Supavisor, réplicas de lectura cuando el volumen de dashboards/analytics lo justifique, particionado de tablas de alto volumen (ej. `audit_log`, `agent_runs`) por fecha desde el diseño inicial.
- **Vector search**: empezar con `pgvector` (HNSW index) dentro de Supabase por simplicidad operativa; dejar como decisión futura migrar a un vector store dedicado (Pinecone/Weaviate) solo si el volumen de embeddings por tenant lo exige.
- **Abstracción de proveedor LLM**: capa de enrutamiento en `packages/ai-engine` para no acoplar el runtime a un único proveedor (mitiga coste y disponibilidad).
- **Métricas de coste como ciudadano de primera clase**: cada ejecución de agente registra tokens/coste desde el día uno, no como feature añadida después — es lo que permite billing por uso y contención de costes.

---

## 8. Convenciones de desarrollo

- **TypeScript strict** en todo el monorepo, sin `any` (lint-enforced).
- **React Server Components por defecto**; Client Components solo cuando hay interactividad real.
- **Server Actions para mutaciones**, nunca llamadas directas a Supabase desde componentes cliente.
- **Data Access Layer obligatoria**: ningún acceso a datos evita `packages/database`; esto es lo que garantiza que el contexto de tenant se aplique siempre.
- **Validación con Zod en cada frontera**: input de API, formularios, variables de entorno, payloads de eventos de cola.
- **Feature-slicing** dentro de `apps/web/src/features` — cada módulo de dominio (employees, workflows, integrations…) es una carpeta autocontenida (componentes, hooks, server actions, tipos).
- **Nomenclatura**: `snake_case` en base de datos, `camelCase` en TypeScript, `PascalCase` en componentes React.
- **Migraciones**: todo cambio de esquema vía Supabase CLI migrations, revisado en PR, nunca edición manual en producción.
- **Testing**: Vitest para unidad (especialmente `packages/core` y `permissions`), Supabase local para integración, Playwright para flujos críticos (auth, aislamiento de tenant, aprobación de acciones de agente, billing).
- **Commits**: Conventional Commits; PRs pequeños por módulo/capa.
- **Observabilidad como convención, no como feature**: todo Server Action y todo paso del Agent Runtime emite un evento estructurado (no solo logs de texto).

---

## 9. Riesgos técnicos

| Riesgo | Severidad | Mitigación |
|---|---|---|
| Fuga de datos entre tenants (RLS mal configurada) | Crítica | RLS + validación de tenant en capa de app (doble barrera), tests de aislamiento automatizados en CI |
| Ejecuciones de agente exceden límites de funciones serverless | Alta | Desacoplo vía cola/worker fleet desde el diseño inicial (no como parche posterior) |
| Coste de LLM descontrolado (agentes en bucle, tool-calling excesivo) | Alta | Presupuestos por agente/tenant, circuit breakers, métricas de coste en tiempo real |
| Agente ejecuta acción no deseada/incorrecta sobre sistema externo | Alta | Capability Model + human-in-the-loop obligatorio para acciones de alto impacto, sandboxing de tools |
| Dependencia de un único proveedor LLM (disponibilidad/pricing) | Media | Capa de abstracción/router de modelos en `ai-engine` |
| Rendimiento de `pgvector` a gran escala | Media | Monitorizar, indexado HNSW correcto, migración a vector store dedicado como opción futura ya prevista |
| Requisitos de compliance (SOC2/GDPR) al llegar clientes enterprise | Media | Audit log inmutable desde el día uno, diseño de aislamiento dedicado ya contemplado en el modelo multi-tenant |
| Vendor lock-in en Supabase/Vercel a escala extrema | Baja-Media | Uso de Postgres estándar, evitar features propietarias no portables donde sea razonable |
| Límites de conexiones concurrentes a Postgres | Media | Pooling vía Supavisor, revisar límites por plan de Supabase con antelación al crecimiento |

---

## 10. Roadmap técnico inicial

| Fase | Contenido | Duración estimada |
|---|---|---|
| **0 — Fundaciones** | Monorepo (Turborepo), proyecto Supabase, Auth, modelo de tenancy, RLS base, CI/CD en Vercel | 3–4 semanas |
| **1 — Plataforma core** | IAM, Permission Engine (RBAC/ABAC), gestión de organizaciones, CRUD de Digital Employees (solo configuración, sin ejecución) | 4–6 semanas |
| **2 — Agent Runtime MVP** | Integración LLM, tool-calling básico, cola de ejecución, memoria simple, chat de conversación con un agente | 5–6 semanas |
| **3 — Conocimiento e integraciones** | Knowledge Base (RAG con pgvector), aislamiento de conocimiento por tenant, primeras integraciones (email, Slack) | 5–6 semanas |
| **4 — Workflows y multi-agente** | Disparadores, programación, orquestación de múltiples agentes, aprobaciones human-in-the-loop | 5–6 semanas |
| **5 — Billing y hardening de escala** | Medición de uso, Stripe, rate limiting por tenant, particionado de tablas de alto volumen, pruebas de carga | 4–5 semanas |
| **6 — Preparación enterprise** | SSO, exportación de auditoría, tier de aislamiento dedicado, revisión de compliance | 6+ semanas |

**Criterio de salida de cada fase**: no se avanza de fase sin que el aislamiento multi-tenant y el modelo de permisos (humano + agente) de esa fase tengan cobertura de test automatizada — es la garantía estructural de la plataforma.

---

## 11. Decisiones abiertas (a resolver en ADRs siguientes)

- Proveedor de cola/orquestación de ejecución de agentes: Inngest vs. Trigger.dev vs. solución propia sobre Postgres (pgmq).
- Estrategia exacta de memoria de agente (memoria a corto plazo vs. persistente por agente vs. compartida por organización).
- Modelo de precios/facturación (por token, por agente-hora, por asiento, híbrido).
- Alcance y forma de la API pública/SDK para integraciones de terceros.
- Estrategia multi-región (se asume single-region en el roadmap inicial; revisar según mercado objetivo).
