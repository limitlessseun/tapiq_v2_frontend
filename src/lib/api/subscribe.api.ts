import axiosInstance from "@/lib/utils/axios";

export interface Subscription {
    id: string;
    name: string;
    price: number;
    includedCredits: number;
    overageRate: number;
    isActive: boolean;
    createdAt: string;
    updatedAt: string;
}

export interface SubscribeRequest {
    subscriptionId: string;
}

export interface SubscribeResponse {
    id: string;
    userId: string;
    subscriptionId: string;
    status: 'active' | 'inactive' | 'canceled';
    currentPeriodStart: string;
    currentPeriodEnd: string;
    creditBalance: number;
    subscription: Subscription;
}

// Get all available subscriptions
export const getSubscriptions = async (): Promise<Subscription[]> => {
    try {
        const { data } = await axiosInstance.get('/subscription');
        return data;
    } catch (error: any) {
        throw error;
    }
};

// Subscribe to a plan
export const subscribeToPlan = async (subscriptionId: string): Promise<SubscribeResponse> => {
    try {
        const { data } = await axiosInstance.post('/subscription/subscribe', {
            subscriptionId
        });
        return data;
    } catch (error: any) {
        throw error;
    }
};

// Add to lib/api/subscription.ts

export interface Transaction {
    id: string;
    userId: string;
    type: string;
    amount: number;
    credits: number;
    description: string;
    createdAt: string;
}

// Get user transaction history
export const getTransactionHistory = async (): Promise<Transaction[]> => {
    try {
        const { data } = await axiosInstance.get('/user/transactions');
        return data;
    } catch (error: any) {
        throw error;
    }
};

export interface PurchaseCreditsRequest {
    credits: number;
}

export interface PurchaseCreditsResponse {
    message: string;
    newBalance: number;
}

export const purchaseCredits = async (data: PurchaseCreditsRequest): Promise<PurchaseCreditsResponse> => {
    try {
        const { data: responseData } = await axiosInstance.post('/user/credits/purchase', data);
        return responseData;
    } catch (error: any) {
        throw error;
    }
};