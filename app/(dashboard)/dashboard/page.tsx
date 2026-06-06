"use client"

import { useEffect, useMemo, useState } from "react"
import { useRouter } from "next/navigation"
import { PawPrint, Stethoscope, Syringe, DollarSign, Clock, Calendar, Loader2 } from "lucide-react"
import { createClient } from "@/lib/supabase"
import { useAuth } from "@/context/auth-context"
import { getAdminUpcomingAppointments, type AdminAppointment } from "@/lib/clinic-data"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts"

function StatCard({
  title,
  value,
  icon: Icon,
  color,
}: {
  title: string
  value: string | number
  icon: React.ElementType
  color: string
}) {
  return (
    <div className="bg-card rounded-xl p-6 shadow-sm border border-border">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-muted-foreground font-medium">{title}</p>
          <p className="text-3xl font-bold text-card-foreground mt-1">{value}</p>
        </div>
        <div className={`h-12 w-12 rounded-lg flex items-center justify-center ${color}`}>
          <Icon className="h-6 w-6 text-primary-foreground" />
        </div>
      </div>
    </div>
  )
}

function AppointmentItem({
  time,
  petName,
  tutor,
  type,
  veterinario,
}: {
  time: string
  petName: string
  tutor: string
  type: string
  veterinario: string
}) {
  return (
    <div className="flex items-center gap-4 p-4 bg-muted/30 rounded-lg">
      <div className="flex flex-col items-center justify-center bg-primary text-primary-foreground rounded-lg px-3 py-2 min-w-[60px]">
        <span className="text-sm font-bold">{time}</span>
      </div>
      <div className="flex-1 min-w-0">
        <p className="font-semibold text-card-foreground truncate">{petName}</p>
        <p className="text-sm text-muted-foreground truncate">Tutor: {tutor}</p>
      </div>
      <div className="hidden sm:block text-right">
        <p className="text-sm font-medium text-secondary">{type}</p>
        <p className="text-xs text-muted-foreground">{veterinario}</p>
      </div>
    </div>
  )
}

interface PetRow {
  id: string
  nome: string
  arquivado: boolean
}

interface ConsultaRow {
  id: string
  data: string
  status: "agendada" | "realizada" | "cancelada"
}

interface VacinaRow {
  id: string
  proxima_dose: string | null
}

interface LancamentoRow {
  id: string
  tipo: "entrada" | "saida"
  valor: number
  data: string
}

interface AdminDashboardData {
  pets: PetRow[]
  proximosAgendamentos: AdminAppointment[]
  consultas: ConsultaRow[]
  vacinas: VacinaRow[]
  lancamentos: LancamentoRow[]
}

