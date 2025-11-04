import { Button } from '@/components/ui/button'

export function CTASection() {
    return (
        <section className="bg-gradient-to-b from-[#057EB7] from-[2.1%] via-[#141986] via-[50.13%] to-[#0E1264] to-[98.16%] text-white py-16 md:py-20 lg:py-24 px-6 font-manrope">
            <div className="flex flex-col justify-center w-full text-center it">
                <h1 className="text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-semibold mb-6 md:mb-8 leading-tight capitalize">
                    Ready to stay ahead
                    <br />
                    of scammers?
                </h1>
                <p className="text-lg md:text-xl lg:text-2xl mb-8 md:mb-10 lg:mb-12 text-secwhite leading-relaxed max-w-xl mx-auto font-satoshi">
                    Take control of your online safety today. Stay informed, report suspicious activity, and protect yourself from fraud.
                </p>
                <div className='flex gap-4 flex-col md:gap-6 w-full max-w-md mx-auto md:max-w-none md:w-auto md:flex-row'>
                    <Button
                        className="bg-gradient-to-br from-[#575EFF] to-[#282D99] uppercase font-semibold text-base md:text-lg w-full md:w-48 py-6 md:py-7 complex-gradient-border"
                    >
                        Verify a Vendor
                    </Button>
                    <Button className="bg-transparent text-white uppercase font-semibold text-base md:text-lg w-full md:w-48 py-6 md:py-7 hover:bg-white/10 complex-gradient-border"
                    >
                        Scan a Message
                    </Button>
                </div>
            </div>
        </section>
    )
}