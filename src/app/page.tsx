// app/page.tsx

"use client";

import { useEffect, useRef, useState } from "react";
import { useUserContext } from "@/lib/authProvider";
import {
  type ProductScore,
  type StreamComplete,
  type StreamError,
  type StreamedProduct,
  type StreamStats,
  searchSocketService,
} from "@/services/searchSocketService";
import AIScoreSummary from "./components/AIScoreSummary";
import AILoadingComponent from "./components/botLoader";
import Hero from "./components/Hero";
import Pagination from "./components/Pagination";
import ProductGrid from "./components/ProductGrid";
import ScoreComparisonView from "./components/ScoreComparisonView";
import { trendingProducts } from "./services/api";

interface ApiError {
  response?: {
    data?: {
      message?: string;
    };
  };
  message?: string;
}

export default function HomePage() {
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [searchId, setSearchId] = useState<string | null>(null);
  const [streamStats, setStreamStats] = useState<StreamStats | null>(null);
  const [isTrending, setIsTrending] = useState(true);
  const [productScores, setProductScores] = useState<ProductScore[]>([]);
  const [sortByAI, setSortByAI] = useState(false); // Toggle for AI sorting
  const [isHistoricalSearch, setIsHistoricalSearch] = useState(false); // Track if viewing history

  const { products, setProducts, currentPage, setCurrentPage } =
    useUserContext();

  const productsPerPage = 6;

  // Sort products by AI scores if enabled
  const sortedProducts =
    sortByAI && productScores.length > 0
      ? [...products].sort((a, b) => {
          const scoreA =
            productScores.find((s) => s.productId === a.id)?.relevanceScore ||
            0;
          const scoreB =
            productScores.find((s) => s.productId === b.id)?.relevanceScore ||
            0;
          return scoreB - scoreA; // Descending order (highest score first)
        })
      : products;

  // Calculate pagination values from sorted products
  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = sortedProducts.slice(
    indexOfFirstProduct,
    indexOfLastProduct,
  );
  const totalPages = Math.ceil(sortedProducts.length / productsPerPage);

  /**
   * Handle streaming search with Socket.IO
   */
  const handleSearch = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!search.trim()) return;

    try {
      setLoading(true);
      setError("");
      setCurrentPage(1);
      setProducts([]);
      setSearchId(null);
      setStreamStats(null);
      setProductScores([]);
      setIsTrending(false);
      setSortByAI(false); // Reset AI sorting

      // Start Socket.IO stream
      const { searchId: newSearchId } = await searchSocketService.startSearch(
        search,
        {
          onSearchStarted: (data) => {
            console.log("🚀 Search started:", data);
            setSearchId(data.searchId);
          },

          onProduct: (
            newProducts: StreamedProduct[],
            scores: ProductScore[],
            sid: string,
          ) => {
            console.log(
              `📦 Received ${newProducts.length} products from ${sid}`,
            );

            setSearchId(sid);

            // Append new products (avoid duplicates)
            setProducts((prevProducts) => {
              const existingIds = new Set(prevProducts.map((p) => p.id));
              const uniqueNewProducts = newProducts.filter(
                (p) => !existingIds.has(p.id),
              );
              return [...prevProducts, ...uniqueNewProducts] as any;
            });

            // Append scores
            setProductScores((prev) => [...prev, ...scores]);
          },

          onStats: (stats: StreamStats, sid: string) => {
            console.log("📊 Stream stats:", stats);
            setSearchId(sid);
            setStreamStats(stats);
          },

          onComplete: (summary: StreamComplete) => {
            console.log("✅ Search complete:", summary);
            setLoading(false);
            setSearchId(summary.searchId);
            // Automatically enable AI sorting when search completes
            setSortByAI(true);
          },

          onError: (err: StreamError) => {
            console.error("❌ Stream error:", err);
            setError(`Error from ${err.source}: ${err.error}`);
          },

          onCancelled: () => {
            console.log("🛑 Search cancelled");
            setLoading(false);
          },
        },
        {
          maxPages: 1, // Can be made configurable
        },
      );

      console.log("Search initiated with ID:", newSearchId);
    } catch (err: unknown) {
      const apiError = err as ApiError;
      const message =
        apiError?.message ||
        apiError?.response?.data?.message ||
        "Failed to connect to search service";

      // Check if it's an authentication error
      if (message.includes("Authentication") || message.includes("log in")) {
        setError("Please log in to search for products");
      } else {
        setError(message);
      }

      setIsTrending(false);
      setProducts([]);
      setLoading(false);
    }
  };

  /**
   * Cancel search
   */
  const handleCancelSearch = () => {
    searchSocketService.cancelSearch();
    setLoading(false);
  };

  /**
   * Load trending products on mount
   */
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await trendingProducts();
        console.log("Trending products:", res.data.trending);
        if (res.data && Array.isArray(res.data.trending)) {
          const shuffledProducts = [...res.data.trending].sort(
            () => Math.random() - 0.5,
          );

          setProducts(shuffledProducts);
          setIsTrending(true);
          setIsHistoricalSearch(false);
        }
      } catch (err: unknown) {
        const apiError = err as ApiError;
        const message =
          apiError?.response?.data?.message ||
          apiError?.message ||
          "Failed to load trending products";
        console.error(message);
      }
    };

    fetchData();
  }, [setProducts]);

  /**
   * Listen for historical search events from sidebar
   */
  useEffect(() => {
    const handleHistoricalSearch = (event: CustomEvent) => {
      const { products: historicalProducts, scores } = event.detail;

      console.log("📜 Loading historical search:", {
        products: historicalProducts.length,
        scores: scores.length,
      });

      // Set products and scores
      setProducts(historicalProducts);
      setProductScores(scores);

      // Enable AI sorting and mark as historical
      setSortByAI(true);
      setIsTrending(false);
      setIsHistoricalSearch(true);
      setCurrentPage(1);
      setError("");
    };

    window.addEventListener("historicalSearch" as any, handleHistoricalSearch);

    return () => {
      window.removeEventListener(
        "historicalSearch" as any,
        handleHistoricalSearch,
      );
    };
  }, [setProducts, setCurrentPage]);

  /**
   * Cleanup on unmount
   */
  useEffect(() => {
    return () => {
      searchSocketService.disconnect();
    };
  }, []);

  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber);
    window.scrollTo({ top: 400, behavior: "smooth" });
  };

  return (
    <main className="px-6">
      <Hero />

      {/* Search Bar */}
      <div className="max-w-4xl mx-auto mt-8 mb-12">
        <form onSubmit={handleSearch}>
          <div className="bg-white rounded-2xl shadow-sm flex flex-col sm:flex-row overflow-hidden border border-gray-100">
            <input
              type="text"
              placeholder="Search for a product… (e.g. 'iPhone 13 Case')"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="flex-1 px-6 py-4 outline-none text-gray-700 placeholder-gray-400 text-base"
              required
            />
            <button
              type="submit"
              disabled={loading}
              className={`px-8 py-4 ${
                loading
                  ? "bg-primary-dark cursor-not-allowed"
                  : "bg-primary cursor-pointer hover:bg-primary-dark"
              } text-white font-medium text-base transition-colors whitespace-nowrap`}
            >
              {loading ? "Searching..." : "Compare"}
            </button>
            {loading && (
              <button
                type="button"
                onClick={handleCancelSearch}
                className="px-8 py-4 bg-red-500 hover:bg-red-600 text-white font-medium text-base transition-colors whitespace-nowrap"
              >
                Cancel
              </button>
            )}
          </div>
        </form>

        {/* Search Stats (Real-time) */}
        {loading && streamStats && (
          <div className="mt-4 text-center">
            <p className="text-sm text-gray-600">
              {Object.entries(streamStats.platformStats).map(
                ([platform, stats]) => (
                  <span key={platform} className="mx-2">
                    {platform}: {stats.total} {stats.completed ? "✓" : "⏳"}
                  </span>
                ),
              )}
            </p>
          </div>
        )}
      </div>
      {/* Loading State */}
      {loading && products.length === 0 && (
        <div className="flex justify-center mb-12">
          <AILoadingComponent />
        </div>
      )}

      {/* Error State */}
      {error && (
        <div className="text-center py-8">
          <p className="text-error text-base bg-red-50 inline-block px-4 py-2 rounded-lg">
            {error}
          </p>
        </div>
      )}

      {/* Products Grid */}
      {currentProducts.length >= 1 && (
        <div>
          <div className="max-w-6xl mx-auto">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-800">
                {isTrending
                  ? `Trending Products (${products.length})`
                  : isHistoricalSearch
                    ? `Previous Search Results (${sortedProducts.length} products)`
                    : loading
                      ? `Found ${products.length} products (searching...)`
                      : `Search Results (${sortedProducts.length} products)`}
              </h2>

              {searchId && !isHistoricalSearch && (
                <p className="text-sm text-gray-500">
                  Search ID: {searchId.slice(0, 8)}...
                </p>
              )}
            </div>

            {/* AI Score Summary - Show after search completes */}
            {!loading && !isTrending && productScores.length > 0 && (
              <AIScoreSummary
                scores={productScores}
                totalProducts={sortedProducts.length}
              />
            )}

            {/* Score Comparison View - Detailed rankings */}
            {!loading && !isTrending && productScores.length > 0 && (
              <ScoreComparisonView
                products={sortedProducts}
                scores={productScores}
              />
            )}

            {/* AI Sorting Toggle - Only show after search completes or for historical */}
            {!loading && !isTrending && productScores.length > 0 && (
              <div className="mb-6 flex items-center justify-between bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-xl p-4">
                <div className="flex items-center gap-3">
                  <div className="bg-blue-500 text-white p-2 rounded-lg">
                    <svg
                      aria-hidden="true"
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
                      />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-800">
                      AI-Powered Ranking
                    </h3>
                    <p className="text-sm text-gray-600">
                      {sortByAI
                        ? isHistoricalSearch
                          ? "Showing products in AI relevance order from your previous search"
                          : "Products sorted by relevance score (best matches first)"
                        : "Toggle to sort by AI relevance scores"}
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    setSortByAI(!sortByAI);
                    setCurrentPage(1); // Reset to first page when toggling
                  }}
                  className={`px-6 py-3 rounded-lg font-medium transition-all duration-200 ${
                    sortByAI
                      ? "bg-blue-500 text-white hover:bg-blue-600 shadow-md"
                      : "bg-white text-gray-700 hover:bg-gray-50 border-2 border-gray-300"
                  }`}
                >
                  {sortByAI ? "✓ AI Sorted" : "Sort by AI"}
                </button>
              </div>
            )}

            <ProductGrid
              products={currentProducts}
              scores={productScores}
              showScores={sortByAI}
            />
          </div>

          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
          />
        </div>
      )}

      {/* No Results */}
      {!loading && !error && products.length === 0 && search && (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">
            No products found for "{search}"
          </p>
        </div>
      )}
    </main>
  );
}
