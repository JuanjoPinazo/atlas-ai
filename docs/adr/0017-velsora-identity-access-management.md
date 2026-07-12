# ADR-0017: VELSORA Identity & Access Management

| | |
|---|---|
| **Estado** | Propuesto — con implementación parcial ya en curso en el repositorio, auditada en §0 |
| **Fecha** | 2026-07-12 |
| **Alcance** | Transversal y fundacional — ningún módulo de la plataforma (Company Brain, Decision Engine, Integration Hub, Assessment, Discovery, Budget Follow-up) es alcanzable sin pasar primero por este documento |
| **Depende de** | [ADR-0001 §5-6](0001-arquitectura-base-atlas-ai.md) (modelo multi-tenant y permisos, aquí implementado) · [ADR-0010](0010-atlas-command-control-architecture.md) (Command & Control / HQ, aquí referenciado en §22) · [ADR-0012](0012-atlas-event-driven-architecture.md) (convención de eventos, reutilizada en §26) · [ADR-0014](0014-production-data-runtime-and-fallback-strategy.md) (disciplina de entornos y modos de runtime, extendida en §31) |
| **Relacionado con** | [ADR-0015](0015-atlas-integration-hub.md) (OAuth por conector es un concepto distinto de la identidad de plataforma, ver nota de alcance) |
| **Estatus especial** | Documento fundamental de plataforma. Ninguna ruta funcional, Server Action o política RLS puede asumir un usuario o una organización sin pasar por los mecanismos aquí definidos. Sustituye cualquier lógica de autenticación/autorización ad hoc que exista hoy en el repositorio. |
| **Nota de alcance** | Este documento diseña la identidad y el acceso a **VELSORA como producto** (humanos que usan la plataforma). No diseña las credenciales OAuth/API que un conector usa para hablar con un sistema externo (Gesden, Stripe, WhatsApp) — eso es competencia exclusiva de [ADR-0015](0015-atlas-integration-hub.md) y usa su propia tabla `connector_credentials`. Son dos sistemas de credenciales distintos que no deben fusionarse nunca. |

---

## 0. Estado actual, auditado

Antes de diseñar, este documento registra con precisión lo que ya existe en el repositorio a día de hoy — parte de esta ADR es la primera pieza de gobierno formal sobre trabajo que ya se empezó a escribir sin un diseño acordado. Nada de lo que sigue es hipotético.

| Hallazgo | Ubicación | Estado |
|---|---|---|
| Esquema de identidad ya creado (`organizations`, `profiles`, `organization_memberships`, `user_invitations`, `auth_audit_logs`), con enums `app_role` y `user_status` | `supabase/migrations/00018_velsora_iam.sql` | Borrador sin aplicar — coincide en gran parte con el diseño de este ADR (ver §2-4), se adopta como base y se corrige donde diverge |
| `proxy.ts` ya bloquea cualquier ruta no listada en un allowlist de rutas públicas y redirige a `/login` | `src/proxy.ts` | Correcto en su principio, incompleto en su cobertura (§15) |
| Flujo de login/logout/recuperación de contraseña ya implementado sobre Supabase Auth nativo, sin sistema paralelo | `src/app/(auth)/actions.ts`, `src/app/(auth)/login/page.tsx`, `src/app/(auth)/forgot-password/page.tsx`, `src/app/(auth)/reset-password/page.tsx`, `src/app/auth/callback/route.ts` | Alineado con la Decisión Obligatoria de no duplicar Supabase Auth — adoptado, con ajustes de seguridad en §10, §24, §25 |
| Helpers de autorización server-side (`requireAuthenticatedUser`, `requireOrganizationMembership`, `requireRole`, `requireSuperadmin`) | `src/lib/auth/auth-utils.ts` | Patrón correcto (verificación en servidor, nunca en cliente) — cobertura insuficiente, ver hallazgo siguiente |
| **`[tenantId]/layout.tsx` no invoca ningún helper de autorización** — el segmento dinámico de la URL se usa tal cual, sin comprobar pertenencia | `src/app/(dashboard)/[tenantId]/layout.tsx` | **Vulnerabilidad activa.** Contradice directamente la Decisión Obligatoria 5 del encargo de este ADR ("nunca confiar únicamente en `tenantId` recibido desde la URL"). Remediación obligatoria en §16 |
| Token de invitación generado como UUID en texto plano y almacenado tal cual en `token_hash` | `src/app/actions/user-management.ts` (comentario propio: `// Should hash in real app`) | Gap de seguridad reconocido por quien lo escribió — remediado en §23 |
| Rutas `/select-organization`, `/unauthorized` y `/auth/accept-invite` referenciadas por el código ya escrito pero **inexistentes** | referenciadas desde `src/app/page.tsx`, `src/proxy.ts` (implícito), `src/app/actions/user-management.ts` | Pendientes de construir — especificadas en §17, §21 |
| Tres identificadores de tenant conviviendo sin reconciliar: `companies.id` (`supabase/migrations/00001_company_brain_schema.sql`), `organization_id UUID NOT NULL` sin FK en seis migraciones posteriores (`00010`, `00011`, `00013`, `00014`, `00015`, `00017`), y el literal de texto `'demo_tenant'` (`supabase/migrations/00009_dental_knowledge_manager.sql`, `src/components/layout/Sidebar.tsx:9`) | Todo `supabase/migrations/*.sql` desde `00001` hasta `00018` | **Hallazgo más grave de esta auditoría.** Ninguna tabla de negocio tiene hoy una restricción de clave foránea real hacia un tenant raíz. Remediación obligatoria en §31 |
| Ni rate limiting, ni MFA, ni impersonation, ni hashing de invitaciones existen todavía en ningún punto del código | repositorio completo | Diseñados de cero en este documento (§12, §14, §23, §24) |
| RLS activada (`ENABLE ROW LEVEL SECURITY`) en las cinco tablas de `00018`, pero solo con políticas de `SELECT` — sin políticas de `INSERT`/`UPDATE`/`DELETE` | `supabase/migrations/00018_velsora_iam.sql` líneas 103-141 | Incompleto — especificado en §18 |

Cada sección siguiente resuelve uno o más de estos hallazgos de forma explícita, citando el hallazgo por referencia cuando aplica.

---

## 1. Cinco conceptos que no deben confundirse

El encargo de este ADR exige distinguir con claridad cinco nociones que, en el código auditado en §0, ya empiezan a mezclarse en la práctica (p. ej., `requireOrganizationMembership` hace autenticación, resolución de organización y autorización de rol en una sola función). El diseño de este documento las mantiene conceptualmente separadas aunque su implementación pueda vivir en funciones compuestas:

