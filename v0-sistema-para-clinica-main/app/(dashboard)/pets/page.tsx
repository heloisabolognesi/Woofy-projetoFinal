"use client"

import { useState } from "react"
import { useApp } from "@/context/app-context"
import { type Pet } from "@/lib/mock-data"
import {
  PawPrint,
  Plus,
  Search,
  X,
  Pencil,
  Archive,
  Dog,
  Cat,
  Rabbit,
  Phone,
} from "lucide-react"
import { cn } from "@/lib/utils"

const especieIcons = {
  cao: Dog,
  gato: Cat,
  outro: Rabbit,
}

const especieLabels = {
  cao: "Cao",
  gato: "Gato",
  outro: "Outro",
}

function PetCard({
  pet,
  onEdit,
  onArchive,
}: {
  pet: Pet
  onEdit: (pet: Pet) => void
  onArchive: (id: string) => void
}) {
  const Icon = especieIcons[pet.especie]

  return (
    <div className="bg-card rounded-xl p-5 shadow-sm border border-border hover:shadow-md transition-shadow">
      <div className="flex items-start gap-4">
        <div className="h-16 w-16 rounded-full bg-muted flex items-center justify-center flex-shrink-0">
          <Icon className="h-8 w-8 text-primary" />
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-card-foreground text-lg truncate">
            {pet.nome}
          </h3>
          <p className="text-sm text-muted-foreground">
            {pet.raca} - {especieLabels[pet.especie]}
          </p>
          <p className="text-sm text-muted-foreground mt-1">Peso: {pet.peso} kg</p>
        </div>
      </div>

      <div className="mt-4 pt-4 border-t border-border">
        <p className="text-sm font-medium text-card-foreground">{pet.tutor}</p>
        <div className="flex items-center gap-1 text-sm text-muted-foreground mt-1">
          <Phone className="h-3 w-3" />
          {pet.telefoneTutor}
        </div>
      </div>

      <div className="flex gap-2 mt-4">
        <button
          onClick={() => onEdit(pet)}
          className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-secondary text-secondary-foreground rounded-lg hover:opacity-90 transition-opacity text-sm font-medium"
        >
          <Pencil className="h-4 w-4" />
          Editar
        </button>
        <button
          onClick={() => onArchive(pet.id)}
          className="flex items-center justify-center px-3 py-2 bg-muted text-muted-foreground rounded-lg hover:bg-muted/80 transition-colors"
        >
          <Archive className="h-4 w-4" />
        </button>
      </div>
    </div>
  )
}

