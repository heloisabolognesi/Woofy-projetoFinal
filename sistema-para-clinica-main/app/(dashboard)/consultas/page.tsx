"use client"

import { useState } from "react"
import { useApp } from "@/context/app-context"
import { type Consulta, veterinarios } from "@/lib/mock-data"
import {
  Stethoscope,
  Plus,
  Search,
  X,
  Calendar,
  Clock,
  Filter,
} from "lucide-react"
import { cn } from "@/lib/utils"

const statusColors = {
  agendada: "bg-secondary text-secondary-foreground",
  realizada: "bg-woofy-accent text-primary",
  cancelada: "bg-destructive/10 text-destructive",
}

const statusLabels = {
  agendada: "Agendada",
  realizada: "Realizada",
  cancelada: "Cancelada",
}

function ConsultaModal({
  isOpen,
  onClose,
  consulta,
  onSave,
  pets,
}: {
  isOpen: boolean
  onClose: () => void
  consulta: Consulta | null
  onSave: (data: Omit<Consulta, "id">) => void
  pets: { id: string; nome: string; tutor: string }[]
}) {
  const [formData, setFormData] = useState<Omit<Consulta, "id">>({
    petId: consulta?.petId || "",
    petNome: consulta?.petNome || "",
    tutor: consulta?.tutor || "",
    data: consulta?.data || "",
    horario: consulta?.horario || "",
    veterinario: consulta?.veterinario || veterinarios[0],
    motivo: consulta?.motivo || "",
    status: consulta?.status || "agendada",
  })

  if (!isOpen) return null

  const handlePetChange = (petId: string) => {
    const pet = pets.find((p) => p.id === petId)
    if (pet) {
      setFormData({
        ...formData,
        petId: pet.id,
        petNome: pet.nome,
        tutor: pet.tutor,
      })
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSave(formData)
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />
      <div className="relative bg-card rounded-xl p-6 w-full max-w-md mx-4 max-h-[90vh] overflow-y-auto shadow-xl">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-card-foreground">
            {consulta ? "Editar Consulta" : "Nova Consulta"}
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
                  {pet.nome} ({pet.tutor})
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-card-foreground mb-1">
                Data
              </label>
              <input
                type="date"
                required
                value={formData.data}
                onChange={(e) =>
                  setFormData({ ...formData, data: e.target.value })
                }
                className="w-full px-3 py-2 border border-input rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-card-foreground mb-1">
                Horario
              </label>
              <input
                type="time"
                required
                value={formData.horario}
                onChange={(e) =>
                  setFormData({ ...formData, horario: e.target.value })
                }
                className="w-full px-3 py-2 border border-input rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-card-foreground mb-1">
              Veterinario
            </label>
            <select
              value={formData.veterinario}
              onChange={(e) =>
                setFormData({ ...formData, veterinario: e.target.value })
              }
              className="w-full px-3 py-2 border border-input rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
            >
              {veterinarios.map((vet) => (
                <option key={vet} value={vet}>
                  {vet}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-card-foreground mb-1">
              Motivo
            </label>
            <textarea
              required
              rows={3}
              value={formData.motivo}
              onChange={(e) =>
                setFormData({ ...formData, motivo: e.target.value })
              }
              className="w-full px-3 py-2 border border-input rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring resize-none"
            />
          </div>

          {consulta && (
            <div>
              <label className="block text-sm font-medium text-card-foreground mb-1">
                Status
              </label>
              <select
                value={formData.status}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    status: e.target.value as Consulta["status"],
                  })
                }
                className="w-full px-3 py-2 border border-input rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
              >
                <option value="agendada">Agendada</option>
                <option value="realizada">Realizada</option>
                <option value="cancelada">Cancelada</option>
              </select>
            </div>
          )}

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
              Salvar
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default function ConsultasPage() {
  const { consultas, setConsultas, pets, addToast } = useApp()
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingConsulta, setEditingConsulta] = useState<Consulta | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [filterStatus, setFilterStatus] = useState<string>("todos")
  const [filterDate, setFilterDate] = useState("")

  const filteredConsultas = consultas.filter((consulta) => {
    const matchesSearch =
      consulta.petNome.toLowerCase().includes(searchTerm.toLowerCase()) ||
      consulta.tutor.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus =
      filterStatus === "todos" || consulta.status === filterStatus
    const matchesDate = !filterDate || consulta.data === filterDate
    return matchesSearch && matchesStatus && matchesDate
  })

  const handleOpenModal = (consulta?: Consulta) => {
    setEditingConsulta(consulta || null)
    setIsModalOpen(true)
  }

  const handleCloseModal = () => {
    setIsModalOpen(false)
    setEditingConsulta(null)
  }

  const handleSave = (data: Omit<Consulta, "id">) => {
    if (editingConsulta) {
      setConsultas((prev) =>
        prev.map((c) => (c.id === editingConsulta.id ? { ...c, ...data } : c))
      )
      addToast("Consulta atualizada com sucesso!")
    } else {
      const newConsulta: Consulta = {
        ...data,
        id: Math.random().toString(36).substring(7),
      }
      setConsultas((prev) => [...prev, newConsulta])
      addToast("Consulta agendada com sucesso!")
    }
    handleCloseModal()
  }

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr + "T00:00:00")
    return date.toLocaleDateString("pt-BR")
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground font-serif">
            Consultas
          </h1>
          <p className="text-muted-foreground mt-1">
            Gerencie as consultas da clinica
          </p>
        </div>
        <button
          onClick={() => handleOpenModal()}
          className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition-opacity font-medium"
        >
          <Plus className="h-5 w-5" />
          Nova Consulta
        </button>
      </div>

      <div className="flex flex-col lg:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
          <input
            type="text"
            placeholder="Buscar por pet ou tutor..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-input rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
          />
        </div>
        <div className="flex gap-4">
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
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
            onChange={(e) => setFilterDate(e.target.value)}
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
                  <th className="text-left px-4 py-3 text-sm font-semibold text-card-foreground">
                    Pet
                  </th>
                  <th className="text-left px-4 py-3 text-sm font-semibold text-card-foreground">
                    Tutor
                  </th>
                  <th className="text-left px-4 py-3 text-sm font-semibold text-card-foreground">
                    Data
                  </th>
                  <th className="text-left px-4 py-3 text-sm font-semibold text-card-foreground hidden md:table-cell">
                    Veterinario
                  </th>
                  <th className="text-left px-4 py-3 text-sm font-semibold text-card-foreground hidden lg:table-cell">
                    Motivo
                  </th>
                  <th className="text-left px-4 py-3 text-sm font-semibold text-card-foreground">
                    Status
                  </th>
                  <th className="text-right px-4 py-3 text-sm font-semibold text-card-foreground">
                    Acoes
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredConsultas.map((consulta) => (
                  <tr
                    key={consulta.id}
                    className="border-t border-border hover:bg-muted/30 transition-colors"
                  >
                    <td className="px-4 py-3">
                      <span className="font-medium text-card-foreground">
                        {consulta.petNome}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-muted-foreground">
                      {consulta.tutor}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                        <span className="text-card-foreground">
                          {formatDate(consulta.data)}
                        </span>
                        <Clock className="h-4 w-4 text-muted-foreground ml-2" />
                        <span className="text-card-foreground">
                          {consulta.horario}
                        </span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-muted-foreground hidden md:table-cell">
                      {consulta.veterinario}
                    </td>
                    <td className="px-4 py-3 text-muted-foreground hidden lg:table-cell max-w-[200px] truncate">
                      {consulta.motivo}
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={cn(
                          "px-3 py-1 rounded-full text-xs font-medium",
                          statusColors[consulta.status]
                        )}
                      >
                        {statusLabels[consulta.status]}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <button
                        onClick={() => handleOpenModal(consulta)}
                        className="text-secondary hover:text-secondary/80 font-medium text-sm"
                      >
                        Editar
                      </button>
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
          <h3 className="text-lg font-medium text-card-foreground">
            Nenhuma consulta encontrada
          </h3>
          <p className="text-muted-foreground mt-1">
            {searchTerm || filterStatus !== "todos" || filterDate
              ? "Tente ajustar os filtros de busca"
              : "Agende a primeira consulta da clinica"}
          </p>
        </div>
      )}

      <ConsultaModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        consulta={editingConsulta}
        onSave={handleSave}
        pets={pets
          .filter((p) => !p.arquivado)
          .map((p) => ({ id: p.id, nome: p.nome, tutor: p.tutor }))}
      />
    </div>
  )
}
