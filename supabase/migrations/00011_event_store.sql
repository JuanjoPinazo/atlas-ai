-- ADR-0014: Event Store and Idempotent ROI Rules

-- Añadimos las restricciones completas al Event Store si no estaban,
-- garantizando que cumpla ADR-0012 y ADR-0014.

-- 1. Modificar platform_events si ya existía para asegurar strictness
ALTER TABLE platform_events
ADD COLUMN IF NOT EXISTS event_id TEXT UNIQUE,
ADD COLUMN IF NOT EXISTS event_version TEXT NOT NULL DEFAULT '1.0',
ADD COLUMN IF NOT EXISTS causation_id TEXT;

-- Si había platform_events antiguos sin event_id, asignamos un uuid por defecto temporal
UPDATE platform_events SET event_id = gen_random_uuid()::text WHERE event_id IS NULL;

ALTER TABLE platform_events
ALTER COLUMN event_id SET NOT NULL;

-- Aseguramos idempotency en event_id e idempotency_key
CREATE UNIQUE INDEX IF NOT EXISTS idx_platform_events_event_id ON platform_events(event_id);
-- El UNIQUE idempotency_key ya existía en la migración 00010

-- Índices B-TREE para queries frecuentes
CREATE INDEX IF NOT EXISTS idx_platform_events_correlation ON platform_events(correlation_id);
CREATE INDEX IF NOT EXISTS idx_platform_events_organization ON platform_events(organization_id);

-- 2. Transacción de ROI Idempotente
-- Función RPC para calcular ROI de forma atómica.
-- Requiere que el budget_id tenga un seguimiento previo, y que no exista ya ROI atribuido.

CREATE OR REPLACE FUNCTION attribute_roi_idempotent(
  p_event_id TEXT,
  p_organization_id UUID,
  p_budget_id TEXT,
  p_amount NUMERIC
)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_has_follow_up BOOLEAN;
  v_roi_exists BOOLEAN;
BEGIN
  -- Verificar que el presupuesto tuvo seguimiento
  SELECT EXISTS (
    SELECT 1 FROM platform_events
    WHERE correlation_id = p_budget_id
      AND organization_id = p_organization_id
      AND event_type = 'BudgetFollowUpDue'
  ) INTO v_has_follow_up;

  -- Si no hubo seguimiento, no es ROI de Atlas.
  IF NOT v_has_follow_up THEN
    RETURN FALSE;
  END IF;

  -- Verificar si el ROI ya existe (Idempotencia)
  SELECT EXISTS (
    SELECT 1 FROM roi_events
    WHERE event_id = p_event_id
  ) INTO v_roi_exists;

  IF v_roi_exists THEN
    -- Ya se atribuyó. Se ignora (Idempotencia exitosa sin duplicar).
    RETURN TRUE;
  END IF;

  -- Realizar la inserción
  INSERT INTO roi_events (event_id, type, value, organization_id)
  VALUES (p_event_id, 'ABVL-01', p_amount, p_organization_id);

  RETURN TRUE;
END;
$$;
