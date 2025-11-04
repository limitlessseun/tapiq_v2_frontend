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

export default function VendorDetails() {
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

  const handleNewSearch = () => {
    setSearchValue("");
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchValue(e.target.value);
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
      description:
        "Highlighting the most dangerous scam of the week to stay alert.",
      shortDescription: "Learn to identify and avoid the latest scam tactics",
      image: "/assets/1.png",
    },
    {
      id: "safe-payment-methods",
      title: "Safe Payment Methods",
      description:
        "Highlighting the most dangerous scam of the week to stay alert.",
      shortDescription: "Secure your financial transactions online",
      image: "/assets/2.png",
    },
    {
      id: "fraud-prevention-tips",
      title: "Fraud Prevention Tips",
      description:
        "Highlighting the most dangerous scam of the week to stay alert.",
      shortDescription: "Essential tips to protect yourself from fraud",
      image: "/assets/3.png",
    },
  ];

  return (
    <div className="space-y-4">
      <TextInput
        label=""
        type="search"
        placeholder="Enter vendor name, ID, or reports count"
        value={searchValue}
        onChange={handleInputChange}
      />

      <VendorDetail showButton={true} />

      <div className="p-6 bg-white rounded-3xl flex flex-col gap-4">
        <div>
          <div className="flex flex-col  items-start">
            <p className="text-sm text-gray pb-1 ">Name(s):</p>
            <p className="text-base text-indigo ">PrimeStyle_Boutique </p>
          </div>
        </div>
        <div>
          <div className="flex flex-col  items-start">
            <p className="text-sm text-gray pb-1 ">Details</p>
          </div>
        </div>
        <Button
          variant="primary"
          size="lg"
          className="uppercase text-xs w-full"
          onClick={() => {}}
        >
          Remove{" "}
        </Button>
      </div>

      <div className="p-6 bg-white rounded-3xl flex flex-col gap-4">
        <div>
          <div className="flex flex-col  items-start">
            <p className="text-sm text-gray pb-1 ">Name(s):</p>
            <p className="text-base text-indigo ">PrimeStyle_Boutique </p>
          </div>
        </div>
        <div>
          <div className="flex flex-col  items-start">
            <p className="text-sm text-gray pb-1 ">Details</p>
          </div>
        </div>
        <Button
          variant="primary"
          size="lg"
          className="uppercase text-xs w-full"
          onClick={() => {}}
        >
          Remove{" "}
        </Button>
      </div>
    </div>
  );
}
