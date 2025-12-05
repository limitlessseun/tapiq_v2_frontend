'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSessionStore } from '@/stores/useSessionStore';

interface AuthGuardProps {
    children: React.ReactNode;
}

export default function AuthGuard({ children }: AuthGuardProps) {
    const { session, isLoading } = useSessionStore();
    const router = useRouter();

    useEffect(() => {
        if (!isLoading && !session) {
            router.push('/auth/login');
        }
    }, [session, isLoading, router]);

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="w-8 h-8 border-2 border-[#1DADB0] border-t-transparent rounded-full animate-spin"></div>
            </div>
        );
    }

    return session ? <>{children}</> : null;
}