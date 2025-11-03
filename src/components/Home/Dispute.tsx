"use client"
import { useState } from "react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import TextInput from "@/components/ui/TextInput"
import CheckboxInput from "../ui/Checkbox"

export function RaiseDispute() {
    const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>([])
    const [disputeReason, setDisputeReason] = useState("")
    const [contactMethod, setContactMethod] = useState("email")
    const [agreement, setAgreement] = useState(false)

    const platforms = ["Facebook", "WhatsApp", "TikTok", "Twitter", "Telegram"]
    const disputeReasons = [
        "Someone is pretending to be my business",
        "The report is not true",
        "The issue was real but it's been fixed",
        "Other"
    ]

    return (
        <section className="py-16 px-6 bg-cloudwhite font-manrope">
            <div className="max-w-4xl mx-auto">
                {/* Header */}
                <div className="text-center mb-12">
                    <h1 className="text-3xl md:text-4xl lg:text-6xl font-semibold text-indigo mb-4">
                        Raise a Dispute
                    </h1>
                    <p className="text-base md:text-lg text-indigo leading-relaxed">
                        Think a report about your business is false or an impersonation?
                        Tell us your side and we'll investigate.
                    </p>
                </div>

                {/* Form Sections */}
                <div className="">
                    {/* Section 1: Vendor Information */}
                    <div className="mb-12">
                        <h2 className="text-xl md:text-2xl font-semibold text-indigo mb-6">
                            <span className="">1. </span>
                            Vendor Information
                        </h2>

                        <div className="space-y-6">
                            <TextInput
                                label="Vendor Name"
                                type="text"
                                placeholder="Fashion Hub"
                                value={""}
                                onChange={() => { }}
                            />

                            <div>
                                <label className="block mb-3 text-gray font-medium">Platform*</label>
                                <div className="bg-white p-2">
                                    {/* Instagram Checkbox with conditional input */}
                                    <div>
                                        <label className="flex items-center gap-3 mb-2 cursor-pointer">
                                            <input
                                                type="checkbox"
                                                checked={selectedPlatforms.includes("Instagram")}
                                                onChange={(e) => {
                                                    if (e.target.checked) {
                                                        setSelectedPlatforms(prev => [...prev, "Instagram"]);
                                                    } else {
                                                        setSelectedPlatforms(prev => prev.filter(p => p !== "Instagram"));
                                                    }
                                                }}
                                                className="w-4 h-4 accent-primary focus:ring-primary"
                                            />
                                            <span className="text-gray">Instagram</span>
                                        </label>
                                        {selectedPlatforms.includes("Instagram") && (
                                            <TextInput
                                                type="text"
                                                placeholder="@username"
                                                value={""}
                                                onChange={() => { }}
                                                className="mb-4"
                                            />
                                        )}
                                    </div>

                                    {platforms.map((platform) => (
                                        <label key={platform} className="flex items-center gap-3 mb-2  cursor-pointer ">
                                            <input
                                                type="checkbox"
                                                checked={selectedPlatforms.includes(platform)}
                                                onChange={(e) => {
                                                    if (e.target.checked) {
                                                        setSelectedPlatforms(prev => [...prev, platform]);
                                                    } else {
                                                        setSelectedPlatforms(prev => prev.filter(p => p !== platform));
                                                    }
                                                }}
                                                className="w-4 h-4 accent-primary focus:ring-primary"
                                            />
                                            <span className="text-gray">{platform}</span>
                                        </label>
                                    ))}


                                    {/* Website Checkbox with conditional input */}
                                    <div className="mt-4">
                                        <label className="flex items-center gap-3 mb-2 cursor-pointer">
                                            <input
                                                type="checkbox"
                                                checked={selectedPlatforms.includes("Website")}
                                                onChange={(e) => {
                                                    if (e.target.checked) {
                                                        setSelectedPlatforms(prev => [...prev, "Website"]);
                                                    } else {
                                                        setSelectedPlatforms(prev => prev.filter(p => p !== "Website"));
                                                    }
                                                }}
                                                className="w-4 h-4 accent-primary focus:ring-primary"
                                            />
                                            <span className="text-gray">Website</span>
                                        </label>
                                        {selectedPlatforms.includes("Website") && (
                                            <TextInput
                                                type="text"
                                                placeholder="Enter Website URL"
                                                value={""}
                                                onChange={() => { }}
                                                className="mb-4"
                                            />
                                        )}
                                    </div>

                                    {/* Others Checkbox with conditional input */}
                                    <div>
                                        <label className="flex items-center gap-3 mb-2 cursor-pointer">
                                            <input
                                                type="checkbox"
                                                checked={selectedPlatforms.includes("Others")}
                                                onChange={(e) => {
                                                    if (e.target.checked) {
                                                        setSelectedPlatforms(prev => [...prev, "Others"]);
                                                    } else {
                                                        setSelectedPlatforms(prev => prev.filter(p => p !== "Others"));
                                                    }
                                                }}
                                                className="w-4 h-4  accent-primary focus:ring-primary"
                                            />
                                            <span className="text-gray">Others</span>
                                        </label>
                                        {selectedPlatforms.includes("Others") && (
                                            <TextInput
                                                type="text"
                                                placeholder="Enter other platform details"
                                                value={""}
                                                onChange={() => { }}
                                            />
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Section 2: Select Dispute Reason */}
                    <div className="mb-12">
                        <h2 className="text-xl md:text-2xl font-semibold text-indigo mb-6">
                            <span className="">2. </span>
                            Select Dispute Reason
                        </h2>

                        <div className="space-y-4 mb-6">
                            {disputeReasons.map((reason) => (
                                <label key={reason} className="flex items-center gap-3 cursor-pointer">
                                    <input
                                        type="radio"
                                        name="disputeReason"
                                        value={reason}
                                        checked={disputeReason === reason}
                                        onChange={(e) => setDisputeReason(e.target.value)}
                                        className="w-4 h-4 accent-primary focus:ring-primary border-gray-300"

                                    />
                                    <span className="text-gray">{reason}</span>
                                </label>
                            ))}
                        </div>

                        <div className="mb-6">
                            <label className="block mb-3 text-gray font-medium">Brief Description</label>
                            <textarea
                                className="w-full h-32 p-3 bg-white rounded-lg focus:outline-none  resize-none"
                                placeholder="Explain what happened in your own words"
                                maxLength={400}
                            />
                            <div className="text-right text-sm text-gray mt-1">0/400</div>
                        </div>
                    </div>

                    {/* Section 3: Upload Supporting Evidence */}
                    <div className="mb-12">
                        <h2 className="text-xl md:text-2xl font-semibold text-indigo mb-6">
                            <span className="">3. </span>
                            Upload Supporting Evidence
                        </h2>

                        <div className="mb-6">
                            <label className="block mb-3 text-gray font-medium">
                                Upload Business Proof (CAC certificate, store screenshots, delivery records)
                            </label>
                            <div className="flex gap-4">
                                {[1, 2, 3].map((item) => (
                                    <div key={item} className="w-40 h-40 bg-white rounded-lg flex items-center justify-center cursor-pointer  transition-colors">
                                        <Image src="/assets/upload.svg"
                                            alt="alt"
                                            width={20}
                                            height={20} />
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div>
                            <label className="block mb-3 text-gray font-medium">Additional Notes</label>
                            <textarea
                                className="w-full h-32 p-3 bg-white rounded-lg focus:outline-none  resize-none"
                                placeholder="Explain what happened in your own words"
                                maxLength={400}
                            />
                            <div className="text-right text-sm text-gray mt-1">0/400</div>
                        </div>
                    </div>

                    {/* Section 4: Business Owner Details */}
                    <div className="mb-12">
                        <h2 className="text-xl md:text-2xl font-semibold text-indigo mb-6">
                            <span className="">4. </span>
                            Business Owner Details
                        </h2>

                        <div className="space-y-6">
                            <TextInput
                                label="Full Name"
                                type="text"
                                placeholder="Enter Full Name"
                                value={""}
                                onChange={() => { }}
                            />

                            <TextInput
                                label="Email Address"
                                type="email"
                                placeholder="Enter Email Address"
                                value={""}
                                onChange={() => { }}
                            />

                            <TextInput
                                label="Phone Number"
                                type="tel"
                                placeholder="Enter Phone Number"
                                value={""}
                                onChange={() => { }}
                            />

                            <div>
                                <label className="block mb-3 text-indigo ">Preferred Contact Method</label>
                                <div className="flex gap-6">
                                    <label className="flex items-center gap-2 cursor-pointer">
                                        <input
                                            type="radio"
                                            name="contactMethod"
                                            value="email"
                                            checked={contactMethod === "email"}
                                            onChange={(e) => setContactMethod(e.target.value)}
                                            className="w-4 h-4 accent-primary focus:ring-primary"
                                        />
                                        <span className="text-gray">Email</span>
                                    </label>
                                    <label className="flex items-center gap-2 cursor-pointer">
                                        <input
                                            type="radio"
                                            name="contactMethod"
                                            value="phone"
                                            checked={contactMethod === "phone"}
                                            onChange={(e) => setContactMethod(e.target.value)}
                                            className="w-4 h-4  focus:ring-primary"
                                        />
                                        <span className="text-gray">Phone</span>
                                    </label>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Section 5: Agreement & Submit */}
                    <div>
                        <h2 className="text-xl md:text-2xl font-semibold text-indigo mb-6">
                            <span className="">5. </span>
                            Agreement & Submit
                        </h2>

                        <div className="space-y-6">
                            <label className="flex items-start gap-3 cursor-pointer">
                                <CheckboxInput
                                    checked={agreement}
                                    onCheckedChange={(checked) => setAgreement(checked as boolean)}
                                />
                                <div>
                                    <span className="text-gray font-medium">
                                        I confirm I am authorized to represent this business
                                    </span>
                                </div>
                            </label>

                            <label className="flex items-start gap-3 cursor-pointer">
                                <CheckboxInput
                                    checked={agreement}
                                    onCheckedChange={(checked) => setAgreement(checked as boolean)}
                                />
                                <div>
                                    <span className="text-gray font-medium">
                                        I understand this process may take 3-7 business days.
                                    </span>
                                </div>
                            </label>

                            <Button
                                className="bg-gradient-to-br from-[#575EFF] to-[#282D99] uppercase font-semibold text-lg w-full py-6 complex-gradient-border text-white mt-6"
                            >
                                SUBMIT DISPUTE
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}