'use client';

/**
 * ==============================================================================
 * COMPONENT: components/brands/AdvancedFiltersModal.tsx
 * PURPOSE: Advanced Filtering Modal Dialog for Master Catalog
 * ==============================================================================
 * TRIGGERED BY:
 * - "Advanced Filters" button in the filter bar (BrandsFilters).
 *
 * FUNCTIONALITY:
 * - Allows fine-grained filtering by Status (Active, Draft, Pending, All)
 *   and Country of Origin (Italy, Sweden, Spain, Germany, India, Denmark, Japan, etc.).
 * - Includes Apply Filters and Reset All options.
 * ==============================================================================
 */

import React from 'react';

interface AdvancedFiltersModalProps {
  isOpen: boolean;
  onClose: () => void;
  statusFilter: string;
  countryFilter: string;
  onStatusChange: (status: string) => void;
  onCountryChange: (country: string) => void;
  onResetFilters: () => void;
}

export default function AdvancedFiltersModal({

  isOpen,
  onClose,
  statusFilter,
  countryFilter,
  onStatusChange,
  onCountryChange,
  onResetFilters,
}: AdvancedFiltersModalProps) {
  if (!isOpen) return null;

  const countries = ['ALL', 'Italy', 'Sweden', 'Spain', 'Germany', 'India', 'Denmark', 'Japan', 'Switzerland'];
  const statuses = ['ALL', 'ACTIVE', 'DRAFT'];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/35 backdrop-blur-xs">
      <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-gray-100 animate-in fade-in zoom-in-95 duration-150">
        <div className="flex items-center justify-between border-b border-gray-100 pb-3.5 mb-4">
          <div className="flex items-center gap-2">
            <svg className="w-4 h-4 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
            </svg>
            <h3 className="text-sm font-black text-gray-900 tracking-tight">Advanced Catalog Filters</h3>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-700 p-1.5 rounded-lg hover:bg-gray-100 transition-colors"
          >
            ✕
          </button>
        </div>

        <div className="space-y-4">
          {/* Status Filter */}
          <div>
            <label className="block text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-2">
              Status Filter
            </label>
            <div className="flex gap-2">
              {statuses.map((st) => {
                const isActive = (statusFilter || 'ALL').toUpperCase() === st;
                return (
                  <button
                    key={st}
                    onClick={() => onStatusChange(st === 'ALL' ? '' : st)}
                    className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                      isActive
                        ? 'bg-black text-white shadow-xs'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {st}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Country Filter */}
          <div>
            <label className="block text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-2">
              Manufacturer Country
            </label>
            <div className="grid grid-cols-3 gap-2">
              {countries.map((c) => {
                const isSelected = (countryFilter || 'ALL') === c;
                return (
                  <button
                    key={c}
                    onClick={() => onCountryChange(c === 'ALL' ? '' : c)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-semibold text-center transition-all cursor-pointer truncate ${
                      isSelected
                        ? 'bg-black text-white shadow-xs'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {c}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-between pt-5 mt-4 border-t border-gray-100">
          <button
            onClick={onResetFilters}
            className="text-xs font-bold text-gray-500 hover:text-gray-900 transition-colors cursor-pointer"
          >
            Reset Filters
          </button>
          <button
            onClick={onClose}
            className="px-5 py-2 bg-black hover:bg-gray-800 text-white text-xs font-bold rounded-xl transition-all shadow-xs cursor-pointer"
          >
            Apply Filters
          </button>
        </div>
      </div>
    </div>
  );
}
