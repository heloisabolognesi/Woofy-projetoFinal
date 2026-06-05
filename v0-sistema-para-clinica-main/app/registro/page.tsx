"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Eye, EyeOff, UserPlus, Loader2, CheckCircle2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useAuth } from "@/context/auth-context"

export default function RegistroPage() {
  const [fullName, setFullName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const { signUp } = useAuth()
  const router = useRouter()

  const validateForm = (): string | null => {
    if (fullName.trim().length < 3) {
      return "O nome deve ter pelo menos 3 caracteres."
    }
    if (password.length < 6) {
      return "A senha deve ter pelo menos 6 caracteres."
    }
    if (password !== confirmPassword) {
      return "As senhas não coincidem."
    }
    return null
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    const validationError = validateForm()
    if (validationError) {
      setError(validationError)
      return
    }

    setIsLoading(true)

    try {
      const { error: signUpError, confirmEmail } = await signUp(email, password, fullName.trim())

      if (signUpError) {
        if (signUpError.message.includes("already registered")) {
          setError("Este e-mail já está cadastrado. Tente fazer login.")
        } else {
          setError("Erro ao criar conta. Tente novamente.")
        }
        return
      }

      if (confirmEmail) {
        setSuccess(true)
      } else {
        // If email confirmation is disabled, redirect directly
        router.push("/dashboard")
        router.refresh()
      }
    } catch {
      setError("Erro inesperado. Tente novamente mais tarde.")
    } finally {
      setIsLoading(false)
    }
  }

  // Success state — email confirmation required
  if (success) {
    return (
      <div className="min-h-screen bg-[#F5F4EE] dark:bg-slate-900 flex items-center justify-center p-4 transition-colors duration-300">
        {/* Decorative background elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-[#AAC9BA]/20 rounded-full blur-3xl" />
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-[#5E929F]/15 rounded-full blur-3xl" />
        </div>

        <div className="w-full max-w-md relative z-10">
          <div className="flex justify-center mb-8">
            <Link href="/" className="transition-transform duration-300 hover:scale-105">
              <img
                src="/logo-transparent.png"
                alt="Woofy Logo"
                className="h-20 w-auto object-contain"
              />
            </Link>
          </div>

          <div className="bg-white/95 dark:bg-slate-800/95 backdrop-blur-xl rounded-2xl shadow-xl border border-gray-100/50 dark:border-slate-700/50 p-8 text-center">
            <div className="flex justify-center mb-4">
              <div className="p-4 bg-gradient-to-br from-[#AAC9BA]/30 to-[#AAC9BA]/10 rounded-2xl">
                <CheckCircle2 className="h-12 w-12 text-[#5E929F]" />
              </div>
            </div>
            <h2 className="text-2xl font-bold text-[#305165] dark:text-white font-serif mb-3">
              Conta criada!
            </h2>
            <p className="text-sm text-[#5E929F] dark:text-[#AAC9BA] leading-relaxed mb-6">
              Enviamos um link de confirmação para <strong className="text-[#305165] dark:text-white">{email}</strong>. 
              Verifique sua caixa de entrada e clique no link para ativar sua conta.
            </p>
            <Button
              asChild
              className="w-full h-12 rounded-full bg-gradient-to-r from-[#305165] to-[#5E929F] text-white font-bold text-base shadow-lg shadow-[#5E929F]/20 transition-all duration-300 hover:scale-[1.02] hover:shadow-xl"
            >
              <Link href="/login">Ir para o Login</Link>
            </Button>
          </div>
        </div>
      </div>
    )
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

        {/* Registration Card */}
        <div className="bg-white/95 dark:bg-slate-800/95 backdrop-blur-xl rounded-2xl shadow-xl border border-gray-100/50 dark:border-slate-700/50 p-8">
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold text-[#305165] dark:text-white font-serif">
              Crie sua conta
            </h1>
            <p className="text-sm text-[#5E929F] dark:text-[#AAC9BA] mt-2">
              Cadastre-se para acessar o painel da clínica
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Error message */}
            {error && (
              <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800/50 rounded-xl p-4 animate-in fade-in slide-in-from-top-2 duration-300">
                <p className="text-sm text-red-600 dark:text-red-400 text-center">{error}</p>
              </div>
            )}

            {/* Full Name field */}
            <div className="space-y-2">
              <Label htmlFor="register-name" className="text-[#305165] dark:text-gray-200 font-medium">
                Nome completo
              </Label>
              <Input
                id="register-name"
                type="text"
                placeholder="Seu nome completo"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                required
                autoComplete="name"
                className="h-11 rounded-xl border-[#AAC9BA]/50 dark:border-slate-600 bg-white dark:bg-slate-700/50 focus-visible:border-[#5E929F] focus-visible:ring-[#5E929F]/30 placeholder:text-[#AAC9BA] dark:placeholder:text-slate-400"
              />
            </div>

            {/* Email field */}
            <div className="space-y-2">
              <Label htmlFor="register-email" className="text-[#305165] dark:text-gray-200 font-medium">
                E-mail
              </Label>
              <Input
                id="register-email"
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
              <Label htmlFor="register-password" className="text-[#305165] dark:text-gray-200 font-medium">
                Senha
              </Label>
              <div className="relative">
                <Input
                  id="register-password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Mínimo 6 caracteres"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  minLength={6}
                  autoComplete="new-password"
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

            {/* Confirm Password field */}
            <div className="space-y-2">
              <Label htmlFor="register-confirm-password" className="text-[#305165] dark:text-gray-200 font-medium">
                Confirmar senha
              </Label>
              <div className="relative">
                <Input
                  id="register-confirm-password"
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="Repita sua senha"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  minLength={6}
                  autoComplete="new-password"
                  className="h-11 rounded-xl border-[#AAC9BA]/50 dark:border-slate-600 bg-white dark:bg-slate-700/50 focus-visible:border-[#5E929F] focus-visible:ring-[#5E929F]/30 pr-11 placeholder:text-[#AAC9BA] dark:placeholder:text-slate-400"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#AAC9BA] hover:text-[#5E929F] dark:text-slate-400 dark:hover:text-slate-200 transition-colors"
                  aria-label={showConfirmPassword ? "Ocultar senha" : "Mostrar senha"}
                >
                  {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
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
                  Criando conta...
                </span>
              ) : (
                <span className="flex items-center gap-2">
                  <UserPlus className="h-5 w-5" />
                  Criar conta
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

          {/* Login link */}
          <div className="text-center">
            <p className="text-sm text-[#5E929F] dark:text-[#AAC9BA]">
              Já tem uma conta?{" "}
              <Link
                href="/login"
                className="font-bold text-[#305165] dark:text-white hover:text-[#5E929F] dark:hover:text-[#AAC9BA] transition-colors underline-offset-4 hover:underline"
              >
                Faça login
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
