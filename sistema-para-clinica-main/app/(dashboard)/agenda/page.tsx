"use client"

import { useState, useMemo } from "react"
import { useApp } from "@/context/app-context"
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
import { Plus, ChevronLeft, ChevronRight, CalendarDays, Clock, User } from "lucide-react"
import { cn } from "@/lib/utils"
import { veterinarios, type Agendamento } from "@/lib/mock-data"

const vetColors: Record<string, string> = {
  "Dr. Carlos Silva": "bg-primary",
  "Dra. Maria Santos": "bg-secondary",
  "Dr. Pedro Costa": "bg-woofy-gold",
  "Dra. Ana Oliveira": "bg-woofy-accent",
}

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

export default function AgendaPage() {
  const { agendamentos, setAgendamentos, pets, addToast } = useApp()
  const [currentDate, setCurrentDate] = useState(new Date())
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedAgendamento, setSelectedAgendamento] = useState<Agendamento | null>(null)
  const [formData, setFormData] = useState({
    petId: "",
    data: "",
    horarioInicio: "",
    horarioFim: "",
    veterinario: "",
    tipo: "",
  })

  const weekDays = useMemo(() => getWeekDays(currentDate), [currentDate])

  const agendamentosByDay = useMemo(() => {
    const map: Record<string, Agendamento[]> = {}
    agendamentos.forEach((a) => {
      if (!map[a.data]) map[a.data] = []
      map[a.data].push(a)
    })
    Object.values(map).forEach((arr) =>
      arr.sort((a, b) => a.horarioInicio.localeCompare(b.horarioInicio))
    )
    return map
  }, [agendamentos])

  const navigateWeek = (direction: "prev" | "next") => {
    const newDate = new Date(currentDate)
    newDate.setDate(newDate.getDate() + (direction === "next" ? 7 : -7))
    setCurrentDate(newDate)
  }

  const goToToday = () => {
    setCurrentDate(new Date())
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const pet = pets.find((p) => p.id === formData.petId)
    if (!pet) return

    const newAgendamento: Agendamento = {
      id: Math.random().toString(36).substring(7),
      petId: formData.petId,
      petNome: pet.nome,
      tutor: pet.tutor,
      data: formData.data,
      horarioInicio: formData.horarioInicio,
      horarioFim: formData.horarioFim,
      veterinario: formData.veterinario,
      tipo: formData.tipo,
    }

    setAgendamentos((prev) => [...prev, newAgendamento])
    addToast("Agendamento criado com sucesso!")
    setIsModalOpen(false)
    setFormData({
      petId: "",
      data: "",
      horarioInicio: "",
      horarioFim: "",
      veterinario: "",
      tipo: "",
    })
  }

  const handleAgendamentoClick = (agendamento: Agendamento) => {
    setSelectedAgendamento(agendamento)
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
      "Janeiro", "Fevereiro", "Marco", "Abril", "Maio", "Junho",
      "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"
    ]
    return `${months[weekDays[0].getMonth()]} ${weekDays[0].getFullYear()}`
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground font-serif">Agenda Veterinaria</h1>
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
                  onValueChange={(value) => setFormData({ ...formData, petId: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o pet" />
                  </SelectTrigger>
                  <SelectContent>
                    {pets
                      .filter((p) => !p.arquivado)
                      .map((pet) => (
                        <SelectItem key={pet.id} value={pet.id}>
                          {pet.nome} - {pet.tutor}
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
                  onChange={(e) => setFormData({ ...formData, data: e.target.value })}
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="horarioInicio">Horario Inicio</Label>
                  <Input
                    id="horarioInicio"
                    type="time"
                    value={formData.horarioInicio}
                    onChange={(e) =>
                      setFormData({ ...formData, horarioInicio: e.target.value })
                    }
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="horarioFim">Horario Fim</Label>
                  <Input
                    id="horarioFim"
                    type="time"
                    value={formData.horarioFim}
                    onChange={(e) => setFormData({ ...formData, horarioFim: e.target.value })}
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="veterinario">Veterinario</Label>
                <Select
                  value={formData.veterinario}
                  onValueChange={(value) =>
                    setFormData({ ...formData, veterinario: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o veterinario" />
                  </SelectTrigger>
                  <SelectContent>
                    {veterinarios.map((vet) => (
                      <SelectItem key={vet} value={vet}>
                        {vet}
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
                  onChange={(e) => setFormData({ ...formData, tipo: e.target.value })}
                  placeholder="Ex: Consulta, Vacinacao, Cirurgia..."
                  required
                />
              </div>

              <div className="flex justify-end gap-3 pt-4">
                <Button type="button" variant="outline" onClick={() => setIsModalOpen(false)}>
                  Cancelar
                </Button>
                <Button type="submit">Criar</Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Week Navigation */}
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

      {/* Veterinario Legend */}
      <div className="flex flex-wrap gap-3">
        {veterinarios.map((vet) => (
          <div key={vet} className="flex items-center gap-2">
            <div className={cn("h-3 w-3 rounded-full", vetColors[vet])} />
            <span className="text-sm text-muted-foreground">{vet}</span>
          </div>
        ))}
      </div>

      {/* Calendar Grid */}
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
                      onClick={() => handleAgendamentoClick(agendamento)}
                      className={cn(
                        "w-full text-left p-2 rounded-lg text-xs text-white transition-opacity hover:opacity-80",
                        vetColors[agendamento.veterinario] || "bg-primary"
                      )}
                    >
                      <p className="font-medium truncate">{agendamento.petNome}</p>
                      <p className="opacity-80">
                        {agendamento.horarioInicio} - {agendamento.horarioFim}
                      </p>
                    </button>
                  ))}
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Agendamento Details Modal */}
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
                    {selectedAgendamento.tutor}
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
                    <span className="text-muted-foreground">Horario:</span>{" "}
                    {selectedAgendamento.horarioInicio} - {selectedAgendamento.horarioFim}
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <div
                    className={cn(
                      "h-4 w-4 rounded-full",
                      vetColors[selectedAgendamento.veterinario] || "bg-primary"
                    )}
                  />
                  <span className="text-sm">
                    <span className="text-muted-foreground">Veterinario:</span>{" "}
                    {selectedAgendamento.veterinario}
                  </span>
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
