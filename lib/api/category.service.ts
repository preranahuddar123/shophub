import apiClient from './axios-instance';
import {
  PrimaryCategory,
  SecondaryCategory,
} from '../types/api.types';
import { DUMMY_PRODUCTS } from './product.service';

export const DUMMY_PRIMARY_CATEGORIES: PrimaryCategory[] = [
  {
    primaryCategoryId: 1,
    primaryCategoryName: 'Furniture',
    primaryCategoryDescription: 'Modern corporate and executive furniture',
    subCategory: [
      {
        secondaryCategoryId: 101,
        secondaryCategoryName: 'Lounge Seating',
        secondaryCategoryDescription: 'Executive and reception lounge chairs',
        products: [DUMMY_PRODUCTS[0] as any],
      },
      {
        secondaryCategoryId: 102,
        secondaryCategoryName: 'Task Chairs',
        secondaryCategoryDescription: 'Ergonomic work chairs',
        products: [DUMMY_PRODUCTS[1] as any],
      },
    ],
    products: [DUMMY_PRODUCTS[0], DUMMY_PRODUCTS[1], DUMMY_PRODUCTS[3]] as any,
  },
  {
    primaryCategoryId: 2,
    primaryCategoryName: 'Lighting',
    primaryCategoryDescription: 'Architectural and task illumination',
    subCategory: [
      {
        secondaryCategoryId: 201,
        secondaryCategoryName: 'Desk Lighting',
        secondaryCategoryDescription: 'Precision balanced task lamps',
        products: [DUMMY_PRODUCTS[2] as any],
      },
    ],
    products: [DUMMY_PRODUCTS[2]] as any,
  },
  {
    primaryCategoryId: 3,
    primaryCategoryName: 'Services',
    primaryCategoryDescription: 'Professional workplace consulting and setup',
    subCategory: [
      {
        secondaryCategoryId: 301,
        secondaryCategoryName: 'Ergonomic Calibration',
        secondaryCategoryDescription: 'On-site workstation setup',
        products: [DUMMY_PRODUCTS[4] as any],
      },
    ],
    products: [DUMMY_PRODUCTS[4]] as any,
  },
];

export const DUMMY_SECONDARY_CATEGORIES: SecondaryCategory[] = [
  {
    secondaryCategoryId: 101,
    secondaryCategoryName: 'Lounge Seating',
    secondaryCategoryDescription: 'Executive and reception lounge chairs',
    products: [DUMMY_PRODUCTS[0] as any],
  },
  {
    secondaryCategoryId: 102,
    secondaryCategoryName: 'Task Chairs',
    secondaryCategoryDescription: 'Ergonomic work chairs',
    products: [DUMMY_PRODUCTS[1] as any],
  },
  {
    secondaryCategoryId: 201,
    secondaryCategoryName: 'Desk Lighting',
    secondaryCategoryDescription: 'Precision balanced task lamps',
    products: [DUMMY_PRODUCTS[2] as any],
  },
  {
    secondaryCategoryId: 301,
    secondaryCategoryName: 'Ergonomic Calibration',
    secondaryCategoryDescription: 'On-site workstation setup',
    products: [DUMMY_PRODUCTS[4] as any],
  },
];

/**
 * Fetch all primary categories
 * GET /api/v1/categories/getAllCategories
 */
export const getAllPrimaryCategories = async (): Promise<PrimaryCategory[]> => {
  try {
    const response = await apiClient.get<PrimaryCategory[]>('/categories/getAllCategories');
    if (response.data && Array.isArray(response.data)) {
      return response.data;
    }
  } catch (error: any) {
    console.warn('[category.service] getAllPrimaryCategories failed, fallback to mock:', error.message);
  }
  return DUMMY_PRIMARY_CATEGORIES;
};

/**
 * Fetch one primary category by ID
 * GET /api/v1/categories/getCategory/{primaryCategoryId}
 */
export const getPrimaryCategoryById = async (
  primaryCategoryId: string | number
): Promise<PrimaryCategory | null> => {
  try {
    const response = await apiClient.get<PrimaryCategory>(`/categories/getCategory/${primaryCategoryId}`);
    if (response.data) {
      return response.data;
    }
  } catch (error: any) {
    console.warn(`[category.service] getCategory(${primaryCategoryId}) failed, fallback to mock:`, error.message);
  }

  const found = DUMMY_PRIMARY_CATEGORIES.find(
    (c) => String(c.primaryCategoryId) === String(primaryCategoryId)
  );
  return found || DUMMY_PRIMARY_CATEGORIES[0];
};