| Concepto | Pregunta que responde | Mecanismo | Dónde se decide |
|---|---|---|---|
| **Autenticación** | ¿Quién eres? | Supabase Auth — email/password hoy, MFA en fase posterior (§12) | Cookie de sesión SSR, validada en cada request (§17) |
| **Autorización** | ¿Puedes ejecutar esta acción concreta? | Rol efectivo del usuario dentro de una organización (§4-5) | Server Component / Server Action, nunca solo en el cliente (§16) |
| **Pertenencia a organización** | ¿Tienes una fila activa en `organization_memberships` para este tenant? | Consulta explícita contra `organization_memberships`, nunca inferencia desde la URL (§16) | Server-side, en cada acceso a un recurso de un tenant |
| **Permisos** | ¿Qué puede hacer, en concreto, el rol que tienes en esta organización? | Matriz estática de capacidades por rol (§5) | Verificación en Server Action, antes de cualquier mutación |
| **RLS (Row Level Security)** | Si todo lo anterior falla o se salta por error de programación, ¿puede la fila salir de la base de datos igualmente? | Políticas de Postgres evaluadas por el motor, independientes de la capa de aplicación (§18) | Postgres, como última barrera — nunca la primera |

La razón de mantener esta separación explícita: un fallo en una capa (p. ej., el hallazgo de `[tenantId]/layout.tsx` en §0) debe quedar contenido por la capa siguiente. Si la aplicación no verifica pertenencia, RLS todavía debe impedir que la fila salga. Si RLS tuviera un fallo, no debería haber llegado ninguna request a esa tabla sin pasar antes por autorización de aplicación. Ninguna capa es "la que realmente importa" — todas son necesarias, ninguna es suficiente por sí sola.

---

## 2. Modelo de identidad

**Decisión obligatoria del encargo: no existe un sistema de autenticación paralelo a Supabase Auth.** Todo lo que sigue es una extensión de `auth.users`, nunca un sustituto.

- `auth.users` (gestionado por Supabase, fuera del control directo de la aplicación) es la única fuente de verdad de "quién puede autenticarse" — email, contraseña (hasheada por Supabase), proveedor.
- `public.profiles` (`supabase/migrations/00018_velsora_iam.sql:19`) es una extensión 1:1 de `auth.users`, vinculada por `id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE` — nunca una tabla de usuarios independiente. Contiene únicamente lo que Supabase Auth no modela: `full_name`, `avatar_url`, `status` (§8), `last_login_at`.
- Un `profile` se crea automáticamente cuando se crea la fila correspondiente en `auth.users` — vía trigger `on_auth_user_created` sobre `auth.users` (a añadir en la migración de corrección de §0), nunca vía una llamada de aplicación separada que pueda omitirse u olvidarse.
- La identidad de una persona es única en toda la plataforma: un mismo `auth.users.id` / `profiles.id` puede tener membresías en múltiples organizaciones (§3) — no existe "una cuenta por cliente".

---

## 3. Organizaciones y memberships

- `organizations` (`00018_velsora_iam.sql:8`) es la tabla raíz de tenant — la que ADR-0001 §5.2 ya exigía como "tabla raíz `organizations` (el tenant)". Este ADR la implementa por primera vez de forma real; ver reconciliación obligatoria con `companies` en §31.
- Un humano no pertenece directamente a una organización — pertenece a través de una fila en `organization_memberships` (`00018_velsora_iam.sql:31`), que es la relación N:M entre `profiles` y `organizations`, con un `role` (§4) y un `status` (§8) propios de esa membresía concreta.
- Esto significa que el mismo usuario puede ser `ADMIN_CLIENTE` en una organización y `VIEWER` en otra simultáneamente — el rol vive en la membresía, nunca en el perfil.
- `organization_memberships.invited_by` conserva la trazabilidad de quién dio de alta a quién — insumo directo de auditoría (§13) y de la prohibición de registro público (§6).
- Restricción `UNIQUE(organization_id, user_id)` ya presente en el esquema: una persona tiene como máximo una membresía por organización, nunca dos roles simultáneos dentro del mismo tenant.

---

## 4. Roles

Cinco roles, exactamente los del encargo, modelados como el enum `app_role` (`00018_velsora_iam.sql:4`):

| Rol | Alcance | Quién lo asigna |
|---|---|---|
| **SUPERADMIN** | Global — no está limitado a una organización. Acceso a VELSORA HQ (§22) y, si lo necesita, a cualquier organización vía impersonation auditada (§14), nunca por acceso directo silencioso | Solo otro SUPERADMIN |
| **ADMIN_CLIENTE** | Administración completa de su(s) organización(es): gestión de usuarios, invitaciones, configuración de tenant | SUPERADMIN o otro ADMIN_CLIENTE de la misma organización |
| **CONSULTOR** | Rol operativo avanzado — configura Empleados Digitales, revisa propuestas de conocimiento, ejecuta Discovery/Assessment, pero no gestiona usuarios ni facturación | ADMIN_CLIENTE o SUPERADMIN |
| **USUARIO** | Uso operativo del día a día dentro de los módulos a los que la organización tiene acceso, sin capacidad de configuración estructural | ADMIN_CLIENTE, CONSULTOR o SUPERADMIN |
| **VIEWER** | Solo lectura, sin ninguna capacidad de mutación en ningún módulo | Cualquier rol con capacidad de invitar (§6) |

Un dato importante que corrige una ambigüedad ya detectada en el propio código auditado (`auth-utils.ts`, comentario `// Wait, SUPERADMIN is a role in organization_memberships, or is it global?`): **SUPERADMIN es un rol global de persona, no un rol de organización**, aunque técnicamente se almacene hoy como una fila más en `organization_memberships` por conveniencia de esquema (§0). La regla operativa es: si un usuario tiene **cualquier** fila con `role = 'SUPERADMIN'` y `status = 'ACTIVE'`, es SUPERADMIN en toda la plataforma, no solo en la organización de esa fila. `checkSuperadmin()` en `auth-utils.ts` ya implementa esta regla correctamente — este ADR la ratifica como comportamiento intencional, no como atajo temporal.

---

## 5. Permisos por rol

Matriz de capacidades mínima que gobierna las Server Actions (§16). Una acción no listada explícitamente para un rol está prohibida por defecto — allowlist, nunca denylist.

