"use client"

import { useEffect, useMemo, useState } from "react"
import { useRouter } from "next/navigation"
import { Calendar, Clock, Loader2, Search, Stethoscope } from "lucide-react"
import { cn } from "@/lib/utils"
import { createClient } from "@/lib/supabase"
import { useAuth } from "@/context/auth-context"
import { getAdminConsultations, type AdminConsultation, type ConsultaStatus } from "@/lib/clinic-data"

const statusColors: Record<ConsultaStatus, string> = {
  agendada: "bg-secondary text-secondary-foreground",
  realizada: "bg-woofy-accent text-primary",
  cancelada: "bg-destructive/10 text-destructive",
}

const statusLabels: Record<ConsultaStatus, string> = {
  agendada: "Agendada",
  realizada: "Realizada",
  cancelada: "Cancelada",
}

export default function ConsultasPage() {
  const { user, loading, refreshProfile } = useAuth()
  const router = useRouter()
  const supabase = useMemo(() => createClient(), [])
  const [consultas, setConsultas] = useState<AdminConsultation[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [filterStatus, setFilterStatus] = useState<string>("todos")
  const [filterDate, setFilterDate] = useState("")
  const [isLoadingData, setIsLoadingData] = useState(true)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  useEffect(() => {
    async function loadConsultations() {
      if (loading) return
      if (!user) {
        router.replace("/login?redirect=/consultas")
        return
      }

      setIsLoadingData(true)
      setErrorMessage(null)
      await refreshProfile(user.id)

      try {
        setConsultas(await getAdminConsultations(supabase))
      } catch {
        setErrorMessage("Nao foi possivel carregar as consultas reais do Supabase.")
      } finally {
        setIsLoadingData(false)
      }
    }

    loadConsultations()
  }, [loading, refreshProfile, router, supabase, user])

  const filteredConsultas = consultas.filter((consulta) => {
    const normalizedSearch = searchTerm.toLowerCase()
    const matchesSearch =
      consulta.petNome.toLowerCase().includes(normalizedSearch) ||
      consulta.tutorDisplayName.toLowerCase().includes(normalizedSearch) ||
      consulta.veterinarianDisplayName.toLowerCase().includes(normalizedSearch)
    const matchesStatus = filterStatus === "todos" || consulta.status === filterStatus
    const matchesDate = !filterDate || consulta.data === filterDate
    return matchesSearch && matchesStatus && matchesDate
  })

  const formatDate = (dateStr: string) => {
    const date = new Date(`${dateStr}T00:00:00`)
    return date.toLocaleDateString("pt-BR")
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
      <div>
        <h1 className="text-3xl font-bold text-foreground font-serif">Consultas</h1>
        <p className="text-muted-foreground mt-1">
          Registros clinicos criados a partir do feedback veterinario
        </p>
        {errorMessage && <p className="mt-2 text-sm text-destructive">{errorMessage}</p>}
      </div>

      <div className="flex flex-col lg:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
          <input
            type="text"
            placeholder="Buscar por pet, tutor ou veterinario..."
            value={searchTerm}
            onChange={(event) => setSearchTerm(event.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-input rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
          />
        </div>
        <div className="flex gap-4">
          <select
            value={filterStatus}
            onChange={(event) => setFilterStatus(event.target.value)}
            className="px-4 py-2 border border-input rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
          >
            <option value="todos">Todos os status</option>
            <option value="agendada">Agendadas</option>
            <option value="realizada">Realizadas</option>
            <option value="cancelada">Canceladas</option>
          </select>
          <input
            type="date"
            value={filterDate}
            onChange={(event) => setFilterDate(event.target.value)}
            className="px-4 py-2 border border-input rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
          />
        </div>
      </div>

      {filteredConsultas.length > 0 ? (
        <div className="bg-card rounded-xl border border-border overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-muted/50">
                  <th className="text-left px-4 py-3 text-sm font-semibold text-card-foreground">Pet</th>
                  <th className="text-left px-4 py-3 text-sm font-semibold text-card-foreground">Tutor</th>
                  <th className="text-left px-4 py-3 text-sm font-semibold text-card-foreground">Data</th>
                  <th className="text-left px-4 py-3 text-sm font-semibold text-card-foreground hidden md:table-cell">
                    Veterinario
                  </th>
                  <th className="text-left px-4 py-3 text-sm font-semibold text-card-foreground hidden lg:table-cell">
                    Feedback
                  </th>
                  <th className="text-left px-4 py-3 text-sm font-semibold text-card-foreground">Status</th>
                </tr>
              </thead>
              <tbody>
                {filteredConsultas.map((consulta) => (
                  <tr key={consulta.id} className="border-t border-border hover:bg-muted/30 transition-colors">
                    <td className="px-4 py-3">
                      <span className="font-medium text-card-foreground">{consulta.petNome}</span>
                    </td>
                    <td className="px-4 py-3 text-muted-foreground">{consulta.tutorDisplayName}</td>
                    <td className="px-4 py-3">
                      <div className="flex flex-wrap items-center gap-2">
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                        <span className="text-card-foreground">{formatDate(consulta.data)}</span>
                        <Clock className="h-4 w-4 text-muted-foreground ml-2" />
                        <span className="text-card-foreground">{consulta.horario}</span>
                      </div>
                      {consulta.appointmentDate && (
                        <p className="mt-1 text-xs text-muted-foreground">
                          Agendamento: {formatDate(consulta.appointmentDate)} {consulta.appointmentStartTime}
                          {consulta.appointmentEndTime ? `-${consulta.appointmentEndTime}` : ""}
                        </p>
                      )}
                    </td>
                    <td className="px-4 py-3 text-muted-foreground hidden md:table-cell">
                      {consulta.veterinarianDisplayName}
                    </td>
                    <td className="px-4 py-3 text-muted-foreground hidden lg:table-cell max-w-[260px] truncate">
                      {consulta.motivo}
                    </td>
                    <td className="px-4 py-3">
                      <span className={cn("px-3 py-1 rounded-full text-xs font-medium", statusColors[consulta.status])}>
                        {statusLabels[consulta.status]}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="text-center py-16 bg-card rounded-xl border border-border">
          <Stethoscope className="h-16 w-16 mx-auto text-muted-foreground/50 mb-4" />
          <h3 className="text-lg font-medium text-card-foreground">Nenhuma consulta encontrada</h3>
          <p className="text-muted-foreground mt-1">
            {searchTerm || filterStatus !== "todos" || filterDate
              ? "Tente ajustar os filtros de busca"
              : "Nenhum feedback veterinario foi registrado ainda"}
          </p>
        </div>
      )}
    </div>
  )
}
