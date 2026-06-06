"use client"

import { useEffect, useMemo, useState } from "react"
import { useRouter } from "next/navigation"
import { CheckCircle2, Loader2, SearchCheck, XCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { useApp } from "@/context/app-context"
import { useAuth } from "@/context/auth-context"
import { createClient } from "@/lib/supabase"
import {
  approveProfile,
  getPendingProfiles,
  rejectProfile,
  type PendingProfile,
} from "@/lib/clinic-data"

const roleLabels: Record<string, string> = {
  tutor: "Tutor",
  veterinario: "Veterinário",
  admin: "Admin",
}

export default function AprovacoesPage() {
  const { addToast } = useApp()
  const { user, loading, refreshProfile } = useAuth()
  const router = useRouter()
  const supabase = useMemo(() => createClient(), [])
  const [profiles, setProfiles] = useState<PendingProfile[]>([])
  const [rejectionReasons, setRejectionReasons] = useState<Record<string, string>>({})
  const [isLoadingData, setIsLoadingData] = useState(true)
  const [savingProfileId, setSavingProfileId] = useState<string | null>(null)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  useEffect(() => {
    async function loadPendingProfiles() {
      if (loading) return
      if (!user) {
        router.replace("/login?redirect=/dashboard/aprovacoes")
        return
      }

      setIsLoadingData(true)
      setErrorMessage(null)
      await refreshProfile(user.id)

      try {
        setProfiles(await getPendingProfiles(supabase))
      } catch {
        setErrorMessage("Não foi possível carregar as contas pendentes.")
      } finally {
        setIsLoadingData(false)
      }
    }

    loadPendingProfiles()
  }, [loading, refreshProfile, router, supabase, user])

  async function handleApprove(profileId: string) {
    if (!user) return

    setSavingProfileId(profileId)
    try {
      await approveProfile(supabase, profileId, user.id)
      setProfiles((current) => current.filter((profile) => profile.id !== profileId))
      addToast("Conta aprovada com sucesso!")
    } catch {
      addToast("Não foi possível aprovar a conta.", "error")
    } finally {
      setSavingProfileId(null)
    }
  }

  async function handleReject(profileId: string) {
    if (!user) return

    setSavingProfileId(profileId)
    try {
      await rejectProfile(supabase, profileId, user.id, rejectionReasons[profileId])
      setProfiles((current) => current.filter((profile) => profile.id !== profileId))
      addToast("Conta rejeitada com sucesso!")
    } catch {
      addToast("Não foi possível rejeitar a conta.", "error")
    } finally {
      setSavingProfileId(null)
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "2-digit",
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

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground font-serif">Aprovações</h1>
        <p className="text-muted-foreground mt-1">
          Revise contas pendentes antes de liberar o acesso ao sistema.
        </p>
        {errorMessage && <p className="mt-2 text-sm text-destructive">{errorMessage}</p>}
      </div>

      {profiles.length > 0 ? (
        <div className="space-y-4">
          {profiles.map((profile) => (
            <div key={profile.id} className="rounded-xl border border-border bg-card p-5 shadow-sm">
              <div className="grid gap-4 lg:grid-cols-[1fr_320px]">
                <div className="space-y-2">
                  <h2 className="font-serif text-xl font-bold text-card-foreground">
                    {profile.fullName || "Nome não informado"}
                  </h2>
                  <div className="grid gap-1 text-sm text-muted-foreground sm:grid-cols-2">
                    <p>
                      <span className="font-medium text-card-foreground">E-mail:</span>{" "}
                      {profile.email || "E-mail não informado"}
                    </p>
                    <p>
                      <span className="font-medium text-card-foreground">Perfil:</span>{" "}
                      {roleLabels[profile.role] || profile.role}
                    </p>
                    <p>
                      <span className="font-medium text-card-foreground">Status:</span> Pendente
                    </p>
                    <p>
                      <span className="font-medium text-card-foreground">Criado em:</span>{" "}
                      {formatDate(profile.createdAt)}
                    </p>
                  </div>
                </div>

                <div className="space-y-3">
                  <Textarea
                    value={rejectionReasons[profile.id] || ""}
                    onChange={(event) =>
                      setRejectionReasons((current) => ({
                        ...current,
                        [profile.id]: event.target.value,
                      }))
                    }
                    placeholder="Motivo da rejeição (opcional)"
                    className="min-h-20"
                  />
                  <div className="grid gap-2 sm:grid-cols-2">
                    <Button
                      type="button"
                      onClick={() => handleApprove(profile.id)}
                      disabled={savingProfileId === profile.id}
                      className="gap-2"
                    >
                      <CheckCircle2 className="h-4 w-4" />
                      Aprovar
                    </Button>
                    <Button
                      type="button"
                      variant="destructive"
                      onClick={() => handleReject(profile.id)}
                      disabled={savingProfileId === profile.id}
                      className="gap-2"
                    >
                      <XCircle className="h-4 w-4" />
                      Rejeitar
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="rounded-xl border border-border bg-card py-16 text-center">
          <SearchCheck className="mx-auto mb-4 h-16 w-16 text-muted-foreground/50" />
          <h2 className="text-lg font-medium text-card-foreground">Nenhuma conta pendente</h2>
          <p className="mt-1 text-muted-foreground">
            Novos cadastros aparecerão aqui para aprovação.
          </p>
        </div>
      )}
    </div>
  )
}
