'use client';
import { useState, useEffect } from 'react';
import { useMutation } from '@tanstack/react-query';
import { loadStripe } from '@stripe/stripe-js';
import { Shield, CheckCircle, CreditCard, Zap, ChevronRight } from "lucide-react";
import { getSubscriptions, subscribeToPlan, type Subscription } from '@/lib/api/subscribe.api';
import { Notification } from '@/components/Reusable/Notification';
import { useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Elements } from '@stripe/react-stripe-js';
const stripePromise = loadStripe("pk_test_51S511OJX1lXBUH9qQBfFXZkspDBOIRw6MNkqwBHXUQ38C8CM4cexYqsDYOFnifHOVj3vqNCHYY6FyCX9si6iyufS00eJDoMjMt");;

export default function SubscribeSection() {
    const searchParams = useSearchParams();
    const [currentStage, setCurrentStage] = useState<'plan' | 'checkout' | 'success'>('plan');
    const [selectedPlan, setSelectedPlan] = useState<Subscription | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [loadingPlanId, setLoadingPlanId] = useState<string | null>(null);
    const [plans, setPlans] = useState<Subscription[]>([]);
    const [notification, setNotification] = useState<{
        message: string;
        type: 'success' | 'error';
    } | null>(null);

    const freeSubscriptionMutation = useMutation({
        mutationFn: (planId: string) => subscribeToPlan(planId),
        onSuccess: (data, planId) => {
            const plan = plans.find(p => p.id === planId) || selectedPlan;
            setSelectedPlan(plan || null);
            setCurrentStage('success');
            showNotification(`${plan?.name || 'Free'} plan activated successfully!`, 'success');
        },
        onError: (error: any, planId) => {
            const plan = plans.find(p => p.id === planId);
            const errorMessage = error?.response?.data?.message || `Failed to activate ${plan?.name || 'Free'} plan`;
            showNotification(errorMessage, 'error');
            setLoadingPlanId(null);
        }
    });

    const paidSubscriptionMutation = useMutation({
        mutationFn: ({ planId }: { planId: string }) => subscribeToPlan(planId),
        onSuccess: (data, variables) => {
            const plan = plans.find(p => p.id === variables.planId) || selectedPlan;
            setSelectedPlan(plan || null);
            setCurrentStage('success');
            showNotification('Subscription activated successfully!', 'success');
        },
        onError: (error: any, variables) => {
            const errorMessage = error?.response?.data?.message || 'Failed to activate subscription';
            showNotification(errorMessage, 'error');
            setCurrentStage('plan');
            setLoadingPlanId(null);
        }
    });

    const showNotification = (message: string, type: 'success' | 'error') => {
        setNotification({ message, type });
    };

    const hideNotification = () => {
        setNotification(null);
    };

    useEffect(() => {
        loadSubscriptions();
    }, []);

    useEffect(() => {
        const sessionId = searchParams?.get('session_id');
        const planId = searchParams?.get('plan_id');

        if (sessionId && planId && plans.length > 0) {
            paidSubscriptionMutation.mutate({ planId });
            const newUrl = window.location.pathname;
            window.history.replaceState({}, '', newUrl);
        }
    }, [plans, searchParams]);

    const loadSubscriptions = async () => {
        try {
            setIsLoading(true);
            const subscriptionData = await getSubscriptions();
            setPlans(subscriptionData);
        } catch (error: any) {
            console.error('Failed to load subscriptions:', error);
            showNotification('Failed to load subscription plans', 'error');
        } finally {
            setIsLoading(false);
        }
    };

    const selectPlan = async (plan: Subscription) => {
        if (plan.price === 0 || plan.name === 'Free') {
            setLoadingPlanId(plan.id);
            freeSubscriptionMutation.mutate(plan.id);
        } else {
            setSelectedPlan(plan);
            setCurrentStage('checkout');
        }
    };

    const goToPlanSelection = () => {
        setCurrentStage('plan');
        setSelectedPlan(null);
    };

    const handleSuccessRedirect = () => {
        window.location.href = '/subscribe/dashboard';
    };

    useEffect(() => {
        window.scrollTo({
            top: 0,
            left: 0,
            behavior: 'smooth'
        });
    }, [currentStage]);

    useEffect(() => {
        if (freeSubscriptionMutation.isPending || paidSubscriptionMutation.isPending) {
            setLoadingPlanId(selectedPlan?.id || null);
        } else {
            setLoadingPlanId(null);
        }
    }, [freeSubscriptionMutation.isPending, paidSubscriptionMutation.isPending, selectedPlan]);

    if (isLoading && plans.length === 0) {
        return (
            <section className="container mx-auto px-4 py-16">
                <div className="max-w-6xl mx-auto text-center">
                    <div className="w-16 h-16 border-4 border-indigo border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-gray font-satoshi">Loading subscription plans...</p>
                </div>
            </section>
        );
    }

    return (
        <>
            {notification && (
                <Notification
                    message={notification.message}
                    type={notification.type}
                    onClose={hideNotification}
                />
            )}

            <section className="min-h-screen bg-cloudWhite p-4 md:p-6">
                {/* Stage 1: Plan Selection */}
                {currentStage === 'plan' && (
                    <div className="max-w-6xl mx-auto">
                        <div className="text-center mb-12 pt-6">
                            <span className="inline-block bg-white text-indigo rounded-full text-xs uppercase px-4 py-2 font-semibold mb-4 border border-indigo/20 shadow-sm">
                                Choose Your Plan
                            </span>
                            <h1 className="text-3xl md:text-4xl font-bold text-indigo mb-6 font-satoshi">
                                Protect Your Business with Confidence
                            </h1>
                            <p className="text-lg text-gray max-w-2xl mx-auto font-satoshi">
                                Choose the plan that fits your needs and start verifying vendors with confidence
                            </p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
                            {plans.map((plan) => (
                                <div
                                    key={plan.id}
                                    className={`bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 border-2 ${plan.name === 'Pro'
                                        ? 'border-indigo transform scale-105 relative'
                                        : 'border-gray-100'
                                        }`}
                                >
                                    {plan.name === 'Pro' && (
                                        <div className="bg-gradient-to-b from-[#057EB7] from-[2.1%] via-[#141986] via-[50.13%] to-[#0E1264] to-[98.16%] test-white text-center py-2 rounded-t-2xl">
                                            <span className="text-sm font-semibold font-satoshi text-white">MOST POPULAR</span>
                                        </div>
                                    )}
                                    <div className="p-6">
                                        <div className="flex items-center gap-3 mb-4">
                                            <div className={`w-10 h-10 rounded-full flex items-center justify-center ${plan.name === 'Free' ? 'bg-gray-100' : 'bg-gradient-to-br from-indigo/10 to-indigo/10'
                                                }`}>
                                                <Zap className={`w-5 h-5 ${plan.name === 'Free' ? 'text-gray-500' : 'text-indigo'}`} />
                                            </div>
                                            <div>
                                                <h3 className="text-xl font-bold text-indigo font-satoshi">{plan.name}</h3>
                                                <p className="text-sm text-gray font-satoshi">
                                                    {plan.includedCredits.toLocaleString()} credits/month
                                                </p>
                                            </div>
                                        </div>

                                        <div className="mb-6">
                                            <span className="text-3xl font-bold text-indigo font-satoshi">
                                                ${plan.price}
                                            </span>
                                            {plan.price > 0 && (
                                                <span className="text-gray ml-2 font-satoshi">/month</span>
                                            )}
                                        </div>

                                        <ul className="space-y-2 mb-6">
                                            {[
                                                `${plan.includedCredits.toLocaleString()} verification credits`,
                                                plan.overageRate > 0 ? `$${plan.overageRate} per extra credit` : 'No extra charges',
                                                plan.name !== 'Free' ? 'Priority support' : 'Email support',
                                                plan.name !== 'Free' ? 'Advanced analytics' : 'Basic reports'
                                            ].map((feature, index) => (
                                                <li key={index} className="flex items-center gap-2 text-sm text-gray font-satoshi">
                                                    <div className="w-2 h-2 bg-indigo rounded-full"></div>
                                                    {feature}
                                                </li>
                                            ))}
                                        </ul>

                                        <Button
                                            onClick={() => selectPlan(plan)}
                                            disabled={freeSubscriptionMutation.isPending || paidSubscriptionMutation.isPending}
                                            className={`w-full uppercase font-semibold ${plan.name === 'Free' || plan.price === 0
                                                ? 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                                : 'bg-gradient-to-br from-[#575EFF] to-[#282D99] text-white hover:opacity-90'
                                                }`}
                                        >
                                            {loadingPlanId === plan.id ? (
                                                <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin mx-auto"></div>
                                            ) : plan.name === 'Free' || plan.price === 0 ? (
                                                'Get Started Free'
                                            ) : (
                                                'Subscribe Now'
                                            )}
                                        </Button>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Comparison Table */}
                        <div className="bg-white rounded-2xl shadow-lg p-6 md:p-8 mb-8">
                            <h3 className="text-xl font-bold text-indigo mb-6 font-satoshi">Plan Comparison</h3>
                            <div className="overflow-x-auto">
                                <table className="w-full text-sm text-left">
                                    <thead className="border-b border-gray-100">
                                        <tr>
                                            <th className="py-4 px-4 text-gray-500 font-satoshi">Feature</th>
                                            {plans.map(plan => (
                                                <th key={plan.id} className="py-4 px-4 text-center font-satoshi">{plan.name}</th>
                                            ))}
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr className="border-b border-gray-100">
                                            <td className="py-4 px-4 font-satoshi">Monthly Credits</td>
                                            {plans.map(plan => (
                                                <td key={plan.id} className="py-4 px-4 text-center font-satoshi">
                                                    {plan.includedCredits.toLocaleString()}
                                                </td>
                                            ))}
                                        </tr>
                                        <tr className="border-b border-gray-100">
                                            <td className="py-4 px-4 font-satoshi">Extra Credit Cost</td>
                                            {plans.map(plan => (
                                                <td key={plan.id} className="py-4 px-4 text-center font-satoshi">
                                                    {plan.overageRate > 0 ? `$${plan.overageRate}` : 'Included'}
                                                </td>
                                            ))}
                                        </tr>
                                        <tr className="border-b border-gray-100">
                                            <td className="py-4 px-4 font-satoshi">Support</td>
                                            {plans.map(plan => (
                                                <td key={plan.id} className="py-4 px-4 text-center font-satoshi">
                                                    {plan.name === 'Free' ? 'Email' : 'Priority'}
                                                </td>
                                            ))}
                                        </tr>
                                        <tr>
                                            <td className="py-4 px-4 font-satoshi">Analytics Dashboard</td>
                                            {plans.map(plan => (
                                                <td key={plan.id} className="py-4 px-4 text-center font-satoshi">
                                                    {plan.name === 'Free' ? 'Basic' : 'Advanced'}
                                                </td>
                                            ))}
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>

                        {/* FAQ Section */}
                        <div className="bg-gradient-to-r from-indigo/5 to-indigo/5 rounded-2xl p-6 md:p-8">
                            <h3 className="text-xl font-bold text-indigo mb-6 font-satoshi">Frequently Asked Questions</h3>
                            <div className="space-y-4">
                                {[
                                    {
                                        q: "Can I change my plan later?",
                                        a: "Yes, you can upgrade or downgrade your plan at any time. Changes will be prorated."
                                    },
                                    {
                                        q: "What happens to unused credits?",
                                        a: "Unused credits roll over to the next month for paid plans. Free plan credits expire monthly."
                                    },
                                    {
                                        q: "Is there a free trial?",
                                        a: "All paid plans come with a 7-day free trial. No credit card required to start."
                                    },
                                    {
                                        q: "Can I cancel anytime?",
                                        a: "Yes, you can cancel your subscription at any time from your account settings."
                                    }
                                ].map((faq, index) => (
                                    <div key={index} className="bg-white rounded-xl p-4">
                                        <h4 className="font-semibold text-gray-900 mb-2 font-satoshi">{faq.q}</h4>
                                        <p className="text-sm text-gray font-satoshi">{faq.a}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                )}

                {/* Stage 2: Checkout */}
                {currentStage === 'checkout' && selectedPlan && selectedPlan.price > 0 && (
                    <div className="max-w-md mx-auto pt-8">
                        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8">
                            <div className="text-center mb-6">
                                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-br from-indigo/10 to-indigo/10 flex items-center justify-center border border-indigo/20">
                                    <CreditCard className="w-8 h-8 text-indigo" />
                                </div>
                                <h2 className="text-2xl font-bold text-indigo mb-2 font-satoshi">Complete Your Subscription</h2>
                                <p className="text-gray font-satoshi">
                                    Activating <span className="font-semibold text-indigo">{selectedPlan.name}</span> plan
                                </p>
                            </div>

                            <StripeCheckout
                                selectedPlan={selectedPlan}
                                onBack={goToPlanSelection}
                                isLoading={paidSubscriptionMutation.isPending}
                            />
                        </div>
                    </div>
                )}

                {/* Stage 3: Success */}
                {currentStage === 'success' && selectedPlan && (
                    <div className="max-w-md mx-auto pt-8">
                        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8 text-center">
                            <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-gradient-to-br from-green-100 to-indigo/10 flex items-center justify-center border-2 border-green-200">
                                <CheckCircle className="w-10 h-10 text-green-500" />
                            </div>

                            <h2 className="text-3xl font-bold text-indigo mb-4 font-satoshi">Welcome to TapIQ!</h2>
                            <p className="text-gray mb-6 text-lg font-satoshi">
                                Your <span className="font-semibold text-indigo">{selectedPlan.name}</span> subscription is now active!
                            </p>

                            <div className="bg-cloudWhite rounded-xl p-6 mb-8">
                                <div className="text-center">
                                    <div className="text-3xl font-bold text-indigo mb-2 font-satoshi">
                                        {selectedPlan.includedCredits.toLocaleString()} credits
                                    </div>
                                    <p className="text-gray font-satoshi">
                                        Available for vendor verifications
                                    </p>
                                </div>
                            </div>

                            <div className="space-y-4">
                                <Button
                                    onClick={handleSuccessRedirect}
                                    className="w-full bg-gradient-to-br from-[#575EFF] to-[#282D99] uppercase font-semibold text-base py-4"
                                >
                                    Go to Dashboard
                                </Button>
                                <p className="text-sm text-gray font-satoshi">
                                    Your credits are ready to use immediately. Start verifying vendors now!
                                </p>
                            </div>
                        </div>
                    </div>
                )}
            </section>
        </>
    );
}

// StripeCheckout Component
interface StripeCheckoutProps {
    selectedPlan: Subscription;
    onBack: () => void;
    isLoading?: boolean;
}

function StripeCheckout({ selectedPlan, onBack, isLoading }: StripeCheckoutProps) {
    const [error, setError] = useState('');
    const [email, setEmail] = useState('');

    const checkoutMutation = useMutation({
        mutationFn: async (email: string) => {
            const response = await fetch('/api/create-checkout-session', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    amount: selectedPlan.price * 100,
                    currency: 'usd',
                    planName: selectedPlan.name,
                    planId: selectedPlan.id,
                    customerEmail: email,
                    includedCredits: selectedPlan.includedCredits,
                    successUrl: `${window.location.origin}${window.location.pathname}?session_id={CHECKOUT_SESSION_ID}&plan_id=${selectedPlan.id}`,
                    cancelUrl: `${window.location.origin}${window.location.pathname}?canceled=true`
                }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Failed to create checkout session');
            }
            return response.json();
        },
        onSuccess: (data) => {
            if (data.url) {
                window.location.href = data.url;
            } else {
                throw new Error('No checkout URL received');
            }
        },
        onError: (error: any) => {
            console.error('Checkout session creation failed:', error);
            setError(error.message || 'Failed to process payment. Please try again.');
        }
    });

    const handleStripeCheckout = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!email) {
            setError('Please enter your email address');
            return;
        }

        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            setError('Please enter a valid email address');
            return;
        }

        setError('');
        checkoutMutation.mutate(email);
    };

    return (
        <form onSubmit={handleStripeCheckout} className="space-y-6">
            <div>
                <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-2 font-satoshi">
                    Email Address *
                </label>
                <input
                    type="email"
                    id="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 bg-white focus:outline-none placeholder:text-gray-400 focus:border-indigo focus:ring-2 focus:ring-indigo/20 transition-all duration-300 font-satoshi"
                    placeholder="your.email@company.com"
                    required
                />
            </div>

            <div className="bg-gradient-to-br from-indigo/5 to-indigo/5 border border-indigo/20 rounded-xl p-6">
                <h4 className="font-semibold text-indigo mb-4 font-satoshi">Order Summary</h4>
                <div className="space-y-3">
                    <div className="flex justify-between items-center">
                        <span className="text-gray font-satoshi">Plan:</span>
                        <span className="text-indigo font-bold font-satoshi">{selectedPlan.name}</span>
                    </div>
                    <div className="flex justify-between items-center">
                        <span className="text-gray font-satoshi">Credits:</span>
                        <span className="text-gray-900 font-semibold font-satoshi">
                            {selectedPlan.includedCredits.toLocaleString()}/month
                        </span>
                    </div>
                    <div className="border-t border-gray-200 pt-3 mt-3">
                        <div className="flex justify-between items-center">
                            <span className="text-lg font-semibold text-gray-900 font-satoshi">Total:</span>
                            <span className="text-3xl font-bold text-indigo font-satoshi">
                                ${selectedPlan.price}
                            </span>
                        </div>
                    </div>
                </div>
                <div className="mt-4 p-3 bg-indigo/10 rounded-lg">
                    <p className="text-sm text-indigo text-center font-satoshi">
                        💳 You'll be redirected to secure Stripe checkout
                    </p>
                </div>
            </div>

            {error && (
                <div className="bg-red-50 border border-red-200 rounded-xl p-4">
                    <div className="flex items-center gap-2">
                        <svg className="w-4 h-4 text-red-500 flex-shrink-0" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <p className="text-red-700 text-sm font-satoshi">{error}</p>
                    </div>
                </div>
            )}

            <div className="space-y-3">
                <Button
                    type="submit"
                    disabled={checkoutMutation.isPending || isLoading || !email}
                    className="w-full bg-gradient-to-br from-[#575EFF] to-[#282D99] uppercase font-semibold text-white py-4"
                >
                    {checkoutMutation.isPending ? (
                        <span className="flex items-center justify-center gap-2">
                            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                            Redirecting...
                        </span>
                    ) : (
                        `Pay with Stripe - $${selectedPlan.price}`
                    )}
                </Button>

                <Button
                    type="button"
                    onClick={onBack}
                    disabled={checkoutMutation.isPending || isLoading}
                    variant="outline"
                    className="w-full uppercase font-semibold text-sm"
                    style={{
                        border: "1px solid",
                        borderImage: `
                            linear-gradient(180deg, rgba(255, 255, 255, 0.8) -25.96%, rgba(255, 255, 255, 0) 100%),
                            linear-gradient(270deg, rgba(255, 255, 255, 0) 12.54%, rgba(255, 255, 255, 0.8) 47.67%, rgba(255, 255, 255, 0) 82.8%)
                            1
                        `,
                    }}
                >
                    ← Choose a different plan
                </Button>
            </div>

            <div className="bg-cloudWhite border border-gray-200 rounded-xl p-4">
                <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
                        <Shield className="w-4 h-4 text-green-500" />
                    </div>
                    <div>
                        <p className="text-green-600 text-sm font-medium font-satoshi">Secure Payment</p>
                        <p className="text-gray-600 text-xs mt-1 font-satoshi">
                            Your payment is processed securely by Stripe. We never store your payment details.
                        </p>
                    </div>
                </div>
            </div>

            {/* Plan Benefits */}
            <div className="border-t border-gray-100 pt-6">
                <h4 className="font-semibold text-indigo mb-4 font-satoshi">What you get:</h4>
                <ul className="space-y-2">
                    {[
                        `${selectedPlan.includedCredits.toLocaleString()} verification credits monthly`,
                        selectedPlan.overageRate > 0 ? `$${selectedPlan.overageRate} per extra credit` : 'No extra charges',
                        'Priority customer support',
                        'Advanced analytics dashboard',
                        'Bulk verification capabilities'
                    ].map((benefit, index) => (
                        <li key={index} className="flex items-center gap-2 text-sm text-gray font-satoshi">
                            <div className="w-2 h-2 bg-indigo rounded-full flex-shrink-0"></div>
                            {benefit}
                        </li>
                    ))}
                </ul>
            </div>
        </form>
    );
}

