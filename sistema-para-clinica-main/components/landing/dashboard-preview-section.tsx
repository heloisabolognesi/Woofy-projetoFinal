import { Button } from "@/components/ui/button"

export function DashboardPreviewSection() {
  return (
    <section className="py-24 bg-[#305165] overflow-hidden">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <div className="space-y-8">
            <h2 className="text-4xl lg:text-5xl font-bold text-white leading-tight">
              Desenvolvido para simplificar sua operação diária.
            </h2>
            <p className="text-xl text-[#AAC9BA] leading-relaxed">
              Esqueça planilhas confusas e agendas de papel. Tenha o controle total do seu negócio na palma da sua mão com uma interface que você vai amar usar.
            </p>
            <div className="space-y-4">
               {[
                 "Interface limpa e intuitiva",
                 "Acesso de qualquer dispositivo",
                 "Segurança de dados bancária",
                 "Suporte humanizado 24/7"
               ].map((item) => (
                 <div key={item} className="flex items-center gap-3 text-white font-medium">
                    <div className="h-2 w-2 rounded-full bg-[#E1EABB]" />
                    {item}
                 </div>
               ))}
            </div>
            <Button className="bg-[#5E929F] hover:bg-[#5E929F]/90 text-white rounded-full px-8 h-12">
              Explorar Funcionalidades
            </Button>
          </div>

          <div className="relative">
             {/* Abstract Dashboard Mockup */}
             <div className="bg-[#5E929F]/20 rounded-3xl p-4 border border-white/10 backdrop-blur-sm">
                <div className="bg-[#1a2530] rounded-2xl overflow-hidden shadow-2xl border border-white/5">
                   <div className="h-8 bg-white/5 border-b border-white/5 flex items-center px-4 gap-2">
                      <div className="h-2 w-2 rounded-full bg-red-500/50" />
                      <div className="h-2 w-2 rounded-full bg-yellow-500/50" />
                      <div className="h-2 w-2 rounded-full bg-green-500/50" />
                   </div>
                   <div className="p-6 space-y-6">
                      <div className="flex gap-4">
                         <div className="h-32 flex-1 bg-white/5 rounded-xl border border-white/10 p-4">
                            <div className="h-2 w-12 bg-white/10 rounded mb-4" />
                            <div className="h-8 w-24 bg-[#AAC9BA] rounded" />
                         </div>
                         <div className="h-32 flex-1 bg-white/5 rounded-xl border border-white/10 p-4">
                            <div className="h-2 w-12 bg-white/10 rounded mb-4" />
                            <div className="h-8 w-24 bg-[#5E929F] rounded" />
                         </div>
                      </div>
                      <div className="h-48 bg-white/5 rounded-xl border border-white/10 p-4 relative overflow-hidden">
                         <div className="h-2 w-32 bg-white/10 rounded mb-8" />
                         <div className="flex items-end gap-2 h-24">
                            <div className="flex-1 bg-[#AAC9BA]/40 rounded-t h-[40%]" />
                            <div className="flex-1 bg-[#AAC9BA]/40 rounded-t h-[70%]" />
                            <div className="flex-1 bg-[#AAC9BA] rounded-t h-[100%]" />
                            <div className="flex-1 bg-[#AAC9BA]/40 rounded-t h-[60%]" />
                            <div className="flex-1 bg-[#AAC9BA]/40 rounded-t h-[85%]" />
                         </div>
                      </div>
                   </div>
                </div>
             </div>

             {/* Floating UI Elements */}
             <div className="absolute -top-8 -right-8 bg-white rounded-2xl p-4 shadow-2xl border border-gray-100 hidden sm:block animate-float">
                <div className="flex items-center gap-3">
                   <div className="h-10 w-10 bg-[#E1EABB] rounded-full flex items-center justify-center">
                      <span className="text-[#305165] font-bold">🐶</span>
                   </div>
                   <div>
                      <p className="text-xs text-gray-400 font-medium">Novo Pet</p>
                      <p className="text-sm font-bold text-[#305165]">Bento cadastrado</p>
                   </div>
                </div>
             </div>
          </div>
        </div>
      </div>
    </section>
  )
}
