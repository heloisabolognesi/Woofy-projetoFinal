"use client"

import { useState } from "react"
import { useApp } from "@/context/app-context"
import { type Vacina } from "@/lib/mock-data"
import { Syringe, Plus, X, AlertTriangle, CheckCircle } from "lucide-react"
import { cn } from "@/lib/utils"

function VacinaModal({
  isOpen,
  onClose,
  onSave,
  pets,
}: {
  isOpen: boolean
  onClose: () => void
  onSave: (data: Omit<Vacina, "id">) => void
  pets: { id: string; nome: string }[]
}) {
  const [formData, setFormData] = useState<Omit<Vacina, "id">>({
    petId: "",
    petNome: "",
    vacina: "",
    dataAplicacao: "",
    proximaDose: "",
  })

  if (!isOpen) return null

  const handlePetChange = (petId: string) => {
    const pet = pets.find((p) => p.id === petId)
    if (pet) {
      setFormData({
        ...formData,
        petId: pet.id,
        petNome: pet.nome,
      })
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSave(formData)
    setFormData({
      petId: "",
      petNome: "",
      vacina: "",
      dataAplicacao: "",
      proximaDose: "",
    })
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />
      <div className="relative bg-card rounded-xl p-6 w-full max-w-md mx-4 shadow-xl">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-card-foreground">
            Registrar Vacina
          </h2>
          <button
            onClick={onClose}
            className="text-muted-foreground hover:text-card-foreground"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-card-foreground mb-1">
              Pet
            </label>
            <select
              required
              value={formData.petId}
              onChange={(e) => handlePetChange(e.target.value)}
              className="w-full px-3 py-2 border border-input rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
            >
              <option value="">Selecione um pet</option>
              {pets.map((pet) => (
                <option key={pet.id} value={pet.id}>
                  {pet.nome}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-card-foreground mb-1">
              Vacina
            </label>
            <input
              type="text"
              required
              value={formData.vacina}
              onChange={(e) =>
                setFormData({ ...formData, vacina: e.target.value })
              }
              placeholder="Ex: V10, Antirrabica, etc."
              className="w-full px-3 py-2 border border-input rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-card-foreground mb-1">
                Data de Aplicacao
              </label>
              <input
                type="date"
                required
                value={formData.dataAplicacao}
                onChange={(e) =>
                  setFormData({ ...formData, dataAplicacao: e.target.value })
                }
                className="w-full px-3 py-2 border border-input rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-card-foreground mb-1">
                Proxima Dose
              </label>
              <input
                type="date"
                required
                value={formData.proximaDose}
                onChange={(e) =>
                  setFormData({ ...formData, proximaDose: e.target.value })
                }
                className="w-full px-3 py-2 border border-input rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
              />
            </div>
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-border rounded-lg text-card-foreground hover:bg-muted transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition-opacity font-medium"
            >
              Registrar
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default function VacinacaoPage() {
  const { vacinas, setVacinas, pets, addToast } = useApp()
  const [isModalOpen, setIsModalOpen] = useState(false)

  type VacinaStatus = "vencida" | "proxima" | "ok"

  const getVacinaStatus = (proximaDose: string): { status: VacinaStatus; label: string; color: string } => {
    const proxima = new Date(proximaDose)
    const now = new Date()
    const diffDays = Math.ceil(
      (proxima.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)
    )

    if (diffDays < 0) return { status: "vencida", label: "Vencida", color: "bg-destructive/10 text-destructive" }
    if (diffDays <= 30) return { status: "proxima", label: "Proxima", color: "bg-woofy-gold/20 text-woofy-gold" }
    return { status: "ok", label: "Em dia", color: "bg-woofy-accent/20 text-primary" }
  }

  const handleSave = (data: Omit<Vacina, "id">) => {
    const newVacina: Vacina = {
      ...data,
      id: Math.random().toString(36).substring(7),
    }
    setVacinas((prev) => [...prev, newVacina])
    addToast("Vacina registrada com sucesso!")
    setIsModalOpen(false)
  }

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr + "T00:00:00")
    return date.toLocaleDateString("pt-BR")
  }

  const sortedVacinas = [...vacinas].sort((a, b) => {
    const statusA = getVacinaStatus(a.proximaDose).status
    const statusB = getVacinaStatus(b.proximaDose).status
    const order: Record<VacinaStatus, number> = { vencida: 0, proxima: 1, ok: 2 }
    return order[statusA] - order[statusB]
  })

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground font-serif">
            Vacinacao
          </h1>
          <p className="text-muted-foreground mt-1">
            Controle de vacinas dos pets
          </p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition-opacity font-medium"
        >
          <Plus className="h-5 w-5" />
          Registrar Vacina
        </button>
      </div>

      {sortedVacinas.length > 0 ? (
        <div className="bg-card rounded-xl border border-border overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-muted/50">
                  <th className="text-left px-4 py-3 text-sm font-semibold text-card-foreground">
                    Pet
                  </th>
                  <th className="text-left px-4 py-3 text-sm font-semibold text-card-foreground">
                    Vacina
                  </th>
                  <th className="text-left px-4 py-3 text-sm font-semibold text-card-foreground">
                    Data Aplicacao
                  </th>
                  <th className="text-left px-4 py-3 text-sm font-semibold text-card-foreground">
                    Proxima Dose
                  </th>
                  <th className="text-left px-4 py-3 text-sm font-semibold text-card-foreground">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody>
                {sortedVacinas.map((vacina) => {
                  const statusInfo = getVacinaStatus(vacina.proximaDose)
                  return (
                    <tr
                      key={vacina.id}
                      className="border-t border-border hover:bg-muted/30 transition-colors"
                    >
                      <td className="px-4 py-3">
                        <span className="font-medium text-card-foreground">
                          {vacina.petNome}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-card-foreground">
                        {vacina.vacina}
                      </td>
                      <td className="px-4 py-3 text-muted-foreground">
                        {formatDate(vacina.dataAplicacao)}
                      </td>
                      <td className="px-4 py-3 text-muted-foreground">
                        {formatDate(vacina.proximaDose)}
                      </td>
                      <td className="px-4 py-3">
                        <span
                          className={cn(
                            "inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium",
                            statusInfo.color
                          )}
                        >
                          {statusInfo.status === "vencida" && (
                            <AlertTriangle className="h-3 w-3" />
                          )}
                          {statusInfo.status === "ok" && (
                            <CheckCircle className="h-3 w-3" />
                          )}
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
          <h3 className="text-lg font-medium text-card-foreground">
            Nenhuma vacina registrada
          </h3>
          <p className="text-muted-foreground mt-1">
            Registre a primeira vacina
          </p>
        </div>
      )}

      <VacinaModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSave}
        pets={pets
          .filter((p) => !p.arquivado)
          .map((p) => ({ id: p.id, nome: p.nome }))}
      />
    </div>
  )
}
