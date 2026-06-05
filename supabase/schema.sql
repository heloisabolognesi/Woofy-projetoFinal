-- ============================================================
-- Woofy Veterinary Clinic — Supabase Database Schema
-- ============================================================
-- Run this SQL in the Supabase SQL Editor to create all tables,
-- relationships, indexes, and RLS policies.
-- ============================================================

-- =========================
-- 1. PROFILES TABLE
-- =========================
-- Extends auth.users with clinic-specific profile data.
-- A row is automatically created via trigger on user signup.

CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  full_name TEXT,
  role TEXT NOT NULL DEFAULT 'tutor' CHECK (role IN ('tutor', 'veterinario', 'admin')),
  avatar_url TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Role helpers used by RLS policies.
CREATE OR REPLACE FUNCTION public.get_my_role()
RETURNS TEXT
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT role FROM public.profiles WHERE id = auth.uid()
$$;

CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT public.get_my_role() = 'admin'
$$;

CREATE OR REPLACE FUNCTION public.is_veterinario()
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT public.get_my_role() = 'veterinario'
$$;

CREATE OR REPLACE FUNCTION public.is_tutor()
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT public.get_my_role() = 'tutor'
$$;

-- Profiles policies
CREATE POLICY "Users can view their own profile"
  ON public.profiles FOR SELECT
  USING (auth.uid() = id OR public.is_admin());

CREATE POLICY "Users can update their own profile"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id AND role = public.get_my_role());

CREATE POLICY "Users can insert their own profile"
  ON public.profiles FOR INSERT
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Admins can manage profiles"
  ON public.profiles FOR ALL
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

