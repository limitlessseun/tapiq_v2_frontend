import axiosInstance from "@/lib/utils/axios";
import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";

interface Subscription {
    id: string;
    name: string;
    price: number;
    includedCredits: number;
    overageRate: number;
    isActive: boolean;
    createdAt: string;
    updatedAt: string;
}

interface User {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    phoneNumber: string;
    gender: string;
    createdAt: string;
    lastLogin: string;
    creditBalance: number;
    isAdmin: boolean;
    // Fields from /user/me endpoint
    dailyUsage: number;
    monthlyUsage: number;
    dailyLimit: number;
    monthlyLimit: number;
    subscription: Subscription | null;
    name: string;
    emailVerified: boolean;
    avatarUrl: string | null;
    roles: string[];
    provider: string;
    providerId: string;
}

interface SessionData {
    user: User;
    expires: string;
    accessToken: string;
    refreshToken: string | null;
}

interface SessionState {
    session: SessionData | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    lastSync: string | null;
    setSession: (session: SessionData | null) => void;
    clearSession: () => void;
    refreshSession: () => Promise<void>;
    updateUser: (user: Partial<User>) => void;
    refreshTokens: (tokens: {
        accessToken: string;
        refreshToken: string | null;
    }) => void;
    checkTokenExpiry: () => boolean;
    syncUserProfile: () => Promise<void>;
    initialize: () => void;
    forceSync: () => Promise<void>;
}

// Migration function to handle state version changes
const migrateSessionState = (persistedState: any, version: number): Partial<SessionState> => {
    console.log('Migrating session store from version:', version);

    // If no version exists or version is 0, it's from an older store
    if (version === 0 || !persistedState) {
        console.log('Migrating from version 0 or no state');
        return {
            session: persistedState?.session || null,
            isAuthenticated: persistedState?.isAuthenticated || false,
            isLoading: false,
            lastSync: null,
        };
    }

    // For version 1, ensure all fields exist with proper defaults
    if (version === 1) {
        console.log('Migrating version 1 state');
        return {
            session: persistedState.session || null,
            isAuthenticated: persistedState.isAuthenticated || false,
            isLoading: persistedState.isLoading || false,
            lastSync: persistedState.lastSync || null,
        };
    }

    // For future versions, add more cases as needed
    console.log('No migration needed for version:', version);
    return persistedState;
};

