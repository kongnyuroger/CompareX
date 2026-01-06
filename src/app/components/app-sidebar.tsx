"use client";

import { ChevronUp, Home, Menu, User, User2 } from "lucide-react";
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
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { useUserContext } from "@/lib/authProvider";
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
const skeletonKeys = ["a", "b", "c", "d", "e"];
function HistorySkeleton() {
  return (
    <div className="space-y-2 px-4">
      {skeletonKeys.map((key) => (
        <div key={key} className="h-10 rounded-md bg-muted animate-pulse" />
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
        setHistory(res.data.sessions);
      } finally {
        setLoadingHistory(false);
      }
    }
    getHistory();
  }, [token]);

  async function getsession(searchId: string) {
    const res = await searchHistoryById(searchId);
    setProducts(res.data.rankedProducts);
  }

  return (
    <Sidebar
      collapsible="icon"
      className="
        border-r
        bg-gradient-to-b
        from-indigo-50
        to-white
        dark:from-slate-900
        dark:to-slate-950
      "
    >
      <SidebarContent>
        {/* ---------- Header ---------- */}
        <SidebarHeader className="border-b px-4 py-3">
          <div className="flex items-center gap-3">
            <SidebarTrigger className="rounded-md p-1 text-indigo-600 hover:bg-indigo-100">
              <Menu />
            </SidebarTrigger>

            <h2 className="font-semibold tracking-tight text-indigo-600">
              CompareX
            </h2>
          </div>
        </SidebarHeader>

        {/* ---------- Main Menu ---------- */}
        <SidebarGroup>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton
                className="
                  gap-3
                  rounded-md
                  px-3
                  py-2
                  hover:bg-indigo-100
                  hover:text-indigo-600
                  data-[active=true]:bg-indigo-600
                  data-[active=true]:text-white
                "
                asChild
              >
                <a
                  href="/"
                  className="flex items-center gap-3 rounded-md px-3 py-2 hover:bg-indigo-100 hover:text-indigo-600"
                >
                  <Home />
                  <span>Home</span>
                </a>
              </SidebarMenuButton>
            </SidebarMenuItem>

            <SidebarMenuItem>
              <SidebarMenuButton
                className="
                  gap-3
                  rounded-md
                  px-3
                  py-2
                  hover:bg-indigo-100
                  hover:text-indigo-600
                  data-[active=true]:bg-indigo-600
                  data-[active=true]:text-white
                "
                asChild
              >
                <a
                  href="/"
                  className="flex items-center gap-3 rounded-md px-3 py-2 hover:bg-indigo-100 hover:text-indigo-600"
                >
                  <User />
                  <span>About</span>
                </a>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarGroup>

        {/* ---------- History ---------- */}
        <SidebarGroup>
          <SidebarMenu>
            {loadingHistory ? (
              <HistorySkeleton />
            ) : (
              history.map((item) => (
                <SidebarMenuItem key={item.searchId}>
                  <SidebarMenuButton
                    className="
                  h-fit
                    gap-3
                    rounded-md
                    px-3
                    py-2
                    hover:bg-indigo-100
                    hover:text-indigo-600
                    data-[active=true]:bg-indigo-600
                    data-[active=true]:text-white
                  "
                    asChild
                  >
                    <button
                      type="button"
                      onClick={() => getsession(item.searchId)}
                      className="
                         flex w-full flex-col items-start 
                        rounded-md px-3 py-2
                        text-left
                        hover:bg-indigo-50
                        transition
                      "
                    >
                      <span className="truncate text-sm font-medium">
                        {item.query}
                      </span>

                      <span className="text-xs text-muted-foreground">
                        {timeAgo(item.createdAt)}
                      </span>
                    </button>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))
            )}
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>

      {/* ---------- Footer ---------- */}
      <SidebarFooter className="border-t p-2">
        <SidebarMenu>
          <SidebarMenuItem>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <SidebarMenuButton className="gap-3 rounded-md px-3 py-2 hover:bg-indigo-100">
                  <User2 className="text-indigo-600" />
                  <span className="truncate">{username}</span>
                  <ChevronUp className="ml-auto opacity-60" />
                </SidebarMenuButton>
              </DropdownMenuTrigger>

              <DropdownMenuContent className="border-0 bg-white" side="top">
                <DropdownMenuItem
                  className=" cursor-pointer
                  "
                >
                  <button
                    type="button"
                    onClick={logout}
                    className="flex w-full items-center  cursor-pointer text-error gap-3"
                  >
                    <Home />
                    <span>Sign out</span>
                  </button>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
