import { 
  Users, 
  Calendar, 
  DollarSign, 
  Scissors, 
  Heart, 
  BarChart3 
} from "lucide-react"

const features = [
  {
    title: "Gestão de Clientes",
    description: "Cadastro completo de tutores e seus pets com histórico detalhado e fácil acesso.",
    icon: Users,
    color: "bg-[#AAC9BA]/20 text-[#305165]"
  },
  {
    title: "Agenda Automatizada",
    description: "Controle seus horários de forma inteligente com lembretes automáticos e visão clara.",
    icon: Calendar,
    color: "bg-[#5E929F]/20 text-[#305165]"
  },
  {
    title: "Controle Financeiro",
    description: "Fluxo de caixa, contas a pagar e receber integrados diretamente aos seus atendimentos.",
    icon: DollarSign,
    color: "bg-[#E1EABB]/40 text-[#305165]"
  },
  {
    title: "Serviços e Banho/Tosa",
    description: "Gestão especializada para serviços de estética pet com pacotes e recorrência.",
    icon: Scissors,
    color: "bg-[#B1AE77]/20 text-[#305165]"
  },
  {
    title: "Histórico dos Pets",
    description: "Acompanhe a evolução da saúde e serviços de cada pet em uma linha do tempo intuitiva.",
    icon: Heart,
    color: "bg-[#AAC9BA]/20 text-[#305165]"
  },
  {
    title: "Relatórios Inteligentes",
    description: "Métricas reais sobre o seu negócio para tomar decisões baseadas em dados concretos.",
    icon: BarChart3,
    color: "bg-[#5E929F]/20 text-[#305165]"
  }
]

export function FeaturesSection() {
  return (
    <section id="funcionalidades" className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center max-w-3xl mx-auto mb-20 space-y-4">
          <h2 className="text-4xl font-bold text-[#305165]">
            Tudo o que seu negócio pet precisa.
          </h2>
          <p className="text-lg text-[#6B7280]">
            Uma plataforma completa desenvolvida especificamente para as necessidades de clínicas, pet shops e centros de estética.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div 
              key={index}
              className="group p-8 rounded-[2rem] bg-[#F7F7F2] border border-transparent hover:border-[#AAC9BA] hover:bg-white hover:shadow-xl transition-all duration-300"
            >
              <div className={`h-14 w-14 rounded-2xl ${feature.color} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
                <feature.icon size={28} />
              </div>
              <h3 className="text-xl font-bold text-[#305165] mb-3">{feature.title}</h3>
              <p className="text-[#6B7280] leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
