# AUD-0006 — Discovery Interview: Preparación para Entrevista Piloto (Sprint 20.4)

| | |
|---|---|
| **Tipo** | Auditoría técnica independiente — no es un ADR |
| **Fecha** | 2026-07-11 |
| **Auditor** | Product Auditor de ATLAS AI |
| **Base** | [AUD-0005](AUD-0005-sprint-20-3-discovery-interview.md) |
| **Metodología** | Verificación **empírica en navegador contra la aplicación real, conectada a la instancia de Supabase real** (no una simulación) — se creó y navegó una sesión de trabajo real, reproduciendo la creación de una entrevista dos veces, con distintos `organizationId`. Ejecución real de `npm run test` y `npm run build`. **No se ha aceptado ningún archivo `.sql` como prueba de que una migración está aplicada** — cada afirmación sobre el estado de la base de datos proviene de la respuesta real de la aplicación al interactuar con ella. |

---

## Veredicto

# NO APTO

La creación de una entrevista falla, en vivo, contra la base de datos real conectada — reproducido dos veces en esta sesión, con dos `organizationId` distintos, con el mismo resultado exacto. Es un bloqueo de raíz que impide verificar empíricamente cualquiera de los puntos 4 a 10 de la lista solicitada, porque ninguno de ellos puede probarse sin que exista, primero, una entrevista creada.

---

## Hallazgos por punto de verificación

### 1. ¿Migración `00017` aplicada?

**INCUMPLIDO — verificado empíricamente, no por lectura de archivo.**

Se navegó la aplicación real (`http://localhost:3000`) y se intentó crear una entrevista a través del botón real *"Nueva entrevista estratégica"*. La base de datos conectada respondió con un error propio de PostgREST:

```
Error: Could not find the 'created_by' column of 'discovery_interviews' in the schema cache
    at createInterviewAction (...)
```

Este error solo puede producirlo la base de datos real cuando una columna que el código espera no existe en el esquema que PostgREST tiene cacheado — es decir, la migración `00017_discovery_interview.sql`, presente en el repositorio con la columna `created_by` declarada (línea 10), **no está aplicada contra la instancia de Supabase a la que la aplicación está conectada**. El archivo en disco no es la base de datos.

### 2. ¿Columna `created_by` existente?

**INCUMPLIDO — mismo hallazgo empírico que el punto 1.** No existe en el esquema real, independientemente de lo que declare el archivo de migración.

### 3. ¿Creación de entrevista real?

**INCUMPLIDO — confirmado dos veces, con dos `organizationId` distintos.**

- Primer intento, con `organizationId = "demo"` (el valor de `tenantId` de la ruta de navegación por defecto de este entorno): la propia aplicación rechazó la operación con `Error: [Atlas Discovery] organizationId no válido: demo` — una validación de formato UUID que sí funciona correctamente — pero, tras corregir eso navegando a una ruta con un UUID válido (`00000000-0000-0000-0000-000000000000`), la creación **volvió a fallar**, esta vez exclusivamente con el error de esquema del punto 1. Se aisló así que el bloqueo real y de fondo es el de la migración, no la validación de formato.

### 4. ¿Autoguardado de respuesta?

**NO VERIFICABLE — bloqueado por los puntos 1-3.** No existe ninguna entrevista creada contra la que probar un guardado de respuesta.

### 5. ¿Reapertura y recuperación?

**NO VERIFICABLE — mismo bloqueo.**

### 6. ¿Persistencia de todos los campos de inteligencia?

**NO VERIFICABLE empíricamente en esta auditoría — mismo bloqueo.** Recordatorio de lo ya documentado en AUD-0005 §6, no vuelto a verificar aquí por no ser alcanzable: ausencia de campo `affected_area`, fusión de `observations`/`ideas` en un único campo, e inconsistencia `CRITICAL`/`VERY_HIGH` entre la interfaz y el tipo declarado.

### 7. ¿Acceso y aislamiento por organización?

**INCUMPLIDO — no solo "no verificable", hay evidencia directa de un defecto real.**

No se pudo probar el aislamiento de forma empírica (no hay entrevistas creadas). Pero `npm run test` (punto 11) ejecuta una prueba real de este mecanismo y falla con un error de programación, no con un resultado de autorización:

```
FAIL src/__tests__/actions/interview.test.ts > ... > should proceed if organizationId is a valid UUID
TypeError: supabaseClient.auth.getSession is not a function
 ❯ checkAccess src/app/actions/interview.ts:13:59
```

`checkAccess` (`src/app/actions/interview.ts:8-16`) ha dejado de ser el no-op stub señalado en AUD-0005 §2 — ahora intenta comprobar una sesión real con `supabaseClient.auth.getSession()` — un intento genuino de corregir el hallazgo anterior. Pero el método invocado no existe en el cliente que recibe, y la propia prueba automatizada de esta funcionalidad lo confirma con un fallo real, no simulado.

