"use client"

import { useEffect, useMemo, useState } from "react"
import { useRouter } from "next/navigation"
import { ArrowLeft, ChevronRight, ClipboardList, FileText, Loader2, Search, Stethoscope, Syringe } from "lucide-react"
import { cn } from "@/lib/utils"
import { createClient } from "@/lib/supabase"
import { useAuth } from "@/context/auth-context"
import { getAdminHistoryEntries, type AdminHistoryEntry, type HistoricoTipo } from "@/lib/clinic-data"

const tipoIcons: Record<HistoricoTipo, typeof Stethoscope> = {
  consulta: Stethoscope,
  vacina: Syringe,
  exame: FileText,
}

const tipoColors: Record<HistoricoTipo, string> = {
  consulta: "bg-secondary",
  vacina: "bg-woofy-gold",
  exame: "bg-woofy-accent",
}

const tipoLabels: Record<HistoricoTipo, string> = {
  consulta: "Consulta",
  vacina: "Vacina",
  exame: "Exame",
}

export default function HistoricoPage() {
  const { user, loading, refreshProfile } = useAuth()
  const router = useRouter()
  const supabase = useMemo(() => createClient(), [])
  const [historico, setHistorico] = useState<AdminHistoryEntry[]>([])
  const [selectedPetId, setSelectedPetId] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [isLoadingData, setIsLoadingData] = useState(true)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  useEffect(() => {
    async function loadHistory() {
      if (loading) return
      if (!user) {
        router.replace("/login?redirect=/historico")
        return
      }

      setIsLoadingData(true)
      setErrorMessage(null)
      await refreshProfile(user.id)

      try {
        setHistorico(await getAdminHistoryEntries(supabase))
      } catch {
        setErrorMessage("Nao foi possivel carregar o historico real do Supabase.")
      } finally {
        setIsLoadingData(false)
      }
    }

    loadHistory()
  }, [loading, refreshProfile, router, supabase, user])

  const pets = useMemo(() => {
    const byId = new Map<string, { id: string; nome: string; tutor: string; registros: number }>()
    historico.forEach((entry) => {
      const current = byId.get(entry.petId)
      byId.set(entry.petId, {
        id: entry.petId,
        nome: entry.petNome,
        tutor: entry.tutorDisplayName,
        registros: (current?.registros || 0) + 1,
      })
    })
    return [...byId.values()].sort((a, b) => a.nome.localeCompare(b.nome))
  }, [historico])

  const filteredPets = pets.filter((pet) => {
    const normalizedSearch = searchTerm.toLowerCase()
    return pet.nome.toLowerCase().includes(normalizedSearch) || pet.tutor.toLowerCase().includes(normalizedSearch)
  })

  const selectedPet = pets.find((pet) => pet.id === selectedPetId)
  const petHistorico = historico
    .filter((entry) => entry.petId === selectedPetId)
    .sort((a, b) => new Date(b.data).getTime() - new Date(a.data).getTime())

  const formatDate = (dateStr: string) => {
    const date = new Date(`${dateStr}T00:00:00`)
    return date.toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    })
  }

  if (loading || isLoadingData) {
    return (
      <div className="flex min-h-[360px] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  if (selectedPetId && selectedPet) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <button
            onClick={() => setSelectedPetId(null)}
            className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="h-5 w-5" />
            Voltar
          </button>
        </div>

        <div className="bg-card rounded-xl p-6 border border-border">
          <h1 className="text-2xl font-bold text-card-foreground font-serif">Historico de {selectedPet.nome}</h1>
          <p className="text-muted-foreground mt-1">Tutor: {selectedPet.tutor}</p>
        </div>

        {petHistorico.length > 0 ? (
          <div className="relative">
            <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-border" />
            <div className="space-y-6">
              {petHistorico.map((item) => {
                const Icon = tipoIcons[item.tipo]
                return (
                  <div key={item.id} className="relative flex gap-4">
                    <div
                      className={cn(
                        "relative z-10 h-12 w-12 rounded-full flex items-center justify-center flex-shrink-0",
                        tipoColors[item.tipo],
                      )}
                    >
                      <Icon className="h-5 w-5 text-primary-foreground" />
                    </div>

                    <div className="flex-1 bg-card rounded-xl p-4 border border-border">
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <span
                            className={cn(
                              "inline-block px-2 py-0.5 rounded text-xs font-medium mb-2",
                              item.tipo === "consulta" && "bg-secondary/20 text-secondary",
                              item.tipo === "vacina" && "bg-woofy-gold/20 text-woofy-gold",
                              item.tipo === "exame" && "bg-woofy-accent/20 text-primary",
                            )}
                          >
                            {tipoLabels[item.tipo]}
                          </span>
                          <p className="text-card-foreground font-medium">{item.descricao}</p>
                          {item.consultationReason && (
                            <p className="text-sm text-muted-foreground mt-1">Consulta: {item.consultationReason}</p>
                          )}
                          <p className="text-sm text-muted-foreground mt-1">
                            Veterinario: {item.veterinarianDisplayName}
                          </p>
                        </div>
                        <span className="text-sm text-muted-foreground whitespace-nowrap">{formatDate(item.data)}</span>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        ) : (
          <EmptyState text="Este pet ainda nao possui historico medico." />
        )}
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground font-serif">Historico Medico</h1>
        <p className="text-muted-foreground mt-1">
          Registros clinicos gerados por consultas, vacinas e exames
        </p>
        {errorMessage && <p className="mt-2 text-sm text-destructive">{errorMessage}</p>}
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
        <input
          type="text"
          placeholder="Buscar por pet ou tutor..."
          value={searchTerm}
          onChange={(event) => setSearchTerm(event.target.value)}
          className="w-full pl-10 pr-4 py-2 border border-input rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
        />
      </div>

      {filteredPets.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredPets.map((pet) => (
            <button
              key={pet.id}
              onClick={() => setSelectedPetId(pet.id)}
              className="bg-card rounded-xl p-5 border border-border hover:shadow-md transition-all text-left group"
            >
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-semibold text-card-foreground text-lg">{pet.nome}</h3>
                  <p className="text-sm text-muted-foreground">Tutor: {pet.tutor}</p>
                  <p className="text-sm text-muted-foreground mt-2">
                    {pet.registros} registro{pet.registros !== 1 ? "s" : ""}
                  </p>
                </div>
                <ChevronRight className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors" />
              </div>
            </button>
          ))}
        </div>
      ) : (
        <EmptyState
          text={
            searchTerm
              ? "Tente buscar por outro pet ou tutor."
              : "Nenhum historico clinico real foi registrado ainda."
          }
        />
      )}
    </div>
  )
}

function EmptyState({ text }: { text: string }) {
  return (
    <div className="text-center py-16 bg-card rounded-xl border border-border">
      <ClipboardList className="h-16 w-16 mx-auto text-muted-foreground/50 mb-4" />
      <h3 className="text-lg font-medium text-card-foreground">Nenhum registro encontrado</h3>
      <p className="text-muted-foreground mt-1">{text}</p>
    </div>
  )
}