export const useSessionStore = create<SessionState>()(
    devtools(
        persist(
            (set, get) => ({
                session: null,
                isAuthenticated: false,
                isLoading: false,
                lastSync: null,

                initialize: () => {
                    set({ isLoading: true });
                    const state = get();
                    console.log('Initializing session store...');

                    try {
                        if (!state.session) {
                            console.log('No session found in storage');
                            return;
                        }

                        // Check if token is expired with a grace period
                        const expiryTime = new Date(state.session.expires);
                        const now = new Date();
                        const gracePeriod = 5 * 60 * 1000; // 5 minutes grace period

                        const isExpired = now > new Date(expiryTime.getTime() - gracePeriod);

                        if (isExpired) {
                            console.log('Token expired or near expiry, clearing session');
                            get().clearSession();
                        } else {
                            console.log('Session restored from storage, expires at:', expiryTime);
                            // Auto-sync user profile on initialization if session exists
                            setTimeout(() => {
                                get().syncUserProfile();
                            }, 1000);
                        }
                    } catch (error) {
                        console.error('Error during session initialization:', error);
                        get().clearSession();
                    } finally {
                        set({ isLoading: false });
                    }
                },

                setSession: (session: SessionData | null) => {
                    console.log('Setting session:', session);
                    set({
                        session,
                        isAuthenticated: !!session,
                        lastSync: session ? new Date().toISOString() : null,
                    });
                },

                clearSession: () => {
                    console.log('Clearing session');
                    set({
                        session: null,
                        isAuthenticated: false,
                        isLoading: false,
                        lastSync: null,
                    });
                },

                refreshSession: async () => {
                    try {
                        const state = get();
                        if (!state.session) {
                            console.log('No session to refresh');
                            return;
                        }

                        set({ isLoading: true });

                        // Call /user/me to get latest user data
                        const response = await axiosInstance.get('/user/me');
                        const userData = response.data;

                        console.log('Refreshed user data from /user/me:', userData);

                        // Update session with fresh user data
                        set((state) => ({
                            session: state.session ? {
                                ...state.session,
                                user: {
                                    ...state.session.user,
                                    ...userData,
                                    // Ensure all fields are properly merged
                                    id: userData.id || state.session.user.id,
                                    email: userData.email || state.session.user.email,
                                    creditBalance: userData.creditBalance ?? state.session.user.creditBalance,
                                    subscription: userData.subscription || state.session.user.subscription,
                                    dailyUsage: userData.dailyUsage ?? state.session.user.dailyUsage,
                                    monthlyUsage: userData.monthlyUsage ?? state.session.user.monthlyUsage,
                                    dailyLimit: userData.dailyLimit ?? state.session.user.dailyLimit,
                                    monthlyLimit: userData.monthlyLimit ?? state.session.user.monthlyLimit,
                                    name: userData.name || state.session.user.name,
                                    emailVerified: userData.emailVerified ?? state.session.user.emailVerified,
                                    avatarUrl: userData.avatarUrl ?? state.session.user.avatarUrl,
                                    roles: userData.roles || state.session.user.roles,
                                    provider: userData.provider || state.session.user.provider,
                                    providerId: userData.providerId || state.session.user.providerId,
                                }
                            } : null,
                            lastSync: new Date().toISOString(),
                        }));

                    } catch (error: any) {
                        console.error('Failed to refresh session:', error);

                        // If unauthorized, clear session
                        if (error.response?.status === 401) {
                            get().clearSession();
                        }
                    } finally {
                        set({ isLoading: false });
                    }
                },

                updateUser: (user: Partial<User>) =>
                    set((state) => ({
                        session: state.session
                            ? {
                                ...state.session,
                                user: {
                                    ...state.session.user,
                                    ...user,
                                },
                            }
                            : null,
                        lastSync: new Date().toISOString(),
                    })),

                refreshTokens: (tokens: {
                    accessToken: string;
                    refreshToken: string | null;
                }) =>
                    set((state) => ({
                        session: state.session
                            ? {
                                ...state.session,
                                accessToken: tokens.accessToken,
                                refreshToken: tokens.refreshToken,
                                expires: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
                            }
                            : null,
                    })),

                checkTokenExpiry: () => {
                    const state = get();
                    if (!state.session) return true;

                    const isExpired = new Date() > new Date(state.session.expires);
                    if (isExpired) {
                        console.log('Token expired in check');
                        get().clearSession();
                    }
                    return isExpired;
                },

                syncUserProfile: async () => {
                    const state = get();
                    if (!state.session) {
                        console.log('No session to sync');
                        return;
                    }

                    // Check if we synced recently (within last 30 seconds)
                    const lastSync = state.lastSync ? new Date(state.lastSync) : null;
                    const now = new Date();
                    if (lastSync && (now.getTime() - lastSync.getTime() < 30000)) {
                        console.log('Skipping sync - recently synced');
                        return;
                    }

                    try {
                        set({ isLoading: true });

                        const response = await axiosInstance.get('/user/me');
                        const userData = response.data;

                        console.log('Syncing user profile from /user/me:', userData);

                        // Update the user data in session
                        set((state) => ({
                            session: state.session ? {
                                ...state.session,
                                user: {
                                    ...state.session.user,
                                    ...userData,
                                    // Ensure critical fields are preserved
                                    id: userData.id || state.session.user.id,
                                    email: userData.email || state.session.user.email,
                                }
                            } : null,
                            lastSync: new Date().toISOString(),
                        }));

                    } catch (error: any) {
                        console.error('Error syncing user profile:', error);

                        // If unauthorized, clear session
                        if (error.response?.status === 401) {
                            get().clearSession();
                        }
                    } finally {
                        set({ isLoading: false });
                    }
                },

                forceSync: async () => {
                    const state = get();
                    if (!state.session) {
                        console.log('No session to force sync');
                        return;
                    }

                    try {
                        set({ isLoading: true });

                        const response = await axiosInstance.get('/user/me');
                        const userData = response.data;

                        console.log('Force syncing user profile:', userData);

                        set((state) => ({
                            session: state.session ? {
                                ...state.session,
                                user: {
                                    ...state.session.user,
                                    ...userData,
                                    id: userData.id || state.session.user.id,
                                    email: userData.email || state.session.user.email,
                                }
                            } : null,
                            lastSync: new Date().toISOString(),
                        }));

                    } catch (error: any) {
                        console.error('Error force syncing user profile:', error);
                        if (error.response?.status === 401) {
                            get().clearSession();
                        }
                        throw error; // Re-throw so caller can handle
                    } finally {
                        set({ isLoading: false });
                    }
                },
            }),
            {
                name: "session-storage",
                partialize: (state) => ({
                    session: state.session,
                    isAuthenticated: state.isAuthenticated,
                    lastSync: state.lastSync,
                }),
                version: 1,
                migrate: migrateSessionState,

                onRehydrateStorage: () => (state, error) => {
                    if (error) {
                        console.error('Error rehydrating session store:', error);
                        if (typeof window !== 'undefined') {
                            localStorage.removeItem('session-storage');
                        }
                    } else {
                        console.log('Session store rehydrated successfully');
                        if (state) {
                            state.initialize();
                        }
                    }
                },
            }
        ),
        {
            name: "session-store",
        }
    )
);

// Utility function to clear persisted store
export const clearSessionStore = () => {
    if (typeof window !== 'undefined') {
        localStorage.removeItem('session-storage');
        sessionStorage.removeItem('session-storage');
    }
};

// Utility function to get store state (for debugging)
export const getSessionStoreState = () => {
    if (typeof window !== 'undefined') {
        try {
            const stored = localStorage.getItem('session-storage');
            return stored ? JSON.parse(stored) : null;
        } catch (error) {
            console.error('Error reading session store:', error);
            return null;
        }
    }
    return null;
};

// Utility function to check store health
export const checkSessionStoreHealth = () => {
    const state = getSessionStoreState();
    if (!state) {
        console.log('No session store state found');
        return { healthy: false, reason: 'No state' };
    }

    if (state.state?.session) {
        const expiryTime = new Date(state.state.session.expires);
        const now = new Date();
        const isExpired = now > expiryTime;

        return {
            healthy: !isExpired,
            reason: isExpired ? 'Token expired' : 'Healthy',
            expires: expiryTime,
            now: now,
            lastSync: state.state.lastSync,
        };
    }

    return { healthy: true, reason: 'No session' };
};

// Hook for using session data with automatic syncing
export const useUser = () => {
    const { session, syncUserProfile, forceSync } = useSessionStore();

    return {
        user: session?.user || null,
        syncUserProfile,
        forceSync,
        // Helper computed properties
        hasActiveSubscription: !!session?.user?.subscription?.isActive,
        remainingCredits: session?.user?.creditBalance || 0,
        subscriptionTier: session?.user?.subscription?.name || 'Free',
        isAdmin: session?.user?.isAdmin || false,
        dailyUsage: session?.user?.dailyUsage || 0,
        dailyLimit: session?.user?.dailyLimit || 0,
        monthlyUsage: session?.user?.monthlyUsage || 0,
        monthlyLimit: session?.user?.monthlyLimit || 0,
    };
};