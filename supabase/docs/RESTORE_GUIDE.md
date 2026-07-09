# Guía de Restauración / Reactivación

Sigue estos pasos precisos para revivir el backend de OPSTAR-AI desde cero basándote en el código de este repositorio.

## Requisitos Previos
1. Una cuenta activa de Supabase o una instancia self-hosted.
2. Haber creado un proyecto nuevo y limpio.
3. Tener Supabase CLI instalada localmente.

## Proceso de Restauración (Local / Desarrollo)

1. En la raíz de tu proyecto, inicializa Supabase si no lo has hecho:
   ```bash
   supabase init
   ```
2. Inicia los contenedores locales (asegúrate de tener Docker corriendo):
   ```bash
   supabase start
   ```
3. Ejecuta el archivo maestro de reinicio usando psql o pegándolo en el SQL Editor del dashboard (para producción):
   ```bash
   supabase db reset
   # O aplica manualmente reset.sql
   ```
   > ⚠️ Si aplicas `reset.sql` en producción, **copia el contenido** de las migraciones en el orden especificado dentro del archivo, o usa `supabase db push`.

## Proceso de Restauración (Producción)

Si estás conectando directamente a la base de datos de producción recién creada en Supabase Cloud:

1. Ve a la sección **SQL Editor**.
2. Copia y pega el contenido de las migraciones EN ORDEN STRICTO:
   - `0001_initial_schema.sql`
   - `0002_auth_roles_hospitals.sql`
   - `0003_zero_contrast_registry.sql`
   - `0004_helper_functions.sql`
   - `0005_oct_evidence_storage.sql`
   - `0006_demo_center_and_bi.sql`
   - `0007_rls_policies.sql`
3. Opcionalmente, para pruebas en staging, ejecuta las carpetas de `seeds`.
4. Ve al apartado **Storage** de Supabase y recrea manualmente los buckets indicados en `STORAGE.md`.

## Conexión con Next.js (Vercel)

Al levantar el frontend asociado, asegúrate de actualizar tu `.env.local` y los variables de entorno en Vercel con las credenciales del **nuevo** proyecto de Supabase:

```env
NEXT_PUBLIC_SUPABASE_URL="https://[NUEVO_PROJECT_REF].supabase.co"
NEXT_PUBLIC_SUPABASE_ANON_KEY="[NUEVA_CLAVE_ANON]"
SUPABASE_SERVICE_ROLE_KEY="[NUEVA_CLAVE_SERVICE_ROLE]"
```

¡Con esto, tu registro de zero-contrast volverá a estar 100% operativo sin depender de copias de seguridad de datos temporales!
