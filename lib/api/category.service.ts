import apiClient from './axios-instance';
import {
  PrimaryCategory,
  SecondaryCategory,
} from '../types/api.types';

/**
 * Fetch all primary categories directly from the database
 * GET /api/v1/categories/getAllCategories
 */
export const getAllPrimaryCategories = async (): Promise<PrimaryCategory[]> => {
  try {
    const response = await apiClient.get<PrimaryCategory[]>('/categories/getAllCategories');
    if (response.data && Array.isArray(response.data)) {
      return response.data;
    }
  } catch (error: any) {
    console.error('[category.service] getAllPrimaryCategories database query failed:', error.message);
  }
  return [];
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
    const response = await apiClient.get<SecondaryCategory[]>('/secondary-categories/getAllCategories');
    if (response.data && Array.isArray(response.data)) {
      return response.data;
    }
  } catch (error: any) {
    console.error('[category.service] getAllSecondaryCategories database query failed:', error.message);
  }
  return [];
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

export const createPrimaryCategory = async (payload: any): Promise<PrimaryCategory> => {
  try {
    const response = await apiClient.post<PrimaryCategory>('/categories/createCategory', payload);
    if (response.data) return response.data;
  } catch (error: any) {
    console.error('[category.service] createPrimaryCategory failed:', error.message);
  }
  return {
    primaryCategoryId: Date.now(),
    primaryCategoryName: payload.primaryCategoryName || 'New Primary Category',
    primaryCategoryDescription: payload.primaryCategoryDescription,
  };
};

export const createSecondaryCategory = async (payload: any): Promise<SecondaryCategory> => {
  try {
    const response = await apiClient.post<SecondaryCategory>('/secondary-categories/createCategory', payload);
    if (response.data) return response.data;
  } catch (error: any) {
    console.error('[category.service] createSecondaryCategory failed:', error.message);
  }
  return {
    secondaryCategoryId: Date.now(),
    secondaryCategoryName: payload.secondaryCategoryName || 'New Secondary Category',
    secondaryCategoryDescription: payload.secondaryCategoryDescription,
  };
};

export const updatePrimaryCategory = async (
  id: string | number,
  payload: any
): Promise<PrimaryCategory> => {
  try {
    const response = await apiClient.put<PrimaryCategory>(`/categories/updateCategory/${id}`, payload);
    if (response.data) return response.data;
  } catch (error: any) {
    console.error(`[category.service] updatePrimaryCategory(${id}) failed:`, error.message);
  }
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
  try {
    const response = await apiClient.put<SecondaryCategory>(`/secondary-categories/updateCategory/${id}`, payload);
    if (response.data) return response.data;
  } catch (error: any) {
    console.error(`[category.service] updateSecondaryCategory(${id}) failed:`, error.message);
  }
  return {
    secondaryCategoryId: id,
    secondaryCategoryName: payload.secondaryCategoryName,
    secondaryCategoryDescription: payload.secondaryCategoryDescription,
  };
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
