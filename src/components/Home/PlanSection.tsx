'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Zap, CheckCircle } from "lucide-react";
import { type Subscription } from '@/lib/api/subscribe.api';
import { useSessionStore } from '@/stores/useSessionStore';
import { Notification } from '@/components/Reusable/Notification';
import { Button } from '@/components/ui/button';

const MOCK_PLANS: Subscription[] = [
    {
        "id": "691a1f91544aa08a3f47bcca",
        "name": "Free",
        "price": 0,
        "includedCredits": 20,
        "overageRate": 0.25,
        "isActive": true,
        "createdAt": "2025-11-16T19:01:37.782Z",
        "updatedAt": "2025-11-16T19:01:37.782Z"
    },
    {
        "id": "691a1f92544aa08a3f47bccb",
        "name": "Basic",
        "price": 9.99,
        "includedCredits": 100,
        "overageRate": 0.20,
        "isActive": true,
        "createdAt": "2025-11-16T19:01:37.782Z",
        "updatedAt": "2025-11-16T19:01:37.782Z"
    },
    {
        "id": "691a1f92544aa08a3f47bccc",
        "name": "Pro",
        "price": 24.99,
        "includedCredits": 300,
        "overageRate": 0.15,
        "isActive": true,
        "createdAt": "2025-11-16T19:01:37.782Z",
        "updatedAt": "2025-11-16T19:01:37.782Z"
    },
    {
        "id": "691a1f93544aa08a3f47bccd",
        "name": "Enterprise",
        "price": 99.99,
        "includedCredits": 1000,
        "overageRate": 0.10,
        "isActive": true,
        "createdAt": "2025-11-16T19:01:37.782Z",
        "updatedAt": "2025-11-16T19:01:37.782Z"
    }
];