export default function DashboardPage() {
  const { user, loading, refreshProfile } = useAuth()
  const router = useRouter()
  const supabase = useMemo(() => createClient(), [])
  const [data, setData] = useState<AdminDashboardData>({
    pets: [],
    proximosAgendamentos: [],
    consultas: [],
    vacinas: [],
    lancamentos: [],
  })
  const [isLoading, setIsLoading] = useState(true)
  const [loadError, setLoadError] = useState<string | null>(null)

  const today = new Date().toISOString().split("T")[0]

  useEffect(() => {
    async function loadDashboardData() {
      if (loading) return
      if (!user) {
        router.replace("/login?redirect=/dashboard")
        return
      }

      setIsLoading(true)
      setLoadError(null)
      await refreshProfile(user.id)

      try {
        const [petsResult, proximosAgendamentosResult, consultasResult, vacinasResult, lancamentosResult] = await Promise.all([
          supabase.from("pets").select("id,nome,arquivado").order("created_at", { ascending: false }),
          getAdminUpcomingAppointments(supabase),
          supabase.from("consultas").select("id,data,status").order("data", { ascending: false }),
          supabase.from("vacinas").select("id,proxima_dose").order("proxima_dose", { ascending: true }),
          supabase.from("lancamentos").select("id,tipo,valor,data").order("data", { ascending: false }),
        ])

        const error = petsResult.error || consultasResult.error || vacinasResult.error || lancamentosResult.error
        if (error) {
          setLoadError("Não foi possível carregar todos os indicadores reais do Supabase.")
        }

        const pets = (petsResult.data || []) as PetRow[]
        setData({
          pets,
          proximosAgendamentos: proximosAgendamentosResult,
          consultas: (consultasResult.data || []) as ConsultaRow[],
          vacinas: (vacinasResult.data || []) as VacinaRow[],
          lancamentos: (lancamentosResult.data || []) as LancamentoRow[],
        })
      } catch {
        setLoadError("Não foi possível carregar todos os indicadores reais do Supabase.")
      } finally {
        setIsLoading(false)
      }
    }

    loadDashboardData()
  }, [loading, refreshProfile, router, supabase, user])

  // consultas = registros clínicos realizados; agendamentos = horários marcados na agenda.
  const consultasHoje = data.consultas.filter((c) => c.data === today && c.status === "realizada").length

  const vacinasPendentes = data.vacinas.filter((v) => {
    if (!v.proxima_dose) return false
    const proximaDose = new Date(v.proxima_dose)
    const now = new Date()
    const diffDays = Math.ceil(
      (proximaDose.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)
    )
    return diffDays <= 30
  }).length

  const receitaMes = data.lancamentos
    .filter((l) => {
      const data = new Date(l.data)
      const now = new Date()
      return (
        l.tipo === "entrada" &&
        data.getMonth() === now.getMonth() &&
        data.getFullYear() === now.getFullYear()
      )
    })
    .reduce((acc, l) => acc + l.valor, 0)

  const proximosAgendamentos = data.proximosAgendamentos

  const chartData = [
    { name: "Seg", consultas: 8 },
    { name: "Ter", consultas: 12 },
    { name: "Qua", consultas: 10 },
    { name: "Qui", consultas: 15 },
    { name: "Sex", consultas: 11 },
    { name: "Sab", consultas: 6 },
  ]

  if (isLoading) {
    return (
      <div className="flex min-h-[360px] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground font-serif">Dashboard</h1>
        <p className="text-muted-foreground mt-1">
          Bem-vindo ao sistema Woofy. Aqui está o resumo da sua clínica.
        </p>
        {loadError && <p className="mt-2 text-sm text-destructive">{loadError}</p>}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total de Pets"
          value={data.pets.filter((p) => !p.arquivado).length}
          icon={PawPrint}
          color="bg-primary"
        />
        <StatCard
          title="Consultas Hoje"
          value={consultasHoje}
          icon={Stethoscope}
          color="bg-secondary"
        />
        <StatCard
          title="Vacinas Pendentes"
          value={vacinasPendentes}
          icon={Syringe}
          color="bg-woofy-gold"
        />
        <StatCard
          title="Receita do Mês"
          value={`R$ ${receitaMes.toLocaleString("pt-BR")}`}
          icon={DollarSign}
          color="bg-woofy-accent"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-card rounded-xl p-6 shadow-sm border border-border">
          <div className="flex items-center gap-2 mb-4">
            <Calendar className="h-5 w-5 text-primary" />
            <h2 className="text-lg font-semibold text-card-foreground">
              Consultas por Dia da Semana
            </h2>
          </div>
          <p className="mb-3 text-xs text-muted-foreground">
            TODO: substituir este gráfico por agregação real de consultas quando a etapa analítica for implementada.
          </p>
          <div className="h-[250px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                <XAxis dataKey="name" stroke="var(--muted-foreground)" fontSize={12} />
                <YAxis stroke="var(--muted-foreground)" fontSize={12} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "var(--card)",
                    border: "1px solid var(--border)",
                    borderRadius: "8px",
                  }}
                />
                <Bar dataKey="consultas" fill="var(--primary)" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-card rounded-xl p-6 shadow-sm border border-border">
          <div className="flex items-center gap-2 mb-4">
            <Clock className="h-5 w-5 text-primary" />
            <h2 className="text-lg font-semibold text-card-foreground">
              Próximos Agendamentos
            </h2>
          </div>
          <div className="space-y-3">
            {proximosAgendamentos.length > 0 ? (
              proximosAgendamentos.map((agendamento) => (
                <AppointmentItem
                  key={agendamento.id}
                  time={agendamento.horarioInicio}
                  petName={agendamento.petNome}
                  tutor={agendamento.tutor}
                  type={agendamento.tipo}
                  veterinario={agendamento.veterinario}
                />
              ))
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                <Calendar className="h-12 w-12 mx-auto mb-2 opacity-50" />
                <p>Nenhum agendamento próximo</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
