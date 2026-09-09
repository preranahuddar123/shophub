'use client';

import { useEffect } from 'react';
import Sidebar from '@/components/layout/Sidebar';
import TopHeader from '@/components/layout/TopHeader';
import OfferingFilters from '@/components/offerings/OfferingFilters';
import OfferingTable from '@/components/offerings/OfferingTable';
import Pagination from '@/components/offerings/Pagination';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import {
  selectOfferings,
  selectFilterOptions,
  selectFilters,
  selectPagination,
  selectIsLoading,
  selectError,
} from '@/store/offerings/offeringsSelectors';
import {
  executeSearchThunk,
  fetchFilterOptionsThunk,
  handleSearchAction,
  handleFilterAction,
  handlePageAction,
  handleClearAllAction,
} from '@/store/offerings/offeringsThunks';
import { clearError } from '@/store/offerings/offeringsSlice';
import { FilterRequest } from '@/types/api/request.types';

/**
 * OfferingsPage Component
 * 
 * Responsibilities:
 * - Pure composition / container layer connecting UI to Redux
 * - Forwards user interactions (search, filter, pagination) to Redux actions/thunks
 * - Redux/thunk layer constructs and executes backend Elasticsearch requests
 * - Displays data returned from Elasticsearch backend
 * 
 * Zero client-side filtering algorithms or pagination computations.
 */
export default function OfferingsPage() {
  const dispatch = useAppDispatch();

  // Redux state selectors
  const offerings = useAppSelector(selectOfferings);
  const filterOptions = useAppSelector(selectFilterOptions);
  const filters = useAppSelector(selectFilters);
  const pagination = useAppSelector(selectPagination);
  const isLoading = useAppSelector(selectIsLoading);
  const error = useAppSelector(selectError);

  // Load filter options and initial offerings on component mount
  useEffect(() => {
    dispatch(fetchFilterOptionsThunk());
    dispatch(executeSearchThunk());
  }, [dispatch]);

  // Interaction handlers - update Redux and trigger backend requests
  const handleSearch = (query: string) => {
    dispatch(handleSearchAction(query));
  };

  const handleFilterChange = (newFilters: Partial<FilterRequest>) => {
    dispatch(handleFilterAction(newFilters));
  };

  const handleClearFilters = () => {
    dispatch(
      handleFilterAction({
        categories: [],
        types: [],
        statuses: [],
        vendors: [],
        stocks: [],
      })
    );
  };

  const handleClearAll = () => {
    dispatch(handleClearAllAction());
  };

  const handlePageChange = (page: number) => {
    dispatch(handlePageAction(page));
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar />
      <TopHeader onSearch={handleSearch} />

      {/* Main Content Area */}
      <main className="ml-56 pt-16">
        <div className="p-6">
          {/* Page Header */}
          <div className="mb-6">
            <div className="text-[10px] font-semibold text-gray-500 uppercase tracking-wider mb-2">
              MASTER CATALOG
            </div>
            <h1 className="text-3xl font-bold text-gray-900">All Offerings</h1>
          </div>

          {/* Dynamic Backend-Driven Filters */}
          <OfferingFilters
            filterOptions={filterOptions}
            filters={filters}
            onFilterChange={handleFilterChange}
            onClearFilters={handleClearFilters}
            onClearAll={handleClearAll}
            isLoading={isLoading}
          />

          {/* Error State */}
          {error && (
            <div className="mt-4 bg-red-50 border border-red-200 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <svg
                    className="h-5 w-5 text-red-600 flex-shrink-0"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  <p className="text-sm text-red-800">{error}</p>
                </div>
                <button
                  onClick={() => dispatch(clearError())}
                  className="text-sm text-red-600 hover:text-red-800 font-medium cursor-pointer"
                >
                  Dismiss
                </button>
              </div>
            </div>
          )}

          {/* Loading State */}
          {isLoading && offerings.length === 0 && (
            <div className="mt-6 text-center py-12">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-gray-300 border-t-black"></div>
              <p className="mt-4 text-sm text-gray-600">Loading offerings...</p>
            </div>
          )}

          {/* Empty State */}
          {!isLoading && offerings.length === 0 && !error && (
            <div className="mt-6 text-center py-12 bg-white rounded-lg border border-gray-200">
              <svg
                className="mx-auto h-12 w-12 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
                />
              </svg>
              <p className="mt-4 text-sm text-gray-600">No offerings found</p>
            </div>
          )}

          {/* Presentation Table */}
          {offerings.length > 0 && (
            <div className="mt-6">
              <OfferingTable offerings={offerings} isLoading={isLoading} />
            </div>
          )}

          {/* Presentation Pagination */}
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
