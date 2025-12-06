import { z } from "zod";
export const SignInSchema = z.object({
    email: z.string().min(1, "Email is required").email("Enter a valid email"),
    password: z
        .string()
        .min(8, "Password must be at least 8 characters")
        .regex(/[A-Z]/, "Include at least one uppercase letter")
        .regex(/[a-z]/, "Include at least one lowercase letter")
        .regex(/[0-9]/, "Include at least one number"),
});

export const SignUpSchema = z
    .object({
        email: z.string().min(1, "Email is required").email("Enter a valid email"),
        firstName: z.string().min(1, "First name is required").max(50, "First name is too long"),
        lastName: z.string().min(1, "Last name is required").max(50, "Last name is too long"),
        password: z
            .string()
            .min(8, "Password must be at least 8 characters")
            .regex(/[A-Z]/, "Include at least one uppercase letter")
            .regex(/[a-z]/, "Include at least one lowercase letter")
            .regex(/[0-9]/, "Include at least one number"),
        confirmPassword: z.string().min(1, "Confirm your password"),
        phoneNumber: z.string().min(1, "Phone number is required").regex(/^\+?[1-9]\d{1,14}$/, "Enter a valid phone number"),
        gender: z.string().min(1, "Gender is required"),
        howYouHeardAboutUs: z.string().optional(),
        acceptTerms: z
            .boolean()
            .refine((v) => v === true, "You must accept the Terms & Conditions"),
    })
    .refine((data) => data.password === data.confirmPassword, {
        message: "Passwords do not match",
        path: ["confirmPassword"],
    });



export const ChangePasswordSchema = z.object({
    currentPassword: z.string().min(1, "Current password is required"),
    newPassword: z.string()
        .min(8, "Password must be at least 8 characters")
        .regex(/[A-Z]/, "Include at least one uppercase letter")
        .regex(/[a-z]/, "Include at least one lowercase letter")
        .regex(/[0-9]/, "Include at least one number"),
    confirmPassword: z.string().min(1, "Please confirm your password"),
}).refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
}).refine((data) => data.currentPassword !== data.newPassword, {
    message: "New password must be different from current password",
    path: ["newPassword"],
});

export type ChangePasswordValues = z.infer<typeof ChangePasswordSchema>;
export type SignUpValues = z.infer<typeof SignUpSchema>;
export type SignInValues = z.infer<typeof SignInSchema>;



export const reportFormSchema = z.object({
    // Step 1: About the Vendor (North America focused)
    businessOrVendorName: z.string().min(1, 'Vendor or business name is required'),

    // Payment Information (North America specific)
    paymentMethod: z.string().min(1, 'Payment method is required'),
    cryptoAddress: z.string().optional(),
    paymentContact: z.string().optional(), // For PayPal/Interac email/phone
    paymentAppId: z.string().optional(), // For CashApp/Zelle ID
    bankAccountDetails: z.string().optional(), // For Bank/Wire Transfer
    otherPaymentDescription: z.string().optional(), // For Other payment method

    // Contact Information
    phoneNumber: z.string().optional(),
    websiteOrListingLink: z.string().url('Please enter a valid URL').optional().or(z.literal('')),
    socialMediaHandles: z.array(z.string()).optional(),

    // Step 2: What Happened
    incidentCategory: z.string().min(1, 'Incident category is required'),
    incidentDate: z.string().min(1, 'Incident date is required'),
    amountLost: z.string().optional().transform(val => {
        if (!val) return '';
        const num = parseFloat(val);
        return isNaN(num) ? '' : val;
    }),
    description: z.string().min(10, 'Description must be at least 10 characters')
        .max(2000, 'Description cannot exceed 2000 characters'),

    // Resolution Attempt
    attemptedResolution: z.enum(['Yes', 'No']).optional(),
    resolutionSteps: z.string().optional(),

    // Step 3: Evidence
    evidenceFiles: z.array(z.object({
        fileName: z.string().min(1, 'File name is required'),
        url: z.string().url('Please enter a valid URL'),
        contentType: z.string().optional(),
        size: z.number().optional()
    })).optional(),

    // Step 4: Review & Consent
    userAffirmedDataAreTrue: z.boolean().refine(val => val === true, 'You must confirm the information is accurate'),
    anonymousReport: z.boolean().default(false),
});

