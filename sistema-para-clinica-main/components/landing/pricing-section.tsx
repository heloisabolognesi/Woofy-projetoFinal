import { Check } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

const plans = [
  {
    name: "Starter",
    price: "R$ 89",
    description: "Ideal para profissionais autônomos e pequenos negócios.",
    features: ["Até 100 pets", "Agenda básica", "Histórico simples", "Suporte via email"],
    highlight: false
  },
  {
    name: "Professional",
    price: "R$ 189",
    description: "O plano mais completo para clínicas e pet shops em crescimento.",
    features: ["Pets ilimitados", "Agenda inteligente", "Financeiro completo", "Relatórios avançados", "Suporte prioritário"],
    highlight: true
  },
  {
    name: "Enterprise",
    price: "Sob consulta",
    description: "Soluções personalizadas para grandes redes e hospitais.",
    features: ["Múltiplas unidades", "API de integração", "Gerente de conta", "Treinamento VIP", "Customizações"],
    highlight: false
  }
]

export function PricingSection() {
  return (
    <section id="planos" className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center max-w-3xl mx-auto mb-20">
          <h2 className="text-4xl font-bold text-[#305165] mb-4">Planos que crescem com você</h2>
          <p className="text-lg text-[#6B7280]">Escolha a melhor opção para o seu momento atual.</p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 items-start">
          {plans.map((plan, index) => (
            <div 
              key={index}
              className={cn(
                "p-8 rounded-[2.5rem] border transition-all duration-300 flex flex-col gap-8",
                plan.highlight 
                  ? "bg-[#305165] border-[#305165] text-white shadow-2xl scale-105 z-10" 
                  : "bg-white border-gray-100 text-[#305165] hover:border-[#AAC9BA]"
              )}
            >
              <div className="space-y-2">
                <h3 className={cn("text-2xl font-bold", plan.highlight ? "text-white" : "text-[#305165]")}>
                  {plan.name}
                </h3>
                <div className="flex items-baseline gap-1">
                  <span className="text-4xl font-bold">{plan.price}</span>
                  {plan.price.includes("R$") && <span className="text-sm opacity-70">/mês</span>}
                </div>
                <p className={cn("text-sm leading-relaxed", plan.highlight ? "text-[#AAC9BA]" : "text-[#6B7280]")}>
                  {plan.description}
                </p>
              </div>

              <div className="space-y-4">
                {plan.features.map((feature) => (
                  <div key={feature} className="flex items-center gap-3">
                    <Check className={cn("h-5 w-5", plan.highlight ? "text-[#AAC9BA]" : "text-[#5E929F]")} />
                    <span className="text-sm font-medium">{feature}</span>
                  </div>
                ))}
              </div>

              <Button 
                className={cn(
                  "w-full rounded-full h-12 font-bold",
                  plan.highlight 
                    ? "bg-[#5E929F] hover:bg-[#5E929F]/90 text-white" 
                    : "bg-[#305165] hover:bg-[#305165]/90 text-white"
                )}
              >
                Escolher {plan.name}
              </Button>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
