"use client"

import { useEffect, useMemo, useState } from "react"
import { useRouter } from "next/navigation"
import { useApp } from "@/context/app-context"
import { useAuth } from "@/context/auth-context"
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
  Loader2,
} from "lucide-react"
import {
  archiveAdminPet,
  createAdminPet,
  getAdminPets,
  getClinicProfiles,
  updateAdminPet,
  type AdminPet,
  type Especie,
  type ProfileSummary,
  type SaveAdminPetInput,
} from "@/lib/clinic-data"
import { createClient } from "@/lib/supabase"

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

function calculateAge(dataNascimento: string | null) {
  if (!dataNascimento) return "Idade nao informada"

  const birthDate = new Date(dataNascimento + "T00:00:00")
  const today = new Date()
  let age = today.getFullYear() - birthDate.getFullYear()
  const monthDiff = today.getMonth() - birthDate.getMonth()

  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
    age -= 1
  }

  return age <= 0 ? "Menos de 1 ano" : `${age} ${age === 1 ? "ano" : "anos"}`
}

function PetCard({
  pet,
  onEdit,
  onArchive,
}: {
  pet: AdminPet
  onEdit: (pet: AdminPet) => void
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
          <p className="text-sm text-muted-foreground mt-1">
            {pet.peso ? `Peso: ${pet.peso} kg` : "Peso nao informado"}
          </p>
          <p className="text-sm text-muted-foreground mt-1">{calculateAge(pet.dataNascimento)}</p>
        </div>
      </div>

      <div className="mt-4 pt-4 border-t border-border">
        <p className="text-sm font-medium text-card-foreground">
          {pet.tutorProfileName || pet.tutor}
        </p>
        <div className="flex items-center gap-1 text-sm text-muted-foreground mt-1">
          <Phone className="h-3 w-3" />
          {pet.telefoneTutor || "Telefone nao informado"}
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
          title="Arquivar pet"
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
  tutors,
  onSave,
}: {
  isOpen: boolean
  onClose: () => void
  pet: AdminPet | null
  tutors: ProfileSummary[]
  onSave: (data: SaveAdminPetInput) => void
}) {
  const [formData, setFormData] = useState<SaveAdminPetInput>({
    userId: pet?.userId || "",
    nome: pet?.nome || "",
    especie: pet?.especie || "cao",
    raca: pet?.raca || "",
    dataNascimento: pet?.dataNascimento || "",
    peso: pet?.peso || null,
    tutor: pet?.tutor || "",
    telefoneTutor: pet?.telefoneTutor || "",
  })

  useEffect(() => {
    setFormData({
      userId: pet?.userId || "",
      nome: pet?.nome || "",
      especie: pet?.especie || "cao",
      raca: pet?.raca || "",
      dataNascimento: pet?.dataNascimento || "",
      peso: pet?.peso || null,
      tutor: pet?.tutor || "",
      telefoneTutor: pet?.telefoneTutor || "",
    })
  }, [pet, isOpen])

  if (!isOpen) return null

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault()
    onSave({
      ...formData,
      dataNascimento: formData.dataNascimento || null,
      tutor: formData.tutor.trim(),
      telefoneTutor: formData.telefoneTutor || null,
    })
  }

  const handleTutorChange = (userId: string) => {
    const selectedTutor = tutors.find((tutor) => tutor.id === userId)
    setFormData({
      ...formData,
      userId,
      tutor: selectedTutor?.fullName || formData.tutor,
    })
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
              Tutor responsavel
            </label>
            <select
              required
              value={formData.userId}
              onChange={(event) => handleTutorChange(event.target.value)}
              className="w-full px-3 py-2 border border-input rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
            >
              <option value="">Selecione um tutor</option>
              {tutors.map((tutor) => (
                <option key={tutor.id} value={tutor.id}>
                  {tutor.fullName || tutor.id}
                </option>
              ))}
            </select>
          </div>

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
                  especie: e.target.value as Especie,
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
                value={formData.dataNascimento || ""}
                onChange={(e) =>
                  setFormData({ ...formData, dataNascimento: e.target.value || null })
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
                step="0.1"
                min="0"
                value={formData.peso ?? ""}
                onChange={(e) =>
                  setFormData({ ...formData, peso: e.target.value ? Number(e.target.value) : null })
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
              value={formData.telefoneTutor || ""}
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
  const { addToast } = useApp()
  const { user, loading, refreshProfile } = useAuth()
  const router = useRouter()
  const supabase = useMemo(() => createClient(), [])
  const [pets, setPets] = useState<AdminPet[]>([])
  const [profiles, setProfiles] = useState<ProfileSummary[]>([])
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingPet, setEditingPet] = useState<AdminPet | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [filterEspecie, setFilterEspecie] = useState<string>("todos")
  const [isLoadingData, setIsLoadingData] = useState(true)

  const tutors = useMemo(
    () => profiles.filter((profile) => profile.role === "tutor"),
    [profiles],
  )

  useEffect(() => {
    async function loadData() {
      if (loading) return
      if (!user) {
        router.replace("/login?redirect=/pets")
        return
      }

      setIsLoadingData(true)
      await refreshProfile(user.id)

      try {
        const [petsResult, profilesResult] = await Promise.all([
          getAdminPets(supabase),
          getClinicProfiles(supabase),
        ])
        setPets(petsResult)
        setProfiles(profilesResult)
      } catch {
        addToast("Nao foi possivel carregar os pets reais do Supabase.", "error")
      } finally {
        setIsLoadingData(false)
      }
    }

    loadData()
  }, [addToast, loading, refreshProfile, router, supabase, user])

  const filteredPets = pets.filter((pet) => {
    if (pet.arquivado) return false
    const matchesSearch =
      pet.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
      pet.tutor.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (pet.tutorProfileName || "").toLowerCase().includes(searchTerm.toLowerCase())
    const matchesFilter =
      filterEspecie === "todos" || pet.especie === filterEspecie
    return matchesSearch && matchesFilter
  })

  const handleOpenModal = (pet?: AdminPet) => {
    setEditingPet(pet || null)
    setIsModalOpen(true)
  }

  const handleCloseModal = () => {
    setIsModalOpen(false)
    setEditingPet(null)
  }

  const handleSave = async (data: SaveAdminPetInput) => {
    try {
      if (editingPet) {
        const updatedPet = await updateAdminPet(supabase, editingPet.id, data)
        setPets((prev) =>
          prev.map((pet) => (pet.id === editingPet.id ? updatedPet : pet))
        )
        addToast("Pet atualizado com sucesso!")
      } else {
        const newPet = await createAdminPet(supabase, data)
        setPets((prev) => [newPet, ...prev])
        addToast("Pet cadastrado com sucesso!")
      }
      handleCloseModal()
    } catch {
      addToast("Nao foi possivel salvar o pet.", "error")
    }
  }

  const handleArchive = async (id: string) => {
    try {
      await archiveAdminPet(supabase, id)
      setPets((prev) =>
        prev.map((pet) => (pet.id === id ? { ...pet, arquivado: true } : pet))
      )
      addToast("Pet arquivado com sucesso!")
    } catch {
      addToast("Nao foi possivel arquivar o pet.", "error")
    }
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
        tutors={tutors}
        onSave={handleSave}
      />
    </div>
  )
}