| Capacidad | SUPERADMIN | ADMIN_CLIENTE | CONSULTOR | USUARIO | VIEWER |
|---|---|---|---|---|---|
| Ver VELSORA HQ (§22) | ✅ | ❌ | ❌ | ❌ | ❌ |
| Crear organización | ✅ | ❌ | ❌ | ❌ | ❌ |
| Invitar usuario a su organización | ✅ | ✅ | ❌ | ❌ | ❌ |
| Suspender/reactivar usuario de su organización | ✅ | ✅ | ❌ | ❌ | ❌ |
| Cambiar el rol de otro miembro | ✅ | ✅ (nunca a SUPERADMIN) | ❌ | ❌ | ❌ |
| Configurar Empleados Digitales, conectores, Assessment | ✅ | ✅ | ✅ | ❌ | ❌ |
| Operar módulos del día a día (Command Center, Dental Manager, etc.) | ✅ | ✅ | ✅ | ✅ | ❌ (solo lectura) |
| Leer cualquier módulo de su(s) organización(es) | ✅ | ✅ | ✅ | ✅ | ✅ |
| Impersonar a un usuario (§14) | ✅ | ❌ | ❌ | ❌ | ❌ |

Esta matriz vive como constante versionada en código de aplicación (p. ej. `packages/core/permissions`, ya anticipado en ADR-0001 §6.1), nunca hardcodeada de forma dispersa en cada Server Action — un cambio de permiso se hace en un único lugar.

---

## 6. Invitaciones

**Decisión obligatoria: no existe registro público.** La única vía de alta de un usuario es:

1. Un SUPERADMIN crea la primera organización y su primer `ADMIN_CLIENTE` (fuera de la UI de invitación estándar, vía VELSORA HQ, §22).
2. A partir de ahí, cualquier rol con capacidad de invitar (§5) crea una invitación con `inviteUser()` (`src/app/actions/user-management.ts`), que inserta una fila en `user_invitations` con el email destino, el rol propuesto, y un token de un solo uso (endurecido en §23).
3. El destinatario recibe un enlace a `/auth/accept-invite?token=...` (ruta pendiente de construir, ver §0). Esa ruta es pública (añadida al allowlist de `proxy.ts`, §15) pero solo permite una acción: canjear un token válido y no expirado, nunca navegar a ningún otro recurso.
4. Al aceptar, si el email no tiene ya una cuenta en `auth.users`, se le pide crear contraseña (vía `supabase.auth.signUp` restringido a ese flujo, nunca vía un formulario de registro accesible sin token); si ya la tiene, se le pide iniciar sesión y el sistema activa la membresía pendiente automáticamente.
5. Al aceptar, `user_invitations.status` pasa a `ACCEPTED`, `organization_memberships` pasa de no existir (o de `PENDING`, si se pre-crea) a `ACTIVE`, y se registra un evento `USER_INVITATION_ACCEPTED` en `auth_audit_logs` (§13).

Una invitación nunca concede acceso por sí sola — solo tras ser aceptada explícitamente por el destinatario con control de su propio email, evitando que un ADMIN_CLIENTE dé de alta a un usuario sin su consentimiento.

---

## 7. Alta y baja de usuarios

- **Alta**: exclusivamente por invitación (§6) o por creación directa de un SUPERADMIN desde VELSORA HQ (§22, para el primer ADMIN_CLIENTE de una organización nueva o para soporte).
- **Baja de una organización** (no de la plataforma): eliminar o marcar `organization_memberships.status = 'SUSPENDED'` para esa fila. El usuario conserva su `profile` y cualquier otra membresía intacta.
- **Baja completa de la plataforma**: reservada a SUPERADMIN, requiere confirmación explícita (no es una acción de un clic) y implica: revocar todas las membresías activas, invalidar todas las sesiones activas del usuario (§9), y conservar el `profile` marcado como eliminado (soft delete) durante el periodo de retención de auditoría exigido — nunca un `DELETE` físico inmediato de `auth.users`, porque rompería la trazabilidad de `auth_audit_logs.user_id` y de cualquier `invited_by` que lo referencie.
- Ningún usuario se elimina como efecto colateral de eliminar una organización — al desactivar una organización (`organizations.status`), sus memberships pasan a inaccesibles pero el histórico de auditoría de esa organización se conserva.

---

## 8. Activación y suspensión

Dos niveles independientes de suspensión, gobernados por el enum `user_status` (`ACTIVE`, `SUSPENDED`, `PENDING`):

- **`profiles.status`**: suspensión global de la persona — un usuario suspendido a este nivel no puede autenticarse en ninguna organización, sin importar sus membresías. `login()` (`src/app/(auth)/actions.ts`) ya comprueba esto y cierra la sesión inmediatamente si se detecta tras el login — este ADR ratifica ese comportamiento y exige que la misma comprobación se repita en `requireAuthenticatedUser()` en cada request (ya implementado), no solo en el momento del login.
- **`organization_memberships.status`**: suspensión de la relación con una organización concreta — un usuario puede estar `ACTIVE` como persona pero `SUSPENDED` en una organización específica (p. ej., tras dejar de ser cliente de esa cuenta) sin afectar a sus otras membresías.
- **`PENDING`** es el estado inicial de una membresía creada por invitación (§6) antes de ser aceptada — no es equivalente a `SUSPENDED`: una membresía `PENDING` no aparece como acceso activo pero tampoco cuenta como "usuario que tuvo acceso y se le retiró".
- Toda transición de estado (`ACTIVE → SUSPENDED`, `SUSPENDED → ACTIVE`, `PENDING → ACTIVE`) genera un evento en `auth_audit_logs` (§13) con el actor que la ejecutó — nunca una transición silenciosa, ni siquiera cuando la ejecuta un SUPERADMIN.

---

## 9. Cambio y recuperación de contraseña

Ambos flujos ya implementados sobre primitivas nativas de Supabase Auth (`src/app/(auth)/actions.ts`), adoptados con los siguientes requisitos adicionales:

- **Recuperación** (`forgotPassword`): dispara `supabase.auth.resetPasswordForEmail`, con `redirectTo` apuntando a `/auth/callback?next=/reset-password`. Correcto en su forma actual: no revela si el email existe (§25), responde siempre `{ success: true }`.
- **Cambio** (`resetPassword`): usa `supabase.auth.updateUser({ password })` sobre la sesión ya intercambiada por el callback — requiere que el usuario haya llegado por el enlace de recuperación (sesión temporal válida), nunca acepta un cambio de contraseña arbitrario sin sesión.
- **Cambio voluntario** (usuario ya autenticado, desde su configuración): mismo mecanismo (`updateUser`), pero además debe re-confirmar su contraseña actual antes de fijar la nueva — no implementado todavía, requerido antes de exponer esta opción en UI.
- Toda recuperación o cambio de contraseña exitoso genera un evento `PASSWORD_CHANGED` o `PASSWORD_RESET_COMPLETED` en `auth_audit_logs` (§13), y opcionalmente notifica por email al titular ("tu contraseña cambió, si no fuiste tú contacta con soporte") — mitigación estándar frente a una cuenta comprometida que cambia su propia contraseña para bloquear al titular legítimo.

