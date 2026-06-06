-- Woofy shared clinic data relationships
-- Run this after 20260605_role_based_foundation.sql.

BEGIN;

ALTER TABLE public.agendamentos
  ADD COLUMN IF NOT EXISTS status TEXT NOT NULL DEFAULT 'agendado'
    CHECK (status IN ('agendado', 'confirmado', 'realizado', 'cancelado')),
  ADD COLUMN IF NOT EXISTS veterinario_id UUID REFERENCES public.profiles(id);

ALTER TABLE public.consultas
  ADD COLUMN IF NOT EXISTS agendamento_id UUID REFERENCES public.agendamentos(id) ON DELETE SET NULL,
  ADD COLUMN IF NOT EXISTS veterinario_id UUID REFERENCES public.profiles(id);

ALTER TABLE public.historico
  ADD COLUMN IF NOT EXISTS consulta_id UUID REFERENCES public.consultas(id) ON DELETE SET NULL;

ALTER TABLE public.vacinas
  ADD COLUMN IF NOT EXISTS veterinario_id UUID REFERENCES public.profiles(id);

CREATE INDEX IF NOT EXISTS idx_agendamentos_status ON public.agendamentos(status);
CREATE INDEX IF NOT EXISTS idx_agendamentos_veterinario_id ON public.agendamentos(veterinario_id);
CREATE INDEX IF NOT EXISTS idx_consultas_agendamento_id ON public.consultas(agendamento_id);
CREATE INDEX IF NOT EXISTS idx_consultas_veterinario_id ON public.consultas(veterinario_id);
CREATE INDEX IF NOT EXISTS idx_historico_consulta_id ON public.historico(consulta_id);
CREATE INDEX IF NOT EXISTS idx_vacinas_veterinario_id ON public.vacinas(veterinario_id);

DROP POLICY IF EXISTS "Admins can create pets" ON public.pets;
DROP POLICY IF EXISTS "Admins can update pets" ON public.pets;

CREATE POLICY "Admins can create pets"
  ON public.pets FOR INSERT
  WITH CHECK (public.is_admin());

CREATE POLICY "Admins can update pets"
  ON public.pets FOR UPDATE
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

DROP POLICY IF EXISTS "Admins can create agendamentos" ON public.agendamentos;

CREATE POLICY "Admins can create agendamentos"
  ON public.agendamentos FOR INSERT
  WITH CHECK (
    public.is_admin()
    AND EXISTS (
      SELECT 1
      FROM public.pets p
      WHERE p.id = agendamentos.pet_id
        AND p.user_id = agendamentos.user_id
    )
  );

DROP POLICY IF EXISTS "Tutors can create their own consultas" ON public.consultas;
DROP POLICY IF EXISTS "Veterinarians and admins can create consultas" ON public.consultas;

CREATE POLICY "Veterinarians and admins can create consultas"
  ON public.consultas FOR INSERT
  WITH CHECK (
    public.is_veterinario()
    OR public.is_admin()
  );

DROP POLICY IF EXISTS "Veterinarians can update assigned agendamentos" ON public.agendamentos;

CREATE POLICY "Veterinarians can update assigned agendamentos"
  ON public.agendamentos FOR UPDATE
  USING (
    public.is_veterinario()
    AND (
      veterinario_id IS NULL
      OR veterinario_id = auth.uid()
    )
  )
  WITH CHECK (
    public.is_veterinario()
    AND (
      veterinario_id IS NULL
      OR veterinario_id = auth.uid()
    )
  );

COMMIT;
