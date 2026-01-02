"use client";

import { Clock, X } from "lucide-react";
import { useEffect, useState } from "react";
import {
  clearSearchHistory,
  deleteSearchHistoryItem,
  searchHistory as getSearchHistory,
  searchHistoryById,
} from "@/app/services/api";
import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarSeparator,
  useSidebar,
} from "@/components/ui/sidebar";
import { useUserContext } from "@/lib/authProvider";

interface SearchHistoryItem {
  _id: string;
  searchId: string;
  query: string;
  createdAt: string;
}

export default function SearchHistory() {
  const [historyItems, setHistoryItems] = useState<SearchHistoryItem[]>([]);
  const [activeItem, setActiveItem] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const { state } = useSidebar();
  const { setProducts, setCurrentPage } = useUserContext();

  // Fetch search history on mount
  useEffect(() => {
    const fetchSearchHistory = async () => {
      try {
        const response = await getSearchHistory();
        console.log("Fetched search history:", response.data);
        setHistoryItems(response.data.sessions);
      } catch (error) {
        console.error("Error fetching search history:", error);
      }
    };

    fetchSearchHistory();
  }, []);

  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor(
      (now.getTime() - date.getTime()) / (1000 * 60 * 60),
    );

    if (diffInHours < 1) {
      const diffInMinutes = Math.floor(
        (now.getTime() - date.getTime()) / (1000 * 60),
      );
      return `${diffInMinutes}m ago`;
    } else if (diffInHours < 24) {
      return `${diffInHours}h ago`;
    } else {
      const diffInDays = Math.floor(diffInHours / 24);
      return `${diffInDays}d ago`;
    }
  };

  const handleSearch = async (query: string, searchId: string) => {
    setActiveItem(searchId);
    setLoading(true);

    try {
      const response = await searchHistoryById(searchId);
      console.log("Search history item fetched:", response.data);

      setProducts(response.data.rankedProducts || []);

      // Reset to first page
      setCurrentPage(1);

      console.log("Search results loaded for:", query);
    } catch (error) {
      console.error("Error fetching search results:", error);
      // Optionally show an error message to the user
    } finally {
      setLoading(false);
    }
  };

  const handleClearItem = async (
    id: string,
    searchId: string,
    e: React.MouseEvent,
  ) => {
    e.stopPropagation();

    try {
      // Optionally delete from backend
      await deleteSearchHistoryItem(searchId);

      // Update local state
      setHistoryItems((prev) => prev.filter((item) => item._id !== id));
    } catch (error) {
      console.error("Error deleting search history item:", error);
      // Still remove from UI even if backend call fails
      setHistoryItems((prev) => prev.filter((item) => item._id !== id));
    }
  };

  const handleClearAll = async () => {
    try {
      // Optionally clear all from backend
      await clearSearchHistory();

      setHistoryItems([]);
    } catch (error) {
      console.error("Error clearing search history:", error);
      // Still clear UI even if backend call fails
      setHistoryItems([]);
    }
  };

  return (
    <div className="flex flex-col h-full">
      {state !== "collapsed" && (
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu />
            <SidebarSeparator />

            {loading && (
              <div className="text-center py-6">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                <p className="text-sm text-gray-500 mt-2">Loading results...</p>
              </div>
            )}

            {!loading && historyItems.length === 0 ? (
              <div className="text-center py-10 px-4">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Clock className="w-8 h-8 text-gray-400" />
                </div>
                <p className="text-gray-600 font-medium">
                  No search history yet
                </p>
                <p className="text-sm text-gray-400 mt-1">
                  Your recent searches will appear here
                </p>
              </div>
            ) : (
              !loading && (
                <div>
                  {historyItems.map((item) => {
                    const isActive = activeItem === item.searchId;

                    return (
                      <button
                        type="button"
                        key={item._id}
                        // role="button"
                        // tabIndex={0}
                        onClick={() => {
                          setActiveItem(item.searchId);
                          handleSearch(item.query, item.searchId);
                        }}
                        onKeyDown={(e) => {
                          if (e.key === "Enter" || e.key === " ") {
                            e.preventDefault();
                            setActiveItem(item.searchId);
                            handleSearch(item.query, item.searchId);
                          }
                        }}
                        className={`
                      group
                      w-full cursor-pointer rounded-lg p-2
                      transition-all duration-200
                      border
                      focus:outline-none focus:ring-2 focus:ring-gray-400

                      ${
                        isActive
                          ? "bg-gray-100 border-gray-300 shadow-sm"
                          : "border-transparent hover:border-gray-300 hover:bg-gray-50"
                      }
                    `}
                      >
                        <div className="flex items-start justify-between gap-3">
                          {/* Text stack */}
                          <div className="min-w-0 flex-1">
                            <p
                              className={`
                            truncate font-medium leading-tight
                            ${isActive ? "text-gray-900" : "text-gray-800"}
                          `}
                            >
                              {item.query}
                            </p>

                            <span className="block text-xs text-gray-500 leading-tight">
                              {formatTimeAgo(item.createdAt)}
                            </span>
                          </div>

                          {/* Remove button */}
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleClearItem(item._id, item.searchId, e);
                            }}
                            aria-label="Remove search"
                            className={`
                          p-1.5 rounded flex-shrink-0
                          transition-opacity duration-150
                          hover:bg-red-50

                          ${
                            isActive
                              ? "opacity-100"
                              : "opacity-0 group-hover:opacity-100"
                          }
                        `}
                          >
                            <X className="h-4 w-4 text-gray-400 hover:text-red-600" />
                          </button>
                        </div>
                      </button>
                    );
                  })}
                </div>
              )
            )}
          </SidebarGroupContent>
        </SidebarGroup>
      )}

      {/* Footer Actions */}
      {state !== "collapsed" && historyItems.length > 0 && !loading && (
        <div className="pt-6 mt-6 border-t border-gray-200">
          <button
            type="button"
            onClick={handleClearAll}
            className="w-full py-2.5 text-sm text-gray-600 hover:text-red-600 hover:bg-red-50 border border-gray-200 hover:border-red-200 rounded-lg transition-colors duration-200"
          >
            Clear All History
          </button>
        </div>
      )}

      {/* Info Footer */}
      {state !== "collapsed" && (
        <div className="mt-6 pt-6 border-t border-gray-200">
          <div className="flex items-center justify-between">
            <div className="text-xs text-gray-400">
              {historyItems.length} recent searches
            </div>
            <div className="text-xs text-gray-400">CompareX v1.0</div>
          </div>
        </div>
      )}
    </div>
  );
}
