'use client';

import React, { useEffect } from 'react';
import Sidebar from '@/components/layout/Sidebar';
import TopHeader from '@/components/layout/TopHeader';
import OfferingTable from '@/components/offerings/OfferingTable';
import { useAppDispatch, useAppSelector } from '@/lib/store/hooks';
import {
  fetchMainCategories,
  selectDerivedOfferings,
  selectCategoriesLoading,
  selectCategoriesError,
} from '@/lib/store/slices/categoriesSlice';

export default function OfferingsPage() {
  const dispatch = useAppDispatch();

  // Redux selectors
  const allOfferings = useAppSelector(selectDerivedOfferings);
  const isLoading = useAppSelector(selectCategoriesLoading);
  const error = useAppSelector(selectCategoriesError);

  // ============================================================================
  // LIFECYCLE - Load initial data
  // ============================================================================

  useEffect(() => {
    dispatch(fetchMainCategories('primary'));
    dispatch(fetchMainCategories('secondary'));
  }, [dispatch]);

  return (
    <div className="min-h-screen bg-gray-50/50">
      <Sidebar />
      <TopHeader onSearch={() => {}} />

      {/* Main Content Area */}
      <main className="ml-56 pt-16">
        <div className="p-6">
          {/* ===================================================================== */}
          {/* MASTER CATALOG HEADER */}
          {/* ===================================================================== */}
          <div className="mb-6">
            <div className="text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-1">
              MASTER CATALOG
            </div>
            <h1 className="text-2xl font-bold text-gray-900 tracking-tight">
              All Offerings
            </h1>
          </div>

          {/* Error State */}
          {error && (
            <div className="mb-6 bg-red-50 border border-red-200 rounded-xl p-4">
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
            </div>
          )}

          {/* Loading State */}
          {isLoading && allOfferings.length === 0 && (
            <div className="text-center py-16 bg-white rounded-xl border border-gray-200 shadow-xs">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-gray-300 border-t-black"></div>
              <p className="mt-4 text-sm text-gray-600 font-medium">
                Loading offerings from catalog...
              </p>
            </div>
          )}

          {/* Empty State */}
          {!isLoading && allOfferings.length === 0 && !error && (
            <div className="text-center py-16 bg-white rounded-xl border border-gray-200 shadow-xs">
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
              <h3 className="mt-3 text-sm font-semibold text-gray-900">No offerings found</h3>
              <p className="mt-1 text-sm text-gray-500">
                No offerings match the current selection.
              </p>
            </div>
          )}

          {/* ===================================================================== */}
          {/* TABLE VIEW */}
          {/* ===================================================================== */}
          {allOfferings.length > 0 && (
            <OfferingTable offerings={allOfferings} isLoading={isLoading} />
          )}
        </div>
      </main>
    </div>
  );
}
