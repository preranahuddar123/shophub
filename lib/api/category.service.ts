import apiClient from './axios-instance';
import {
  PrimaryCategory,
  SecondaryCategory,
  Product,
  ApiError,
} from '../types/api.types';

export type { PrimaryCategory, SecondaryCategory };

async function getLocalProducts(): Promise<Product[]> {
  try {
    const origin = typeof window !== 'undefined' ? window.location.origin : '';
    const response = await fetch(`${origin}/api/products?page=0&size=100`, { cache: 'no-store' });
    if (!response.ok) return [];
    const data = await response.json();
    return Array.isArray(data?.content) ? data.content : [];
  } catch {
    return [];
  }
}

function groupProductsByCategory(products: Product[]) {
  const groups = new Map<string, Product[]>();
  for (const product of products) {
    const name = String(product.category || 'GENERAL').toUpperCase();
    const list = groups.get(name) || [];
    list.push(product);
    groups.set(name, list);
  }
  return groups;
}

async function getCategoriesFromLocalProducts(kind: 'primary' | 'secondary') {
  const products = await getLocalProducts();
  if (products.length === 0) return [];
  const groups = groupProductsByCategory(products);
  return [...groups.entries()].map(([name, grouped], index) => {
    if (kind === 'primary') {
      return {
        primaryCategoryId: index + 1,
        primaryCategoryName: name,
        products: grouped,
      } as PrimaryCategory;
    }
    return {
      secondaryCategoryId: index + 1,
      secondaryCategoryName: name,
      products: grouped,
    } as SecondaryCategory;
  });
}

/**
 * Fetch all primary categories directly from the database
 * GET /api/v1/categories/getAllCategories
 */
export const getAllPrimaryCategories = async (): Promise<PrimaryCategory[]> => {
  try {
    const response = await apiClient.get<PrimaryCategory[]>('/categories/getAllCategories', {
      validateStatus: () => true,
    });
    if (response.status >= 200 && response.status < 300 && Array.isArray(response.data) && response.data.length > 0) {
      return response.data;
    }
  } catch {
    // Remote category API is down — use local catalog.
  }
  return getCategoriesFromLocalProducts('primary');
};

/**
 * Fetch one primary category by ID directly from the database
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
    console.error(`[category.service] getPrimaryCategoryById(${primaryCategoryId}) database query failed:`, error.message);
  }
  return null;
};

/**
 * Fetch all secondary categories directly from the database
 * GET /api/v1/secondary-categories/getAllCategories
 */
export const getAllSecondaryCategories = async (): Promise<SecondaryCategory[]> => {
  try {
    const response = await apiClient.get<SecondaryCategory[]>('/secondary-categories/getAllCategories', {
      validateStatus: () => true,
    });
    if (response.status >= 200 && response.status < 300 && Array.isArray(response.data) && response.data.length > 0) {
      return response.data;
    }
  } catch {
    // Remote category API is down — use local catalog.
  }
  return getCategoriesFromLocalProducts('secondary');
};

/**
 * Fetch secondary categories by primary category ID directly from the database
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
    console.error(
      `[category.service] getCategoriesByPrimary(${primaryCategoryId}) database query failed:`,
      error.message
    );
  }
  return [];
};

/**
 * Fetch one secondary category by ID directly from the database
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
    console.error(
      `[category.service] getSecondaryCategoryById(${secondaryCategoryId}) database query failed:`,
      error.message
    );
  }
  return null;
};

export const deletePrimaryCategory = async (id: string | number): Promise<void> => {
  try {
    await apiClient.delete(`/categories/deleteCategory/${id}`);
  } catch (error: any) {
    console.error(`[category.service] deletePrimaryCategory(${id}) failed:`, error.message);
  }
};

export const deleteSecondaryCategory = async (id: string | number): Promise<void> => {
  try {
    await apiClient.delete(`/secondary-categories/deleteCategory/${id}`);
  } catch (error: any) {
    console.error(`[category.service] deleteSecondaryCategory(${id}) failed:`, error.message);
  }
};

/**
 * Create a new primary category
 * POST /categories/createCategory
 */
