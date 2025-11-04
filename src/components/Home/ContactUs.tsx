"use client"
import Image from "next/image"
import { Button } from "../ui/button"
import TextInput from "../ui/TextInput"

export function Contact() {
    return (
        <section className={`py-16 px-6 font-manrope bg-cloudwhite `}>
            <div className="w-full md:w-1/2 mx-auto">
                <div className="w-full mx-auto text-center mb-8 md:mb-12">
                    <h1 className="text-3xl md:text-4xl lg:text-6xl font-semibold text-indigo mb-4">
                        Contact Us
                    </h1>
                    <p className="text-base md:text-lg text-indigo leading-relaxed font-satoshi">
                        Have any questions, feedback, or need assistance? Fill out the form below, and we’ll get back to you as soon as possible.
                    </p>
                </div>
            </div>
            <div className="max-w-6xl mx-auto">
                <div className="grid md:grid-cols-2 gap-8 items-center md:mb-8 mb-4">
                    <div className="relative p-4 flex items-center justify-center overflow-hidden w-full mx-auto rounded-lg">
                        <div className="absolute inset-0 z-0">
                            <Image
                                src="/assets/bg.jpg"
                                alt="Background"
                                fill
                                className="object-cover"
                                priority
                            />
                        </div>

                        <div className="w-full max-w-md relative z-10 flex flex-col text-white">
                            <h2 className="font-semibold text-xl md:text-2xl mb-6">Get in touch!</h2>
                            <TextInput
                                label="First Name"
                                type="text"
                                className="font-satoshi"
                                placeholder="Enter First Name"
                                value={""}
                                onChange={() => { }}
                            />

                            <TextInput
                                label="Last Name"
                                type="text"
                                className="font-satoshi"
                                placeholder="Enter Last Name"
                                value={""}
                                onChange={() => { }}
                            />
                            <div className="w-full">
                                <label className="block mb-2 font-satoshi">Message</label>
                                <textarea className=" w-full h-[60px] pr-10 bg-white!
              focus:outline-none
              disabled:cursor-not-allowed 
              placeholder:text-gray 
              focus:ring-blue-200 focus:ring-4  
              rounded-md px-3" placeholder="Your message/question font-satoshi"></textarea>
                            </div>
                            <Button
                                className="bg-gradient-to-br from-[#575EFF] to-[#282D99] uppercase font-semibold text-base md:text-lg w-full px-8 py-6 complex-gradient-border text-white my-6"
                            >
                                send
                            </Button>
                        </div>
                    </div>
                    <div className="flex flex-col">
                        <div className="w-full mx-auto text-center mb-2 md:mb-6">
                            <h1 className="text-3xl font-semibold text-indigo mb-4">
                                How to Reach Us
                            </h1>
                            <p className="text-base md:text-lg text-indigo leading-relaxed font-satoshi">
                                For any inquiries, feel free to reach out to us through the following contact details:
                            </p>
                        </div>
                        <div className="flex flex-col">
                            <div className="flex items-center -my-6">

                                <div className=""> <Image
                                    src="/assets/email.svg"
                                    alt="Background"
                                    width={48}
                                    height={48}
                                    className="w-auto"
                                    priority
                                />
                                </div>
                                <div className="flex flex-col gap-1 -ml-2">
                                    <h3 className="font-semibold text-xl md:text-2xl text-indigo ">Email</h3>
                                    <p className="text-gray font-satoshi">email@example.com</p>
                                </div>
                            </div>
                            <div className="flex items-center -my-6">

                                <div className=""> <Image
                                    src="/assets/phone.svg"
                                    alt="Background"
                                    width={48}
                                    height={48}
                                    className="w-auto"
                                    priority
                                />
                                </div>
                                <div className="flex flex-col gap-1 -ml-2">
                                    <h3 className="font-semibold text-xl md:text-2xl text-indigo ">Phone</h3>
                                    <p className="text-gray font-satoshi">+1 (555) 000-0000</p>
                                </div>
                            </div>
                            <div className="flex items-center -my-6">

                                <div className=""> <Image
                                    src="/assets/location.svg"
                                    alt="Background"
                                    width={48}
                                    height={48}
                                    className="w-auto"
                                    priority
                                />
                                </div>
                                <div className="flex flex-col gap-1 -ml-2">
                                    <h3 className="font-semibold text-xl md:text-2xl text-indigo ">Office</h3>
                                    <p className="text-gray font-satoshi">123 Sample St, Sydney NSW 2000 AU</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}