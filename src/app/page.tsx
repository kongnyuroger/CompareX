"use client";

import { useMemo, useState } from "react";
import { Bars } from "react-loader-spinner";
import Hero from "./components/Hero";
import ProductGrid from "./components/ProductGrid";
import { searchProduct } from "./services/api";

export default function HomePage() {
  const [search, setSearch] = useState("");
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSearch = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      setLoading(true);
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
          ) : error ? (
            <p className="text-error">{error}</p>
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
        <div className="flex justify-center mt-6">
          <Bars
            height="80"
            width="80"
            color="#4fa94d"
            ariaLabel="bars-loading"
            wrapperStyle={{}}
            wrapperClass=""
            visible={true}
          />
        </div>
      ) : (
        <ProductGrid products={products} />
      )}
    </main>
  );
}
