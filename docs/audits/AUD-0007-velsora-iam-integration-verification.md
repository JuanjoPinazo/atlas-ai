# AUD-0007 — Auditoría de Verificación de Integración: VELSORA IAM (Sprint 21.1)

| | |
|---|---|
| **Tipo** | Auditoría técnica independiente — no es un ADR |
| **Fecha** | 2026-07-12 |
| **Auditor** | Principal Security Auditor de VELSORA |
| **Base** | [ADR-0017](../adr/0017-velsora-identity-access-management.md) — los 21 puntos de verificación de esta auditoría se corresponden 1:1 con los criterios de aceptación y "Evidence of Integration" de ese documento |
| **Metodología** | Lectura directa de código fuente y migraciones reales; conexión directa a la base de datos Postgres real (Supabase local, `docker exec supabase_db_Project_Atlas_AI psql`) para inspeccionar el esquema aplicado (constraints, grants, políticas RLS) tal como existe hoy, no tal como los archivos `.sql` declaran que debería quedar; creación de usuarios y organizaciones de prueba reales vía la API de Supabase Auth y consultas SQL directas; ejecución real de los flujos de login/logout/navegación contra un servidor `next dev` real a través de un navegador controlado; ejecución real de `npm run test`, `npm run test:integration` y `npm run build`; verificación del sitio desplegado `velsora.vercel.app` en vivo. Ninguna afirmación de este informe proviene de la lectura de un archivo `.sql` como prueba de que su contenido está aplicado, ni de `walkthrough.md`, ni de descripciones de GA. |
| **Nota metodológica** | El repositorio no tenía ningún usuario, perfil ni membresía real en la base de datos local al iniciar esta auditoría (`SELECT * FROM profiles/organization_memberships/auth.users` devolvía 0 filas). Se crearon fixtures de prueba reales (dos organizaciones, cuatro usuarios con distintos estados de suspensión) para poder ejecutar cada verificación contra datos reales, no hipotéticos. Los scripts de fixture se ejecutaron y se eliminaron del repositorio al terminar; no se commitea ningún artefacto de prueba. |

---

## Veredicto

# NO APTO

Sprint 21.1 implementó una superficie de código sustancial y, en varios puntos concretos, correcta: el layout de `[tenantId]` ya invoca el guardián de pertenencia (punto 1), los tokens de invitación ya se hashean con SHA-256 en vez de guardarse en claro (punto 9, por inspección de código), el logout invalida realmente el refresh token en el servidor (punto 14), la Service Role no aparece en ningún bundle de cliente (punto 16), la web desplegada bloquea correctamente el acceso sin sesión (punto 18), y `npm run test`, `npm run build` pasan en verde (puntos 19, 21).

Pero esta auditoría encontró, de primera mano y de forma reproducible, **dos fallos de infraestructura que invalidan por completo el sistema de autorización descrito en ADR-0017, no como un riesgo teórico sino como un error observado y reproducido en vivo**:

1. **Ninguna tabla de la plataforma (salvo dos) tiene privilegios (`GRANT`) concedidos a los roles `anon`, `authenticated` o `service_role`.** Toda consulta que la aplicación real ejecuta contra `profiles`, `organizations`, `organization_memberships`, `user_invitations`, `rate_limits`, `company_brain`, etc. — ya sea con la clave anónima (sesión de usuario) o con la Service Role (Server Actions administrativas) — falla con `permission denied for table X`.
2. **La política de RLS de `organization_memberships` ("Users can read their own memberships", `00018_velsora_iam.sql:117-126`) es auto-referencial y produce recursión infinita** (`infinite recursion detected in policy for relation "organization_memberships"`, código Postgres `42P17`) en cada consulta, para cualquier usuario, sin excepción.

