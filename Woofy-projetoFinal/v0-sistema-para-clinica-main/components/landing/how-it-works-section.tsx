import { UserPlus, Settings2, TrendingUp } from "lucide-react"

const steps = [
  {
    title: "Cadastro",
    description: "Configure seu negócio em minutos com nossa interface intuitiva.",
    icon: UserPlus,
  },
  {
    title: "Organização",
    description: "Centralize clientes, pets e serviços em um único lugar seguro.",
    icon: Settings2,
  },
  {
    title: "Crescimento",
    description: "Acompanhe métricas e aumente seus resultados com inteligência.",
    icon: TrendingUp,
  }
]

export function HowItWorksSection() {
  return (
    <section id="como-funciona" className="py-24 bg-[#F7F7F2]">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-20">
          <h2 className="text-4xl font-bold text-[#305165]">Como funciona a Woofy?</h2>
        </div>

        <div className="relative">
          {/* Connection Line (Desktop) */}
          <div className="hidden lg:block absolute top-1/2 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-[#AAC9BA] to-transparent -translate-y-1/2" />
          
          <div className="grid lg:grid-cols-3 gap-12">
            {steps.map((step, index) => (
              <div key={index} className="relative flex flex-col items-center text-center group">
                <div className="h-20 w-20 rounded-full bg-white border-4 border-[#AAC9BA] flex items-center justify-center mb-8 relative z-10 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                  <step.icon className="text-[#305165]" size={32} />
                  <div className="absolute -top-2 -right-2 h-8 w-8 rounded-full bg-[#305165] text-white text-sm font-bold flex items-center justify-center">
                    {index + 1}
                  </div>
                </div>
                <h3 className="text-2xl font-bold text-[#305165] mb-4">{step.title}</h3>
                <p className="text-[#6B7280] max-w-xs leading-relaxed">
                  {step.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
