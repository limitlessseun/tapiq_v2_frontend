import React, { useState } from "react";
import { Button } from "../button";
import AnimatedModalLayout from "@/layout/animatedModalLayout";
import { useRouter } from "next/navigation";
import { BadgeCheck, Shield, TrendingUp, Users, AlertTriangle, Clock, CreditCard } from "lucide-react";

interface VendorData {
  id: number;
  vendorName: string;
  reports: number;
  riskLevel?: string;
  status?: string;
  vendorData?: any; // Full vendor data object
}

interface VendorTableProps {
  data: VendorData[];
  onViewDetails?: (vendor: VendorData) => void;
  isPremiumUser?: boolean;
}

const VendorTable: React.FC<VendorTableProps> = ({
  data,
  onViewDetails,
  isPremiumUser = false
}) => {
  const handleAction = (vendor: VendorData) => {
    if (onViewDetails) {
      onViewDetails(vendor);
    }
  };

  const getRiskColor = (riskLevel?: string) => {
    switch (riskLevel?.toLowerCase()) {
      case 'very low': return 'bg-green-300 text-green-800';
      case 'low': return 'bg-green-100 text-green-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'high': return 'bg-orange-100 text-orange-800';
      case 'critical': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusColor = (status?: string) => {
    switch (status) {
      case 'under_review': return 'bg-yellow-100 text-yellow-800';
      case 'confirmed': return 'bg-red-100 text-red-800';
      case 'resolved': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status?: string) => {
    switch (status) {
      case 'under_review': return 'Under Review';
      case 'confirmed': return 'Confirmed';
      case 'resolved': return 'Resolved';
      case 'pending': return 'Pending';
      default: return status?.replace('_', ' ') || 'Unknown';
    }
  };

  return (
    <div>
      {data.length < 1 && (
        <div className="uppercase font-medium text-center p-6 text-primary font-satoshi">
          No Match Found - But That's Information Too!
        </div>
      )}
      {data.length > 0 && (
        <div className="p-2 rounded-lg bg-white">
          {/* Premium Badge */}
          {isPremiumUser && data.length > 0 && (
            <div className="mb-4 flex justify-end">
              <span className="px-3 py-1 bg-primary text-white text-sm rounded-full flex items-center gap-2">
                <BadgeCheck className="w-4 h-4" />
                Premium Analysis
              </span>
            </div>
          )}

          <div className="bg-cloudWhite p-6 font-satoshi">
            {/* Table Header */}
            <div className="grid grid-cols-12 gap-4 mb-3 px-2 text-sm font-medium text-gray-500">
              <div className="col-span-5">Vendor</div>
              <div className="col-span-2">Reports</div>
              <div className="col-span-3">Risk Level</div>
              <div className="col-span-2">Status</div>
            </div>

            {data.map((vendor) => (
              <TableItem
                key={vendor.id}
                vendor={vendor}
                action={handleAction}
                getRiskColor={getRiskColor}
                getStatusColor={getStatusColor}
                getStatusText={getStatusText}
                isPremiumUser={isPremiumUser}
              />
            ))}

            {/* Premium Summary (for premium users) */}
            {isPremiumUser && data.length > 0 && (
              <div className="mt-6 p-4 border-2 border-primary rounded-xl bg-primary">
                <div className="flex items-center gap-3 mb-3">
                  <div className="bg-primary p-2 rounded-lg">
                    <TrendingUp className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-800">Premium Analysis Summary</h4>
                    <div className="flex items-center gap-2">
                      <span className="text-xs px-2 py-1 bg-primary text-white rounded-full">PREMIUM</span>
                      <span className="text-xs text-white">Enhanced insights</span>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                  <div className="text-center">
                    <div className="text-xl font-bold text-gray-900">
                      {data.reduce((sum, vendor) => sum + vendor.reports, 0)}
                    </div>
                    <div className="text-xs text-gray-500">Total Reports</div>
                  </div>
                  <div className="text-center">
                    <div className="text-xl font-bold text-gray-900">
                      {data.filter(v => v.riskLevel?.toLowerCase() === 'high' || v.riskLevel?.toLowerCase() === 'critical').length}
                    </div>
                    <div className="text-xs text-gray-500">High Risk</div>
                  </div>
                  <div className="text-center">
                    <div className="text-xl font-bold text-gray-900">
                      {data.filter(v => v.status === 'under_review').length}
                    </div>
                    <div className="text-xs text-gray-500">Under Review</div>
                  </div>
                  <div className="text-center">
                    <div className="text-xl font-bold text-gray-900">{data.length}</div>
                    <div className="text-xs text-gray-500">Total Vendors</div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default VendorTable;

interface TableItemProps {
  vendor: VendorData;
  action: (vendor: VendorData) => void;
  getRiskColor: (riskLevel?: string) => string;
  getStatusColor: (status?: string) => string;
  getStatusText: (status?: string) => string;
  isPremiumUser: boolean;
}

const TableItem: React.FC<TableItemProps> = ({
  vendor,
  action,
  getRiskColor,
  getStatusColor,
  getStatusText,
  isPremiumUser
}) => {
  const router = useRouter();
  const [showModal, setShowModal] = useState(false);

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    action(vendor);
  };

  const handleRowClick = () => {
    if (vendor.vendorData) {
      // Store the selected vendor in session storage
      if (typeof window !== 'undefined') {
        sessionStorage.setItem('selectedVendor', JSON.stringify(vendor.vendorData));
      }
      router.push("/vendor-details");
    } else {
      action(vendor);
    }
  };

  // Check for premium data indicators
  const hasPremiumData = isPremiumUser && vendor.vendorData && (
    vendor.vendorData.timelineAnalysis ||
    vendor.vendorData.fraudScoreBreakdown ||
    vendor.vendorData.paymentIntelligence
  );

  return (
    <>
      <div
        className="grid grid-cols-12 gap-4 items-center py-4 px-2 border-b border-b-[#D9E6FF] border-b-solid hover:bg-blue-50 rounded-lg transition-colors cursor-pointer"
        onClick={handleRowClick}
      >
        {/* Vendor Name */}
        <div className="col-span-5">
          <div className="flex items-center gap-3">
            <div className="flex-shrink-0">
              <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                <span className="text-blue-600 font-semibold">
                  {vendor.vendorName.charAt(0).toUpperCase()}
                </span>
              </div>
            </div>
            <div>
              <p className="font-medium text-gray-900">{vendor.vendorName}</p>
              {hasPremiumData && (
                <div className="flex items-center gap-1 mt-1">
                  <BadgeCheck className="w-3 h-3 text-primary" />
                  <span className="text-xs text-primary">Premium Data Available</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Reports */}
        <div className="col-span-2">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-gray-400" />
            <span className="font-medium">{vendor.reports}</span>
            <span className="text-sm text-gray-500">reports</span>
          </div>
        </div>

        {/* Risk Level */}
        <div className="col-span-3">
          <div className="flex items-center gap-2">
            <Shield className="w-4 h-4 text-gray-400" />
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getRiskColor(vendor.riskLevel)}`}>
              {vendor.riskLevel || 'Unknown'}
            </span>
            {isPremiumUser && vendor.vendorData?.fraudScore && (
              <span className="text-xs text-gray-500">
                (Score: {vendor.vendorData.fraudScore})
              </span>
            )}
          </div>
        </div>

        {/* Status */}
        <div className="col-span-2">
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-gray-400" />
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(vendor.status)}`}>
              {getStatusText(vendor.status)}
            </span>
          </div>
        </div>



        {/* Premium Indicators Row */}
        {hasPremiumData && (
          <div className="col-span-12 mt-3">
            <div className="border-t border-primary pt-3">
              <div className="flex flex-wrap gap-4">
                {vendor.vendorData.timelineAnalysis && (
                  <div className="flex items-center gap-2">
                    <TrendingUp className="w-4 h-4 text-primary" />
                    <span className="text-xs text-gray-600">
                      Trend: {vendor.vendorData.timelineAnalysis.trend}
                    </span>
                  </div>
                )}
                {vendor.vendorData.linkedVendors > 0 && (
                  <div className="flex items-center gap-2">
                    <Users className="w-4 h-4 text-primary" />
                    <span className="text-xs text-gray-600">
                      {vendor.vendorData.linkedVendors} linked vendors
                    </span>
                  </div>
                )}
                {vendor.vendorData.bankName && (
                  <div className="flex items-center gap-2">
                    <CreditCard className="w-4 h-4 text-primary" />
                    <span className="text-xs text-gray-600">
                      Bank: {vendor.vendorData.bankName}
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>

      {showModal && (
        <AnimatedModalLayout>
          <ReportVendorModal
            closeModal={() => setShowModal(false)}
            vendorName={vendor.vendorName}
          />
        </AnimatedModalLayout>
      )}
    </>
  );
};

interface ReportVendorModalProps {
  closeModal: () => void;
  vendorName: string;
}

const ReportVendorModal: React.FC<ReportVendorModalProps> = ({
  closeModal,
  vendorName
}) => {
  const router = useRouter();

  const handleConfirm = () => {
    closeModal();
    router.push('/report');
  };

  return (
    <div className="p-6 text-center flex flex-col items-center gap-2">
      <h3 className="font-bold text-indigo">
        Are you sure you want to add {vendorName || 'this vendor'} to your Watchlist?
      </h3>

      <p className="text-gray text-sm font-satoshi">
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