function PetModal({
  isOpen,
  onClose,
  pet,
  onSave,
}: {
  isOpen: boolean
  onClose: () => void
  pet: Pet | null
  onSave: (data: Omit<Pet, "id">) => void
}) {
  const [formData, setFormData] = useState<Omit<Pet, "id">>({
    nome: pet?.nome || "",
    especie: pet?.especie || "cao",
    raca: pet?.raca || "",
    dataNascimento: pet?.dataNascimento || "",
    peso: pet?.peso || 0,
    tutor: pet?.tutor || "",
    telefoneTutor: pet?.telefoneTutor || "",
  })

  if (!isOpen) return null

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
            {pet ? "Editar Pet" : "Novo Pet"}
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
              Nome do Pet
            </label>
            <input
              type="text"
              required
              value={formData.nome}
              onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
              className="w-full px-3 py-2 border border-input rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-card-foreground mb-1">
              Especie
            </label>
            <select
              value={formData.especie}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  especie: e.target.value as Pet["especie"],
                })
              }
              className="w-full px-3 py-2 border border-input rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
            >
              <option value="cao">Cao</option>
              <option value="gato">Gato</option>
              <option value="outro">Outro</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-card-foreground mb-1">
              Raca
            </label>
            <input
              type="text"
              required
              value={formData.raca}
              onChange={(e) => setFormData({ ...formData, raca: e.target.value })}
              className="w-full px-3 py-2 border border-input rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-card-foreground mb-1">
                Data de Nascimento
              </label>
              <input
                type="date"
                required
                value={formData.dataNascimento}
                onChange={(e) =>
                  setFormData({ ...formData, dataNascimento: e.target.value })
                }
                className="w-full px-3 py-2 border border-input rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-card-foreground mb-1">
                Peso (kg)
              </label>
              <input
                type="number"
                required
                step="0.1"
                min="0"
                value={formData.peso}
                onChange={(e) =>
                  setFormData({ ...formData, peso: parseFloat(e.target.value) })
                }
                className="w-full px-3 py-2 border border-input rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-card-foreground mb-1">
              Nome do Tutor
            </label>
            <input
              type="text"
              required
              value={formData.tutor}
              onChange={(e) => setFormData({ ...formData, tutor: e.target.value })}
              className="w-full px-3 py-2 border border-input rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-card-foreground mb-1">
              Telefone do Tutor
            </label>
            <input
              type="tel"
              required
              value={formData.telefoneTutor}
              onChange={(e) =>
                setFormData({ ...formData, telefoneTutor: e.target.value })
              }
              className="w-full px-3 py-2 border border-input rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
            />
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
              Salvar
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default function PetsPage() {
  const { pets, setPets, addToast } = useApp()
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingPet, setEditingPet] = useState<Pet | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [filterEspecie, setFilterEspecie] = useState<string>("todos")

  const filteredPets = pets.filter((pet) => {
    if (pet.arquivado) return false
    const matchesSearch =
      pet.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
      pet.tutor.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesFilter =
      filterEspecie === "todos" || pet.especie === filterEspecie
    return matchesSearch && matchesFilter
  })

  const handleOpenModal = (pet?: Pet) => {
    setEditingPet(pet || null)
    setIsModalOpen(true)
  }

  const handleCloseModal = () => {
    setIsModalOpen(false)
    setEditingPet(null)
  }

  const handleSave = (data: Omit<Pet, "id">) => {
    if (editingPet) {
      setPets((prev) =>
        prev.map((p) => (p.id === editingPet.id ? { ...p, ...data } : p))
      )
      addToast("Pet atualizado com sucesso!")
    } else {
      const newPet: Pet = {
        ...data,
        id: Math.random().toString(36).substring(7),
      }
      setPets((prev) => [...prev, newPet])
      addToast("Pet cadastrado com sucesso!")
    }
    handleCloseModal()
  }

  const handleArchive = (id: string) => {
    setPets((prev) =>
      prev.map((p) => (p.id === id ? { ...p, arquivado: true } : p))
    )
    addToast("Pet arquivado com sucesso!")
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground font-serif">Pets</h1>
          <p className="text-muted-foreground mt-1">
            Gerencie os pets cadastrados na clinica
          </p>
        </div>
        <button
          onClick={() => handleOpenModal()}
          className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition-opacity font-medium"
        >
          <Plus className="h-5 w-5" />
          Novo Pet
        </button>
      </div>

      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
          <input
            type="text"
            placeholder="Buscar por nome ou tutor..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-input rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
          />
        </div>
        <select
          value={filterEspecie}
          onChange={(e) => setFilterEspecie(e.target.value)}
          className="px-4 py-2 border border-input rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
        >
          <option value="todos">Todas as especies</option>
          <option value="cao">Caes</option>
          <option value="gato">Gatos</option>
          <option value="outro">Outros</option>
        </select>
      </div>

      {filteredPets.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredPets.map((pet) => (
            <PetCard
              key={pet.id}
              pet={pet}
              onEdit={handleOpenModal}
              onArchive={handleArchive}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-16 bg-card rounded-xl border border-border">
          <PawPrint className="h-16 w-16 mx-auto text-muted-foreground/50 mb-4" />
          <h3 className="text-lg font-medium text-card-foreground">
            Nenhum pet encontrado
          </h3>
          <p className="text-muted-foreground mt-1">
            {searchTerm || filterEspecie !== "todos"
              ? "Tente ajustar os filtros de busca"
              : "Cadastre o primeiro pet da clinica"}
          </p>
        </div>
      )}

      <PetModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        pet={editingPet}
        onSave={handleSave}
      />
    </div>
  )
}
