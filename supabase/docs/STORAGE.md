# Configuración de Supabase Storage

El proyecto OPSTAR-AI utiliza Supabase Storage para alojar la evidencia audiovisual de los procedimientos (vídeos de OCT y reportes).

## Buckets Requeridos

### 1. `opstar-oct-evidence`
- **Uso:** Almacenamiento primario para los vídeos (AVI/MP4) de las tiradas OCT pre y post, así como angiografías accesorias.
- **Acceso Público:** `False` (Privado).
- **Estructura de rutas recomendada:**
  `[hospital_id]/[case_id]/[evidence_phase]_[evidence_type]_[timestamp].[ext]`
  Ejemplo: `a1b2c3d4/f6a7b8c9/pre_oct_video_167890.mp4`
- **Políticas RLS:** 
  - Insert/Select limitado a operadores de ese `hospital_id`.
  - Admin/Monitor lectura global.

### 2. `opstar-case-media`
- **Uso:** Archivos temporales o recortes de los pullbacks OCT (procesados localmente o por AI).
- **Acceso Público:** `False`.

### 3. `opstar-exports`
- **Uso:** Archivos CSV, PDF o ZIP generados asíncronamente para la descarga de datos del estudio.
- **Acceso Público:** `False` (Requiere URL firmada).

## Generación de URLs
Debido a la naturaleza privada de los buckets médicos, el cliente de Supabase (Next.js) debe solicitar siempre una **Signed URL** temporal (ej. 60-300 segundos de validez) para reproducir los vídeos en el navegador.

## Restauración
Los buckets **no** se crean automáticamente con migraciones SQL convencionales sin acceso directo al esquema `storage`. 
Al restaurar el proyecto, debes:
1. Ir al Dashboard de Supabase.
2. Crear manualmente los buckets listados arriba.
3. Desactivar "Public".
4. (Opcionalmente) Aplicar las políticas de seguridad en la pestaña Storage > Policies.
