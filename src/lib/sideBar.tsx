"use client";
import {
  ChevronLeft,
  ChevronRight,
  History,
  Home,
  LogOut,
  Search,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useUserContext } from "@/lib/authProvider";

export default function Sidebar() {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const { token, loading, logout } = useUserContext();
  const navigate = useRouter();

  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed);
  };

  return (
    <div
      className={`hidden md:flex h-screen sticky top-0 ${isCollapsed ? "w-16" : "w-64"} transition-all duration-300 ease-in-out flex-col border-r bg-white`}
    >
      {/* Collapse/Expand Trigger at Top */}
      <div className="p-4 border-b flex items-center justify-between">
        {!isCollapsed && (
          <Link href="/" className="text-xl font-semibold text-primary-900">
            <span className="text-2xl text-primary">C</span>ompareX
          </Link>
        )}
        <button
          type="button"
          onClick={toggleSidebar}
          className="p-2 rounded-lg hover:bg-gray-100"
          aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          {isCollapsed ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
        </button>
      </div>

      {/* Main Navigation - Hidden when collapsed */}
      {!isCollapsed && (
        <div className="flex-1 p-4 overflow-y-auto">
          <nav className="space-y-2">
            <Link
              href="/"
              className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-100"
            >
              <Home size={20} />
              <span>Home</span>
            </Link>

            <Link
              href="/search"
              className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-100"
            >
              <Search size={20} />
              <span>Search</span>
            </Link>

            <Link
              href="/history"
              className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-100"
            >
              <History size={20} />
              <span>Search History</span>
            </Link>

            {/* Add more navigation items as needed */}
          </nav>
        </div>
      )}

      {/* Logout Button at Bottom - Always visible */}
      <div className="p-4 border-t mt-auto">
        {loading ? null : token ? (
          <button
            type="button"
            onClick={() => {
              logout();
              navigate.push("/login");
            }}
            className={`flex items-center ${isCollapsed ? "justify-center" : "justify-start"} gap-3 w-full p-3 rounded-lg hover:bg-red-50 hover:text-red-600`}
            aria-label={isCollapsed ? "Logout" : "Logout"}
          >
            <LogOut size={20} />
            {!isCollapsed && <span>Logout</span>}
          </button>
        ) : (
          !isCollapsed && (
            <Link
              href="/login"
              className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-100"
            >
              <LogOut size={20} />
              <span>Login</span>
            </Link>
          )
        )}
      </div>
    </div>
  );
}
