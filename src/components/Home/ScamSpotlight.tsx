import { Button } from '@/components/ui/button'

export function ScamSpotlight() {
    return (
        <section className="py-16 px-6 bg-red-50">
            <div className="max-w-4xl mx-auto text-center">
                <h2 className="text-3xl font-bold mb-4">Weekly Scam Spotlight</h2>
                <p className="text-lg text-gray-700 mb-8">
                    Highlighting the most dangerous scam of the week to stay alert.
                </p>

                <div className="bg-white p-8 rounded-lg shadow-md mb-8">
                    <div className="text-2xl font-bold text-red-600 mb-4">AVERAGE SCAM OF THE WEEK</div>
                    <p className="text-gray-700 mb-4">
                        Stay alert with our real-time detection system protecting thousands of users.
                    </p>
                </div>

                <Button className="bg-red-600 hover:bg-red-700">
                    Join us to stay informed about the latest risks and help others stay safe
                </Button>
            </div>
        </section>
    )
}