export const createPrimaryCategory = async (data: {)
  primaryCategoryName: string;
  primaryCategoryDescription?: string;
  subCategory?: any[];
  products?: any[];
}): Promise<PrimaryCategory> => {
  try {
    const response = await apiClient.post('/categories/createCategory', {
      primaryCategoryName: data.primaryCategoryName,
      primaryCategoryDescription: data.primaryCategoryDescription || '',
      subCategory: data.subCategory || [],
      products: data.products || [],
    });
    return response.data;
  } catch (error: any) {
    const apiError: ApiError = {
      message: error.response?.data?.message || error.message || 'Failed to create primary category',
      status: error.response?.status,
      code: error.response?.data?.code,
    };
    throw apiError;
  }
};

/**
 * Update a primary category
 * PUT /categories/updateCategory/{id}
 */
export const updatePrimaryCategory = async (
  primaryCategoryId: number | string,
  data: {
    primaryCategoryName: string;
    primaryCategoryDescription?: string;
    subCategory?: any[];
    products?: any[];
  }
): Promise<PrimaryCategory> => {
  try {
    const response = await apiClient.put(`/categories/updateCategory/${primaryCategoryId}`, {
      primaryCategoryName: data.primaryCategoryName,
      primaryCategoryDescription: data.primaryCategoryDescription || '',
      subCategory: data.subCategory || [],
      products: data.products || [],
    });
    return response.data;
  } catch (error: any) {
    const apiError: ApiError = {
      message: error.response?.data?.message || error.message || 'Failed to update primary category',
      status: error.response?.status,
      code: error.response?.data?.code,
    };
    throw apiError;
  }
};

/**
 * Create a secondary category under a primary category
 * POST /secondary-categories/createCategory/{primaryCategoryId}
 */
export const createSecondaryCategory = async (
  primaryCategoryId: number | string,
  data: {
    secondaryCategoryName: string;
    secondaryCategoryDescription?: string;
    subCategory?: any[];
    products?: any[];
  }
): Promise<SecondaryCategory> => {
  try {
    const response = await apiClient.post(`/secondary-categories/createCategory/${primaryCategoryId}`, {
      secondaryCategoryName: data.secondaryCategoryName,
      secondaryCategoryDescription: data.secondaryCategoryDescription || '',
      subCategory: data.subCategory || [],
      products: data.products || [],
    });
    return response.data;
  } catch (error: any) {
    const apiError: ApiError = {
      message: error.response?.data?.message || error.message || 'Failed to create secondary category',
      status: error.response?.status,
      code: error.response?.data?.code,
    };
    throw apiError;
  }
};

/**
 * Create a sub-category under a parent secondary category
 * POST /secondary-categories/createSubCategory/{parentSecondaryCategoryId}
 */
export const createSubCategory = async (
  parentSecondaryCategoryId: number | string,
  data: {
    secondaryCategoryName: string;
    secondaryCategoryDescription?: string;
    subCategory?: any[];
    products?: any[];
  }
): Promise<SecondaryCategory> => {
  try {
    const response = await apiClient.post(
      `/secondary-categories/createSubCategory/${parentSecondaryCategoryId}`,
      {
        secondaryCategoryName: data.secondaryCategoryName,
        secondaryCategoryDescription: data.secondaryCategoryDescription || '',
        subCategory: data.subCategory || [],
        products: data.products || [],
      }
    );
    return response.data;
  } catch (error: any) {
    const apiError: ApiError = {
      message: error.response?.data?.message || error.message || 'Failed to create sub-category',
      status: error.response?.status,
      code: error.response?.data?.code,
    };
    throw apiError;
  }
};

/**
 * Update a secondary category
 * PUT /secondary-categories/updateCategory/{secondaryCategoryId}
 */
export const updateSecondaryCategory = async (
  secondaryCategoryId: number | string,
  data: {
    secondaryCategoryName: string;
    secondaryCategoryDescription?: string;
    subCategory?: any[];
    products?: any[];
  }
): Promise<SecondaryCategory> => {
  try {
    const response = await apiClient.put(
      `/secondary-categories/updateCategory/${secondaryCategoryId}`,
      {
        secondaryCategoryName: data.secondaryCategoryName,
        secondaryCategoryDescription: data.secondaryCategoryDescription || '',
        subCategory: data.subCategory || [],
        products: data.products || [],
      }
    );
    return response.data;
  } catch (error: any) {
    const apiError: ApiError = {
      message: error.response?.data?.message || error.message || 'Failed to update secondary category',
      status: error.response?.status,
      code: error.response?.data?.code,
    };
    throw apiError;
  }
};
