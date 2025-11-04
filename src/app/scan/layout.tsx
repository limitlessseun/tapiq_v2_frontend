"use client";
import { BottomNavigation, Navbar } from "@/components/Reusable";
import { Button } from "@/components/ui/button";
import { IoIosArrowBack } from "react-icons/io";
export default function VendorDetailsLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <main className="min-h-screen flex flex-col bg-linear-to-br from-[#057EB7] via-[#141986] to-[#0E1264] text-white  font-manrope">
      <Navbar transparent />
      <div className="max-w-[90%] mx-auto text-start py-4 flex flex-col mb-4 ">
        <h1 className="text-2xl md:text-3xl font-semibold  leading-tight text-center">
          Scan a Scam Message{" "}
        </h1>
        <p className="text-cloudWhite font-light text-center">
          Copy and Paste Any Suspicious Message or Website Link – Get Instant
          Analysis
        </p>
      </div>

      <div className="flex-1 bg-cloudWhite  rounded-tr-3xl rounded-tl-3xl text-black py-6 px-4 md:py-10 md:px-10 w-full md:max-w-[700px] md:mx-auto ">
        {children}
      </div>
      <BottomNavigation />
    </main>
  );
}