La combinación de ambos hallazgos, más un patrón sistemático de "fail-open" en el código de aplicación (un error de base de datos se trata como "no hay resultados" en vez de propagarse), produjo en esta auditoría una prueba en vivo, reproducible con una captura del servidor de desarrollo, de que **un usuario con el perfil marcado como `SUSPENDED` pudo iniciar sesión con éxito** — exactamente el escenario que el punto 12 de este encargo exige verificar como bloqueado. Con ese resultado, ningún otro punto de esta lista puede considerarse aprobado de forma independiente: el mecanismo de autorización completo está, en la práctica, apagado.

---

## Hallazgo crítico — léase antes que cualquier otro punto

**Evidencia empírica exacta**, obtenida ejecutando la consulta real que usan `requireAuthenticatedUser()` y `requireOrganizationMembership()` (`src/lib/auth/auth-utils.ts`) contra la base de datos real, autenticado como un usuario de prueba real:

```
signin error undefined
query result {"data":null,"error":{"code":"42P17","details":null,"hint":null,
"message":"infinite recursion detected in policy for relation \"organization_memberships\""}}
```

```
membership lookup {"membership":null,"memErr":{"code":"42P17","details":null,"hint":null,
"message":"infinite recursion detected in policy for relation \"organization_memberships\""}}
profile lookup {"profile":null,"profErr":{"code":"42501","details":null,
"hint":"Grant the required privileges to the current role with: GRANT SELECT ON public.profiles TO authenticated;",
"message":"permission denied for table profiles"}}
```

Causa raíz 1 — recursión: `organization_memberships.organization_id = organization_memberships.organization_id` en la subconsulta `EXISTS` de la política (`00018_velsora_iam.sql:121`) hace referencia a la misma tabla que la propia política protege. Postgres re-evalúa la política para las filas de la subconsulta, que a su vez dispara la misma política, indefinidamente.

Causa raíz 2 — privilegios: de las 66 tablas de `public` en el esquema actual, solo dos (`discovery_interviews`, `discovery_interview_answers`, ambas de `00017_discovery_interview.sql`) tienen una sentencia `GRANT` explícita para `anon`/`authenticated`/`service_role`. Ninguna otra migración —incluidas las cinco tablas de IAM de `00018` y las dos tablas endurecidas de `00019`— concede privilegios de `SELECT`/`INSERT`/`UPDATE`/`DELETE` a esos roles. Postgres no concede privilegios por defecto a roles no propietarios; sin un `GRANT` explícito (o `ALTER DEFAULT PRIVILEGES`), la tabla es invisible para cualquier rol que no sea `postgres`.

**Consecuencia observada, no hipotética**: como ninguna de las dos funciones anteriores propaga el error (`const { data } = await supabase.from(...)`, ignorando siempre `error`), cada fallo de base de datos se interpreta en la aplicación como "no hay datos" — lo que convierte un error de disponibilidad en un **fallo abierto (fail-open) de seguridad**. La prueba en vivo de este informe (punto 12) demuestra la peor expresión posible de este patrón: un usuario suspendido queda autenticado.

---

## Hallazgos por punto de verificación

### 1. `[tenantId]/layout.tsx` exige membership

**CUMPLIDO EN CÓDIGO — INEFECTIVO EN EJECUCIÓN.**

`src/app/(dashboard)/[tenantId]/layout.tsx:14` invoca `await requireOrganizationMembership(tenantId)` antes de renderizar `children`, y expone `{ user, org, membership }` vía `TenantProvider` — exactamente el patrón que ADR-0017 §16 exige, y una corrección real frente al estado auditado en ese mismo documento (§0), donde el layout no llamaba a ningún guardián. Se reconoce como una corrección genuina.

Pero la función que invoca (`requireOrganizationMembership`) ejecuta la consulta que el Hallazgo Crítico demuestra rota por recursión infinita — de modo que la llamada existe, se ejecuta, pero nunca puede confirmar una membresía real, para nadie. El guardián está en su sitio; el motor detrás no funciona.

### 2. Un usuario A no accede al tenant B

**NO VERIFICABLE COMO DISEÑADO — VERIFICADO COMO "NINGÚN USUARIO ACCEDE A NINGÚN TENANT".**

