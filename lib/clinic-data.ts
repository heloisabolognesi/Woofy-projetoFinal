import type { createClient } from "@/lib/supabase"

type SupabaseBrowserClient = ReturnType<typeof createClient>

export type Especie = "cao" | "gato" | "outro"
export type AgendamentoStatus = "agendado" | "confirmado" | "realizado" | "cancelado"

export interface ProfileSummary {
  id: string
  fullName: string | null
  role: "tutor" | "veterinario" | "admin"
}

interface PetRow {
  id: string
  user_id: string
  nome: string
  especie: Especie
  raca: string
  data_nascimento: string | null
  peso: number | null
  tutor: string
  telefone_tutor: string | null
  foto: string | null
  arquivado: boolean
  created_at: string
}

interface AgendamentoRow {
  id: string
  pet_id: string
  user_id: string
  tutor: string
  data: string
  horario_inicio: string
  horario_fim: string
  veterinario: string
  tipo: string
  status?: AgendamentoStatus | null
  veterinario_id?: string | null
  created_at: string
}

interface ProfileRow {
  id: string
  full_name: string | null
  role: "tutor" | "veterinario" | "admin"
}

export interface AdminPet {
  id: string
  userId: string
  nome: string
  especie: Especie
  raca: string
  dataNascimento: string | null
  peso: number | null
  tutor: string
  tutorProfileName: string | null
  telefoneTutor: string | null
  foto: string | null
  arquivado: boolean
  createdAt: string
}

export interface AdminAppointment {
  id: string
  petId: string
  userId: string
  petNome: string
  tutor: string
  tutorProfileName: string | null
  data: string
  horarioInicio: string
  horarioFim: string
  veterinario: string
  veterinarioId: string | null
  tipo: string
  status: AgendamentoStatus
  createdAt: string
}

export interface SaveAdminPetInput {
  userId: string
  nome: string
  especie: Especie
  raca: string
  dataNascimento: string | null
  peso: number | null
  tutor: string
  telefoneTutor: string | null
}

export interface CreateAdminAppointmentInput {
  petId: string
  data: string
  horarioInicio: string
  horarioFim: string
  veterinario: string
  veterinarioId: string | null
  tipo: string
}

function profileMap(profiles: ProfileRow[]) {
  return profiles.reduce<Record<string, ProfileRow>>((acc, profile) => {
    acc[profile.id] = profile
    return acc
  }, {})
}

function mapPet(row: PetRow, profilesById: Record<string, ProfileRow>): AdminPet {
  return {
    id: row.id,
    userId: row.user_id,
    nome: row.nome,
    especie: row.especie,
    raca: row.raca,
    dataNascimento: row.data_nascimento,
    peso: row.peso,
    tutor: row.tutor,
    tutorProfileName: profilesById[row.user_id]?.full_name || null,
    telefoneTutor: row.telefone_tutor,
    foto: row.foto,
    arquivado: row.arquivado,
    createdAt: row.created_at,
  }
}

function mapAppointment(
  row: AgendamentoRow,
  petsById: Record<string, PetRow>,
  profilesById: Record<string, ProfileRow>,
): AdminAppointment {
  return {
    id: row.id,
    petId: row.pet_id,
    userId: row.user_id,
    petNome: petsById[row.pet_id]?.nome || "Pet sem nome",
    tutor: row.tutor,
    tutorProfileName: profilesById[row.user_id]?.full_name || null,
    data: row.data,
    horarioInicio: row.horario_inicio,
    horarioFim: row.horario_fim,
    veterinario: row.veterinario,
    veterinarioId: row.veterinario_id || null,
    tipo: row.tipo,
    status: row.status || "agendado",
    createdAt: row.created_at,
  }
}

async function getProfilesByIds(client: SupabaseBrowserClient, ids: string[]) {
  const uniqueIds = [...new Set(ids)].filter(Boolean)
  if (uniqueIds.length === 0) return {}

  const { data, error } = await client
    .from("profiles")
    .select("id,full_name,role")
    .in("id", uniqueIds)

  if (error) throw error
  return profileMap((data || []) as ProfileRow[])
}

export async function getClinicProfiles(client: SupabaseBrowserClient) {
  const { data, error } = await client
    .from("profiles")
    .select("id,full_name,role")
    .order("full_name", { ascending: true })

  if (error) throw error

  return ((data || []) as ProfileRow[]).map<ProfileSummary>((profile) => ({
    id: profile.id,
    fullName: profile.full_name,
    role: profile.role,
  }))
}

