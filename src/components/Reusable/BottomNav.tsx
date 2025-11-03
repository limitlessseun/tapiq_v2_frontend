"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import Image from "next/image";

export function BottomNavigation() {
  const pathname = usePathname();

  const navItems = [
    { name: "Home", icon: "/assets/home.svg", href: "/home" },
    { name: "Verify", icon: "/assets/verify.svg", href: "/verify" },
    { name: "Scan", icon: "/assets/scan.svg", href: "/scan" },
    { name: "Watchlist", icon: "/assets/watchlist.svg", href: "/watchlist" },
  ];

  return (
    <nav className="hidden lg:fixed bottom-0 left-0 right-0 bg-gradient-to-b from-[#057EB7] from-[2.1%] via-[#141986] via-[50.13%] to-[#0E1264] to-[98.16%] border-t border-gray-200 py-3 px-6 z-50 safe-area-bottom">
      <div className="flex justify-between items-center max-w-md mx-auto">
        {navItems.map((item) => {
          const isActive = pathname === item.href;

          return (
            <Link
              key={item.name}
              href={item.href}
              className={`flex flex-col items-center gap-1 transition-all duration-200 p-2 rounded-lg ${
                isActive ? " text-white" : "text-[#485D76]"
              }`}
            >
              <div
                className={`w-6 h-6 relative ${
                  isActive
                    ? "filter brightness-0 invert"
                    : "filter-[invert(33%)_sepia(15%)_saturate(937%)_hue-rotate(177deg)_brightness(92%)_contrast(87%)]"
                }`}
              >
                <Image
                  src={item.icon}
                  alt={item.name}
                  width={24}
                  height={24}
                  className="object-contain"
                />
              </div>
              <span
                className={`text-xs font-medium ${
                  isActive ? "text-white" : "text-[#485D76]"
                }`}
              >
                {item.name}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