---

## 10. Sesiones

- La sesión es exclusivamente la que gestiona `@supabase/ssr` vía cookies HTTP-only, propagadas por `updateSession()` (`src/lib/supabase/middleware.ts`) en cada request — nunca un JWT gestionado a mano en `localStorage` ni un mecanismo de sesión de aplicación paralelo.
- `src/lib/supabase/client.ts` (cliente de navegador), `src/lib/supabase/server.ts` (Server Components/Actions) y `src/lib/supabase/admin.ts` (Service Role) son las tres únicas vías legítimas de instanciar un cliente Supabase — ninguna otra parte del código debe construir un cliente Supabase por su cuenta.
- Cada Server Action que muta estado vuelve a leer `supabase.auth.getUser()` — nunca confía en un `user` recibido como parámetro desde el cliente o cacheado de una llamada anterior en el mismo request.

---

## 11. Expiración y renovación

- El token de acceso de Supabase Auth expira según la configuración por defecto del proyecto (1 hora); el refresh token, con vida más larga, se renueva automáticamente por `@supabase/ssr` dentro de `updateSession()` en cada request que pasa por `proxy.ts` — es la razón por la que la nota `// IMPORTANT: Avoid writing any logic between createServerClient and supabase.auth.getUser()` ya presente en `src/lib/supabase/middleware.ts` debe conservarse literalmente: cualquier código insertado ahí puede romper silenciosamente la renovación y desloguear usuarios al azar.
- Al expirar el refresh token (usuario inactivo más allá de la ventana configurada), `getUser()` devuelve error, `requireAuthenticatedUser()` redirige a `/login` — no hay un estado "sesión expirada" distinto de "no autenticado" desde la perspectiva de la aplicación.
- "Recordarme" (checkbox ya presente en `login/page.tsx`) controla únicamente si el refresh token se persiste tras cerrar el navegador — no relaja ninguna otra verificación de seguridad. Su implementación real es una tarea pendiente (hoy el checkbox no está conectado a ninguna lógica).

---

## 12. MFA preparada para una fase posterior

No se implementa en esta fase, pero el diseño no debe requerir migraciones destructivas para añadirlo después:

- Supabase Auth soporta MFA (TOTP) de forma nativa vía `supabase.auth.mfa.*` — cuando se active, no se construye un sistema propio de códigos.
- `profiles` no necesita una columna `mfa_enabled` propia: ese estado ya lo expone `supabase.auth.mfa.listFactors()` sobre `auth.users`, evitando duplicar una fuente de verdad que Supabase ya mantiene.
- Cuando se active, la política razonable es: obligatorio para SUPERADMIN y ADMIN_CLIENTE, opcional (con recomendación) para el resto — decisión a confirmar en un ADR posterior o adenda de este, no bloquea el lanzamiento actual.
- El evento `MFA_ENROLLED` / `MFA_CHALLENGE_FAILED` ya tiene hueco reservado en la taxonomía de `auth_audit_logs` (§26) para no requerir otra migración de esquema cuando se active.

---

## 13. Auditoría de accesos

- `auth_audit_logs` (`00018_velsora_iam.sql:60`) es la tabla única de eventos de seguridad de identidad y acceso — no se mezcla con `audit_logs` (`00001_company_brain_schema.sql:123`, genérica de Company Brain) ni con `platform_events`/`roi_events` (`00010_dental_budget_followup.sql`, eventos de negocio). Tres tablas de auditoría con propósitos distintos, coherente con la separación de planos ya fijada en [ADR-0010 §1](0010-atlas-command-control-architecture.md) (salud del sistema frente a contenido de negocio) — aquí aplicada a identidad frente a negocio.
- Toda escritura en `auth_audit_logs` se hace exclusivamente vía `createAdminClient()` (Service Role, §16) desde una Server Action, nunca desde el cliente — un usuario nunca puede escribir su propio registro de auditoría.
- `ip_hash` (no la IP en claro) y `user_agent` ya están en el esquema — decisión correcta de minimización de datos, coherente con la disciplina de sensibilidad de [ADR-0002](0002-company-brain.md): se necesita poder correlacionar sin almacenar un identificador directo indefinidamente.
- La taxonomía completa de `event_type` se especifica en §26.

---

## 14. Impersonation o acceso de soporte

Diseño de cero, no existe hoy ninguna pieza de esto en el código:

- **Temporal**: una sesión de impersonation tiene un TTL corto y fijo (recomendado: 30 minutos), tras el cual expira automáticamente sin acción del SUPERADMIN — nunca una sesión de soporte indefinida.
- **Autorizado**: solo SUPERADMIN puede iniciarla, y solo contra una organización con la que no tiene membresía propia — es explícitamente la vía de acceso excepcional que ADR-0001 §5.2 exige que nunca sea el camino por defecto.
- **Visible**: mientras dura, la UI muestra un banner persistente e ineludible ("Estás operando como soporte en nombre de {organización}, sesión termina en {tiempo restante}") — nunca una impersonation silenciosa indistinguible de una sesión normal.
- **Auditada**: inicio y fin de cada impersonation generan eventos `IMPERSONATION_STARTED` / `IMPERSONATION_ENDED` en `auth_audit_logs`, con el `organization_id` afectado y el SUPERADMIN actor — y, adicionalmente, **cada acción de mutación ejecutada durante una impersonation** se marca en el evento de auditoría correspondiente con un campo `impersonated_by` para no confundirla nunca con una acción genuina del usuario suplantado.
- Mecánicamente: no se cambia la sesión de Supabase Auth del SUPERADMIN. Se emite un claim adicional de contexto (`impersonating_organization_id`, `impersonating_expires_at`) verificado en cada Server Action junto al rol real — la identidad autenticada sigue siendo la del SUPERADMIN en todo momento, la organización objetivo es un contexto adicional explícito, no una suplantación de identidad real.

---

## 15. Protección de rutas con Next.js 16 `proxy.ts`

