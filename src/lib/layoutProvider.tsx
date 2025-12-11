"use client";

import { History, Home, LogOut, Menu, Search, User, X } from "lucide-react";
import { useEffect, useState } from "react";
import Navbar from "@/app/components/Navbar";
import SearchHistory from "@/app/components/SearchHistory";
import {
  Sidebar,
  SidebarContent,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { useUserContext } from "./authProvider";

export function LayoutContextProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [_isMobile, setIsMobile] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const { token, logout, loading } = useUserContext();
  const isLoggedIn = !!token;

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const toggleCollapse = () => {
    setIsCollapsed(!isCollapsed);
  };

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
      <div className="flex min-h-screen w-full bg-gray-50">
        {/* Global Sidebar Trigger - Only show on mobile OR when sidebar is closed */}
        {isLoggedIn && (
          <SidebarTrigger className="fixed top-4 left-4 z-50 bg-primary text-white p-2.5 rounded-lg shadow-lg hover:bg-primary-dark transition-all hover:scale-105 md:hidden flex items-center justify-center">
            <Menu className="h-5 w-5" />
          </SidebarTrigger>
        )}

        {isLoggedIn && (
          <Sidebar
            className={`border-r border-gray-200 bg-white shadow-lg transition-all duration-300 ease-in-out ${
              isCollapsed
                ? "w-[70px] min-w-[70px]"
                : "w-[300px] lg:w-[20%] min-w-[280px] max-w-[350px]"
            }`}
            collapsible="icon"
          >
            <SidebarContent className="p-4 h-full overflow-y-auto flex flex-col">
              {/* Sidebar Header with Close Button */}
              <div
                className={`flex items-center ${isCollapsed ? "justify-center" : "justify-between"} mb-6`}
              >
                {!isCollapsed && (
                  <div>
                    <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                      <Search className="w-5 h-5" />
                      Search History
                    </h2>
                    <p className="text-sm text-gray-500 mt-1">
                      Click any search to see results
                    </p>
                  </div>
                )}

                {/* Close/Collapse button inside sidebar */}
                <button
                  type="button"
                  onClick={toggleCollapse}
                  className="p-1.5 hover:bg-gray-100 rounded-md transition-colors"
                >
                  {isCollapsed ? (
                    <Menu className="h-5 w-5 text-gray-500" />
                  ) : (
                    <X className="h-5 w-5 text-gray-500" />
                  )}
                </button>
              </div>

              {!isCollapsed && <div className="h-px bg-gray-200 mb-6"></div>}

              {!isCollapsed ? (
                <div className="space-y-3 flex-1">
                  <SearchHistory />
                </div>
              ) : (
                <div className="flex-1 flex flex-col items-center gap-4 pt-4">
                  <button
                    type="button"
                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    <Home className="h-5 w-5 text-gray-600" />
                  </button>
                  <button
                    type="button"
                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    <History className="h-5 w-5 text-gray-600" />
                  </button>
                  <button
                    type="button"
                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    <Search className="h-5 w-5 text-gray-600" />
                  </button>
                </div>
              )}

              {/* User section at bottom */}
              <div
                className={`mt-auto pt-6 border-t border-gray-200 ${isCollapsed ? "px-2" : ""}`}
              >
                {isCollapsed ? (
                  // Collapsed user section
                  <div className="flex flex-col items-center gap-3">
                    <button
                      type="button"
                      onClick={logout}
                      className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                      title="Logout"
                    >
                      <LogOut className="h-5 w-5 text-gray-600" />
                    </button>
                    <div className="h-8 w-8 bg-gradient-to-br from-primary to-primary-dark rounded-full flex items-center justify-center">
                      <User className="h-4 w-4 text-white" />
                    </div>
                  </div>
                ) : (
                  // Expanded user section
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 bg-gradient-to-br from-primary to-primary-dark rounded-full flex items-center justify-center">
                        <User className="h-5 w-5 text-white" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-700">
                          User Account
                        </p>
                        <p className="text-xs text-gray-500">
                          {token ? "Logged In" : "Not Logged In"}
                        </p>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={logout}
                      className="text-sm text-primary hover:text-primary-dark hover:bg-primary/10 px-3 py-1.5 rounded-lg transition-colors flex items-center gap-2"
                    >
                      <LogOut className="h-4 w-4" />
                      Logout
                    </button>
                  </div>
                )}
              </div>
            </SidebarContent>
          </Sidebar>
        )}

        {/* Main Content - Adjust padding based on sidebar state */}
        <div
          className={`flex-1 min-h-screen flex flex-col transition-all duration-300 ${
            isLoggedIn && !isCollapsed ? "md:pl-0" : ""
          } ${isLoggedIn ? "" : "w-full"}`}
        >
          <Navbar />
          <main className="flex-1 p-4 md:p-6 lg:p-8">
            <div className="max-w-6xl mx-auto">{children}</div>
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}
