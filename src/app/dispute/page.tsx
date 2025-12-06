"use client";

import { CTASection, RaiseDispute } from "@/components/Home";
import { useState } from "react";
import AnimatedModalLayout from "@/layout/animatedModalLayout";
import axios from "axios";

// File upload utility
const singleFileUpload = async (file: File): Promise<string> => {
    const formData = new FormData();
    formData.append("file", file);

    // Get token from your storage (adjust based on your auth setup)
    const token = localStorage.getItem('authToken') || sessionStorage.getItem('authToken');

    const response = await axios.post('https://authapistaging.tervanx.com/api/Utilities/upload', formData, {
        headers: {
            'Content-Type': 'multipart/form-data',
            'Authorization': token ? `Bearer ${token}` : '',
        },
    });

    // Handle different possible response structures
    if (response.data && response.data.data) {
        return response.data.data.url ||
            response.data.data.fileUrl ||
            response.data.data.downloadUrl ||
            response.data.data.location ||
            '';
    } else if (response.data && response.data.url) {
        return response.data.url;
    } else if (response.data && typeof response.data === 'string') {
        return response.data;
    }

    throw new Error('Could not find URL in upload response');
};

interface DisputeFormData {
    businessName: string;
    fullName: string;
    emailAddress: string;
    phoneNumber: string;
    reportId: string;
    reportDescription: string;
    reasonForDispute: string;
    supportingEvidence: string[];
    additionalInformation: string;
}

interface EvidenceFile {
    fileName: string;
    url: string;
    contentType: string;
    size: number;
}

export default function DisputePage() {
    const [showSuccessModal, setShowSuccessModal] = useState(false);
    const [disputeId, setDisputeId] = useState<string>('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<string>('');

    // Initialize form data state (you might want to lift this state up or use context)
    const [formData, setFormData] = useState<DisputeFormData>({
        businessName: '',
        fullName: '',
        emailAddress: '',
        phoneNumber: '',
        reportId: '',
        reportDescription: '',
        reasonForDispute: '',
        supportingEvidence: [],
        additionalInformation: ''
    });

    const [evidenceFiles, setEvidenceFiles] = useState<EvidenceFile[]>([]);
    const [isUploading, setIsUploading] = useState(false);
    const resetForm = () => {
        setFormData({
            businessName: '',
            fullName: '',
            emailAddress: '',
            phoneNumber: '',
            reportId: '',
            reportDescription: '',
            reasonForDispute: '',
            supportingEvidence: [],
            additionalInformation: ''
        });
        setEvidenceFiles([]);


    };

    // Function to handle file uploads (you can move this to RaiseDispute component)
    const handleFileUpload = async (file: File): Promise<string> => {
        setIsUploading(true);
        try {
            const url = await singleFileUpload(file);
            return url;
        } finally {
            setIsUploading(false);
        }
    };

    // Function to submit the dispute form
    const handleSubmitDispute = async (formData: DisputeFormData) => {
        setIsSubmitting(true);
        setError('');

        try {
            console.log('Submitting dispute to API:', formData);

            // Make the API call
            const response = await fetch('https://tapiq.aitechstaging.com/api/disputes', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData)
            });

            const responseText = await response.text();
            let responseData;
            try {
                responseData = responseText ? JSON.parse(responseText) : {};
            } catch (parseError) {
                console.error('Failed to parse response:', responseText);
                throw new Error('Invalid response from server');
            }

            if (!response.ok) {
                const errorMessage = responseData.message ||
                    responseData.error ||
                    response.statusText ||
                    'Failed to submit dispute';
                throw new Error(errorMessage);
            }

            console.log('API Response:', responseData);

            // Extract dispute ID from response (adjust based on your API response structure)
            const disputeId = responseData.id ||
                responseData.disputeId ||
                responseData.referenceId ||
                `#TQ-DSP-${Math.floor(Math.random() * 100000)}`;

            setDisputeId(disputeId);
            setShowSuccessModal(true);

            return disputeId;

        } catch (error) {
            console.error('Error submitting dispute:', error);
            const errorMessage = error instanceof Error
                ? error.message
                : 'An error occurred while submitting your dispute. Please try again.';
            setError(errorMessage);
            throw error;
        } finally {
            setIsSubmitting(false);
        }
    };

    // Function to handle form data from RaiseDispute component
    const handleDisputeFormSubmit = async (data: any) => {
        try {
            // Transform RaiseDispute form data to API format
            const apiFormData: DisputeFormData = {
                businessName: data.businessName || '',
                fullName: data.contactName || data.fullName || '',
                emailAddress: data.email || data.emailAddress || '',
                phoneNumber: data.phone || data.phoneNumber || '',
                reportId: data.reportId || '',
                reportDescription: data.reportDescription || data.disputeReason || '',
                reasonForDispute: data.reasonForDispute || data.disputeReason || '',
                supportingEvidence: data.supportingEvidence || data.evidenceUrls || [],
                additionalInformation: data.additionalInformation || data.additionalInfo || ''
            };

            // Handle file uploads if needed
            if (data.files && data.files.length > 0) {
                const uploadedUrls: string[] = [];
                for (const file of data.files) {
                    if (file instanceof File) {
                        const url = await handleFileUpload(file);
                        uploadedUrls.push(url);
                    } else if (typeof file === 'string') {
                        uploadedUrls.push(file);
                    }
                }
                apiFormData.supportingEvidence = [...apiFormData.supportingEvidence, ...uploadedUrls];
            }

            // Submit to API
            const disputeId = await handleSubmitDispute(apiFormData);
            return disputeId;
        } catch (error) {
            console.error('Error in dispute submission:', error);
            throw error;
        }
    };

    return (
        <main className="min-h-screen">
            {/* Pass submit handler to RaiseDispute component */}
            <RaiseDispute onSubmit={handleDisputeFormSubmit}
                isSubmitting={isSubmitting}
                isUploading={isUploading} />

            {/* Display error if any */}
            {error && (
                <div className="fixed top-4 right-4 bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-lg shadow-lg z-50">
                    <p className="font-medium">{error}</p>
                    <button
                        onClick={() => setError('')}
                        className="text-red-600 hover:text-red-800 mt-1 text-sm"
                    >
                        Dismiss
                    </button>
                </div>
            )}

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
                    <p className="text-gray mb-6 text-sm md:text-base leading-relaxed font-satoshi">
                        We'll review the information and update you<br />
                        within 3—7 business days.
                        <br />
                        Reference ID:
                        <span className="text-indigo ml-1 font-semibold">{disputeId}</span>
                    </p>

                    {/* Action Buttons */}
                    <div className="flex flex-col sm:flex-row gap-3">
                        <button
                            onClick={() => setShowSuccessModal(false)}
                            className="flex-1 py-3 px-4 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50 transition-colors"
                        >
                            CLOSE
                        </button>
                        <button
                            onClick={() => {
                                console.log("Submit new dispute clicked");
                                setShowSuccessModal(false);
                                resetForm();
                            }}
                            className="flex-1 py-3 px-4 bg-gradient-to-br from-[#575EFF] to-[#282D99] complex-border-gradient text-white rounded-lg font-medium hover:bg-[#134a9c] transition-colors"
                        >
                            SUBMIT NEW DISPUTE
                        </button>
                    </div>
                </AnimatedModalLayout>
            )}

            <CTASection />
        </main>
    );
}