`src/proxy.ts` ya implementa el mecanismo correcto en su forma — Next.js 16 renombró `middleware.ts` a `proxy.ts` (ver `node_modules/next/dist/docs/`, según lo exige `AGENTS.md` de este repositorio), y el código auditado en §0 ya usa la convención nueva. Se ratifica y se completa:

- **Allowlist de rutas públicas**, hoy `['/login', '/forgot-password', '/reset-password', '/auth/callback']` — debe ampliarse para incluir `/auth/accept-invite` (§6) y cualquier ruta estática de marketing si existiera. Todo lo no listado exige sesión.
- `proxy.ts` **solo** decide "¿hay una sesión válida?" y "¿esta ruta es pública?" — deliberadamente **no** resuelve ni valida `tenantId` contra membresía (eso vive en Server Components/Actions, §16), por dos razones: el edge runtime de `proxy.ts` no debe cargar lógica de negocio pesada, y una segunda verificación en una capa distinta es defensa en profundidad, no redundancia inútil.
- Redirección: sin sesión y ruta privada → `/login`; con sesión y ruta pública de auth (excepto `/auth/callback`, que necesita procesar el código incluso si ya hay sesión) → `/` — comportamiento ya implementado, se ratifica.
- La demo (Decisión Obligatoria 9 del encargo) **no** tiene ni tendrá una excepción en este allowlist — se gobierna en `SERVER_ENVIRONMENT.RUNTIME_MODE`, nunca en una lista de rutas públicas (§31).

---

## 16. Verificación adicional en Server Components y Server Actions

Esta es la capa que remedia el hallazgo más grave de §0. Regla sin excepciones: **ninguna Server Action ni Server Component bajo `[tenantId]` puede leer datos o ejecutar una mutación sin invocar antes uno de los tres helpers de `src/lib/auth/auth-utils.ts`.**

- `requireAuthenticatedUser()` — verifica sesión y que `profiles.status !== 'SUSPENDED'`. Base de todo lo demás.
- `requireOrganizationMembership(tenantSlugOrId)` — resuelve la organización por slug o id, comprueba que existe una fila `ACTIVE` en `organization_memberships` para el usuario actual (o que es SUPERADMIN, con bypass explícito y auditado), y **es la función que `[tenantId]/layout.tsx` debe llamar y hoy no llama** (§0). Remediación: el layout del segmento `[tenantId]` invoca `requireOrganizationMembership(tenantId)` antes de renderizar cualquier `children`, y expone el resultado (`org`, `membership`) vía contexto de React a las páginas hijas — ninguna página hija vuelve a resolver el tenant por su cuenta a partir de `params`.
- `requireRole(tenantSlugOrId, allowedRoles)` — encima de lo anterior, exige que el rol efectivo esté en la lista permitida (§5). Toda Server Action de mutación (invitar, suspender, cambiar rol, configurar conectores) debe empezar con esta llamada, nunca solo con una comprobación en el cliente que oculte un botón.
- `requireSuperadmin()` — para cualquier ruta o acción exclusiva de VELSORA HQ (§22).
- Ninguna de estas funciones confía en un valor recibido como argumento sin volver a consultarlo contra la base de datos en el propio request — un `tenantSlugOrId` que llega como parámetro de URL se trata siempre como no confiable hasta que `requireOrganizationMembership` lo valida.

---

## 17. Integración con Supabase Auth SSR mediante cookies

Ya implementado correctamente, se ratifica sin cambios estructurales:

- `src/lib/supabase/server.ts` construye el cliente SSR leyendo/escribiendo cookies vía `next/headers`, con manejo explícito del caso "llamado desde un Server Component" (donde `setAll` no puede escribir cookies y se ignora silenciosamente porque `proxy.ts` ya refresca la sesión en cada request — comentario ya presente en el código, correcto).
- `src/lib/supabase/client.ts` (no auditado en detalle aquí, pero por convención del propio Supabase SSR) es exclusivamente para Client Components que necesiten reactividad de sesión en el navegador — nunca para lecturas de datos sensibles, que deben pasar siempre por Server Components/Actions.
- La ruta `/auth/callback` (`src/app/auth/callback/route.ts`) es el único punto de intercambio de código OAuth/magic-link por sesión — ya implementado correctamente con manejo de error explícito (`redirect a /login?error=auth-code-error` si falla el intercambio).

---

## 18. Integración con RLS

RLS es la última barrera (§1), nunca la primera. Estado actual y remediación:

- Las cinco tablas de `00018_velsora_iam.sql` tienen RLS habilitada pero **solo políticas de `SELECT`** (§0). Faltan políticas de `INSERT`/`UPDATE`/`DELETE` — sin ellas, cualquier escritura vía el cliente anon/autenticado (no Service Role) fallará por defecto (comportamiento seguro por omisión de Postgres), lo cual es aceptable **siempre que toda escritura real pase por Service Role desde una Server Action ya protegida por §16** — decisión explícita de este ADR: las tablas de IAM no aceptan escritura directa del cliente autenticado bajo ninguna circunstancia, todas sus mutaciones pasan por `createAdminClient()` tras pasar la verificación de aplicación. Por tanto no se añaden políticas de escritura para el rol `authenticated` — se documenta como decisión, no como omisión pendiente.
- Para el resto de tablas de negocio (Company Brain, Decision Engine, Assessment, etc.), la política base ya prevista en [ADR-0001 §5.2](0001-arquitectura-base-atlas-ai.md) se implementa ahora de verdad: `USING (organization_id = current_tenant_id())`, donde `current_tenant_id()` es una función `SECURITY DEFINER` que lee el `organization_id` activo del contexto de sesión — nunca un valor confiado desde la aplicación sin verificar.
- El mecanismo de `current_tenant_id()` no depende de un custom claim inyectado en el JWT (como sugería ADR-0001 de forma preliminar) sino de una función que consulta `organization_memberships` en tiempo real contra `auth.uid()` — más simple de operar que un custom access token hook, al coste de una consulta adicional por política, aceptable dado el volumen actual. Se revisita si el volumen lo justifica.
- Consecuencia directa del hallazgo de `organization_id` sin FK (§0, §31): una política RLS que compara `organization_id = current_tenant_id()` es una comparación de valores, no depende de que exista una FK — pero la ausencia de FK sí permite que una fila quede con un `organization_id` que no corresponde a ninguna organización real, invisible para todo el mundo (huérfana) en vez de fallar de forma visible al insertarse. La FK se añade en la migración de reconciliación de §31 precisamente para convertir ese fallo silencioso en un error explícito de inserción, coherente con la Decisión Obligatoria de [ADR-0014](0014-production-data-runtime-and-fallback-strategy.md).

