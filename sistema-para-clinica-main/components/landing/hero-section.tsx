"use client"

import { useState, useEffect, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Stethoscope, Home, Scissors, ChevronLeft, ChevronRight } from "lucide-react"

const carouselImages = [
  {
    url: "https://images.unsplash.com/photo-1587300003388-59208cc962cb?q=80&w=1920",
    alt: "Golden Retriever saudável e feliz em ambiente veterinário",
  },
  {
    url: "https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?q=80&w=1920",
    alt: "Gato de olhos verdes deitado serenamente",
  },
  {
    url: "https://images.unsplash.com/photo-1548767797-d8c844163c4c?q=80&w=1920",
    alt: "Coelho fofo em consulta veterinária",
  },
  {
    url: "https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?q=80&w=1920",
    alt: "Cão da raça Dálmata sorridente",
  },
  {
    url: "https://images.unsplash.com/photo-1573865526739-10659fec78a5?q=80&w=1920",
    alt: "Gato tigrado saudável em close-up",
  },
]

export function HeroSection() {
  const [currentSlide, setCurrentSlide] = useState(0)
  const [isTransitioning, setIsTransitioning] = useState(false)

  const goToSlide = useCallback(
    (index: number) => {
      if (isTransitioning) return
      setIsTransitioning(true)
      setCurrentSlide(index)
      setTimeout(() => setIsTransitioning(false), 1200)
    },
    [isTransitioning]
  )

  useEffect(() => {
    const timer = setInterval(() => {
      goToSlide((currentSlide + 1) % carouselImages.length)
    }, 6000)
    return () => clearInterval(timer)
  }, [currentSlide, goToSlide])

  const nextSlide = () => {
    goToSlide((currentSlide + 1) % carouselImages.length)
  }

  const prevSlide = () => {
    goToSlide((currentSlide - 1 + carouselImages.length) % carouselImages.length)
  }

  return (
    <section className="relative min-h-screen lg:h-screen flex flex-col justify-between overflow-hidden pt-20 pb-16 lg:pb-0">
      {/* Background Image Carousel */}
      <div className="absolute inset-0 z-0">
        {carouselImages.map((image, index) => (
          <div
            key={index}
            className="absolute inset-0 transition-all duration-[1500ms] ease-in-out"
            style={{
              opacity: index === currentSlide ? 1 : 0,
              transform: index === currentSlide ? "scale(1)" : "scale(1.08)",
            }}
          >
            <img
              src={image.url}
              alt={image.alt}
              className="w-full h-full object-cover object-center"
              loading={index === 0 ? "eager" : "lazy"}
            />
          </div>
        ))}
      </div>

      {/* Multi-layer dark overlay for readability */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/65 via-black/45 to-black/75 z-10" />
      <div className="absolute inset-0 bg-gradient-to-r from-[#305165]/25 to-transparent z-10" />

      {/* Spacer */}
      <div className="hidden lg:block h-8 z-20" />

      {/* ===== Centered Hero Content ===== */}
      <div className="max-w-5xl mx-auto px-6 w-full text-center flex flex-col items-center justify-center gap-5 text-white z-20 flex-grow">
        {/* — Brand Logo — */}
        <div className="mb-4 animate-in fade-in zoom-in-75 duration-1000 ease-out">
          <img
            src="/logo-transparent.png"
            alt="Woofy Logo"
            className="h-24 sm:h-32 lg:h-40 w-auto object-contain drop-shadow-[0_4px_20px_rgba(0,0,0,0.3)]"
          />
        </div>

        {/* — Clinic Name — */}
        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-[1.1] font-serif text-white drop-shadow-lg animate-in fade-in slide-in-from-bottom-4 duration-700 delay-200">
          Clínica Veterinária{" "}
          <span className="bg-gradient-to-r from-[#AAC9BA] to-[#5E929F] bg-clip-text text-transparent">
            Woofy
          </span>
        </h1>

        {/* — Slogan — */}
        <p className="text-base sm:text-lg lg:text-xl text-gray-200/90 max-w-2xl leading-relaxed animate-in fade-in slide-in-from-bottom-4 duration-700 delay-300">
          Cuidado, carinho e excelência médica para quem faz parte da sua família. Saúde preventiva, tecnologia de ponta e amor em cada consulta.
        </p>

        {/* — CTA Buttons — */}
        <div className="flex flex-wrap items-center justify-center gap-4 mt-3 animate-in fade-in slide-in-from-bottom-4 duration-700 delay-500">
          <Button
            size="lg"
            asChild
            className="bg-[#AAC9BA] hover:bg-[#AAC9BA]/90 text-[#305165] font-extrabold rounded-full px-8 h-14 text-base shadow-xl shadow-[#AAC9BA]/25 transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-[#AAC9BA]/30"
          >
            <a href="#contato">Agendar Consulta</a>
          </Button>
          <Button
            size="lg"
            variant="outline"
            asChild
            className="border-2 border-white/50 text-white hover:bg-white hover:text-[#305165] font-bold rounded-full px-8 h-14 text-base backdrop-blur-sm transition-all duration-300 hover:scale-105"
          >
            <a href="#servicos">Conhecer Serviços</a>
          </Button>
        </div>
      </div>

      {/* Navigation arrows */}
      <div className="absolute inset-x-8 top-1/2 -translate-y-1/2 justify-between items-center z-20 hidden lg:flex">
        <button
          onClick={prevSlide}
          className="p-3.5 rounded-full bg-white/10 hover:bg-white/25 text-white backdrop-blur-md transition-all duration-300 hover:scale-110 border border-white/15"
          aria-label="Slide anterior"
        >
          <ChevronLeft className="h-6 w-6" />
        </button>
        <button
          onClick={nextSlide}
          className="p-3.5 rounded-full bg-white/10 hover:bg-white/25 text-white backdrop-blur-md transition-all duration-300 hover:scale-110 border border-white/15"
          aria-label="Próximo slide"
        >
          <ChevronRight className="h-6 w-6" />
        </button>
      </div>

      {/* Bottom section: Indicators & Overlapping cards */}
      <div className="w-full max-w-7xl mx-auto px-6 z-20 flex flex-col gap-6 lg:pb-12">
        {/* Carousel Indicator Dots */}
        <div className="flex justify-center gap-3">
          {carouselImages.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`rounded-full transition-all duration-500 ${
                index === currentSlide
                  ? "w-10 h-2.5 bg-[#AAC9BA] shadow-lg shadow-[#AAC9BA]/40"
                  : "w-2.5 h-2.5 bg-white/30 hover:bg-white/50"
              }`}
              aria-label={`Ir para o slide ${index + 1}`}
            />
          ))}
        </div>

        {/* Feature Cards overlapping the bottom edge */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:translate-y-24">
          {/* Card 1 */}
          <div className="bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl rounded-2xl p-7 shadow-xl border border-gray-100/50 dark:border-slate-800/80 transition-all duration-500 hover:-translate-y-3 hover:shadow-2xl group">
            <div className="flex items-start gap-4">
              <div className="p-3.5 bg-gradient-to-br from-[#AAC9BA]/30 to-[#AAC9BA]/10 text-[#305165] dark:text-[#AAC9BA] rounded-xl transition-all duration-500 group-hover:bg-gradient-to-br group-hover:from-[#305165] group-hover:to-[#5E929F] group-hover:text-white group-hover:shadow-lg group-hover:shadow-[#305165]/20 dark:group-hover:from-[#AAC9BA] dark:group-hover:to-[#5E929F] dark:group-hover:text-[#305165]">
                <Home className="h-6 w-6" />
              </div>
              <div className="space-y-1.5">
                <h3 className="text-lg font-bold text-[#305165] dark:text-white">Hospedagem Pet</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">
                  O lar perfeito para seu cão ou gato se hospedar com segurança e carinho enquanto você viaja.
                </p>
              </div>
            </div>
          </div>

          {/* Card 2 */}
          <div className="bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl rounded-2xl p-7 shadow-xl border border-gray-100/50 dark:border-slate-800/80 transition-all duration-500 hover:-translate-y-3 hover:shadow-2xl group">
            <div className="flex items-start gap-4">
              <div className="p-3.5 bg-gradient-to-br from-[#5E929F]/30 to-[#5E929F]/10 text-[#5E929F] rounded-xl transition-all duration-500 group-hover:bg-gradient-to-br group-hover:from-[#5E929F] group-hover:to-[#305165] group-hover:text-white group-hover:shadow-lg group-hover:shadow-[#5E929F]/20">
                <Stethoscope className="h-6 w-6" />
              </div>
              <div className="space-y-1.5">
                <h3 className="text-lg font-bold text-[#305165] dark:text-white">Cuidado Veterinário</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">
                  Consultas, exames de diagnóstico e prevenção de ponta para manter a saúde do seu pet em dia.
                </p>
              </div>
            </div>
          </div>

          {/* Card 3 */}
          <div className="bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl rounded-2xl p-7 shadow-xl border border-gray-100/50 dark:border-slate-800/80 transition-all duration-500 hover:-translate-y-3 hover:shadow-2xl group">
            <div className="flex items-start gap-4">
              <div className="p-3.5 bg-gradient-to-br from-[#E1EABB]/60 to-[#E1EABB]/20 text-[#B1AE77] dark:text-[#E1EABB] rounded-xl transition-all duration-500 group-hover:bg-gradient-to-br group-hover:from-[#B1AE77] group-hover:to-[#AAC9BA] group-hover:text-white group-hover:shadow-lg group-hover:shadow-[#B1AE77]/20">
                <Scissors className="h-6 w-6" />
              </div>
              <div className="space-y-1.5">
                <h3 className="text-lg font-bold text-[#305165] dark:text-white">Estética Pet</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">
                  Banho premium, tosa higiênica e tratamentos de pelagem com profissionais atenciosos e cuidadosos.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
