"use client"

import { createContext, useContext, useState, type ReactNode } from "react"
import {
  pets as initialPets,
  consultas as initialConsultas,
  vacinas as initialVacinas,
  historico as initialHistorico,
  lancamentos as initialLancamentos,
  agendamentos as initialAgendamentos,
  type Pet,
  type Consulta,
  type Vacina,
  type HistoricoItem,
  type Lancamento,
  type Agendamento,
} from "@/lib/mock-data"

interface Toast {
  id: string
  message: string
  type: "success" | "error"
}

interface AppContextType {
  pets: Pet[]
  setPets: React.Dispatch<React.SetStateAction<Pet[]>>
  consultas: Consulta[]
  setConsultas: React.Dispatch<React.SetStateAction<Consulta[]>>
  vacinas: Vacina[]
  setVacinas: React.Dispatch<React.SetStateAction<Vacina[]>>
  historico: HistoricoItem[]
  setHistorico: React.Dispatch<React.SetStateAction<HistoricoItem[]>>
  lancamentos: Lancamento[]
  setLancamentos: React.Dispatch<React.SetStateAction<Lancamento[]>>
  agendamentos: Agendamento[]
  setAgendamentos: React.Dispatch<React.SetStateAction<Agendamento[]>>
  toasts: Toast[]
  addToast: (message: string, type?: "success" | "error") => void
  removeToast: (id: string) => void
}

const AppContext = createContext<AppContextType | undefined>(undefined)

export function AppProvider({ children }: { children: ReactNode }) {
  const [pets, setPets] = useState<Pet[]>(initialPets)
  const [consultas, setConsultas] = useState<Consulta[]>(initialConsultas)
  const [vacinas, setVacinas] = useState<Vacina[]>(initialVacinas)
  const [historico, setHistorico] = useState<HistoricoItem[]>(initialHistorico)
  const [lancamentos, setLancamentos] = useState<Lancamento[]>(initialLancamentos)
  const [agendamentos, setAgendamentos] = useState<Agendamento[]>(initialAgendamentos)
  const [toasts, setToasts] = useState<Toast[]>([])

  const addToast = (message: string, type: "success" | "error" = "success") => {
    const id = Math.random().toString(36).substring(7)
    setToasts((prev) => [...prev, { id, message, type }])
    setTimeout(() => {
      removeToast(id)
    }, 3000)
  }

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id))
  }

  return (
    <AppContext.Provider
      value={{
        pets,
        setPets,
        consultas,
        setConsultas,
        vacinas,
        setVacinas,
        historico,
        setHistorico,
        lancamentos,
        setLancamentos,
        agendamentos,
        setAgendamentos,
        toasts,
        addToast,
        removeToast,
      }}
    >
      {children}
    </AppContext.Provider>
  )
}

export function useApp() {
  const context = useContext(AppContext)
  if (context === undefined) {
    throw new Error("useApp must be used within an AppProvider")
  }
  return context
}
