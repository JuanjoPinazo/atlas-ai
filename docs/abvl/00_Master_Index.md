# Atlas Business Value Library — Índice Maestro

| Campo | Valor |
|---|---|
| **Biblioteca** | Atlas Business Value Library (ABVL) |
| **ID de documento** | ABVL-IDX-00 |
| **Versión** | 1.0 |
| **Responsable** | Por asignar — Estrategia de Producto, Vertical Dental |
| **Fecha de última actualización** | 2026-07-09 |
| **Nivel de confianza** | Estructural — cataloga oportunidades, no valida su impacto |
| **Relación con otros documentos** | Se apoya en [DKB-PAC-01](../dkb/03_Paciente/DKB-PAC-01_Recorrido_Paciente.md), [DKB-EMP-01](../dkb/01_Empresa/DKB-EMP-01_Modelos_Clinica.md) y [AIF-0001](../adr/0008-atlas-intelligence-framework.md) |

---

## Qué es esta biblioteca

La Atlas Business Value Library documenta, con disciplina de consultoría estratégica, **todos los problemas económicos, operativos y comerciales que ATLAS AI puede detectar y resolver en una clínica dental**. Cada documento de esta biblioteca es una **Business Value Opportunity (BVO)** — una unidad de valor de negocio concreta, autocontenida, con su propio caso de negocio completo.

Esta biblioteca no describe procesos (eso ya lo hace la Atlas Dental Knowledge Library) ni arquitectura de razonamiento (eso ya lo hace [AIF-0001](../adr/0008-atlas-intelligence-framework.md)) — **traduce ambas cosas en argumentos económicos concretos**: cuánto vale cada oportunidad, cómo se detecta, cómo se automatiza, cómo se vende y cómo se mide.

### Relación con las demás bibliotecas

```
DKB (Atlas Dental Knowledge Library)     AIF-0001 (Atlas Intelligence Framework)
   "cómo funciona la clínica"                "cómo piensa ATLAS"
              │                                        │
              └───────────────┬────────────────────────┘
                               ▼
              ABVL (Atlas Business Value Library)
              "qué vale cada oportunidad, y cómo se captura"
```

Cada BVO es, en la práctica, una instanciación concreta de una composición de motores de AIF-0001 (típicamente Opportunity Engine → Priority Engine → Recommendation Engine → ROI Engine → Confidence Engine → Learning Engine) aplicada a un proceso ya documentado en la biblioteca dental.

### Convención de trazabilidad

Idéntica a la del resto del programa dental: **[HIPÓTESIS — validar con clínicas piloto]** marca cualquier estimación de impacto o ROI. Ninguna cifra económica de esta biblioteca es un dato real todavía — no se inventa ninguna estadística ni magnitud concreta.

---

## Esquema de cada documento BVO

Todo documento de esta biblioteca sigue el mismo esquema de 25 campos, sin excepción: Identificador, Nombre, Descripción, Problema que resuelve, Impacto económico, Coste de no actuar, Cómo detectarlo, Señales de entrada, Algoritmo conceptual, Reglas de negocio, Automatizaciones posibles, Intervención humana necesaria, KPIs, ROI esperado, Complejidad de implantación, Prioridad, Riesgos, Casos de uso, Cómo venderlo al gerente, Cómo explicarlo a la recepcionista, Cómo medir el éxito, Relación con Company Brain, Relación con Business DNA, Relación con Decision Engine, Relación con Atlas Intelligence Framework.

---

## Catálogo de las 25 Business Value Opportunities

Ordenadas por impacto económico estimado — **[HIPÓTESIS — validar con clínicas piloto]**, esta priorización es un punto de partida de consultoría experta, no un ranking confirmado con datos reales.

| # | ID | Nombre | Categoría | Estado |
|---|---|---|---|---|
| 1 | [ABVL-01](ABVL-01_Seguimiento_Presupuestos_Pendientes.md) | Seguimiento sistemático de presupuestos pendientes | Fuga de ingresos | ✅ Construido |
| 2 | ABVL-02 | Recuperación de revisiones periódicas no agendadas (recall) | Fuga de ingresos recurrente | Pendiente |
| 3 | ABVL-03 | Reducción de inasistencias (no-shows) | Pérdida de capacidad | Pendiente |
| 4 | ABVL-04 | Recuperación de llamadas perdidas y contacto fuera de horario | Fuga de captación | Pendiente |
| 5 | ABVL-05 | Aprovechamiento de huecos de agenda por cancelación | Pérdida de capacidad | Pendiente |
| 6 | ABVL-06 | Reactivación de pacientes inactivos | Coste de adquisición | Pendiente |
| 7 | ABVL-07 | Reducción de fricción en el proceso de financiación | Fuga de ingresos | Pendiente |
| 8 | ABVL-08 | Atribución de origen y optimización del gasto de marketing | Eficiencia comercial | Pendiente |
| 9 | ABVL-09 | Gestión proactiva de reputación y reseñas | Captación de bajo coste | Pendiente |
| 10 | ABVL-10 | Liberación de tiempo administrativo del propietario/dentista | Coste de oportunidad | Pendiente |
| 11 | ABVL-11 | Programa sistemático de recomendación de pacientes | Coste de adquisición | Pendiente |
| 12 | ABVL-12 | Consolidación de presupuestos multi-especialidad | Ticket medio | Pendiente |
| 13 | ABVL-13 | Reducción del tiempo de primera respuesta | Conversión de captación | Pendiente |
| 14 | ABVL-14 | Detección temprana de fuga silenciosa de pacientes | Retención | Pendiente |
| 15 | ABVL-15 | Coordinación de laboratorio para evitar citas reprogramadas | Eficiencia operativa | Pendiente |
| 16 | ABVL-16 | Detección de candidatos a tratamiento adicional (bajo criterio clínico) | Ticket medio | Pendiente |
| 17 | ABVL-17 | Gestión de impagos y cuotas de financiación propia vencidas | Fuga de ingresos | Pendiente |
| 18 | ABVL-18 | Estandarización del guion de recepción entre el equipo | Conversión de captación | Pendiente |
| 19 | ABVL-19 | Coordinación de derivación interna entre especialistas | Retención / ticket medio | Pendiente |
| 20 | ABVL-20 | Reducción de cancelaciones de última hora | Pérdida de capacidad | Pendiente |
| 21 | ABVL-21 | Fidelización familiar y multigeneracional | LTV de paciente | Pendiente |
| 22 | ABVL-22 | Optimización de campañas de captación con medición real | Eficiencia comercial | Pendiente |
| 23 | ABVL-23 | Prevención de rotura de stock que cancela tratamientos | Eficiencia operativa | Pendiente |
| 24 | ABVL-24 | Benchmarking de red para detectar desviaciones de rendimiento | Inteligencia comparativa | Pendiente |
| 25 | ABVL-25 | Optimización de ocupación de sillón por profesional | Productividad | Pendiente |

**[RECOMENDACIÓN]** Las primeras 9 oportunidades de este catálogo (fuga de ingresos, pérdida de capacidad y captación) concentran, con alta probabilidad, la mayor parte del valor económico total capturable — candidatas naturales para validación con clínicas piloto antes que el resto del catálogo.
