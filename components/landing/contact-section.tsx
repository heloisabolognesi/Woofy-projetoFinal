"use client"

import { useState, type ChangeEvent, type FormEvent } from "react"
import { Button } from "@/components/ui/button"
import { Phone, MapPin, Mail, Clock, Send, CheckCircle } from "lucide-react"

type EmailProvider = "gmail" | "outlook" | "yahoo" | "mailto"

type ContactFormData = {
  nome: string
  email: string
  telefone: string
  mensagem: string
  provedor: EmailProvider
}

const CLINIC_EMAIL = "contato@woofyvet.com.br"

export function ContactSection() {
  const [formData, setFormData] = useState<ContactFormData>({
    nome: "",
    email: "",
    telefone: "",
    mensagem: "",
    provedor: "gmail",
  })

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [formError, setFormError] = useState("")

  const contactDetails = [
    {
      icon: MapPin,
      title: "Endereço",
      content: (
        <>
          Av. Paulista, 1000
          <br />
          Bela Vista, São Paulo - SP
        </>
      ),
      gradient: "from-[#AAC9BA]/20 to-[#AAC9BA]/5",
      iconColor: "text-[#305165] dark:text-[#AAC9BA]",
    },
    {
      icon: Phone,
      title: "Telefone & Whats",
      content: (
        <>
          (11) 3456-7890
          <br />
          (11) 98765-4321
        </>
      ),
      gradient: "from-[#5E929F]/20 to-[#5E929F]/5",
      iconColor: "text-[#5E929F]",
    },
    {
      icon: Mail,
      title: "E-mail",
      content: (
        <>
          contato@woofyvet.com.br
          <br />
          atendimento@woofyvet.com.br
        </>
      ),
      gradient: "from-[#E1EABB]/40 to-[#E1EABB]/10",
      iconColor: "text-[#B1AE77] dark:text-[#E1EABB]",
    },
    {
      icon: Clock,
      title: "Funcionamento",
      content: (
        <>
          Seg a Sex: 08h às 20h
          <br />
          Sábados: 09h às 14h
        </>
      ),
      gradient: "from-[#AAC9BA]/20 to-[#AAC9BA]/5",
      iconColor: "text-[#305165] dark:text-[#AAC9BA]",
    },
  ]

  const isValidEmail = (email: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
  }

  const buildEmailUrl = (provider: EmailProvider, subject: string, body: string) => {
    const encodedTo = encodeURIComponent(CLINIC_EMAIL)
    const encodedSubject = encodeURIComponent(subject)
    const encodedBody = encodeURIComponent(body)

    const emailLinks: Record<EmailProvider, string> = {
      gmail: `https://mail.google.com/mail/?view=cm&fs=1&to=${encodedTo}&su=${encodedSubject}&body=${encodedBody}`,
      outlook: `https://outlook.live.com/mail/0/deeplink/compose?to=${encodedTo}&subject=${encodedSubject}&body=${encodedBody}`,
      yahoo: `https://compose.mail.yahoo.com/?to=${encodedTo}&subject=${encodedSubject}&body=${encodedBody}`,
      mailto: `mailto:${CLINIC_EMAIL}?subject=${encodedSubject}&body=${encodedBody}`,
    }

    return emailLinks[provider]
  }

 const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
  e.preventDefault()

  const nome = formData.nome.trim()
  const email = formData.email.trim()
  const telefone = formData.telefone.trim()
  const mensagem = formData.mensagem.trim()
  const provedor = formData.provedor

  setFormError("")

  if (!nome || !email || !mensagem) {
    setFormError("Preencha nome, e-mail e mensagem antes de continuar.")
    return
  }

  if (!isValidEmail(email)) {
    setFormError("Digite um e-mail válido para contato.")
    return
  }

  setIsSubmitting(true)

  const subject = "Novo contato via site Woofy"

  const body = `Olá, equipe Woofy!

Uma nova mensagem foi preparada pelo formulário de contato do site.

Nome do tutor: ${nome}
E-mail de contato: ${email}
Telefone/WhatsApp: ${telefone || "Não informado"}

Mensagem:
${mensagem}`

  const emailUrl = buildEmailUrl(provedor, subject, body)

  if (provedor === "mailto") {
    window.location.href = emailUrl
  } else {
    window.open(emailUrl, "_blank", "noopener,noreferrer")
  }

  setIsSubmitting(false)
  setIsSubmitted(true)

  setFormData({
    nome: "",
    email: "",
    telefone: "",
    mensagem: "",
    provedor: "gmail",
  })
}

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target

    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }))
  }

  return (
    <section
      id="contato"
      className="py-28 bg-[#F5F4EE] dark:bg-slate-950 transition-colors duration-300 relative overflow-hidden"
    >
      {/* Decorative */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#AAC9BA]/20 to-transparent" />
      <div className="absolute top-40 right-0 w-80 h-80 bg-[#5E929F]/5 rounded-full blur-3xl" />
      <div className="absolute bottom-20 left-0 w-96 h-96 bg-[#AAC9BA]/5 rounded-full blur-3xl" />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
          {/* Left Column: Contact details and Google Map */}
          <div className="space-y-8">
            <div className="space-y-5">
              <div className="inline-flex items-center gap-2 bg-[#5E929F]/10 text-[#5E929F] dark:text-[#AAC9BA] px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider">
                <span className="w-1.5 h-1.5 rounded-full bg-[#5E929F] dark:bg-[#AAC9BA]" />
                Fale Conosco
              </div>

              <h3 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#305165] dark:text-white font-serif leading-tight">
                Entre em Contato ou Visite Nossa Clínica
              </h3>

              <p className="text-gray-500 dark:text-gray-400 text-lg">
                Estamos prontos para atender você e tirar todas as suas dúvidas.
                Agende uma visita ou envie uma mensagem direta pelo formulário ao lado.
              </p>
            </div>

            {/* Quick Details Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              {contactDetails.map((detail, idx) => {
                const Icon = detail.icon

                return (
                  <div
                    key={idx}
                    className="flex items-start gap-4 p-4 rounded-2xl bg-white dark:bg-slate-900 border border-gray-100/80 dark:border-slate-800 transition-all duration-300 hover:shadow-lg hover:shadow-[#305165]/5 hover:-translate-y-1 group"
                  >
                    <div
                      className={`p-3 bg-gradient-to-br ${detail.gradient} ${detail.iconColor} rounded-xl transition-all duration-300 group-hover:scale-110`}
                    >
                      <Icon className="h-5 w-5" />
                    </div>

                    <div>
                      <h4 className="font-bold text-[#305165] dark:text-white text-sm">
                        {detail.title}
                      </h4>
                      <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                        {detail.content}
                      </p>
                    </div>
                  </div>
                )
              })}
            </div>

            {/* Embedded Google Map */}
            <div className="rounded-3xl overflow-hidden shadow-lg h-[280px] border border-gray-100/80 dark:border-slate-800">
              <iframe
                title="Localização da Clínica Woofy"
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3657.197576508933!2d-46.6588636!3d-23.5614099!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x94ce59c8da0aa315%3A0xd59f9431f2c9776a!2sAv.%20Paulista%2C%20S%C3%A3o%20Paulo%20-%20SP!5e0!3m2!1spt-BR!2sbr!4v1689254395648!5m2!1spt-BR!2sbr"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen={false}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
          </div>

          {/* Right Column: Contact form */}
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-8 lg:p-10 border border-gray-100/80 dark:border-slate-800 shadow-xl shadow-[#305165]/5 relative overflow-hidden">
            {/* Decorative accent */}
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#305165] via-[#5E929F] to-[#AAC9BA]" />

            {isSubmitted ? (
              <div className="text-center py-12 space-y-4">
                <div className="h-20 w-20 bg-gradient-to-br from-green-100 to-green-50 dark:from-green-900/30 dark:to-green-800/10 text-green-600 dark:text-green-400 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg shadow-green-100/50">
                  <CheckCircle className="h-10 w-10" />
                </div>

                <h4 className="text-2xl font-bold text-[#305165] dark:text-white font-serif">
                  Mensagem Preparada!
                </h4>

                <p className="text-sm text-gray-500 dark:text-gray-300 max-w-sm mx-auto">
                  Abrimos o provedor de e-mail escolhido com os dados preenchidos.
                  Revise a mensagem e confirme o envio.
                </p>

                <Button
                  onClick={() => {
                    setIsSubmitted(false)
                    setFormError("")
                  }}
                  className="bg-gradient-to-r from-[#305165] to-[#5E929F] dark:from-[#5E929F] dark:to-[#AAC9BA] hover:opacity-95 text-white rounded-full mt-6 shadow-lg"
                >
                  Enviar Nova Mensagem
                </Button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <h4 className="text-xl font-bold text-[#305165] dark:text-white font-serif">
                    Envie uma Mensagem
                  </h4>

                  <p className="text-xs text-gray-400">
                    Campos obrigatórios estão marcados. O sistema abrirá seu provedor
                    de e-mail com a mensagem já preenchida.
                  </p>
                </div>

                <div className="space-y-5">
                  <div className="space-y-1.5">
                    <label
                      htmlFor="nome"
                      className="text-xs font-bold text-[#305165] dark:text-gray-300 uppercase tracking-wider"
                    >
                      Nome Completo *
                    </label>

                    <input
                      type="text"
                      id="nome"
                      name="nome"
                      required
                      value={formData.nome}
                      onChange={handleChange}
                      placeholder="Ex: Ana Maria Silva"
                      className="w-full px-4 py-3.5 rounded-xl border border-gray-200 dark:border-slate-700 bg-[#F5F4EE] dark:bg-slate-800 text-sm text-gray-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#5E929F] dark:focus:ring-[#AAC9BA] focus:border-transparent transition-all duration-300 placeholder:text-gray-400/60"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div className="space-y-1.5">
                      <label
                        htmlFor="email"
                        className="text-xs font-bold text-[#305165] dark:text-gray-300 uppercase tracking-wider"
                      >
                        E-mail de Contato *
                      </label>

                      <input
                        type="email"
                        id="email"
                        name="email"
                        required
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="Ex: ana@exemplo.com"
                        className="w-full px-4 py-3.5 rounded-xl border border-gray-200 dark:border-slate-700 bg-[#F5F4EE] dark:bg-slate-800 text-sm text-gray-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#5E929F] dark:focus:ring-[#AAC9BA] focus:border-transparent transition-all duration-300 placeholder:text-gray-400/60"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label
                        htmlFor="telefone"
                        className="text-xs font-bold text-[#305165] dark:text-gray-300 uppercase tracking-wider"
                      >
                        WhatsApp / Celular
                      </label>

                      <input
                        type="tel"
                        id="telefone"
                        name="telefone"
                        value={formData.telefone}
                        onChange={handleChange}
                        placeholder="Ex: (11) 98765-4321"
                        className="w-full px-4 py-3.5 rounded-xl border border-gray-200 dark:border-slate-700 bg-[#F5F4EE] dark:bg-slate-800 text-sm text-gray-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#5E929F] dark:focus:ring-[#AAC9BA] focus:border-transparent transition-all duration-300 placeholder:text-gray-400/60"
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label
                      htmlFor="mensagem"
                      className="text-xs font-bold text-[#305165] dark:text-gray-300 uppercase tracking-wider"
                    >
                      Sua Mensagem / Dúvida *
                    </label>

                    <textarea
                      id="mensagem"
                      name="mensagem"
                      required
                      rows={4}
                      value={formData.mensagem}
                      onChange={handleChange}
                      placeholder="Descreva brevemente como podemos ajudar você e seu pet..."
                      className="w-full px-4 py-3.5 rounded-xl border border-gray-200 dark:border-slate-700 bg-[#F5F4EE] dark:bg-slate-800 text-sm text-gray-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#5E929F] dark:focus:ring-[#AAC9BA] focus:border-transparent transition-all duration-300 resize-none placeholder:text-gray-400/60"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label
                      htmlFor="provedor"
                      className="text-xs font-bold text-[#305165] dark:text-gray-300 uppercase tracking-wider"
                    >
                      Como deseja enviar? *
                    </label>

                    <select
                      id="provedor"
                      name="provedor"
                      required
                      value={formData.provedor}
                      onChange={handleChange}
                      className="w-full px-4 py-3.5 rounded-xl border border-gray-200 dark:border-slate-700 bg-[#F5F4EE] dark:bg-slate-800 text-sm text-gray-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#5E929F] dark:focus:ring-[#AAC9BA] focus:border-transparent transition-all duration-300"
                    >
                      <option value="gmail">Gmail Web</option>
                      <option value="outlook">Outlook Web</option>
                      <option value="yahoo">Yahoo Mail</option>
                      <option value="mailto">Aplicativo padrão de e-mail</option>
                    </select>

                    <p className="text-[11px] text-gray-400">
                      A mensagem será aberta no provedor escolhido. Você precisará
                      confirmar o envio dentro do seu e-mail.
                    </p>
                  </div>
                </div>

                {formError && (
                  <div className="rounded-xl border border-red-200 bg-red-50 dark:bg-red-950/20 dark:border-red-900 px-4 py-3">
                    <p className="text-xs font-medium text-red-600 dark:text-red-400">
                      {formError}
                    </p>
                  </div>
                )}

                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-gradient-to-r from-[#305165] to-[#5E929F] dark:from-[#5E929F] dark:to-[#AAC9BA] hover:opacity-95 text-white rounded-full h-13 text-sm font-bold flex items-center justify-center gap-2 shadow-lg shadow-[#305165]/15 transition-all duration-300 hover:shadow-xl hover:shadow-[#305165]/20 hover:scale-[1.02] disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? (
                    <span className="flex items-center gap-2">
                      <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Preparando...
                    </span>
                  ) : (
                    <>
                      Enviar Mensagem <Send className="h-4 w-4" />
                    </>
                  )}
                </Button>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}