export async function getAdminPets(client: SupabaseBrowserClient) {
  const { data, error } = await client
    .from("pets")
    .select("*")
    .order("created_at", { ascending: false })

  if (error) throw error

  const rows = (data || []) as PetRow[]
  const profilesById = await getProfilesByIds(client, rows.map((pet) => pet.user_id))
  return rows.map((pet) => mapPet(pet, profilesById))
}

export async function createAdminPet(client: SupabaseBrowserClient, input: SaveAdminPetInput) {
  const { data, error } = await client
    .from("pets")
    .insert({
      user_id: input.userId,
      nome: input.nome,
      especie: input.especie,
      raca: input.raca,
      data_nascimento: input.dataNascimento,
      peso: input.peso,
      tutor: input.tutor,
      telefone_tutor: input.telefoneTutor,
    })
    .select("*")
    .single()

  if (error) throw error

  const row = data as PetRow
  const profilesById = await getProfilesByIds(client, [row.user_id])
  return mapPet(row, profilesById)
}

export async function updateAdminPet(client: SupabaseBrowserClient, petId: string, input: SaveAdminPetInput) {
  const { data, error } = await client
    .from("pets")
    .update({
      user_id: input.userId,
      nome: input.nome,
      especie: input.especie,
      raca: input.raca,
      data_nascimento: input.dataNascimento,
      peso: input.peso,
      tutor: input.tutor,
      telefone_tutor: input.telefoneTutor,
    })
    .eq("id", petId)
    .select("*")
    .single()

  if (error) throw error

  const row = data as PetRow
  const profilesById = await getProfilesByIds(client, [row.user_id])
  return mapPet(row, profilesById)
}

export async function archiveAdminPet(client: SupabaseBrowserClient, petId: string) {
  const { error } = await client
    .from("pets")
    .update({ arquivado: true })
    .eq("id", petId)

  if (error) throw error
}

export async function getAdminAppointments(client: SupabaseBrowserClient) {
  const { data, error } = await client
    .from("agendamentos")
    .select("*")
    .order("data", { ascending: true })
    .order("horario_inicio", { ascending: true })

  if (error) throw error

  const rows = (data || []) as AgendamentoRow[]
  const petIds = rows.map((appointment) => appointment.pet_id)
  const userIds = rows.map((appointment) => appointment.user_id)

  const [{ data: petData, error: petError }, profilesById] = await Promise.all([
    petIds.length > 0
      ? client.from("pets").select("*").in("id", [...new Set(petIds)])
      : Promise.resolve({ data: [], error: null }),
    getProfilesByIds(client, userIds),
  ])

  if (petError) throw petError

  const petsById = ((petData || []) as PetRow[]).reduce<Record<string, PetRow>>((acc, pet) => {
    acc[pet.id] = pet
    return acc
  }, {})

  return rows.map((appointment) => mapAppointment(appointment, petsById, profilesById))
}

export async function createAdminAppointment(client: SupabaseBrowserClient, input: CreateAdminAppointmentInput) {
  const { data: petData, error: petError } = await client
    .from("pets")
    .select("*")
    .eq("id", input.petId)
    .single()

  if (petError) throw petError

  const pet = petData as PetRow
  const { data, error } = await client
    .from("agendamentos")
    .insert({
      pet_id: input.petId,
      user_id: pet.user_id,
      tutor: pet.tutor,
      data: input.data,
      horario_inicio: input.horarioInicio,
      horario_fim: input.horarioFim,
      veterinario: input.veterinario,
      veterinario_id: input.veterinarioId,
      tipo: input.tipo,
      status: "agendado",
    })
    .select("*")
    .single()

  if (error) throw error

  const row = data as AgendamentoRow
  const profilesById = await getProfilesByIds(client, [row.user_id])
  return mapAppointment(row, { [pet.id]: pet }, profilesById)
}

export async function updateAppointmentStatus(
  client: SupabaseBrowserClient,
  appointmentId: string,
  status: AgendamentoStatus,
) {
  const { error } = await client
    .from("agendamentos")
    .update({ status })
    .eq("id", appointmentId)

  if (error) throw error
}

export async function assignVeterinarianToAppointment(
  client: SupabaseBrowserClient,
  appointmentId: string,
  veterinarianId: string | null,
  veterinarianName: string,
) {
  const { error } = await client
    .from("agendamentos")
    .update({
      veterinario_id: veterinarianId,
      veterinario: veterinarianName,
    })
    .eq("id", appointmentId)

  if (error) throw error
}
