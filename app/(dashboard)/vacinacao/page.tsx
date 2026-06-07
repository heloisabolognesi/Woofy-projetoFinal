"use client"

import { useEffect, useMemo, useState } from "react"
import { useRouter } from "next/navigation"
import { AlertTriangle, CheckCircle, Loader2, Syringe } from "lucide-react"
import { cn } from "@/lib/utils"
import { createClient } from "@/lib/supabase"
import { useAuth } from "@/context/auth-context"
import { getAdminVaccines, type AdminVaccine } from "@/lib/clinic-data"

type VacinaStatus = "vencida" | "proxima" | "ok" | "sem-dose"

function getVacinaStatus(proximaDose: string | null): { status: VacinaStatus; label: string; color: string } {
  if (!proximaDose) {
    return { status: "sem-dose", label: "Sem próxima dose", color: "bg-muted text-muted-foreground" }
  }

  const proxima = new Date(`${proximaDose}T00:00:00`)
  const now = new Date()
  const diffDays = Math.ceil((proxima.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))

  if (diffDays < 0) return { status: "vencida", label: "Vencida", color: "bg-destructive/10 text-destructive" }
  if (diffDays <= 30) return { status: "proxima", label: "Próxima", color: "bg-woofy-gold/20 text-woofy-gold" }
  return { status: "ok", label: "Em dia", color: "bg-woofy-accent/20 text-primary" }
}

function formatDate(dateStr: string | null) {
  if (!dateStr) return "Não definida"
  return new Date(`${dateStr}T00:00:00`).toLocaleDateString("pt-BR")
}

function formatCurrency(value: number | null) {
  if (value == null) return "Não definido"
  return new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(value)
}

export default function VacinacaoPage() {
  const { user, loading, refreshProfile } = useAuth()
  const router = useRouter()
  const supabase = useMemo(() => createClient(), [])
  const [vacinas, setVacinas] = useState<AdminVaccine[]>([])
  const [isLoadingData, setIsLoadingData] = useState(true)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  useEffect(() => {
    async function loadVaccines() {
      if (loading) return
      if (!user) {
        router.replace("/login?redirect=/vacinacao")
        return
      }

      setIsLoadingData(true)
      setErrorMessage(null)
      await refreshProfile(user.id)

      try {
        setVacinas(await getAdminVaccines(supabase))
      } catch {
        setErrorMessage("Não foi possível carregar as vacinas reais do Supabase.")
      } finally {
        setIsLoadingData(false)
      }
    }

    loadVaccines()
  }, [loading, refreshProfile, router, supabase, user])

  const sortedVacinas = useMemo(() => {
    const order: Record<VacinaStatus, number> = { vencida: 0, proxima: 1, ok: 2, "sem-dose": 3 }
    return [...vacinas].sort((a, b) => {
      const statusA = getVacinaStatus(a.proximaDose).status
      const statusB = getVacinaStatus(b.proximaDose).status
      return order[statusA] - order[statusB]
    })
  }, [vacinas])

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
        <h1 className="text-3xl font-bold text-foreground font-serif">Vacinação</h1>
        <p className="text-muted-foreground mt-1">Controle real de vacinas registradas pelos veterinários</p>
        {errorMessage && <p className="mt-2 text-sm text-destructive">{errorMessage}</p>}
      </div>

      {sortedVacinas.length > 0 ? (
        <div className="bg-card rounded-xl border border-border overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-muted/50">
                  <th className="text-left px-4 py-3 text-sm font-semibold text-card-foreground">Pet</th>
                  <th className="text-left px-4 py-3 text-sm font-semibold text-card-foreground">Tutor</th>
                  <th className="text-left px-4 py-3 text-sm font-semibold text-card-foreground">Vacina</th>
                  <th className="text-left px-4 py-3 text-sm font-semibold text-card-foreground">Aplicação</th>
                  <th className="text-left px-4 py-3 text-sm font-semibold text-card-foreground">Próxima Dose</th>
                  <th className="text-left px-4 py-3 text-sm font-semibold text-card-foreground">Veterinário</th>
                  <th className="text-left px-4 py-3 text-sm font-semibold text-card-foreground">Valor</th>
                  <th className="text-left px-4 py-3 text-sm font-semibold text-card-foreground">Status</th>
                </tr>
              </thead>
              <tbody>
                {sortedVacinas.map((vacina) => {
                  const statusInfo = getVacinaStatus(vacina.proximaDose)
                  return (
                    <tr key={vacina.id} className="border-t border-border hover:bg-muted/30 transition-colors">
                      <td className="px-4 py-3 font-medium text-card-foreground">{vacina.petNome}</td>
                      <td className="px-4 py-3 text-muted-foreground">{vacina.tutorDisplayName}</td>
                      <td className="px-4 py-3 text-card-foreground">{vacina.vacina}</td>
                      <td className="px-4 py-3 text-muted-foreground">{formatDate(vacina.dataAplicacao)}</td>
                      <td className="px-4 py-3 text-muted-foreground">{formatDate(vacina.proximaDose)}</td>
                      <td className="px-4 py-3 text-muted-foreground">{vacina.veterinarianDisplayName}</td>
                      <td className="px-4 py-3 text-muted-foreground">{formatCurrency(vacina.valor)}</td>
                      <td className="px-4 py-3">
                        <span className={cn("inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium", statusInfo.color)}>
                          {statusInfo.status === "vencida" && <AlertTriangle className="h-3 w-3" />}
                          {statusInfo.status === "ok" && <CheckCircle className="h-3 w-3" />}
                          {statusInfo.label}
                        </span>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="text-center py-16 bg-card rounded-xl border border-border">
          <Syringe className="h-16 w-16 mx-auto text-muted-foreground/50 mb-4" />
          <h3 className="text-lg font-medium text-card-foreground">Nenhuma vacina registrada</h3>
          <p className="text-muted-foreground mt-1">Nenhuma vacina registrada.</p>
        </div>
      )}
    </div>
  )
}
