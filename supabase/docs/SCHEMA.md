# Diccionario de Datos: OPSTAR-AI Levante Registry

Este documento describe la estructura fundamental del esquema de base de datos para la reconstrucción del registro clínico OPSTAR.

## 1. Entidades Principales

### `hospitals`
Almacena los centros participantes en el registro multicéntrico.
- **Campos clave:** `center_type` (academic, private, public_general, demo).
- **Relaciones:** Centro de gravedad para `profiles`, `operators` y `ecrf_opstar_records`.

### `profiles`
Extensión de `auth.users` que añade metadata del perfil.
- **Campos clave:** `role` (admin, hospital_user, monitor, viewer).

### `operators` & `hospital_operators`
Médicos intervencionistas que realizan los procedimientos de zero-contrast.
Un operador puede estar asociado a varios hospitales simultáneamente a través de `hospital_operators`.

### `opstar_investigators`
Roles de investigación clínica asociados al estudio por centro.

## 2. Registro Clínico

### `ecrf_opstar_records` (Zero-Contrast)
Es la tabla core del registro. Ha sido diseñada eliminando las dependencias legacy (FFR-OCT) centrándose exclusivamente en el flujo de Lavado de Suero.
- **Demografía anónima:** `patient_code`, `local_nhc`, `anonymous_code`.
- **Protocolo de Contraste:** Registra el volumen de contraste, tamaño de jeringa, velocidad de pullback y calidad del lavado (`wash_quality`).
- **Hallazgos OCT (Ultreon):** Detección de calcio, EEL, mediciones proximal/distal y MLA.
- **Intervención:** `ultreon_modified_strategy` y tipo de cambio de estrategia.
- **Seguridad:** Protegida con `case_status` para bloquear edición.

### `opstar_oct_evidence`
Vincula medios audiovisuales (videos, reportes PDF) a un caso. Los archivos reales residen en Storage.

## 3. Business Intelligence y Gobernanza

### `opstar_center_business_metrics`
Tabla exclusiva para `admin` que calcula el ROI y ahorros mensuales por hospital en el uso de OCT vs. estrategias convencionales.

### `opstar_center_objectives`
Métricas de captación (casos esperados) por rango de fechas y hospital.

## 4. Enums Personalizados
Para garantizar integridad de los datos a nivel de motor de BBDD:
- `user_role`
- `case_status`
- `wash_quality`
- `strategy_change_type`
- `evidence_type`
