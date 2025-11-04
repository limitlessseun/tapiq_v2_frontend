export function TermsAndPrivacy() {
    const sections = [
        {
            number: "1",
            title: "INTRODUCTION",
            content: "At TapIQ, we value your privacy and are committed to protecting your personal data. This Privacy Policy outlines how we collect, use, and safeguard your information when you use our Service."
        },
        {
            number: "2",
            title: "INFORMATION WE COLLECT",
            content: "We may collect the following information when you use the Service:",
            list: [
                "Personal Information: Name, email address, phone number, and other details you provide when registering.",
                "Usage Data: Information about how you interact with the Service, including IP address, device type, and browser information.",
                "Report Data: Content you submit through the platform, such as vendor reports and comments."
            ]
        },
        {
            number: "3",
            title: "HOW WE USE YOUR INFORMATION",
            content: "We use the information collected for the following purposes:",
            list: [
                "To provide, maintain, and improve the Service",
                "To communicate with you regarding updates, notifications, or issues related to your account",
                "To analyze usage patterns and improve user experience",
                "To ensure compliance with our Terms and detect fraudulent activity"
            ]
        },
        {
            number: "4",
            title: "DATA SHARING AND DISCLOSURE",
            content: "We do not share your personal information with third parties except in the following cases:",
            list: [
                "Service Providers: We may share data with trusted third-party vendors who help us operate and maintain the Service.",
                "Legal Requirements: We may disclose your data if required by law or to protect our rights, users, or the public."
            ]
        },
        {
            number: "5",
            title: "SECURITY",
            content: "We employ industry-standard security measures to protect your personal information from unauthorized access, alteration, or disclosure. However, no method of transmission over the internet is completely secure, and we cannot guarantee the absolute security of your data."
        },
        {
            number: "6",
            title: "YOUR RIGHTS",
            content: "You have the right to access, correct, or delete your personal information. You may also withdraw your consent for us to process your data at any time by contacting us."
        },
        {
            number: "7",
            title: "COOKIES",
            content: "We use cookies to enhance user experience, track usage patterns, and customize content. You can control cookie settings in your browser."
        },
        {
            number: "8",
            title: "CHILDREN'S PRIVACY",
            content: "The Service is not intended for children under 13 years old. We do not knowingly collect personal information from children. If we become aware that we have inadvertently collected such data, we will take steps to delete it."
        },
        {
            number: "9",
            title: "CHANGES TO PRIVACY POLICY",
            content: "We may update this Privacy Policy from time to time. Any changes will be posted on this page, and the date of the most recent update will be indicated."
        },
        {
            number: "10",
            title: "CONTACT US",
            content: "If you have any questions or concerns regarding our Terms & Conditions or Privacy Policy, please contact us at:",
            contact: {
                email: "email@example.com",
                phone: "+1 (555) 000-0000",
                office: "123 Sample St, Sydney NSW 2000 AU"
            }
        }
    ];

    return (
        <section className="py-16 px-6 bg-cloudWhite font-manrope">
            <div className="max-w-4xl mx-auto">
                <div className="w-full mx-auto text-center mb-12">
                    <h1 className="text-3xl md:text-4xl lg:text-6xl font-semibold text-indigo mb-4">
                        Terms & Privacy
                    </h1>
                    <p className="text-base md:text-lg text-indigo leading-relaxed">
                        Your Rights and Responsibilities
                    </p>
                </div>

                <div className="space-y-6">
                    {sections.map((section, index) => (
                        <div className="bg-white rounded-lg shadow-[0px_4px_12px_0px_#E0E8F7AD] border border-white p-2" key={index}>
                            <div className="bg-gradient-to-b from-white/60 to-[#e1eafd]/60 p-6 ">
                                <div className="flex items-start gap-4 mb-2">
                                    <h2 className="text-sm md:text-base font-medium text-indigo uppercase">
                                        <span className="">
                                            {section.number}.
                                        </span>
                                        {section.title}
                                    </h2>
                                </div>
                                <div className="text-gray text-sm md:text-base leading-relaxed font-satoshi">
                                    <p className="mb-2">{section.content}</p>

                                    {section.list && (
                                        <ul className="space-y-3 ml-6 list-disc font-satoshi">
                                            {section.list.map((item, itemIndex) => (
                                                <li key={itemIndex} className="text-gray">
                                                    {item}
                                                </li>
                                            ))}
                                        </ul>
                                    )}
                                    {section.contact && (
                                        <div className="mt-4 space-y-2 font-satoshi">
                                            <p className="font-semibold">Email: <span className="font-normal text-gray">{section.contact.email}</span></p>
                                            <p className="font-semibold">Phone: <span className="font-normal text-gray">{section.contact.phone}</span></p>
                                            <p className="font-semibold">Office: <span className="font-normal text-gray">{section.contact.office}</span></p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}