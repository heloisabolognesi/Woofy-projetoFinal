"use client"

import { useCallback, useEffect, useMemo, useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { CalendarDays, CheckCircle2, ClipboardList, Loader2, LogOut, Stethoscope, Syringe } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { useAuth } from "@/context/auth-context"
import { createClient } from "@/lib/supabase"
import {
  createVaccineRecord,
  createConsultationWithHistory,
  getPetsForVeterinarianWorkflow,
  getVeterinarianVaccines,
  getVeterinarianAppointments,
  type AdminVaccine,
  type AgendamentoStatus,
  type ClinicAppointmentDetail,
  type ClinicPetOption,
  type HistoricoTipo,
} from "@/lib/clinic-data"

const today = new Date().toISOString().split("T")[0]
type ClinicalStateFilter = "todos" | "feedback-pendente" | "feedback-registrado" | "historico-pendente" | "historico-registrado" | "consulta-realizada"
type AssignmentFilter = "meus" | "sem-veterinario" | "disponiveis"
type OrderFilter = "proximos" | "distantes" | "criados-recentes" | "criados-antigos"

export default function VeterinarioPage() {
  const { user, profile, loading, refreshProfile, signOut } = useAuth()
  const router = useRouter()
  const supabase = useMemo(() => createClient(), [])
  const [agendamentos, setAgendamentos] = useState<ClinicAppointmentDetail[]>([])
  const [vaccinePets, setVaccinePets] = useState<ClinicPetOption[]>([])
  const [vaccineRecords, setVaccineRecords] = useState<AdminVaccine[]>([])
  const [selectedAppointmentId, setSelectedAppointmentId] = useState("")
  const [feedback, setFeedback] = useState("")
  const [historyDescription, setHistoryDescription] = useState("")
  const [historyType, setHistoryType] = useState<HistoricoTipo>("consulta")
  const [historyDate, setHistoryDate] = useState(today)
  const [vaccineForm, setVaccineForm] = useState({
    petId: "",
    vacina: "",
    dataAplicacao: today,
    proximaDose: "",
  })
  const [statusFilter, setStatusFilter] = useState<"todos" | AgendamentoStatus>("todos")
  const [clinicalStateFilter, setClinicalStateFilter] = useState<ClinicalStateFilter>("todos")
  const [assignmentFilter, setAssignmentFilter] = useState<AssignmentFilter>("disponiveis")
  const [orderFilter, setOrderFilter] = useState<OrderFilter>("proximos")
  const [isLoadingData, setIsLoadingData] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [isSavingVaccine, setIsSavingVaccine] = useState(false)
  const [message, setMessage] = useState<string | null>(null)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  const selectedAppointment = agendamentos.find((item) => item.id === selectedAppointmentId) || null
  const veterinarianName = profile?.full_name || user?.email || "Veterinário"
  const activeAppointments = agendamentos.filter((appointment) =>
    appointment.status === "agendado" || appointment.status === "confirmado"
  )
  const filteredAppointments = useMemo(() => {
    return [...agendamentos]
      .filter((appointment) => {
        if (statusFilter !== "todos" && appointment.status !== statusFilter) return false

        if (clinicalStateFilter === "feedback-pendente" && appointment.consultation) return false
        if (clinicalStateFilter === "feedback-registrado" && !appointment.consultation) return false
        if (clinicalStateFilter === "historico-pendente" && appointment.historyEntry) return false
        if (clinicalStateFilter === "historico-registrado" && !appointment.historyEntry) return false
        if (clinicalStateFilter === "consulta-realizada" && appointment.status !== "realizado" && !appointment.consultation) return false

        if (assignmentFilter === "meus" && appointment.veterinarioId !== user?.id) return false
        if (assignmentFilter === "sem-veterinario" && appointment.veterinarioId) return false
        if (assignmentFilter === "disponiveis" && appointment.veterinarioId && appointment.veterinarioId !== user?.id) return false

        return true
      })
      .sort((a, b) => {
        if (orderFilter === "criados-recentes" || orderFilter === "criados-antigos") {
          const comparison = new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
          return orderFilter === "criados-recentes" ? -comparison : comparison
        }

        const comparison = `${a.data}T${a.horarioInicio}`.localeCompare(`${b.data}T${b.horarioInicio}`)
        return orderFilter === "proximos" ? comparison : -comparison
      })
  }, [agendamentos, assignmentFilter, clinicalStateFilter, orderFilter, statusFilter, user?.id])

  const loadVeterinarianData = useCallback(async (preferredAppointmentId?: string) => {
    if (!user) return

    setIsLoadingData(true)
    setErrorMessage(null)
    await refreshProfile(user.id)

    try {
      const [appointments, petsForVaccines, vaccines] = await Promise.all([
        getVeterinarianAppointments(supabase, user.id),
        getPetsForVeterinarianWorkflow(supabase, user.id),
        getVeterinarianVaccines(supabase, user.id),
      ])
      setAgendamentos(appointments)
      setVaccinePets(petsForVaccines)
      setVaccineRecords(vaccines)
      setVaccineForm((current) => ({
        ...current,
        petId: current.petId && petsForVaccines.some((pet) => pet.id === current.petId)
          ? current.petId
          : petsForVaccines[0]?.id || "",
      }))
      setSelectedAppointmentId((current) => {
        const nextSelectedId = preferredAppointmentId || current
        if (nextSelectedId && appointments.some((appointment) => appointment.id === nextSelectedId)) {
          return nextSelectedId
        }
        return appointments[0]?.id || ""
      })
    } catch {
      setErrorMessage("Não foi possível carregar os agendamentos.")
    } finally {
      setIsLoadingData(false)
    }
  }, [refreshProfile, supabase, user])

  useEffect(() => {
    if (loading) return
    if (!user) {
      router.replace("/login?redirect=/veterinario")
      return
    }

    loadVeterinarianData()
  }, [loadVeterinarianData, loading, router, user])

  useEffect(() => {
    if (!selectedAppointment) return

    if (selectedAppointment.consultation) {
      setFeedback(selectedAppointment.consultation.motivo)
      setHistoryDescription(selectedAppointment.historyEntry?.descricao || "")
      setHistoryType(selectedAppointment.historyEntry?.tipo || "consulta")
      setHistoryDate(selectedAppointment.historyEntry?.data || today)
      return
    }

    setFeedback("")
    setHistoryDescription("")
    setHistoryType("consulta")
    setHistoryDate(today)
  }, [selectedAppointment])

  useEffect(() => {
    if (filteredAppointments.length === 0) {
      setSelectedAppointmentId("")
      return
    }

    setSelectedAppointmentId((current) =>
      filteredAppointments.some((appointment) => appointment.id === current)
        ? current
        : filteredAppointments[0].id
    )
  }, [filteredAppointments])

  async function handleSignOut() {
    await signOut()
    router.replace("/")
  }

  async function handleSaveClinicalRecord(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (!user || !selectedAppointment) {
      setErrorMessage("Selecione um agendamento.")
      return
    }
    if (!feedback.trim() && !historyDescription.trim()) {
      setErrorMessage("Escreva o feedback da consulta ou a descrição do histórico.")
      return
    }
    if (selectedAppointment.consultation && selectedAppointment.historyEntry) {
      setErrorMessage("Este agendamento já possui feedback e histórico registrados.")
      return
    }
    if (selectedAppointment.status === "cancelado") {
      setErrorMessage("Agendamentos cancelados não podem receber registros clínicos.")
      return
    }

    setIsSaving(true)
    setMessage(null)
    setErrorMessage(null)

    try {
      await createConsultationWithHistory(supabase, {
        appointment: selectedAppointment,
        veterinarianId: user.id,
        veterinarianName,
        feedback: feedback.trim(),
        historyDescription: historyDescription.trim(),
        historyType,
        historyDate,
      })
      await loadVeterinarianData(selectedAppointment.id)
    } catch {
      setIsSaving(false)
      setErrorMessage("Não foi possível salvar o registro clínico. Verifique se as migrations de permissões foram aplicadas.")
      return
    }

    setIsSaving(false)
    setMessage(`Registro clínico salvo para ${selectedAppointment.petNome}.`)
  }

  async function handleCreateVaccine(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (!user) return

    const selectedPet = vaccinePets.find((pet) => pet.id === vaccineForm.petId)
    if (!selectedPet) {
      setErrorMessage("Selecione um pet para registrar a vacina.")
      return
    }
    if (!vaccineForm.vacina.trim() || !vaccineForm.dataAplicacao) {
      setErrorMessage("Informe a vacina e a data de aplicação.")
      return
    }

    setIsSavingVaccine(true)
    setMessage(null)
    setErrorMessage(null)

    try {
      await createVaccineRecord(supabase, {
        petId: selectedPet.id,
        userId: selectedPet.userId,
        vacina: vaccineForm.vacina.trim(),
        dataAplicacao: vaccineForm.dataAplicacao,
        proximaDose: vaccineForm.proximaDose || null,
        veterinarioId: user.id,
      })
      setVaccineForm({
        petId: selectedPet.id,
        vacina: "",
        dataAplicacao: today,
        proximaDose: "",
      })
      setVaccineRecords(await getVeterinarianVaccines(supabase, user.id))
      setMessage(`Vacina registrada para ${selectedPet.nome}.`)
    } catch {
      setErrorMessage("Não foi possível registrar a vacina.")
    } finally {
      setIsSavingVaccine(false)
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
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
          <Link href="/">
            <img src="/logo-pet-shop.png" alt="Woofy" className="h-12 w-auto" />
          </Link>
          <Button variant="outline" onClick={handleSignOut} className="gap-2">
            <LogOut className="h-4 w-4" />
            Sair
          </Button>
        </div>
      </header>

      <main className="mx-auto max-w-6xl space-y-6 px-4 py-8 sm:px-6 lg:px-8">
        <section className="rounded-lg border border-[#AAC9BA]/40 bg-white p-6 shadow-sm dark:bg-slate-800">
          <p className="text-sm font-semibold uppercase tracking-wide text-[#5E929F]">Área veterinária</p>
          <h1 className="mt-2 font-serif text-3xl font-bold text-[#305165] dark:text-white">
            Olá, {profile?.full_name || "veterinário"}
          </h1>
          <p className="mt-2 max-w-2xl text-sm text-slate-600 dark:text-slate-300">
            Consulte os agendamentos reais da clínica e registre feedback clínico para o histórico do pet.
          </p>
          {message && <p className="mt-3 text-sm font-medium text-green-700">{message}</p>}
          {errorMessage && <p className="mt-3 text-sm font-medium text-destructive">{errorMessage}</p>}
        </section>

        <section className="grid gap-4 md:grid-cols-4">
          <SummaryCard icon={CalendarDays} title="Agendamentos" value={agendamentos.length} />
          <SummaryCard icon={Stethoscope} title="Ativos" value={activeAppointments.length} />
          <SummaryCard icon={ClipboardList} title="Feedbacks registrados" value={agendamentos.filter((item) => item.consultation).length} />
          <SummaryCard icon={ClipboardList} title="Históricos registrados" value={agendamentos.filter((item) => item.historyEntry).length} />
        </section>

        <section className="grid gap-6 lg:grid-cols-[1fr_420px]">
          <Panel title="Ver agendamentos" icon={CalendarDays}>
            <div className="mb-4 grid gap-3 sm:grid-cols-2">
              <FilterSelect
                label="Status"
                value={statusFilter}
                onChange={(value) => setStatusFilter(value as "todos" | AgendamentoStatus)}
                options={[
                  ["todos", "Todos"],
                  ["agendado", "Agendados"],
                  ["confirmado", "Confirmados"],
                  ["realizado", "Realizados"],
                  ["cancelado", "Cancelados"],
                ]}
              />
              <FilterSelect
                label="Estado clínico"
                value={clinicalStateFilter}
                onChange={(value) => setClinicalStateFilter(value as ClinicalStateFilter)}
                options={[
                  ["todos", "Todos"],
                  ["feedback-pendente", "Feedback pendente"],
                  ["feedback-registrado", "Feedback registrado"],
                  ["historico-pendente", "Histórico pendente"],
                  ["historico-registrado", "Histórico registrado"],
                  ["consulta-realizada", "Consulta realizada"],
                ]}
              />
              <FilterSelect
                label="Atribuição"
                value={assignmentFilter}
                onChange={(value) => setAssignmentFilter(value as AssignmentFilter)}
                options={[
                  ["meus", "Meus agendamentos"],
                  ["sem-veterinario", "Sem veterinário definido"],
                  ["disponiveis", "Todos disponíveis"],
                ]}
              />
              <FilterSelect
                label="Ordem"
                value={orderFilter}
                onChange={(value) => setOrderFilter(value as OrderFilter)}
                options={[
                  ["proximos", "Mais próximos primeiro"],
                  ["distantes", "Mais distantes primeiro"],
                  ["criados-recentes", "Mais recentes criados"],
                  ["criados-antigos", "Mais antigos criados"],
                ]}
              />
            </div>

            {filteredAppointments.length > 0 ? (
              <div className="space-y-3">
                {filteredAppointments.map((appointment) => {
                  const isSelected = appointment.id === selectedAppointmentId

                  return (
                    <button
                      key={appointment.id}
                      type="button"
                      onClick={() => setSelectedAppointmentId(appointment.id)}
                      className={`w-full rounded-lg border p-4 text-left transition ${
                        isSelected ? "border-[#5E929F] bg-[#AAC9BA]/15" : "border-border bg-background hover:bg-muted/40"
                      }`}
                    >
                      <div className="flex flex-wrap items-start justify-between gap-3">
                        <div>
                          <p className="font-semibold text-foreground">{appointment.petNome}</p>
                          <p className="text-sm text-muted-foreground">
                            Tutor: {appointment.tutorDisplayName}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            Veterinário: {appointment.veterinarianDisplayName}
                          </p>
                        </div>
                        <div className="text-left sm:text-right">
                          <p className="text-sm font-medium text-foreground">
                            {appointment.data} as {appointment.horarioInicio}
                          </p>
                          <p className="text-sm text-muted-foreground">{appointment.tipo}</p>
                          <p className="text-xs uppercase text-muted-foreground">{statusLabel(appointment.status)}</p>
                          <div className="mt-2 flex flex-wrap gap-1 sm:justify-end">
                            {appointment.status === "realizado" && <RecordBadge>Consulta realizada</RecordBadge>}
                            <RecordBadge muted={!appointment.consultation}>
                              {appointment.consultation ? "Feedback registrado" : "Feedback pendente"}
                            </RecordBadge>
                            <RecordBadge muted={!appointment.historyEntry}>
                              {appointment.historyEntry ? "Histórico registrado" : "Histórico pendente"}
                            </RecordBadge>
                          </div>
                        </div>
                      </div>
                    </button>
                  )
                })}
              </div>
            ) : (
              <EmptyState text="Nenhum agendamento encontrado para os filtros escolhidos." />
            )}
          </Panel>

          <Panel title="Feedback e Histórico" icon={Stethoscope}>
            <form onSubmit={handleSaveClinicalRecord} className="space-y-4">
              {selectedAppointment && (
                <div className="rounded-lg border border-border bg-background p-4 text-sm">
                  <div className="grid gap-2">
                    <InfoLine label="Pet" value={`${selectedAppointment.pet.nome} - ${selectedAppointment.pet.raca}`} />
                    <InfoLine label="Tutor" value={selectedAppointment.tutorDisplayName} />
                    <InfoLine label="Data" value={`${selectedAppointment.data} ${selectedAppointment.horarioInicio}-${selectedAppointment.horarioFim}`} />
                    <InfoLine label="Status" value={statusLabel(selectedAppointment.status)} />
                    <InfoLine label="Veterinário" value={selectedAppointment.veterinarianDisplayName} />
                    <InfoLine
                      label="Feedback"
                      value={selectedAppointment.consultation ? "Registrado" : "Ainda não registrado"}
                    />
                    <InfoLine
                      label="Histórico"
                      value={selectedAppointment.historyEntry ? "Registrado" : "Ainda não registrado"}
                    />
                  </div>
                  {selectedAppointment.consultation && (
                    <div className="mt-4 border-t border-border pt-3">
                      <p className="font-medium text-foreground">Feedback da consulta</p>
                      <p className="mt-1 text-muted-foreground">{selectedAppointment.consultation.motivo}</p>
                    </div>
                  )}
                  {selectedAppointment.historyEntry && (
                    <div className="mt-4 border-t border-border pt-3">
                      <p className="font-medium text-foreground">Histórico do pet</p>
                      <p className="mt-1 text-muted-foreground">{selectedAppointment.historyEntry.descricao}</p>
                    </div>
                  )}
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="selectedAppointment">Agendamento</Label>
                <select
                  id="selectedAppointment"
                  required
                  value={selectedAppointmentId}
                  onChange={(event) => setSelectedAppointmentId(event.target.value)}
                  className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm"
                >
                  <option value="">Selecione</option>
                  {filteredAppointments.map((appointment) => (
                    <option key={appointment.id} value={appointment.id}>
                      {appointment.petNome} - {appointment.data} {appointment.horarioInicio} - {appointment.status}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <Field label="Data" type="date" value={historyDate} onChange={setHistoryDate} required />
                <div className="space-y-2">
                  <Label htmlFor="historyType">Tipo</Label>
                  <select
                    id="historyType"
                    value={historyType}
                    onChange={(event) => setHistoryType(event.target.value as HistoricoTipo)}
                    disabled={!!selectedAppointment?.historyEntry}
                    className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm"
                  >
                    <option value="consulta">Consulta</option>
                    <option value="vacina">Vacina</option>
                    <option value="exame">Exame</option>
                  </select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="feedback">Feedback da consulta</Label>
                <Textarea
                  id="feedback"
                  value={feedback}
                  onChange={(event) => setFeedback(event.target.value)}
                  readOnly={!!selectedAppointment?.consultation}
                  className="min-h-28"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="historyDescription">Descrição do histórico</Label>
                <Textarea
                  id="historyDescription"
                  value={historyDescription}
                  onChange={(event) => setHistoryDescription(event.target.value)}
                  readOnly={!!selectedAppointment?.historyEntry}
                  className="min-h-24"
                />
              </div>

              <Button
                type="submit"
                disabled={
                  isSaving ||
                  !selectedAppointmentId ||
                  selectedAppointment?.status === "cancelado" ||
                  (!!selectedAppointment?.consultation && !!selectedAppointment?.historyEntry)
                }
                className="w-full gap-2"
              >
                {isSaving && <Loader2 className="h-4 w-4 animate-spin" />}
                {selectedAppointment?.consultation && selectedAppointment?.historyEntry
                  ? "Registros já salvos"
                  : "Salvar registro clínico"}
              </Button>
            </form>
          </Panel>
        </section>

        <Panel title="Registrar vacina" icon={Syringe}>
          <form onSubmit={handleCreateVaccine} className="grid gap-4 md:grid-cols-[1.2fr_1fr_1fr_1fr_auto] md:items-end">
            <div className="space-y-2">
              <Label htmlFor="vaccinePet">Pet</Label>
              <select
                id="vaccinePet"
                required
                value={vaccineForm.petId}
                onChange={(event) => setVaccineForm({ ...vaccineForm, petId: event.target.value })}
                className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm"
              >
                <option value="">Selecione</option>
                {vaccinePets.map((pet) => (
                  <option key={pet.id} value={pet.id}>
                    {pet.nome} - {pet.tutorDisplayName}
                  </option>
                ))}
              </select>
            </div>
            <Field
              label="Vacina"
              value={vaccineForm.vacina}
              onChange={(value) => setVaccineForm({ ...vaccineForm, vacina: value })}
              required
            />
            <Field
              label="Aplicação"
              type="date"
              value={vaccineForm.dataAplicacao}
              onChange={(value) => setVaccineForm({ ...vaccineForm, dataAplicacao: value })}
              required
            />
            <Field
              label="Próxima dose"
              type="date"
              value={vaccineForm.proximaDose}
              onChange={(value) => setVaccineForm({ ...vaccineForm, proximaDose: value })}
            />
            <Button type="submit" disabled={isSavingVaccine || vaccinePets.length === 0} className="gap-2">
              {isSavingVaccine && <Loader2 className="h-4 w-4 animate-spin" />}
              Salvar
            </Button>
          </form>
        </Panel>

        <Panel title="Vacinas registradas" icon={Syringe}>
          {vaccineRecords.length > 0 ? (
            <div className="grid gap-3 md:grid-cols-2">
              {vaccineRecords.map((vacina) => (
                <div key={vacina.id} className="rounded-lg border border-border bg-background p-4">
                  <p className="font-semibold text-foreground">{vacina.petNome} - {vacina.vacina}</p>
                  <p className="text-sm text-muted-foreground">Tutor: {vacina.tutorDisplayName}</p>
                  <p className="text-sm text-muted-foreground">Aplicação: {vacina.dataAplicacao}</p>
                  <p className="text-sm text-muted-foreground">
                    Próxima dose: {vacina.proximaDose || "não definida"}
                  </p>
                  <p className="text-sm text-muted-foreground">Criada em: {new Date(vacina.createdAt).toLocaleDateString("pt-BR")}</p>
                </div>
              ))}
            </div>
          ) : (
            <EmptyState text="Nenhuma vacina registrada." />
          )}
        </Panel>
      </main>
    </div>
  )
}

function SummaryCard({ icon: Icon, title, value }: { icon: typeof CalendarDays; title: string; value: string | number }) {
  return (
    <div className="rounded-lg border border-border bg-card p-5 shadow-sm">
      <Icon className="h-5 w-5 text-[#5E929F]" />
      <h2 className="mt-3 font-serif text-xl font-bold text-card-foreground">{title}</h2>
      <p className="mt-1 text-sm text-muted-foreground">{value}</p>
    </div>
  )
}

function FilterSelect({
  label,
  value,
  onChange,
  options,
}: {
  label: string
  value: string
  onChange: (value: string) => void
  options: [string, string][]
}) {
  const id = label.toLowerCase().replace(/\s+/g, "-")
  return (
    <div className="space-y-2">
      <Label htmlFor={id}>{label}</Label>
      <select
        id={id}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm"
      >
        {options.map(([optionValue, optionLabel]) => (
          <option key={optionValue} value={optionValue}>
            {optionLabel}
          </option>
        ))}
      </select>
    </div>
  )
}

function Panel({ title, icon: Icon, children }: { title: string; icon: typeof CalendarDays; children: React.ReactNode }) {
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

function InfoLine({ label, value }: { label: string; value: string }) {
  return (
    <p className="text-muted-foreground">
      <span className="font-medium text-foreground">{label}:</span> {value}
    </p>
  )
}

function RecordBadge({ children, muted = false }: { children: React.ReactNode; muted?: boolean }) {
  return (
    <span className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-medium ${
      muted ? "bg-muted text-muted-foreground" : "bg-[#AAC9BA]/25 text-[#305165] dark:text-[#F5F4EE]"
    }`}>
      {!muted && <CheckCircle2 className="h-3 w-3" />}
      {children}
    </span>
  )
}

function statusLabel(status: string) {
  const labels: Record<string, string> = {
    agendado: "Agendado",
    confirmado: "Confirmado",
    realizado: "Realizado",
    cancelado: "Cancelado",
  }
  return labels[status] || status
}

function EmptyState({ text }: { text: string }) {
  return (
    <div className="rounded-lg border border-dashed border-border bg-background p-6 text-center text-sm text-muted-foreground">
      {text}
    </div>
  )
}
