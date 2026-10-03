'use client';

/**
 * ==============================================================================
 * COMPONENT: components/brands/BrandsPagination.tsx
 * PURPOSE: Dynamic Pagination Footer (Rows per Page & Dynamic Numbered Pages)
 * ==============================================================================
 * FEATURES:
 * - Rows-per-page selector (10, 15, 25, 50 rows).
 * - Numbered page selector with active black pill styling.
 * - Previous & Next navigation controls with bounds checking.
 * ==============================================================================
 */

import React from 'react';

interface BrandsPaginationProps {
  currentPage: number;
  totalPages: number;
  pageSize: number;
  onPageChange: (page: number) => void;
  onPageSizeChange: (size: number) => void;
}

export default function BrandsPagination({

  currentPage,
  totalPages,
  pageSize,
  onPageChange,
  onPageSizeChange,
}: BrandsPaginationProps) {
  // Generate dynamic pagination array based on actual totalPages
  const getPageNumbers = () => {
    const pages: (number | string)[] = [];
    const maxVisible = 5;

    if (totalPages <= maxVisible + 2) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      // Always show first page
      pages.push(1);

      if (currentPage > 3) {
        pages.push('...');
      }

      // Middle pages around current
      const start = Math.max(2, currentPage - 1);
      const end = Math.min(totalPages - 1, currentPage + 1);

      for (let i = start; i <= end; i++) {
        if (!pages.includes(i)) {
          pages.push(i);
        }
      }

      if (currentPage < totalPages - 2) {
        pages.push('...');
      }

      // Always show last page
      if (!pages.includes(totalPages)) {
        pages.push(totalPages);
      }
    }

    return pages;
  };

  const pages = getPageNumbers();

  return (
    <div className="flex items-center justify-between flex-wrap gap-4 pt-4 pb-8">
      {/* Left: Show rows selector */}
      <div className="flex items-center gap-2">
        <span className="text-xs font-medium text-gray-500">Show rows:</span>
        <div className="relative">
          <select
            value={pageSize}
            onChange={(e) => onPageSizeChange(Number(e.target.value))}
            className="appearance-none bg-white border border-gray-200/90 rounded-lg pl-3 pr-7 py-1 text-xs font-bold text-gray-800 shadow-2xs hover:border-gray-300 focus:outline-none focus:ring-1 focus:ring-black cursor-pointer"
          >
            <option value={5}>5</option>
            <option value={10}>10</option>
            <option value={15}>15</option>
            <option value={20}>20</option>
            <option value={50}>50</option>
          </select>
          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-400">
            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </div>
        </div>
      </div>

      {/* Right: Page navigation */}
      <div className="flex items-center gap-1.5">
        {/* Previous Button */}
        <button
          onClick={() => onPageChange(Math.max(1, currentPage - 1))}
          disabled={currentPage <= 1}
          className="w-7 h-7 flex items-center justify-center text-gray-400 hover:text-gray-900 disabled:opacity-25 disabled:hover:text-gray-400 transition-colors cursor-pointer disabled:cursor-not-allowed"
          title="Previous Page"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>

        {/* Dynamic Page Buttons */}
        {pages.map((p, idx) => {
          if (p === '...') {
            return (
              <span key={`ellipsis-${idx}`} className="w-5 text-center text-xs font-bold text-gray-400">
                ...
              </span>
            );
          }

          const pageNum = p as number;
          const isActive = currentPage === pageNum;

          return (
            <button
              key={`page-${pageNum}`}
              onClick={() => onPageChange(pageNum)}
              className={`w-7 h-7 flex items-center justify-center rounded-lg text-xs font-bold transition-all cursor-pointer ${
                isActive
                  ? 'bg-black text-white shadow-2xs'
                  : 'text-gray-600 hover:bg-gray-100 hover:text-gray-950'
              }`}
            >
              {pageNum}
            </button>
          );
        })}

        {/* Next Button */}
        <button
          onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
          disabled={currentPage >= totalPages}
          className="w-7 h-7 flex items-center justify-center text-gray-400 hover:text-gray-900 disabled:opacity-25 disabled:hover:text-gray-400 transition-colors cursor-pointer disabled:cursor-not-allowed"
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
