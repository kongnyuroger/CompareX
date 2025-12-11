import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google"; // Changed from Inter
import "./globals.css";
import Script from "next/script";
import { Toaster } from "@/components/ui/sonner";
import { LayoutContextProvider } from "@/lib/layoutProvider";
import { UserContextProvider } from "../lib/authProvider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "CompareX - Find the Best Price in Seconds",
  description: "We compare prices across top stores — instantly.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <div className="">
          <UserContextProvider>
            <LayoutContextProvider>{children}</LayoutContextProvider>
            <Toaster />
          </UserContextProvider>

          <Script
            src="https://apis.google.com/js/platform.js"
            async
            defer
          ></Script>
          <Toaster />
        </di>
      </body>
    </html>
  );
}
