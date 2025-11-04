"use client";
import { Button } from "@/components/ui/button";
import CheckboxInput from "@/components/ui/Checkbox";
import DatePicker from "@/components/ui/Dateinput";
import RadioInput from "@/components/ui/RadioInput";
import { SelectInput } from "@/components/ui/SelectInput";
import TextArea from "@/components/ui/TextArea";
import TextInput from "@/components/ui/TextInput";
import WhatThisMeans from "@/components/ui/VerifyComponent/WhatThisMeans";
import Image from "next/image";

export default function ReportVendor() {
  return (
    <div className="">
      <Step3 />

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
            onClick={() => {}}
          >
            back{" "}
          </Button>
        </div>
        <div className="flex-1">
          <Button
            variant="primary"
            size="lg"
            className="uppercase text-xs w-full"
            onClick={() => {}}
          >
            Next{" "}
          </Button>
        </div>
      </div>
    </div>
  );
}

const Step1 = () => {
  return (
    <div className="space-y-4">
      <h3 className="font-bold text-xl mb-4 text-indigo">Your Experience </h3>
      <div className="flex flex-col gap-6">
        <TextInput
          label="Vendor Name"
          type="text"
          placeholder="Enter vendor name"
          value={"Blessing Fashion Store"}
          onChange={() => {}}
        />
        <SelectInput
          label="Business Type"
          placeholder="Select business type..."
          options={[
            { label: "Online Store", value: "Online Store" },
            { label: "Physical Store", value: "Physical Store" },
            { label: "Both", value: "Both" },
          ]}
          value={"Online Store"}
          onChange={(e) => {}}
          required
        />
        <TextInput
          label="Phone Number"
          type="tel"
          placeholder="Enter vendor phone number"
          value={"0803-256-4588"}
          onChange={() => {}}
        />
        <TextInput
          label="Crypto Wallet ID"
          type="text"
          placeholder="Enter crypto wallet address"
          value={"1FfH3zj7Fg2J8kT4g92ekrdX7r6hf4Eij2"}
          onChange={() => {}}
        />
        <div>
          <p className="text-gray text-sm">Platform*</p>

          <div className="bg-white rounded-lg flex flex-col gap-6 p-4">
            <div className="p-4 bg-cloudWhite flex items-center gap-4">
              <CheckboxInput /> Instagram
            </div>
            <p className="text-gray text-sm">Enter Instagram handles </p>
            <p className="">@username </p>

            <div className="p-4 flex items-center gap-4">
              <CheckboxInput /> Facebook
            </div>
            <div className="p-4 flex items-center gap-4">
              <CheckboxInput /> WhatsApp
            </div>
            <div className="p-4 flex items-center gap-4">
              <CheckboxInput /> TikTok
            </div>
            <div className="p-4 flex items-center gap-4">
              <CheckboxInput /> Twitter
            </div>
            <div className="p-4 flex items-center gap-4">
              <CheckboxInput /> Website
            </div>
            <div className="p-4 flex items-center gap-4">
              <CheckboxInput /> Instagram
            </div>
            <p className="text-gray text-sm">Enter Website URL </p>
            <p className=""> www.blessingfashion.com </p>

            <div className="p-4 flex items-center gap-4">
              <CheckboxInput /> Others
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const Step2 = () => {
  return (
    <div className="space-y-4">
      <h3 className="font-bold text-xl mb-4 text-indigo">Your Experience </h3>
      <div className="flex flex-col gap-6">
        <TextInput
          label="Type of Scam / Issue"
          type="text"
          placeholder="Enter scam type"
          value={"Fake Advertisement"}
          onChange={() => {}}
        />
        <TextInput
          label="Amount Lost"
          type="text"
          placeholder="Enter amount lost"
          value={"$2000"}
          onChange={() => {}}
        />
        <SelectInput
          label="Payment Method"
          placeholder="Select payment method..."
          options={[
            { label: "Bank transfer", value: "Bank transfer" },
            { label: "Credit Card", value: "Credit Card" },
            { label: "Crypto", value: "Crypto" },
            { label: "PayPal", value: "PayPal" },
            { label: "Other", value: "Other" },
          ]}
          value={"Bank transfer"}
          onChange={(e) => {}}
          required
        />
        <TextInput
          label="Bank Name"
          type="text"
          placeholder="Enter bank name"
          value={"Global Financial Bank"}
          onChange={() => {}}
        />
        <DatePicker
          label="Date of Transaction"
          placeholder="Select transaction date"
          value={"20-06-2025"}
          onChange={() => {}}
        />
        <SelectInput
          label="How did you know about this vendor?"
          placeholder="Select discovery method..."
          options={[
            { label: "Social media advert", value: "Social media advert" },
            { label: "Search engine", value: "Search engine" },
            { label: "Friend referral", value: "Friend referral" },
            { label: "Email marketing", value: "Email marketing" },
            { label: "Online forum", value: "Online forum" },
            { label: "Other", value: "Other" },
          ]}
          value={"Social media advert"}
          onChange={(e) => {}}
          required
        />

        <RadioInput
          label="Have you reported this case?"
          options={[
            { label: "Yes", value: "yes" },
            { label: "No", value: "no" },
          ]}
          value={""}
          onChange={() => {}}
        />
      </div>
    </div>
  );
};
const Step3 = () => {
  const data2 = ["Your identity stays private", "Reports are verified"];
  return (
    <div className="space-y-4">
      <h3 className="font-bold text-xl mb-4 text-indigo">
        Details & Evidence{" "}
      </h3>
      <div className="flex flex-col gap-4">
        <TextArea
          placeholder="Explain what happened in your own words"
          value={""}
          onChange={(e) => {}}
          rows={3}
          maxLength={400}
          label="Brief Description "
        />

        <div className="mb-12">
          <div className="mb-6">
            <label className="block mb-3 text-gray font-medium">
              Upload Screenshots/Receipts
            </label>
            <div className="flex gap-4">
              {[1, 2, 3].map((item) => (
                <div
                  key={item}
                  className="w-40 h-[120px] bg-white rounded-lg flex items-center justify-center cursor-pointer  transition-colors"
                >
                  <Image
                    src="/assets/upload.svg"
                    alt="alt"
                    width={20}
                    height={20}
                  />
                </div>
              ))}
            </div>
          </div>

          <div>
            <label className="block mb-3 text-gray font-medium">
              Additional Notes
            </label>
            <textarea
              className="w-full h-32 p-3 bg-white rounded-lg focus:outline-none  resize-none"
              placeholder="Explain what happened in your own words"
              maxLength={400}
            />
            <div className="text-right text-sm text-gray mt-1">0/400</div>
          </div>
        </div>

        <RadioInput
          label="Has the Vendor Blocked You?"
          options={[
            { label: "Yes", value: "yes" },
            { label: "No", value: "no" },
          ]}
          value={""}
          onChange={() => {}}
        />

        <TextArea
          placeholder="Red sneakers, size 44"
          value={""}
          onChange={(e) => {}}
          rows={3}
          maxLength={400}
          label="Product/Service Promised "
        />

        <WhatThisMeans
          childeren={
            <div>
              <h3 className="font-bold text-lg mb-4">Quick Reminders:</h3>
              <ul className="space-y-1 pl-2">
                {data2.map((item, index) => (
                  <li key={item} className="flex items-start font-light">
                    <span className="mr-2">•</span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          }
        />

        <div className="flex items-start gap-4">
          <img src="/assets/experience-icon.svg" className="h-8 w-8" />
          <div className="">
            <p className="text-primary font-medium ">Need Help?</p>
          </div>
        </div>
      </div>
    </div>
  );
};
