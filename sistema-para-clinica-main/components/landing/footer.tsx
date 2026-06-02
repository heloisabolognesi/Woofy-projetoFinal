import Link from "next/link"
import { Instagram, Facebook, Linkedin, Phone, Mail, MapPin, Heart } from "lucide-react"

export function Footer() {
  return (
    <footer className="bg-[#305165] dark:bg-slate-950 pt-20 pb-8 transition-colors duration-300 relative overflow-hidden">
      {/* Decorative gradients */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#AAC9BA]/40 to-transparent" />
      <div className="absolute top-0 right-0 w-96 h-96 bg-[#5E929F]/5 rounded-full blur-3xl" />
      <div className="absolute bottom-0 left-0 w-72 h-72 bg-[#AAC9BA]/5 rounded-full blur-3xl" />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          {/* Brand Col */}
          <div className="space-y-6">
            <Link href="/" className="inline-block transition-transform duration-300 hover:scale-105">
              <img
                src="/logo-transparent.png"
                alt="Woofy Logo"
                className="h-12 w-auto object-contain brightness-0 invert"
              />
            </Link>
            <p className="text-[#AAC9BA]/80 text-sm leading-relaxed">
              Cuidado veterinário moderno e inteligente. Oferecemos amor, tecnologia e dedicação integral para o
              bem-estar e a saúde do seu pet.
            </p>
            <div className="flex gap-3">
              {[
                { icon: Instagram, href: "#", label: "Instagram" },
                { icon: Facebook, href: "#", label: "Facebook" },
                { icon: Linkedin, href: "#", label: "LinkedIn" },
              ].map((social, index) => {
                const Icon = social.icon
                return (
                  <a
                    key={index}
                    href={social.href}
                    aria-label={social.label}
                    className="h-10 w-10 rounded-full bg-white/5 flex items-center justify-center text-[#AAC9BA]/80 hover:bg-[#AAC9BA] hover:text-[#305165] transition-all duration-300 border border-white/10 hover:border-[#AAC9BA] hover:scale-110"
                  >
                    <Icon size={18} />
                  </a>
                )
              })}
            </div>
          </div>

          {/* Navigation Links */}
          <div>
            <h4 className="font-bold text-white mb-6 font-serif text-lg">Links Rápidos</h4>
            <ul className="space-y-4 text-sm font-semibold">
              {[
                { label: "Início", href: "#" },
                { label: "Sobre a Clínica", href: "#sobre" },
                { label: "Nossos Serviços", href: "#servicos" },
                { label: "Equipe de Especialistas", href: "#equipe" },
              ].map((link, idx) => (
                <li key={idx}>
                  <Link
                    href={link.href}
                    className="text-[#AAC9BA]/70 hover:text-[#AAC9BA] transition-colors duration-300 flex items-center gap-2 group"
                  >
                    <span className="w-0 group-hover:w-3 h-px bg-[#AAC9BA] transition-all duration-300" />
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Details */}
          <div>
            <h4 className="font-bold text-white mb-6 font-serif text-lg">Contatos</h4>
            <ul className="space-y-4 text-sm">
              <li className="flex items-start gap-3 text-[#AAC9BA]/70">
                <MapPin className="h-5 w-5 text-[#AAC9BA] shrink-0 mt-0.5" />
                <span>
                  Av. Paulista, 1000
                  <br />
                  Bela Vista, São Paulo - SP
                </span>
              </li>
              <li className="flex items-center gap-3 text-[#AAC9BA]/70">
                <Phone className="h-5 w-5 text-[#AAC9BA] shrink-0" />
                <span>(11) 3456-7890</span>
              </li>
              <li className="flex items-center gap-3 text-[#AAC9BA]/70">
                <Mail className="h-5 w-5 text-[#AAC9BA] shrink-0" />
                <span className="break-all">contato@woofyvet.com.br</span>
              </li>
            </ul>
          </div>

          {/* Opening Hours */}
          <div>
            <h4 className="font-bold text-white mb-6 font-serif text-lg">Horários</h4>
            <div className="space-y-3 text-sm text-[#AAC9BA]/70 font-medium">
              <div className="flex justify-between border-b border-white/5 pb-3">
                <span>Segunda a Sexta:</span>
                <span className="font-bold text-white">08h - 20h</span>
              </div>
              <div className="flex justify-between border-b border-white/5 pb-3">
                <span>Sábado:</span>
                <span className="font-bold text-white">09h - 14h</span>
              </div>
              <div className="flex justify-between pb-1">
                <span>Domingos:</span>
                <span className="text-[#AAC9BA] font-bold">Apenas Emergências</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-white/10 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-xs text-[#AAC9BA]/50 font-medium flex items-center gap-1">
            © 2026 Woofy Tecnologia e Clínica Veterinária Ltda. Feito com{" "}
            <Heart className="h-3 w-3 text-red-400 fill-red-400 inline" /> para os pets.
          </p>
          <div className="flex gap-6 text-xs font-semibold">
            <Link
              href="#"
              className="text-[#AAC9BA]/50 hover:text-[#AAC9BA] transition-colors duration-300"
            >
              Termos de Uso
            </Link>
            <Link
              href="#"
              className="text-[#AAC9BA]/50 hover:text-[#AAC9BA] transition-colors duration-300"
            >
              Privacidade
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
