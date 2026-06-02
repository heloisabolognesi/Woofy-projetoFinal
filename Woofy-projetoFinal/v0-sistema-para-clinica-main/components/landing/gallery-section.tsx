"use client"

import { useState } from "react"
import { cn } from "@/lib/utils"

const galleryItems = [
  {
    id: 1,
    category: "gatos",
    species: "Gato",
    title: "Milo - Felino Saudável",
    description: "Check-up preventivo com vacinação em dia.",
    image: "https://images.unsplash.com/photo-1573865526739-10659fec78a5?q=80&w=600",
  },
  {
    id: 2,
    category: "caes",
    species: "Cão",
    title: "Pipoca - Pós-Consulta",
    description: "Acompanhamento clínico e orientação nutricional.",
    image: "https://images.unsplash.com/photo-1534361960057-19889db9621e?q=80&w=600",
  },
  {
    id: 3,
    category: "aves",
    species: "Ave",
    title: "Chico - Ave em Avaliação",
    description: "Consulta cuidadosa para manejo e bem-estar.",
    image: "https://images.unsplash.com/photo-1444464666168-49d633b86797?q=80&w=600",
  },
  {
    id: 4,
    category: "gatos",
    species: "Gato",
    title: "Luna - Tratamento Dermatológico",
    description: "Cuidados de pele e pelagem com retorno programado.",
    image: "https://images.unsplash.com/photo-1533738363-b7f9aef128ce?q=80&w=600",
  },
  {
    id: 5,
    category: "caes",
    species: "Cão",
    title: "Bidu - Recuperação Ortopédica",
    description: "Pós-operatório acompanhado de perto pela equipe.",
    image: "https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?q=80&w=600",
  },
  {
    id: 6,
    category: "caes",
    species: "Cão",
    title: "Floquinho - Estética Pet",
    description: "Banho, escovação e tosa higiênica sem pressa.",
    image: "https://images.unsplash.com/photo-1561037404-61cd46aa615b?q=80&w=600",
  },
  {
    id: 7,
    category: "roedores",
    species: "Hamster",
    title: "Nina - Pequenos Cuidados",
    description: "Avaliação de rotina para pets de pequeno porte.",
    image: "https://images.unsplash.com/photo-1425082661705-1834bfd09dca?q=80&w=600",
  },
  {
    id: 8,
    category: "coelhos",
    species: "Coelho",
    title: "Theo - Consulta Preventiva",
    description: "Orientação sobre alimentação, dentes e ambiente.",
    image: "https://images.unsplash.com/photo-1548767797-d8c844163c4c?q=80&w=600",
  },
  {
    id: 9,
    category: "gatos",
    species: "Gato",
    title: "Amora - Retorno Clínico",
    description: "Monitoramento tranquilo após tratamento.",
    image: "https://images.unsplash.com/photo-1592194996308-7b43878e84a6?q=80&w=600",
  },
  {
    id: 10,
    category: "caes",
    species: "Cão",
    title: "Thor - Vacinação",
    description: "Proteção atualizada e carteira organizada.",
    image: "https://images.unsplash.com/photo-1543466835-00a7907e9de1?q=80&w=600",
  },
  {
    id: 11,
    category: "aves",
    species: "Ave",
    title: "Kiwi - Orientação de Manejo",
    description: "Atenção ao comportamento e rotina do tutor.",
    image: "https://images.unsplash.com/photo-1522926193341-e9ffd686c60f?q=80&w=600",
  },
  {
    id: 12,
    category: "coelhos",
    species: "Coelho",
    title: "Mel - Bem-Estar",
    description: "Consulta leve para prevenção e acompanhamento.",
    image: "https://images.unsplash.com/photo-1705587226131-dd57b0c426b7?q=80&w=600",
  },
]

export function GallerySection() {
  const [activeFilter, setActiveFilter] = useState("todos")

  const filteredItems =
    activeFilter === "todos" ? galleryItems : galleryItems.filter((item) => item.category === activeFilter)

  const filters = [
    { value: "todos", label: "Todos" },
    { value: "caes", label: "Cães" },
    { value: "gatos", label: "Gatos" },
    { value: "aves", label: "Aves" },
    { value: "coelhos", label: "Coelhos" },
    { value: "roedores", label: "Roedores" },
  ]

  return (
    <section id="galeria" className="py-28 bg-white dark:bg-slate-900 transition-colors duration-300 relative overflow-hidden">
      {/* Decorative */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#AAC9BA]/20 to-transparent" />
      <div className="absolute bottom-20 right-10 w-72 h-72 bg-[#E1EABB]/5 rounded-full blur-3xl" />

      <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center max-w-3xl mx-auto space-y-5 mb-16">
          <div className="inline-flex items-center gap-2 bg-[#5E929F]/10 text-[#5E929F] dark:text-[#AAC9BA] px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider mx-auto">
            <span className="w-1.5 h-1.5 rounded-full bg-[#5E929F] dark:bg-[#AAC9BA]" />
            Galeria de Pacientes
          </div>
          <h3 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#305165] dark:text-white font-serif leading-tight">
            Amigos que Alegram Nossos Dias
          </h3>
          <p className="text-gray-500 dark:text-gray-400 text-lg">
            Veja alguns dos pets queridos que passaram por nossos cuidados preventivos, tratamentos cirúrgicos ou sessões
            de estética. Cada amigo aparece com espécie e contexto corretos para deixar a galeria mais clara.
          </p>
        </div>

        {/* Filters bar */}
        <div className="flex flex-wrap justify-center gap-2 sm:gap-3 mb-14">
          {filters.map((filter) => (
            <button
              key={filter.value}
              onClick={() => setActiveFilter(filter.value)}
              className={cn(
                "px-4 sm:px-6 py-2.5 rounded-full text-sm font-bold transition-all duration-300 border",
                activeFilter === filter.value
                  ? "bg-gradient-to-r from-[#305165] to-[#5E929F] text-white border-transparent shadow-lg shadow-[#305165]/15 dark:from-[#5E929F] dark:to-[#AAC9BA] dark:shadow-[#5E929F]/15"
                  : "bg-white dark:bg-slate-800 text-gray-600 dark:text-gray-300 border-gray-200 dark:border-slate-700 hover:border-[#AAC9BA] hover:text-[#305165] dark:hover:text-[#AAC9BA]"
              )}
            >
              {filter.label}
            </button>
          ))}
        </div>

        {/* Gallery Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 sm:gap-6 xl:gap-7">
          {filteredItems.map((item) => (
            <div
              key={item.id}
              className="group relative aspect-[4/3] min-h-[230px] rounded-2xl overflow-hidden shadow-md bg-white dark:bg-slate-800 border border-gray-100/80 dark:border-slate-700 animate-in fade-in zoom-in-95 duration-500"
            >
              <img
                src={item.image}
                alt={item.title}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
              />
              {/* Overlay on Hover */}
              <div className="absolute inset-0 bg-gradient-to-t from-[#305165]/95 via-[#305165]/35 to-transparent opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-all duration-500 flex flex-col justify-end p-5 sm:p-6 text-white">
                <span className="text-[10px] uppercase font-bold tracking-wider text-[#AAC9BA] mb-1.5">
                  {item.species}
                </span>
                <h4 className="text-base sm:text-lg font-bold font-serif translate-y-0 sm:translate-y-2 sm:group-hover:translate-y-0 transition-transform duration-500">
                  {item.title}
                </h4>
                <p className="mt-2 text-sm text-white/85 translate-y-0 sm:translate-y-2 sm:group-hover:translate-y-0 transition-transform duration-500">
                  {item.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