---

## 19. Redirecciones

| Ruta | Comportamiento |
|---|---|
| `/` | `requireAuthenticatedUser()` → si 0 membresías activas, `/select-organization?error=no-org`; si es SUPERADMIN, `/select-organization` (con opción de entrar a HQ); si 1 membresía, `/{slug}` directo; si 2+, `/select-organization` |
| `/login` | Pública. Si ya hay sesión válida, redirige a `/` (§15) |
| `/auth/callback` | Pública, intercambia código por sesión, redirige a `next` (por defecto `/`) o a `/login?error=auth-code-error` si falla |
| `/forgot-password` | Pública |
| `/reset-password` | Pública solo con sesión temporal de recuperación válida (llegada vía `/auth/callback`); sin esa sesión, redirige a `/forgot-password` |
| `/unauthorized` | Pendiente de construir (§0) — destino cuando `requireRole` falla por rol insuficiente (hoy `auth-utils.ts` redirige a `/${org.slug}?error=unauthorized`, comportamiento aceptable como alternativa a una página dedicada, a decidir en implementación) |
| `/[tenantId]` (slug real) | Requiere `requireOrganizationMembership` (§16); sin membresía activa, `/select-organization`; con membresía `SUSPENDED`, `/select-organization?error=suspended` |
| `/select-organization` | Pendiente de construir (§0, §21) — lista las organizaciones con membresía activa del usuario, o el punto de entrada a VELSORA HQ si es SUPERADMIN |

---

## 20. Acceso con una sola organización

Ya implementado en `src/app/page.tsx`: si `memberships.length === 1`, redirección directa a `/{slug}` sin pantalla intermedia de selección — la mayoría de los clientes de VELSORA (organización única) no ven nunca un selector, coherente con minimizar fricción para el caso común.

---

## 21. Acceso con varias organizaciones

Requiere construir `/select-organization` (referenciada pero inexistente, §0): lista cada organización donde el usuario tiene una fila `ACTIVE` en `organization_memberships`, con su rol en cada una, y navega a `/{slug}` al seleccionar. Debe distinguir visualmente el caso "sin ninguna organización" (mensaje explícito + contacto de soporte, nunca una pantalla vacía sin explicación) del caso "varias organizaciones disponibles".

---

## 22. Gestión central desde Atlas HQ / VELSORA HQ

Este ADR no rediseña el plano de control ya definido en [ADR-0010](0010-atlas-command-control-architecture.md) — sería exactamente el error de duplicación que la Nota de alcance de este documento prohíbe. Lo que este ADR aporta a ADR-0010 es la puerta de entrada: **el acceso a VELSORA HQ está gobernado por `requireSuperadmin()` (§16, §4)**, ningún otro mecanismo de puerta de entrada es válido. ADR-0010 define qué se puede hacer una vez dentro (salud de tenants, consumo, ejecuciones bloqueadas); este ADR define quién puede entrar y cómo se verifica en cada request.

---

## 23. Seguridad de invitaciones

Remedia directamente el hallazgo de `user-management.ts` en §0:

- El token de invitación se genera con una fuente aleatoria criptográficamente segura (`crypto.randomUUID()`, ya usado, es aceptable como fuente de entropía), pero **nunca se almacena en claro**: se almacena su hash (SHA-256 es suficiente, no requiere el coste de un hash de contraseña porque el token ya tiene entropía suficiente y es de un solo uso) en `user_invitations.token_hash`; el valor en claro solo existe en el enlace enviado por email y nunca se persiste en la base de datos.
- **Expiración**: `expires_at`, ya en el esquema, con 7 días como valor ya usado en el código — razonable, se ratifica.
- **Un solo uso**: al aceptar (§6), `status` pasa a `ACCEPTED` y cualquier intento posterior de canjear el mismo token debe rechazarse explícitamente, incluso si no ha expirado.
- **Vinculada a un email concreto**: el flujo de aceptación debe verificar que el email de la cuenta que acepta coincide con `user_invitations.email` — una invitación para `ana@clinica.com` no debe poder aceptarse desde una cuenta con otro email, incluso si alguien obtiene el enlace.
- **Revocable**: un ADMIN_CLIENTE o SUPERADMIN puede cancelar una invitación pendiente (`status = 'REVOKED'`) antes de que se acepte — funcionalidad a añadir junto a `inviteUser()`.

---

## 24. Rate limiting del login

No existe hoy (§0). Diseño mínimo viable:

- Limitar intentos de `login()` por combinación de IP y email (no solo por IP, para no penalizar a toda una clínica compartiendo salida NAT; no solo por email, para no permitir fuerza bruta distribuida) — recomendado: 5 intentos fallidos en 15 minutos antes de un bloqueo temporal creciente.
- Implementación recomendada: contador en una tabla ligera o servicio de rate limiting ya disponible en el stack de despliegue (Vercel/Upstash), nunca en memoria del proceso Next.js (no sobrevive a instancias serverless múltiples).
- Cada bloqueo por rate limit genera un evento `LOGIN_RATE_LIMITED` en `auth_audit_logs` (§26) — visibilidad para SUPERADMIN de patrones de ataque contra cuentas concretas.
- El mismo mecanismo se aplica a `forgotPassword()` y al canje de invitaciones (`accept-invite`), superficies igualmente sujetas a abuso.

---

## 25. Protección frente a enumeración de usuarios

Parcialmente ya correcto en el código auditado, se ratifica y se completa:

- `login()` ya devuelve el mensaje genérico `'Credenciales incorrectas'` sin distinguir "el email no existe" de "la contraseña es incorrecta" — correcto, se mantiene.
- `forgotPassword()` ya devuelve siempre `{ success: true }` sin importar si el email existe — correcto, se mantiene.
- Falta aplicar el mismo principio a: el flujo de invitación (no debe revelar si un email ya tiene cuenta en la plataforma antes de que el usuario complete el canje del token) y a cualquier futuro formulario de "solicitar acceso" — ninguna respuesta de la API debe diferenciar en tiempo de respuesta ni en contenido si un email está o no registrado.
- El rate limiting de §24 es, en sí mismo, parte de esta protección: sin él, la enumeración por fuerza bruta cronometrada sigue siendo viable aunque los mensajes de error sean genéricos.

---

## 26. Eventos y logs de seguridad

Taxonomía mínima obligatoria de `auth_audit_logs.event_type` (extensible, nunca reducible sin revisión):

