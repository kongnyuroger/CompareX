"use client";

import { useEffect, useState } from "react";
import { useUserContext } from "@/lib/authProvider";
import AILoadingComponent from "./components/botLoader";
import Hero from "./components/Hero";
import Pagination from "./components/Pagination";
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
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const { products, setProducts, currentPage, setCurrentPage } =
    useUserContext();
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
      const totalProduct = [
        ...res.data.rankedProducts,
        ...res.data.otherProducts,
      ];
      setProducts(totalProduct || []);
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
  }, [setProducts]);

  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber);
    window.scrollTo({ top: 400, behavior: "smooth" });
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

          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
          />
        </div>
      ) : null}
    </main>
  );
}
