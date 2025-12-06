"use client";
import { useState, useEffect } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import TextInput from "@/components/ui/TextInput";
import CheckboxInput from "../ui/Checkbox";

interface RaiseDisputeProps {
    onSubmit?: (formData: any) => Promise<string>;
    isSubmitting?: boolean;
    isUploading?: boolean;
}

interface EvidenceFile {
    file: File;
    previewUrl: string;
    uploadedUrl?: string;
    uploadError?: string;
}

export function RaiseDispute({ onSubmit, isSubmitting, isUploading }: RaiseDisputeProps) {
    const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>([]);
    const [disputeReason, setDisputeReason] = useState("");
    const [contactMethod, setContactMethod] = useState("email");
    const [agreement1, setAgreement1] = useState(false);
    const [agreement2, setAgreement2] = useState(false);

    // Form fields matching API format
    const [formData, setFormData] = useState({
        businessName: "",
        fullName: "",
        emailAddress: "",
        phoneNumber: "",
        reportId: "",
        reportDescription: "",
        reasonForDispute: "",
        additionalInformation: "",
        platforms: [] as string[],
        vendorName: "",
        briefDescription: "",
        additionalNotes: "",
    });

    const [evidenceFiles, setEvidenceFiles] = useState<EvidenceFile[]>([]);
    const [descriptionLength, setDescriptionLength] = useState(0);
    const [notesLength, setNotesLength] = useState(0);
    const [uploadErrors, setUploadErrors] = useState<string[]>([]);

    const platforms = ["Facebook", "WhatsApp", "TikTok", "Twitter", "Telegram"];
    const disputeReasons = [
        "Someone is pretending to be my business",
        "The report is not true",
        "The issue was real but it's been fixed",
        "Other",
    ];

    const handleInputChange = (field: string, value: string) => {
        setFormData(prev => ({
            ...prev,
            [field]: value
        }));
    };

    const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (!files) return;

        const newFiles: EvidenceFile[] = [];
        const errors: string[] = [];

        Array.from(files).forEach((file, index) => {
            // Validate file size (25MB limit)
            const maxSize = 25 * 1024 * 1024;
            if (file.size > maxSize) {
                errors.push(`${file.name}: File size must be less than 25MB`);
                return;
            }

            // Validate file type
            const acceptedTypes = [
                'image/jpeg',
                'image/jpg',
                'image/png',
                'application/pdf',
                'video/mp4',
                'application/msword',
                'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
            ];

            if (!acceptedTypes.includes(file.type)) {
                errors.push(`${file.name}: Accepted formats: JPG, PNG, PDF, MP4, DOC, DOCX`);
                return;
            }

            const previewUrl = URL.createObjectURL(file);
            newFiles.push({
                file,
                previewUrl
            });
        });

        if (errors.length > 0) {
            setUploadErrors(errors);
        }

        if (newFiles.length > 0) {
            setEvidenceFiles(prev => [...prev, ...newFiles.slice(0, 3 - prev.length)]);
        }

        // Clear the file input
        e.target.value = '';
    };

    const removeFile = (index: number) => {
        setEvidenceFiles(prev => {
            const newFiles = [...prev];
            URL.revokeObjectURL(newFiles[index].previewUrl);
            newFiles.splice(index, 1);
            return newFiles;
        });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // Validate required fields
        if (!formData.businessName || !formData.fullName || !formData.emailAddress ||
            !disputeReason || !agreement1 || !agreement2) {
            alert("Please fill in all required fields and accept the agreements.");
            return;
        }

        // Transform dispute reason to match API format
        let apiReasonForDispute = "";
        switch (disputeReason) {
            case "Someone is pretending to be my business":
                apiReasonForDispute = "Impersonation of business";
                break;
            case "The report is not true":
                apiReasonForDispute = "False or inaccurate information";
                break;
            case "The issue was real but it's been fixed":
                apiReasonForDispute = "Previously resolved issue";
                break;
            case "Other":
                apiReasonForDispute = "Other";
                break;
            default:
                apiReasonForDispute = disputeReason;
        }

        // Prepare data in API format
        const submitData = {
            businessName: formData.businessName,
            fullName: formData.fullName,
            emailAddress: formData.emailAddress,
            phoneNumber: formData.phoneNumber || "",
            reportId: formData.reportId || "",
            reportDescription: formData.briefDescription || "",
            reasonForDispute: apiReasonForDispute,
            supportingEvidence: evidenceFiles.map(file => file.uploadedUrl).filter(url => url) as string[],
            additionalInformation: formData.additionalNotes || "",
            platforms: selectedPlatforms,
            preferredContactMethod: contactMethod,
            vendorName: formData.vendorName || "",
            disputeDetails: formData.briefDescription || "",
            files: evidenceFiles.map(f => f.file)
        };

        try {
            if (onSubmit) {
                await onSubmit(submitData);
            } else {
                console.log('Form submitted locally:', submitData);
                // Fallback: Show success modal or handle locally
            }
        } catch (error) {
            console.error('Form submission error:', error);
            alert('Failed to submit dispute. Please try again.');
        }
    };

    // Clean up object URLs on unmount
    useEffect(() => {
        return () => {
            evidenceFiles.forEach(file => {
                URL.revokeObjectURL(file.previewUrl);
            });
        };
    }, [evidenceFiles]);

    return (
        <section className="py-16 px-6 bg-cloudwhite font-manrope">
            <div className="max-w-4xl mx-auto">
                {/* Header */}
                <div className="text-center mb-12">
                    <h1 className="text-3xl md:text-4xl lg:text-6xl font-semibold text-indigo mb-4">
                        Raise a Dispute
                    </h1>
                    <p className="text-base md:text-lg text-indigo leading-relaxed font-satoshi">
                        Think a report about your business is false or an impersonation?
                        Tell us your side and we'll investigate.
                    </p>
                </div>

                <form onSubmit={handleSubmit}>
                    {/* Section 1: Vendor Information */}
                    <div className="mb-12">
                        <h2 className="text-xl md:text-2xl font-semibold text-indigo mb-6">
                            <span className="">1. </span>
                            Business Information
                        </h2>

                        <div className="space-y-6">
                            <TextInput
                                label="Business Name *"
                                type="text"
                                placeholder="Enter your official business name"
                                value={formData.businessName}
                                onChange={(e) => handleInputChange("businessName", e.target.value)}
                                className="font-satoshi"
                                required
                            />


                        </div>
                    </div>

                    {/* Section 2: Select Dispute Reason */}
                    <div className="mb-12">
                        <h2 className="text-xl md:text-2xl font-semibold text-indigo mb-6">
                            <span className="">2. </span>
                            Select Dispute Reason *
                        </h2>

                        <div className="space-y-4 mb-6">
                            {disputeReasons.map((reason) => (
                                <label key={reason} className="flex items-center gap-3 cursor-pointer font-satoshi">
                                    <input
                                        type="radio"
                                        name="disputeReason"
                                        value={reason}
                                        checked={disputeReason === reason}
                                        onChange={(e) => {
                                            setDisputeReason(e.target.value);
                                            handleInputChange("reasonForDispute", e.target.value);
                                        }}
                                        className="w-4 h-4 accent-primary focus:ring-primary border-gray-300"
                                        required
                                    />
                                    <span className="text-gray font-satoshi">{reason}</span>
                                </label>
                            ))}
                        </div>

                        <div className="mb-6">
                            <label className="block mb-3 text-gray font-medium font-satoshi">Brief Description *</label>
                            <textarea
                                className="w-full h-32 p-3 bg-white rounded-lg focus:outline-none resize-none"
                                placeholder="Explain what happened in your own words (Max 400 characters)"
                                value={formData.briefDescription}
                                onChange={(e) => {
                                    handleInputChange("briefDescription", e.target.value);
                                    setDescriptionLength(e.target.value.length);
                                }}
                                maxLength={400}
                                required
                            />
                            <div className="text-right text-sm text-gray mt-1 font-satoshi">
                                {descriptionLength}/400
                            </div>
                        </div>

                        {/* Report ID/Reference Field */}
                        <div className="mb-6">
                            <TextInput
                                label="Report ID or Reference (Optional)"
                                type="text"
                                placeholder="Enter the report ID if available"
                                value={formData.reportId}
                                onChange={(e) => handleInputChange("reportId", e.target.value)}
                                className="font-satoshi"
                            />
                        </div>
                    </div>

                    {/* Section 3: Upload Supporting Evidence */}
                    <div className="mb-12">
                        <h2 className="text-xl md:text-2xl font-semibold text-indigo mb-6">
                            <span className="">3. </span>
                            Upload Supporting Evidence
                        </h2>

                        <div className="mb-6">
                            <label className="block mb-3 text-gray font-medium font-satoshi">
                                Upload Business Proof (CAC certificate, store screenshots, delivery records)
                                <span className="text-sm text-gray-500 ml-2">Max 25MB per file</span>
                            </label>

                            {/* Upload Errors */}
                            {uploadErrors.length > 0 && (
                                <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                                    {uploadErrors.map((error, index) => (
                                        <p key={index} className="text-red-600 text-sm mb-1">{error}</p>
                                    ))}
                                    <button
                                        type="button"
                                        onClick={() => setUploadErrors([])}
                                        className="text-red-600 text-sm hover:text-red-800"
                                    >
                                        Dismiss
                                    </button>
                                </div>
                            )}

                            <div className="flex gap-4 flex-wrap">
                                {evidenceFiles.map((file, index) => (
                                    <div key={index} className="relative w-40 h-40 bg-white rounded-lg flex items-center justify-center cursor-pointer transition-colors border border-gray-200">
                                        {file.file.type.startsWith('image/') ? (
                                            <Image
                                                src={file.previewUrl}
                                                alt={file.file.name}
                                                fill
                                                className="object-cover rounded-lg"
                                            />
                                        ) : (
                                            <div className="text-center p-4">
                                                <div className="text-gray-500 mb-2">
                                                    {file.file.name.split('.').pop()?.toUpperCase()}
                                                </div>
                                                <div className="text-xs text-gray-400 truncate">
                                                    {file.file.name}
                                                </div>
                                            </div>
                                        )}
                                        <button
                                            type="button"
                                            onClick={() => removeFile(index)}
                                            className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center hover:bg-red-600"
                                        >
                                            ×
                                        </button>
                                        {file.uploadError && (
                                            <div className="absolute bottom-0 left-0 right-0 bg-red-500 text-white text-xs p-1 text-center">
                                                Upload Failed
                                            </div>
                                        )}
                                    </div>
                                ))}

                                {evidenceFiles.length < 3 && (
                                    <label className="w-40 h-40 bg-white rounded-lg flex flex-col items-center justify-center cursor-pointer border-2 border-dashed border-gray-300 hover:border-primary transition-colors">
                                        <input
                                            type="file"
                                            multiple
                                            onChange={handleFileUpload}
                                            className="hidden"
                                            accept=".jpg,.jpeg,.png,.pdf,.mp4,.doc,.docx"
                                            disabled={isUploading}
                                        />
                                        <div className="text-gray-400 mb-2">
                                            <Image
                                                src="/assets/upload.svg"
                                                alt="Upload"
                                                width={20}
                                                height={20}
                                            />
                                        </div>
                                        <span className="text-sm text-gray-500 text-center px-2">
                                            {isUploading ? 'Uploading...' : 'Click to upload'}
                                        </span>
                                        <span className="text-xs text-gray-400 mt-1">
                                            Max 3 files
                                        </span>
                                    </label>
                                )}
                            </div>
                        </div>

                        <div>
                            <label className="block mb-3 text-gray font-medium font-satoshi">Additional Notes</label>
                            <textarea
                                className="w-full h-32 p-3 bg-white rounded-lg focus:outline-none resize-none"
                                placeholder="Add any additional information that might help us understand your situation (Max 400 characters)"
                                value={formData.additionalNotes}
                                onChange={(e) => {
                                    handleInputChange("additionalNotes", e.target.value);
                                    setNotesLength(e.target.value.length);
                                }}
                                maxLength={400}
                            />
                            <div className="text-right text-sm text-gray mt-1 font-satoshi">
                                {notesLength}/400
                            </div>
                        </div>
                    </div>

                    {/* Section 4: Business Owner Details */}
                    <div className="mb-12">
                        <h2 className="text-xl md:text-2xl font-semibold text-indigo mb-6">
                            <span className="">4. </span>
                            Contact Information *
                        </h2>

                        <div className="space-y-6">
                            <TextInput
                                label="Full Name *"
                                type="text"
                                placeholder="Enter your full name"
                                value={formData.fullName}
                                onChange={(e) => handleInputChange("fullName", e.target.value)}
                                className="font-satoshi"
                                required
                            />

                            <TextInput
                                label="Email Address *"
                                type="email"
                                placeholder="Enter your email address"
                                value={formData.emailAddress}
                                onChange={(e) => handleInputChange("emailAddress", e.target.value)}
                                className="font-satoshi"
                                required
                            />

                            <TextInput
                                label="Phone Number"
                                type="tel"
                                placeholder="Enter your phone number"
                                value={formData.phoneNumber}
                                onChange={(e) => handleInputChange("phoneNumber", e.target.value)}
                                className="font-satoshi"
                                required
                            />

                            <div>
                                <label className="block mb-3 text-indigo font-satoshi">Preferred Contact Method</label>
                                <div className="flex gap-6">
                                    <label className="flex items-center gap-2 cursor-pointer">
                                        <input
                                            type="radio"
                                            name="contactMethod"
                                            value="email"
                                            checked={contactMethod === "email"}
                                            onChange={(e) => setContactMethod(e.target.value)}
                                            className="w-4 h-4 accent-primary focus:ring-primary"
                                        />
                                        <span className="text-gray font-satoshi">Email</span>
                                    </label>
                                    <label className="flex items-center gap-2 cursor-pointer">
                                        <input
                                            type="radio"
                                            name="contactMethod"
                                            value="phone"
                                            checked={contactMethod === "phone"}
                                            onChange={(e) => setContactMethod(e.target.value)}
                                            className="w-4 h-4 accent-primary focus:ring-primary"
                                        />
                                        <span className="text-gray font-satoshi">Phone</span>
                                    </label>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Section 5: Agreement & Submit */}
                    <div>
                        <h2 className="text-xl md:text-2xl font-semibold text-indigo mb-6">
                            <span className="">5. </span>
                            Agreement & Submit *
                        </h2>

                        <div className="space-y-6">
                            <label className="flex items-start gap-3 cursor-pointer">
                                <CheckboxInput
                                    checked={agreement1}
                                    onCheckedChange={(checked) => setAgreement1(checked as boolean)}
                                    required
                                />
                                <div>
                                    <span className="text-gray font-medium font-satoshi">
                                        I confirm I am authorized to represent this business *
                                    </span>
                                </div>
                            </label>

                            <label className="flex items-start gap-3 cursor-pointer">
                                <CheckboxInput
                                    checked={agreement2}
                                    onCheckedChange={(checked) => setAgreement2(checked as boolean)}
                                    required
                                />
                                <div>
                                    <span className="text-gray font-medium font-satoshi">
                                        I understand this process may take 3-7 business days. *
                                    </span>
                                </div>
                            </label>

                            <Button
                                type="submit"
                                disabled={isSubmitting || isUploading}
                                className="bg-gradient-to-br from-[#575EFF] to-[#282D99] uppercase font-semibold text-lg w-full py-6 complex-gradient-border text-white mt-6 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {isSubmitting ? (
                                    <span className="flex items-center justify-center">
                                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                        SUBMITTING...
                                    </span>
                                ) : (
                                    'SUBMIT DISPUTE'
                                )}
                            </Button>
                        </div>
                    </div>
                </form>
            </div>
        </section>
    );
}