import Image from "next/image"

const testimonials = [
    {
        name: "JOHN SMITH",
        avatar: "/assets/icon.png",
        comment: "I've been using this platform for a few months now, and it has helped me avoid numerous scams. The real-time alerts are incredibly useful and reassuring."
    },
    {
        name: "SARAH JOHNSON",
        avatar: "/assets/icon.png",
        comment: "I've been using this platform for a few months now, and it has helped me avoid numerous scams. The real-time alerts are incredibly useful and reassuring."
    },
    {
        name: "MIKE CHEN",
        avatar: "/assets/icon.png",
        comment: "I've been using this platform for a few months now, and it has helped me avoid numerous scams. The real-time alerts are incredibly useful and reassuring."
    },

]

export function TestimonialsSection({ hidden }: any) {
    return (
        <section className="py-16 px-6 ">
            <div className="max-w-7xl mx-auto text-center">
                <h1 className="text-3xl md:text-4xl lg:text-6xl font-semibold text-indigo">
                    Customer Testimonials
                </h1>
                <p className="text-base md:text-lg text-indigo mx-auto leading-relaxed mb-6 max-w-2xl font-satoshi">
                    Real experiences shared by our valued community members.
                </p>

                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {testimonials.map((testimonial, index) => (
                        <div className="bg-white rounded-lg shadow-[0px_4px_12px_0px_#E0E8F7AD] border border-white p-2" key={index} >
                            <div className="bg-gradient-to-b from-white/60 to-[#e1eafd]/60 p-6 ">
                                <div className="flex  items-center gap-3 mb-4">
                                    <div className="relative w-10 h-10">
                                        <Image
                                            src={testimonial.avatar}
                                            alt={`${testimonial.name} avatar`}
                                            fill
                                            className="rounded-full object-cover"
                                        />
                                    </div>
                                    <p className="font-semibold text-indigo md:text-lg">{testimonial.name}</p>
                                </div>
                                <div className="flex  mb-4 gap-1">
                                    {[...Array(5)].map((_, starIndex) => (
                                        <Image
                                            key={starIndex}
                                            src="/assets/vector.svg"
                                            alt="Star rating"
                                            width={24}
                                            height={24}
                                            className="w-6 h-6"
                                        />
                                    ))}
                                </div>
                                <p className="text-gray text-sm md:text-base mb-4 italic text-start font-satoshi">"{testimonial.comment}"</p>

                            </div>
                        </div>
                    ))}

                </div>
                {hidden ? "" :
                    <div className="relative w-full h-3 my-8">
                        <Image
                            src="/assets/swiper.svg"
                            alt="Swiper"
                            fill
                            className="object-contain"
                            priority
                        />
                    </div>}
            </div>
        </section>
    )
}