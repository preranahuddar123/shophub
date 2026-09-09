'use client';

import { useState, useEffect, useCallback } from 'react';
import { getProductById } from '@/lib/api/product.service';
import {
  getPrimaryCategoryById,
  getSecondaryCategoryById,
  getCategoriesByPrimary,
} from '@/lib/api/category.service';
import { ProdDataResDTO } from '@/lib/types/dto.types';
import { PrimaryCategory, SecondaryCategory } from '@/lib/types/api.types';

// Category mapping helper if primaryCategoryId is not explicitly in product object
const CATEGORY_NAME_TO_ID: Record<string, number> = {
  FURNITURE: 1,
  LIGHTING: 2,
  SERVICES: 3,
};

export interface SingleOfferingState {
  product: ProdDataResDTO | null;
  primaryCategory: PrimaryCategory | null;
  secondaryCategories: SecondaryCategory[];
  currentSecondaryCategory: SecondaryCategory | null;
  isLoading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

export function useSingleOffering(prodId: string | number = 1): SingleOfferingState {
  const [product, setProduct] = useState<ProdDataResDTO | null>(null);
  const [primaryCategory, setPrimaryCategory] = useState<PrimaryCategory | null>(null);
  const [secondaryCategories, setSecondaryCategories] = useState<SecondaryCategory[]>([]);
  const [currentSecondaryCategory, setCurrentSecondaryCategory] = useState<SecondaryCategory | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      // 1. Fetch Product details: GET /api/v1/products/getProduct/{prodId}
      const prod = await getProductById(prodId);
      setProduct(prod);

      // Determine primaryCategoryId
      let primaryId: string | number =
        (prod as any)?.primaryCategory?.primaryCategoryId ||
        (prod as any)?.primaryCategoryId ||
        CATEGORY_NAME_TO_ID[String(prod?.category).toUpperCase()] ||
        1;

      // 2 & 3. In parallel, fetch primary category & its secondary categories:
      // GET /api/v1/categories/getCategory/{primaryCategoryId}
      // GET /api/v1/secondary-categories/getCategoriesByPrimary/{primaryCategoryId}
      const [primaryRes, subCatsRes] = await Promise.all([
        getPrimaryCategoryById(primaryId),
        getCategoriesByPrimary(primaryId),
      ]);

      setPrimaryCategory(primaryRes);
      setSecondaryCategories(subCatsRes || []);

      // 4. Fetch secondary category details if available:
      // GET /api/v1/secondary-categories/getCategory/{secondaryCategoryId}
      const secondaryId =
        (prod as any)?.secondaryCategoryId ||
        (prod as any)?.subCategoryId ||
        (subCatsRes && subCatsRes.length > 0 ? subCatsRes[0].secondaryCategoryId : null);

      if (secondaryId) {
        const secondaryRes = await getSecondaryCategoryById(secondaryId);
        setCurrentSecondaryCategory(secondaryRes);
      } else {
        setCurrentSecondaryCategory(null);
      }
    } catch (err: any) {
      console.error('[useSingleOffering] Error loading offering details:', err);
      setError(err?.message || 'Failed to load offering details');
    } finally {
      setIsLoading(false);
    }
  }, [prodId]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return {
    product,
    primaryCategory,
    secondaryCategories,
    currentSecondaryCategory,
    isLoading,
    error,
    refetch: fetchData,
  };
}
