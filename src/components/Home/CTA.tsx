import { Button } from '@/components/ui/button'

export function CTASection() {
    return (
        <section className="py-16 px-6 bg-gray-900 text-white">
            <div className="max-w-4xl mx-auto text-center">
                <h2 className="text-3xl font-bold mb-6">Ready To Stay Ahead Of Scammers?</h2>
                <p className="text-lg mb-8 opacity-90">
                    Take control of your online safety today. Stay informed, report suspicious activity,
                    and protect yourself from fraud.
                </p>
                <Button size="lg" className="bg-white text-gray-900 hover:bg-gray-100">
                    SCAN A MESSAGE
                </Button>
            </div>
        </section>
    )
}