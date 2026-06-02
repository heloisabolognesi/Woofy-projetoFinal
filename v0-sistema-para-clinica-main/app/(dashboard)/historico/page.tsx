"use client"

import { useState } from "react"
import { useApp } from "@/context/app-context"
import {
  ClipboardList,
  Search,
  Stethoscope,
  Syringe,
  FileText,
  ChevronRight,
  ArrowLeft,
} from "lucide-react"
import { cn } from "@/lib/utils"

const tipoIcons = {
  consulta: Stethoscope,
  vacina: Syringe,
  exame: FileText,
}

const tipoColors = {
  consulta: "bg-secondary",
  vacina: "bg-woofy-gold",
  exame: "bg-woofy-accent",
}

const tipoLabels = {
  consulta: "Consulta",
  vacina: "Vacina",
  exame: "Exame",
}

export default function HistoricoPage() {
  const { pets, historico } = useApp()
  const [selectedPetId, setSelectedPetId] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState("")

  const filteredPets = pets.filter(
    (pet) =>
      !pet.arquivado &&
      pet.nome.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const selectedPet = pets.find((p) => p.id === selectedPetId)
  const petHistorico = historico
    .filter((h) => h.petId === selectedPetId)
    .sort((a, b) => new Date(b.data).getTime() - new Date(a.data).getTime())

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr + "T00:00:00")
    return date.toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    })
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
          <h1 className="text-2xl font-bold text-card-foreground font-serif">
            Historico de {selectedPet.nome}
          </h1>
          <p className="text-muted-foreground mt-1">
            {selectedPet.raca} - Tutor: {selectedPet.tutor}
          </p>
        </div>

        {petHistorico.length > 0 ? (
          <div className="relative">
            {/* Timeline line */}
            <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-border" />

            <div className="space-y-6">
              {petHistorico.map((item, index) => {
                const Icon = tipoIcons[item.tipo]
                return (
                  <div key={item.id} className="relative flex gap-4">
                    {/* Timeline dot */}
                    <div
                      className={cn(
                        "relative z-10 h-12 w-12 rounded-full flex items-center justify-center flex-shrink-0",
                        tipoColors[item.tipo]
                      )}
                    >
                      <Icon className="h-5 w-5 text-primary-foreground" />
                    </div>

                    {/* Content */}
                    <div className="flex-1 bg-card rounded-xl p-4 border border-border">
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <span
                            className={cn(
                              "inline-block px-2 py-0.5 rounded text-xs font-medium mb-2",
                              item.tipo === "consulta" &&
                                "bg-secondary/20 text-secondary",
                              item.tipo === "vacina" &&
                                "bg-woofy-gold/20 text-woofy-gold",
                              item.tipo === "exame" &&
                                "bg-woofy-accent/20 text-primary"
                            )}
                          >
                            {tipoLabels[item.tipo]}
                          </span>
                          <p className="text-card-foreground font-medium">
                            {item.descricao}
                          </p>
                          <p className="text-sm text-muted-foreground mt-1">
                            {item.veterinario}
                          </p>
                        </div>
                        <span className="text-sm text-muted-foreground whitespace-nowrap">
                          {formatDate(item.data)}
                        </span>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        ) : (
          <div className="text-center py-16 bg-card rounded-xl border border-border">
            <ClipboardList className="h-16 w-16 mx-auto text-muted-foreground/50 mb-4" />
            <h3 className="text-lg font-medium text-card-foreground">
              Nenhum registro encontrado
            </h3>
            <p className="text-muted-foreground mt-1">
              Este pet ainda nao possui historico medico
            </p>
          </div>
        )}
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground font-serif">
          Historico Medico
        </h1>
        <p className="text-muted-foreground mt-1">
          Selecione um pet para ver o historico completo
        </p>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
        <input
          type="text"
          placeholder="Buscar por nome do pet..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-10 pr-4 py-2 border border-input rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
        />
      </div>

      {filteredPets.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredPets.map((pet) => {
            const petRecords = historico.filter((h) => h.petId === pet.id).length
            return (
              <button
                key={pet.id}
                onClick={() => setSelectedPetId(pet.id)}
                className="bg-card rounded-xl p-5 border border-border hover:shadow-md transition-all text-left group"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-semibold text-card-foreground text-lg">
                      {pet.nome}
                    </h3>
                    <p className="text-sm text-muted-foreground">{pet.raca}</p>
                    <p className="text-sm text-muted-foreground mt-2">
                      {petRecords} registro{petRecords !== 1 ? "s" : ""}
                    </p>
                  </div>
                  <ChevronRight className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors" />
                </div>
              </button>
            )
          })}
        </div>
      ) : (
        <div className="text-center py-16 bg-card rounded-xl border border-border">
          <ClipboardList className="h-16 w-16 mx-auto text-muted-foreground/50 mb-4" />
          <h3 className="text-lg font-medium text-card-foreground">
            Nenhum pet encontrado
          </h3>
          <p className="text-muted-foreground mt-1">
            {searchTerm
              ? "Tente buscar por outro nome"
              : "Cadastre pets para ver o historico"}
          </p>
        </div>
      )}
    </div>
  )
}
