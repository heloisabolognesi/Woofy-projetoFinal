"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { useState, useEffect } from "react"
import { Menu, X, Sun, Moon } from "lucide-react"
import { cn } from "@/lib/utils"
import { useTheme } from "next-themes"

export function Header() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20)
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const navItems = [
    { name: "Início", href: "#" },
    { name: "Sobre", href: "#sobre" },
    { name: "Serviços", href: "#servicos" },
    { name: "Equipe", href: "#equipe" },
    { name: "Galeria", href: "#galeria" },
    { name: "Contato", href: "#contato" },
  ]

  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-500 px-6",
        isScrolled
          ? "bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl shadow-lg shadow-black/5 py-3 border-b border-gray-100/50 dark:border-slate-800/50"
          : "bg-gradient-to-b from-black/30 to-transparent py-5"
      )}
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <Link
          href="/"
          className="flex items-center transition-all duration-300 hover:scale-105"
        >
          <img
            src="/Pet shop (1).png"
            alt="Woofy Logo"
            className={cn(
              "h-12 w-auto object-contain transition-all duration-500",
              isScrolled
                ? "drop-shadow-[0_2px_8px_rgba(48,81,101,0.22)]"
                : "drop-shadow-[0_2px_10px_rgba(0,0,0,0.35)]"
            )}
          />
        </Link>

        {/* Desktop Menu */}
        <nav className="hidden md:flex items-center gap-8">
          {navItems.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "text-sm font-semibold transition-colors duration-300 relative after:absolute after:bottom-[-4px] after:left-0 after:w-0 after:h-[2px] after:transition-all after:duration-300 hover:after:w-full",
                isScrolled
                  ? "text-[#305165] dark:text-gray-200 hover:text-[#5E929F] dark:hover:text-[#AAC9BA] after:bg-[#5E929F]"
                  : "text-white/90 hover:text-white after:bg-[#AAC9BA] drop-shadow-sm"
              )}
            >
              {item.name}
            </Link>
          ))}
        </nav>

        <div className="hidden md:flex items-center gap-3">
          {/* Dark Mode Toggle */}
          {mounted && (
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              className={cn(
                "rounded-full w-10 h-10 transition-all duration-300",
                isScrolled
                  ? "text-[#305165] dark:text-gray-200 hover:bg-[#AAC9BA]/10 dark:hover:bg-slate-800"
                  : "text-white hover:bg-white/15 backdrop-blur-sm"
              )}
              aria-label="Alternar tema"
            >
              {theme === "dark" ? (
                <Sun className="h-5 w-5 text-yellow-400" />
              ) : (
                <Moon className={cn("h-5 w-5", isScrolled ? "text-[#305165]" : "text-white")} />
              )}
            </Button>
          )}

          <Button
            variant="ghost"
            asChild
            className={cn(
              "font-semibold transition-all duration-300 rounded-full",
              isScrolled
                ? "text-[#305165] dark:text-gray-200 hover:bg-[#AAC9BA]/10 dark:hover:bg-slate-800"
                : "text-white hover:bg-white/15 backdrop-blur-sm"
            )}
          >
            <Link href="/dashboard">Entrar</Link>
          </Button>

          <Button
            asChild
            className={cn(
              "rounded-full px-6 font-bold shadow-lg transition-all duration-300 hover:scale-105",
              isScrolled
                ? "bg-gradient-to-r from-[#305165] to-[#5E929F] text-white shadow-[#5E929F]/15"
                : "bg-[#AAC9BA] text-[#305165] hover:bg-[#AAC9BA]/90 shadow-black/20"
            )}
          >
            <a href="#contato">Agendar Consulta</a>
          </Button>
        </div>

        {/* Mobile Menu Toggle */}
        <div className="flex items-center gap-3 md:hidden">
          {mounted && (
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              className={cn(
                "rounded-full w-10 h-10",
                isScrolled
                  ? "text-[#305165] dark:text-gray-200"
                  : "text-white"
              )}
              aria-label="Alternar tema"
            >
              {theme === "dark" ? (
                <Sun className="h-5 w-5 text-yellow-400" />
              ) : (
                <Moon className={cn("h-5 w-5", isScrolled ? "text-[#305165]" : "text-white")} />
              )}
            </Button>
          )}

          <button
            className={cn(
              "p-2 rounded-full transition-all duration-300",
              isScrolled
                ? "text-[#305165] dark:text-gray-200"
                : "text-white hover:bg-white/15"
            )}
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden absolute top-full left-0 right-0 bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl border-t border-gray-100 dark:border-slate-800 p-6 shadow-xl animate-in fade-in slide-in-from-top-5">
          <nav className="flex flex-col gap-4">
            {navItems.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="text-base font-semibold text-[#305165] dark:text-gray-200 hover:text-[#5E929F] transition-colors"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                {item.name}
              </Link>
            ))}
            <hr className="my-2 border-gray-100 dark:border-slate-800" />
            <div className="flex flex-col gap-3">
              <Button variant="outline" asChild className="w-full justify-center border-[#305165] dark:border-slate-700 text-[#305165] dark:text-gray-200 hover:bg-[#AAC9BA]/10 rounded-full">
                <Link href="/dashboard" onClick={() => setIsMobileMenuOpen(false)}>Entrar</Link>
              </Button>
              <Button asChild className="w-full justify-center bg-gradient-to-r from-[#305165] to-[#5E929F] text-white rounded-full" onClick={() => setIsMobileMenuOpen(false)}>
                <a href="#contato">Agendar Consulta</a>
              </Button>
            </div>
          </nav>
        </div>
      )}
    </header>
  )
}
