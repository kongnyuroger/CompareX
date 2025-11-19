"use client";

import { useMemo, useState } from "react";
import Filters from "./components/Filters";
import Hero from "./components/Hero";
import ProductGrid from "./components/ProductGrid";
import SearchBar from "./components/SearchBar";
import { products } from "./data/products";

export default function HomePage() {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [sort, setSort] = useState("low");

  // --- Filtering + Sorting ---
  const filteredProducts = useMemo(() => {
    let list = [...products];

    // Search filter
    if (search.trim() !== "") {
      list = list.filter((p) =>
        p.name.toLowerCase().includes(search.toLowerCase()),
      );
    }

    // Category filter
    if (category !== "All") {
      list = list.filter((p) => p.category === category);
    }

    // Sorting
    if (sort === "low") {
      list.sort((a, b) => a.price - b.price);
    } else {
      list.sort((a, b) => b.price - a.price);
    }

    return list;
  }, [search, category, sort]);

  return (
    <main className="max-w-6xl mx-auto px-6">
      <Hero />

      <SearchBar value={search} onChange={setSearch} />

      <Filters
        category={category}
        onCategoryChange={setCategory}
        sort={sort}
        onSortChange={setSort}
      />

      <ProductGrid products={filteredProducts} />
    </main>
  );
}
