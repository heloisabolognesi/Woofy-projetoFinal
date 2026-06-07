BEGIN;

-- Tutors and admins need a narrow public directory of approved veterinarians
-- to assign appointments without exposing pending/rejected users in the app.
DROP POLICY IF EXISTS "Approved veterinarians are visible for appointment selection" ON public.profiles;

CREATE POLICY "Approved veterinarians are visible for appointment selection"
  ON public.profiles FOR SELECT
  USING (
    auth.uid() IS NOT NULL
    AND role = 'veterinario'
    AND approval_status = 'approved'
  );

-- Keep veterinarian workflows able to resolve tutor names for appointments they
-- can already see through agendamentos RLS.
DROP POLICY IF EXISTS "Veterinarians can view appointment tutor profiles" ON public.profiles;

CREATE POLICY "Veterinarians can view appointment tutor profiles"
  ON public.profiles FOR SELECT
  USING (
    public.is_veterinario()
    AND EXISTS (
      SELECT 1
      FROM public.agendamentos a
      WHERE a.user_id = profiles.id
        AND (
          a.veterinario_id IS NULL
          OR a.veterinario_id = auth.uid()
        )
    )
  );

ALTER TABLE public.agendamentos
  ADD COLUMN IF NOT EXISTS tutor_archived_at TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS preco_estimado NUMERIC(12,2);

ALTER TABLE public.consultas
  ADD COLUMN IF NOT EXISTS valor NUMERIC(12,2);

ALTER TABLE public.vacinas
  ADD COLUMN IF NOT EXISTS valor NUMERIC(12,2);

CREATE INDEX IF NOT EXISTS idx_agendamentos_tutor_archived_at
  ON public.agendamentos(tutor_archived_at);

UPDATE public.agendamentos
SET preco_estimado = CASE
  WHEN lower(tipo) LIKE '%vacina%' THEN 95
  ELSE 180
END
WHERE preco_estimado IS NULL;

UPDATE public.consultas
SET valor = 180
WHERE valor IS NULL;

UPDATE public.vacinas
SET valor = 95
WHERE valor IS NULL;

-- Avoid duplicate clinical consultations for the same appointment at the
-- database level as well as in the application helper.
CREATE UNIQUE INDEX IF NOT EXISTS consultas_one_per_agendamento
  ON public.consultas(agendamento_id)
  WHERE agendamento_id IS NOT NULL;

-- Allow pet history entries to be tied to an appointment even when no feedback
-- consultation row was created.
ALTER TABLE public.historico
  ADD COLUMN IF NOT EXISTS agendamento_id UUID REFERENCES public.agendamentos(id) ON DELETE SET NULL;

CREATE INDEX IF NOT EXISTS idx_historico_agendamento_id
  ON public.historico(agendamento_id);

CREATE UNIQUE INDEX IF NOT EXISTS historico_one_per_agendamento
  ON public.historico(agendamento_id)
  WHERE agendamento_id IS NOT NULL;

DROP POLICY IF EXISTS "Tutors can view their own vacinas" ON public.vacinas;
DROP POLICY IF EXISTS "Users can view their own vacinas" ON public.vacinas;
DROP POLICY IF EXISTS "Users can create their own vacinas" ON public.vacinas;
DROP POLICY IF EXISTS "Users can update their own vacinas" ON public.vacinas;
DROP POLICY IF EXISTS "Users can delete their own vacinas" ON public.vacinas;
DROP POLICY IF EXISTS "Tutors admins and veterinarians can view relevant vacinas" ON public.vacinas;
DROP POLICY IF EXISTS "Veterinarians and admins can create vacinas" ON public.vacinas;
DROP POLICY IF EXISTS "Veterinarians and admins can update vacinas" ON public.vacinas;
DROP POLICY IF EXISTS "Veterinarians can update own vacinas and admins can update all" ON public.vacinas;
DROP POLICY IF EXISTS "Admins can delete vacinas" ON public.vacinas;

CREATE POLICY "Tutors admins and veterinarians can view relevant vacinas"
  ON public.vacinas FOR SELECT
  USING (
    auth.uid() = user_id
    OR public.is_admin()
    OR (
      public.is_veterinario()
      AND (
        veterinario_id = auth.uid()
        OR EXISTS (
          SELECT 1
          FROM public.agendamentos a
          WHERE a.pet_id = vacinas.pet_id
            AND (
              a.veterinario_id IS NULL
              OR a.veterinario_id = auth.uid()
            )
        )
      )
    )
  );

CREATE POLICY "Veterinarians and admins can create vacinas"
  ON public.vacinas FOR INSERT
  WITH CHECK (
    public.is_admin()
    OR (
      public.is_veterinario()
      AND veterinario_id = auth.uid()
      AND EXISTS (
        SELECT 1
        FROM public.pets p
        WHERE p.id = vacinas.pet_id
          AND p.user_id = vacinas.user_id
      )
      AND EXISTS (
        SELECT 1
        FROM public.agendamentos a
        WHERE a.pet_id = vacinas.pet_id
          AND (
            a.veterinario_id IS NULL
            OR a.veterinario_id = auth.uid()
          )
      )
    )
  );

CREATE POLICY "Veterinarians can update own vacinas and admins can update all"
  ON public.vacinas FOR UPDATE
  USING (public.is_admin() OR (public.is_veterinario() AND veterinario_id = auth.uid()))
  WITH CHECK (public.is_admin() OR (public.is_veterinario() AND veterinario_id = auth.uid()));

CREATE POLICY "Admins can delete vacinas"
  ON public.vacinas FOR DELETE
  USING (public.is_admin());

COMMIT;
