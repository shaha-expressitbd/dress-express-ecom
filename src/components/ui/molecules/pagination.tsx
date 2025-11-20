import { FiChevronsLeft, FiChevronsRight } from "react-icons/fi";
import { twMerge } from "tailwind-merge";
import { Button } from "../atoms/button";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  className?: string;
  itemsPerPage: number;
  totalItems: number;
}

export const Pagination = ({
  currentPage,
  totalPages,
  onPageChange,
  className,
  itemsPerPage,
  totalItems,
}: PaginationProps) => {
  const getPageNumbers = () => {
    if (totalPages <= 0) return [];

    const pages: (number | string)[] = [];
    const maxVisiblePages = 5;
    const hasEllipsis = totalPages > maxVisiblePages;

    if (!hasEllipsis) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
      return pages;
    }

    const maxPagesBeforeCurrent = Math.floor(maxVisiblePages / 2);
    const maxPagesAfterCurrent = Math.ceil(maxVisiblePages / 2) - 1;

    let startPage = Math.max(1, currentPage - maxPagesBeforeCurrent);
    let endPage = Math.min(totalPages, currentPage + maxPagesAfterCurrent);

    if (currentPage <= maxVisiblePages - 1) {
      endPage = maxVisiblePages;
    } else if (currentPage >= totalPages - maxVisiblePages + 2) {
      startPage = totalPages - maxVisiblePages + 1;
    }

    if (startPage > 1) {
      pages.push(1);
      if (startPage > 2) pages.push("...");
    }

    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }

    if (endPage < totalPages) {
      if (endPage < totalPages - 1) pages.push("...");
      pages.push(totalPages);
    }

    return pages;
  };

  const pageNumbers = getPageNumbers();
  const isFirstPage = currentPage <= 1 || totalPages === 0;
  const isLastPage = currentPage >= totalPages || totalPages === 0;

  const startEntry = totalItems === 0 ? 0 : (currentPage - 1) * itemsPerPage + 1;
  const endEntry = Math.min(currentPage * itemsPerPage, totalItems);

  return (
    <div
      className={twMerge(
        "flex flex-col md:flex-row items-center justify-between px-4 py-3",
        "bg-white dark:bg-gray-800 rounded border border-gray-300 dark:border-gray-700",
        className
      )}
    >
      <div className='mb-2 md:mb-0 text-sm text-gray-700 dark:text-gray-300'>
        {totalItems === 0 ? "No entries found" : `Showing ${startEntry} to ${endEntry} of ${totalItems} entries`}
      </div>

      {totalPages > 0 && (
        <div className='flex items-center gap-1'>
          <Button
            title='Previous Page'
            aria-label='Previous page'
            onClick={() => !isFirstPage && onPageChange(currentPage - 1)}
            disabled={isFirstPage}
            className='px-3 py-1 text-sm font-medium text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-800 
                     border border-gray-300 dark:border-gray-600 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700 
                     disabled:opacity-50 disabled:cursor-not-allowed'
          >
            <FiChevronsLeft className={"inline-block"} /> Previous
          </Button>

          <div className='hidden md:flex gap-1'>
            {pageNumbers.map((page, index) =>
              typeof page === "number" ? (
                <Button
                  title='Page Number'
                  key={page}
                  aria-label={`Page ${page}`}
                  onClick={() => page !== currentPage && onPageChange(page)}
                  variant={page === currentPage ? "default" : "outline"}
                  className={twMerge(
                    "px-3 py-1 text-sm font-medium rounded-md",
                    page === currentPage
                      ? "bg-primary text-white border-primary"
                      : "text-gray-700 dark:text-gray-200 border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700"
                  )}
                >
                  {page}
                </Button>
              ) : (
                <span key={`ellipsis-${index}`} className='px-3 py-1 text-gray-500 select-none'>
                  ...
                </span>
              )
            )}
          </div>

          <Button
            title='Next Page'
            aria-label='Next page'
            onClick={() => !isLastPage && onPageChange(currentPage + 1)}
            disabled={isLastPage}
            className='px-3 py-1 text-sm font-medium text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-800 
                     border border-gray-300 dark:border-gray-600 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700
                     disabled:opacity-50 disabled:cursor-not-allowed'
            variant='outline'
          >
            Next <FiChevronsRight className='inline-block' />
          </Button>
        </div>
      )}
    </div>
  );
};
