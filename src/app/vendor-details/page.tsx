"use client";
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
import type { VendorSearchResponse, VendorResult } from '@/lib/api/verification.api';

export default function VendorDetails() {
  const router = useRouter();
  const { session } = useSessionStore();
  const [searchValue, setSearchValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [notification, setNotification] = useState<{
    message: string;
    type: 'success' | 'error';
  } | null>(null);
  const [selectedVendor, setSelectedVendor] = useState<VendorResult | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

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

    if (storedResults && storedQuery) {
      try {
        const results: VendorSearchResponse = JSON.parse(storedResults);
        setSearchQuery(storedQuery);

        if (results.results.length > 0) {
          setSelectedVendor(results.results[0]);
        } else {
          showNotification('No vendor data found', 'error');
          router.push('/verify');
        }
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

  const handleSearch = () => {
    if (!session) {
      showNotification('Please sign in to search for vendors', 'error');
      router.push(`/auth/login?callbackUrl=${encodeURIComponent('/verify')}`);
      return;
    }

    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      router.push("/verify");
    }, 500);
  };

  const handleNewSearch = () => {
    setSearchValue("");
    router.push("/verify");
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchValue(e.target.value);
  };

  const handleReportVendor = () => {
    if (!session) {
      showNotification('Please sign in to report a vendor', 'error');
      router.push(`/auth/login?callbackUrl=${encodeURIComponent('/report')}`);
      return;
    }

    if (selectedVendor) {
      // Pre-fill the report form with vendor info
      if (typeof window !== 'undefined') {
        const vendorData = {
          businessOrVendorName: selectedVendor.businessName,
          phoneNumber: selectedVendor.phoneNumber,
          bankName: selectedVendor.bankName,
          accountNumber: selectedVendor.accountNumber
        };
        sessionStorage.setItem('prefilledVendorData', JSON.stringify(vendorData));
      }
    }

    router.push('/report');
  };

  // Format vendor data for display
  const vendorData = useMemo(() => {
    if (!selectedVendor) return [];

    return [{
      id: 1,
      vendorName: selectedVendor.businessName || 'Unknown Vendor',
      reports: selectedVendor.reportsCount || 0,
      riskLevel: selectedVendor.riskLevel || 'Unknown',
      status: selectedVendor.status || 'unknown'
    }];
  }, [selectedVendor]);

  const getRiskColor = (riskLevel: string) => {
    switch (riskLevel?.toLowerCase()) {
      case 'low': return 'text-green-500';
      case 'medium': return 'text-yellow-500';
      case 'high': return 'text-orange-500';
      case 'critical': return 'text-red-500';
      default: return 'text-gray-500';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'under_review': return 'Under Review';
      case 'confirmed': return 'Confirmed Scam';
      case 'resolved': return 'Resolved';
      default: return 'Unknown Status';
    }
  };

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

  if (!selectedVendor) {
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

      <div className="space-y-4">
        <WhatThisMeans
          childeren={
            <div>
              <h3 className="font-bold text-lg mb-4">CAUTION: Report Found!</h3>
              <p className="font-satoshi">
                This vendor or message has been flagged for suspicious activity.
                Please proceed with caution.
              </p>
            </div>
          }
        />

        <div className="flex items-center gap-2 font-satoshi">
          <img src="/assets/tooltips.svg" className="h-5 w-5" alt="tooltip" />
          <div className="border-l border-l-teal border-l-solid pl-2 flex flex-col items-start">
            <p className="text-sm text-gray">Searched:</p>
            <p className="text-sm font-bold text-indigo">{searchQuery}</p>
            {selectedVendor.phoneNumber && (
              <p className="text-sm text-gray">{selectedVendor.phoneNumber}</p>
            )}
          </div>
        </div>

        {/* Enhanced Vendor Detail Display */}
        <div className="bg-white rounded-lg p-6 border border-gray-200">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">{selectedVendor.businessName}</h3>

              <div className="space-y-3 mb-4">
                <div className="flex items-center gap-2">
                  <span className="text-gray-500 text-sm">Risk Level:</span>
                  <span className={`font-semibold ${getRiskColor(selectedVendor.riskLevel)}`}>
                    {selectedVendor.riskLevel || 'Unknown'}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-gray-500 text-sm">Status:</span>
                  <span className="font-semibold text-gray-800">
                    {getStatusText(selectedVendor.status)}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-gray-500 text-sm">Reports:</span>
                  <span className="font-semibold text-gray-800">{selectedVendor.reportsCount}</span>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-gray-500 text-sm">Fraud Score:</span>
                  <span className="font-semibold text-gray-800">{selectedVendor.fraudScore || 'N/A'}</span>
                </div>
              </div>
            </div>

            <div>
              <h4 className="font-semibold text-gray-800 mb-3">Contact Information</h4>
              <div className="space-y-2 text-sm">
                {selectedVendor.phoneNumber && (
                  <div>
                    <span className="text-gray-500">Phone:</span>
                    <span className="ml-2 font-medium">{selectedVendor.phoneNumber}</span>
                  </div>
                )}

                {selectedVendor.bankName && (
                  <div>
                    <span className="text-gray-500">Bank:</span>
                    <span className="ml-2 font-medium">{selectedVendor.bankName}</span>
                  </div>
                )}

                {selectedVendor.accountNumber && (
                  <div>
                    <span className="text-gray-500">Account:</span>
                    <span className="ml-2 font-medium">{selectedVendor.accountNumber}</span>
                  </div>
                )}

                {selectedVendor.patterns?.paymentChannels && selectedVendor.patterns.paymentChannels.length > 0 && (
                  <div>
                    <span className="text-gray-500">Payment Methods:</span>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {selectedVendor.patterns.paymentChannels.map((channel, index) => (
                        <span key={index} className="bg-blue-100 text-blue-700 px-2 py-1 rounded-full text-xs">
                          {channel}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Display patterns and trends */}
        {selectedVendor.patterns && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <h4 className="font-semibold text-yellow-800 mb-2">Pattern Analysis</h4>
            <div className="text-sm text-yellow-700">
              <p className="mb-1">
                <span className="font-medium">Common Scam:</span> {selectedVendor.patterns.commonScam || 'Not specified'}
              </p>
              <p>
                <span className="font-medium">Activity Trend:</span> {selectedVendor.trend || 'Not available'}
              </p>
            </div>
          </div>
        )}

        <Warning vendorData={vendorData} />
        <Share />

        <div className="flex items-center gap-4">
          <img src="/assets/experience-icon.svg" className="h-8 w-8" alt="Experience icon" />
          <p className="text-primary font-medium">Had an Experience?</p>
        </div>

        <div className="bg-white py-6">
          <h2 className="text-2xl font-semibold text-indigo px-6">Learn more</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {trendCards.map((card) => (
              <div key={card.id} className="bg-white rounded-xl p-6">
                {/* Image */}
                <div className="mb-4 rounded-lg overflow-hidden">
                  <Image
                    src={card.image}
                    alt={card.title}
                    width={400}
                    height={250}
                    className="w-full h-48 object-cover"
                  />
                </div>

                <h3 className="text-xl md:text-2xl font-semibold text-indigo mb-3">
                  {card.title}
                </h3>
                <p className="text-gray md:text-lg mb-4 leading-relaxed">
                  {card.description}
                </p>
                <Link
                  href={`/trends/${card.id}`}
                  className="inline-flex items-center underline text-[#185CBC] font-medium hover:text-[#134a9c] transition-colors"
                >
                  Read now
                </Link>
              </div>
            ))}
          </div>
        </div>

        <div className="flex flex-col gap-4 mb-30">
          <div className="flex w-full items-center mt-6 gap-4">
            <div className="w-full">
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
                {isLoading ? 'Loading...' : 'New Search'}
              </Button>
            </div>


          </div>
        </div>
      </div>
    </>
  );
}