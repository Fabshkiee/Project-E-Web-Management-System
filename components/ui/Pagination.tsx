import React from "react";
import { ChevronDownIcon } from "./Icons"; // We'll reuse ChevronDownIcon for arrows by rotating them

interface PaginationProps {
  currentPage: number;
  totalItems: number;
  itemsPerPage: number;
  onPageChange: (page: number) => void;
  className?: string;
}

export const Pagination = ({
  currentPage,
  totalItems,
  itemsPerPage,
  onPageChange,
  className = "",
}: PaginationProps) => {
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const startItem = (currentPage - 1) * itemsPerPage + 1;
  const endItem = Math.min(currentPage * itemsPerPage, totalItems);

  if (totalPages <= 1) return null;

  // Simple page range logic
  const getPageNumbers = () => {
    const pages = [];
    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      if (currentPage <= 4) {
        pages.push(1, 2, 3, 4, 5, "...", totalPages);
      } else if (currentPage >= totalPages - 3) {
        pages.push(1, "...", totalPages - 4, totalPages - 3, totalPages - 2, totalPages - 1, totalPages);
      } else {
        pages.push(1, "...", currentPage - 1, currentPage, currentPage + 1, "...", totalPages);
      }
    }
    return pages;
  };

  return (
    <div className={`flex flex-col md:flex-row justify-between items-center px-8 py-6 border-t border-stroke dark:border-white/5 gap-4 ${className}`}>
      {/* Left side: Item summary */}
      <div className="text-sm font-lexend text-secondary font-medium">
        Showing <span className="text-foreground font-bold">{startItem}-{endItem}</span> of <span className="text-foreground font-bold">{totalItems}</span> members
      </div>

      {/* Right side: Controls */}
      <div className="flex items-center gap-2">
        {/* Prev Arrow */}
        <button
          onClick={() => onPageChange(Math.max(1, currentPage - 1))}
          disabled={currentPage === 1}
          className="p-2 text-gray-400 hover:text-primary disabled:opacity-30 transition-colors"
        >
          <ChevronDownIcon className="w-5 h-5 rotate-90" />
        </button>

        {/* Page Numbers */}
        <div className="flex items-center gap-1">
          {getPageNumbers().map((page, idx) => (
            <React.Fragment key={idx}>
              {page === "..." ? (
                <span className="px-3 py-2 text-gray-400 font-lexend text-sm">...</span>
              ) : (
                <button
                  onClick={() => onPageChange(page as number)}
                  className={`min-w-[36px] h-9 flex items-center justify-center rounded-md text-sm font-lexend font-bold transition-all
                    ${currentPage === page 
                      ? "bg-primary text-white shadow-lg shadow-primary/30" 
                      : "text-secondary hover:bg-gray-100 dark:hover:bg-white/5"
                    }`}
                >
                  {page}
                </button>
              )}
            </React.Fragment>
          ))}
        </div>

        {/* Next Arrow */}
        <button
          onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
          disabled={currentPage === totalPages}
          className="p-2 text-gray-400 hover:text-primary disabled:opacity-30 transition-colors"
        >
          <ChevronDownIcon className="w-5 h-5 -rotate-90" />
        </button>
      </div>
    </div>
  );
};
