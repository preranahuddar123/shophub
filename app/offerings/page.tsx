'use client';

import { useState, useEffect } from 'react';
import StoreProvider from '@/components/providers/StoreProvider';
import Sidebar from '@/components/layout/Sidebar';
import TopHeader from '@/components/layout/TopHeader';
import OfferingFilters from '@/components/offerings/OfferingFilters';
import OfferingTable from '@/components/offerings/OfferingTable';
import Pagination from '@/components/offerings/Pagination';
import { useAppDispatch, useAppSelector } from '@/lib/store/hooks';
import {
  fetchBackendOfferings,
  setCurrentPage,
  setHierarchyOfferings,
} from '@/lib/store/slices/offeringsSlice';
import { setSearch } from '@/lib/store/slices/filtersSlice';
import { Product } from '@/lib/types/api.types';

function OfferingsContent() {
  const dispatch = useAppDispatch();
  const { offerings, currentPage, pageSize, totalElements, totalPages, isLoading } =
    useAppSelector((state) => state.offerings);
  const categories = useAppSelector((state) => state.categories);
  const filters = useAppSelector((state) => state.filters);

  const [searchQuery, setSearchQuery] = useState('');

  // Initial load: fetch backend paginated products
  useEffect(() => {
    dispatch(fetchBackendOfferings({ page: 1, size: pageSize }));
  }, [dispatch, pageSize]);

  // Handle category hierarchy selection changes across the two partitions
  useEffect(() => {
    const {
      categoryType,
      selectedMainCategory,
      selectedSubOrProductItem,
      mainCategories,
    } = categories;

    if (categoryType === 'all') {
      // Handled by fetchBackendOfferings
      return;
    }

    // If a specific subcategory or product is selected in partition 2
    if (selectedSubOrProductItem) {
      if (selectedSubOrProductItem.type === 'product') {
        dispatch(
          setHierarchyOfferings({
            products: [selectedSubOrProductItem.data],
            parentName: selectedSubOrProductItem.name,
          })
        );
      } else if (selectedSubOrProductItem.type === 'subcategory') {
        const subData = selectedSubOrProductItem.data;
        const subProds = subData?.products || [];
        dispatch(
          setHierarchyOfferings({
            products: subProds,
            parentName: selectedSubOrProductItem.name,
          })
        );
      }
      return;
    }

    // If a Main Category is selected (and partition 2 is "All")
    if (selectedMainCategory) {
      const parentName =
        (selectedMainCategory as any).primaryCategoryName ||
        (selectedMainCategory as any).secondaryCategoryName ||
        '';

      const directProds = selectedMainCategory.products || [];
      const childSubs = selectedMainCategory.subCategory || [];

      const allProds: Product[] = [...directProds];
      childSubs.forEach((sub: any) => {
        if (sub.products) allProds.push(...sub.products);
      });

      dispatch(
        setHierarchyOfferings({
          products: allProds,
          parentName,
        })
      );
      return;
    }

    // If Category Type is set (primary or secondary) but no specific Main Category chosen
    if (mainCategories.length > 0) {
      const allProds: Product[] = [];
      mainCategories.forEach((cat) => {
        if (cat.products) allProds.push(...cat.products);
        if (cat.subCategory) {
          cat.subCategory.forEach((sub) => {
            if (sub.products) allProds.push(...sub.products);
          });
        }
      });
      dispatch(
        setHierarchyOfferings({
          products: allProds,
          parentName: categoryType === 'primary' ? 'Primary Category' : 'Secondary Category',
        })
      );
    }
  }, [categories, dispatch]);

  const handlePageChange = (newPage: number) => {
    dispatch(setCurrentPage(newPage));
    if (categories.categoryType === 'all') {
      dispatch(fetchBackendOfferings({ page: newPage, size: pageSize }));
    }
  };

  const handleSearchChange = (query: string) => {
    setSearchQuery(query);
    dispatch(setSearch(query));
  };

  // Filter offerings matching active filters
  const displayOfferings = offerings.filter((offering) => {
    if (filters.offeringCategory !== 'All' && offering.category !== filters.offeringCategory) {
      return false;
    }
    if (filters.type !== 'All' && offering.type !== filters.type) {
      return false;
    }
    if (filters.status !== 'All' && offering.status !== filters.status) {
      return false;
    }
    if (filters.vendor !== 'All' && offering.vendor !== filters.vendor) {
      return false;
    }
    if (filters.stock !== 'Any Status' && offering.stockLevel !== filters.stock) {
      return false;
    }
    if (
      searchQuery.trim() &&
      !offering.name.toLowerCase().includes(searchQuery.toLowerCase()) &&
      !offering.sku.toLowerCase().includes(searchQuery.toLowerCase())
    ) {
      return false;
    }
    return true;
  });

  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar />
      <TopHeader searchQuery={searchQuery} onSearchChange={handleSearchChange} />

      <main className="ml-56 pt-16">
        <div className="p-6">
          <div className="mb-6">
            <div className="text-[10px] font-semibold text-gray-500 uppercase tracking-wider mb-2">
              MASTER CATALOG
            </div>
            <div className="flex items-center justify-between mb-4">
              <h1 className="text-3xl font-bold text-gray-900">All Offerings</h1>
            </div>
          </div>

          <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden mb-6">
            <OfferingFilters />

            {isLoading ? (
              <div className="p-12 text-center text-gray-500 text-sm">
                <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mb-2"></div>
                <div>Loading offerings...</div>
              </div>
            ) : (
              <OfferingTable offerings={displayOfferings} />
            )}

            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              totalItems={totalElements}
              itemsPerPage={pageSize}
              onPageChange={handlePageChange}
            />
          </div>
        </div>
      </main>
    </div>
  );
}

export default function OfferingsPage() {
  return (
    <StoreProvider>
      <OfferingsContent />
    </StoreProvider>
  );
}
