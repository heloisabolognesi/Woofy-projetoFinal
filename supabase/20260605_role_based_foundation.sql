-- Woofy role-based foundation migration
-- Run this in Supabase SQL Editor for an existing project.

BEGIN;

UPDATE public.profiles
SET role = 'tutor'
WHERE role IS NULL OR role = 'clinic_staff';

ALTER TABLE public.profiles
  ALTER COLUMN role SET DEFAULT 'tutor';

ALTER TABLE public.profiles
  DROP CONSTRAINT IF EXISTS profiles_role_check;

ALTER TABLE public.profiles
  ADD CONSTRAINT profiles_role_check
  CHECK (role IN ('tutor', 'veterinario', 'admin'));

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

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, role, avatar_url)
  VALUES (
    NEW.id,
    NEW.raw_user_meta_data ->> 'full_name',
    'tutor',
    NEW.raw_user_meta_data ->> 'avatar_url'
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$;

CREATE OR REPLACE FUNCTION public.prevent_profile_role_self_change()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF NEW.role IS DISTINCT FROM OLD.role AND NOT public.is_admin() THEN
    RAISE EXCEPTION 'Only admins can change profile roles';
  END IF;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS prevent_profile_role_self_change ON public.profiles;
CREATE TRIGGER prevent_profile_role_self_change
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.prevent_profile_role_self_change();

DROP POLICY IF EXISTS "Users can view their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can update their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can insert their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Admins can manage profiles" ON public.profiles;
DROP POLICY IF EXISTS "Veterinarians can view appointment tutor profiles" ON public.profiles;

CREATE POLICY "Users can view their own profile"
  ON public.profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can insert their own profile"
  ON public.profiles FOR INSERT
  WITH CHECK (auth.uid() = id AND role = 'tutor');

CREATE POLICY "Admins can manage profiles"
  ON public.profiles FOR ALL
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

CREATE POLICY "Veterinarians can view appointment tutor profiles"
  ON public.profiles FOR SELECT
  USING (
    public.is_veterinario()
    AND EXISTS (
      SELECT 1
      FROM public.agendamentos a
      WHERE a.user_id = profiles.id
    )
  );

DROP POLICY IF EXISTS "Users can view their own pets" ON public.pets;
DROP POLICY IF EXISTS "Users can create their own pets" ON public.pets;
DROP POLICY IF EXISTS "Users can update their own pets" ON public.pets;
DROP POLICY IF EXISTS "Users can delete their own pets" ON public.pets;
DROP POLICY IF EXISTS "Admins can manage pets" ON public.pets;
DROP POLICY IF EXISTS "Veterinarians can view appointment pets" ON public.pets;
DROP POLICY IF EXISTS "Tutors can view their own pets" ON public.pets;
DROP POLICY IF EXISTS "Tutors can create their own pets" ON public.pets;
DROP POLICY IF EXISTS "Tutors can update their own pets" ON public.pets;
DROP POLICY IF EXISTS "Tutors can delete their own pets" ON public.pets;

CREATE POLICY "Tutors can view their own pets"
  ON public.pets FOR SELECT
  USING (auth.uid() = user_id OR public.is_admin());

CREATE POLICY "Tutors can create their own pets"
  ON public.pets FOR INSERT
  WITH CHECK (auth.uid() = user_id AND public.is_tutor());

CREATE POLICY "Tutors can update their own pets"
  ON public.pets FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Tutors can delete their own pets"
  ON public.pets FOR DELETE
  USING (auth.uid() = user_id OR public.is_admin());

CREATE POLICY "Veterinarians can view appointment pets"
  ON public.pets FOR SELECT
  USING (
    public.is_veterinario()
    AND EXISTS (
      SELECT 1
      FROM public.agendamentos a
      WHERE a.pet_id = pets.id
    )
  );

DROP POLICY IF EXISTS "Users can view their own agendamentos" ON public.agendamentos;
DROP POLICY IF EXISTS "Users can create their own agendamentos" ON public.agendamentos;
DROP POLICY IF EXISTS "Users can update their own agendamentos" ON public.agendamentos;
DROP POLICY IF EXISTS "Users can delete their own agendamentos" ON public.agendamentos;
DROP POLICY IF EXISTS "Admins can manage agendamentos" ON public.agendamentos;
DROP POLICY IF EXISTS "Veterinarians can view agendamentos" ON public.agendamentos;
DROP POLICY IF EXISTS "Tutors can view their own agendamentos" ON public.agendamentos;
DROP POLICY IF EXISTS "Tutors can create their own agendamentos" ON public.agendamentos;
DROP POLICY IF EXISTS "Tutors can update their own agendamentos" ON public.agendamentos;
DROP POLICY IF EXISTS "Tutors can delete their own agendamentos" ON public.agendamentos;

CREATE POLICY "Tutors can view their own agendamentos"
  ON public.agendamentos FOR SELECT
  USING (auth.uid() = user_id OR public.is_admin() OR public.is_veterinario());

CREATE POLICY "Tutors can create their own agendamentos"
  ON public.agendamentos FOR INSERT
  WITH CHECK (
    auth.uid() = user_id
    AND EXISTS (
      SELECT 1 FROM public.pets p
      WHERE p.id = agendamentos.pet_id AND p.user_id = auth.uid()
    )
  );

CREATE POLICY "Tutors can update their own agendamentos"
  ON public.agendamentos FOR UPDATE
  USING (auth.uid() = user_id OR public.is_admin())
  WITH CHECK (auth.uid() = user_id OR public.is_admin());

CREATE POLICY "Tutors can delete their own agendamentos"
  ON public.agendamentos FOR DELETE
  USING (auth.uid() = user_id OR public.is_admin());

DROP POLICY IF EXISTS "Users can view their own vacinas" ON public.vacinas;
DROP POLICY IF EXISTS "Users can create their own vacinas" ON public.vacinas;
DROP POLICY IF EXISTS "Users can update their own vacinas" ON public.vacinas;
DROP POLICY IF EXISTS "Users can delete their own vacinas" ON public.vacinas;
DROP POLICY IF EXISTS "Tutors can view their own vacinas" ON public.vacinas;
DROP POLICY IF EXISTS "Veterinarians and admins can create vacinas" ON public.vacinas;
DROP POLICY IF EXISTS "Veterinarians and admins can update vacinas" ON public.vacinas;
DROP POLICY IF EXISTS "Admins can delete vacinas" ON public.vacinas;

CREATE POLICY "Tutors can view their own vacinas"
  ON public.vacinas FOR SELECT
  USING (auth.uid() = user_id OR public.is_admin() OR public.is_veterinario());

CREATE POLICY "Veterinarians and admins can create vacinas"
  ON public.vacinas FOR INSERT
  WITH CHECK (public.is_veterinario() OR public.is_admin());

CREATE POLICY "Veterinarians and admins can update vacinas"
  ON public.vacinas FOR UPDATE
  USING (public.is_veterinario() OR public.is_admin())
  WITH CHECK (public.is_veterinario() OR public.is_admin());

CREATE POLICY "Admins can delete vacinas"
  ON public.vacinas FOR DELETE
  USING (public.is_admin());

DROP POLICY IF EXISTS "Users can view their own historico" ON public.historico;
DROP POLICY IF EXISTS "Users can create their own historico" ON public.historico;
DROP POLICY IF EXISTS "Users can update their own historico" ON public.historico;
DROP POLICY IF EXISTS "Users can delete their own historico" ON public.historico;
DROP POLICY IF EXISTS "Tutors can view their own historico" ON public.historico;
DROP POLICY IF EXISTS "Veterinarians and admins can create historico" ON public.historico;
DROP POLICY IF EXISTS "Veterinarians and admins can update historico" ON public.historico;
DROP POLICY IF EXISTS "Admins can delete historico" ON public.historico;

CREATE POLICY "Tutors can view their own historico"
  ON public.historico FOR SELECT
  USING (auth.uid() = user_id OR public.is_admin() OR public.is_veterinario());

CREATE POLICY "Veterinarians and admins can create historico"
  ON public.historico FOR INSERT
  WITH CHECK (public.is_veterinario() OR public.is_admin());

CREATE POLICY "Veterinarians and admins can update historico"
  ON public.historico FOR UPDATE
  USING (public.is_veterinario() OR public.is_admin())
  WITH CHECK (public.is_veterinario() OR public.is_admin());

CREATE POLICY "Admins can delete historico"
  ON public.historico FOR DELETE
  USING (public.is_admin());

DROP POLICY IF EXISTS "Users can view their own consultas" ON public.consultas;
DROP POLICY IF EXISTS "Users can create their own consultas" ON public.consultas;
DROP POLICY IF EXISTS "Users can update their own consultas" ON public.consultas;
DROP POLICY IF EXISTS "Users can delete their own consultas" ON public.consultas;
DROP POLICY IF EXISTS "Tutors can view their own consultas" ON public.consultas;
DROP POLICY IF EXISTS "Tutors can create their own consultas" ON public.consultas;
DROP POLICY IF EXISTS "Veterinarians and admins can update consultas" ON public.consultas;
DROP POLICY IF EXISTS "Admins can delete consultas" ON public.consultas;

CREATE POLICY "Tutors can view their own consultas"
  ON public.consultas FOR SELECT
  USING (auth.uid() = user_id OR public.is_admin() OR public.is_veterinario());

CREATE POLICY "Tutors can create their own consultas"
  ON public.consultas FOR INSERT
  WITH CHECK (
    auth.uid() = user_id
    AND EXISTS (
      SELECT 1 FROM public.pets p
      WHERE p.id = consultas.pet_id AND p.user_id = auth.uid()
    )
  );

CREATE POLICY "Veterinarians and admins can update consultas"
  ON public.consultas FOR UPDATE
  USING (public.is_veterinario() OR public.is_admin())
  WITH CHECK (public.is_veterinario() OR public.is_admin());

CREATE POLICY "Admins can delete consultas"
  ON public.consultas FOR DELETE
  USING (public.is_admin());

DROP POLICY IF EXISTS "Users can view their own lancamentos" ON public.lancamentos;
DROP POLICY IF EXISTS "Users can create their own lancamentos" ON public.lancamentos;
DROP POLICY IF EXISTS "Users can update their own lancamentos" ON public.lancamentos;
DROP POLICY IF EXISTS "Users can delete their own lancamentos" ON public.lancamentos;
DROP POLICY IF EXISTS "Admins can manage lancamentos" ON public.lancamentos;

CREATE POLICY "Admins can manage lancamentos"
  ON public.lancamentos FOR ALL
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

COMMIT;
