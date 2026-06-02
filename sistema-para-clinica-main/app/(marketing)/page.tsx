import { Header } from "@/components/landing/header"
import { HeroSection } from "@/components/landing/hero-section"
import { AboutSection } from "@/components/landing/about-section"
import { ServicesSection } from "@/components/landing/services-section"
import { TeamSection } from "@/components/landing/team-section"
import { TestimonialsSection } from "@/components/landing/testimonials-section"
import { GallerySection } from "@/components/landing/gallery-section"
import { ContactSection } from "@/components/landing/contact-section"
import { Footer } from "@/components/landing/footer"

export default function LandingPage() {
  return (
    <div className="flex flex-col min-h-screen bg-[#F5F4EE] dark:bg-slate-900 transition-colors duration-300">
      <Header />
      <main className="flex-1">
        <HeroSection />
        <AboutSection />
        <ServicesSection />
        <TeamSection />
        <TestimonialsSection />
        <GallerySection />
        <ContactSection />
      </main>
      <Footer />
    </div>
  )
}
