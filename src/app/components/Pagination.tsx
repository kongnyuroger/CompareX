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

      {/* Desktop: Page numbers - Show all on large screens */}
      <div className="hidden lg:flex gap-2">
        {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => (
          <button
            key={pageNum}
            type="button"
            onClick={() => onPageChange(pageNum)}
            className={`w-10 h-10 rounded-lg font-medium ${
              currentPage === pageNum
                ? "bg-primary text-white"
                : "bg-white text-gray-700 border border-gray-200 hover:bg-gray-50"
            }`}
          >
            {pageNum}
          </button>
        ))}
      </div>

      {/* Tablet: Condensed page numbers */}
      <div className="hidden sm:flex lg:hidden gap-2">
        {totalPages <= 5 ? (
          // Show all pages if 5 or fewer
          Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => (
            <button
              key={pageNum}
              type="button"
              onClick={() => onPageChange(pageNum)}
              className={`w-10 h-10 rounded-lg font-medium ${
                currentPage === pageNum
                  ? "bg-primary text-white"
                  : "bg-white text-gray-700 border border-gray-200 hover:bg-gray-50"
              }`}
            >
              {pageNum}
            </button>
          ))
        ) : (
          // Show condensed with ellipsis
          <>
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
            {currentPage > 3 && (
              <span className="w-10 h-10 flex items-center justify-center text-gray-400">
                ...
              </span>
            )}
            {currentPage > 2 && currentPage < totalPages - 1 && (
              <button
                type="button"
                onClick={() => onPageChange(currentPage)}
                className="w-10 h-10 rounded-lg font-medium bg-primary text-white"
              >
                {currentPage}
              </button>
            )}
            {currentPage < totalPages - 2 && (
              <span className="w-10 h-10 flex items-center justify-center text-gray-400">
                ...
              </span>
            )}
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
        )}
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
