# ABVL-01 — Seguimiento Sistemático de Presupuestos Pendientes

| Campo | Valor |
|---|---|
| **Biblioteca** | Atlas Business Value Library |
| **ID de documento** | ABVL-01 |
| **Versión** | 1.0 |
| **Responsable** | Por asignar — Estrategia de Producto, Vertical Dental |
| **Fecha de última actualización** | 2026-07-09 |
| **Nivel de confianza** | Borrador — pendiente de validación con clínicas piloto |
| **Prioridad de construcción** | 1 de 25 (ver [Índice Maestro](00_Master_Index.md)) |
| **Relación con otros documentos** | Desarrolla [DKB-PAC-01 §6](../dkb/03_Paciente/DKB-PAC-01_Recorrido_Paciente.md) (Presupuesto) como caso de negocio completo. Instancia los motores de [AIF-0001](../adr/0008-atlas-intelligence-framework.md) descritos en el campo 25 |

---

### 1. Identificador
`ABVL-01`

### 2. Nombre
Seguimiento Sistemático de Presupuestos Pendientes

### 3. Descripción
La detección y gestión activa, sistemática y oportuna de presupuestos ya emitidos que no han recibido respuesta del paciente — evitando que un tratamiento ya explicado, ya deseado, se pierda por simple ausencia de un proceso de seguimiento administrativo, no por una decisión real del paciente.

### 4. Problema que resuelve
En la gran mayoría de clínicas, la responsabilidad de hacer seguimiento de un presupuesto recae sobre personas ya sobrecargadas — el coordinador de tratamientos, recepción, o el propio dentista — sin un proceso sistemático detrás. El presupuesto se presenta; si el paciente no vuelve a contactar por iniciativa propia, se pierde en silencio, sin que nadie lo note, lo cuente, ni lo intente recuperar.

### 5. Impacto económico
**[HIPÓTESIS — validar con clínicas piloto]** De las 25 oportunidades de esta biblioteca, esta es la de mayor impacto económico potencial esperado — por el ticket medio alto de los tratamientos dentales, y porque el problema es sistemático (afecta, con distinta magnitud, a prácticamente el 100% de los presupuestos emitidos sin un proceso de seguimiento formal ya instaurado), no un evento puntual y aislado.

### 6. Coste de no actuar
Cada mes sin seguimiento sistemático representa, con alta probabilidad, ingreso que ya fue "convencido" en la conversación clínica y que se pierde por inacción administrativa posterior — un coste recurrente y compuesto mes a mes, no un evento único que se pueda resolver una sola vez.

### 7. Cómo detectarlo
Monitorización continua del estado de cada presupuesto emitido, comparando el tiempo transcurrido desde su emisión — sin respuesta explícita del paciente — contra la ventana de decisión típica observada para ese tipo de tratamiento y ese perfil de paciente.

### 8. Señales de entrada
Fecha de emisión del presupuesto, valor económico total y por fases, tipo de tratamiento asociado, canal de comunicación preferido del paciente, cualquier interacción posterior a la emisión (aunque no sea una respuesta formal).

### 9. Algoritmo conceptual
Para cada presupuesto activo: calcular los días transcurridos desde su emisión sin respuesta explícita del paciente. Cuando ese tiempo supera un umbral calibrado — por tipo de tratamiento y por el apetito de riesgo comercial declarado en el Business DNA de la clínica — generar un candidato de seguimiento. Priorizar los candidatos resultantes por el producto de su valor económico y una probabilidad de cierre estimada, calculada a partir de patrones históricos reales de cierre tras seguimiento en esa misma clínica.

### 10. Reglas de negocio
- El primer contacto de seguimiento nunca ocurre antes de un intervalo mínimo tras la emisión, para no parecer apresurado.
- El número máximo y la cadencia de los intentos de seguimiento son configurables y respetan el tono declarado en el Business DNA de la clínica.
- Un presupuesto marcado explícitamente como "rechazado" por el paciente nunca vuelve a recibir seguimiento automático.
- Un presupuesto con condiciones caducadas se marca como tal antes de cualquier nuevo contacto, nunca se ofrece silenciosamente una condición ya vencida.

### 11. Automatizaciones posibles
Recordatorio automático de seguimiento en la cadencia calibrada. Resolución de dudas frecuentes sobre el presupuesto (financiación, plazos, fases) citadas directamente desde el Brain. Escalado a un humano en cuanto el paciente plantea una objeción o duda que excede el conocimiento general disponible.

