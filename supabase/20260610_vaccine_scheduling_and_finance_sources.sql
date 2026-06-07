BEGIN;

ALTER TABLE public.vacinas
  ADD COLUMN IF NOT EXISTS status TEXT NOT NULL DEFAULT 'recommended',
  ADD COLUMN IF NOT EXISTS data_recomendada DATE NOT NULL DEFAULT CURRENT_DATE,
  ADD COLUMN IF NOT EXISTS data_agendada DATE,
  ADD COLUMN IF NOT EXISTS horario_agendado TIME;

ALTER TABLE public.vacinas
  ALTER COLUMN data_aplicacao DROP NOT NULL;

ALTER TABLE public.vacinas
  DROP CONSTRAINT IF EXISTS vacinas_status_check;

ALTER TABLE public.vacinas
  ADD CONSTRAINT vacinas_status_check
  CHECK (status IN ('recommended', 'scheduled', 'applied', 'cancelled'));

CREATE INDEX IF NOT EXISTS idx_vacinas_status
  ON public.vacinas(status);

CREATE INDEX IF NOT EXISTS idx_vacinas_data_agendada
  ON public.vacinas(data_agendada);

ALTER TABLE public.lancamentos
  ADD COLUMN IF NOT EXISTS origem_tipo TEXT,
  ADD COLUMN IF NOT EXISTS origem_id UUID,
  ADD COLUMN IF NOT EXISTS status TEXT NOT NULL DEFAULT 'active';

ALTER TABLE public.lancamentos
  DROP CONSTRAINT IF EXISTS lancamentos_status_check;

ALTER TABLE public.lancamentos
  ADD CONSTRAINT lancamentos_status_check
  CHECK (status IN ('active', 'cancelled'));

ALTER TABLE public.lancamentos
  DROP CONSTRAINT IF EXISTS lancamentos_origem_tipo_check;

ALTER TABLE public.lancamentos
  ADD CONSTRAINT lancamentos_origem_tipo_check
  CHECK (
    origem_tipo IS NULL
    OR origem_tipo IN ('appointment', 'vaccine', 'manual')
  );

CREATE UNIQUE INDEX IF NOT EXISTS lancamentos_unique_origem
  ON public.lancamentos(origem_tipo, origem_id)
  WHERE origem_tipo IS NOT NULL AND origem_id IS NOT NULL;

CREATE INDEX IF NOT EXISTS idx_lancamentos_status
  ON public.lancamentos(status);

DROP POLICY IF EXISTS "Tutors can view own service lancamentos" ON public.lancamentos;

CREATE POLICY "Tutors can view own service lancamentos"
  ON public.lancamentos FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Tutors can create own service lancamentos" ON public.lancamentos;

CREATE POLICY "Tutors can create own service lancamentos"
  ON public.lancamentos FOR INSERT
  TO authenticated
  WITH CHECK (
    auth.uid() = user_id
    AND tipo = 'entrada'
    AND status = 'active'
    AND origem_tipo IN ('appointment', 'vaccine')
    AND categoria IN ('Consultas', 'Vacinas')
  );

DROP POLICY IF EXISTS "Tutors can update own service lancamentos" ON public.lancamentos;

CREATE POLICY "Tutors can update own service lancamentos"
  ON public.lancamentos FOR UPDATE
  TO authenticated
  USING (
    auth.uid() = user_id
    AND origem_tipo IN ('appointment', 'vaccine')
  )
  WITH CHECK (
    auth.uid() = user_id
    AND tipo = 'entrada'
    AND status = 'active'
    AND origem_tipo IN ('appointment', 'vaccine')
    AND categoria IN ('Consultas', 'Vacinas')
  );

DROP POLICY IF EXISTS "Tutors can schedule own vaccines" ON public.vacinas;

CREATE POLICY "Tutors can schedule own vaccines"
  ON public.vacinas FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (
    auth.uid() = user_id
    AND status IN ('recommended', 'scheduled', 'applied', 'cancelled')
  );

COMMIT;
