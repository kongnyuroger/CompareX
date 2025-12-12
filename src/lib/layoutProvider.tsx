"use client";

import { LogOut, Menu, Search, User } from "lucide-react";
import Navbar from "@/app/components/Navbar";
import SearchHistory from "@/app/components/SearchHistory";
import { SearchHistorySidebar } from "@/app/components/sidebar";
import {
  Sidebar,
  SidebarContent,
  SidebarProvider,
  SidebarTrigger,
  useSidebar,
} from "@/components/ui/sidebar";
import { useUserContext } from "./authProvider";

export function LayoutContextProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const { token, logout, loading } = useUserContext();

  const isLoggedIn = !!token;

  if (loading) {
    return (
      <div className="flex min-h-screen w-full bg-gray-50 items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <SidebarProvider defaultOpen={isLoggedIn}>
      <SearchHistorySidebar />
      <div
        className={`flex-1 min-h-screen flex flex-col transition-all duration-300 ${
          isLoggedIn ? "md:pl-0" : ""
        } ${isLoggedIn ? "" : "w-full"}`}
      >
        <Navbar />
        <main className="flex-1 p-4 ">
          <div className="max-w-6xl mx-auto">{children}</div>
        </main>
      </div>
    </SidebarProvider>
  );
}
