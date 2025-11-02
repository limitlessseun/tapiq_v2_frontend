import { HeroSection, FeaturesSection, HowItWorks, TestimonialsSection, CommunityImpact, ScamSpotlight, CTASection } from '@/components/Home'
import { FAQSection } from '@/components/Reusable'

export default function Home() {
  return (
    <main className="min-h-screen">
      <HeroSection />
      <FeaturesSection />
      {/*  <HowItWorks />
      <TestimonialsSection />
      <CommunityImpact />
      <ScamSpotlight />
      <CTASection />
      <FAQSection /> */}
    </main>
  )
}