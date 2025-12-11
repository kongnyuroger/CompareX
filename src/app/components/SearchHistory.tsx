"use client";

import { Clock, Search, X } from "lucide-react";
import { useState } from "react";
import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarSeparator,
  useSidebar,
} from "@/components/ui/sidebar";

interface SearchHistoryItem {
  id: string;
  query: string;
  timestamp: Date;
  resultCount: number;
}

export default function SearchHistory() {
  const [searchHistory, setSearchHistory] = useState<SearchHistoryItem[]>([
    {
      id: "1",
      query: "iPhone 13 Case",
      timestamp: new Date(Date.now() - 3600000),
      resultCount: 50,
    },
    {
      id: "2",
      query: "Wireless Headphones",
      timestamp: new Date(Date.now() - 7200000),
      resultCount: 32,
    },
    {
      id: "3",
      query: "Laptop Backpack",
      timestamp: new Date(Date.now() - 86400000),
      resultCount: 18,
    },
    {
      id: "4",
      query: "Smart Watch Series 7",
      timestamp: new Date(Date.now() - 172800000),
      resultCount: 27,
    },
    {
      id: "5",
      query: "Gaming Mouse",
      timestamp: new Date(Date.now() - 259200000),
      resultCount: 41,
    },
  ]);

  const [activeItem, setActiveItem] = useState<string | null>(null);
  const { state } = useSidebar();

  const formatTimeAgo = (date: Date) => {
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

  const handleSearch = (query: string, id: string) => {
    setActiveItem(id);
    console.log("Searching for:", query);
    // Add your search logic here
  };

  const handleClearItem = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setSearchHistory((prev) => prev.filter((item) => item.id !== id));
  };

  const handleClearAll = () => {
    setSearchHistory([]);
  };

  return (
    <div className="flex flex-col h-full">
      {state !== "collapsed" && (
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu />
            <SidebarSeparator />

            {searchHistory.length === 0 ? (
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
              <div className="space-y-2">
                {searchHistory.map((item) => (
                  <button
                    type="button"
                    key={item.id}
                    onClick={() => handleSearch(item.query, item.id)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" || e.key === " ") {
                        e.preventDefault();
                        handleSearch(item.query, item.id);
                      }
                    }}
                    className={`w-full text-left p-3 rounded-lg transition-all duration-200 border ${
                      activeItem === item.id
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
                                  {formatTimeAgo(item.timestamp)}
                                </span>
                                <span className="text-xs px-2 py-0.5 bg-gray-100 text-gray-600 rounded-full">
                                  {item.resultCount} results
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={(e) => handleClearItem(item.id, e)}
                        className="opacity-70 hover:opacity-100 transition-opacity p-1.5 hover:bg-gray-100 rounded ml-2 flex-shrink-0"
                        aria-label="Remove search"
                      >
                        <X className="w-4 h-4 text-gray-400 hover:text-red-600" />
                      </button>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </SidebarGroupContent>
        </SidebarGroup>
      )}

      {/* Footer Actions */}
      {state !== "collapsed" && searchHistory.length > 0 && (
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
              {searchHistory.length} recent searches
            </div>
            <div className="text-xs text-gray-400">CompareX v1.0</div>
          </div>
        </div>
      )}
    </div>
  );
}
