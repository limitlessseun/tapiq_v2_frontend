import Image from "next/image"
import { Button } from "../ui/button"

export function HowItWorks({ bg }: any) {
    return (
        <section className={`py-16 px-6 font-manrope bg-cloudwhite ${bg}`}>
            <div className="w-full md:w-1/2 mx-auto">
                <div className="w-full mx-auto text-center mb-8">
                    <h1 className="text-3xl md:text-4xl lg:text-6xl font-semibold text-indigo mb-4">
                        How TapIQ Works
                    </h1>
                    <p className="text-base md:text-lg text-indigo leading-relaxed">
                        Protect yourself and others from online fraud in just a few taps
                    </p>
                </div>

                <div className="max-w-4xl mx-auto">
                    <div className="h-[500px] relative p-6 flex items-center justify-center overflow-hidden w-full md:w-3/4 lg:w-2/3 mx-auto rounded-lg">
                        <div className="absolute inset-0 z-0">
                            <Image
                                src="/assets/bg.jpg"
                                alt="Background"
                                fill
                                className="object-cover"
                                priority
                            />
                        </div>

                        <div className="w-full max-w-md relative z-10">
                            <div className="mb-6">
                                <h1 className="text-white text-3xl font-bold mb-2">01/ Report a vendor</h1>
                                <p className="text-blue-200 text-sm">
                                    Share your experience. Add screenshots, platform, amount, and story to help others.
                                </p>
                            </div>
                            <div className="relative mx-auto" style={{ width: '280px', height: '280px' }}>
                                <div className="absolute inset-0">
                                    <Image
                                        src="/assets/phone.png"
                                        alt="iPhone Frame"
                                        fill
                                        className="object-contain"
                                        priority
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                    {bg ? "" :
                        <div className="relative w-full h-3 my-8">
                            <Image
                                src="/assets/swiper.svg"
                                alt="Swiper"
                                fill
                                className="object-contain"
                                priority
                            />
                        </div>
                    }
                    <div className="w-full md:w-3/4 lg:w-2/3 mx-auto">
                        <Button
                            className="bg-gradient-to-br from-[#575EFF] to-[#282D99] uppercase font-semibold text-base md:text-lg w-full px-8 py-6 complex-gradient-border text-white my-6"
                        >
                            {bg ? "Sign up" : " read more"}
                        </Button>
                    </div>
                </div>
            </div>
        </section>
    )
}