"use client";

import { Clock, Search, X } from "lucide-react";
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
        setHistoryItems(response.data.data);
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
      // Update products in context with the search results
      const totalProduct = [
        ...response.data.rankedProducts,
        ...response.data.otherProducts,
      ];
      setProducts(totalProduct || []);

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
                <div className="space-y-2">
                  {historyItems.map((item) => (
                    <button
                      type="button"
                      key={item._id}
                      onClick={() => handleSearch(item.query, item.searchId)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" || e.key === " ") {
                          e.preventDefault();
                          handleSearch(item.query, item.searchId);
                        }
                      }}
                      className={`w-full text-left p-3 rounded-lg transition-all duration-200 border ${
                        activeItem === item.searchId
                          ? "bg-blue-50 border-blue-200 shadow-sm"
                          : "bg-white border-gray-200 hover:bg-gray-50 hover:border-gray-300"
                      }`}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                                <Search className="w-4 h-4 text-blue-600" />
                              </div>
                              <div className="min-w-0">
                                <p className="font-medium text-gray-900 truncate">
                                  {item.query}
                                </p>
                                <div className="flex items-center gap-3 mt-1">
                                  <span className="text-xs text-gray-500">
                                    {formatTimeAgo(item.createdAt)}
                                  </span>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>

                        <button
                          type="button"
                          onClick={(e) =>
                            handleClearItem(item._id, item.searchId, e)
                          }
                          className="opacity-70 hover:opacity-100 transition-opacity p-1.5 hover:bg-gray-100 rounded ml-2 flex-shrink-0"
                          aria-label="Remove search"
                        >
                          <X className="w-4 h-4 text-gray-400 hover:text-red-600" />
                        </button>
                      </div>
                    </button>
                  ))}
                </div>
              )
            )}
          </SidebarGroupContent>
        </SidebarGroup>
      )}

      {/* Footer Actions */}
      {state !== "collapsed" && historyItems.length > 0 && !loading && (
        <div className="pt-6 mt-6 border-t border-gray-200">
          <div className="text-center mb-4">
            <p className="text-sm text-gray-500">
              Click on any search to see results again
            </p>
          </div>
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
