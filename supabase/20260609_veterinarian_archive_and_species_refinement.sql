BEGIN;

ALTER TABLE public.agendamentos
  ADD COLUMN IF NOT EXISTS veterinario_archived_at TIMESTAMPTZ;

CREATE INDEX IF NOT EXISTS idx_agendamentos_veterinario_archived_at
  ON public.agendamentos(veterinario_archived_at);

DROP POLICY IF EXISTS "Tutors can view their own agendamentos" ON public.agendamentos;

CREATE POLICY "Tutors admins and assigned veterinarians can view agendamentos"
  ON public.agendamentos FOR SELECT
  USING (
    auth.uid() = user_id
    OR public.is_admin()
    OR (
      public.is_veterinario()
      AND veterinario_id = auth.uid()
    )
  );

ALTER TABLE public.pets
  DROP CONSTRAINT IF EXISTS pets_especie_check;

ALTER TABLE public.pets
  ADD CONSTRAINT pets_especie_check
  CHECK (especie IN ('cao', 'gato', 'aves', 'roedores', 'coelhos', 'outro'));

DROP POLICY IF EXISTS "Veterinarians can view appointment pets" ON public.pets;

CREATE POLICY "Veterinarians can view assigned appointment pets"
  ON public.pets FOR SELECT
  USING (
    public.is_veterinario()
    AND EXISTS (
      SELECT 1
      FROM public.agendamentos a
      WHERE a.pet_id = pets.id
        AND a.veterinario_id = auth.uid()
    )
  );

DROP POLICY IF EXISTS "Veterinarians can update assigned agendamentos" ON public.agendamentos;

CREATE POLICY "Veterinarians can update assigned agendamentos"
  ON public.agendamentos FOR UPDATE
  USING (
    public.is_veterinario()
    AND veterinario_id = auth.uid()
  )
  WITH CHECK (
    public.is_veterinario()
    AND veterinario_id = auth.uid()
  );

COMMIT;
