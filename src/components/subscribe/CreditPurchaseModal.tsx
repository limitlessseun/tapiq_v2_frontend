"use client";
import { useState, useEffect } from 'react';
import { CreditCard, Shield, Zap, X, Check, Plus, Minus } from 'lucide-react';
import { purchaseCredits } from '@/lib/api/subscribe.api';
import { Notification } from '../Reusable/Notification';
import { useSessionStore } from '@/stores/useSessionStore';
import { Button } from '@/components/ui/button';
import { Elements } from '@stripe/react-stripe-js';


interface CreditPurchaseModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess?: () => void;
}

interface StripeFormErrors {
    email?: string;
}

export const CreditPurchaseModal = ({ isOpen, onClose, onSuccess }: CreditPurchaseModalProps) => {
    const { session, refreshSession } = useSessionStore();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string>('');
    const [formData, setFormData] = useState({
        email: '',
        credits: 100
    });
    const [errors, setErrors] = useState<StripeFormErrors>({});
    const [notification, setNotification] = useState<{
        message: string;
        type: 'success' | 'error';
    } | null>(null);
    const [purchaseSuccess, setPurchaseSuccess] = useState(false);

    const showNotification = (message: string, type: 'success' | 'error') => {
        setNotification({ message, type });
    };

    const hideNotification = () => {
        setNotification(null);
    };

    // Set user email from session if available
    useEffect(() => {
        if (session?.user?.email && !formData.email) {
            setFormData(prev => ({ ...prev, email: session.user.email }));
        }
    }, [session?.user?.email, formData.email]);

    const validateForm = (): boolean => {
        const newErrors: StripeFormErrors = {};

        if (!formData.email.trim()) {
            newErrors.email = 'Email is required';
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
            newErrors.email = 'Please enter a valid email address';
        }

        if (formData.credits < 50) {
            showNotification('Minimum purchase is 50 credits', 'error');
            return false;
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: name === 'credits' ? Math.max(50, parseInt(value) || 50) : value
        }));

        if (errors[name as keyof StripeFormErrors]) {
            setErrors(prev => ({
                ...prev,
                [name]: undefined
            }));
        }

        if (error) setError('');
    };

    const incrementCredits = () => {
        setFormData(prev => ({
            ...prev,
            credits: prev.credits + 50
        }));
    };

    const decrementCredits = () => {
        setFormData(prev => ({
            ...prev,
            credits: Math.max(50, prev.credits - 50)
        }));
    };

    // Calculate price - updated pricing structure
    const calculatePrice = (credits: number) => {
        const pricePerCredit = 0.25; // $0.25 per credit
        return credits * pricePerCredit;
    };

    const handleStripePayment = async () => {
        const amountInUSD = calculatePrice(formData.credits);
        const userEmail = formData.email || session?.user?.email;

        if (!userEmail) {
            throw new Error('Email is required for payment');
        }

        const response = await fetch('/api/create-checkout-session', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                amount: Math.round(amountInUSD * 100), // Convert to cents
                currency: 'usd',
                credits: formData.credits,
                customerEmail: userEmail,
                productType: 'credits'
            }),
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.error || 'Failed to create checkout session');
        }

        if (data.url) {
            window.location.href = data.url;
        } else {
            throw new Error('No checkout URL received');
        }
    };

    const handleCreditPurchase = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!validateForm()) {
            return;
        }

        setLoading(true);
        setError('');

        try {
            await handleStripePayment();
        } catch (err: any) {
            console.error('Payment error:', err);
            setError(err.message || 'Failed to process payment');
            showNotification('Payment failed. Please try again.', 'error');
        } finally {
            setLoading(false);
        }
    };

    const handleClose = () => {
        setFormData({ email: '', credits: 100 });
        setError('');
        setPurchaseSuccess(false);
        onClose();
    };

    const priceInUSD = calculatePrice(formData.credits).toFixed(2);

    // Credit packages
    const creditPackages = [
        { credits: 50, price: "$12.50", perCredit: "$0.25", recommended: false },
        { credits: 100, price: "$25.00", perCredit: "$0.25", recommended: true },
        { credits: 200, price: "$45.00", perCredit: "$0.225", recommended: false },
        { credits: 500, price: "$100.00", perCredit: "$0.20", recommended: false },
    ];

    if (!isOpen) return null;

    if (purchaseSuccess) {
        return (
            <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm bg-black/20 bg-opacity-80 p-4 animate-fadein">
                <div className="bg-white rounded-2xl p-8 max-w-md w-full relative overflow-hidden scrollbar-hidden">
                    <div className="text-center">
                        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <Check className="w-8 h-8 text-green-500" />
                        </div>
                        <h3 className="text-2xl font-bold text-indigo mb-3 font-satoshi">Payment Successful!</h3>
                        <p className="text-gray font-satoshi mb-4">
                            Your purchase of <span className="font-semibold text-indigo">{formData.credits} credits</span> was successful.
                        </p>
                        <p className="text-sm text-gray-500 mb-6 font-satoshi">
                            The credits have been added to your account and are ready to use immediately.
                        </p>

                        <div className="bg-cloudWhite p-6 rounded-xl mb-8">
                            <div className="flex justify-between items-center mb-3">
                                <span className="text-gray font-satoshi">Credits Added:</span>
                                <span className="text-3xl font-bold text-indigo font-satoshi">+{formData.credits}</span>
                            </div>
                            <div className="flex justify-between items-center text-sm font-satoshi">
                                <span className="text-gray-500">Total Paid:</span>
                                <span className="text-gray-900 font-semibold">${priceInUSD}</span>
                            </div>
                        </div>

                        <Button
                            onClick={handleClose}
                            className="w-full bg-gradient-to-br from-[#575EFF] to-[#282D99] uppercase font-semibold text-base py-4"
                        >
                            Start Using Credits
                        </Button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm bg-black/20 bg-opacity-80 p-4">
            <div className="bg-white rounded-2xl p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                {/* Header */}
                <div className="flex justify-between items-center mb-8 pb-6 border-b border-gray-100">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-gradient-to-br from-[#575EFF] to-[#282D99] rounded-full flex items-center justify-center">
                            <Zap className="w-6 h-6 text-white" />
                        </div>
                        <div>
                            <h2 className="text-2xl font-bold text-indigo font-satoshi">Purchase Credits</h2>
                            <p className="text-gray font-satoshi">Buy verification credits for vendor scans</p>
                        </div>
                    </div>
                    <button
                        onClick={handleClose}
                        className="p-2 hover:bg-cloudWhite rounded-full transition-colors"
                        disabled={loading}
                    >
                        <X className="w-5 h-5 text-gray-500" />
                    </button>
                </div>

                {notification && (
                    <Notification
                        message={notification.message}
                        type={notification.type}
                        onClose={hideNotification}
                    />
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* Left Column - Credit Packages */}
                    <div>
                        <h3 className="text-lg font-bold text-indigo mb-4 font-satoshi">Credit Packages</h3>
                        <div className="space-y-4">
                            {creditPackages.map((pkg, index) => (
                                <div
                                    key={index}
                                    className={`p-4 rounded-xl border-2 cursor-pointer transition-all ${pkg.recommended
                                        ? 'border-indigo bg-indigo/5'
                                        : 'border-gray-200 hover:border-indigo/30 hover:bg-cloudWhite'
                                        } ${formData.credits === pkg.credits
                                            ? 'ring-2 ring-indigo/20 bg-indigo/5'
                                            : ''
                                        }`}
                                    onClick={() => setFormData(prev => ({ ...prev, credits: pkg.credits }))}
                                >
                                    <div className="flex justify-between items-center mb-2">
                                        <div>
                                            <div className="flex items-center gap-2">
                                                <span className="text-xl font-bold text-indigo font-satoshi">
                                                    {pkg.credits} Credits
                                                </span>

                                            </div>
                                            <p className="text-sm text-gray-500 mt-1 font-satoshi">
                                                {pkg.perCredit} per credit
                                            </p>
                                        </div>
                                        <div className="text-right">
                                            <div className="text-2xl font-bold text-indigo font-satoshi">
                                                {pkg.price}
                                            </div>
                                            {pkg.credits === 500 && (
                                                <p className="text-xs text-gray-500 font-satoshi">Best Value</p>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Custom Credit Amount */}
                        <div className="mt-8">
                            <h4 className="font-semibold text-indigo mb-3 font-satoshi">Custom Amount</h4>
                            <div className="flex items-center gap-3">
                                <button
                                    type="button"
                                    onClick={decrementCredits}
                                    className="w-10 h-10 rounded-full border border-gray-300 flex items-center justify-center hover:bg-cloudWhite"
                                    disabled={formData.credits <= 50}
                                >
                                    <Minus className="w-4 h-4" />
                                </button>
                                <div className="flex-1">
                                    <input
                                        id="credits"
                                        name="credits"
                                        type="number"
                                        min="50"
                                        step="50"
                                        value={formData.credits}
                                        onChange={handleInputChange}
                                        className="w-full border border-gray-300 rounded-lg px-4 py-3 text-gray-900 text-center font-satoshi focus:outline-none focus:border-indigo focus:ring-2 focus:ring-indigo/20"
                                        required
                                        disabled={loading}
                                    />
                                </div>
                                <button
                                    type="button"
                                    onClick={incrementCredits}
                                    className="w-10 h-10 rounded-full border border-gray-300 flex items-center justify-center hover:bg-cloudWhite"
                                >
                                    <Plus className="w-4 h-4" />
                                </button>
                            </div>
                            <p className="text-xs text-gray-500 mt-2 text-center font-satoshi">
                                Minimum purchase: 50 credits • Increments of 50
                            </p>
                        </div>
                    </div>

                    {/* Right Column - Payment Form */}
                    <div>
                        <form onSubmit={handleCreditPurchase} className="space-y-6">
                            {/* Email Input */}
                            <div>
                                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2 font-satoshi">
                                    Email Address *
                                </label>
                                <input
                                    id="email"
                                    name="email"
                                    type="email"
                                    value={formData.email}
                                    onChange={handleInputChange}
                                    className={`w-full border rounded-lg px-4 py-3 text-gray-900 font-satoshi focus:outline-none focus:ring-2 ${errors.email
                                        ? 'border-red-500 focus:border-red-500 focus:ring-red-500/20'
                                        : 'border-gray-300 focus:border-indigo focus:ring-indigo/20'
                                        }`}
                                    placeholder="your.email@company.com"
                                    required
                                    disabled={loading}
                                />
                                {errors.email && (
                                    <p className="text-red-500 text-xs mt-1 font-satoshi">{errors.email}</p>
                                )}
                            </div>

                            {/* Price Summary */}
                            <div className="bg-gradient-to-br from-indigo/5 to-indigo/5 border border-indigo/20 rounded-xl p-6">
                                <h4 className="font-semibold text-indigo mb-4 font-satoshi">Order Summary</h4>
                                <div className="space-y-3">
                                    <div className="flex justify-between items-center">
                                        <span className="text-gray font-satoshi">Credits:</span>
                                        <span className="text-gray-900 font-semibold font-satoshi">{formData.credits.toLocaleString()}</span>
                                    </div>
                                    <div className="flex justify-between items-center text-sm">
                                        <span className="text-gray-500 font-satoshi">Price per credit:</span>
                                        <span className="text-gray-500 font-satoshi">$0.25</span>
                                    </div>
                                    <div className="border-t border-gray-200 pt-3 mt-3">
                                        <div className="flex justify-between items-center">
                                            <span className="text-lg font-semibold text-gray-900 font-satoshi">Total:</span>
                                            <span className="text-3xl font-bold text-indigo font-satoshi">
                                                ${priceInUSD}
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
                                        <svg className="w-4 h-4 text-red-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                        <p className="text-red-700 text-sm font-satoshi">{error}</p>
                                    </div>
                                </div>
                            )}

                            {/* Action Buttons */}
                            <div className="flex gap-3 pt-2">
                                <Button
                                    type="button"
                                    onClick={handleClose}
                                    disabled={loading}
                                    variant="outline"
                                    className="flex-1 uppercase font-semibold text-sm"
                                    style={{
                                        border: "1px solid",
                                        borderImage: `
                                            linear-gradient(180deg, rgba(255, 255, 255, 0.8) -25.96%, rgba(255, 255, 255, 0) 100%),
                                            linear-gradient(270deg, rgba(255, 255, 255, 0) 12.54%, rgba(255, 255, 255, 0.8) 47.67%, rgba(255, 255, 255, 0) 82.8%)
                                            1
                                        `,
                                    }}
                                >
                                    Cancel
                                </Button>
                                <Button
                                    type="submit"
                                    disabled={loading}
                                    className="flex-1 bg-gradient-to-br from-[#575EFF] to-[#282D99] uppercase font-semibold text-sm text-white py-3"
                                >
                                    {loading ? (
                                        <span className="flex items-center justify-center gap-2">
                                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                            Processing...
                                        </span>
                                    ) : (
                                        `Pay $${priceInUSD}`
                                    )}
                                </Button>
                            </div>

                            {/* Security Notice */}
                            <div className="bg-cloudWhite border border-gray-200 rounded-lg p-4">
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
                        </form>
                    </div>
                </div>

                {/* Footer - Credit Usage Info */}
                <div className="mt-8 pt-6 border-t border-gray-100">
                    <h4 className="font-bold text-indigo mb-4 font-satoshi">What can you do with credits?</h4>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {[
                            { title: "Vendor Verification", desc: "Check business legitimacy" },
                            { title: "Message Scan", desc: "Detect phishing attempts" },
                            { title: "URL Analysis", desc: "Verify website safety" },
                            { title: "Phone Check", desc: "Validate phone numbers" }
                        ].map((item, index) => (
                            <div key={index} className="bg-cloudWhite p-3 rounded-lg">
                                <div className="w-8 h-8 rounded-full bg-indigo/10 flex items-center justify-center mb-2">
                                    <div className="w-2 h-2 bg-indigo rounded-full"></div>
                                </div>
                                <p className="font-semibold text-sm text-gray-900 mb-1 font-satoshi">{item.title}</p>
                                <p className="text-xs text-gray-500 font-satoshi">{item.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};