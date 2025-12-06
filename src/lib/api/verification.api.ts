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

// types/vendor.types.ts

// Base vendor interface for non-premium response
export interface BasicVendorInfo {
    businessName: string;
    bankName: string;
    accountNumber: string;
    phoneNumber: string;
    socialMediaHandle?: string;
    platform?: string;
    evidenceStrength: string;
    fraudScore: number;
    linkedVendors: number;
    patterns: {
        commonScam: string;
        paymentChannels: string[];
        keywords: string[];
    };
    reportsCount: number;
    riskLevel: string;
    status: string;
    trend: string;
}

// Full premium response
export interface VendorSearchResponse {
    // Basic info (exists in both)
    pageTitle?: string;
    businessInfo?: {
        businessName: string;
        bankName: string;
        accountNumber?: string;
        phoneNumber: string;
        socialMediaHandle?: string;
        platform?: string;
        email?: string;
        location?: string;
        registrationNumber?: string;
    };

    // Basic data (non-premium)
    businessName?: string;
    bankName?: string;
    accountNumber?: string;
    phoneNumber?: string;
    socialMediaHandle?: string;
    platform?: string;
    evidenceStrength?: string;
    fraudScore?: number;
    linkedVendors?: number;
    patterns?: {
        commonScam: string;
        paymentChannels: string[];
        keywords: string[];
    };
    reportsCount?: number;
    riskLevel?: string;
    status?: string;
    trend?: string;

    // Premium data (only for premium users)
    riskAssessment?: {
        level: string;
        score: number;
        category: string;
        description: string;
    };
    fraudScoreBreakdown?: {
        reportFrequencyScore: number;
        severityScore: number;
        evidenceStrengthScore: number;
        paymentRiskScore: number;
        total: number;
        explanation: string;
    };
    verificationStatus?: {
        status: string;
        message: string;
        icon: string;
        color: string;
    };
    contactVerification?: Array<{
        type: string;
        status: string;
        icon: string;
        class: string;
        description: string;
    }>;
    paymentIntelligence?: {
        mostReportedBank: string;
        walletReusedAcrossMultipleReports: boolean;
        reusedWalletReportCount: number;
        isBlacklistedBankAccount: boolean;
        suspiciousActivity: string;
    };
    timelineAnalysis?: {
        reportsLast7Days: number;
        reportsLast30Days: number;
        reportsLast90Days: number;
        trend: string;
        firstReportDate: string;
        latestReportDate: string;
        fastestIncreasePeriod: string;
    };
    linkedEntities?: {
        linkedVendorsCount: number;
        linkedVendorNames: string[];
        sharedIndicators: string[];
        networkRisk: string;
    };
    metadata?: {
        searchQuery: string;
        searchTimestamp: string;
        dataSources: string[];
        confidenceScore: number;
        lastUpdated: string;
    };
    severityProfile?: {
        low: number;
        medium: number;
        high: number;
        critical: number;
        totalReports: number;
    };
    importantNotice?: {
        title: string;
        content: string;
        disclaimer: string;
    };
}

// Helper type guard
export const isPremiumResponse = (data: VendorSearchResponse): boolean => {
    return !!data.riskAssessment || !!data.metadata || !!data.verificationStatus;
};

// For backward compatibility
export interface VendorResult extends VendorSearchResponse {
    // Legacy fields for components expecting the old structure
    businessName?: string;
    bankName?: string;
    accountNumber?: string;
    phoneNumber?: string;
    socialMediaHandle?: string;
    platform?: string;
    status?: string;
    riskLevel?: string;
    reportsCount?: number;
    fraudScore?: number;
    evidenceStrength?: string;
    linkedVendors?: number;
    trend?: string;
}
// src/lib/api/search.api.ts
export const searchVendors = async (
    searchQuery: string,
    currentSubscription?: string
): Promise<VendorSearchResponse> => {
    try {
        let endpoint = '';

        switch (currentSubscription) {
            case 'Pro':
                endpoint = `/vendor/${encodeURIComponent(searchQuery)}/premium`;
                break;
            case 'Enterprise':
                endpoint = `/vendor/${encodeURIComponent(searchQuery)}/premium`;
                break;
            case 'Basic':
                // Assuming searchQuery is a Bitcoin address for basic tier
                endpoint = `/vendor/${encodeURIComponent(searchQuery)}`;
                break;
            case 'Free':
            default:
                endpoint = `/vendor/${encodeURIComponent(searchQuery)}`;
                break;
        }

        const { data } = await axiosInstance.get(endpoint);
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
            Id: data.Id,
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



