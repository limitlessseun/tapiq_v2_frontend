import { HeroSection, FeaturesSection, AboutSection, HowItWorks, TestimonialsSection, CommunityImpact, ScamSpotlight, CTASection } from '@/components/Home'
import { FAQSection, Navbar } from '@/components/Reusable'

export default function Home() {
    return (
        <main className="min-h-screen">
            <div className='bg-gradient-to-b from-[#057EB7] from-[2.1%] via-[#141986] via-[50.13%] to-[#0E1264] to-[98.16%]'>
                <Navbar />
                <HeroSection />
            </div>
            <FeaturesSection />
            <AboutSection />
            <HowItWorks />
            <TestimonialsSection />
            <CommunityImpact />
            <ScamSpotlight />
            <CTASection />
            <FAQSection />
        </main>
    )
}