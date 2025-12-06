'use client';
import { Button } from "@/components/ui/button";
import Loader from "@/components/ui/Loader";
import TextInput from "@/components/ui/TextInput";
import VendorDetail from "@/components/ui/VendorDetails/VendorDetail";
import Warning from "@/components/ui/VendorDetails/Warning";
import SafeTips from "@/components/ui/VerifyComponent/SafeTips";
import Status from "@/components/ui/VerifyComponent/Status";
import VendorTable from "@/components/ui/VerifyComponent/VendorTable";
import WhatThisMeans from "@/components/ui/VerifyComponent/WhatThisMeans";
import { LuFacebook } from "react-icons/lu";
import { useEffect, useState, useMemo } from "react";
import Share from "@/components/ui/VendorDetails/Share";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useSessionStore } from "@/stores/useSessionStore";
import { Notification } from "@/components/Reusable/Notification";
import type { VendorSearchResponse, isPremiumResponse } from '@/lib/api/verification.api';
import {
  Shield,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Clock,
  BarChart,
  Banknote,
  History,
  Database,
  BadgeCheck,
  TrendingUp,
  Users,
  CreditCard,
  FileText,
  Phone,
  User,
  Globe,
  ShieldAlert,
  ArrowLeft,
  Info
} from "lucide-react";