| `event_type` | Cuándo se emite |
|---|---|
| `USER_INVITED` | Ya implementado en `inviteUser()` |
| `USER_INVITATION_ACCEPTED` | Al completar §6 paso 5 |
| `USER_INVITATION_REVOKED` | Al revocar (§23) |
| `USER_SUSPENDED` / `USER_REACTIVATED` | Ya implementado (el primero) en `suspendUser()` |
| `MEMBERSHIP_ROLE_CHANGED` | Al cambiar el rol de una membresía existente |
| `LOGIN_SUCCEEDED` / `LOGIN_FAILED` | En cada intento de `login()` |
| `LOGIN_RATE_LIMITED` | Al activarse el límite de §24 |
| `PASSWORD_RESET_REQUESTED` / `PASSWORD_RESET_COMPLETED` / `PASSWORD_CHANGED` | §9 |
| `IMPERSONATION_STARTED` / `IMPERSONATION_ENDED` | §14 |
| `MFA_ENROLLED` / `MFA_CHALLENGE_FAILED` | Reservado para §12 |
| `LOGOUT` | En cada `logout()` explícito |

Cada evento sigue la misma disciplina de trazabilidad ya exigida transversalmente por [ADR-0012](0012-atlas-event-driven-architecture.md) para el resto de eventos de plataforma: actor identificable, timestamp, y contexto suficiente para reconstruir qué pasó sin necesidad de correlacionar con otra tabla.

---

## 27. Riesgos

| Riesgo | Severidad | Mitigación |
|---|---|---|
| El hallazgo de `[tenantId]/layout.tsx` (§0) se despliega a producción antes de aplicar la remediación de §16 | Crítica | Este ADR bloquea cualquier despliegue a producción hasta que `requireOrganizationMembership` esté invocado en ese layout — ver Criterios de aceptación (§29) |
| La reconciliación de `companies` / `organization_id` sin FK / `'demo_tenant'` (§0, §31) se pospone indefinidamente por presión de entrega de funcionalidad | Crítica | Ninguna nueva tabla de negocio se acepta sin FK a `organizations.id` a partir de esta ADR — regla de revisión de código, no solo de diseño |
| Impersonation mal auditada se convierte en una puerta trasera de facto | Alta | Los cuatro requisitos de §14 (temporal, autorizado, visible, auditado) se tratan como un único requisito atómico — no se implementa una versión parcial "por ahora" |
| Rate limiting ausente permite fuerza bruta contra cuentas de clientes reales una vez la plataforma deje de requerir solo autenticación interna | Alta | §24 se implementa antes de abrir invitaciones a clientes externos reales, no como mejora posterior |
| Migración de `demo_tenant` rompe datos de demo ya usados en reuniones comerciales en curso | Media | §31 exige una ventana de convivencia (ambos mecanismos activos) antes de eliminar el fallback, nunca un corte inmediato |

---

## 28. Decisiones abiertas

- Si `current_tenant_id()` (§18) debe evolucionar a un custom access token hook (JWT claim) por motivos de rendimiento, una vez el volumen de organizaciones lo justifique frente al coste actual de una consulta por política.
- Política definitiva de retención de `auth_audit_logs` (¿12 meses? ¿indefinido para eventos de SUPERADMIN/impersonation?) — pendiente de requisito de compliance concreto, no fijada por intuición.
- Si VIEWER debe poder ver `auth_audit_logs` de su propia actividad (ya hay una política de RLS draft para "leer sus propios audit logs") o si esa visibilidad debe reservarse a ADMIN_CLIENTE y superior.
- Umbral exacto de rate limiting (§24) — 5 intentos/15 min es un punto de partida razonable, a validar contra patrones reales de uso una vez haya tráfico externo.
- Si la obligatoriedad de MFA para SUPERADMIN/ADMIN_CLIENTE (§12) debe ser un bloqueo duro desde el lanzamiento de esa fase o una ventana de gracia con recordatorio.

---

## 29. Criterios de aceptación

Este ADR se considera implementado — no solo diseñado — cuando se cumplen, sin excepción, los ocho puntos de §32 (Evidence of Integration) y además:

1. `[tenantId]/layout.tsx` invoca `requireOrganizationMembership` y ninguna página hija resuelve el tenant por su cuenta a partir de `params` sin pasar por ese resultado.
2. Toda tabla de negocio creada a partir de esta ADR tiene `organization_id UUID NOT NULL REFERENCES organizations(id)` — con FK real, no solo el tipo de columna.
3. `token_hash` en `user_invitations` almacena un hash, nunca el token en claro, verificado por inspección directa de una fila insertada en un entorno de prueba.
4. `/select-organization`, `/unauthorized` y `/auth/accept-invite` existen y están cubiertas por al menos un test de integración cada una (§30).
5. Ningún endpoint de login, recuperación de contraseña o aceptación de invitación revela por su respuesta o su tiempo de respuesta si un email existe en la plataforma.
6. Rate limiting activo y verificable sobre `/login` en el entorno de staging antes de cualquier apertura a usuarios externos a VELSORA.
7. Impersonation, si se lanza, cumple los cuatro requisitos de §14 simultáneamente — nunca una versión parcial en producción.

---

## 30. Pruebas obligatorias

Alineadas con la infraestructura de test ya presente (`vitest.config.ts`, `vitest.integration.config.ts`):

- **Unitarias**: cada helper de `auth-utils.ts` (`requireAuthenticatedUser`, `requireOrganizationMembership`, `requireRole`, `requireSuperadmin`) con casos: sin sesión, sesión con perfil suspendido, sesión sin membresía, sesión con membresía suspendida, sesión con rol insuficiente, SUPERADMIN con bypass.
- **Integración** (vitest.integration.config.ts, contra Supabase local): 
  - Un usuario sin sesión que solicita `/{slug}` es redirigido a `/login` (verifica §15 y remedia el hallazgo de §0 con un test que falla hoy y debe pasar tras la remediación).
  - Un usuario con membresía `ACTIVE` en la organización A no puede leer ni mutar filas de la organización B, verificado tanto a nivel de Server Action (§16) como directamente contra RLS con el cliente `anon`/`authenticated` (§18) — dos tests independientes, uno no sustituye al otro.
  - Un usuario `SUSPENDED` (a nivel de `profiles` y, por separado, a nivel de `organization_memberships`) no puede autenticarse / no puede acceder a esa organización respectivamente.
  - Una invitación expirada, ya aceptada, o con email no coincidente es rechazada por el flujo de `accept-invite`.
  - Logout invalida la sesión de forma verificable (una request posterior con la cookie anterior no autentica).
  - Rate limiting bloquea tras el umbral configurado y el bloqueo se libera tras la ventana definida.
