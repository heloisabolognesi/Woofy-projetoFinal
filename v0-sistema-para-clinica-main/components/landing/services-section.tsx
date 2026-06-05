"use client"

import { Stethoscope, Activity, Syringe, Scissors, Heart, ShieldAlert } from "lucide-react"

export function ServicesSection() {
  const services = [
    {
      title: "Consultas e Especialidades",
      description:
        "Atendimento veterinário atencioso, clínico geral e diversas especialidades como cardiologia e ortopedia.",
      icon: Stethoscope,
      gradient: "from-[#AAC9BA]/25 to-[#AAC9BA]/5",
      iconColor: "text-[#305165] dark:text-[#AAC9BA]",
      hoverGradient: "group-hover:from-[#305165] group-hover:to-[#5E929F]",
    },
    {
      title: "Cirurgia e Internação",
      description:
        "Centro cirúrgico equipado com anestesia inalatória e monitoramento multiparamétrico completo para a máxima segurança.",
      icon: Heart,
      gradient: "from-[#5E929F]/25 to-[#5E929F]/5",
      iconColor: "text-[#5E929F]",
      hoverGradient: "group-hover:from-[#5E929F] group-hover:to-[#305165]",
    },
    {
      title: "Vacinação e Prevenção",
      description:
        "Vacinas importadas (V10, V8, Antirrábica, Quádrupla felina) e orientações preventivas personalizadas.",
      icon: Syringe,
      gradient: "from-[#E1EABB]/40 to-[#E1EABB]/10",
      iconColor: "text-[#B1AE77] dark:text-[#E1EABB]",
      hoverGradient: "group-hover:from-[#B1AE77] group-hover:to-[#AAC9BA]",
    },
    {
      title: "Banho e Estética Premium",
      description:
        "Banhos relaxantes, tosa de raça, tosa higiênica e corte de unhas utilizando produtos hipoalergênicos de alto padrão.",
      icon: Scissors,
      gradient: "from-[#AAC9BA]/25 to-[#AAC9BA]/5",
      iconColor: "text-[#305165] dark:text-[#AAC9BA]",
      hoverGradient: "group-hover:from-[#305165] group-hover:to-[#5E929F]",
    },
    {
      title: "Exames de Imagem e Laboratório",
      description:
        "Exames de sangue rápidos, ultrassom e raio-x realizados diretamente na clínica para diagnóstico ágil.",
      icon: Activity,
      gradient: "from-[#5E929F]/25 to-[#5E929F]/5",
      iconColor: "text-[#5E929F]",
      hoverGradient: "group-hover:from-[#5E929F] group-hover:to-[#305165]",
    },
    {
      title: "Odontologia Veterinária",
      description:
        "Tratamento de tártaro, extrações necessárias e orientações de escovação para manter o hálito e dentes do pet saudáveis.",
      icon: ShieldAlert,
      gradient: "from-[#E1EABB]/40 to-[#E1EABB]/10",
      iconColor: "text-[#B1AE77] dark:text-[#E1EABB]",
      hoverGradient: "group-hover:from-[#B1AE77] group-hover:to-[#AAC9BA]",
    },
  ]

  return (
    <section id="servicos" className="py-28 bg-[#F5F4EE] dark:bg-slate-950 transition-colors duration-300 relative overflow-hidden">
      {/* Decorative background */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-[#AAC9BA]/5 rounded-full blur-3xl" />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="text-center max-w-3xl mx-auto space-y-5 mb-20">
          <div className="inline-flex items-center gap-2 bg-[#5E929F]/10 text-[#5E929F] dark:text-[#AAC9BA] px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider mx-auto">
            <span className="w-1.5 h-1.5 rounded-full bg-[#5E929F] dark:bg-[#AAC9BA]" />
            Nossos Serviços
          </div>
          <h3 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#305165] dark:text-white font-serif leading-tight">
            Cuidado Médico e Bem-Estar Completo para Seu Pet
          </h3>
          <p className="text-gray-500 dark:text-gray-400 text-lg">
            Oferecemos uma gama completa de soluções de saúde e estética pet para garantir a qualidade de vida e
            felicidade do seu companheiro em todas as fases da vida.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service, index) => {
            const Icon = service.icon
            return (
              <div
                key={index}
                className="bg-white dark:bg-slate-900 rounded-2xl p-8 shadow-sm border border-gray-100/80 dark:border-slate-800 transition-all duration-500 hover:-translate-y-3 hover:shadow-xl hover:shadow-[#305165]/5 hover:border-[#AAC9BA]/30 dark:hover:border-slate-700 group relative overflow-hidden"
              >
                {/* Subtle hover background glow */}
                <div className="absolute inset-0 bg-gradient-to-br from-[#AAC9BA]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl" />

                <div className="relative z-10">
                  <div
                    className={`h-14 w-14 rounded-2xl flex items-center justify-center bg-gradient-to-br ${service.gradient} ${service.iconColor} mb-6 transition-all duration-500 group-hover:scale-110 group-hover:shadow-lg ${service.hoverGradient} group-hover:text-white`}
                  >
                    <Icon className="h-6 w-6" />
                  </div>
                  <h4 className="text-xl font-bold text-[#305165] dark:text-white mb-3">{service.title}</h4>
                  <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">{service.description}</p>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
