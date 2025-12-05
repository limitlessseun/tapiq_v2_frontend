export interface NavLink {
    label: string;
    href: string;
    external?: boolean;
    onClick?: () => void;
}

export interface MessageAnalysisResult {
    verdict: 'Scam' | 'Safe';
    advice: string;
    indicators: string[];
    safetyTips: string[];
}

export interface VendorResult {
    businessName: string;
    bankAccountNumber: string;
    phoneNumber: string;
    bankName: string;
    socialMediaHandles: string;
    reportedDates: string[];
}

export interface StatItem {
    value: string;
    description: string;
    subDescription: string;
    color: string;
}

export interface StepItem {
    title: string;
    description: string;
    bgColor: string;
}