### 8. ¿Estado Pendiente/Revisado persistente?

**NO VERIFICABLE — mismo bloqueo de creación.**

### 9. ¿Impresión de los 10 bloques completos?

**INCUMPLIDO — no verificado en vivo por el bloqueo, pero confirmado sin ambigüedad por lectura de código, sin cambios desde AUD-0005.**

`InterviewWizardClient.tsx:24` sigue declarando `activeBlock` como un único `string` (`useState<string>('HEADER')`), no un conjunto de bloques abiertos. La condición de montaje del contenido (`isOpen || typeof window === 'undefined'`, línea 91, sin cambios) sigue impidiendo que el contenido de los bloques cerrados exista en el DOM tras la hidratación. El defecto de impresión ya señalado en AUD-0005 §10 no se ha tocado en este sprint.

### 10. ¿Funcionamiento tablet 768×1024?

**NO VERIFICABLE — mismo bloqueo de creación**, sin poder llegar a la pantalla de la entrevista en ningún viewport.

### 11. `npm run test`

**FALLA.**

2 de 5 archivos, 2 de 11 pruebas en rojo:
- `src/lib/assessment/tests/assessment.test.ts:48` — la misma regresión de `AssessmentEngine.calculateScores` señalada por primera vez en AUD-0004 y repetida en AUD-0005, **todavía sin corregir en un tercer ciclo de auditoría**.
- `src/__tests__/actions/interview.test.ts` — `should proceed if organizationId is a valid UUID` falla con `TypeError: supabaseClient.auth.getSession is not a function` (ver punto 7). Nótese que, a diferencia de AUD-0005, este archivo de pruebas **ya usa la API correcta de Vitest** (corrección real del hallazgo P0 de esa auditoría) — el archivo ahora ejecuta pruebas de verdad, y una de ellas encuentra un defecto real.

### 12. `npm run build`

**PASA.** Código de salida 0, verificado en este turno.

---

## Qué se corrigió realmente desde AUD-0005 (para que quede constancia)

- El archivo de pruebas de `interview` ya no usa `jest` — usa `vi` de Vitest correctamente, y por tanto ya ejecuta pruebas reales por primera vez.
- `checkAccess` dejó de ser un no-op — ahora intenta una verificación de sesión real, aunque con un error de implementación.
- La validación de formato de `organizationId` (rechazar valores no-UUID como `"demo"`) es nueva y funciona correctamente.

Ninguno de estos avances es suficiente todavía porque el bloqueo de fondo — la migración no aplicada contra la base de datos real — impide que cualquiera de ellos se ponga a prueba de verdad en un flujo completo.

---

## Tabla de remediación

| # | Hallazgo | Prioridad |
|---|---|---|
| 1 | Aplicar realmente la migración `00017` (y confirmar que no hay más migraciones pendientes de aplicar) contra la base de datos conectada a este entorno — verificar después con la misma prueba empírica de esta auditoría (crear una entrevista real y confirmar que no aparece el error de `created_by`) | **P0 — bloqueante, repetido por tercera vez desde AUD-0005** |
| 2 | Corregir `checkAccess` en `src/app/actions/interview.ts:13` — sustituir `supabaseClient.auth.getSession()` por el método correcto del cliente Supabase en uso (`getUser()`, consistente con el resto del código ya auditado en sprints anteriores) | **P0** |
| 3 | Corregir la regresión heredada de `AssessmentEngine.calculateScores` — tercera auditoría consecutiva que la señala sin corregir | **P0** |
| 4 | Rediseñar la vista de impresión para renderizar los 10 bloques simultáneamente, no solo el bloque abierto (heredado de AUD-0005, sin cambios) | **P1** |
| 5 | Una vez resuelto el punto 1, repetir íntegramente esta auditoría para los puntos 4 a 10, que hoy no tienen ningún veredicto real por falta de acceso | **Condición para la siguiente auditoría, no una corrección en sí** |

---

## Conclusión

Esta auditoría no pudo completarse en el sentido de "probar el producto" — pudo completarse, y con creces, en el sentido de "probar si el producto se puede usar", que es la pregunta que de verdad importa antes de una entrevista piloto real con un cliente. La respuesta, confirmada dos veces en vivo contra la base de datos real, es que no. El propio proceso de corrección ha avanzado en las capas de código (pruebas reales, intento de verificación de sesión, validación de formato) sin que nada de eso llegue todavía a la capa que hace falta resolver primero: que la base de datos conectada tenga de verdad el esquema que el código ya asume desde hace tres auditorías.
