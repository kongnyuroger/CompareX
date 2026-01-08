interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export default function Pagination({
  currentPage,
  totalPages,
  onPageChange,
}: PaginationProps) {
  const handlePrevious = () => {
    if (currentPage > 1) {
      onPageChange(currentPage - 1);
    }
  };

  const handleNext = () => {
    if (currentPage < totalPages) {
      onPageChange(currentPage + 1);
    }
  };

  if (totalPages <= 1) return null;

  return (
    <div className="flex flex-col sm:flex-row justify-center items-center gap-3 sm:gap-2 mt-8 mb-12 px-4">
      {/* Mobile: Page info */}
      <div className="sm:hidden text-sm text-gray-600 font-medium">
        Page {currentPage} of {totalPages}
      </div>

      {/* Desktop: Previous button */}
      <button
        onClick={handlePrevious}
        type="button"
        disabled={currentPage === 1}
        className={`hidden sm:block px-4 py-2 rounded-lg font-medium ${
          currentPage === 1
            ? "bg-gray-200 text-gray-400 cursor-not-allowed"
            : "bg-white text-primary border border-gray-200 hover:bg-gray-50"
        }`}
      >
        Previous
      </button>

      {/* Tablet & Desktop: Condensed page numbers */}
      <div className="hidden sm:flex gap-2">
        {(() => {
          const range = window.innerWidth >= 1024 ? 2 : 1; // desktop ±2, tablet ±1

          const start = Math.max(2, currentPage - range);
          const end = Math.min(totalPages - 1, currentPage + range);

          return (
            <>
              {/* First page */}
              <button
                type="button"
                onClick={() => onPageChange(1)}
                className={`w-10 h-10 rounded-lg font-medium ${
                  currentPage === 1
                    ? "bg-primary text-white"
                    : "bg-white text-gray-700 border border-gray-200 hover:bg-gray-50"
                }`}
              >
                1
              </button>

              {/* Left ellipsis */}
              {start > 2 && (
                <span className="w-10 h-10 flex items-center justify-center text-gray-400">
                  …
                </span>
              )}

              {/* Middle pages */}
              {Array.from({ length: end - start + 1 }, (_, i) => start + i).map(
                (page) => (
                  <button
                    key={page}
                    type="button"
                    onClick={() => onPageChange(page)}
                    className={`w-10 h-10 rounded-lg font-medium ${
                      currentPage === page
                        ? "bg-primary text-white"
                        : "bg-white text-gray-700 border border-gray-200 hover:bg-gray-50"
                    }`}
                  >
                    {page}
                  </button>
                ),
              )}

              {/* Right ellipsis */}
              {end < totalPages - 1 && (
                <span className="w-10 h-10 flex items-center justify-center text-gray-400">
                  …
                </span>
              )}

              {/* Last page */}
              <button
                type="button"
                onClick={() => onPageChange(totalPages)}
                className={`w-10 h-10 rounded-lg font-medium ${
                  currentPage === totalPages
                    ? "bg-primary text-white"
                    : "bg-white text-gray-700 border border-gray-200 hover:bg-gray-50"
                }`}
              >
                {totalPages}
              </button>
            </>
          );
        })()}
      </div>

      {/* Mobile & Tablet: Navigation buttons */}
      <div className="flex gap-3 w-full sm:w-auto">
        <button
          onClick={handlePrevious}
          type="button"
          disabled={currentPage === 1}
          className={`flex-1 sm:hidden px-6 py-3 rounded-lg font-medium ${
            currentPage === 1
              ? "bg-gray-200 text-gray-400 cursor-not-allowed"
              : "bg-white text-primary border border-gray-200 hover:bg-gray-50"
          }`}
        >
          Previous
        </button>
        <button
          type="button"
          onClick={handleNext}
          disabled={currentPage === totalPages}
          className={`flex-1 sm:flex-none px-6 py-3 sm:py-2 sm:px-4 rounded-lg font-medium ${
            currentPage === totalPages
              ? "bg-gray-200 text-gray-400 cursor-not-allowed"
              : "bg-white text-primary border border-gray-200 hover:bg-gray-50"
          }`}
        >
          Next
        </button>
      </div>
    </div>
  );
}
