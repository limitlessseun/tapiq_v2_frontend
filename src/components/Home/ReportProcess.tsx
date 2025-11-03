export function ReportProcess() {
    const steps = [
        {
            number: "01",
            title: "You submit a scam report",
            description: "You report a suspicious vendor or message to help protect others from potential fraud."
        },
        {
            number: "02",
            title: "TapIQ Reviews and Scores the Report",
            description: "Using AI and historical data, TapIQ analyzes the report to determine its validity and risk level."
        },
        {
            number: "03",
            title: "Added to the Public Database",
            description: "Once verified, the scam is added to the public database for future reference and tracking."
        },
        {
            number: "04",
            title: "Others Receive Alerts",
            description: "People who check or track the vendor will be immediately alerted about the scam, keeping them informed and safe."
        }
    ];

    return (
        <section className="py-16 px-6 bg-gradient-to-br from-blue-50 to-indigo-50">
            <div className="max-w-4xl mx-auto">
                {/* Header */}
                <div className="text-center mb-12">
                    <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                        What Happens After You Report?
                    </h1>
                </div>

                {/* Process Steps */}
                <div className="space-y-8 mb-12">
                    {steps.map((step, index) => (
                        <div key={index} className="flex items-start gap-6">
                            {/* Step Number */}
                            <div className="flex-shrink-0 w-12 h-12 bg-indigo-600 rounded-full flex items-center justify-center">
                                <span className="text-white font-bold text-lg">{step.number}</span>
                            </div>

                            {/* Step Content */}
                            <div className="flex-1">
                                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                                    {step.title}
                                </h3>
                                <p className="text-gray-600 text-lg leading-relaxed">
                                    {step.description}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>

                {/* CTA Button */}
                <div className="text-center">
                    <button className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-4 px-8 rounded-lg text-lg transition-colors duration-200 shadow-lg">
                        REPORT A SCAM
                    </button>
                </div>
            </div>
        </section>
    );
}