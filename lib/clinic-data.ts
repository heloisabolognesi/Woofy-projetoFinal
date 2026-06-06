import type { createClient } from "@/lib/supabase"

type SupabaseBrowserClient = ReturnType<typeof createClient>

export type Especie = "cao" | "gato" | "outro"
export type AgendamentoStatus = "agendado" | "confirmado" | "realizado" | "cancelado"
export type AppointmentStatus = AgendamentoStatus
export type ConsultaStatus = "agendada" | "realizada" | "cancelada"
export type HistoricoTipo = "consulta" | "vacina" | "exame"

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

interface ConsultaRow {
  id: string
  pet_id: string
  user_id: string
  tutor: string
  data: string
  horario: string
  veterinario: string
  motivo: string
  status: ConsultaStatus
  agendamento_id?: string | null
  veterinario_id?: string | null
  created_at: string
}

interface HistoricoRow {
  id: string
  pet_id: string
  user_id: string
  data: string
  tipo: HistoricoTipo
  descricao: string
  veterinario: string
  consulta_id?: string | null
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

export interface ClinicAppointment extends AdminAppointment {
  tutorDisplayName: string
  veterinarianDisplayName: string
}

export interface ClinicAppointmentDetail extends ClinicAppointment {
  pet: {
    id: string
    nome: string
    especie: Especie
    raca: string
    dataNascimento: string | null
    peso: number | null
  }
  tutorProfileName: string | null
  tutorEmail: string | null
  veterinarianProfileName: string | null
  consultation: AdminConsultation | null
  historyEntry: AdminHistoryEntry | null
}

export interface AdminConsultation {
  id: string
  petId: string
  userId: string
  petNome: string
  tutor: string
  tutorProfileName: string | null
  tutorDisplayName: string
  data: string
  horario: string
  veterinario: string
  veterinarioId: string | null
  veterinarianProfileName: string | null
  veterinarianDisplayName: string
  motivo: string
  status: ConsultaStatus
  agendamentoId: string | null
  appointmentDate: string | null
  appointmentStartTime: string | null
  appointmentEndTime: string | null
  createdAt: string
}

export interface AdminHistoryEntry {
  id: string
  petId: string
  userId: string
  petNome: string
  tutor: string
  tutorProfileName: string | null
  tutorDisplayName: string
  data: string
  tipo: HistoricoTipo
  descricao: string
  veterinario: string
  consultaId: string | null
  consultationReason: string | null
  consultationVeterinarianId: string | null
  veterinarianProfileName: string | null
  veterinarianDisplayName: string
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

export interface CreateTutorAppointmentInput {
  petId: string
  userId: string
  tutor: string
  data: string
  horarioInicio: string
  horarioFim: string
  veterinario?: string
  tipo: string
}

export interface CreateClinicalFeedbackInput {
  appointment: ClinicAppointment
  veterinarianId: string
  veterinarianName: string
  feedback: string
  historyDescription: string
  historyType: HistoricoTipo
  historyDate: string
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

function mapClinicAppointment(
  row: AgendamentoRow,
  petsById: Record<string, PetRow>,
  profilesById: Record<string, ProfileRow>,
): ClinicAppointment {
  const appointment = mapAppointment(row, petsById, profilesById)
  const veterinarianProfileName = row.veterinario_id ? profilesById[row.veterinario_id]?.full_name || null : null

  return {
    ...appointment,
    tutorDisplayName: appointment.tutorProfileName || appointment.tutor,
    veterinarianDisplayName: veterinarianProfileName || appointment.veterinario || "A definir",
  }
}

function mapClinicAppointmentDetail(
  appointment: ClinicAppointment,
  pet: PetRow | null,
  profilesById: Record<string, ProfileRow>,
  consultation: AdminConsultation | null,
  historyEntry: AdminHistoryEntry | null,
): ClinicAppointmentDetail {
  const veterinarianProfileName = appointment.veterinarioId
    ? profilesById[appointment.veterinarioId]?.full_name || null
    : null

  return {
    ...appointment,
    pet: {
      id: pet?.id || appointment.petId,
      nome: pet?.nome || appointment.petNome,
      especie: pet?.especie || "outro",
      raca: pet?.raca || "Não informada",
      dataNascimento: pet?.data_nascimento || null,
      peso: pet?.peso || null,
    },
    tutorProfileName: appointment.tutorProfileName,
    tutorEmail: null,
    veterinarianProfileName,
    consultation,
    historyEntry,
  }
}

function mapConsultation(
  row: ConsultaRow,
  petsById: Record<string, PetRow>,
  profilesById: Record<string, ProfileRow>,
  appointmentsById: Record<string, AgendamentoRow>,
): AdminConsultation {
  const appointment = row.agendamento_id ? appointmentsById[row.agendamento_id] : null
  const tutorProfileName = profilesById[row.user_id]?.full_name || null
  const veterinarianProfileName = row.veterinario_id ? profilesById[row.veterinario_id]?.full_name || null : null

  return {
    id: row.id,
    petId: row.pet_id,
    userId: row.user_id,
    petNome: petsById[row.pet_id]?.nome || "Pet sem nome",
    tutor: row.tutor,
    tutorProfileName,
    tutorDisplayName: tutorProfileName || row.tutor,
    data: row.data,
    horario: row.horario,
    veterinario: row.veterinario,
    veterinarioId: row.veterinario_id || null,
    veterinarianProfileName,
    veterinarianDisplayName: veterinarianProfileName || row.veterinario,
    motivo: row.motivo,
    status: row.status,
    agendamentoId: row.agendamento_id || null,
    appointmentDate: appointment?.data || null,
    appointmentStartTime: appointment?.horario_inicio || null,
    appointmentEndTime: appointment?.horario_fim || null,
    createdAt: row.created_at,
  }
}

function mapHistoryEntry(
  row: HistoricoRow,
  petsById: Record<string, PetRow>,
  profilesById: Record<string, ProfileRow>,
  consultationsById: Record<string, ConsultaRow>,
): AdminHistoryEntry {
  const consultation = row.consulta_id ? consultationsById[row.consulta_id] : null
  const tutorProfileName = profilesById[row.user_id]?.full_name || null
  const veterinarianId = consultation?.veterinario_id || null
  const veterinarianProfileName = veterinarianId ? profilesById[veterinarianId]?.full_name || null : null

  return {
    id: row.id,
    petId: row.pet_id,
    userId: row.user_id,
    petNome: petsById[row.pet_id]?.nome || "Pet sem nome",
    tutor: petsById[row.pet_id]?.tutor || tutorProfileName || "Tutor não identificado",
    tutorProfileName,
    tutorDisplayName: tutorProfileName || petsById[row.pet_id]?.tutor || "Tutor não identificado",
    data: row.data,
    tipo: row.tipo,
    descricao: row.descricao,
    veterinario: row.veterinario,
    consultaId: row.consulta_id || null,
    consultationReason: consultation?.motivo || null,
    consultationVeterinarianId: veterinarianId,
    veterinarianProfileName,
    veterinarianDisplayName: veterinarianProfileName || row.veterinario,
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

async function getAppointmentsWithRelations(client: SupabaseBrowserClient, rows: AgendamentoRow[]) {
  const petIds = rows.map((appointment) => appointment.pet_id)
  const profileIds = rows.flatMap((appointment) => [appointment.user_id, appointment.veterinario_id || ""])

  const [{ data: petData, error: petError }, profilesById] = await Promise.all([
    petIds.length > 0
      ? client.from("pets").select("*").in("id", [...new Set(petIds)])
      : Promise.resolve({ data: [], error: null }),
    getProfilesByIds(client, profileIds),
  ])

  if (petError) throw petError

  const petsById = ((petData || []) as PetRow[]).reduce<Record<string, PetRow>>((acc, pet) => {
    acc[pet.id] = pet
    return acc
  }, {})

  return rows.map((appointment) => mapClinicAppointment(appointment, petsById, profilesById))
}

async function getAppointmentDetailsFromRows(client: SupabaseBrowserClient, rows: AgendamentoRow[]) {
  const appointments = await getAppointmentsWithRelations(client, rows)
  const petIds = rows.map((appointment) => appointment.pet_id)
  const profileIds = rows.flatMap((appointment) => [appointment.user_id, appointment.veterinario_id || ""])
  const appointmentIds = rows.map((appointment) => appointment.id)

  const [
    { data: petData, error: petError },
    profilesById,
    { data: consultationData, error: consultationError },
  ] = await Promise.all([
    petIds.length > 0
      ? client.from("pets").select("*").in("id", [...new Set(petIds)])
      : Promise.resolve({ data: [], error: null }),
    getProfilesByIds(client, profileIds),
    appointmentIds.length > 0
      ? client.from("consultas").select("*").in("agendamento_id", appointmentIds)
      : Promise.resolve({ data: [], error: null }),
  ])

  if (petError) throw petError
  if (consultationError) throw consultationError

  const petsById = ((petData || []) as PetRow[]).reduce<Record<string, PetRow>>((acc, pet) => {
    acc[pet.id] = pet
    return acc
  }, {})
  const consultationRows = (consultationData || []) as ConsultaRow[]
  const consultationsByAppointmentId = consultationRows.reduce<Record<string, ConsultaRow>>((acc, consultation) => {
    if (consultation.agendamento_id && !acc[consultation.agendamento_id]) {
      acc[consultation.agendamento_id] = consultation
    }
    return acc
  }, {})
  const consultationIds = consultationRows.map((consultation) => consultation.id)
  const { data: historyData, error: historyError } = consultationIds.length > 0
    ? await client.from("historico").select("*").in("consulta_id", consultationIds)
    : { data: [], error: null }

  if (historyError) throw historyError

  const historyRows = (historyData || []) as HistoricoRow[]
  const historyByConsultationId = historyRows.reduce<Record<string, HistoricoRow>>((acc, entry) => {
    if (entry.consulta_id && !acc[entry.consulta_id]) {
      acc[entry.consulta_id] = entry
    }
    return acc
  }, {})
  const appointmentRowsById = rows.reduce<Record<string, AgendamentoRow>>((acc, appointment) => {
    acc[appointment.id] = appointment
    return acc
  }, {})
  const consultationsById = consultationRows.reduce<Record<string, ConsultaRow>>((acc, consultation) => {
    acc[consultation.id] = consultation
    return acc
  }, {})

  return appointments.map((appointment) => {
    const consultationRow = consultationsByAppointmentId[appointment.id] || null
    const historyRow = consultationRow ? historyByConsultationId[consultationRow.id] || null : null
    const consultation = consultationRow
      ? mapConsultation(consultationRow, petsById, profilesById, appointmentRowsById)
      : null
    const historyEntry = historyRow
      ? mapHistoryEntry(historyRow, petsById, profilesById, consultationsById)
      : null

    return mapClinicAppointmentDetail(
      appointment,
      petsById[appointment.petId] || null,
      profilesById,
      consultation,
      historyEntry,
    )
  })
}

export async function getVeterinarianAppointments(client: SupabaseBrowserClient, veterinarianId?: string) {
  let query = client
    .from("agendamentos")
    .select("*")
    .order("data", { ascending: true })
    .order("horario_inicio", { ascending: true })

  if (veterinarianId) {
    query = query.or(`veterinario_id.is.null,veterinario_id.eq.${veterinarianId}`)
  }

  const { data, error } = await query
  if (error) throw error

  return getAppointmentDetailsFromRows(client, (data || []) as AgendamentoRow[])
}

export async function getAppointmentDetails(client: SupabaseBrowserClient, appointmentId: string) {
  const { data, error } = await client
    .from("agendamentos")
    .select("*")
    .eq("id", appointmentId)
    .single()

  if (error) throw error

  const [detail] = await getAppointmentDetailsFromRows(client, [data as AgendamentoRow])
  return detail
}

export async function getConsultationByAppointmentId(client: SupabaseBrowserClient, appointmentId: string) {
  const { data, error } = await client
    .from("consultas")
    .select("*")
    .eq("agendamento_id", appointmentId)
    .order("created_at", { ascending: true })
    .limit(1)
    .maybeSingle()

  if (error) throw error
  return (data || null) as ConsultaRow | null
}

export async function getTutorAppointments(client: SupabaseBrowserClient, userId: string) {
  const { data, error } = await client
    .from("agendamentos")
    .select("*")
    .eq("user_id", userId)
    .order("data", { ascending: true })
    .order("horario_inicio", { ascending: true })

  if (error) throw error

  return getAppointmentsWithRelations(client, (data || []) as AgendamentoRow[])
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

export async function createTutorAppointment(client: SupabaseBrowserClient, input: CreateTutorAppointmentInput) {
  const { data: petData, error: petError } = await client
    .from("pets")
    .select("*")
    .eq("id", input.petId)
    .eq("user_id", input.userId)
    .single()

  if (petError) throw petError

  const pet = petData as PetRow
  const { data, error } = await client
    .from("agendamentos")
    .insert({
      pet_id: input.petId,
      user_id: input.userId,
      tutor: input.tutor,
      data: input.data,
      horario_inicio: input.horarioInicio,
      horario_fim: input.horarioFim,
      veterinario: input.veterinario || "A definir",
      veterinario_id: null,
      tipo: input.tipo,
      status: "agendado",
    })
    .select("*")
    .single()

  if (error) throw error

  const row = data as AgendamentoRow
  const profilesById = await getProfilesByIds(client, [row.user_id])
  return mapClinicAppointment(row, { [pet.id]: pet }, profilesById)
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

export async function getAdminUpcomingAppointments(client: SupabaseBrowserClient) {
  const today = new Date().toISOString().split("T")[0]
  const { data, error } = await client
    .from("agendamentos")
    .select("*")
    .gte("data", today)
    .in("status", ["agendado", "confirmado"])
    .order("data", { ascending: true })
    .order("horario_inicio", { ascending: true })
    .limit(5)

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

export async function createConsultationWithHistory(client: SupabaseBrowserClient, input: CreateClinicalFeedbackInput) {
  const existingConsultation = await getConsultationByAppointmentId(client, input.appointment.id)
  if (existingConsultation) {
    return existingConsultation
  }

  const { data: consultaData, error: consultaError } = await client
    .from("consultas")
    .insert({
      pet_id: input.appointment.petId,
      user_id: input.appointment.userId,
      tutor: input.appointment.tutorDisplayName,
      data: input.historyDate,
      horario: input.appointment.horarioInicio,
      veterinario: input.veterinarianName,
      veterinario_id: input.veterinarianId,
      agendamento_id: input.appointment.id,
      motivo: input.feedback,
      status: "realizada",
    })
    .select("*")
    .single()

  if (consultaError) throw consultaError

  const consulta = consultaData as ConsultaRow
  const { error: historicoError } = await client.from("historico").insert({
    pet_id: input.appointment.petId,
    user_id: input.appointment.userId,
    data: input.historyDate,
    tipo: input.historyType,
    descricao: input.historyDescription || input.feedback,
    veterinario: input.veterinarianName,
    consulta_id: consulta.id,
  })

  if (historicoError) throw historicoError

  await updateAppointmentStatus(client, input.appointment.id, "realizado")

  return consulta
}

export async function getAdminConsultations(client: SupabaseBrowserClient) {
  const { data, error } = await client
    .from("consultas")
    .select("*")
    .order("data", { ascending: false })
    .order("horario", { ascending: true })

  if (error) throw error

  const rows = (data || []) as ConsultaRow[]
  const petIds = rows.map((consultation) => consultation.pet_id)
  const profileIds = rows.flatMap((consultation) => [consultation.user_id, consultation.veterinario_id || ""])
  const appointmentIds = [...new Set(rows.map((consultation) => consultation.agendamento_id).filter(Boolean))] as string[]

  const [{ data: petData, error: petError }, profilesById, { data: appointmentData, error: appointmentError }] =
    await Promise.all([
      petIds.length > 0
        ? client.from("pets").select("*").in("id", [...new Set(petIds)])
        : Promise.resolve({ data: [], error: null }),
      getProfilesByIds(client, profileIds),
      appointmentIds.length > 0
        ? client.from("agendamentos").select("*").in("id", appointmentIds)
        : Promise.resolve({ data: [], error: null }),
    ])

  if (petError) throw petError
  if (appointmentError) throw appointmentError

  const petsById = ((petData || []) as PetRow[]).reduce<Record<string, PetRow>>((acc, pet) => {
    acc[pet.id] = pet
    return acc
  }, {})
  const appointmentsById = ((appointmentData || []) as AgendamentoRow[]).reduce<Record<string, AgendamentoRow>>(
    (acc, appointment) => {
      acc[appointment.id] = appointment
      return acc
    },
    {},
  )

  return rows.map((consultation) => mapConsultation(consultation, petsById, profilesById, appointmentsById))
}

export async function getAdminHistoryEntries(client: SupabaseBrowserClient) {
  const { data, error } = await client
    .from("historico")
    .select("*")
    .order("data", { ascending: false })
    .order("created_at", { ascending: false })

  if (error) throw error

  const rows = (data || []) as HistoricoRow[]
  const petIds = rows.map((entry) => entry.pet_id)
  const userIds = rows.map((entry) => entry.user_id)
  const consultationIds = [...new Set(rows.map((entry) => entry.consulta_id).filter(Boolean))] as string[]

  const [{ data: petData, error: petError }, { data: consultationData, error: consultationError }] = await Promise.all([
    petIds.length > 0
      ? client.from("pets").select("*").in("id", [...new Set(petIds)])
      : Promise.resolve({ data: [], error: null }),
    consultationIds.length > 0
      ? client.from("consultas").select("*").in("id", consultationIds)
      : Promise.resolve({ data: [], error: null }),
  ])

  if (petError) throw petError
  if (consultationError) throw consultationError

  const consultations = (consultationData || []) as ConsultaRow[]
  const profileIds = [
    ...userIds,
    ...consultations.map((consultation) => consultation.veterinario_id || ""),
  ]
  const profilesById = await getProfilesByIds(client, profileIds)
  const petsById = ((petData || []) as PetRow[]).reduce<Record<string, PetRow>>((acc, pet) => {
    acc[pet.id] = pet
    return acc
  }, {})
  const consultationsById = consultations.reduce<Record<string, ConsultaRow>>((acc, consultation) => {
    acc[consultation.id] = consultation
    return acc
  }, {})

  return rows.map((entry) => mapHistoryEntry(entry, petsById, profilesById, consultationsById))
}
