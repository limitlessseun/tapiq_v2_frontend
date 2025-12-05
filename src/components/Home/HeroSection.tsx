"use client";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useSessionStore } from "@/stores/useSessionStore";
import { useState } from "react";
import { Notification } from "@/components/Reusable/Notification"; // Adjust import path as needed

export function HeroSection() {
  const router = useRouter();
  const { session } = useSessionStore();
  const [notification, setNotification] = useState<{
    message: string;
    type: 'success' | 'error';
  } | null>(null);

  const showNotification = (message: string, type: 'success' | 'error') => {
    setNotification({ message, type });
  };

  const hideNotification = () => {
    setNotification(null);
  };

  const handleVerifyVendor = () => {
    if (!session) {
      showNotification('Please sign in to verify vendors', 'error');
      // Redirect to sign in after a delay so user sees the notification
      setTimeout(() => {
        router.push(`/auth/login?callbackUrl=${encodeURIComponent('/verify')}`);
      }, 1500);
      return;
    }
    router.push("/verify");
  };

  const handleScanMessage = () => {
    if (!session) {
      showNotification('Please sign in to scan messages', 'error');
      // Redirect to sign in after a delay so user sees the notification
      setTimeout(() => {
        router.push(`/auth/login?callbackUrl=${encodeURIComponent('/scan')}`);
      }, 1500);
      return;
    }
    router.push("/scan");
  };

  return (
    <>
      {notification && (
        <Notification
          message={notification.message}
          type={notification.type}
          onClose={hideNotification}
        />
      )}

      <section className="text-white py-16 md:py-20 lg:py-24 px-6 font-manrope relative">
        <div className="flex flex-col gap-8 md:gap-12 lg:gap-16 md:flex-row items-center justify-between w-full max-w-7xl mx-auto">
          {/* Text Content */}
          <div className="w-full md:w-1/2 text-center md:text-left">
            <h1 className="text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-semibold mb-6 md:mb-8 leading-tight">
              STOP SCAMS
              <br />
              BEFORE THEY START
            </h1>
            <p className="text-lg md:text-xl lg:text-2xl mb-8 md:mb-10 lg:mb-12 text-secwhite leading-relaxed max-w-xl mx-auto md:mx-0 font-satoshi">
              Easily verify vendors, suspicious messages. Built for your safety.
            </p>
            <div className="flex gap-4 flex-col md:gap-6 max-w-md mx-auto md:mx-0">
              <Button
                className="bg-gradient-to-br from-[#575EFF] to-[#282D99] uppercase font-semibold text-base md:text-lg w-full py-6 md:py-7 complex-gradient-border hover:opacity-90 transition-opacity"
                onClick={handleVerifyVendor}
              >
                Verify a Vendor
              </Button>
              <Button
                className="bg-transparent text-white uppercase font-semibold text-base md:text-lg w-full py-6 md:py-7 hover:bg-white/10 complex-gradient-border transition-colors"
                onClick={handleScanMessage}
              >
                Scan a Message
              </Button>
            </div>

            {/* Sign in prompt for non-authenticated users */}
            {!session && (
              <div className="mt-6 text-center md:text-left">
                <p className="text-sm text-white/80 font-satoshi animate-pulse">
                  <span className="text-white/90 font-semibold">🔒 Sign in required:</span> Create an account to access verification features
                </p>
              </div>
            )}
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
    </>
  );
}