Se crearon dos organizaciones reales (`demo-dental` y `org-b-test`) y dos usuarios reales, cada uno con membresía `ACTIVE` en una organización distinta. El usuario de la organización A, tras iniciar sesión con éxito, fue redirigido a `/select-organization?error=no-org` con el mensaje "No tienes organizaciones asignadas" — a pesar de tener una fila `ACTIVE` real en `organization_memberships`. La causa es el mismo Hallazgo Crítico: la consulta de pertenencia falla para todos, no discrimina entre A y B. No hay fuga de tenant B hacia A porque no hay acceso de ninguno de los dos a nada.

### 3. `organizations` es la raíz real del tenant

**NO CUMPLIDO.**

Consulta directa contra `information_schema.table_constraints`: `companies` (`00001_company_brain_schema.sql`) sigue siendo la tabla referenciada por clave foránea desde 13 tablas (`company_settings`, `company_documents`, `company_events`, `company_knowledge`, `company_policies`, `company_products`, `company_prompts`, `company_services`, `access_policies`, `audit_logs`, `decision_rules`, `decision_logs`, `validation_logs`, `retrieval_events`, y todas las `knowledge_*` salvo `knowledge_documents`). `organizations` solo es la raíz real para las cinco tablas nuevas de IAM (`00018`) más `company_brain` y `knowledge_documents`, que ahora tienen **ambas** columnas (`company_id` y `organization_id`) simultáneamente. `organizations` es hoy un segundo sistema de tenant en paralelo, no la raíz única.

### 4. Las tablas de negocio tienen FK real hacia `organizations`

**PARCIAL — 2 de 13 tablas objetivo.**

Consulta directa contra el catálogo de Postgres, columna por columna, para toda tabla con `organization_id`:

| Tabla | FK real hacia `organizations` |
|---|---|
| `auth_audit_logs`, `organization_memberships`, `user_invitations` | ✅ (tablas de IAM propiamente dichas) |
| `company_brain`, `knowledge_documents` | ✅ (añadida por `00019_unify_tenants.sql`) |
| `assessment_sessions`, `dental_budget_follow_up_attempts`, `dental_budget_status_history`, `dental_budgets`, `dental_patients_reference`, `discovery_interviews`, `opportunity_candidates`, `platform_events`, `roi_events`, `tenant_assessments`, `tenant_connectors` | ❌ — columna `organization_id UUID` presente pero sin ninguna restricción de clave foránea |

`00019_unify_tenants.sql` reconoce el problema (comentario propio: *"For full deprecation, all tables would be altered"*) pero solo actúa sobre 2 de las 13 tablas afectadas, y para una de ellas (`tenant_assessments`) añade la columna sin backfill — la línea de `UPDATE` que la poblaría está comentada (`-- UPDATE tenant_assessments SET organization_id = tenant_id...`).

### 5. No quedan usos activos de `demo_tenant` como fallback

**NO CUMPLIDO.**

`src/components/layout/Sidebar.tsx:9` conserva, sin cambios desde antes de este sprint:

```ts
const tenantId = params?.tenantId || 'demo_tenant';
```

Es código de navegación que se ejecuta en cliente en cada render del layout del dashboard — un fallback activo, no un resto muerto. `grep -rn "demo_tenant" src` no devuelve ninguna otra coincidencia fuera de este archivo y las migraciones de datos semilla ya existentes.

### 6. `/select-organization` existe y funciona

**PARCIAL.**

La ruta existe (`src/app/select-organization/page.tsx`), compila, y renderiza sin error 500 — verificado en vivo navegando a ella tras un login real. Pero su consulta (`organization_memberships.select('role, organizations(...)')`) es la misma consulta que el Hallazgo Crítico demuestra rota: en la prueba en vivo, un usuario con una membresía activa real vio "No tienes organizaciones asignadas". La página existe y no se cae; no cumple su propósito.

### 7. `/unauthorized` existe

**PARCIAL — existe, pero es inalcanzable.**

