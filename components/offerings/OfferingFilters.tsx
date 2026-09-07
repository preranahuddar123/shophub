'use client';

import { FilterState } from '@/lib/types';
import { categories, types, statuses, vendors, stockLevels } from '@/lib/mockData';

interface OfferingFiltersProps {
  filters: FilterState;
  onFilterChange: (key: keyof FilterState, value: string) => void;
  onClearAll: () => void;
}

export default function OfferingFilters({
  filters,
  onFilterChange,
  onClearAll,
}: OfferingFiltersProps) {
  const hasActiveFilters =
    filters.category !== 'All' ||
    filters.type !== 'Any' ||
    filters.status !== 'Active' ||
    filters.vendor !== 'All' ||
    filters.stock !== 'Any Status';

  return (
    <div className="bg-white border-b border-gray-200 px-6 py-3">
      <div className="flex items-center gap-4 flex-wrap">
        {/* Category Filter */}
        <div className="flex items-center gap-2">
          <label className="text-xs font-medium text-gray-500 uppercase">Category:</label>
          <select
            value={filters.category}
            onChange={(e) => onFilterChange('category', e.target.value)}
            className="pl-3 pr-8 py-1.5 border border-gray-300 rounded text-sm focus:outline-none focus:ring-1 focus:ring-gray-400 focus:border-gray-400 bg-white"
          >
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>

        {/* Type Filter */}
        <div className="flex items-center gap-2">
          <label className="text-xs font-medium text-gray-500 uppercase">Type:</label>
          <select
            value={filters.type}
            onChange={(e) => onFilterChange('type', e.target.value)}
            className="pl-3 pr-8 py-1.5 border border-gray-300 rounded text-sm focus:outline-none focus:ring-1 focus:ring-gray-400 focus:border-gray-400 bg-white"
          >
            {types.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>
        </div>

        {/* Status Filter */}
        <div className="flex items-center gap-2">
          <label className="text-xs font-medium text-gray-500 uppercase">Status:</label>
          <select
            value={filters.status}
            onChange={(e) => onFilterChange('status', e.target.value)}
            className="pl-3 pr-8 py-1.5 border border-gray-300 rounded text-sm focus:outline-none focus:ring-1 focus:ring-gray-400 focus:border-gray-400 bg-white"
          >
            {statuses.map((status) => (
              <option key={status} value={status}>
                {status}
              </option>
            ))}
          </select>
        </div>

        {/* Vendor Filter */}
        <div className="flex items-center gap-2">
          <label className="text-xs font-medium text-gray-500 uppercase">Vendor:</label>
          <select
            value={filters.vendor}
            onChange={(e) => onFilterChange('vendor', e.target.value)}
            className="pl-3 pr-8 py-1.5 border border-gray-300 rounded text-sm focus:outline-none focus:ring-1 focus:ring-gray-400 focus:border-gray-400 bg-white"
          >
            {vendors.map((vendor) => (
              <option key={vendor} value={vendor}>
                {vendor}
              </option>
            ))}
          </select>
        </div>

        {/* Stock Filter */}
        <div className="flex items-center gap-2">
          <label className="text-xs font-medium text-gray-500 uppercase">Stock:</label>
          <select
            value={filters.stock}
            onChange={(e) => onFilterChange('stock', e.target.value)}
            className="pl-3 pr-8 py-1.5 border border-gray-300 rounded text-sm focus:outline-none focus:ring-1 focus:ring-gray-400 focus:border-gray-400 bg-white"
          >
            {stockLevels.map((level) => (
              <option key={level} value={level}>
                {level}
              </option>
            ))}
          </select>
        </div>

        {/* Clear All Link */}
        <button
          onClick={onClearAll}
          className="text-sm text-blue-600 hover:text-blue-700 font-medium transition-colors ml-auto"
        >
          Clear All
        </button>

        {/* Filter Icon Button */}
        <button className="p-1.5 border border-gray-300 rounded hover:bg-gray-50 transition-colors">
          <svg className="h-4 w-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
          </svg>
        </button>
      </div>
    </div>
  );
}
