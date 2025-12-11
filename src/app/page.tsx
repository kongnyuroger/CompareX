"use client";

import { useEffect, useState } from "react";
import AILoadingComponent from "./components/botLoader";
import Hero from "./components/Hero";
import ProductGrid from "./components/ProductGrid";
import { searchProduct, trendingProducts } from "./services/api";

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
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const productsPerPage = 6;

  // Calculate pagination values
  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = products.slice(
    indexOfFirstProduct,
    indexOfLastProduct,
  );
  const totalPages = Math.ceil(products.length / productsPerPage);

  const handleSearch = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!search.trim()) return;

    try {
      setLoading(true);
      setError("");
      setCurrentPage(1);
      const res = await searchProduct(search);
      setProducts(res.data.ranked || []);
    } catch (err: unknown) {
      const apiError = err as ApiError;
      const message =
        apiError?.response?.data?.message ||
        apiError?.message ||
        "An error occurred";
      setError(message);
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await trendingProducts();
        console.log(res);
        setProducts(res.data);
      } catch (err: unknown) {
        const apiError = err as ApiError;
        const message =
          apiError?.response?.data?.message ||
          apiError?.message ||
          "An error occurred";
        setError(message);
      }
    };

    fetchData();
  }, []);

  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber);
    window.scrollTo({ top: 400, behavior: "smooth" });
  };

  const handlePrevious = () => {
    if (currentPage > 1) {
      handlePageChange(currentPage - 1);
    }
  };

  const handleNext = () => {
    if (currentPage < totalPages) {
      handlePageChange(currentPage + 1);
    }
  };

  return (
    <main className="px-6">
      <Hero />
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
              className={`px-8 py-4 ${loading ? "bg-primary-dark cursor-not-allowed" : "bg-primary cursor-pointer hover:bg-primary-dark"} text-white font-medium text-base transition-colors whitespace-nowrap`}
            >
              {loading ? "Searching..." : "Compare"}
            </button>
          </div>
        </form>
      </div>

      {loading ? (
        <div className="flex justify-center mb-12">
          <AILoadingComponent />
        </div>
      ) : error ? (
        <div className="text-center py-8">
          <p className="text-error text-base bg-red-50 inline-block px-4 py-2 rounded-lg">
            {error}
          </p>
        </div>
      ) : currentProducts.length >= 1 ? (
        <div>
          <div className="max-w-6xl mx-auto">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">
              Search Results
            </h2>
            <ProductGrid products={currentProducts} />
          </div>

          {/* Pagination Controls */}
          {products.length > productsPerPage && (
            <div className="flex justify-center items-center gap-2 mt-8 mb-12">
              <button
                onClick={handlePrevious}
                type="button"
                disabled={currentPage === 1}
                className={`px-4 py-2 rounded-lg font-medium ${
                  currentPage === 1
                    ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                    : "bg-white text-primary border border-gray-200 hover:bg-gray-50"
                }`}
              >
                Previous
              </button>

              <div className="flex gap-2">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                  (pageNum) => (
                    <button
                      key={pageNum}
                      type="button"
                      onClick={() => handlePageChange(pageNum)}
                      className={`w-10 h-10 rounded-lg font-medium ${
                        currentPage === pageNum
                          ? "bg-primary text-white"
                          : "bg-white text-gray-700 border border-gray-200 hover:bg-gray-50"
                      }`}
                    >
                      {pageNum}
                    </button>
                  ),
                )}
              </div>

              <button
                type="button"
                onClick={handleNext}
                disabled={currentPage === totalPages}
                className={`px-4 py-2 rounded-lg font-medium ${
                  currentPage === totalPages
                    ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                    : "bg-white text-primary border border-gray-200 hover:bg-gray-50"
                }`}
              >
                Next
              </button>
            </div>
          )}
        </div>
      ) : null}
    </main>
  );
}
