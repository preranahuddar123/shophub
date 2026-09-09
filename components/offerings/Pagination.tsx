'use client';

import React from 'react';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
  onPageChange: (page: number) => void;
  isLoading?: boolean;
}

export default function Pagination({
  currentPage,
  totalPages,
  totalItems,
  itemsPerPage,
  onPageChange,
  isLoading = false,
}: PaginationProps) {
  if (totalItems <= 0 && totalPages <= 1) {
    return null;
  }

  const startItem = totalItems === 0 ? 0 : (currentPage - 1) * itemsPerPage + 1;
  const endItem = Math.min(currentPage * itemsPerPage, totalItems);

  const canGoPrevious = currentPage > 1 && !isLoading;
  const canGoNext = currentPage < totalPages && !isLoading;

  // Generate page numbers with ellipsis
  const getPageNumbers = () => {
    const pages: (number | string)[] = [];

    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      pages.push(1);

      if (currentPage > 3) {
        pages.push('...');
      }

      for (
        let i = Math.max(2, currentPage - 1);
        i <= Math.min(totalPages - 1, currentPage + 1);
        i++
      ) {
        pages.push(i);
      }

      if (currentPage < totalPages - 2) {
        pages.push('...');
      }

      pages.push(totalPages);
    }

    return pages;
  };

  return (
    <div className="bg-white border-t border-gray-200 px-6 py-3.5 flex items-center justify-between">
      {/* Results Info */}
      <div className="text-sm text-gray-500">
        Showing <span className="font-semibold text-gray-900">{startItem}-{endItem}</span> of{' '}
        <span className="font-semibold text-gray-900">{totalItems}</span> offerings
      </div>

      {/* Pagination Controls */}
      <div className="flex items-center gap-1.5">
        {/* Previous Button */}
        <button
          onClick={() => canGoPrevious && onPageChange(currentPage - 1)}
          disabled={!canGoPrevious}
          className={`p-1.5 rounded-lg border transition-colors ${
            canGoPrevious
              ? 'border-gray-300 text-gray-700 hover:bg-gray-100 cursor-pointer shadow-xs'
              : 'border-gray-200 text-gray-300 cursor-not-allowed'
          }`}
          title="Previous Page"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>

        {/* Page Numbers */}
        {getPageNumbers().map((page, index) => {
          if (page === '...') {
            return (
              <span key={`ellipsis-${index}`} className="px-2 text-gray-400 select-none text-xs">
                …
              </span>
            );
          }

          const pageNum = page as number;
          const isActive = pageNum === currentPage;

          return (
            <button
              key={pageNum}
              onClick={() => !isActive && !isLoading && onPageChange(pageNum)}
              disabled={isLoading || isActive}
              className={`min-w-[2rem] h-8 px-2.5 rounded-lg text-xs font-semibold transition-colors ${
                isActive
                  ? 'bg-black text-white cursor-default shadow-xs'
                  : 'border border-gray-300 text-gray-700 hover:bg-gray-50 cursor-pointer shadow-xs'
              }`}
            >
              {pageNum}
            </button>
          );
        })}

        {/* Next Button */}
        <button
          onClick={() => canGoNext && onPageChange(currentPage + 1)}
          disabled={!canGoNext}
          className={`p-1.5 rounded-lg border transition-colors ${
            canGoNext
              ? 'border-gray-300 text-gray-700 hover:bg-gray-100 cursor-pointer shadow-xs'
              : 'border-gray-200 text-gray-300 cursor-not-allowed'
          }`}
          title="Next Page"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>
    </div>
  );
}
