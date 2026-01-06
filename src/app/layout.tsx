import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google"; // Changed from Inter
import "./globals.css";
import Script from "next/script";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { UserContextProvider } from "../lib/authProvider";
import { AppSidebar } from "./components/app-sidebar";
import Navbar from "./components/Navbar";

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
      <UserContextProvider>
        <SidebarProvider>
          <AppSidebar />
          <SidebarTrigger className="py-7 mx-5 sm:hidden" />
          <body
            className={`${geistSans.variable} ${geistMono.variable} antialiased`}
          >
            <div className="">
              <Navbar />
              {children}

              <Script
                src="https://apis.google.com/js/platform.js"
                async
                defer
              ></Script>
            </div>
          </body>
        </SidebarProvider>
      </UserContextProvider>
    </html>
  );
}
