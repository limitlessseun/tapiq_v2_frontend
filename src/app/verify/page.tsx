"use client";
import { Button } from "@/components/ui/button";
import Loader from "@/components/ui/Loader";
import TextInput from "@/components/ui/TextInput";
import SafeTips from "@/components/ui/VerifyComponent/SafeTips";
import Status from "@/components/ui/VerifyComponent/Status";
import VendorTable from "@/components/ui/VerifyComponent/VendorTable";
import AnimatedModalLayout from "@/layout/animatedModalLayout";
import { useEffect, useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { searchVendors } from "@/lib/api/verification.api";
import { useSessionStore } from "@/stores/useSessionStore";
import { Notification } from "@/components/Reusable/Notification";
import type { VendorSearchResponse, VendorResult } from '@/lib/api/verification.api';

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
  const [searchResults, setSearchResults] = useState<VendorSearchResponse | null>(null);
  const [selectedVendor, setSelectedVendor] = useState<VendorResult | null>(null);

  const showNotification = (message: string, type: 'success' | 'error') => {
    setNotification({ message, type });
  };

  const hideNotification = () => {
    setNotification(null);
  };

  // Check for stored search results from VerificationInterface
  useEffect(() => {
    const storedResults = sessionStorage.getItem('vendorResults');
    const storedQuery = sessionStorage.getItem('searchQuery');

    if (storedResults && storedQuery) {
      const results = JSON.parse(storedResults);
      setSearchResults(results);
      setSearchValue(storedQuery);

      if (results.results.length > 0) {
        setSelectedVendor(results.results[0]);
      }

      // Clear storage to avoid showing same results on refresh
      sessionStorage.removeItem('vendorResults');
      sessionStorage.removeItem('searchQuery');
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
      const vendorResults = await searchVendors(searchValue.trim());
      setSearchResults(vendorResults);

      if (typeof window !== 'undefined') {
        sessionStorage.setItem('vendorResults', JSON.stringify(vendorResults));
        sessionStorage.setItem('searchQuery', searchValue.trim());
      }

      if (vendorResults.totalMatches > 0) {
        setSelectedVendor(vendorResults.results[0]);
        showNotification(`Found ${vendorResults.totalMatches} vendor match(es)`, 'success');
      } else {
        showNotification('No vendors found matching your search', 'success');
      }
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
    setSearchResults(null);
    setSelectedVendor(null);
    if (typeof window !== 'undefined') {
      sessionStorage.removeItem('vendorResults');
      sessionStorage.removeItem('searchQuery');
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchValue(e.target.value);
  };

  const handleViewVendorDetails = (vendor: any) => {
    if (!session) {
      showNotification('Please sign in to view vendor details', 'error');
      router.push(`/auth/login?callbackUrl=${encodeURIComponent('/verify')}`);
      return;
    }

    // Store the selected vendor in session storage and navigate to vendor scan page
    if (typeof window !== 'undefined') {
      sessionStorage.setItem('vendorResults', JSON.stringify({
        searchQuery: searchValue,
        totalMatches: 1,
        results: [vendor]
      }));
      sessionStorage.setItem('searchQuery', searchValue);
    }
    router.push('/vendor-details');
  };

  const handleReportVendor = () => {
    if (!session) {
      showNotification('Please sign in to report a vendor', 'error');
      router.push(`/auth/login?callbackUrl=${encodeURIComponent('/verify')}`);
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

  // Transform API results for VendorTable
  const tableData = useMemo(() => {
    if (!searchResults || searchResults.results.length === 0) {
      return [];
    }

    return searchResults.results.map((vendor, index) => ({
      id: index + 1, // Using index as ID since API doesn't provide ID
      vendorName: vendor.businessName || 'Unknown Vendor',
      reports: vendor.reportsCount || 0,
      riskLevel: vendor.riskLevel || 'Unknown',
      status: vendor.status || 'unknown',
      vendorData: vendor // Store full vendor data for details view
    }));
  }, [searchResults]);

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

        {searchResults && (
          <div className="text-sm text-gray-600 mb-4">
            Found {searchResults.totalMatches} vendor(s) matching "{searchValue}"
          </div>
        )}

        {!isLoading && searchResults && searchResults.totalMatches > 0 && (
          <div className="flex flex-col gap-4">
            {/* Vendor Selection if multiple results */}
            {searchResults.results.length > 1 && (
              <div className="bg-white rounded-lg p-4 border border-gray-200">
                <h3 className="font-semibold text-gray-800 mb-3">Select Vendor</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {searchResults.results.map((vendor, index) => (
                    <button
                      key={index}
                      onClick={() => setSelectedVendor(vendor)}
                      className={`p-3 rounded-lg border text-left transition-all ${selectedVendor === vendor
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 hover:border-gray-300'
                        }`}
                    >
                      <div className="font-medium text-gray-900">{vendor.businessName || 'Unknown'}</div>
                      <div className="text-sm text-gray-500">{vendor.phoneNumber || 'No phone'}</div>
                      <div className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium mt-1 ${vendor.status === 'confirmed' ? 'bg-red-100 text-red-800' :
                        vendor.status === 'under_review' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-gray-100 text-gray-800'
                        }`}>
                        {vendor.status?.replace('_', ' ') || 'unknown'}
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Show selected vendor details */}
            {selectedVendor && (
              <div className="bg-white rounded-lg p-4 border border-gray-200">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="font-bold text-lg text-gray-900">{selectedVendor.businessName}</h3>
                    <p className="text-gray-600 text-sm">Risk Level:
                      <span className={`ml-2 font-semibold ${selectedVendor.riskLevel === 'Low' ? 'text-green-600' :
                        selectedVendor.riskLevel === 'Medium' ? 'text-yellow-600' :
                          selectedVendor.riskLevel === 'High' ? 'text-orange-600' : 'text-red-600'
                        }`}>
                        {selectedVendor.riskLevel}
                      </span>
                    </p>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    className="text-xs"
                    onClick={() => handleViewVendorDetails(selectedVendor)}
                  >
                    View Details
                  </Button>
                </div>

                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div>
                    <span className="text-gray-500">Phone:</span>
                    <span className="ml-2 font-medium">{selectedVendor.phoneNumber || 'N/A'}</span>
                  </div>
                  <div>
                    <span className="text-gray-500">Reports:</span>
                    <span className="ml-2 font-medium">{selectedVendor.reportsCount}</span>
                  </div>
                  <div>
                    <span className="text-gray-500">Bank:</span>
                    <span className="ml-2 font-medium">{selectedVendor.bankName || 'N/A'}</span>
                  </div>
                  <div>
                    <span className="text-gray-500">Account:</span>
                    <span className="ml-2 font-medium">{selectedVendor.accountNumber || 'N/A'}</span>
                  </div>
                </div>
              </div>
            )}

            {/* Full results table */}
            <VendorTable
              data={tableData}
              onViewDetails={(item) => handleViewVendorDetails(item.vendorData)}
            />

            <SafeTips vendorData={tableData} />

            <div className="flex items-center mt-6 gap-4">
              <div className="">
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

            </div>
          </div>
        )}

        {!isLoading && searchResults && searchResults.totalMatches === 0 && (
          <div className="text-center py-8">
            <div className="text-gray-500 mb-4">No vendors found matching your search</div>
            <Button
              variant="outline"
              onClick={handleNewSearch}
            >
              Try New Search
            </Button>
          </div>
        )}

        {!isLoading && !searchResults && (
          <div className="text-center py-8 text-gray-500">
            Enter search terms above to verify a vendor
          </div>
        )}

        {showModal && (
          <AnimatedModalLayout>
            <ReportVendorModal
              closeModal={() => setShowModal(false)}
              vendorName={selectedVendor?.businessName || ''}
            />
          </AnimatedModalLayout>
        )}
      </div>
    </>
  );
}

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
      router.push(`/auth/login?callbackUrl=${encodeURIComponent('/report')}`);
      return;
    }

    closeModal();
    router.push('/report');
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