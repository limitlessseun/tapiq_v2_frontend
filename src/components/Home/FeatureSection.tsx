import { Card, CardContent } from '@/components/ui/card'

const stats = [
    {
        value: "52",
        label: "Billion lost to fraud in Nigeria in 2024",
        suffix: "+"
    },
    {
        value: "1",
        label: "Platform Built to stop billions in fraud before it starts",
        suffix: ""
    },
    {
        value: "78",
        label: "of scams show warning signs TapIQ is built to detect",
        suffix: "%"
    },
    {
        value: "350",
        label: "Increase in fraud losses since 2020",
        suffix: "%"
    }
]

export function FeaturesSection() {
    return (
        <section className="py-12 md:py-20 px-6 bg-gray-50">
            <div className="max-w-7xl mx-auto">
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
                    {stats.map((stat, index) => (
                        <Card key={index} className="bg-white border-0 shadow-lg hover:shadow-xl transition-all duration-300">
                            <CardContent className="p-2 md:p-8 text-center">
                                {/* Value */}
                                <div className="text-4xl md:text-5xl lg:text-6xl font-bold text-indigo mb-2 md:mb-4">
                                    {stat.value}<span className='text-teal'>{stat.suffix}</span>
                                </div>

                                {/* Label */}
                                <p className="text-sm md:text-base text-gray leading-relaxed">
                                    {stat.label}
                                </p>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </div>
        </section>
    )
}