const PlanSection = () => {
    const router = useRouter();
    const { session } = useSessionStore();
    const [plans, setPlans] = useState<Subscription[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [notification, setNotification] = useState<{
        message: string;
        type: 'success' | 'error';
    } | null>(null);

    const showNotification = (message: string, type: 'success' | 'error') => {
        setNotification({ message, type });
    };

    const hideNotification = () => {
        setNotification(null);
    };

    useEffect(() => {
        loadSubscriptions();
    }, []);

    const loadSubscriptions = async () => {
        try {
            // Simulate API call delay
            await new Promise(resolve => setTimeout(resolve, 500));
            setPlans(MOCK_PLANS);
        } catch (error: any) {
            console.error('Failed to load subscriptions:', error);
            showNotification('Failed to load subscription plans', 'error');
            setPlans(MOCK_PLANS);
        } finally {
            setIsLoading(false);
        }
    };

    const handlePlanSelect = (plan: Subscription) => {
        if (!session) {
            showNotification('Please sign in to subscribe', 'error');
            setTimeout(() => {
                router.push(`/auth/login?callbackUrl=/subscribe`);
            }, 1500);
            return;
        }

        if (plan.name !== 'Free') {
            router.push(`/subscribe?plan=${plan.id}`);
        } else {
            router.push('/subscribe');
        }
    };

    if (isLoading) {
        return (
            <section id="pricing" className="py-16 bg-cloudWhite">
                <div className="container mx-auto px-4">
                    <div className="text-center">
                        <div className="w-16 h-16 border-4 border-indigo border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                        <p className="text-gray font-satoshi">Loading subscription plans...</p>
                    </div>
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

            <section id="pricing" className="py-16 md:py-20 bg-cloudWhite">
                <div className="container mx-auto px-4">
                    <div className="text-center mb-12">
                        <span className="inline-block bg-white text-indigo rounded-full text-xs uppercase px-4 py-2 font-semibold mb-4 border border-indigo/20 shadow-sm">
                            Choose Your Plan
                        </span>
                        <h2 className="text-3xl md:text-4xl font-bold text-indigo mb-4 font-satoshi">
                            Protect Your Business with Confidence
                        </h2>
                        <p className="text-lg text-gray max-w-2xl mx-auto font-satoshi">
                            Choose the plan that fits your needs and start verifying vendors with confidence
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
                        {plans.map((plan) => (
                            <div
                                key={plan.id}
                                className={`bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 border-2 ${plan.name === 'Pro'
                                    ? 'border-gray-100 relative'
                                    : 'border-gray-100'
                                    }`}
                            >
                                {plan.name === 'Pro' && (
                                    <div className="bg-gradient-to-b from-[#057EB7] from-[2.1%] via-[#141986] via-[50.13%] to-[#0E1264] to-[98.16%] text-white text-center py-2 rounded-t-2xl">
                                        <span className="text-sm font-semibold font-satoshi">MOST POPULAR</span>
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
                                        onClick={() => handlePlanSelect(plan)}
                                        className={`w-full uppercase font-semibold ${plan.name === 'Free'
                                            ? 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                            : 'bg-gradient-to-br from-[#575EFF] to-[#282D99] text-white hover:opacity-90'
                                            }`}
                                    >
                                        {plan.name === 'Free' ? 'Get Started Free' : 'Subscribe Now'}
                                    </Button>

                                    {plan.overageRate > 0 && (
                                        <div className="mt-4 p-3 bg-gradient-to-r from-indigo/5 to-indigo/5 rounded-lg border border-indigo/10">
                                            <p className="text-xs text-indigo text-center font-satoshi">
                                                Additional verifications: ${plan.overageRate} per credit
                                            </p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Features Comparison */}
                    <div className="bg-white rounded-2xl shadow-lg p-6 md:p-8">
                        <h3 className="text-xl font-bold text-indigo mb-6 font-satoshi text-center">Compare All Features</h3>
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm text-left">
                                <thead className="border-b border-gray-100">
                                    <tr>
                                        <th className="py-4 px-4 text-gray-500 font-satoshi">Features</th>
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
                                        <td className="py-4 px-4 font-satoshi">Vendor Verification</td>
                                        {plans.map(plan => (
                                            <td key={plan.id} className="py-4 px-4 text-center">
                                                <CheckCircle className={`w-5 h-5 mx-auto ${plan.name === 'Free' ? 'text-gray-300' : 'text-indigo'}`} />
                                            </td>
                                        ))}
                                    </tr>
                                    <tr className="border-b border-gray-100">
                                        <td className="py-4 px-4 font-satoshi">Message Scanning</td>
                                        {plans.map(plan => (
                                            <td key={plan.id} className="py-4 px-4 text-center">
                                                <CheckCircle className={`w-5 h-5 mx-auto ${plan.name === 'Free' ? 'text-gray-300' : 'text-indigo'}`} />
                                            </td>
                                        ))}
                                    </tr>
                                    <tr className="border-b border-gray-100">
                                        <td className="py-4 px-4 font-satoshi">Priority Support</td>
                                        {plans.map(plan => (
                                            <td key={plan.id} className="py-4 px-4 text-center">
                                                <CheckCircle className={`w-5 h-5 mx-auto ${plan.name !== 'Free' ? 'text-indigo' : 'text-gray-300'}`} />
                                            </td>
                                        ))}
                                    </tr>
                                    <tr>
                                        <td className="py-4 px-4 font-satoshi">Bulk Operations</td>
                                        {plans.map(plan => (
                                            <td key={plan.id} className="py-4 px-4 text-center">
                                                <CheckCircle className={`w-5 h-5 mx-auto ${plan.name === 'Enterprise' ? 'text-indigo' : 'text-gray-300'}`} />
                                            </td>
                                        ))}
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* CTA Section */}
                    <div className="mt-12 text-center">
                        <div className="bg-gradient-to-b from-[#057EB7] from-[2.1%] via-[#141986] via-[50.13%] to-[#0E1264] to-[98.16%] rounded-2xl p-8 border border-indigo/10 ">
                            <h3 className="text-2xl font-bold text-white mb-4 font-satoshi">Not Sure Which Plan is Right?</h3>
                            <p className="text-white/80 mb-6 max-w-2xl mx-auto font-satoshi">
                                Start with our free plan and upgrade anytime.
                            </p>
                            <Button
                                onClick={() => router.push('/subscribe')}
                                className="bg-gradient-to-br from-[#575EFF] to-[#282D99] text-white uppercase font-semibold text-base px-8 py-4 hover:opacity-90 transition-opacity"
                            >
                                Explore All Plans
                            </Button>
                        </div>
                    </div>
                </div>
            </section>
        </>
    );
};

export default PlanSection;