### 12. Intervención humana necesaria
El primer envío del presupuesto en sí siempre requiere aprobación humana explícita — línea roja general del vertical (ver [DKB-EMP-01](../dkb/01_Empresa/DKB-EMP-01_Modelos_Clinica.md)). Cualquier negociación de condiciones económicas fuera de lo ya predefinido. Cualquier objeción del paciente que no se resuelva con el conocimiento general disponible.

### 13. KPIs
Tasa de cierre de presupuestos. Tiempo medio hasta la decisión del paciente. Proporción de presupuestos con seguimiento activo frente a presupuestos sin ningún seguimiento.

### 14. ROI esperado
**[HIPÓTESIS — validar con clínicas piloto]** Valor recuperado igual a la suma de los presupuestos que se cierran gracias a un seguimiento que, de otro modo, no habría ocurrido — medido con la disciplina de atribución conservadora del ROI Engine ([AIF-0001 §6.5](../adr/0008-atlas-intelligence-framework.md)): solo se cuenta cuando existe una marca de comportamiento observable (presupuesto sin respuesta → contacto de seguimiento → cierre posterior a ese contacto).

### 15. Complejidad de implantación
Baja. No requiere integraciones complejas — solo acceso al estado de los presupuestos ya emitidos en el sistema de gestión clínica de la clínica.

### 16. Prioridad
**MVP** — máxima prioridad de toda la biblioteca.

### 17. Riesgos
Un seguimiento demasiado insistente puede percibirse como presión comercial no deseada, dañando la relación con el paciente en vez de recuperar el ingreso. La calibración de cadencia y tono es crítica y debe gobernarse siempre por el Business DNA de la clínica, nunca por un valor agresivo por defecto.

### 18. Casos de uso
Un presupuesto de ortodoncia sin respuesta a las dos semanas recibe un mensaje de seguimiento que resuelve una duda de financiación pendiente, y cierra en los días siguientes. Un presupuesto de bajo valor sin respuesta al mes recibe un único recordatorio final, cortés, antes de archivarse como inactivo — sin insistencia adicional.

### 19. Cómo venderlo al gerente
> "Cada mes hay presupuestos que tu equipo ya convenció clínicamente, pero que se pierden por simple falta de tiempo para hacer seguimiento. Esto recupera ese ingreso sin contratar a nadie más — y tú sigues aprobando el primer envío de cada presupuesto, así que nunca pierdes el control sobre lo que sale de tu clínica."

### 20. Cómo explicarlo a la recepcionista o coordinador de tratamientos
> "No sustituye tu trabajo de seguimiento — hace el seguimiento rutinario y repetitivo por ti, y te avisa solo cuando un paciente tiene una duda real que tú debes resolver. Tú sigues siendo quien cierra las conversaciones que de verdad importan."

### 21. Cómo medir el éxito
Comparar la tasa de cierre de presupuestos de los meses con seguimiento sistemático activo frente al histórico previo de la misma clínica — nunca contra una cifra de mercado genérica o una media de sector no verificada.

### 22. Relación con Company Brain
Consulta el `KnowledgeDomain` de "Precios y Presupuestos" (a desarrollar en `DKB-FIN-01`, pendiente) para resolver dudas de condiciones citadas durante el seguimiento, siempre con cita exacta a la fuente.

### 23. Relación con Business DNA
La cadencia, el número de intentos y el tono del seguimiento se calibran directamente por el `DNAToneProfile` y el apetito de riesgo comercial declarado del cliente ([PVD-0003 §1](../pvd/0003-business-dna.md)).

### 24. Relación con Decision Engine
El primer envío de cualquier presupuesto pasa siempre por el estado `APPROVAL_REQUIRED` ([ADR-0005 §4.4](../adr/0005-decision-engine-validation-engine.md)). El seguimiento posterior, una vez el proceso está autorizado por la clínica, opera bajo `ACTION_AUTHORIZED` dentro de los límites ya aprobados — sin necesidad de aprobación individual en cada recordatorio.

### 25. Relación con Atlas Intelligence Framework
El **Opportunity Engine** detecta cada presupuesto candidato a seguimiento. El **Priority Engine** lo ordena junto al resto de señales activas de la clínica. El **Recommendation Engine** propone la acción concreta de contacto. El **ROI Engine** mide el valor recuperado con la disciplina de atribución conservadora ya descrita. El **Confidence Engine** pondera la probabilidad de cierre de cada candidato. El **Learning Engine** calibra, con el tiempo y la evidencia real acumulada, la cadencia óptima de seguimiento para esa clínica concreta.
