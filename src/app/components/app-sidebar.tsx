// app/components/app-sidebar.tsx

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
import Link from "next/link";
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

interface ProductScore {
  productId: string;
  relevanceScore: number;
  aiReasoning: string;
}

interface Product {
  id: string;
  title: string;
  price: number;
  badge: string;
  badgeColor: string;
  imageUrl: string;
  source: string;
  productUrl: string;
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
  const [loadingSearchId, setLoadingSearchId] = useState<string | null>(null);

  const { logout, token } = useUserContext();

  useEffect(() => {
    if (!token) {
      setUsername("User");
      setHistory([]); // Clear search history when user logs out
      setActiveSearch(null); // Clear active search selection
    } else {
      const storedUsername = localStorage.getItem("username") || "User";
      setUsername(storedUsername);
    }
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

  /**
   * Handle search history click
   * Fetches products AND scores, then sorts by AI relevance
   */
  async function handleSearchClick(searchId: string) {
    setActiveSearch(searchId);
    setLoadingSearchId(searchId);

    try {
      // Fetch search results with scores
      const res = await searchHistoryById(searchId);

      const rankedProducts: Product[] = res.data.rankedProducts || [];
      const productScores: ProductScore[] = res.data.productScores || [];

      console.log("📜 Historical search loaded:", {
        searchId,
        products: rankedProducts.length,
        scores: productScores.length,
      });

      // Sort products by AI score (highest first)
      const sortedProducts = [...rankedProducts].sort((a, b) => {
        const scoreA =
          productScores.find((s) => s.productId === a.id)?.relevanceScore || 0;
        const scoreB =
          productScores.find((s) => s.productId === b.id)?.relevanceScore || 0;
        return scoreB - scoreA; // Descending order
      });

      console.log("✅ Products sorted by AI score:", {
        topProduct: sortedProducts[0]?.title,
        topScore: productScores.find(
          (s) => s.productId === sortedProducts[0]?.id,
        )?.relevanceScore,
      });

      // Dispatch custom event to homepage with sorted products and scores
      const event = new CustomEvent("historicalSearch", {
        detail: {
          products: sortedProducts,
          scores: productScores,
          searchId,
        },
      });
      window.dispatchEvent(event);
    } catch (error) {
      console.error("Failed to load historical search:", error);
    } finally {
      setLoadingSearchId(null);
    }
  }

  return (
    <Sidebar collapsible="icon" className="border-r border-gray-200 bg-white">
      {/* ---------- Header ---------- */}
      <SidebarHeader className="border-b border-gray-100 px-4 py-4">
        <div className="flex items-center justify-between group-data-[collapsible=icon]:justify-center">
          <div className="flex items-center group-data-[collapsible=icon]:hidden gap-2">
            <h2 className="text-lg font-bold bg-gradient-to-r from-blue-600 to-primary bg-clip-text text-transparent">
              CompareX
            </h2>
          </div>
          <SidebarTrigger className="h-8 w-8 rounded-lg hover:bg-gray-100 cursor-pointer" />
        </div>
      </SidebarHeader>

      <SidebarContent className=" py-4">
        {/* ---------- Navigation ---------- */}
        <SidebarGroup className="mb-6">
          <SidebarGroupLabel className="px-3 text-xs font-semibold uppercase tracking-wider text-gray-500 mb-2 group-data-[collapsible=icon]:hidden">
            Navigation
          </SidebarGroupLabel>
          <SidebarMenu className="space-y-1">
            <SidebarMenuItem>
              <SidebarMenuButton
                className={cn(
                  "group/item relative flex items-center gap-3 rounded-lg px-3 py-2.5",
                  "transition-all duration-200",
                  "hover:bg-gradient-to-r hover:from-blue-50 hover:to-blue-100 hover:text-blue-600 hover:shadow-sm",
                  "data-[active=true]:bg-gradient-to-r data-[active=true]:from-blue-50 data-[active=true]:to-blue-100 data-[active=true]:text-blue-600 data-[active=true]:shadow-sm",
                  "group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:w-12 group-data-[collapsible=icon]:h-12 group-data-[collapsible=icon]:p-0 group-data-[collapsible=icon]:mx-auto",
                )}
                asChild
              >
                <a href="/">
                  <div className="relative">
                    <Home className="h-5 w-5 transition-transform group-hover/item:scale-110" />
                    <div className="absolute inset-0 bg-blue-400 blur-md opacity-0 group-hover/item:opacity-20 transition-opacity" />
                  </div>
                  <span className="font-medium group-data-[collapsible=icon]:hidden">
                    Home
                  </span>
                </a>
              </SidebarMenuButton>
            </SidebarMenuItem>

            <SidebarMenuItem>
              <SidebarMenuButton
                className={cn(
                  "group/item relative flex items-center gap-3 rounded-lg px-3 py-2.5",
                  "transition-all duration-200",
                  "hover:bg-gradient-to-r hover:from-purple-50 hover:to-purple-100 hover:text-purple-600 hover:shadow-sm",
                  "data-[active=true]:bg-gradient-to-r data-[active=true]:from-purple-50 data-[active=true]:to-purple-100 data-[active=true]:text-purple-600 data-[active=true]:shadow-sm",
                  "group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:w-12 group-data-[collapsible=icon]:h-12 group-data-[collapsible=icon]:p-0 group-data-[collapsible=icon]:mx-auto",
                )}
                asChild
              >
                <Link href="/about">
                  <div className="relative">
                    <User className="h-5 w-5 transition-transform group-hover/item:scale-110" />
                    <div className="absolute inset-0 bg-primary blur-md opacity-0 group-hover/item:opacity-20 transition-opacity" />
                  </div>
                  <span className="font-medium group-data-[collapsible=icon]:hidden">
                    About
                  </span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarGroup>

        {/* ---------- Search History ---------- */}
        <SidebarGroup className="group-data-[collapsible=icon]:hidden">
          <SidebarGroupLabel className="flex items-center gap-2 px-3 text-xs font-semibold uppercase tracking-wider text-gray-500 mb-2">
            <Clock className="h-3.5 w-3.5" />
            Search History
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
                        "group relative cursor-pointer gap-0 rounded-lg px-3 py-2.5",
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
                        disabled={loadingSearchId === item.searchId}
                        className="w-full flex flex-col h-fit items-start gap-0 disabled:opacity-50"
                      >
                        <div className="w-full flex items-center justify-between">
                          <span className="truncate text-sm font-medium text-gray-700 group-hover:text-gray-900">
                            {item.query}
                          </span>
                          {loadingSearchId === item.searchId && (
                            <svg
                              aria-hidden="true"
                              className="animate-spin h-4 w-4 text-blue-500"
                              xmlns="http://www.w3.org/2000/svg"
                              fill="none"
                              viewBox="0 0 24 24"
                            >
                              <circle
                                className="opacity-25"
                                cx="12"
                                cy="12"
                                r="10"
                                stroke="currentColor"
                                strokeWidth="4"
                              ></circle>
                              <path
                                className="opacity-75"
                                fill="currentColor"
                                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                              ></path>
                            </svg>
                          )}
                        </div>
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
      {token && (
        <SidebarFooter className="border-t border-gray-100 p-3">
          <SidebarMenu>
            <SidebarMenuItem>
              <DropdownMenu modal={false}>
                <DropdownMenuTrigger asChild>
                  <SidebarMenuButton className="group/footer flex items-center gap-3 rounded-lg px-3 py-2.5 hover:bg-gradient-to-r hover:from-gray-50 hover:to-gray-100 hover:shadow-sm transition-all group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:w-12 group-data-[collapsible=icon]:h-12 group-data-[collapsible=icon]:p-0 group-data-[collapsible=icon]:mx-auto">
                    <div className="relative flex min-h-6 min-w-6 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-purple-600 text-white font-semibold text-sm shadow-md group-hover/footer:shadow-lg group-hover/footer:scale-110 transition-all">
                      {username.charAt(0).toUpperCase()}
                      <div className="absolute inset-0 rounded-full bg-blue-400 blur-md opacity-0 group-hover/footer:opacity-30 transition-opacity" />
                    </div>
                    <div className="flex-1 min-w-0 group-data-[collapsible=icon]:hidden">
                      <p className="truncate text-sm font-medium text-gray-700">
                        {username}
                      </p>
                      <p className="text-xs text-gray-400">View profile</p>
                    </div>
                    <ChevronUp className="h-4 w-4 text-gray-400 group-hover/footer:text-gray-600 transition-transform group-data-[state=open]:rotate-180 group-data-[collapsible=icon]:hidden" />
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
      )}
    </Sidebar>
  );
}
