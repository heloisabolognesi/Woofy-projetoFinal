BEGIN;

ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS crmv TEXT;

CREATE TABLE IF NOT EXISTS public.servicos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nome TEXT NOT NULL,
  tipo TEXT NOT NULL,
  preco NUMERIC(10,2) NOT NULL DEFAULT 0,
  ativo BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE public.servicos
  DROP CONSTRAINT IF EXISTS servicos_tipo_check;

ALTER TABLE public.servicos
  ADD CONSTRAINT servicos_tipo_check
  CHECK (tipo IN ('consulta', 'vacina', 'exame', 'procedimento', 'outro'));

ALTER TABLE public.agendamentos
  ADD COLUMN IF NOT EXISTS tutor_archived_at TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS servico_id UUID REFERENCES public.servicos(id),
  ADD COLUMN IF NOT EXISTS preco_estimado NUMERIC(10,2),
  ADD COLUMN IF NOT EXISTS valor_estimado NUMERIC(10,2);

ALTER TABLE public.consultas
  ADD COLUMN IF NOT EXISTS valor NUMERIC(10,2);

ALTER TABLE public.vacinas
  ADD COLUMN IF NOT EXISTS servico_id UUID REFERENCES public.servicos(id),
  ADD COLUMN IF NOT EXISTS valor NUMERIC(10,2);

ALTER TABLE public.historico
  ADD COLUMN IF NOT EXISTS agendamento_id UUID REFERENCES public.agendamentos(id);

CREATE INDEX IF NOT EXISTS idx_agendamentos_tutor_archived_at
  ON public.agendamentos(tutor_archived_at);

CREATE INDEX IF NOT EXISTS idx_agendamentos_servico_id
  ON public.agendamentos(servico_id);

CREATE INDEX IF NOT EXISTS idx_vacinas_servico_id
  ON public.vacinas(servico_id);

CREATE INDEX IF NOT EXISTS idx_historico_agendamento_id
  ON public.historico(agendamento_id);

CREATE UNIQUE INDEX IF NOT EXISTS consultas_one_per_agendamento
  ON public.consultas(agendamento_id)
  WHERE agendamento_id IS NOT NULL;

CREATE UNIQUE INDEX IF NOT EXISTS historico_one_per_agendamento
  ON public.historico(agendamento_id)
  WHERE agendamento_id IS NOT NULL;

INSERT INTO public.servicos (nome, tipo, preco, ativo)
SELECT 'Consulta Veterinária', 'consulta', 120.00, TRUE
WHERE NOT EXISTS (
  SELECT 1 FROM public.servicos WHERE nome = 'Consulta Veterinária'
);

INSERT INTO public.servicos (nome, tipo, preco, ativo)
SELECT 'Vacina V10', 'vacina', 90.00, TRUE
WHERE NOT EXISTS (
  SELECT 1 FROM public.servicos WHERE nome = 'Vacina V10'
);

INSERT INTO public.servicos (nome, tipo, preco, ativo)
SELECT 'Vacina Antirrábica', 'vacina', 70.00, TRUE
WHERE NOT EXISTS (
  SELECT 1 FROM public.servicos WHERE nome = 'Vacina Antirrábica'
);

UPDATE public.agendamentos
SET preco_estimado = CASE
  WHEN lower(tipo) LIKE '%vacina%' THEN 90
  ELSE 120
END
WHERE preco_estimado IS NULL;

UPDATE public.agendamentos
SET valor_estimado = preco_estimado
WHERE valor_estimado IS NULL;

UPDATE public.consultas
SET valor = 120
WHERE valor IS NULL;

UPDATE public.vacinas
SET valor = CASE
  WHEN lower(vacina) LIKE '%antirr%' OR lower(vacina) LIKE '%anti-r%' THEN 70
  WHEN lower(vacina) LIKE '%v10%' THEN 90
  ELSE 90
END
WHERE valor IS NULL;

ALTER TABLE public.servicos ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can read active services" ON public.servicos;

CREATE POLICY "Users can read active services"
  ON public.servicos
  FOR SELECT
  TO authenticated
  USING (
    ativo = TRUE
    OR public.is_admin()
  );

DROP POLICY IF EXISTS "Admins can manage services" ON public.servicos;

CREATE POLICY "Admins can manage services"
  ON public.servicos
  FOR ALL
  TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

COMMIT;
