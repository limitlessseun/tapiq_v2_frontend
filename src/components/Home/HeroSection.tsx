"use client";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { useRouter } from "next/navigation";

export function HeroSection() {
  const router = useRouter();
  return (
    <section className=" text-white py-16 md:py-20 lg:py-24 px-6 font-manrope">
      <div className="flex flex-col gap-8 md:gap-12 lg:gap-16 md:flex-row items-center justify-between w-full max-w-7xl mx-auto">
        {/* Text Content */}
        <div className="w-full md:w-1/2 text-center md:text-left">
          <h1 className="text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-semibold mb-6 md:mb-8 leading-tight">
            STOP SCAMS
            <br />
            BEFORE THEY START
          </h1>
          <p className="text-lg md:text-xl lg:text-2xl mb-8 md:mb-10 lg:mb-12 text-secwhite leading-relaxed max-w-xl mx-auto md:mx-0">
            Easily verify vendors, suspicious messages. Built for your safety.
          </p>
          <div className="flex gap-4 flex-col md:gap-6 max-w-md mx-auto md:mx-0">
            <Button
              className="bg-gradient-to-br from-[#575EFF] to-[#282D99] uppercase font-semibold text-base md:text-lg w-full py-6 md:py-7 complex-gradient-border"
              onClick={() => {
                router.push("/verify");
              }}
            >
              Verify a Vendor
            </Button>
            <Button
              className="bg-transparent text-white uppercase font-semibold text-base md:text-lg w-full py-6 md:py-7 hover:bg-white/10 complex-gradient-border"
              onClick={() => {
                router.push("/scan");
              }}
            >
              Scan a Message
            </Button>
          </div>
        </div>

        {/* Image */}
        <div className="w-full md:w-1/2 flex justify-center md:justify-end">
          <div className="relative w-full max-w-md md:max-w-lg lg:max-w-xl">
            <Image
              src="/assets/image.png"
              alt="Tap Iq Hero image"
              width={600}
              height={400}
              className="w-full h-auto object-contain"
              priority
            />
          </div>
        </div>
      </div>
    </section>
  );
}
