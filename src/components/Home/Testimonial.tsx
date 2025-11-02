const testimonials = [
    {
        name: "JOHN SMITH",
        comment: "Incredibly useful - protected me from numerous scams this month"
    }
]

export function TestimonialsSection() {
    return (
        <section className="py-16 px-6 bg-gray-50">
            <div className="max-w-6xl mx-auto">
                <h2 className="text-3xl font-bold text-center mb-4">Customer Testimonials</h2>
                <p className="text-center text-gray-600 mb-12">
                    Real experiences shared by our valued community members.
                </p>

                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {testimonials.map((testimonial, index) => (
                        <div key={index} className="bg-white p-6 rounded-lg shadow-md">
                            <div className="text-4xl mb-4">⭐</div>
                            <p className="text-gray-700 mb-4">{testimonial.comment}</p>
                            <p className="font-semibold text-gray-900">{testimonial.name}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    )
}