import { FAQSection } from "@/components/Reusable"
import { CTASection } from "@/components/Home"
export default function FaqPage() {
    return (
        <main className="min-h-screen">
            <FAQSection p="Got questions? We’ve got answers! Check out our most common inquiries below to find the information you need quickly." />
            <CTASection />
        </main>
    )
}