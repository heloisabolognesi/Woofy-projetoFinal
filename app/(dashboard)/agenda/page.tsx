"use client"

import { useEffect, useMemo, useState } from "react"
import { useRouter } from "next/navigation"
import { useApp } from "@/context/app-context"
import { useAuth } from "@/context/auth-context"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Plus, ChevronLeft, ChevronRight, CalendarDays, Clock, User, Loader2 } from "lucide-react"
import { cn } from "@/lib/utils"
import { createClient } from "@/lib/supabase"
import {
  assignVeterinarianToAppointment,
  createAdminAppointment,
  getAdminAppointments,
  getAdminPets,
  getApprovedVeterinarians,
  updateAppointmentStatus,
  type AdminAppointment,
  type AdminPet,
  type AgendamentoStatus,
  type VeterinarianOption,
} from "@/lib/clinic-data"

const colorClasses = ["bg-primary", "bg-secondary", "bg-woofy-gold", "bg-woofy-accent"]
const unassignedVeterinarianValue = "__unassigned"

function getWeekDays(startDate: Date): Date[] {
  const days: Date[] = []
  const start = new Date(startDate)
  const day = start.getDay()
  const diff = start.getDate() - day + (day === 0 ? -6 : 1)
  start.setDate(diff)

  for (let i = 0; i < 7; i++) {
    days.push(new Date(start))
    start.setDate(start.getDate() + 1)
  }

  return days
}

function formatDateKey(date: Date): string {
  return date.toISOString().split("T")[0]
}

interface FormData {
  petId: string
  data: string
  horarioInicio: string
  horarioFim: string
  veterinarioId: string
  tipo: string
}

