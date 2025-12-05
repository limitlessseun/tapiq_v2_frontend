'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useSessionStore } from '@/stores/useSessionStore';
import { getTransactionHistory } from '@/lib/api/subscribe.api';
import { Notification } from '@/components/Reusable/Notification';
import { CreditPurchaseModal } from '@/components/subscribe/CreditPurchaseModal';
import { Button } from "@/components/ui/button";

interface Transaction {
    id: string;
    userId: string;
    type: string;
    amount: number;
    credits: number;
    description: string;
    createdAt: string;
}

export default function SubscriptionPage() {
    const { session } = useSessionStore();
    const [showCreditPurchase, setShowCreditPurchase] = useState(false);
    const [transactions, setTransactions] = useState<Transaction[]>([]);
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

    // Get current subscription from session store
    const currentSubscription = session?.user?.subscription;

    useEffect(() => {
        loadTransactionHistory();
    }, []);

    const loadTransactionHistory = async () => {
        try {
            setIsLoading(true);
            const transactionData = await getTransactionHistory();
            setTransactions(transactionData);
        } catch (error: any) {
            console.error('Failed to load transaction history:', error);
            showNotification('Failed to load transaction history', 'error');
        } finally {
            setIsLoading(false);
        }
    };

    const renewPlan = () => {
        window.location.href = '/subscribe';
    };

    const cancelPlan = () => {
        if (confirm(`Cancel auto-renewal for ${currentSubscription?.name || 'current plan'}?`)) {
            showNotification('Auto-renewal cancelled successfully', 'success');
        }
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD'
        }).format(amount);
    };

    const getPlanExpiryDate = () => {
        if (!currentSubscription) return 'N/A';
        const createdDate = new Date(currentSubscription.createdAt);
        const expiryDate = new Date(createdDate);
        expiryDate.setMonth(expiryDate.getMonth() + 1);
        return formatDate(expiryDate.toISOString());
    };

    return (
        <>
            {notification && (
                <Notification
                    message={notification.message}
                    type={notification.type}
                    onClose={hideNotification}
                />
            )}

            <div className="min-h-screen bg-cloudWhite p-4 md:p-6">
                {/* Header */}
                <div className="text-center mb-10 pt-6">
                    <div className="inline-flex items-center justify-center mb-4">
                        <span className="bg-white text-indigo rounded-full text-xs uppercase px-4 py-2 font-semibold border border-indigo/20 shadow-sm">
                            Account Management
                        </span>
                    </div>
                    <h1 className="text-3xl md:text-4xl font-bold text-indigo mb-4 font-satoshi">
                        Subscription Management
                    </h1>
                    <p className="text-lg text-gray max-w-2xl mx-auto font-satoshi">
                        Manage your TapIQ subscription, view payment history, and update your billing preferences
                    </p>
                </div>

                <div className="max-w-6xl mx-auto">
                    {/* Current Plan Card */}
                    <div className="bg-white rounded-2xl shadow-lg p-6 md:p-8 mb-8 border border-gray-100">
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
                            <div>
                                <h2 className="text-2xl font-bold text-indigo mb-3 font-satoshi">
                                    {currentSubscription?.name || 'No Active Plan'}
                                </h2>
                                <div className="space-y-2">
                                    <p className="text-gray font-satoshi">
                                        Expires <span className="font-semibold">{getPlanExpiryDate()}</span>
                                    </p>
                                    <p className="text-gray font-satoshi">
                                        Credits: <span className="font-semibold">{currentSubscription?.includedCredits || 0}</span>
                                    </p>
                                </div>
                            </div>

                            <div className="flex flex-col md:flex-row items-start md:items-center gap-4">
                                <span className={`px-4 py-2 rounded-full text-sm font-semibold font-satoshi ${currentSubscription?.isActive
                                    ? 'bg-green-100 text-green-800 border border-green-200'
                                    : 'bg-red-100 text-red-800 border border-red-200'
                                    }`}>
                                    {currentSubscription?.isActive ? 'Active' : 'Expired'}
                                </span>

                                <div className="flex gap-3">
                                    <Button
                                        onClick={() => setShowCreditPurchase(true)}
                                        className="bg-gradient-to-br from-[#575EFF] to-[#282D99] uppercase font-semibold text-white text-sm px-6"
                                    >
                                        Buy Credits
                                    </Button>

                                    <Button
                                        onClick={renewPlan}
                                        className="bg-indigo text-white uppercase font-semibold text-sm px-6"
                                    >
                                        {currentSubscription ? 'Renew/Upgrade' : 'Subscribe'}
                                    </Button>

                                    {currentSubscription?.isActive && (
                                        <Button
                                            onClick={cancelPlan}
                                            className="bg-red-500 text-white uppercase font-semibold text-sm px-6"
                                        >
                                            Cancel
                                        </Button>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Transaction History */}
                        <div className="border-t border-gray-100 pt-8">
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                                <h3 className="text-xl font-bold text-indigo font-satoshi">Transaction History</h3>
                                <button
                                    onClick={loadTransactionHistory}
                                    disabled={isLoading}
                                    className="text-indigo hover:text-indigo/80 text-sm transition-colors disabled:opacity-50 font-satoshi"
                                >
                                    {isLoading ? 'Refreshing...' : '↻ Refresh'}
                                </button>
                            </div>

                            {isLoading ? (
                                <div className="text-center py-12">
                                    <div className="w-8 h-8 border-2 border-indigo border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                                    <p className="text-gray font-satoshi">Loading transaction history...</p>
                                </div>
                            ) : (
                                <div className="overflow-x-auto">
                                    <table className="w-full text-sm text-left">
                                        <thead className="text-xs uppercase text-gray-400 border-b border-gray-200">
                                            <tr>
                                                <th className="py-4 px-4 font-medium font-satoshi">Description</th>
                                                <th className="py-4 px-4 font-medium font-satoshi">Amount</th>
                                                <th className="py-4 px-4 font-medium font-satoshi">Credits</th>
                                                <th className="py-4 px-4 font-medium font-satoshi">Date</th>
                                                <th className="py-4 px-4 font-medium font-satoshi">Reference</th>
                                                <th className="py-4 px-4 font-medium font-satoshi">Status</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {transactions.length === 0 ? (
                                                <tr>
                                                    <td colSpan={6} className="py-12 px-4 text-center text-gray-400 font-satoshi">
                                                        No transaction history found
                                                    </td>
                                                </tr>
                                            ) : (
                                                transactions.map((transaction) => {
                                                    const isActive = currentSubscription?.id === transaction.id && currentSubscription?.isActive;
                                                    return (
                                                        <tr
                                                            key={transaction.id}
                                                            className="border-b border-gray-100 hover:bg-gray-50 transition-colors"
                                                        >
                                                            <td className="py-4 px-4 font-semibold text-gray-900 font-satoshi">
                                                                {transaction.description}
                                                            </td>
                                                            <td className="py-4 px-4 text-gray-700 font-satoshi">
                                                                {formatCurrency(transaction.amount)}
                                                            </td>
                                                            <td className="py-4 px-4 text-gray-700 font-satoshi">
                                                                {transaction.credits.toLocaleString()}
                                                            </td>
                                                            <td className="py-4 px-4 text-gray-700 font-satoshi">
                                                                {formatDate(transaction.createdAt)}
                                                            </td>
                                                            <td className="py-4 px-4 text-xs tracking-wider font-mono text-gray-500">
                                                                {transaction.id.slice(-8).toUpperCase()}
                                                            </td>
                                                            <td className="py-4 px-4">
                                                                <span className={`px-3 py-1 rounded-full text-xs font-semibold font-satoshi ${isActive
                                                                    ? 'bg-green-100 text-green-800 border border-green-200'
                                                                    : 'bg-gray-100 text-gray-800 border border-gray-200'
                                                                    }`}>
                                                                    {isActive ? 'Active' : 'Completed'}
                                                                </span>
                                                            </td>
                                                        </tr>
                                                    );
                                                })
                                            )}
                                        </tbody>
                                    </table>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
                        <div className="flex flex-wrap gap-6 justify-center">
                            <Link
                                href="/subscribe"
                                className="text-indigo hover:text-indigo/80 transition-colors font-satoshi font-medium"
                            >
                                Change Plan
                            </Link>
                            <span className="text-gray-300">•</span>
                            <Link
                                href="/subscribe/dashboard"
                                className="text-indigo hover:text-indigo/80 transition-colors font-satoshi font-medium"
                            >
                                Billing Settings
                            </Link>
                            <span className="text-gray-300">•</span>
                            <Link
                                href="/subscribe/dashboard"
                                className="text-indigo hover:text-indigo/80 transition-colors font-satoshi font-medium"
                            >
                                Dashboard
                            </Link>
                        </div>
                    </div>

                    {/* Info Card */}
                    <div className="mt-8 bg-gradient-to-r from-indigo/5 to-teal/5 rounded-2xl p-6 border border-indigo/10">
                        <div className="flex items-start gap-4">
                            <div className="w-10 h-10 rounded-full bg-indigo/10 flex items-center justify-center flex-shrink-0">
                                <svg className="w-5 h-5 text-indigo" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                                </svg>
                            </div>
                            <div>
                                <h4 className="font-bold text-indigo mb-2 font-satoshi">Need Help?</h4>
                                <p className="text-sm text-gray font-satoshi">
                                    Have questions about your subscription or billing? Contact our support team at support@tapiq.com
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <CreditPurchaseModal
                isOpen={showCreditPurchase}
                onClose={() => { setShowCreditPurchase(false); }}
            />
        </>
    );
}