// Conditional validation for payment methods
export const enhancedReportFormSchema = reportFormSchema.superRefine((data, ctx) => {
    // Crypto validation
    if (data.paymentMethod === 'Crypto' && !data.cryptoAddress) {
        ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: 'Crypto address is required',
            path: ['cryptoAddress'],
        });
    }

    // PayPal/Interac validation
    if ((data.paymentMethod === 'PayPal' || data.paymentMethod === 'Interac e-Transfer') && !data.paymentContact) {
        ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: 'Email or phone used for payment is required',
            path: ['paymentContact'],
        });
    }

    // CashApp/Zelle validation
    if ((data.paymentMethod === 'CashApp' || data.paymentMethod === 'Zelle') && !data.paymentAppId) {
        ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: `${data.paymentMethod} ID is required`,
            path: ['paymentAppId'],
        });
    }

    // Bank/Wire Transfer validation
    if ((data.paymentMethod === 'Bank Transfer' || data.paymentMethod === 'Wire Transfer') && !data.bankAccountDetails) {
        ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: 'Bank account details are required',
            path: ['bankAccountDetails'],
        });
    }

    // Other payment method validation
    if (data.paymentMethod === 'Other' && !data.otherPaymentDescription) {
        ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: 'Payment method description is required',
            path: ['otherPaymentDescription'],
        });
    }

    // Resolution steps validation if attempted resolution is Yes
    if (data.attemptedResolution === 'Yes' && !data.resolutionSteps) {
        ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: 'Please explain what steps you took to resolve',
            path: ['resolutionSteps'],
        });
    }
});

export type ReportFormData = z.infer<typeof reportFormSchema>;

// Step schemas for multi-step form validation
export const step1Schema = reportFormSchema.pick({
    businessOrVendorName: true,
    paymentMethod: true,
    cryptoAddress: true,
    paymentContact: true,
    paymentAppId: true,
    bankAccountDetails: true,
    otherPaymentDescription: true,
    phoneNumber: true,
    websiteOrListingLink: true,
    socialMediaHandles: true,
});

export const step2Schema = reportFormSchema.pick({
    incidentCategory: true,
    incidentDate: true,
    amountLost: true,
    description: true,
    attemptedResolution: true,
    resolutionSteps: true,
});

export const step3Schema = reportFormSchema.pick({
    evidenceFiles: true,
});

export const step4Schema = reportFormSchema.pick({
    userAffirmedDataAreTrue: true,
    anonymousReport: true,
});

// Optional: Create type-safe initial values
export const initialFormData: ReportFormData = {
    businessOrVendorName: '',
    paymentMethod: '',
    cryptoAddress: '',
    paymentContact: '',
    paymentAppId: '',
    bankAccountDetails: '',
    otherPaymentDescription: '',
    phoneNumber: '',
    websiteOrListingLink: '',
    socialMediaHandles: [],
    incidentCategory: '',
    incidentDate: '',
    amountLost: '',
    description: '',
    attemptedResolution: undefined,
    resolutionSteps: '',
    evidenceFiles: [],
    userAffirmedDataAreTrue: false,
    anonymousReport: false,
};

export interface ReportVendorResponse {
    id: string;
    reference: string;
    status: 'pending' | 'under_review' | 'resolved';
    createdAt: string;
}

export interface ReportVendorRequest {
    // Step 1: About the Vendor
    vendorInfo: {
        businessOrVendorName: string;

        // Payment Information (North America specific)
        paymentMethod: string;
        cryptoAddress?: string;
        paymentContact?: string; // For PayPal/Interac email/phone
        paymentAppId?: string; // For CashApp/Zelle ID
        bankAccountDetails?: string; // For Bank/Wire Transfer
        otherPaymentDescription?: string; // For Other payment method

        // Contact Information
        phoneNumber?: string;
        websiteOrListingLink?: string;
        socialMediaHandles?: string[];
    };

    // Step 2: What Happened
    incidentDetails: {
        incidentCategory: string;
        incidentDate: string;
        amountLost?: number;
        description: string;

        // Resolution Attempt
        attemptedResolution?: 'Yes' | 'No';
        resolutionSteps?: string;
    };

    // Step 3: Evidence
    evidenceFiles: Array<{
        fileName: string;
        url: string;
        contentType: string;
        size: number;
    }>;

    // Step 4: Review & Consent
    review: {
        userAffirmedDataAreTrue: boolean;
        anonymousReport: boolean;
    };
}
