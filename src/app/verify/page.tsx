'use client';
import { Button } from "@/components/ui/button";
import Loader from "@/components/ui/Loader";
import TextInput from "@/components/ui/TextInput";
import SafeTips from "@/components/ui/VerifyComponent/SafeTips";
import Status from "@/components/ui/VerifyComponent/Status";
import VendorTable from "@/components/ui/VerifyComponent/VendorTable";
import AnimatedModalLayout from "@/layout/animatedModalLayout";
import { useEffect, useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { searchVendors, isPremiumResponse } from "@/lib/api/verification.api";
import { useSessionStore } from "@/stores/useSessionStore";
import { Notification } from "@/components/Reusable/Notification";
import type { VendorSearchResponse } from '@/lib/api/verification.api';
import { BadgeCheck, Shield, AlertTriangle, Clock, Users, CreditCard, Phone, TrendingUp, BarChart, Banknote, History, Database, Info } from "lucide-react";

export default function Verify() {
  const router = useRouter();
  const { session } = useSessionStore();
  const [showModal, setShowModal] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [notification, setNotification] = useState<{
    message: string;
    type: 'success' | 'error';
  } | null>(null);
  const [vendorData, setVendorData] = useState<VendorSearchResponse | null>(null);
  const [isPremiumUser, setIsPremiumUser] = useState(false);

  const showNotification = (message: string, type: 'success' | 'error') => {
    setNotification({ message, type });
  };

  const hideNotification = () => {
    setNotification(null);
  };

  // Check for stored search results
  useEffect(() => {
    const storedResults = sessionStorage.getItem('vendorResults');
    const storedQuery = sessionStorage.getItem('searchQuery');
    const subscription = sessionStorage.getItem('searchSubscription');

    if (storedResults && storedQuery) {
      try {
        const results = JSON.parse(storedResults);
        setVendorData(results);
        setSearchValue(storedQuery);

        // Check if user is premium
        setIsPremiumUser(subscription === 'Pro' || subscription === 'Enterprise');

        // Clear storage to avoid showing same results on refresh
        sessionStorage.removeItem('vendorResults');
        sessionStorage.removeItem('searchQuery');
        sessionStorage.removeItem('searchSubscription');
      } catch (error) {
        console.error('Error parsing stored results:', error);
        showNotification('Error loading vendor data', 'error');
      }
    }
  }, []);

  const handleSearch = async () => {
    // Check if user is signed in
    if (!session) {
      showNotification('Please sign in to search for vendors', 'error');
      router.push(`/auth/login?callbackUrl=${encodeURIComponent('/verify')}`);
      return;
    }

    if (!searchValue.trim()) {
      showNotification('Please enter vendor details to search', 'error');
      return;
    }

    setIsLoading(true);

    try {
      const currentSubscription = session?.user?.subscription.name || 'Free';
      const vendorResult = await searchVendors(searchValue.trim(), currentSubscription);
      setVendorData(vendorResult);
      setIsPremiumUser(currentSubscription === 'Pro' || currentSubscription === 'Enterprise');

      console.log('Search result:', vendorResult);
      console.log('Is premium response?', isPremiumResponse(vendorResult));
      console.log('Subscription:', currentSubscription);

      if (typeof window !== 'undefined') {
        sessionStorage.setItem('vendorResults', JSON.stringify(vendorResult));
        sessionStorage.setItem('searchQuery', searchValue.trim());
        sessionStorage.setItem('searchSubscription', currentSubscription);
      }

      showNotification(`Vendor information retrieved successfully`, 'success');
    } catch (error: any) {
      console.error('Search error:', error);
      const errorMessage = error.response?.data?.message || error.message || 'An error occurred during search';
      showNotification(errorMessage, 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleNewSearch = () => {
    setSearchValue("");
    setVendorData(null);
    setIsPremiumUser(false);
    if (typeof window !== 'undefined') {
      sessionStorage.removeItem('vendorResults');
      sessionStorage.removeItem('searchQuery');
      sessionStorage.removeItem('searchSubscription');
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchValue(e.target.value);
  };

  const handleViewVendorDetails = () => {
    if (!session) {
      showNotification('Please sign in to view vendor details', 'error');
      router.push(`/auth/login?callbackUrl=${encodeURIComponent('/verify')}`);
      return;
    }

    if (!vendorData) return;

    // Store the vendor data in session storage and navigate to vendor details page
    if (typeof window !== 'undefined') {
      const subscription = sessionStorage.getItem('searchSubscription') || 'Free';
      sessionStorage.setItem('vendorResults', JSON.stringify(vendorData));
      sessionStorage.setItem('searchQuery', searchValue);
      sessionStorage.setItem('searchSubscription', subscription);
    }
    router.push('/vendor-details');
  };

  const handleReportVendor = () => {
    if (!session) {
      showNotification('Please sign in to report a vendor', 'error');
      router.push(`/auth/login?callbackUrl=${encodeURIComponent('/verify')}`);
      return;
    }

    if (vendorData) {
      // Pre-fill the report form with vendor info
      if (typeof window !== 'undefined') {
        const vendorFormData = {
          businessOrVendorName: vendorData.businessName || vendorData.businessInfo?.businessName || '',
          phoneNumber: vendorData.phoneNumber || vendorData.businessInfo?.phoneNumber || '',
          bankName: vendorData.bankName || vendorData.businessInfo?.bankName || '',
          accountNumber: vendorData.accountNumber || vendorData.businessInfo?.accountNumber || '',
          socialMediaHandle: vendorData.socialMediaHandle || vendorData.businessInfo?.socialMediaHandle || '',
          platform: vendorData.platform || vendorData.businessInfo?.platform || ''
        };
        sessionStorage.setItem('prefilledVendorData', JSON.stringify(vendorFormData));
      }
    }

    router.push('/report-vendor');
  };

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

  // Transform vendor data for display
  const tableData = useMemo(() => {
    if (!vendorData) return [];

    return [{
      id: 1,
      vendorName: getBusinessName(),
      reports: getReportsCount(),
      riskLevel: getRiskLevel(),
      status: vendorData?.status || vendorData?.verificationStatus?.status || 'unknown',
      vendorData: vendorData // Store full vendor data for details view
    }];
  }, [vendorData]);

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

  const getStatusText = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'under_review': return 'Under Review';
      case 'pending': return 'Pending';
      case 'confirmed': return 'Confirmed';
      case 'resolved': return 'Resolved';
      case 'verified': return 'Verified';
      default: return status?.replace('_', ' ') || 'Unknown';
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

  // Check if we have premium data in the response
  const hasPremiumData = isPremiumResponse(vendorData || {});

  return (
    <>
      {notification && (
        <Notification
          message={notification.message}
          type={notification.type}
          onClose={hideNotification}
        />
      )}

      <div className="space-y-4">
        {/* Premium User Badge */}
        {isPremiumUser && (
          <div className="flex justify-end mb-2">
            <span className="px-3 py-1 bg-gradient-to-r from-primary to-teal-500 text-white text-sm rounded-full flex items-center gap-2">
              <BadgeCheck className="w-4 h-4" />
              Premium User
            </span>
          </div>
        )}

        <div className="flex flex-col gap-2">
          <div className="flex w-full">
            <TextInput
              label=""
              type="search"
              className="w-full"
              placeholder="Enter phone, account number, crypto address, vendor name..."
              value={searchValue}
              onChange={handleInputChange}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  handleSearch();
                }
              }}
            />
          </div>
          <Button
            variant="primary"
            className="uppercase text-xs"
            onClick={handleSearch}
            disabled={isLoading || !searchValue.trim()}
          >
            {isLoading ? <Loader size="sm" /> : 'Search'}
          </Button>
        </div>

        <div className="flex items-center gap-2">
          <img src="/assets/tooltips.svg" className="h-5 w-5" alt="tooltip" />
          <p className="text-sm text-gray border-l border-l-teal border-l-solid pl-2 font-satoshi">
            Enter a vendor name, phone number, social media handle, or unique ID to search.
          </p>
        </div>

        {isLoading && (
          <div className="flex items-center justify-center py-8">
            <Loader />
            <span className="ml-2 text-gray">Searching vendors...</span>
          </div>
        )}

        {vendorData && (
          <div className="text-sm text-gray-600 mb-4">
            Vendor information retrieved for "{searchValue}"
          </div>
        )}

        {!isLoading && vendorData && (
          <div className="flex flex-col gap-4">
            {/* Show vendor details with premium indicators */}
            <div className="bg-white rounded-lg p-6 border border-gray-200">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="font-bold text-lg text-gray-900">{getBusinessName()}</h3>
                  <div className="flex items-center gap-4 mt-2">
                    <div className="flex items-center gap-1">
                      <Shield className="w-4 h-4 text-gray-400" />
                      <span className="text-gray-600 text-sm">Risk:</span>
                      <span className={`ml-1 font-semibold ${getRiskColor(getRiskLevel())}`}>
                        {getRiskLevel()}
                      </span>
                    </div>
                    <div className="flex items-center gap-1">
                      <AlertTriangle className="w-4 h-4 text-gray-400" />
                      <span className="text-gray-600 text-sm">Reports:</span>
                      <span className="ml-1 font-semibold text-gray-800">
                        {getReportsCount()}
                      </span>
                    </div>
                  </div>

                  {/* Status badge */}
                  <div className={`mt-3 inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(vendorData.status || vendorData.verificationStatus?.status || '')}`}>
                    <Clock className="w-3 h-3 mr-1" />
                    {getStatusText(vendorData.status || vendorData.verificationStatus?.status || '')}
                  </div>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  className="text-xs"
                  onClick={handleViewVendorDetails}
                >
                  View Full Details
                </Button>
              </div>

              <div className="grid grid-cols-2 gap-3 text-sm">
                <div className="flex items-center gap-2">
                  <Phone className="w-4 h-4 text-gray-400" />
                  <div>
                    <span className="text-gray-500">Phone:</span>
                    <span className="ml-2 font-medium">{getPhoneNumber()}</span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 text-gray-400" />
                  <div>
                    <span className="text-gray-500">Reports:</span>
                    <span className="ml-2 font-medium">{getReportsCount()}</span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <CreditCard className="w-4 h-4 text-gray-400" />
                  <div>
                    <span className="text-gray-500">Bank:</span>
                    <span className="ml-2 font-medium">{getBankName()}</span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Users className="w-4 h-4 text-gray-400" />
                  <div>
                    <span className="text-gray-500">Linked Vendors:</span>
                    <span className="ml-2 font-medium">{getLinkedVendors()}</span>
                  </div>
                </div>
              </div>

              {/* Additional Basic Info */}
              <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
                <div className="flex items-center gap-2">
                  <BarChart className="w-4 h-4 text-gray-400" />
                  <div>
                    <span className="text-gray-500">Fraud Score:</span>
                    <span className="ml-2 font-medium">{getFraudScore()}</span>
                  </div>
                </div>

                {vendorData.evidenceStrength && (
                  <div className="flex items-center gap-2">
                    <Info className="w-4 h-4 text-gray-400" />
                    <div>
                      <span className="text-gray-500">Evidence:</span>
                      <span className="ml-2 font-medium">{vendorData.evidenceStrength}</span>
                    </div>
                  </div>
                )}

                {vendorData.patterns?.commonScam && (
                  <div className="col-span-2">
                    <div className="flex items-center gap-2">
                      <AlertTriangle className="w-4 h-4 text-gray-400" />
                      <span className="text-gray-500">Common Scam:</span>
                      <span className="ml-2 font-medium">{vendorData.patterns.commonScam}</span>
                    </div>
                  </div>
                )}
              </div>

              {/* Premium data preview (only shown if user is premium AND data exists) */}
              {isPremiumUser && hasPremiumData && (
                <>
                  {vendorData.timelineAnalysis && (
                    <div className="mt-4 p-3 bg-primary-50 border border-primary rounded-lg">
                      <div className="flex items-center gap-2 mb-2">
                        <TrendingUp className="w-4 h-4 text-primary" />
                        <span className="text-sm font-medium text-primary">Trend Analysis</span>
                        <span className="text-xs px-2 py-1 bg-primary text-white rounded-full">PREMIUM</span>
                      </div>
                      <div className="grid grid-cols-3 gap-2 text-center">
                        <div>
                          <div className="font-bold text-gray-900">{vendorData.timelineAnalysis.reportsLast7Days}</div>
                          <div className="text-xs text-gray-600">Last 7 Days</div>
                        </div>
                        <div>
                          <div className="font-bold text-gray-900">{vendorData.timelineAnalysis.reportsLast30Days}</div>
                          <div className="text-xs text-gray-600">Last 30 Days</div>
                        </div>
                        <div>
                          <div className={`font-bold ${vendorData.timelineAnalysis.trend === 'Accelerating' ? 'text-red-600' :
                            vendorData.timelineAnalysis.trend === 'Stable' ? 'text-yellow-600' : 'text-green-600'
                            }`}>
                            {vendorData.timelineAnalysis.trend}
                          </div>
                          <div className="text-xs text-gray-600">Trend</div>
                        </div>
                      </div>
                    </div>
                  )}

                  {vendorData.fraudScoreBreakdown && (
                    <div className="mt-4 p-3 bg-primary-50 border border-primary rounded-lg">
                      <div className="flex items-center gap-2 mb-2">
                        <BarChart className="w-4 h-4 text-primary" />
                        <span className="text-sm font-medium text-primary">Fraud Score Breakdown</span>
                        <span className="text-xs px-2 py-1 bg-primary text-white rounded-full">PREMIUM</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-lg font-bold text-primary">{vendorData.fraudScoreBreakdown.total}/20</span>
                        <span className="text-sm text-gray-600">{vendorData.fraudScoreBreakdown.explanation}</span>
                      </div>
                    </div>
                  )}
                </>
              )}

              {/* Non-premium trend info */}
              {!isPremiumUser && vendorData.trend && (
                <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <TrendingUp className="w-4 h-4 text-yellow-600" />
                    <span className="text-sm font-medium text-yellow-800">Activity Trend</span>
                  </div>
                  <div className="text-center">
                    <div className={`text-lg font-bold ${vendorData.trend === 'Accelerating' ? 'text-red-600' :
                      vendorData.trend === 'Stable' ? 'text-yellow-600' : 'text-green-600'
                      }`}>
                      {vendorData.trend}
                    </div>
                    <p className="text-xs text-yellow-700 mt-1">
                      Reports show {vendorData.trend.toLowerCase()} activity pattern
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Full results table */}
            <VendorTable
              data={tableData}
              onViewDetails={() => handleViewVendorDetails()}
              isPremiumUser={isPremiumUser}
            />

            <SafeTips vendorData={tableData} />

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

            <div className="flex items-center mt-6 gap-4">
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
        )}

        {!isLoading && !vendorData && (
          <div className="text-center py-8 text-gray-500">
            Enter search terms above to verify a vendor
          </div>
        )}

        {showModal && (
          <AnimatedModalLayout>
            <ReportVendorModal
              closeModal={() => setShowModal(false)}
              vendorName={getBusinessName()}
            />
          </AnimatedModalLayout>
        )}
      </div>
    </>
  );
}

// ... Rest of the code (ReportVendorModal component remains the same)


interface ReportVendorModalProps {
  closeModal: () => void;
  vendorName: string;
}

const ReportVendorModal: React.FC<ReportVendorModalProps> = ({
  closeModal,
  vendorName
}) => {
  const router = useRouter();
  const { session } = useSessionStore();

  const handleConfirm = () => {
    if (!session) {
      closeModal();
      router.push(`/auth/login?callbackUrl=${encodeURIComponent('/report-vendor')}`);
      return;
    }

    closeModal();
    router.push('/report-vendor');
  };

  return (
    <div className="p-6 text-center flex flex-col items-center gap-2">
      <h3 className="font-bold text-indigo">
        Are you sure you want to add {vendorName || 'this vendor'} to your Watchlist?
      </h3>

      <p className="text-gray text-sm">
        You won't see any current reports, but if this vendor gets flagged in
        the future, you'll receive real-time alerts to help you stay safe.
      </p>

      <div className="flex items-center mt-6 gap-4 w-full">
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
            onClick={closeModal}
          >
            Cancel
          </Button>
        </div>
        <div className="flex-1">
          <Button
            variant="primary"
            size="lg"
            className="uppercase text-xs w-full"
            onClick={handleConfirm}
          >
            Confirm
          </Button>
        </div>
      </div>
    </div>
  );
};