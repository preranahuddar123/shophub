'use client';

import { useState, useMemo } from 'react';
import Sidebar from '@/components/layout/Sidebar';
import TopHeader from '@/components/layout/TopHeader';
import OfferingFilters from '@/components/offerings/OfferingFilters';
import OfferingTable from '@/components/offerings/OfferingTable';
import Pagination from '@/components/offerings/Pagination';
import CatalogHealthBanner from '@/components/offerings/CatalogHealthBanner';
import { mockOfferings } from '@/lib/mockData';
import { FilterState } from '@/lib/types';

const ITEMS_PER_PAGE = 10;
const TOTAL_ITEMS = 128; // Mock total for pagination

export default function OfferingsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [filters, setFilters] = useState<FilterState>({
    category: 'All',
    type: 'Any',
    status: 'Active',
    vendor: 'All',
    stock: 'Any Status',
    search: '',
  });

  // Filter offerings based on search and filters
  const filteredOfferings = useMemo(() => {
    return mockOfferings.filter((offering) => {
      // Search filter
      const matchesSearch =
        searchQuery === '' ||
        offering.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        offering.sku.toLowerCase().includes(searchQuery.toLowerCase()) ||
        offering.category.toLowerCase().includes(searchQuery.toLowerCase());

      // Category filter
      const matchesCategory =
        filters.category === 'All' || offering.category === filters.category;

      // Type filter
      const matchesType =
        filters.type === 'Any' || offering.type === filters.type;

      // Status filter
      const matchesStatus = offering.status === filters.status;

      // Vendor filter
      const matchesVendor =
        filters.vendor === 'All' || offering.vendor === filters.vendor;

      // Stock filter
      const matchesStock =
        filters.stock === 'Any Status' || offering.stockLevel === filters.stock;

      return (
        matchesSearch &&
        matchesCategory &&
        matchesType &&
        matchesStatus &&
        matchesVendor &&
        matchesStock
      );
    });
  }, [searchQuery, filters]);

  // Pagination - use mock total of 128 items
  const totalPages = Math.ceil(TOTAL_ITEMS / ITEMS_PER_PAGE);
  const paginatedOfferings = filteredOfferings;

  // Reset to page 1 when filters change
  const handleFilterChange = (key: keyof FilterState, value: string) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
    setCurrentPage(1);
  };

  const handleClearAll = () => {
    setFilters({
      category: 'All',
      type: 'Any',
      status: 'Active',
      vendor: 'All',
      stock: 'Any Status',
      search: '',
    });
    setCurrentPage(1);
  };

  const handleSearchChange = (query: string) => {
    setSearchQuery(query);
    setCurrentPage(1);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar />
      <TopHeader searchQuery={searchQuery} onSearchChange={handleSearchChange} />

      {/* Main Content */}
      <main className="ml-56 pt-16">
        <div className="p-6">
          {/* Page Header */}
          <div className="mb-6">
            <div className="text-[10px] font-semibold text-gray-500 uppercase tracking-wider mb-2">
              MASTER CATALOG
            </div>
            <div className="flex items-center justify-between mb-4">
              <h1 className="text-3xl font-bold text-gray-900">All Offerings</h1>
              <div className="flex items-center gap-2">
                {/* View Toggle */}
                <div className="flex items-center border border-gray-300 rounded overflow-hidden">
                  <button className="p-2 bg-gray-100 border-r border-gray-300 hover:bg-gray-200 transition-colors">
                    <svg
                      className="h-4 w-4 text-gray-700"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M4 6h16M4 10h16M4 14h16M4 18h16"
                      />
                    </svg>
                  </button>
                  <button className="p-2 hover:bg-gray-100 transition-colors">
                    <svg
                      className="h-4 w-4 text-gray-500"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"
                      />
                    </svg>
                  </button>
                  <button className="p-2 hover:bg-gray-100 transition-colors">
                    <svg
                      className="h-4 w-4 text-gray-500"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                      />
                    </svg>
                  </button>
                </div>

                {/* Export Button */}
                <button className="flex items-center gap-2 px-3 py-2 border border-gray-300 rounded text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors">
                  <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  Export
                </button>

                {/* Import Button */}
                <button className="flex items-center gap-2 px-3 py-2 border border-gray-300 rounded text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors">
                  <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                  </svg>
                  Import
                </button>
              </div>
            </div>
          </div>

          {/* Filters */}
          <OfferingFilters
            filters={filters}
            onFilterChange={handleFilterChange}
            onClearAll={handleClearAll}
          />

          {/* Table */}
          <div className="mt-6">
            <OfferingTable offerings={paginatedOfferings} />
          </div>

          {/* Pagination */}
          {filteredOfferings.length > 0 && (
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              totalItems={TOTAL_ITEMS}
              itemsPerPage={ITEMS_PER_PAGE}
              onPageChange={setCurrentPage}
            />
          )}

          {/* Catalog Health Banner */}
          <CatalogHealthBanner />

          {/* View Reports Link */}
          <div className="mt-6 mb-8">
            <button className="text-sm font-medium text-gray-700 hover:text-gray-900 transition-colors uppercase tracking-wide">
              VIEW REPORTS
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}
