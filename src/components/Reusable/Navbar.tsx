"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { Button } from "../ui/button";
import { useRouter } from "next/navigation";

interface NavbarProps {
  transparent?: boolean;
  customBg?: string;
}

export function Navbar({ transparent = false, customBg }: NavbarProps) {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  const menuItems = [
    { href: "/about", label: "About Us" },
    { href: "/how-it-works", label: "How It Works" },
    { href: "/faq", label: "FAQ" },
    { href: "/contact", label: "Contact Us" },
    { href: "/trends", label: "Trends" },
    { href: "/dispute", label: "Raise a Dispute" },
    { href: "/terms-privacy", label: "Terms & Privacy" },
  ];

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      setIsScrolled(scrollTop > 10);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const getBackgroundClass = () => {
    if (customBg) return customBg;
    // Always use gradient when scrolled or mobile menu is open
    if (isScrolled || isOpen) {
      return "bg-gradient-to-b from-[#057EB7] from-[2.1%] via-[#141986] via-[50.13%] to-[#0E1264] to-[98.16%]";
    }
    if (transparent) return "bg-transparent";
    return "bg-gradient-to-b from-[#057EB7] from-[2.1%] via-[#141986] via-[50.13%] to-[#0E1264] to-[98.16%]";
  };

  const getTextColor = () => {
    return "text-white";
  };

  const getButtonBorderColor = () => {
    return "border-white/30";
  };

  return (
    <>
      <nav
        className={`hidden md:block fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${getBackgroundClass()} ${
          isScrolled ? "shadow-lg" : ""
        }`}
      >
        <div className="mx-auto px-4 md:px-24">
          <div className="flex items-center justify-between h-20">
            <Link href="/home" className="flex items-center gap-2">
              <div className="w-24 h-24 relative">
                <Image
                  src="/assets/logo.svg"
                  alt="TapIQ Logo"
                  fill
                  className="object-contain"
                />
              </div>
            </Link>
            <div className="flex items-center gap-8">
              {menuItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`hover:opacity-80 transition-all font-medium ${getTextColor()}`}
                >
                  {item.label}
                </Link>
              ))}
            </div>
            <div className="flex items-center gap-4">
              <Button
                className={`px-6 py-2 border-2 rounded-lg complex-gradient-border hover:bg-white/10 transition-colors text-sm font-medium ${getTextColor()} ${getButtonBorderColor()}`}
              >
                REPORT A VENDOR
              </Button>
              <Button
                className="px-8 py-2 bg-gradient-to-br from-[#575EFF] to-[#282D99] rounded-lg text-white complex-gradient-border text-sm font-semibold hover:opacity-90 transition-opacity"
                onClick={() => {
                  router.push("/auth/register");
                }}
              >
                SIGN UP
              </Button>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Navbar - Always has gradient background */}
      <nav
        className={`md:hidden fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${getBackgroundClass()}  ${
          isScrolled ? "shadow-lg" : ""
        }`}
      >
        <div className="flex items-center justify-between px-6 h-20">
          <Link href="/home" className="flex items-center gap-2">
            <div className="w-24 h-24 relative">
              <Image
                src="/assets/logo.svg"
                alt="TapIQ Logo"
                fill
                className="object-contain"
              />
            </div>
          </Link>
          <div className="flex items-center gap-3">
            <Button
              className={`px-4 py-2 border-2 rounded-lg complex-gradient-border hover:bg-white/10 transition-colors text-sm font-medium ${getTextColor()} ${getButtonBorderColor()}`}
            >
              REPORT
            </Button>
            <button
              onClick={() => setIsOpen(!isOpen)}
              className={`p-1 transition-colors ${getTextColor()}`}
              aria-label="Toggle menu"
            >
              <div className="w-6 h-6 relative">
                <Image
                  src={isOpen ? "/assets/close.svg" : "/assets/menu.svg"}
                  alt={isOpen ? "Close menu" : "Open menu"}
                  fill
                  className="object-contain"
                />
              </div>
            </button>
          </div>
        </div>

        {/* Mobile Menu - Always has gradient background */}
        {isOpen && (
          <div className="bg-gradient-to-b from-[#057EB7] from-[2.1%] via-[#141986] via-[50.13%] to-[#0E1264] to-[98.16%] transition-all duration-300 h-screen pb-6">
            <div className="flex flex-col">
              {menuItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="px-6 py-4 hover:bg-white/5 transition-colors flex items-center justify-between border-t border-white/10"
                  onClick={() => setIsOpen(false)}
                >
                  <span className={`text-lg font-semibold ${getTextColor()}`}>
                    {item.label}
                  </span>
                  <svg
                    width="8"
                    height="14"
                    viewBox="0 0 8 14"
                    fill="none"
                    className={getTextColor()}
                  >
                    <path
                      d="M1 1L7 7L1 13"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </Link>
              ))}
            </div>
            <div className="mt-auto h-full px-4 flex justify-end">
              <Button
                className="px-8 py-4 bg-gradient-to-br from-[#575EFF] to-[#282D99] rounded-lg text-white complex-gradient-border text-sm w-full font-semibold hover:opacity-90 transition-opacity"
                onClick={() => {
                  router.push("/auth/register");
                }}
              >
                SIGN UP
              </Button>
            </div>
          </div>
        )}
      </nav>

      <div className="h-20" />
    </>
  );
}
