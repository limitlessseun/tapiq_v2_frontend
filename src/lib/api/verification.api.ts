// lib/api/verification.api.ts
import axiosInstance from "@/lib/utils/axios";
import axios from "axios";

// Types for scan message
export interface ScanMessageRequest {
    messageContent: {
        text: string;
        platform?: string;
    };
    analysisParameters: {
        language: string;
        countryCode: string;
    };
}

export interface ScanMessageResponse {
    id: string;
    userId: string;
    scanId: string;
    messageContent: {
        text: string;
        platform: string;
        senderInfo: any | null;
    };
    riskAssessment: {
        riskScore: number;
        riskLevel: string;
        confidence: number;
    };
    verdict: string;
    redFlags: Array<{
        flag: string;
        description: string;
        severity: 'low' | 'medium' | 'high';
    }>;
    scamPredictions: Array<{
        type: string;
        likelihood: number;
    }>;
    recommendedActions: string[];
    explanation: string;
    createdAt: string;
}


export const singleFileUpload = async (file: File) => {
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

    return response;
};

// API Functions
export const scanMessage = async (requestData: ScanMessageRequest): Promise<ScanMessageResponse> => {
    try {
        const { data } = await axiosInstance.post('/scan', requestData);
        return data;
    } catch (error: any) {
        throw error;
    }
};

// lib/api/verification.api.ts
export interface VendorSearchResponse {
    searchQuery: string;
    totalMatches: number;
    results: VendorResult[];
    resultType: 'basic' | 'premium';
}

export interface VendorResult {
    businessName: string;
    bankName: string;
    accountNumber: string;
    phoneNumber: string;
    status: 'under_review' | 'confirmed' | 'resolved';
    riskLevel: 'Low' | 'Medium' | 'High' | 'Critical';
    fraudScore: number;
    linkedVendors: number;
    reportsCount: number;
    evidenceStrength: 'Low' | 'Medium' | 'High';
    trend: 'Accelerating' | 'Stable' | 'Declining';
    patterns: {
        commonScam: string;
        paymentChannels: string[];
        keywords: string[];
    };
}

export const searchVendors = async (searchQuery: string): Promise<VendorSearchResponse> => {
    try {
        const { data } = await axiosInstance.get(`/vendor/search/premium?q=${encodeURIComponent(searchQuery)}`);
        return data;
    } catch (error: any) {
        throw error;
    }
};

import { ReportFormData, ReportVendorResponse, ReportVendorRequest } from '@/lib/schema/schema';

export const reportVendor = async (data: ReportFormData): Promise<ReportVendorResponse> => {
    try {
        // Transform form data to match API format using the transformer function
        const requestData: ReportVendorRequest = {
            vendorInfo: {
                businessOrVendorName: data.businessOrVendorName,
                paymentMethod: data.paymentMethod,
                cryptoAddress: data.cryptoAddress || undefined,
                paymentContact: data.paymentContact || undefined,
                paymentAppId: data.paymentAppId || undefined,
                bankAccountDetails: data.bankAccountDetails || undefined,
                otherPaymentDescription: data.otherPaymentDescription || undefined,
                phoneNumber: data.phoneNumber || undefined,
                websiteOrListingLink: data.websiteOrListingLink || undefined,
                socialMediaHandles: data.socialMediaHandles || []
            },
            incidentDetails: {
                incidentCategory: data.incidentCategory,
                incidentDate: data.incidentDate,
                amountLost: data.amountLost ? parseFloat(data.amountLost) : undefined,
                description: data.description,
                attemptedResolution: data.attemptedResolution,
                resolutionSteps: data.resolutionSteps || undefined
            },
            evidenceFiles: (data.evidenceFiles || []).map(file => ({
                fileName: file.fileName,
                url: file.url,
                contentType: file.contentType ?? '',
                size: file.size ?? 0
            })),
            review: {
                userAffirmedDataAreTrue: data.userAffirmedDataAreTrue,
                anonymousReport: data.anonymousReport || false
            }
        };

        // Remove undefined values from the request
        const cleanRequestData = JSON.parse(JSON.stringify(requestData));

        console.log('Submitting report:', cleanRequestData);

        const { data: response } = await axiosInstance.post('/vendor/report', cleanRequestData);
        return response;
    } catch (error: any) {
        console.error('Report submission error:', error);
        throw error;
    }
};



