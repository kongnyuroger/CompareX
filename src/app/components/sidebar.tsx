"use client";

import { LogOut, Menu, Search, User } from "lucide-react";
import SearchHistory from "@/app/components/SearchHistory";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarTrigger,
  useSidebar,
} from "@/components/ui/sidebar";
import { useUserContext } from "@/lib/authProvider";

export function SearchHistorySidebar() {
  const { token, logout, loading } = useUserContext();
  const { state } = useSidebar();

  const isLoggedIn = !!token;
  const isCollapsed = state === "collapsed";

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

  if (!isLoggedIn) return null;

  return (
    <Sidebar
      className="w-[calc(var(--sidebar-width)+40px)] p-4"
      collapsible="icon"
    >
      <SidebarHeader
        className={`flex items-center mb-6 ${
          isCollapsed ? "justify-center" : "justify-between"
        }`}
      >
        <div className="flex">
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
          <SidebarTrigger>
            <Menu />
          </SidebarTrigger>
        </div>
      </SidebarHeader>

      {/* Search History */}
      <SidebarContent>
        <SearchHistory />
      </SidebarContent>
      {/* User Section */}
      <SidebarFooter
        className={`mt-auto pt-6 border-t border-gray-200 ${
          isCollapsed ? "px-2" : ""
        }`}
      >
        {isCollapsed ? (
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
      </SidebarFooter>
    </Sidebar>
  );
}
