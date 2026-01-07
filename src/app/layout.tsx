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
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen`}
      >
        <UserContextProvider>
          <SidebarProvider>
            {/* Root flex container */}
            <div className="flex min-h-screen w-full">
              {/* Sidebar */}
              <AppSidebar />

              {/* Main content */}
              <div className="flex flex-col flex-1 min-h-screen">
                {/* Mobile trigger */}
                <SidebarTrigger className="py-7 mx-5 sm:hidden" />

                {/* Top navbar */}
                <Navbar />

                {/* Page content */}
                <main className="flex-1">{children}</main>
              </div>
            </div>

            <Script src="https://apis.google.com/js/platform.js" async defer />
          </SidebarProvider>
        </UserContextProvider>
      </body>
    </html>
  );
}
