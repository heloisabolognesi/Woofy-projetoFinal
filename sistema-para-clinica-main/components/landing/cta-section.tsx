import { Button } from "@/components/ui/button"

export function CTASection() {
  return (
    <section className="py-24 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="relative rounded-[3rem] bg-gradient-to-br from-[#305165] to-[#5E929F] p-12 lg:p-20 overflow-hidden text-center">
          {/* Decorative shapes */}
          <div className="absolute top-0 left-0 w-64 h-64 bg-white/10 rounded-full -translate-x-1/2 -translate-y-1/2 blur-3xl" />
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-[#AAC9BA]/20 rounded-full translate-x-1/3 translate-y-1/3 blur-3xl" />
          
          <div className="relative z-10 max-w-3xl mx-auto space-y-8">
            <h2 className="text-4xl lg:text-6xl font-bold text-white leading-tight">
              Leve seu negócio pet para o próximo nível.
            </h2>
            <p className="text-xl text-[#E1EABB] leading-relaxed">
              Junte-se a centenas de clínicas e pet shops que já otimizaram sua gestão com a Woofy. Comece seu teste gratuito hoje mesmo.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
              <Button size="lg" className="bg-white text-[#305165] hover:bg-[#E1EABB] rounded-full px-10 h-14 text-lg font-bold">
                Começar Agora
              </Button>
              <Button size="lg" variant="outline" className="border-2 border-white text-white hover:bg-white/10 rounded-full px-10 h-14 text-lg font-bold">
                Falar com Consultor
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
