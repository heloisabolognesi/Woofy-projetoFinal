"use client"

import { CheckCircle2, Heart, Award, ShieldAlert } from "lucide-react"
import { useEffect, useRef, useState } from "react"

function AnimatedCounter({ target, suffix = "" }: { target: string; suffix?: string }) {
  const [isVisible, setIsVisible] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
        }
      },
      { threshold: 0.3 }
    )
    if (ref.current) observer.observe(ref.current)
    return () => observer.disconnect()
  }, [])

  return (
    <div ref={ref} className={`transition-all duration-700 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}>
      {target}{suffix}
    </div>
  )
}

export function AboutSection() {
  const stats = [
    { value: "+10", label: "Anos de Experiência", icon: Award },
    { value: "+15k", label: "Pets Atendidos", icon: Heart },
    { value: "100%", label: "Amor & Dedicação", icon: CheckCircle2 },
    { value: "24/7", label: "Suporte de Emergência", icon: ShieldAlert },
  ]

  return (
    <section id="sobre" className="py-28 bg-white dark:bg-slate-900 transition-colors duration-300 relative overflow-hidden">
      {/* Subtle decorative background elements */}
      <div className="absolute top-20 right-0 w-72 h-72 bg-[#AAC9BA]/5 rounded-full blur-3xl" />
      <div className="absolute bottom-20 left-0 w-96 h-96 bg-[#5E929F]/5 rounded-full blur-3xl" />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        {/* Padding top to account for hero's overlapping cards */}
        <div className="pt-16 lg:pt-24" />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Left Column: Image and Floating Card */}
          <div className="relative">
            <div className="aspect-[4/3] sm:aspect-square md:aspect-[4/3] rounded-[2.5rem] overflow-hidden shadow-2xl border-4 border-white dark:border-slate-800 relative group">
              <img
                src="https://images.unsplash.com/photo-1477884213360-7e9d7dcc1e48?q=80&w=1000"
                alt="Cachorro e gato sentados juntos felizes"
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
              {/* Subtle gradient overlay on image */}
              <div className="absolute inset-0 bg-gradient-to-tr from-[#305165]/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            </div>

            {/* Absolute Badges */}
            <div className="absolute -bottom-6 -right-4 md:right-6 bg-gradient-to-br from-[#305165] to-[#5E929F] dark:from-[#5E929F] dark:to-[#305165] p-6 rounded-2xl shadow-xl text-white max-w-[240px] animate-bounce-slow">
              <p className="text-3xl font-extrabold font-serif">100%</p>
              <p className="text-sm font-semibold opacity-90 mt-1">
                Foco no Bem-estar e na Saúde Preventiva dos Animais.
              </p>
            </div>

            <div className="absolute -top-6 -left-4 bg-gradient-to-r from-[#E1EABB] to-[#AAC9BA] dark:from-[#B1AE77] dark:to-[#5E929F] p-4 rounded-2xl shadow-lg text-[#305165] dark:text-white font-bold text-sm flex items-center gap-2">
              🐾 Clínica Altamente Recomendada
            </div>
          </div>

          {/* Right Column: Text content */}
          <div className="space-y-8">
            <div className="space-y-5">
              <div className="inline-flex items-center gap-2 bg-[#5E929F]/10 text-[#5E929F] dark:text-[#AAC9BA] px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider">
                <span className="w-1.5 h-1.5 rounded-full bg-[#5E929F] dark:bg-[#AAC9BA]" />
                Sobre a Clínica Woofy
              </div>
              <h3 className="text-3xl sm:text-4xl font-extrabold text-[#305165] dark:text-white leading-tight font-serif">
                Referência em Cuidado Veterinário Humanizado e Moderno
              </h3>
              <p className="text-base text-gray-600 dark:text-gray-300 leading-relaxed">
                Na Woofy, entendemos que os animais de estimação são membros valiosos da família. Desde a nossa fundação,
                temos o compromisso de fornecer o mais alto padrão de atendimento médico de forma carinhosa, ética e com
                total transparência.
              </p>
              <p className="text-base text-gray-600 dark:text-gray-300 leading-relaxed">
                Nossa clínica conta com infraestrutura de ponta, centro cirúrgico completo, exames de diagnóstico
                imediatos e ambientes climatizados pensados especialmente para reduzir o estresse dos pets durante as
                consultas.
              </p>
            </div>

            {/* Core Values List */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[
                "Equipe Especializada e Apaixonada",
                "Tratamento Sem Estresse (Fear-Free)",
                "Instalações Limpas e Modernas",
                "Atendimento Emergencial Rápido",
              ].map((value, idx) => (
                <div key={idx} className="flex items-center gap-3 p-3 rounded-xl hover:bg-[#AAC9BA]/5 transition-colors duration-300">
                  <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-[#AAC9BA]/15 flex items-center justify-center">
                    <CheckCircle2 className="h-4 w-4 text-[#5E929F] dark:text-[#AAC9BA]" />
                  </div>
                  <span className="text-sm font-bold text-[#305165] dark:text-gray-200">{value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Stats Section Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 mt-24 pt-12 border-t border-gray-100 dark:border-slate-800">
          {stats.map((stat, index) => {
            const Icon = stat.icon
            return (
              <div key={index} className="text-center space-y-2 flex flex-col items-center group">
                <div className="h-14 w-14 rounded-2xl bg-gradient-to-br from-[#AAC9BA]/20 to-[#5E929F]/10 dark:from-[#5E929F]/15 dark:to-[#AAC9BA]/5 flex items-center justify-center text-[#305165] dark:text-[#AAC9BA] mb-2 transition-all duration-500 group-hover:shadow-lg group-hover:shadow-[#AAC9BA]/20 group-hover:scale-110">
                  <Icon className="h-6 w-6" />
                </div>
                <div className="text-4xl font-extrabold text-[#305165] dark:text-white font-serif">
                  <AnimatedCounter target={stat.value} />
                </div>
                <div className="text-sm font-semibold text-gray-500 dark:text-gray-400">{stat.label}</div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