El archivo existe (`src/app/unauthorized/page.tsx`) y compila. Pero `grep -rn "'/unauthorized'" src` no devuelve ninguna coincidencia en todo el código de aplicación: ningún `redirect()` apunta jamás a esta ruta. `requireRole()` (`auth-utils.ts:67`), que es el único lugar donde ADR-0017 exige ese destino, sigue redirigiendo a `/${org.slug}?error=unauthorized` en su lugar. La página es código muerto.

### 8. `/auth/accept-invite` funciona

**NO VERIFICABLE — bloqueado por el Hallazgo Crítico.**

La página existe y su formulario está bien construido (token oculto, contraseña, llama a `acceptInvite`). Pero `acceptInvite()` (`src/app/actions/user-management.ts:47`) empieza consultando `user_invitations` con la Service Role — y ninguna invitación puede existir para probarlo, porque **crear una invitación ya falla primero** (ver punto 9). Se intentó de forma aislada, con datos insertados directamente como superusuario para saltar el bloqueo de creación, pero no se pudo completar el flujo end-to-end dentro del alcance de esta auditoría dado que el hallazgo raíz (privilegios) afecta también a la creación del usuario/perfil/membresía subsiguiente en el mismo Server Action.

### 9. El token de invitación se almacena hasheado

**DISEÑO CORRECTO POR INSPECCIÓN DE CÓDIGO — NO EJECUTABLE EN EL SISTEMA REAL.**

`src/app/actions/user-management.ts:19-20`:
```ts
const token = crypto.randomBytes(32).toString('hex');
const tokenHash = crypto.createHash('sha256').update(token).digest('hex');
```
Correcto: entropía criptográfica adecuada, solo el hash se persiste (`token_hash: tokenHash`), el token en claro solo viaja en el enlace de invitación. Esto es una mejora real y verificable frente al hallazgo de ADR-0017 §0 (antes se guardaba un UUID en claro).

Sin embargo, la ejecución real de `inviteUser()` contra la base de datos falla:
```
inviteUser simulated insert -> error: permission denied for table user_invitations
```
El mismo Hallazgo Crítico (privilegios) impide que se cree jamás una invitación real. El diseño del hash es correcto; el sistema que lo usa está apagado.

### 10. Invitación expirada, revocada o usada se rechaza

**NO VERIFICABLE (expirada/usada) — NO IMPLEMENTADO (revocada).**

- Expirada/usada: el código de `acceptInvite()` (`user-management.ts:59-72`) sí comprueba `status = 'PENDING'` y `expires_at < now()` correctamente en su lógica — pero no se pudo ejercitar contra una invitación real por el bloqueo del punto 9.
- Revocada: no existe ningún estado `REVOKED` asignable en el código actual. `grep -rn "REVOKED\|revokeInvite" src` no devuelve ninguna función que lo implemente — la capacidad de revocación que ADR-0017 §23 exige no se ha construido todavía, independientemente del bloqueo de privilegios.

### 11. El email del invitado debe coincidir

**CUMPLIDO POR CONSTRUCCIÓN — CON UNA LIMITACIÓN FUNCIONAL RELACIONADA.**

`acceptInvite()` nunca acepta un email como entrada del usuario — usa directamente `invite.email` para crear la cuenta (`user-management.ts:76`), por lo que no existe ninguna vía en esta UI para que alguien introduzca un email distinto al de la invitación. La verificación de coincidencia es, en este diseño, trivialmente cierta por ausencia de un campo alternativo, no por una comprobación activa.

Limitación relacionada (fuera del punto exacto, pero directamente adyacente): si el email ya tiene cuenta, `acceptInvite()` lanza `'El usuario ya existe, inicia sesión e ingresa al enlace'` y termina — pero no existe ningún camino de código que, tras ese inicio de sesión, adjunte la membresía pendiente a la cuenta existente. Un usuario que ya tiene cuenta en la plataforma no puede aceptar una invitación a una segunda organización con el código actual.

### 12. Usuario suspendido queda bloqueado

