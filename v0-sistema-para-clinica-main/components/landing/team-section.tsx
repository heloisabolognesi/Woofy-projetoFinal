"use client"

export function TeamSection() {
  const team = [
    {
      name: "Dra. Mariana Silva",
      role: "Diretora e Clínica Geral",
      crmv: "CRMV-SP 12345",
      image: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?q=80&w=400",
      bio: "Especialista em clínica médica de cães e gatos, com mais de 8 anos de dedicação à medicina veterinária preventiva.",
    },
    {
      name: "Dr. Ricardo Santos",
      role: "Cirurgião Geral e Ortopedia",
      crmv: "CRMV-SP 54321",
      image: "https://images.unsplash.com/photo-1622253692010-333f2da6031d?q=80&w=400",
      bio: "Responsável pelas cirurgias complexas e atendimentos ortopédicos, focado em reabilitação rápida e indolor.",
    },
    {
      name: "Dra. Beatriz Albuquerque",
      role: "Cardiologia Veterinária",
      crmv: "CRMV-SP 98765",
      image: "https://images.unsplash.com/photo-1594824476967-48c8b964273f?q=80&w=400",
      bio: "Realiza exames cardiológicos e diagnósticos por imagem, cuidando da saúde cardiovascular dos nossos pacientes seniores.",
    },
    {
      name: "Thiago Ramos",
      role: "Esteticista e Groomer Premium",
      crmv: "Especialista em Pelagem",
      image: "https://images.unsplash.com/photo-1537368910025-700350fe46c7?q=80&w=400",
      bio: "Especialista em tosa higiênica, hidratação de subpelos e tosa de raça, transformando o banho em um spa relaxante.",
    },
  ]

  return (
    <section id="equipe" className="py-28 bg-white dark:bg-slate-900 transition-colors duration-300 relative overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#AAC9BA]/20 to-transparent" />
      <div className="absolute bottom-40 right-0 w-80 h-80 bg-[#5E929F]/5 rounded-full blur-3xl" />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="text-center max-w-3xl mx-auto space-y-5 mb-20">
          <div className="inline-flex items-center gap-2 bg-[#5E929F]/10 text-[#5E929F] dark:text-[#AAC9BA] px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider mx-auto">
            <span className="w-1.5 h-1.5 rounded-full bg-[#5E929F] dark:bg-[#AAC9BA]" />
            Nossos Especialistas
          </div>
          <h3 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#305165] dark:text-white font-serif leading-tight">
            Profissionais Qualificados que Amam o que Fazem
          </h3>
          <p className="text-gray-500 dark:text-gray-400 text-lg">
            Nossa equipe é formada por médicos veterinários e profissionais qualificados, em constante atualização
            científica para oferecer o melhor tratamento técnico e humano.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {team.map((member, index) => (
            <div
              key={index}
              className="bg-[#F5F4EE] dark:bg-slate-800 rounded-3xl overflow-hidden border border-gray-100/80 dark:border-slate-700/80 shadow-sm transition-all duration-500 hover:-translate-y-3 hover:shadow-xl hover:shadow-[#305165]/5 group"
            >
              {/* Photo Area */}
              <div className="relative aspect-square overflow-hidden bg-gray-100 dark:bg-slate-700">
                <img
                  src={member.image}
                  alt={member.name}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />

                {/* Gradient overlay - always visible at bottom for name readability */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

              </div>

              {/* Bio & Details Area */}
              <div className="p-6 space-y-3">
                <div>
                  <h4 className="text-lg font-bold text-[#305165] dark:text-white leading-tight">{member.name}</h4>
                  <div className="flex justify-between items-center mt-1.5">
                    <p className="text-xs font-semibold text-[#5E929F] dark:text-[#AAC9BA]">{member.role}</p>
                    <span className="text-[10px] text-gray-400 font-semibold px-2 py-0.5 bg-white/80 dark:bg-slate-700 rounded-full border border-gray-200/50 dark:border-slate-600">
                      {member.crmv}
                    </span>
                  </div>
                </div>
                <p className="text-xs text-gray-500 dark:text-gray-300 leading-relaxed pt-3 border-t border-gray-200/50 dark:border-slate-700">
                  {member.bio}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
