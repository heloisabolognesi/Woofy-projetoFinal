"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"
import { CalendarDays, ClipboardList, LogOut, Stethoscope } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/context/auth-context"

export default function VeterinarioPage() {
  const { profile, signOut } = useAuth()
  const router = useRouter()

  async function handleSignOut() {
    await signOut()
    router.replace("/")
  }

  return (
    <div className="min-h-screen bg-[#F5F4EE] dark:bg-slate-900">
      <header className="border-b border-[#AAC9BA]/30 bg-white/85 dark:bg-slate-900/90 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
          <Link href="/">
            <img src="/logo-pet-shop.png" alt="Woofy" className="h-12 w-auto" />
          </Link>
          <Button variant="outline" onClick={handleSignOut} className="gap-2">
            <LogOut className="h-4 w-4" />
            Sair
          </Button>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
        <section className="rounded-lg border border-[#AAC9BA]/40 bg-white p-6 shadow-sm dark:bg-slate-800">
          <p className="text-sm font-semibold uppercase tracking-wide text-[#5E929F]">Area veterinaria</p>
          <h1 className="mt-2 font-serif text-3xl font-bold text-[#305165] dark:text-white">
            Ola, {profile?.full_name || "veterinario"}
          </h1>
          <p className="mt-2 max-w-2xl text-sm text-slate-600 dark:text-slate-300">
            Este espaco esta preparado para a proxima fase: agendamentos, dados do pet, feedback de consulta e historico clinico.
          </p>
        </section>

        <section className="mt-6 grid gap-4 md:grid-cols-3">
          <PlaceholderCard icon={CalendarDays} title="Ver agendamentos" />
          <PlaceholderCard icon={Stethoscope} title="Registrar feedback" />
          <PlaceholderCard icon={ClipboardList} title="Atualizar historico" />
        </section>
      </main>
    </div>
  )
}

function PlaceholderCard({ icon: Icon, title }: { icon: typeof CalendarDays; title: string }) {
  return (
    <div className="rounded-lg border border-border bg-card p-5 shadow-sm">
      <Icon className="h-5 w-5 text-[#5E929F]" />
      <h2 className="mt-3 font-serif text-xl font-bold text-card-foreground">{title}</h2>
      <p className="mt-2 text-sm text-muted-foreground">Reservado para implementacao futura.</p>
    </div>
  )
}
