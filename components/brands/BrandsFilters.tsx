'use client';

/**
 * ==============================================================================
 * COMPONENT: components/brands/BrandsFilters.tsx
 * PURPOSE: Filter Toolbar, Active Filter Chips, and "Showing X-Y of Z" Counter
 * ==============================================================================
 * FEATURES:
 * - "Advanced Filters" button with icon that opens the AdvancedFiltersModal.
 * - Interactive active filter pills (e.g. `Status: Active` [x], `Country: Italy` [x])
 *   allowing 1-click removal of active filters.
 * - Live dynamic counter: "Showing 1-15 of 36 brands" updated on every query.
 * ==============================================================================
 */

import React from 'react';

interface BrandsFiltersProps {
  statusFilter: string;
  countryFilter: string;
  onStatusChange: (status: string) => void;
  onCountryChange: (country: string) => void;
  onToggleAdvancedFilters: () => void;
  totalFiltered: number;
  pageSize: number;
  currentPage: number;
}

export default function BrandsFilters({

  statusFilter,
  countryFilter,
  onStatusChange,
  onCountryChange,
  onToggleAdvancedFilters,
  totalFiltered,
  pageSize,
  currentPage,
}: BrandsFiltersProps) {
  const startNum = totalFiltered === 0 ? 0 : (currentPage - 1) * pageSize + 1;
  const endNum = Math.min(currentPage * pageSize, totalFiltered);

  const hasActiveFilters = Boolean(
    (statusFilter && statusFilter !== 'ALL') || (countryFilter && countryFilter !== 'ALL')
  );

  return (
    <div className="flex items-center justify-between flex-wrap gap-4 mb-5">
      {/* Left: Advanced Filters button + Active Filter Chips */}
      <div className="flex items-center gap-2.5 flex-wrap">
        {/* Advanced Filters Button */}
        <button
          onClick={onToggleAdvancedFilters}
          className={`inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-semibold shadow-xs transition-all cursor-pointer ${
            hasActiveFilters
              ? 'bg-black text-white hover:bg-gray-800'
              : 'bg-white border border-gray-200 hover:border-gray-300 text-gray-700 hover:bg-gray-50'
          }`}
        >
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
          </svg>
          <span>Advanced Filters</span>
        </button>

        {/* Active Filter Pill 1: Status */}
        {statusFilter && statusFilter !== 'ALL' && (
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#F1F3F5] text-gray-700 text-xs font-medium rounded-lg border border-gray-200/60 shadow-2xs">
            <span className="text-gray-400">Status:</span>
            <span className="font-bold text-gray-900">{statusFilter}</span>
            <button
              onClick={() => onStatusChange('')}
              className="text-gray-400 hover:text-gray-900 ml-0.5 text-sm font-bold leading-none cursor-pointer"
              title="Remove status filter"
            >
              ×
            </button>
          </div>
        )}

        {/* Active Filter Pill 2: Country */}
        {countryFilter && countryFilter !== 'ALL' && (
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#F1F3F5] text-gray-700 text-xs font-medium rounded-lg border border-gray-200/60 shadow-2xs">
            <span className="text-gray-400">Country:</span>
            <span className="font-bold text-gray-900">{countryFilter}</span>
            <button
              onClick={() => onCountryChange('')}
              className="text-gray-400 hover:text-gray-900 ml-0.5 text-sm font-bold leading-none cursor-pointer"
              title="Remove country filter"
            >
              ×
            </button>
          </div>
        )}
      </div>

      {/* Right: Showing Range Info */}
      <div className="text-xs font-medium text-gray-500">
        Showing <span className="font-bold text-gray-900">{startNum}-{endNum}</span> of{' '}
        <span className="font-bold text-gray-900">{totalFiltered.toLocaleString()}</span> brands
      </div>
    </div>
  );
}
