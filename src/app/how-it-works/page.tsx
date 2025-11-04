import { CTASection, HowItWorks, TestimonialsSection, ReportProcess } from '@/components/Home'

export default function HowItWorksPage() {
    return (
        <main className="min-h-screen">
            <HowItWorks bg="bg-white" />
            <ReportProcess />
            <TestimonialsSection hidden />
            <CTASection />
        </main>
    )
}