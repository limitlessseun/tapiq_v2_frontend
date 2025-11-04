import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import Image from 'next/image'

const features = [
    {
        title: "Real-Time Fraud Detection",
        description: "Instantly scan and identify suspicious vendors or messages to stay protected.",
        icon: "/assets/fraud.svg"
    },
    {
        title: "Crowdsourced Intelligence",
        description: "Benefit from community-driven reports for faster fraud identification and prevention.",
        icon: "/assets/intelligence.svg"
    },
    {
        title: "Increased Security",
        description: "Verify vendors and messages before interacting, ensuring safer online transactions.",
        icon: "/assets/security.svg"
    }
]

export function AboutSection({ isImage }: any) {
    return (
        <section className="py-12 md:py-24 px-6 bg-white font-manrope">
            <div className="max-w-7xl mx-auto">
                {/* Header Section */}
                <div className="text-center mb-12 md:mb-20">
                    <h1 className="text-3xl md:text-4xl lg:text-6xl font-semibold text-indigo">
                        About Us
                    </h1>
                    <p className="text-base md:text-lg text-indigo max-w-4xl mx-auto leading-relaxed font-satoshi">
                        Protect yourself and others from online fraud in just a few taps
                    </p>{isImage &&
                        <div className='w-full md:w-1/2 flex justify-center mt-8 mx-auto'>
                            <div className='relative w-full max-w-md md:max-w-lg lg:max-w-xl mx-auto'>
                                <Image
                                    src={isImage}
                                    alt="Tap Iq Hero image"
                                    width={600}
                                    height={400}
                                    className="w-full h-auto object-contain"
                                    priority
                                />
                            </div>
                        </div>}
                </div>

                <div className='grid grid-cols-1 lg:grid-cols-2 gap-12'>
                    {/* Features Grid */}
                    <div className="space-y-6 custom-gradient-border-y md:p-6 p-2">
                        {features.map((feature, index) => (
                            <div key={index} className="flex items-center">
                                <div className="">
                                    <Image
                                        src={feature.icon}
                                        alt={feature.title}
                                        width={32}
                                        height={32}
                                        className="w-auto"
                                        priority
                                    />
                                </div>
                                <div className="flex-1">
                                    <h3 className="text-lg md:text-xl font-semibold text-indigo mb-2">
                                        {feature.title}
                                    </h3>
                                    <p className="text-gray leading-relaxed font-satoshi">
                                        {feature.description}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Main Content Section */}
                    <div className="flex flex-col justify-center gap-8">
                        <div className="space-y-6 text-lg md:text-xl text-gray-600 leading-relaxed bg-cloudwhite p-2">
                            <p>
                                Every time someone reports a scam, the TapIQ database gets smarter.
                                By combining real-time reports, AI pattern recognition, and watchlist alerts,
                                TapIQ helps you verify vendors and avoid scams before it's too late.
                            </p>
                        </div>
                        <Button
                            className="bg-gradient-to-br from-[#575EFF] to-[#282D99] uppercase font-semibold text-base md:text-lg w-full md:w-auto px-8 py-6 complex-gradient-border text-white"
                        >
                            read more
                        </Button>
                    </div>
                </div>
            </div>
        </section>
    )
}