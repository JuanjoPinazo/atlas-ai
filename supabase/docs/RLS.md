# Guía de Row Level Security (RLS)

Este documento detalla la matriz de permisos y funciones helper diseñadas para garantizar la seguridad de los datos en OPSTAR-AI.

## Roles de Usuario
Basado en el enum `user_role` de la tabla `profiles`:

1. **Admin (`admin`)**: Acceso total a lectura, escritura y borrado en todo el esquema. Visibilidad única del módulo BI.
2. **Monitor Clínico (`monitor`)**: Acceso global de lectura para auditar casos en todos los hospitales. Sin acceso a métricas de negocio.
3. **Usuario de Hospital (`hospital_user`)**: Acceso restringido (Lectura/Escritura) únicamente a los datos de los centros a los que pertenece.
4. **Espectador (`viewer`)**: Permisos de solo lectura aplicables según configuración.

## Funciones Helper
Para evitar políticas complejas y costosas computacionalmente, se emplean funciones `SECURITY DEFINER`:

- `get_current_user_role()`: Retorna el rol actual.
- `get_current_user_hospital_ids()`: Devuelve el array de UUIDs de hospitales a los que el investigador tiene acceso activo.
- `is_admin()` / `is_monitor()`: Comprobación rápida de privilegios.
- `can_access_case(case_uuid)`: Validación de pertenencia para lectura.
- `can_edit_case(case_uuid)`: Validación para escritura, comprobando que el caso no esté bloqueado.

## Políticas Destacadas

### Aislamiento de Casos (Tenant Isolation)
Los casos (`ecrf_opstar_records`) están rigurosamente separados mediante RLS:
```sql
USING (hospital_id = ANY(public.get_current_user_hospital_ids()));
```

### Bloqueo de Modificación
Ningún usuario (excepto `admin`) puede alterar un caso clínico si su estado es `locked`. Esto se impone tanto vía política de `UPDATE` como mediante un trigger `BEFORE UPDATE`.

### Privacidad de Business Intelligence
La tabla `opstar_center_business_metrics` posee una política absoluta restrictiva. Si `is_admin()` es falso, la tabla retorna vacío.
