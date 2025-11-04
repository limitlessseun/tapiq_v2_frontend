"use client";
import { Button } from "@/components/ui/button";
import Loader from "@/components/ui/Loader";
import TextInput from "@/components/ui/TextInput";
import SafeTips from "@/components/ui/VerifyComponent/SafeTips";
import Status from "@/components/ui/VerifyComponent/Status";
import VendorTable from "@/components/ui/VerifyComponent/VendorTable";
import AnimatedModalLayout from "@/layout/animatedModalLayout";
import { useEffect, useState, useMemo } from "react";

export default function Verify() {
  const [showModal, setShowModal] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const vendorsData = [
    { id: 1234, vendorName: "Luxury Fashion Hub", reports: 23 },
    { id: 1235, vendorName: "Tech Gadgets Inc", reports: 15 },
    { id: 1236, vendorName: "Home Essentials Co", reports: 42 },
    { id: 1237, vendorName: "Sports Equipment Ltd", reports: 8 },
    { id: 1238, vendorName: "Beauty & Cosmetics", reports: 31 },
    { id: 1239, vendorName: "Bookstore Central", reports: 19 },
    { id: 1240, vendorName: "Kitchen Warehouse", reports: 27 },
    { id: 1241, vendorName: "Electronics Pro", reports: 12 },
  ];

  // Filter vendors based on search input
  const filteredVendors = useMemo(() => {
    if (!searchValue.trim()) {
      return vendorsData; // Return all vendors if no search term
    }

    const searchTerm = searchValue.toLowerCase().trim();

    return vendorsData.filter(
      (vendor) =>
        vendor.vendorName.toLowerCase().includes(searchTerm) ||
        vendor.id.toString().includes(searchTerm) ||
        vendor.reports.toString().includes(searchTerm)
    );
  }, [searchValue, vendorsData]);

  useEffect(() => {
    // You can add any side effects here
  }, []);

  const handleSearch = () => {
    setIsLoading(true);
    // Simulate API call or search processing
    setTimeout(() => {
      setIsLoading(false);
    }, 500);

    location.reload();
  };

  const handleNewSearch = () => {
    setSearchValue("");
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchValue(e.target.value);
  };

  return (
    <div className="space-y-4">
      <TextInput
        label=""
        type="search"
        placeholder="Enter vendor name, ID, or reports count"
        value={searchValue}
        onChange={handleInputChange}
      />

      <div className="flex items-center gap-2">
        <img src="/assets/tooltips.svg" className="h-5 w-5" alt="tooltip" />
        <p className="text-sm text-gray border-l border-l-teal border-l-solid pl-2 font-satoshi">
          Enter a vendor name, phone number, social media handle, or unique ID
          to search.
        </p>
      </div>

      {isLoading && (
        <div className="flex items-center justify-center">
          <Loader />
        </div>
      )}

      <div className="flex flex-col gap-4">
        <VendorTable data={filteredVendors} />

        {/* Show search results info
        {searchValue && (
          <div className="text-sm text-gray-600">
            Found {filteredVendors.length} vendor(s) matching "{searchValue}"
          </div>
        )} */}
        <SafeTips vendorData={filteredVendors} />

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
              onClick={() => {
                setShowModal(true);
              }}
            >
              Report This Vendor
            </Button>
          </div>
        </div>
      </div>

      {showModal && (
        <AnimatedModalLayout>
          <ReportVendorModal closeModal={() => setShowModal(false)} />
        </AnimatedModalLayout>
      )}
    </div>
  );
}

interface ReportVendorModalProps {
  closeModal: () => void;
}

const ReportVendorModal: React.FC<ReportVendorModalProps> = ({
  closeModal,
}) => {
  return (
    <div className="p-6 text-center flex flex-col items-center gap-2">
      <h3 className="font-bold text-indigo">
        Are you sure you want to add @luxurybags_ng to your Watchlist?{" "}
      </h3>

      <p className="text-gray text-sm">
        You won’t see any current reports, but if this vendor gets flagged in
        the future, you’ll receive real-time alerts to help you stay safe.{" "}
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
            Cancel{" "}
          </Button>
        </div>
        <div className="flex-1">
          <Button
            variant="primary"
            size="lg"
            className="uppercase text-xs w-full"
            onClick={() => {}}
          >
            Confirm{" "}
          </Button>
        </div>
      </div>
    </div>
  );
};
