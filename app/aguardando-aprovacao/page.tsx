"use client"

import Link from "next/link"
import { CheckCircle2, Home, LogIn, Moon, Sun } from "lucide-react"
import { useTheme } from "next-themes"
import { Button } from "@/components/ui/button"

export default function AguardandoAprovacaoPage() {
  const { theme, setTheme } = useTheme()

  return (
    <div className="min-h-screen bg-[#F5F4EE] dark:bg-slate-900 flex items-center justify-center p-4 transition-colors duration-300">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-[#AAC9BA]/20 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-[#5E929F]/15 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#E1EABB]/10 rounded-full blur-3xl" />
      </div>

      <div className="w-full max-w-md relative z-10">
        <div className="mb-4 flex justify-end">
          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            className="rounded-full text-[#305165] hover:bg-[#AAC9BA]/15 dark:text-gray-200 dark:hover:bg-slate-800"
            aria-label="Alternar tema"
          >
            {theme === "dark" ? <Sun className="h-5 w-5 text-yellow-400" /> : <Moon className="h-5 w-5" />}
          </Button>
        </div>

        <div className="flex justify-center mb-8">
          <Link href="/" className="transition-transform duration-300 hover:scale-105">
            <img src="/logo-pet-shop.png" alt="Woofy Logo" className="h-20 w-auto object-contain" />
          </Link>
        </div>

        <div className="bg-white/95 dark:bg-slate-800/95 backdrop-blur-xl rounded-2xl shadow-xl border border-gray-100/50 dark:border-slate-700/50 p-8 text-center">
          <div className="flex justify-center mb-4">
            <div className="p-4 bg-gradient-to-br from-[#AAC9BA]/30 to-[#AAC9BA]/10 rounded-2xl">
              <CheckCircle2 className="h-12 w-12 text-[#5E929F]" />
            </div>
          </div>
          <h1 className="text-2xl font-bold text-[#305165] dark:text-white font-serif mb-3">
            Conta criada com sucesso.
          </h1>
          <div className="space-y-3 text-sm text-[#5E929F] dark:text-[#AAC9BA] leading-relaxed">
            <p>Aguarde a confirmação dos administradores da clínica.</p>
            <p>Assim que sua conta for aprovada, você poderá acessar seus pets e agendamentos.</p>
          </div>
          <div className="mt-8 grid gap-3 sm:grid-cols-2">
            <Button asChild variant="outline" className="h-11 rounded-full">
              <Link href="/" className="gap-2">
                <Home className="h-4 w-4" />
                Voltar ao início
              </Link>
            </Button>
            <Button
              asChild
              className="h-11 rounded-full bg-gradient-to-r from-[#305165] to-[#5E929F] text-white font-bold shadow-lg shadow-[#5E929F]/20"
            >
              <Link href="/login" className="gap-2">
                <LogIn className="h-4 w-4" />
                Login
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
