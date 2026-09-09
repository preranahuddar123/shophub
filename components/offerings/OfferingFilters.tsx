'use client';

import React from 'react';
import { FilterRequest } from '@/types/api/request.types';
import { FilterOptionsResponse } from '@/types/api/response.types';

interface OfferingFiltersProps {
  filterOptions: FilterOptionsResponse | null;
  filters: FilterRequest;
  onFilterChange: (filters: Partial<FilterRequest>) => void;
  onClearFilters: () => void;
  onClearAll: () => void;
  isLoading?: boolean;
}

// Fallback options matching backend GlobalEnums if backend aggregation response is pending
const FALLBACK_CATEGORIES = [
  'FURNITURE',
  'DECOR',
  'LIGHTING',
  'BEDDING',
  'BATH',
  'KITCHEN',
  'OUTDOOR',
  'STORAGE',
  'RUGS',
  'WALL_ART',
  'OTHER',
];

const FALLBACK_TYPES = ['PRODUCT', 'SERVICE', 'BUNDLE'];

const FALLBACK_STATUSES = [
  'PUBLISHED',
  'DRAFT',
  'IN_REVIEW',
  'APPROVED',
  'SCHEDULED',
  'ARCHIVED',
  'DISCONTINUED',
];

const FALLBACK_VENDORS = [
  'VENDOR_A',
  'VENDOR_B',
  'VENDOR_C',
  'IN_HOUSE',
  'THIRD_PARTY',
  'IMPORTED',
];

const FALLBACK_STOCKS = [
  'In Stock',
  'Low Stock',
  'Out of Stock',
  'Pre-order',
  'Unlimited',
];

/**
 * OfferingFilters Component
 * Dynamic filter bar driven purely by backend filter-options
 * Preserves the exact original UI design
 */
