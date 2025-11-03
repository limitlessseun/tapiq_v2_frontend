import { AboutSection, CTASection } from '@/components/Home'

export default function About() {
    return (
        <main className="min-h-screen">
            <AboutSection isImage="/assets/image.png" />
            <CTASection />
        </main>
    )
}