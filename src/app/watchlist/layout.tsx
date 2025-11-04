"use client";
import { BottomNavigation, Navbar } from "@/components/Reusable";
export default function VendorDetailsLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <main className="min-h-screen flex flex-col bg-linear-to-br from-[#057EB7] via-[#141986] to-[#0E1264] text-white  font-manrope">
      <Navbar transparent />
      <div className="max-w-[95%] w-full mx-auto  text-start py-4 flex flex-col mb-4 ">
        <div className="w-full"> </div>
        <h1 className="text-2xl md:text-3xl font-semibold  leading-tight text-center">
          Watchlist{" "}
        </h1>
        <p className="text-cloudWhite font-light text-center">
          Track and monitor suspicious vendorsor messages
        </p>
      </div>

      <div className="flex-1 bg-cloudWhite rounded-tr-3xl rounded-tl-3xl text-black py-6 md:px-10 w-full md:max-w-[700px] md:mx-auto px-4 ">
        {children}
      </div>
      <BottomNavigation />
    </main>
  );
}
