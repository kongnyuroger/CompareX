"use client";

interface Props {
  value: string;
  onChange: (value: string) => void;
}

export default function SearchBar({ value, onChange }: Props) {
  return (
    <div className="flex justify-center mt-8 px-4">
      <div className="w-full sm:w-[620px] bg-white rounded-2xl shadow-sm flex flex-col sm:flex-row overflow-hidden">
        <input
          type="text"
          placeholder="Search for a product… (e.g. “iPhone 13 Case”)"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="flex-1 px-5 py-4 outline-none text-gray-700"
        />

        <button
          type="button"
          className="px-6 py-4 bg-primary text-white font-medium text-sm w-full sm:w-auto"
        >
          Compare
        </button>
      </div>
    </div>
  );
}
