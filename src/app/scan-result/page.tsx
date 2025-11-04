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
import Indicators from "@/components/ui/ScanReportComponent/Indicators";

export default function VendorDetails() {
  const [genuine, setGenuine] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  return (
    <div className="space-y-4">
      <Indicators genuine={genuine} />
      {genuine ? (
        <div className="flex flex-col gap-8 pt-4">
          <div className="flex items-start gap-4">
            <img src="/assets/light-bulb.svg" className="h-8 w-8" />
            <div className="">
              <p className="text-primary font-medium ">Concerns:</p>
              <p className="text-indigo font-medium mt-4 ">None detected</p>
            </div>
          </div>
          <div className="flex items-start gap-4">
            <img src="/assets/mega-phone.svg" className="h-8 w-8" />
            <div className="">
              <p className="text-primary font-medium ">Recommendation:</p>
              <p className="text-indigo font-medium mt-4 ">
                This appears to be a legitimate business communication. You can
                safely interact with this message.
              </p>
            </div>
          </div>
        </div>
      ) : (
        <div className="flex flex-col gap-8 pt-4">
          <div className="flex items-start gap-4">
            <img src="/assets/light-bulb.svg" className="h-8 w-8" />
            <div className="">
              <p className="text-primary font-medium ">Immediate actions:</p>
              <ul className="text-sm font-bold text-indigo flex flex-col gap-1">
                <li>
                  {" "}
                  <span className="mr-2">•</span>
                  Do not respond under any circumstances
                </li>
                <li>
                  {" "}
                  <span className="mr-2">•</span>
                  Do not send any money or personal information
                </li>
                <li>
                  {" "}
                  <span className="mr-2">•</span>
                  Block the sender immediately
                </li>
              </ul>
            </div>
          </div>
        </div>
      )}

      <Button
        variant="primary"
        size="lg"
        className="uppercase text-xs w-full"
        onClick={() => {}}
      >
        new SCAN{" "}
      </Button>
    </div>
  );
}
