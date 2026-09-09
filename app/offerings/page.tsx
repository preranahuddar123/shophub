'use client';

import { useEffect } from 'react';
import Sidebar from '@/components/layout/Sidebar';
import TopHeader from '@/components/layout/TopHeader';
import OfferingFilters from '@/components/offerings/OfferingFilters';
import OfferingTable from '@/components/offerings/OfferingTable';
import Pagination from '@/components/offerings/Pagination';
import {
  useAppDispatch,
  useAppSelector,
} from '@/lib/store/hooks';
import {
  performSearch,
  fetchFilterOptions,
  setSearchQuery,
  setFilters,
  setPagination,
  selectOfferings,
  selectFilterOptions,
  selectSearchQuery,
  selectFilters,
  selectPagination,
  selectIsLoading,
  selectError,
  clearError,
} from '@/lib/store/offerings/offeringsSlice';
import { FilterRequest, PaginationRequest } from '@/lib/types/api/request.types';
import { FilterOptionsResponse } from '@/lib/types/api/response.types';

const ITEMS_PER_PAGE = 10;

/**
 * Offerings Page Component
 * 
 * Responsibilities:
 * - Page layout and composition (Sidebar, TopHeader, main content)
 * - Connect to Redux store
 * - Defer all business logic to Redux thunks and selectors
 * 
 * Does NOT:
 * - Contain filtering/searching logic (delegated to Redux)
 * - Contain pagination calculation logic (delegated to Redux)
 * - Contain API implementation (delegated to Redux thunks)
 */
export default function OfferingsPage() {
  const dispatch = useAppDispatch();
  
  // State selectors (from Redux store)
  const offerings = useAppSelector(selectOfferings);
  const filterOptions = useAppSelector(selectFilterOptions) as FilterOptionsResponse | null;
  const searchQuery = useAppSelector(selectSearchQuery);
  const filters = useAppSelector(selectFilters);
  const pagination = useAppSelector(selectPagination);
  const isLoading = useAppSelector(selectIsLoading);
  const error = useAppSelector(selectError);

  // ============================================================================
  // LIFECYCLE - Load initial data on mount
  // ============================================================================

  useEffect(() => {
    // Fetch filter options on mount
    dispatch(fetchFilterOptions());
    
    // Load initial offerings (all, no search)
    dispatch(
      performSearch({
        query: '',
        filters: {},
        pagination: { page: 1, size: ITEMS_PER_PAGE },
      })
    );
  }, [dispatch]);

  // ============================================================================
  // EVENT HANDLERS - Dispatch Redux actions
  // ============================================================================

  const handleSearch = (query: string) => {
    dispatch(setSearchQuery(query));
    dispatch(
      performSearch({
        query,
        filters: filters || {},
        pagination: pagination || { page: 1, size: ITEMS_PER_PAGE },
      })
    );
  };

  const handleFilterChange = (newFilters: FilterRequest) => {
    dispatch(setFilters(newFilters));
    dispatch(
      performSearch({
        query: searchQuery,
        filters: newFilters,
        pagination: pagination || { page: 1, size: ITEMS_PER_PAGE },
      })
    );
  };

  const handleClearAll = () => {
    dispatch(setFilters({}));
    dispatch(setSearchQuery(''));
    dispatch(
      performSearch({
        query: '',
        filters: {},
        pagination: { page: 1, size: ITEMS_PER_PAGE },
      })
    );
  };

  const handlePageChange = (page: number) => {
    const newPagination: PaginationRequest = {
      page,
      size: ITEMS_PER_PAGE,
    };
    dispatch(setPagination(newPagination));
    dispatch(
      performSearch({
        query: searchQuery,
        filters: filters || {},
        pagination: newPagination,
      })
    );
  };

  // ============================================================================
  // RENDER - Only handles layout and component composition
  // ============================================================================

  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar />
      <TopHeader onSearch={handleSearch} />

      {/* Main Content */}
      <main className="ml-56 pt-16">
        <div className="p-6">
          {/* Page Header */}
          <div className="mb-6">
            <div className="text-[10px] font-semibold text-gray-500 uppercase tracking-wider mb-2">
              MASTER CATALOG
            </div>
            <h1 className="text-3xl font-bold text-gray-900">All Offerings</h1>
          </div>

          {/* Filters Section */}
          <OfferingFilters
            filterOptions={filterOptions}
            filters={filters}
            onFilterChange={handleFilterChange}
            onClearFilters={handleClearAll}
            onClearAll={handleClearAll}
            isLoading={isLoading}
          />

          {/* Error State */}
          {error && (
            <div className="mt-4 bg-red-50 border border-red-200 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <svg className="h-5 w-5 text-red-600 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <p className="text-sm text-red-800">{error}</p>
                </div>
                <button
                  onClick={() => dispatch(clearError())}
                  className="text-sm text-red-600 hover:text-red-800 font-medium"
                >
                  Dismiss
                </button>
              </div>
            </div>
          )}

          {/* Loading State */}
          {isLoading && offerings.length === 0 && (
            <div className="mt-6 text-center py-12">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-gray-300 border-t-blue-600"></div>
              <p className="mt-4 text-sm text-gray-600">Loading offerings...</p>
            </div>
          )}

          {/* Empty State */}
          {!isLoading && offerings.length === 0 && !error && (
            <div className="mt-6 text-center py-12 bg-white rounded-lg border border-gray-200">
              <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
              </svg>
              <p className="mt-4 text-sm text-gray-600">No offerings found</p>
            </div>
          )}

          {/* Table */}
          {offerings.length > 0 && (
            <div className="mt-6">
              <OfferingTable offerings={offerings} isLoading={isLoading} />
            </div>
          )}

          {/* Pagination */}
          {offerings.length > 0 && (
            <Pagination
              currentPage={pagination.page}
              totalPages={pagination.totalPages}
              totalItems={pagination.total}
              itemsPerPage={pagination.size}
              onPageChange={handlePageChange}
              isLoading={isLoading}
            />
          )}
        </div>
      </main>
    </div>
  );
}