export default function AgendaPage() {
  const { addToast } = useApp()
  const { user, loading, refreshProfile } = useAuth()
  const router = useRouter()
  const supabase = useMemo(() => createClient(), [])
  const [currentDate, setCurrentDate] = useState(new Date())
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedAgendamento, setSelectedAgendamento] = useState<AdminAppointment | null>(null)
  const [agendamentos, setAgendamentos] = useState<AdminAppointment[]>([])
  const [pets, setPets] = useState<AdminPet[]>([])
  const [veterinarios, setVeterinarios] = useState<VeterinarianOption[]>([])
  const [isLoadingData, setIsLoadingData] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [formData, setFormData] = useState<FormData>({
    petId: "",
    data: "",
    horarioInicio: "",
    horarioFim: "",
    veterinarioId: "",
    tipo: "",
  })

  const vetColors = useMemo(() => {
    return veterinarios.reduce<Record<string, string>>((acc, vet, index) => {
      acc[vet.full_name || vet.id] = colorClasses[index % colorClasses.length]
      return acc
    }, {})
  }, [veterinarios])

  const weekDays = useMemo(() => getWeekDays(currentDate), [currentDate])

  const agendamentosByDay = useMemo(() => {
    const map: Record<string, AdminAppointment[]> = {}
    agendamentos.forEach((appointment) => {
      if (!map[appointment.data]) map[appointment.data] = []
      map[appointment.data].push(appointment)
    })
    Object.values(map).forEach((arr) =>
      arr.sort((a, b) => a.horarioInicio.localeCompare(b.horarioInicio))
    )
    return map
  }, [agendamentos])

  useEffect(() => {
    async function loadData() {
      if (loading) return
      if (!user) {
        router.replace("/login?redirect=/agenda")
        return
      }

      setIsLoadingData(true)
      await refreshProfile(user.id)

      try {
        const [appointmentsResult, petsResult, veterinariansResult] = await Promise.all([
          getAdminAppointments(supabase),
          getAdminPets(supabase),
          getApprovedVeterinarians(supabase),
        ])
        setAgendamentos(appointmentsResult)
        setPets(petsResult)
        setVeterinarios(veterinariansResult)
      } catch {
        addToast("Não foi possível carregar a agenda real do Supabase.", "error")
      } finally {
        setIsLoadingData(false)
      }
    }

    loadData()
  }, [addToast, loading, refreshProfile, router, supabase, user])

  const navigateWeek = (direction: "prev" | "next") => {
    const newDate = new Date(currentDate)
    newDate.setDate(newDate.getDate() + (direction === "next" ? 7 : -7))
    setCurrentDate(newDate)
  }

  const goToToday = () => {
    setCurrentDate(new Date())
  }

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault()

    const selectedVet = veterinarios.find((vet) => vet.id === formData.veterinarioId)
    setIsSaving(true)

    try {
      const newAppointment = await createAdminAppointment(supabase, {
        petId: formData.petId,
        data: formData.data,
        horarioInicio: formData.horarioInicio,
        horarioFim: formData.horarioFim,
        veterinario: selectedVet?.full_name || "A definir",
        veterinarioId: selectedVet?.id || null,
        tipo: formData.tipo,
      })

      setAgendamentos((prev) => [...prev, newAppointment])
      addToast("Agendamento criado com sucesso!")
      setIsModalOpen(false)
      setFormData({
        petId: "",
        data: "",
        horarioInicio: "",
        horarioFim: "",
        veterinarioId: "",
        tipo: "",
      })
    } catch {
      addToast("Não foi possível criar o agendamento.", "error")
    } finally {
      setIsSaving(false)
    }
  }

  const handleStatusChange = async (appointment: AdminAppointment, status: AgendamentoStatus) => {
    try {
      await updateAppointmentStatus(supabase, appointment.id, status)
      setAgendamentos((prev) =>
        prev.map((item) => (item.id === appointment.id ? { ...item, status } : item))
      )
      setSelectedAgendamento((current) => (current ? { ...current, status } : current))
      addToast("Status atualizado com sucesso!")
    } catch {
      addToast("Não foi possível atualizar o status.", "error")
    }
  }

  const handleVeterinarianChange = async (appointment: AdminAppointment, veterinarianId: string) => {
    const selectedVet = veterinarianId === unassignedVeterinarianValue
      ? null
      : veterinarios.find((vet) => vet.id === veterinarianId) || null
    const veterinarianName = selectedVet?.full_name || "A definir"

    try {
      await assignVeterinarianToAppointment(supabase, appointment.id, selectedVet?.id || null, veterinarianName)
      setAgendamentos((prev) =>
        prev.map((item) =>
          item.id === appointment.id
            ? { ...item, veterinarioId: selectedVet?.id || null, veterinario: veterinarianName }
            : item
        )
      )
      setSelectedAgendamento((current) =>
        current ? { ...current, veterinarioId: selectedVet?.id || null, veterinario: veterinarianName } : current
      )
      addToast("Veterinário atribuído com sucesso!")
    } catch {
      addToast("Não foi possível atribuir o veterinário.", "error")
    }
  }

  const formatDayHeader = (date: Date) => {
    const dayNames = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sab"]
    return {
      dayName: dayNames[date.getDay()],
      dayNumber: date.getDate(),
      isToday: formatDateKey(date) === formatDateKey(new Date()),
    }
  }

  const formatMonthYear = () => {
    const months = [
      "Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho",
      "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"
    ]
    return `${months[weekDays[0].getMonth()]} ${weekDays[0].getFullYear()}`
  }

  if (loading || isLoadingData) {
    return (
      <div className="flex min-h-[360px] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground font-serif">Agenda Veterinária</h1>
          <p className="text-muted-foreground mt-1">
            Visualize e gerencie os agendamentos da semana
          </p>
        </div>
        <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Novo Agendamento
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle className="font-serif">Criar Agendamento</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4 mt-4">
              <div className="space-y-2">
                <Label htmlFor="pet">Pet</Label>
                <Select
                  value={formData.petId}
                  onValueChange={(value: string) => setFormData((prev) => ({ ...prev, petId: value }))}
                >
                  <SelectTrigger id="pet">
                    <SelectValue placeholder="Selecione o pet" />
                  </SelectTrigger>
                  <SelectContent>
                    {pets
                      .filter((pet) => !pet.arquivado)
                      .map((pet) => (
                        <SelectItem key={pet.id} value={pet.id}>
                          {pet.nome} - {pet.tutorProfileName || pet.tutor}
                        </SelectItem>
                      ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="data">Data</Label>
                <Input
                  id="data"
                  type="date"
                  value={formData.data}
                  onChange={(e) => setFormData((prev) => ({ ...prev, data: e.target.value }))}
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="horarioInicio">Horário Início</Label>
                  <Input
                    id="horarioInicio"
                    type="time"
                    value={formData.horarioInicio}
                    onChange={(e) =>
                      setFormData((prev) => ({ ...prev, horarioInicio: e.target.value }))
                    }
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="horarioFim">Horário Fim</Label>
                  <Input
                    id="horarioFim"
                    type="time"
                    value={formData.horarioFim}
                    onChange={(e) => setFormData((prev) => ({ ...prev, horarioFim: e.target.value }))}
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="veterinario">Veterinário</Label>
                <Select
                  value={formData.veterinarioId}
                  onValueChange={(value: string) =>
                    setFormData((prev) => ({ ...prev, veterinarioId: value }))
                  }
                >
                  <SelectTrigger id="veterinario">
                    <SelectValue placeholder="Selecione o veterinário" />
                  </SelectTrigger>
                  <SelectContent>
                    {veterinarios.map((vet) => (
                      <SelectItem key={vet.id} value={vet.id}>
                        {vet.full_name || "Veterinário sem nome"} - {vet.crmv}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="tipo">Tipo de Atendimento</Label>
                <Input
                  id="tipo"
                  value={formData.tipo}
                  onChange={(e) => setFormData((prev) => ({ ...prev, tipo: e.target.value }))}
                  placeholder="Ex: Consulta, Vacinação, Cirurgia..."
                  required
                />
              </div>

              <div className="flex justify-end gap-3 pt-4">
                <Button type="button" variant="outline" onClick={() => setIsModalOpen(false)}>
                  Cancelar
                </Button>
                <Button type="submit" disabled={isSaving || !formData.petId}>
                  {isSaving ? "Criando..." : "Criar"}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Button variant="outline" size="icon" onClick={() => navigateWeek("prev")}>
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="icon" onClick={() => navigateWeek("next")}>
            <ChevronRight className="h-4 w-4" />
          </Button>
          <Button variant="outline" onClick={goToToday}>
            Hoje
          </Button>
        </div>
        <h2 className="text-lg font-semibold text-foreground">{formatMonthYear()}</h2>
      </div>

      <div className="flex flex-wrap gap-3">
        {veterinarios.map((vet) => {
          const vetName = vet.full_name || vet.id
          return (
            <div key={vet.id} className="flex items-center gap-2">
              <div className={cn("h-3 w-3 rounded-full", vetColors[vetName] || "bg-primary")} />
              <span className="text-sm text-muted-foreground">{vet.full_name || "Veterinário sem nome"} - {vet.crmv}</span>
            </div>
          )
        })}
      </div>

      <div className="bg-card rounded-xl border border-border overflow-hidden">
        <div className="grid grid-cols-7 border-b border-border">
          {weekDays.map((date) => {
            const { dayName, dayNumber, isToday } = formatDayHeader(date)
            return (
              <div
                key={formatDateKey(date)}
                className={cn(
                  "p-3 text-center border-r border-border last:border-r-0",
                  isToday && "bg-primary/5"
                )}
              >
                <p className="text-xs text-muted-foreground uppercase">{dayName}</p>
                <p
                  className={cn(
                    "text-lg font-semibold mt-1",
                    isToday
                      ? "text-primary-foreground bg-primary rounded-full w-8 h-8 flex items-center justify-center mx-auto"
                      : "text-foreground"
                  )}
                >
                  {dayNumber}
                </p>
              </div>
            )
          })}
        </div>

        <div className="grid grid-cols-7 min-h-[400px]">
          {weekDays.map((date) => {
            const dateKey = formatDateKey(date)
            const dayAgendamentos = agendamentosByDay[dateKey] || []
            const { isToday } = formatDayHeader(date)

            return (
              <div
                key={dateKey}
                className={cn(
                  "p-2 border-r border-border last:border-r-0 min-h-[400px]",
                  isToday && "bg-primary/5"
                )}
              >
                <div className="space-y-2">
                  {dayAgendamentos.map((agendamento) => (
                    <button
                      key={agendamento.id}
                      onClick={() => setSelectedAgendamento(agendamento)}
                      className={cn(
                        "w-full text-left p-2 rounded-lg text-xs text-white transition-opacity hover:opacity-80",
                        vetColors[agendamento.veterinario] || "bg-primary"
                      )}
                    >
                      <p className="font-medium truncate">{agendamento.petNome}</p>
                      <p className="opacity-80">
                        {agendamento.horarioInicio} - {agendamento.horarioFim}
                      </p>
                      <p className="mt-1 opacity-80">{agendamento.status}</p>
                    </button>
                  ))}
                </div>
              </div>
            )
          })}
        </div>
      </div>

      <Dialog
        open={!!selectedAgendamento}
        onOpenChange={() => setSelectedAgendamento(null)}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="font-serif">Detalhes do Agendamento</DialogTitle>
          </DialogHeader>
          {selectedAgendamento && (
            <div className="space-y-4 mt-4">
              <div className="flex items-center gap-3">
                <div
                  className={cn(
                    "h-12 w-12 rounded-full flex items-center justify-center text-white",
                    vetColors[selectedAgendamento.veterinario] || "bg-primary"
                  )}
                >
                  <CalendarDays className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg">{selectedAgendamento.petNome}</h3>
                  <p className="text-muted-foreground">{selectedAgendamento.tipo}</p>
                </div>
              </div>

              <div className="space-y-3 bg-muted/30 rounded-lg p-4">
                <div className="flex items-center gap-3">
                  <User className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">
                    <span className="text-muted-foreground">Tutor:</span>{" "}
                    {selectedAgendamento.tutorProfileName || selectedAgendamento.tutor}
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <CalendarDays className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">
                    <span className="text-muted-foreground">Data:</span>{" "}
                    {new Date(selectedAgendamento.data + "T00:00:00").toLocaleDateString(
                      "pt-BR"
                    )}
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <Clock className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">
                    <span className="text-muted-foreground">Horário:</span>{" "}
                    {selectedAgendamento.horarioInicio} - {selectedAgendamento.horarioFim}
                  </span>
                </div>
                <div className="grid gap-3 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label>Status</Label>
                    <Select
                      value={selectedAgendamento.status}
                      onValueChange={(value) =>
                        handleStatusChange(selectedAgendamento, value as AgendamentoStatus)
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="agendado">Agendado</SelectItem>
                        <SelectItem value="confirmado">Confirmado</SelectItem>
                        <SelectItem value="realizado">Realizado</SelectItem>
                        <SelectItem value="cancelado">Cancelado</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Veterinário</Label>
                    <Select
                      value={selectedAgendamento.veterinarioId || unassignedVeterinarianValue}
                      onValueChange={(value) => handleVeterinarianChange(selectedAgendamento, value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder={selectedAgendamento.veterinario || "A definir"} />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value={unassignedVeterinarianValue}>A definir</SelectItem>
                        {veterinarios.map((vet) => (
                          <SelectItem key={vet.id} value={vet.id}>
                            {vet.full_name || "Veterinário sem nome"} - {vet.crmv}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>

              <div className="flex justify-end">
                <Button variant="outline" onClick={() => setSelectedAgendamento(null)}>
                  Fechar
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
