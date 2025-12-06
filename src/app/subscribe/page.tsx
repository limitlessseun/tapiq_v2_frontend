// app/subscribe/page.tsx
import { Suspense } from 'react';
import SubscribeSection from '@/components/subscribe/SubscribeSection';

export default function SubscribePage() {
    return (
        <Suspense fallback={
            <div className="min-h-screen bg-cloudWhite flex items-center justify-center">
                <div className="text-center">
                    <div className="w-16 h-16 border-4 border-indigo border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-gray font-satoshi">Loading subscription plans...</p>
                </div>
            </div>
        }>
            <SubscribeSection />
        </Suspense>
    );
}