**NO CUMPLIDO — CONFIRMADO EN VIVO, CON CAPTURA.**

Se marcó `profiles.status = 'SUSPENDED'` para un usuario de prueba real (`suspended@audit.test`) directamente en la base de datos. Se inició sesión con ese usuario, con contraseña real, a través del formulario de login real servido por `next dev`. Resultado observado en el navegador: la aplicación **no** mostró "Cuenta suspendida" — navegó con éxito a `/select-organization`, con sesión autenticada activa.

Causa: `login()` (`src/app/(auth)/actions.ts:28-37`) consulta `profiles.status`, obtiene `permission denied for table profiles` (Hallazgo Crítico), `profile` queda `undefined`, `profile?.status === 'SUSPENDED'` se evalúa `false`, y el flujo continúa como si el perfil no estuviera suspendido. Es un fallo abierto de seguridad, no una omisión de cobertura: la comprobación de suspensión existe en el código y, en este sprint, es inoperante.

### 13. Membership suspendida queda bloqueada

**NO VERIFICABLE — mismo Hallazgo Crítico.**

`requireOrganizationMembership()` comprueba `membership?.status === 'SUSPENDED'` (`auth-utils.ts:56`) después de una consulta que, según el Hallazgo Crítico, siempre falla por recursión infinita antes de llegar a esa comprobación. No se pudo observar el comportamiento real porque ninguna consulta de membership se completa, suspendida o no.

### 14. Logout invalida realmente la sesión

**CUMPLIDO — verificado empíricamente.**

Prueba directa: sesión real iniciada, `refresh_token` capturado, `signOut()` ejecutado, y reintento de `refreshSession()` con el token anterior:
```
refresh with old token after logout -> error: Invalid Refresh Token: Refresh Token Not Found session issued: false
```
Supabase Auth invalida el refresh token en el servidor de autenticación de forma real, no solo borra la cookie en cliente. Este es el único mecanismo de sesión de esta auditoría que no depende de ninguna de las tablas de `public` afectadas por el Hallazgo Crítico — corre enteramente dentro de `auth.users`/GoTrue, gestionado por Supabase, ajeno a los `GRANT` de este esquema.

### 15. RLS se prueba con dos usuarios y dos tenants reales

**NO CUMPLIDO — probado, y roto.**

Se insertó una fila en `company_brain` (tabla con FK real y RLS del punto 4) para cada organización, y se consultó como cada usuario, autenticado con su JWT real:
```
userA (org A member) reading company_brain -> {"error":"infinite recursion detected in policy for relation \"organization_memberships\""}
userB (org B member) reading company_brain -> {"error":"infinite recursion detected in policy for relation \"organization_memberships\""}
```
La política de `company_brain` (`00019_unify_tenants.sql:42-50`) no es auto-referencial en sí misma, pero su condición `EXISTS (SELECT 1 FROM organization_memberships ...)` invoca la política rota de `organization_memberships` como subconsulta — la recursión de ese Hallazgo Crítico se propaga a **toda** tabla cuya RLS dependa de una comprobación de membership, que es el patrón que ADR-0017 §18 prescribe para toda la plataforma. No se trata de un fallo aislado de una tabla: es un fallo del mecanismo de aislamiento multi-tenant en sí.

Nota adicional: la única prueba con "RLS" en su nombre del repositorio (`src/__tests__/integration/rls.test.ts`) sigue siendo, sin cambios desde AUD-0002, un marcador de posición que no ejecuta ninguna operación contra una base de datos real (`expect(repo).toBeDefined()`, `expect(tenantA).not.toBe(tenantB)` como única aserción) — pasa en verde y no habría detectado nada de lo anterior. Se señala explícitamente para que no se confunda `npm run test:integration` en verde con RLS verificada.

### 16. La Service Role no aparece en el bundle cliente

**CUMPLIDO.**

