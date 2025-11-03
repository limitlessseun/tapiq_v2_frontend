import { Button } from '@/components/ui/button'
import Image from 'next/image'
export function Footer() {
    return (
        <footer className="font-manrope py-12 px-6 mb-16">
            <div className="max-w-6xl mx-auto">
                <div className="text-center ">
                    <h3 className="text-3xl md:text-4xl font-semibold text-indigo mb-4">Stay Connected</h3>
                    <p className="text-indigo md:text-lg ">
                        Follow us on social media for the latest updates, scam alerts, and safety tips.
                    </p>
                    <div className="flex justify-center items-center gap-4 md:gap-8 w-full max-w-4xl mx-auto">
                        <div className='flex-shrink-0'>
                            <Image
                                src="/assets/facebook.svg"
                                alt='facebook'
                                width={40}
                                height={40}
                                className='w-10 h-10 md:w-12 md:h-12 lg:w-16 lg:h-16'
                            />
                        </div>
                        <div className='flex-shrink-0'>
                            <Image
                                src="/assets/instagram.svg"
                                alt='instagram'
                                width={40}
                                height={40}
                                className='w-10 h-10 md:w-12 md:h-12 lg:w-16 lg:h-16'
                            />
                        </div>
                        <div className='flex-shrink-0'>
                            <Image
                                src="/assets/twitter.svg"
                                alt='twitter'
                                width={40}
                                height={40}
                                className='w-10 h-10 md:w-12 md:h-12 lg:w-16 lg:h-16'
                            />
                        </div>
                        <div className='flex-shrink-0'>
                            <Image
                                src="/assets/linkedin.svg"
                                alt='linkedin'
                                width={40}
                                height={40}
                                className='w-10 h-10 md:w-12 md:h-12 lg:w-16 lg:h-16'
                            />
                        </div>
                        <div className='flex-shrink-0'>
                            <Image
                                src="/assets/tiktok.svg"
                                alt='tiktok'
                                width={40}
                                height={40}
                                className='w-10 h-10 md:w-12 md:h-12 lg:w-16 lg:h-16'
                            />
                        </div>
                    </div>
                </div>

            </div>
        </footer>
    )
}