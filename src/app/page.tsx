"use client";

import { useEffect, useMemo, useState } from "react";
import { Bars } from "react-loader-spinner";
import AILoadingComponent from "./components/botLoader";
import Hero from "./components/Hero";
import ProductGrid from "./components/ProductGrid";
import { searchProduct, trendingProducts } from "./services/api";

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

    try {
      setLoading(true);
      setCurrentPage(1);
      const res = await searchProduct(search);

      console.log(res.data);
      setProducts(res.data.ranked);
    } catch (err: any) {
      const message =
        err?.response?.data?.message || err?.message || "An error occurred";
      setError(message);
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
      } catch (err: any) {
        const message =
          err?.response?.data?.message || err?.message || "An error occurred";
        setError(message);
      }
    };

    fetchData();
  }, []);

  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber);
    // Scroll to top of products section
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
    <main className=" px-6">
      <Hero />
      <form
        onSubmit={handleSearch}
        className="flex justify-center mt-8  mb-12 px-4"
      >
        <div className="w-full sm:w-[620px] bg-white rounded-2xl shadow-sm flex flex-col sm:flex-row overflow-hidden">
          <input
            type="text"
            placeholder="Search for a product… (e.g. “iPhone 13 Case”)"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="flex-1 px-5 py-4 outline-none text-gray-700"
            required
          />
          {!loading ? (
            <button
              type="submit"
              className="px-6 py-4 bg-primary cursor-pointer text-white font-medium text-sm w-full sm:w-auto hover:bg-primary-dark"
            >
              Compare
            </button>
          ) : (
            <button
              type="button"
              className="px-6 py-4 bg-primary-dark cursor-not-allowed  text-white font-medium text-sm w-full sm:w-auto "
            >
              Loading ...
            </button>
          )}
        </div>
      </form>

      {loading ? (
        <div className="flex justify-center mb-12">
          <AILoadingComponent />
        </div>
      ) : error ? (
        <p className="text-error text-center">{error}</p>
      ) : (
        <>
          <ProductGrid products={currentProducts} />

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
        </>
      )}
    </main>
  );
}
