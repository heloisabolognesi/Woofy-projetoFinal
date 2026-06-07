"use client"

import { useEffect, useMemo, useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import {
  CalendarDays,
  ClipboardList,
  Loader2,
  LogOut,
  PawPrint,
  Plus,
  Syringe,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { useAuth } from "@/context/auth-context"
import { useApp } from "@/context/app-context"
import { createClient } from "@/lib/supabase"
import {
  archiveTutorAppointment,
  createTutorAppointment,
  getApprovedVeterinarians,
  getTutorAppointments,
  getTutorConsultationFeedback,
  getTutorFinancialSummary,
  getTutorPetHistory,
  getTutorVaccines,
  restoreTutorAppointment,
  type AdminHistoryEntry,
  type AdminVaccine,
  type ClinicAppointment,
  type TutorConsultationFeedback,
  type VeterinarianOption,
} from "@/lib/clinic-data"

type Especie = "cao" | "gato" | "aves" | "roedores" | "coelhos" | "outro"

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
  arquivado: boolean
}

const initialPetForm = {
  nome: "",
  especie: "cao" as Especie,
  raca: "",
  data_nascimento: "",
  peso: "",
  telefone_tutor: "",
}

const initialAppointmentForm = {
  pet_id: "",
  data: "",
  horario_inicio: "",
  veterinario_id: "",
  tipo: "Consulta",
  observacoes: "",
}

function addOneHour(time: string) {
  const [hours, minutes] = time.split(":").map(Number)
  if (Number.isNaN(hours) || Number.isNaN(minutes)) return time
  return `${String((hours + 1) % 24).padStart(2, "0")}:${String(minutes).padStart(2, "0")}`
}

function speciesLabel(especie: Especie) {
  const labels: Record<Especie, string> = {
    cao: "Cão",
    gato: "Gato",
    aves: "Aves",
    roedores: "Roedores",
    coelhos: "Coelhos",
    outro: "Outro",
  }
  return labels[especie] || especie
}

function readableError(error: unknown) {
  if (error instanceof Error) return error.message
  if (typeof error === "object" && error !== null) return JSON.stringify(error)
  return String(error)
}

export default function TutorPage() {
  const { user, profile, loading, signOut } = useAuth()
  const { addToast } = useApp()
  const router = useRouter()
  const supabase = useMemo(() => createClient(), [])
  const [pets, setPets] = useState<PetRow[]>([])
  const [agendamentos, setAgendamentos] = useState<ClinicAppointment[]>([])
  const [veterinarians, setVeterinarians] = useState<VeterinarianOption[]>([])
  const [vacinas, setVacinas] = useState<AdminVaccine[]>([])
  const [feedbacks, setFeedbacks] = useState<TutorConsultationFeedback[]>([])
  const [historico, setHistorico] = useState<AdminHistoryEntry[]>([])
  const [financialSummary, setFinancialSummary] = useState({ consultationTotal: 0, vaccineTotal: 0, total: 0 })
  const [petForm, setPetForm] = useState(initialPetForm)
  const [appointmentForm, setAppointmentForm] = useState(initialAppointmentForm)
  const [isLoadingData, setIsLoadingData] = useState(true)
  const [isSavingPet, setIsSavingPet] = useState(false)
  const [isSavingAppointment, setIsSavingAppointment] = useState(false)

  const tutorName = profile?.full_name || user?.email || "Tutor"

  useEffect(() => {
    if (loading) return
    if (!user) {
      router.replace("/login?redirect=/tutor")
      return
    }

    async function loadTutorData() {
      if (!user) return
      setIsLoadingData(true)

      try {
        const [
          petsResult,
          agendamentosResult,
          vacinasResult,
          feedbacksResult,
          historicoResult,
          financialSummaryResult,
          veterinariansResult,
        ] = await Promise.allSettled([
          supabase.from("pets").select("*").eq("user_id", user.id).eq("arquivado", false).order("created_at", { ascending: false }),
          getTutorAppointments(supabase, user.id),
          getTutorVaccines(supabase, user.id),
          getTutorConsultationFeedback(supabase, user.id),
          getTutorPetHistory(supabase, user.id),
          getTutorFinancialSummary(supabase, user.id),
          getApprovedVeterinarians(supabase),
        ])

        const loadErrors = [
          petsResult.status === "fulfilled" && petsResult.value.error ? petsResult.value.error : null,
          agendamentosResult.status === "rejected" ? agendamentosResult.reason : null,
          vacinasResult.status === "rejected" ? vacinasResult.reason : null,
          feedbacksResult.status === "rejected" ? feedbacksResult.reason : null,
          historicoResult.status === "rejected" ? historicoResult.reason : null,
          financialSummaryResult.status === "rejected" ? financialSummaryResult.reason : null,
          veterinariansResult.status === "rejected" ? veterinariansResult.reason : null,
        ].filter(Boolean)

        if (loadErrors.length > 0) {
          console.error("Tutor load failed:", loadErrors.map(readableError).join(" | "))
          addToast("Não foi possível carregar todos os dados do tutor.", "error")
        }

        setPets(petsResult.status === "fulfilled" ? ((petsResult.value.data || []) as PetRow[]) : [])
        setAgendamentos(agendamentosResult.status === "fulfilled" ? agendamentosResult.value : [])
        setVacinas(vacinasResult.status === "fulfilled" ? vacinasResult.value : [])
        setFeedbacks(feedbacksResult.status === "fulfilled" ? feedbacksResult.value : [])
        setHistorico(historicoResult.status === "fulfilled" ? historicoResult.value : [])
        setFinancialSummary(
          financialSummaryResult.status === "fulfilled"
            ? financialSummaryResult.value
            : { consultationTotal: 0, vaccineTotal: 0, total: 0 }
        )
        const loadedVeterinarians = veterinariansResult.status === "fulfilled" ? veterinariansResult.value : []
        setVeterinarians(loadedVeterinarians)
        setAppointmentForm((current) => ({
          ...current,
          veterinario_id: current.veterinario_id || loadedVeterinarians[0]?.id || "",
        }))
      } catch (error) {
        console.error("Tutor load failed:", readableError(error))
        addToast("Não foi possível carregar os dados do tutor.", "error")
      } finally {
        setIsLoadingData(false)
      }
    }

    loadTutorData()
  }, [addToast, loading, router, supabase, user])

  const petNameById = useMemo(() => {
    return pets.reduce<Record<string, string>>((acc, pet) => {
      acc[pet.id] = pet.nome
      return acc
    }, {})
  }, [pets])
  const activeAppointments = agendamentos.filter((appointment) => !appointment.tutorArchivedAt)
  const archivedAppointments = agendamentos.filter((appointment) => appointment.tutorArchivedAt)
  const medicalReturns = useMemo(() => {
    const feedbackAppointmentIds = new Set(feedbacks.map((feedback) => feedback.agendamentoId).filter(Boolean))
    const feedbackConsultationIds = new Set(feedbacks.map((feedback) => feedback.id))
    const feedbackItems = feedbacks.map((item) => ({
      id: `feedback-${item.id}`,
      petNome: item.petNome,
      veterinarianDisplayName: item.veterinarianDisplayName,
      data: item.data,
      tipo: "Consulta",
      text: item.feedback,
    }))
    const historyOnlyItems = historico
      .filter((item) => {
        if (item.agendamentoId && feedbackAppointmentIds.has(item.agendamentoId)) return false
        if (item.consultaId && feedbackConsultationIds.has(item.consultaId)) return false
        return true
      })
      .map((item) => ({
        id: `history-${item.id}`,
        petNome: item.petNome,
        veterinarianDisplayName: item.veterinarianDisplayName,
        data: item.data,
        tipo: item.tipo,
        text: item.descricao,
      }))

    return [...feedbackItems, ...historyOnlyItems].sort((a, b) => b.data.localeCompare(a.data))
  }, [feedbacks, historico])
  const formatCurrency = (value: number) =>
    new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(value)

  async function handleSignOut() {
    await signOut()
    router.replace("/")
  }

  async function handleCreatePet(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (!user) return

    setIsSavingPet(true)
    const { data, error } = await supabase
      .from("pets")
      .insert({
        user_id: user.id,
        nome: petForm.nome.trim(),
        especie: petForm.especie,
        raca: petForm.raca.trim(),
        data_nascimento: petForm.data_nascimento || null,
        peso: petForm.peso ? Number(petForm.peso) : null,
        tutor: tutorName,
        telefone_tutor: petForm.telefone_tutor || null,
      })
      .select()
      .single()

    setIsSavingPet(false)

    if (error) {
      addToast("Erro ao cadastrar pet.", "error")
      return
    }

    setPets((current) => [data as PetRow, ...current])
    setPetForm(initialPetForm)
    addToast("Pet cadastrado com sucesso!")
  }

  async function handleCreateAppointment(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (!user) return

    const selectedPet = pets.find((pet) => pet.id === appointmentForm.pet_id)
    if (!selectedPet) {
      addToast("Escolha um pet para agendar.", "error")
      return
    }

    const selectedVeterinarian = veterinarians.find((vet) => vet.id === appointmentForm.veterinario_id) || null
    if (!selectedVeterinarian) {
      addToast("Escolha o veterinário para o atendimento.", "error")
      return
    }

    setIsSavingAppointment(true)
    try {
      const data = await createTutorAppointment(supabase, {
        petId: selectedPet.id,
        userId: user.id,
        tutor: tutorName,
        data: appointmentForm.data,
        horarioInicio: appointmentForm.horario_inicio,
        horarioFim: addOneHour(appointmentForm.horario_inicio),
        veterinario: selectedVeterinarian.full_name || "Veterinário",
        veterinarioId: selectedVeterinarian.id,
        tipo: appointmentForm.observacoes
          ? `${appointmentForm.tipo} - ${appointmentForm.observacoes.trim()}`
          : appointmentForm.tipo,
      })

      setAgendamentos((current) => [
        ...current,
        data,
      ])
      setAppointmentForm(initialAppointmentForm)
      addToast("Agendamento solicitado com sucesso!")
    } catch {
      addToast("Erro ao criar agendamento.", "error")
    } finally {
      setIsSavingAppointment(false)
    }
  }

  async function handleArchiveAppointment(appointmentId: string) {
    if (!user) return

    try {
      await archiveTutorAppointment(supabase, appointmentId, user.id)
      const archivedAt = new Date().toISOString()
      setAgendamentos((current) =>
        current.map((appointment) =>
          appointment.id === appointmentId ? { ...appointment, tutorArchivedAt: archivedAt } : appointment
        )
      )
      addToast("Agendamento arquivado.")
    } catch {
      addToast("Não foi possível arquivar o agendamento.", "error")
    }
  }

  async function handleRestoreAppointment(appointmentId: string) {
    if (!user) return

    try {
      await restoreTutorAppointment(supabase, appointmentId, user.id)
      setAgendamentos((current) =>
        current.map((appointment) =>
          appointment.id === appointmentId ? { ...appointment, tutorArchivedAt: null } : appointment
        )
      )
      addToast("Agendamento restaurado.")
    } catch {
      addToast("Não foi possível restaurar o agendamento.", "error")
    }
  }

  if (loading || isLoadingData) {
    return (
      <div className="min-h-screen bg-[#F5F4EE] dark:bg-slate-900 flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-[#5E929F]" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#F5F4EE] dark:bg-slate-900">
      <header className="border-b border-[#AAC9BA]/30 bg-white/85 dark:bg-slate-900/90 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
          <Link href="/" className="flex items-center gap-3">
            <img src="/logo-pet-shop.png" alt="Woofy" className="h-12 w-auto" />
          </Link>
          <Button variant="outline" onClick={handleSignOut} className="gap-2">
            <LogOut className="h-4 w-4" />
            Sair
          </Button>
        </div>
      </header>

      <main className="mx-auto max-w-7xl space-y-8 px-4 py-8 sm:px-6 lg:px-8">
        <section className="rounded-lg border border-[#AAC9BA]/40 bg-white p-6 shadow-sm dark:bg-slate-800">
          <p className="text-sm font-semibold uppercase tracking-wide text-[#5E929F]">Portal do tutor</p>
          <h1 className="mt-2 font-serif text-3xl font-bold text-[#305165] dark:text-white">
            Olá, {tutorName}
          </h1>
          <p className="mt-2 max-w-2xl text-sm text-slate-600 dark:text-slate-300">
            Acompanhe seus pets, solicite agendamentos e consulte vacinas e histórico registrados pela clínica.
          </p>
        </section>

        <section className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <SummaryCard icon={PawPrint} label="Meus Pets" value={pets.length} />
          <SummaryCard icon={CalendarDays} label="Meus Agendamentos" value={activeAppointments.length} />
          <SummaryCard icon={Syringe} label="Vacinas" value={vacinas.length} />
          <SummaryCard icon={ClipboardList} label="Retorno Médico" value={medicalReturns.length} />
        </section>

        <section className="grid gap-6 lg:grid-cols-[1fr_420px]">
          <Panel title="Meus Pets" icon={PawPrint}>
            {pets.length > 0 ? (
              <div className="grid gap-3 sm:grid-cols-2">
                {pets.map((pet) => (
                  <div key={pet.id} className="rounded-lg border border-border bg-background p-4">
                    <h3 className="font-semibold text-foreground">{pet.nome}</h3>
                    <p className="text-sm text-muted-foreground">
                      {pet.raca} - {speciesLabel(pet.especie)}
                    </p>
                    <p className="mt-2 text-sm text-muted-foreground">
                    {pet.peso ? `${pet.peso} kg` : "Peso não informado"}
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <EmptyState text="Nenhum pet cadastrado ainda." />
            )}
          </Panel>

          <Panel title="Cadastrar Pet" icon={Plus}>
            <form onSubmit={handleCreatePet} className="space-y-4">
              <Field label="Nome do pet" value={petForm.nome} onChange={(value) => setPetForm({ ...petForm, nome: value })} required />
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="especie">Espécie</Label>
                  <select
                    id="especie"
                    value={petForm.especie}
                    onChange={(event) => setPetForm({ ...petForm, especie: event.target.value as Especie })}
                    className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm"
                  >
                    <option value="cao">Cão</option>
                    <option value="gato">Gato</option>
                    <option value="aves">Aves</option>
                    <option value="roedores">Roedores</option>
                    <option value="coelhos">Coelhos</option>
                  </select>
                </div>
                <Field label="Raça" value={petForm.raca} onChange={(value) => setPetForm({ ...petForm, raca: value })} required />
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <Field label="Nascimento" type="date" value={petForm.data_nascimento} onChange={(value) => setPetForm({ ...petForm, data_nascimento: value })} />
                <Field label="Peso" type="number" value={petForm.peso} onChange={(value) => setPetForm({ ...petForm, peso: value })} />
              </div>
              <Field label="Telefone" value={petForm.telefone_tutor} onChange={(value) => setPetForm({ ...petForm, telefone_tutor: value })} />
              <Button type="submit" disabled={isSavingPet} className="w-full gap-2">
                {isSavingPet && <Loader2 className="h-4 w-4 animate-spin" />}
                Salvar pet
              </Button>
            </form>
          </Panel>
        </section>

        <section className="grid gap-6 lg:grid-cols-2">
          <Panel title="Meus Agendamentos" icon={CalendarDays}>
            {activeAppointments.length > 0 ? (
              <div className="space-y-3">
                {activeAppointments.map((agendamento) => (
                  <div key={agendamento.id} className="rounded-lg border border-border bg-background p-4">
                    <div className="flex flex-wrap items-start justify-between gap-3">
                      <div>
                        <p className="font-semibold text-foreground">
                          {agendamento.petNome} - {agendamento.tipo}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {agendamento.data} as {agendamento.horarioInicio}
                        </p>
                        <p className="text-sm text-muted-foreground">{agendamento.veterinarianDisplayName}</p>
                        {agendamento.precoEstimado != null && (
                          <p className="text-sm text-muted-foreground">Valor a pagar: {formatCurrency(agendamento.precoEstimado)}</p>
                        )}
                      </div>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => handleArchiveAppointment(agendamento.id)}
                      >
                        Arquivar
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <EmptyState text="Nenhum agendamento encontrado." />
            )}
          </Panel>

          <Panel title="Marcar Agendamento" icon={Plus}>
            <form onSubmit={handleCreateAppointment} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="pet">Pet</Label>
                <select
                  id="pet"
                  required
                  value={appointmentForm.pet_id}
                  onChange={(event) => setAppointmentForm({ ...appointmentForm, pet_id: event.target.value })}
                  className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm"
                >
                  <option value="">Selecione</option>
                  {pets.map((pet) => (
                    <option key={pet.id} value={pet.id}>{pet.nome}</option>
                  ))}
                </select>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <Field label="Data" type="date" value={appointmentForm.data} onChange={(value) => setAppointmentForm({ ...appointmentForm, data: value })} required />
                <Field label="Horário" type="time" value={appointmentForm.horario_inicio} onChange={(value) => setAppointmentForm({ ...appointmentForm, horario_inicio: value })} required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="veterinario">Veterinário</Label>
                <select
                  id="veterinario"
                  required
                  value={appointmentForm.veterinario_id}
                  onChange={(event) => setAppointmentForm({ ...appointmentForm, veterinario_id: event.target.value })}
                  className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm"
                >
                  <option value="">Selecione</option>
                  {veterinarians.map((vet) => (
                    <option key={vet.id} value={vet.id}>
                      {vet.full_name || "Veterinário sem nome"} - {vet.crmv}
                    </option>
                  ))}
                </select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="appointmentType">Tipo</Label>
                <select
                  id="appointmentType"
                  required
                  value={appointmentForm.tipo}
                  onChange={(event) => setAppointmentForm({ ...appointmentForm, tipo: event.target.value })}
                  className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm"
                >
                  <option value="Consulta">Consulta</option>
                  <option value="Vacinas">Vacinas</option>
                </select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="observacoes">Observações</Label>
                <Textarea
                  id="observacoes"
                  value={appointmentForm.observacoes}
                  onChange={(event) => setAppointmentForm({ ...appointmentForm, observacoes: event.target.value })}
                  className="min-h-20"
                />
              </div>
              <Button type="submit" disabled={isSavingAppointment || pets.length === 0 || veterinarians.length === 0} className="w-full gap-2">
                {isSavingAppointment && <Loader2 className="h-4 w-4 animate-spin" />}
                Solicitar agendamento
              </Button>
            </form>
          </Panel>
        </section>

        <section className="grid gap-6 lg:grid-cols-2">
          <Panel title="Resumo financeiro" icon={ClipboardList}>
            <div className="grid gap-3 sm:grid-cols-3">
              <InfoRow title="Consultas" subtitle={formatCurrency(financialSummary.consultationTotal)} />
              <InfoRow title="Vacinas" subtitle={formatCurrency(financialSummary.vaccineTotal)} />
              <InfoRow title="Total" subtitle={formatCurrency(financialSummary.total)} />
            </div>
          </Panel>

          <Panel title="Agendamentos arquivados" icon={CalendarDays}>
            {archivedAppointments.length > 0 ? (
              <div className="space-y-3">
                {archivedAppointments.map((agendamento) => (
                  <div key={agendamento.id} className="rounded-lg border border-border bg-background p-4">
                    <div className="flex flex-wrap items-start justify-between gap-3">
                      <div>
                        <p className="font-semibold text-foreground">
                          {agendamento.petNome} - {agendamento.tipo}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {agendamento.data} as {agendamento.horarioInicio}
                        </p>
                        <p className="text-sm text-muted-foreground">{agendamento.veterinarianDisplayName}</p>
                      </div>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => handleRestoreAppointment(agendamento.id)}
                      >
                        Restaurar
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <EmptyState text="Nenhum agendamento arquivado." />
            )}
          </Panel>
        </section>

        <section className="grid gap-6 lg:grid-cols-2">
          <Panel title="Vacinas dos meus Pets" icon={Syringe}>
            {vacinas.length > 0 ? (
              <div className="space-y-3">
                {vacinas.map((vacina) => (
                  <InfoRow
                    key={vacina.id}
                    title={vacina.vacina}
                    subtitle={`${vacina.petNome || "Pet"} - próxima dose: ${vacina.proximaDose || "não definida"}`}
                  />
                ))}
              </div>
            ) : (
              <EmptyState text="Nenhuma vacina registrada para seus pets." />
            )}
          </Panel>

          <Panel title="Retorno Médico" icon={ClipboardList}>
            {medicalReturns.length > 0 ? (
              <div className="space-y-3">
                {medicalReturns.map((item) => (
                  <InfoRow
                    key={item.id}
                    title={`${item.petNome} - ${item.tipo}`}
                    subtitle={`${item.data}: ${item.text} (${item.veterinarianDisplayName})`}
                  />
                ))}
              </div>
            ) : (
              <EmptyState text="Nenhum retorno médico registrado." />
            )}
          </Panel>
        </section>
      </main>
    </div>
  )
}

function SummaryCard({ icon: Icon, label, value }: { icon: typeof PawPrint; label: string; value: number }) {
  return (
    <div className="rounded-lg border border-[#AAC9BA]/40 bg-white p-5 shadow-sm dark:bg-slate-800">
      <Icon className="h-5 w-5 text-[#5E929F]" />
      <p className="mt-3 text-sm text-slate-600 dark:text-slate-300">{label}</p>
      <p className="font-serif text-3xl font-bold text-[#305165] dark:text-white">{value}</p>
    </div>
  )
}

function Panel({ title, icon: Icon, children }: { title: string; icon: typeof PawPrint; children: React.ReactNode }) {
  return (
    <section className="rounded-lg border border-border bg-card p-5 shadow-sm">
      <div className="mb-4 flex items-center gap-2">
        <Icon className="h-5 w-5 text-[#5E929F]" />
        <h2 className="font-serif text-xl font-bold text-card-foreground">{title}</h2>
      </div>
      {children}
    </section>
  )
}

function Field({
  label,
  value,
  onChange,
  type = "text",
  required = false,
}: {
  label: string
  value: string
  onChange: (value: string) => void
  type?: string
  required?: boolean
}) {
  const id = label.toLowerCase().replace(/\s+/g, "-")
  return (
    <div className="space-y-2">
      <Label htmlFor={id}>{label}</Label>
      <Input id={id} type={type} required={required} value={value} onChange={(event) => onChange(event.target.value)} />
    </div>
  )
}

function InfoRow({ title, subtitle }: { title: string; subtitle: string }) {
  return (
    <div className="rounded-lg border border-border bg-background p-4">
      <p className="font-semibold text-foreground">{title}</p>
      <p className="text-sm text-muted-foreground">{subtitle}</p>
    </div>
  )
}

function EmptyState({ text }: { text: string }) {
  return (
    <div className="rounded-lg border border-dashed border-border bg-background p-8 text-center text-sm text-muted-foreground">
      {text}
    </div>
  )
}
