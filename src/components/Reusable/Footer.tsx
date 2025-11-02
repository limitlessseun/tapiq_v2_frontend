import { Button } from '@/components/ui/button'

export function Footer() {
    return (
        <footer className="bg-gray-800 text-white py-12 px-6">
            <div className="max-w-6xl mx-auto">
                <div className="text-center mb-8">
                    <h3 className="text-2xl font-bold mb-4">Stay Connected</h3>
                    <p className="text-gray-300 mb-6">
                        Follow us on social media for the latest updates, scam alerts, and safety tips.
                    </p>
                    <div className="flex justify-center space-x-4">
                        {/* Social media icons would go here */}
                        <Button variant="outline" size="sm" className="text-white border-white">Twitter</Button>
                        <Button variant="outline" size="sm" className="text-white border-white">Facebook</Button>
                        <Button variant="outline" size="sm" className="text-white border-white">LinkedIn</Button>
                    </div>
                </div>

                <div className="border-t border-gray-700 pt-8 text-center text-gray-400">
                    <p>&copy; 2024 aplQ. All rights reserved.</p>
                </div>
            </div>
        </footer>
    )
}