/**
 * Fetch all secondary categories
 * GET /api/v1/secondary-categories/getAllCategories
 */
export const getAllSecondaryCategories = async (): Promise<SecondaryCategory[]> => {
  try {
    const response = await apiClient.get<SecondaryCategory[]>('/secondary-categories/getAllCategories');
    if (response.data && Array.isArray(response.data)) {
      return response.data;
    }
  } catch (error: any) {
    console.warn('[category.service] getAllSecondaryCategories failed, fallback to mock:', error.message);
  }
  return DUMMY_SECONDARY_CATEGORIES;
};

/**
 * Fetch secondary categories by primary category ID
 * GET /api/v1/secondary-categories/getCategoriesByPrimary/{primaryCategoryId}
 */
export const getCategoriesByPrimary = async (
  primaryCategoryId: string | number
): Promise<SecondaryCategory[]> => {
  try {
    const response = await apiClient.get<SecondaryCategory[]>(
      `/secondary-categories/getCategoriesByPrimary/${primaryCategoryId}`
    );
    if (response.data && Array.isArray(response.data)) {
      return response.data;
    }
  } catch (error: any) {
    console.warn(
      `[category.service] getCategoriesByPrimary(${primaryCategoryId}) failed, fallback to mock:`,
      error.message
    );
  }

  const primary = DUMMY_PRIMARY_CATEGORIES.find(
    (c) => String(c.primaryCategoryId) === String(primaryCategoryId)
  );
  return (primary?.subCategory as SecondaryCategory[]) || DUMMY_SECONDARY_CATEGORIES;
};

/**
 * Fetch one secondary category by ID
 * GET /api/v1/secondary-categories/getCategory/{secondaryCategoryId}
 */
export const getSecondaryCategoryById = async (
  secondaryCategoryId: string | number
): Promise<SecondaryCategory | null> => {
  try {
    const response = await apiClient.get<SecondaryCategory>(
      `/secondary-categories/getCategory/${secondaryCategoryId}`
    );
    if (response.data) {
      return response.data;
    }
  } catch (error: any) {
    console.warn(
      `[category.service] getSecondaryCategoryById(${secondaryCategoryId}) failed, fallback to mock:`,
      error.message
    );
  }

  const found = DUMMY_SECONDARY_CATEGORIES.find(
    (c) => String(c.secondaryCategoryId) === String(secondaryCategoryId)
  );
  return found || DUMMY_SECONDARY_CATEGORIES[0];
};

export const createPrimaryCategory = async (payload: any): Promise<PrimaryCategory> => {
  const newCat: PrimaryCategory = {
    primaryCategoryId: Date.now(),
    primaryCategoryName: payload.primaryCategoryName || 'New Primary Category',
    primaryCategoryDescription: payload.primaryCategoryDescription,
  };
  DUMMY_PRIMARY_CATEGORIES.push(newCat);
  return newCat;
};

export const createSecondaryCategory = async (payload: any): Promise<SecondaryCategory> => {
  const newCat: SecondaryCategory = {
    secondaryCategoryId: Date.now(),
    secondaryCategoryName: payload.secondaryCategoryName || 'New Secondary Category',
    secondaryCategoryDescription: payload.secondaryCategoryDescription,
  };
  DUMMY_SECONDARY_CATEGORIES.push(newCat);
  return newCat;
};

export const updatePrimaryCategory = async (
  id: string | number,
  payload: any
): Promise<PrimaryCategory> => {
  return {
    primaryCategoryId: id,
    primaryCategoryName: payload.primaryCategoryName,
    primaryCategoryDescription: payload.primaryCategoryDescription,
  };
};

export const updateSecondaryCategory = async (
  id: string | number,
  payload: any
): Promise<SecondaryCategory> => {
  return {
    secondaryCategoryId: id,
    secondaryCategoryName: payload.secondaryCategoryName,
    secondaryCategoryDescription: payload.secondaryCategoryDescription,
  };
};

export const deletePrimaryCategory = async (_id: string | number): Promise<void> => {
  return;
};

export const deleteSecondaryCategory = async (_id: string | number): Promise<void> => {
  return;
};
