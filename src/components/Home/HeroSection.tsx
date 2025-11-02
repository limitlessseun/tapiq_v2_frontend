import { Button } from '@/components/ui/button'
import Image from 'next/image'
export function HeroSection() {
    return (
        <section className="bg-gradient-to-br from-[#057EB7] via-[#141986] to-[#0E1264] text-white py-18 md:py-24 px-6 font-manrope">
            <div className='flex flex-col gap-8 md:gap-12 lg:gap-16 md:flex-row items-center justify-between w-full max-w-7xl mx-auto'>
                {/* Text Content */}
                <div className="max-w-4xl md:max-w-2xl lg:max-w-3xl md:w-1/2 mx-auto md:mx-0 text-center md:text-start">
                    <h1 className="text-3xl md:text-4xl font-semibold mb-6 md:mb-8 leading-tight">
                        STOP SCAMS
                        <br />
                        BEFORE THEY START
                    </h1>
                    <p className="text-lg md:text-xl lg:text-2xl mb-8 md:mb-12 text-secwhite leading-relaxed">
                        Easily verify vendors, suspicious messages. Built for your safety.
                    </p>
                    <div className='flex gap-4 flex-col md:flex-row md:gap-6 max-w-md md:max-w-full'>
                        <Button
                            className="bg-gradient-to-br from-[#575EFF] to-[#282D99] uppercase font-semibold text-base md:text-lg w-full py-6 md:py-7 hover:scale-105 transition-transform duration-200"
                            style={{
                                border: '1px solid',
                                borderImage: `
              linear-gradient(180deg, rgba(255, 255, 255, 0.8) -25.96%, rgba(255, 255, 255, 0) 100%),
              linear-gradient(270deg, rgba(255, 255, 255, 0) 12.54%, rgba(255, 255, 255, 0.8) 47.67%, rgba(255, 255, 255, 0) 82.8%)
              1
            `
                            }}>
                            Verify a Vendor
                        </Button>
                        <Button className="bg-transparent text-white uppercase font-semibold text-base md:text-lg w-full py-6 md:py-7 hover:bg-white/10 transition-all duration-200"
                            style={{
                                border: '1px solid',
                                borderImage: `
              linear-gradient(180deg, rgba(255, 255, 255, 0.8) -25.96%, rgba(255, 255, 255, 0) 100%),
              linear-gradient(270deg, rgba(255, 255, 255, 0) 12.54%, rgba(255, 255, 255, 0.8) 47.67%, rgba(255, 255, 255, 0) 82.8%)
              1
            `
                            }}>
                            Scan a Message
                        </Button>
                    </div>
                </div>

                {/* Image */}
                <div className='w-full md:w-1/2 lg:w-2/5 flex justify-center'>
                    <div className='relative max-w-md lg:max-w-lg xl:max-w-xl'>
                        <Image
                            src="/assets/image.png"
                            alt="Tap Iq Hero image"
                            width={600}
                            height={400}
                            className="w-full h-auto object-contain drop-shadow-2xl"
                            priority
                        />
                    </div>
                </div>
            </div>
        </section>
    )
}