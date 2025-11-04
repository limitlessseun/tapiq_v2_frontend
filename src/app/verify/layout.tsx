"use client";
import { BottomNavigation, Navbar } from "@/components/Reusable";

export default function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <main className="min-h-screen flex flex-col bg-linear-to-br from-[#057EB7] via-[#141986] to-[#0E1264] text-white  font-manrope">
      <Navbar transparent />

      <div className="max-w-[90%] mx-auto text-center py-10 flex flex-col gap-6 ">
        <h1 className="text-2xl md:text-3xl font-semibold  leading-tight text-center">
          Verify a Vendor
        </h1>
        <p className="text-cloudWhite font-light font-satoshi">
          Check if a vendor has been flagged by others in our community.
        </p>
      </div>

      <div className="flex-1 bg-cloudWhite rounded-tr-3xl rounded-tl-3xl text-black py-6 px-4 md:py-10 md:px-10 w-full md:max-w-[700px] md:mx-auto  ">
        {children}
      </div>
      <BottomNavigation />
    </main>
  );
}
