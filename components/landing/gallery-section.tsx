"use client"

import { cn } from "@/lib/utils"

// Definição de tipos para os itens da galeria
interface GalleryItem {
  id: number | string;
  category: "caes" | "gatos" | "aves" | "roedores" | "outros";
  species: string;
  title: string;
  description: string;
  image: string;
}

// Agrupamento dos itens da galeria por categoria
const galleryCategories: Record<string, GalleryItem[]> = {
  caes: [
    {
      id: 1,
      category: "caes",
      species: "Cão",
      title: "Pipoca - Pós-Consulta",
      description: "Acompanhamento clínico e orientação nutricional.",
      image: "https://images.unsplash.com/photo-1534361960057-19889db9621e?q=80&w=600",
    },
    {
      id: 3,
      category: "caes",
      species: "Cão",
      title: "Floquinho - Estética Pet",
      description: "Banho, escovação e tosa higiênica sem pressa.",
      image: "https://images.unsplash.com/photo-1561037404-61cd46aa615b?q=80&w=600",
    },
    {
      id: 4,
      category: "caes",
      species: "Cão",
      title: "Thor - Vacinação",
      description: "Proteção atualizada e carteira organizada.",
      image: "https://images.unsplash.com/photo-1543466835-00a7907e9de1?q=80&w=600",
    },
    {
      id: "dog-1",
      category: "caes",
      species: "Cão",
      title: "Filhote de Labrador Chocolate",
      description: "Um adorável filhote de labrador chocolate em seu check-up.",
      image: "https://images.unsplash.com/photo-1447684808650-354ae64db5b8?q=80&w=600",
    },
    {
      id: "dog-2",
      category: "caes",
      species: "Cão",
      title: "Beagle Sorridente",
      description: "Um beagle feliz após uma consulta de rotina.",
      image: "https://images.unsplash.com/photo-1543466835-00a7907e9de1?q=80&w=600",
    },
    {
      id: "dog-4",
      category: "caes",
      species: "Cão",
      title: "Labrador Chocolate Adulto",
      description: "Um labrador adulto demonstrando carinho após o tratamento.",
      image: "https://images.unsplash.com/photo-1518717758536-85ae29035b6d?q=80&w=600",
    },
    {
      id: "dog-5",
      category: "caes",
      species: "Cão",
      title: "Husky Siberiano",
      description: "Um majestoso Husky Siberiano em sua visita anual.",
      image: "https://images.unsplash.com/photo-1491604612772-6853927639ef?q=80&w=600",
    },
    {
      id: "dog-6",
      category: "caes",
      species: "Cão",
      title: "Border Collie Atento",
      description: "Um inteligente Border Collie durante um exame oftalmológico.",
      image: "https://images.unsplash.com/photo-1618161456243-aa4dd6b14e8c?q=80&w=600",
    },
  ],
  gatos: [
    {
      id: 5,
      category: "gatos",
      species: "Gato",
      title: "Milo - Felino Saudável",
      description: "Check-up preventivo com vacinação em dia.",
      image: "https://images.unsplash.com/photo-1573865526739-10659fec78a5?q=80&w=600",
    },
    {
      id: "cat-1",
      category: "gatos",
      species: "Gato",
      title: "Gato Laranja Tabby",
      description: "Um gato laranja tabby relaxando após a consulta.",
      image: "https://images.unsplash.com/photo-1570089991126-4bf0440e0fe5?q=80&w=600",
    },
    {
      id: "cat-2",
      category: "gatos",
      species: "Gato",
      title: "Gato Persa Branco",
      description: "Um elegante gato persa branco em sua sessão de grooming.",
      image: "https://images.unsplash.com/photo-1562119464-7480f81577cc?q=80&w=600",
    },
    {
      id: "cat-3",
      category: "gatos",
      species: "Gato",
      title: "Gatinho em Cobertor",
      description: "Um gatinho aconchegante se recuperando de um pequeno procedimento.",
      image: "https://images.unsplash.com/photo-1665925480229-3be33d64c8ff?q=80&w=600",
    },
  ],
  aves: [
    {
      id: 8,
      category: "aves",
      species: "Ave",
      title: "Chico - Ave em Avaliação",
      description: "Consulta cuidadosa para manejo e bem-estar.",
      image: "https://images.unsplash.com/photo-1444464666168-49d633b86797?q=80&w=600",
    },
    {
      id: 9,
      category: "aves",
      species: "Ave",
      title: "Kiwi - Orientação de Manejo",
      description: "Atenção ao comportamento e rotina do tutor.",
      image: "https://images.unsplash.com/photo-1522926193341-e9ffd686c60f?q=80&w=600",
    },
    {
      id: "bird-2",
      category: "aves",
      species: "Pássaro",
      title: "Pássaro em Fio",
      description: "Um pequeno pássaro observando o movimento da clínica.",
      image: "https://images.unsplash.com/photo-1748822211858-161e3771a920?q=80&w=600",
    },
    {
      id: "bird-3",
      category: "aves",
      species: "Coruja",
      title: "Coruja Branca e Marrom",
      description: "Uma coruja em avaliação noturna.",
      image: "https://images.unsplash.com/photo-1566249987660-3b9597558cb6?q=80&w=600",
    },
  ],
  roedores: [
    {
      id: 10,
      category: "roedores",
      species: "Hamster",
      title: "Nina - Pequenos Cuidados",
      description: "Avaliação de rotina para pets de pequeno porte.",
      image: "https://images.unsplash.com/photo-1425082661705-1834bfd09dca?q=80&w=600",
    },
    {
      id: 11,
      category: "roedores",
      species: "Coelho",
      title: "Theo - Consulta Preventiva",
      description: "Orientação sobre alimentação, dentes e ambiente.",
      image: "https://images.unsplash.com/photo-1548767797-d8c844163c4c?q=80&w=600",
    },
    {
      id: "rodent-1",
      category: "roedores",
      species: "Porquinho-da-Índia",
      title: "Porquinho-da-Índia Fofo",
      description: "Um porquinho-da-índia em sua primeira visita.",
      image: "https://images.unsplash.com/photo-1779175412874-51f43fda6e48?q=80&w=600",
    },
    {
      id: "rodent-2",
      category: "roedores",
      species: "Hamster",
      title: "Hamster Curioso",
      description: "Um hamster explorando seu novo ambiente na clínica.",
      image: "https://images.unsplash.com/photo-1721327900409-5e445c1ed119?q=80&w=600",
    },
  ],
};

export function GallerySection() {
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
            Explore nossa galeria de pacientes, organizada por espécies, e veja alguns dos pets queridos que passaram por nossos cuidados. Cada imagem reflete o carinho e a dedicação da nossa equipe.
          </p>
        </div>

        {/* Gallery Sections by Category */}
        {Object.entries(galleryCategories).map(([categoryKey, items]) => (
          <div key={categoryKey} className="mb-16">
            <h4 className="text-2xl sm:text-3xl font-bold text-[#305165] dark:text-white font-serif mb-8 capitalize">
              {categoryKey === "caes" ? "Cães" : categoryKey === "gatos" ? "Gatos" : categoryKey === "aves" ? "Aves" : categoryKey === "roedores" ? "Roedores e Coelhos" : "Outros"}
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 sm:gap-6 xl:gap-7">
              {items.map((item) => (
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
        ))}
      </div>
    </section>
  )
}
