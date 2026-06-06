"use client"

import { Suspense, useState } from "react"
import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"
import { Eye, EyeOff, LogIn, Loader2, Moon, Sun } from "lucide-react"
import { useTheme } from "next-themes"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useAuth } from "@/context/auth-context"
import { getRoleHome } from "@/lib/auth-routes"

function LoginForm() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const { signIn, signOut } = useAuth()
  const { theme, setTheme } = useTheme()
  const router = useRouter()
  const searchParams = useSearchParams()
  const redirect = searchParams.get("redirect")
  const approvalError = searchParams.get("approval")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setIsLoading(true)

    try {
      const { error: signInError, profile } = await signIn(email, password)

      if (signInError) {
        if (signInError.message.includes("Invalid login credentials")) {
          setError("E-mail ou senha incorretos. Tente novamente.")
        } else if (signInError.message.includes("Email not confirmed")) {
          setError("Não foi possível fazer login. Verifique se sua conta já foi aprovada pela clínica.")
        } else {
          setError(signInError.message || "Erro ao fazer login. Tente novamente.")
        }
        return
      }

      if (!profile || profile.approval_status === "pending") {
        router.push("/aguardando-aprovacao")
        router.refresh()
        return
      }

      if (profile.approval_status === "rejected") {
        await signOut()
        setError("Seu acesso não foi aprovado. Entre em contato com a clínica.")
        return
      }

      router.push(redirect || getRoleHome(profile?.role))
      router.refresh()
    } catch {
      setError("Erro inesperado. Tente novamente mais tarde.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#F5F4EE] dark:bg-slate-900 flex items-center justify-center p-4 transition-colors duration-300">
      {/* Decorative background elements */}
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
        {/* Logo */}
        <div className="flex justify-center mb-8">
          <Link href="/" className="transition-transform duration-300 hover:scale-105">
            <img
              src="/logo-pet-shop.png"
              alt="Woofy Logo"
              className="h-20 w-auto object-contain"
            />
          </Link>
        </div>

        {/* Login Card */}
        <div className="bg-white/95 dark:bg-slate-800/95 backdrop-blur-xl rounded-2xl shadow-xl border border-gray-100/50 dark:border-slate-700/50 p-8">
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold text-[#305165] dark:text-white font-serif">
              Bem-vindo de volta
            </h1>
            <p className="text-sm text-[#5E929F] dark:text-[#AAC9BA] mt-2">
              Faça login para acessar o painel da clínica
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Error message */}
            {(error || approvalError === "rejected") && (
              <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800/50 rounded-xl p-4 animate-in fade-in slide-in-from-top-2 duration-300">
                <p className="text-sm text-red-600 dark:text-red-400 text-center">
                  {error || "Seu acesso não foi aprovado. Entre em contato com a clínica."}
                </p>
              </div>
            )}

            {/* Email field */}
            <div className="space-y-2">
              <Label htmlFor="login-email" className="text-[#305165] dark:text-gray-200 font-medium">
                E-mail
              </Label>
              <Input
                id="login-email"
                type="email"
                placeholder="seu@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoComplete="email"
                className="h-11 rounded-xl border-[#AAC9BA]/50 dark:border-slate-600 bg-white dark:bg-slate-700/50 focus-visible:border-[#5E929F] focus-visible:ring-[#5E929F]/30 placeholder:text-[#AAC9BA] dark:placeholder:text-slate-400"
              />
            </div>

            {/* Password field */}
            <div className="space-y-2">
              <Label htmlFor="login-password" className="text-[#305165] dark:text-gray-200 font-medium">
                Senha
              </Label>
              <div className="relative">
                <Input
                  id="login-password"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  autoComplete="current-password"
                  className="h-11 rounded-xl border-[#AAC9BA]/50 dark:border-slate-600 bg-white dark:bg-slate-700/50 focus-visible:border-[#5E929F] focus-visible:ring-[#5E929F]/30 pr-11 placeholder:text-[#AAC9BA] dark:placeholder:text-slate-400"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#AAC9BA] hover:text-[#5E929F] dark:text-slate-400 dark:hover:text-slate-200 transition-colors"
                  aria-label={showPassword ? "Ocultar senha" : "Mostrar senha"}
                >
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
            </div>

            {/* Submit button */}
            <Button
              type="submit"
              disabled={isLoading}
              className="w-full h-12 rounded-full bg-gradient-to-r from-[#305165] to-[#5E929F] text-white font-bold text-base shadow-lg shadow-[#5E929F]/20 transition-all duration-300 hover:scale-[1.02] hover:shadow-xl hover:shadow-[#5E929F]/30 disabled:opacity-70 disabled:hover:scale-100"
            >
              {isLoading ? (
                <span className="flex items-center gap-2">
                  <Loader2 className="h-5 w-5 animate-spin" />
                  Entrando...
                </span>
              ) : (
                <span className="flex items-center gap-2">
                  <LogIn className="h-5 w-5" />
                  Entrar
                </span>
              )}
            </Button>
          </form>

          {/* Divider */}
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-[#AAC9BA]/30 dark:border-slate-600/50" />
            </div>
            <div className="relative flex justify-center text-xs">
              <span className="bg-white dark:bg-slate-800 px-3 text-[#AAC9BA] dark:text-slate-400 uppercase tracking-wider font-medium">
                ou
              </span>
            </div>
          </div>

          {/* Registration link */}
          <div className="text-center">
            <p className="text-sm text-[#5E929F] dark:text-[#AAC9BA]">
              Não tem uma conta?{" "}
              <Link
                href="/registro"
                className="font-bold text-[#305165] dark:text-white hover:text-[#5E929F] dark:hover:text-[#AAC9BA] transition-colors underline-offset-4 hover:underline"
              >
                Cadastre-se
              </Link>
            </p>
          </div>
        </div>

        {/* Back to home */}
        <div className="text-center mt-6">
          <Link
            href="/"
            className="text-sm text-[#5E929F] dark:text-[#AAC9BA] hover:text-[#305165] dark:hover:text-white transition-colors font-medium"
          >
            ← Voltar para o site
          </Link>
        </div>
      </div>
    </div>
  )
}

export default function LoginPage() {
  return (
    <Suspense>
      <LoginForm />
    </Suspense>
  )
}