export default function OfferingFilters({
  filterOptions,
  filters,
  onFilterChange,
  onClearFilters,
  onClearAll,
  isLoading = false,
}: OfferingFiltersProps) {
  const categoryOptions =
    filterOptions?.categories && filterOptions.categories.length > 0
      ? filterOptions.categories
      : FALLBACK_CATEGORIES;

  const typeOptions =
    filterOptions?.types && filterOptions.types.length > 0
      ? filterOptions.types
      : FALLBACK_TYPES;

  const statusOptions =
    filterOptions?.statuses && filterOptions.statuses.length > 0
      ? filterOptions.statuses
      : FALLBACK_STATUSES;

  const vendorOptions =
    filterOptions?.vendors && filterOptions.vendors.length > 0
      ? filterOptions.vendors
      : FALLBACK_VENDORS;

  const stockOptions =
    filterOptions?.stocks && filterOptions.stocks.length > 0
      ? filterOptions.stocks
      : FALLBACK_STOCKS;

  const selectedCategory = filters.categories?.[0] || 'all';
  const selectedType = filters.types?.[0] || 'all';
  const selectedStatus = filters.statuses?.[0] || 'all';
  const selectedVendor = filters.vendors?.[0] || 'all';
  const selectedStock = filters.stocks?.[0] || 'all';

  const handleCategoryChange = (val: string) => {
    onFilterChange({
      categories: val === 'all' ? [] : [val],
    });
  };

  const handleTypeChange = (val: string) => {
    onFilterChange({
      types: val === 'all' ? [] : [val],
    });
  };

  const handleStatusChange = (val: string) => {
    onFilterChange({
      statuses: val === 'all' ? [] : [val],
    });
  };

  const handleVendorChange = (val: string) => {
    onFilterChange({
      vendors: val === 'all' ? [] : [val],
    });
  };

  const handleStockChange = (val: string) => {
    onFilterChange({
      stocks: val === 'all' ? [] : [val],
    });
  };

  return (
    <div className="bg-white border-b border-gray-200 px-6 py-3">
      <div className="flex items-center gap-4 flex-wrap">
        {/* 1. CATEGORY Filter */}
        <div className="flex items-center gap-2">
          <label className="text-xs font-medium text-gray-500 uppercase">
            Category:
          </label>
          <select
            value={selectedCategory}
            onChange={(e) => handleCategoryChange(e.target.value)}
            disabled={isLoading}
            className="pl-3 pr-8 py-1.5 border border-gray-300 rounded text-sm focus:outline-none focus:ring-1 focus:ring-gray-400 focus:border-gray-400 bg-white disabled:bg-gray-100 disabled:cursor-not-allowed"
          >
            <option value="all">All</option>
            {categoryOptions.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>

        {/* 2. TYPE Filter */}
        <div className="flex items-center gap-2">
          <label className="text-xs font-medium text-gray-500 uppercase">
            Type:
          </label>
          <select
            value={selectedType}
            onChange={(e) => handleTypeChange(e.target.value)}
            disabled={isLoading}
            className="pl-3 pr-8 py-1.5 border border-gray-300 rounded text-sm focus:outline-none focus:ring-1 focus:ring-gray-400 focus:border-gray-400 bg-white disabled:bg-gray-100 disabled:cursor-not-allowed"
          >
            <option value="all">All</option>
            {typeOptions.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>
        </div>

        {/* 3. STATUS Filter */}
        <div className="flex items-center gap-2">
          <label className="text-xs font-medium text-gray-500 uppercase">
            Status:
          </label>
          <select
            value={selectedStatus}
            onChange={(e) => handleStatusChange(e.target.value)}
            disabled={isLoading}
            className="pl-3 pr-8 py-1.5 border border-gray-300 rounded text-sm focus:outline-none focus:ring-1 focus:ring-gray-400 focus:border-gray-400 bg-white disabled:bg-gray-100 disabled:cursor-not-allowed"
          >
            <option value="all">All</option>
            {statusOptions.map((status) => (
              <option key={status} value={status}>
                {status}
              </option>
            ))}
          </select>
        </div>

        {/* 4. VENDOR Filter */}
        <div className="flex items-center gap-2">
          <label className="text-xs font-medium text-gray-500 uppercase">
            Vendor:
          </label>
          <select
            value={selectedVendor}
            onChange={(e) => handleVendorChange(e.target.value)}
            disabled={isLoading}
            className="pl-3 pr-8 py-1.5 border border-gray-300 rounded text-sm focus:outline-none focus:ring-1 focus:ring-gray-400 focus:border-gray-400 bg-white disabled:bg-gray-100 disabled:cursor-not-allowed"
          >
            <option value="all">All</option>
            {vendorOptions.map((vendor) => (
              <option key={vendor} value={vendor}>
                {vendor}
              </option>
            ))}
          </select>
        </div>

        {/* 5. STOCK Filter */}
        <div className="flex items-center gap-2">
          <label className="text-xs font-medium text-gray-500 uppercase">
            Stock:
          </label>
          <select
            value={selectedStock}
            onChange={(e) => handleStockChange(e.target.value)}
            disabled={isLoading}
            className="pl-3 pr-8 py-1.5 border border-gray-300 rounded text-sm focus:outline-none focus:ring-1 focus:ring-gray-400 focus:border-gray-400 bg-white disabled:bg-gray-100 disabled:cursor-not-allowed"
          >
            <option value="all">All</option>
            {stockOptions.map((stock) => (
              <option key={stock} value={stock}>
                {stock}
              </option>
            ))}
          </select>

          {/* Clear Filters Button (Dustbin Icon) */}
          <button
            onClick={onClearFilters}
            disabled={isLoading}
            title="Clear all filters"
            className="p-1.5 border border-gray-300 rounded hover:bg-red-50 hover:border-red-300 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <svg
              className="h-4 w-4 text-red-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
              />
            </svg>
          </button>
        </div>

        {/* Clear All Link */}
        <button
          onClick={onClearAll}
          disabled={isLoading}
          className="text-sm text-blue-600 hover:text-blue-700 font-medium transition-colors ml-auto disabled:opacity-50"
        >
          Clear All
        </button>

        {/* Loading Indicator */}
        {isLoading && (
          <span className="text-xs text-blue-600 font-medium animate-pulse">
            Loading...
          </span>
        )}
      </div>
    </div>
  );
}
