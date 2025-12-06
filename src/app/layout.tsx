import type { Metadata } from "next";
import { Geist, Geist_Mono, Manrope } from "next/font/google";
import "./globals.css";
import Providers from "./provider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const manrope = Manrope({
  variable: "--font-manrope",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "TapIQ - Smart Tap Verification",
  description: "Verify authenticity and track your products with TapIQ's intelligent NFC technology",
  icons: {
    icon: "/assets/logo.svg",
    shortcut: "/assets/logo.svg",
    apple: "/assets/logo.svg",
  },
  openGraph: {
    title: "TapIQ - Smart Tap Verification",
    description: "Verify authenticity and track your products with TapIQ's intelligent NFC technology",
    images: ["/assets/logo.svg"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/assets/logo.svg" type="image/svg+xml" />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${manrope.variable} antialiased`}
      > <Providers>
          {children}
        </Providers>
        <div id="modal-root"></div>
      </body>
    </html>
  );
}