"use client";
import { Button } from "@/components/ui/button";
import { useEffect, useState, useMemo } from "react";
import TextArea from "@/components/ui/TextArea";
import AnimatedModalLayout from "@/layout/animatedModalLayout";
import { ThreeDots } from "react-loader-spinner";
export default function VendorDetails() {
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
  };

  return (
    <div className="space-y-4">
      <TextArea
        placeholder="Reply to comment…"
        //value={""}
        onChange={(e) => {}}
        rows={3}
        maxLength={100}
      />
      <div className="">
        <h3 className="font-bold text-lg mb-4">Examples:</h3>
        <div className="flex flex-wrap gap-3">
          {[
            "WhatsApp messages",
            "Social media DMs",
            "SMS text",
            "Website link",
            "Email content",
          ].map((example, index) => (
            <span
              key={index}
              className="text-gray-600 px-4 py-1 rounded-2xl bg-[#D5E6FF] text-sm font-medium"
            >
              {example}
            </span>
          ))}
        </div>
      </div>
      <div className="mt-60 mb-20">
        {" "}
        <Button
          variant="primary"
          size="lg"
          className="uppercase text-xs w-full bg-gray"
          onClick={() => {
            setShowModal(!showModal);
          }}
        >
          SCAN
        </Button>{" "}
      </div>
      {showModal && (
        <AnimatedModalLayout>
          <ScanModal closeModal={() => setShowModal(false)} />
        </AnimatedModalLayout>
      )}
    </div>
  );
}

interface ScanModalProps {
  closeModal: () => void;
  isScanning?: boolean;
}

const ScanModal: React.FC<ScanModalProps> = ({
  closeModal,
  isScanning = true,
}) => {
  return (
    <div className="p-8 text-center flex flex-col items-center gap-6">
      <h3 className="font-bold text-2xl text-[#1D1F4D]">
        Scanning your message...
      </h3>

      <div className="flex justify-center items-center my-4 min-h-[120px]">
        <div className="flex space-x-2 gap-4">
          <div
            className="w-4 h-4 bg-[#185CBC] rounded-full animate-ping"
            style={{ animationDelay: "0ms" }}
          ></div>
          <div
            className="w-3 h-3 bg-[#00B9AD] rounded-full animate-ping"
            style={{ animationDelay: "150ms" }}
          ></div>
          <div
            className="w-3 h-3 bg-[#1D1F4D] rounded-full animate-ping"
            style={{ animationDelay: "300ms" }}
          ></div>
        </div>
      </div>

      {/* Buttons */}
      {/* <div className="flex items-center gap-4 w-full max-w-md mt-8">
        <div className="flex-1">
          <Button
            variant="outline"
            size="lg"
            className="uppercase text-xs w-full font-semibold py-3 border-gray-300 hover:bg-gray-50"
            onClick={closeModal}
          >
            Cancel
          </Button>
        </div>
        <div className="flex-1">
          <Button
            variant="primary"
            size="lg"
            className="uppercase text-xs w-full font-semibold py-3 bg-[#1D1F4D] hover:bg-[#2A2C6B]"
            disabled={isScanning}
            onClick={() => {
              // Add confirm logic here
              console.log("Scan confirmed");
            }}
          >
            {isScanning ? "Scanning..." : "Confirm"}
          </Button>
        </div>
      </div> */}
    </div>
  );
};
