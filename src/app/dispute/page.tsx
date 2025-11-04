"use client";

import { CTASection, RaiseDispute } from "@/components/Home";
import { useState } from "react";
import AnimatedModalLayout from "@/layout/animatedModalLayout";


export default function DisputePage() {
    const [showSuccessModal, setShowSuccessModal] = useState(false);

    return (
        <main className="min-h-screen">
            <RaiseDispute />
            {/* Dispute Success Modal */}
            {showSuccessModal && (
                <AnimatedModalLayout
                    setShowModal={setShowSuccessModal}
                    showCloseIcon={true}
                    maxWidth={480}
                    className="p-6 md:p-8"
                >
                    {/* Title */}
                    <h2 className="md:text-lg font-bold text-center text-indigo mb-4">
                        Your dispute has been submitted
                    </h2>

                    {/* Description */}
                    <p className="text-gray mb-6 text-sm md:text-base leading-relaxed">
                        We'll review the information and update you<br />
                        within 3—7 business days.
                        <br />
                        Reference ID:
                        <span className="text-indigo">#TQ-DSP-23891</span>
                    </p>
                    {/* Action Buttons */}
                    <div className="flex flex-col sm:flex-row gap-3">
                        <button
                            onClick={() => setShowSuccessModal(false)}
                            className="flex-1 py-3 px-4 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50 transition-colors"
                        >
                            DISPUTE STATUS
                        </button>
                        <button
                            onClick={() => {
                                console.log("Submit new dispute clicked");
                                setShowSuccessModal(false);
                            }}
                            className="flex-1 py-3 px-4 bg-gradient-to-br from-[#575EFF] to-[#282D99] complex-border-gradient text-white rounded-lg font-medium hover:bg-[#134a9c] transition-colors"
                        >
                            SUBMIT NEW DISPUTE
                        </button>
                    </div>
                </AnimatedModalLayout>
            )
            }
        </main >
    );
}