export default function VendorDetails() {
  const router = useRouter();
  const { session } = useSessionStore();
  const [searchValue, setSearchValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [notification, setNotification] = useState<{
    message: string;
    type: 'success' | 'error';
  } | null>(null);
  const [vendorData, setVendorData] = useState<VendorSearchResponse | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [isPremiumUser, setIsPremiumUser] = useState(false);

  const showNotification = (message: string, type: 'success' | 'error') => {
    setNotification({ message, type });
  };

  const hideNotification = () => {
    setNotification(null);
  };

  // Load vendor data from session storage
  useEffect(() => {
    const storedResults = sessionStorage.getItem('vendorResults');
    const storedQuery = sessionStorage.getItem('searchQuery');
    const subscription = sessionStorage.getItem('searchSubscription');

    if (storedResults && storedQuery) {
      try {
        const results: VendorSearchResponse = JSON.parse(storedResults);
        setVendorData(results);
        setSearchQuery(storedQuery);

        // Check if user is premium
        setIsPremiumUser(subscription === 'Pro' || subscription === 'Enterprise');
      } catch (error) {
        console.error('Error parsing stored results:', error);
        showNotification('Error loading vendor data', 'error');
        router.push('/verify');
      }
    } else {
      showNotification('No search results found. Please search for a vendor first.', 'error');
      router.push('/verify');
    }
  }, [router]);

  // Helper functions to get data from either structure
  const getBusinessName = () => {
    return vendorData?.businessName || vendorData?.businessInfo?.businessName || 'Unknown Vendor';
  };

  const getPhoneNumber = () => {
    return vendorData?.phoneNumber || vendorData?.businessInfo?.phoneNumber || 'Not provided';
  };

  const getBankName = () => {
    return vendorData?.bankName || vendorData?.businessInfo?.bankName || 'Not specified';
  };

  const getAccountNumber = () => {
    return vendorData?.accountNumber || vendorData?.businessInfo?.accountNumber || 'Not provided';
  };

  const getSocialMediaHandle = () => {
    return vendorData?.socialMediaHandle || vendorData?.businessInfo?.socialMediaHandle;
  };

  const getPlatform = () => {
    return vendorData?.platform || vendorData?.businessInfo?.platform;
  };

  const getRiskLevel = () => {
    return vendorData?.riskLevel || vendorData?.riskAssessment?.level || 'Unknown';
  };

  const getReportsCount = () => {
    return vendorData?.reportsCount || vendorData?.severityProfile?.totalReports || 0;
  };

  const getFraudScore = () => {
    return vendorData?.fraudScore || vendorData?.fraudScoreBreakdown?.total || 0;
  };

  const getLinkedVendors = () => {
    return vendorData?.linkedVendors || vendorData?.linkedEntities?.linkedVendorsCount || 0;
  };

  const getTrend = () => {
    return vendorData?.trend || vendorData?.timelineAnalysis?.trend || 'Not available';
  };

  const getEvidenceStrength = () => {
    return vendorData?.evidenceStrength || 'Not available';
  };

  const getCommonScam = () => {
    return vendorData?.patterns?.commonScam || 'Not specified';
  };

  const getPaymentChannels = () => {
    return vendorData?.patterns?.paymentChannels || [];
  };

  // Check if this is a premium response
  const isPremiumResponse = (data: VendorSearchResponse): boolean => {
    return !!data.riskAssessment || !!data.metadata || !!data.verificationStatus;
  };
  const hasPremiumData = isPremiumResponse(vendorData || {});
  const isPremiumData = vendorData ? hasPremiumData : false;

  const handleBackToSearch = () => {
    router.push('/verify');
  };

  const handleNewSearch = () => {
    router.push("/verify");
  };

  const handleReportVendor = () => {
    if (!session) {
      showNotification('Please sign in to report a vendor', 'error');
      router.push(`/auth/login?callbackUrl=${encodeURIComponent('/report-vendor')}`);
      return;
    }

    if (vendorData) {
      // Pre-fill the report form with vendor info
      if (typeof window !== 'undefined') {
        const vendorFormData = {
          businessOrVendorName: getBusinessName(),
          phoneNumber: getPhoneNumber(),
          bankName: getBankName(),
          accountNumber: getAccountNumber(),
          socialMediaHandle: getSocialMediaHandle(),
          platform: getPlatform()
        };
        sessionStorage.setItem('prefilledVendorData', JSON.stringify(vendorFormData));
      }
    }

    router.push('/report-vendor');
  };

  // Helper functions
  const getRiskColor = (riskLevel: string) => {
    switch (riskLevel?.toLowerCase()) {
      case 'very low': return 'text-green-300';
      case 'low': return 'text-green-500';
      case 'medium': return 'text-yellow-500';
      case 'high': return 'text-orange-500';
      case 'critical': return 'text-red-500';
      default: return 'text-gray-500';
    }
  };

  const getRiskBgColor = (riskLevel: string) => {
    switch (riskLevel?.toLowerCase()) {
      case 'very low': return 'bg-green-300';
      case 'low': return 'bg-green-500';
      case 'medium': return 'bg-yellow-500';
      case 'high': return 'bg-orange-500';
      case 'critical': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const getStatusText = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'under_review': return 'Under Review';
      case 'confirmed': return 'Confirmed';
      case 'resolved': return 'Resolved';
      case 'pending': return 'Pending';
      case 'verified': return 'Verified';
      default: return status?.replace('_', ' ') || 'Unknown';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'under_review':
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'confirmed': return 'bg-red-100 text-red-800';
      case 'resolved':
      case 'verified': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getVerificationIcon = (icon: string) => {
    switch (icon) {
      case 'check': return <CheckCircle className="w-4 h-4" />;
      case 'times': return <XCircle className="w-4 h-4" />;
      case 'clock': return <Clock className="w-4 h-4" />;
      default: return <Clock className="w-4 h-4" />;
    }
  };

  const getVerificationClass = (status: string) => {
    switch (status) {
      case 'verified': return 'bg-green-100 text-green-800';
      case 'unverified': return 'bg-red-100 text-red-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const renderPremiumSection = (title: string, icon: React.ReactNode, children: React.ReactNode) => {
    if (!isPremiumUser) return null;

    return (
      <div className="border-2 border-primary rounded-xl p-5 bg-gradient-to-r from-primary/5 to-transparent mb-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="bg-primary p-2 rounded-lg">
            <div className="text-white">{icon}</div>
          </div>
          <div>
            <h4 className="font-bold text-gray-800">{title}</h4>
            <div className="flex items-center gap-2 mt-1">
              <span className="text-xs px-2 py-1 bg-gradient-to-r from-primary to-teal-500 text-white rounded-full">
                PREMIUM
              </span>
              <span className="text-xs text-primary font-medium">Exclusive insights</span>
            </div>
          </div>
        </div>
        {children}
      </div>
    );
  };

  // Format vendor data for display
  const vendorTableData = useMemo(() => {
    if (!vendorData) return [];

    return [{
      id: 1,
      vendorName: getBusinessName(),
      reports: getReportsCount(),
      riskLevel: getRiskLevel(),
      status: vendorData?.status || vendorData?.verificationStatus?.status || 'unknown',
      vendorData: vendorData
    }];
  }, [vendorData]);

  interface TrendCard {
    id: string;
    title: string;
    description: string;
    shortDescription: string;
    image: string;
  }

  const trendCards: TrendCard[] = [
    {
      id: "scam-prevention-guide",
      title: "Scam Prevention Guide",
      description: "Highlighting the most dangerous scam of the week to stay alert.",
      shortDescription: "Learn to identify and avoid the latest scam tactics",
      image: "/assets/1.png",
    },
    {
      id: "safe-payment-methods",
      title: "Safe Payment Methods",
      description: "Highlighting the most dangerous scam of the week to stay alert.",
      shortDescription: "Secure your financial transactions online",
      image: "/assets/2.png",
    },
    {
      id: "fraud-prevention-tips",
      title: "Fraud Prevention Tips",
      description: "Highlighting the most dangerous scam of the week to stay alert.",
      shortDescription: "Essential tips to protect yourself from fraud",
      image: "/assets/3.png",
    },
  ];

  if (!vendorData) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader />
        <span className="ml-2 text-gray">Loading vendor details...</span>
      </div>
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

      <div className="space-y-6">
        {/* Header with Back Button */}
        <div className="flex items-center justify-between">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleBackToSearch}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Search
          </Button>

          {/* Premium User Badge */}
          {isPremiumUser && (
            <span className="px-3 py-1 bg-gradient-to-r from-primary to-teal-500 text-white text-sm rounded-full flex items-center gap-2">
              <BadgeCheck className="w-4 h-4" />
              Premium User
            </span>
          )}
        </div>

        <WhatThisMeans
          children={
            <div>
              <h3 className="font-bold text-lg mb-4">{vendorData.pageTitle || 'Vendor Verification Results'}</h3>
              <p className="font-satoshi">
                This vendor has been analyzed for potential risks and suspicious activities.
                {getReportsCount() > 0
                  ? ` ${getReportsCount()} report(s) have been filed against this vendor.`
                  : ' No reports have been filed against this vendor.'
                }
              </p>
            </div>
          }
        />

        <div className="flex items-center gap-2 font-satoshi">
          <img src="/assets/tooltips.svg" className="h-5 w-5" alt="tooltip" />
          <div className="border-l border-l-teal border-l-solid pl-2 flex flex-col items-start">
            <p className="text-sm text-gray">Searched:</p>
            <p className="text-sm font-bold text-indigo">{searchQuery}</p>
            {getPhoneNumber() !== 'Not provided' && (
              <p className="text-sm text-gray">{getPhoneNumber()}</p>
            )}
          </div>
        </div>

        {/* Enhanced Vendor Detail Display */}
        <div className="bg-white rounded-lg p-6 border border-gray-200 shadow-sm">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">{getBusinessName()}</h3>

              <div className="space-y-4 mb-6">
                <div className="flex items-center gap-3">
                  <Shield className="w-5 h-5 text-gray-400" />
                  <div>
                    <span className="text-gray-500 text-sm">Risk Level:</span>
                    <span className={`ml-2 font-semibold text-lg ${getRiskColor(getRiskLevel())}`}>
                      {getRiskLevel()}
                    </span>
                  </div>
                </div>

                {(vendorData.verificationStatus || vendorData.status) && (
                  <div className="flex items-center gap-3">
                    <Clock className="w-5 h-5 text-gray-400" />
                    <div>
                      <span className="text-gray-500 text-sm">Status:</span>
                      <span className="ml-2 font-semibold text-gray-800">
                        {getStatusText(vendorData.verificationStatus?.status || vendorData.status || '')}
                      </span>
                    </div>
                  </div>
                )}

                <div className="flex items-center gap-3">
                  <AlertTriangle className="w-5 h-5 text-gray-400" />
                  <div>
                    <span className="text-gray-500 text-sm">Reports:</span>
                    <span className="ml-2 font-semibold text-gray-800">
                      {getReportsCount()}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <BarChart className="w-5 h-5 text-gray-400" />
                  <div>
                    <span className="text-gray-500 text-sm">Fraud Score:</span>
                    <span className="ml-2 font-semibold text-gray-800">
                      {getFraudScore()}
                    </span>
                  </div>
                </div>

                {vendorData.evidenceStrength && (
                  <div className="flex items-center gap-3">
                    <Info className="w-5 h-5 text-gray-400" />
                    <div>
                      <span className="text-gray-500 text-sm">Evidence Strength:</span>
                      <span className="ml-2 font-semibold text-gray-800">
                        {getEvidenceStrength()}
                      </span>
                    </div>
                  </div>
                )}
              </div>

              {/* Risk Assessment Bar */}
              <div className="mb-6">
                <div className="flex justify-between mb-2">
                  <span className="text-sm font-medium text-gray-700">Risk Assessment</span>
                  {isPremiumData && vendorData.riskAssessment?.score && (
                    <span className="text-sm font-bold text-gray-900">Score: {vendorData.riskAssessment.score}/10</span>
                  )}
                </div>
                <div className="h-3 bg-gray-200 rounded-full overflow-hidden">
                  <div
                    className={`h-full transition-all duration-1000 ease-in-out ${getRiskBgColor(getRiskLevel())}`}
                    style={{
                      width: isPremiumData && vendorData.riskAssessment?.score
                        ? `${(vendorData.riskAssessment.score / 10) * 100}%`
                        : getRiskLevel() === 'Very Low' ? '25%'
                          : getRiskLevel() === 'Low' ? '25%'
                            : getRiskLevel() === 'Medium' ? '50%'
                              : getRiskLevel() === 'High' ? '75%'
                                : getRiskLevel() === 'Critical' ? '100%'
                                  : '50%'
                    }}
                  ></div>
                </div>
                {isPremiumData && vendorData.riskAssessment?.description && (
                  <p className="text-sm text-gray-600 mt-2">{vendorData.riskAssessment.description}</p>
                )}
              </div>
            </div>

            <div>
              <h4 className="font-semibold text-gray-800 mb-4 flex items-center gap-2 text-lg">
                <User className="w-5 h-5" />
                Contact Information
              </h4>
              <div className="space-y-4 text-sm">
                <div className="flex items-center gap-3">
                  <Phone className="w-5 h-5 text-gray-400" />
                  <div>
                    <span className="text-gray-500">Phone:</span>
                    <span className="ml-3 font-medium text-gray-900">{getPhoneNumber()}</span>
                  </div>
                </div>

                {getBankName() !== 'Not specified' && (
                  <div className="flex items-center gap-3">
                    <CreditCard className="w-5 h-5 text-gray-400" />
                    <div>
                      <span className="text-gray-500">Bank:</span>
                      <span className="ml-3 font-medium text-gray-900">{getBankName()}</span>
                    </div>
                  </div>
                )}

                {getAccountNumber() !== 'Not provided' && (
                  <div className="flex items-center gap-3">
                    <FileText className="w-5 h-5 text-gray-400" />
                    <div className="flex items-center group relative">
                      <span className="text-gray-500 whitespace-nowrap">Account:</span>
                      <span className="ml-3 font-medium text-gray-900 truncate hover:overflow-x-auto hover:whitespace-nowrap">
                        {getAccountNumber()}
                      </span>
                    </div>
                  </div>
                )}

                {getSocialMediaHandle() && (
                  <div className="flex items-center gap-3">
                    <Users className="w-5 h-5 text-gray-400" />
                    <div>
                      <span className="text-gray-500">Social Media:</span>
                      <span className="ml-3 font-medium text-gray-900">{getSocialMediaHandle()}</span>
                    </div>
                  </div>
                )}

                {getPlatform() && (
                  <div className="flex items-center gap-3">
                    <Globe className="w-5 h-5 text-gray-400" />
                    <div>
                      <span className="text-gray-500">Platform:</span>
                      <span className="ml-3 font-medium text-gray-900">{getPlatform()}</span>
                    </div>
                  </div>
                )}

                {getPaymentChannels().length > 0 && (
                  <div className="mt-3">
                    <span className="text-gray-500">Payment Methods:</span>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {getPaymentChannels().map((channel, index) => (
                        <span key={index} className="bg-blue-100 text-blue-700 px-2 py-1 rounded-full text-xs">
                          {channel}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Quick Stats */}
              <div className="grid grid-cols-2 gap-4 mt-6">
                <div className="bg-gray-50 p-4 rounded-lg text-center">
                  <div className="text-2xl font-bold text-gray-900">
                    {getReportsCount()}
                  </div>
                  <div className="text-xs text-gray-500">Total Reports</div>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg text-center">
                  <div className="text-2xl font-bold text-gray-900">
                    {getLinkedVendors()}
                  </div>
                  <div className="text-xs text-gray-500">Linked Vendors</div>
                </div>
              </div>
            </div>
          </div>

          {/* Common Scam Info */}
          {getCommonScam() !== 'Not specified' && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mt-6">
              <h4 className="font-semibold text-yellow-800 mb-2 flex items-center gap-2">
                <AlertTriangle className="w-4 h-4" />
                Common Scam Pattern
              </h4>
              <div className="text-sm text-yellow-700">
                <p className="mb-1">
                  <span className="font-medium">Type:</span> {getCommonScam()}
                </p>
                {getTrend() !== 'Not available' && (
                  <p>
                    <span className="font-medium">Activity Trend:</span> {getTrend()}
                  </p>
                )}
              </div>
            </div>
          )}

          {/* Premium Sections */}
          {isPremiumUser && vendorData.verificationStatus && (
            renderPremiumSection(
              'Verification Status',
              <ShieldAlert className="w-5 h-5" />,
              <div className="space-y-4">
                <div className={`p-4 rounded-lg ${vendorData.verificationStatus.color === 'yellow' ? 'bg-yellow-50 border border-yellow-200' :
                  vendorData.verificationStatus.color === 'green' ? 'bg-green-50 border border-green-200' :
                    vendorData.verificationStatus.color === 'red' ? 'bg-red-50 border border-red-200' : 'bg-gray-50'
                  }`}>
                  <div className="flex items-center gap-3 mb-3">
                    {getVerificationIcon(vendorData.verificationStatus.icon)}
                    <span className="font-semibold text-lg">{vendorData.verificationStatus.status.replace('_', ' ')}</span>
                  </div>
                  <p className="text-gray-700">{vendorData.verificationStatus.message}</p>
                </div>
              </div>
            )
          )}

          {isPremiumUser && vendorData.fraudScoreBreakdown && (
            renderPremiumSection(
              'Fraud Score Analysis',
              <BarChart className="w-5 h-5" />,
              <div className="space-y-4">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="text-center p-4 bg-white rounded-lg border border-gray-200">
                    <div className="text-2xl font-bold text-gray-900">{vendorData.fraudScoreBreakdown.reportFrequencyScore}</div>
                    <div className="text-xs text-gray-500">Report Frequency</div>
                  </div>
                  <div className="text-center p-4 bg-white rounded-lg border border-gray-200">
                    <div className="text-2xl font-bold text-gray-900">{vendorData.fraudScoreBreakdown.severityScore}</div>
                    <div className="text-xs text-gray-500">Severity Score</div>
                  </div>
                  <div className="text-center p-4 bg-white rounded-lg border border-gray-200">
                    <div className="text-2xl font-bold text-gray-900">{vendorData.fraudScoreBreakdown.evidenceStrengthScore}</div>
                    <div className="text-xs text-gray-500">Evidence Strength</div>
                  </div>
                  <div className="text-center p-4 bg-white rounded-lg border border-gray-200">
                    <div className="text-2xl font-bold text-gray-900">{vendorData.fraudScoreBreakdown.paymentRiskScore}</div>
                    <div className="text-xs text-gray-500">Payment Risk</div>
                  </div>
                </div>
                <div className="bg-gradient-to-r from-purple-50 to-blue-50 p-4 rounded-lg border border-gray-200">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium text-gray-700">Total Fraud Score</span>
                    <span className="text-2xl font-bold text-primary">{vendorData.fraudScoreBreakdown.total}/20</span>
                  </div>
                  <div className="h-3 bg-gray-200 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-primary to-teal-500 rounded-full"
                      style={{ width: `${(vendorData.fraudScoreBreakdown.total / 20) * 100}%` }}
                    ></div>
                  </div>
                  <p className="text-sm text-gray-600 mt-2">{vendorData.fraudScoreBreakdown.explanation}</p>
                </div>
              </div>
            )
          )}

          {isPremiumUser && vendorData.paymentIntelligence && (
            renderPremiumSection(
              'Payment Intelligence',
              <Banknote className="w-5 h-5" />,
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Most Reported Bank:</span>
                    <span className="text-sm font-semibold">{vendorData.paymentIntelligence.mostReportedBank}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Wallet Reused:</span>
                    <span className={`text-sm font-semibold ${vendorData.paymentIntelligence.walletReusedAcrossMultipleReports ? 'text-red-600' : 'text-green-600'}`}>
                      {vendorData.paymentIntelligence.walletReusedAcrossMultipleReports ? 'Yes' : 'No'}
                    </span>
                  </div>
                  {vendorData.paymentIntelligence.walletReusedAcrossMultipleReports && (
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Reuse Count:</span>
                      <span className="text-sm font-semibold text-red-600">{vendorData.paymentIntelligence.reusedWalletReportCount}</span>
                    </div>
                  )}
                </div>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Blacklisted Account:</span>
                    <span className={`text-sm font-semibold ${vendorData.paymentIntelligence.isBlacklistedBankAccount ? 'text-red-600' : 'text-green-600'}`}>
                      {vendorData.paymentIntelligence.isBlacklistedBankAccount ? 'Yes' : 'No'}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Suspicious Activity:</span>
                    <span className="text-sm font-semibold text-gray-900">{vendorData.paymentIntelligence.suspiciousActivity}</span>
                  </div>
                </div>
              </div>
            )
          )}

          {isPremiumUser && vendorData.timelineAnalysis && (
            renderPremiumSection(
              'Timeline Analysis',
              <History className="w-5 h-5" />,
              <div className="space-y-4">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="text-center p-4 bg-white rounded-lg border border-gray-200">
                    <div className="text-2xl font-bold text-gray-900">{vendorData.timelineAnalysis.reportsLast7Days}</div>
                    <div className="text-xs text-gray-500">Last 7 Days</div>
                  </div>
                  <div className="text-center p-4 bg-white rounded-lg border border-gray-200">
                    <div className="text-2xl font-bold text-gray-900">{vendorData.timelineAnalysis.reportsLast30Days}</div>
                    <div className="text-xs text-gray-500">Last 30 Days</div>
                  </div>
                  <div className="text-center p-4 bg-white rounded-lg border border-gray-200">
                    <div className="text-2xl font-bold text-gray-900">{vendorData.timelineAnalysis.reportsLast90Days}</div>
                    <div className="text-xs text-gray-500">Last 90 Days</div>
                  </div>
                  <div className="text-center p-4 bg-white rounded-lg border border-gray-200 break-words">
                    <div className={`text-xl font-bold ${vendorData.timelineAnalysis.trend === 'Accelerating' ? 'text-red-600' :
                      vendorData.timelineAnalysis.trend === 'Stable' ? 'text-yellow-600' : 'text-green-600'
                      }`}>
                      {vendorData.timelineAnalysis.trend}
                    </div>
                    <div className="text-xs text-gray-500">Trend</div>
                  </div>
                </div>
                <div className="text-sm text-gray-600 space-y-2">
                  <p>First report: {vendorData.timelineAnalysis.firstReportDate}</p>
                  <p>Latest report: {vendorData.timelineAnalysis.latestReportDate}</p>
                  <p className="mt-2 font-medium text-gray-800">{vendorData.timelineAnalysis.fastestIncreasePeriod}</p>
                </div>
              </div>
            )
          )}

          {isPremiumUser && vendorData.metadata && (
            renderPremiumSection(
              'Analysis Details',
              <Database className="w-5 h-5" />,
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Confidence Score:</span>
                  <div className="flex items-center gap-3">
                    <span className="font-bold text-gray-900">{(vendorData.metadata.confidenceScore * 100).toFixed(1)}%</span>
                    <div className="w-32 h-3 bg-gray-200 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-primary to-teal-500 rounded-full"
                        style={{ width: `${vendorData.metadata.confidenceScore * 100}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
                <div>
                  <span className="text-sm text-gray-600">Data Sources:</span>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {vendorData.metadata.dataSources.map((source, index) => (
                      <span key={index} className="px-3 py-1 bg-blue-100 text-blue-700 text-xs rounded-full">
                        {source}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="text-sm text-gray-600">
                  <p>Last Updated: {new Date(vendorData.metadata.lastUpdated).toLocaleString()}</p>
                </div>
              </div>
            )
          )}

          {/* Important Notice */}
          {vendorData.importantNotice && (
            <div className="bg-yellow-50 border-l-4 border-yellow-600 p-5 rounded mt-8">
              <div className="flex">
                <div className="flex-shrink-0">
                  <Info className="text-yellow-600 w-5 h-5 mt-0.5" />
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-yellow-800 mb-2">{vendorData.importantNotice.title}</h3>
                  <p className="text-sm text-yellow-700 mb-3">
                    {vendorData.importantNotice.content}
                  </p>
                  <p className="text-sm text-yellow-700">
                    <strong>Disclaimer:</strong> {vendorData.importantNotice.disclaimer}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Non-premium notice */}
          {!isPremiumUser && isPremiumData && (
            <div className="bg-blue-50 border-l-4 border-blue-600 p-5 rounded mt-8">
              <div className="flex">
                <div className="flex-shrink-0">
                  <Info className="text-blue-600 w-5 h-5 mt-0.5" />
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-blue-800 mb-2">Premium Data Available</h3>
                  <p className="text-sm text-blue-700 mb-3">
                    This vendor has additional premium insights available. Upgrade your account to see detailed fraud analysis, timeline tracking, and payment intelligence.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        <Warning vendorData={vendorTableData} />
        <Share />

        <div className="flex items-center gap-4">
          <img src="/assets/experience-icon.svg" className="h-8 w-8" alt="Experience icon" />
          <p className="text-primary font-medium">Had an Experience?</p>
        </div>

        {/* Premium Upgrade CTA (for non-premium users) */}
        {!isPremiumUser && (
          <div className="p-6 bg-gradient-to-r from-primary to-teal-600 rounded-2xl text-center text-white">
            <h3 className="text-xl font-bold mb-2">Unlock Premium Insights</h3>
            <p className="mb-4 opacity-90">
              Get access to detailed fraud analysis, timeline tracking, payment intelligence, and advanced risk assessments.
            </p>
            <button
              onClick={() => router.push('/subscribe')}
              className="bg-white text-primary px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
            >
              Upgrade to Premium
            </button>
          </div>
        )}

        {/* Learn More Section */}
        <div className="bg-white py-6">
          <h2 className="text-2xl font-semibold text-indigo px-6">Learn more</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-4">
            {trendCards.map((card) => (
              <div key={card.id} className="bg-white rounded-xl p-6 border border-gray-200">
                <div className="mb-4 rounded-lg overflow-hidden">
                  <Image
                    src={card.image}
                    alt={card.title}
                    width={400}
                    height={250}
                    className="w-full h-48 object-cover"
                  />
                </div>
                <h3 className="text-xl font-semibold text-indigo mb-3">
                  {card.title}
                </h3>
                <p className="text-gray leading-relaxed">
                  {card.description}
                </p>
                <Link
                  href={`/trends/${card.id}`}
                  className="inline-flex items-center underline text-[#185CBC] font-medium hover:text-[#134a9c] transition-colors mt-4"
                >
                  Read now
                </Link>
              </div>
            ))}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col gap-4 mb-8">
          <div className="flex w-full items-center gap-4">
            <div className="flex-1">
              <Button
                variant="outline"
                size="lg"
                className="uppercase text-xs w-full"
                style={{
                  border: "1px solid",
                  borderImage: `
                    linear-gradient(180deg, rgba(255, 255, 255, 0.8) -25.96%, rgba(255, 255, 255, 0) 100%),
                    linear-gradient(270deg, rgba(255, 255, 255, 0) 12.54%, rgba(255, 255, 255, 0.8) 47.67%, rgba(255, 255, 255, 0) 82.8%)
                    1
                  `,
                }}
                onClick={handleNewSearch}
                disabled={isLoading}
              >
                New Search
              </Button>
            </div>
            <div className="flex-1">
              <Button
                variant="primary"
                size="lg"
                className="uppercase text-xs w-full"
                onClick={handleReportVendor}
              >
                Report This Vendor
              </Button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}