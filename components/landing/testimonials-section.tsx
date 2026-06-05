import { Star, Quote } from "lucide-react"

const testimonials = [
  {
    name: "Camila Rodrigues",
    role: "Tutora do Thor (Corgi)",
    content:
      "A equipe da Woofy cuidou do Thor com um carinho imensurável. O atendimento emergencial e o diagnóstico rápido foram cruciais para a recuperação dele. Recomendo muito!",
    image: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=150",
  },
  {
    name: "Bruno Guedes",
    role: "Tutor da Mel (Gata Persa)",
    content:
      "O serviço de estética e tosa higiênica é incrível. A Mel costuma ficar muito estressada, mas os profissionais daqui têm uma paciência enorme e usam técnicas super tranquilas.",
    image: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?q=80&w=150",
  },
  {
    name: "Mariana Costa",
    role: "Tutora do Pipoca (Vira-lata)",
    content:
      "Infraestrutura impecável e atendimento humanizado de verdade. Você percebe o amor pelos animais em cada detalhe, desde a recepção até os veterinários. Nota 10!",
    image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=150",
  },
]

export function TestimonialsSection() {
  return (
    <section className="py-28 bg-[#F5F4EE] dark:bg-slate-950 transition-colors duration-300 relative overflow-hidden">
      {/* Decorative */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#AAC9BA]/20 to-transparent" />
      <div className="absolute top-20 left-10 w-60 h-60 bg-[#AAC9BA]/5 rounded-full blur-3xl" />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-20 space-y-5">
          <div className="inline-flex items-center gap-2 bg-[#5E929F]/10 text-[#5E929F] dark:text-[#AAC9BA] px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider mx-auto">
            <span className="w-1.5 h-1.5 rounded-full bg-[#5E929F] dark:bg-[#AAC9BA]" />
            Depoimentos
          </div>
          <h3 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#305165] dark:text-white font-serif leading-tight">
            O que os Tutores dizem Sobre Nós
          </h3>
          <p className="text-gray-500 dark:text-gray-400 text-lg">
            A satisfação e a saúde dos nossos pacientes peludos são o combustível do nosso trabalho diário. Veja
            depoimentos reais de quem confia na Woofy.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {testimonials.map((t, index) => (
            <div
              key={index}
              className="bg-white dark:bg-slate-900 p-8 rounded-[2rem] border border-gray-100/80 dark:border-slate-800 flex flex-col gap-6 hover:shadow-xl hover:shadow-[#305165]/5 dark:hover:shadow-black/30 transition-all duration-500 hover:-translate-y-2 group relative overflow-hidden"
            >
              {/* Quote decoration */}
              <Quote className="absolute top-6 right-6 h-10 w-10 text-[#AAC9BA]/10 dark:text-[#5E929F]/10 group-hover:text-[#AAC9BA]/20 transition-colors duration-500" />

              <div className="flex gap-1">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="fill-yellow-400 text-yellow-400 drop-shadow-sm" size={18} />
                ))}
              </div>
              <p className="text-gray-600 dark:text-gray-300 leading-relaxed italic relative z-10">
                &ldquo;{t.content}&rdquo;
              </p>
              <div className="flex items-center gap-4 mt-auto pt-4 border-t border-gray-100 dark:border-slate-800">
                <img
                  src={t.image}
                  alt={t.name}
                  className="h-12 w-12 rounded-full object-cover border-2 border-[#AAC9BA] dark:border-[#5E929F] shadow-md"
                />
                <div>
                  <p className="font-bold text-[#305165] dark:text-white">{t.name}</p>
                  <p className="text-xs font-semibold text-[#5E929F] dark:text-[#AAC9BA]">{t.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
