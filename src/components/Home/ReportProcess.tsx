"use client"
import { Button } from "../ui/button";
import Image from "next/image";
import { useSessionStore } from "@/stores/useSessionStore";
import { Notification } from "../Reusable/Notification";
import { useState } from "react";
import { useRouter } from "next/navigation";
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

    const router = useRouter();
    const { session } = useSessionStore();
    const [notification, setNotification] = useState<{
        message: string;
        type: 'success' | 'error';
    } | null>(null);

    const showNotification = (message: string, type: 'success' | 'error') => {
        setNotification({ message, type });
    };

    const hideNotification = () => {
        setNotification(null);
    };



    const handleReport = () => {
        if (!session) {
            showNotification('Please sign in to report scam', 'error');
            // Redirect to sign in after a delay so user sees the notification
            setTimeout(() => {
                router.push(`/auth/login?callbackUrl=${encodeURIComponent('/report-vendor')}`);
            }, 1500);
            return;
        }
        router.push("/report-vendor");
    };

    return (
        <>
            {notification && (
                <Notification
                    message={notification.message}
                    type={notification.type}
                    onClose={hideNotification}
                />
            )}
            <section className="py-16 px-6 bg-cloudwhite font-satoshi">
                <div className="max-w-4xl mx-auto">
                    <div className="text-center mb-12">
                        <h1 className="text-3xl md:text-4xl font-semibold text-indigo mb-4">
                            What Happens After You Report?
                        </h1>
                    </div>

                    {/* Process Steps */}
                    <div className="flex gap-6 md:gap-8 ">
                        {/* Step Image */}
                        <div className="flex-shrink-0">
                            <Image
                                src="/assets/step.png"
                                alt='steps'
                                width={20}
                                height={408}
                                className='w-fit min-h-[420px] h-full'
                            />
                        </div>

                        {/* Steps Content */}
                        <div className="flex-1 md:space-y-6 space-y-2">
                            {steps.map((step, index) => (
                                <div key={index} className="flex items-start gap-4">
                                    {/* Step Text Content */}
                                    <div className="flex-1">
                                        <h3 className="text-base md:text-lg font-medium text-dark mb-2">
                                            <span className=" mr-2">{step.number}.</span>
                                            {step.title}
                                        </h3>
                                        <p className="text-gray text-sm md:text-base leading-relaxed">
                                            {step.description}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* CTA Button */}
                    <div className="text-center">
                        <Button
                            className="bg-gradient-to-br from-[#575EFF] to-[#282D99] uppercase font-semibold text-base md:text-lg w-full px-8 py-6 complex-gradient-border text-white my-6"
                            onClick={handleReport}
                        >
                            report a scam
                        </Button>
                    </div>
                </div>
            </section>
        </>
    );
}