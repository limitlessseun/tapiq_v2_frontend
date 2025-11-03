"use client";
import AuthNav from "@/components/ui/AuthComponent/AuthNav";

export default function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <main className="min-h-screen flex flex-col bg-linear-to-br from-[#057EB7] via-[#141986] to-[#0E1264] text-white pt-18 md:pt-24 font-manrope">
      <div className="max-w-4xl md:max-w-2xl lg:max-w-3xl mx-auto">
        <h1 className="text-2xl md:text-3xl font-semibold mb-12 leading-tight text-center">
          Stay smart. <br />
          Spot scams. Report fraud.
        </h1>
      </div>

      <div className="flex-1 bg-cloudWhite rounded-tr-3xl rounded-tl-3xl text-black py-6 px-4">
        <AuthNav />
        {children}
      </div>
    </main>
  );
}
