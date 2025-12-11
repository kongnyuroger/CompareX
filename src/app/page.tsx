"use client";

import { useState } from "react";
import { Bars } from "react-loader-spinner";
import Hero from "./components/Hero";
import ProductGrid from "./components/ProductGrid";
import { searchProduct } from "./services/api";

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

  const handleSearch = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!search.trim()) return;

    try {
      setLoading(true);
      setError("");
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

  return (
    <>
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

      {/* Loading/Error/Results */}
      {loading ? (
        <div className="flex justify-center py-12">
          <Bars
            height="60"
            width="60"
            color="#4F46E5"
            ariaLabel="bars-loading"
            visible={true}
          />
        </div>
      ) : error ? (
        <div className="text-center py-8">
          <p className="text-error text-base bg-red-50 inline-block px-4 py-2 rounded-lg">
            {error}
          </p>
        </div>
      ) : products.length > 0 ? (
        <div className="max-w-6xl mx-auto">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">
            Search Results
          </h2>
          <ProductGrid products={products} />
        </div>
      ) : (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">
            Search for products to see results
          </p>
        </div>
      )}
    </>
  );
}
