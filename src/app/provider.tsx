"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import React from "react";

const queryClient = new QueryClient();

function Providers({ children }: { children: React.ReactNode }) {
    return (
        <QueryClientProvider client={queryClient}>
            {children}
        </QueryClientProvider>
    );
}

export default Providers;


import { useEffect, useState } from 'react';
import { useSessionStore } from "@/stores/useSessionStore";

export const SessionInitializer = () => {
    const { initialize, isLoading } = useSessionStore();
    const [isInitializing, setIsInitializing] = useState(true);

    useEffect(() => {
        const initSession = async () => {
            console.log('SessionInitializer: Starting session initialization...');
            await initialize();
            setIsInitializing(false);
            console.log('SessionInitializer: Session initialization complete');
        };

        initSession();
    }, [initialize]);

    // You can show a loading state while initializing if needed
    if (isInitializing || isLoading) {
        return (
            <div className="fixed inset-0 flex items-center justify-center bg-white z-50">
                <div className="text-center">
                    <div className="w-8 h-8 border-2 border-[#1DADB0] border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
                    <p className="text-sm text-gray-600">Restoring session...</p>
                </div>
            </div>
        );
    }

    return null;
};