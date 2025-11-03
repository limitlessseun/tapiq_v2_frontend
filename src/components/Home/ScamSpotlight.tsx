import { Button } from '@/components/ui/button'
import Image from 'next/image'
export function ScamSpotlight() {
    return (
        <section className="py-16 px-6 font-manrope">
            <div className="max-w-6xl mx-auto">
                <div className="grid md:grid-cols-2 gap-8 items-center md:mb-8 mb-4">
                    {/* Right Card - Weekly Scam Spotlight */}
                    <div className="bg-white p-4 md:p-8 rounded-2xl shadow-[0px_4px_12px_0px_#E0E8F7AD]">
                        <div className="mb-6">
                            <h3 className="text-lg md:text-xl font-semibold text-indigo mb-2">Weekly Scam Spotlight</h3>
                            <p className="md:text-lg text-gray">Highlighting the most dangerous scam of the week to stay alert.</p>
                        </div>

                        <div className="bg-cloudwhite p-6 rounded-xl mb-6">
                            <div className='flex justify-between w-full'>
                                <div className="text-sm md:text-base font-semibold text-indigo  mb-2">AVERAGE SCAM OF THE WEEK</div>

                                <p className="text-3xl font-bold text-transparent bg-clip-text bg-[linear-gradient(177.64deg,#575EFF_1.98%,#282D99_149.74%)] mb-2">1500+</p>
                            </div>
                            <Image
                                src="/assets/Bars.svg"
                                alt=""
                                width={279}
                                height={92}
                                className="w-full  object-cover"
                            />
                        </div>
                    </div>
                    {/* Left Card - Scam Alerts Prevented */}
                    <div className="bg-white p-4 md:p-8 rounded-2xl shadow-[0px_4px_12px_0px_#E0E8F7AD]">
                        <div className="mb-6">
                            <h3 className="text-lg md:text-xl font-semibold text-indigo mb-2">Scam alerts prevented</h3>
                            <p className="md:text-lg text-gray">Stay ahead of scammers with our smart detection</p>
                        </div>

                        <div className="bg-cloudwhite p-6 rounded-xl mb-6">
                            <div className="text-sm md:text-base font-semibold text-indigo  mb-2 uppercase">Users protected from Scam</div>
                            <p className="text-3xl font-bold text-transparent bg-clip-text bg-[linear-gradient(177.64deg,#575EFF_1.98%,#282D99_149.74%)] mb-2">1500+</p>
                        </div>
                    </div>
                </div>
                <p className='text-indigo text-xl md:text-2xl font-medium text-center'>Join us to stay informed about the latest risks and help others stay safe</p>
            </div>
        </section>
    )
}