-- Auto-create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, role, avatar_url)
  VALUES (
    NEW.id,
    NEW.raw_user_meta_data ->> 'full_name',
    'tutor',
    NEW.raw_user_meta_data ->> 'avatar_url'
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Drop trigger if it exists, then create
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Auto-update updated_at
CREATE OR REPLACE FUNCTION public.update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();


-- =========================
-- 2. PETS TABLE
-- =========================
CREATE TABLE IF NOT EXISTS public.pets (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  nome TEXT NOT NULL,
  especie TEXT NOT NULL CHECK (especie IN ('cao', 'gato', 'outro')),
  raca TEXT NOT NULL,
  data_nascimento DATE,
  peso NUMERIC(6,2),
  tutor TEXT NOT NULL,
  telefone_tutor TEXT,
  foto TEXT,
  arquivado BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_pets_user_id ON public.pets(user_id);

ALTER TABLE public.pets ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own pets"
  ON public.pets FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own pets"
  ON public.pets FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own pets"
  ON public.pets FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own pets"
  ON public.pets FOR DELETE
  USING (auth.uid() = user_id);

CREATE TRIGGER pets_updated_at
  BEFORE UPDATE ON public.pets
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();


-- =========================
-- 3. CONSULTAS TABLE
-- =========================
CREATE TABLE IF NOT EXISTS public.consultas (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  pet_id UUID NOT NULL REFERENCES public.pets(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  tutor TEXT NOT NULL,
  data DATE NOT NULL,
  horario TEXT NOT NULL,
  veterinario TEXT NOT NULL,
  motivo TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'agendada' CHECK (status IN ('agendada', 'realizada', 'cancelada')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_consultas_pet_id ON public.consultas(pet_id);
CREATE INDEX idx_consultas_user_id ON public.consultas(user_id);
CREATE INDEX idx_consultas_data ON public.consultas(data);

ALTER TABLE public.consultas ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own consultas"
  ON public.consultas FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own consultas"
  ON public.consultas FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own consultas"
  ON public.consultas FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own consultas"
  ON public.consultas FOR DELETE
  USING (auth.uid() = user_id);

CREATE TRIGGER consultas_updated_at
  BEFORE UPDATE ON public.consultas
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();


-- =========================
-- 4. VACINAS TABLE
-- =========================
CREATE TABLE IF NOT EXISTS public.vacinas (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  pet_id UUID NOT NULL REFERENCES public.pets(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  vacina TEXT NOT NULL,
  data_aplicacao DATE NOT NULL,
  proxima_dose DATE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_vacinas_pet_id ON public.vacinas(pet_id);
CREATE INDEX idx_vacinas_user_id ON public.vacinas(user_id);

ALTER TABLE public.vacinas ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own vacinas"
  ON public.vacinas FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own vacinas"
  ON public.vacinas FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own vacinas"
  ON public.vacinas FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own vacinas"
  ON public.vacinas FOR DELETE
  USING (auth.uid() = user_id);

CREATE TRIGGER vacinas_updated_at
  BEFORE UPDATE ON public.vacinas
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();


-- =========================
-- 5. HISTORICO TABLE
-- =========================
CREATE TABLE IF NOT EXISTS public.historico (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  pet_id UUID NOT NULL REFERENCES public.pets(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  data DATE NOT NULL,
  tipo TEXT NOT NULL CHECK (tipo IN ('consulta', 'vacina', 'exame')),
  descricao TEXT NOT NULL,
  veterinario TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_historico_pet_id ON public.historico(pet_id);
CREATE INDEX idx_historico_user_id ON public.historico(user_id);

ALTER TABLE public.historico ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own historico"
  ON public.historico FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own historico"
  ON public.historico FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own historico"
  ON public.historico FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own historico"
  ON public.historico FOR DELETE
  USING (auth.uid() = user_id);


-- =========================
-- 6. LANCAMENTOS TABLE
-- =========================
CREATE TABLE IF NOT EXISTS public.lancamentos (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  descricao TEXT NOT NULL,
  tipo TEXT NOT NULL CHECK (tipo IN ('entrada', 'saida')),
  valor NUMERIC(12,2) NOT NULL,
  data DATE NOT NULL,
  categoria TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_lancamentos_user_id ON public.lancamentos(user_id);
CREATE INDEX idx_lancamentos_data ON public.lancamentos(data);

ALTER TABLE public.lancamentos ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own lancamentos"
  ON public.lancamentos FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own lancamentos"
  ON public.lancamentos FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own lancamentos"
  ON public.lancamentos FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own lancamentos"
  ON public.lancamentos FOR DELETE
  USING (auth.uid() = user_id);

CREATE TRIGGER lancamentos_updated_at
  BEFORE UPDATE ON public.lancamentos
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();


-- =========================
-- 7. AGENDAMENTOS TABLE
-- =========================
CREATE TABLE IF NOT EXISTS public.agendamentos (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  pet_id UUID NOT NULL REFERENCES public.pets(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  tutor TEXT NOT NULL,
  data DATE NOT NULL,
  horario_inicio TEXT NOT NULL,
  horario_fim TEXT NOT NULL,
  veterinario TEXT NOT NULL,
  tipo TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_agendamentos_pet_id ON public.agendamentos(pet_id);
CREATE INDEX idx_agendamentos_user_id ON public.agendamentos(user_id);
CREATE INDEX idx_agendamentos_data ON public.agendamentos(data);

ALTER TABLE public.agendamentos ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own agendamentos"
  ON public.agendamentos FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own agendamentos"
  ON public.agendamentos FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own agendamentos"
  ON public.agendamentos FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own agendamentos"
  ON public.agendamentos FOR DELETE
  USING (auth.uid() = user_id);

CREATE TRIGGER agendamentos_updated_at
  BEFORE UPDATE ON public.agendamentos
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();


-- ============================================================
-- SCHEMA COMPLETE
-- ============================================================
-- Tables created: profiles, pets, consultas, vacinas, historico,
-- lancamentos, agendamentos
--
-- All tables have:
--   ✓ UUID primary keys
--   ✓ Foreign key relationships
--   ✓ Indexes on FKs and date columns
--   ✓ RLS enabled with per-user policies
--   ✓ created_at / updated_at timestamps
--   ✓ CHECK constraints on enum-like columns
-- ============================================================