- **RLS**: suite dedicada que ejecuta la misma query con dos usuarios de dos organizaciones distintas directamente contra Postgres (vía `psql` o el cliente de test con JWT de cada usuario), sin pasar por Next.js — verifica que RLS por sí sola, sin la capa de aplicación, ya aísla los datos (§1, defensa en profundidad).
- **Build**: `npm run build` (o equivalente) y la suite completa de tests en verde es condición de entrada, no de salida, de cualquier despliegue que module este ADR.

---

## 31. Estrategia de migración desde `demo_tenant` y rutas `/demo`

Resuelve el hallazgo más grave de §0 — tres identificadores de tenant conviviendo sin reconciliar — y la Decisión Obligatoria 9 del encargo ("la DEMO también requiere autenticación").

### 31.1 Qué existe hoy, con precisión

- `companies` (`00001_company_brain_schema.sql`) — tabla de tenant original de Company Brain, con `company_id` referenciado en `00001`, `00002` y `00008`. No tiene relación declarada con `organizations` (`00018`).
- `organization_id UUID NOT NULL` sin FK — en `00010`, `00011`, `00013`, `00014`, `00015`, `00017`. Estas tablas ya usan el nombre de columna correcto (`organization_id`, no `company_id`), pero sin restricción de integridad hacia ninguna tabla raíz.
- `'demo_tenant'` como literal de texto — usado como valor semilla en `00009_dental_knowledge_manager.sql` y como fallback hardcodeado en `src/components/layout/Sidebar.tsx:9` (`params?.tenantId || 'demo_tenant'`). No es un UUID, no es una fila real de ninguna tabla de tenant — es un identificador de conveniencia de desarrollo que se filtró a código de producto.
- `ATLAS_RUNTIME_MODE` (`src/config/server-environment.ts`) ya modela `'demo'` como un modo de runtime explícito y distinto de `'production'`/`'staging'`/`'development_local'`, con `NEXT_PUBLIC_IS_ADMIN` como bandera adicional — esto es lo más cercano que existe hoy a "rutas `/demo`"; no existe un directorio `src/app/demo/` real.
- `supabase/seed.sql` ya crea una organización real (`demo-dental`, slug real, `id` fijo `00000000-0000-0000-0000-000000000001`) bajo el esquema nuevo de `00018` — es la semilla correcta hacia la que migrar, no un tercer sistema más.

### 31.2 Migración

1. **Congelar** cualquier nuevo uso de `'demo_tenant'` como literal o de `companies` como tabla de tenant a partir de esta ADR — toda referencia nueva usa `organizations`/`organization_id`.
2. **Backfill**: crear en `organizations` una fila por cada `companies.id` existente (mapeo 1:1, conservando el mismo `id` si es posible para no romper referencias existentes), y por cada valor distinto de `organization_id` ya usado en `00010`-`00017` que no corresponda a ninguna `companies.id`, decidir caso por caso si es dato de demo descartable o dato real que necesita una organización creada explícitamente.
3. **Añadir FK real** `organization_id UUID NOT NULL REFERENCES organizations(id)` a las seis tablas afectadas, en una migración dedicada posterior a `00018`, solo después de que el backfill del punto 2 garantice que ningún valor existente violaría la restricción.
4. **Sustituir el fallback de `Sidebar.tsx`**: `params?.tenantId || 'demo_tenant'` desaparece — el componente recibe el `slug` real ya resuelto por `requireOrganizationMembership` (§16) en el layout padre, nunca improvisa uno.
5. **La demo deja de ser "sin autenticación"**: la organización `demo-dental` (ya sembrada correctamente en `supabase/seed.sql`) se convierte en una organización real como cualquier otra, con sus propios usuarios de demo invitados por el flujo estándar (§6) — un visitante de demo inicia sesión con una cuenta de demo real, nunca navega sin sesión. `ATLAS_RUNTIME_MODE=demo` puede seguir controlando qué datos se sirven (ADR-0014) pero deja de tener ninguna implicación sobre si `proxy.ts` exige sesión — nunca la tuvo explícitamente, y esta ADR cierra esa ambigüedad de forma explícita.
6. **Ventana de convivencia**: durante la migración, `companies` y `organizations` coexisten (companies pasa a solo lectura, no se le añaden features nuevas) hasta que todo módulo que hoy lee `company_id` se haya movido a `organization_id` — solo entonces se marca `companies` como deprecada formalmente en una adenda de este ADR o un ADR posterior de limpieza técnica.

---

## 32. Evidence of Integration

Este ADR **no se considera implementado** por la existencia de este documento, ni siquiera por la existencia del código parcial auditado en §0. Se considera implementado únicamente cuando existe evidencia verificable, en un entorno real (staging o producción), de los ocho puntos siguientes:

1. **Login real** — un usuario invitado real completa `/login` con Supabase Auth y obtiene una sesión válida, sin ningún atajo de desarrollo.
2. **Sesión persistente** — esa sesión sobrevive a una recarga de página y a una navegación entre rutas privadas sin re-autenticar, verificable inspeccionando la cookie de sesión SSR.
3. **Ruta privada bloqueada** — un intento de acceder a `/{slug}` sin sesión, o a la organización de otro tenant sin membresía, resulta en redirección/bloqueo verificable (remedia directamente el hallazgo de §0).
4. **Pertenencia al tenant comprobada** — un usuario con membresía en la organización A y sin membresía en la organización B recibe error/redirección al intentar `/B`, no datos de B.
5. **Usuario suspendido bloqueado** — una cuenta marcada `SUSPENDED` en `profiles` o en su `organization_membership` no puede iniciar sesión o no puede acceder a esa organización respectivamente, verificado con una cuenta de prueba suspendida deliberadamente.
6. **Logout real** — tras `logout()`, una request posterior con la cookie de sesión anterior no está autenticada.
7. **RLS verificada entre dos usuarios** — la misma query, ejecutada con el JWT de dos usuarios de dos organizaciones distintas directamente contra Postgres (sin pasar por la capa de aplicación de Next.js), devuelve únicamente las filas de la organización propia de cada uno.
8. **Build y tests en verde** — `npm run build` y la suite completa de §30 pasan en CI antes de cualquier despliegue que dependa de este ADR.

Ningún ítem de esta lista se da por cumplido por inspección de código o por afirmación — cada uno requiere una demostración reproducible (captura, log, o test automatizado en verde) adjunta a la Pull Request que cierra esta ADR.
