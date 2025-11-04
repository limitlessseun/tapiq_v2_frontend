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

export default function VendorDetails() {
  const [searchValue, setSearchValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
 const router = useRouter();
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
    setTimeout(() => {
      setIsLoading(false);
      router.push("/verify");
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
      <WhatThisMeans
        childeren={
          <div>
            <h3 className="font-bold text-lg mb-4">CAUTION:Report Found!</h3>
            <p>
              This vendor or message has been flagged for suspicious activity.
              Please proceed with caution.
            </p>
          </div>
        }
      />

      <div className="flex items-center gap-2">
        <img src="/assets/tooltips.svg" className="h-5 w-5" alt="tooltip" />
        <div className="border-l border-l-teal border-l-solid pl-2 flex flex-col  items-start">
          <p className="text-sm text-gray ">Searched:</p>
          <p className="text-sm font-bold text-indigo ">Quick Loans Nigeria</p>
          <p className="text-sm text-gray ">0803-XXX-XXXX</p>
        </div>
      </div>

      <VendorDetail />

      <Warning vendorData={vendorsData} />
      <Share />
      <div className="flex items-center gap-4">
        <img src="/assets/experience-icon.svg" className="h-8 w-8" />
        <p className="text-primary font-medium ">Had an Experience?</p>
      </div>
      <div className="bg-white py-6">
        {" "}
        <h2 className="text-2xl  font-semibold text-indigo px-6">Learn more</h2>
        <div className="grid grid-cols-1 md:grid-cols-2  gap-6">
          {trendCards.map((card) => (
            <div key={card.id} className="bg-white rounded-xl p-6">
              {/* Image */}
              <div className="mb-4 rounded-lg overflow-hidden">
                <Image
                  src={card.image}
                  alt={card.title}
                  width={400}
                  height={250}
                  className="w-full h-48 object-cover "
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
              onClick={handleSearch}
            >
              Report This Vendor
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
