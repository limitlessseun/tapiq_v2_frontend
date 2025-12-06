'use client';

import Link from 'next/link';
import { Shield, CheckCircle, Zap, CreditCard, ChevronRight } from "lucide-react";
import { useSearchParams } from 'next/navigation';
import { useEffect, useState, useRef } from 'react';
import { purchaseCredits } from '@/lib/api/subscribe.api';
import { useSessionStore } from '@/stores/useSessionStore';
import { Button } from '@/components/ui/button';

interface CheckoutSessionData {
    planName: string;
    planId: string;
    amount: number;
    credits: number;
    productType: 'subscription' | 'credits';
}

export default function PaymentSuccess() {
    const searchParams = useSearchParams();
    const { refreshSession } = useSessionStore();
    const [planName, setPlanName] = useState<string>('');
    const [credits, setCredits] = useState<number>(0);
    const [productType, setProductType] = useState<'subscription' | 'credits'>('subscription');
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [amount, setAmount] = useState<number>(0);

    // Refs to prevent multiple executions
    const isProcessingRef = useRef(false);
    const hasProcessedRef = useRef(false);

    useEffect(() => {
        // Skip if already processing or has already processed
        if (isProcessingRef.current || hasProcessedRef.current) {
            setIsLoading(false);
            return;
        }

        const processPaymentSuccess = async () => {
            isProcessingRef.current = true;

            try {
                const sessionId = searchParams?.get('session_id');
                const planId = searchParams?.get('plan_id');
                const creditsParam = searchParams?.get('credits');
                const amountParam = searchParams?.get('amount');
                const type = searchParams?.get('type') as 'subscription' | 'credits';

                console.log('Payment success loaded with params:', {
                    sessionId,
                    planId,
                    credits: creditsParam,
                    amount: amountParam,
                    type
                });

                // Handle credit purchases
                if (type === 'credits' && creditsParam) {
                    const creditsAmount = parseInt(creditsParam);
                    const processKey = `processed_credits_${creditsAmount}_${sessionId || planId || 'default'}`;

                    // Check if we've already processed this purchase
                    if (sessionStorage.getItem(processKey)) {
                        console.log('Purchase already processed, skipping...');
                        setProductType('credits');
                        setCredits(creditsAmount);
                        if (amountParam) setAmount(parseFloat(amountParam) / 100);
                        setIsLoading(false);
                        return;
                    }

                    setProductType('credits');
                    setCredits(creditsAmount);

                    if (amountParam) {
                        setAmount(parseFloat(amountParam) / 100);
                    }

                    try {
                        // Mark as processing immediately
                        sessionStorage.setItem(processKey, 'processing');

                        await purchaseCredits({ credits: creditsAmount });
                        console.log('Credits purchased successfully:', creditsAmount);

                        // Mark as completed
                        sessionStorage.setItem(processKey, 'completed');
                        await refreshSession();
                    } catch (creditError: any) {
                        console.error('Failed to add credits:', creditError);
                        // Remove processing flag on error
                        sessionStorage.removeItem(processKey);
                    }

                    // Clean up URL parameters
                    const newUrl = window.location.pathname;
                    window.history.replaceState({}, '', newUrl);
                    hasProcessedRef.current = true;
                    setIsLoading(false);
                    isProcessingRef.current = false;
                    return;
                }

                // Handle subscription purchases
                if (!sessionId && !planId) {
                    setError('No session or plan information found');
                    setIsLoading(false);
                    isProcessingRef.current = false;
                    return;
                }

                // Check if subscription already processed
                const subProcessKey = `processed_sub_${sessionId || planId}`;
                if (sessionStorage.getItem(subProcessKey)) {
                    console.log('Subscription already processed, skipping API call');
                    // Just update UI with URL params
                    const fallbackPlan = searchParams?.get('plan') || 'Your';
                    const creditsParam = searchParams?.get('credits');
                    setPlanName(fallbackPlan);
                    if (creditsParam) setCredits(parseInt(creditsParam));
                    setIsLoading(false);
                    isProcessingRef.current = false;
                    return;
                }

                // Fetch checkout session details
                sessionStorage.setItem(subProcessKey, 'processing');
                const response = await fetch(`/api/checkout-session${sessionId ? `?sessionId=${sessionId}` : `?planId=${planId}`}`);

                if (!response.ok) {
                    throw new Error('Failed to fetch checkout session details');
                }

                const sessionData: CheckoutSessionData = await response.json();

                setPlanName(sessionData.planName);
                setCredits(sessionData.credits || 0);
                setProductType(sessionData.productType || 'subscription');
                setAmount(sessionData.amount / 100);

                // Mark as completed
                sessionStorage.setItem(subProcessKey, 'completed');

                // Clean up URL parameters
                const newUrl = window.location.pathname;
                window.history.replaceState({}, '', newUrl);

            } catch (err) {
                console.error('Error processing payment success:', err);
                setError('Failed to load purchase details');

                // Fallback to URL parameters if API fails
                const fallbackPlan = searchParams?.get('plan') || 'Your';
                const creditsParam = searchParams?.get('credits');
                const type = searchParams?.get('type') as 'subscription' | 'credits';
                const amountParam = searchParams?.get('amount');

                setPlanName(fallbackPlan);
                setProductType(type || 'subscription');

                if (creditsParam) {
                    setCredits(parseInt(creditsParam));
                }

                if (amountParam) {
                    setAmount(parseFloat(amountParam) / 100);
                }
            } finally {
                setIsLoading(false);
                isProcessingRef.current = false;
                hasProcessedRef.current = true;
            }
        };

        processPaymentSuccess();

        // Cleanup function
        return () => {
            // Reset processing flag if component unmounts before completion
            if (isProcessingRef.current) {
                isProcessingRef.current = false;
            }
        };
    }, [searchParams, refreshSession]);

    // Clear processing flags when user leaves the page
    useEffect(() => {
        const handleBeforeUnload = () => {
            // Clear all processing flags on page unload
            Object.keys(sessionStorage).forEach(key => {
                if (key.startsWith('processed_')) {
                    sessionStorage.removeItem(key);
                }
            });
        };

        window.addEventListener('beforeunload', handleBeforeUnload);
        return () => window.removeEventListener('beforeunload', handleBeforeUnload);
    }, []);

    if (isLoading) {
        return (
            <div className="min-h-screen bg-cloudWhite flex items-center justify-center">
                <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8 text-center max-w-md mx-4">
                    <div className="w-16 h-16 border-4 border-indigo border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-gray font-satoshi">
                        {productType === 'credits' ? 'Adding credits to your account...' : 'Finalizing your subscription...'}
                    </p>
                </div>
            </div>
        );
    }

    if (error && !planName && !credits) {
        return (
            <div className="min-h-screen bg-cloudWhite flex items-center justify-center">
                <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8 text-center max-w-md mx-4">
                    <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-red-100 flex items-center justify-center border-2 border-red-200">
                        <svg className="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                    </div>
                    <h2 className="text-2xl font-bold text-indigo mb-4 font-satoshi">Something went wrong</h2>
                    <p className="text-gray mb-6 font-satoshi">{error}</p>
                    <Link href="/subscribe/dashboard">
                        <Button
                            className="w-full bg-gradient-to-br from-[#575EFF] to-[#282D99] uppercase font-semibold text-base py-3"
                        >
                            Go to Dashboard
                        </Button>
                    </Link>
                </div>
            </div>
        );
    }

    const isCreditPurchase = productType === 'credits';
    const displayAmount = amount > 0 ? amount : null;

    return (
        <div className="min-h-screen bg-cloudWhite p-4 md:p-6">
            {/* Main Content */}
            <div className="container mx-auto pt-8">
                <div className="max-w-2xl mx-auto">
                    <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 md:p-8 text-center">
                        {/* Success Icon */}
                        <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-gradient-to-br from-green-100 to-teal/10 flex items-center justify-center border-2 border-green-200">
                            <CheckCircle className="w-10 h-10 text-green-500" />
                        </div>

                        {/* Product Badge */}
                        <div className="inline-flex items-center gap-2 bg-gradient-to-r from-indigo/10 to-teal/10 text-indigo px-4 py-2 rounded-full mb-4 border border-indigo/20">
                            {isCreditPurchase ? (
                                <CreditCard className="w-4 h-4" />
                            ) : (
                                <Zap className="w-4 h-4" />
                            )}
                            <span className="font-semibold text-sm font-satoshi">
                                {isCreditPurchase ? `${credits} Credits Purchased` : `${planName} Plan Activated`}
                            </span>
                        </div>

                        {/* Success Message */}
                        <h1 className="text-3xl font-bold text-indigo mb-4 font-satoshi">
                            Payment Successful! 🎉
                        </h1>

                        {isCreditPurchase ? (
                            <p className="text-gray mb-8 text-lg leading-relaxed font-satoshi">
                                Thank you for your purchase! <span className="font-semibold text-teal">{credits.toLocaleString()} verification credits</span> have been added to your account and are ready to use.
                            </p>
                        ) : (
                            <p className="text-gray mb-8 text-lg leading-relaxed font-satoshi">
                                Thank you for choosing TapIQ. Your <span className="font-semibold text-teal">{planName}</span> subscription is now active and you can start verifying vendors with confidence.
                            </p>
                        )}

                        {/* Order Summary */}
                        <div className="bg-cloudWhite rounded-xl p-6 mb-8 border border-gray-200">
                            <h3 className="font-semibold text-indigo mb-4 font-satoshi">Order Summary</h3>
                            <div className="space-y-4">
                                {displayAmount && (
                                    <div className="flex justify-between items-center">
                                        <span className="text-gray font-satoshi">Amount Paid:</span>
                                        <span className="text-xl font-bold text-teal font-satoshi">
                                            ${displayAmount.toFixed(2)}
                                        </span>
                                    </div>
                                )}

                                <div className="flex justify-between items-center">
                                    <span className="text-gray font-satoshi">
                                        {isCreditPurchase ? 'Credits Added:' : 'Monthly Credits:'}
                                    </span>
                                    <span className="text-3xl font-bold text-teal font-satoshi">
                                        {credits.toLocaleString()}
                                    </span>
                                </div>

                                <div className="flex justify-between items-center text-sm">
                                    <span className="text-gray-500 font-satoshi">Status:</span>
                                    <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-xs font-semibold">
                                        Active ✓
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Success Checklist */}
                        <div className="bg-gradient-to-br from-green-50 to-teal/5 border border-green-200 rounded-xl p-4 md:p-6 mb-8">
                            <h4 className="font-semibold text-green-800 mb-4 font-satoshi">What's Ready for You:</h4>
                            <div className="space-y-3">
                                {[
                                    { text: 'Payment confirmed and processed', icon: '✓' },
                                    isCreditPurchase
                                        ? { text: `${credits.toLocaleString()} credits added to balance`, icon: '✓' }
                                        : { text: `${planName} plan fully activated`, icon: '✓' },
                                    { text: 'Ready to use immediately', icon: '✓' },
                                    isCreditPurchase
                                        ? { text: 'Start scanning messages', icon: '→' }
                                        : { text: 'Access to all plan features', icon: '→' },
                                    { text: 'Priority customer support', icon: '→' },
                                ].map((item, index) => (
                                    <div key={index} className="flex items-center space-x-3">
                                        <div className={`w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 ${item.icon === '✓' ? 'bg-green-100 text-green-600' : 'bg-indigo/10 text-indigo'
                                            }`}>
                                            {item.icon}
                                        </div>
                                        <span className={`text-sm font-satoshi ${item.icon === '✓' ? 'text-green-800' : 'text-gray-700'
                                            }`}>
                                            {item.text}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="space-y-4 mb-8">
                            <Link href="/subscribe/dashboard">
                                <Button
                                    className="w-full bg-gradient-to-br from-[#575EFF] to-[#282D99] uppercase font-semibold text-base py-4"
                                >
                                    Go to Dashboard
                                </Button>
                            </Link>
                            {isCreditPurchase ? (
                                <Link href="/scan">
                                    <Button

                                        variant="outline"
                                        className="w-full uppercase font-semibold text-sm py-4"
                                        style={{
                                            border: "1px solid",
                                            borderImage: `
                                            linear-gradient(180deg, rgba(255, 255, 255, 0.8) -25.96%, rgba(255, 255, 255, 0) 100%),
                                            linear-gradient(270deg, rgba(255, 255, 255, 0) 12.54%, rgba(255, 255, 255, 0.8) 47.67%, rgba(255, 255, 255, 0) 82.8%)
                                            1
                                        `,
                                        }}
                                    >
                                        Start Scanning Messages
                                    </Button>
                                </Link>
                            ) : (
                                <Link href="/report-vendor">
                                    <Button

                                        variant="outline"
                                        className="w-full uppercase font-semibold text-sm py-4"
                                        style={{
                                            border: "1px solid",
                                            borderImage: `
                                            linear-gradient(180deg, rgba(255, 255, 255, 0.8) -25.96%, rgba(255, 255, 255, 0) 100%),
                                            linear-gradient(270deg, rgba(255, 255, 255, 0) 12.54%, rgba(255, 255, 255, 0.8) 47.67%, rgba(255, 255, 255, 0) 82.8%)
                                            1
                                        `,
                                        }}
                                    >
                                        Report a Vendor
                                    </Button>
                                </Link>
                            )}
                        </div>

                    </div>



                </div>
            </div>
        </div>
    );
}