Tras `npm run build`, se realizó una búsqueda exhaustiva del valor literal de `SUPABASE_SERVICE_ROLE_KEY` y de las cadenas `SERVICE_ROLE_KEY`/`createAdminClient` dentro de `.next/static` (el único directorio de salida que se sirve al navegador) — cero coincidencias. `createAdminClient()` (`src/lib/supabase/admin.ts`) solo se importa desde archivos `'use server'`, nunca desde un Client Component. Este es un punto genuinamente resuelto y verificado, no solo por diseño sino por inspección directa del artefacto de build.

### 17. Rate limiting funciona

**NO CUMPLIDO — falla abierto por el mismo Hallazgo Crítico.**

`rate_limits` (`00019_unify_tenants.sql`) tampoco tiene ningún `GRANT` para `service_role`:
```
service_role select rate_limits -> {"rl":null,"rlErr":{"code":"42501", ...,
"message":"permission denied for table rate_limits"}}
service_role insert rate_limits -> error: permission denied for table rate_limits
```
`checkRateLimit()` (`src/lib/auth/rate-limit.ts:24-33`) trata cualquier error de lectura como "no existe registro todavía" y, tras un intento de inserción que también falla en silencio, **siempre devuelve `true`** (permitido). El resultado neto es que el límite de intentos de login, diseñado correctamente en su lógica (ventana de 15 minutos, bloqueo tras 5 intentos), nunca bloquea nada en la práctica.

### 18. `velsora.vercel.app` muestra login sin sesión

**CUMPLIDO.**

Verificado en vivo, dos veces: la raíz (`/`) sin cookies de sesión muestra el formulario de login (VELSORA / Secure Access), y un intento de deep-link directo a `/demo-dental` sin sesión también redirige al login — capturado con pantalla completa, sin errores de consola. Este es el único punto de esta auditoría que depende exclusivamente de `proxy.ts` y no de ninguna tabla de `public`, y es coherente con el resultado: `proxy.ts` solo verifica sesión (§15 de ADR-0017), nunca consulta membership — por eso no se ve afectado por el Hallazgo Crítico.

### 19. `npm run test` pasa

**CUMPLIDO.** 5 archivos, 12 pruebas, todas en verde. Ejecutado en este turno.

### 20. `npm run test:integration` pasa

**CUMPLIDO EN FORMA — VACÍO EN SUSTANCIA.**

1 archivo, 1 prueba, en verde. Es la misma prueba señalada en el punto 15: no ejecuta ninguna operación real contra Supabase, por lo que su éxito no aporta ninguna evidencia sobre ninguno de los hallazgos de este informe. Se hace constar explícitamente para que "pasa" no se lea como "verificado".

### 21. `npm run build` pasa

**CUMPLIDO.** Compilación completa, TypeScript sin errores, todas las rutas generadas (incluidas `/select-organization`, `/unauthorized`, `/auth/accept-invite`). Ejecutado en este turno.

---

## Hallazgos adicionales, fuera de los 21 puntos exactos pero directamente relevantes para un auditor de seguridad

| Hallazgo | Ubicación | Riesgo |
|---|---|---|
| `requireOrganizationMembership` construye un filtro PostgREST por interpolación directa de `tenantSlugOrId` sin sanitizar (`.or(\`id.eq.${tenantSlugOrId},slug.eq.${tenantSlugOrId}\`)`) | `src/lib/auth/auth-utils.ts:34` | Un segmento de URL controlado por el atacante se inyecta sin escapar en la sintaxis de filtro de PostgREST — superficie de inyección de filtro, no explotada en esta auditoría pero no descartada; requiere revisión dedicada una vez el Hallazgo Crítico esté resuelto y la ruta sea de nuevo alcanzable |
| Patrón repetido de "silenciar el error, tratar `data: null` como resultado vacío" | `src/app/page.tsx`, `src/app/select-organization/page.tsx`, `src/lib/auth/auth-utils.ts`, `src/lib/auth/rate-limit.ts` | Es la causa estructural común detrás de los puntos 6, 12, 13, 17 — no son cuatro bugs independientes, son cuatro síntomas del mismo hábito de código |
| `checkSuperadmin()` conserva un comentario de duda de diseño sin resolver ("Wait, SUPERADMIN is a role in organization_memberships, or is it global?") | `src/lib/auth/auth-utils.ts:87-89` | No es un defecto funcional, pero indica que la decisión de ADR-0017 §4 (SUPERADMIN es global) no se ha comunicado de vuelta al autor del código que la implementa |

