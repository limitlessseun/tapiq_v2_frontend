"use client";
import { Button } from "@/components/ui/button";
import Loader from "@/components/ui/Loader";
import SwitchInput from "@/components/ui/switch";
import TextInput from "@/components/ui/TextInput";
import VendorTable from "@/components/ui/VerifyComponent/VendorTable";
import React from "react";

export default function Login() {
  return (
    <div className="space-y-4">
      <TextInput
        label=""
        type="search"
        placeholder="Enter vendor name"
        value={""}
        onChange={() => {}}
      />

      <div className="flex items-center gap-2">
        <img src="/assets/tooltips.svg" className="h-5 w-5" />
        <p className="text-sm text-gray border-l border-l-teal border-l-solid  pl-2">
          Enter a vendor name, phone number, social media handle, or unique ID
          to search.{" "}
        </p>
      </div>
      <div className="flex items-center justify-center">
        <Loader />
      </div>
      <VendorTable />
    </div>
  );
}
