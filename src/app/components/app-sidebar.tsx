"use client";

import {
  ChevronUp,
  Clock,
  Home,
  LogOut,
  Search,
  Sparkles,
  User,
} from "lucide-react";
import { useEffect, useState } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { useUserContext } from "@/lib/authProvider";
import { cn } from "@/lib/utils";
import { searchHistory, searchHistoryById } from "../services/api";

/* ----------------------------------
   Types
----------------------------------- */
interface HistoryItem {
  searchId: string;
  query: string;
  createdAt: string;
}

/* ----------------------------------
   Utils
----------------------------------- */
function timeAgo(dateString: string) {
  const now = new Date();
  const past = new Date(dateString);
  const diff = Math.floor((now.getTime() - past.getTime()) / 1000);

  if (diff < 60) return `${diff}s ago`;
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  if (diff < 2592000) return `${Math.floor(diff / 86400)}d ago`;

  return past.toLocaleDateString();
}

/* ----------------------------------
   Skeleton
----------------------------------- */
function HistorySkeleton() {
  return (
    <div className="space-y-2 px-2">
      {[1, 2, 3, 4, 5].map((key) => (
        <div key={key} className="space-y-1">
          <div className="h-4 w-3/4 rounded bg-gray-200 animate-pulse" />
          <div className="h-3 w-1/2 rounded bg-gray-100 animate-pulse" />
        </div>
      ))}
    </div>
  );
}

/* ----------------------------------
   Component
----------------------------------- */
export function AppSidebar() {
  const [username, setUsername] = useState("User");
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [loadingHistory, setLoadingHistory] = useState(true);
  const [activeSearch, setActiveSearch] = useState<string | null>(null);

  const { logout, setProducts, token } = useUserContext();

  useEffect(() => {
    if (!token) {
      setUsername("User");
    }

    const storedUsername = localStorage.getItem("username") || "User";
    setUsername(storedUsername);
  }, [token]);

  useEffect(() => {
    async function getHistory() {
      try {
        const res = await searchHistory();
        if (!token) {
          console.log("not authenticated");
        }
        setHistory(res.data.sessions || []);
      } finally {
        setLoadingHistory(false);
      }
    }
    getHistory();
  }, [token]);

  async function handleSearchClick(searchId: string) {
    setActiveSearch(searchId);
    const res = await searchHistoryById(searchId);
    setProducts(res.data.rankedProducts);
  }

  return (
    <Sidebar collapsible="icon" className="border-r border-gray-200 bg-white">
      {/* ---------- Header ---------- */}
      <SidebarHeader className="border-b border-gray-100 px-4 py-4 ">
        <div className="flex items-center justify-between">
          <div className="flex items-center group-data-[collapsible=icon]:hidden gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-blue-500 to-purple-600">
              <Sparkles className="h-4 w-4 text-white" />
            </div>
            <h2 className="text-lg font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              CompareX
            </h2>
          </div>
          <SidebarTrigger className="h-8 w-8 rounded-lg hover:bg-gray-100" />
        </div>
      </SidebarHeader>

      <SidebarContent className="px-3 py-4">
        {/* ---------- Navigation ---------- */}
        <SidebarGroup className="mb-6">
          <SidebarGroupLabel className="px-3 text-xs font-semibold uppercase tracking-wider text-gray-500 mb-2">
            Navigation
          </SidebarGroupLabel>
          <SidebarMenu className="space-y-1">
            <SidebarMenuItem>
              <SidebarMenuButton
                className={cn(
                  "group relative flex items-center gap-3 rounded-lg px-3 py-2.5",
                  "transition-all duration-200",
                  "hover:bg-blue-50 hover:text-blue-600",
                  "data-[active=true]:bg-blue-50 data-[active=true]:text-blue-600",
                )}
                asChild
              >
                <a href="/">
                  <Home className="h-5 w-5" />
                  <span className="font-medium">Home</span>
                </a>
              </SidebarMenuButton>
            </SidebarMenuItem>

            <SidebarMenuItem>
              <SidebarMenuButton
                className={cn(
                  "group relative flex items-center gap-3 rounded-lg px-3 py-2.5",
                  "transition-all duration-200",
                  "hover:bg-purple-50 hover:text-purple-600",
                  "data-[active=true]:bg-purple-50 data-[active=true]:text-purple-600",
                )}
                asChild
              >
                <a href="/about">
                  <User className="h-5 w-5" />
                  <span className="font-medium">About</span>
                </a>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarGroup>

        {/* ---------- Search History ---------- */}
        <SidebarGroup className="group-data-[collapsible=icon]:hidden">
          <SidebarGroupLabel className="flex items-center gap-2 px-3 text-xs font-semibold uppercase tracking-wider text-gray-500 mb-2">
            <Clock className="h-3.5 w-3.5" />
            Recent Searches
          </SidebarGroupLabel>

          <SidebarMenu className="space-y-1">
            {loadingHistory ? (
              <HistorySkeleton />
            ) : history.length === 0 ? (
              <div className="px-3 py-8 text-center">
                <Search className="h-8 w-8 mx-auto mb-2 text-gray-300" />
                <p className="text-sm text-gray-400">No search history yet</p>
              </div>
            ) : (
              <div className="max-h-[500px] overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent">
                {history.map((item) => (
                  <SidebarMenuItem key={item.searchId}>
                    <SidebarMenuButton
                      className={cn(
                        "group relative  cursor-pointer gap-0  rounded-lg px-3 py-2.5",
                        "transition-all duration-200",
                        "hover:bg-gray-50",
                        activeSearch === item.searchId &&
                          "bg-gray-100 border-l-2 border-blue-500",
                      )}
                      asChild
                    >
                      <button
                        type="button"
                        onClick={() => handleSearchClick(item.searchId)}
                        className="w-full flex flex-col h-fit items-start gap-0"
                      >
                        <span className="truncate text-sm font-medium text-gray-700 group-hover:text-gray-900">
                          {item.query}
                        </span>
                        <span className="text-xs text-gray-400">
                          {timeAgo(item.createdAt)}
                        </span>
                      </button>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </div>
            )}
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>

      {/* ---------- Footer ---------- */}
      <SidebarFooter className="border-t border-gray-100 p-3">
        <SidebarMenu>
          <SidebarMenuItem>
            <DropdownMenu modal={false}>
              <DropdownMenuTrigger asChild>
                <SidebarMenuButton className="group flex items-center gap-3 rounded-lg px-3 py-2.5 hover:bg-gray-50 transition-all">
                  <div className="flex min-h-6 min-w-6 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-purple-600 text-white font-semibold text-sm">
                    {username.charAt(0).toUpperCase()}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="truncate text-sm font-medium text-gray-700">
                      {username}
                    </p>
                    <p className="text-xs text-gray-400">View profile</p>
                  </div>
                  <ChevronUp className="h-4 w-4 text-gray-400 group-hover:text-gray-600 transition-transform group-data-[state=open]:rotate-180" />
                </SidebarMenuButton>
              </DropdownMenuTrigger>

              <DropdownMenuContent
                className="w-56 rounded-lg border border-gray-200 bg-white shadow-lg"
                side="top"
                align="end"
              >
                <DropdownMenuItem
                  className="cursor-pointer rounded-md hover:bg-red-50 focus:bg-red-50 transition-colors"
                  onClick={logout}
                >
                  <LogOut className="mr-2 h-4 w-4 text-red-600" />
                  <span className="text-red-600 font-medium">Sign out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
