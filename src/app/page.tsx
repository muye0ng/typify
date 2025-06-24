'use client'
import { Header } from '@/components/layout/header'
import { Footer } from '@/components/layout/footer'
import { HeroSection } from '@/components/landing/hero-section'
import { ProblemSection } from '@/components/landing/problem-section'
import { SolutionSection } from '@/components/landing/solution-section'
import { FeaturesSection } from '@/components/landing/features-section'
import { PricingSection } from '@/components/landing/pricing-section'
import { TestimonialsSection } from '@/components/landing/testimonials-section'
import { FAQSection } from '@/components/landing/faq-section'
import { CTASection } from '@/components/landing/cta-section'

export default function Home() {
  return (
    <>
      <Header />
      <div className="min-h-screen">
        <main>
        <HeroSection />
        
        <section id="problems">
          <ProblemSection />
        </section>
        
        <SolutionSection />
        
        <section id="features">
          <FeaturesSection />
        </section>
        
        <section id="pricing">
          <PricingSection />
        </section>
        
        <section id="testimonials">
          <TestimonialsSection />
        </section>
        
        <section id="faq">
          <FAQSection />
        </section>
        
        <CTASection />
      </main>
      
        <Footer />
      </div>
    </>
  )
}
