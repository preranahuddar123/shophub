'use client';

import { useAppDispatch, useAppSelector } from '@/lib/store/hooks';
import {
  setCategoryType,
  fetchMainCategories,
  selectMainCategoryThunk,
  clearMainCategorySelection,
  selectSubOrProduct,
} from '@/lib/store/slices/categoriesSlice';
import { setFilter, resetFilters } from '@/lib/store/slices/filtersSlice';
import { fetchBackendOfferings } from '@/lib/store/slices/offeringsSlice';
import { CategoryType } from '@/lib/types';
import { PrimaryCategory, SecondaryCategory } from '@/lib/types/api.types';

const CATEGORY_OPTIONS: { value: CategoryType; label: string }[] = [
  { value: 'all', label: 'All' },
  { value: 'primary', label: 'Primary Category' },
  { value: 'secondary', label: 'Secondary Category' },
];

const TYPE_OPTIONS = ['All', 'Product', 'Service'];
const STATUS_OPTIONS = ['All', 'Active', 'Draft'];
const STOCK_OPTIONS = ['Any Status', 'In Stock', 'Low Stock', 'Pre-order', 'Unlimited'];

export default function OfferingFilters() {
  const dispatch = useAppDispatch();
  const filters = useAppSelector((state) => state.filters);
  const categories = useAppSelector((state) => state.categories);
  const offeringsState = useAppSelector((state) => state.offerings);

  const {
    categoryType,
    mainCategories,
    selectedMainCategoryId,
    subOrProductItems,
    selectedSubOrProductId,
    isLoading: isCategoryLoading,
  } = categories;

  // Extract unique offering categories dynamically (e.g. LIGHTING)
  const uniqueOfferingCategories = Array.from(
    new Set(offeringsState.offerings.map((o) => o.category).filter(Boolean))
  );
  const offeringCategoryOptions = ['All', ...uniqueOfferingCategories];

  // Extract unique vendors dynamically
  const uniqueVendors = Array.from(
    new Set(offeringsState.offerings.map((o) => o.vendor).filter(Boolean))
  );
  const vendorOptions = ['All', ...uniqueVendors];

  // Handle Category Type change
  const handleCategoryTypeChange = (newType: CategoryType) => {
    dispatch(setCategoryType(newType));
    dispatch(setFilter({ key: 'category', value: newType }));

    if (newType === 'primary' || newType === 'secondary') {
      dispatch(fetchMainCategories(newType));
    } else {
      dispatch(fetchBackendOfferings({ page: 1, size: offeringsState.pageSize }));
    }
  };

  // Handle Main Category selection
  const handleMainCategoryChange = (categoryId: string) => {
    if (!categoryId || categoryId === 'all') {
      dispatch(clearMainCategorySelection());
      if (categoryType === 'primary' || categoryType === 'secondary') {
        dispatch(fetchMainCategories(categoryType));
      }
    } else {
      dispatch(
        selectMainCategoryThunk({
          categoryId,
          categoryType: categoryType as 'primary' | 'secondary',
        })
      );
    }
  };

  // Handle Sub Category / Product selection
  const handleSubOrProductChange = (itemId: string) => {
    dispatch(selectSubOrProduct(itemId === 'all' ? null : itemId));
  };

  // Handle Clear All
  const handleClearAll = () => {
    dispatch(resetFilters());
    dispatch(setCategoryType('all'));
    dispatch(fetchBackendOfferings({ page: 1, size: offeringsState.pageSize }));
  };

  // Helper to get category name
  const getMainCategoryName = (cat: PrimaryCategory | SecondaryCategory): string => {
    return (
      (cat as PrimaryCategory).primaryCategoryName ||
      (cat as SecondaryCategory).secondaryCategoryName ||
      'Unnamed Category'
    );
  };

  const getMainCategoryId = (cat: PrimaryCategory | SecondaryCategory): string => {
    return String(
      (cat as PrimaryCategory).primaryCategoryId ??
      (cat as SecondaryCategory).secondaryCategoryId
    );
  };

  return (
    <div className="bg-white border-b border-gray-200 px-6 py-3">
      <div className="flex items-center gap-4 flex-wrap">
        {/* 1. CATEGORY TYPE */}
        <div className="flex items-center gap-2">
          <label className="text-xs font-medium text-gray-500 uppercase">Category Type:</label>
          <select
            value={categoryType}
            onChange={(e) => handleCategoryTypeChange(e.target.value as CategoryType)}
            disabled={isCategoryLoading}
            className="pl-3 pr-8 py-1.5 border border-gray-300 rounded text-sm focus:outline-none focus:ring-1 focus:ring-gray-400 focus:border-gray-400 bg-white disabled:bg-gray-100 disabled:cursor-not-allowed"
          >
            {CATEGORY_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        {/* 2. MAIN CATEGORY Partition */}
        {(categoryType === 'primary' || categoryType === 'secondary') && (
          <div className="flex items-center gap-2">
            <label className="text-xs font-medium text-gray-500 uppercase">Main Category:</label>
            <select
              value={selectedMainCategoryId || 'all'}
              onChange={(e) => handleMainCategoryChange(e.target.value)}
              disabled={isCategoryLoading}
              className="pl-3 pr-8 py-1.5 border border-gray-300 rounded text-sm focus:outline-none focus:ring-1 focus:ring-gray-400 focus:border-gray-400 bg-white disabled:bg-gray-100 disabled:cursor-not-allowed"
            >
              <option value="all">
                {categoryType === 'primary' ? 'All Primary Categories' : 'All Secondary Categories'}
              </option>
              {mainCategories.map((cat) => {
                const id = getMainCategoryId(cat);
                const name = getMainCategoryName(cat);
                return (
                  <option key={id} value={id}>
                    {name}
                  </option>
                );
              })}
            </select>
          </div>
        )}

        {/* 3. SUB CATEGORY / PRODUCT Partition */}
        {selectedMainCategoryId && subOrProductItems.length > 0 && (
          <div className="flex items-center gap-2">
            <label className="text-xs font-medium text-gray-500 uppercase">
              Sub Category / Product:
            </label>
            <select
              value={selectedSubOrProductId || 'all'}
              onChange={(e) => handleSubOrProductChange(e.target.value)}
              disabled={isCategoryLoading}
              className="pl-3 pr-8 py-1.5 border border-gray-300 rounded text-sm focus:outline-none focus:ring-1 focus:ring-gray-400 focus:border-gray-400 bg-white disabled:bg-gray-100 disabled:cursor-not-allowed"
            >
              <option value="all">All</option>
              {subOrProductItems.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.name}
                </option>
              ))}
            </select>
          </div>
        )}

        {/* 4. PRODUCT CATEGORY Filter (Separate, e.g. LIGHTING) */}
        <div className="flex items-center gap-2">
          <label className="text-xs font-medium text-gray-500 uppercase">Category:</label>
          <select
            value={filters.offeringCategory}
            onChange={(e) =>
              dispatch(setFilter({ key: 'offeringCategory', value: e.target.value }))
            }
            className="pl-3 pr-8 py-1.5 border border-gray-300 rounded text-sm focus:outline-none focus:ring-1 focus:ring-gray-400 focus:border-gray-400 bg-white"
          >
            {offeringCategoryOptions.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
        </div>

        {/* 5. TYPE Filter */}
        <div className="flex items-center gap-2">
          <label className="text-xs font-medium text-gray-500 uppercase">Type:</label>
          <select
            value={filters.type}
            onChange={(e) => dispatch(setFilter({ key: 'type', value: e.target.value }))}
            className="pl-3 pr-8 py-1.5 border border-gray-300 rounded text-sm focus:outline-none focus:ring-1 focus:ring-gray-400 focus:border-gray-400 bg-white"
          >
            {TYPE_OPTIONS.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>
        </div>

        {/* 6. STATUS Filter */}
        <div className="flex items-center gap-2">
          <label className="text-xs font-medium text-gray-500 uppercase">Status:</label>
          <select
            value={filters.status}
            onChange={(e) => dispatch(setFilter({ key: 'status', value: e.target.value }))}
            className="pl-3 pr-8 py-1.5 border border-gray-300 rounded text-sm focus:outline-none focus:ring-1 focus:ring-gray-400 focus:border-gray-400 bg-white"
          >
            {STATUS_OPTIONS.map((status) => (
              <option key={status} value={status}>
                {status}
              </option>
            ))}
          </select>
        </div>

        {/* 7. VENDOR Filter */}
        <div className="flex items-center gap-2">
          <label className="text-xs font-medium text-gray-500 uppercase">Vendor:</label>
          <select
            value={filters.vendor}
            onChange={(e) => dispatch(setFilter({ key: 'vendor', value: e.target.value }))}
            className="pl-3 pr-8 py-1.5 border border-gray-300 rounded text-sm focus:outline-none focus:ring-1 focus:ring-gray-400 focus:border-gray-400 bg-white"
          >
            {vendorOptions.map((vendor) => (
              <option key={vendor} value={vendor}>
                {vendor}
              </option>
            ))}
          </select>
        </div>

        {/* 8. STOCK Filter */}
        <div className="flex items-center gap-2">
          <label className="text-xs font-medium text-gray-500 uppercase">Stock:</label>
          <select
            value={filters.stock}
            onChange={(e) => dispatch(setFilter({ key: 'stock', value: e.target.value }))}
            className="pl-3 pr-8 py-1.5 border border-gray-300 rounded text-sm focus:outline-none focus:ring-1 focus:ring-gray-400 focus:border-gray-400 bg-white"
          >
            {STOCK_OPTIONS.map((level) => (
              <option key={level} value={level}>
                {level}
              </option>
            ))}
          </select>

          {/* Clear Filters Button */}
          <button
            onClick={handleClearAll}
            title="Clear all filters"
            className="p-1.5 border border-gray-300 rounded hover:bg-red-50 hover:border-red-300 transition-colors"
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
          onClick={handleClearAll}
          className="text-sm text-blue-600 hover:text-blue-700 font-medium transition-colors ml-auto"
        >
          Clear All
        </button>

        {/* Loading Indicator */}
        {isCategoryLoading && (
          <span className="text-xs text-blue-600 font-medium animate-pulse">Loading...</span>
        )}
      </div>
    </div>
  );
}