---

## Tabla de remediación pendiente para alcanzar APTO

| # | Hallazgo | Prioridad |
|---|---|---|
| 1 | Corregir la política recursiva de `organization_memberships` (`00018_velsora_iam.sql:117-126`) — sustituir la subconsulta auto-referencial por una función `SECURITY DEFINER` (p. ej. `is_member_of(org_id)`) que evite que la política se invoque a sí misma | **P0 — bloqueante absoluto, afecta a los 21 puntos de este informe** |
| 2 | Emitir `GRANT SELECT, INSERT, UPDATE, DELETE` explícito para `anon`/`authenticated`/`service_role` (según corresponda a cada tabla) en una migración dedicada que cubra las 64 tablas que hoy carecen de él — no solo las de IAM | **P0 — bloqueante absoluto, afecta a los 21 puntos de este informe** |
| 3 | Auditar y corregir cada punto donde el código actual descarta `error` de una llamada a Supabase y trata `data: null` como "vacío" — mínimo: `page.tsx`, `select-organization/page.tsx`, `auth-utils.ts`, `rate-limit.ts`, `actions.ts` (login) | **P0 — es el mecanismo que convirtió los hallazgos 1 y 2 en un fallo abierto de seguridad (punto 12)** |
| 4 | Reemplazar `src/__tests__/integration/rls.test.ts` por una prueba que efectivamente cree dos tenants y dos usuarios reales, inserte como A, y verifique lectura vacía como B — contra la base de datos local real, no un marcador de posición | **P0 — sin esto, ninguna futura corrección de RLS puede verificarse automatizadamente** |
| 5 | Eliminar el fallback `'demo_tenant'` de `Sidebar.tsx:9` y sustituirlo por el `org.slug` ya resuelto por el layout padre | **P1** |
| 6 | Añadir FK real `organization_id → organizations(id)` a las 11 tablas de negocio identificadas en el punto 4, con backfill previo verificado | **P1** |
| 7 | Conectar `requireRole()` a una redirección real hacia `/unauthorized`, o eliminar la página si el destino definitivo sigue siendo `/${org.slug}?error=unauthorized` — que no queden rutas construidas e inalcanzables | **P2** |
| 8 | Implementar revocación de invitaciones (`status = 'REVOKED'`) y el camino de adjuntar membership a una cuenta ya existente en `acceptInvite()` | **P2** |
| 9 | Sanear la interpolación de `tenantSlugOrId` en el filtro `.or()` de `requireOrganizationMembership` | **P2** |

---

## Conclusión

Sprint 21.1 demuestra trabajo de diseño genuino en varios frentes — el hash de tokens de invitación, la invalidación real de sesión al logout, la exclusión correcta de la Service Role del bundle de cliente, y la conexión real del guardián de membership al layout de tenant son, todos, avances verificables y no cosméticos. Pero esta auditoría encontró, en vivo y de forma reproducible, que la base sobre la que se apoya todo lo demás — poder leer y escribir las propias tablas de identidad y acceso — está rota por dos causas de infraestructura (una política RLS recursiva y una ausencia casi total de privilegios de tabla), y que el código de aplicación convierte esa rotura en un fallo abierto: un usuario suspendido pudo iniciar sesión con éxito durante esta auditoría. Ningún punto de la lista de 21 puede darse por bueno de forma aislada mientras la capa que todos comparten no funcione. El veredicto es NO APTO PARA ACCESO PRIVADO, y la prioridad P0 no es ningún punto de funcionalidad — es que la plataforma pueda, primero, leer sus propias tablas.
