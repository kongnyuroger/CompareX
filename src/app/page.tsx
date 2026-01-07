// app/page.tsx

"use client";

import { useEffect, useRef, useState } from "react";
import { useUserContext } from "@/lib/authProvider";
import {
  type StreamComplete,
  type StreamError,
  type StreamedProduct,
  type StreamStats,
  searchStreamService,
} from "@/services/searchStreamService";
import AILoadingComponent from "./components/botLoader";
import Hero from "./components/Hero";
import Pagination from "./components/Pagination";
import ProductGrid from "./components/ProductGrid";
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
  const { products, setProducts, currentPage, setCurrentPage } =
    useUserContext();

  const cancelSearchRef = useRef<(() => void) | null>(null);
  const productsPerPage = 6;

  // Calculate pagination values
  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = products.slice(
    indexOfFirstProduct,
    indexOfLastProduct,
  );
  const totalPages = Math.ceil(products.length / productsPerPage);

  /**
   * Handle streaming search
   */ const handleSearch = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!search.trim()) return;

    // Cancel any existing search
    if (cancelSearchRef.current) {
      cancelSearchRef.current();
    }

    try {
      setLoading(true);
      setError("");
      setCurrentPage(1);
      setProducts([]);
      setSearchId(null);
      setStreamStats(null);

      // Start streaming
      const { searchId: newSearchId, cancel } =
        await searchStreamService.streamSearch(search, {
          onProduct: (newProducts: StreamedProduct[], sid: string) => {
            console.log(`Received ${newProducts.length} products from ${sid}`);

            setSearchId(sid);

            setProducts((prevProducts) => {
              const existingIds = new Set(prevProducts.map((p) => p.id));
              const uniqueNewProducts = newProducts.filter(
                (p) => !existingIds.has(p.id),
              );
              return [...prevProducts, ...uniqueNewProducts];
            });
          },

          onStats: (stats: StreamStats, sid: string) => {
            console.log("Stream stats:", stats);
            setSearchId(sid);
            setStreamStats(stats);
          },

          onComplete: (summary: StreamComplete) => {
            console.log("Search complete:", summary);
            setLoading(false);
            setSearchId(summary.searchId);
          },

          onError: (err: StreamError) => {
            console.error("Stream error:", err);
            setError(`Error from ${err.source}: ${err.error}`);
          },
        });

      cancelSearchRef.current = cancel;
    } catch (err: unknown) {
      const apiError = err as ApiError;
      const message =
        apiError?.message ||
        apiError?.response?.data?.message ||
        "Failed to connect to search service";

      // Check if it's an authentication error
      if (message.includes("Authentication") || message.includes("log in")) {
        setError("Please log in to search for products");
        // Optionally redirect to login page
        // router.push('/login');
      } else {
        setError(message);
      }

      setProducts([]);
      setLoading(false);
    }
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
  console.log("Current products:", products);
  /**
   * Cleanup on unmount
   */
  useEffect(() => {
    return () => {
      if (cancelSearchRef.current) {
        cancelSearchRef.current();
      }
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
                {loading
                  ? `Found ${products.length} products (searching...)`
                  : `Search Results (${products.length} products)`}
              </h2>
              {searchId && (
                <p className="text-sm text-gray-500">Search ID: {searchId}</p>
              )}
            </div>

            <ProductGrid products={currentProducts} />
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
