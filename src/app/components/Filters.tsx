"use client";
import { useId } from "react";

interface Props {
  category: string;
  onCategoryChange: (value: string) => void;
  sort: string;
  onSortChange: (value: string) => void;
}

export default function Filters({
  category,
  onCategoryChange,
  sort,
  onSortChange,
}: Props) {
  const categoryList = ["All", "Case"];

  const priceId = useId();
  return (
    <section className="mt-12 px-4 sm:px-0">
      <h2 className="text-2xl sm:text-3xl font-bold text-primary-900 mb-6">
        Search Results
      </h2>

      <div className="w-full bg-white shadow-sm rounded-2xl p-6 flex flex-col gap-6">
        {/* TOP FILTERS */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {/* Category */}
          <select
            value={category}
            onChange={(e) => onCategoryChange(e.target.value)}
            className="border rounded-xl px-4 py-3 text-gray-700 cursor-pointer"
          >
            {categoryList.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>

          {/* Rating placeholder */}
          <div className="border rounded-xl px-4 py-3 text-gray-400">
            Rate ▼
          </div>

          {/* Price slider */}
          <div>
            <label htmlFor={priceId} className="text-sm text-gray-600">
              Price
            </label>
            <input
              id={priceId}
              type="range"
              min="0"
              max="100"
              className="mt-2 w-full"
            />
          </div>
        </div>

        {/* LOWER FILTERS */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="border rounded-xl px-4 py-3 text-gray-400 cursor-pointer w-full sm:w-[160px]">
            Filter ▼
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto">
            <span className="text-gray-600">Sort by</span>

            <select
              value={sort}
              onChange={(e) => onSortChange(e.target.value)}
              className="border rounded-xl px-4 py-3 text-gray-700 cursor-pointer w-full sm:w-auto"
            >
              <option value="low">Price (Lowest → Highest)</option>
              <option value="high">Price (Highest → Lowest)</option>
            </select>
          </div>
        </div>
      </div>
    </section>
  );
}
