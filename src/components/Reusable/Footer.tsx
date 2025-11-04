import { Button } from '@/components/ui/button'
import Image from 'next/image'
export function Footer() {
    return (
        <footer className="font-manrope py-12 px-6 mb-8">
            <div className="max-w-6xl mx-auto">
                <div className="text-center ">
                    <h3 className="text-3xl md:text-4xl font-semibold text-indigo mb-4">Stay Connected</h3>
                    <p className="text-indigo md:text-lg ">
                        Follow us on social media for the latest updates, scam alerts, and safety tips.
                    </p>
                    <div className="flex justify-center items-center overflow-hidden max-w-6xl w-[90%] md:w-1/2 mx-auto bg-white">
                        <Image
                            src="/assets/facebook.svg"
                            alt='facebook'
                            width={52}
                            height={52}
                            className='w-1/2 -m-12 '
                        />
                        <Image
                            src="/assets/instagram.svg"
                            alt='instagram'
                            width={52}
                            height={52}
                            className='w-1/2 -m-12 '
                        />
                        <Image
                            src="/assets/twitter.svg"
                            alt='twitter'
                            width={52}
                            height={52}
                            className='w-1/2 -m-12 '
                        />
                        <Image
                            src="/assets/linkedin.svg"
                            alt='linkedin'
                            width={52}
                            height={52}
                            className='w-1/2 -m-12 '
                        />
                        <Image
                            src="/assets/tiktok.svg"
                            alt='tiktok'
                            width={52}
                            height={52}
                            className='w-1/2 -m-12 '
                        />
                    </div>
                </div>
            </div>
        </footer>
    )
}